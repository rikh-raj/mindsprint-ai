import { describe, it, expect, vi, afterEach } from "vitest";
import {
  safeLocalStorageRead,
  safeLocalStorageRemove,
  safeLocalStorageWrite,
} from "@/lib/utils";

describe("utils SSR safety", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.stubGlobal("window", originalWindow);
  });

  it("returns early on SSR without touching localStorage", () => {
    vi.stubGlobal("window", undefined);
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    expect(safeLocalStorageRead("key")).toBeNull();
    expect(getItem).not.toHaveBeenCalled();
    getItem.mockRestore();
  });

  it("returns false on SSR for write and remove without touching storage", () => {
    vi.stubGlobal("window", undefined);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");
    expect(safeLocalStorageWrite("key", "value")).toBe(false);
    expect(safeLocalStorageRemove("key")).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).not.toHaveBeenCalled();
    setItem.mockRestore();
    removeItem.mockRestore();
  });
});
