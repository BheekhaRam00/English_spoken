"use client";

import {
  Briefcase,
  MessageCircle,
  GraduationCap,
  Brain,
  Sparkles
} from "lucide-react";

import {
  AIConversationMode
} from "@/types";

type ModeSelectorProps = {
  selectedMode: AIConversationMode;

  onSelect: (
    mode: AIConversationMode
  ) => void;
};

const modes = [
  {
    id: "daily" as AIConversationMode,

    title:
      "Daily Talk",

    description:
      "Everyday English conversations",

    icon: (
      <MessageCircle
        size={22}
      />
    )
  },

  {
    id: "business" as AIConversationMode,

    title:
      "Business",

    description:
      "Professional office communication",

    icon: (
      <Briefcase
        size={22}
      />
    )
  },

  {
    id: "interview" as AIConversationMode,

    title:
      "Interview",

    description:
      "Job interview speaking practice",

    icon: (
      <GraduationCap
        size={22}
      />
    )
  },

  {
    id: "advanced" as AIConversationMode,

    title:
      "Advanced",

    description:
      "Advanced fluent conversations",

    icon: (
      <Brain
        size={22}
      />
    )
  }
];

export default function ModeSelector({
  selectedMode,
  onSelect
}: ModeSelectorProps) {
  return (
    <section
      className="fade-in"
      style={{
        marginBottom: "24px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px"
        }}
      >
        <Sparkles size={20} />

        <h2
          style={{
            fontSize: "24px"
          }}
        >
          Conversation Mode
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px"
        }}
      >
        {modes.map(
          (mode) => {
            const active =
              selectedMode ===
              mode.id;

            return (
              <button
                key={mode.id}
                onClick={() =>
                  onSelect(
                    mode.id
                  )
                }
                style={{
                  width: "100%",

                  padding: "22px",

                  borderRadius:
                    "24px",

                  background:
                    active
                      ? "linear-gradient(135deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                      : "rgba(255,255,255,0.05)",

                  border:
                    active
                      ? "1px solid rgba(147,51,234,0.35)"
                      : "1px solid rgba(255,255,255,0.04)",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: "18px",

                  transition:
                    "0.2s ease"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "18px"
                  }}
                >
                  <div
                    style={{
                      width: "58px",
                      height: "58px",

                      borderRadius:
                        "18px",

                      display: "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      background:
                        active
                          ? "linear-gradient(90deg, #9333ea, #2563eb)"
                          : "rgba(255,255,255,0.08)"
                    }}
                  >
                    {
                      mode.icon
                    }
                  </div>

                  <div
                    style={{
                      textAlign:
                        "left"
                    }}
                  >
                    <h3
                      style={{
                        fontSize:
                          "20px",

                        marginBottom:
                          "6px"
                      }}
                    >
                      {
                        mode.title
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "rgba(255,255,255,0.70)",

                        lineHeight:
                          1.6
                      }}
                    >
                      {
                        mode.description
                      }
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "18px",
                    height: "18px",

                    borderRadius:
                      "999px",

                    border:
                      active
                        ? "5px solid #ffffff"
                        : "2px solid rgba(255,255,255,0.35)",

                    background:
                      active
                        ? "#2563eb"
                        : "transparent",

                    transition:
                      "0.2s ease"
                  }}
                />
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}
