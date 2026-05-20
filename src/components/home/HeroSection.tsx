"use client";

import Link from "next/link";

import {
  Sparkles,
  Mic,
  Brain,
  ArrowRight,
  Volume2
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="fade-in"
      style={{
        marginBottom: "32px"
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "32px",

          overflow: "hidden",

          position: "relative",

          background:
            "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
        }}
      >
        <div
          style={{
            position: "absolute",

            top: "-80px",

            right: "-80px",

            width: "220px",

            height: "220px",

            borderRadius:
              "50%",

            background:
              "rgba(147,51,234,0.14)",

            filter:
              "blur(20px)"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1
          }}
        >
          <div
            style={{
              display: "inline-flex",

              alignItems:
                "center",

              gap: "8px",

              padding:
                "10px 16px",

              borderRadius:
                "999px",

              background:
                "rgba(255,255,255,0.08)",

              marginBottom:
                "22px"
            }}
          >
            <Sparkles
              size={16}
            />

            <span
              style={{
                fontSize:
                  "13px",

                fontWeight:
                  700
              }}
            >
              AI Powered English Learning
            </span>
          </div>

          <h1
            style={{
              fontSize:
                "42px",

              lineHeight:
                1.2,

              marginBottom:
                "18px",

              fontWeight:
                800
            }}
          >
            Speak English
            Naturally with
            FluentPro AI
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.78)",

              lineHeight:
                1.9,

              fontSize:
                "17px",

              marginBottom:
                "28px"
            }}
          >
            Practice real conversations,
            improve pronunciation, build
            vocabulary, and gain confidence
            with AI-powered speaking
            practice.
          </p>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: "14px",

              marginBottom:
                "28px"
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: "18px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <Mic
                size={24}
                style={{
                  marginBottom:
                    "12px"
                }}
              />

              <h3
                style={{
                  fontSize:
                    "18px",

                  marginBottom:
                    "8px"
                }}
              >
                AI Speaking
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",

                  lineHeight:
                    1.7,

                  fontSize:
                    "14px"
                }}
              >
                Real voice conversation
                practice with AI.
              </p>
            </div>

            <div
              className="glass-card"
              style={{
                padding: "18px",

                background:
                  "rgba(255,255,255,0.05)"
              }}
            >
              <Volume2
                size={24}
                style={{
                  marginBottom:
                    "12px"
                }}
              />

              <h3
                style={{
                  fontSize:
                    "18px",

                  marginBottom:
                    "8px"
                }}
              >
                Pronunciation
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",

                  lineHeight:
                    1.7,

                  fontSize:
                    "14px"
                }}
              >
                Improve fluency and
                speaking confidence.
              </p>
            </div>
          </div>

          <Link href="/practice">
            <button
              className="primary-button"
              style={{
                width: "100%",

                height: "62px",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: "12px",

                fontSize:
                  "17px"
              }}
            >
              <Brain
                size={22}
              />

              Start AI Practice

              <ArrowRight
                size={20}
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
