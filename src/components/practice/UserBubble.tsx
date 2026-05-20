"use client";

import { User } from "lucide-react";

type UserBubbleProps = {
  text: string;

  timestamp?: string;
};

export default function UserBubble({
  text,
  timestamp
}: UserBubbleProps) {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "85%",

          padding: "18px",

          borderRadius: "24px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

          border:
            "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",

            justifyContent: "flex-end",

            gap: "10px",

            marginBottom: "12px"
          }}
        >
          <div
            style={{
              textAlign: "right"
            }}
          >
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,

                color: "#ffffff",

                marginBottom: "2px"
              }}
            >
              You
            </h4>

            {timestamp && (
              <p
                style={{
                  fontSize: "12px",

                  color:
                    "rgba(255,255,255,0.58)"
                }}
              >
                {timestamp}
              </p>
            )}
          </div>

          <div
            style={{
              width: "36px",
              height: "36px",

              borderRadius: "14px",

              background:
                "rgba(255,255,255,0.12)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <User size={18} />
          </div>
        </div>

        <p
          style={{
            color: "#ffffff",

            lineHeight: 1.9,

            fontSize: "15px",

            wordBreak: "break-word"
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
