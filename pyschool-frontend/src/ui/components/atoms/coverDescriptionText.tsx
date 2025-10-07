"use client";

import React from "react";

interface CoverDescriptionTextProps {
  text: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const CoverDescriptionText: React.FC<CoverDescriptionTextProps> = ({
  text,
  className = "",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  return (
    <p
      className={`
        ${sizeClasses}
        font-normal
        leading-snug
        ${className}
      `}
      style={{
        color: "var(--color-cover-description)",
        fontFamily: "var(--font-cover-description)",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default CoverDescriptionText;
