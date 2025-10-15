"use client";
import Image from 'next/image';
import CoverText from "../atoms/coverText";
import CoverDescriptionText from "../atoms/coverDescriptionText";
import BackgroundClouds from "../atoms/backgroundClouds";
import UserIcon from '../atoms/userIcon';   
import CustomButton from '../atoms/btnOthers';
import Link from 'next/link';

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
  return (

    <section
      className="relative flex items-center justify-center min-h-screen w-full bg-transparent px-6 md:px-12 py-8"
    >
      <BackgroundClouds />

      {/* <!--<div className="absolute top-5 left-5">
        <Link href="/landingpageTemplate" className="cursor-pointer">
          <Image
            src="/images/pysonlogo.png"
            alt="PY Son Logo"
            width={200}
            height={200}
            priority
          />
        </Link>
      </div>--> */}
      {/* <div className="absolute top-6 right-5 flex items-center gap-2">
        <UserIcon size={32} />
      </div>
      <div className="absolute top-5 right-18 flex items-center gap-2">
        <CustomButton 
        text="Log out" 
        textColor="#ffffff"
        />
      </div> */}
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <CoverText text={title} size="large" />
        <CoverDescriptionText text={description} size="medium" />
      </div>

    </section>
  );
};

export default Welcomepage;