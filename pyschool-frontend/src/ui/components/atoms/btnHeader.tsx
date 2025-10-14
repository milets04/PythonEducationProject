"use client";
import React from "react";

interface BtnHeaderProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "login";
}

const BtnHeader: React.FC<BtnHeaderProps> = ({
  text = "Sign up",
  onClick,
  className = "",
  type = "button",
  variant = "default",
}) => {
  const getColors = () => {
    switch (variant) {
      case "login":
        return {
          base: "var(--color-btn-login)",
          hover: "var(--color-btn-login-hover)",
          active: "var(--color-btn-login-active)",
        };
      default:
        return {
          base: "var(--color-btn-sign)",
          hover: "var(--color-btn-hover-sign)",
          active: "var(--color-btn-active-sign)",
        };
    }
  };

  const { base, hover, active } = getColors();

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-[154px]
        h-[46px]
        rounded-md
        border
        border-gray-400
        text-white
        font-bold
        transition
        duration-200
        active:scale-95
        ${className}
      `}
      style={{
        backgroundColor: base,
        fontFamily: "var(--font-btn)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = base)}
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = active)}
      onMouseUp={(e) => (e.currentTarget.style.backgroundColor = hover)}
    >
      {text}
    </button>
  );
};

export default BtnHeader;
