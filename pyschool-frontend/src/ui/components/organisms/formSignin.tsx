import { MdAlternateEmail } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import InputWithIcon from '@/ui/components/molecules/iconInputForm';
import React, { useState } from "react";
import GoogleButton from '@/ui/components/atoms/btnGoogle';
import Subtitle from '@/ui/components/atoms/subtLog';
import SignLink from '@/ui/components/atoms/txtSign';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/hoc/config';

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Email o contraseña incorrectos');
      }

      // Guardar token y rol
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userRole', result.data.user.role);

      console.log('Login exitoso, rol:', result.data.user.role);

      // Redirigir según el rol
      redirectByRole(result.data.user.role);

    } catch (error) {
      const err = error as Error;
      console.error('Error de inicio de sesión:', error);
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'administrator':
        router.push('/requests');
        break;
      case 'editorTeacher':
      case 'executorTeacher':
        router.push('/teacherPages/addContent');
        break;
      case 'student':
        router.push('/waitPage');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <div className="mb-6">
          <InputWithIcon
            id="email"
            value={email}
            label="Email"
            placeholder="Enter your Email"
            icon={MdAlternateEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <InputWithIcon
            id="password"
            value={password}
            label="Contraseña"
            placeholder="Enter your Password"
            icon={FiLock}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {apiError && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg text-center mb-6">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors mb-6 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Sign In'}
        </button>

        <div className="text-center mb-4">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <SignLink text="Sign Up" href="/signup" />
          </span>
        </div>

        <div className="text-center mb-4">
          <Subtitle text="Or With" className="justify-center" />
        </div>

        <div className="flex justify-center">
          <GoogleButton/>
        </div>
      </form>
    </div>
  );
};

export default LoginContainer;