"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { ReflectionInput } from "@/types";

interface ReflectionFormProps {
  onSubmit: (input: ReflectionInput) => void;
  isLoading: boolean;
  initialValues?: ReflectionInput;
}

const defaultValues: ReflectionInput = {
  examType: "JEE",
  studyHours: 6,
  sleepHours: 7,
  exerciseFrequency: "Weekly",
  dietPreference: "Vegetarian",
  journalText: "",
};

export function ReflectionForm({
  onSubmit,
  isLoading,
  initialValues,
}: ReflectionFormProps) {
  const [form, setForm] = useState<ReflectionInput>(
    initialValues ?? defaultValues
  );
  const [mockScoreInput, setMockScoreInput] = useState(
    initialValues?.mockTestScore?.toString() ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      mockTestScore: mockScoreInput ? Number(mockScoreInput) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-6 rounded-2xl p-6 md:p-8"
      aria-label="Daily reflection form"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="examType">Exam Type</Label>
          <Select
            id="examType"
            value={form.examType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                examType: e.target.value as ReflectionInput["examType"],
              }))
            }
            aria-required="true"
          >
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
            <option value="CAT">CAT</option>
            <option value="UPSC">UPSC</option>
            <option value="Boards">Boards</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
          <Select
            id="exerciseFrequency"
            value={form.exerciseFrequency}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                exerciseFrequency: e.target
                  .value as ReflectionInput["exerciseFrequency"],
              }))
            }
          >
            <option value="Never">Never</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietPreference">Diet Preference</Label>
          <Select
            id="dietPreference"
            value={form.dietPreference}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dietPreference: e.target
                  .value as ReflectionInput["dietPreference"],
              }))
            }
          >
            <option value="Vegetarian">Vegetarian</option>
            <option value="Eggetarian">Eggetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Non Vegetarian">Non Vegetarian</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mockTestScore">Mock Test Score (Optional)</Label>
          <input
            id="mockTestScore"
            type="number"
            min={0}
            max={100}
            placeholder="e.g. 72"
            value={mockScoreInput}
            onChange={(e) => setMockScoreInput(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-describedby="mock-score-hint"
          />
          <p id="mock-score-hint" className="text-xs text-white/50">
            Enter a score between 0 and 100, or leave blank.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label id="study-hours-label" htmlFor="studyHours">
            Study Hours Today
          </Label>
          <span
            className="text-sm font-medium text-emerald-400"
            aria-live="polite"
          >
            {form.studyHours} hrs
          </span>
        </div>
        <Slider
          id="studyHours"
          min={0}
          max={16}
          value={form.studyHours}
          onChange={(v) => setForm((prev) => ({ ...prev, studyHours: v }))}
          aria-labelledby="study-hours-label"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label id="sleep-hours-label" htmlFor="sleepHours">
            Sleep Hours
          </Label>
          <span
            className="text-sm font-medium text-emerald-400"
            aria-live="polite"
          >
            {form.sleepHours} hrs
          </span>
        </div>
        <Slider
          id="sleepHours"
          min={0}
          max={12}
          value={form.sleepHours}
          onChange={(v) => setForm((prev) => ({ ...prev, sleepHours: v }))}
          aria-labelledby="sleep-hours-label"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="journalText">Journal Reflection</Label>
        <Textarea
          id="journalText"
          value={form.journalText}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              journalText: e.target.value.slice(0, 2500),
            }))
          }
          placeholder="Tell us about today. What stressed you? What went well? What are you worried about?"
          aria-required="true"
          aria-describedby="journal-hint"
          maxLength={2500}
          rows={6}
        />
        <p id="journal-hint" className="text-xs text-white/50">
          {form.journalText.length}/2500 characters
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading || form.journalText.trim().length < 10}
        className="w-full"
        aria-busy={isLoading}
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        {isLoading ? "Generating Insights..." : "Generate Insights"}
      </Button>
    </form>
  );
}
