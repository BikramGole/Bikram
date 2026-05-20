import { expect, test } from "@playwright/test";

const THEME_STORAGE_KEY = "neoThemeVariant.v1";

test("URL theme overrides stored theme and persists across navigation", async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate((key) => {
    window.localStorage.setItem(key, "paper");
  }, THEME_STORAGE_KEY);

  await page.goto("/index.html?theme=blackflag");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "blackflag");
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), THEME_STORAGE_KEY)).toBe("blackflag");

  await page.getByRole("link", { name: "About" }).first().click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "blackflag");
  await expect(page).toHaveURL(/about\.html\?theme=blackflag$/);
});
