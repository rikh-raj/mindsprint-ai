"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/cards/glass-card";
import { Sparkles } from "lucide-react";
import type { WellnessPersona } from "@/types";

interface PersonaCardProps {
  persona: WellnessPersona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <GlassCard
      title="Wellness Persona"
      icon={<Sparkles className="h-5 w-5" />}
      delay={0.12}
      className="md:col-span-2 lg:col-span-1"
    >
      <div className="flex flex-col items-center text-center">
        <motion.span
          className="mb-3 text-6xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          aria-hidden="true"
        >
          {persona.emoji}
        </motion.span>
        <h4 className="mb-2 text-xl font-semibold text-purple-200">
          {persona.title}
        </h4>
        <p className="text-sm leading-relaxed text-white/70">
          {persona.description}
        </p>
      </div>
    </GlassCard>
  );
}
