import { render, screen, fireEvent } from '@testing-library/react';
import LoginContainer from '@/ui/components/organisms/formSignin';



describe('LoginContainer', () => {
  it('renderiza correctamente los campos y el botón', () => {
    render(<LoginContainer />);

    // Verifica que los campos de email y contraseña estén en el documento
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();

    // Verifica que el botón de "Sign In" esté presente
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('actualiza el estado al escribir en los campos', () => {
    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('123456');
  });
});