"use client";

import { useEffect, useState } from "react";

import {
  Volume2,
  Mic2,
  AudioWaveform,
  CheckCircle2
} from "lucide-react";

import {
  VoiceType
} from "@/types";

import {
  SettingsEngine
} from "@/lib/settings-engine";

type VoiceSettingsProps = {
  onVoiceChange?: (
    voice: VoiceType
  ) => void;
};

const voices = [
  {
    id: "female" as VoiceType,

    title:
      "Female Voice",

    description:
      "Natural friendly AI voice",

    icon: (
      <Volume2 size={22} />
    )
  },

  {
    id: "male" as VoiceType,

    title:
      "Male Voice",

    description:
      "Clear confident speaking voice",

    icon: (
      <Mic2 size={22} />
    )
  },

  {
    id:
      "professional" as VoiceType,

    title:
      "Professional Voice",

    description:
      "Business style AI speaking",

    icon: (
      <AudioWaveform
        size={22}
      />
    )
  }
];

export default function VoiceSettings({
  onVoiceChange
}: VoiceSettingsProps) {
  const settingsEngine =
    new SettingsEngine();

  const [
    selectedVoice,
    setSelectedVoice
  ] = useState<VoiceType>(
    "female"
  );

  useEffect(() => {
    const settings =
      settingsEngine.getSettings();

    setSelectedVoice(
      settings.selectedVoice
    );
  }, []);

  const handleVoiceChange =
    (
      voice: VoiceType
    ) => {
      setSelectedVoice(
        voice
      );

      settingsEngine.updateVoice(
        voice
      );

      onVoiceChange?.(
        voice
      );

      if (
        typeof window !==
        "undefined"
      ) {
        const preview =
          new SpeechSynthesisUtterance(
            "Hello, welcome to FluentPro AI."
          );

        preview.lang =
          "en-US";

        preview.rate =
          0.95;

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(
          preview
        );
      }
    };

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
        <Volume2
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
            AI Voice Settings
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,0.70)"
            }}
          >
            Select your preferred AI speaking
            voice.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gap: "16px"
        }}
      >
        {voices.map(
          (voice) => {
            const active =
              selectedVoice ===
              voice.id;

            return (
              <button
                key={
                  voice.id
                }
                onClick={() =>
                  handleVoiceChange(
                    voice.id
                  )
                }
                style={{
                  padding:
                    "22px",

                  borderRadius:
                    "22px",

                  background:
                    active
                      ? "linear-gradient(135deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                      : "rgba(255,255,255,0.05)",

                  border:
                    active
                      ? "1px solid rgba(147,51,234,0.35)"
                      : "1px solid rgba(255,255,255,0.04)",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: "18px",

                  transition:
                    "0.2s ease"
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "18px"
                  }}
                >
                  <div
                    style={{
                      width: "58px",

                      height:
                        "58px",

                      borderRadius:
                        "18px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      background:
                        active
                          ? "linear-gradient(90deg, #9333ea, #2563eb)"
                          : "rgba(255,255,255,0.08)"
                    }}
                  >
                    {
                      voice.icon
                    }
                  </div>

                  <div
                    style={{
                      textAlign:
                        "left"
                    }}
                  >
                    <h3
                      style={{
                        fontSize:
                          "20px",

                        marginBottom:
                          "6px"
                      }}
                    >
                      {
                        voice.title
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "rgba(255,255,255,0.70)",

                        lineHeight:
                          1.6
                      }}
                    >
                      {
                        voice.description
                      }
                    </p>
                  </div>
                </div>

                {active && (
                  <CheckCircle2
                    size={26}
                  />
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
                  }
