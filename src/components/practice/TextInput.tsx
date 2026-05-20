"use client";

import { Send } from "lucide-react";
import { KeyboardEvent } from "react";

type TextInputProps = {
  value: string;

  onChange: (value: string) => void;

  onSend: () => void;

  placeholder?: string;

  disabled?: boolean;
};

export default function TextInput({
  value,
  onChange,
  onSend,
  placeholder = "Type your message in English...",
  disabled = false
}: TextInputProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !disabled &&
      value.trim()
    ) {
      onSend();
    }
  };

  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",

          gap: "14px"
        }}
      >
        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,

            height: "58px",

            borderRadius: "18px",

            padding: "0 18px",

            background:
              "rgba(255,255,255,0.05)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            color: "#ffffff",

            fontSize: "15px",

            opacity: disabled ? 0.6 : 1
          }}
        />

        <button
          onClick={onSend}
          disabled={
            disabled || !value.trim()
          }
          aria-label="Send message"
          style={{
            width: "58px",
            height: "58px",

            borderRadius: "18px",

            background:
              "linear-gradient(90deg, #9333ea, #2563eb)",

            color: "#ffffff",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            opacity:
              disabled || !value.trim()
                ? 0.5
                : 1,

            cursor:
              disabled || !value.trim()
                ? "not-allowed"
                : "pointer",

            transition:
              "transform 0.2s ease, opacity 0.2s ease"
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
          <Send size={22} />
        </button>
      </div>
    </section>
  );
}
