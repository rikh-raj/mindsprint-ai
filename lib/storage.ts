import type { StoredAnalysis } from "@/types";
import { STORAGE_KEY } from "@/lib/constants";
import { wellnessAnalysisSchema } from "@/lib/schemas";
import {
  safeLocalStorageRead,
  safeLocalStorageRemove,
  safeLocalStorageWrite,
  safeParseJson,
} from "@/lib/utils";

let snapshotCache:
  | { raw: string | null; data: StoredAnalysis | null }
  | undefined;

function isStoredAnalysisCompatible(data: StoredAnalysis | null): boolean {
  if (!data?.result) return false;
  return wellnessAnalysisSchema.safeParse(data.result).success;
}

function getCachedAnalysis(): StoredAnalysis | null {
  if (typeof window === "undefined") return null;

  const raw = safeLocalStorageRead(STORAGE_KEY);
  if (snapshotCache !== undefined && snapshotCache.raw === raw) {
    return snapshotCache.data;
  }

  if (!raw) {
    snapshotCache = { raw: null, data: null };
    return null;
  }

  const parsed = safeParseJson(raw);
  const data =
    parsed !== null && typeof parsed === "object"
      ? (parsed as StoredAnalysis)
      : null;

  if (data && !isStoredAnalysisCompatible(data)) {
    safeLocalStorageRemove(STORAGE_KEY);
    snapshotCache = { raw: null, data: null };
    return null;
  }

  snapshotCache = { raw, data };
  return data;
}

export function saveAnalysis(data: StoredAnalysis): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(data);
  if (safeLocalStorageWrite(STORAGE_KEY, raw)) {
    snapshotCache = { raw, data };
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  return getCachedAnalysis();
}

export function clearAnalysis(): void {
  if (typeof window === "undefined") return;
  if (safeLocalStorageRemove(STORAGE_KEY)) {
    snapshotCache = { raw: null, data: null };
  }
}

export function invalidateAnalysisCache(): void {
  snapshotCache = undefined;
}
