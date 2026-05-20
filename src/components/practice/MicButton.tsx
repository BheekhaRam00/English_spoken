"use client";

import {
  Mic,
  MicOff
} from "lucide-react";

type MicButtonProps = {
  isListening: boolean;

  onStart: () => void;

  onStop: () => void;

  disabled?: boolean;
};

export default function MicButton({
  isListening,
  onStart,
  onStop,
  disabled = false
}: MicButtonProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (isListening) {
      onStop();

      return;
    }

    onStart();
  };

  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "28px",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center"
      }}
    >
      <button
        onClick={handleClick}
        disabled={disabled}
        aria-label={
          isListening
            ? "Stop microphone"
            : "Start microphone"
        }
        style={{
          width: "96px",

          height: "96px",

          borderRadius: "999px",

          background: isListening
            ? "linear-gradient(90deg, #ef4444, #dc2626)"
            : "linear-gradient(90deg, #9333ea, #2563eb)",

          color: "#ffffff",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          boxShadow:
            "0 0 40px rgba(147, 51, 234, 0.25)",

          transition:
            "transform 0.2s ease, opacity 0.2s ease",

          opacity:
            disabled ? 0.5 : 1,

          cursor: disabled
            ? "not-allowed"
            : "pointer"
        }}
        onMouseDown={(e) => {
          (
            e.currentTarget as HTMLButtonElement
          ).style.transform =
            "scale(0.96)";
        }}
        onMouseUp={(e) => {
          (
            e.currentTarget as HTMLButtonElement
          ).style.transform =
            "scale(1)";
        }}
        onMouseLeave={(e) => {
          (
            e.currentTarget as HTMLButtonElement
          ).style.transform =
            "scale(1)";
        }}
      >
        {isListening ? (
          <MicOff size={38} />
        ) : (
          <Mic size={38} />
        )}
      </button>

      <p
        style={{
          marginTop: "20px",

          color:
            "rgba(255,255,255,0.74)",

          lineHeight: 1.7,

          textAlign: "center",

          fontSize: "15px"
        }}
      >
        {isListening
          ? "Listening... Speak clearly in English."
          : "Tap the microphone and start speaking."}
      </p>
    </section>
  );
}
