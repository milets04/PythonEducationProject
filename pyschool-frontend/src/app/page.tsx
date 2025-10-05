"use client";
import Image from "next/image";
import GoogleButton from "@/ui/components/atoms/btnGoogle";

export default function Home() {
  return (
    <div>
      <GoogleButton onClick={() => console.log('Google login')} />
    </div>
  );
}
