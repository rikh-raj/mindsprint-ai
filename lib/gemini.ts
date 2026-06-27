import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { ReflectionInput, WellnessAnalysis } from "@/types";
import { buildMindSprintPrompt } from "@/lib/prompt";
import {
  geminiWellnessSchema,
  wellnessAnalysisSchema,
  type GeminiWellnessValues,
} from "@/lib/schemas";
import { clampStressScore } from "@/lib/stress";
import { generateDemoAnalysis } from "@/lib/demo";
import { enrichWellnessAnalysis } from "@/lib/enrichment";

const TIMEOUT_MS = 10_000;
const GEMINI_MODEL = "gemini-2.5-flash";
const DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528:free";

function isPlaceholderKey(key: string | undefined): boolean {
  return !key || key === "your_api_key_here" || key.trim() === "";
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    }),
  ]);
}

export function parseAiResponse(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenceMatch
    ? fenceMatch[1].trim()
    : (() => {
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          return trimmed.slice(start, end + 1);
        }
        return trimmed;
      })();

  try {
    return JSON.parse(jsonText) as unknown;
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}

export function validateAiResponse(data: unknown): GeminiWellnessValues {
  return geminiWellnessSchema.parse(data);
}

function finalizeAnalysis(
  input: ReflectionInput,
  rawData: unknown,
  preliminaryStressScore: number
): WellnessAnalysis {
  const validated = validateAiResponse(rawData);
  const clamped = {
    ...validated,
    stress_score: clampStressScore(
      validated.stress_score,
      preliminaryStressScore
    ),
  };
  const enriched = enrichWellnessAnalysis(input, clamped);
  wellnessAnalysisSchema.parse(enriched);
  return enriched;
}

async function requestGeminiRaw(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (isPlaceholderKey(apiKey)) {
    throw new Error("Gemini API key not configured");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const prompt = buildMindSprintPrompt(input, preliminaryStressScore);

  const response = await withTimeout(
    ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
    TIMEOUT_MS
  );

  const rawText = response.text ?? "";
  if (!rawText.trim()) {
    throw new Error("Gemini returned empty response");
  }

  return rawText;
}

async function requestDeepSeekRaw(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (isPlaceholderKey(apiKey)) {
    throw new Error("OpenRouter API key not configured");
  }

  const client = new OpenAI({
    apiKey: apiKey!,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://mindsprint-ai.vercel.app",
      "X-Title": "MindSprint AI",
    },
  });

  const prompt = buildMindSprintPrompt(input, preliminaryStressScore);

  const response = await withTimeout(
    client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
    TIMEOUT_MS
  );

  const rawText = response.choices[0]?.message?.content ?? "";
  if (!rawText.trim()) {
    throw new Error("DeepSeek returned empty response");
  }

  return rawText;
}

/** Primary provider — Google Gemini 2.5 Flash (throws on failure) */
async function callGeminiProvider(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  const rawText = await requestGeminiRaw(input, preliminaryStressScore);
  const parsed = parseAiResponse(rawText);
  return finalizeAnalysis(input, parsed, preliminaryStressScore);
}

/** Secondary provider — DeepSeek R1 Free via OpenRouter (throws on failure) */
export async function analyzeWithDeepSeek(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  const rawText = await requestDeepSeekRaw(input, preliminaryStressScore);
  const parsed = parseAiResponse(rawText);
  return finalizeAnalysis(input, parsed, preliminaryStressScore);
}

/** Gemini-only provider helper (throws on failure) — spec: analyzeWithGemini() */
export async function analyzeWithGemini(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  return callGeminiProvider(input, preliminaryStressScore);
}

/** Fallback chain: Gemini → DeepSeek → Demo. Never throws. */
export async function analyzeWithAI(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  try {
    return await analyzeWithGemini(input, preliminaryStressScore);
  } catch {
    console.warn("Gemini failed");
  }

  try {
    return await analyzeWithDeepSeek(input, preliminaryStressScore);
  } catch {
    console.warn("DeepSeek failed");
  }

  console.warn("Using demo mode");
  return generateDemoAnalysis(input, preliminaryStressScore);
}
