"use client";

import {
  Sparkles,
  MessageSquareText
} from "lucide-react";

type ConversationSuggestionsProps = {
  suggestions: string[];

  onSelect: (
    text: string
  ) => void;
};

export default function ConversationSuggestions({
  suggestions,
  onSelect
}: ConversationSuggestionsProps) {
  return (
    <section
      className="fade-in"
      style={{
        marginTop: "24px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px"
        }}
      >
        <Sparkles size={20} />

        <h2
          style={{
            fontSize: "24px"
          }}
        >
          AI Suggestions
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px"
        }}
      >
        {suggestions.map(
          (
            suggestion,
            index
          ) => (
            <button
              key={`${suggestion}-${index}`}
              onClick={() =>
                onSelect(
                  suggestion
                )
              }
              className="glass-card"
              style={{
                width: "100%",

                padding: "20px",

                display: "flex",

                alignItems:
                  "flex-start",

                gap: "14px",

                textAlign:
                  "left",

                background:
                  "rgba(255,255,255,0.05)",

                transition:
                  "0.2s ease"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",

                  minWidth:
                    "48px",

                  borderRadius:
                    "16px",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
                }}
              >
                <MessageSquareText
                  size={22}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize:
                      "17px",

                    marginBottom:
                      "8px",

                    lineHeight:
                      1.5
                  }}
                >
                  {suggestion}
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.66)",

                    fontSize:
                      "14px",

                    lineHeight:
                      1.6
                  }}
                >
                  Tap to instantly use this
                  sentence in conversation.
                </p>
              </div>
            </button>
          )
        )}
      </div>
    </section>
  );
}
