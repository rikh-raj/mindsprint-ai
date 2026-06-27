import { z } from "zod";

export const reflectionInputSchema = z.object({
  examType: z.enum(["JEE", "NEET", "CAT", "UPSC", "Boards"]),
  studyHours: z.number().min(0).max(16),
  sleepHours: z.number().min(0).max(12),
  exerciseFrequency: z.enum(["Never", "Weekly", "Daily"]),
  dietPreference: z.enum([
    "Vegetarian",
    "Eggetarian",
    "Vegan",
    "Non Vegetarian",
  ]),
  mockTestScore: z.number().min(0).max(100).optional(),
  journalText: z
    .string()
    .min(10, "Please share at least a few sentences about your day.")
    .max(2500, "Journal entry must be 2500 characters or fewer."),
});

export const brainFuelMealSchema = z.object({
  meal: z.string(),
  reason: z.string(),
});

export const wellnessPersonaSchema = z.object({
  title: z.string(),
  emoji: z.string(),
  description: z.string(),
});

export const wellnessBadgeSchema = z.object({
  emoji: z.string(),
  title: z.string(),
  reason: z.string(),
});

export const geminiWellnessSchema = z.object({
  mood: z.string(),
  stress_score: z.number().min(0).max(100),
  risk_level: z.enum(["Low", "Moderate", "Elevated", "High"]),
  triggers: z.array(z.string()),
  patterns: z.array(z.string()),
  affirmation: z.string(),
  coping: z.array(z.string()),
  mindfulness: z.object({
    title: z.string(),
    duration: z.string(),
    instructions: z.array(z.string()),
  }),
  brain_fuel: z.object({
    breakfast: brainFuelMealSchema,
    lunch: brainFuelMealSchema,
    snack: brainFuelMealSchema,
    dinner: brainFuelMealSchema,
  }),
  hydration: z.string(),
  digital_detox: z.string(),
  sleep_tip: z.string(),
  lifestyle: z.array(z.string()),
  tomorrow_plan: z.array(z.string()),
  burnout_indicator: z.string(),
  voice_reflection: z.object({
    indicator: z.string(),
    confidence: z.number().min(0).max(100),
    evidence: z.array(z.string()),
  }),
  wellness_persona: wellnessPersonaSchema,
  positive_reflections: z.array(z.string()).min(1),
  future_letter: z.string().min(50).max(600),
  exam_coach_tip: z.string(),
  wellness_badge: wellnessBadgeSchema,
});

export const wellnessAnalysisSchema = geminiWellnessSchema.extend({
  efficiency_score: z.number().min(0).max(100),
  fatigue_probability: z.number().min(0).max(100),
  music_recommendations: z.array(z.string()).min(1),
});

export type ReflectionInputValues = z.infer<typeof reflectionInputSchema>;
export type WellnessAnalysisValues = z.infer<typeof wellnessAnalysisSchema>;
export type GeminiWellnessValues = z.infer<typeof geminiWellnessSchema>;
