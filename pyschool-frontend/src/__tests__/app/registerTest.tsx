// __tests__/RegisterForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '@/ui/components/organisms/formRegister';

describe('RegisterForm', () => {
  it('renderiza correctamente todos los campos', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/Firstname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lastname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('muestra errores de validación si se envía vacío', async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Firstname must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Lastname must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      //expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
      //expect(screen.getAllByText(/Password must be at least 6 characters/i)).toHaveLength(2);
    });
  });
});