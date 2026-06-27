import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReflectionForm } from "@/components/forms/reflection-form";
import { sampleReflectionInput } from "./fixtures";

describe("ReflectionForm interactions", () => {
  it("updates study and sleep sliders via user input", () => {
    render(<ReflectionForm onSubmit={vi.fn()} isLoading={false} />);

    const studySlider = screen.getByRole("slider", { name: /study hours today/i });
    const sleepSlider = screen.getByRole("slider", { name: /sleep hours/i });

    fireEvent.change(studySlider, { target: { value: "11" } });
    expect(studySlider).toHaveValue("11");
    expect(screen.getByText("11 hrs")).toBeInTheDocument();

    fireEvent.change(sleepSlider, { target: { value: "5" } });
    expect(sleepSlider).toHaveValue("5");
    expect(screen.getByText("5 hrs")).toBeInTheDocument();
  });

  it("updates select fields for exam, exercise, and diet", async () => {
    const user = userEvent.setup();
    render(<ReflectionForm onSubmit={vi.fn()} isLoading={false} />);

    await user.selectOptions(screen.getByLabelText(/exam type/i), "NEET");
    await user.selectOptions(screen.getByLabelText(/exercise frequency/i), "Daily");
    await user.selectOptions(screen.getByLabelText(/diet preference/i), "Vegan");

    expect(screen.getByLabelText(/exam type/i)).toHaveValue("NEET");
    expect(screen.getByLabelText(/exercise frequency/i)).toHaveValue("Daily");
    expect(screen.getByLabelText(/diet preference/i)).toHaveValue("Vegan");
  });

  it("tracks journal textarea length and enforces minimum for submit", async () => {
    const user = userEvent.setup();
    render(<ReflectionForm onSubmit={vi.fn()} isLoading={false} />);

    const submitButton = screen.getByRole("button", { name: /generate insights/i });
    expect(submitButton).toBeDisabled();

    const journal = screen.getByLabelText(/journal reflection/i);
    await user.type(journal, "Too short");
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/\/2500 characters/i)).toBeInTheDocument();

    await user.type(journal, " but long enough now.");
    expect(submitButton).not.toBeDisabled();
    expect(journal).toHaveValue("Too short but long enough now.");
  });

  it("includes optional mock score only when provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReflectionForm onSubmit={onSubmit} isLoading={false} />);

    await user.type(
      screen.getByLabelText(/journal reflection/i),
      "Today was stressful and overwhelming. I feel exhausted and worried."
    );
    await user.type(screen.getByLabelText(/mock test score/i), "82");
    await user.click(screen.getByRole("button", { name: /generate insights/i }));

    expect(onSubmit.mock.calls[0]?.[0].mockTestScore).toBe(82);
  });

  it("submits without mock score when field is blank", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReflectionForm onSubmit={onSubmit} isLoading={false} />);

    await user.type(
      screen.getByLabelText(/journal reflection/i),
      "Today was stressful and overwhelming. I feel exhausted and worried."
    );
    await user.click(screen.getByRole("button", { name: /generate insights/i }));

    expect("mockTestScore" in (onSubmit.mock.calls[0]?.[0] ?? {})).toBe(false);
  });

  it("hydrates from initialValues including mock score", () => {
    render(
      <ReflectionForm
        onSubmit={vi.fn()}
        isLoading={false}
        initialValues={sampleReflectionInput}
      />
    );

    expect(screen.getByLabelText(/exam type/i)).toHaveValue("JEE");
    expect(screen.getByLabelText(/mock test score/i)).toHaveValue(45);
    expect(screen.getByLabelText(/journal reflection/i)).toHaveValue(
      sampleReflectionInput.journalText
    );
  });

  it("disables submit while loading", () => {
    render(<ReflectionForm onSubmit={vi.fn()} isLoading={true} />);
    expect(
      screen.getByRole("button", { name: /generating insights/i })
    ).toBeDisabled();
  });
});
