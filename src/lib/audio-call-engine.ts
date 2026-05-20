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

export type AudioCallEngineConfig =
  {
    apiKey?: string;

    mode?: AIConversationMode;

    voiceType?: VoiceType;

    autoSpeak?: boolean;
  };

type TranscriptCallback = (
  transcript: string
) => void;

type MessageCallback = (
  message: ConversationMessage
) => void;

type ErrorCallback = (
  error: string
) => void;

export class AudioCallEngine {
  private apiKey: string;

  private mode: AIConversationMode;

  private voiceType: VoiceType;

  private autoSpeak: boolean;

  private connected: boolean;

  private listening: boolean;

  private messages: ConversationMessage[];

  constructor({
    apiKey = "",

    mode = "daily",

    voiceType = "female",

    autoSpeak = true
  }: AudioCallEngineConfig = {}) {
    this.apiKey = apiKey;

    this.mode = mode;

    this.voiceType = voiceType;

    this.autoSpeak = autoSpeak;

    this.connected = false;

    this.listening = false;

    this.messages = [];
  }

  async connect(
    onMessage?: MessageCallback
  ) {
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

    this.messages.push(
      aiMessage
    );

    this.connected = true;

    if (this.autoSpeak) {
      speakText({
        text: starter,

        voiceType:
          this.voiceType
      });
    }

    onMessage?.(aiMessage);

    return aiMessage;
  }

  disconnect() {
    stopSpeaking();

    stopSpeechRecognition();

    this.connected = false;

    this.listening = false;
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
    const cleaned =
      text.trim();

    if (!cleaned) {
      return null;
    }

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

    onMessage?.(userMessage);

    let aiReply =
      generateFallbackReply(
        cleaned
      );

    try {
      if (this.apiKey) {
        aiReply =
          await continueConversation(
            {
              userMessage:
                cleaned,

              apiKey:
                this.apiKey,

              history:
                this.messages.map(
                  (message) => ({
                    role:
                      message.role,

                    text:
                      message.text
                  })
                ),

              mode: this.mode
            }
          );
      }
    } catch (error) {
      console.error(
        "Audio call AI error:",
        error
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

    this.messages.push(
      aiMessage
    );

    if (this.autoSpeak) {
      speakText({
        text: aiReply,

        voiceType:
          this.voiceType
      });
    }

    onMessage?.(aiMessage);

    return aiMessage;
  }

  startVoiceListening(
    onTranscript?: TranscriptCallback,
    onMessage?: MessageCallback,
    onError?: ErrorCallback
  ) {
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

        onError?.(error);
      },

      onResult: async (
        result
      ) => {
        const transcript =
          result.transcript;

        onTranscript?.(
          transcript
        );

        await this.sendTextMessage(
          transcript,
          onMessage
        );
      }
    });
  }

  stopVoiceListening() {
    stopSpeechRecognition();

    this.listening = false;
  }

  replayLastAIMessage() {
    const lastAI =
      [...this.messages]
        .reverse()
        .find(
          (message) =>
            message.role === "ai"
        );

    if (!lastAI) {
      return;
    }

    speakText({
      text: lastAI.text,

      voiceType:
        this.voiceType
    });
  }

  clearConversation() {
    this.messages = [];
  }

  exportConversationText() {
    return this.messages
      .map((message) => {
        const role =
          message.role === "ai"
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
