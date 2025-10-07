"use client";
import React from "react";

const BackgroundClouds: React.FC = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
    <div
      className="absolute top-8 left-4 w-[280px] h-[160px] opacity-100"
      style={{
        backgroundColor: "rgba(255,255,255,0.45)",
        WebkitMaskImage: "url('/images/nube.png')",
        maskImage: "url('/images/nube.png')",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
    <div
      className="absolute bottom-6 left-[-20px] w-[360px] h-[200px] opacity-100"
      style={{
        backgroundColor: "rgba(255,255,255,0.45)",
        WebkitMaskImage: "url('/images/nube.png')",
        maskImage: "url('/images/nube.png')",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
    <div
      className="absolute top-[80px] right-[-10px] w-[320px] h-[180px] opacity-100"
      style={{
        backgroundColor: "rgba(255,255,255,0.45)",
        WebkitMaskImage: "url('/images/nube.png')",
        maskImage: "url('/images/nube.png')",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  </div>
);

export default BackgroundClouds;

