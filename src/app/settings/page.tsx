"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Volume2,
  Moon,
  Languages,
  Mic,
  Bell,
  Shield,
  ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const [voice, setVoice] =
    useState("Female Voice");

  const [speechSpeed, setSpeechSpeed] =
    useState(1);

  const [darkMode, setDarkMode] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  useEffect(() => {
    const savedVoice =
      localStorage.getItem("voice");

    const savedSpeed =
      localStorage.getItem("speech-speed");

    const savedDarkMode =
      localStorage.getItem("dark-mode");

    const savedNotifications =
      localStorage.getItem("notifications");

    if (savedVoice) {
      setVoice(savedVoice);
    }

    if (savedSpeed) {
      setSpeechSpeed(Number(savedSpeed));
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }

    if (savedNotifications) {
      setNotifications(
        savedNotifications === "true"
      );
    }
  }, []);

  const updateVoice = (value: string) => {
    setVoice(value);

    localStorage.setItem("voice", value);
  };

  const updateSpeed = (
    value: number
  ) => {
    setSpeechSpeed(value);

    localStorage.setItem(
      "speech-speed",
      String(value)
    );
  };

  const toggleDarkMode = () => {
    const updated = !darkMode;

    setDarkMode(updated);

    localStorage.setItem(
      "dark-mode",
      String(updated)
    );
  };

  const toggleNotifications = () => {
    const updated = !notifications;

    setNotifications(updated);

    localStorage.setItem(
      "notifications",
      String(updated)
    );
  };

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "28px"
        }}
      >
        <Link href="/">
          <button
            className="secondary-button"
            style={{
              width: "54px",
              height: "54px",
              padding: 0,
              borderRadius: "18px"
            }}
          >
            <ArrowLeft size={22} />
          </button>
        </Link>

        <div>
          <h1
            className="page-title"
            style={{
              marginBottom: "4px",
              fontSize: "34px"
            }}
          >
            Settings
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)"
            }}
          >
            Customize your learning experience.
          </p>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px"
          }}
        >
          <Volume2 size={24} />

          <h2
            style={{
              fontSize: "26px"
            }}
          >
            AI Voice
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px"
          }}
        >
          {[
            "Female Voice",
            "Male Voice",
            "Professional Voice"
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                updateVoice(item)
              }
              style={{
                height: "58px",

                borderRadius: "18px",

                background:
                  voice === item
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.05)",

                color: "#ffffff",

                fontSize: "15px",
                fontWeight: 600,

                transition: "0.2s ease"
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px"
          }}
        >
          <Mic size={24} />

          <h2
            style={{
              fontSize: "26px"
            }}
          >
            Speech Speed
          </h2>
        </div>

        <input
          type="range"
          min="0.7"
          max="1.3"
          step="0.1"
          value={speechSpeed}
          onChange={(e) =>
            updateSpeed(
              Number(e.target.value)
            )
          }
          style={{
            width: "100%",
            marginBottom: "18px"
          }}
        />

        <p
          style={{
            color: "rgba(255,255,255,0.74)"
          }}
        >
          Current Speed: {speechSpeed.toFixed(1)}x
        </p>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "18px"
          }}
        >
          <button
            onClick={toggleDarkMode}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius: "20px",

              padding: "18px",

              color: "#ffffff"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Moon size={22} />

              <div
                style={{
                  textAlign: "left"
                }}
              >
                <h3
                  style={{
                    marginBottom: "4px"
                  }}
                >
                  Dark Mode
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                    fontSize: "14px"
                  }}
                >
                  Premium dark interface
                </p>
              </div>
            </div>

            <div
              style={{
                width: "54px",
                height: "30px",

                borderRadius: "999px",

                background: darkMode
                  ? "#2563eb"
                  : "rgba(255,255,255,0.18)",

                position: "relative",

                transition: "0.2s ease"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",

                  borderRadius: "50%",

                  background: "#ffffff",

                  position: "absolute",

                  top: "3px",

                  left: darkMode
                    ? "27px"
                    : "3px",

                  transition: "0.2s ease"
                }}
              />
            </div>
          </button>

          <button
            onClick={toggleNotifications}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius: "20px",

              padding: "18px",

              color: "#ffffff"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Bell size={22} />

              <div
                style={{
                  textAlign: "left"
                }}
              >
                <h3
                  style={{
                    marginBottom: "4px"
                  }}
                >
                  Notifications
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                    fontSize: "14px"
                  }}
                >
                  Daily speaking reminders
                </p>
              </div>
            </div>

            <div
              style={{
                width: "54px",
                height: "30px",

                borderRadius: "999px",

                background:
                  notifications
                    ? "#2563eb"
                    : "rgba(255,255,255,0.18)",

                position: "relative",

                transition: "0.2s ease"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",

                  borderRadius: "50%",

                  background: "#ffffff",

                  position: "absolute",

                  top: "3px",

                  left: notifications
                    ? "27px"
                    : "3px",

                  transition: "0.2s ease"
                }}
              />
            </div>
          </button>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "18px"
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius: "20px",

              padding: "18px",

              color: "#ffffff"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Languages size={22} />

              <div
                style={{
                  textAlign: "left"
                }}
              >
                <h3
                  style={{
                    marginBottom: "4px"
                  }}
                >
                  Language
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                    fontSize: "14px"
                  }}
                >
                  English + Hindi learning
                </p>
              </div>
            </div>

            <ChevronRight size={20} />
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius: "20px",

              padding: "18px",

              color: "#ffffff"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Shield size={22} />

              <div
                style={{
                  textAlign: "left"
                }}
              >
                <h3
                  style={{
                    marginBottom: "4px"
                  }}
                >
                  Privacy
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                    fontSize: "14px"
                  }}
                >
                  Your conversations stay local
                </p>
              </div>
            </div>

            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "12px"
          }}
        >
          FluentPro AI
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.74)",
            lineHeight: 1.8
          }}
        >
          Practice spoken English naturally with AI-powered learning
          and real-time conversation support.
        </p>
      </section>
    </main>
  );
                }
