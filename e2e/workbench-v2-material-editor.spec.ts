import { expect, test, type Locator, type Page } from "@playwright/test";

const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "admin";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "admin";
const CUSTOM_LAYER_ID = "rebuild-layer-2";
const E2E_OPERATION_TIMEOUT = 30_000;
const CUSTOM_VISUAL_STYLE = {
  fill: "#123456",
  pattern: "#345678",
  side: "#234567",
  stroke: "#456789"
} as const;

async function signIn(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    data: {
      nextPath: "/workbench-v2",
      password: TEST_PASSWORD,
      username: TEST_USERNAME
    }
  });

  expect(response.ok()).toBeTruthy();
}

async function expectLayerVisualStyle(page: Page) {
  const layerBlock = page.locator(`.rebuild-layer-block[data-layer-id="${CUSTOM_LAYER_ID}"]`).first();

  await expect(layerBlock).toBeVisible();
  await expect
    .poll(async () =>
      layerBlock.evaluate((element) => {
        const style = window.getComputedStyle(element);

        return {
          fill: style.getPropertyValue("--layer-fill").trim(),
          pattern: style.getPropertyValue("--layer-pattern").trim(),
          side: style.getPropertyValue("--layer-side").trim(),
          stroke: style.getPropertyValue("--layer-stroke").trim()
        };
      })
    )
    .toEqual(CUSTOM_VISUAL_STYLE);
}

async function openMaterialEditor(page: Page) {
  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  const secondLayerButton = page.getByRole("button", { name: "Select layer 2" });
  await expect(secondLayerButton).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await secondLayerButton.click();
  const materialsButton = page.getByRole("button", { name: "Materials" });
  await expect(materialsButton).toBeEnabled({ timeout: E2E_OPERATION_TIMEOUT });
  await materialsButton.click();

  const editor = page.getByRole("region", { name: "Material editor" });
  await expect(editor).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  return editor;
}

async function fillManualPorousMaterialDraft(page: Page, materialName: string) {
  const editor = page.getByRole("region", { name: "Material editor" });

  await editor.getByLabel("Name", { exact: true }).fill(materialName);
  await editor.getByLabel("Category", { exact: true }).selectOption("insulation");
  await editor.getByLabel("Behavior", { exact: true }).selectOption("porous_absorber");
  await editor.getByLabel("Density", { exact: true }).fill("48");
  await editor.getByLabel("Source", { exact: true }).selectOption("user_supplied");
  await editor.getByLabel("Absorber class", { exact: true }).selectOption("porous_absorptive");
  await editor.getByLabel("Flow resistivity", { exact: true }).fill("16000");
  await editor.getByLabel("Porosity", { exact: true }).fill("0.92");
  await editor.getByLabel("Tags", { exact: true }).fill("qa, absorber, manual");
  await editor.getByLabel("Notes", { exact: true }).fill("Manual E2E product data with user supplied porous absorber values.");
}

async function getMaterialEditorLayoutMetrics(page: Page) {
  return page.locator(".material-editor-layout").evaluate((layout) => {
    const browser = layout.querySelector(".material-editor-browser");
    const detail = layout.querySelector(".material-editor-detail");

    if (!(browser instanceof HTMLElement) || !(detail instanceof HTMLElement)) {
      throw new Error("Material editor layout regions were not found.");
    }

    const layoutRect = layout.getBoundingClientRect();
    const browserRect = browser.getBoundingClientRect();
    const detailRect = detail.getBoundingClientRect();

    return {
      browserLeft: Math.round(browserRect.left - layoutRect.left),
      browserTop: Math.round(browserRect.top - layoutRect.top),
      browserWidth: Math.round(browserRect.width),
      detailLeft: Math.round(detailRect.left - layoutRect.left),
      detailTop: Math.round(detailRect.top - layoutRect.top),
      detailWidth: Math.round(detailRect.width)
    };
  });
}

async function expectMaterialEditorHasNoHorizontalOverflow(page: Page) {
  await expectRegionHasNoHorizontalOverflow(page.getByRole("region", { name: "Material editor" }));
}

