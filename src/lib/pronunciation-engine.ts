import {
  analyzePronunciation,
  generatePronunciationTips,
  getHardWords,
  speakPronunciation
} from "@/services/speech/pronunciation";

import {
  PronunciationFeedback
} from "@/types";

export type PronunciationAnalysisResult =
  {
    feedback: PronunciationFeedback;

    hardWords: string[];

    tips: string[];

    spokenSentence: string;

    originalSentence: string;
  };

export class PronunciationEngine {
  analyze(
    originalSentence: string,
    spokenSentence: string
  ): PronunciationAnalysisResult {
    const feedback =
      analyzePronunciation(
        originalSentence,
        spokenSentence
      );

    const hardWords =
      getHardWords(
        originalSentence
      );

    const tips =
      generatePronunciationTips(
        feedback.score
      );

    return {
      feedback,

      hardWords,

      tips,

      spokenSentence,

      originalSentence
    };
  }

  speakSentence(
    sentence: string
  ) {
    speakPronunciation(
      sentence
    );
  }

  getPracticeLevel(
    score: number
  ) {
    if (score >= 90) {
      return "Excellent";
    }

    if (score >= 75) {
      return "Good";
    }

    if (score >= 55) {
      return "Average";
    }

    return "Needs Improvement";
  }

  buildPracticeSummary(
    result: PronunciationAnalysisResult
  ) {
    return {
      score:
        result.feedback.score,

      level:
        this.getPracticeLevel(
          result.feedback.score
        ),

      feedback:
        result.feedback.feedback,

      difficultWords:
        result.hardWords,

      recommendations:
        result.tips
    };
  }

  compareSentences(
    originalSentence: string,
    spokenSentence: string
  ) {
    const originalWords =
      originalSentence
        .toLowerCase()
        .split(" ");

    const spokenWords =
      spokenSentence
        .toLowerCase()
        .split(" ");

    return originalWords.map(
      (word) => ({
        word,

        matched:
          spokenWords.includes(
            word
          )
      })
    );
  }

  generateNextPracticeSentence(
    score: number
  ) {
    if (score >= 90) {
      return "I can communicate confidently in professional English.";
    }

    if (score >= 75) {
      return "I am improving my spoken English every day.";
    }

    if (score >= 55) {
      return "Practice helps me speak English more clearly.";
    }

    return "I will practice English slowly and clearly.";
  }

  calculateAverageScore(
    scores: number[]
  ) {
    if (!scores.length) {
      return 0;
    }

    const total =
      scores.reduce(
        (sum, score) =>
          sum + score,
        0
      );

    return Math.round(
      total / scores.length
    );
  }

  isPronunciationStrong(
    score: number
  ) {
    return score >= 75;
  }
}
