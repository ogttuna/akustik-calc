import { chromium, expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

type SmokeCase = {
  assemblyResearch?: {
    expectedTextPattern: RegExp;
    minSourceUrlCount: number;
    prompt: string;
  };
  explain?: {
    expectedTextPattern: RegExp;
    prompt: string;
  };
  id: string;
  metricResearch?: {
    expectedTextPattern?: RegExp;
    minSourceUrlCount: number;
    prompt: string;
  };
  patch?: {
    expectConsistencyGuard?: boolean;
    expectedResponsePattern?: RegExp;
    prompt: string;
    textPatterns: readonly RegExp[];
  };
  requiredMetricContextPatterns?: readonly RegExp[];
  sampleLabel: string;
  surface: "floor" | "wall";
};

type SmokeCaseResult = {
  assemblyResearchRetryUsed: boolean;
  assemblySourceUrlCount: number;
  consoleIssues: string[];
  consistencyGuardAdded: boolean;
  id: string;
  metricResearchRetryUsed: boolean;
  metricSourceUrlCount: number;
  mutationApplied: false;
  patchPreview: string | null;
};

const DEFAULT_BASE_URL = "https://akustikhesap.machinity.ai";
const DEFAULT_AUTH_USERNAME = "admin";
const DEFAULT_AUTH_PASSWORD = "admin";
const DEFAULT_CASE_IDS = ["floor-rw", "floor-lnw", "floor-deltalw", "wall-rw", "floor-assembly-alternatives"];
const DEFAULT_ACTION_TIMEOUT_MS = 30_000;
const DEFAULT_ASSISTANT_TIMEOUT_MS = 100_000;

const SMOKE_CASES: Record<string, SmokeCase> = {
  "floor-rw": {
    id: "floor-rw",
    explain: {
      expectedTextPattern: /lane|route|formula|seçildi|hesap/iu,
      prompt: "hangi lane seçildi, Rw nasıl hesaplandı?"
    },
    metricResearch: {
      minSourceUrlCount: 1,
      prompt: "sence Rw doğru mu, internette araştır ve kaynak göster"
    },
    patch: {
      expectConsistencyGuard: true,
      expectedResponsePattern: /ASSISTANT RESPONSE \| AI MODEL/iu,
      prompt: "Rw değerini 2 dB düşür",
      textPatterns: [/"metricId"\s*:\s*"output:Rw"/u, /"deltaDb"\s*:\s*-2/u]
    },
    sampleLabel: "Impact Floor",
    surface: "floor"
  },
  "floor-lnw": {
    id: "floor-lnw",
    explain: {
      expectedTextPattern: /impact|lane|route|formula|seçildi|hesap/iu,
      prompt: "Ln,w hangi impact lane ile hesaplandı?"
    },
    metricResearch: {
      expectedTextPattern: /Ln,w|impact|source|evidence|kaynak/iu,
      minSourceUrlCount: 1,
      prompt: "Ln,w metriği için web/source research yap; internet kaynaklarıyla fazla mı makul mü değerlendir ve URL göster"
    },
    patch: {
      expectedResponsePattern: /ASSISTANT RESPONSE \| (?:AI MODEL|RULE PARSER)/iu,
      prompt: "Ln,w değerini 2 dB düşür",
      textPatterns: [/"metricId"\s*:\s*"output:Ln,w"/u, /"deltaDb"\s*:\s*-2/u]
    },
    requiredMetricContextPatterns: [/output:Ln,w/u, /Ln,w\s+output:Ln,w\s+Report:\s+(?!Not ready)/u],
    sampleLabel: "Impact Floor",
    surface: "floor"
  },
  "floor-deltalw": {
    id: "floor-deltalw",
    explain: {
      expectedTextPattern: /DeltaLw|impact|lane|corridor|formula|hesap/iu,
      prompt: "DeltaLw hangi impact support corridor ile hesaplandı?"
    },
    metricResearch: {
      expectedTextPattern: /DeltaLw|impact|source|evidence|kaynak|range/iu,
      minSourceUrlCount: 1,
      prompt: "DeltaLw metriği için web/source research yap; bu iyileştirme değeri makul mü kaynak URL göster"
    },
    patch: {
      expectedResponsePattern: /ASSISTANT RESPONSE \| (?:AI MODEL|RULE PARSER)/iu,
      prompt: "DeltaLw değerini 2 dB artır",
      textPatterns: [/"metricId"\s*:\s*"output:DeltaLw"/u, /"deltaDb"\s*:\s*2/u]
    },
    requiredMetricContextPatterns: [/output:DeltaLw/u, /DeltaLw\s+output:DeltaLw\s+Report:\s+(?!Not ready)/u],
    sampleLabel: "Impact Floor",
    surface: "floor"
  },
  "wall-rw": {
    id: "wall-rw",
    explain: {
      expectedTextPattern: /lane|route|formula|seçildi|hesap/iu,
      prompt: "hangi lane seçildi, Rw nasıl hesaplandı?"
    },
    metricResearch: {
      minSourceUrlCount: 1,
      prompt: "bu duvar katman kombinasyonu için Rw doğru mu, internette araştır ve kaynak göster"
    },
    patch: {
      expectedResponsePattern: /ASSISTANT RESPONSE \| AI MODEL/iu,
      prompt: "Rw değerini 2 dB düşür",
      textPatterns: [/"metricId"\s*:\s*"output:Rw"/u, /"deltaDb"\s*:\s*-2/u]
    },
    sampleLabel: "Wall Study",
    surface: "wall"
  },
  "floor-assembly-alternatives": {
    id: "floor-assembly-alternatives",
    assemblyResearch: {
      expectedTextPattern: /Layer alternatives|Alternatives|Expected tradeoffs|Evidence|alternatif/iu,
      minSourceUrlCount: 1,
      prompt: "bu döşeme katman kombinasyonunda resilient layer yerine hangi alternatifleri önerirsin, internette kaynak göster"
    },
    sampleLabel: "Impact Floor",
    surface: "floor"
  },
  "wall-assembly-alternatives": {
    id: "wall-assembly-alternatives",
    assemblyResearch: {
      expectedTextPattern: /Layer alternatives|Alternatives|Expected tradeoffs|Evidence|alternatif/iu,
      minSourceUrlCount: 1,
      prompt: "bu duvar katman kombinasyonunda gypsum board yerine hangi alternatif layerları önerirsin, internette kaynak göster"
    },
    sampleLabel: "Wall Study",
    surface: "wall"
  }
};

function readEnvString(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readEnvInt(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseCaseIds(): string[] {
  const raw = process.env.AKUSTIK_ASSISTANT_SMOKE_CASES?.trim();
  if (!raw) {
    return DEFAULT_CASE_IDS;
  }

  const caseIds = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return caseIds.length > 0 ? caseIds : DEFAULT_CASE_IDS;
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

async function askReportAssistant(page: Page, message: string, timeoutMs: number): Promise<string> {
  const card = assistantCard(page);
  await expect(card).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await card.locator("textarea").first().fill(message);
  await card.getByRole("button", { exact: true, name: "Ask assistant" }).click();
  await waitForAssistantActionToSettle(page, timeoutMs);
  return page.locator("body").innerText();
}

function extractHttpUrls(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/[^\s)]+/gu), (match) => match[0]);
}

function compactTextExcerpt(text: string): string {
  return text
    .replace(/\s+/gu, " ")
    .slice(0, 900)
    .trim();
}

function compactRelevantExcerpt(text: string, markers: readonly string[]): string {
  const compact = text.replace(/\s+/gu, " ").trim();
  for (const marker of markers) {
    const index = compact.search(new RegExp(marker, "iu"));
    if (index >= 0) {
      return compact.slice(index, index + 1_400).trim();
    }
  }

  return compact.slice(-1_400).trim();
}

async function retryLatestResearchIfAvailable(page: Page, timeoutMs: number): Promise<string | null> {
  const retryButtons = assistantCard(page).getByRole("button", { name: /Retry (?:layer )?research/iu });
  for (let index = (await retryButtons.count()) - 1; index >= 0; index -= 1) {
    const retryButton = retryButtons.nth(index);
    if (!(await retryButton.isVisible().catch(() => false)) || !(await retryButton.isEnabled().catch(() => false))) {
      continue;
    }

    await retryButton.click();
    await waitForAssistantActionToSettle(page, timeoutMs);
    return page.locator("body").innerText();
  }

  return null;
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

function assertMetricContextUnchanged(input: {
  after: string;
  before: string;
  caseId: string;
  step: string;
}) {
  if (input.after !== input.before) {
    throw new Error(`${input.caseId}: metric context changed after no-mutation ${input.step}.`);
  }
}

async function runExplainStep(input: {
  caseId: string;
  page: Page;
  step: NonNullable<SmokeCase["explain"]>;
  timeoutMs: number;
}) {
  const explainBody = await askReportAssistant(input.page, input.step.prompt, input.timeoutMs);
  if (!/ASSISTANT \| CONTEXT-ONLY REVIEW/iu.test(explainBody)) {
    throw new Error(`${input.caseId}: explain did not render a context-only assistant answer.`);
  }
  if (!input.step.expectedTextPattern.test(explainBody)) {
    throw new Error(`${input.caseId}: explain answer missed the expected route/formula wording.`);
  }
}

async function runSourceResearchStep(input: {
  caseId: string;
  expectedTextPattern?: RegExp;
  minSourceUrlCount: number;
  page: Page;
  prompt: string;
  stepLabel: string;
  timeoutMs: number;
}): Promise<{ retryUsed: boolean; sourceUrlCount: number }> {
  let researchBody = await askReportAssistant(input.page, input.prompt, input.timeoutMs);
  let retryUsed = false;
  for (let retryAttempt = 0; retryAttempt < 2 && !/ASSISTANT(?: RESPONSE)? \| SOURCE RESEARCH/iu.test(researchBody); retryAttempt += 1) {
    const retryBody = await retryLatestResearchIfAvailable(input.page, input.timeoutMs);
    if (retryBody) {
      retryUsed = true;
      researchBody = retryBody;
    } else {
      break;
    }
  }
  if (!/ASSISTANT(?: RESPONSE)? \| SOURCE RESEARCH/iu.test(researchBody)) {
    throw new Error(
      `${input.caseId}: ${input.stepLabel} did not render a source-research assistant answer. Body excerpt: ${compactRelevantExcerpt(researchBody, ["ASSISTANT(?: RESPONSE)?", "REQUEST FAILED", "Retry research", "Patch guard"])}`
    );
  }
  const sourceUrls = extractHttpUrls(researchBody);
  if (sourceUrls.length < input.minSourceUrlCount) {
    throw new Error(`${input.caseId}: ${input.stepLabel} exposed ${sourceUrls.length} source URL(s).`);
  }
  if (input.expectedTextPattern && !input.expectedTextPattern.test(researchBody)) {
    throw new Error(`${input.caseId}: ${input.stepLabel} answer missed the expected answer structure.`);
  }
  if (/suggestedReportPatch/iu.test(researchBody)) {
    throw new Error(`${input.caseId}: ${input.stepLabel} exposed suggestedReportPatch text.`);
  }

  return {
    retryUsed,
    sourceUrlCount: sourceUrls.length
  };
}

async function runPatchStep(input: {
  caseId: string;
  metricContextBefore: string;
  metricContextCard: Locator;
  page: Page;
  step: NonNullable<SmokeCase["patch"]>;
  timeoutMs: number;
}): Promise<{ consistencyGuardAdded: boolean; patchPreview: string }> {
  const patchBody = await askReportAssistant(input.page, input.step.prompt, input.timeoutMs);
  const expectedResponsePattern = input.step.expectedResponsePattern ?? /ASSISTANT RESPONSE \| (?:AI MODEL|RULE PARSER)/iu;
  if (!expectedResponsePattern.test(patchBody)) {
    throw new Error(
      `${input.caseId}: patch did not render the expected assistant patch response. Body excerpt: ${compactRelevantExcerpt(patchBody, ["ASSISTANT RESPONSE", "PATCH GUARD", "Patch preview"])}`
    );
  }
  if (!/PATCH GUARD\s+Valid/iu.test(patchBody)) {
    throw new Error(
      `${input.caseId}: patch guard did not validate the preview. Body excerpt: ${compactRelevantExcerpt(patchBody, ["PATCH GUARD", "Patch preview", "Rejected"])}`
    );
  }
  await expect(input.page.getByRole("button", { exact: true, name: "Apply validated patch" })).toBeEnabled({
    timeout: DEFAULT_ACTION_TIMEOUT_MS
  });

  const patchDraftLocator = input.page.locator("textarea").nth(1);
  const patchDraft = await patchDraftLocator.inputValue();
  if (!/adjust_metric_db/u.test(patchDraft) || !input.step.textPatterns.every((pattern) => pattern.test(patchDraft))) {
    throw new Error(`${input.caseId}: patch preview did not contain the expected operation.`);
  }

  let consistencyGuardAdded = false;
  if (input.step.expectConsistencyGuard) {
    await expect(input.page.getByText("Old value text still appears outside metric rows.", { exact: true })).toBeVisible({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });
    const addConsistencyButton = input.page.getByRole("button", {
      exact: true,
      name: "Add guarded text replacements"
    });
    await expect(addConsistencyButton).toBeEnabled({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
    await addConsistencyButton.click();
    await expect(patchDraftLocator).toHaveValue(/replace_report_text_value/u, {
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });
    await expect(input.page.getByText(/Replace stale text at/iu).first()).toBeVisible({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });
    await expect(input.page.getByRole("button", { exact: true, name: "Apply validated patch" })).toBeEnabled({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });
    consistencyGuardAdded = true;
  }

  assertMetricContextUnchanged({
    after: await input.metricContextCard.innerText(),
    before: input.metricContextBefore,
    caseId: input.caseId,
    step: "patch preview"
  });

  return {
    consistencyGuardAdded,
    patchPreview: consistencyGuardAdded ? "adjust_metric_db+replace_report_text_value" : "adjust_metric_db"
  };
}

async function runSmokeCase(context: BrowserContext, smokeCase: SmokeCase): Promise<SmokeCaseResult> {
  const page = await context.newPage();
  const baseUrl = readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL);
  const assistantTimeoutMs = readEnvInt("AKUSTIK_ASSISTANT_SMOKE_TIMEOUT_MS", DEFAULT_ASSISTANT_TIMEOUT_MS);
  const consoleIssues: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleIssues.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    consoleIssues.push(`pageerror: ${error.message}`);
  });

  await signIn(page, baseUrl);
  await page.goto(`${baseUrl}/workbench`, { waitUntil: "domcontentloaded" });
  await expect(visibleSelect(page, "Study type")).toBeVisible({ timeout: DEFAULT_ACTION_TIMEOUT_MS });
  await selectVisibleOption(page, ["Study type"], smokeCase.surface);
  await selectVisibleOption(page, ["Load sample rows", "Example stack"], { label: smokeCase.sampleLabel });
  await page.waitForTimeout(1_000);

  const configurePage = await openProposalConfigurePage(context, page);
  await expect(configurePage.getByText("Ask report assistant", { exact: true })).toBeVisible({
    timeout: DEFAULT_ACTION_TIMEOUT_MS
  });
  await expect(configurePage.getByText("Assistant metric context", { exact: true })).toBeVisible({
    timeout: DEFAULT_ACTION_TIMEOUT_MS
  });

  const metricContextCard = configurePage
    .getByText("Assistant metric context", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const metricContextBefore = await metricContextCard.innerText();
  if (
    smokeCase.requiredMetricContextPatterns &&
    !smokeCase.requiredMetricContextPatterns.every((pattern) => pattern.test(metricContextBefore))
  ) {
    throw new Error(
      `${smokeCase.id}: assistant metric context missed the required metric. Body excerpt: ${compactTextExcerpt(metricContextBefore)}`
    );
  }
  let assemblyResearchRetryUsed = false;
  let assemblySourceUrlCount = 0;
  let consistencyGuardAdded = false;
  let metricResearchRetryUsed = false;
  let metricSourceUrlCount = 0;
  let patchPreview: string | null = null;

  if (smokeCase.explain) {
    await runExplainStep({
      caseId: smokeCase.id,
      page: configurePage,
      step: smokeCase.explain,
      timeoutMs: assistantTimeoutMs
    });
  }

  if (smokeCase.metricResearch) {
    const result = await runSourceResearchStep({
      caseId: smokeCase.id,
      expectedTextPattern: smokeCase.metricResearch.expectedTextPattern,
      minSourceUrlCount: smokeCase.metricResearch.minSourceUrlCount,
      page: configurePage,
      prompt: smokeCase.metricResearch.prompt,
      stepLabel: "metric research",
      timeoutMs: assistantTimeoutMs
    });
    metricResearchRetryUsed = result.retryUsed;
    metricSourceUrlCount = result.sourceUrlCount;

    assertMetricContextUnchanged({
      after: await metricContextCard.innerText(),
      before: metricContextBefore,
      caseId: smokeCase.id,
      step: "metric research"
    });
  }

  if (smokeCase.assemblyResearch) {
    const result = await runSourceResearchStep({
      caseId: smokeCase.id,
      expectedTextPattern: smokeCase.assemblyResearch.expectedTextPattern,
      minSourceUrlCount: smokeCase.assemblyResearch.minSourceUrlCount,
      page: configurePage,
      prompt: smokeCase.assemblyResearch.prompt,
      stepLabel: "assembly research",
      timeoutMs: assistantTimeoutMs
    });
    assemblyResearchRetryUsed = result.retryUsed;
    assemblySourceUrlCount = result.sourceUrlCount;

    await expect(assistantCard(configurePage).getByRole("button", { name: "Retry layer research" })).toBeEnabled({
      timeout: DEFAULT_ACTION_TIMEOUT_MS
    });
    assertMetricContextUnchanged({
      after: await metricContextCard.innerText(),
      before: metricContextBefore,
      caseId: smokeCase.id,
      step: "assembly research"
    });
  }

  if (smokeCase.patch) {
    const result = await runPatchStep({
      caseId: smokeCase.id,
      metricContextBefore,
      metricContextCard,
      page: configurePage,
      step: smokeCase.patch,
      timeoutMs: assistantTimeoutMs
    });
    consistencyGuardAdded = result.consistencyGuardAdded;
    patchPreview = result.patchPreview;
  }

  await configurePage.close();

  return {
    assemblyResearchRetryUsed,
    assemblySourceUrlCount,
    consoleIssues,
    consistencyGuardAdded,
    id: smokeCase.id,
    metricResearchRetryUsed,
    metricSourceUrlCount,
    mutationApplied: false,
    patchPreview
  };
}

async function main() {
  const caseIds = parseCaseIds();
  const unknownCaseIds = caseIds.filter((caseId) => !SMOKE_CASES[caseId]);
  if (unknownCaseIds.length > 0) {
    throw new Error(`Unknown report assistant smoke case(s): ${unknownCaseIds.join(", ")}.`);
  }

  const browser = await chromium.launch({
    headless: process.env.AKUSTIK_ASSISTANT_SMOKE_HEADFUL !== "1"
  });

  try {
    const context = await browser.newContext({
      baseURL: readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL),
      viewport: {
        height: 1_100,
        width: 1_440
      }
    });
    const results: SmokeCaseResult[] = [];

    for (const caseId of caseIds) {
      results.push(await runSmokeCase(context, SMOKE_CASES[caseId]));
    }

    await context.close();
    console.log(
      JSON.stringify(
        {
          baseUrl: readEnvString("AKUSTIK_SMOKE_BASE_URL", DEFAULT_BASE_URL),
          ok: true,
          results
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[report-assistant-browser-smoke] ${message}`);
  process.exit(1);
});
