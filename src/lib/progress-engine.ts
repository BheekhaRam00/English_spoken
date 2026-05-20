import {
  getUserProgress,
  saveLessonProgress,
  addPracticeSession,
  updateStreak,
  resetUserProgress
} from "@/services/storage/progress";

import {
  generateId
} from "@/utils/helpers";

export type ProgressSummary = {
  completedLessons: number;

  practiceSessions: number;

  fluencyAverage: number;

  totalPracticeMinutes: number;

  streak: number;
};

export type SaveLessonInput = {
  lessonId: number;

  score: number;

  completed?: boolean;
};

export type SavePracticeInput = {
  duration: number;

  fluencyScore: number;
};

export class ProgressEngine {
  getProgress() {
    return getUserProgress();
  }

  saveLesson({
    lessonId,
    score,
    completed = true
  }: SaveLessonInput) {
    saveLessonProgress({
      lessonId,

      score,

      completed,

      completedAt:
        new Date().toISOString()
    });

    return this.getProgress();
  }

  savePracticeSession({
    duration,
    fluencyScore
  }: SavePracticeInput) {
    addPracticeSession({
      id: generateId(),

      duration,

      fluencyScore,

      createdAt:
        new Date().toISOString()
    });

    return this.getProgress();
  }

  updateDailyStreak(
    streak: number
  ) {
    updateStreak(streak);

    return this.getProgress();
  }

  resetAllProgress() {
    resetUserProgress();

    return this.getProgress();
  }

  getSummary(): ProgressSummary {
    const progress =
      this.getProgress();

    return {
      completedLessons:
        progress.completedLessons
          .length,

      practiceSessions:
        progress.practiceSessions
          .length,

      fluencyAverage:
        progress.fluencyAverage,

      totalPracticeMinutes:
        progress.totalPracticeMinutes,

      streak:
        progress.currentStreak
    };
  }

  getLatestPracticeSession() {
    const progress =
      this.getProgress();

    const sessions =
      progress.practiceSessions;

    if (!sessions.length) {
      return null;
    }

    return sessions[
      sessions.length - 1
    ];
  }

  getCompletedLessonIds() {
    const progress =
      this.getProgress();

    return progress.completedLessons.map(
      (lesson) =>
        lesson.lessonId
    );
  }

  isLessonCompleted(
    lessonId: number
  ) {
    const progress =
      this.getProgress();

    return progress.completedLessons.some(
      (lesson) =>
        lesson.lessonId ===
          lessonId &&
        lesson.completed
    );
  }

  getBestFluencyScore() {
    const progress =
      this.getProgress();

    const lessonScores =
      progress.completedLessons.map(
        (lesson) =>
          lesson.score
      );

    const practiceScores =
      progress.practiceSessions.map(
        (session) =>
          session.fluencyScore
      );

    const allScores = [
      ...lessonScores,
      ...practiceScores
    ];

    if (!allScores.length) {
      return 0;
    }

    return Math.max(
      ...allScores
    );
  }

  getAveragePracticeDuration() {
    const progress =
      this.getProgress();

    if (
      !progress.practiceSessions
        .length
    ) {
      return 0;
    }

    const total =
      progress.practiceSessions.reduce(
        (sum, session) =>
          sum + session.duration,
        0
      );

    return Math.round(
      total /
        progress.practiceSessions
          .length
    );
  }

  buildAchievementData() {
    const summary =
      this.getSummary();

    return {
      beginnerCompleted:
        summary.completedLessons >=
        5,

      activeLearner:
        summary.practiceSessions >=
        10,

      fluencyImproved:
        summary.fluencyAverage >=
        70,

      consistencyMaster:
        summary.streak >= 7
    };
  }

  exportProgressReport() {
    const progress =
      this.getProgress();

    return JSON.stringify(
      progress,
      null,
      2
    );
  }
}
