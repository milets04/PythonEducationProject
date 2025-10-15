"use client";

import React from "react";
import HeaderLandingpage from "@/ui/components/molecules/headerLandinpage";
import TxtLandingpage from "@/ui/components/molecules/txtLandingpage";
import BackgroundClouds from "../atoms/backgroundClouds";

const LandingpageTemplate: React.FC = () => {
  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-transparent flex flex-col">
      <BackgroundClouds />
      <div className="relative z-10 flex flex-col flex-grow">
        {/* <HeaderLandingpage /> */}
          <section className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl w-full">
        <TxtLandingpage />
      </div>
      </section>
      </div>
    </main>
  );
};

export default LandingpageTemplate;
