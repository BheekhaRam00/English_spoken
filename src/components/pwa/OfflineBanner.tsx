"use client";

import { useEffect, useState } from "react";

import {
  Wifi,
  WifiOff,
  CloudOff
} from "lucide-react";

export default function OfflineBanner() {
  const [online, setOnline] =
    useState(true);

  const [showOnlineMessage, setShowOnlineMessage] =
    useState(false);

  useEffect(() => {
    const handleOnline =
      () => {
        setOnline(true);

        setShowOnlineMessage(
          true
        );

        setTimeout(() => {
          setShowOnlineMessage(
            false
          );
        }, 3000);
      };

    const handleOffline =
      () => {
        setOnline(false);
      };

    setOnline(
      navigator.onLine
    );

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  if (
    online &&
    !showOnlineMessage
  ) {
    return null;
  }

  return (
    <div
      className="fade-in"
      style={{
        position: "fixed",

        top: "16px",

        left: "16px",

        right: "16px",

        zIndex: 9999
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "18px 20px",

          display: "flex",

          alignItems: "center",

          gap: "14px",

          background: online
            ? "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(16,185,129,0.22))"
            : "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(249,115,22,0.22))",

          border: online
            ? "1px solid rgba(34,197,94,0.18)"
            : "1px solid rgba(239,68,68,0.18)",

          backdropFilter:
            "blur(18px)"
        }}
      >
        <div
          style={{
            width: "52px",

            height: "52px",

            borderRadius: "16px",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            background:
              "rgba(255,255,255,0.08)"
          }}
        >
          {online ? (
            <Wifi
              size={26}
            />
          ) : (
            <WifiOff
              size={26}
            />
          )}
        </div>

        <div
          style={{
            flex: 1
          }}
        >
          <h3
            style={{
              fontSize: "18px",

              marginBottom: "4px",

              fontWeight: 700
            }}
          >
            {online
              ? "Back Online"
              : "Offline Mode"}
          </h3>

          <p
            style={{
              color:
                "rgba(255,255,255,0.76)",

              lineHeight: 1.6,

              fontSize: "14px"
            }}
          >
            {online
              ? "Internet connection restored successfully."
              : "You are offline. Offline lessons and saved progress are still available."}
          </p>
        </div>

        {!online && (
          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              width: "42px",

              height: "42px",

              borderRadius: "14px",

              background:
                "rgba(255,255,255,0.06)"
            }}
          >
            <CloudOff
              size={20}
            />
          </div>
        )}
      </div>
    </div>
  );
}
