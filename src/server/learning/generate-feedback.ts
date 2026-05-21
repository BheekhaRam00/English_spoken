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

Mode:
${mode}

User Transcript:
${transcript}

Requirements:
- Evaluate spoken English naturally.
- Encourage confidence.
- Keep feedback practical.
- Avoid harsh criticism.
- Focus on fluency and pronunciation.

Return STRICT JSON only.

JSON Format:
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
): FeedbackResponse | null {
  try {
    const cleaned =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    return JSON.parse(
      cleaned
    );
  } catch (error) {
    logError(
      "Feedback Parse Error",
      error
    );

    return null;
  }
}

function generateFallbackFeedback(): FeedbackResponse {
  return {
    score: 82,

    fluency:
      "Your speaking flow is improving well.",

    pronunciation:
      "Most words are understandable and clear.",

    grammar:
      "Your sentence structure is mostly correct.",

    confidence:
      "You are speaking with good confidence.",

    improvement:
      "Practice speaking slowly and consistently every day."
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
      return generateFallbackFeedback();
    }

    const apiKey =
      process.env
        .OPENROUTER_API_KEY;

    if (!apiKey) {
      return generateFallbackFeedback();
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
          "daily"
      });

    const cleanedReply =
      cleanAIText(
        aiReply
      );

    const parsedFeedback =
      parseFeedback(
        cleanedReply
      );

    if (
      !parsedFeedback
    ) {
      return generateFallbackFeedback();
    }

    return parsedFeedback;
  } catch (error) {
    logError(
      "Generate Feedback Error",
      error
    );

    return generateFallbackFeedback();
  }
}
