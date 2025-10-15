'use client';

import Image from 'next/image';
import RegisterForm from "@/ui/components/organisms/formRegister";
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center justify-center relative overflow-hidden">
      
      <RegisterForm/>
      
      {/* <button 
        className="fixed top-5 left-5 z-[100] cursor-pointer bg-red-500 text-white px-4 py-2"
        onClick={() => {
          alert('CLICKED!!!');
          router.push('/');
        }}
        type="button"
      >
        HOME
      </button> */}
    </div>
  );
};

export default RegisterPage;