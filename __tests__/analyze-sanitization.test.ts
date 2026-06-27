import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeReflection } from "@/actions/analyze";
import { JOURNAL_MAX_LENGTH } from "@/lib/constants";
import type { ReflectionInput } from "@/types";
import { sampleReflectionInput } from "./fixtures";

const mockAnalyzeWithAI = vi.fn();

vi.mock("@/lib/gemini", () => ({
  analyzeWithAI: (...args: unknown[]) => mockAnalyzeWithAI(...args),
}));

function mockAnalysisResult() {
  return {
    mood: "Calm",
    stress_score: 40,
    risk_level: "Moderate" as const,
    triggers: ["Time pressure"],
    patterns: ["Evening cramming"],
    affirmation: "You are making progress.",
    coping: ["Short walk"],
    mindfulness: {
      title: "Breath focus",
      duration: "2 min",
      instructions: ["Breathe slowly"],
    },
    brain_fuel: {
      breakfast: { meal: "Upma", reason: "Steady energy" },
      lunch: { meal: "Dal rice", reason: "Balanced" },
      snack: { meal: "Fruit", reason: "Light" },
      dinner: { meal: "Khichdi", reason: "Easy digest" },
    },
    hydration: "Sip water often",
    digital_detox: "Limit reels",
    sleep_tip: "Wind down early",
    lifestyle: ["Stretch"],
    tomorrow_plan: ["Revise"],
    burnout_indicator: "Low",
    voice_reflection: {
      indicator: "Steady",
      confidence: 0.7,
      evidence: ["Balanced tone"],
    },
    wellness_persona: {
      title: "Steady Sprinter",
      emoji: "🏃",
      description: "You keep showing up.",
    },
    positive_reflections: ["You studied consistently"],
    future_letter:
      "Dear future self, keep going with compassion and patience every single day.",
    exam_coach_tip: "Focus on weak topics tomorrow.",
    wellness_badge: {
      emoji: "🌟",
      title: "Consistency Star",
      reason: "You reflected today.",
    },
    efficiency_score: 75,
    fatigue_probability: 35,
    music_recommendations: ["Lo-fi beats"],
  };
}

describe("analyzeReflection sanitization", () => {
  beforeEach(() => {
    mockAnalyzeWithAI.mockReset();
    mockAnalyzeWithAI.mockResolvedValue(mockAnalysisResult());
  });

  it("truncates journal text longer than 2500 characters", async () => {
    const longJournal =
      "Today was stressful and overwhelming. ".repeat(200) +
      "I feel exhausted and worried about exams.";
    expect(longJournal.length).toBeGreaterThan(JOURNAL_MAX_LENGTH);

    await analyzeReflection({
      ...sampleReflectionInput,
      journalText: longJournal,
    });

    const capturedInput = mockAnalyzeWithAI.mock.calls[0]?.[0] as ReflectionInput;
    expect(capturedInput.journalText.length).toBeLessThanOrEqual(
      JOURNAL_MAX_LENGTH
    );
  });

  it("omits mockTestScore when not provided", async () => {
    await analyzeReflection({
      examType: sampleReflectionInput.examType,
      studyHours: sampleReflectionInput.studyHours,
      sleepHours: sampleReflectionInput.sleepHours,
      exerciseFrequency: sampleReflectionInput.exerciseFrequency,
      dietPreference: sampleReflectionInput.dietPreference,
      journalText: sampleReflectionInput.journalText,
    });

    const capturedInput = mockAnalyzeWithAI.mock.calls[0]?.[0] as ReflectionInput;
    expect("mockTestScore" in capturedInput).toBe(false);
  });

  it("omits mockTestScore when explicitly null", async () => {
    await analyzeReflection({
      ...sampleReflectionInput,
      mockTestScore: null as unknown as number,
    });

    const capturedInput = mockAnalyzeWithAI.mock.calls[0]?.[0] as ReflectionInput;
    expect("mockTestScore" in capturedInput).toBe(false);
  });

  it("strips html injection from journal before analysis", async () => {
    await analyzeReflection({
      ...sampleReflectionInput,
      journalText:
        '<script>alert("xss")</script>Today was stressful and overwhelming. I feel exhausted and worried.',
    });

    const capturedInput = mockAnalyzeWithAI.mock.calls[0]?.[0] as ReflectionInput;
    expect(capturedInput.journalText).not.toContain("<script>");
    expect(capturedInput.journalText).toContain("alert");
  });

  it("rejects invalid exercise frequency enum", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      exerciseFrequency: "Sometimes" as ReflectionInput["exerciseFrequency"],
    });
    expect(response.success).toBe(false);
  });

  it("rejects invalid diet preference enum", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      dietPreference: "Keto" as ReflectionInput["dietPreference"],
    });
    expect(response.success).toBe(false);
  });

  it("rejects journal shorter than minimum length", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      journalText: "too short",
    });
    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.error.length).toBeGreaterThan(0);
    }
  });

  it("returns success with sanitized valid input", async () => {
    const response = await analyzeReflection(sampleReflectionInput);
    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.data.generatedAt).toBeTruthy();
    }
  });
});
