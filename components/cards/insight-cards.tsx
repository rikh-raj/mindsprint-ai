"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { Zap, Repeat, Flame, Heart, Leaf } from "lucide-react";

interface ListCardProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  delay?: number;
}

function ListCard({ title, items, icon, delay = 0.25 }: ListCardProps) {
  return (
    <GlassCard title={title} icon={icon} delay={delay}>
      <ul className="space-y-2" role="list">
        {items.map((item, i) => (
          <li
            key={`${title}-${i}`}
            className="flex items-start gap-2 text-sm text-white/80"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function TriggersCard({ triggers }: { triggers: string[] }) {
  return (
    <ListCard
      title="Hidden Triggers"
      items={triggers}
      icon={<Zap className="h-5 w-5" />}
      delay={0.25}
    />
  );
}

export function PatternsCard({ patterns }: { patterns: string[] }) {
  return (
    <ListCard
      title="Patterns"
      items={patterns}
      icon={<Repeat className="h-5 w-5" />}
      delay={0.3}
    />
  );
}

export function BurnoutCard({ indicator }: { indicator: string }) {
  return (
    <GlassCard
      title="Burnout Indicator"
      icon={<Flame className="h-5 w-5" />}
      delay={0.35}
    >
      <p className="text-sm leading-relaxed text-white/80">{indicator}</p>
    </GlassCard>
  );
}

export function AffirmationCard({ affirmation }: { affirmation: string }) {
  return (
    <GlassCard
      title="Affirmation"
      icon={<Heart className="h-5 w-5" />}
      delay={0.4}
      className="md:col-span-2"
    >
      <blockquote className="border-l-4 border-emerald-400 pl-4 text-lg italic text-purple-200">
        &ldquo;{affirmation}&rdquo;
      </blockquote>
    </GlassCard>
  );
}

export function CopingCard({ coping }: { coping: string[] }) {
  return (
    <ListCard
      title="Coping Strategies"
      items={coping}
      icon={<Leaf className="h-5 w-5" />}
      delay={0.45}
    />
  );
}
