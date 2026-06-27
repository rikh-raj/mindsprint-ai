import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { analyzeWithAI } from "@/lib/gemini";
import { sampleReflectionInput } from "./fixtures";

const fallbackMocks = vi.hoisted(() => ({
  generateContent: vi.fn(),
  createCompletion: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class MockGoogleGenAI {
    models = { generateContent: fallbackMocks.generateContent };
  },
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = { completions: { create: fallbackMocks.createCompletion } };
  },
}));

describe("analyzeWithAI fallback logging", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter-key");
    fallbackMocks.generateContent.mockRejectedValue(new Error("Gemini down"));
    fallbackMocks.createCompletion.mockRejectedValue(new Error("DeepSeek down"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("warns on provider failures before demo fallback", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await analyzeWithAI(sampleReflectionInput, 60);
    expect(warnSpy.mock.calls.map((call) => call[0])).toEqual([
      "Gemini failed",
      "DeepSeek failed",
      "Using demo mode",
    ]);
    warnSpy.mockRestore();
  });
});
