"use client";

import { Volume2 } from "lucide-react";

type VocabularyItem = {
  word: string;
  meaning: string;
  pronunciation: string;
};

type VocabularyCardProps = {
  items: VocabularyItem[];

  onSpeak?: (text: string) => void;
};

export default function VocabularyCard({
  items,
  onSpeak
}: VocabularyCardProps) {
  return (
    <section
      className="fade-in"
      style={{
        display: "grid",
        gap: "16px"
      }}
    >
      <div
        style={{
          marginBottom: "4px"
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700
          }}
        >
          Vocabulary
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,0.68)",
            marginTop: "8px",
            lineHeight: 1.7
          }}
        >
          Learn important words used in the sentence.
        </p>
      </div>

      {items.map((item) => (
        <div
          key={item.word}
          className="glass-card"
          style={{
            padding: "22px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",

              gap: "12px",

              marginBottom: "14px"
            }}
          >
            <h4
              style={{
                fontSize: "22px",
                fontWeight: 700
              }}
            >
              {item.word}
            </h4>

            <button
              onClick={() =>
                onSpeak?.(item.word)
              }
              style={{
                width: "44px",
                height: "44px",

                borderRadius: "14px",

                background:
                  "rgba(255,255,255,0.06)",

                color: "#ffffff",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                transition: "0.2s ease"
              }}
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: "10px"
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.84)",
                lineHeight: 1.7
              }}
            >
              <span
                style={{
                  fontWeight: 600
                }}
              >
                Meaning:
              </span>{" "}
              {item.meaning}
            </p>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.7
              }}
            >
              <span
                style={{
                  fontWeight: 600
                }}
              >
                Pronunciation:
              </span>{" "}
              {item.pronunciation}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
