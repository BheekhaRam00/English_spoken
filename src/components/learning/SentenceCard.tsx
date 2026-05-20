"use client";

import { Volume2 } from "lucide-react";

type SentenceCardProps = {
  category: string;
  sentence: string;
  onSpeak?: () => void;
};

export default function SentenceCard({
  category,
  sentence,
  onSpeak
}: SentenceCardProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "28px"
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",

          padding: "10px 16px",

          borderRadius: "999px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

          marginBottom: "24px"
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          {category}
        </span>
      </div>

      <h2
        style={{
          fontSize: "28px",
          lineHeight: 1.7,

          marginBottom: "28px",

          color: "#ffffff"
        }}
      >
        {sentence}
      </h2>

      <button
        className="primary-button"
        onClick={onSpeak}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          gap: "10px"
        }}
      >
        <Volume2 size={20} />

        Listen Pronunciation
      </button>
    </section>
  );
}
