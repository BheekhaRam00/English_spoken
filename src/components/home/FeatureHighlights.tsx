"use client";

import {
  Brain,
  Mic,
  Volume2,
  Languages,
  Sparkles,
  MessageCircleMore
} from "lucide-react";

const features = [
  {
    title:
      "AI Voice Conversation",

    description:
      "Talk naturally with AI and improve real spoken English confidence.",

    icon: (
      <Mic size={24} />
    ),

    background:
      "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
  },

  {
    title:
      "Pronunciation Analysis",

    description:
      "Get instant AI pronunciation feedback and fluency improvement tips.",

    icon: (
      <Volume2
        size={24}
      />
    ),

    background:
      "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(147,51,234,0.18))"
  },

  {
    title:
      "Smart Vocabulary",

    description:
      "Learn practical English vocabulary with meaning and pronunciation.",

    icon: (
      <Languages
        size={24}
      />
    ),

    background:
      "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(34,197,94,0.18))"
  },

  {
    title:
      "Real Conversation Practice",

    description:
      "Practice office, interview, and daily life English communication.",

    icon: (
      <MessageCircleMore
        size={24}
      />
    ),

    background:
      "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(239,68,68,0.18))"
  }
];

export default function FeatureHighlights() {
  return (
    <section
      className="fade-in"
      style={{
        marginBottom: "32px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",

          marginBottom:
            "22px"
        }}
      >
        <Brain size={24} />

        <h2
          style={{
            fontSize: "28px"
          }}
        >
          Powerful Features
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px"
        }}
      >
        {features.map(
          (
            feature,
            index
          ) => (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: "24px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",

                  borderRadius:
                    "20px",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    feature.background,

                  marginBottom:
                    "18px"
                }}
              >
                {
                  feature.icon
                }
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",

                  gap: "10px",

                  marginBottom:
                    "12px"
                }}
              >
                <h3
                  style={{
                    fontSize:
                      "24px"
                  }}
                >
                  {
                    feature.title
                  }
                </h3>

                <Sparkles
                  size={16}
                />
              </div>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.72)",

                  lineHeight:
                    1.9,

                  fontSize:
                    "15px"
                }}
              >
                {
                  feature.description
                }
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
