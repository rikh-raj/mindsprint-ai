import type { ReflectionInput } from "@/types";
import { EFFICIENCY_SCORE, FATIGUE_SCORE } from "@/lib/constants";

export const MUSIC_RECOMMENDATIONS = [
  "Lo-fi Beats",
  "Brown Noise",
  "Rain Sounds",
  "Forest Ambience",
] as const;

export function computeEfficiencyScore(
  input: ReflectionInput,
  stressScore: number
): number {
  let score = EFFICIENCY_SCORE.BASE;

  if (input.sleepHours < EFFICIENCY_SCORE.LOW_SLEEP_THRESHOLD) {
    score -= EFFICIENCY_SCORE.LOW_SLEEP_PENALTY;
  }
  if (input.studyHours > EFFICIENCY_SCORE.HIGH_STUDY_THRESHOLD) {
    score -= EFFICIENCY_SCORE.HIGH_STUDY_PENALTY;
  }
  if (input.exerciseFrequency === "Never") {
    score -= EFFICIENCY_SCORE.NO_EXERCISE_PENALTY;
  }
  if (stressScore > EFFICIENCY_SCORE.HIGH_STRESS_THRESHOLD) {
    score -= EFFICIENCY_SCORE.HIGH_STRESS_PENALTY;
  }

  return Math.min(100, Math.max(0, score));
}

export function computeEfficiencyExplanation(
  input: ReflectionInput,
  efficiencyScore: number,
  stressScore: number
): string {
  const reasons: string[] = [];

  if (input.sleepHours < EFFICIENCY_SCORE.LOW_SLEEP_THRESHOLD) {
    reasons.push("poor sleep");
  }
  if (input.studyHours > EFFICIENCY_SCORE.HIGH_STUDY_THRESHOLD) {
    reasons.push("long study hours");
  }
  if (input.exerciseFrequency === "Never") {
    reasons.push("no physical movement");
  }
  if (stressScore > EFFICIENCY_SCORE.HIGH_STRESS_THRESHOLD) {
    reasons.push("elevated stress levels");
  }

  if (reasons.length === 0) {
    return "Your study rhythm today supports solid retention and focus.";
  }

  const lastReason = reasons[reasons.length - 1];
  const combined =
    reasons.length === 1
      ? (lastReason ?? "")
      : `${reasons.slice(0, -1).join(", ")} and ${lastReason ?? ""}`;

  if (efficiencyScore >= EFFICIENCY_SCORE.GOOD_THRESHOLD) {
    return `Minor factors like ${combined} may slightly affect retention, but you're managing well overall.`;
  }

  const capitalized = combined.charAt(0).toUpperCase() + combined.slice(1);
  return `${capitalized} may reduce retention and focus efficiency today.`;
}

export function computeFatigueProbability(
  input: ReflectionInput,
  stressScore: number
): number {
  let probability = stressScore * FATIGUE_SCORE.STRESS_MULTIPLIER;

  if (input.sleepHours < FATIGUE_SCORE.LOW_SLEEP_THRESHOLD) {
    probability += FATIGUE_SCORE.LOW_SLEEP_BONUS;
  }
  if (input.studyHours > FATIGUE_SCORE.HIGH_STUDY_THRESHOLD) {
    probability += FATIGUE_SCORE.HIGH_STUDY_BONUS;
  }
  if (input.exerciseFrequency === "Never") {
    probability += FATIGUE_SCORE.NO_EXERCISE_BONUS;
  }

  return Math.min(100, Math.max(0, Math.round(probability)));
}
