"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Mic,
  BookOpen,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function ProgressPage() {
  const stats = [
    {
      title: "Lessons Completed",
      value: "24",
      icon: <BookOpen size={24} />
    },

    {
      title: "Practice Sessions",
      value: "18",
      icon: <Mic size={24} />
    },

    {
      title: "Fluency Score",
      value: "82%",
      icon: <TrendingUp size={24} />
    },

    {
      title: "Daily Streak",
      value: "7 Days",
      icon: <Flame size={24} />
    }
  ];

  const achievements = [
    "Completed first conversation practice",
    "Spoke English for 10 minutes continuously",
    "Finished 20 learning lessons",
    "Improved pronunciation consistency"
  ];

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "28px"
        }}
      >
        <Link href="/">
          <button
            className="secondary-button"
            style={{
              width: "54px",
              height: "54px",
              padding: 0,
              borderRadius: "18px"
            }}
          >
            <ArrowLeft size={22} />
          </button>
        </Link>

        <div>
          <h1
            className="page-title"
            style={{
              marginBottom: "4px",
              fontSize: "34px"
            }}
          >
            Your Progress
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)"
            }}
          >
            Track your English learning journey.
          </p>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",
          gap: "18px",
          marginBottom: "34px"
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="glass-card"
            style={{
              padding: "24px",

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              background:
                "linear-gradient(90deg, rgba(147,51,234,0.10), rgba(37,99,235,0.10))"
            }}
          >
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  marginBottom: "10px",
                  fontSize: "15px"
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  fontWeight: 700
                }}
              >
                {stat.value}
              </h2>
            </div>

            <div
              style={{
                width: "64px",
                height: "64px",

                borderRadius: "22px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                  "linear-gradient(90deg, #9333ea, #2563eb)"
              }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
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
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px"
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
          {achievements.map((achievement) => (
            <div
              key={achievement}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",

                padding: "18px",

                borderRadius: "20px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <CheckCircle2
                size={22}
                style={{
                  minWidth: "22px",
                  marginTop: "2px"
                }}
              />

              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.7
                }}
              >
                {achievement}
              </p>
            </div>
          ))}
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
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px"
          }}
        >
          <TrendingUp size={24} />

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
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.9,
            marginBottom: "22px"
          }}
        >
          Practice speaking for at least 10 minutes daily. Consistency
          is more important than perfection.
        </p>

        <Link href="/practice">
          <button className="primary-button">
            Continue Practice
          </button>
        </Link>
      </section>
    </main>
  );
}
