"use client";

import { ReactNode } from "react";

type GradientButtonProps = {
  children: ReactNode;

  onClick?: () => void;

  type?: "button" | "submit" | "reset";

  disabled?: boolean;

  fullWidth?: boolean;

  icon?: ReactNode;

  variant?: "primary" | "secondary";

  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = true,
  icon,
  variant = "primary",
  className = ""
}: GradientButtonProps) {
  const background =
    variant === "primary"
      ? "linear-gradient(90deg, #9333ea, #2563eb)"
      : "rgba(255,255,255,0.06)";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        width: fullWidth ? "100%" : "auto",

        minHeight: "56px",

        padding: "14px 22px",

        borderRadius: "18px",

        border: "none",

        background,

        color: "#ffffff",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        gap: "10px",

        fontSize: "15px",
        fontWeight: 600,

        opacity: disabled ? 0.5 : 1,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        transition:
          "transform 0.2s ease, opacity 0.2s ease"
      }}
      onMouseDown={(e) => {
        (
          e.currentTarget as HTMLButtonElement
        ).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        (
          e.currentTarget as HTMLButtonElement
        ).style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        (
          e.currentTarget as HTMLButtonElement
        ).style.transform = "scale(1)";
      }}
    >
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </span>
      )}

      <span>{children}</span>
    </button>
  );
}
