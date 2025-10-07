"use client";
import React from "react";

interface CoverTextProps {
  text: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const CoverText: React.FC<CoverTextProps> = ({
  text,
  className = "",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-2xl",
  }[size];

  return (
    <p
      className={`${sizeClasses} font-semibold leading-tight ${className}`}
      style={{
        color: "var(--color-cover-text)",
        fontFamily: "var(--font-cover-text)",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default CoverText;

