import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/components/dashboard";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

describe("Dashboard", () => {
  it("renders wellness insights from analysis result", () => {
    const result = buildSampleAnalysisResult();
    render(<Dashboard result={result} input={sampleReflectionInput} />);

    expect(
      screen.getByRole("region", { name: /wellness insights dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByText(result.mood)).toBeInTheDocument();
    expect(screen.getByText(result.wellness_persona.title)).toBeInTheDocument();
  });
});
