import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { ReflectionInput, WellnessAnalysis } from "@/types";
import { AI_CONFIG } from "@/lib/config";
import { PLACEHOLDER_API_KEYS } from "@/lib/constants";
import { buildMindSprintPrompt } from "@/lib/prompt";
import {
  geminiWellnessSchema,
  wellnessAnalysisSchema,
  type GeminiWellnessValues,
} from "@/lib/schemas";
import { clampStressScore } from "@/lib/stress";
import { generateDemoAnalysis } from "@/lib/demo";
import { enrichWellnessAnalysis } from "@/lib/enrichment";
import { safeParseJson } from "@/lib/utils";

function isPlaceholderKey(key: string | undefined): boolean {
  if (!key || key.trim() === "") return true;
  return PLACEHOLDER_API_KEYS.includes(
    key as (typeof PLACEHOLDER_API_KEYS)[number]
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    }),
  ]);
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export function parseAiResponse(text: string): unknown {
  const parsed = safeParseJson(extractJsonText(text));
  if (parsed === null) {
    throw new Error("Failed to parse AI response as JSON");
  }
  return parsed;
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
      model: AI_CONFIG.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: AI_CONFIG.TEMPERATURE,
      },
    }),
    AI_CONFIG.TIMEOUT_MS
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
    baseURL: AI_CONFIG.OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": AI_CONFIG.OPENROUTER_REFERER,
      "X-Title": AI_CONFIG.OPENROUTER_TITLE,
    },
  });

  const prompt = buildMindSprintPrompt(input, preliminaryStressScore);

  const response = await withTimeout(
    client.chat.completions.create({
      model: AI_CONFIG.DEEPSEEK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: AI_CONFIG.TEMPERATURE,
      response_format: { type: "json_object" },
    }),
    AI_CONFIG.TIMEOUT_MS
  );

  const rawText = response.choices[0]?.message?.content ?? "";
  if (!rawText.trim()) {
    throw new Error("DeepSeek returned empty response");
  }

  return rawText;
}

async function callGeminiProvider(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  const rawText = await requestGeminiRaw(input, preliminaryStressScore);
  const parsed = parseAiResponse(rawText);
  return finalizeAnalysis(input, parsed, preliminaryStressScore);
}

export async function analyzeWithDeepSeek(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  const rawText = await requestDeepSeekRaw(input, preliminaryStressScore);
  const parsed = parseAiResponse(rawText);
  return finalizeAnalysis(input, parsed, preliminaryStressScore);
}

export async function analyzeWithGemini(
  input: ReflectionInput,
  preliminaryStressScore: number
): Promise<WellnessAnalysis> {
  return callGeminiProvider(input, preliminaryStressScore);
}

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
