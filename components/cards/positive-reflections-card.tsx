"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/cards/glass-card";
import { Star } from "lucide-react";

interface PositiveReflectionsCardProps {
  reflections: string[];
}

export function PositiveReflectionsCard({
  reflections,
}: PositiveReflectionsCardProps) {
  return (
    <GlassCard
      title="Things You Did Well Today"
      icon={<Star className="h-5 w-5" />}
      delay={0.18}
      className="md:col-span-2"
    >
      <ul className="space-y-3" role="list">
        {reflections.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-start gap-3 text-sm text-white/80"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
              aria-hidden="true"
            >
              <Check className="h-3 w-3" />
            </span>
            {item}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
