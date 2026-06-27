import { describe, it, expect, beforeEach, vi } from "vitest";
import { STORAGE_KEY } from "@/lib/constants";
import {
  clearAnalysis,
  invalidateAnalysisCache,
  loadAnalysis,
  saveAnalysis,
} from "@/lib/storage";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    invalidateAnalysisCache();
  });

  it("persists and loads analysis from localStorage", () => {
    const result = buildSampleAnalysisResult();
    saveAnalysis({ input: sampleReflectionInput, result });
    const loaded = loadAnalysis();
    expect(loaded?.result.stress_score).toBe(result.stress_score);
    expect(loaded?.input.examType).toBe("JEE");
  });

  it("clears stored analysis", () => {
    saveAnalysis({
      input: sampleReflectionInput,
      result: buildSampleAnalysisResult(),
    });
    clearAnalysis();
    expect(loadAnalysis()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("rejects incompatible cached schema and clears storage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        input: sampleReflectionInput,
        result: { stress_score: 50 },
      })
    );
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
  });

  it("handles corrupt localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{{{");
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
  });

  it("handles localStorage write failures without throwing", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });
    saveAnalysis({
      input: sampleReflectionInput,
      result: buildSampleAnalysisResult(),
    });
    expect(loadAnalysis()).toBeNull();
    setItem.mockRestore();
  });
});
