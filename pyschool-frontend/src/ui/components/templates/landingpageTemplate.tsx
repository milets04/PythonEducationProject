"use client";

import React from "react";
import HeaderLandingpage from "@/ui/components/molecules/headerLandinpage";
import TxtLandingpage from "@/ui/components/molecules/txtLandingpage";
import BackgroundClouds from "../atoms/backgroundClouds";

const LandingpageTemplate: React.FC = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-transparent">
      <BackgroundClouds />
      <div className="relative z-10">
        <HeaderLandingpage />
        <TxtLandingpage />
      </div>
    </main>
  );
};

export default LandingpageTemplate;
