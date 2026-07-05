import { defineConfig } from "@playwright/test";

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
      executablePath: "/home/neo/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
      args: ["--headless=new", "--no-sandbox"],
    },
  },
});
