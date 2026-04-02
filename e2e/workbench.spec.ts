import { expect, test, type Locator, type Page } from "@playwright/test";

type GuidedContextKey = "building_prediction" | "element_lab" | "field_between_rooms";
const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "consultant";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "change-me";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function signIn(page: Page, nextPath = "/workbench") {
  const response = await page.request.post("/api/auth/login", {
    data: {
      nextPath,
      password: TEST_PASSWORD,
      username: TEST_USERNAME
    }
  });

  expect(response.ok()).toBeTruthy();
}

async function selectGuidedSurface(page: Page, surface: "floor" | "wall") {
  await page.getByLabel("Study type").selectOption(surface);
}

async function selectGuidedProjectContext(page: Page, context: GuidedContextKey) {
  await page.getByLabel("Project context").selectOption(context);
}

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.addInitScript({
    content: "window.localStorage.clear(); window.sessionStorage.clear();"
  });
  await signIn(page);
});

async function gotoSimpleWorkbench(page: Page) {
  await page.goto("/workbench");
}

async function gotoAdvancedWorkbench(page: Page) {
  await page.goto("/workbench?view=advanced");
}

async function openFloorGuidedFlow(page: Page) {
  await gotoSimpleWorkbench(page);
  await selectGuidedSurface(page, "floor");
}

async function openWallGuidedFlow(page: Page) {
  await gotoSimpleWorkbench(page);
  await selectGuidedSurface(page, "wall");
}

async function loadGuidedSample(page: Page, label: string) {
  if (!(await page.getByLabel("Example stack").isVisible())) {
    await page.getByText("Tools", { exact: true }).click();
  }
  await page.getByLabel("Example stack").selectOption({ label });
  await page.waitForTimeout(100);
}

async function openGuidedWorkspacePanel(page: Page, label: "Assembly" | "Details" | "Results" | "Setup") {
  const button = page.getByRole("button", { name: label, exact: true }).first();
  if (!(await button.isVisible())) {
    return;
  }
  if ((await button.getAttribute("aria-pressed")) !== "true") {
    await button.click();
  }
}

async function openGuidedAssemblyTool(page: Page, tool: "composer" | "library" | "preview") {
  if (tool === "preview" && (await visibleGuidedSectionPreview(page).isVisible())) {
    return;
  }

  if (tool === "composer" && (await page.getByLabel("New layer material").isVisible())) {
    return;
  }

  const labels =
    tool === "composer"
      ? { hide: "Hide add layer", open: ["Add layer form", "Add layer"] }
      : tool === "library"
        ? { hide: "Hide library", open: [/^Custom materials/] }
        : { hide: "Hide preview", open: ["Section preview"] };

  const hideButton = page.getByRole("button", { name: labels.hide, exact: true }).first();
  if (await hideButton.isVisible()) {
    return;
  }

  for (const label of labels.open) {
    const button =
      typeof label === "string"
        ? page.getByRole("button", { name: label, exact: true }).first()
        : page.getByRole("button", { name: label }).first();
    if (await button.isVisible()) {
      await button.click();
      return;
    }
  }

  throw new Error(`Could not open guided ${tool} tool; none of these buttons were visible: ${labels.open.join(", ")}`);
}

async function openGuidedReviewTab(page: Page, label: "Proposal" | "Method detail" | "Diagnostics") {
  const viewport = page.viewportSize();
  if (viewport && viewport.width >= 1280) {
    await page.setViewportSize({ height: viewport.height, width: 1279 });
  }

  await openGuidedWorkspacePanel(page, "Details");
  const tab = page.getByRole("tab", { name: label, exact: true }).first();
  await expect(tab).toBeVisible();
  if ((await tab.getAttribute("aria-selected")) !== "true") {
    await tab.click();
  }
}

async function readPrimaryGuidedMetric(page: Page, label: "Primary floor read" | "Primary wall read") {
  await openGuidedWorkspacePanel(page, "Results");
  const card = page.locator("article").filter({
    has: page.getByText(label, { exact: true })
  }).first();

  return (await card.getByText(/^-?\d+(\.\d+)? dB$/).first().textContent())?.trim();
}

async function ensureGuidedToolsOpen(page: Page, actionName: string) {
  await openGuidedWorkspacePanel(page, "Setup");
  const actionButton = page.getByRole("button", { name: actionName });
  if (await actionButton.isVisible()) {
    return;
  }

  await page.locator("summary").filter({ has: page.getByText("Tools", { exact: true }) }).first().click();
}

async function loadAdvancedPreset(page: Page, label: string) {
  await page.getByRole("button", { exact: true, name: `Load preset ${label}` }).click();
  await page.waitForTimeout(100);
}

type WorkbenchEstimateResponse = {
  baseRow: {
    floorRole?: string;
    materialId: string;
    thicknessMm: string;
  } | null;
  json: {
    ok?: boolean;
    result?: {
      impact?: {
        basis?: string;
        LPrimeNT50?: number;
        LPrimeNTw?: number;
        LPrimeNW?: number;
        LnW?: number;
      };
      floorSystemEstimate?: {
        fitPercent?: number;
        kind?: string;
      };
      floorSystemMatch?: {
        system?: {
          id?: string;
        };
      };
      floorSystemRatings?: {
        Rw?: number;
      };
      ratings?: {
        iso717?: {
          Rw?: number;
        };
      };
      warnings?: string[];
    };
  };
  rowCount: number;
  status: number;
};

async function estimateCurrentWorkbenchState(page: Page): Promise<WorkbenchEstimateResponse> {
  return page.evaluate<WorkbenchEstimateResponse>(`(async () => {
    const rawStore = window.localStorage.getItem("dynecho-workbench-store");
    if (!rawStore) {
      throw new Error("Workbench state is missing from localStorage.");
    }

    const parsed = JSON.parse(rawStore);
    const state = parsed.state;
    const layers = state.rows.map((row) => ({
      densityKgM3:
        typeof row.densityKgM3 === "string" && row.densityKgM3.trim().length > 0 ? Number(row.densityKgM3) : undefined,
      dynamicStiffnessMNPerM3:
        typeof row.dynamicStiffnessMNm3 === "string" && row.dynamicStiffnessMNm3.trim().length > 0
          ? Number(row.dynamicStiffnessMNm3)
          : undefined,
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: Number(row.thicknessMm)
    }));
    const payload = {
      calculator: state.calculatorId,
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      layers,
      targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "CI", "Ln,w+CI"]
    };
    const response = await window.fetch("/api/estimate", {
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    const json = await response.json();

    return {
      baseRow: state.rows.find((row) => row.floorRole === "base_structure") ?? null,
      json,
      rowCount: state.rows.length,
      status: response.status
    };
  })()`);
}

function visibleGuidedRouteSummary(page: Page) {
  return page
    .locator("section:visible")
    .filter({
      has: page.getByText("Route summary", { exact: true })
    })
    .first();
}

function visibleGuidedResultsSection(page: Page) {
  return page
    .locator("section:visible")
    .filter({
      has: page.getByText(/Guided (floor|wall) answer/i)
    })
    .first();
}

function visibleGuidedMetricCard(page: Page, label: string) {
  return page
    .locator("article:visible")
    .filter({
      has: page.locator("div").filter({ hasText: new RegExp(`^${escapeRegex(label)}$`) })
    })
    .first();
}

function visibleGuidedComposer(page: Page) {
  return page
    .locator("div:visible")
    .filter({ has: page.getByText("Add the next layer here", { exact: true }) })
    .first();
}

function visibleGuidedSectionPreview(page: Page) {
  return page
    .locator("section:visible")
    .filter({
      has: page.getByText("Section preview", { exact: true })
    })
    .first();
}

function visibleTestId(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"]:visible`).first();
}

async function ensureGuidedRowExpanded(page: Page, index: number) {
  const row = visibleTestId(page, `editor-row-${index}`);
  if ((await row.getByLabel("Material").count()) > 0) {
    return row;
  }

  const toggle = row.getByRole("button", { name: "Edit row", exact: true });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click({ force: true });
  if ((await row.getByLabel("Material").count()) === 0) {
    await toggle.click({ force: true });
  }
  await expect(row.getByLabel("Material")).toBeVisible();
  return row;
}

async function appendGuidedLayer(
  page: Page,
  options: {
    materialName?: string;
    query?: string;
    thickness?: string;
    density?: string;
    dynamicStiffness?: string;
    floorRole?: string;
  } = {}
) {
  await openGuidedWorkspacePanel(page, "Assembly");
  await openGuidedAssemblyTool(page, "composer");

  const composer = visibleGuidedComposer(page);

  await expect(composer).toBeVisible();

  if (options.materialName) {
    await selectMaterialFromPicker(composer, "New layer material", options.materialName, options.query ?? options.materialName);
  }

  if (typeof options.thickness === "string") {
    await composer.getByLabel("New layer thickness").fill(options.thickness);
  }

  if (typeof options.density === "string") {
    await composer.getByLabel("New layer density").fill(options.density);
  }

  if (typeof options.dynamicStiffness === "string") {
    await composer.getByLabel("New layer dynamic stiffness").fill(options.dynamicStiffness);
  }

  if (typeof options.floorRole === "string") {
    await composer.getByLabel("New layer role").selectOption(options.floorRole);
  }

  await composer.getByRole("button", { name: "Add layer", exact: true }).click();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function selectMaterialFromPicker(scope: Locator | Page, fieldLabel: string, materialName: string, query = materialName) {
  await scope.getByLabel(fieldLabel).click();
  await scope.getByPlaceholder("Search materials").fill(query);
  await scope.getByRole("button", { name: new RegExp(`^${escapeRegExp(materialName)}`, "i") }).click();
}

function visibleProposalPanel(page: Page) {
  return page.getByRole("tabpanel", { name: "Proposal" }).first();
}

function proposalCompanyProfileCard(page: Page, label: string) {
  return visibleProposalPanel(page)
    .getByText(label, { exact: true })
    .last()
    .locator("xpath=ancestor::div[.//button[normalize-space()='Delete']][1]");
}

test("workbench supports study-mode preset switching and inline layer editing", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Wall calculator" })).toBeVisible();
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await selectGuidedSurface(page, "floor");
  await expect(page.getByRole("heading", { name: "Floor calculator" })).toBeVisible();
  await expect(page.getByLabel("Example stack")).toHaveValue("heavy_concrete_impact_floor");
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await loadGuidedSample(page, "Floor Study");

  await expect(page.getByRole("heading", { name: "Floor calculator" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);
  await openGuidedAssemblyTool(page, "preview");
  await expect(page.getByText("Section preview", { exact: true })).toBeVisible();
  await openGuidedAssemblyTool(page, "composer");
  await expect(page.getByLabel("New layer material")).toBeVisible();
  await expect(page.getByLabel("New layer thickness")).toBeVisible();
  await expect(page.getByLabel("New layer role")).toBeVisible();

  const firstRow = await ensureGuidedRowExpanded(page, 1);
  await selectMaterialFromPicker(firstRow, "Material", "Carpet + Foam Underlay", "carpet");
  await expect(firstRow).toContainText("Carpet + Foam Underlay");

  await page.getByRole("button", { name: /^Add layer$/ }).click();

  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(5);
  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(visibleTestId(page, "editor-row-5")).toContainText("4 mm");
  await expect(visibleTestId(page, "editor-row-5")).toContainText("Floor covering");
});

test("guided study-type switching keeps the default preset and rows in sync", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Wall calculator" })).toBeVisible();
  await expect(page.getByLabel("Example stack")).toHaveValue("concrete_wall");
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();

  await selectGuidedSurface(page, "floor");
  await expect(page.getByRole("heading", { name: "Floor calculator" })).toBeVisible();
  await expect(page.getByLabel("Example stack")).toHaveValue("heavy_concrete_impact_floor");
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await selectGuidedSurface(page, "wall");
  await expect(page.getByRole("heading", { name: "Wall calculator" })).toBeVisible();
  await expect(page.getByLabel("Example stack")).toHaveValue("concrete_wall");
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);
});

