import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const chromePath = existsSync("/home/neo/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome")
  ? "/home/neo/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome"
  : "/usr/bin/chromium";

export default defineConfig({
  testDir: "./tests",
  webServer: {
    command: "python -m http.server 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: {
      executablePath: chromePath,
      args: ["--headless=new", "--no-sandbox"],
    },
  },
});
