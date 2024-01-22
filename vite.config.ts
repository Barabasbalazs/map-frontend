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
    coverage: {
      enabled: true,
      provider: "v8",
      all: true,
      clean: true,
      cleanOnRerun: true,
      reporter: ['text', 'json', 'html', "lcov"],
    },
  },
});