test("guided floor composer normalizes structural carrier draft defaults instead of inheriting the vinyl starter thickness", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await openGuidedWorkspacePanel(page, "Assembly");
  await openGuidedAssemblyTool(page, "composer");

  const composer = visibleGuidedComposer(page);
  const cases = [
    {
      materialName: "Steel Joist Floor",
      query: "steel joist",
      thickness: "180",
      typicalBand: "Typical band 180 to 350 mm for Steel Joist Floor in the base structure role."
    },
    {
      materialName: "Lightweight Steel Floor",
      query: "lightweight steel",
      thickness: "160",
      typicalBand: "Typical band 160 to 350 mm for Lightweight Steel Floor in the base structure role."
    },
    {
      materialName: "Composite Steel Deck",
      query: "composite",
      thickness: "120",
      typicalBand: "Typical band 120 to 250 mm for Composite Steel Deck in the base structure role."
    },
    {
      materialName: "Hollow-core Plank",
      query: "hollow",
      thickness: "120",
      typicalBand: "Typical band 120 to 400 mm for Hollow-core Plank in the base structure role."
    },
    {
      materialName: "Open-box Timber Slab",
      query: "open-box",
      thickness: "350",
      typicalBand: "Typical band 120 to 350 mm for Open-box Timber Slab in the base structure role."
    }
  ] as const;

  for (const floorCase of cases) {
    await selectMaterialFromPicker(composer, "New layer material", floorCase.materialName, floorCase.query);
    await expect(composer.getByLabel("New layer material")).toContainText(floorCase.materialName);
    await expect(composer.getByLabel("New layer thickness")).toHaveValue(floorCase.thickness);
    await expect(composer.getByLabel("New layer role")).toHaveValue("base_structure");
    await expect(composer.getByText(floorCase.typicalBand, { exact: true })).toBeVisible();
    await expect(composer.getByText(/outside the guided sanity band/i)).toHaveCount(0);
  }
});

test("guided floor composer only exposes replace base for eligible carriers and keeps the CLT replacement on the clean lane", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await openGuidedWorkspacePanel(page, "Assembly");
  await openGuidedAssemblyTool(page, "composer");

  const composer = visibleGuidedComposer(page);

  await selectMaterialFromPicker(composer, "New layer material", "OSB", "osb");
  await expect(composer.getByRole("button", { exact: true, name: "Replace base" })).toHaveCount(0);

  await selectMaterialFromPicker(composer, "New layer material", "CLT Panel", "clt");
  await expect(composer.getByLabel("New layer thickness")).toHaveValue("140");
  await expect(composer.getByLabel("New layer role")).toHaveValue("base_structure");
  await expect(composer.getByRole("button", { exact: true, name: "Replace base" })).toBeVisible();

  await composer.getByRole("button", { exact: true, name: "Replace base" }).click();

  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(visibleTestId(page, "editor-row-4")).toContainText("CLT Panel");
  await expect(page.getByText(/single-entry floor roles are duplicated: base structure x2/i)).toHaveCount(0);

  const estimate = await estimateCurrentWorkbenchState(page);
  expect(estimate.status).toBe(200);
  expect(estimate.json.ok).toBe(true);
  expect(estimate.rowCount).toBe(4);
  expect(estimate.baseRow?.materialId).toBe("clt_panel");
  expect(estimate.baseRow?.thicknessMm).toBe("140");
  expect(estimate.json.result?.ratings?.iso717?.Rw).toBeCloseTo(49, 1);
  expect(estimate.json.result?.impact?.LnW).toBeCloseTo(68, 1);
  expect(estimate.json.result?.impact?.LPrimeNW).toBeCloseTo(70, 1);
  expect(estimate.json.result?.impact?.LPrimeNTw).toBeCloseTo(68, 1);
  expect(estimate.json.result?.impact?.LPrimeNT50).toBeCloseTo(68, 1);
});

test("guided floor flow exposes floor roles and marks only the relevant context inputs", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  await expect((await ensureGuidedRowExpanded(page, 1)).getByLabel("Floor role")).toHaveValue("floor_covering");

  await selectGuidedProjectContext(page, "field_between_rooms");
  await expect(page.getByText("Input map", { exact: true })).toBeVisible();
  await expect(page.getByText("Required now").first()).toBeVisible();
  await expect(page.getByText("Optional now").first()).toBeVisible();
  await expect(page.getByText("Partition width (mm)", { exact: true })).toBeVisible();
  await expect(page.getByText("Partition height (mm)", { exact: true })).toBeVisible();
  await expect(page.getByText("Impact K correction (dB)", { exact: true })).toBeVisible();
  await expect(page.getByText("Airborne room volume (m³)", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Impact room volume (m³)", { exact: true })).toBeVisible();
  await expect(page.getByLabel("RT60 (s)")).toHaveCount(0);
});

test("guided building-prediction route inputs are label-accessible and unlock field impact continuations", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");

  await page.getByLabel("Partition width (mm)").fill("4200");
  await page.getByLabel("Partition height (mm)").fill("3000");
  await page.getByLabel("Airborne room volume (m³)").fill("55");
  await page.getByLabel("Impact K correction (dB)").fill("3");
  await page.getByLabel("Impact room volume (m³)").fill("60");
  await page.getByLabel("RT60 (s)").fill("0.7");

  const routeState = await page.evaluate(() => {
    const rawStore = (globalThis as { localStorage?: { getItem: (key: string) => string | null } }).localStorage?.getItem(
      "dynecho-workbench-store"
    );
    const state = rawStore ? JSON.parse(rawStore).state : null;

    return state
      ? {
          airbornePanelHeightMm: state.airbornePanelHeightMm,
          airbornePanelWidthMm: state.airbornePanelWidthMm,
          airborneReceivingRoomRt60S: state.airborneReceivingRoomRt60S,
          airborneReceivingRoomVolumeM3: state.airborneReceivingRoomVolumeM3,
          impactGuideKDb: state.impactGuideKDb,
          impactGuideReceivingRoomVolumeM3: state.impactGuideReceivingRoomVolumeM3
        }
      : null;
  });

  expect(routeState).toEqual({
    airbornePanelHeightMm: "3000",
    airbornePanelWidthMm: "4200",
    airborneReceivingRoomRt60S: "0.7",
    airborneReceivingRoomVolumeM3: "55",
    impactGuideKDb: "3",
    impactGuideReceivingRoomVolumeM3: "60"
  });

  await openGuidedWorkspacePanel(page, "Results");
  const supportingMetrics = page.locator("summary").filter({ hasText: "Supporting metrics" }).first();
  await expect(supportingMetrics).toBeVisible();
  await supportingMetrics.click();

  const resultsText = await page.evaluate(() => {
    const main = (globalThis as { document?: { querySelector: (selector: string) => { querySelectorAll: (selector: string) => unknown[] } | null } }).document?.querySelector("main");
    const resultsSection = (Array.from(main?.querySelectorAll("section") ?? []) as Array<{ innerText?: string }>).find(
      (section) => (section.innerText ?? "").includes("GUIDED FLOOR ANSWER")
    );

    return resultsSection?.innerText ?? "";
  });

  expect(resultsText).toMatch(/DNT,W\s+58 dB/i);
  expect(resultsText).toMatch(/L'N,W\s+53 dB/i);
  expect(resultsText).toMatch(/L'NT,W\s+50\.2 dB/i);
});

test("guided impact floor unlocks field-impact outputs step by step as K and room volume are supplied", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");

  await page.getByLabel("Partition width (mm)").fill("4200");
  await page.getByLabel("Partition height (mm)").fill("3000");
  await page.getByLabel("Airborne room volume (m³)").fill("55");

  await openGuidedWorkspacePanel(page, "Results");
  const supportingMetrics = page.locator("summary").filter({ hasText: "Supporting metrics" }).first();
  await expect(supportingMetrics).toBeVisible();
  await supportingMetrics.click();
  const dntwCard = visibleGuidedMetricCard(page, "DnT,w");
  const lPrimeNwCard = visibleGuidedMetricCard(page, "L'n,w");
  const lPrimeNTwCard = visibleGuidedMetricCard(page, "L'nT,w");
  const lPrimeNT50Card = visibleGuidedMetricCard(page, "L'nT,50");

  await expect(dntwCard).toContainText("58 dB");
  await expect(lPrimeNwCard).toHaveCount(0);
  await expect(lPrimeNTwCard).toHaveCount(0);

  await page.getByLabel("Impact K correction (dB)").fill("3");
  await expect(lPrimeNwCard).toContainText("53 dB");
  await expect(lPrimeNTwCard).toHaveCount(0);

  await page.getByLabel("Impact room volume (m³)").fill("60");
  await expect(lPrimeNTwCard).toContainText("50.2 dB");
  await expect(lPrimeNT50Card).toHaveCount(0);
});

test("guided floor flow surfaces material-aware thickness guidance inline", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const screedRow = await ensureGuidedRowExpanded(page, 2);
  await expect(screedRow.getByText("Typical band 25 to 90 mm for Mineral Screed in the floating screed role.").first()).toBeVisible();

  await screedRow.getByLabel("Thickness").fill("8");

  await expect(
    screedRow.getByText(
      "Layer 2 thickness 8 mm is outside the guided sanity band of 25 to 90 mm for Mineral Screed in the floating screed role. Check units, role assignment, or split the build-up into separate layers if needed."
    ).first()
  ).toBeVisible();
});

test("guided floor rows let density overrides change the live layer mass without rewriting the material", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const screedRow = await ensureGuidedRowExpanded(page, 2);
  await screedRow.getByLabel("Density").fill("1800");

  await expect(screedRow).toContainText("1,800 kg/m³ (manual)");
  await expect(screedRow).toContainText("90 kg/m² at this layer");
  await expect(screedRow).toContainText("Mineral Screed");
});

test("guided floor composer demotes plaster-like finishes and surfaces the live caution warning", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await openGuidedAssemblyTool(page, "composer");

  await page.getByLabel("New layer material").click();
  await page.getByPlaceholder("Search materials").fill("cement");
  await expect(page.getByText("Not recommended for Floor covering", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /^Cement Plaster/i }).click();
  await expect(page.getByLabel("New layer material")).toContainText("Cement Plaster");

  await page.getByRole("button", { name: /^Add layer$/ }).click();

  await expect(visibleTestId(page, "editor-row-5")).toContainText("Cement Plaster");
  await expect(visibleGuidedRouteSummary(page)).toContainText("Review warnings");
  await page.getByText("Check these inputs before trusting the read.").first().click();
  await expect(page.locator("div:visible").filter({ hasText: /Cement Plaster is tagged as a plaster or masonry finish/i }).first()).toBeVisible();
  await expect(page.locator("div:visible").filter({ hasText: /not treated like a validated trafficable floor cover/i }).first()).toBeVisible();
});

test("guided floor composer surfaces duplicate single-entry role warnings before the broader fallback lane is used", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await openGuidedAssemblyTool(page, "composer");

  const composer = visibleGuidedComposer(page);
  await selectMaterialFromPicker(composer, "New layer material", "REGUPOL sonus curve 8", "regupol");
  await composer.getByLabel("New layer role").selectOption("resilient_layer");
  await composer.getByLabel("New layer thickness").fill("8");

  await expect(
    composer.getByText(
      "Resilient layer is already assigned in this stack. Adding another one is allowed, but visible-layer predictor matching will stay on the broader layer-scoring lane instead of a family or exact match.",
      { exact: true }
    )
  ).toBeVisible();

  await composer.getByRole("button", { name: /^Add layer$/ }).click();

  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(visibleGuidedRouteSummary(page)).toContainText("Review warnings");

  const estimate = await estimateCurrentWorkbenchState(page);
  expect(
    estimate.json.result?.warnings?.some((warning) =>
      /single-entry floor roles are duplicated: resilient layer x2/i.test(warning)
    )
  ).toBe(true);

  const duplicatedRow = await ensureGuidedRowExpanded(page, 5);
  await expect(
    duplicatedRow.getByText(
      "Resilient layer is already used by another row. Keeping this duplicate role is allowed, but visible-layer predictor matching will stay on the broader layer-scoring lane instead of a family or exact match.",
      { exact: true }
    )
  ).toBeVisible();
});

test("guided impact floor keeps its weighted floor read stable while field contexts unlock companion airborne reads", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await openGuidedWorkspacePanel(page, "Results");

  await expect(page.locator("main")).toContainText("59 dB");
  expect(await readPrimaryGuidedMetric(page, "Primary floor read")).toBe("50 dB");

  await selectGuidedProjectContext(page, "field_between_rooms");
  await expect(page.locator("main")).toContainText("57 dB");
  expect(await readPrimaryGuidedMetric(page, "Primary floor read")).toBe("50 dB");

  await selectGuidedProjectContext(page, "building_prediction");
  await expect(page.locator("main")).toContainText("57 dB");
  expect(await readPrimaryGuidedMetric(page, "Primary floor read")).toBe("50 dB");
  await expect(page.getByText("DeltaLw 33.4 dB", { exact: true })).toBeVisible();
  await expect(visibleGuidedRouteSummary(page)).toContainText("Published family estimate is active");
});

