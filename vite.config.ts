/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { configDefaults } from "vitest/config";

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
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
      exclude: [
        ...configDefaults.coverage.exclude,
        "src/main.ts",
        "src/models/**/*",
        "src/constants/**/*",
        "src/types/**/*",
        "html/**/*",
        "src/utils/testing-utilites.ts",
        "**/*.config.{ts,js}",
      ],
      //if true report will be generated even if tests fail
      reportOnFailure: true,
    },
  },
  base: "/",
});
