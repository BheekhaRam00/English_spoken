"use client";

import {
  Trophy,
  Clock3,
  Brain,
  Mic,
  TrendingUp,
  Sparkles
} from "lucide-react";

type SessionSummaryProps = {
  duration?: string;

  fluencyScore?: number;

  totalMessages?: number;

  pronunciationScore?: number;

  newWordsLearned?: number;
};

export default function SessionSummary({
  duration = "12 min",

  fluencyScore = 84,

  totalMessages = 18,

  pronunciationScore = 81,

  newWordsLearned = 6
}: SessionSummaryProps) {
  const stats = [
    {
      icon: (
        <Clock3 size={22} />
      ),

      title:
        "Session Time",

      value: duration
    },

    {
      icon: (
        <Mic size={22} />
      ),

      title:
        "Messages",

      value:
        totalMessages.toString()
    },

    {
      icon: (
        <TrendingUp
          size={22}
        />
      ),

      title:
        "Fluency",

      value: `${fluencyScore}%`
    },

    {
      icon: (
        <Brain size={22} />
      ),

      title:
        "Pronunciation",

      value: `${pronunciationScore}%`
    }
  ];

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
        <Trophy size={24} />

        <h2
          style={{
            fontSize: "28px"
          }}
        >
          Session Summary
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
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          {stats.map(
            (
              stat,
              index
            ) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "20px",

                  background:
                    "rgba(255,255,255,0.05)"
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",

                    borderRadius:
                      "16px",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

                    marginBottom:
                      "16px"
                  }}
                >
                  {stat.icon}
                </div>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.66)",

                    marginBottom:
                      "8px",

                    fontSize:
                      "14px"
                  }}
                >
                  {stat.title}
                </p>

                <h3
                  style={{
                    fontSize:
                      "28px",

                    fontWeight:
                      700
                  }}
                >
                  {stat.value}
                </h3>
              </div>
            )
          )}
        </div>

        <div
          className="glass-card"
          style={{
            padding: "22px",

            marginBottom:
              "22px",

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
              marginBottom: "14px"
            }}
          >
            <Sparkles
              size={20}
            />

            <h3
              style={{
                fontSize:
                  "22px"
              }}
            >
              AI Performance Analysis
            </h3>
          </div>

          <p
            style={{
              color:
                "rgba(255,255,255,0.76)",

              lineHeight:
                1.9
            }}
          >
            Your speaking confidence and
            fluency improved during this
            session. Pronunciation clarity
            is becoming more natural and
            conversational.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",

            padding: "20px",

            borderRadius:
              "20px",

            background:
              "rgba(255,255,255,0.05)"
          }}
        >
          <div>
            <p
              style={{
                color:
                  "rgba(255,255,255,0.68)",

                marginBottom:
                  "6px"
              }}
            >
              New Vocabulary Learned
            </p>

            <h3
              style={{
                fontSize:
                  "30px",

                fontWeight:
                  700
              }}
            >
              {newWordsLearned}
            </h3>
          </div>

          <div
            style={{
              width: "78px",
              height: "78px",

              borderRadius:
                "24px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "linear-gradient(135deg, rgba(147,51,234,0.20), rgba(37,99,235,0.20))"
            }}
          >
            <Brain
              size={34}
            />
          </div>
        </div>
      </div>
    </section>
  );
                  }
