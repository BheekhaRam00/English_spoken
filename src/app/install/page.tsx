"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Smartphone,
  Download,
  WifiOff,
  Bell,
  Zap,
  CheckCircle2
} from "lucide-react";

import {
  showInstallPrompt,
  isPWAInstalled
} from "@/lib/pwa";

export default function InstallPage() {
  const [installing, setInstalling] =
    useState(false);

  const [installed, setInstalled] =
    useState(
      isPWAInstalled()
    );

  const handleInstall =
    async () => {
      try {
        setInstalling(true);

        const success =
          await showInstallPrompt();

        if (success) {
          setInstalled(true);
        }
      } catch (error) {
        console.error(
          "Install error:",
          error
        );
      } finally {
        setInstalling(false);
      }
    };

  const features = [
    {
      icon: (
        <Zap size={22} />
      ),

      title:
        "Fast Performance",

      description:
        "Launch instantly with app-like experience."
    },

    {
      icon: (
        <WifiOff size={22} />
      ),

      title:
        "Offline Learning",

      description:
        "Practice English even without internet."
    },

    {
      icon: (
        <Bell size={22} />
      ),

      title:
        "Daily Reminders",

      description:
        "Stay consistent with speaking practice."
    },

    {
      icon: (
        <Smartphone
          size={22}
        />
      ),

      title:
        "Mobile App Feel",

      description:
        "Use FluentPro AI like a native app."
    }
  ];

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
            Install App
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            Install FluentPro AI on your device.
          </p>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "30px",
          marginBottom: "28px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",

            margin:
              "0 auto 24px auto",

            borderRadius: "32px",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            background:
              "linear-gradient(135deg, #9333ea, #2563eb)"
          }}
        >
          <Smartphone
            size={54}
          />
        </div>

        <h2
          style={{
            fontSize: "30px",
            marginBottom: "14px"
          }}
        >
          FluentPro AI
        </h2>

        <p
          style={{
            color:
              "rgba(255,255,255,0.74)",

            lineHeight: 1.8,

            marginBottom: "28px"
          }}
        >
          Install the app for faster access,
          offline learning, and a smooth
          mobile experience.
        </p>

        {installed ? (
          <div
            className="glass-card"
            style={{
              padding: "22px",

              background:
                "rgba(34,197,94,0.12)",

              border:
                "1px solid rgba(34,197,94,0.18)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",

                gap: "12px"
              }}
            >
              <CheckCircle2
                size={24}
              />

              <span
                style={{
                  fontWeight: 700,
                  fontSize: "18px"
                }}
              >
                App Installed
              </span>
            </div>
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={
              handleInstall
            }
            disabled={
              installing
            }
            style={{
              width: "100%",

              height: "62px",

              fontSize: "18px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",

              gap: "12px",

              opacity:
                installing
                  ? 0.7
                  : 1
            }}
          >
            <Download
              size={22}
            />

            {installing
              ? "Installing..."
              : "Install FluentPro AI"}
          </button>
        )}
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",
          gap: "18px",
          marginBottom: "28px"
        }}
      >
        {features.map(
          (feature) => (
            <div
              key={
                feature.title
              }
              className="glass-card"
              style={{
                padding:
                  "24px",

                display:
                  "flex",

                alignItems:
                  "flex-start",

                gap: "18px"
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",

                  borderRadius:
                    "18px",

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

              <div>
                <h3
                  style={{
                    fontSize:
                      "20px",

                    marginBottom:
                      "8px"
                  }}
                >
                  {
                    feature.title
                  }
                </h3>

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
            </div>
          )
        )}
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "26px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "16px"
          }}
        >
          Installation Tips
        </h2>

        <div
          style={{
            display: "grid",
            gap: "14px"
          }}
        >
          {[
            "Use Chrome or Edge browser for best install support.",
            "After installation, the app opens like a native mobile app.",
            "Offline lessons become available automatically.",
            "You can add FluentPro AI directly to your home screen."
          ].map((tip) => (
            <div
              key={tip}
              style={{
                display: "flex",
                alignItems:
                  "flex-start",

                gap: "12px"
              }}
            >
              <CheckCircle2
                size={18}
                style={{
                  minWidth:
                    "18px",

                  marginTop:
                    "4px"
                }}
              />

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.76)",

                  lineHeight:
                    1.7
                }}
              >
                {tip}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
        }
