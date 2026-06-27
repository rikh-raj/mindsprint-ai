import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  safeLocalStorageRead,
  safeLocalStorageRemove,
  safeLocalStorageWrite,
  safeParseJson,
  stripHtml,
} from "@/lib/utils";

describe("utils", () => {
  describe("stripHtml", () => {
    it("removes HTML tags and decodes entities", () => {
      expect(stripHtml("<script>alert(1)</script>hello &amp; world")).toBe(
        "alert(1)hello & world"
      );
    });

    it("trims whitespace", () => {
      expect(stripHtml("  plain text  ")).toBe("plain text");
    });
  });

  describe("safeParseJson", () => {
    it("parses valid JSON", () => {
      expect(safeParseJson('{"a":1}')).toEqual({ a: 1 });
    });

    it("returns null for invalid JSON", () => {
      expect(safeParseJson("{bad json")).toBeNull();
    });
  });

  describe("localStorage helpers", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("reads and writes safely", () => {
      expect(safeLocalStorageWrite("key", "value")).toBe(true);
      expect(safeLocalStorageRead("key")).toBe("value");
    });

    it("removes keys safely", () => {
      safeLocalStorageWrite("key", "value");
      expect(safeLocalStorageRemove("key")).toBe(true);
      expect(safeLocalStorageRead("key")).toBeNull();
    });

    it("handles localStorage read/write/remove errors", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      expect(safeLocalStorageRead("key")).toBeNull();

      vi.restoreAllMocks();
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      expect(safeLocalStorageWrite("key", "value")).toBe(false);

      vi.restoreAllMocks();
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      expect(safeLocalStorageRemove("key")).toBe(false);
    });
  });

  it("decodes each html entity when stripping tags", () => {
    expect(stripHtml("&lt;tag&gt; &amp; &quot;hi&quot; &#39;")).toBe('<tag> & "hi" \'');
  });
});
