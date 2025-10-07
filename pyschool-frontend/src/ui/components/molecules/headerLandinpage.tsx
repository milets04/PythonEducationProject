"use client";
import React from "react";
import Img from "../atoms/img";
import BtnHeader from "../atoms/btnHeader";

type HeaderLandingpageProps = {
  logoSrc?: string;         
  logoAlt?: string; 
  onSignIn?: () => void;
  onLogIn?: () => void; 
};

const HeaderLandingpage: React.FC<HeaderLandingpageProps> = ({
  logoSrc = "/images/logoPySon.png",
  logoAlt = "PY Son",
  onSignIn,
  onLogIn,
}) => {
  return (
    <header className="w-full bg-transparent">
      <div className="w-full flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Img src={logoSrc} alt={logoAlt} width={180} height={58} rounded />
        </div>
        <div className="flex items-center gap-3">
          <BtnHeader text="Sign in" variant="default" onClick={onSignIn} />
          <BtnHeader text="Log in" variant="login" onClick={onLogIn} />
        </div>
      </div>
    </header>
  );
};

export default HeaderLandingpage;
