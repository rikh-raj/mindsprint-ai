import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeReflection } from "@/actions/analyze";
import { sampleReflectionInput } from "./fixtures";

vi.mock("@/lib/gemini", () => ({
  analyzeWithAI: vi.fn().mockResolvedValue({
    mood: "Calm",
    stress_score: 40,
    risk_level: "Moderate",
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
    future_letter: "Dear future self, keep going with compassion and patience every single day.",
    exam_coach_tip: "Focus on weak topics tomorrow.",
    wellness_badge: {
      emoji: "🌟",
      title: "Consistency Star",
      reason: "You reflected today.",
    },
    efficiency_score: 75,
    fatigue_probability: 35,
    music_recommendations: ["Lo-fi beats"],
  }),
}));

describe("analyzeReflection integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns analysis on valid submission", async () => {
    const response = await analyzeReflection(sampleReflectionInput);
    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.data.stress_score).toBe(40);
      expect(response.data.generatedAt).toBeTruthy();
    }
  });

  it("rejects invalid journal length", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      journalText: "too short",
    });
    expect(response.success).toBe(false);
  });

  it("strips HTML from journal before analysis", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      journalText:
        "<b>Today was stressful and overwhelming.</b> I feel exhausted and worried about my mock test score. Behind on syllabus.",
    });
    expect(response.success).toBe(true);
  });
});
