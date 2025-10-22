// __tests__/LoginContainer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginContainer from '@/ui/components/organisms/formSignin';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('LoginContainer', () => {
  it('realiza login exitoso y guarda token en localStorage', async () => {
    // Simula la respuesta de fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              token: 'fake-token',
              user: { role: 'admin' },
            },
            message: 'Login exitoso',
          }),
      })
    ) as jest.Mock;

    render(<LoginContainer />);

    // Completa los campos
    fireEvent.change(screen.getByPlaceholderText(/Enter your Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your Password/i), {
      target: { value: 'securepassword' },
    });

    // Envía el formulario
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('userRole')).toBe('admin');
      expect(window.location.href).toBe('/waitPage');
    });
  });
});