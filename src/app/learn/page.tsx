"use client";

import { useState } from "react";

import LearnScreen from "@/components/screens/LearnScreen";

import {
  LearningMode
} from "@/types";

export default function LearnPage() {
  const [mode, setMode] =
    useState<LearningMode>(
      "daily"
    );

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <LearnScreen
        mode={mode}
        onModeChange={
          setMode
        }
      />
    </main>
  );
}
