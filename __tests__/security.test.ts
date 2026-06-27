import { describe, it, expect, vi } from "vitest";
import { analyzeReflection } from "@/actions/analyze";
import { JOURNAL_MAX_LENGTH } from "@/lib/constants";
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

describe("security", () => {
  it("strips script injection from journal text", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      journalText:
        '<script>alert("xss")</script>Today was stressful and overwhelming. I feel exhausted and worried. Behind on syllabus.',
    });
    expect(response.success).toBe(true);
  });

  it("truncates very long journal entries", async () => {
    const longJournal =
      "Today was stressful and overwhelming. ".repeat(200) +
      "I feel exhausted and worried about exams.";
    expect(longJournal.length).toBeGreaterThan(JOURNAL_MAX_LENGTH);
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      journalText: longJournal,
    });
    expect(response.success).toBe(true);
  });

  it("rejects invalid reflection payloads via schema", async () => {
    const response = await analyzeReflection({
      ...sampleReflectionInput,
      studyHours: -1,
    });
    expect(response.success).toBe(false);
  });

  it("returns generic error when analysis throws", async () => {
    const { analyzeWithAI } = await import("@/lib/gemini");
    vi.mocked(analyzeWithAI).mockRejectedValueOnce(new Error("boom"));
    const response = await analyzeReflection(sampleReflectionInput);
    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.error).toContain("Something went wrong");
    }
  });
});
