import {
  VoiceType,
  AIConversationMode,
  ConversationMessage
} from "@/types";

import {
  speakText,
  stopSpeaking
} from "@/services/speech/speechSynthesis";

import {
  startSpeechRecognition,
  stopSpeechRecognition
} from "@/services/speech/speechRecognition";

import {
  continueConversation,
  generateFallbackReply,
  startConversation
} from "@/services/ai/conversation";

type TranscriptCallback = (
  transcript: string
) => void;

type MessageCallback = (
  message: ConversationMessage
) => void;

type ErrorCallback = (
  error: string
) => void;

export type AudioCallEngineConfig =
  {
    mode?: AIConversationMode;

    voiceType?: VoiceType;

    autoSpeak?: boolean;
  };

export class AudioCallEngine {
  private mode: AIConversationMode;

  private voiceType: VoiceType;

  private autoSpeak: boolean;

  private connected: boolean;

  private listening: boolean;

  private processing: boolean;

  private messages: ConversationMessage[];

  constructor({
    mode = "daily",

    voiceType = "female",

    autoSpeak = true
  }: AudioCallEngineConfig = {}) {
    this.mode = mode;

    this.voiceType =
      voiceType;

    this.autoSpeak =
      autoSpeak;

    this.connected =
      false;

    this.listening =
      false;

    this.processing =
      false;

    this.messages = [];
  }

  async connect(
    onMessage?: MessageCallback
  ) {
    if (this.connected) {
      return this.messages[0];
    }

    const starter =
      startConversation({
        mode: this.mode
      });

    const aiMessage: ConversationMessage =
      {
        id: Date.now(),

        role: "ai",

        text: starter,

        createdAt:
          new Date().toISOString()
      };

    this.messages = [
      aiMessage
    ];

    this.connected = true;

    if (this.autoSpeak) {
      speakText({
        text: starter,

        voiceType:
          this.voiceType
      });
    }

    return aiMessage;
  }

  disconnect() {
    stopSpeaking();

    stopSpeechRecognition();

    this.connected =
      false;

    this.listening =
      false;

    this.processing =
      false;
  }

  isConnected() {
    return this.connected;
  }

  isListening() {
    return this.listening;
  }

  getMessages() {
    return this.messages;
  }

  async sendTextMessage(
    text: string,
    onMessage?: MessageCallback
  ) {
    if (
      this.processing
    ) {
      return null;
    }

    const cleaned =
      text
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) {
      return null;
    }

    this.processing =
      true;

    try {
      const userMessage: ConversationMessage =
        {
          id: Date.now(),

          role: "user",

          text: cleaned,

          createdAt:
            new Date().toISOString()
        };

      this.messages.push(
        userMessage
      );

      onMessage?.(
        userMessage
      );

      let aiReply =
        generateFallbackReply(
          cleaned,
          this.mode
        );

      try {
        const reply =
          await continueConversation(
            {
              userMessage:
                cleaned,

              history:
                this.messages
                  .slice(-10)
                  .map(
                    (
                      message
                    ) => ({
                      role:
                        message.role,

                      text:
                        message.text
                    })
                  ),

              mode:
                this.mode
            }
          );

        if (
          reply &&
          reply.trim()
        ) {
          aiReply =
            reply;
        }
      } catch (error) {
        console.error(
          "Audio Call AI Error:",
          error
        );
      }

      const cleanedReply =
        aiReply
          .replace(
            /\n{2,}/g,
            "\n"
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      const aiMessage: ConversationMessage =
        {
          id:
            Date.now() + 1,

          role: "ai",

          text:
            cleanedReply,

          createdAt:
            new Date().toISOString()
        };

      this.messages.push(
        aiMessage
      );

      if (
        this.autoSpeak
      ) {
        speakText({
          text:
            cleanedReply,

          voiceType:
            this.voiceType
        });
      }

      onMessage?.(
        aiMessage
      );

      return aiMessage;
    } finally {
      this.processing =
        false;
    }
  }

  startVoiceListening(
    onTranscript?: TranscriptCallback,
    onMessage?: MessageCallback,
    onError?: ErrorCallback
  ) {
    if (
      this.listening
    ) {
      return;
    }

    this.listening = true;

    startSpeechRecognition({
      language: "en-US",

      onStart: () => {
        this.listening = true;
      },

      onEnd: () => {
        this.listening = false;
      },

      onError: (error) => {
        this.listening = false;

        onError?.(
          error instanceof Error
            ? error.message
            : "Voice recognition error"
        );
      },

      onResult: async (
        transcript
      ) => {
        const cleanedTranscript =
          transcript.trim();

        if (
          !cleanedTranscript
        ) {
          return;
        }

        onTranscript?.(
          cleanedTranscript
        );

        await this.sendTextMessage(
          cleanedTranscript,
          onMessage
        );
      }
    });
  }

  stopVoiceListening() {
    stopSpeechRecognition();

    this.listening =
      false;
  }

  replayLastAIMessage() {
    const lastAI =
      [...this.messages]
        .reverse()
        .find(
          (message) =>
            message.role ===
            "ai"
        );

    if (!lastAI) {
      return;
    }

    speakText({
      text:
        lastAI.text,

      voiceType:
        this.voiceType
    });
  }

  clearConversation() {
    stopSpeaking();

    stopSpeechRecognition();

    this.messages = [];

    this.processing =
      false;

    this.listening =
      false;
  }

  exportConversationText() {
    return this.messages
      .map((message) => {
        const role =
          message.role ===
          "ai"
            ? "AI"
            : "You";

        return `${role}: ${message.text}`;
      })
      .join("\n");
  }

  setMode(
    mode: AIConversationMode
  ) {
    this.mode = mode;
  }

  setVoiceType(
    voiceType: VoiceType
  ) {
    this.voiceType =
      voiceType;
  }
}
