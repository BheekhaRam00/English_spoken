"use client";

import {
  TrendingUp,
  Activity
} from "lucide-react";

type FluencyChartProps = {
  fluencyScore: number;
};

export default function FluencyChart({
  fluencyScore
}: FluencyChartProps) {
  const chartBars = [
    Math.max(
      fluencyScore - 35,
      10
    ),

    Math.max(
      fluencyScore - 22,
      20
    ),

    Math.max(
      fluencyScore - 14,
      30
    ),

    Math.max(
      fluencyScore - 8,
      40
    ),

    fluencyScore
  ];

  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "28px"
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap: "12px",

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

            gap: "12px"
          }}
        >
          <TrendingUp
            size={24}
          />

          <div>
            <h2
              style={{
                fontSize:
                  "26px",

                marginBottom:
                  "4px"
              }}
            >
              Fluency Progress
            </h2>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.68)"
              }}
            >
              Spoken English improvement
            </p>
          </div>
        </div>

        <div
          style={{
            width: "68px",

            height: "68px",

            borderRadius:
              "22px",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "linear-gradient(135deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

            fontSize: "20px",

            fontWeight: 700
          }}
        >
          {fluencyScore}%
        </div>
      </div>

      <div
        style={{
          display: "flex",

          alignItems: "end",

          justifyContent:
            "space-between",

          gap: "14px",

          height: "220px",

          marginBottom:
            "18px"
        }}
      >
        {chartBars.map(
          (
            value,
            index
          ) => (
            <div
              key={index}
              style={{
                flex: 1,

                display:
                  "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "end",

                gap: "10px"
              }}
            >
              <div
                style={{
                  width: "100%",

                  borderRadius:
                    "18px 18px 10px 10px",

                  height: `${value * 1.8}px`,

                  minHeight:
                    "20px",

                  background:
                    index ===
                    chartBars.length -
                      1
                      ? "linear-gradient(180deg, #9333ea, #2563eb)"
                      : "rgba(255,255,255,0.10)",

                  transition:
                    "0.3s ease"
                }}
              />

              <span
                style={{
                  fontSize:
                    "13px",

                  color:
                    "rgba(255,255,255,0.65)"
                }}
              >
                W{index + 1}
              </span>
            </div>
          )
        )}
      </div>

      <div
        className="glass-card"
        style={{
          padding: "20px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.10), rgba(37,99,235,0.10))"
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "12px",

            marginBottom:
              "10px"
          }}
        >
          <Activity
            size={20}
          />

          <h3
            style={{
              fontSize:
                "20px"
            }}
          >
            AI Analysis
          </h3>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.74)",

            lineHeight: 1.8
          }}
        >
          Your speaking fluency is improving
          steadily. Continue daily speaking
          practice to improve confidence,
          pronunciation, and natural
          communication.
        </p>
      </div>
    </div>
  );
}
