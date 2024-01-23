/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 0,
  },
  test: {
    environment: "jsdom",
    reporters: ["default", "html"],
    include: ["src/**/*.test.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      clean: true,
      cleanOnRerun: true,
      reporter: ["text", "json", "html", "lcov"],
      //if coverage does not meet thresholds, test will fail and build process will be aborted
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      //if true report will be generated even if tests fail
      reportOnFailure: true,
    },
  },
});
