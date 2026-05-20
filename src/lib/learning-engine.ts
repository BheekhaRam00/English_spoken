import {
  LearningMode,
  LessonItem,
  VocabularyItem,
  PhraseItem
} from "@/types";

import {
  getLessonsByMode,
  getRandomLesson,
  getRandomPhrase,
  getRandomPronunciationTip
} from "./lesson-loader";

import {
  generateDynamicLesson
} from "./ai-lesson-generator";

export type LearningSessionState = {
  mode: LearningMode;

  currentLesson: LessonItem | null;

  completedLessons: number[];

  score: number;

  startedAt: string;
};

export type GeneratedLearningContent =
  {
    title: string;

    english: string;

    hindi: string;

    vocabulary: VocabularyItem[];

    phrases: PhraseItem[];

    pronunciationTip: string;
  };

export class LearningEngine {
  private mode: LearningMode;

  private completedLessons: number[];

  private score: number;

  constructor(
    mode: LearningMode =
      "beginner"
  ) {
    this.mode = mode;

    this.completedLessons =
      [];

    this.score = 0;
  }

  setMode(
    mode: LearningMode
  ) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  getLessons() {
    return getLessonsByMode(
      this.mode
    );
  }

  getLessonById(
    lessonId: number
  ) {
    return this.getLessons().find(
      (lesson) =>
        lesson.id === lessonId
    );
  }

  getNextLesson() {
    const lessons =
      this.getLessons();

    const nextLesson =
      lessons.find(
        (lesson) =>
          !this.completedLessons.includes(
            lesson.id
          )
      );

    return (
      nextLesson ||
      lessons[0] ||
      null
    );
  }

  getRandomLesson() {
    return getRandomLesson(
      this.mode
    );
  }

  completeLesson(
    lessonId: number,
    points = 10
  ) {
    if (
      !this.completedLessons.includes(
        lessonId
      )
    ) {
      this.completedLessons.push(
        lessonId
      );

      this.score += points;
    }

    return {
      completedLessons:
        this.completedLessons,

      score: this.score
    };
  }

  getCompletedLessons() {
    return this.completedLessons;
  }

  getProgressPercentage() {
    const totalLessons =
      this.getLessons().length;

    if (!totalLessons) {
      return 0;
    }

    return Math.round(
      (this.completedLessons
        .length /
        totalLessons) *
        100
    );
  }

  getScore() {
    return this.score;
  }

  resetProgress() {
    this.completedLessons =
      [];

    this.score = 0;
  }

  buildLearningSession(): LearningSessionState {
    return {
      mode: this.mode,

      currentLesson:
        this.getNextLesson(),

      completedLessons:
        this.completedLessons,

      score: this.score,

      startedAt:
        new Date().toISOString()
    };
  }

  getVocabularyPractice() {
    const lesson =
      this.getRandomLesson();

    return (
      lesson?.vocabulary || []
    );
  }

  getPhrasePractice() {
    return getRandomPhrase();
  }

  getPronunciationTip() {
    return getRandomPronunciationTip();
  }

  async generateAILesson(
    apiKey: string,
    userLevel = "beginner"
  ): Promise<GeneratedLearningContent | null> {
    try {
      const lesson =
        await generateDynamicLesson(
          {
            apiKey,

            mode: this.mode,

            userLevel
          }
        );

      if (!lesson) {
        return null;
      }

      return {
        title: lesson.title,

        english:
          lesson.english,

        hindi: lesson.hindi,

        vocabulary:
          lesson.vocabulary,

        phrases:
          lesson.phrases,

        pronunciationTip:
          lesson.pronunciationTip
      };
    } catch (error) {
      console.error(
        "Learning engine AI error:",
        error
      );

      return null;
    }
  }

  generateOfflineLesson() {
    const lesson =
      this.getRandomLesson();

    if (!lesson) {
      return null;
    }

    return {
      title:
        lesson.category,

      english:
        lesson.english ||
        lesson.sentence ||
        "",

      hindi:
        lesson.hindi ||
        lesson.translation ||
        "",

      vocabulary:
        lesson.vocabulary || [],

      phrases:
        lesson.phrases || [],

      pronunciationTip:
        this.getPronunciationTip()
          ?.tip ||
        "Speak slowly and clearly."
    };
  }

  searchLessons(
    query: string
  ) {
    const normalized =
      query.toLowerCase();

    return this.getLessons().filter(
      (lesson) => {
        const englishText =
          (
            lesson.english ||
            lesson.sentence ||
            ""
          ).toLowerCase();

        const hindiText =
          (
            lesson.hindi ||
            lesson.translation ||
            ""
          ).toLowerCase();

        return (
          englishText.includes(
            normalized
          ) ||
          hindiText.includes(
            normalized
          )
        );
      }
    );
  }

  getDailyPracticePlan() {
    return {
      lesson:
        this.getRandomLesson(),

      phrase:
        this.getPhrasePractice(),

      pronunciationTip:
        this.getPronunciationTip(),

      practiceMinutes: 10
    };
  }

  getLearningStatistics() {
    return {
      mode: this.mode,

      completedLessons:
        this.completedLessons
          .length,

      totalLessons:
        this.getLessons().length,

      score: this.score,

      progress:
        this.getProgressPercentage()
    };
  }
        }
