import { LOADING } from "@/lib/config";

export const LOADING_STEPS = [
  { emoji: "📝", text: "Reading your reflection..." },
  { emoji: "🧠", text: "Finding emotional patterns..." },
  { emoji: "🥗", text: "Preparing brain fuel..." },
  { emoji: "🌿", text: "Building recovery plan..." },
  { emoji: "✨", text: "Creating personalized wellness insights..." },
] as const;

export const LOADING_STEP_DURATION_MS = LOADING.STEP_DURATION_MS;