async function expectRegionHasNoHorizontalOverflow(region: Locator) {
  const issues = await region.evaluate((root) => {
    const viewportWidth = document.documentElement.clientWidth;

    return Array.from(root.querySelectorAll<HTMLElement>("*"))
      .flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const text = (element.textContent ?? "").replace(/\s+/gu, " ").trim();
        const visible = rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";

        if (!visible) {
          return [];
        }

        const viewportOverflow = rect.left < -1 || rect.right > viewportWidth + 1;
        const unclippedTextOverflow = element.scrollWidth > element.clientWidth + 2 && style.overflowX === "visible" && text.length > 1;

        if (!viewportOverflow && !unclippedTextOverflow) {
          return [];
        }

        return [
          {
            clientWidth: element.clientWidth,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            scrollWidth: element.scrollWidth,
            tag: element.tagName,
            text: text.slice(0, 100),
            viewportWidth
          }
        ];
      })
      .slice(0, 20);
  });

  expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
}

function savedCombinationList(page: Page) {
  return page.locator('[aria-label="Saved combinations"]');
}

function savedCombinationRow(page: Page, name: string) {
  return savedCombinationList(page).locator(".calc-project-row").filter({ hasText: name }).first();
}

function savedCombinationRowById(page: Page, assemblyId: string) {
  return savedCombinationList(page).locator(`.calc-project-row[data-assembly-id="${assemblyId}"]`).first();
}

async function selectSavedCombinationByName(page: Page, name: string) {
  const row = savedCombinationRow(page, name);
  await expect(row).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await row.locator(".calc-project-row-main").click();
  return row;
}

async function selectSavedCombinationById(page: Page, assemblyId: string) {
  const row = savedCombinationRowById(page, assemblyId);
  await expect(row).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await row.locator(".calc-project-row-main").click();
  return row;
}

function savedReportList(page: Page) {
  return page.locator('[aria-label="Saved reports"]');
}

function savedReportRow(page: Page, name: string) {
  return savedReportList(page).locator(".calc-project-row").filter({ hasText: name }).first();
}

function savedReportRowById(page: Page, reportId: string) {
  return savedReportList(page).locator(`.calc-project-row[data-report-id="${reportId}"]`).first();
}

async function selectSavedReportById(page: Page, reportId: string) {
  const row = savedReportRowById(page, reportId);
  await expect(row).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await row.locator(".calc-project-row-main").click();
  return row;
}

async function openProjectWorkspace(page: Page) {
  const workspace = page.getByRole("region", { name: "Project workspace" });

  if ((await workspace.count()) === 0) {
    await page.getByRole("button", { name: "Show project workspace" }).click();
  }

  await expect(workspace).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  return workspace;
}

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await signIn(page);
});

test("workbench v2 material editor save/load keeps custom material and appearance state", async ({ page }) => {
  test.setTimeout(120_000);

  const projectName = `Workbench v2 material editor ${Date.now()}`;
  const editor = await openMaterialEditor(page);
  await editor.getByPlaceholder("Search materials").fill("Rock Wool");
  await editor.getByRole("option", { name: /^Rock Wool insulation \/ 45 kg/u }).click();
  await expect(editor.getByRole("heading", { name: "Built-in material" })).toBeVisible();

  await editor.getByRole("button", { name: "Create project copy" }).click();
  await editor.getByLabel("Name").fill("Browser QA Wool");
  await editor.getByRole("button", { name: "Save material" }).click();

  await expect(page.getByRole("button", { name: /Browser QA Wool 45 kg\/m3 \/ insulation/u })).toBeVisible();
  await expect(editor.getByRole("heading", { name: "Project material" })).toBeVisible();

  await editor.getByRole("button", { name: "Appearance" }).click();
  await editor.getByLabel("Fill").fill(CUSTOM_VISUAL_STYLE.fill);
  await editor.getByLabel("Side").fill(CUSTOM_VISUAL_STYLE.side);
  await editor.getByLabel("Stroke").fill(CUSTOM_VISUAL_STYLE.stroke);
  await editor.getByLabel("Pattern").fill(CUSTOM_VISUAL_STYLE.pattern);
  await editor.getByRole("button", { name: "Save appearance" }).click();
  await expect(editor.getByLabel("Fill")).toHaveValue(CUSTOM_VISUAL_STYLE.fill);
  await expectLayerVisualStyle(page);

  await openProjectWorkspace(page);
  await page.getByLabel("New project name", { exact: true }).fill(projectName);
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByLabel("Project", { exact: true })).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });
  await page.getByLabel("Saved combination name", { exact: true }).fill("Browser QA wall");
  await page.getByRole("button", { name: "Save combination" }).click();
  await expect(savedCombinationRow(page, "Browser QA wall")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toBeVisible();

  await openProjectWorkspace(page);
  const serverProjectSelect = page.getByLabel("Project", { exact: true });
  await expect(serverProjectSelect).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });
  const serverProjectOption = serverProjectSelect.locator("option", { hasText: projectName }).first();
  const serverProjectId = await serverProjectOption.getAttribute("value");
  expect(serverProjectId).toBeTruthy();

  await serverProjectSelect.selectOption(serverProjectId!);
  const assemblyRow = await selectSavedCombinationByName(page, "Browser QA wall");
  const assemblyId = await assemblyRow.getAttribute("data-assembly-id");
  expect(assemblyId).toBeTruthy();

  await page.getByRole("button", { name: "Load combination" }).click();
  await expect(page.getByRole("button", { name: /Browser QA Wool 45 kg\/m3 \/ insulation/u })).toBeVisible({
    timeout: 60_000
  });
  await expectLayerVisualStyle(page);
  await page.getByRole("button", { name: "Materials" }).click();
  await editor.getByRole("button", { name: "Appearance" }).click();
  await expect(editor.getByText("Browser QA Wool", { exact: true }).first()).toBeVisible();
  await expect(editor.getByLabel("Fill")).toHaveValue(CUSTOM_VISUAL_STYLE.fill);
  await expect(editor.getByLabel("Side")).toHaveValue(CUSTOM_VISUAL_STYLE.side);
  await expect(editor.getByLabel("Stroke")).toHaveValue(CUSTOM_VISUAL_STYLE.stroke);
  await expect(editor.getByLabel("Pattern")).toHaveValue(CUSTOM_VISUAL_STYLE.pattern);
});

