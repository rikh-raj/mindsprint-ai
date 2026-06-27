"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LOADING_STEPS } from "@/lib/loading-steps";

interface LoadingFlowProps {
  isLoading: boolean;
  currentStep: number;
}

export function LoadingFlow({ isLoading, currentStep }: LoadingFlowProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="glass-card rounded-2xl p-8"
          role="status"
          aria-live="polite"
          aria-label="Generating wellness insights"
        >
          <div className="space-y-6">
            {LOADING_STEPS.map((step, index) => (
              <motion.div
                key={step.emoji}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0,
                }}
                className="flex items-center gap-4"
              >
                <span className="text-2xl" aria-hidden="true">
                  {step.emoji}
                </span>
                <div className="flex-1">
                  <p
                    className={
                      index <= currentStep
                        ? "font-medium text-white"
                        : "text-white/40"
                    }
                  >
                    {step.text}
                  </p>
                  {index === currentStep && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-white/5"
                aria-hidden="true"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
