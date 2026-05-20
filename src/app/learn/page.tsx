"use client";

import { useEffect, useState } from "react";

import LearnScreen from "@/components/screens/LearnScreen";

import {
  LearningMode
} from "@/types";

import {
  LearningEngine
} from "@/lib/learning-engine";

export default function LearnPage() {
  const [mode, setMode] =
    useState<LearningMode>(
      "daily"
    );

  const [engine] = useState(
    () =>
      new LearningEngine(
        "daily"
      )
  );

  useEffect(() => {
    engine.setMode(mode);
  }, [engine, mode]);

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <LearnScreen
        mode={mode}
        onModeChange={
          setMode
        }
        engine={engine}
      />
    </main>
  );
}
