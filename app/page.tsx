"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Brain, RotateCcw } from "lucide-react";
import { analyzeReflection } from "@/actions/analyze";
import { ReflectionForm } from "@/components/forms/reflection-form";
import { LoadingFlow } from "@/components/loading-flow";
import { Dashboard } from "@/components/dashboard";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { LOADING_STEP_DURATION_MS, LOADING_STEPS } from "@/lib/loading-steps";
import { loadAnalysis, saveAnalysis } from "@/lib/storage";
import type { AnalysisResult, ReflectionInput, StoredAnalysis } from "@/types";

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getStoredSnapshot(): StoredAnalysis | null {
  return loadAnalysis();
}

type ViewState =
  | { kind: "stored" }
  | { kind: "fresh"; result: AnalysisResult; input: ReflectionInput }
  | { kind: "empty" };

function resolveDisplay(
  viewState: ViewState,
  stored: StoredAnalysis | null
): { result: AnalysisResult | null; input: ReflectionInput | null } {
  if (viewState.kind === "fresh") {
    return { result: viewState.result, input: viewState.input };
  }
  if (viewState.kind === "stored" && stored) {
    return { result: stored.result, input: stored.input };
  }
  return { result: null, input: null };
}

export default function HomePage() {
  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );
  const stored = useSyncExternalStore(
    subscribeNoop,
    getStoredSnapshot,
    () => null
  );

  const [viewState, setViewState] = useState<ViewState>({ kind: "stored" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { result, input: lastInput } = resolveDisplay(viewState, stored);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, LOADING_STEP_DURATION_MS);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = useCallback(async (formInput: ReflectionInput) => {
    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    setViewState({ kind: "empty" });

    try {
      const response = await analyzeReflection(formInput);

      if (!response.success) {
        setError(response.error);
        return;
      }

      setViewState({
        kind: "fresh",
        result: response.data,
        input: formInput,
      });
      saveAnalysis({ input: formInput, result: response.data });
    } catch {
      setError("Unable to generate insights. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  }, []);

  const handleReset = () => {
    setViewState({ kind: "empty" });
    setError(null);
  };

  if (!isClient) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </main>
    );
  }

  return (
    <>
      <header className="relative overflow-hidden border-b border-white/10 px-4 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-200">
            <Brain className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            AI Wellness Copilot
          </div>
          <h1 className="bg-gradient-to-r from-purple-300 via-white to-emerald-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            MindSprint AI
          </h1>
          <p className="mt-3 text-lg text-white/60">
            Reflect • Recover • Recharge
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/50">
            Your wellness companion for JEE, NEET, CAT, UPSC, and board exam
            preparation. Share your day — get personalized recovery insights.
          </p>
        </motion.div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-6xl space-y-10 px-4 py-10"
      >
        {!result && !isLoading && (
          <ReflectionForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialValues={lastInput ?? undefined}
          />
        )}

        {isLoading && (
          <LoadingFlow isLoading={isLoading} currentStep={loadingStep} />
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200"
          >
            {error}
          </div>
        )}

        {result && lastInput && !isLoading && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">
                Your Wellness Insights
              </h2>
              <Button
                variant="secondary"
                onClick={handleReset}
                aria-label="Start a new reflection"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                New Reflection
              </Button>
            </div>
            <Dashboard result={result} input={lastInput} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
