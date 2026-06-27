"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { BookOpen } from "lucide-react";
import type { ReflectionInput } from "@/types";
import { computeEfficiencyExplanation } from "@/lib/scores";

interface EfficiencyCardProps {
  score: number;
  input: ReflectionInput;
  stressScore: number;
}

export function EfficiencyCard({
  score,
  input,
  stressScore,
}: EfficiencyCardProps) {
  const explanation = computeEfficiencyExplanation(
    input,
    score,
    stressScore
  );

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 70 ? "#34d399" : score >= 45 ? "#facc15" : "#fb923c";

  return (
    <GlassCard
      title="Study Efficiency"
      icon={<BookOpen className="h-5 w-5" />}
      delay={0.15}
    >
      <div
        className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center"
        role="img"
        aria-label={`Study efficiency score ${score} out of 100`}
      >
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white">
          {score}
          <span className="text-sm text-white/50">/100</span>
        </span>
      </div>
      <p className="text-center text-sm leading-relaxed text-white/70">
        {explanation}
      </p>
    </GlassCard>
  );
}
