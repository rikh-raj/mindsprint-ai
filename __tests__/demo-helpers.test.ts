import { describe, it, expect } from "vitest";
import {
  generateDemoBadge,
  generateDemoExtendedFields,
  generateDemoPersona,
  generateDemoPositiveReflections,
  getExamCoachTip,
} from "@/lib/demo-helpers";
import { sampleReflectionInput } from "./fixtures";

describe("demo-helpers", () => {
  it("returns exam-specific coach tips", () => {
    expect(getExamCoachTip("NEET")).toContain("diagrams");
    expect(getExamCoachTip("UPSC")).toContain("newspaper");
  });

  it("generates persona variants from lifestyle signals", () => {
    expect(
      generateDemoPersona(
        { ...sampleReflectionInput, sleepHours: 4, studyHours: 9 },
        60
      ).title
    ).toBe("Night Owl Thinker");

    expect(
      generateDemoPersona(
        {
          ...sampleReflectionInput,
          sleepHours: 7,
          studyHours: 6,
          journalText:
            "I keep comparing myself and feel behind everyone else in class.",
        },
        70
      ).title
    ).toBe("Perfectionist Climber");

    expect(
      generateDemoPersona(
        {
          ...sampleReflectionInput,
          sleepHours: 7,
          exerciseFrequency: "Daily",
          studyHours: 7,
          journalText: "Steady revision day with balanced energy and focus.",
        },
        30
      ).title
    ).toBe("Consistent Builder");
  });

  it("covers resilient, overthinker, and default persona branches", () => {
    expect(
      generateDemoPersona(
        {
          ...sampleReflectionInput,
          sleepHours: 7,
          studyHours: 6,
          journalText:
            "Today was stressful and overwhelming. I feel exhausted and worried.",
        },
        70
      ).title
    ).toBe("Resilient Learner");

    expect(
      generateDemoPersona(
        {
          ...sampleReflectionInput,
          sleepHours: 7,
          studyHours: 6,
          journalText:
            "I worry a lot and doubt whether my preparation strategy is working.",
        },
        40
      ).title
    ).toBe("Quiet Overthinker");

    expect(
      generateDemoPersona(
        {
          examType: "Boards",
          studyHours: 4,
          sleepHours: 7,
          exerciseFrequency: "Weekly",
          dietPreference: "Vegan",
          journalText: "Regular study day without major highs or lows.",
        },
        40
      ).title
    ).toBe("Determined Improver");
  });

  it("covers badge branches for sleep and exercise habits", () => {
    expect(
      generateDemoBadge({ ...sampleReflectionInput, sleepHours: 8 }, 40).title
    ).toBe("Sleep Warrior");
    expect(
      generateDemoBadge(
        { ...sampleReflectionInput, exerciseFrequency: "Daily" },
        40
      ).title
    ).toBe("Comeback Champion");
    expect(
      generateDemoBadge(
        { ...sampleReflectionInput, exerciseFrequency: "Weekly" },
        40
      ).title
    ).toBe("Balanced Mind");
    expect(generateDemoBadge(sampleReflectionInput, 40).title).toBe(
      "Growth Mindset"
    );
  });

  it("builds positive reflections and extended demo fields", () => {
    expect(generateDemoPositiveReflections(sampleReflectionInput).length).toBeGreaterThan(
      0
    );

    expect(
      generateDemoPositiveReflections({
        examType: "Boards",
        studyHours: 2,
        sleepHours: 7,
        exerciseFrequency: "Never",
        dietPreference: "Vegan",
        journalText: "Short day today overall.",
      })
    ).toContain("Showed up today despite challenges");

    const extended = generateDemoExtendedFields(sampleReflectionInput, 80);
    expect(extended.future_letter).toContain("tomorrow morning");
    expect(extended.exam_coach_tip).toBeTruthy();
  });
});
