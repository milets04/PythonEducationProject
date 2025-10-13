"use client";
import Image from 'next/image';
import RegisterForm from '@/ui/components/organisms/formRegister';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-fondo flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-5 left-5">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/images/pysonlogo.png"
            alt="Decoration"
            width={200}
            height={200}
            priority
          />
        </Link>
      </div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
