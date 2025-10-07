import Image from 'next/image';
import LoginContainer from '@/ui/components/organisms/formSignin';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <Image
          src="/images/pysonlogo.png"
          alt="Decoration"
          width={200}
          height={200}
          priority
        />
      </div>
      <div>
        <LoginContainer/>
      </div>
    </div>
  );
};

export default LoginPage;