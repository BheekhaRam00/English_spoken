import { requestAICompletion }
  from "@/server/ai/provider-manager";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type GenerateFeedbackParams =
  {
    transcript: string;

    mode:
      | "beginner"
      | "daily"
      | "office"
      | "business"
      | "interview"
      | "pronunciation"
      | "advanced";
  };

type FeedbackResponse = {
  score: number;

  fluency: string;

  pronunciation: string;

  grammar: string;

  confidence: string;

  improvement: string;
};

function buildFeedbackPrompt({
  transcript,
  mode
}: GenerateFeedbackParams) {
  return `
You are an expert spoken English evaluator for Indian learners.

Analyze the user's spoken English.

MODE:
${mode}

USER TRANSCRIPT:
${transcript}

STRICT RULES:
- Encourage confidence naturally.
- Give practical feedback.
- Focus on spoken English.
- Return STRICT JSON ONLY.
- NO markdown.
- NO explanation outside JSON.

VALID JSON FORMAT:
{
  "score": 0,
  "fluency": "",
  "pronunciation": "",
  "grammar": "",
  "confidence": "",
  "improvement": ""
}
`;
}

function parseFeedback(
  text: string
): FeedbackResponse {
  const cleaned =
    text
      .replace(
        /```json/gi,
        ""
      )
      .replace(
        /```/g,
        ""
      )
      .trim();

  console.log(
    "RAW FEEDBACK RESPONSE:",
    cleaned
  );

  const parsed =
    JSON.parse(
      cleaned
    );

  if (
    typeof parsed?.score !==
      "number"
  ) {
    throw new Error(
      "Invalid feedback score"
    );
  }

  return {
    score:
      parsed.score,

    fluency:
      String(
        parsed.fluency ||
          ""
      ).trim(),

    pronunciation:
      String(
        parsed.pronunciation ||
          ""
      ).trim(),

    grammar:
      String(
        parsed.grammar ||
          ""
      ).trim(),

    confidence:
      String(
        parsed.confidence ||
          ""
      ).trim(),

    improvement:
      String(
        parsed.improvement ||
          ""
      ).trim()
  };
}

export async function generateFeedback({
  transcript,
  mode
}: GenerateFeedbackParams) {
  try {
    if (
      !transcript.trim()
    ) {
      throw new Error(
        "Transcript missing"
      );
    }

    const apiKey =
      process.env
        .OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY missing"
      );
    }

    const aiReply =
      await requestAICompletion({
        apiKey,

        message:
          buildFeedbackPrompt({
            transcript,
            mode
          }),

        history: [],

        mode:
          mode ===
            "beginner" ||
          mode ===
            "office" ||
          mode ===
            "pronunciation"
            ? "daily"
            : mode
      });

    const cleanedReply =
      cleanAIText(
        aiReply
      );

    const parsedFeedback =
      parseFeedback(
        cleanedReply
      );

    return parsedFeedback;
  } catch (error) {
    logError(
      "Generate Feedback Error",
      error
    );

    throw error;
  }
}
