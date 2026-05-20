"use client";

import {
  Lightbulb,
  Mic,
  Volume2,
  Brain,
  CheckCircle2
} from "lucide-react";

const tips = [
  {
    icon: <Mic size={20} />,

    title:
      "Speak Clearly",

    description:
      "Speak slowly and clearly instead of speaking too fast."
  },

  {
    icon: (
      <Volume2 size={20} />
    ),

    title:
      "Listen Carefully",

    description:
      "Focus on pronunciation and sentence rhythm while listening."
  },

  {
    icon: <Brain size={20} />,

    title:
      "Think in English",

    description:
      "Try forming thoughts directly in English for better fluency."
  },

  {
    icon: (
      <CheckCircle2
        size={20}
      />
    ),

    title:
      "Practice Daily",

    description:
      "Even 10 minutes daily practice improves confidence quickly."
  }
];

export default function PracticeTips() {
  return (
    <section
      className="fade-in"
      style={{
        marginTop: "28px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <Lightbulb size={22} />

        <h2
          style={{
            fontSize: "26px"
          }}
        >
          Speaking Tips
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px"
        }}
      >
        {tips.map(
          (
            tip,
            index
          ) => (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: "22px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "flex-start",
                  gap: "16px"
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",

                    minWidth:
                      "52px",

                    borderRadius:
                      "16px",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
                  }}
                >
                  {tip.icon}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize:
                        "19px",

                      marginBottom:
                        "8px"
                    }}
                  >
                    {tip.title}
                  </h3>

                  <p
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",

                      lineHeight:
                        1.8
                    }}
                  >
                    {
                      tip.description
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