test("guided floor duplicate-base stress stays computable on the broader reinforced-concrete family lane", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "field_between_rooms");

  await page.getByRole("button", { name: "Duplicate layer 4" }).click();
  await openGuidedWorkspacePanel(page, "Results");
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.locator("main")).toContainText("64 dB");
  expect(await readPrimaryGuidedMetric(page, "Primary floor read")).toBe("50 dB");

  const estimate = await estimateCurrentWorkbenchState(page);
  expect(estimate.status).toBe(200);
  expect(estimate.json.ok).toBe(true);
  expect(estimate.rowCount).toBe(5);
  expect(estimate.json.result?.ratings?.iso717?.Rw).toBeCloseTo(66, 1);
  expect(estimate.json.result?.impact?.LnW).toBeCloseTo(50, 1);
  expect(
    estimate.json.result?.warnings?.some((warning) =>
      /Published family estimate active: reinforced concrete family general/i.test(warning)
    )
  ).toBe(true);
});

test("guided workbench can create a local custom material and use it as a new layer", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedAssemblyTool(page, "library");
  const customMaterialPanel = page.locator("section").filter({ has: page.getByText("Custom material library", { exact: true }) }).first();
  const createCustomMaterialButton = customMaterialPanel.getByRole("button", { name: "Create custom material", exact: true });
  if (await createCustomMaterialButton.isVisible()) {
    await createCustomMaterialButton.click();
  }
  const customMaterialPreview = visibleTestId(page, "custom-material-preview");
  await expect(customMaterialPanel.getByText("Custom material library", { exact: true })).toBeVisible();
  await expect(customMaterialPanel.getByText("0 saved", { exact: true })).toBeVisible();
  await expect(customMaterialPanel.getByText("No local materials yet.", { exact: true })).toBeVisible();
  await expect(customMaterialPreview).toContainText("New local material");
  await expect(customMaterialPreview).toContainText("Mass / structural");
  await expect(customMaterialPreview).toContainText("Pending");
  await expect(customMaterialPreview).toContainText("Not listed");
  await customMaterialPanel.getByLabel("Custom material name").fill("Cork Finish QA");
  await customMaterialPanel.getByLabel("Category").selectOption("finish");
  await customMaterialPanel.getByLabel("Density").fill("720");
  await customMaterialPanel.getByLabel("Material note").fill("Browser regression coverage for local custom materials.");
  await expect(customMaterialPreview).toContainText("Cork Finish QA");
  await expect(customMaterialPreview).toContainText("Finish / covering");
  await expect(customMaterialPreview).toContainText("720 kg/m³");
  await customMaterialPanel.getByRole("button", { name: "Save material", exact: true }).click();

  await openGuidedAssemblyTool(page, "library");
  const savedMaterialCard = visibleTestId(page, "custom-material-card-custom_cork_finish_qa");
  await expect(savedMaterialCard).toContainText("Cork Finish QA");
  await expect(savedMaterialCard).toContainText("Finish");
  await expect(savedMaterialCard).toContainText("720 kg/m³");
  await openGuidedAssemblyTool(page, "composer");
  await expect(page.getByLabel("New layer material")).toContainText("Cork Finish QA");
  await expect(page.getByLabel("New layer thickness")).toHaveValue("12.5");
  await expect(page.getByLabel("New layer role")).toHaveValue("floor_covering");

  await page.getByRole("button", { name: /^Add layer$/ }).click();

  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(visibleTestId(page, "editor-row-5")).toContainText("Cork Finish QA");
  await openGuidedWorkspacePanel(page, "Results");
  await expect(page.getByText("Primary floor read", { exact: true })).toBeVisible();
});

test("guided workbench exposes the expanded legacy catalog in both floor and wall layer pickers", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedAssemblyTool(page, "composer");
  await selectMaterialFromPicker(page, "New layer material", "OSB", "osb");
  await expect(page.getByLabel("New layer material")).toContainText("OSB");
  await page.getByRole("button", { name: /^Add layer$/ }).click();
  await expect(page.locator("[data-row-id]:visible").last()).toContainText("OSB");

  await openWallGuidedFlow(page);
  await openGuidedAssemblyTool(page, "composer");
  await selectMaterialFromPicker(page, "New layer material", "Fire Board", "fire board");
  await expect(page.getByLabel("New layer material")).toContainText("Fire Board");
  await page.getByRole("button", { name: /^Add layer$/ }).click();
  await expect(page.locator("[data-row-id]:visible").last()).toContainText("Fire Board");
});

