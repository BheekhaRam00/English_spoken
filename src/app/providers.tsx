"use client";

import {
  ReactNode,
  useEffect
} from "react";

import {
  registerServiceWorker,
  initializePWAInstallPrompt
} from "@/lib/pwa";

import {
  AppContextProvider
} from "@/context/AppContext";

import {
  ConversationContextProvider
} from "@/context/ConversationContext";

import SettingsContextProvider from "@/context/SettingsContext";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({
  children
}: ProvidersProps) {
  useEffect(() => {
    registerServiceWorker();

    initializePWAInstallPrompt();
  }, []);

  return (
    <SettingsContextProvider>
      <AppContextProvider>
        <ConversationContextProvider>
          {children}
        </ConversationContextProvider>
      </AppContextProvider>
    </SettingsContextProvider>
  );
}
