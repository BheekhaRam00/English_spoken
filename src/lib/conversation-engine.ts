import {
  AIConversationMode,
  ConversationMessage,
  VoiceType
} from "@/types";

import {
  continueConversation,
  generateFallbackReply,
  startConversation
} from "@/services/ai/conversation";

import {
  speakText
} from "@/services/speech/speechSynthesis";

import {
  generateId
} from "@/utils/helpers";

export type ConversationEngineConfig =
  {
    apiKey?: string;

    mode?: AIConversationMode;

    voiceType?: VoiceType;

    autoSpeak?: boolean;
  };

export type ConversationEngineReply =
  {
    userMessage: ConversationMessage;

    aiMessage: ConversationMessage;
  };

export class ConversationEngine {
  private apiKey: string;

  private mode: AIConversationMode;

  private voiceType: VoiceType;

  private autoSpeak: boolean;

  private history: ConversationMessage[];

  constructor({
    apiKey = "",

    mode = "daily",

    voiceType = "female",

    autoSpeak = true
  }: ConversationEngineConfig = {}) {
    this.apiKey = apiKey;

    this.mode = mode;

    this.voiceType = voiceType;

    this.autoSpeak = autoSpeak;

    this.history = [];
  }

  getMessages() {
    return this.history;
  }

  clearMessages() {
    this.history = [];
  }

  setMode(
    mode: AIConversationMode
  ) {
    this.mode = mode;
  }

  setVoice(
    voice: VoiceType
  ) {
    this.voiceType = voice;
  }

  async initializeConversation() {
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

    this.history.push(
      aiMessage
    );

    if (this.autoSpeak) {
      speakText({
        text: starter,

        voiceType:
          this.voiceType
      });
    }

    return aiMessage;
  }

  async sendMessage(
    message: string
  ): Promise<ConversationEngineReply> {
    const cleaned =
      message.trim();

    if (!cleaned) {
      throw new Error(
        "Message cannot be empty."
      );
    }

    const userMessage: ConversationMessage =
      {
        id: Date.now(),

        role: "user",

        text: cleaned,

        createdAt:
          new Date().toISOString()
      };

    this.history.push(
      userMessage
    );

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
                this.history.map(
                  (item) => ({
                    role:
                      item.role,

                    text:
                      item.text
                  })
                ),

              mode: this.mode
            }
          );
      }
    } catch (error) {
      console.error(
        "Conversation engine error:",
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

    this.history.push(
      aiMessage
    );

    if (this.autoSpeak) {
      speakText({
        text: aiReply,

        voiceType:
          this.voiceType
      });
    }

    return {
      userMessage,

      aiMessage
    };
  }

  async simulateTypingDelay(
    milliseconds = 1200
  ) {
    return new Promise(
      (resolve) => {
        setTimeout(
          resolve,
          milliseconds
        );
      }
    );
  }

  exportConversation() {
    return this.history
      .map((message) => {
        const role =
          message.role === "ai"
            ? "AI"
            : "User";

        return `${role}: ${message.text}`;
      })
      .join("\n");
  }

  async replayLastAIMessage() {
    const lastAIMessage =
      [...this.history]
        .reverse()
        .find(
          (message) =>
            message.role === "ai"
        );

    if (!lastAIMessage) {
      return;
    }

    speakText({
      text: lastAIMessage.text,

      voiceType:
        this.voiceType
    });
  }

  getConversationLength() {
    return this.history.length;
  }

  hasConversationStarted() {
    return (
      this.history.length > 0
    );
  }
        }
