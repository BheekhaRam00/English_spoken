"use client";

import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon
}: EmptyStateProps) {
  return (
    <div
      className="glass-card fade-in"
      style={{
        width: "100%",

        padding: "36px 24px",

        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        justifyContent: "center",

        textAlign: "center"
      }}
    >
      {icon && (
        <div
          style={{
            width: "72px",
            height: "72px",

            borderRadius: "24px",

            marginBottom: "22px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

            color: "#ffffff"
          }}
        >
          {icon}
        </div>
      )}

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,

          marginBottom: "12px"
        }}
      >
        {title}
      </h2>

      <p
        style={{
          maxWidth: "420px",

          color: "rgba(255,255,255,0.72)",

          lineHeight: 1.8,

          fontSize: "15px"
        }}
      >
        {description}
      </p>
    </div>
  );
}
