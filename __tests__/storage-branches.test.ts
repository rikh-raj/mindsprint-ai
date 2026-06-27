import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { STORAGE_KEY } from "@/lib/constants";
import {
  clearAnalysis,
  invalidateAnalysisCache,
  loadAnalysis,
  saveAnalysis,
} from "@/lib/storage";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

describe("storage SSR branches", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    invalidateAnalysisCache();
  });

  afterEach(() => {
    vi.stubGlobal("window", originalWindow);
    invalidateAnalysisCache();
  });

  it("loadAnalysis returns null on SSR without reading storage", () => {
    vi.stubGlobal("window", undefined);
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    expect(loadAnalysis()).toBeNull();
    expect(getItem).not.toHaveBeenCalled();
    getItem.mockRestore();
  });

  it("saveAnalysis no-ops when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(() =>
      saveAnalysis({
        input: sampleReflectionInput,
        result: buildSampleAnalysisResult(),
      })
    ).not.toThrow();
    expect(loadAnalysis()).toBeNull();
  });

  it("clearAnalysis no-ops when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(() => clearAnalysis()).not.toThrow();
  });
});

describe("storage client branches", () => {
  beforeEach(() => {
    localStorage.clear();
    invalidateAnalysisCache();
  });

  it("returns cached object reference on repeated loads", () => {
    const payload = {
      input: sampleReflectionInput,
      result: buildSampleAnalysisResult(),
    };
    saveAnalysis(payload);
    const first = loadAnalysis();
    const second = loadAnalysis();
    expect(first).toBe(second);
    expect(first?.result.stress_score).toBe(payload.result.stress_score);
  });

  it("returns null for non-object stored json", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify("just-a-string"));
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
  });

  it("does not update cache when save write fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    saveAnalysis({
      input: sampleReflectionInput,
      result: buildSampleAnalysisResult(),
    });
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
    vi.restoreAllMocks();
  });

  it("does not clear cache when remove fails", () => {
    saveAnalysis({
      input: sampleReflectionInput,
      result: buildSampleAnalysisResult(),
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    clearAnalysis();
    invalidateAnalysisCache();
    expect(loadAnalysis()?.result.stress_score).toBeTruthy();
    vi.restoreAllMocks();
  });

  it("returns false-compatible data when stored result is missing", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ input: sampleReflectionInput })
    );
    invalidateAnalysisCache();
    expect(loadAnalysis()).toBeNull();
  });
});
