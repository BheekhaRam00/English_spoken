import {
  getStorageItem,
  setStorageItem
} from "./localStorage";

export type LessonProgress = {
  lessonId: number;

  completed: boolean;

  score: number;

  completedAt: string;
};

export type PracticeSession = {
  id: string;

  duration: number;

  fluencyScore: number;

  createdAt: string;
};

export type UserProgress = {
  completedLessons: LessonProgress[];

  practiceSessions: PracticeSession[];

  currentStreak: number;

  totalPracticeMinutes: number;

  fluencyAverage: number;
};

const STORAGE_KEY =
  "user-progress";

const defaultProgress: UserProgress =
  {
    completedLessons: [],

    practiceSessions: [],

    currentStreak: 0,

    totalPracticeMinutes: 0,

    fluencyAverage: 0
  };

export function getUserProgress() {
  return getStorageItem<UserProgress>(
    STORAGE_KEY,
    defaultProgress
  );
}

export function saveLessonProgress(
  progress: LessonProgress
) {
  const current =
    getUserProgress();

  const existingIndex =
    current.completedLessons.findIndex(
      (lesson) =>
        lesson.lessonId ===
        progress.lessonId
    );

  if (existingIndex >= 0) {
    current.completedLessons[
      existingIndex
    ] = progress;
  } else {
    current.completedLessons.push(
      progress
    );
  }

  updateFluencyAverage(current);

  setStorageItem(
    STORAGE_KEY,
    current
  );
}

export function addPracticeSession(
  session: PracticeSession
) {
  const current =
    getUserProgress();

  current.practiceSessions.push(
    session
  );

  current.totalPracticeMinutes +=
    session.duration;

  updateFluencyAverage(current);

  setStorageItem(
    STORAGE_KEY,
    current
  );
}

export function updateStreak(
  streak: number
) {
  const current =
    getUserProgress();

  current.currentStreak =
    streak;

  setStorageItem(
    STORAGE_KEY,
    current
  );
}

export function getCompletedLessonsCount() {
  const progress =
    getUserProgress();

  return progress.completedLessons.filter(
    (lesson) =>
      lesson.completed
  ).length;
}

export function getPracticeSessionsCount() {
  const progress =
    getUserProgress();

  return progress.practiceSessions
    .length;
}

export function getAverageFluencyScore() {
  const progress =
    getUserProgress();

  return progress.fluencyAverage;
}

export function resetUserProgress() {
  setStorageItem(
    STORAGE_KEY,
    defaultProgress
  );
}

function updateFluencyAverage(
  progress: UserProgress
) {
  const lessonScores =
    progress.completedLessons.map(
      (lesson) => lesson.score
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
    progress.fluencyAverage = 0;

    return;
  }

  const total =
    allScores.reduce(
      (sum, score) =>
        sum + score,
      0
    );

  progress.fluencyAverage =
    Math.round(
      total / allScores.length
    );
}
