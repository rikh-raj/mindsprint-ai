"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Target } from "lucide-react";

interface ExamCoachCardProps {
  tip: string;
}

export function ExamCoachCard({ tip }: ExamCoachCardProps) {
  return (
    <GlassCard
      title="Exam Coach"
      icon={<Target className="h-5 w-5" />}
      delay={0.22}
    >
      <p className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-sm leading-relaxed text-purple-100">
        {tip}
      </p>
    </GlassCard>
  );
}
