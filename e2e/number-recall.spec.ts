import { test, expect } from "@playwright/test";

test("completes a Number Recall Classic run", async ({ page }) => {
  await page.goto("/games/number-recall");
  await page.getByRole("button", { name: /start challenge/i }).click();
  await expect(page.getByText("Remember this number")).toBeVisible({ timeout: 5000 });
  const sequence = await page.locator("[aria-label^='Number to remember:']").textContent();
  await expect(page.getByLabel("What was the number?")).toBeVisible({ timeout: 6000 });
  await page.getByLabel("What was the number?").fill(sequence ?? "");
  await page.getByRole("button", { name: /submit answer/i }).click();
  await expect(page.getByText("Perfect recall")).toBeVisible();
  await page.getByRole("button", { name: /next level/i }).click();
  await expect(page.getByText("Remember this number")).toBeVisible({ timeout: 5000 });
  await expect(page.getByLabel("What was the number?")).toBeVisible({ timeout: 7000 });
  await page.getByLabel("What was the number?").fill("999999999999");
  await page.getByRole("button", { name: /submit answer/i }).click();
  await expect(page.getByText("Run complete")).toBeVisible({ timeout: 2000 });
  await page.goto("/progress");
  await expect(page.getByText("Recent sessions")).toBeVisible();
});
