import {
  LearningMode,
  LessonItem,
  LearningPhrase,
  PronunciationTip
} from "@/types";

import {
  getLessonsByMode,
  getRandomLesson,
  getAllPhrases,
  getRandomPhrase,
  getPronunciationTips,
  getRandomPronunciationTip
} from "./lesson-loader";

export type OfflineLessonBundle = {
  lessons: LessonItem[];

  phrases: LearningPhrase[];

  pronunciationTips: PronunciationTip[];
};

export class OfflineEngine {
  getLessons(
    mode: LearningMode
  ) {
    return getLessonsByMode(
      mode
    );
  }

  getLesson(
    mode: LearningMode,
    lessonId: number
  ) {
    const lessons =
      getLessonsByMode(mode);

    return lessons.find(
      (lesson) =>
        lesson.id === lessonId
    );
  }

  getRandomLesson(
    mode: LearningMode
  ) {
    return getRandomLesson(
      mode
    );
  }

  getOfflineBundle(
    mode: LearningMode
  ): OfflineLessonBundle {
    return {
      lessons:
        getLessonsByMode(mode),

      phrases:
        getAllPhrases(),

      pronunciationTips:
        getPronunciationTips()
    };
  }

  getPracticeSentence(
    mode: LearningMode
  ) {
    const lesson =
      getRandomLesson(mode);

    return (
      lesson.english ||
      lesson.sentence ||
      ""
    );
  }

  getVocabularyPractice(
    mode: LearningMode
  ) {
    const lesson =
      getRandomLesson(mode);

    return (
      lesson.vocabulary || []
    );
  }

  getPhrasePractice() {
    return getRandomPhrase();
  }

  getPronunciationTip() {
    return getRandomPronunciationTip();
  }

  searchOfflineLessons(
    mode: LearningMode,
    query: string
  ) {
    const normalized =
      query.toLowerCase();

    return getLessonsByMode(
      mode
    ).filter((lesson) => {
      const text = (
        lesson.english ||
        lesson.sentence ||
        ""
      ).toLowerCase();

      return text.includes(
        normalized
      );
    });
  }

  getDailyPracticePack(
    mode: LearningMode
  ) {
    const lessons =
      getLessonsByMode(mode);

    const shuffled = [
      ...lessons
    ].sort(
      () =>
        Math.random() - 0.5
    );

    return shuffled.slice(0, 5);
  }

  buildOfflineConversation() {
    return [
      {
        role: "ai",

        text: "Hello! Let us practice spoken English together."
      },

      {
        role: "ai",

        text: "Tell me something about your work."
      },

      {
        role: "ai",

        text: "What skills do you want to improve?"
      }
    ];
  }

  generateFallbackAIReply(
    message: string
  ) {
    const lower =
      message.toLowerCase();

    if (
      lower.includes("job")
    ) {
      return "That sounds interesting. Please explain your work responsibilities.";
    }

    if (
      lower.includes("meeting")
    ) {
      return "Professional communication improves with regular practice.";
    }

    if (
      lower.includes("english")
    ) {
      return "Your English is improving. Keep practicing daily.";
    }

    if (
      lower.includes("business")
    ) {
      return "Business English becomes easier with confidence and fluency.";
    }

    return "Very good. Please continue speaking in English.";
  }

  getOfflineStatistics() {
    return {
      totalModes: 7,

      totalLessons:
        getLessonsByMode(
          "beginner"
        ).length +
        getLessonsByMode(
          "daily"
        ).length +
        getLessonsByMode(
          "office"
        ).length +
        getLessonsByMode(
          "business"
        ).length +
        getLessonsByMode(
          "interview"
        ).length,

      totalPhrases:
        getAllPhrases().length,

      totalPronunciationTips:
        getPronunciationTips()
          .length
    };
  }
}
