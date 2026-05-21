const MULTIPLE_SPACES =
  /[ \t]+/g;

const MULTIPLE_LINES =
  /\n{3,}/g;

const MARKDOWN_SYMBOLS =
  /[*#`>]/g;

export function cleanAIText(
  text: string
) {
  if (!text) {
    return "";
  }

  return text
    .replace(
      MARKDOWN_SYMBOLS,
      ""
    )
    .replace(
      /\r/g,
      ""
    )
    .replace(
      MULTIPLE_SPACES,
      " "
    )
    .replace(
      MULTIPLE_LINES,
      "\n\n"
    )
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
      /\n{2,}/g,
      "\n"
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
