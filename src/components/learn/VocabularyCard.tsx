"use client";

import {
  Volume2,
  Languages,
  Sparkles
} from "lucide-react";

type VocabularyCardProps = {
  word: string;

  meaning: string;

  pronunciation: string;

  example?: string;

  onSpeak?: (
    text: string
  ) => void;
};

export default function VocabularyCard({
  word,
  meaning,
  pronunciation,
  example,
  onSpeak
}: VocabularyCardProps) {
  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "22px",

        background:
          "rgba(255,255,255,0.05)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          gap: "16px",

          marginBottom:
            "18px"
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "10px",
              marginBottom: "8px"
            }}
          >
            <h3
              style={{
                fontSize:
                  "24px",

                fontWeight:
                  700
              }}
            >
              {word}
            </h3>

            <div
              style={{
                padding:
                  "6px 10px",

                borderRadius:
                  "999px",

                background:
                  "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

                display:
                  "flex",

                alignItems:
                  "center",

                gap: "6px"
              }}
            >
              <Sparkles
                size={12}
              />

              <span
                style={{
                  fontSize:
                    "11px",

                  fontWeight:
                    700
                }}
              >
                AI
              </span>
            </div>
          </div>

          <p
            style={{
              color:
                "rgba(255,255,255,0.68)",

              fontSize:
                "15px"
            }}
          >
            Pronunciation:
            {" "}
            {
              pronunciation
            }
          </p>
        </div>

        <button
          onClick={() =>
            onSpeak?.(
              word
            )
          }
          style={{
            width: "48px",
            height: "48px",

            borderRadius:
              "16px",

            background:
              "rgba(255,255,255,0.06)",

            color:
              "#ffffff",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center"
          }}
        >
          <Volume2
            size={20}
          />
        </button>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "18px",

          marginBottom:
            example
              ? "16px"
              : 0,

          background:
            "rgba(255,255,255,0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px"
          }}
        >
          <Languages
            size={18}
          />

          <h4
            style={{
              fontSize:
                "18px"
            }}
          >
            Meaning
          </h4>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.82)",

            lineHeight:
              1.8,

            fontSize:
              "17px"
          }}
        >
          {meaning}
        </p>
      </div>

      {example && (
        <div
          className="glass-card"
          style={{
            padding: "18px",

            background:
              "linear-gradient(90deg, rgba(147,51,234,0.10), rgba(37,99,235,0.10))"
          }}
        >
          <h4
            style={{
              fontSize:
                "18px",

              marginBottom:
                "10px"
            }}
          >
            Example Sentence
          </h4>

          <p
            style={{
              color:
                "rgba(255,255,255,0.76)",

              lineHeight:
                1.8
            }}
          >
            {example}
          </p>
        </div>
      )}
    </div>
  );
}
