"use client";

import { Captions } from "lucide-react";

type LiveSubtitleProps = {
  text: string;

  label?: string;

  active?: boolean;
};

export default function LiveSubtitle({
  text,
  label = "Live Subtitle",
  active = true
}: LiveSubtitleProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "22px",

        background: active
          ? "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
          : "rgba(255,255,255,0.04)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",

          gap: "10px",

          marginBottom: "14px"
        }}
      >
        <Captions size={20} />

        <span
          style={{
            fontSize: "15px",
            fontWeight: 700,

            color: "#ffffff"
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          minHeight: "72px",

          display: "flex",
          alignItems: "center"
        }}
      >
        <p
          style={{
            color: text
              ? "#ffffff"
              : "rgba(255,255,255,0.48)",

            lineHeight: 1.8,

            fontSize: "17px"
          }}
        >
          {text ||
            "Conversation subtitles will appear here..."}
        </p>
      </div>
    </section>
  );
}
