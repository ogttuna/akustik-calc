import { expect, test, type Page } from "@playwright/test";

const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "consultant";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "change-me";

async function signIn(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    data: {
      nextPath: "/workbench",
      password: TEST_PASSWORD,
      username: TEST_USERNAME
    }
  });

  expect(response.ok()).toBeTruthy();
  await page.goto("/workbench");
}

test("landing page exposes product stance and workbench entry", async ({ page }) => {
  test.slow();
  await page.goto("/");

  await expect(page.getByText("A premium operator shell for acoustics, with the engine kept clean underneath.")).toBeVisible();
  await expect(page.getByText("No upstream coupling")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open workbench/i })).toHaveAttribute("href", "/workbench");

  await page.goto("/workbench");
  await expect(page).toHaveURL(/\/login\?next=%2Fworkbench$/);
  await expect(page.getByRole("heading", { name: "Sign in to the workbench" })).toBeVisible();
  await signIn(page);

  await expect(page).toHaveURL(/\/workbench$/);
  await expect(page.getByText("Protected workspace", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();
});
