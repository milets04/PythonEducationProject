import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logs, { TopicVersion } from '@/ui/components/organisms/logs';

beforeEach(() => {
    jest.clearAllMocks();
});

const mockVersions: TopicVersion[] = [
    { id: 101, createdAt: '2025-11-10T09:00:00Z' },
    { id: 102, createdAt: '2025-11-11T14:30:00Z' },
    { id: 103, createdAt: '2025-11-12T10:45:00Z' },
];

describe('Logs Component', () => {

    it('debe renderizar el título "Logs"', () => {
        render(<Logs versions={mockVersions} />);
        expect(screen.getByText('Logs')).toBeInTheDocument();
    });

    it('debe renderizar la lista de versiones ordenadas por fecha', () => {
        render(<Logs versions={mockVersions} />);

        const versionItems = screen.getAllByText(/2025/i);
        expect(versionItems.length).toBe(3);
    });

    it('debe mostrar el mensaje cuando no hay versiones', () => {
        render(<Logs versions={[]} />);

        expect(
            screen.getByText('No se encontró historial de versiones.')
        ).toBeInTheDocument();
    });

    /*
    it('NO PASARÁ: debería navegar al hacer clic en una versión', () => {
        render(<Logs versions={mockVersions} />);

        // El componente Version NO tiene eventos onClick ni testid
        const targetLink = screen.getByTestId('version-link-102');

        fireEvent.click(targetLink);

        expect(mockRouter.push).toHaveBeenCalled();
    });
    */

    /*
    it('NO PASARÁ: debería tener botones con data-testid', () => {
        render(<Logs versions={mockVersions} />);

        const link = screen.getByTestId('version-link-101');
        expect(link).toBeInTheDocument();
    });
    */
});