import beginnerLessons from "@/data/beginner.json";

import dailyConversationLessons from "@/data/daily-conversation.json";

import officeEnglishLessons from "@/data/office-english.json";

import businessEnglishLessons from "@/data/business-english.json";

import interviewEnglishLessons from "@/data/interview-english.json";

import advancedBusinessLessons from "@/data/advanced-business.json";

import phrases from "@/data/phrases.json";

import pronunciationTips from "@/data/pronunciation-tips.json";

import liveConversationStarters from "@/data/live-conversation-starters.json";

import aiLearningModes from "@/data/ai-learning-modes.json";

import {
  LearningMode,
  LessonItem,
  LearningPhrase,
  PronunciationTip,
  ConversationStarter,
  AILearningMode
} from "@/types";

export function getLessonsByMode(
  mode: LearningMode
): LessonItem[] {
  switch (mode) {
    case "beginner":
      return beginnerLessons as LessonItem[];

    case "daily":
      return dailyConversationLessons as LessonItem[];

    case "office":
      return officeEnglishLessons as LessonItem[];

    case "business":
      return businessEnglishLessons as LessonItem[];

    case "interview":
      return interviewEnglishLessons as LessonItem[];

    case "advanced":
      return advancedBusinessLessons.map(
        (lesson) => ({
          id: lesson.id,

          category:
            lesson.category,

          sentence:
            lesson.sentence,

          translation:
            lesson.translation,

          vocabulary:
            lesson.vocabulary,

          phrases:
            lesson.phrases
        })
      ) as LessonItem[];

    default:
      return beginnerLessons as LessonItem[];
  }
}

export function getLessonById(
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

export function getRandomLesson(
  mode: LearningMode
) {
  const lessons =
    getLessonsByMode(mode);

  const randomIndex =
    Math.floor(
      Math.random() *
        lessons.length
    );

  return lessons[randomIndex];
}

export function getAllPhrases() {
  return phrases as LearningPhrase[];
}

export function getRandomPhrase() {
  const allPhrases =
    getAllPhrases();

  return allPhrases[
    Math.floor(
      Math.random() *
        allPhrases.length
    )
  ];
}

export function getPronunciationTips() {
  return pronunciationTips as PronunciationTip[];
}

export function getRandomPronunciationTip() {
  const tips =
    getPronunciationTips();

  return tips[
    Math.floor(
      Math.random() *
        tips.length
    )
  ];
}

export function getConversationStarters(
  mode?:
    | "daily"
    | "business"
    | "interview"
    | "advanced"
) {
  const starters =
    liveConversationStarters as ConversationStarter[];

  if (!mode) {
    return starters;
  }

  return starters.filter(
    (starter) =>
      starter.mode === mode
  );
}

export function getRandomConversationStarter(
  mode?:
    | "daily"
    | "business"
    | "interview"
    | "advanced"
) {
  const starters =
    getConversationStarters(
      mode
    );

  return starters[
    Math.floor(
      Math.random() *
        starters.length
    )
  ];
}

export function getAILearningModes() {
  return aiLearningModes as AILearningMode[];
}

export function getAILearningMode(
  mode: LearningMode
) {
  const modes =
    getAILearningModes();

  return modes.find(
    (item) =>
      item.mode === mode
  );
}

export function getLessonCount(
  mode: LearningMode
) {
  return getLessonsByMode(mode)
    .length;
}

export function searchLessons(
  query: string
) {
  const normalized =
    query.toLowerCase();

  const allLessons = [
    ...(
      beginnerLessons as LessonItem[]
    ),

    ...(
      dailyConversationLessons as LessonItem[]
    ),

    ...(
      officeEnglishLessons as LessonItem[]
    ),

    ...(
      businessEnglishLessons as LessonItem[]
    ),

    ...(
      interviewEnglishLessons as LessonItem[]
    )
  ];

  return allLessons.filter(
    (lesson) => {
      const text =
        (
          lesson.english ||
          lesson.sentence ||
          ""
        ).toLowerCase();

      return text.includes(
        normalized
      );
    }
  );
      }
