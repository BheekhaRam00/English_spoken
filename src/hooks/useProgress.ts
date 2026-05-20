"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addPracticeSession,
  getAverageFluencyScore,
  getCompletedLessonsCount,
  getPracticeSessionsCount,
  getUserProgress,
  saveLessonProgress,
  updateStreak
} from "@/services/storage/progress";

import {
  LessonProgress,
  PracticeSession,
  UserProgress
} from "@/services/storage/progress";

import {
  generateId
} from "@/utils/helpers";

type SaveLessonParams = {
  lessonId: number;

  score: number;

  completed?: boolean;
};

type AddPracticeParams = {
  duration: number;

  fluencyScore: number;
};

export default function useProgress() {
  const [progress, setProgress] =
    useState<UserProgress | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const refreshProgress =
    useCallback(() => {
      const current =
        getUserProgress();

      setProgress(current);

      setLoading(false);
    }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const completeLesson =
    useCallback(
      ({
        lessonId,
        score,
        completed = true
      }: SaveLessonParams) => {
        const lessonProgress: LessonProgress =
          {
            lessonId,

            score,

            completed,

            completedAt:
              new Date().toISOString()
          };

        saveLessonProgress(
          lessonProgress
        );

        refreshProgress();
      },
      [refreshProgress]
    );

  const savePractice =
    useCallback(
      ({
        duration,
        fluencyScore
      }: AddPracticeParams) => {
        const session: PracticeSession =
          {
            id: generateId(),

            duration,

            fluencyScore,

            createdAt:
              new Date().toISOString()
          };

        addPracticeSession(
          session
        );

        refreshProgress();
      },
      [refreshProgress]
    );

  const setDailyStreak =
    useCallback(
      (streak: number) => {
        updateStreak(streak);

        refreshProgress();
      },
      [refreshProgress]
    );

  const completedLessons =
    getCompletedLessonsCount();

  const practiceSessions =
    getPracticeSessionsCount();

  const fluencyAverage =
    getAverageFluencyScore();

  return {
    loading,

    progress,

    completedLessons,

    practiceSessions,

    fluencyAverage,

    refreshProgress,

    completeLesson,

    savePractice,

    setDailyStreak
  };
}
