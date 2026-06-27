import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ReflectionInput } from "@/types";
import {
  analyzeWithAI,
  analyzeWithDeepSeek,
  analyzeWithGemini,
  parseAiResponse,
  validateAiResponse,
} from "@/lib/gemini";
import * as geminiModule from "@/lib/gemini";
import { sampleReflectionInput } from "./fixtures";

export const validGeminiPayload = {
  mood: "Focused but tired",
  stress_score: 55,
  risk_level: "Moderate" as const,
  triggers: ["Sleep debt"],
  patterns: ["Late-night study"],
  affirmation: "Progress beats perfection.",
  coping: ["Take a walk"],
  mindfulness: {
    title: "Box Breathing",
    duration: "3 min",
    instructions: ["Inhale", "Hold", "Exhale"],
  },
  brain_fuel: {
    breakfast: { meal: "Oats", reason: "Energy" },
    lunch: { meal: "Dal rice", reason: "Balance" },
    snack: { meal: "Fruit", reason: "Focus" },
    dinner: { meal: "Khichdi", reason: "Light" },
  },
  hydration: "Drink water hourly",
  digital_detox: "No phone 30 min before bed",
  sleep_tip: "Sleep by 11 PM",
  lifestyle: ["Stretch breaks"],
  tomorrow_plan: ["Revise physics"],
  burnout_indicator: "Moderate fatigue",
  voice_reflection: {
    indicator: "Tired",
    confidence: 0.8,
    evidence: ["Mentions exhaustion"],
  },
  wellness_persona: {
    title: "Night Owl Strategist",
    emoji: "🦉",
    description: "You push through late sessions with determination.",
  },
  positive_reflections: ["You showed up to study despite fatigue"],
  future_letter:
    "Dear future self, keep trusting small consistent steps over perfection every day.",
  exam_coach_tip: "Revise one weak topic tomorrow morning.",
  wellness_badge: {
    emoji: "💪",
    title: "Resilience Badge",
    reason: "You reflected honestly today.",
  },
};

const mocks = vi.hoisted(() => ({
  generateContent: vi.fn(),
  createCompletion: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class MockGoogleGenAI {
    models = { generateContent: mocks.generateContent };
  },
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = { completions: { create: mocks.createCompletion } };
  },
}));

function mockSuccessProviders(): void {
  mocks.generateContent.mockResolvedValue({
    text: JSON.stringify(validGeminiPayload),
  });
  mocks.createCompletion.mockResolvedValue({
    choices: [{ message: { content: JSON.stringify(validGeminiPayload) } }],
  });
}

