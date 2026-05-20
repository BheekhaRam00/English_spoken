"use client";

import { useEffect, useState } from "react";

import {
  Download,
  X,
  Smartphone,
  CheckCircle2
} from "lucide-react";

import {
  showInstallPrompt,
  isPWAInstalled,
  listenForPWAInstall
} from "@/lib/pwa";

export default function InstallPrompt() {
  const [visible, setVisible] =
    useState(false);

  const [installing, setInstalling] =
    useState(false);

  const [installed, setInstalled] =
    useState(false);

  useEffect(() => {
    const alreadyInstalled =
      isPWAInstalled();

    setInstalled(
      alreadyInstalled
    );

    if (
      !alreadyInstalled
    ) {
      const timer =
        setTimeout(() => {
          setVisible(
            true
          );
        }, 4000);

      return () =>
        clearTimeout(
          timer
        );
    }
  }, []);

  useEffect(() => {
    listenForPWAInstall(
      () => {
        setInstalled(
          true
        );

        setVisible(
          false
        );
      }
    );
  }, []);

  const handleInstall =
    async () => {
      try {
        setInstalling(
          true
        );

        const success =
          await showInstallPrompt();

        if (success) {
          setInstalled(
            true
          );

          setVisible(
            false
          );
        }
      } catch (error) {
        console.error(
          "Install prompt error:",
          error
        );
      } finally {
        setInstalling(
          false
        );
      }
    };

  if (
    installed ||
    !visible
  ) {
    return null;
  }

  return (
    <div
      className="fade-in"
      style={{
        position: "fixed",

        left: "16px",

        right: "16px",

        bottom: "20px",

        zIndex: 9999
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "22px",

          background:
            "linear-gradient(135deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))",

          backdropFilter:
            "blur(18px)",

          border:
            "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "flex-start",

            gap: "16px"
          }}
        >
          <div
            style={{
              width: "58px",

              height: "58px",

              borderRadius:
                "18px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "rgba(255,255,255,0.08)"
            }}
          >
            <Smartphone
              size={28}
            />
          </div>

          <div
            style={{
              flex: 1
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap: "12px",

                marginBottom:
                  "10px"
              }}
            >
              <h3
                style={{
                  fontSize:
                    "20px",

                  fontWeight:
                    700
                }}
              >
                Install FluentPro AI
              </h3>

              <button
                onClick={() =>
                  setVisible(
                    false
                  )
                }
                style={{
                  width: "34px",

                  height: "34px",

                  borderRadius:
                    "12px",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "rgba(255,255,255,0.06)",

                  color:
                    "#ffffff"
                }}
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <p
              style={{
                color:
                  "rgba(255,255,255,0.76)",

                lineHeight:
                  1.7,

                marginBottom:
                  "18px"
              }}
            >
              Install the app for offline
              learning, faster performance,
              and native app experience.
            </p>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr auto",

                gap: "12px"
              }}
            >
              <button
                className="primary-button"
                onClick={
                  handleInstall
                }
                disabled={
                  installing
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap: "10px",

                  height:
                    "52px",

                  opacity:
                    installing
                      ? 0.7
                      : 1
                }}
              >
                {installing ? (
                  <>
                    <CheckCircle2
                      size={20}
                    />

                    Installing...
                  </>
                ) : (
                  <>
                    <Download
                      size={20}
                    />

                    Install
                  </>
                )}
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setVisible(
                    false
                  )
                }
                style={{
                  height:
                    "52px",

                  padding:
                    "0 18px"
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
