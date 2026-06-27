import type { StoredAnalysis } from "@/types";
import { wellnessAnalysisSchema } from "@/lib/schemas";

const STORAGE_KEY = "mindsprint-latest-analysis";

let snapshotCache:
  | { raw: string | null; data: StoredAnalysis | null }
  | undefined;

function isStoredAnalysisCompatible(data: StoredAnalysis | null): boolean {
  if (!data?.result) return false;
  return wellnessAnalysisSchema.safeParse(data.result).success;
}

function getCachedAnalysis(): StoredAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (snapshotCache !== undefined && snapshotCache.raw === raw) {
      return snapshotCache.data;
    }
    const data = raw ? (JSON.parse(raw) as StoredAnalysis) : null;

    if (data && !isStoredAnalysisCompatible(data)) {
      localStorage.removeItem(STORAGE_KEY);
      snapshotCache = { raw: null, data: null };
      return null;
    }

    snapshotCache = { raw, data };
    return data;
  } catch {
    snapshotCache = { raw: null, data: null };
    return null;
  }
}

export function saveAnalysis(data: StoredAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, raw);
    snapshotCache = { raw, data };
  } catch {
    // localStorage may be unavailable or full
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  return getCachedAnalysis();
}

export function clearAnalysis(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    snapshotCache = { raw: null, data: null };
  } catch {
    // ignore
  }
}

export function invalidateAnalysisCache(): void {
  snapshotCache = undefined;
}
