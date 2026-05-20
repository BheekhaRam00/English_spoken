"use client";

import { ReactNode } from "react";

type StatsCardProps = {
  title: string;

  value: string;

  icon: ReactNode;
};

export default function StatsCard({
  title,
  value,
  icon
}: StatsCardProps) {
  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "24px",

        display: "flex",

        alignItems: "center",

        justifyContent:
          "space-between",

        background:
          "linear-gradient(90deg, rgba(147,51,234,0.10), rgba(37,99,235,0.10))"
      }}
    >
      <div>
        <p
          style={{
            color:
              "rgba(255,255,255,0.72)",

            marginBottom:
              "10px",

            fontSize: "15px"
          }}
        >
          {title}
        </p>

        <h2
          style={{
            fontSize: "34px",

            fontWeight: 700
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          width: "64px",

          height: "64px",

          borderRadius:
            "22px",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "linear-gradient(90deg, #9333ea, #2563eb)"
        }}
      >
        {icon}
      </div>
    </div>
  );
}
