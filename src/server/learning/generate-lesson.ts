/*
ONLY CHANGE:
REPLACE THIS BLOCK
*/

const MODELS = [
  "openai/gpt-oss-20b:free",

  "qwen/qwen3-32b:free",

  "mistralai/mistral-small-3.1-24b-instruct:free",

  "google/gemma-2-9b-it:free",

  "microsoft/phi-3-mini-128k-instruct:free"
];

/*
AND REPLACE generateLesson FUNCTION ONLY
*/

export async function generateLesson({
  mode
}: GenerateLessonParams) {
  const apiKey =
    process.env
      .OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY missing"
    );
  }

  const previousLessons =
    getRecentLessons(
      mode
    );

  const prompt =
    buildLessonPrompt(
      mode,
      previousLessons
    );

  /*
  PARALLEL PRIMARY MODELS
  */
  try {
    const primaryModels =
      MODELS.slice(0, 2);

    const parallelResult =
      await Promise.any(
        primaryModels.map(
          async (
            model
          ) => {
            const reply =
              await requestLesson(
                apiKey,
                model,
                prompt
              );

            const cleanedReply =
              cleanAIText(
                reply
              );

            const parsed =
              parseLesson(
                cleanedReply
              );

            if (
              !parsed
            ) {
              throw new Error(
                "Lesson parse failed"
              );
            }

            rememberLesson(
              mode,
              JSON.stringify(
                parsed.sentences
              )
            );

            return {
              ...parsed,

              source:
                "ai",

              model,

              debug:
                "Parallel AI success"
            };
          }
        )
      );

    return parallelResult;
  } catch (
    parallelError
  ) {
    console.log(
      "PARALLEL LESSON FAILED",
      parallelError
    );
  }

  /*
  HYBRID FALLBACK
  */
  let lastError:
    unknown = null;

  for (const model of MODELS) {
    try {
      console.log(
        "TRYING MODEL:",
        model
      );

      const reply =
        await requestLesson(
          apiKey,
          model,
          prompt
        );

      const cleanedReply =
        cleanAIText(
          reply
        );

      const parsed =
        parseLesson(
          cleanedReply
        );

      if (
        !parsed
      ) {
        throw new Error(
          "Lesson parse failed"
        );
      }

      rememberLesson(
        mode,
        JSON.stringify(
          parsed.sentences
        )
      );

      return {
        ...parsed,

        source:
          "ai",

        model,

        debug:
          "Sequential AI success"
      };
    } catch (error) {
      lastError = error;

      console.log(
        "MODEL FAILED:",
        model,
        error
      );

      logError(
        `Model Failed: ${model}`,
        error
      );
    }
  }

  throw new Error(
    `All models failed: ${String(
      lastError
    )}`
  );
}
