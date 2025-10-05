"use client";
import React from "react";
import Link from "next/link";

export interface BtnHeaderProps {
  text: string;
  onPress?: () => void;
  color?: string;
  variant?: "solid" | "soft" | "outline";
  href?: string;
  disabled?: boolean;
  className?: string;
}

const hexToRgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const BtnHeader: React.FC<BtnHeaderProps> = ({
  text,
  onPress,
  color = "var(--color-sign)",
  variant = "solid",
  href,
  disabled,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-[12px] px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  
  let styles: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    borderStyle: "solid",
  };

  if (variant === "solid") {
    styles = {
      ...styles,
      backgroundColor: color,
      color: "#fff",
      borderColor: color,
      borderWidth: 1,
    };
  } else if (variant === "soft") {
    const bg =
      color.startsWith("#") ? hexToRgba(color, 0.25) : "rgba(97,179,246,0.25)";
    styles = {
      ...styles,
      backgroundColor: bg,
      color: color,
      borderColor: color,
      borderWidth: 2,
    };
  } else {
    styles = {
      ...styles,
      backgroundColor: "transparent",
      color: color,
      borderColor: color,
      borderWidth: 2,
    };
  }

  if (href) {
    return (
      <Link
        href={href}
        onClick={disabled ? (e) => e.preventDefault() : onPress}
        className={`${base} ${className}`}
        style={styles}
        aria-disabled={disabled || undefined}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={`${base} ${className}`}
      style={styles}
    >
      {text}
    </button>
  );
};

export default BtnHeader;
