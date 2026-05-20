"use client";

import {
  BookOpen,
  Volume2,
  Sparkles
} from "lucide-react";

type VocabularyItem = {
  word: string;

  meaning: string;

  pronunciation: string;
};

type LessonCardProps = {
  category: string;

  english: string;

  hindi: string;

  vocabulary: VocabularyItem[];

  onSpeak?: (
    text: string
  ) => void;
};

export default function LessonCard({
  category,
  english,
  hindi,
  vocabulary,
  onSpeak
}: LessonCardProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "28px"
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",

          padding: "10px 16px",

          borderRadius: "999px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

          marginBottom: "24px"
        }}
      >
        <BookOpen size={18} />

        <span
          style={{
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          {category}
        </span>
      </div>

      <h2
        style={{
          fontSize: "28px",
          lineHeight: 1.7,
          marginBottom: "24px"
        }}
      >
        {english}
      </h2>

      <button
        className="primary-button"
        onClick={() =>
          onSpeak?.(
            english
          )
        }
        style={{
          marginBottom: "28px",

          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          gap: "10px"
        }}
      >
        <Volume2 size={20} />

        Listen Pronunciation
      </button>

      <div
        className="glass-card"
        style={{
          padding: "22px",

          borderRadius:
            "24px",

          background:
            "rgba(255,255,255,0.05)",

          marginBottom: "28px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px"
          }}
        >
          <Sparkles size={18} />

          <h3
            style={{
              fontSize: "18px"
            }}
          >
            Hindi Translation
          </h3>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.84)",

            lineHeight: 1.9,

            fontSize: "18px"
          }}
        >
          {hindi}
        </p>
      </div>

      <div>
        <h3
          style={{
            marginBottom: "18px",
            fontSize: "22px"
          }}
        >
          Vocabulary
        </h3>

        <div
          style={{
            display: "grid",
            gap: "16px"
          }}
        >
          {vocabulary.map(
            (
              item
            ) => (
              <div
                key={item.word}
                className="glass-card"
                style={{
                  padding: "20px",

                  background:
                    "rgba(255,255,255,0.05)"
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    gap: "12px",

                    marginBottom:
                      "12px"
                  }}
                >
                  <h4
                    style={{
                      fontSize:
                        "20px"
                    }}
                  >
                    {
                      item.word
                    }
                  </h4>

                  <button
                    onClick={() =>
                      onSpeak?.(
                        item.word
                      )
                    }
                    style={{
                      width: "42px",

                      height: "42px",

                      borderRadius:
                        "14px",

                      background:
                        "rgba(255,255,255,0.06)",

                      color:
                        "#ffffff",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center"
                    }}
                  >
                    <Volume2
                      size={18}
                    />
                  </button>
                </div>

                <p
                  style={{
                    marginBottom:
                      "10px",

                    color:
                      "rgba(255,255,255,0.86)"
                  }}
                >
                  Meaning:
                  {" "}
                  {
                    item.meaning
                  }
                </p>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)"
                  }}
                >
                  Pronunciation:
                  {" "}
                  {
                    item.pronunciation
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
