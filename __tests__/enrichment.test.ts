import { describe, it, expect } from "vitest";
import { enrichWellnessAnalysis } from "@/lib/enrichment";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

describe("enrichment", () => {
  it("adds efficiency, fatigue, and music fields", () => {
    const base = buildSampleAnalysisResult();
    const geminiFields = { ...base };
    delete (geminiFields as Partial<typeof base>).efficiency_score;
    delete (geminiFields as Partial<typeof base>).fatigue_probability;
    delete (geminiFields as Partial<typeof base>).music_recommendations;
    delete (geminiFields as Partial<typeof base>).preliminaryStressScore;
    delete (geminiFields as Partial<typeof base>).generatedAt;

    const enriched = enrichWellnessAnalysis(sampleReflectionInput, geminiFields);
    expect(enriched.efficiency_score).toBeGreaterThanOrEqual(0);
    expect(enriched.fatigue_probability).toBeGreaterThanOrEqual(0);
    expect(enriched.music_recommendations.length).toBeGreaterThan(0);
  });
});
