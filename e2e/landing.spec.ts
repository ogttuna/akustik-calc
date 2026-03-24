import { expect, test, type Page } from "@playwright/test";

const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "consultant";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "change-me";

async function signIn(page: Page) {
  await page.getByLabel("Username").fill(TEST_USERNAME);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await Promise.all([
    page.waitForURL("**/workbench"),
    page.getByRole("button", { name: "Sign in", exact: true }).click()
  ]);
}

test("landing page exposes product stance and workbench entry", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("A premium operator shell for acoustics, with the engine kept clean underneath.")).toBeVisible();
  await expect(page.getByText("No upstream coupling")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open workbench/i })).toHaveAttribute("href", "/workbench");

  await page.goto("/workbench");
  await expect(page).toHaveURL(/\/login\?next=%2Fworkbench$/);
  await expect(page.getByRole("heading", { name: "Sign in to the workbench" })).toBeVisible();
  await signIn(page);

  await expect(page.getByText("Acoustic workbench", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Wall calculator" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open advanced view/i })).toHaveAttribute("href", "/workbench?view=advanced");
});
