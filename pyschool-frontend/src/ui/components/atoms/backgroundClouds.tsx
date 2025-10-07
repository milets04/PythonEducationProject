"use client";
import React from "react";

const BackgroundClouds: React.FC = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
    <img
      src="/images/nube.png"
      alt="Nube superior izquierda"
      className="absolute top-8 left-4 w-[280px] opacity-80"
    />
    <img
      src="/images/nube.png"
      alt="Nube inferior izquierda"
      className="absolute bottom-6 left-[-20px] w-[360px] opacity-70"
    />
    <img
      src="/images/nube.png"
      alt="Nube derecha superior"
      className="absolute top-16 right-[-10px] w-[320px] opacity-60"
    />
  </div>
);

export default BackgroundClouds;
