import { describe, it, expect } from "vitest";
import { isJournalSentimentNegative } from "@/lib/sentiment";

describe("sentiment", () => {
  it("detects negative journal sentiment with multiple keywords", () => {
    expect(
      isJournalSentimentNegative(
        "I feel stressed and overwhelmed about my exam."
      )
    ).toBe(true);
  });

  it("returns false for neutral or positive journals", () => {
    expect(
      isJournalSentimentNegative("Focused study session with good revision.")
    ).toBe(false);
  });

  it("is case insensitive", () => {
    expect(isJournalSentimentNegative("STRESSED and EXHAUSTED today")).toBe(
      true
    );
  });
});
