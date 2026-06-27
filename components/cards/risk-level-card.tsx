"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { ShieldAlert } from "lucide-react";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

interface RiskLevelCardProps {
  riskLevel: RiskLevel;
}

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Elevated: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  High: "bg-red-500/20 text-red-300 border-red-500/30",
};

export function RiskLevelCard({ riskLevel }: RiskLevelCardProps) {
  return (
    <GlassCard
      title="Risk Level"
      icon={<ShieldAlert className="h-5 w-5" />}
      delay={0.2}
    >
      <span
        className={cn(
          "inline-flex rounded-full border px-4 py-2 text-lg font-semibold",
          riskStyles[riskLevel]
        )}
      >
        {riskLevel}
      </span>
    </GlassCard>
  );
}
