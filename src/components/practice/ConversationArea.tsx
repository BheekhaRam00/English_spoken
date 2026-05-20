"use client";

import {
  Bot,
  User,
  Volume2
} from "lucide-react";

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
};

type ConversationAreaProps = {
  messages: Message[];

  onSpeak?: (text: string) => void;
};

export default function ConversationArea({
  messages,
  onSpeak
}: ConversationAreaProps) {
  return (
    <section
      className="glass-card fade-in hide-scrollbar"
      style={{
        padding: "24px",

        minHeight: "420px",

        display: "flex",
        flexDirection: "column",

        gap: "18px",

        overflowY: "auto"
      }}
    >
      {messages.map((message) => {
        const isAI =
          message.role === "ai";

        return (
          <div
            key={message.id}
            style={{
              display: "flex",

              justifyContent: isAI
                ? "flex-start"
                : "flex-end"
            }}
          >
            <div
              style={{
                width: "fit-content",
                maxWidth: "85%",

                padding: "16px",

                borderRadius: "22px",

                background: isAI
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

                border:
                  "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",

                  gap: "10px",

                  marginBottom: "10px"
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",

                    borderRadius: "12px",

                    background: isAI
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.12)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {isAI ? (
                    <Bot size={18} />
                  ) : (
                    <User size={18} />
                  )}
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,

                    color: "#ffffff"
                  }}
                >
                  {isAI
                    ? "AI Assistant"
                    : "You"}
                </span>
              </div>

              <p
                style={{
                  color: isAI
                    ? "rgba(255,255,255,0.84)"
                    : "#ffffff",

                  lineHeight: 1.8,

                  fontSize: "15px"
                }}
              >
                {message.text}
              </p>

              {isAI && (
                <button
                  onClick={() =>
                    onSpeak?.(message.text)
                  }
                  style={{
                    marginTop: "14px",

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
                      "0.2s ease"
                  }}
                >
                  <Volume2 size={18} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </section>
    }
