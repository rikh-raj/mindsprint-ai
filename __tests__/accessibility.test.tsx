import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ReflectionForm } from "@/components/forms/reflection-form";
import { Dashboard } from "@/components/dashboard";
import { EmergencyCalmKit } from "@/components/emergency-calm-kit";
import { buildSampleAnalysisResult, sampleReflectionInput } from "./fixtures";

expect.extend(toHaveNoViolations);

describe("accessibility", () => {
  it("ReflectionForm has no axe violations", async () => {
    const { container } = render(
      <ReflectionForm onSubmit={() => undefined} isLoading={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Dashboard has no axe violations", async () => {
    const { container } = render(
      <Dashboard
        result={buildSampleAnalysisResult()}
        input={sampleReflectionInput}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("EmergencyCalmKit modal has no axe violations when open", async () => {
    const { container, getByRole } = render(<EmergencyCalmKit />);
    getByRole("button", { name: /open emergency calm kit/i }).click();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
