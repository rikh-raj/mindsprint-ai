import { describe, it, expect, vi } from "vitest";
import { analyzeReflection } from "@/actions/analyze";
import {
  clearAnalysis,
  invalidateAnalysisCache,
  loadAnalysis,
  saveAnalysis,
} from "@/lib/storage";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

vi.mock("@/lib/gemini", () => ({
  analyzeWithAI: vi.fn().mockImplementation(async (_input, preliminary) => {
    const result = buildSampleAnalysisResult();
    return { ...result, stress_score: preliminary };
  }),
}));

describe("localStorage persistence integration", () => {
  it("persists analysis across save and load cycle", () => {
    const result = buildSampleAnalysisResult();
    saveAnalysis({ input: sampleReflectionInput, result });
    const loaded = loadAnalysis();
    expect(loaded?.result.preliminaryStressScore).toBe(
      result.preliminaryStressScore
    );
    clearAnalysis();
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
  });

  it("analyzeReflection produces storable result shape", async () => {
    const response = await analyzeReflection(sampleReflectionInput);
    expect(response.success).toBe(true);
    if (response.success) {
      saveAnalysis({ input: sampleReflectionInput, result: response.data });
      expect(loadAnalysis()?.result.generatedAt).toBe(response.data.generatedAt);
    }
  });
});
