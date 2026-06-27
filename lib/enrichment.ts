import type { ReflectionInput, WellnessAnalysis } from "@/types";
import {
  computeEfficiencyScore,
  computeFatigueProbability,
  MUSIC_RECOMMENDATIONS,
} from "@/lib/scores";

type GeminiWellnessFields = Omit<
  WellnessAnalysis,
  "efficiency_score" | "fatigue_probability" | "music_recommendations"
>;

export function enrichWellnessAnalysis(
  input: ReflectionInput,
  analysis: GeminiWellnessFields
): WellnessAnalysis {
  const stressScore = analysis.stress_score;

  return {
    ...analysis,
    efficiency_score: computeEfficiencyScore(input, stressScore),
    fatigue_probability: computeFatigueProbability(input, stressScore),
    music_recommendations: [...MUSIC_RECOMMENDATIONS],
  };
}
