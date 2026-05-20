"use client";

import {
  Flame,
  Trophy,
  Brain,
  Clock3,
  ArrowRight,
  Sparkles
} from "lucide-react";

type DailyChallengeProps = {
  title?: string;

  description?: string;

  progress?: number;

  reward?: string;

  duration?: string;

  onStart?: () => void;
};

export default function DailyChallenge({
  title = "Speak for 10 Minutes",

  description = "Practice natural spoken English continuously for 10 minutes without switching to Hindi.",

  progress = 65,

  reward = "250 XP",

  duration = "10 Min",

  onStart
}: DailyChallengeProps) {
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
            "20px"
        }}
      >
        <Flame size={24} />

        <h2
          style={{
            fontSize: "28px"
          }}
        >
          Daily Challenge
        </h2>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "28px",

          background:
            "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(239,68,68,0.16))",

          position:
            "relative",

          overflow:
            "hidden"
        }}
      >
        <div
          style={{
            position:
              "absolute",

            top: "-70px",

            right: "-70px",

            width: "180px",

            height: "180px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,0.06)"
          }}
        />

        <div
          style={{
            position:
              "relative",

            zIndex: 1
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "flex-start",

              justifyContent:
                "space-between",

              gap: "18px",

              marginBottom:
                "24px"
            }}
          >
            <div>
              <div
                style={{
                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  gap: "8px",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  background:
                    "rgba(255,255,255,0.08)",

                  marginBottom:
                    "16px"
                }}
              >
                <Sparkles
                  size={14}
                />

                <span
                  style={{
                    fontSize:
                      "12px",

                    fontWeight:
                      700
                  }}
                >
                  TODAY'S MISSION
                </span>
              </div>

              <h3
                style={{
                  fontSize:
                    "30px",

                  lineHeight:
                    1.3,

                  marginBottom:
                    "14px"
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.76)",

                  lineHeight:
                    1.9
                }}
              >
                {
                  description
                }
              </p>
            </div>

            <div
              style={{
                width: "82px",
                height: "82px",

                minWidth:
                  "82px",

                borderRadius:
                  "26px",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "rgba(255,255,255,0.08)"
              }}
            >
              <Brain
                size={38}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: "16px",

              marginBottom:
                "24px"
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: "18px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "10px",

                  marginBottom:
                    "10px"
                }}
              >
                <Trophy
                  size={20}
                />

                <span
                  style={{
                    fontWeight:
                      600
                  }}
                >
                  Reward
                </span>
              </div>

              <h4
                style={{
                  fontSize:
                    "24px"
                }}
              >
                {reward}
              </h4>
            </div>

            <div
              className="glass-card"
              style={{
                padding: "18px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "10px",

                  marginBottom:
                    "10px"
                }}
              >
                <Clock3
                  size={20}
                />

                <span
                  style={{
                    fontWeight:
                      600
                  }}
                >
                  Duration
                </span>
              </div>

              <h4
                style={{
                  fontSize:
                    "24px"
                }}
              >
                {duration}
              </h4>
            </div>
          </div>

          <div
            style={{
              marginBottom:
                "24px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                marginBottom:
                  "10px"
              }}
            >
              <span
                style={{
                  fontWeight:
                    600
                }}
              >
                Progress
              </span>

              <span
                style={{
                  color:
                    "rgba(255,255,255,0.72)"
                }}
              >
                {progress}%
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",

                borderRadius:
                  "999px",

                background:
                  "rgba(255,255,255,0.08)",

                overflow:
                  "hidden"
              }}
            >
              <div
                style={{
                  width: `${progress}%`,

                  height:
                    "100%",

                  borderRadius:
                    "999px",

                  background:
                    "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.75))"
                }}
              />
            </div>
          </div>

          <button
            className="primary-button"
            onClick={
              onStart
            }
            style={{
              width: "100%",

              height: "60px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap: "12px"
            }}
          >
            Start Challenge

            <ArrowRight
              size={20}
            />
          </button>
        </div>
      </div>
    </section>
  );
              }
