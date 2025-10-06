"use client";

import React from "react";
import Image from "next/image";

interface AtomImageProps {
  src: "public/images/logoPySon.png"; 
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  rounded?: boolean;
}

const AtomImage: React.FC<AtomImageProps> = ({
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

export default AtomImage;
