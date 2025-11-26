"use client";
import Image from 'next/image';
import CoverText from "../atoms/coverText";
import CoverDescriptionText from "../atoms/coverDescriptionText";
import BackgroundClouds from "../atoms/backgroundClouds";
import UserIcon from '../atoms/userIcon';   
import CustomButton from '../atoms/btnOthers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/hoc/config';

type WelcomepageProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const Welcomepage: React.FC<WelcomepageProps> = ({
  title = "Welcome to pyson<br />platform",
  description = "Wait for your principal page",

}) => {
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); 

    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          console.log('Backend ha cerrado la sesión.');
        } else {
          console.warn('Backend no pudo cerrar la sesión, pero el cliente fue limpiado.');
        }
      } catch (error) {
        console.error('Error al notificar al backend (ya estás desconectado localmente):', error);
      }
    }

    router.push('/'); 
    window.location.href = '/';
  };
  return (

    <section
      className="relative flex items-center justify-center min-h-screen w-full bg-transparent px-6 md:px-12 py-8"
    >
      <BackgroundClouds />

      <div className="absolute top-5 left-5">
        <Link href="/landingpageTemplate" className="cursor-pointer">
          <Image
            src="/images/pysonlogo.png"
            alt="PY Son Logo"
            width={200}
            height={200}
            priority
          />
        </Link>
      </div>
      <div className="absolute top-6 right-5 flex items-center gap-2">
        <UserIcon size={32} />
      </div>
      <div className="absolute top-5 right-18 flex items-center gap-2">
        <CustomButton
          text="Log out"
          textColor="#ffffff"
          onClick={handleLogout} 
        />
      </div>
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <CoverText text={title} size="large" />
        <CoverDescriptionText text={description} size="medium" />
      </div>

    </section>
  );
};

export default Welcomepage;