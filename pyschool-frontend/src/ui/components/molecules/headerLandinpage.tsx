"use client";
import React from "react";
import Img from "../atoms/img";
import BtnHeader from "../atoms/btnHeader";
import { useRouter } from "next/navigation";

type HeaderLandingpageProps = {
  logoSrc?: string;         
  logoAlt?: string; 
  onLogIn?: () => void; 
};

const HeaderLandingpage: React.FC<HeaderLandingpageProps> = ({
  logoSrc = "/images/logoPySon.png",
  logoAlt = "PY Son",
  onLogIn,
}) => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin")
  }
  return (
    <header className="w-full bg-transparent">
      <div className="w-full flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Img src={logoSrc} alt={logoAlt} width={180} height={58} rounded />
        </div>
        <div className="flex items-center gap-3">
          <BtnHeader text="Sign in" variant="default" onClick={() => router.push("/signin")} />
          <BtnHeader text="Log in" variant="login" onClick={onLogIn} />
        </div>
      </div>
    </header>
  );
};

export default HeaderLandingpage;
