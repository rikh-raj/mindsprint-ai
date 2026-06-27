import { describe, it, expect } from "vitest";
import { generateDemoAnalysis } from "@/lib/demo";
import { wellnessAnalysisSchema } from "@/lib/schemas";
import { computePreliminaryStressScore } from "@/lib/stress";
import { sampleReflectionInput } from "./fixtures";

describe("demo", () => {
  it("generates complete demo analysis matching schema", () => {
    const preliminary = computePreliminaryStressScore(sampleReflectionInput);
    const analysis = generateDemoAnalysis(sampleReflectionInput, preliminary);
    const validated = wellnessAnalysisSchema.parse(analysis);
    expect(validated.wellness_persona.emoji).toBeTruthy();
    expect(validated.stress_score).toBe(preliminary);
  });

  it("assigns risk levels from stress score thresholds", () => {
    const low = generateDemoAnalysis(
      { ...sampleReflectionInput, journalText: "Calm day" },
      20
    );
    const high = generateDemoAnalysis(
      sampleReflectionInput,
      90
    );
    expect(low.risk_level).toBe("Low");
    expect(high.risk_level).toBe("High");
  });

  it("adapts brain fuel for low sleep and high study", () => {
    const analysis = generateDemoAnalysis(
      { ...sampleReflectionInput, sleepHours: 4, studyHours: 12 },
      70
    );
    expect(analysis.brain_fuel.breakfast.meal).toContain("Oats");
    expect(analysis.brain_fuel.snack.meal).toContain("Dates");
  });

  it("uses non-vegetarian lunch and daily exercise dinner paths", () => {
    const analysis = generateDemoAnalysis(
      {
        ...sampleReflectionInput,
        dietPreference: "Non Vegetarian",
        exerciseFrequency: "Daily",
        sleepHours: 7,
      },
      40
    );
    expect(analysis.brain_fuel.lunch.meal).toContain("chicken");
    expect(analysis.brain_fuel.dinner.meal).toContain("Egg");
  });

  it("sets calm mood and healthy burnout indicator for low stress", () => {
    const analysis = generateDemoAnalysis(
      {
        ...sampleReflectionInput,
        sleepHours: 8,
        studyHours: 5,
        exerciseFrequency: "Daily",
        journalText: "Calm revision day with steady progress and good focus.",
      },
      20
    );
    expect(analysis.mood).toBe("Calm and reflective");
    expect(analysis.burnout_indicator).toContain("Managing well");
  });
});
