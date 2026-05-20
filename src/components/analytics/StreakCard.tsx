"use client";

import {
  Flame,
  Calendar,
  Trophy,
  Sparkles
} from "lucide-react";

type StreakCardProps = {
  streak: number;
};

export default function StreakCard({
  streak
}: StreakCardProps) {
  const days = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S"
  ];

  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "28px",

        background:
          "linear-gradient(135deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap: "14px",

          marginBottom:
            "26px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "14px"
          }}
        >
          <div
            style={{
              width: "70px",

              height: "70px",

              borderRadius:
                "22px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "linear-gradient(135deg, rgba(249,115,22,0.25), rgba(239,68,68,0.25))"
            }}
          >
            <Flame
              size={34}
            />
          </div>

          <div>
            <h2
              style={{
                fontSize:
                  "28px",

                marginBottom:
                  "4px"
              }}
            >
              {streak} Day Streak
            </h2>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.72)"
              }}
            >
              Consistent speaking practice
            </p>
          </div>
        </div>

        <div
          style={{
            width: "56px",

            height: "56px",

            borderRadius:
              "18px",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "rgba(255,255,255,0.08)"
          }}
        >
          <Trophy
            size={26}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(7, 1fr)",

          gap: "10px",

          marginBottom:
            "24px"
        }}
      >
        {days.map(
          (
            day,
            index
          ) => (
            <div
              key={index}
              style={{
                height: "68px",

                borderRadius:
                  "18px",

                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: "8px",

                background:
                  index < streak
                    ? "linear-gradient(180deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.06)"
              }}
            >
              <span
                style={{
                  fontSize:
                    "13px",

                  fontWeight:
                    600,

                  opacity:
                    0.9
                }}
              >
                {day}
              </span>

              {index <
              streak ? (
                <Flame
                  size={18}
                />
              ) : (
                <Calendar
                  size={16}
                  opacity={
                    0.5
                  }
                />
              )}
            </div>
          )
        )}
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

            marginBottom:
              "10px"
          }}
        >
          <Sparkles
            size={18}
          />

          <h3
            style={{
              fontSize:
                "20px"
            }}
          >
            Motivation
          </h3>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.74)",

            lineHeight: 1.8
          }}
        >
          Every day of speaking practice builds
          confidence, fluency, and natural
          communication skills. Keep your streak
          alive daily.
        </p>
      </div>
    </div>
  );
}
