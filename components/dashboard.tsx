import type { AnalysisResult, ReflectionInput } from "@/types";
import { MoodCard } from "@/components/cards/mood-card";
import { StressScoreCard } from "@/components/cards/stress-score-card";
import { PersonaCard } from "@/components/cards/persona-card";
import { EfficiencyCard } from "@/components/cards/efficiency-card";
import { PositiveReflectionsCard } from "@/components/cards/positive-reflections-card";
import { BadgeCard } from "@/components/cards/badge-card";
import { BrainFuelCard } from "@/components/cards/brain-fuel-card";
import { ExamCoachCard } from "@/components/cards/exam-coach-card";
import { FatigueCard } from "@/components/cards/fatigue-card";
import { FutureLetterCard } from "@/components/cards/future-letter-card";
import {
  MindfulnessCard,
  TomorrowPlanCard,
  VoiceReflectionCard,
} from "@/components/cards/wellness-cards";
import { MusicCard } from "@/components/cards/music-card";
import { EmergencyCalmKit } from "@/components/emergency-calm-kit";
import { ShareWellnessReport } from "@/components/share-wellness-report";

interface DashboardProps {
  result: AnalysisResult;
  input: ReflectionInput;
}

export function Dashboard({ result, input }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <EmergencyCalmKit />
        <ShareWellnessReport result={result} />
      </div>

      <section
        aria-label="Wellness insights dashboard"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <MoodCard mood={result.mood} />
        <StressScoreCard score={result.stress_score} />
        <PersonaCard persona={result.wellness_persona} />
        <EfficiencyCard
          score={result.efficiency_score}
          input={input}
          stressScore={result.stress_score}
        />
        <PositiveReflectionsCard reflections={result.positive_reflections} />
        <BadgeCard badge={result.wellness_badge} />
        <BrainFuelCard brainFuel={result.brain_fuel} />
        <ExamCoachCard tip={result.exam_coach_tip} />
        <FatigueCard probability={result.fatigue_probability} />
        <FutureLetterCard letter={result.future_letter} />
        <MindfulnessCard mindfulness={result.mindfulness} />
        <TomorrowPlanCard plan={result.tomorrow_plan} />
        <VoiceReflectionCard voiceReflection={result.voice_reflection} />
        <MusicCard recommendations={result.music_recommendations} />
      </section>
    </div>
  );
}
