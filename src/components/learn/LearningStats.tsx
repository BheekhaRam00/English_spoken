"use client";

import {
  BookOpen,
  Trophy,
  Flame,
  Brain,
  TrendingUp,
  Sparkles
} from "lucide-react";

type LearningStatsProps = {
  completedLessons?: number;

  streakDays?: number;

  vocabularyLearned?: number;

  fluencyScore?: number;
};

export default function LearningStats({
  completedLessons = 24,

  streakDays = 7,

  vocabularyLearned = 142,

  fluencyScore = 82
}: LearningStatsProps) {
  const stats = [
    {
      icon: (
        <BookOpen size={24} />
      ),

      title:
        "Lessons",

      value:
        completedLessons.toString(),

      background:
        "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
    },

    {
      icon: (
        <Flame size={24} />
      ),

      title:
        "Streak",

      value: `${streakDays} Days`,

      background:
        "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(239,68,68,0.18))"
    },

    {
      icon: (
        <Brain size={24} />
      ),

      title:
        "Vocabulary",

      value:
        vocabularyLearned.toString(),

      background:
        "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(34,197,94,0.18))"
    },

    {
      icon: (
        <TrendingUp
          size={24}
        />
      ),

      title:
        "Fluency",

      value: `${fluencyScore}%`,

      background:
        "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(147,51,234,0.18))"
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
          Learning Progress
        </h2>
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
        {stats.map(
          (
            stat,
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
                    stat.background,

                  marginBottom:
                    "18px"
                }}
              >
                {stat.icon}
              </div>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",

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
          padding: "24px",

          background:
            "linear-gradient(135deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",

            marginBottom:
              "14px"
          }}
        >
          <Sparkles
            size={22}
          />

          <h3
            style={{
              fontSize:
                "24px"
            }}
          >
            AI Learning Insight
          </h3>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.76)",

            lineHeight:
              1.9,

            marginBottom:
              "18px"
          }}
        >
          Your English communication skills
          are improving steadily. Regular
          speaking practice and vocabulary
          revision are helping you become
          more fluent and confident.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            padding: "18px",

            borderRadius:
              "18px",

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
              Daily Goal
            </p>

            <h4
              style={{
                fontSize:
                  "22px"
              }}
            >
              15 Minutes Speaking
            </h4>
          </div>

          <div
            style={{
              width: "72px",
              height: "72px",

              borderRadius:
                "22px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "rgba(255,255,255,0.08)"
            }}
          >
            <Flame
              size={32}
            />
          </div>
        </div>
      </div>
    </section>
  );
            }
