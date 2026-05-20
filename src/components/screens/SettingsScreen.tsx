"use client";

import { useEffect, useState } from "react";

import {
  Volume2,
  Moon,
  Languages,
  Mic,
  Bell,
  Shield,
  ChevronRight,
  Brain,
  Sparkles
} from "lucide-react";

import {
  SettingsEngine
} from "@/lib/settings-engine";

export default function SettingsScreen() {
  const settingsEngine =
    new SettingsEngine();

  const [voice, setVoice] =
    useState("female");

  const [speechSpeed, setSpeechSpeed] =
    useState(0.95);

  const [darkMode, setDarkMode] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  useEffect(() => {
    const settings =
      settingsEngine.getSettings();

    setVoice(
      settings.selectedVoice
    );

    setSpeechSpeed(
      settings.speechRate
    );

    setDarkMode(
      settings.darkMode
    );
  }, []);

  const updateVoice = (
    value:
      | "female"
      | "male"
      | "professional"
  ) => {
    setVoice(value);

    settingsEngine.updateVoice(
      value
    );
  };

  const updateSpeed = (
    value: number
  ) => {
    setSpeechSpeed(value);

    settingsEngine.updateSpeechSettings(
      {
        speechRate:
          value
      }
    );
  };

  const toggleDarkMode =
    () => {
      setDarkMode(
        !darkMode
      );

      settingsEngine.toggleDarkMode();
    };

  const toggleNotifications =
    () => {
      setNotifications(
        !notifications
      );
    };

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          marginBottom: "28px"
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{
              marginBottom:
                "4px",
              fontSize:
                "34px"
            }}
          >
            Settings
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            Customize your AI learning
            experience.
          </p>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",

            marginBottom:
              "22px"
          }}
        >
          <Volume2
            size={24}
          />

          <h2
            style={{
              fontSize:
                "26px"
            }}
          >
            AI Voice
          </h2>
        </div>

        <div
          style={{
            display:
              "grid",

            gap: "14px"
          }}
        >
          {[
            {
              label:
                "Female Voice",

              value:
                "female"
            },

            {
              label:
                "Male Voice",

              value:
                "male"
            },

            {
              label:
                "Professional Voice",

              value:
                "professional"
            }
          ].map((item) => (
            <button
              key={
                item.value
              }
              onClick={() =>
                updateVoice(
                  item.value as
                    | "female"
                    | "male"
                    | "professional"
                )
              }
              style={{
                height:
                  "58px",

                borderRadius:
                  "18px",

                background:
                  voice ===
                  item.value
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.05)",

                color:
                  "#ffffff",

                fontSize:
                  "15px",

                fontWeight:
                  600,

                transition:
                  "0.2s ease"
              }}
            >
              {
                item.label
              }
            </button>
          ))}
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",

            marginBottom:
              "22px"
          }}
        >
          <Mic size={24} />

          <h2
            style={{
              fontSize:
                "26px"
            }}
          >
            Speech Speed
          </h2>
        </div>

        <input
          type="range"
          min="0.7"
          max="1.3"
          step="0.05"
          value={
            speechSpeed
          }
          onChange={(e) =>
            updateSpeed(
              Number(
                e.target
                  .value
              )
            )
          }
          style={{
            width: "100%",
            marginBottom:
              "18px"
          }}
        />

        <p
          style={{
            color:
              "rgba(255,255,255,0.74)"
          }}
        >
          Current Speed:
          {" "}
          {speechSpeed.toFixed(
            2
          )}
          x
        </p>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px",
          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "grid",

            gap: "18px"
          }}
        >
          <button
            onClick={
              toggleDarkMode
            }
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius:
                "20px",

              padding:
                "18px",

              color:
                "#ffffff"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "14px"
              }}
            >
              <Moon
                size={22}
              />

              <div
                style={{
                  textAlign:
                    "left"
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "4px"
                  }}
                >
                  Dark Mode
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",

                    fontSize:
                      "14px"
                  }}
                >
                  Premium dark interface
                </p>
              </div>
            </div>

            <div
              style={{
                width: "54px",
                height:
                  "30px",

                borderRadius:
                  "999px",

                background:
                  darkMode
                    ? "#2563eb"
                    : "rgba(255,255,255,0.18)",

                position:
                  "relative",

                transition:
                  "0.2s ease"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height:
                    "24px",

                  borderRadius:
                    "50%",

                  background:
                    "#ffffff",

                  position:
                    "absolute",

                  top: "3px",

                  left:
                    darkMode
                      ? "27px"
                      : "3px",

                  transition:
                    "0.2s ease"
                }}
              />
            </div>
          </button>

          <button
            onClick={
              toggleNotifications
            }
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius:
                "20px",

              padding:
                "18px",

              color:
                "#ffffff"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "14px"
              }}
            >
              <Bell
                size={22}
              />

              <div
                style={{
                  textAlign:
                    "left"
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "4px"
                  }}
                >
                  Notifications
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",

                    fontSize:
                      "14px"
                  }}
                >
                  Daily practice reminders
                </p>
              </div>
            </div>

            <div
              style={{
                width: "54px",
                height:
                  "30px",

                borderRadius:
                  "999px",

                background:
                  notifications
                    ? "#2563eb"
                    : "rgba(255,255,255,0.18)",

                position:
                  "relative",

                transition:
                  "0.2s ease"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height:
                    "24px",

                  borderRadius:
                    "50%",

                  background:
                    "#ffffff",

                  position:
                    "absolute",

                  top: "3px",

                  left:
                    notifications
                      ? "27px"
                      : "3px",

                  transition:
                    "0.2s ease"
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
          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "grid",

            gap: "18px"
          }}
        >
          <button
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius:
                "20px",

              padding:
                "18px",

              color:
                "#ffffff"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "14px"
              }}
            >
              <Languages
                size={22}
              />

              <div
                style={{
                  textAlign:
                    "left"
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "4px"
                  }}
                >
                  Language
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",

                    fontSize:
                      "14px"
                  }}
                >
                  English + Hindi support
                </p>
              </div>
            </div>

            <ChevronRight
              size={20}
            />
          </button>

          <button
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius:
                "20px",

              padding:
                "18px",

              color:
                "#ffffff"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "14px"
              }}
            >
              <Shield
                size={22}
              />

              <div
                style={{
                  textAlign:
                    "left"
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "4px"
                  }}
                >
                  Privacy
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",

                    fontSize:
                      "14px"
                  }}
                >
                  Your conversations stay local
                </p>
              </div>
            </div>

            <ChevronRight
              size={20}
            />
          </button>
        </div>
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
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",

            marginBottom:
              "14px"
          }}
        >
          <Brain size={24} />

          <h2
            style={{
              fontSize:
                "24px"
            }}
          >
            FluentPro AI
          </h2>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.76)",

            lineHeight: 1.8,

            marginBottom:
              "18px"
          }}
        >
          AI-powered spoken English learning
          with smart conversations,
          pronunciation practice, and offline
          support.
        </p>

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "10px",

            color:
              "rgba(255,255,255,0.7)"
          }}
        >
          <Sparkles
            size={18}
          />

          <span>
            Personalized AI learning
            experience
          </span>
        </div>
      </section>
    </main>
  );
      }
