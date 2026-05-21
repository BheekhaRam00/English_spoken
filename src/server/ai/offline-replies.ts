type OfflineReplyParams = {
  message: string;

  mode:
    | "daily"
    | "business"
    | "interview"
    | "advanced";
};

const DAILY_REPLIES = [
  "That sounds nice. What did you do after that?",

  "Interesting. How was your experience?",

  "Very good. Can you explain a little more?",

  "Nice. What do you usually do in that situation?",

  "That sounds fun. Who was with you?"
];

const BUSINESS_REPLIES = [
  "That sounds professional. How do you usually handle that task?",

  "Interesting. Do you work with a team or independently?",

  "Good communication is very important in professional environments.",

  "That seems like valuable work experience.",

  "How do you usually communicate with clients or colleagues?"
];

const INTERVIEW_REPLIES = [
  "That is a good answer for an interview.",

  "Can you explain your experience in more detail?",

  "That sounds like a strong professional skill.",

  "How would you describe your biggest strength?",

  "Very nice. Employers appreciate confident communication."
];

const ADVANCED_REPLIES = [
  "That is an interesting perspective. What makes you think that?",

  "Good point. Can you explain your opinion further?",

  "That sounds thoughtful and well explained.",

  "Interesting idea. How would you apply that in real life?",

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

export function getOfflineReply({
  message,
  mode
}: OfflineReplyParams) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What are your daily responsibilities at work?";
  }

  if (
    lower.includes("english") ||
    lower.includes("speaking")
  ) {
    return "Your spoken English is improving. Keep practicing confidently.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Meetings become easier when you communicate clearly and confidently.";
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
