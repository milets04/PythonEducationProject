"use client";
import { FcGoogle } from 'react-icons/fc';
import {signIn} from 'next-auth/react';
import router, { useRouter } from 'next/navigation';

interface GoogleButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  //onClick,
  text = 'Google',
  className = '',
}) => {
  const router = useRouter ();

  const handleGoogleLogin = () => {
    signIn("google", {callbackUrl:'/welcome'});
    //router.push("/welcome")
  }

  return (
    <button
      //onClick={()=> signIn()}
      onClick={handleGoogleLogin}
      className={`flex items-center gap-3 px-15 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${className}`}
    >
      <FcGoogle size={20} />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </button>
  );
};

export default GoogleButton;