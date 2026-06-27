"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Activity } from "lucide-react";

interface StressScoreCardProps {
  score: number;
}

export function StressScoreCard({ score }: StressScoreCardProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score <= 30
      ? "text-emerald-400"
      : score <= 55
        ? "text-yellow-400"
        : score <= 75
          ? "text-orange-400"
          : "text-red-400";

  const strokeColor =
    score <= 30
      ? "#34d399"
      : score <= 55
        ? "#facc15"
        : score <= 75
          ? "#fb923c"
          : "#f87171";

  return (
    <GlassCard
      title="Stress Score"
      icon={<Activity className="h-5 w-5" />}
      delay={0.15}
    >
      <div
        className="relative mx-auto flex h-40 w-40 items-center justify-center"
        role="img"
        aria-label={`Stress score ${score} out of 100`}
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
        <span className={`absolute text-3xl font-bold ${color}`}>{score}</span>
      </div>
    </GlassCard>
  );
}
