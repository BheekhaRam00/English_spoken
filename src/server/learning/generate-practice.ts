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

Mode:
${mode}

Requirements:
- Practical spoken English
- Real-life communication
- Natural conversation
- Beginner-friendly
- Professional tone when needed

Return STRICT JSON only.

JSON format:
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
): PracticeItem[] | null {
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
      "Practice Parse Error",
      error
    );

    return null;
  }
}

function generateFallbackPractice(
  mode: string
): PracticeItem[] {
  if (
    mode ===
    "business"
  ) {
    return [
      {
        question:
          "How do you introduce yourself in a meeting?",

        hint:
          "Mention your name and role.",

        sampleAnswer:
          "Hello everyone, my name is Rahul and I work as a project coordinator."
      },

      {
        question:
          "How do you ask for clarification professionally?",

        hint:
          "Be polite and confident.",

        sampleAnswer:
          "Could you please explain that again?"
      }
    ];
  }

  if (
    mode ===
    "interview"
  ) {
    return [
      {
        question:
          "Tell me about yourself.",

        hint:
          "Mention education and work.",

        sampleAnswer:
          "I am a motivated person with experience in customer communication."
      },

      {
        question:
          "What are your strengths?",

        hint:
          "Mention communication and teamwork.",

        sampleAnswer:
          "I am confident, hardworking, and a quick learner."
      }
    ];
  }

  return [
    {
      question:
        "What do you usually do in the morning?",

      hint:
        "Talk about your routine.",

      sampleAnswer:
        "I usually wake up early and go for a walk."
    },

    {
      question:
        "How was your weekend?",

      hint:
        "Describe your activities.",

      sampleAnswer:
        "My weekend was relaxing and enjoyable."
    },

    {
      question:
        "What are your hobbies?",

      hint:
        "Talk naturally about interests.",

      sampleAnswer:
        "I enjoy listening to music and learning new skills."
    }
  ];
}

export async function generatePractice({
  mode
}: GeneratePracticeParams) {
  try {
    const apiKey =
      process.env
        .OPENROUTER_API_KEY;

    if (!apiKey) {
      return generateFallbackPractice(
        mode
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
          "daily"
      });

    const cleanedReply =
      cleanAIText(
        aiReply
      );

    const parsedPractice =
      parsePractice(
        cleanedReply
      );

    if (
      !parsedPractice ||
      !Array.isArray(
        parsedPractice
      )
    ) {
      return generateFallbackPractice(
        mode
      );
    }

    return parsedPractice;
  } catch (error) {
    logError(
      "Generate Practice Error",
      error
    );

    return generateFallbackPractice(
      mode
    );
  }
}
