import type { ReflectionInput } from "@/types";
import { isJournalSentimentNegative } from "@/lib/sentiment";

export function computePreliminaryStressScore(input: ReflectionInput): number {
  let score = 0;

  if (input.sleepHours < 6) {
    score += 25;
  }

  if (input.studyHours > 10) {
    score += 20;
  }

  if (
    input.mockTestScore !== undefined &&
    input.mockTestScore !== null &&
    input.mockTestScore < 60
  ) {
    score += 15;
  }

  if (input.exerciseFrequency === "Never") {
    score += 10;
  }

  if (isJournalSentimentNegative(input.journalText)) {
    score += 20;
  }

  return Math.min(100, Math.max(0, score));
}

export function clampStressScore(
  score: number,
  preliminaryScore: number
): number {
  const min = Math.max(0, preliminaryScore - 10);
  const max = Math.min(100, preliminaryScore + 10);
  return Math.min(100, Math.max(0, Math.min(max, Math.max(min, score))));
}
