import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "tests/e2e/**"],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./components"),
      lib: path.resolve(__dirname, "./lib"),
    },
  },
});
