"use client";
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
  //onLogIn,
}) => {
  const router = useRouter();

 /* const handleSignIn = () => {
    router.push("/signin")
    router.push("/signup")
  }*/
  return (
    <header className="w-full bg-transparent">
      <div className="w-full flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Img src={logoSrc} alt={logoAlt} width={180} height={58} rounded />
        </div>
        <div className="flex items-center gap-3">
          <BtnHeader text="Register" variant="default" onClick={() => router.push("/signup")} />
          <BtnHeader text="Sign in" variant="login" onClick={() => router.push("/signin")} />
        </div>
      </div>
    </header>
  );
};

export default HeaderLandingpage;
