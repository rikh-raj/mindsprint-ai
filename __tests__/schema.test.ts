import { describe, it, expect } from "vitest";
import { wellnessAnalysisSchema } from "@/lib/schemas";
import { generateDemoAnalysis } from "@/lib/demo";
import { computePreliminaryStressScore } from "@/lib/stress";
import {
  computeEfficiencyScore,
  computeFatigueProbability,
} from "@/lib/scores";

describe("Wellness Analysis Schema", () => {
  const input = {
    examType: "JEE" as const,
    studyHours: 8,
    sleepHours: 5,
    exerciseFrequency: "Never" as const,
    dietPreference: "Vegetarian" as const,
    mockTestScore: 45,
    journalText:
      "Today was stressful and overwhelming. I feel exhausted and worried about my mock test score. Behind on syllabus.",
  };

  it("validates stress score is between 0 and 100", () => {
    const preliminaryScore = computePreliminaryStressScore(input);
    expect(preliminaryScore).toBeGreaterThanOrEqual(0);
    expect(preliminaryScore).toBeLessThanOrEqual(100);

    const analysis = generateDemoAnalysis(input, preliminaryScore);
    const validated = wellnessAnalysisSchema.parse(analysis);

    expect(validated.stress_score).toBeGreaterThanOrEqual(0);
    expect(validated.stress_score).toBeLessThanOrEqual(100);
  });

  it("validates extended fields including efficiency and fatigue scores", () => {
    const preliminaryScore = computePreliminaryStressScore(input);
    const analysis = generateDemoAnalysis(input, preliminaryScore);
    const validated = wellnessAnalysisSchema.parse(analysis);

    expect(validated.wellness_persona.title).toBeTruthy();
    expect(validated.wellness_persona.emoji).toBeTruthy();
    expect(validated.positive_reflections.length).toBeGreaterThan(0);
    expect(validated.future_letter.length).toBeGreaterThanOrEqual(50);
    expect(validated.exam_coach_tip).toBeTruthy();
    expect(validated.wellness_badge.title).toBeTruthy();
    expect(validated.efficiency_score).toBeGreaterThanOrEqual(0);
    expect(validated.efficiency_score).toBeLessThanOrEqual(100);
    expect(validated.fatigue_probability).toBeGreaterThanOrEqual(0);
    expect(validated.fatigue_probability).toBeLessThanOrEqual(100);
    expect(validated.music_recommendations.length).toBeGreaterThan(0);
  });

  it("computes deterministic efficiency and fatigue scores", () => {
    const stressScore = 80;
    const efficiency = computeEfficiencyScore(input, stressScore);
    const fatigue = computeFatigueProbability(input, stressScore);

    expect(efficiency).toBe(60); // 100 - 20 (sleep) - 10 (no exercise) - 10 (stress>75)
    expect(fatigue).toBe(Math.min(100, Math.round(80 * 0.6 + 15 + 5)));
  });
});
