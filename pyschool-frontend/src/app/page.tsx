"use client";
import Image from "next/image";
import { MdAlternateEmail } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import InputWithIcon from '@/ui/components/molecules/iconInputForm';
import Subtitle from "@/ui/components/atoms/subtLog";

import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Subtitle text="Email" />
      <InputWithIcon
        icon={MdAlternateEmail}
        value={email}
        placeholder="Enter your Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Subtitle text="Password" />
      <InputWithIcon
        icon={FiLock}
        value={password}
        placeholder="Enter your Password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}
