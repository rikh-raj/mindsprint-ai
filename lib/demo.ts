import type { ReflectionInput, WellnessAnalysis } from "@/types";
import { clampStressScore } from "@/lib/stress";
import { enrichWellnessAnalysis } from "@/lib/enrichment";
import { generateDemoExtendedFields } from "@/lib/demo-helpers";

function riskFromScore(score: number): WellnessAnalysis["risk_level"] {
  if (score <= 30) return "Low";
  if (score <= 55) return "Moderate";
  if (score <= 75) return "Elevated";
  return "High";
}

export function generateDemoAnalysis(
  input: ReflectionInput,
  preliminaryStressScore: number
): WellnessAnalysis {
  const stressScore = clampStressScore(preliminaryStressScore, preliminaryStressScore);
  const riskLevel = riskFromScore(stressScore);

  const isLowSleep = input.sleepHours < 6;
  const isHighStudy = input.studyHours > 10;
  const isVeg = input.dietPreference === "Vegetarian" || input.dietPreference === "Vegan";
  const isNonVeg = input.dietPreference === "Non Vegetarian";

  const breakfastMeal = isLowSleep
    ? "Oats with banana and warm milk"
    : "Vegetable upma with curd and seasonal fruit";
  const breakfastReason = isLowSleep
    ? "Low sleep depletes glycogen; complex carbs and potassium from banana help restore steady morning energy."
    : "Balanced carbs and protein support sustained focus during morning study blocks.";

  const snackMeal = isHighStudy
    ? "Dates with mixed nuts (almonds, walnuts)"
    : "Roasted chana with jaggery";
  const snackReason = isHighStudy
    ? "Long study sessions need quick glucose from dates and healthy fats from nuts to prevent afternoon crashes."
    : "Light protein and fiber keep energy stable without causing post-snack drowsiness.";

  let lunchMeal = "Brown rice, seasonal vegetables, and dal";
  let lunchReason =
    "Complex carbs and plant protein support afternoon concentration without heaviness.";

  if (isVeg) {
    lunchMeal = "Brown rice with dal tadka and paneer bhurji";
    lunchReason =
      "Paneer and dal provide complete amino acids for cognitive recovery after intensive study.";
  } else if (isNonVeg) {
    lunchMeal = "Roti with chicken curry and salad";
    lunchReason =
      "Lean chicken offers high-quality protein to repair mental fatigue from long problem-solving sessions.";
  }

  let dinnerMeal = "Khichdi with ghee and steamed vegetables";
  let dinnerReason =
    "Easy-to-digest meal supports restful sleep and overnight recovery.";

  if (input.exerciseFrequency === "Daily") {
    dinnerMeal = isVeg
      ? "Moong dal khichdi with extra paneer and sautéed greens"
      : "Egg bhurji with roti and sautéed spinach";
    dinnerReason =
      "Higher protein after daily exercise helps muscle and brain recovery while keeping dinner light.";
  }

  const triggers: string[] = [];
  if (isLowSleep) triggers.push("Sleep deficit amplifying irritability and focus lapses");
  if (isHighStudy) triggers.push("Extended study hours without adequate breaks");
  if (input.mockTestScore !== undefined && input.mockTestScore < 60) {
    triggers.push("Recent mock test score below personal expectations");
  }
  if (input.exerciseFrequency === "Never") {
    triggers.push("Limited physical movement reducing stress outlet");
  }
  triggers.push(`Academic pressure from ${input.examType} preparation timeline`);

  const patterns: string[] = [
    "Tendency to push through fatigue rather than pausing",
    "Self-evaluation tied closely to daily performance metrics",
  ];
  if (isHighStudy) patterns.push("Marathon study sessions with minimal recovery windows");

  const extended = generateDemoExtendedFields(input, stressScore);

  return enrichWellnessAnalysis(input, {
    mood:
      stressScore > 60
        ? "Overwhelmed but determined"
        : stressScore > 35
          ? "Focused with underlying tension"
          : "Calm and reflective",
    stress_score: stressScore,
    risk_level: riskLevel,
    triggers,
    patterns,
    affirmation:
      "Your effort today is evidence of your commitment. Rest is part of preparation, not a setback.",
    coping: [
      "Take a 10-minute walk away from your desk before the next study block",
      "Write down three things that went well today, however small",
      "Set a hard stop time for studying and honor it",
      "Share one worry with a friend or family member to reduce mental load",
    ],
    mindfulness: {
      title: "4-7-8 Academic Reset Breath",
      duration: "5 minutes",
      instructions: [
        "Sit comfortably with feet flat on the floor",
        "Inhale through your nose for 4 counts",
        "Hold gently for 7 counts",
        "Exhale slowly through your mouth for 8 counts",
        "Repeat 4 cycles, noticing shoulders dropping with each exhale",
      ],
    },
    brain_fuel: {
      breakfast: { meal: breakfastMeal, reason: breakfastReason },
      lunch: { meal: lunchMeal, reason: lunchReason },
      snack: { meal: snackMeal, reason: snackReason },
      dinner: { meal: dinnerMeal, reason: dinnerReason },
    },
    hydration:
      "Aim for 2.5–3 liters today. Keep a bottle at your desk and drink 200ml every hour during study blocks.",
    digital_detox:
      "Put your phone in another room for 45 minutes before bed. Replace scrolling with light stretching or reading fiction.",
    sleep_tip: isLowSleep
      ? "Target 7 hours tonight: dim lights 30 minutes early, no screens after 10 PM, and a consistent wake time tomorrow."
      : "Maintain your current sleep window; add 5 minutes of deep breathing if your mind races at bedtime.",
    lifestyle: [
      "Schedule one non-study activity you enjoy tomorrow",
      "Use the Pomodoro technique: 25 min focus, 5 min break",
      "Prepare tomorrow's study plan tonight to reduce morning decision fatigue",
    ],
    tomorrow_plan: [
      "Start with your hardest subject when energy is highest",
      "Include a 20-minute movement break mid-day",
      "Review today's mistakes without self-judgment — extract one lesson each",
      "End study 30 minutes before sleep for wind-down time",
    ],
    burnout_indicator:
      stressScore > 70
        ? "Signs of overexertion detected — consider reducing study intensity tomorrow"
        : "Managing well, but watch for cumulative fatigue over the week",
    voice_reflection: {
      indicator: stressScore > 55 ? "Elevated vocal stress markers" : "Balanced reflective tone",
      confidence: 78,
      evidence: [
        "Journal mentions pressure-related vocabulary",
        "Mixed positive and challenging experiences noted",
        "Forward-looking worry about upcoming tasks detected",
      ],
    },
    ...extended,
  });
}
