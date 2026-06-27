const NEGATIVE_KEYWORDS = [
  "stressed",
  "stress",
  "anxious",
  "worried",
  "overwhelmed",
  "exhausted",
  "tired",
  "burnout",
  "failed",
  "failure",
  "hopeless",
  "panic",
  "pressure",
  "frustrated",
  "angry",
  "sad",
  "lonely",
  "scared",
  "nervous",
  "can't sleep",
  "insomnia",
  "behind",
  "compare",
  "comparison",
  "perfection",
  "guilty",
  "worthless",
  "cry",
  "crying",
  "breakdown",
  "doubt",
  "fear",
];

export function isJournalSentimentNegative(journalText: string): boolean {
  const normalized = journalText.toLowerCase();
  const matchCount = NEGATIVE_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword)
  ).length;
  return matchCount >= 2;
}
