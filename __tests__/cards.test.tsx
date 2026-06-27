import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonaCard } from "@/components/cards/persona-card";
import { BadgeCard } from "@/components/cards/badge-card";
import { buildSampleAnalysisResult } from "./fixtures";

describe("PersonaCard", () => {
  it("renders persona title and description", () => {
    const result = buildSampleAnalysisResult();
    render(<PersonaCard persona={result.wellness_persona} />);
    expect(screen.getByText(result.wellness_persona.title)).toBeInTheDocument();
    expect(
      screen.getByText(result.wellness_persona.description)
    ).toBeInTheDocument();
  });
});

describe("BadgeCard", () => {
  it("renders badge title and reason", () => {
    const result = buildSampleAnalysisResult();
    render(<BadgeCard badge={result.wellness_badge} />);
    expect(screen.getByText(result.wellness_badge.title)).toBeInTheDocument();
    expect(screen.getByText(result.wellness_badge.reason)).toBeInTheDocument();
  });
});
