import {
  LearningMode,
  VoiceType,
  AIConversationMode,
  ConversationMessage
} from "@/types";

import {
  LearningEngine
} from "./learning-engine";

import {
  ConversationEngine
} from "./conversation-engine";

import {
  PronunciationEngine
} from "./pronunciation-engine";

import {
  ProgressEngine
} from "./progress-engine";

import {
  SettingsEngine
} from "./settings-engine";

import {
  OfflineEngine
} from "./offline-engine";

export type AppEngineConfig = {
  apiKey?: string;
};

export class AppEngine {
  private learningEngine:
    LearningEngine;

  private conversationEngine:
    ConversationEngine;

  private pronunciationEngine:
    PronunciationEngine;

  private progressEngine:
    ProgressEngine;

  private settingsEngine:
    SettingsEngine;

  private offlineEngine:
    OfflineEngine;

  constructor({
    apiKey = ""
  }: AppEngineConfig = {}) {
    this.settingsEngine =
      new SettingsEngine();

    const settings =
      this.settingsEngine.getSettings();

    this.learningEngine =
      new LearningEngine(
        settings.learningMode,
        apiKey
      );

    this.conversationEngine =
      new ConversationEngine({
        apiKey,

        mode:
          settings.learningMode as AIConversationMode,

        voiceType:
          settings.selectedVoice,

        autoSpeak:
          settings.autoSpeak
      });

    this.pronunciationEngine =
      new PronunciationEngine();

    this.progressEngine =
      new ProgressEngine();

    this.offlineEngine =
      new OfflineEngine();
  }

  getSettings() {
    return this.settingsEngine.getSettings();
  }

  updateVoice(
    voice: VoiceType
  ) {
    this.settingsEngine.updateVoice(
      voice
    );

    this.conversationEngine.setVoice(
      voice
    );
  }

  updateLearningMode(
    mode: LearningMode
  ) {
    this.settingsEngine.updateLearningMode(
      mode
    );

    this.learningEngine.setMode(
      mode
    );

    if (
      [
        "daily",
        "business",
        "interview",
        "advanced"
      ].includes(mode)
    ) {
      this.conversationEngine.setMode(
        mode as AIConversationMode
      );
    }
  }

  getLearningLesson() {
    return this.learningEngine.getNextLesson();
  }

  getRandomLesson() {
    return this.learningEngine.getRandomLesson();
  }

  async generateAILesson(
    level = "beginner"
  ) {
    return this.learningEngine.generateAILesson(
      level
    );
  }

  completeLesson(
    lessonId: number,
    score = 100
  ) {
    this.learningEngine.completeLesson(
      lessonId,
      score
    );

    return this.progressEngine.saveLesson(
      {
        lessonId,

        score,

        completed: true
      }
    );
  }

  getProgressSummary() {
    return this.progressEngine.getSummary();
  }

  getAchievements() {
    return this.progressEngine.buildAchievementData();
  }

  async startConversation() {
    return this.conversationEngine.initializeConversation();
  }

  async sendConversationMessage(
    text: string
  ) {
    return this.conversationEngine.sendMessage(
      text
    );
  }

  getConversationMessages() {
    return this.conversationEngine.getMessages();
  }

  replayLastAIMessage() {
    return this.conversationEngine.replayLastAIMessage();
  }

  clearConversation() {
    this.conversationEngine.clearMessages();
  }

  analyzePronunciation(
    originalSentence: string,
    spokenSentence: string
  ) {
    return this.pronunciationEngine.analyze(
      originalSentence,
      spokenSentence
    );
  }

  speakPracticeSentence(
    sentence: string
  ) {
    return this.pronunciationEngine.speakSentence(
      sentence
    );
  }

  savePracticeSession(
    duration: number,
    fluencyScore: number
  ) {
    return this.progressEngine.savePracticeSession(
      {
        duration,

        fluencyScore
      }
    );
  }

  getOfflineLessons(
    mode: LearningMode
  ) {
    return this.offlineEngine.getLessons(
      mode
    );
  }

  getOfflineBundle(
    mode: LearningMode
  ) {
    return this.offlineEngine.getOfflineBundle(
      mode
    );
  }

  searchLessons(
    query: string
  ) {
    return this.learningEngine.searchLessons(
      query
    );
  }

  async getDailyPracticePlan() {
    return this.learningEngine.getDailyPracticePlan();
  }

  exportConversationText() {
    return this.conversationEngine.exportConversation();
  }

  exportProgressData() {
    return this.progressEngine.exportProgressReport();
  }

  resetAppProgress() {
    this.learningEngine.resetProgress();

    return this.progressEngine.resetAllProgress();
  }

  getAppStatistics() {
    return {
      learning:
        this.learningEngine.getLearningStatistics(),

      progress:
        this.progressEngine.getSummary(),

      offline:
        this.offlineEngine.getOfflineStatistics(),

      settings:
        this.settingsEngine.getSettings()
    };
  }

  async buildStartupState() {
    return {
      settings:
        this.settingsEngine.getSettings(),

      statistics:
        this.getAppStatistics(),

      lesson:
        this.learningEngine.getNextLesson(),

      practice:
        await this.learningEngine.getDailyPracticePlan()
    };
  }

  getRecommendedSentence() {
    const lesson =
      this.learningEngine.getRandomLesson();

    return (
      lesson?.english ||
      lesson?.sentence ||
      "Practice English every day."
    );
  }

  getVocabularyPractice() {
    return this.learningEngine.getVocabularyPractice();
  }

  getPhrasePractice() {
    return this.learningEngine.getPhrasePractice();
  }

  getPronunciationTip() {
    return this.learningEngine.getPronunciationTip();
  }

  isVoiceEnabled() {
    return this.settingsEngine.isVoiceEnabled();
  }

  areSubtitlesEnabled() {
    return this.settingsEngine.areSubtitlesEnabled();
  }

  getConversationLength() {
    return this.conversationEngine.getConversationLength();
  }

  hasConversationStarted() {
    return this.conversationEngine.hasConversationStarted();
  }

  getLastConversationMessage():
    | ConversationMessage
    | null {
    const messages =
      this.conversationEngine.getMessages();

    if (!messages.length) {
      return null;
    }

    return messages[
      messages.length - 1
    ];
  }
}