test("guided result rail explains which next inputs unlock parked outputs", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");
  await page.getByPlaceholder("e.g. 3600", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 2800", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 2", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 42", { exact: true }).first().fill("");
  await page.getByPlaceholder("e.g. 42", { exact: true }).nth(1).fill("");
  await page.getByPlaceholder("e.g. 0.6", { exact: true }).fill("");

  const inputMap = page.locator("section:visible").filter({ has: page.getByText("Input map", { exact: true }) }).first();
  await expect(inputMap).toContainText("Building prediction");
  await expect(inputMap.getByText("Required now", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Optional now", { exact: true })).toBeVisible();
  await expect(inputMap).toContainText("Airborne route");
  await expect(inputMap).toContainText("Impact route");
  await expect(inputMap.getByText("Partition width (mm)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Partition height (mm)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Airborne room volume (m³)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Impact K correction (dB)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Impact room volume (m³)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("RT60 (s)", { exact: true })).toBeVisible();

  await page.getByPlaceholder("e.g. 3600", { exact: true }).fill("3600");
  await page.getByPlaceholder("e.g. 2800", { exact: true }).fill("2800");
  await page.getByPlaceholder("e.g. 2", { exact: true }).fill("2");

  await expect(page.getByPlaceholder("e.g. 3600", { exact: true })).toHaveValue("3600");
  await expect(page.getByPlaceholder("e.g. 2800", { exact: true })).toHaveValue("2800");
  await expect(page.getByPlaceholder("e.g. 2", { exact: true })).toHaveValue("2");
  await expect(inputMap.getByText("Airborne room volume (m³)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("Impact room volume (m³)", { exact: true })).toBeVisible();
  await expect(inputMap.getByText("RT60 (s)", { exact: true })).toBeVisible();
});

test("guided workbench keeps the same heavy-floor result when the middle layer reaches the same final thickness through different edit paths", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await page.getByRole("button", { name: "Edit row", exact: true }).nth(1).click();
  const firstEditedThickness = page.getByLabel("Thickness").first();
  await expect(firstEditedThickness).toBeVisible();
  await firstEditedThickness.fill("20");
  await firstEditedThickness.fill("100");
  await expect(page.getByText("266 mm total", { exact: true }).first()).toBeVisible();
  const editedPathValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Reset everything", exact: true }).click();
  await selectGuidedSurface(page, "floor");
  await loadGuidedSample(page, "Impact Floor");
  await page.getByRole("button", { name: "Edit row", exact: true }).nth(1).click();
  const directEditedThickness = page.getByLabel("Thickness").first();
  await expect(directEditedThickness).toBeVisible();
  await directEditedThickness.fill("100");
  await expect(page.getByText("266 mm total", { exact: true }).first()).toBeVisible();
  const directPathValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(editedPathValue).toBeTruthy();
  expect(editedPathValue).toBe(directPathValue);
});

test("guided workbench distinguishes editor rows from solver layers when identical live rows collapse", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await appendGuidedLayer(page, {
    floorRole: "floating_screed",
    materialName: "Mineral Screed",
    query: "screed",
    thickness: "40"
  });
  await page.getByLabel("Move layer 5 up").click();
  await page.getByLabel("Move layer 4 up").click();

  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("5 live / 0 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 solver layers", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("5 live rows collapse to 4 solver layers before the read is solved.").first()).toBeVisible();
});

test("guided workbench stays usable with a 10-layer stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  for (let index = 0; index < 6; index += 1) {
    await appendGuidedLayer(page, { thickness: "4" });
  }

  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(10);
  await expect(page.getByText("10 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("10 live / 0 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("5 solver layers", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("10 live rows collapse to 5 solver layers before the read is solved.").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
});

test("guided floor layout keeps a single desktop workspace visible and within roughly one-and-a-half screens", async ({
  page
}) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  const assemblyMetrics = await page.evaluate<{
    scrollHeight: number;
    viewportHeight: number;
    visibleHeadings: string[];
  }>(`(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    visibleHeadings: Array.from(document.querySelectorAll("h2"))
      .filter((node) => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((node) => node.textContent?.trim())
      .filter(Boolean)
  }))()`);

  expect(assemblyMetrics.visibleHeadings).toEqual(["Route", "Assembly", "Results"]);
  expect(assemblyMetrics.scrollHeight).toBeLessThanOrEqual(Math.round(assemblyMetrics.viewportHeight * 1.9));

  await openGuidedWorkspacePanel(page, "Details");

  const resultsMetrics = await page.evaluate<{
    scrollHeight: number;
    viewportHeight: number;
    visibleHeadings: string[];
  }>(`(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    visibleHeadings: Array.from(document.querySelectorAll("h2"))
      .filter((node) => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((node) => node.textContent?.trim())
      .filter(Boolean)
  }))()`);

  expect(resultsMetrics.visibleHeadings).toEqual(["Route", "Assembly", "Results"]);
  expect(resultsMetrics.scrollHeight).toBeLessThanOrEqual(Math.round(resultsMetrics.viewportHeight * 3));
});

test("guided workbench keeps the live result stable when an incomplete extra row is left in the stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const baselineValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await appendGuidedLayer(page, { thickness: "4" });
  const blankRow = await ensureGuidedRowExpanded(page, 5);
  await blankRow.getByLabel("Thickness").fill("");

  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live / 1 parked", { exact: true }).first()).toBeVisible();
  const withBlankRowValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(baselineValue).toBeTruthy();
  expect(withBlankRowValue).toBe(baselineValue);
});

test("guided workbench reports live and parked row counts in the stack summary", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  const routeSummary = page.locator("section").filter({ has: page.getByText("Route summary", { exact: true }) }).first();

  await expect(routeSummary.getByText("Solver lane", { exact: true })).toBeVisible();
  await expect(routeSummary.getByText("Heavy floating floor", { exact: true })).toBeVisible();
  await expect(routeSummary.getByText("Validation", { exact: true })).toBeVisible();
  await expect(routeSummary).toContainText("Scoped estimate");
  await expect(routeSummary).toContainText("Published family blend · reinforced concrete");
  await expect(page.getByText("4 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live / 0 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Primary floor read", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live rows in read", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 solver layers", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Every visible row currently contributes to the guided answer.").first()).toBeVisible();
  await expect(page.getByText("Read this as a supported floor estimate, not as a measured claim.").first()).toBeVisible();
  await expect(page.getByText(/^Pending outputs/i).first()).toBeVisible();

  await appendGuidedLayer(page, { thickness: "4" });
  const parkedRow = await ensureGuidedRowExpanded(page, 5);
  await parkedRow.getByLabel("Thickness").fill("");

  await expect(page.getByText("5 rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live / 1 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live rows in read", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live rows currently resolve to 4 solver layers. 1 parked row stays outside the active read.").first()).toBeVisible();
});

test("guided workbench keeps the decision basis rail visible on the main result surface", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");
  await openGuidedWorkspacePanel(page, "Results");

  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText("Scoped estimate", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Calculation trace", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/^Pending outputs/i).first()).toBeVisible();
  await expect(page.getByText("Check these inputs before trusting the read.").first()).toBeVisible();
  await expect(page.getByText("Primary floor read", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Stack contribution", { exact: true }).first()).toBeVisible();
});

test("guided workbench packages the live result into a client-facing proposal surface", async ({ page }) => {
  test.slow();
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedReviewTab(page, "Proposal");
  await expect(page.getByRole("heading", { name: "Package the proposal" })).toBeVisible();
  await page.getByLabel("Project name").fill("Riverside Residences");
  await page.getByLabel("Client name").fill("Machinity Acoustics");
  await page.getByLabel("Consultant company").fill("Machinity Acoustic Consultants");
  await page.getByLabel("Prepared by").fill("O. Tuna");
  await page.getByLabel("Issued to").fill("Riverside Development Team");
  await page.getByLabel("Attention").fill("Design Coordination Team");
  await page.getByLabel("Subject line").fill("Riverside Residences floor acoustic proposal");
  await page.getByLabel("Issue purpose").fill("Client review and acoustic coordination");
  await page.getByLabel("Validity note").fill("Valid for 30 calendar days unless superseded by a later issue.");
  await page.getByLabel("Proposal reference").fill("MAC-2026-014");
  await page.getByLabel("Revision").fill("Rev 01");
  await page.getByLabel("Consultant note").fill("Issue with explicit flanking caveat.");

  await expect(page.getByRole("heading", { name: "Acoustic Proposal" })).toBeVisible();
  await expect(page.getByText("Template profile", { exact: true }).first()).toBeVisible();
  await expect(page.locator("div, span, p").filter({ hasText: /^Consultant issue$/ }).first()).toBeVisible();
  await expect(page.getByText("Riverside Residences").first()).toBeVisible();
  await expect(page.getByText("Machinity Acoustics").first()).toBeVisible();
  await expect(page.getByText("Machinity Acoustic Consultants").first()).toBeVisible();
  await expect(page.getByText("O. Tuna").first()).toBeVisible();
  await expect(page.getByText("Riverside Development Team").first()).toBeVisible();
  await expect(page.getByText("Design Coordination Team").first()).toBeVisible();
  await expect(page.getByText("Riverside Residences floor acoustic proposal").first()).toBeVisible();
  await expect(page.getByText("Client review and acoustic coordination").first()).toBeVisible();
  await expect(page.getByText("Valid for 30 calendar days unless superseded by a later issue.").first()).toBeVisible();
  await expect(page.getByText("MAC-2026-014").first()).toBeVisible();
  await expect(page.getByText("Rev 01").first()).toBeVisible();
  await expect(page.getByText("Executive summary", { exact: true })).toBeVisible();
  await expect(page.getByText("Issue dossier", { exact: true })).toBeVisible();
  await expect(page.getByText("Validation corridor package", { exact: true })).toBeVisible();
  await expect(page.getByText("Solver rationale package", { exact: true })).toBeVisible();
  await expect(page.getByText("Recommended next steps", { exact: true })).toBeVisible();
  await expect(page.getByText("Assumption register", { exact: true })).toBeVisible();
  await expect(page.getByText("Decision trail", { exact: true })).toBeVisible();
  await expect(page.getByText("Issue authority", { exact: true })).toBeVisible();
  await expect(page.getByText("Source citations", { exact: true })).toBeVisible();
  await expect(page.getByText("Construction section", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "The official issue now carries a visual construction section alongside the row-by-row schedule so the solver order stays readable without opening the operator desk."
    )
  ).toBeVisible();
  await expect(page.getByText("Output coverage register", { exact: true })).toBeVisible();
  await expect(visibleProposalPanel(page).getByText("Evidence class", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Issue sequence register", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Reserve next issue no/i })).toBeVisible();
  await expect(page.getByText(/ready · .* parked · .* unsupported/i).first()).toBeVisible();
  await expect(page.getByText(/Dynamic airborne anchor|Exact floor family|Source posture/).first()).toBeVisible();
  await expect(visibleProposalPanel(page).getByRole("button", { name: /Download branded PDF/i })).toBeEnabled();
  await expect(visibleProposalPanel(page).getByRole("button", { name: /^Simple PDF$/i })).toBeEnabled();
  await expect(visibleProposalPanel(page).getByRole("button", { name: /Open print view/i })).toBeEnabled();
  await expect(visibleProposalPanel(page).getByRole("button", { name: /Copy proposal summary/i })).toBeEnabled();
  await expect(visibleProposalPanel(page).getByRole("button", { name: /Print \/ save PDF/i })).toBeEnabled();

  const pdfResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/proposal-pdf") && response.request().method() === "POST"
  );
  await visibleProposalPanel(page).getByRole("button", { name: /Download branded PDF/i }).click();
  const pdfResponse = await pdfResponsePromise;
  expect(pdfResponse.status()).toBe(200);
  expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");

  const simplePdfResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/proposal-pdf?style=simple") && response.request().method() === "POST"
  );
  await visibleProposalPanel(page).getByRole("button", { name: /^Simple PDF$/i }).click();
  const simplePdfResponse = await simplePdfResponsePromise;
  expect(simplePdfResponse.status()).toBe(200);
  expect(simplePdfResponse.headers()["content-type"]).toContain("application/pdf");

  const printViewPromise = page.waitForEvent("popup");
  await visibleProposalPanel(page).getByRole("button", { name: /Open print view/i }).click();
  const printView = await printViewPromise;
  await printView.waitForLoadState("domcontentloaded");

  await expect(printView.getByRole("heading", { name: "Official issue preview" })).toBeVisible();
  await expect(printView.getByText("Issue dossier", { exact: true })).toBeVisible();
  await expect(printView.getByRole("heading", { name: "Audit posture at a glance" })).toBeVisible();
  await expect(printView.getByText("Validation corridor package", { exact: true })).toBeVisible();
  await expect(printView.getByText("Construction section", { exact: true })).toBeVisible();
  await expect(printView.getByRole("heading", { name: "Visible layer stack in solver order" })).toBeVisible();
  await expect(printView.getByText("Technical layer schedule", { exact: true })).toBeVisible();
  await expect(printView.getByRole("heading", { name: "Density and surface-mass register" })).toBeVisible();
  await expect(printView.getByText("Riverside Residences").first()).toBeVisible();
  await expect(printView.getByText("Consultant issue", { exact: true }).first()).toBeVisible();
  await expect(printView.getByTitle("Proposal print preview frame")).toBeVisible();
  await expect(printView.getByRole("button", { name: /Download branded PDF/i })).toBeEnabled();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("MAC-2026-014").first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Validation Corridor Package", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Issue Snapshot", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView
      .frameLocator('iframe[title="Proposal print preview frame"]')
      .getByText("Applied Method & Deliverable Basis", { exact: true })
      .first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Solver Rationale Appendix", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Construction Section", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Surface Mass", { exact: false }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Issue Dossier", { exact: true })
  ).toBeVisible();
  await expect(
    printView.getByText("Solver rationale package", { exact: true })
  ).toBeVisible();
  await expect(
    printView.getByText("Audit posture at a glance")
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Output Coverage Register", { exact: true })
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Evidence class", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Signature and Issue Authority", { exact: true })
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Riverside Development Team").first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Machinity Acoustic Consultants").first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Riverside Residences floor acoustic proposal").first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Client review and acoustic coordination").first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Valid for 30 calendar days unless superseded by a later issue.").first()
  ).toBeVisible();
});

test("guided workbench can reserve the next proposal issue number from the local sequence register", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedReviewTab(page, "Proposal");
  await page.getByLabel("Project name").fill("Riverside Residences");
  await page.getByLabel("Consultant company").fill("Machinity Acoustic Consultants");
  await page.getByLabel("Issue code prefix").fill("MIA");

  await expect(page.getByText(/^MIA-RR-\d{8}-01$/)).toBeVisible();

  await page.getByRole("button", { name: /Reserve next issue no/i }).click();
  await expect(page.getByLabel("Proposal reference")).toHaveValue(/MIA-RR-\d{8}-01/);
  await expect(page.getByLabel("Revision")).toHaveValue("Rev 00");
  await expect(page.getByText(/Last reserved on this browser: MIA-RR-\d{8}-01\./)).toBeVisible();
  await expect(page.getByText(/^MIA-RR-\d{8}-02$/)).toBeVisible();

  await page.getByRole("button", { name: /Reserve next issue no/i }).click();
  await expect(page.getByLabel("Proposal reference")).toHaveValue(/MIA-RR-\d{8}-02/);
  await expect(page.getByText(/Last reserved on this browser: MIA-RR-\d{8}-02\./)).toBeVisible();
  await expect(page.getByText(/^MIA-RR-\d{8}-03$/)).toBeVisible();
});

test("guided workbench can save and reapply local company profiles on the proposal surface", async ({ page }) => {
  test.slow();
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedReviewTab(page, "Proposal");
  await page.getByLabel("Consultant company").fill("Machinity Acoustic Consultants");
  await page.getByLabel("Template profile").selectOption("developer");
  await page.getByLabel("Prepared by").fill("O. Tuna");
  await page.getByLabel("Approver title").fill("Lead Acoustic Consultant");
  await page.getByLabel("Contact email").fill("offers@machinity-acoustics.com");
  await page.getByLabel("Contact phone").fill("+90 212 000 00 00");
  await page.getByLabel("Office address").fill("Maslak District, Istanbul, Turkiye");
  await page.getByLabel("Wordmark line").fill("Building Acoustics and Vibration Control");
  await page.getByLabel("Issue code prefix").fill("MIA");
  await page.getByRole("button", { name: /Tender pricing/i }).click();
  await expect(page.getByText("Matched preset", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Issue purpose")).toHaveValue("Tender review and design coordination");
  await expect(page.getByLabel("Validity note")).toHaveValue("Budget pricing valid for 21 calendar days.");
  await page.getByLabel("Company logo").setInputFiles({
    buffer: Buffer.from(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='#6f402a'/><path d='M8 22V10h4l4 8 4-8h4v12h-3V15l-4 8h-2l-4-8v7H8Z' fill='#fff7ef'/></svg>"
    ),
    mimeType: "image/svg+xml",
    name: "machinity-logo.svg"
  });
  await page.getByLabel("Profile label").fill("Machinity Istanbul office");
  await page.getByRole("button", { name: /Save current profile/i }).click();

  const savedProfileCard = proposalCompanyProfileCard(page, "Machinity Istanbul office");
  await expect(savedProfileCard).toBeVisible();
  await expect(savedProfileCard.getByText("Logo saved", { exact: true })).toBeVisible();
  await savedProfileCard.getByRole("button", { name: /Set default/i }).click();
  await expect(savedProfileCard.getByRole("button", { name: "Default office", exact: true })).toBeVisible();

  await page.getByLabel("Consultant company").fill("Temporary Lab Identity");
  await page.getByLabel("Template profile").selectOption("lab_ready");
  await page.getByLabel("Prepared by").fill("Temp Operator");
  await page.getByLabel("Contact email").fill("temp@example.com");
  await page.getByLabel("Wordmark line").fill("Temporary wordmark");
  await page.getByLabel("Issue code prefix").fill("TMP");
  await page.getByLabel("Issue purpose").fill("Temporary issue purpose");
  await page.getByLabel("Validity note").fill("Temporary validity note");
  await expect(page.getByText("Custom wording active", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Clear logo/i }).click();

  await page.getByRole("button", { name: /Apply default office/i }).click();

  await expect(page.getByLabel("Consultant company")).toHaveValue("Machinity Acoustic Consultants");
  await expect(page.getByLabel("Template profile")).toHaveValue("developer");
  await expect(page.getByLabel("Prepared by")).toHaveValue("O. Tuna");
  await expect(page.getByLabel("Contact email")).toHaveValue("offers@machinity-acoustics.com");
  await expect(page.getByLabel("Wordmark line")).toHaveValue("Building Acoustics and Vibration Control");
  await expect(page.getByLabel("Issue code prefix")).toHaveValue("MIA");
  await expect(page.getByText("Matched preset", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Issue purpose")).toHaveValue("Tender review and design coordination");
  await expect(page.getByLabel("Validity note")).toHaveValue("Budget pricing valid for 21 calendar days.");
  await expect(page.getByText(/^MIA-[A-Z0-9]{2,4}-\d{8}$/).first()).toBeVisible();
  await expect(page.getByText("Active on this issue", { exact: true }).first()).toBeVisible();
  await expect(page.locator('img[alt*="logo preview"]')).toBeVisible();

  await expect(page.getByLabel("Consultant company")).toHaveValue("Machinity Acoustic Consultants");
  await expect(page.getByLabel("Template profile")).toHaveValue("developer");
  await expect(page.getByLabel("Prepared by")).toHaveValue("O. Tuna");
  await expect(page.getByLabel("Issue code prefix")).toHaveValue("MIA");
  await expect(page.getByText("Matched preset", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Issue purpose")).toHaveValue("Tender review and design coordination");
  await expect(page.getByLabel("Validity note")).toHaveValue("Budget pricing valid for 21 calendar days.");
  await expect(page.getByText("Active on this issue", { exact: true }).first()).toBeVisible();

  const activeProfileCard = proposalCompanyProfileCard(page, "Machinity Istanbul office");
  await expect(activeProfileCard).toBeVisible();
  await activeProfileCard.getByRole("button", { name: /Delete/i }).click();
  await expect(proposalCompanyProfileCard(page, "Machinity Istanbul office")).toHaveCount(0);
  await expect(visibleProposalPanel(page).getByText(/No local company profiles yet\./)).toBeVisible();
});

test("guided workbench can export and re-import the proposal company profile library", async ({ page }, testInfo) => {
  test.slow();
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await openGuidedReviewTab(page, "Proposal");
  await page.getByLabel("Consultant company").fill("Machinity Acoustic Consultants");
  await page.getByLabel("Template profile").selectOption("developer");
  await page.getByLabel("Prepared by").fill("O. Tuna");
  await page.getByLabel("Approver title").fill("Lead Acoustic Consultant");
  await page.getByLabel("Contact email").fill("offers@machinity-acoustics.com");
  await page.getByLabel("Contact phone").fill("+90 212 000 00 00");
  await page.getByLabel("Office address").fill("Maslak District, Istanbul, Turkiye");
  await page.getByLabel("Wordmark line").fill("Building Acoustics and Vibration Control");
  await page.getByLabel("Issue code prefix").fill("MIA");
  await page.getByRole("button", { name: /Tender pricing/i }).click();
  await page.getByLabel("Company logo").setInputFiles({
    buffer: Buffer.from(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='#6f402a'/><path d='M8 22V10h4l4 8 4-8h4v12h-3V15l-4 8h-2l-4-8v7H8Z' fill='#fff7ef'/></svg>"
    ),
    mimeType: "image/svg+xml",
    name: "machinity-logo.svg"
  });
  await page.getByLabel("Profile label").fill("Machinity Export Office");
  await page.getByRole("button", { name: /Save current profile/i }).click();
  const exportProfileCard = proposalCompanyProfileCard(page, "Machinity Export Office");
  await expect(exportProfileCard).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Export library JSON/i }).click()
  ]);
  expect(download.suggestedFilename()).toBe("dynecho-proposal-company-profiles.json");
  const exportedLibraryPath = testInfo.outputPath("dynecho-proposal-company-profiles.json");
  await download.saveAs(exportedLibraryPath);
  await expect(page.getByText("Company profile library exported", { exact: true })).toBeVisible();

  await exportProfileCard.getByRole("button", { name: /Delete/i }).click();
  await expect(proposalCompanyProfileCard(page, "Machinity Export Office")).toHaveCount(0);
  await expect(visibleProposalPanel(page).getByText(/No local company profiles yet\./)).toBeVisible();

  await page.getByLabel("Consultant company").fill("Temporary Import Check");
  await page.getByLabel("Template profile").selectOption("lab_ready");
  await page.getByLabel("Prepared by").fill("Temporary Operator");
  await page.getByLabel("Issue purpose").fill("Temporary import purpose");
  await page.getByLabel("Validity note").fill("Temporary import validity");
  await page.getByRole("button", { name: /Clear logo/i }).click();

  await page.locator('input[type="file"][accept="application/json,.json"]').setInputFiles(exportedLibraryPath);
  await expect(page.getByText("Company profile library imported", { exact: true })).toBeVisible();
  const importedProfileCard = proposalCompanyProfileCard(page, "Machinity Export Office");
  await expect(importedProfileCard).toBeVisible();
  await expect(importedProfileCard.getByText("Logo saved", { exact: true })).toBeVisible();

  await importedProfileCard.getByRole("button", { name: /Apply profile/i }).click();

  await expect(page.getByLabel("Consultant company")).toHaveValue("Machinity Acoustic Consultants");
  await expect(page.getByLabel("Template profile")).toHaveValue("developer");
  await expect(page.getByLabel("Prepared by")).toHaveValue("O. Tuna");
  await expect(page.getByLabel("Issue code prefix")).toHaveValue("MIA");
  await expect(page.getByLabel("Issue purpose")).toHaveValue("Tender review and design coordination");
  await expect(page.getByLabel("Validity note")).toHaveValue("Budget pricing valid for 21 calendar days.");
  await expect(page.getByText("Active on this issue", { exact: true }).first()).toBeVisible();
  await expect(page.locator('img[alt*="logo preview"]')).toBeVisible();
});

test("guided workbench exposes method detail for why the dynamic route and parked outputs look the way they do", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");

  await openGuidedReviewTab(page, "Method detail");
  const methodPanel = page.getByRole("tabpanel", { name: "Method detail" }).first();

  await expect(methodPanel.getByText("Method detail", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Route audit", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Solver notes", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Defensible outputs", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Blockers", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Assembly section", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Walking side", { exact: true }).first()).toBeVisible();
  await expect(methodPanel.getByText("Ceiling side", { exact: true }).first()).toBeVisible();
  await expect(methodPanel.getByText("Technical schedule legend", { exact: true }).first()).toBeVisible();
  await expect(methodPanel.getByText("Airborne lane", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Impact lane", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Evidence sources", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Assumptions", { exact: true })).toBeVisible();
  await expect(methodPanel.getByText("Warnings", { exact: true })).toBeVisible();
});

test("guided diagnostics keeps provenance and trace surfaces visible without leaving the guided flow", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await selectGuidedProjectContext(page, "building_prediction");

  await openGuidedReviewTab(page, "Diagnostics");
  const diagnosticsPanel = page.getByRole("tabpanel", { name: "Diagnostics" }).first();

  await expect(diagnosticsPanel.getByText("Diagnostics", { exact: true }).first()).toBeVisible();
  await expect(diagnosticsPanel.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(diagnosticsPanel.getByText("Trace coverage", { exact: true }).first()).toBeVisible();
  await expect(diagnosticsPanel.getByText("Decision trail", { exact: true }).first()).toBeVisible();
  await expect(diagnosticsPanel.getByText("Sources", { exact: true }).first()).toBeVisible();
  await expect(diagnosticsPanel.getByText("Warnings", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Active acoustic output" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What this result is allowed to claim" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Predictor status and evidence trace" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Operator desk/i })).toHaveAttribute("href", "/workbench?view=advanced");
});

test("guided exact floor presets keep exact-family notes visible without generic screening-only copy", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("dataholz_clt_dry_exact");
  await openGuidedWorkspacePanel(page, "Setup");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Validation");
  await expect(routeSummary).toContainText("Exact evidence");
  await expect(routeSummary).toContainText("Exact floor family");
  await expect(routeSummary).toContainText(/anchored by exact or official source evidence/i);
  await expect(routeSummary).toContainText(
    "Primary floor-family Rw and Ln,w companions come from the curated exact match. STC, C, and Ctr stay on the local airborne curve when shown, so read them as curve-derived companions."
  );
  await expect(routeSummary).toContainText(/Curated exact floor-system match active:/);
  await expect(
    page.getByText("Screening estimate only. This result is coming from the local calibrated seed lane.", { exact: true })
  ).toHaveCount(0);

  await openGuidedReviewTab(page, "Proposal");
  await expect(page.getByText("Source citations", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open source" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open source" }).first()).toHaveAttribute("href", /dataholz\.eu|https?:\/\//);
});

test("guided bound floor presets keep the next action on evidence tightening", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("ubiq_open_web_300_bound");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Validation");
  await expect(routeSummary).toContainText("Conservative bound");
  await expect(routeSummary).toContainText("Prefer exact evidence");
  await expect(routeSummary).toContainText(/should be read as a bound instead of a delivery-ready claim/i);
  await expect(routeSummary).toContainText(/airborne companions can still stay live/i);
});

test("guided bound floor presets keep live airborne companions separate from conservative impact bounds", async ({
  page
}) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("ubiq_open_web_300_bound");
  await selectGuidedProjectContext(page, "building_prediction");

  await page.getByLabel("Partition width (mm)").fill("4200");
  await page.getByLabel("Partition height (mm)").fill("3000");
  await page.getByLabel("Airborne room volume (m³)").fill("55");
  await page.getByLabel("Impact K correction (dB)").fill("2");
  await page.getByLabel("Impact room volume (m³)").fill("50");

  await openGuidedWorkspacePanel(page, "Results");
  const resultsSection = visibleGuidedResultsSection(page);
  const supportingMetrics = page.locator("summary").filter({ hasText: "Supporting metrics" }).first();
  await expect(supportingMetrics).toBeVisible();
  await supportingMetrics.click();

  await expect(resultsSection).toContainText("Ln,w");
  await expect(resultsSection).toContainText("<= 51 dB");
  await expect(resultsSection).toContainText("Conservative bound");
  await expect(resultsSection).toContainText("Rw");
  await expect(resultsSection).toContainText("63 dB");
  await expect(resultsSection).toContainText("Companion airborne");
  await expect(resultsSection).toContainText("L'n,w");
  await expect(resultsSection).toContainText("<= 53 dB");
  await expect(resultsSection).toContainText("L'nT,w");
  await expect(resultsSection).toContainText("Supporting metrics");
  await expect(resultsSection).toContainText("supporting values");
});

test("guided steel crossover bound can lock the support form into a narrower family corridor", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("ubiq_steel_300_unspecified_bound");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Conservative bound");
  await expect(routeSummary).toContainText("Fix support form");
  await expect(routeSummary).toContainText(
    "This lightweight-steel bound lane is still conservative because the live stack leaves the carrier open between steel joist / purlin and open-web / rolled steel. Fix the base-structure row to one support form so DynEcho can stay inside the narrower FL-32 or FL-33 family-bound corridor."
  );

  await ensureGuidedToolsOpen(page, "Set open-web / rolled carrier");
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toBeVisible();

  await page.getByRole("button", { name: "Set open-web / rolled carrier" }).click();

  await expect(routeSummary).not.toContainText("Fix support form");
  await expect(routeSummary).not.toContainText("Topology gap");
  await expect(routeSummary).toContainText("Prefer exact evidence");
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toHaveCount(0);
});

test("guided converged 200 mm steel bound stays off the support-form gap lane", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("ubiq_steel_200_unspecified_bound");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Conservative bound");
  await expect(routeSummary).toContainText("Prefer exact evidence");
  await expect(routeSummary).not.toContainText("Fix support form");
  await expect(routeSummary).not.toContainText("Topology gap");
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toHaveCount(0);
  await expect(page.getByText(/support form was left unspecified/i)).toHaveCount(0);
});

test("guided steel suspended preset keeps the fallback posture explicit while flagging the remaining topology gap", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("steel_suspended_fallback");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Validation");
  await expect(routeSummary).toContainText("Low-confidence fallback");
  await expect(page.getByText("Scoped estimate", { exact: true })).toHaveCount(0);
  await expect(routeSummary).toContainText("Solver lane");
  await expect(routeSummary).toContainText("Suspended ceiling only");
  await expect(routeSummary).toContainText(/last-resort estimate rather than a narrow solver match/i);
  await expect(routeSummary).toContainText(/suspended ceiling only topology/i);
  await expect(routeSummary).toContainText("Topology gap");
  await expect(routeSummary).toContainText("Topology still broad");
  await expect(routeSummary).toContainText(/model the resilient layer as its own live row and add the dry-deck, screed, or upper-fill package above the support/i);
});

test("guided timber bare low-confidence preset keeps the broad fallback and exposed companions explicit", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("timber_bare_impact_only_fallback");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Validation");
  await expect(routeSummary).toContainText("Low-confidence fallback");
  await expect(routeSummary).toContainText("Solver lane");
  await expect(routeSummary).toContainText("Bare floor");
  await expect(routeSummary).toContainText(/DynEcho is now exposing the published-family airborne companions on the same low-confidence lane/i);
  await expect(routeSummary).toContainText("Add the ceiling package");
  await expect(routeSummary).toContainText(
    "This bare-floor timber lane is still broad because the live stack only pins down the joist deck and floor finish. Add the ceiling board row, then choose whether that board sits direct to the joists or on furring channels. If mineral wool exists below, add it as a ceiling-fill row so DynEcho can move into a narrower Knauf timber corridor."
  );

  await openGuidedReviewTab(page, "Method detail");
  const methodPanel = page.getByRole("tabpanel", { name: "Method detail" }).first();
  await expect(methodPanel.getByText("Airborne companion carried on the active floor lane.").first()).toBeVisible();
  await expect(methodPanel.getByText("Combined weighted impact result with CI carry-over.").first()).toBeVisible();
});

