"use client";

import {
  Volume2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sparkles
} from "lucide-react";

type PronunciationFeedbackProps = {
  score?: number;

  word?: string;

  feedback?: string;

  improvementTip?: string;
};

export default function PronunciationFeedback({
  score = 82,

  word = "Communication",

  feedback = "Your pronunciation is clear and understandable.",

  improvementTip = "Try stressing the 'ca' syllable slightly more naturally."
}: PronunciationFeedbackProps) {
  const getScoreColor =
    () => {
      if (score >= 85) {
        return "#22c55e";
      }

      if (score >= 70) {
        return "#f59e0b";
      }

      return "#ef4444";
    };

  const getScoreLabel =
    () => {
      if (score >= 85) {
        return "Excellent";
      }

      if (score >= 70) {
        return "Good";
      }

      return "Needs Improvement";
    };

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
        <Brain size={22} />

        <h2
          style={{
            fontSize: "26px"
          }}
        >
          Pronunciation Feedback
        </h2>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "28px",

          background:
            "linear-gradient(135deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px"
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
                  "rgba(255,255,255,0.08)"
              }}
            >
              <Volume2 size={28} />
            </div>

            <div>
              <h3
                style={{
                  fontSize:
                    "24px",

                  marginBottom:
                    "6px"
                }}
              >
                {word}
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)"
                }}
              >
                AI pronunciation analysis
              </p>
            </div>
          </div>

          <div
            style={{
              width: "86px",
              height: "86px",

              borderRadius:
                "28px",

              display: "flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "rgba(255,255,255,0.08)",

              border: `3px solid ${getScoreColor()}`
            }}
          >
            <span
              style={{
                fontSize:
                  "26px",

                fontWeight:
                  700,

                color:
                  getScoreColor()
              }}
            >
              {score}%
            </span>

            <span
              style={{
                fontSize:
                  "11px",

                opacity: 0.75
              }}
            >
              SCORE
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "18px"
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: "20px",

              background:
                "rgba(255,255,255,0.05)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
                marginBottom: "12px"
              }}
            >
              <CheckCircle2
                size={20}
                color={
                  getScoreColor()
                }
              />

              <h4
                style={{
                  fontSize:
                    "19px"
                }}
              >
                Result:
                {" "}
                {getScoreLabel()}
              </h4>
            </div>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.76)",

                lineHeight:
                  1.8
              }}
            >
              {feedback}
            </p>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "20px",

              background:
                "rgba(255,255,255,0.05)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
                marginBottom: "12px"
              }}
            >
              <AlertCircle
                size={20}
                color="#f59e0b"
              />

              <h4
                style={{
                  fontSize:
                    "19px"
                }}
              >
                Improvement Tip
              </h4>
            </div>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.76)",

                lineHeight:
                  1.8
              }}
            >
              {
                improvementTip
              }
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",

              padding: "18px",

              borderRadius:
                "18px",

              background:
                "rgba(255,255,255,0.05)"
            }}
          >
            <Sparkles
              size={20}
            />

            <p
              style={{
                color:
                  "rgba(255,255,255,0.72)",

                lineHeight:
                  1.7
              }}
            >
              Continue daily speaking practice
              to improve fluency, confidence,
              and natural pronunciation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
            }
