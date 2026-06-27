"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/cards/glass-card";
import { Flame } from "lucide-react";

interface FatigueCardProps {
  probability: number;
}

export function FatigueCard({ probability }: FatigueCardProps) {
  const color =
    probability <= 40
      ? "bg-emerald-400"
      : probability <= 65
        ? "bg-yellow-400"
        : "bg-orange-400";

  return (
    <GlassCard
      title="Academic Fatigue Probability"
      icon={<Flame className="h-5 w-5" />}
      delay={0.25}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Probability</span>
          <span className="text-2xl font-bold text-white">{probability}%</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={probability}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Academic fatigue probability ${probability} percent`}
        >
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${probability}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-white/50">
          Based on stress levels, sleep, study hours, and movement habits —
          not a clinical assessment.
        </p>
      </div>
    </GlassCard>
  );
}
