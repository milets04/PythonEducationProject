"use client";
import Img from "../atoms/img";
import BtnHeader from "../atoms/btnHeader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
    router.push("/signup")
  }
  const{data: session}=useSession();
  console.log(session)
  return (
    <header className="w-full bg-transparent">
      <div className="w-full flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Link href="/welcome" className="cursor-pointer">
            <Img src={logoSrc} alt={logoAlt} width={160} height={58} rounded />
          </Link>
          
        </div>
        {session?.user ?(
          <div className="flex items-center gap-3">
              <p>{session.user.name} {session.user.email}</p>
              <BtnHeader text="Log out" variant="login" onClick={() => {signOut()}} />
        </div>
        ):(
          <div className="flex items-center gap-3">
          <BtnHeader text="Register" variant="default" onClick={() => router.push("/signup")} />
          <BtnHeader text="Sign in" variant="login" onClick={() => router.push("/signin")} />
        </div>
        )}
        
      </div>
    </header>
  );
};

export default HeaderLandingpage;
