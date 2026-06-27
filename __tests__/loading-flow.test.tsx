import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingFlow } from "@/components/loading-flow";

describe("LoadingFlow", () => {
  it("shows loading status with aria-live region", () => {
    render(<LoadingFlow isLoading={true} currentStep={1} />);
    expect(
      screen.getByRole("status", { name: /generating wellness insights/i })
    ).toBeInTheDocument();
  });

  it("hides content when not loading", () => {
    render(<LoadingFlow isLoading={false} currentStep={0} />);
    expect(
      screen.queryByRole("status", { name: /generating wellness insights/i })
    ).not.toBeInTheDocument();
  });
});
