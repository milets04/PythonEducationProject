"use client";

import React from "react";
import Image from "next/image";

interface ImgProps {
  src: string; 
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  rounded?: boolean;
}

const Img: React.FC<ImgProps> = ({
  src,
  alt,
  width = 200,
  height = 200,
  className = "",
  rounded = false,
}) => {
  return (
    <div
      className={`
        overflow-hidden 
        ${rounded ? "rounded-lg" : ""} 
        ${className}
      `}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default Img;
