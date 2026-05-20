"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";

type AppContextType = {
  darkMode: boolean;

  toggleDarkMode: () => void;
};

const AppContext =
  createContext<
    AppContextType | undefined
  >(undefined);

export function AppContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkMode] =
    useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppContextProvider"
    );
  }

  return context;
}
