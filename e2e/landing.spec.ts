import { expect, test } from "@playwright/test";

test("landing page exposes product stance and workbench entry", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("A premium operator shell for acoustics, with the engine kept clean underneath.")).toBeVisible();
  await expect(page.getByText("No upstream coupling")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open workbench/i })).toHaveAttribute("href", "/workbench");

  await page.goto("/workbench");
  await expect(page.getByText("A premium acoustic operator deck for composition, comparison, and controlled parity import.")).toBeVisible();
});
