"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";

type Message = {
  id: number;

  role: "ai" | "user";

  text: string;
};

type ConversationContextType = {
  messages: Message[];

  addMessage: (
    message: Message
  ) => void;

  clearMessages: () => void;
};

const ConversationContext =
  createContext<
    ConversationContextType | undefined
  >(undefined);

export function ConversationContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const addMessage = (
    message: Message
  ) => {
    setMessages((prev) => [
      ...prev,
      message
    ]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context =
    useContext(
      ConversationContext
    );

  if (!context) {
    throw new Error(
      "useConversationContext must be used inside ConversationContextProvider"
    );
  }

  return context;
}
