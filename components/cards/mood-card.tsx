"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Smile } from "lucide-react";

interface MoodCardProps {
  mood: string;
}

export function MoodCard({ mood }: MoodCardProps) {
  return (
    <GlassCard title="Mood" icon={<Smile className="h-5 w-5" />} delay={0.1}>
      <p className="text-2xl font-semibold text-purple-200">{mood}</p>
    </GlassCard>
  );
}
