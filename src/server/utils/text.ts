const MULTIPLE_SPACES =
  /[ \t]+/g;

const HUGE_EMPTY_LINES =
  /\n{4,}/g;

const MARKDOWN_SYMBOLS =
  /[*#`>]/g;

export function cleanAIText(
  text: string
) {
  if (!text) {
    return "";
  }

  return text
    /*
    REMOVE MARKDOWN
    */
    .replace(
      MARKDOWN_SYMBOLS,
      ""
    )

    /*
    WINDOWS LINE FIX
    */
    .replace(
      /\r/g,
      ""
    )

    /*
    CLEAN EACH LINE
    */
    .split("\n")
    .map((line) =>
      line
        .replace(
          MULTIPLE_SPACES,
          " "
        )
        .trim()
    )

    /*
    KEEP NATURAL LINE BREAKS
    IMPORTANT FOR:
    - speech rhythm
    - lessons
    - conversation formatting
    */
    .join("\n")

    /*
    REMOVE MASSIVE GAPS ONLY
    */
    .replace(
      HUGE_EMPTY_LINES,
      "\n\n\n"
    )

    /*
    NORMALIZE QUOTES
    */
    .replace(
      /[""]/g,
      '"'
    )
    .replace(
      /['']/g,
      "'"
    )

    /*
    FINAL CLEAN
    */
    .trim();
}

export function truncateText({
  text,
  maxLength
}: {
  text: string;

  maxLength: number;
}) {
  if (
    text.length <=
    maxLength
  ) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength
  )}...`;
}

export function normalizeText(
  text: string
) {
  return text
    .toLowerCase()
    .trim();
}

export function removeExtraLines(
  text: string
) {
  return text
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();
}

export function containsHindi(
  text: string
) {
  return /[\u0900-\u097F]/.test(
    text
  );
}

export function wordCount(
  text: string
) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

export function sentenceCount(
  text: string
) {
  return text
    .split(/[.!?]+/)
    .filter(
      (sentence) =>
        sentence.trim()
          .length > 0
    ).length;
}

export function compactLines(
  text: string
) {
  return cleanAIText(
    text
  )
    .split("\n")
    .map((line) =>
      line.trim()
    )
    .filter(
      (line) =>
        line.length > 0
    )
    .join("\n");
}
