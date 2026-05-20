import {
  VoiceType,
  LearningMode
} from "@/types";

import {
  getStorageItem,
  setStorageItem
} from "@/services/storage/localStorage";

const SETTINGS_KEY =
  "fluentpro-settings";

export type AppSettings = {
  selectedVoice: VoiceType;

  learningMode: LearningMode;

  autoSpeak: boolean;

  subtitlesEnabled: boolean;

  pronunciationFeedback: boolean;

  speechRate: number;

  pitch: number;

  volume: number;

  darkMode: boolean;
};

const defaultSettings: AppSettings =
  {
    selectedVoice: "female",

    learningMode: "daily",

    autoSpeak: true,

    subtitlesEnabled: true,

    pronunciationFeedback: true,

    speechRate: 0.95,

    pitch: 1,

    volume: 1,

    darkMode: true
  };

export class SettingsEngine {
  getSettings(): AppSettings {
    return getStorageItem<AppSettings>(
      SETTINGS_KEY,
      defaultSettings
    );
  }

  saveSettings(
    settings: AppSettings
  ) {
    setStorageItem(
      SETTINGS_KEY,
      settings
    );

    return settings;
  }

  resetSettings() {
    setStorageItem(
      SETTINGS_KEY,
      defaultSettings
    );

    return defaultSettings;
  }

  updateVoice(
    voice: VoiceType
  ) {
    const settings =
      this.getSettings();

    settings.selectedVoice =
      voice;

    return this.saveSettings(
      settings
    );
  }

  updateLearningMode(
    mode: LearningMode
  ) {
    const settings =
      this.getSettings();

    settings.learningMode =
      mode;

    return this.saveSettings(
      settings
    );
  }

  toggleAutoSpeak() {
    const settings =
      this.getSettings();

    settings.autoSpeak =
      !settings.autoSpeak;

    return this.saveSettings(
      settings
    );
  }

  toggleSubtitles() {
    const settings =
      this.getSettings();

    settings.subtitlesEnabled =
      !settings.subtitlesEnabled;

    return this.saveSettings(
      settings
    );
  }

  togglePronunciationFeedback() {
    const settings =
      this.getSettings();

    settings.pronunciationFeedback =
      !settings.pronunciationFeedback;

    return this.saveSettings(
      settings
    );
  }

  toggleDarkMode() {
    const settings =
      this.getSettings();

    settings.darkMode =
      !settings.darkMode;

    return this.saveSettings(
      settings
    );
  }

  updateSpeechSettings({
    speechRate,
    pitch,
    volume
  }: {
    speechRate?: number;

    pitch?: number;

    volume?: number;
  }) {
    const settings =
      this.getSettings();

    if (
      speechRate !== undefined
    ) {
      settings.speechRate =
        speechRate;
    }

    if (pitch !== undefined) {
      settings.pitch = pitch;
    }

    if (
      volume !== undefined
    ) {
      settings.volume = volume;
    }

    return this.saveSettings(
      settings
    );
  }

  enableMinimalMode() {
    const settings =
      this.getSettings();

    settings.autoSpeak = false;

    settings.subtitlesEnabled =
      true;

    settings.pronunciationFeedback =
      false;

    return this.saveSettings(
      settings
    );
  }

  enableFullPracticeMode() {
    const settings =
      this.getSettings();

    settings.autoSpeak = true;

    settings.subtitlesEnabled =
      true;

    settings.pronunciationFeedback =
      true;

    return this.saveSettings(
      settings
    );
  }

  exportSettings() {
    return JSON.stringify(
      this.getSettings(),
      null,
      2
    );
  }

  importSettings(
    json: string
  ) {
    try {
      const parsed =
        JSON.parse(json);

      return this.saveSettings(
        parsed
      );
    } catch (error) {
      console.error(
        "Settings import error:",
        error
      );

      return this.getSettings();
    }
  }

  isVoiceEnabled() {
    return this.getSettings()
      .autoSpeak;
  }

  areSubtitlesEnabled() {
    return this.getSettings()
      .subtitlesEnabled;
  }

  isPronunciationEnabled() {
    return this.getSettings()
      .pronunciationFeedback;
  }
}
