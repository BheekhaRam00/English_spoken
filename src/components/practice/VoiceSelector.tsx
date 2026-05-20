"use client";

import {
  Volume2,
  Check
} from "lucide-react";

type VoiceOption = {
  id: string;
  label: string;
  description: string;
};

type VoiceSelectorProps = {
  selectedVoice: string;

  onSelect: (voice: string) => void;
};

const voiceOptions: VoiceOption[] = [
  {
    id: "female",
    label: "Female Voice",
    description:
      "Natural and friendly conversation style."
  },

  {
    id: "male",
    label: "Male Voice",
    description:
      "Clear and confident communication style."
  },

  {
    id: "professional",
    label: "Professional Voice",
    description:
      "Corporate and business communication tone."
  }
];

export default function VoiceSelector({
  selectedVoice,
  onSelect
}: VoiceSelectorProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "24px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",

          marginBottom: "22px"
        }}
      >
        <Volume2 size={24} />

        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,

              marginBottom: "4px"
            }}
          >
            AI Voice Selection
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.68)",

              lineHeight: 1.7
            }}
          >
            Choose the voice style for AI conversation practice.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px"
        }}
      >
        {voiceOptions.map((voice) => {
          const active =
            selectedVoice === voice.id;

          return (
            <button
              key={voice.id}
              onClick={() =>
                onSelect(voice.id)
              }
              style={{
                width: "100%",

                padding: "18px",

                borderRadius: "22px",

                background: active
                  ? "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                  : "rgba(255,255,255,0.04)",

                border: active
                  ? "1px solid rgba(147,51,234,0.28)"
                  : "1px solid rgba(255,255,255,0.08)",

                color: "#ffffff",

                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",

                gap: "16px",

                transition:
                  "all 0.2s ease"
              }}
            >
              <div
                style={{
                  textAlign: "left"
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,

                    marginBottom: "6px"
                  }}
                >
                  {voice.label}
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.72)",

                    lineHeight: 1.7,

                    fontSize: "14px"
                  }}
                >
                  {voice.description}
                </p>
              </div>

              <div
                style={{
                  minWidth: "42px",
                  width: "42px",
                  height: "42px",

                  borderRadius: "14px",

                  background: active
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.06)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {active && (
                  <Check size={20} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
