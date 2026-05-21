"use client";

import {
  useEffect,
  useState
} from "react";

import PracticeScreen from "@/components/screens/PracticeScreen";

import {
  AIConversationMode,
  VoiceType
} from "@/types";

import {
  AudioCallEngine
} from "@/lib/audio-call-engine";

export default function PracticePage() {
  const [mode, setMode] =
    useState<AIConversationMode>(
      "daily"
    );

  const [voiceType, setVoiceType] =
    useState<VoiceType>(
      "female"
    );

  const [engine] = useState(
    () =>
      new AudioCallEngine({
        mode: "daily",

        voiceType:
          "female",

        autoSpeak: true
      })
  );

  useEffect(() => {
    engine.setMode(mode);

    engine.setVoiceType(
      voiceType
    );
  }, [
    engine,
    mode,
    voiceType
  ]);

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <PracticeScreen
        engine={engine}
        mode={mode}
        voiceType={
          voiceType
        }
        onModeChange={
          setMode
        }
        onVoiceChange={
          setVoiceType
        }
      />
    </main>
  );
}
