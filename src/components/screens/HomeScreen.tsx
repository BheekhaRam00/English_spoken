"use client";

import Link from "next/link";

import {
  Brain,
  Mic,
  BookOpen,
  Trophy,
  Settings,
  Download,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function HomeScreen() {
  const features = [
    {
      title:
        "AI Conversations",

      description:
        "Practice real spoken English conversations with AI.",

      icon: (
        <Brain size={24} />
      ),

      href: "/practice"
    },

    {
      title:
        "Daily Lessons",

      description:
        "Learn practical English used in daily life.",

      icon: (
        <BookOpen size={24} />
      ),

      href: "/learn"
    },

    {
      title:
        "Voice Practice",

      description:
        "Improve pronunciation and speaking confidence.",

      icon: (
        <Mic size={24} />
      ),

      href: "/practice"
    },

    {
      title:
        "Track Progress",

      description:
        "See your fluency improvement and streaks.",

      icon: (
        <Trophy size={24} />
      ),

      href: "/progress"
    }
  ];

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          marginBottom: "32px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "34px",

            overflow: "hidden",

            position: "relative",

            background:
              "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
          }}
        >
          <div
            style={{
              position: "absolute",

              top: "-40px",

              right: "-40px",

              width: "140px",

              height: "140px",

              borderRadius: "50%",

              background:
                "rgba(255,255,255,0.08)",

              filter: "blur(10px)"
            }}
          />

          <div
            style={{
              display: "inline-flex",

              alignItems: "center",

              gap: "10px",

              padding: "10px 18px",

              borderRadius: "999px",

              background:
                "rgba(255,255,255,0.08)",

              marginBottom: "22px"
            }}
          >
            <Sparkles
              size={18}
            />

            <span
              style={{
                fontSize: "14px",

                fontWeight: 600
              }}
            >
              AI Spoken English Coach
            </span>
          </div>

          <h1
            className="page-title"
            style={{
              fontSize: "42px",

              lineHeight: 1.2,

              marginBottom: "18px"
            }}
          >
            FluentPro AI
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.78)",

              lineHeight: 1.9,

              fontSize: "17px",

              marginBottom: "30px"
            }}
          >
            Practice spoken English naturally with
            AI-powered conversations, pronunciation
            feedback, offline learning, and real-time
            speaking practice.
          </p>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: "14px"
            }}
          >
            <Link href="/practice">
              <button
                className="primary-button"
                style={{
                  width: "100%",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  gap: "10px"
                }}
              >
                Start Practice

                <ArrowRight
                  size={18}
                />
              </button>
            </Link>

            <Link href="/learn">
              <button
                className="secondary-button"
                style={{
                  width: "100%"
                }}
              >
                Learn English
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",

          gap: "18px",

          marginBottom: "30px"
        }}
      >
        {features.map(
          (feature) => (
            <Link
              key={
                feature.title
              }
              href={
                feature.href
              }
            >
              <div
                className="glass-card"
                style={{
                  padding:
                    "24px",

                  display:
                    "flex",

                  alignItems:
                    "flex-start",

                  gap: "18px",

                  transition:
                    "0.2s ease"
                }}
              >
                <div
                  style={{
                    width: "62px",

                    height:
                      "62px",

                    borderRadius:
                      "20px",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                  }}
                >
                  {
                    feature.icon
                  }
                </div>

                <div
                  style={{
                    flex: 1
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        "22px",

                      marginBottom:
                        "8px"
                    }}
                  >
                    {
                      feature.title
                    }
                  </h2>

                  <p
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",

                      lineHeight:
                        1.7
                    }}
                  >
                    {
                      feature.description
                    }
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  style={{
                    opacity: 0.7
                  }}
                />
              </div>
            </Link>
          )
        )}
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap: "14px",

          marginBottom: "28px"
        }}
      >
        <Link href="/progress">
          <div
            className="glass-card"
            style={{
              padding: "22px",

              textAlign: "center"
            }}
          >
            <Trophy
              size={30}
              style={{
                margin:
                  "0 auto 14px auto"
              }}
            />

            <h3
              style={{
                marginBottom:
                  "8px"
              }}
            >
              Progress
            </h3>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.68)",

                fontSize: "14px"
              }}
            >
              View learning stats
            </p>
          </div>
        </Link>

        <Link href="/settings">
          <div
            className="glass-card"
            style={{
              padding: "22px",

              textAlign: "center"
            }}
          >
            <Settings
              size={30}
              style={{
                margin:
                  "0 auto 14px auto"
              }}
            />

            <h3
              style={{
                marginBottom:
                  "8px"
              }}
            >
              Settings
            </h3>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.68)",

                fontSize: "14px"
              }}
            >
              Customize app
            </p>
          </div>
        </Link>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "26px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "14px",

            marginBottom: "16px"
          }}
        >
          <Download
            size={24}
          />

          <h2
            style={{
              fontSize: "24px"
            }}
          >
            Install App
          </h2>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.76)",

            lineHeight: 1.8,

            marginBottom: "20px"
          }}
        >
          Install FluentPro AI on your phone for
          offline learning and a native app
          experience.
        </p>

        <Link href="/install">
          <button className="primary-button">
            Open Install Page
          </button>
        </Link>
      </section>
    </main>
  );
              }
