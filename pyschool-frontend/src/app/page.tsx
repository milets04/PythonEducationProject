import Image from "next/image";
import BtnHeader from "@/ui/components/atoms/btnHeader";

export default function Home() {
  return (
    <div>prueba
      <div className="mt-6 flex gap-4">
        <BtnHeader
          text="Sign in"
          variant="outline"
          color="#2F7CBB"
          href="/signin"
        />
        <BtnHeader
          text="Log in"
          variant="solid"
          color="#0E1B75"
          href="/login"
        />
      </div>
    </div>    
  );
}
