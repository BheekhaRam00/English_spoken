"use client";

import { useEffect, useState } from "react";

import {
  Mic,
  AudioWaveform,
  Brain,
  Volume2
} from "lucide-react";

type VoiceVisualizerProps = {
  listening: boolean;

  speaking?: boolean;

  label?: string;
};

export default function VoiceVisualizer({
  listening,
  speaking = false,
  label
}: VoiceVisualizerProps) {
  const [bars, setBars] =
    useState<number[]>([
      20,
      35,
      45,
      30,
      60,
      40,
      25
    ]);

  useEffect(() => {
    let interval:
      | NodeJS.Timeout
      | undefined;

    if (
      listening ||
      speaking
    ) {
      interval =
        setInterval(() => {
          setBars(
            Array.from(
              {
                length: 7
              },
              () =>
                Math.floor(
                  Math.random() *
                    90 +
                    10
                )
            )
          );
        }, 180);
    }

    return () => {
      if (interval) {
        clearInterval(
          interval
        );
      }
    };
  }, [
    listening,
    speaking
  ]);

  const active =
    listening ||
    speaking;

  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: "28px",

        textAlign:
          "center",

        background:
          active
            ? "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
            : "rgba(255,255,255,0.05)"
      }}
    >
      <div
        style={{
          width: "92px",

          height: "92px",

          borderRadius:
            "30px",

          margin:
            "0 auto 22px auto",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            active
              ? "linear-gradient(135deg, #9333ea, #2563eb)"
              : "rgba(255,255,255,0.08)",

          position:
            "relative",

          overflow:
            "hidden"
        }}
      >
        {listening ? (
          <Mic
            size={42}
          />
        ) : speaking ? (
          <Volume2
            size={42}
          />
        ) : (
          <Brain
            size={42}
          />
        )}

        {active && (
          <div
            style={{
              position:
                "absolute",

              inset: 0,

              borderRadius:
                "30px",

              border:
                "2px solid rgba(255,255,255,0.18)",

              animation:
                "pulse 1.4s infinite"
            }}
          />
        )}
      </div>

      <h2
        style={{
          fontSize: "26px",

          marginBottom: "10px"
        }}
      >
        {listening
          ? "Listening..."
          : speaking
            ? "AI Speaking..."
            : "Voice Assistant"}
      </h2>

      <p
        style={{
          color:
            "rgba(255,255,255,0.72)",

          lineHeight: 1.7,

          marginBottom: "28px"
        }}
      >
        {label ||
          (listening
            ? "Speak naturally in English."
            : speaking
              ? "AI is responding to your conversation."
              : "Start speaking practice with FluentPro AI.")}
      </p>

      <div
        style={{
          height: "120px",

          display: "flex",

          alignItems: "end",

          justifyContent:
            "center",

          gap: "10px",

          marginBottom:
            "10px"
        }}
      >
        {bars.map(
          (
            height,
            index
          ) => (
            <div
              key={index}
              style={{
                width: "16px",

                height: active
                  ? `${height}px`
                  : "18px",

                borderRadius:
                  "999px",

                background:
                  active
                    ? "linear-gradient(180deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.12)",

                transition:
                  "0.18s ease"
              }}
            />
          )
        )}
      </div>

      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap: "10px",

          color:
            active
              ? "#ffffff"
              : "rgba(255,255,255,0.6)"
        }}
      >
        <AudioWaveform
          size={18}
        />

        <span
          style={{
            fontSize:
              "14px",

            fontWeight:
              600
          }}
        >
          {active
            ? "Voice activity detected"
            : "Waiting for interaction"}
        </span>
      </div>
    </div>
  );
}