test("guided timber fallback helper can move the stack into a narrower timber family lane", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Example stack").selectOption("timber_bare_impact_only_fallback");
  const routeSummary = visibleGuidedRouteSummary(page);

  await ensureGuidedToolsOpen(page, "Add direct ceiling board");
  await page.getByRole("button", { name: "Add direct ceiling board" }).click();

  await expect(routeSummary).not.toContainText("Low-confidence fallback");
  await expect(routeSummary).toContainText("Scoped estimate");
  await expect(routeSummary).not.toContainText("Add the ceiling package");
  await expect(routeSummary).not.toContainText("Topology gap");
  await expect(routeSummary).toContainText("supported floor estimate");
});

test("guided route signals change with empty, incomplete, and role-missing floor states", async ({ page }) => {
  await openFloorGuidedFlow(page);
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(routeSummary).toContainText("Add the first layer");
  await expect(routeSummary).toContainText("Waiting for stack");

  await loadGuidedSample(page, "Floor Study");

  await expect(routeSummary).toContainText("Review warnings");

  const lastRow = await ensureGuidedRowExpanded(page, 4);
  await lastRow.getByLabel("Floor role").selectOption("");
  await expect(routeSummary).toContainText("Tag floor roles");

  await (await ensureGuidedRowExpanded(page, 4)).getByLabel("Thickness").fill("");
  await expect(routeSummary).toContainText("Finish thickness");
});

