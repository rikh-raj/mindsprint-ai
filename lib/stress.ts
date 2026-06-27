import type { ReflectionInput } from "@/types";
import { STRESS_SCORE } from "@/lib/constants";
import { isJournalSentimentNegative } from "@/lib/sentiment";

export function computePreliminaryStressScore(input: ReflectionInput): number {
  let score = 0;

  if (input.sleepHours < STRESS_SCORE.LOW_SLEEP_THRESHOLD) {
    score += STRESS_SCORE.LOW_SLEEP_PENALTY;
  }

  if (input.studyHours > STRESS_SCORE.HIGH_STUDY_THRESHOLD) {
    score += STRESS_SCORE.HIGH_STUDY_PENALTY;
  }

  if (
    input.mockTestScore !== undefined &&
    input.mockTestScore < STRESS_SCORE.LOW_MOCK_THRESHOLD
  ) {
    score += STRESS_SCORE.LOW_MOCK_PENALTY;
  }

  if (input.exerciseFrequency === "Never") {
    score += STRESS_SCORE.NO_EXERCISE_PENALTY;
  }

  if (isJournalSentimentNegative(input.journalText)) {
    score += STRESS_SCORE.NEGATIVE_SENTIMENT_PENALTY;
  }

  return Math.min(
    STRESS_SCORE.MAX,
    Math.max(STRESS_SCORE.MIN, score)
  );
}

export function clampStressScore(
  score: number,
  preliminaryScore: number
): number {
  const min = Math.max(STRESS_SCORE.MIN, preliminaryScore - STRESS_SCORE.ADJUSTMENT_RANGE);
  const max = Math.min(STRESS_SCORE.MAX, preliminaryScore + STRESS_SCORE.ADJUSTMENT_RANGE);
  return Math.min(
    STRESS_SCORE.MAX,
    Math.max(STRESS_SCORE.MIN, Math.min(max, Math.max(min, score)))
  );
}
