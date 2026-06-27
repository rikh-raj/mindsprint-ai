import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModalPolyfill() {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function closePolyfill() {
      this.open = false;
    };
  }
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

vi.mock("framer-motion", () => {
  const createMotionComponent = (tag: string) => {
    const MotionComponent = React.forwardRef<
      HTMLElement,
      React.HTMLAttributes<HTMLElement>
    >(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children)
    );
    MotionComponent.displayName = `Motion${tag}`;
    return MotionComponent;
  };

  return {
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => createMotionComponent(prop),
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});
