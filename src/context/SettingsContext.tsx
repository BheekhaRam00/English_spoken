"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";

type SettingsContextType = {
  speechRate: number;

  pitch: number;

  autoSpeak: boolean;

  setSpeechRate: (
    value: number
  ) => void;

  setPitch: (
    value: number
  ) => void;

  setAutoSpeak: (
    value: boolean
  ) => void;
};

const SettingsContext =
  createContext<
    SettingsContextType | undefined
  >(undefined);

export default function SettingsContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [speechRate, setSpeechRate] =
    useState(1);

  const [pitch, setPitch] =
    useState(1);

  const [autoSpeak, setAutoSpeak] =
    useState(true);

  return (
    <SettingsContext.Provider
      value={{
        speechRate,
        pitch,
        autoSpeak,

        setSpeechRate,
        setPitch,
        setAutoSpeak
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettingsContext must be used inside SettingsContextProvider"
    );
  }

  return context;
}
