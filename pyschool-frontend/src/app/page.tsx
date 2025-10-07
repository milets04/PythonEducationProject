"use client";
import Image from "next/image";
import LoginContainer from "@/ui/components/organisms/formSignin";
import React, { useState } from "react";

export default function Page() {
  return (
    <div>
      <LoginContainer
        onSignIn={() => console.log('Sign In clicked')}
        onGoogleSignIn={() => console.log('Google Sign In')}
      />
    </div>
  );
}
