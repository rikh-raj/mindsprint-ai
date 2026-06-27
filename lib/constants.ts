/** Application-wide constants — no magic numbers in business logic */
export const JOURNAL_MAX_LENGTH = 2500 as const;
export const JOURNAL_MIN_LENGTH = 10 as const;

export const STRESS_SCORE = {
  MIN: 0,
  MAX: 100,
  ADJUSTMENT_RANGE: 10,
  LOW_SLEEP_THRESHOLD: 6,
  HIGH_STUDY_THRESHOLD: 10,
  LOW_MOCK_THRESHOLD: 60,
  LOW_SLEEP_PENALTY: 25,
  HIGH_STUDY_PENALTY: 20,
  LOW_MOCK_PENALTY: 15,
  NO_EXERCISE_PENALTY: 10,
  NEGATIVE_SENTIMENT_PENALTY: 20,
} as const;

export const EFFICIENCY_SCORE = {
  BASE: 100,
  LOW_SLEEP_THRESHOLD: 6,
  HIGH_STUDY_THRESHOLD: 12,
  HIGH_STRESS_THRESHOLD: 75,
  LOW_SLEEP_PENALTY: 20,
  HIGH_STUDY_PENALTY: 15,
  NO_EXERCISE_PENALTY: 10,
  HIGH_STRESS_PENALTY: 10,
  GOOD_THRESHOLD: 70,
} as const;

export const FATIGUE_SCORE = {
  STRESS_MULTIPLIER: 0.6,
  LOW_SLEEP_THRESHOLD: 6,
  HIGH_STUDY_THRESHOLD: 10,
  LOW_SLEEP_BONUS: 15,
  HIGH_STUDY_BONUS: 10,
  NO_EXERCISE_BONUS: 5,
} as const;

export const RISK_THRESHOLDS = {
  LOW: 30,
  MODERATE: 55,
  ELEVATED: 75,
} as const;

export const SENTIMENT = {
  MIN_NEGATIVE_KEYWORDS: 2,
} as const;

export const STORAGE_KEY = "mindsprint-latest-analysis" as const;

export const PLACEHOLDER_API_KEYS = ["your_api_key_here"] as const;
