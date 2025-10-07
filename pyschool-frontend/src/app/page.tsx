"use client";
import Image from "next/image";
import Subtitle from "@/ui/components/atoms/subtLog";
import GoogleButton from "@/ui/components/atoms/btnGoogle";  
import Input from "@/ui/components/atoms/input";
import { useState } from "react";
import Title from "@/ui/components/atoms/title";
import Descp from "@/ui/components/atoms/description";

const FormExample = () => {
  const [name, setName] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };


  return (
    <div>
      <Subtitle text="Email" />
      <GoogleButton text="Sign in with Google" />
      <Title text="Welcome to PySchool" />
      <Descp text="Learn Python the fun way!" />
      
      <Input
        label="Nombre"
        value={name}
        onChange={handleInputChange}
        placeholder="Escribe tu nombre"
        className="w-full max-w-md"
      />
      <p>Tu nombre es: {name}</p>

    </div>
  );
};
export default FormExample;
