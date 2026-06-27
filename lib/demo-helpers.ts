import type { ExamType, ReflectionInput } from "@/types";
import type { GeminiWellnessValues } from "@/lib/schemas";
import { isJournalSentimentNegative } from "@/lib/sentiment";

const EXAM_COACH_TIPS: Record<ExamType, string> = {
  JEE: "Avoid solving new advanced problems today. Review mistakes only — understand why you got them wrong.",
  NEET: "Revise diagrams from memory today. Practice 20 MCQs from your weakest topic, then stop.",
  CAT: "Complete one LRDI set at moderate pace. Do 30 minutes of Quant revision, then stop for the day.",
  UPSC: "Read today's newspaper with notes. Revise yesterday's notes for 45 minutes, then sleep early.",
  Boards: "Review key formulas from two subjects. Practice writing one long-answer response under timed conditions.",
};

export function getExamCoachTip(examType: ExamType): string {
  return EXAM_COACH_TIPS[examType];
}

export function generateDemoPersona(input: ReflectionInput, stressScore: number) {
  const journal = input.journalText.toLowerCase();
  const hasComparison =
    journal.includes("compare") ||
    journal.includes("comparison") ||
    journal.includes("behind");

  if (input.sleepHours < 6 && input.studyHours >= 8) {
    return {
      title: "Night Owl Thinker",
      emoji: "🦉",
      description:
        "You push through late hours with deep focus, but your mind craves more rest to consolidate what you learned.",
    };
  }

  if (hasComparison && stressScore > 50) {
    return {
      title: "Perfectionist Climber",
      emoji: "🔥",
      description:
        "You hold yourself to high standards and measure progress against others — a drive that fuels growth but needs gentle pacing.",
    };
  }

  if (input.exerciseFrequency === "Daily" && input.studyHours >= 6) {
    return {
      title: "Consistent Builder",
      emoji: "🌱",
      description:
        "Steady habits define your approach — you show up, move your body, and build progress one disciplined day at a time.",
    };
  }

  if (stressScore > 60 && isJournalSentimentNegative(input.journalText)) {
    return {
      title: "Resilient Learner",
      emoji: "⚡",
      description:
        "Despite a heavy day, you keep showing up. Your persistence under pressure is a quiet strength worth recognizing.",
    };
  }

  if (journal.includes("think") || journal.includes("worry") || journal.includes("doubt")) {
    return {
      title: "Quiet Overthinker",
      emoji: "🌊",
      description:
        "Your mind processes deeply — you analyze outcomes before they happen, which shows care but can drain energy.",
    };
  }

  return {
    title: "Determined Improver",
    emoji: "🎯",
    description:
      "You focus on getting better each day, turning setbacks into lessons rather than reasons to stop.",
  };
}

export function generateDemoPositiveReflections(input: ReflectionInput): string[] {
  const reflections: string[] = [];

  if (input.studyHours >= 4) {
    reflections.push(`Studied for ${input.studyHours} hours — maintained focus through a solid session`);
  }
  if (input.mockTestScore !== undefined) {
    reflections.push("Attempted a mock test and gathered real performance data");
  }
  if (input.exerciseFrequency !== "Never") {
    reflections.push(
      input.exerciseFrequency === "Daily"
        ? "Kept up your daily movement habit"
        : "Included physical activity in your weekly routine"
    );
  }
  if (input.journalText.length > 100) {
    reflections.push("Took time to reflect honestly on your day");
  }
  if (input.studyHours >= 6 && input.studyHours <= 10) {
    reflections.push("Reached a balanced study target without overextending");
  }

  if (reflections.length === 0) {
    reflections.push("Showed up today despite challenges");
    reflections.push("Acknowledged how you feel instead of ignoring it");
  }

  return reflections.slice(0, 5);
}

export function generateDemoFutureLetter(
  input: ReflectionInput,
  stressScore: number
): string {
  if (stressScore > 65) {
    return `Hey, it's me — tomorrow morning you. I know today felt heavy with ${input.examType} pressure weighing on you. You did enough. Tonight, rest without guilt. Tomorrow we pick up one small topic, not everything at once. I'm proud you didn't quit. Sleep well — we've got this, gently.`;
  }

  return `Hi from tomorrow. I'm writing because today mattered — you put in ${input.studyHours} hours and stayed honest about how you feel. That counts more than you think. Tomorrow, start with one thing you understand well to rebuild momentum. You're closer than it feels right now. Trust the process.`;
}

export function generateDemoBadge(
  input: ReflectionInput,
  stressScore: number
) {
  if (input.sleepHours >= 7) {
    return {
      emoji: "🌙",
      title: "Sleep Warrior",
      reason: "You prioritized rest — the foundation of every good study day.",
    };
  }

  if (stressScore > 60) {
    return {
      emoji: "🔥",
      title: "Resilient Learner",
      reason: "You pushed through a tough day without giving up on your goals.",
    };
  }

  if (input.exerciseFrequency === "Daily") {
    return {
      emoji: "🏃",
      title: "Comeback Champion",
      reason: "Daily movement keeps your body and mind in sync for long prep journeys.",
    };
  }

  if (input.exerciseFrequency === "Weekly") {
    return {
      emoji: "🧘",
      title: "Balanced Mind",
      reason: "You balance study with movement — a sign of sustainable preparation.",
    };
  }

  return {
    emoji: "🌱",
    title: "Growth Mindset",
    reason: "You reflect, adapt, and keep moving forward — that's how progress compounds.",
  };
}

export type DemoGeminiFields = Omit<
  GeminiWellnessValues,
  "mood" | "stress_score" | "risk_level" | "triggers" | "patterns"
>;

export function generateDemoExtendedFields(
  input: ReflectionInput,
  stressScore: number
): Pick<
  GeminiWellnessValues,
  | "wellness_persona"
  | "positive_reflections"
  | "future_letter"
  | "exam_coach_tip"
  | "wellness_badge"
> {
  return {
    wellness_persona: generateDemoPersona(input, stressScore),
    positive_reflections: generateDemoPositiveReflections(input),
    future_letter: generateDemoFutureLetter(input, stressScore),
    exam_coach_tip: getExamCoachTip(input.examType),
    wellness_badge: generateDemoBadge(input, stressScore),
  };
}
