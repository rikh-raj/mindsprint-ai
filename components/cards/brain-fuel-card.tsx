"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { UtensilsCrossed } from "lucide-react";
import type { BrainFuel } from "@/types";

interface BrainFuelCardProps {
  brainFuel: BrainFuel;
}

const meals = [
  { key: "breakfast" as const, label: "Breakfast" },
  { key: "lunch" as const, label: "Lunch" },
  { key: "snack" as const, label: "Snack" },
  { key: "dinner" as const, label: "Dinner" },
];

export function BrainFuelCard({ brainFuel }: BrainFuelCardProps) {
  return (
    <GlassCard
      title="Brain Fuel"
      icon={<UtensilsCrossed className="h-5 w-5" />}
      delay={0.5}
      className="md:col-span-2"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {meals.map(({ key, label }) => (
          <article
            key={key}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <h4 className="mb-2 font-medium text-emerald-400">{label}</h4>
            <p className="mb-2 text-sm font-medium text-white">
              {brainFuel[key].meal}
            </p>
            <p className="text-xs leading-relaxed text-white/60">
              {brainFuel[key].reason}
            </p>
          </article>
        ))}
      </div>
    </GlassCard>
  );
}
