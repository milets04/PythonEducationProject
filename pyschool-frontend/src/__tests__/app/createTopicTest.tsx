/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTopic from '@/ui/components/organisms/createTopic';

// ======================================================
// 🔹 Mocks
// ======================================================


const mockRouter = { push: jest.fn(), back: jest.fn() };
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));


jest.mock('../../ui/components/organisms/createTopic', () => {
  const originalModule = jest.requireActual('../../ui/components/organisms/createTopic');
  return {
    ...originalModule,
    callCreateTopicApi: jest.fn(),
    __esModule: true,
    default: originalModule.default,
  };
});


function mockLocalStorageWith(value: unknown) {
  const mock = {
    getItem: jest.fn(() => (value ? JSON.stringify(value) : null)),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: mock });
  return mock;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ======================================================
// Tests
// ======================================================

describe(' CreateTopic UI', () => {
  it(' Renderiza correctamente cuando hay un tópico en localStorage', async () => {
    mockLocalStorageWith({ name: 'tipoco 2', unitId: 1, unitIndex: 1 });

    render(<CreateTopic />);

    expect(await screen.findByText('Create Topic')).toBeInTheDocument();
    expect(screen.getByText('tipoco 2')).toBeInTheDocument();
  });

  it(' Redirige a /teacherPages/edTeacher si no hay tópico guardado', async () => {
    mockLocalStorageWith(null);
    render(<CreateTopic />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/teacherPages/edTeacher');
    });
  });

  it(' Permite agregar un subtítulo y descripción', async () => {
    mockLocalStorageWith({ name: 'Topic Editable', unitId: 2, unitIndex: 1 });
    render(<CreateTopic />);

    const subtitleInput = await screen.findByPlaceholderText('Enter subtitle');
    const descInput = screen.getByPlaceholderText('Enter description');

    fireEvent.change(subtitleInput, { target: { value: 'Mi primer subtítulo' } });
    fireEvent.change(descInput, { target: { value: 'Descripción del subtítulo' } });

    expect(subtitleInput).toHaveValue('Mi primer subtítulo');
    expect(descInput).toHaveValue('Descripción del subtítulo');
  });

  it(' Agrega nuevas secciones al hacer clic en Add +', async () => {
    mockLocalStorageWith({ name: 'Topic con Add', unitId: 1, unitIndex: 1 });
    render(<CreateTopic />);

    const addButton = await screen.findByText('Add +');
    fireEvent.click(addButton);

    // Ahora deberían haber 2 campos "Subtitle"
    const subtitles = await screen.findAllByPlaceholderText('Enter subtitle');
    expect(subtitles.length).toBeGreaterThan(1);
  });

  // it(' Llama a la API correctamente al hacer clic en Save', async () => {
  //   mockLocalStorageWith({ name: 'Topic Save', unitId: 3, unitIndex: 1 });
  //   // (callCreateTopicApi as jest.Mock).mockResolvedValueOnce({ id: 99 });
  //   const callCreateTopicApi = jest.fn().mockResolvedValue({ success: true, message: 'Success' });

  //   render(<CreateTopic />);

  //   const subtitleInput = await screen.findByPlaceholderText('Enter subtitle');
  //   fireEvent.change(subtitleInput, { target: { value: 'Texto ejemplo' } });


  //   const saveButton = screen.getByRole('button', { name: /save/i });
  //   fireEvent.click(saveButton);

  //   await waitFor(() => {
  //     expect(callCreateTopicApi).toHaveBeenCalled();
  //   });

  //   expect(mockRouter.push).toHaveBeenCalledWith('/teacherPages/addContent');
  // });

  it(' Muestra error si no se agregan subtítulos ni contenido multimedia', async () => {
    mockLocalStorageWith({ name: 'Topic Error', unitId: 2, unitIndex: 1 });
    render(<CreateTopic />);

    // Sobrescribimos alert temporalmente
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const saveButton = await screen.findByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'You must add at least one subtitle or multimedia element'
      );
    });

    alertSpy.mockRestore();
  });

  it(' Cancela y redirige correctamente al presionar Cancel', async () => {
    const localStorageMock = mockLocalStorageWith({ name: 'Cancel Topic', unitId: 2, unitIndex: 1 });

    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<CreateTopic />);

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('newTopic');
    expect(mockRouter.push).toHaveBeenCalledWith('/teacherPages/addContent');
  });
});
