import { NextRequest } from "next/server";

type RequestBody = {
  originalSentence: string;

  spokenSentence: string;
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

function calculateScore(
  original: string,
  spoken: string
) {
  const originalWords =
    normalizeText(original).split(
      " "
    );

  const spokenWords =
    normalizeText(spoken).split(
      " "
    );

  let matched = 0;

  originalWords.forEach((word) => {
    if (
      spokenWords.includes(word)
    ) {
      matched += 1;
    }
  });

  return Math.round(
    (matched /
      originalWords.length) *
      100
  );
}

function getLevel(
  score: number
) {
  if (score >= 90) {
    return "excellent";
  }

  if (score >= 75) {
    return "good";
  }

  if (score >= 55) {
    return "average";
  }

  return "needs-improvement";
}

function generateFeedback(
  score: number
) {
  if (score >= 90) {
    return "Excellent pronunciation and speaking clarity.";
  }

  if (score >= 75) {
    return "Good pronunciation. Continue practicing fluency.";
  }

  if (score >= 55) {
    return "Average pronunciation. Speak more slowly and clearly.";
  }

  return "Keep practicing pronunciation daily with slower speaking.";
}

function getTips(
  score: number
) {
  if (score >= 90) {
    return [
      "Practice advanced business English.",
      "Focus on fluency and confidence.",
      "Try longer conversations."
    ];
  }

  if (score >= 75) {
    return [
      "Improve speaking speed naturally.",
      "Practice difficult words repeatedly.",
      "Use complete sentences."
    ];
  }

  if (score >= 55) {
    return [
      "Speak slowly and clearly.",
      "Repeat short sentences daily.",
      "Focus on word pronunciation."
    ];
  }

  return [
    "Listen carefully before repeating.",
    "Practice simple English sentences.",
    "Improve confidence while speaking."
  ];
}

function findMissedWords(
  original: string,
  spoken: string
) {
  const originalWords =
    normalizeText(original).split(
      " "
    );

  const spokenWords =
    normalizeText(spoken).split(
      " "
    );

  return originalWords.filter(
    (word) =>
      !spokenWords.includes(word)
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body: RequestBody =
      await request.json();

    const {
      originalSentence,
      spokenSentence
    } = body;

    if (
      !originalSentence?.trim()
    ) {
      return Response.json(
        {
          success: false,

          error:
            "Original sentence is required."
        },
        {
          status: 400
        }
      );
    }

    if (
      !spokenSentence?.trim()
    ) {
      return Response.json(
        {
          success: false,

          error:
            "Spoken sentence is required."
        },
        {
          status: 400
        }
      );
    }

    const score =
      calculateScore(
        originalSentence,
        spokenSentence
      );

    const level =
      getLevel(score);

    const feedback =
      generateFeedback(score);

    const tips =
      getTips(score);

    const missedWords =
      findMissedWords(
        originalSentence,
        spokenSentence
      );

    return Response.json({
      success: true,

      pronunciation: {
        score,

        level,

        feedback,

        tips,

        missedWords,

        originalSentence,

        spokenSentence
      }
    });
  } catch (error) {
    console.error(
      "Pronunciation API error:",
      error
    );

    return Response.json(
      {
        success: false,

        error:
          "Something went wrong."
      },
      {
        status: 500
      }
    );
  }
}
