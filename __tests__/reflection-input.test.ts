import { describe, it, expect } from "vitest";
import { toReflectionInput } from "@/lib/reflection-input";
import { reflectionInputSchema } from "@/lib/schemas";

describe("reflection-input", () => {
  it("includes mockTestScore only when defined", () => {
    const withScore = toReflectionInput(
      reflectionInputSchema.parse({
        examType: "CAT",
        studyHours: 6,
        sleepHours: 7,
        exerciseFrequency: "Weekly",
        dietPreference: "Vegan",
        journalText: "Steady progress today with focused revision blocks.",
        mockTestScore: 72,
      })
    );
    expect(withScore.mockTestScore).toBe(72);

    const withoutScore = toReflectionInput(
      reflectionInputSchema.parse({
        examType: "CAT",
        studyHours: 6,
        sleepHours: 7,
        exerciseFrequency: "Weekly",
        dietPreference: "Vegan",
        journalText: "Steady progress today with focused revision blocks.",
      })
    );
    expect("mockTestScore" in withoutScore).toBe(false);
  });
});
