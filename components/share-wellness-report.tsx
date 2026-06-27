"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/types";

interface ShareWellnessReportProps {
  result: AnalysisResult;
}

export function ShareWellnessReport({ result }: ShareWellnessReportProps) {
  const handleDownload = () => {
    const lines = [
      "MindSprint AI — Wellness Snapshot",
      "Reflect • Recover • Recharge",
      "================================",
      "",
      `Mood: ${result.mood}`,
      `Stress Score: ${result.stress_score}/100`,
      `Risk Level: ${result.risk_level}`,
      "",
      `Wellness Persona: ${result.wellness_persona.emoji} ${result.wellness_persona.title}`,
      result.wellness_persona.description,
      "",
      `Study Efficiency: ${result.efficiency_score}/100`,
      `Academic Fatigue Probability: ${result.fatigue_probability}%`,
      "",
      "Things You Did Well Today:",
      ...result.positive_reflections.map((r) => `  ✓ ${r}`),
      "",
      `Today's Badge: ${result.wellness_badge.emoji} ${result.wellness_badge.title}`,
      result.wellness_badge.reason,
      "",
      "Brain Fuel — Breakfast:",
      `  ${result.brain_fuel.breakfast.meal}`,
      "Brain Fuel — Lunch:",
      `  ${result.brain_fuel.lunch.meal}`,
      "Brain Fuel — Snack:",
      `  ${result.brain_fuel.snack.meal}`,
      "Brain Fuel — Dinner:",
      `  ${result.brain_fuel.dinner.meal}`,
      "",
      "Exam Coach Tip:",
      result.exam_coach_tip,
      "",
      "Tomorrow Recovery Plan:",
      ...result.tomorrow_plan.map((p, i) => `  ${i + 1}. ${p}`),
      "",
      "Message From Tomorrow's You:",
      `"${result.future_letter}"`,
      "",
      "Focus Sounds:",
      ...result.music_recommendations.map((m) => `  • ${m}`),
      "",
      "—",
      "MindSprint AI | Not a therapist. Not a medical tool.",
      `Generated: ${new Date(result.generatedAt).toLocaleString()}`,
    ];

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindsprint-wellness-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MindSprint AI Wellness Snapshot</title>
          <style>
            body { font-family: Georgia, serif; max-width: 640px; margin: 40px auto; padding: 0 20px; color: #111; line-height: 1.6; }
            h1 { font-size: 22px; color: #6b21a8; }
            h2 { font-size: 16px; color: #059669; margin-top: 24px; }
            .subtitle { color: #666; font-size: 14px; }
            .letter { font-style: italic; background: #f9f5ff; padding: 16px; border-left: 4px solid #a855f7; margin: 12px 0; }
            .footer { margin-top: 32px; font-size: 12px; color: #999; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>MindSprint AI — Wellness Snapshot</h1>
          <p class="subtitle">Reflect • Recover • Recharge</p>

          <h2>Mood & Stress</h2>
          <p><strong>Mood:</strong> ${escapeHtml(result.mood)}</p>
          <p><strong>Stress Score:</strong> ${result.stress_score}/100</p>
          <p><strong>Risk Level:</strong> ${result.risk_level}</p>

          <h2>Wellness Persona</h2>
          <p>${result.wellness_persona.emoji} <strong>${escapeHtml(result.wellness_persona.title)}</strong></p>
          <p>${escapeHtml(result.wellness_persona.description)}</p>

          <h2>Brain Fuel</h2>
          <p><strong>Breakfast:</strong> ${escapeHtml(result.brain_fuel.breakfast.meal)}</p>
          <p><strong>Lunch:</strong> ${escapeHtml(result.brain_fuel.lunch.meal)}</p>
          <p><strong>Snack:</strong> ${escapeHtml(result.brain_fuel.snack.meal)}</p>
          <p><strong>Dinner:</strong> ${escapeHtml(result.brain_fuel.dinner.meal)}</p>

          <h2>Tomorrow Recovery Plan</h2>
          <ul>${result.tomorrow_plan.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>

          <h2>Message From Tomorrow's You</h2>
          <div class="letter">${escapeHtml(result.future_letter)}</div>

          <p class="footer">MindSprint AI — Not a therapist. Not a medical tool.<br>
          Generated: ${new Date(result.generatedAt).toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleDownload}
      aria-label="Download wellness snapshot as PDF"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Download Wellness Snapshot
    </Button>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
