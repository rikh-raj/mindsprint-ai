"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Music } from "lucide-react";

interface MusicCardProps {
  recommendations: string[];
}

export function MusicCard({ recommendations }: MusicCardProps) {
  return (
    <GlassCard
      title="Focus Sounds"
      icon={<Music className="h-5 w-5" />}
      delay={0.32}
    >
      <ul className="grid gap-2 sm:grid-cols-2" role="list">
        {recommendations.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
          >
            🎵 {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
