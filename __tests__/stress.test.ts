import { describe, it, expect } from "vitest";
import { computePreliminaryStressScore, clampStressScore } from "@/lib/stress";
import { sampleReflectionInput } from "./fixtures";

describe("stress", () => {
  it("computes preliminary score from input factors", () => {
    const score = computePreliminaryStressScore(sampleReflectionInput);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBe(70);
  });

  it("returns zero for healthy baseline input", () => {
    const score = computePreliminaryStressScore({
      examType: "NEET",
      studyHours: 6,
      sleepHours: 8,
      exerciseFrequency: "Daily",
      dietPreference: "Vegetarian",
      journalText: "Good productive day with steady focus.",
    });
    expect(score).toBe(0);
  });

  it("adds penalty for high study hours", () => {
    const score = computePreliminaryStressScore({
      examType: "NEET",
      studyHours: 12,
      sleepHours: 8,
      exerciseFrequency: "Daily",
      dietPreference: "Vegetarian",
      journalText: "Long study day but manageable overall energy.",
    });
    expect(score).toBe(20);
  });

  it("clamps AI stress score within adjustment range", () => {
    expect(clampStressScore(50, 80)).toBe(70);
    expect(clampStressScore(100, 80)).toBe(90);
    expect(clampStressScore(0, 80)).toBe(70);
    expect(clampStressScore(85, 80)).toBe(85);
  });

  it("clamps to global min and max bounds", () => {
    expect(clampStressScore(-10, 5)).toBe(0);
    expect(clampStressScore(200, 95)).toBe(100);
  });

  it("adds penalty when mock score is below threshold but not at threshold", () => {
    const below = computePreliminaryStressScore({
      examType: "NEET",
      studyHours: 6,
      sleepHours: 8,
      exerciseFrequency: "Daily",
      dietPreference: "Vegetarian",
      journalText: "Calm and focused study day with good energy levels.",
      mockTestScore: 59,
    });
    const atThreshold = computePreliminaryStressScore({
      examType: "NEET",
      studyHours: 6,
      sleepHours: 8,
      exerciseFrequency: "Daily",
      dietPreference: "Vegetarian",
      journalText: "Calm and focused study day with good energy levels.",
      mockTestScore: 60,
    });
    expect(below).toBe(15);
    expect(atThreshold).toBe(0);
  });
});
