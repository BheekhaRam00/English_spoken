"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  BookOpen,
  Mic,
  MessageCircle,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => {
          console.error(
            "Service Worker registration failed:",
            error
          );
        });
    }
  }, []);

  return (
    <main className="page-container">
      <section className="fade-in">
        <div
          className="glass-card"
          style={{
            padding: "32px 24px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              margin: "0 auto 24px",
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow:
                "0 0 40px rgba(147, 51, 234, 0.25), 0 0 80px rgba(37, 99, 235, 0.15)"
            }}
          >
            <img
              src="/icons/icon-512.png"
              alt="FluentPro AI"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>

          <h1 className="page-title">
            FluentPro AI
          </h1>

          <p className="page-subtitle">
            Improve your spoken English naturally with AI-powered
            learning and real-time conversation practice.
          </p>

          <Link href="/learn">
            <button className="primary-button">
              Start Learning
            </button>
          </Link>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          marginTop: "32px",
          display: "grid",
          gap: "20px"
        }}
      >
        <Link href="/learn">
          <div
            className="glass-card"
            style={{
              padding: "24px"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                background:
                  "linear-gradient(90deg, #9333ea, #2563eb)"
              }}
            >
              <BookOpen size={28} />
            </div>

            <h2
              style={{
                fontSize: "24px",
                marginBottom: "12px"
              }}
            >
              Learn English
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7
              }}
            >
              Learn practical English sentences with Hindi
              translation, pronunciation, and vocabulary breakdown.
            </p>
          </div>
        </Link>

        <Link href="/practice">
          <div
            className="glass-card"
            style={{
              padding: "24px"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                background:
                  "linear-gradient(90deg, #2563eb, #06b6d4)"
              }}
            >
              <Mic size={28} />
            </div>

            <h2
              style={{
                fontSize: "24px",
                marginBottom: "12px"
              }}
            >
              Practice Conversation
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7
              }}
            >
              Speak or type naturally with AI and receive intelligent
              voice responses in real-time.
            </p>
          </div>
        </Link>
      </section>

      <section
        className="fade-in"
        style={{
          marginTop: "40px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "28px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "18px"
            }}
          >
            <Sparkles size={24} />

            <h2
              style={{
                fontSize: "24px"
              }}
            >
              Smart AI Practice
            </h2>
          </div>

          <div className="waveform">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gap: "16px"
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "16px",
                borderRadius: "18px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px"
                }}
              >
                <MessageCircle size={18} />

                <span
                  style={{
                    fontWeight: 600
                  }}
                >
                  AI
                </span>
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.7
                }}
              >
                Tell me about your work experience.
              </p>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))",

                padding: "16px",

                borderRadius: "18px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px"
                }}
              >
                <Mic size={18} />

                <span
                  style={{
                    fontWeight: 600
                  }}
                >
                  You
                </span>
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.92)",
                  lineHeight: 1.7
                }}
              >
                I work in an interior design company and manage client
                communication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
                  }
