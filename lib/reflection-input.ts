import type { ReflectionInput } from "@/types";
import type { ReflectionInputValues } from "@/lib/schemas";

/** Normalize Zod output for exampleOptionalPropertyTypes-safe ReflectionInput */
export function toReflectionInput(data: ReflectionInputValues): ReflectionInput {
  const input: ReflectionInput = {
    examType: data.examType,
    studyHours: data.studyHours,
    sleepHours: data.sleepHours,
    exerciseFrequency: data.exerciseFrequency,
    dietPreference: data.dietPreference,
    journalText: data.journalText,
  };
  if (data.mockTestScore !== undefined) {
    input.mockTestScore = data.mockTestScore;
  }
  return input;
}
