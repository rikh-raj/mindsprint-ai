import { describe, it, expect } from "vitest";
import {
  computeEfficiencyExplanation,
  computeEfficiencyScore,
  computeFatigueProbability,
} from "@/lib/scores";
import { sampleReflectionInput } from "./fixtures";

describe("scores", () => {
  it("computes efficiency score with penalties", () => {
    const score = computeEfficiencyScore(sampleReflectionInput, 80);
    expect(score).toBe(60);
  });

  it("computes fatigue probability from stress and lifestyle", () => {
    const fatigue = computeFatigueProbability(sampleReflectionInput, 80);
    expect(fatigue).toBe(Math.min(100, Math.round(80 * 0.6 + 15 + 5)));
  });

  it("returns perfect efficiency for balanced habits", () => {
    const score = computeEfficiencyScore(
      {
        examType: "UPSC",
        studyHours: 6,
        sleepHours: 8,
        exerciseFrequency: "Daily",
        dietPreference: "Vegetarian",
        journalText: "Calm and focused study day with good energy levels.",
      },
      30
    );
    expect(score).toBe(100);
  });

  it("explains efficiency factors for low scores", () => {
    const explanation = computeEfficiencyExplanation(
      sampleReflectionInput,
      60,
      80
    );
    expect(explanation).toContain("retention");
  });

  it("explains balanced efficiency when no penalties apply", () => {
    const explanation = computeEfficiencyExplanation(
      {
        examType: "CAT",
        studyHours: 6,
        sleepHours: 8,
        exerciseFrequency: "Daily",
        dietPreference: "Vegetarian",
        journalText: "Balanced day with steady focus and good recovery.",
      },
      85,
      30
    );
    expect(explanation).toContain("solid retention");
  });

  it("uses minor-factors wording for good efficiency with one penalty", () => {
    const explanation = computeEfficiencyExplanation(
      {
        examType: "CAT",
        studyHours: 6,
        sleepHours: 8,
        exerciseFrequency: "Never",
        dietPreference: "Vegetarian",
        journalText: "Balanced day with steady focus and good recovery.",
      },
      75,
      30
    );
    expect(explanation).toContain("Minor factors");
  });
});
