import { defineConfig } from "@playwright/test";

/**
 * Regression tests.
 *   npm test             → unit + end-to-end (starts `next dev` automatically)
 *   npm run test:unit    → fast logic and content-integrity checks, no browser
 *   npm run test:e2e     → browser tests
 *
 * Against a production build instead of the dev server:
 *   npm run build && npx next start -p 3417   (in another terminal)
 *   BASE_URL=http://localhost:3417 npm run test:e2e
 *
 * First run on a new machine: npx playwright install chromium
 * (or set PW_CHROMIUM_PATH to an existing Chromium/headless-shell binary).
 */
const PORT = Number(process.env.PORT ?? 3417);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const startServer = !process.env.BASE_URL && !process.env.PW_NO_SERVER;

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 1 : 3,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1366, height: 768 },
    hasTouch: true,
    launchOptions: {
      executablePath: process.env.PW_CHROMIUM_PATH || undefined,
      args: ["--autoplay-policy=no-user-gesture-required"],
    },
  },
  projects: [
    { name: "unit", testMatch: /unit\/.*\.spec\.ts$/ },
    { name: "e2e", testMatch: /e2e\/.*\.spec\.ts$/ },
  ],
  webServer: startServer
    ? {
        command: `npm run dev -- --port ${PORT}`,
        url: `${BASE_URL}/game`,
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});
