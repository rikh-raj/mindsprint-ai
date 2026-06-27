import type { AnalysisResult, ReflectionInput } from "@/types";
import { generateDemoAnalysis } from "@/lib/demo";
import { computePreliminaryStressScore } from "@/lib/stress";

export const sampleReflectionInput: ReflectionInput = {
  examType: "JEE",
  studyHours: 8,
  sleepHours: 5,
  exerciseFrequency: "Never",
  dietPreference: "Vegetarian",
  mockTestScore: 45,
  journalText:
    "Today was stressful and overwhelming. I feel exhausted and worried about my mock test score. Behind on syllabus.",
};

export function buildSampleAnalysisResult(): AnalysisResult {
  const preliminaryStressScore = computePreliminaryStressScore(
    sampleReflectionInput
  );
  const analysis = generateDemoAnalysis(
    sampleReflectionInput,
    preliminaryStressScore
  );
  return {
    ...analysis,
    preliminaryStressScore,
    generatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  };
}
