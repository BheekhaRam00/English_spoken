"use client";

import { useEffect, useState } from "react";

import {
  Mic,
  Volume2,
  Brain,
  Headphones,
  Gauge,
  CheckCircle2
} from "lucide-react";

import {
  SettingsEngine
} from "@/lib/settings-engine";

export default function PracticeSettings() {
  const settingsEngine =
    new SettingsEngine();

  const [speechRate, setSpeechRate] =
    useState(0.95);

  const [pitch, setPitch] =
    useState(1);

  const [autoReplay, setAutoReplay] =
    useState(true);

  const [pronunciationTips, setPronunciationTips] =
    useState(true);

  useEffect(() => {
    const settings =
      settingsEngine.getSettings();

    setSpeechRate(
      settings.speechRate
    );

    setPitch(
      settings.pitch
    );
  }, []);

  const updateSpeechRate =
    (value: number) => {
      setSpeechRate(
        value
      );

      settingsEngine.updateSpeechSettings(
        {
          speechRate:
            value
        }
      );
    };

  const updatePitch = (
    value: number
  ) => {
    setPitch(value);

    settingsEngine.updateSpeechSettings(
      {
        pitch: value
      }
    );
  };

  const toggleAutoReplay =
    () => {
      setAutoReplay(
        !autoReplay
      );

      localStorage.setItem(
        "auto-replay",
        JSON.stringify(
          !autoReplay
        )
      );
    };

  const togglePronunciationTips =
    () => {
      setPronunciationTips(
        !pronunciationTips
      );

      localStorage.setItem(
        "pronunciation-tips",
        JSON.stringify(
          !pronunciationTips
        )
      );
    };

  const previewVoice =
    () => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      const utterance =
        new SpeechSynthesisUtterance(
          "Welcome to FluentPro AI speaking practice."
        );

      utterance.lang =
        "en-US";

      utterance.rate =
        speechRate;

      utterance.pitch =
        pitch;

      window.speechSynthesis.cancel();

      window.speechSynthesis.speak(
        utterance
      );
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
            "26px"
        }}
      >
        <Mic size={24} />

        <div>
          <h2
            style={{
              fontSize:
                "26px",

              marginBottom:
                "4px"
            }}
          >
            Practice Settings
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,0.70)"
            }}
          >
            Configure speaking and pronunciation
            practice preferences.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gap: "22px",

          marginBottom:
            "26px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "22px",

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
                "space-between",

              marginBottom:
                "18px"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "12px"
              }}
            >
              <Gauge
                size={22}
              />

              <div>
                <h3
                  style={{
                    fontSize:
                      "20px",

                    marginBottom:
                      "4px"
                  }}
                >
                  Speech Speed
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)"
                  }}
                >
                  Control AI speaking speed
                </p>
              </div>
            </div>

            <span
              style={{
                fontWeight: 700,

                fontSize: "18px"
              }}
            >
              {speechRate.toFixed(
                2
              )}
              x
            </span>
          </div>

          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.05"
            value={
              speechRate
            }
            onChange={(e) =>
              updateSpeechRate(
                Number(
                  e.target
                    .value
                )
              )
            }
            style={{
              width: "100%"
            }}
          />
        </div>

        <div
          className="glass-card"
          style={{
            padding: "22px",

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
                "space-between",

              marginBottom:
                "18px"
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "12px"
              }}
            >
              <Volume2
                size={22}
              />

              <div>
                <h3
                  style={{
                    fontSize:
                      "20px",

                    marginBottom:
                      "4px"
                  }}
                >
                  Voice Pitch
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.68)"
                  }}
                >
                  Adjust AI voice tone
                </p>
              </div>
            </div>

            <span
              style={{
                fontWeight: 700,

                fontSize: "18px"
              }}
            >
              {pitch.toFixed(
                1
              )}
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={pitch}
            onChange={(e) =>
              updatePitch(
                Number(
                  e.target
                    .value
                )
              )
            }
            style={{
              width: "100%"
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gap: "18px",

          marginBottom:
            "26px"
        }}
      >
        <button
          onClick={
            toggleAutoReplay
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
              <Headphones
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
                Auto Replay
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)"
                }}
              >
                Replay AI responses automatically
              </p>
            </div>
          </div>

          <ToggleSwitch
            active={
              autoReplay
            }
          />
        </button>

        <button
          onClick={
            togglePronunciationTips
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
              <Brain
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
                Pronunciation Tips
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)"
                }}
              >
                Show AI pronunciation guidance
              </p>
            </div>
          </div>

          <ToggleSwitch
            active={
              pronunciationTips
            }
          />
        </button>
      </div>

      <button
        className="primary-button"
        onClick={
          previewVoice
        }
        style={{
          width: "100%",

          height: "60px",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap: "12px"
        }}
      >
        <CheckCircle2
          size={22}
        />

        Preview Voice Settings
      </button>
    </div>
  );
              }
