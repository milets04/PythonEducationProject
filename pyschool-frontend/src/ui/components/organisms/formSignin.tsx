import { MdAlternateEmail } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import InputWithIcon from '@/ui/components/molecules/iconInputForm';
import React, { useState } from "react";
import GoogleButton from '@/ui/components/atoms/btnGoogle';
import Subtitle from '@/ui/components/atoms/subtLog';
import SignLink from '@/ui/components/atoms/txtSign';

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
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

        <button
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors mb-6"
        >
          Sign In
        </button>

        <div className="text-center mb-4">
          <span className="text-sm text-gray-600">
            Don't have an account?{' '}
            <SignLink
              text="Sign Up"
              href="/signup"
            />
          </span>
        </div>

        <div className="text-center mb-4">
          <Subtitle text="Or With" className="justify-center" />
        </div>

        <div className="flex justify-center">
          <GoogleButton/>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;