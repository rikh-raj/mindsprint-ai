import type { ReflectionInput } from "@/types";

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
  let score = 100;

  if (input.sleepHours < 6) score -= 20;
  if (input.studyHours > 12) score -= 15;
  if (input.exerciseFrequency === "Never") score -= 10;
  if (stressScore > 75) score -= 10;

  return Math.min(100, Math.max(0, score));
}

export function computeEfficiencyExplanation(
  input: ReflectionInput,
  efficiencyScore: number,
  stressScore: number
): string {
  const reasons: string[] = [];

  if (input.sleepHours < 6) {
    reasons.push("poor sleep");
  }
  if (input.studyHours > 12) {
    reasons.push("long study hours");
  }
  if (input.exerciseFrequency === "Never") {
    reasons.push("no physical movement");
  }
  if (stressScore > 75) {
    reasons.push("elevated stress levels");
  }

  if (reasons.length === 0) {
    return "Your study rhythm today supports solid retention and focus.";
  }

  const combined =
    reasons.length === 1
      ? reasons[0]
      : `${reasons.slice(0, -1).join(", ")} and ${reasons[reasons.length - 1]}`;

  if (efficiencyScore >= 70) {
    return `Minor factors like ${combined} may slightly affect retention, but you're managing well overall.`;
  }

  return `${combined.charAt(0).toUpperCase() + combined.slice(1)} may reduce retention and focus efficiency today.`;
}

export function computeFatigueProbability(
  input: ReflectionInput,
  stressScore: number
): number {
  let probability = stressScore * 0.6;

  if (input.sleepHours < 6) probability += 15;
  if (input.studyHours > 10) probability += 10;
  if (input.exerciseFrequency === "Never") probability += 5;

  return Math.min(100, Math.max(0, Math.round(probability)));
}
