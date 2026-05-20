"use client";

import {
  Bot,
  Volume2
} from "lucide-react";

type AIResponseBubbleProps = {
  text: string;

  onSpeak?: (text: string) => void;

  timestamp?: string;
};

export default function AIResponseBubble({
  text,
  onSpeak,
  timestamp
}: AIResponseBubbleProps) {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        justifyContent: "flex-start"
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "85%",

          padding: "18px",

          borderRadius: "24px",

          background:
            "rgba(255,255,255,0.05)",

          border:
            "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: "10px",

            marginBottom: "12px"
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",

              borderRadius: "14px",

              background:
                "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Bot size={18} />
          </div>

          <div>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,

                color: "#ffffff",

                marginBottom: "2px"
              }}
            >
              AI Assistant
            </h4>

            {timestamp && (
              <p
                style={{
                  fontSize: "12px",

                  color:
                    "rgba(255,255,255,0.5)"
                }}
              >
                {timestamp}
              </p>
            )}
          </div>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.84)",

            lineHeight: 1.9,

            fontSize: "15px"
          }}
        >
          {text}
        </p>

        <button
          onClick={() =>
            onSpeak?.(text)
          }
          aria-label="Play AI voice"
          style={{
            marginTop: "16px",

            width: "42px",
            height: "42px",

            borderRadius: "14px",

            background:
              "rgba(255,255,255,0.06)",

            color: "#ffffff",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            transition:
              "transform 0.2s ease"
          }}
          onMouseDown={(e) => {
            (
              e.currentTarget as HTMLButtonElement
            ).style.transform =
              "scale(0.94)";
          }}
          onMouseUp={(e) => {
            (
              e.currentTarget as HTMLButtonElement
            ).style.transform =
              "scale(1)";
          }}
          onMouseLeave={(e) => {
            (
              e.currentTarget as HTMLButtonElement
            ).style.transform =
              "scale(1)";
          }}
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
}
