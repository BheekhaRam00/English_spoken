"use client";

import Link from "next/link";

import {
  Flame,
  Trophy,
  Mic,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from "lucide-react";

import {
  ProgressEngine
} from "@/lib/progress-engine";

import StatsCard from "@/components/analytics/StatsCard";

import StreakCard from "@/components/analytics/StreakCard";

import FluencyChart from "@/components/analytics/FluencyChart";

export default function ProgressScreen() {
  const progressEngine =
    new ProgressEngine();

  const summary =
    progressEngine.getSummary();

  const achievements =
    progressEngine.buildAchievementData();

  const stats = [
    {
      title:
        "Lessons Completed",

      value:
        summary.completedLessons.toString(),

      icon: (
        <BookOpen size={24} />
      )
    },

    {
      title:
        "Practice Sessions",

      value:
        summary.practiceSessions.toString(),

      icon: (
        <Mic size={24} />
      )
    },

    {
      title:
        "Fluency Score",

      value: `${summary.fluencyAverage}%`,

      icon: (
        <TrendingUp size={24} />
      )
    },

    {
      title:
        "Daily Streak",

      value: `${summary.streak} Days`,

      icon: (
        <Flame size={24} />
      )
    }
  ];

  const achievementList = [
    {
      active:
        achievements.beginnerCompleted,

      text:
        "Completed multiple learning lessons"
    },

    {
      active:
        achievements.activeLearner,

      text:
        "Practiced spoken English regularly"
    },

    {
      active:
        achievements.fluencyImproved,

      text:
        "Improved pronunciation and fluency"
    },

    {
      active:
        achievements.consistencyMaster,

      text:
        "Maintained daily speaking streak"
    }
  ];

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          marginBottom: "28px"
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{
              marginBottom: "6px",
              fontSize: "34px"
            }}
          >
            Your Progress
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            Track your spoken English improvement.
          </p>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",
          gap: "18px",
          marginBottom: "30px"
        }}
      >
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </section>

      <section
        className="fade-in"
        style={{
          marginBottom: "30px"
        }}
      >
        <FluencyChart
          fluencyScore={
            summary.fluencyAverage
          }
        />
      </section>

      <section
        className="fade-in"
        style={{
          marginBottom: "30px"
        }}
      >
        <StreakCard
          streak={
            summary.streak
          }
        />
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom: "30px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            marginBottom:
              "22px"
          }}
        >
          <Trophy size={24} />

          <h2
            style={{
              fontSize: "28px"
            }}
          >
            Achievements
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px"
          }}
        >
          {achievementList.map(
            (
              achievement
            ) => (
              <div
                key={
                  achievement.text
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "flex-start",

                  gap: "14px",

                  padding:
                    "18px",

                  borderRadius:
                    "20px",

                  background:
                    achievement.active
                      ? "rgba(34,197,94,0.10)"
                      : "rgba(255,255,255,0.05)",

                  border:
                    achievement.active
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(255,255,255,0.04)"
                }}
              >
                <CheckCircle2
                  size={22}
                  style={{
                    minWidth:
                      "22px",

                    marginTop:
                      "2px",

                    opacity:
                      achievement.active
                        ? 1
                        : 0.5
                  }}
                />

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.82)",

                    lineHeight:
                      1.7
                  }}
                >
                  {
                    achievement.text
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            marginBottom:
              "16px"
          }}
        >
          <TrendingUp
            size={24}
          />

          <h2
            style={{
              fontSize: "26px"
            }}
          >
            Improvement Tip
          </h2>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.78)",

            lineHeight: 1.9,

            marginBottom:
              "22px"
          }}
        >
          Daily speaking practice improves
          fluency much faster than passive
          learning. Practice consistently for
          better confidence.
        </p>

        <Link href="/practice">
          <button
            className="primary-button"
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "10px"
            }}
          >
            Continue Practice

            <ArrowRight
              size={18}
            />
          </button>
        </Link>
      </section>
    </main>
  );
            }
