import {
  speakText
} from "./speechSynthesis";

export type PronunciationFeedback = {
  score: number;

  level:
    | "excellent"
    | "good"
    | "average"
    | "needs-improvement";

  feedback: string;
};

function normalizeText(
  text: string
) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarity(
  original: string,
  spoken: string
) {
  const originalWords =
    normalizeText(original).split(" ");

  const spokenWords =
    normalizeText(spoken).split(" ");

  let matchedWords = 0;

  originalWords.forEach((word) => {
    if (
      spokenWords.includes(word)
    ) {
      matchedWords += 1;
    }
  });

  return Math.round(
    (matchedWords /
      originalWords.length) *
      100
  );
}

export function analyzePronunciation(
  originalSentence: string,
  spokenSentence: string
): PronunciationFeedback {
  const score =
    calculateSimilarity(
      originalSentence,
      spokenSentence
    );

  if (score >= 90) {
    return {
      score,
      level: "excellent",
      feedback:
        "Excellent pronunciation and fluency."
    };
  }

  if (score >= 75) {
    return {
      score,
      level: "good",
      feedback:
        "Good speaking clarity. Keep practicing for smoother fluency."
    };
  }

  if (score >= 55) {
    return {
      score,
      level: "average",
      feedback:
        "You are improving. Try speaking more clearly and slowly."
    };
  }

  return {
    score,
    level:
      "needs-improvement",
    feedback:
      "Listen carefully and repeat again with better pronunciation."
  };
}

export function speakPronunciation(
  text: string
) {
  speakText({
    text,

    voiceType:
      "professional"
  });
}

export function splitSentenceWords(
  sentence: string
) {
  return normalizeText(sentence)
    .split(" ")
    .filter(Boolean);
}

export function getHardWords(
  sentence: string
) {
  return splitSentenceWords(
    sentence
  ).filter(
    (word) => word.length >= 7
  );
}

export function generatePronunciationTips(
  score: number
) {
  if (score >= 90) {
    return [
      "Maintain your speaking confidence.",
      "Your pronunciation is very natural.",
      "Practice longer conversations daily."
    ];
  }

  if (score >= 75) {
    return [
      "Speak slightly slower for more clarity.",
      "Focus on difficult vocabulary words.",
      "Repeat professional sentences regularly."
    ];
  }

  if (score >= 55) {
    return [
      "Listen carefully before repeating.",
      "Practice word-by-word pronunciation.",
      "Improve speaking confidence gradually."
    ];
  }

  return [
    "Speak slowly and clearly.",
    "Repeat the sentence multiple times.",
    "Focus on pronunciation instead of speed."
  ];
}
