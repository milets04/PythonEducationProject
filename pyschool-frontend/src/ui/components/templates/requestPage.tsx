"use client";
import React from "react";
import HeaderLandingpage from "@/ui/components/molecules/headerLandinpage";
import TxtLandingpage from "@/ui/components/molecules/txtLandingpage";
import BackgroundClouds from "../atoms/backgroundClouds";
import Table from "../molecules/table";

const MockData = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Student" },
    { id: 2, name: "Ana López", email: "ana@example.com", role: "Teacher" },
    { id: 3, name: "Carlos Díaz", email: "carlos@example.com", role: "Student" },
  ];

const requestpageTemplate: React.FC = () => {
  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-transparent flex flex-col">
      <BackgroundClouds />
      <div className="relative z-10 flex flex-col flex-grow">
        <HeaderLandingpage />
          <section className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl w-full">
        <Table data={MockData}/>
      </div>
      </section>
      </div>
    </main>
  );
};

export default requestpageTemplate;
