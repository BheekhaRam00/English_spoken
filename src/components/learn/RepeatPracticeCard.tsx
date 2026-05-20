"use client";

import {
  RotateCcw,
  Volume2,
  Mic,
  Sparkles
} from "lucide-react";

type RepeatPracticeCardProps = {
  sentence: string;

  onListen?: () => void;

  onRepeat?: () => void;
};

export default function RepeatPracticeCard({
  sentence,
  onListen,
  onRepeat
}: RepeatPracticeCardProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "28px",

        marginTop: "28px",

        background:
          "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",

          marginBottom:
            "18px"
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
              "rgba(255,255,255,0.08)"
          }}
        >
          <RotateCcw
            size={28}
          />
        </div>

        <div>
          <h2
            style={{
              fontSize:
                "26px",

              marginBottom:
                "4px"
            }}
          >
            Repeat Practice
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,0.70)"
            }}
          >
            Listen and repeat loudly for
            better fluency.
          </p>
        </div>
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
            alignItems: "center",
            gap: "10px",

            marginBottom:
              "14px"
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
            Practice Sentence
          </h3>
        </div>

        <p
          style={{
            fontSize:
              "22px",

            lineHeight:
              1.9,

            color:
              "#ffffff"
          }}
        >
          {sentence}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",

          gap: "14px"
        }}
      >
        <button
          className="primary-button"
          onClick={
            onListen
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            gap: "10px"
          }}
        >
          <Volume2
            size={20}
          />

          Listen
        </button>

        <button
          className="secondary-button"
          onClick={
            onRepeat
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            gap: "10px"
          }}
        >
          <Mic size={20} />

          Repeat
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",

          padding: "18px",

          borderRadius:
            "18px",

          background:
            "rgba(255,255,255,0.05)"
        }}
      >
        <p
          style={{
            color:
              "rgba(255,255,255,0.72)",

            lineHeight:
              1.8
          }}
        >
          Practice tip: Focus on sentence
          rhythm, pauses, and pronunciation
          clarity instead of speaking very
          fast.
        </p>
      </div>
    </section>
  );
}
