"use client";

import {
  Captions,
  Mic,
  Brain,
  Volume2
} from "lucide-react";

type LiveTranscriptProps = {
  userText?: string;

  aiText?: string;

  listening?: boolean;

  speaking?: boolean;
};

export default function LiveTranscript({
  userText = "",

  aiText = "",

  listening = false,

  speaking = false
}: LiveTranscriptProps) {
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
        <Captions size={22} />

        <h2
          style={{
            fontSize: "26px"
          }}
        >
          Live Transcript
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "22px",

            background:
              listening
                ? "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
                : "rgba(255,255,255,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",

                borderRadius:
                  "16px",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "rgba(255,255,255,0.08)"
              }}
            >
              <Mic size={22} />
            </div>

            <div>
              <h3
                style={{
                  fontSize:
                    "20px",

                  marginBottom:
                    "4px"
                }}
              >
                Your Speech
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.66)"
                }}
              >
                Real-time voice recognition
              </p>
            </div>
          </div>

          <div
            style={{
              minHeight: "80px",

              padding: "18px",

              borderRadius:
                "18px",

              background:
                "rgba(255,255,255,0.04)"
            }}
          >
            <p
              style={{
                color:
                  userText
                    ? "#ffffff"
                    : "rgba(255,255,255,0.48)",

                lineHeight:
                  1.9,

                fontSize:
                  "16px"
              }}
            >
              {userText ||
                (listening
                  ? "Listening to your voice..."
                  : "Your spoken sentence will appear here.")}
            </p>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "22px",

            background:
              speaking
                ? "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
                : "rgba(255,255,255,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",

                borderRadius:
                  "16px",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "rgba(255,255,255,0.08)"
              }}
            >
              <Brain size={22} />
            </div>

            <div>
              <h3
                style={{
                  fontSize:
                    "20px",

                  marginBottom:
                    "4px"
                }}
              >
                AI Response
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.66)"
                }}
              >
                FluentPro AI live response
              </p>
            </div>
          </div>

          <div
            style={{
              minHeight: "80px",

              padding: "18px",

              borderRadius:
                "18px",

              background:
                "rgba(255,255,255,0.04)"
            }}
          >
            <p
              style={{
                color:
                  aiText
                    ? "#ffffff"
                    : "rgba(255,255,255,0.48)",

                lineHeight:
                  1.9,

                fontSize:
                  "16px"
              }}
            >
              {aiText ||
                (speaking
                  ? "AI is generating response..."
                  : "AI response transcript will appear here.")}
            </p>
          </div>

          {aiText && (
            <button
              style={{
                marginTop: "16px",

                height: "46px",

                padding:
                  "0 18px",

                borderRadius:
                  "16px",

                background:
                  "rgba(255,255,255,0.06)",

                color:
                  "#ffffff",

                display: "flex",

                alignItems:
                  "center",

                gap: "10px"
              }}
            >
              <Volume2
                size={18}
              />

              Replay AI Voice
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
