"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/cards/glass-card";
import { Award } from "lucide-react";
import type { WellnessBadge } from "@/types";

interface BadgeCardProps {
  badge: WellnessBadge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <GlassCard
      title="Today's Badge"
      icon={<Award className="h-5 w-5" />}
      delay={0.2}
    >
      <div className="flex flex-col items-center py-2 text-center">
        <motion.span
          className="mb-3 text-5xl"
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
          aria-hidden="true"
        >
          {badge.emoji}
        </motion.span>
        <h4 className="mb-2 text-lg font-semibold text-emerald-300">
          {badge.title}
        </h4>
        <p className="text-sm text-white/60">{badge.reason}</p>
      </div>
    </GlassCard>
  );
}
