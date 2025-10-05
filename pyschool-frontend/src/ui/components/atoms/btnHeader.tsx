import React from "react";
import Link from "next/link";

export interface BtnHeaderProps {
  text: string;
  onPress?: () => void;
  color?: string;
  variant?: "solid" | "outline";
  href?: string;
  disabled?: boolean;
  className?: string;
}

const BtnHeader: React.FC<BtnHeaderProps> = ({
  text,
  onPress,
  color = "#61B3F6",
  variant = "solid",
  href,
  disabled,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-[12px] px-5 py-2.5 text-sm font-medium " +
    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "solid"
      ? { backgroundColor: color, color: "#fff", borderColor: color }
      : { backgroundColor: "transparent", color: color, border: `2px solid ${color}` };

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

