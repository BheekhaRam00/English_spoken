"use client";

import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  PhoneOff
} from "lucide-react";

type PracticeControlsProps = {
  connected: boolean;

  speaking: boolean;

  muted: boolean;

  onMuteToggle: () => void;

  onReplay: () => void;

  onReset: () => void;

  onDisconnect: () => void;
};

export default function PracticeControls({
  connected,
  speaking,
  muted,
  onMuteToggle,
  onReplay,
  onReset,
  onDisconnect
}: PracticeControlsProps) {
  return (
    <section
      className="fade-in"
      style={{
        display: "grid",
        gap: "16px"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "14px"
        }}
      >
        <button
          onClick={
            onMuteToggle
          }
          className="glass-card"
          style={{
            padding: "20px",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "12px",

            background:
              muted
                ? "linear-gradient(90deg, rgba(239,68,68,0.18), rgba(220,38,38,0.18))"
                : "rgba(255,255,255,0.05)",

            color: "#ffffff"
          }}
        >
          {muted ? (
            <Pause
              size={20}
            />
          ) : (
            <Volume2
              size={20}
            />
          )}

          <span
            style={{
              fontWeight: 600
            }}
          >
            {muted
              ? "Muted"
              : "Sound On"}
          </span>
        </button>

        <button
          onClick={
            onReplay
          }
          className="glass-card"
          style={{
            padding: "20px",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "12px",

            background:
              "rgba(255,255,255,0.05)",

            color: "#ffffff"
          }}
        >
          <Play size={20} />

          <span
            style={{
              fontWeight: 600
            }}
          >
            Replay
          </span>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "14px"
        }}
      >
        <button
          onClick={
            onReset
          }
          className="glass-card"
          style={{
            padding: "20px",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "12px",

            background:
              "rgba(255,255,255,0.05)",

            color: "#ffffff"
          }}
        >
          <RotateCcw
            size={20}
          />

          <span
            style={{
              fontWeight: 600
            }}
          >
            Reset
          </span>
        </button>

        <button
          onClick={
            onDisconnect
          }
          disabled={
            !connected
          }
          className="glass-card"
          style={{
            padding: "20px",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "12px",

            background:
              connected
                ? "linear-gradient(90deg, rgba(239,68,68,0.18), rgba(220,38,38,0.18))"
                : "rgba(255,255,255,0.04)",

            color: "#ffffff",

            opacity:
              connected
                ? 1
                : 0.5
          }}
        >
          <PhoneOff
            size={20}
          />

          <span
            style={{
              fontWeight: 600
            }}
          >
            Disconnect
          </span>
        </button>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "18px",

          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",

          background:
            speaking
              ? "linear-gradient(90deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
              : "rgba(255,255,255,0.05)"
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "4px"
            }}
          >
            AI Status
          </h3>

          <p
            style={{
              color:
                "rgba(255,255,255,0.70)"
            }}
          >
            {speaking
              ? "AI is currently speaking..."
              : "Waiting for your response"}
          </p>
        </div>

        <div
          style={{
            width: "14px",
            height: "14px",

            borderRadius:
              "999px",

            background:
              speaking
                ? "#22c55e"
                : "rgba(255,255,255,0.3)",

            boxShadow:
              speaking
                ? "0 0 18px rgba(34,197,94,0.8)"
                : "none"
          }}
        />
      </div>
    </section>
  );
}
