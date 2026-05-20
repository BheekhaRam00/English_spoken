"use client";

import { useEffect, useState } from "react";

import {
  Moon,
  Bell,
  Languages,
  Shield,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

import {
  SettingsEngine
} from "@/lib/settings-engine";

export default function AppPreferences() {
  const settingsEngine =
    new SettingsEngine();

  const [darkMode, setDarkMode] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  const [autoSpeak, setAutoSpeak] =
    useState(true);

  useEffect(() => {
    const settings =
      settingsEngine.getSettings();

    setDarkMode(
      settings.darkMode
    );

    setAutoSpeak(
      settings.autoSpeak
    );

    const storedNotifications =
      localStorage.getItem(
        "notifications"
      );

    if (storedNotifications) {
      setNotifications(
        JSON.parse(
          storedNotifications
        )
      );
    }
  }, []);

  const toggleDarkMode =
    () => {
      setDarkMode(
        !darkMode
      );

      settingsEngine.toggleDarkMode();
    };

  const toggleNotifications =
    () => {
      const updated =
        !notifications;

      setNotifications(
        updated
      );

      localStorage.setItem(
        "notifications",
        JSON.stringify(
          updated
        )
      );
    };

  const toggleAutoSpeak =
    () => {
      setAutoSpeak(
        !autoSpeak
      );

      settingsEngine.toggleAutoSpeak();
    };

  const ToggleSwitch = ({
    active
  }: {
    active: boolean;
  }) => (
    <div
      style={{
        width: "56px",
        height: "32px",
        borderRadius: "999px",
        background: active
          ? "#2563eb"
          : "rgba(255,255,255,0.18)",
        position: "relative",
        transition:
          "0.2s ease"
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius:
            "50%",
          background:
            "#ffffff",
          position:
            "absolute",
          top: "4px",
          left: active
            ? "28px"
            : "4px",
          transition:
            "0.2s ease"
        }}
      />
    </div>
  );

  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "28px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          gap: "12px",
          marginBottom:
            "24px"
        }}
      >
        <Sparkles
          size={24}
        />

        <div>
          <h2
            style={{
              fontSize:
                "26px",
              marginBottom:
                "4px"
            }}
          >
            App Preferences
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,0.70)"
            }}
          >
            Personalize your FluentPro AI
            experience.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px",
          marginBottom:
            "24px"
        }}
      >
        <button
          onClick={
            toggleDarkMode
          }
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            background:
              "rgba(255,255,255,0.05)",
            borderRadius:
              "22px",
            padding:
              "20px",
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
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "54px",
                height:
                  "54px",
                borderRadius:
                  "18px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
              }}
            >
              <Moon
                size={24}
              />
            </div>

            <div
              style={{
                textAlign:
                  "left"
              }}
            >
              <h3
                style={{
                  marginBottom:
                    "4px",
                  fontSize:
                    "20px"
                }}
              >
                Dark Mode
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",
                  lineHeight:
                    1.6
                }}
              >
                Premium dark UI experience
              </p>
            </div>
          </div>

          <ToggleSwitch
            active={
              darkMode
            }
          />
        </button>

        <button
          onClick={
            toggleNotifications
          }
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            background:
              "rgba(255,255,255,0.05)",
            borderRadius:
              "22px",
            padding:
              "20px",
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
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "54px",
                height:
                  "54px",
                borderRadius:
                  "18px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
              }}
            >
              <Bell
                size={24}
              />
            </div>

            <div
              style={{
                textAlign:
                  "left"
              }}
            >
              <h3
                style={{
                  marginBottom:
                    "4px",
                  fontSize:
                    "20px"
                }}
              >
                Notifications
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",
                  lineHeight:
                    1.6
                }}
              >
                Daily speaking reminders
              </p>
            </div>
          </div>

          <ToggleSwitch
            active={
              notifications
            }
          />
        </button>

        <button
          onClick={
            toggleAutoSpeak
          }
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            background:
              "rgba(255,255,255,0.05)",
            borderRadius:
              "22px",
            padding:
              "20px",
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
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "54px",
                height:
                  "54px",
                borderRadius:
                  "18px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
              }}
            >
              <CheckCircle2
                size={24}
              />
            </div>

            <div
              style={{
                textAlign:
                  "left"
              }}
            >
              <h3
                style={{
                  marginBottom:
                    "4px",
                  fontSize:
                    "20px"
                }}
              >
                Auto Speak
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)",
                  lineHeight:
                    1.6
                }}
              >
                AI automatically speaks replies
              </p>
            </div>
          </div>

          <ToggleSwitch
            active={
              autoSpeak
            }
          />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "20px",
            background:
              "rgba(255,255,255,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between"
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

              <div>
                <h3
                  style={{
                    marginBottom:
                      "4px",
                    fontSize:
                      "18px"
                  }}
                >
                  Language Support
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)"
                  }}
                >
                  English + Hindi learning
                </p>
              </div>
            </div>

            <ChevronRight
              size={20}
            />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "20px",
            background:
              "rgba(255,255,255,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between"
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

              <div>
                <h3
                  style={{
                    marginBottom:
                      "4px",
                    fontSize:
                      "18px"
                  }}
                >
                  Privacy
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)"
                  }}
                >
                  Conversations stay local
                </p>
              </div>
            </div>

            <ChevronRight
              size={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