test("guided floor rows spotlight the matching preview and legend entries", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");
  const sectionPreview = visibleGuidedSectionPreview(page);
  const editorRow2 = visibleTestId(page, "editor-row-2");
  const editorRow3 = visibleTestId(page, "editor-row-3");
  const legendRow2 = sectionPreview.locator('[data-testid="legend-row-2"]').first();
  const legendRow3 = sectionPreview.locator('[data-testid="legend-row-3"]').first();

  await expect(sectionPreview.getByText("Walking side", { exact: true }).first()).toBeVisible();
  await expect(sectionPreview.getByText("Technical layer schedule", { exact: true })).toBeVisible();

  await editorRow2.hover();
  await expect(editorRow2).toHaveAttribute("data-active", "true");
  await expect(legendRow2).toHaveAttribute("data-active", "true");

  await editorRow3.hover();
  await expect(legendRow3).toHaveAttribute("data-active", "true");
  await expect(legendRow2).toHaveAttribute("data-active", "false");
});

test("guided workbench keeps a moved blank row parked even after it is inserted into the middle of the stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const baselineValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await appendGuidedLayer(page, { thickness: "4" });
  await (await ensureGuidedRowExpanded(page, 5)).getByLabel("Thickness").fill("");
  await page.getByTestId("editor-row-5").getByLabel("Move layer 5 up").click();
  await expect(page.getByTestId("editor-row-4")).toHaveAttribute("data-move-flash", "up");
  await page.getByTestId("editor-row-4").getByLabel("Move layer 4 up").click();
  await expect(page.getByTestId("editor-row-3")).toHaveAttribute("data-move-flash", "up");

  await expect(page.getByTestId("editor-row-3")).toHaveAttribute("data-ready", "false");
  await expect(page.getByTestId("editor-row-3")).toContainText("Parked");

  const withMovedBlankRowValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(baselineValue).toBeTruthy();
  expect(withMovedBlankRowValue).toBe(baselineValue);
});

test("guided wall flow keeps the wall lane explicit and floor-only controls out of view", async ({ page }) => {
  await openWallGuidedFlow(page);
  await loadGuidedSample(page, "Wall Study");
  const routeSummary = visibleGuidedRouteSummary(page);

  await expect(page.getByLabel("Floor role")).toHaveCount(0);
  await expect(page.getByText("Primary wall read", { exact: true })).toBeVisible();
  await expect(routeSummary).toContainText("Lined Massive Wall");
  await expect(routeSummary).toContainText("Scoped estimate");
  await expect(routeSummary).toContainText(/supported wall estimate/i);
  await expect(page.getByText("Side A", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Side B", { exact: true }).first()).toBeVisible();
});

test("guided wall field routes keep airborne corridor language explicit instead of floor-family copy", async ({ page }) => {
  await openWallGuidedFlow(page);
  await loadGuidedSample(page, "Wall Study");
  await selectGuidedProjectContext(page, "field_between_rooms");
  await openGuidedReviewTab(page, "Method detail");

  await expect(page.getByText("Decision basis", { exact: true }).first()).toBeVisible();
  await expect(page.locator("article:visible").filter({ has: page.getByText("Airborne lane", { exact: true }) }).first()).toBeVisible();
  await expect(page.locator("article:visible").filter({ has: page.getByText("Route posture", { exact: true }) }).first()).toBeVisible();
  await expect(page.locator("article:visible").filter({ has: page.getByText("Solver spread", { exact: true }) }).first()).toBeVisible();
  await expect(page.locator("article:visible").filter({ has: page.getByText("Field route", { exact: true }) }).first()).toBeVisible();
  await expect(page.locator("article:visible").filter({ has: page.getByText("Active family", { exact: true }) })).toHaveCount(0);
  await expect(page.locator("article:visible").filter({ has: page.getByText("Tolerance band", { exact: true }) })).toHaveCount(0);
});

test("guided wall proposal surfaces keep Side A to Side B semantics explicit through print preview", async ({ page }) => {
  await openWallGuidedFlow(page);
  await loadGuidedSample(page, "Wall Study");

  await openGuidedReviewTab(page, "Proposal");
  await expect(page.getByLabel("Subject line")).toHaveAttribute("placeholder", "e.g. Riverside Residences wall acoustic proposal");

  await page.getByLabel("Project name").fill("Atrium Offices");
  await page.getByLabel("Client name").fill("Machinity Acoustics");
  await page.getByLabel("Consultant company").fill("Machinity Acoustic Consultants");

  await expect(page.getByText("Construction section", { exact: true })).toBeVisible();
  await expect(page.getByText("Evidence class", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Side A", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Side B", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Walking side", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Ceiling side", { exact: true })).toHaveCount(0);

  const printViewPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Open print view/i }).click();
  const printView = await printViewPromise;
  await printView.waitForLoadState("domcontentloaded");

  await expect(printView.getByText("Construction section", { exact: true })).toBeVisible();
  await expect(printView.getByText("Side A", { exact: true }).first()).toBeVisible();
  await expect(printView.getByText("Side B", { exact: true }).first()).toBeVisible();
  await expect(printView.getByText("Walking side", { exact: true })).toHaveCount(0);
  await expect(printView.getByText("Ceiling side", { exact: true })).toHaveCount(0);
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Construction Section", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Evidence class", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Walking side", { exact: true })
  ).toHaveCount(0);
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Ceiling side", { exact: true })
  ).toHaveCount(0);
});

test("workbench remains usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Assembly" })).toBeVisible();
  await page.getByRole("button", { name: "Setup", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Route" })).toBeVisible();
  await page.getByRole("button", { name: "Assembly", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Assembly" })).toBeVisible();
  await page.getByRole("button", { name: "Results", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await page.getByRole("button", { name: "Details", exact: true }).click();
  await page.getByRole("tab", { name: "Diagnostics", exact: true }).click();
  await expect(page.getByRole("link", { name: /Operator desk/i })).toBeVisible();
});

test("workbench keeps the guided flow focused while still exposing the advanced desk", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Assembly" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "DynEcho Operator Deck" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Advanced" })).toHaveAttribute("href", "/workbench?view=advanced");

  await openGuidedWorkspacePanel(page, "Results");
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText("Primary wall read")).toBeVisible();
  await expect(page.getByText("Supporting metrics")).toBeVisible();
  await openGuidedReviewTab(page, "Diagnostics");
  await expect(page.getByRole("link", { name: /Operator desk/i })).toHaveAttribute(
    "href",
    "/workbench?view=advanced"
  );
});

test("advanced workbench shows the current coverage snapshot and next hardening plan", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await expect(page.getByText("Coverage snapshot", { exact: true })).toBeVisible();
  await expect(page.getByText("Next hardening", { exact: true })).toBeVisible();
  await expect(page.getByText("timber frame / joist families", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Remaining low-confidence lane", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Retire the remaining low-confidence lane", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Replace bound-only support where possible", { exact: true }).first()).toBeVisible();
});

test("advanced workbench keeps invalid decimal draft input from turning into a persistent client-side crash", async ({
  page
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(String(error));
  });

  await gotoAdvancedWorkbench(page);

  const directPathOffsetInput = page.getByLabel("Direct path offset (dB)");
  await expect(directPathOffsetInput).toBeVisible();
  await directPathOffsetInput.fill(".");
  await directPathOffsetInput.blur();

  await expect(page.getByRole("heading", { name: "DynEcho Operator Deck" })).toBeVisible();
  await expect(directPathOffsetInput).toHaveValue(".");

  await page.reload();

  await expect(page.getByRole("heading", { name: "DynEcho Operator Deck" })).toBeVisible();
  const reloadedDirectPathOffsetInput = page.getByLabel("Direct path offset (dB)");
  await expect(reloadedDirectPathOffsetInput).toBeVisible();
  await reloadedDirectPathOffsetInput.fill("1.5");
  await expect(reloadedDirectPathOffsetInput).toHaveValue("1.5");
  expect(pageErrors).toEqual([]);
});

test("workbench can move the wall lane into airborne leakage and field-flanking context", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Context mode").selectOption("field_between_rooms");
  await page.getByLabel("Airtightness").selectOption("poor");
  await page.getByLabel("Perimeter seal").selectOption("poor");
  await page.getByLabel("Penetration state").selectOption("major");
  await page.getByLabel("Junction quality").selectOption("poor");
  await page.getByLabel("Shared track").selectOption("shared");
  await page.getByLabel("Electrical boxes").selectOption("back_to_back");

  await expect(page.getByText("Airborne trace", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dynamic selector and airborne overlay lineage" })).toBeVisible();
  await expect(page.getByText("Leakage overlay", { exact: true })).toBeVisible();
  await expect(page.getByText("Field flanking", { exact: true })).toBeVisible();
  await expect(page.getByText("Junction graph")).toBeVisible();
  await expect(page.getByText(/total conservative field penalty/i)).toBeVisible();
});

test("workbench exposes scoped impact outputs on the heavy floor preset", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  const lnwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^Ln,w$/ })
  }).first();
  const deltaLwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^DeltaLw$/ })
  }).first();

  await expect(page.getByText("Metric provenance", { exact: true })).toBeVisible();
  await expect(lnwCard.getByText(/^50 dB$/)).toBeVisible();
  await expect(deltaLwCard.getByText(/^33\.4 dB$/)).toBeVisible();
  await expect(page.getByLabel("Floor role").nth(2)).toHaveValue("resilient_layer");
  await expect(page.getByLabel("Floor role").nth(3)).toHaveValue("base_structure");
  const provenancePanel = page.locator("section, article, div").filter({
    has: page.getByText("Metric provenance")
  });
  await expect(provenancePanel.getByText("Metric provenance")).toBeVisible();
  await expect(provenancePanel.getByText("Ln,w came from the active predictor or curated family-estimate lane.")).toBeVisible();
});

test("workbench exposes predictor trace with structured solver lineage", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  const tracePanel = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  }).first();

  await expect(page.getByRole("heading", { name: "Predictor status and evidence trace" })).toBeVisible();
  await expect(tracePanel.getByText("Derived from visible layers")).toBeVisible();
  await expect(tracePanel.getByText("Formula lane", { exact: true })).toBeVisible();
  await expect(tracePanel.getByText("Family lane", { exact: true })).toBeVisible();
  await expect(tracePanel.getByText("Predictor input mode")).toBeVisible();
  await expect(tracePanel.getByText("Matched floor-system row")).toBeVisible();
  await expect(tracePanel.getByText("predictor heavy concrete published upper treatment estimate").first()).toBeVisible();
  await expect(tracePanel).toContainText("Family estimate trace");
  await expect(tracePanel).toContainText("Published family blend");
});

test("workbench keeps research-only ASTM outputs visible without fabricating live support", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", {
    name: /IIC: ASTM E989 impact insulation class for lab-side impact bands\./i
  }).click();

  const decisionGateRow = page.locator("div").filter({
    has: page.getByText(/^IIC$/)
  }).filter({
    has: page.getByText("Research lane")
  }).first();

  await expect(decisionGateRow).toBeVisible();
});

test("workbench keeps unsupported requested outputs explicit on the current path", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", {
    name: /DeltaLw: ISO 717-2 heavy-reference improvement rating for floating-floor systems\./i
  }).click();

  const decisionGateRow = page.locator("div").filter({
    has: page.getByText(/^DeltaLw$/)
  }).filter({
    has: page.getByText("Unavailable on current path")
  }).first();

  await expect(decisionGateRow).toBeVisible();
});

test("workbench surfaces a curated exact floor-system family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Dataholz Exact" }).click();

  const familyCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^Ln,w$/ })
  }).first();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(
    page.getByText("Dataholz GDRNXA07A | timber frame | wet screed + fill | resilient channel ceiling").first()
  ).toBeVisible();
  await expect(familyCard.getByText(/^41 dB$/)).toBeVisible();
  await expect(page.getByText("70 dB").first()).toBeVisible();
  await expect(page.getByText("+1 dB").first()).toBeVisible();
});

test("workbench surfaces a curated Knauf timber family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Knauf Direct" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Knauf CT.2G | timber flooring | KI 90G R2.5").first()).toBeVisible();
  await expect(page.getByText(/^69 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^54 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated Knauf concrete family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Knauf Concrete" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay").first()).toBeVisible();
  await expect(page.getByText(/^51 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^63 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated hollow-core vinyl family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Hollow Core Vinyl" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Pliteq HCP 200 | vinyl + GenieMat RST05 | GenieClip ceiling").first()).toBeVisible();
  await expect(page.getByText("Exact family live", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/^48 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^62 dB$/).first()).toBeVisible();
});

test("workbench surfaces a peer-reviewed composite bare family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Composite Bare" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("PMC M1 | bare composite panel floor").first()).toBeVisible();
  await expect(page.getByText("Exact family live", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/^84 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^27 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated Knauf timber mount family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Knauf Timber Mount" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Knauf CT30.1C | timber flooring | KI 145G R3.0").first()).toBeVisible();
  await expect(page.getByText(/^67 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^60 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated Dataholz CLT dry family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Dataholz CLT Dry" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Dataholz GDMTXN01 | CLT floor | dry screed | no lining").first()).toBeVisible();
  await expect(page.getByText(/^50 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^62 dB$/).first()).toBeVisible();
  await expect(page.getByText("N/A").first()).toBeVisible();
});

