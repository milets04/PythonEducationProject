"use client";
import React from "react";
import HeaderLandingpage from "@/ui/components/molecules/headerLandinpage";
import TxtLandingpage from "@/ui/components/molecules/txtLandingpage";
import BackgroundClouds from "../atoms/backgroundClouds";
import Table from "../molecules/table";
import {Button} from "../atoms/button"
import TitleAndDescr from "../molecules/titDesc";
import Title from "../atoms/title";

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
          <section className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
            <Title text= "Teacher requests" className="text-gray-700 justify-items-start mb-3"></Title>
            <div className="max-w-7xl w-full">
              <Table data={MockData}/>
            </div>
            <div className="flex justify-end gap-3 mt-2 ">
              <Button variant="secondary">Delete</Button>
              <Button>Save</Button>
            </div>
            
      </section>
      </div>
    </main>
  );
};

export default requestpageTemplate;
