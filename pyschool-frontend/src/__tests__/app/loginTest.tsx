import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginContainer from '@/ui/components/organisms/formSignin';

const mockFetch = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '', assign: jest.fn() },
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  global.fetch = mockFetch;
});

describe('LoginContainer', () => {
  it('realiza login exitoso y guarda token en localStorage', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: 'fake-token', user: { role: 'admin' } },
        message: 'Login exitoso',
      }),
    });

    render(<LoginContainer />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your Password/i), {
      target: { value: 'securepassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('userRole')).toBe('admin');
      expect(window.location.assign).toHaveBeenCalledWith('/waitPage');
    });
  });
});
