import { NextRequest } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

type RequestBody = {
  mode?:
    | "beginner"
    | "daily"
    | "office"
    | "business"
    | "interview"
    | "advanced";

  userLevel?: string;
};

function buildLessonPrompt(
  mode: string,
  userLevel: string
) {
  return `
You are an expert English teacher for Hindi-speaking Indian users.

Generate ONE spoken English learning lesson.

Mode:
${mode}

User Level:
${userLevel}

Requirements:
- Practical spoken English
- Real-life sentence
- Natural communication
- Professional tone when needed
- Hindi translation
- Vocabulary meanings
- Useful phrases
- Pronunciation tip

Return ONLY valid JSON.

JSON format:
{
  "title": "",
  "english": "",
  "hindi": "",
  "vocabulary": [
    {
      "word": "",
      "meaning": "",
      "pronunciation": ""
    }
  ],
  "phrases": [
    {
      "phrase": "",
      "meaning": ""
    }
  ],
  "pronunciationTip": ""
}
`;
}

function safeParseResponse(
  text: string
) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Lesson parse error:",
      error
    );

    return null;
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body: RequestBody =
      await request.json();

    const {
      mode = "daily",

      userLevel = "beginner"
    } = body;

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,

          error:
            "Gemini API key is missing."
        },
        {
          status: 500
        }
      );
    }

    const prompt =
      buildLessonPrompt(
        mode,
        userLevel
      );

    const response = await fetch(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.9,

            topK: 40,

            topP: 1,

            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      return Response.json(
        {
          success: false,

          error:
            "Failed to generate lesson."
        },
        {
          status: 500
        }
      );
    }

    const data =
      await response.json();

    const lessonText =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!lessonText) {
      return Response.json(
        {
          success: false,

          error:
            "Empty AI lesson response."
        },
        {
          status: 500
        }
      );
    }

    const parsedLesson =
      safeParseResponse(
        lessonText
      );

    if (!parsedLesson) {
      return Response.json(
        {
          success: false,

          error:
            "Failed to parse lesson response."
        },
        {
          status: 500
        }
      );
    }

    return Response.json({
      success: true,

      lesson: parsedLesson
    });
  } catch (error) {
    console.error(
      "Lesson API error:",
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
