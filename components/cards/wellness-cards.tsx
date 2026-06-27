"use client";

import { GlassCard } from "@/components/cards/glass-card";
import {
  Brain,
  Droplets,
  Smartphone,
  Moon,
  CalendarCheck,
  Mic,
  Sparkles,
} from "lucide-react";
import type { MindfulnessExercise, VoiceReflection } from "@/types";

export function MindfulnessCard({
  mindfulness,
}: {
  mindfulness: MindfulnessExercise;
}) {
  return (
    <GlassCard
      title="Mindfulness Exercise"
      icon={<Brain className="h-5 w-5" />}
      delay={0.55}
    >
      <h4 className="mb-1 font-medium text-purple-200">{mindfulness.title}</h4>
      <p className="mb-3 text-sm text-emerald-400">{mindfulness.duration}</p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-white/80">
        {mindfulness.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </GlassCard>
  );
}

export function HydrationCard({ hydration }: { hydration: string }) {
  return (
    <GlassCard
      title="Hydration"
      icon={<Droplets className="h-5 w-5" />}
      delay={0.6}
    >
      <p className="text-sm leading-relaxed text-white/80">{hydration}</p>
    </GlassCard>
  );
}

export function DigitalDetoxCard({ digitalDetox }: { digitalDetox: string }) {
  return (
    <GlassCard
      title="Digital Detox"
      icon={<Smartphone className="h-5 w-5" />}
      delay={0.65}
    >
      <p className="text-sm leading-relaxed text-white/80">{digitalDetox}</p>
    </GlassCard>
  );
}

export function SleepTipCard({ sleepTip }: { sleepTip: string }) {
  return (
    <GlassCard
      title="Sleep Improvement"
      icon={<Moon className="h-5 w-5" />}
      delay={0.7}
    >
      <p className="text-sm leading-relaxed text-white/80">{sleepTip}</p>
    </GlassCard>
  );
}

export function TomorrowPlanCard({ plan }: { plan: string[] }) {
  return (
    <GlassCard
      title="Tomorrow Recovery Plan"
      icon={<CalendarCheck className="h-5 w-5" />}
      delay={0.75}
      className="md:col-span-2"
    >
      <ul className="space-y-2" role="list">
        {plan.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600/40 text-xs font-bold text-purple-200">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function VoiceReflectionCard({
  voiceReflection,
}: {
  voiceReflection: VoiceReflection;
}) {
  return (
    <GlassCard
      title="Voice Reflection"
      icon={<Mic className="h-5 w-5" />}
      delay={0.8}
    >
      <p className="mb-2 font-medium text-purple-200">
        {voiceReflection.indicator}
      </p>
      <p className="mb-3 text-sm text-emerald-400">
        Confidence: {voiceReflection.confidence}%
      </p>
      <ul className="space-y-1" role="list">
        {voiceReflection.evidence.map((item, i) => (
          <li key={i} className="text-xs text-white/60">
            • {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function LifestyleCard({ lifestyle }: { lifestyle: string[] }) {
  return (
    <GlassCard
      title="Lifestyle Suggestions"
      icon={<Sparkles className="h-5 w-5" />}
      delay={0.85}
    >
      <ul className="space-y-2" role="list">
        {lifestyle.map((item, i) => (
          <li key={i} className="text-sm text-white/80">
            • {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
