"use client";

import {
  Brain,
  User,
  Volume2,
  Clock3,
  Mic
} from "lucide-react";

type ConversationCardProps = {
  role: "ai" | "user";

  message: string;

  time?: string;

  onReplay?: () => void;
};

export default function ConversationCard({
  role,
  message,
  time,
  onReplay
}: ConversationCardProps) {
  const isAI =
    role === "ai";

  return (
    <div
      className="fade-in"
      style={{
        display: "flex",

        justifyContent:
          isAI
            ? "flex-start"
            : "flex-end",

        width: "100%"
      }}
    >
      <div
        style={{
          maxWidth: "88%",

          display: "flex",

          flexDirection:
            "column",

          alignItems:
            isAI
              ? "flex-start"
              : "flex-end",

          gap: "10px"
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "10px",

            flexDirection:
              isAI
                ? "row"
                : "row-reverse"
          }}
        >
          <div
            style={{
              width: "42px",

              height: "42px",

              borderRadius:
                "14px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                isAI
                  ? "linear-gradient(135deg, rgba(147,51,234,0.25), rgba(37,99,235,0.25))"
                  : "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(16,185,129,0.22))"
            }}
          >
            {isAI ? (
              <Brain
                size={20}
              />
            ) : (
              <User
                size={20}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              alignItems:
                isAI
                  ? "flex-start"
                  : "flex-end"
            }}
          >
            <span
              style={{
                fontSize:
                  "14px",

                fontWeight:
                  700
              }}
            >
              {isAI
                ? "FluentPro AI"
                : "You"}
            </span>

            {time && (
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "6px",

                  color:
                    "rgba(255,255,255,0.58)",

                  fontSize:
                    "12px"
                }}
              >
                <Clock3
                  size={12}
                />

                {time}
              </div>
            )}
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "20px",

            borderRadius:
              isAI
                ? "24px 24px 24px 10px"
                : "24px 24px 10px 24px",

            background:
              isAI
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(90deg, #9333ea, #2563eb)",

            border:
              isAI
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid rgba(147,51,234,0.25)"
          }}
        >
          <p
            style={{
              lineHeight:
                1.9,

              color:
                "#ffffff",

              fontSize:
                "16px"
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "10px"
          }}
        >
          {isAI && (
            <button
              onClick={
                onReplay
              }
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "8px",

                height: "40px",

                padding:
                  "0 14px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,0.06)",

                color:
                  "#ffffff"
              }}
            >
              <Volume2
                size={16}
              />

              Replay
            </button>
          )}

          {!isAI && (
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "8px",

                height: "40px",

                padding:
                  "0 14px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,0.06)",

                color:
                  "rgba(255,255,255,0.72)"
              }}
            >
              <Mic
                size={16}
              />

              Voice Input
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