test("workbench surfaces a curated Dataholz CLT wet family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Dataholz CLT Wet" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("Dataholz GDMNXN05 | CLT floor | wet screed + fill | no lining").first()).toBeVisible();
  await expect(page.getByText(/^45 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^74 dB$/).first()).toBeVisible();
  await expect(page.getByText("N/A").first()).toBeVisible();
});

test("workbench surfaces a measured CLT 260 family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Measured CLT 260" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("TUAS C2 | CLT 260 mm | laminate + EPS underlay").first()).toBeVisible();
  await expect(page.getByText(/^65 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^42 dB$/).first()).toBeVisible();
});

test("workbench surfaces a measured open-box timber family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Measured Open Box" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("TUAS R2a | open-box timber slab | laminate + EPS underlay | resilient stud ceiling").first()).toBeVisible();
  await expect(page.getByText(/^72 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^49 dB$/).first()).toBeVisible();
});

test("workbench keeps open-box dry exact metrics stable when the slab depth falls back onto the family archetype lane", async ({
  page
}) => {
  await gotoAdvancedWorkbench(page);

  await loadAdvancedPreset(page, "Open Box Dry");
  const exactEstimate = await estimateCurrentWorkbenchState(page);
  expect(exactEstimate.status).toBe(200);
  expect(exactEstimate.json.ok).toBe(true);
  expect(exactEstimate.rowCount).toBe(9);
  expect(exactEstimate.json.result?.floorSystemMatch?.system?.id).toBe("tuas_r5b_open_box_timber_measured_2026");
  expect(exactEstimate.json.result?.floorSystemRatings?.Rw ?? exactEstimate.json.result?.ratings?.iso717?.Rw).toBe(75);
  expect(exactEstimate.json.result?.impact?.LnW).toBe(39);
  expect(exactEstimate.json.result?.impact?.LPrimeNW).toBe(41);
  expect(exactEstimate.json.result?.impact?.LPrimeNTw).toBe(39);
  expect(exactEstimate.json.result?.impact?.LPrimeNT50).toBe(44);

  await page.locator('input[value="370"]').first().fill("375");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(200);

  const fallbackEstimate = await estimateCurrentWorkbenchState(page);
  expect(fallbackEstimate.status).toBe(200);
  expect(fallbackEstimate.json.ok).toBe(true);
  expect(fallbackEstimate.json.result?.floorSystemMatch ?? null).toBeNull();
  expect(fallbackEstimate.json.result?.floorSystemEstimate?.kind).toBe("family_archetype");
  expect(fallbackEstimate.json.result?.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
  expect(fallbackEstimate.json.result?.floorSystemRatings?.Rw ?? fallbackEstimate.json.result?.ratings?.iso717?.Rw).toBe(75);
  expect(fallbackEstimate.json.result?.impact?.LnW).toBe(39);
  expect(fallbackEstimate.json.result?.impact?.LPrimeNW).toBe(41);
  expect(fallbackEstimate.json.result?.impact?.LPrimeNTw).toBe(39);
  expect(fallbackEstimate.json.result?.impact?.LPrimeNT50).toBe(44);
  await expect(page.getByText(/Published family estimate active: open-box timber family archetype/i)).toBeVisible();
});

test("workbench surfaces a measured concrete dry-floor family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Measured Concrete Dry" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("TUAS H5 | 160 mm steel-reinforced concrete | 50 mm glass wool dry floor + laminate").first()).toBeVisible();
  await expect(page.getByText(/^35 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^66 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated UBIQ open-web steel family match", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset UBIQ Steel 200" }).click();

  await expect(page.getByText("Curated match active")).toBeVisible();
  await expect(page.getByText("UBIQ FL-28 | 200 mm open-web steel | INEX FLOOR 19 | 3 x 16 mm resilient ceiling").first()).toBeVisible();
  await expect(page.getByText(/^52 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^63 dB$/).first()).toBeVisible();
});

test("workbench surfaces a curated UBIQ bound-only family without inventing an exact Ln,w", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset UBIQ Bound 300" }).click();
  const tracePanel = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  }).first();

  await expect(page.getByText("Bound family active")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Conservative upper-bound support" })).toBeVisible();
  await expect(page.getByText("Bound support live")).toBeVisible();
  await expect(page.getByText("UBIQ FL-33 | 300 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling").first()).toBeVisible();
  await expect(page.getByText(/^<= 51 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^63 dB$/).first()).toBeVisible();
  await expect(tracePanel.getByText("Support envelope")).toBeVisible();
  await expect(tracePanel.getByText("Upper-bound support", { exact: true })).toBeVisible();
});

test("workbench keeps support-form-unspecified steel stacks on a conservative bound crossover", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset UBIQ Bound Unspecified" }).click();

  await expect(page.getByText("Bound family estimate").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Conservative upper-bound support" })).toBeVisible();
  await expect(page.getByText("Bound support live")).toBeVisible();
  await expect(page.getByText(/^<= 51 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^62 dB$/).first()).toBeVisible();
  await expect(page.getByText(/support form was left unspecified/i)).toBeVisible();
});

test("workbench surfaces an official REGUPOL exact product row", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset REGUPOL Curve 8" }).click();

  await expect(page.getByText("Product row active", { exact: true })).toBeVisible();
  await expect(page.getByText("REGUPOL sonus curve 8, 150 mm slab, 30 mm screed, 8 mm tile").first()).toBeVisible();
  await expect(page.getByText(/^50 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^26 dB$/).first()).toBeVisible();
});

test("workbench keeps REGUPOL wet-screed lower-bound support beside the live heavy-floor metric", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset REGUPOL Wet Bound" }).click();

  await expect(page.getByText("Product row active", { exact: true })).toBeVisible();
  await expect(page.getByText("REGUPOL sonus curve 8, 140 mm slab, 70 mm wet screed (lower-bound support)").first()).toBeVisible();
  await expect(page.getByText(/^47\.9 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^27\.7 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^<= 56 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^>= 22 dB$/).first()).toBeVisible();
  await expect(page.getByText("Conservative support").first()).toBeVisible();
});

test("workbench surfaces an official Getzner catalog DeltaLw row", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Getzner AFM 33" }).click();

  await expect(page.getByText("Product row active", { exact: true })).toBeVisible();
  await expect(page.getByText("Getzner AFM 33 catalog DeltaLw").first()).toBeVisible();
  await expect(page.getByText(/^45 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^33 dB$/).first()).toBeVisible();
});

test("workbench suggests closest curated families when an exact match is nearly complete", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Dataholz Dry" }).click();
  await page.getByRole("button", { name: "Remove Generic Fill layer" }).click();

  await expect(page.getByText("Closest curated families")).toBeVisible();
  await expect(page.getByText("Dataholz GDRTXN01A | timber frame | dry floor + fill | direct lining").first()).toBeVisible();
  await expect(page.getByText(/Add upper fill/i).first()).toBeVisible();
});

test("workbench activates a family estimate for a near-miss Dataholz dry floor", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Dataholz Dry" }).click();
  await page.getByRole("button", { name: "Remove Generic Fill layer" }).click();
  const tracePanel = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  }).first();

  await expect(page.getByText("Family estimate active", { exact: true })).toBeVisible();
  await expect(page.getByText("timber frame / joist").first()).toBeVisible();
  await expect(page.getByText("derived Rw + Ctr").first()).toBeVisible();
  await expect(page.getByText("Candidate lineage:")).toBeVisible();
  await expect(tracePanel.getByText("Family estimate trace")).toBeVisible();
  await expect(tracePanel.getByText("Estimate tier")).toBeVisible();
  await expect(tracePanel.getByText("Archetype family", { exact: true }).first()).toBeVisible();
  await expect(tracePanel.getByText("Candidate rows").first()).toBeVisible();
});

test("workbench can derive a heavy-reference Ln,w from datasheet DeltaLw", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Datasheet DeltaLw (dB)").fill("24");

  await expect(page.getByRole("heading", { name: "Heavy-reference quick derive" })).toBeVisible();
  await expect(page.getByText("Reference ready")).toBeVisible();
  await expect(page.getByText("54 dB", { exact: true })).toBeVisible();
});

test("workbench explains field meaning and whether a guide field is currently used", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  await page.getByTitle("Explain Receiving room V (m³)").click();
  const receivingVolumeHelp = page
    .getByRole("note")
    .filter({ has: page.getByText(/Room volume standardizes L'nT,w from L'n,w/) })
    .first();

  await expect(receivingVolumeHelp.getByText("Not used right now")).toBeVisible();
  await expect(receivingVolumeHelp.getByText(/Room volume standardizes L'nT,w from L'n,w/)).toBeVisible();

  await page.getByLabel("K (dB)").fill("2");
  await page.getByLabel("Receiving room V (m³)").fill("45");

  await expect(receivingVolumeHelp.getByText("Used in current calculation")).toBeVisible();
  await expect(receivingVolumeHelp.getByText(/currently active in the standardized field branch/i)).toBeVisible();
});

test("layer editor explains why floor role matters for exact family matching", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Floor Study" }).click();
  await page.getByRole("button", { name: /Add layer/i }).click();
  await page.getByLabel("Floor role").last().selectOption("");
  await page.getByTitle("Explain Floor role").last().click();

  await expect(page.getByText(/exact family and product lanes may stay inactive/i)).toBeVisible();
  await expect(page.getByText(/whether a layer acts as structure, resilient layer, screed, fill, covering, or ceiling/i)).toBeVisible();
});

test("workbench can import exact lab impact bands and auto-carry CI outputs", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Band paste").fill("60 59 58 58 57 56 55 54 53 52 51 50 49 48 47 46 45 44 43");
  const tracePanel = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  }).first();

  const exactSourceCard = page.locator("div").filter({ hasText: /Parsed exact source/i }).first();
  const primaryImpactCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^Ln,w$/ })
  });
  const ciCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^CI$/ })
  }).first();
  const ci50Card = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^CI,50-2500$/ })
  }).first();
  const lnwCiCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^Ln,w\+CI$/ })
  }).first();

  await expect(page.getByText("Exact source active")).toBeVisible();
  await expect(exactSourceCard).toBeVisible();
  await expect(primaryImpactCard.getByText(/^53 dB$/)).toBeVisible();
  await expect(ciCard.getByText(/-3(?:\.0)? dB/)).toBeVisible();
  await expect(ci50Card.getByText(/-1(?:\.0)? dB/)).toBeVisible();
  await expect(lnwCiCard.getByText(/^50 dB$/)).toBeVisible();
  await expect(tracePanel.getByText("Formula notes", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/ISO 717-2 impact contour was used to rate the supplied band curve/i)).toBeVisible();
});

test("workbench can activate the direct+flanking field path lane on exact impact bands", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Band paste").fill("60 59 58 58 57 56 55 54 53 52 51 50 49 48 47 46 45 44 43");
  await page.getByLabel("Direct path offset (dB)").fill("1");
  await page.getByLabel("Direct-path ΔLd (dB)").fill("2");
  await page.getByLabel("Receiving room V (m³)").fill("50");
  await page.getByLabel("Flanking Paths (JSON)").fill(
    JSON.stringify(
      [
        {
          id: "f1",
          levelOffsetDb: -6,
          pathType: "wall",
          pathCount: 1,
          supportingElementFamily: "reinforced_concrete"
        },
        {
          id: "f2",
          levelOffsetDb: -10,
          pathType: "ceiling",
          pathCount: 2,
          kijDb: 1.5,
          shortCircuitRisk: "medium"
        }
      ],
      null,
      2
    )
  );

  const tracePanel = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  }).first();
  const lprimenwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'n,w$/ })
  }).first();
  const lprimentwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,w$/ })
  }).first();
  const lpriment50Card = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,50$/ })
  }).first();

  await expect(page.getByText("Direct+flanking active")).toBeVisible();
  await expect(page.getByText("Parsed flanking path set")).toBeVisible();
  await expect(lprimenwCard.getByText(/^55 dB$/)).toBeVisible();
  await expect(lprimentwCard.getByText(/^53 dB$/)).toBeVisible();
  await expect(lpriment50Card.getByText(/^52 dB$/)).toBeVisible();
  await expect(tracePanel).toContainText("Field path trace");
  await expect(tracePanel).not.toContainText("Support envelope");
  await expect(tracePanel).toContainText("Direct offset");
  await expect(tracePanel).toContainText("1 dB");
  await expect(tracePanel).toContainText("Active flanking paths");
  await expect(tracePanel).toContainText("2");
  await expect(tracePanel).toContainText("Family-aware models");
  await expect(tracePanel).toContainText("reinforced concrete");
});

