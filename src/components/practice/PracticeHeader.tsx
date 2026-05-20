"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Brain,
  Sparkles
} from "lucide-react";

type PracticeHeaderProps = {
  title?: string;

  subtitle?: string;

  mode?: string;
};

export default function PracticeHeader({
  title = "AI Practice",
  subtitle = "Practice spoken English naturally with AI.",
  mode = "Daily Conversation"
}: PracticeHeaderProps) {
  return (
    <section
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "24px"
      }}
    >
      <Link href="/">
        <button
          className="secondary-button"
          style={{
            width: "54px",
            height: "54px",
            padding: 0,
            borderRadius: "18px"
          }}
        >
          <ArrowLeft size={22} />
        </button>
      </Link>

      <div
        style={{
          flex: 1
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px"
          }}
        >
          <h1
            className="page-title"
            style={{
              fontSize: "34px",
              marginBottom: 0
            }}
          >
            {title}
          </h1>

          <div
            style={{
              padding: "6px 12px",

              borderRadius: "999px",

              background:
                "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={14} />

            <span
              style={{
                fontSize: "12px",
                fontWeight: 700
              }}
            >
              AI
            </span>
          </div>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.72)",
            marginBottom: "12px"
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",

            padding: "10px 16px",

            borderRadius: "999px",

            background:
              "rgba(255,255,255,0.05)"
          }}
        >
          <Brain size={16} />

          <span
            style={{
              fontSize: "14px",
              fontWeight: 600
            }}
          >
            {mode}
          </span>
        </div>
      </div>
    </section>
  );
}
