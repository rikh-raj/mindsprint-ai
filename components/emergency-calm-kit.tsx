"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

const CALM_STEPS = [
  "Drink a full glass of water",
  "Take ten slow, deep breaths",
  "Walk for five minutes away from your desk",
  "Talk to someone you trust — even a short message helps",
  "Solve three easy questions to rebuild confidence",
] as const;

export function EmergencyCalmKit() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    CALM_STEPS.map(() => false)
  );

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleOpen = () => {
    setChecked(CALM_STEPS.map(() => false));
    setOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-label="Open emergency calm kit"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        I Feel Overwhelmed
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Emergency Calm Kit"
      >
        <p className="mb-4 text-sm text-white/60">
          You&apos;re not alone. Work through these steps at your own pace —
          no rush.
        </p>
        <ul className="space-y-3" role="list">
          {CALM_STEPS.map((step, i) => (
            <li key={step}>
              <button
                type="button"
                onClick={() => toggleCheck(i)}
                className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-pressed={checked[i]}
              >
                <motion.span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    checked[i]
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-400"
                      : "border-white/30 text-transparent"
                  }`}
                  animate={checked[i] ? { scale: [1, 1.2, 1] } : {}}
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" />
                </motion.span>
                <span className={checked[i] ? "text-white/50 line-through" : "text-white/80"}>
                  {step}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
}
