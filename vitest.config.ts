import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: [
        "lib/**/*.ts",
        "actions/**/*.ts",
        "components/forms/reflection-form.tsx",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "components/ui/**",
        "components/share-wellness-report.tsx",
        "components/footer.tsx",
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 90,
        "lib/gemini.ts": {
          branches: 100,
          lines: 95,
          functions: 95,
          statements: 95,
        },
        "lib/storage.ts": {
          branches: 100,
          lines: 95,
          functions: 95,
          statements: 95,
        },
        "actions/analyze.ts": {
          branches: 95,
          lines: 95,
          functions: 95,
          statements: 95,
        },
        "components/forms/reflection-form.tsx": {
          branches: 90,
          lines: 90,
          functions: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
