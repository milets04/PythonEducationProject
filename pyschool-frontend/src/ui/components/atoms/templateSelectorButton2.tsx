"use client";

import React from "react";

interface TemplateSelectorButton2Props {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const TemplateSelectorButton2: React.FC<TemplateSelectorButton2Props> = ({
  icon,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center border rounded-md transition-all duration-200 ${
        isActive
          ? "border-[#0B1D75] bg-[#0B1D75]/10"
          : "border-gray-400 hover:border-[#0B1D75]"
      }`}
    >
      {icon}
    </button>
  );
};

export default TemplateSelectorButton2;
