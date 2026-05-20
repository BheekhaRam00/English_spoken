import {
  ConversationMessage
} from "@/types";

import {
  downloadTextFile,
  formatTime
} from "@/utils/helpers";

import {
  ProgressEngine
} from "./progress-engine";

export class ExportEngine {
  exportConversation(
    messages: ConversationMessage[],
    filename = "conversation-history.txt"
  ) {
    const content =
      messages
        .map((message) => {
          const role =
            message.role === "ai"
              ? "AI"
              : "You";

          const time =
            message.createdAt
              ? formatTime(
                  message.createdAt
                )
              : "";

          return `[${time}] ${role}: ${message.text}`;
        })
        .join("\n");

    downloadTextFile(
      filename,
      content
    );

    return content;
  }

  exportProgressReport() {
    const progressEngine =
      new ProgressEngine();

    const progress =
      progressEngine.getProgress();

    const summary =
      progressEngine.getSummary();

    const report = `
FLUENTPRO AI - PROGRESS REPORT

Completed Lessons:
${summary.completedLessons}

Practice Sessions:
${summary.practiceSessions}

Fluency Average:
${summary.fluencyAverage}

Total Practice Minutes:
${summary.totalPracticeMinutes}

Current Streak:
${summary.streak}

Detailed Progress:
${JSON.stringify(
  progress,
  null,
  2
)}
`;

    downloadTextFile(
      "fluentpro-progress-report.txt",
      report
    );

    return report;
  }

  exportSettings(
    settings: unknown
  ) {
    const content =
      JSON.stringify(
        settings,
        null,
        2
      );

    downloadTextFile(
      "fluentpro-settings.json",
      content
    );

    return content;
  }

  exportVocabularyList(
    vocabulary: {
      word: string;

      meaning: string;

      pronunciation: string;
    }[]
  ) {
    const content =
      vocabulary
        .map(
          (item) =>
            `${item.word}
Meaning: ${item.meaning}
Pronunciation: ${item.pronunciation}`
        )
        .join("\n\n");

    downloadTextFile(
      "vocabulary-practice.txt",
      content
    );

    return content;
  }

  exportPracticeSummary(
    summary: {
      score: number;

      level: string;

      feedback: string;
    }
  ) {
    const content = `
PRACTICE SUMMARY

Score:
${summary.score}

Level:
${summary.level}

Feedback:
${summary.feedback}
`;

    downloadTextFile(
      "practice-summary.txt",
      content
    );

    return content;
  }

  exportPlainText(
    filename: string,
    content: string
  ) {
    downloadTextFile(
      filename,
      content
    );

    return content;
  }
}
