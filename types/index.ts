export type ExamType = "JEE" | "NEET" | "CAT" | "UPSC" | "Boards";

export type ExerciseFrequency = "Never" | "Weekly" | "Daily";

export type DietPreference =
  | "Vegetarian"
  | "Eggetarian"
  | "Vegan"
  | "Non Vegetarian";

export type RiskLevel = "Low" | "Moderate" | "Elevated" | "High";

export interface ReflectionInput {
  examType: ExamType;
  studyHours: number;
  sleepHours: number;
  exerciseFrequency: ExerciseFrequency;
  dietPreference: DietPreference;
  mockTestScore?: number;
  journalText: string;
}

export interface MindfulnessExercise {
  title: string;
  duration: string;
  instructions: string[];
}

export interface BrainFuelMeal {
  meal: string;
  reason: string;
}

export interface BrainFuel {
  breakfast: BrainFuelMeal;
  lunch: BrainFuelMeal;
  snack: BrainFuelMeal;
  dinner: BrainFuelMeal;
}

export interface VoiceReflection {
  indicator: string;
  confidence: number;
  evidence: string[];
}

export interface WellnessPersona {
  title: string;
  emoji: string;
  description: string;
}

export interface WellnessBadge {
  emoji: string;
  title: string;
  reason: string;
}

export interface WellnessAnalysis {
  mood: string;
  stress_score: number;
  risk_level: RiskLevel;
  triggers: string[];
  patterns: string[];
  affirmation: string;
  coping: string[];
  mindfulness: MindfulnessExercise;
  brain_fuel: BrainFuel;
  hydration: string;
  digital_detox: string;
  sleep_tip: string;
  lifestyle: string[];
  tomorrow_plan: string[];
  burnout_indicator: string;
  voice_reflection: VoiceReflection;
  wellness_persona: WellnessPersona;
  positive_reflections: string[];
  future_letter: string;
  exam_coach_tip: string;
  wellness_badge: WellnessBadge;
  efficiency_score: number;
  fatigue_probability: number;
  music_recommendations: string[];
}

export interface AnalysisResult extends WellnessAnalysis {
  preliminaryStressScore: number;
  generatedAt: string;
}

export interface StoredAnalysis {
  input: ReflectionInput;
  result: AnalysisResult;
}
