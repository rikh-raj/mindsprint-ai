"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Mail } from "lucide-react";

interface FutureLetterCardProps {
  letter: string;
}

export function FutureLetterCard({ letter }: FutureLetterCardProps) {
  return (
    <GlassCard
      title="Message From Tomorrow's You"
      icon={<Mail className="h-5 w-5" />}
      delay={0.28}
      className="md:col-span-2"
    >
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-white/5 p-6 shadow-inner">
        <p className="font-serif text-base italic leading-relaxed text-purple-100/90">
          &ldquo;{letter}&rdquo;
        </p>
      </div>
    </GlassCard>
  );
}