describe("gemini provider branches", () => {
  const input: ReflectionInput = sampleReflectionInput;
  const preliminary = 60;

  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter-key");
    mockSuccessProviders();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("parseAiResponse extracts JSON from fenced blocks", () => {
    const parsed = parseAiResponse(
      "```json\n{\"mood\":\"Calm\"}\n```"
    ) as { mood: string };
    expect(parsed.mood).toBe("Calm");
  });

  it("parseAiResponse extracts JSON from brace-delimited text", () => {
    const parsed = parseAiResponse('prefix {"mood":"Calm"} suffix') as {
      mood: string;
    };
    expect(parsed.mood).toBe("Calm");
  });

  it("parseAiResponse throws on malformed fenced json", () => {
    expect(() => parseAiResponse("```json\n{broken\n```")).toThrow(
      "Failed to parse AI response as JSON"
    );
  });

  it("parseAiResponse throws when no json structure exists", () => {
    expect(() => parseAiResponse("plain text only")).toThrow(
      "Failed to parse AI response as JSON"
    );
  });

  it("validateAiResponse rejects partial schema payloads", () => {
    expect(() =>
      validateAiResponse({
        mood: "Calm",
        stress_score: 10,
      })
    ).toThrow();
  });

  it("analyzeWithGemini returns enriched wellness analysis", async () => {
    const result = await analyzeWithGemini(input, preliminary);
    expect(result.wellness_persona.title).toBeTruthy();
    expect(result.stress_score).toBeGreaterThanOrEqual(0);
  });

  it("analyzeWithDeepSeek returns enriched wellness analysis", async () => {
    const result = await analyzeWithDeepSeek(input, preliminary);
    expect(result.exam_coach_tip).toBeTruthy();
  });

  it("throws when Gemini API key is missing or placeholder", async () => {
    vi.stubEnv("GEMINI_API_KEY", "your_api_key_here");
    await expect(analyzeWithGemini(input, preliminary)).rejects.toThrow(
      "Gemini API key not configured"
    );

    vi.stubEnv("GEMINI_API_KEY", "   ");
    await expect(analyzeWithGemini(input, preliminary)).rejects.toThrow(
      "Gemini API key not configured"
    );
  });

  it("throws when OpenRouter API key is missing or placeholder", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    await expect(analyzeWithDeepSeek(input, preliminary)).rejects.toThrow(
      "OpenRouter API key not configured"
    );
  });

  it("throws when Gemini returns empty response text", async () => {
    mocks.generateContent.mockResolvedValueOnce({ text: "   " });
    await expect(analyzeWithGemini(input, preliminary)).rejects.toThrow(
      "Gemini returned empty response"
    );
  });

  it("throws when Gemini response text is undefined", async () => {
    mocks.generateContent.mockResolvedValueOnce({});
    await expect(analyzeWithGemini(input, preliminary)).rejects.toThrow(
      "Gemini returned empty response"
    );
  });

  it("throws when DeepSeek returns empty choices", async () => {
    mocks.createCompletion.mockResolvedValueOnce({ choices: [] });
    await expect(analyzeWithDeepSeek(input, preliminary)).rejects.toThrow(
      "DeepSeek returned empty response"
    );
  });

  it("throws when DeepSeek message content is undefined", async () => {
    mocks.createCompletion.mockResolvedValueOnce({
      choices: [{ message: {} }],
    });
    await expect(analyzeWithDeepSeek(input, preliminary)).rejects.toThrow(
      "DeepSeek returned empty response"
    );
  });

  it("throws when provider returns partial schema json", async () => {
    mocks.generateContent.mockResolvedValueOnce({
      text: JSON.stringify({ mood: "Calm", stress_score: 40 }),
    });
    await expect(analyzeWithGemini(input, preliminary)).rejects.toThrow();
  });

  it("times out when Gemini never resolves", async () => {
    vi.useFakeTimers();
    mocks.generateContent.mockImplementationOnce(
      () => new Promise(() => undefined)
    );

    let caught: Error | undefined;
    const pending = analyzeWithGemini(input, preliminary).catch((error: Error) => {
      caught = error;
    });

    await vi.advanceTimersByTimeAsync(10_000);
    await pending;

    expect(caught?.message).toContain("Request timed out after 10000ms");
    vi.useRealTimers();
  });

  it("times out when DeepSeek never resolves", async () => {
    vi.useFakeTimers();
    mocks.createCompletion.mockImplementationOnce(
      () => new Promise(() => undefined)
    );

    let caught: Error | undefined;
    const pending = analyzeWithDeepSeek(input, preliminary).catch((error: Error) => {
      caught = error;
    });

    await vi.advanceTimersByTimeAsync(10_000);
    await pending;

    expect(caught?.message).toContain("Request timed out after 10000ms");
    vi.useRealTimers();
  });

  it("falls back to DeepSeek when Gemini throws", async () => {
    vi.spyOn(geminiModule, "analyzeWithGemini").mockRejectedValueOnce(
      new Error("Gemini down")
    );
    const result = await analyzeWithAI(input, preliminary);
    expect(result.exam_coach_tip).toBeTruthy();
  });

  it("falls back to demo mode when both providers fail", async () => {
    vi.stubEnv("GEMINI_API_KEY", "your_api_key_here");
    vi.stubEnv("OPENROUTER_API_KEY", "your_api_key_here");
    const result = await analyzeWithAI(input, preliminary);
    expect(result.wellness_badge.title).toBeTruthy();
  });

  it("falls back to demo when Gemini and DeepSeek both reject", async () => {
    vi.spyOn(geminiModule, "analyzeWithGemini").mockRejectedValueOnce(
      new Error("Gemini down")
    );
    vi.spyOn(geminiModule, "analyzeWithDeepSeek").mockRejectedValueOnce(
      new Error("DeepSeek down")
    );
    const result = await analyzeWithAI(input, preliminary);
    expect(result.wellness_persona.emoji).toBeTruthy();
  });
});
