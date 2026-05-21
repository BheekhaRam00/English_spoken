"use client";

import {
  useEffect,
  useMemo,
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

  /*
  STABLE SINGLE ENGINE INSTANCE
  Prevents:
  - reconnect bugs
  - duplicated AI replies
  - state reset issues
  - voice bugs
  - rerender engine recreation
  */
  const engine = useMemo(
    () =>
      new AudioCallEngine({
        mode: "daily",

        voiceType:
          "female",

        autoSpeak: true
      }),
    []
  );

  /*
  Sync mode changes
  */
  useEffect(() => {
    engine.setMode(mode);
  }, [
    engine,
    mode
  ]);

  /*
  Sync voice changes
  */
  useEffect(() => {
    engine.setVoiceType(
      voiceType
    );
  }, [
    engine,
    voiceType
  ]);

  /*
  Cleanup on page leave
  Prevents:
  - stuck microphone
  - speech overlap
  - memory leaks
  */
  useEffect(() => {
    return () => {
      engine.disconnect();
    };
  }, [engine]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0f172a]">
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
