import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const HTML_ENTITY_MAP: Readonly<Record<string, string>> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
};

export function stripHtml(input: string): string {
  const withoutTags = input.replace(/<[^>]*>/g, "");
  return Object.entries(HTML_ENTITY_MAP).reduce(
    (text, [entity, char]) => text.replaceAll(entity, char),
    withoutTags
  ).trim();
}

/** Safely parse JSON — returns null instead of throwing */
export function safeParseJson(raw: string): unknown | null {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** Safely read from localStorage — returns null on failure or SSR */
export function safeLocalStorageRead(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safely write to localStorage — returns success boolean */
export function safeLocalStorageWrite(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Safely remove from localStorage */
export function safeLocalStorageRemove(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
