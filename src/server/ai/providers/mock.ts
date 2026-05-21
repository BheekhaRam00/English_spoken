type MockProviderParams = {
  message: string;

  mode:
    | "daily"
    | "business"
    | "interview"
    | "advanced";
};

const DAILY_REPLIES = [
  "That sounds interesting. What happened after that?",

  "Nice. How was your experience?",

  "Very good. Can you explain a little more?",

  "That sounds enjoyable. What do you usually do next?",

  "Interesting. Who was with you at that time?"
];

const BUSINESS_REPLIES = [
  "That sounds professional. How do you usually manage that work?",

  "Good communication is important in business conversations.",

  "Interesting. Do you work with clients regularly?",

  "That seems like valuable professional experience.",

  "How do you usually handle meetings or discussions?"
];

const INTERVIEW_REPLIES = [
  "That sounds like a strong interview answer.",

  "Can you explain your experience in more detail?",

  "Very good. Employers value confident communication.",

  "What would you say is your biggest professional strength?",

  "That sounds impressive. How did you develop that skill?"
];

const ADVANCED_REPLIES = [
  "That is an interesting perspective. What makes you think that?",

  "Good point. Can you explain your opinion further?",

  "That sounds thoughtful and well explained.",

  "Interesting idea. How would you apply it practically?",

  "I like your explanation. What inspired that thought?"
];

function getRepliesByMode(
  mode:
    | "daily"
    | "business"
    | "interview"
    | "advanced"
) {
  switch (mode) {
    case "business":
      return BUSINESS_REPLIES;

    case "interview":
      return INTERVIEW_REPLIES;

    case "advanced":
      return ADVANCED_REPLIES;

    default:
      return DAILY_REPLIES;
  }
}

export async function callMockProvider({
  message,
  mode
}: MockProviderParams) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What are your main responsibilities at work?";
  }

  if (
    lower.includes("english") ||
    lower.includes("practice")
  ) {
    return "Your spoken English is improving. Keep practicing confidently every day.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Professional communication becomes easier with regular speaking practice.";
  }

  if (
    lower.includes("weekend")
  ) {
    return "Nice. How do you usually spend your weekends?";
  }

  if (
    lower.includes("hobby")
  ) {
    return "That sounds enjoyable. How long have you been interested in it?";
  }

  const replies =
    getRepliesByMode(
      mode
    );

  return replies[
    Math.floor(
      Math.random() *
        replies.length
    )
  ];
}
