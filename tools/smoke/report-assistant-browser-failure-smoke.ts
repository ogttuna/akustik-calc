import { chromium, expect, type BrowserContext, type Page, type Route } from "@playwright/test";

const DEFAULT_BASE_URL = "https://akustikhesap.machinity.ai";
const DEFAULT_AUTH_USERNAME = "admin";
const DEFAULT_AUTH_PASSWORD = "admin";
const DEFAULT_ACTION_TIMEOUT_MS = 30_000;
const DEFAULT_ASSISTANT_TIMEOUT_MS = 130_000;
const MOCK_TIMEOUT_ROUTE_DELAY_MS = 95_000;

type FailureSmokeResult = {
  assemblyTimeoutCalls: number;
  crossDocumentConversationDiscarded: boolean;
  invalidJsonFailureCalls: number;
  metricContextPreserved: boolean;
  mutationApplied: false;
  patchNetworkRecoveryCalls: number;
  providerFailureRecoveryCalls: number;
  sameDocumentConversationRestored: boolean;
};

function readEnvString(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readEnvInt(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function visibleSelect(page: Page, label: string) {
  const escapedLabel = label.replace(/\\/gu, "\\\\").replace(/"/gu, '\\"');
  return page.locator(`select[aria-label="${escapedLabel}"]:visible`).first();
}

async function selectVisibleOption(page: Page, labels: readonly string[], option: string | { label: string }) {
  for (const label of labels) {
    const select = visibleSelect(page, label);
    if (await select.isVisible().catch(() => false)) {
      await select.selectOption(option);
      return;
    }
  }

  throw new Error(`Could not find a visible select for ${labels.join(" / ")}.`);
}

function assistantCard(page: Page) {
  return page.getByText("Ask report assistant", { exact: true }).locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
}

async function waitForAssistantActionToSettle(page: Page, timeoutMs: number) {
  const askButton = assistantCard(page).locator("button").first();
  const becameBusy = await expect(askButton).toBeDisabled({ timeout: 2_500 }).then(
    () => true,
    () => false
  );

  if (becameBusy) {
    await expect(askButton).toBeEnabled({ timeout: timeoutMs });
  } else {
    await page.waitForTimeout(500);
  }

  await page.waitForTimeout(500);
}

async function waitForConfigurePage(page: Page, timeoutMs: number): Promise<boolean> {
  if (/\/workbench\/proposal\/configure/u.test(page.url())) {
    return true;
  }

  return page
    .waitForURL(/\/workbench\/proposal\/configure/u, { timeout: timeoutMs })
    .then(() => true)
    .catch(() => false);
}

async function openProposalConfigurePage(context: BrowserContext, page: Page): Promise<Page> {
  const proposalButton = page.getByRole("button", { exact: true, name: "Proposal" }).first();
  await expect(proposalButton).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await proposalButton.click();

  if (await waitForConfigurePage(page, 8_000)) {
    return page;
  }

  if (await assistantCard(page).isVisible().catch(() => false)) {
    return page;
  }

  const editReportButton = page.getByRole("button", { exact: true, name: "Edit report" }).first();
  await expect(editReportButton).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });

  const popupPromise = context.waitForEvent("page", { timeout: 8_000 }).catch(() => null);
  await editReportButton.click();
  const popup = await popupPromise;

  if (popup) {
    await popup.waitForLoadState("domcontentloaded");
    if ((await waitForConfigurePage(popup, DEFAULT_ACTION_TIMEOUT_MS)) || (await assistantCard(popup).isVisible())) {
      return popup;
    }
  }

  if (await waitForConfigurePage(page, DEFAULT_ACTION_TIMEOUT_MS)) {
    return page;
  }

  throw new Error("Could not open the proposal configure page.");
}

async function signIn(page: Page, baseUrl: string) {
  const username = readEnvString("DYNECHO_AUTH_USERNAME", DEFAULT_AUTH_USERNAME);
  const password = readEnvString("DYNECHO_AUTH_PASSWORD", DEFAULT_AUTH_PASSWORD);
  const response = await page.request.post(`${baseUrl}/api/auth/login`, {
    data: {
      nextPath: "/workbench",
      password,
      username
    }
  });

  if (!response.ok()) {
    throw new Error(`Authentication failed with HTTP ${response.status()}.`);
  }
}

async function loadProposalConfigurePage(input: {
  baseUrl: string;
  context: BrowserContext;
  page: Page;
  sampleLabel: string;
  surface: "floor" | "wall";
}): Promise<Page> {
  await input.page.goto(`${input.baseUrl}/workbench`, { waitUntil: "domcontentloaded" });
  await expect(visibleSelect(input.page, "Study type")).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await selectVisibleOption(input.page, ["Study type"], input.surface);
  await selectVisibleOption(input.page, ["Load sample rows", "Example stack"], { label: input.sampleLabel });
  await input.page.waitForTimeout(1_000);

  const configurePage = await openProposalConfigurePage(input.context, input.page);
  await expect(assistantCard(configurePage)).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await expect(configurePage.getByText("Assistant metric context", { exact: true })).toBeVisible({
    timeout: DEFAULT_ACTION_TIMEOUT_MS
  });
  return configurePage;
}

async function askReportAssistant(page: Page, message: string, timeoutMs: number): Promise<string> {
  const card = assistantCard(page);
  await expect(card).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await card.locator("textarea").first().fill(message);
  await card.getByRole("button", { exact: true, name: "Ask assistant" }).click();
  await waitForAssistantActionToSettle(page, timeoutMs);
  return page.locator("body").innerText();
}

async function retryLatestResearch(page: Page, timeoutMs: number): Promise<string> {
  const retryButton = assistantCard(page).getByRole("button", { exact: true, name: "Retry research" });
  await expect(retryButton).toBeEnabled({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await retryButton.click();
  await waitForAssistantActionToSettle(page, timeoutMs);
  return page.locator("body").innerText();
}

function getMetricContextCard(page: Page) {
  return page
    .getByText("Assistant metric context", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
}

function compactTextExcerpt(text: string): string {
  return text
    .replace(/\s+/gu, " ")
    .slice(-1_400)
    .trim();
}

function parseRouteJson(route: Route): Record<string, unknown> {
  const raw = route.request().postData();
  if (!raw) {
    return {};
  }

  try {
    const value = JSON.parse(raw) as unknown;
    return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function getNestedRecord(value: unknown, key: string): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const nested = (value as Record<string, unknown>)[key];
  return nested && typeof nested === "object" ? (nested as Record<string, unknown>) : {};
}

function getContextMetricId(body: Record<string, unknown>, fallback = "output:Rw"): string {
  const context = getNestedRecord(body, "context");
  const metrics = Array.isArray(context.metrics) ? context.metrics : [];
  const firstMetric = metrics[0];
  if (!firstMetric || typeof firstMetric !== "object") {
    return fallback;
  }

  const id = (firstMetric as { id?: unknown }).id;
  return typeof id === "string" && id.trim().length > 0 ? id : fallback;
}

function getContextDocumentSignature(body: Record<string, unknown>): string {
  const context = getNestedRecord(body, "context");
  const signature = context.documentSignature;
  if (typeof signature !== "string" || signature.trim().length === 0) {
    throw new Error("Mock patch route could not read context.documentSignature.");
  }

  return signature;
}

function getReviewInstruction(body: Record<string, unknown>): string {
  const review = getNestedRecord(body, "review");
  const instruction = review.userInstruction;
  return typeof instruction === "string" ? instruction : "";
}

async function installMockAssistantRoutes(context: BrowserContext) {
  let assemblyCalls = 0;
  let invalidJsonCalls = 0;
  let patchCalls = 0;
  let plausibilityCalls = 0;

  await context.route("**/api/report-assistant/assembly-alternatives", async (route) => {
    assemblyCalls += 1;
    await delayRoutePastClientTimeout(route);
  });

  await context.route("**/api/report-assistant/plausibility", async (route) => {
    plausibilityCalls += 1;
    const body = parseRouteJson(route);
    const reviewInstruction = getReviewInstruction(body);

    if (/invalid-json-smoke/iu.test(reviewInstruction)) {
      invalidJsonCalls += 1;
      await route.fulfill({
        body: "{not valid json",
        contentType: "application/json",
        status: 200
      });
      return;
    }

    if (plausibilityCalls <= 2) {
      await route.fulfill({
        body: JSON.stringify({
          errors: ["Mock provider failure for browser smoke."],
          warnings: ["Mocked provider failure path; no report value changed."]
        }),
        contentType: "application/json",
        status: 503
      });
      return;
    }

    const review = getNestedRecord(body, "review");
    const metricId = typeof review.metricId === "string" ? review.metricId : getContextMetricId(body);

    await route.fulfill({
      body: JSON.stringify({
        review: {
          answerText: "Mock retry recovery answer. No report value was changed.",
          comparability: "insufficient",
          confidence: "low",
          engineDisplayValue: "61 dB",
          insufficientSourcesReason: "Mocked failure smoke does not call a live provider.",
          metric: "Rw",
          metricId,
          missingEvidence: ["No live provider call was made."],
          rationale: ["Mocked retry succeeded after a provider failure."],
          recommendedActionText: "No report edit from this mocked recovery.",
          severity: "medium",
          sourceQuality: "none",
          sources: [],
          valueReviewed: "61 dB",
          verdict: "insufficient_context"
        },
        source: "context",
        warnings: ["Mocked recovery path used; no live provider called."]
      }),
      contentType: "application/json",
      status: 200
    });
  });

  await context.route("**/api/report-assistant/patch", async (route) => {
    patchCalls += 1;

    if (patchCalls === 1) {
      await route.abort("failed");
      return;
    }

    const body = parseRouteJson(route);
    await route.fulfill({
      body: JSON.stringify({
        patch: {
          documentSignature: getContextDocumentSignature(body),
          operations: [
            {
              deltaDb: -1,
              metricId: getContextMetricId(body),
              reason: "Mocked network recovery patch preview.",
              type: "adjust_metric_db"
            }
          ],
          summary: "Mocked Rw decrease after interrupted network request."
        },
        source: "model",
        warnings: ["Mocked patch route used; no live model called."]
      }),
      contentType: "application/json",
      status: 200
    });
  });

  return {
    getAssemblyCalls: () => assemblyCalls,
    getInvalidJsonCalls: () => invalidJsonCalls,
    getPatchCalls: () => patchCalls,
    getPlausibilityCalls: () => plausibilityCalls
  };
}

async function delayRoutePastClientTimeout(route: Route) {
  await new Promise((resolve) => {
    setTimeout(resolve, MOCK_TIMEOUT_ROUTE_DELAY_MS);
  });
  await route.abort("timedout").catch(() => undefined);
}

async function runFailureSmoke(): Promise<FailureSmokeResult> {
  const baseUrl = readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL);
  const assistantTimeoutMs = readEnvInt("AKUSTIK_ASSISTANT_FAILURE_SMOKE_TIMEOUT_MS", DEFAULT_ASSISTANT_TIMEOUT_MS);
  const browser = await chromium.launch({
    headless: process.env.AKUSTIK_ASSISTANT_SMOKE_HEADFUL !== "1"
  });

  try {
    const context = await browser.newContext({
      baseURL: baseUrl,
      viewport: {
        height: 1_100,
        width: 1_440
      }
    });
    const routeCounters = await installMockAssistantRoutes(context);
    const page = await context.newPage();

    await signIn(page, baseUrl);
    let configurePage = await loadProposalConfigurePage({
      baseUrl,
      context,
      page,
      sampleLabel: "Impact Floor",
      surface: "floor"
    });
    const floorMetricContextBefore = await getMetricContextCard(configurePage).innerText();

    const failureBody = await askReportAssistant(configurePage, "sence Rw doğru mu, internette araştır", assistantTimeoutMs);
    if (!/Mock provider failure for browser smoke/iu.test(failureBody) || !/attempts 2/iu.test(failureBody)) {
      throw new Error("Provider failure did not surface the expected browser retry metadata.");
    }

    const recoveryBody = await retryLatestResearch(configurePage, assistantTimeoutMs);
    if (!/Mock retry recovery answer/iu.test(recoveryBody) || /suggestedReportPatch/iu.test(recoveryBody)) {
      throw new Error("Retry recovery did not render the expected non-mutating answer.");
    }

    const floorMetricContextAfter = await getMetricContextCard(configurePage).innerText();
    if (floorMetricContextAfter !== floorMetricContextBefore) {
      throw new Error("Metric context changed after mocked provider failure/recovery.");
    }

    await configurePage.reload({ waitUntil: "domcontentloaded" });
    await expect(assistantCard(configurePage).getByText(/Mock retry recovery answer/iu)).toBeVisible({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });

    const sameDocumentConversationRestored = true;
    const workbenchPage = configurePage === page ? configurePage : page;
    if (configurePage !== page) {
      await configurePage.close();
    }

    configurePage = await loadProposalConfigurePage({
      baseUrl,
      context,
      page: workbenchPage,
      sampleLabel: "Wall Study",
      surface: "wall"
    });
    await expect(assistantCard(configurePage).getByText(/Mock retry recovery answer/iu)).not.toBeVisible({
      timeout: 2_000
    });

    const wallMetricContextBefore = await getMetricContextCard(configurePage).innerText();
    const patchBody = await askReportAssistant(configurePage, "Rw değerini 1 dB düşür", assistantTimeoutMs);
    if (!/ASSISTANT RESPONSE \| AI MODEL/iu.test(patchBody) || !/PATCH GUARD\s+Valid/iu.test(patchBody) || !/attempts 2/iu.test(patchBody)) {
      throw new Error("Interrupted patch request did not recover into a valid guarded patch preview.");
    }

    const patchDraft = await configurePage.locator("textarea").nth(1).inputValue();
    if (!/"deltaDb"\s*:\s*-1/u.test(patchDraft) || !/adjust_metric_db/u.test(patchDraft)) {
      throw new Error("Recovered patch preview did not contain the expected mocked operation.");
    }

    if ((await getMetricContextCard(configurePage).innerText()) !== wallMetricContextBefore) {
      throw new Error("Metric context changed after mocked patch preview.");
    }

    const timeoutMetricContextBefore = await getMetricContextCard(configurePage).innerText();
    const timeoutBody = await askReportAssistant(
      configurePage,
      "bu duvar katman kombinasyonunda gypsum board yerine hangi alternatif layerları önerirsin, internette kaynak göster",
      assistantTimeoutMs
    );
    if (!/Assistant layer research failed/iu.test(timeoutBody) || !/Report assistant request timed out before the provider returned/iu.test(timeoutBody)) {
      throw new Error(`Slow provider timeout did not surface the expected browser timeout metadata. Body excerpt: ${compactTextExcerpt(timeoutBody)}`);
    }
    await expect(assistantCard(configurePage).getByRole("button", { exact: true, name: "Retry layer research" })).toBeEnabled({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });

    if ((await getMetricContextCard(configurePage).innerText()) !== timeoutMetricContextBefore) {
      throw new Error("Metric context changed after mocked slow-provider timeout.");
    }

    const invalidJsonMetricContextBefore = await getMetricContextCard(configurePage).innerText();
    const invalidJsonBody = await askReportAssistant(
      configurePage,
      "invalid-json-smoke Rw için internet kaynaklarını araştır",
      assistantTimeoutMs
    );
    if (!/Report assistant endpoint returned invalid JSON/iu.test(invalidJsonBody) || !/attempts 2/iu.test(invalidJsonBody)) {
      throw new Error(`Invalid JSON provider response did not surface the expected parse failure metadata. Body excerpt: ${compactTextExcerpt(invalidJsonBody)}`);
    }
    if ((await getMetricContextCard(configurePage).innerText()) !== invalidJsonMetricContextBefore) {
      throw new Error("Metric context changed after mocked invalid JSON provider response.");
    }

    await context.close();

    return {
      assemblyTimeoutCalls: routeCounters.getAssemblyCalls(),
      crossDocumentConversationDiscarded: true,
      invalidJsonFailureCalls: routeCounters.getInvalidJsonCalls(),
      metricContextPreserved: true,
      mutationApplied: false,
      patchNetworkRecoveryCalls: routeCounters.getPatchCalls(),
      providerFailureRecoveryCalls: routeCounters.getPlausibilityCalls(),
      sameDocumentConversationRestored
    };
  } finally {
    await browser.close();
  }
}

void runFailureSmoke()
  .then((result) => {
    console.log(
      JSON.stringify(
        {
          baseUrl: readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL),
          ok: true,
          result
        },
        null,
        2
      )
    );
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[report-assistant-browser-failure-smoke] ${message}`);
    process.exit(1);
  });