test("workbench v2 material editor creates a manual porous material and assigns it to a layer", async ({ page }) => {
  const editor = await openMaterialEditor(page);
  await editor.getByRole("button", { name: "New material" }).click();

  await expect(editor.getByText("Material density, rho, in kg/m3")).toBeVisible();
  await expect(editor.getByText("Tells the acoustic solver how to interpret this material")).toBeVisible();

  await fillManualPorousMaterialDraft(page, "Manual QA Absorber");
  await expect(editor.getByText("Air-flow resistance of a porous absorber")).toBeVisible();
  await editor.getByRole("button", { name: "Save material" }).click();

  await expect(editor.getByRole("heading", { name: "Project material" })).toBeVisible();
  await expect(editor.getByText("Manual QA Absorber", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Close material editor" }).click();
  await page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u }).click();
  await page.getByPlaceholder("Search material").fill("Manual QA Absorber");
  await page.getByRole("option", { name: /Manual QA Absorber 48 kg\/m3 \/ insulation/u }).click();

  await expect(page.getByRole("button", { name: /Manual QA Absorber 48 kg\/m3 \/ insulation/u })).toBeVisible();
});

test("workbench v2 saves report drafts and revisions under the selected project", async ({ page }) => {
  test.setTimeout(60_000);

  const projectName = `Workbench v2 report save ${Date.now()}`;

  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByRole("button", { name: "Open report" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  await openProjectWorkspace(page);
  await page.getByLabel("New project name", { exact: true }).fill(projectName);
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByLabel("Project", { exact: true })).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });

  const serverProjectId = await page.getByLabel("Project", { exact: true }).inputValue();
  expect(serverProjectId).toBeTruthy();

  await page.getByLabel("Saved combination name", { exact: true }).fill("Report source wall");
  await page.getByRole("button", { name: "Save combination" }).click();
  const sourceAssemblyRow = savedCombinationRow(page, "Report source wall");
  await expect(sourceAssemblyRow).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  const serverAssemblyId = await sourceAssemblyRow.getAttribute("data-assembly-id");
  expect(serverAssemblyId).toBeTruthy();

  await page.getByRole("button", { name: "Open report" }).click();
  await expect(page).toHaveURL(/\/workbench\/proposal/u);
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("Project report ready", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("Project context", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("Not saved yet", { exact: true })).toBeVisible();

  const saveReportToProjectButton = page.getByRole("button", { name: "Save to project" });

  await saveReportToProjectButton.click();
  const saveTargetPanel = page.getByRole("region", { name: "Save report to project" });
  await expect(saveTargetPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await saveTargetPanel.getByLabel("Report name").fill("Report source wall draft");
  await saveTargetPanel.getByLabel("Report description").fill("Report saved from the proposal editor.");
  await expect(saveTargetPanel.getByText("Source combination already saved", { exact: true })).toBeVisible();
  await saveTargetPanel.getByRole("button", { name: "Save report" }).click();
  const saveRevisionButton = page.getByRole("button", { name: "Save revision" });
  await expect(saveRevisionButton).toBeVisible();
  await expect(page.getByText("Project report linked", { exact: true })).toBeVisible();
  await expect(page.getByText("Saved report context", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("REV-0001", { exact: true })).toBeVisible();

  const reportsResponse = await page.request.get(`/api/projects/${serverProjectId}/reports`);
  expect(reportsResponse.ok()).toBeTruthy();
  const reportsBody = (await reportsResponse.json()) as {
    reports?: Array<{
      assemblyId?: string;
      description?: string;
      id?: string;
      name?: string;
      revisionCount?: number;
    }>;
  };
  const reportId = reportsBody.reports?.[0]?.id;
  expect(reportsBody.reports).toEqual([
    expect.objectContaining({
      assemblyId: serverAssemblyId,
      description: "Report saved from the proposal editor.",
      name: "Report source wall draft",
      revisionCount: 1
    })
  ]);
  expect(reportId).toBeTruthy();

  const originalSubject = await page.getByLabel("Subject", { exact: true }).inputValue();
  expect(originalSubject.length).toBeGreaterThan(0);
  await page.getByLabel("Subject", { exact: true }).fill(`${projectName} revised report`);
  await saveRevisionButton.click();
  await expect(page.getByText("Project report revision saved")).toBeVisible();
  await expect(page.getByText("REV-0002", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  const reportDetailResponse = await page.request.get(`/api/projects/${serverProjectId}/reports/${reportId}`);
  expect(reportDetailResponse.ok()).toBeTruthy();
  const reportDetailBody = (await reportDetailResponse.json()) as {
    report?: {
      reportDocument?: {
        proposalSubject?: string;
      };
      revisions?: unknown[];
    };
  };

  expect(reportDetailBody.report?.revisions).toHaveLength(2);
  expect(reportDetailBody.report?.reportDocument?.proposalSubject).toBe(`${projectName} revised report`);

  await page.getByRole("button", { name: "Revision history" }).click();
  const revisionHistory = page.getByRole("region", { name: "Report revision history" });
  await expect(revisionHistory).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await revisionHistory.getByRole("button", { name: /Preview REV-0001/u }).click();
  await expect(revisionHistory.getByLabel("Read-only revision preview")).toContainText(originalSubject);
  await expect(page.getByLabel("Subject", { exact: true })).toHaveValue(`${projectName} revised report`);
  await revisionHistory.getByRole("button", { name: "Restore as new revision" }).click();
  await expect(page.getByText("Report revision restored")).toBeVisible();
  await expect(page.getByLabel("Subject", { exact: true })).toHaveValue(originalSubject, { timeout: E2E_OPERATION_TIMEOUT });
  await expect(revisionHistory.getByRole("button", { name: /Preview REV-0003/u })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  const restoredReportDetailResponse = await page.request.get(`/api/projects/${serverProjectId}/reports/${reportId}`);
  expect(restoredReportDetailResponse.ok()).toBeTruthy();
  const restoredReportDetailBody = (await restoredReportDetailResponse.json()) as {
    report?: {
      reportDocument?: {
        proposalSubject?: string;
      };
      revisions?: unknown[];
    };
  };

  expect(restoredReportDetailBody.report?.revisions).toHaveLength(3);
  expect(restoredReportDetailBody.report?.reportDocument?.proposalSubject).toBe(originalSubject);

  await page.getByRole("link", { name: "Calculator" }).click();
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  await openProjectWorkspace(page);
  const projectSelect = page.getByLabel("Project", { exact: true });
  await expect(projectSelect).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });
  const projectOption = projectSelect.locator("option", { hasText: projectName }).first();
  const reopenedProjectId = await projectOption.getAttribute("value");
  expect(reopenedProjectId).toBe(serverProjectId);
  await projectSelect.selectOption(serverProjectId);

  await selectSavedCombinationById(page, serverAssemblyId!);
  await page.getByLabel("Selected combination name", { exact: true }).fill("Renamed report source wall");
  await page.getByRole("button", { name: "Rename combination" }).click();
  await expect(savedCombinationRowById(page, serverAssemblyId!)).toContainText("Renamed report source wall", { timeout: E2E_OPERATION_TIMEOUT });

  await page.getByRole("button", { name: "Duplicate combination" }).click();
  const duplicateAssemblyRow = savedCombinationRow(page, "Copy of Renamed report source wall");
  await expect(duplicateAssemblyRow).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  const duplicateAssemblyId = await duplicateAssemblyRow.getAttribute("data-assembly-id");
  expect(duplicateAssemblyId).not.toBe(serverAssemblyId);

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Delete");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Delete combination" }).click();
  await expect(duplicateAssemblyRow).toBeHidden({ timeout: E2E_OPERATION_TIMEOUT });

  const initialSavedReportRow = savedReportRow(page, "Report source wall draft");
  await expect(initialSavedReportRow).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  const savedReportId = await initialSavedReportRow.getAttribute("data-report-id");
  expect(savedReportId).toBe(reportId);

  await selectSavedReportById(page, reportId!);
  await page.getByLabel("Selected report name", { exact: true }).fill("Renamed acoustic report");
  await page.getByRole("button", { name: "Rename report" }).click();
  await expect(savedReportRowById(page, reportId!)).toContainText("Renamed acoustic report", { timeout: E2E_OPERATION_TIMEOUT });

  await page.getByRole("button", { name: "Duplicate report" }).click();
  const duplicateReportRow = savedReportRow(page, "Copy of Renamed acoustic report");
  await expect(duplicateReportRow).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  const duplicateReportId = await duplicateReportRow.getAttribute("data-report-id");
  expect(duplicateReportId).not.toBe(reportId);

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Delete");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Delete report" }).click();
  await expect(duplicateReportRow).toBeHidden({ timeout: E2E_OPERATION_TIMEOUT });

  await selectSavedReportById(page, reportId!);
  await page.getByRole("button", { name: "Archive report" }).click();
  await expect(savedReportRowById(page, reportId!)).toContainText("Archived - 3 revisions", { timeout: E2E_OPERATION_TIMEOUT });
  await page.getByRole("button", { name: "Restore report" }).click();
  await expect(savedReportRowById(page, reportId!)).toContainText("Draft - 3 revisions", { timeout: E2E_OPERATION_TIMEOUT });

  await page.getByRole("button", { name: "Open saved report" }).click();
  await expect(page).toHaveURL(/\/workbench\/proposal/u);
  await expect(page.getByText("Project report linked", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Subject", { exact: true })).toHaveValue(originalSubject);
});

test("workbench v2 proposal saves a local report to a selected project", async ({ page }) => {
  test.setTimeout(60_000);

  const projectName = `Workbench v2 local report target ${Date.now()}`;
  const projectResponse = await page.request.post("/api/projects", {
    data: {
      name: projectName
    }
  });
  expect(projectResponse.ok()).toBeTruthy();
  const projectBody = (await projectResponse.json()) as {
    project?: {
      id?: string;
    };
  };
  const projectId = projectBody.project?.id;
  expect(projectId).toBeTruthy();

  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await page.getByRole("button", { name: "Open report" }).click();
  await expect(page).toHaveURL(/\/workbench\/proposal/u);

  await page.getByRole("button", { name: "Save to project" }).click();
  const saveTargetPanel = page.getByRole("region", { name: "Save report to project" });
  await expect(saveTargetPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(saveTargetPanel.getByLabel("Project")).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });
  await saveTargetPanel.getByLabel("Project").selectOption(projectId!);
  await saveTargetPanel.getByLabel("Layer combination name").fill("Local draft wall option");
  await saveTargetPanel.getByLabel("Layer combination description").fill("Layer stack named from proposal save target.");
  await saveTargetPanel.getByLabel("Report name").fill("Local draft report");
  await saveTargetPanel.getByLabel("Report description").fill("Report saved into an existing project from local mode.");
  await saveTargetPanel.getByRole("button", { name: "Save report" }).click();

  await expect(page.getByRole("button", { name: "Save revision" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("Project report linked", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });

  const assembliesResponse = await page.request.get(`/api/projects/${projectId}/assemblies`);
  expect(assembliesResponse.ok()).toBeTruthy();
  const assembliesBody = (await assembliesResponse.json()) as {
    assemblies?: Array<{
      description?: string;
      id?: string;
      name?: string;
    }>;
  };
  const assemblyId = assembliesBody.assemblies?.[0]?.id;
  expect(assembliesBody.assemblies).toEqual([
    expect.objectContaining({
      description: "Layer stack named from proposal save target.",
      name: "Local draft wall option"
    })
  ]);
  expect(assemblyId).toBeTruthy();

  const reportsResponse = await page.request.get(`/api/projects/${projectId}/reports`);
  expect(reportsResponse.ok()).toBeTruthy();
  const reportsBody = (await reportsResponse.json()) as {
    reports?: Array<{
      assemblyId?: string;
      description?: string;
      name?: string;
      revisionCount?: number;
    }>;
  };
  expect(reportsBody.reports).toEqual([
    expect.objectContaining({
      assemblyId,
      description: "Report saved into an existing project from local mode.",
      name: "Local draft report",
      revisionCount: 1
    })
  ]);
});

test("workbench v2 material editor keeps responsive editing layout usable", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  const editor = await openMaterialEditor(page);

  await expectMaterialEditorHasNoHorizontalOverflow(page);
  const desktopLayout = await getMaterialEditorLayoutMetrics(page);
  expect(desktopLayout.browserLeft).toBeLessThan(desktopLayout.detailLeft);
  expect(Math.abs(desktopLayout.browserTop - desktopLayout.detailTop)).toBeLessThanOrEqual(4);

  await page.setViewportSize({ height: 844, width: 390 });
  await expectMaterialEditorHasNoHorizontalOverflow(page);
  const mobileBrowseLayout = await getMaterialEditorLayoutMetrics(page);
  expect(mobileBrowseLayout.browserTop).toBeLessThan(mobileBrowseLayout.detailTop);

  await editor.getByRole("button", { name: "New material" }).click();
  await fillManualPorousMaterialDraft(page, "Mobile UX Absorber");

  await expectMaterialEditorHasNoHorizontalOverflow(page);
  const mobileEditLayout = await getMaterialEditorLayoutMetrics(page);
  expect(mobileEditLayout.detailTop).toBeLessThan(mobileEditLayout.browserTop);
});

test("workbench v2 project workspace and report editor controls stay responsive", async ({ page }) => {
  test.setTimeout(60_000);

  await page.setViewportSize({ height: 900, width: 390 });
  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible();

  await expect(page.getByRole("region", { name: "Project workspace" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open report" })).toBeVisible();
  const projectWorkspace = await openProjectWorkspace(page);
  await expectRegionHasNoHorizontalOverflow(projectWorkspace);

  const projectName = `Responsive workspace ${Date.now()}`;
  await page.getByLabel("New project name", { exact: true }).fill(projectName);
  await page.getByRole("button", { name: "Create project" }).click();
  const projectSelect = page.getByLabel("Project", { exact: true });
  await expect(projectSelect).toContainText(projectName, { timeout: 30_000 });
  const serverProjectId = await projectSelect.inputValue();
  expect(serverProjectId).toBeTruthy();

  await page.getByLabel("Saved combination name", { exact: true }).fill("Mobile saved combination");
  await page.getByRole("button", { name: "Save combination" }).click();
  await expect(savedCombinationRow(page, "Mobile saved combination")).toBeVisible({ timeout: 30_000 });
  await expectRegionHasNoHorizontalOverflow(projectWorkspace);

  await page.getByRole("button", { name: "Open report" }).click();
  await expect(page).toHaveURL(/\/workbench\/proposal/u);
  await expect(page.getByText("Project report ready", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByRole("button", { name: "Reload preview" })).toBeVisible();
  await expectRegionHasNoHorizontalOverflow(page.locator(".report-header"));
  await page.setViewportSize({ height: 1000, width: 1440 });
  await expectRegionHasNoHorizontalOverflow(page.locator(".report-header"));
  await page.setViewportSize({ height: 900, width: 390 });

  await page.getByRole("button", { name: "Save to project" }).click();
  const saveTargetPanel = page.getByRole("region", { name: "Save report to project" });
  await expect(saveTargetPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectRegionHasNoHorizontalOverflow(saveTargetPanel);
  await saveTargetPanel.getByRole("button", { name: "Save report" }).click();
  await expect(page.getByText("Project report linked", { exact: true })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await page.getByRole("button", { name: "Revision history" }).click();
  const revisionHistory = page.getByRole("region", { name: "Report revision history" });
  await expect(revisionHistory).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectRegionHasNoHorizontalOverflow(revisionHistory);
  await revisionHistory.getByRole("button", { name: "Close" }).click();
  await page.getByRole("link", { name: "Calculator" }).click();
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await openProjectWorkspace(page);
  const reopenedProjectSelect = page.getByLabel("Project", { exact: true });
  await expect(reopenedProjectSelect).toContainText(projectName, { timeout: E2E_OPERATION_TIMEOUT });
  await reopenedProjectSelect.selectOption(serverProjectId);
  await expect(savedReportRow(page, "Wall acoustic analysis report")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectRegionHasNoHorizontalOverflow(page.getByRole("region", { name: "Project workspace" }));

  await page.setViewportSize({ height: 1000, width: 1440 });
  await expectRegionHasNoHorizontalOverflow(page.getByRole("region", { name: "Project workspace" }));
});

test("workbench v2 project workspace guards rapid duplicate submit actions", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible();

  await openProjectWorkspace(page);
  const projectName = `Rapid guarded ${Date.now()}`;
  await page.getByLabel("New project name", { exact: true }).fill(projectName);
  const createProjectButton = page.getByRole("button", { name: "Create project" });
  await expect(createProjectButton).toBeEnabled();
  await createProjectButton.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("Create project button was not found.");
    }

    button.click();
    button.click();
  });

  const projectSelect = page.getByLabel("Project", { exact: true });
  await expect(projectSelect).toContainText(projectName, { timeout: 30_000 });
  await expect(projectSelect.locator("option", { hasText: projectName })).toHaveCount(1);
  const serverProjectId = await projectSelect.inputValue();
  expect(serverProjectId).toBeTruthy();

  const combinationName = "Rapid guarded combination";
  await page.getByLabel("Saved combination name", { exact: true }).fill(combinationName);
  const saveCombinationButton = page.getByRole("button", { name: "Save combination" });
  await expect(saveCombinationButton).toBeEnabled({ timeout: 30_000 });
  await saveCombinationButton.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("Save combination button was not found.");
    }

    button.click();
    button.click();
  });

  const savedCombinationRows = savedCombinationList(page).locator(".calc-project-row");
  await expect(savedCombinationRows.filter({ hasText: combinationName })).toHaveCount(1, { timeout: 30_000 });

  const duplicateCombinationButton = page.getByRole("button", { name: "Duplicate combination" });
  await expect(duplicateCombinationButton).toBeEnabled({ timeout: 30_000 });
  await duplicateCombinationButton.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("Duplicate combination button was not found.");
    }

    button.click();
    button.click();
  });

  await expect(savedCombinationRows.filter({ hasText: `Copy of ${combinationName}` })).toHaveCount(1, { timeout: 30_000 });

  await page.getByRole("button", { name: "Open report" }).click();
  await expect(page).toHaveURL(/\/workbench\/proposal/u);
  await expect(page.getByText("Project report ready", { exact: true })).toBeVisible();
  const saveReportButton = page.getByRole("button", { name: "Save to project" });
  await expect(saveReportButton).toBeEnabled({ timeout: 30_000 });
  await saveReportButton.click();
  const saveTargetPanel = page.getByRole("region", { name: "Save report to project" });
  await expect(saveTargetPanel).toBeVisible({ timeout: 30_000 });
  const saveProjectReportButton = saveTargetPanel.getByRole("button", { name: "Save report" });
  await expect(saveProjectReportButton).toBeEnabled({ timeout: 30_000 });
  await saveProjectReportButton.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("Save report button was not found.");
    }

    button.click();
    button.click();
  });

  await expect(page.getByText("Project report linked", { exact: true })).toBeVisible({ timeout: 30_000 });
  const reportsResponse = await page.request.get(`/api/projects/${serverProjectId}/reports`);
  expect(reportsResponse.ok()).toBeTruthy();
  const reportsBody = (await reportsResponse.json()) as { reports?: unknown[] };
  expect(reportsBody.reports).toHaveLength(1);
});
