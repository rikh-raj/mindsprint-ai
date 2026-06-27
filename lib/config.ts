/** External service configuration — readonly literals */
export const AI_CONFIG = {
  TIMEOUT_MS: 10_000,
  GEMINI_MODEL: "gemini-2.5-flash",
  DEEPSEEK_MODEL: "deepseek/deepseek-r1-0528:free",
  OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",
  OPENROUTER_REFERER: "https://mindsprint-ai.vercel.app",
  OPENROUTER_TITLE: "MindSprint AI",
  TEMPERATURE: 0.7,
} as const;

export const LOADING = {
  STEP_DURATION_MS: 1200,
} as const;
