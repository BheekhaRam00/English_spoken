"use client";

import Link from "next/link";

import {
  Mic,
  BookOpen,
  Trophy,
  Settings,
  ArrowRight,
  Brain
} from "lucide-react";

const actions = [
  {
    title:
      "AI Practice",

    description:
      "Start real-time spoken English conversation.",

    href: "/practice",

    icon: (
      <Mic size={24} />
    ),

    background:
      "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
  },

  {
    title:
      "Learn Lessons",

    description:
      "Daily English speaking lessons and vocabulary.",

    href: "/learn",

    icon: (
      <BookOpen
        size={24}
      />
    ),

    background:
      "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(34,197,94,0.18))"
  },

  {
    title:
      "Track Progress",

    description:
      "Monitor fluency, streak, and speaking growth.",

    href: "/progress",

    icon: (
      <Trophy size={24} />
    ),

    background:
      "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(239,68,68,0.18))"
  },

  {
    title:
      "Settings",

    description:
      "Customize AI voice and speaking preferences.",

    href: "/settings",

    icon: (
      <Settings
        size={24}
      />
    ),

    background:
      "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(147,51,234,0.18))"
  }
];

export default function QuickActions() {
  return (
    <section
      className="fade-in"
      style={{
        marginBottom: "32px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",

          marginBottom:
            "22px"
        }}
      >
        <Brain size={24} />

        <h2
          style={{
            fontSize: "28px"
          }}
        >
          Quick Actions
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px"
        }}
      >
        {actions.map(
          (
            action
          ) => (
            <Link
              key={
                action.title
              }
              href={
                action.href
              }
              style={{
                textDecoration:
                  "none"
              }}
            >
              <div
                className="glass-card"
                style={{
                  padding:
                    "22px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: "18px",

                  transition:
                    "0.2s ease"
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "18px",

                    flex: 1
                  }}
                >
                  <div
                    style={{
                      width: "64px",

                      height:
                        "64px",

                      borderRadius:
                        "20px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      background:
                        action.background
                    }}
                  >
                    {
                      action.icon
                    }
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize:
                          "22px",

                        marginBottom:
                          "6px"
                      }}
                    >
                      {
                        action.title
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "rgba(255,255,255,0.70)",

                        lineHeight:
                          1.7
                      }}
                    >
                      {
                        action.description
                      }
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "46px",

                    height:
                      "46px",

                    borderRadius:
                      "16px",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      "rgba(255,255,255,0.05)"
                  }}
                >
                  <ArrowRight
                    size={20}
                  />
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
