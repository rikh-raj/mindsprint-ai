"use server";

import type { AnalysisResult, ReflectionInput } from "@/types";
import { reflectionInputSchema } from "@/lib/schemas";
import { computePreliminaryStressScore } from "@/lib/stress";
import { analyzeWithAI } from "@/lib/gemini";
import { JOURNAL_MAX_LENGTH } from "@/lib/constants";
import { toReflectionInput } from "@/lib/reflection-input";
import { stripHtml } from "@/lib/utils";

export async function analyzeReflection(
  rawInput: ReflectionInput
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  try {
    const journalText = stripHtml(rawInput.journalText).slice(0, JOURNAL_MAX_LENGTH);
    const mockScore =
      rawInput.mockTestScore === undefined || rawInput.mockTestScore === null
        ? undefined
        : Number(rawInput.mockTestScore);

    const sanitized: ReflectionInput = {
      examType: rawInput.examType,
      studyHours: rawInput.studyHours,
      sleepHours: rawInput.sleepHours,
      exerciseFrequency: rawInput.exerciseFrequency,
      dietPreference: rawInput.dietPreference,
      journalText,
      ...(mockScore !== undefined ? { mockTestScore: mockScore } : {}),
    };

    const parsed = reflectionInputSchema.safeParse(sanitized);
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(" ");
      return { success: false, error: message };
    }

    const input = toReflectionInput(parsed.data);
    const preliminaryStressScore = computePreliminaryStressScore(input);
    const analysis = await analyzeWithAI(input, preliminaryStressScore);

    const result: AnalysisResult = {
      ...analysis,
      preliminaryStressScore,
      generatedAt: new Date().toISOString(),
    };

    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "Something went wrong while generating insights. Please try again.",
    };
  }
}