test("workbench can derive DeltaLw from an exact heavy-reference improvement curve", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Improvement curve paste").fill("20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20");

  await expect(page.getByText("Heavy-reference exact")).toBeVisible();
  await expect(page.getByText(/^20 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^58 dB$/).first()).toBeVisible();
});

test("workbench can derive guide-side CI and L'nT,50 from the live impact lane", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  await page.getByLabel("CI (dB)").fill("-2");
  await page.getByLabel("K (dB)").fill("3");
  await page.getByLabel("Hd (dB)").fill("1");
  await page.getByRole("checkbox").check();
  const lnwCiCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^Ln,w\+CI$/ })
  }).first();
  const lprimeNwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'n,w$/ })
  }).first();
  const lprimeNT50Card = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,50$/ })
  }).first();

  await expect(page.getByRole("heading", { name: "Guide and field supplement" })).toBeVisible();
  await expect(lnwCiCard.getByText(/^48 dB$/)).toBeVisible();
  await expect(lprimeNwCard.getByText(/^53 dB$/)).toBeVisible();
  await expect(lprimeNT50Card.getByText(/^52 dB$/)).toBeVisible();
});

test("workbench can look up Turkish K and Hd corrections from mass ratio and room volume", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  await page.getByLabel("CI (dB)").fill("-2");
  await page.getByLabel("a/(b+c+d+e)").fill("3.4");
  await page.getByLabel("Receiving room V (m³)").fill("32");
  const lprimeNwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'n,w$/ })
  }).first();
  const lprimeNTwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,w$/ })
  }).first();
  const lprimeNT50Card = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,50$/ })
  }).first();

  await expect(page.getByRole("heading", { name: "Guide and field supplement" })).toBeVisible();
  await expect(lprimeNwCard.getByText(/^54 dB$/)).toBeVisible();
  await expect(lprimeNTwCard.getByText(/^53\.9 dB$/)).toBeVisible();
  await expect(lprimeNT50Card.getByText(/^52 dB$/)).toBeVisible();
  await expect(page.getByText(/^K was looked up from Turkish guide Table 2\.7/i)).toBeVisible();
  await expect(page.getByText(/^Hd was looked up from Turkish guide Table 2\.8/i)).toBeVisible();
});

test("workbench can derive standardized field-volume outputs from K, V, and CI,50-2500", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Impact Floor" }).click();
  await page.getByLabel("K (dB)").fill("2");
  await page.getByLabel("Receiving room V (m³)").fill("50");
  await page.getByLabel("CI,50-2500 (dB)").fill("-5");
  const lprimeNwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'n,w$/ })
  }).first();
  const lprimeNTwCard = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,w$/ })
  }).first();
  const lprimeNT50Card = page.locator("article").filter({
    has: page.locator("div").filter({ hasText: /^L'nT,50$/ })
  }).first();

  await expect(page.getByRole("heading", { name: "Guide and field supplement" })).toBeVisible();
  await expect(page.getByText(/-5(?:\.0)? dB/).first()).toBeVisible();
  await expect(lprimeNwCard.getByText(/^52 dB$/)).toBeVisible();
  await expect(lprimeNTwCard.getByText(/^50 dB$/)).toBeVisible();
  await expect(lprimeNT50Card.getByText(/^45 dB$/)).toBeVisible();
});

test("field help explains when the Turkish mass-ratio lookup is active", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByLabel("Band paste").fill("60 59 58 58 57 56 55 54 53 52 51 50 49 48 47 46 45 44 43");
  await page.getByLabel("a/(b+c+d+e)").fill("3.4");
  await page.getByTitle("Explain a/(b+c+d+e)").click();
  const massRatioHelp = page
    .getByRole("note")
    .filter({ has: page.getByText(/using a\/\(b\+c\+d\+e\) = 3\.4 to look up K from Table 2\.7/i) })
    .first();

  await expect(massRatioHelp.getByText("Used in current calculation")).toBeVisible();
  await expect(massRatioHelp.getByText(/using a\/\(b\+c\+d\+e\) = 3\.4 to look up K from Table 2\.7/i)).toBeVisible();
});

test("workbench carries live-stack field outputs onto the main impact lane", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset Knauf Concrete" }).click();
  await page.getByLabel("K (dB)").fill("2");
  await page.getByLabel("Receiving room V (m³)").fill("50");

  await expect(page.getByText("Live field supplement")).toBeVisible();
  await expect(page.getByText(/^53 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^51 dB$/).first()).toBeVisible();
  await expect(
    page.getByText(/Live field-side supplement is active on the main impact lane/i)
  ).toBeVisible();
});

test("workbench can carry conservative field-side upper bounds from a bound-only floor family", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Load preset UBIQ Bound 300" }).click();
  await page.getByLabel("K (dB)").fill("2");
  await page.getByLabel("Receiving room V (m³)").fill("50");

  await expect(page.getByRole("heading", { name: "Guide and field supplement" })).toBeVisible();
  await expect(page.getByText("Base Ln,w upper bound")).toBeVisible();
  await expect(page.getByText(/^<= 53 dB$/).first()).toBeVisible();
  await expect(page.getByText(/^<= 51 dB$/).first()).toBeVisible();
});

test("workbench can apply a criteria pack and refresh the brief posture", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { name: /Hotel Quiet/i }).click();

  await expect(page.getByLabel("Target Rw / STC")).toHaveValue("56");
  await expect(page.getByLabel("Target Ln,w")).toHaveValue("50");
  await expect(
    page.getByText("Current brief template is Hotel Quiet. Keep the target posture unless the live brief explicitly relaxes it.")
  ).toBeVisible();
  await expect(page.getByText("L'nT,50").first()).toBeVisible();
});

test("workbench can save the live stack as a scenario snapshot", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { name: /Save scenario/i }).click();
  const savedScenarioCard = page
    .locator("article")
    .filter({ has: page.getByRole("button", { exact: true, name: "Load" }) })
    .filter({ has: page.getByText("DynEcho Operator Deck · Wall Study 01") })
    .first();

  await expect(page.getByText("1 saved scenario", { exact: true })).toBeVisible();
  await expect(savedScenarioCard).toBeVisible();
  await expect(savedScenarioCard.getByText("DynEcho Operator Deck · Wall Study 01")).toBeVisible();
  await expect(savedScenarioCard.getByRole("button", { exact: true, name: "Load" })).toBeVisible();
});

test("workbench command palette can trigger scenario save", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { exact: true, name: "Open command palette" }).click();
  await expect(page.getByPlaceholder("Search commands, presets, outputs, and saved scenarios...")).toBeVisible();

  await page.getByText("Save current scenario", { exact: true }).click();
  const savedScenarioCard = page
    .locator("article")
    .filter({ has: page.getByRole("button", { exact: true, name: "Load" }) })
    .filter({ has: page.getByText("DynEcho Operator Deck · Wall Study 01") })
    .first();

  await expect(page.getByText("1 saved scenario", { exact: true })).toBeVisible();
  await expect(savedScenarioCard).toBeVisible();
  await expect(savedScenarioCard.getByText("DynEcho Operator Deck · Wall Study 01")).toBeVisible();
});

test("workbench exposes a markdown report surface", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await expect(page.getByText("dynecho-operator-deck-operator-brief.md")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy markdown" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download file" })).toBeVisible();
});

test("workbench shows upstream radar and delivery assist surfaces", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await expect(page.getByText("Migration scorecard")).toBeVisible();
  await expect(page.getByText("Read-only parity watch")).toBeVisible();
  await expect(page.getByText("Field risk board")).toBeVisible();
  await expect(page.getByText("From result to spec-ready action")).toBeVisible();
  await expect(page.getByText(/dirty file/)).toBeVisible();
});

test("advanced impact-floor replace base matrix keeps the visible structural carriers on sane defaults", async ({ page }) => {
  test.slow();

  const cases = [
    { buttonLabel: "Concrete", materialId: "concrete", thickness: "150", rw: 59, lPrimeNT50: null, lPrimeNTw: 50, lPrimeNw: 52, lnw: 50 },
    { buttonLabel: "Lightweight Concrete", materialId: "lightweight_concrete", thickness: "140", rw: 54, lPrimeNT50: 71.9, lPrimeNTw: 70.9, lPrimeNw: 72.9, lnw: 70.9 },
    { buttonLabel: "Heavy Concrete", materialId: "heavy_concrete", thickness: "180", rw: 62, lPrimeNT50: null, lPrimeNTw: 50, lPrimeNw: 52, lnw: 50 },
    { buttonLabel: "CLT Panel", materialId: "clt_panel", thickness: "140", rw: 49, lPrimeNT50: 68, lPrimeNTw: 68, lPrimeNw: 70, lnw: 68 },
    { buttonLabel: "Hollow-core Plank", materialId: "hollow_core_plank", thickness: "120", rw: 57, lPrimeNT50: null, lPrimeNTw: 58.5, lPrimeNw: 60.5, lnw: 58.5 },
    { buttonLabel: "Composite Steel Deck", materialId: "composite_steel_deck", thickness: "120", rw: 59, lPrimeNT50: null, lPrimeNTw: 68, lPrimeNw: 70, lnw: 68 },
    { buttonLabel: "Steel Joist Floor", materialId: "steel_joist_floor", thickness: "180", rw: 73, lPrimeNT50: 67.7, lPrimeNTw: 67.7, lPrimeNw: 69.7, lnw: 67.7 },
    { buttonLabel: "Lightweight Steel Floor", materialId: "lightweight_steel_floor", thickness: "160", rw: 72, lPrimeNT50: 60, lPrimeNTw: 59, lPrimeNw: 61, lnw: 59 },
    { buttonLabel: "Timber Joist Floor", materialId: "timber_joist_floor", thickness: "240", rw: 53, lPrimeNT50: null, lPrimeNTw: 69, lPrimeNw: 71, lnw: 69 },
    { buttonLabel: "Timber Frame Floor", materialId: "timber_frame_floor", thickness: "220", rw: 52, lPrimeNT50: 55.7, lPrimeNTw: 54.3, lPrimeNw: 56.3, lnw: 54.3 },
    { buttonLabel: "Open-box Timber Slab", materialId: "open_box_timber_slab", thickness: "350", rw: 55, lPrimeNT50: 67.7, lPrimeNTw: 67.7, lPrimeNw: 69.7, lnw: 67.7 },
    { buttonLabel: "Open-web Steel Floor", materialId: "open_web_steel_floor", thickness: "200", rw: 75, lPrimeNT50: null, lPrimeNTw: 61.1, lPrimeNw: 63.1, lnw: 61.1 }
  ] as const;

  await gotoAdvancedWorkbench(page);
  await expect(page.getByRole("button", { name: "Replace base with OSB" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Replace base with Plywood" })).toHaveCount(0);

  for (const floorCase of cases) {
    await gotoAdvancedWorkbench(page);
    await loadAdvancedPreset(page, "Impact Floor");
    await page.getByRole("button", { name: `Replace base with ${floorCase.buttonLabel}` }).click();
    await page.waitForTimeout(100);

    await expect(page.getByText(/outside the guided sanity band/i)).toHaveCount(0);

    const estimate = await estimateCurrentWorkbenchState(page);
    expect(estimate.status).toBe(200);
    expect(estimate.json.ok).toBe(true);
    expect(estimate.rowCount).toBe(4);
    expect(estimate.baseRow?.materialId).toBe(floorCase.materialId);
    expect(estimate.baseRow?.thicknessMm).toBe(floorCase.thickness);
    expect(estimate.json.result?.ratings?.iso717?.Rw).toBeCloseTo(floorCase.rw, 1);
    expect(estimate.json.result?.impact?.LnW).toBeCloseTo(floorCase.lnw, 1);
    expect(estimate.json.result?.impact?.LPrimeNW).toBeCloseTo(floorCase.lPrimeNw, 1);
    expect(estimate.json.result?.impact?.LPrimeNTw).toBeCloseTo(floorCase.lPrimeNTw, 1);

    if (floorCase.lPrimeNT50 === null) {
      expect(estimate.json.result?.impact?.LPrimeNT50 ?? null).toBeNull();
    } else {
      expect(estimate.json.result?.impact?.LPrimeNT50).toBeCloseTo(floorCase.lPrimeNT50, 1);
    }
  }
});

test("workbench tracks field-risk flags and updates the delivery context", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { name: /Perimeter bridge risk/i }).click();
  await page.getByRole("button", { name: /Service penetrations open/i }).click();

  await expect(page.getByText("Field risk elevated")).toBeVisible();
  await expect(page.getByText("5 risk score")).toBeVisible();
  await expect(page.getByText(/Field risk board is elevated/i)).toBeVisible();
});
