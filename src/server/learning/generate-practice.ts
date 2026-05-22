import { requestAICompletion }
  from "@/server/ai/provider-manager";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type GeneratePracticeParams =
  {
    mode:
      | "beginner"
      | "daily"
      | "office"
      | "business"
      | "interview"
      | "pronunciation"
      | "advanced";
  };

type PracticeItem = {
  question: string;

  hint: string;

  sampleAnswer: string;
};

function buildPracticePrompt(
  mode: string
) {
  return `
Generate 5 spoken English practice exercises for Indian learners.

MODE:
${mode}

STRICT RULES:
- Real-life spoken English.
- Practical conversation.
- Beginner friendly.
- Natural human tone.
- Every exercise must be unique.
- Keep questions short.
- Return STRICT JSON ONLY.
- NO markdown.
- NO explanation.

VALID JSON FORMAT:
[
  {
    "question": "",
    "hint": "",
    "sampleAnswer": ""
  }
]
`;
}

function parsePractice(
  text: string
): PracticeItem[] {
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
    "RAW PRACTICE RESPONSE:",
    cleaned
  );

  const parsed =
    JSON.parse(
      cleaned
    );

  if (
    !Array.isArray(
      parsed
    )
  ) {
    throw new Error(
      "Practice response is not an array"
    );
  }

  const sanitized =
    parsed
      .filter(
        (
          item: any
        ) =>
          item?.question &&
          item?.hint &&
          item?.sampleAnswer
      )
      .slice(0, 5)
      .map(
        (
          item: any
        ) => ({
          question:
            String(
              item.question
            ).trim(),

          hint:
            String(
              item.hint
            ).trim(),

          sampleAnswer:
            String(
              item.sampleAnswer
            ).trim()
        })
      );

  if (
    sanitized.length ===
    0
  ) {
    throw new Error(
      "No valid practice items found"
    );
  }

  return sanitized;
}

export async function generatePractice({
  mode
}: GeneratePracticeParams) {
  try {
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
          buildPracticePrompt(
            mode
          ),

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

    const parsedPractice =
      parsePractice(
        cleanedReply
      );

    return parsedPractice;
  } catch (error) {
    logError(
      "Generate Practice Error",
      error
    );

    throw error;
  }
}
