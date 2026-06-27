import { describe, it, expect } from "vitest";
import { reflectionInputSchema, wellnessAnalysisSchema } from "@/lib/schemas";
import { toReflectionInput } from "@/lib/reflection-input";
import { sampleReflectionInput } from "./fixtures";
import { buildSampleAnalysisResult } from "./fixtures";

describe("schemas", () => {
  it("validates reflection input", () => {
    const parsed = reflectionInputSchema.parse(sampleReflectionInput);
    expect(parsed.examType).toBe("JEE");
  });

  it("rejects journal text shorter than minimum", () => {
    const result = reflectionInputSchema.safeParse({
      ...sampleReflectionInput,
      journalText: "short",
    });
    expect(result.success).toBe(false);
  });

  it("validates wellness analysis output", () => {
    const result = buildSampleAnalysisResult();
    expect(() => wellnessAnalysisSchema.parse(result)).not.toThrow();
  });

  it("normalizes optional mockTestScore for exact optional types", () => {
    const parsed = reflectionInputSchema.parse({
      ...sampleReflectionInput,
      mockTestScore: undefined,
    });
    const normalized = toReflectionInput(parsed);
    expect("mockTestScore" in normalized).toBe(false);
  });
});
