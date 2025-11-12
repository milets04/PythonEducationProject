import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logs from '@/ui/components/organisms/logs';

interface TopicVersion {
    id: number;
    createdAt: string; 
}



// Mock del router para verificar la navegación
const mockRouter = { push: jest.fn(), back: jest.fn(), prefetch: jest.fn() };
jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const mockVersions: TopicVersion[] = [
    { id: 101, createdAt: '2025-11-10T09:00:00Z' },
    { id: 102, createdAt: '2025-11-11T14:30:00Z' },
    { id: 103, createdAt: '2025-11-12T10:45:00Z' }, // Versión más actual
];
const mockTopicId = 55;

describe('TopicVersionLog', () => {

    it('debe renderizar la lista de versiones con la información correcta', () => {
        render(<Logs versions={mockVersions} />);

        // Verificar el título
        expect(screen.getByText('Historial')).toBeInTheDocument();

        // Verificar que cada versión sea un botón/link
        mockVersions.forEach(version => {
            const versionLink = screen.getByTestId(`version-link-${version.id}`);
            expect(versionLink).toBeInTheDocument();
            // Verificar el texto visible (incluye ID y timestamp)
            expect(versionLink).toHaveTextContent(`Versión ID: ${version.id}`);
        });
    });

    it('debe mostrar un mensaje si no hay versiones', () => {
        render(<Logs versions={mockVersions} />);
        
        expect(screen.getByText('No hay versiones anteriores.')).toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument(); // Asegurar que no se renderiza la lista
    });

    it('debe navegar a la ruta de versión específica al hacer clic', () => {
        render(<Logs versions={mockVersions}/>);
        
        const targetVersionId = 102;
        const targetLink = screen.getByTestId(`version-link-${targetVersionId}`);
        
        // Simular el clic en el enlace de la versión 102
        fireEvent.click(targetLink);

        // Verificar que el router.push fue llamado con la ruta correcta
        const expectedPath = `/topic/${mockTopicId}/version/${targetVersionId}`;
        expect(mockRouter.push).toHaveBeenCalledWith(expectedPath);
        expect(mockRouter.push).toHaveBeenCalledTimes(1);

        // Probar otro clic para asegurar que el path se calcula dinámicamente
        const version101Link = screen.getByTestId(`version-link-101`);
        fireEvent.click(version101Link);
        
        const expectedPath101 = `/topic/${mockTopicId}/version/101`;
        expect(mockRouter.push).toHaveBeenCalledWith(expectedPath101);
        expect(mockRouter.push).toHaveBeenCalledTimes(2);
    });
});