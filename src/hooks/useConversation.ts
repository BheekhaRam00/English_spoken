"use client";

import { useCallback, useState } from "react";

import {
  continueConversation,
  generateFallbackReply,
  startConversation
} from "@/services/ai/conversation";

import {
  ConversationMessage,
  AIConversationMode,
  VoiceType
} from "@/types";

import {
  generateId
} from "@/utils/helpers";

import {
  speakText
} from "@/services/speech/speechSynthesis";

type UseConversationOptions = {
  apiKey?: string;

  mode?: AIConversationMode;

  autoSpeak?: boolean;

  voiceType?: VoiceType;
};

export default function useConversation({
  apiKey = "",

  mode = "daily",

  autoSpeak = true,

  voiceType = "female"
}: UseConversationOptions = {}) {
  const [messages, setMessages] =
    useState<ConversationMessage[]>(
      []
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [connected, setConnected] =
    useState(false);

  const initializeConversation =
    useCallback(() => {
      const starter =
        startConversation({
          mode
        });

      const initialMessage: ConversationMessage =
        {
          id: Date.now(),

          role: "ai",

          text: starter,

          createdAt:
            new Date().toISOString()
        };

      setMessages([
        initialMessage
      ]);

      setConnected(true);

      if (autoSpeak) {
        speakText({
          text: starter,

          voiceType
        });
      }
    }, [
      autoSpeak,
      mode,
      voiceType
    ]);

  const sendMessage =
    useCallback(
      async (
        text: string
      ) => {
        const cleaned =
          text.trim();

        if (!cleaned) {
          return;
        }

        setLoading(true);

        setError("");

        const userMessage: ConversationMessage =
          {
            id: Date.now(),

            role: "user",

            text: cleaned,

            createdAt:
              new Date().toISOString()
          };

        setMessages((prev) => [
          ...prev,
          userMessage
        ]);

        try {
          let aiReply =
            generateFallbackReply(
              cleaned
            );

          if (apiKey) {
            aiReply =
              await continueConversation(
                {
                  userMessage:
                    cleaned,

                  apiKey,

                  history: [
                    ...messages,
                    userMessage
                  ].map(
                    (message) => ({
                      role:
                        message.role,

                      text:
                        message.text
                    })
                  ),

                  mode
                }
              );
          }

          const aiMessage: ConversationMessage =
            {
              id:
                Date.now() + 1,

              role: "ai",

              text: aiReply,

              createdAt:
                new Date().toISOString()
            };

          setMessages((prev) => [
            ...prev,
            aiMessage
          ]);

          if (autoSpeak) {
            speakText({
              text: aiReply,

              voiceType
            });
          }
        } catch (
          conversationError
        ) {
          console.error(
            "Conversation hook error:",
            conversationError
          );

          setError(
            "Unable to continue conversation."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        apiKey,
        autoSpeak,
        messages,
        mode,
        voiceType
      ]
    );

  const clearConversation =
    useCallback(() => {
      setMessages([]);

      setConnected(false);

      setError("");

      setLoading(false);
    }, []);

  const addSystemMessage =
    useCallback(
      (text: string) => {
        const systemMessage: ConversationMessage =
          {
            id:
              Date.now(),

            role: "ai",

            text,

            createdAt:
              new Date().toISOString()
          };

        setMessages((prev) => [
          ...prev,
          systemMessage
        ]);
      },
      []
    );

  const getLastMessage =
    useCallback(() => {
      if (!messages.length) {
        return null;
      }

      return messages[
        messages.length - 1
      ];
    }, [messages]);

  return {
    messages,

    loading,

    error,

    connected,

    initializeConversation,

    sendMessage,

    clearConversation,

    addSystemMessage,

    getLastMessage
  };
            }
