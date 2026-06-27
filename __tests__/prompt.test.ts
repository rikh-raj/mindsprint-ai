import { describe, it, expect } from "vitest";
import { buildMindSprintPrompt } from "@/lib/prompt";
import { sampleReflectionInput } from "./fixtures";

describe("prompt", () => {
  it("builds prompt with reflection input fields", () => {
    const prompt = buildMindSprintPrompt(sampleReflectionInput, 65);
    expect(prompt).toContain("JEE");
    expect(prompt).toContain("65");
    expect(prompt).toContain(sampleReflectionInput.journalText);
  });

  it("handles missing mock test score", () => {
    const input = {
      examType: sampleReflectionInput.examType,
      studyHours: sampleReflectionInput.studyHours,
      sleepHours: sampleReflectionInput.sleepHours,
      exerciseFrequency: sampleReflectionInput.exerciseFrequency,
      dietPreference: sampleReflectionInput.dietPreference,
      journalText: sampleReflectionInput.journalText,
    };
    const prompt = buildMindSprintPrompt(input, 40);
    expect(prompt).toContain("Not provided");
  });
});
