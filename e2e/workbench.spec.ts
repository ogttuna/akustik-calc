import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    content: "window.localStorage.clear(); window.sessionStorage.clear();"
  });
});

async function gotoSimpleWorkbench(page: Page) {
  await page.goto("/workbench");
}

async function gotoAdvancedWorkbench(page: Page) {
  await page.goto("/workbench?view=advanced");
}

async function openFloorGuidedFlow(page: Page) {
  await gotoSimpleWorkbench(page);
  await page.getByLabel("Surface type").selectOption("floor");
}

async function openWallGuidedFlow(page: Page) {
  await gotoSimpleWorkbench(page);
  await page.getByLabel("Surface type").selectOption("wall");
}

async function loadGuidedSample(page: Page, label: string) {
  await page.getByLabel("Sample assembly").selectOption({ label });
  await page.getByRole("button", { name: /Load sample/i }).click();
}

async function readPrimaryGuidedMetric(page: Page, label: "Primary floor read" | "Primary wall read") {
  const card = page.locator("article").filter({
    has: page.getByText(label, { exact: true })
  }).first();

  return (await card.getByText(/^-?\d+(\.\d+)? dB$/).first().textContent())?.trim();
}

test("workbench supports preset switching and quick insert", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByText("Guided Acoustic Calculator")).toBeVisible();
  await expect(page.getByText("212.5 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await page.getByLabel("Surface type").selectOption("floor");
  await expect(page.getByText("No layers yet").first()).toBeVisible();
  await expect(page.getByText("Solver order follows the list exactly, from walking side to ceiling side.")).toBeVisible();
  await expect(page.getByText("Blank thickness rows stay parked until they are valid.")).toBeVisible();
  await expect(page.getByText("Adjacent identical live rows collapse into one solver layer.")).toBeVisible();

  await loadGuidedSample(page, "Floor Study");

  await expect(page.getByText("Floor", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("219 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);
  await expect(page.getByText("Editor row numbers match preview row numbers.").first()).toBeVisible();
  await expect(page.getByText("Preview row 1 of 4", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Review warnings", { exact: true }).first()).toBeVisible();

  await page.getByLabel("Common layer").selectOption("vinyl_flooring");
  await page.getByRole("button", { name: /Add common layer/i }).click();

  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(5);
  await expect(page.getByText("223 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("DeltaLw", { exact: true }).first()).toBeVisible();
});

test("guided floor flow exposes floor roles and marks only the relevant context inputs", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  await expect(page.getByLabel("Floor role")).toHaveCount(4);
  await expect(page.getByLabel("Floor role").first()).toHaveValue("floor_covering");

  await page.getByLabel("Project context").selectOption("field_between_rooms");

  await expect(page.getByText("Required now").first()).toBeVisible();
  await expect(page.getByText("Optional now").first()).toBeVisible();
  const requiredBucket = page
    .locator("section")
    .filter({ has: page.getByText("These values are on the active route and directly change whether the current read is defensible.") })
    .first();
  const optionalBucket = page
    .locator("section")
    .filter({ has: page.getByText("These inputs are relevant on nearby routes, but they do not block the current core read.") })
    .first();
  await expect(requiredBucket.getByText("Partition width (mm)", { exact: true })).toBeVisible();
  await expect(requiredBucket.getByText("Partition height (mm)", { exact: true })).toBeVisible();
  await expect(optionalBucket.getByText("Receiving room volume (m³)", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("RT60 (s)")).toHaveCount(0);
});

test("guided floor flow surfaces material-aware thickness guidance inline", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await expect(page.getByText("Typical band 25 to 90 mm for Mineral Screed in the floating screed role.").first()).toBeVisible();

  await page.getByLabel("Thickness").nth(1).fill("8");

  await expect(
    page.getByText(
      "Layer 2 thickness 8 mm is outside the guided sanity band of 25 to 90 mm for Mineral Screed in the floating screed role. Check units, role assignment, or split the build-up into separate layers if needed."
    ).first()
  ).toBeVisible();
});

test("guided result rail explains which next inputs unlock parked outputs", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await page.getByLabel("Project context").selectOption("building_prediction");
  await page.getByPlaceholder("e.g. 3600", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 2800", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 2", { exact: true }).fill("");
  await page.getByPlaceholder("e.g. 42", { exact: true }).first().fill("");
  await page.getByPlaceholder("e.g. 42", { exact: true }).nth(1).fill("");
  await page.getByPlaceholder("e.g. 0.6", { exact: true }).fill("");

  await expect(page.getByText("Unlock parked outputs", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Enter partition width and height", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Enter impact K correction", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Field airborne reads need the separating element width and height before this route can defend them.").first()).toBeVisible();
  await expect(page.getByText("Field impact outputs need the direct K correction before the route can carry L'n,w-style reads.").first()).toBeVisible();

  await page.getByPlaceholder("e.g. 3600", { exact: true }).fill("3600");
  await page.getByPlaceholder("e.g. 2800", { exact: true }).fill("2800");
  await page.getByPlaceholder("e.g. 2", { exact: true }).fill("2");

  await expect(page.getByText("Enter partition width and height", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Enter impact K correction", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Enter airborne room volume", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Enter airborne room volume and RT60", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Enter impact room volume", { exact: true }).first()).toBeVisible();
});

test("guided workbench keeps the same heavy-floor result when the middle layer reaches the same final thickness through different edit paths", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await page.getByLabel("Thickness").nth(1).fill("20");
  await page.getByLabel("Thickness").nth(1).fill("100");
  await expect(page.getByText("266 mm total thickness", { exact: true }).first()).toBeVisible();
  const editedPathValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByLabel("Surface type").selectOption("floor");
  await loadGuidedSample(page, "Impact Floor");
  await page.getByLabel("Thickness").nth(1).fill("100");
  await expect(page.getByText("266 mm total thickness", { exact: true }).first()).toBeVisible();
  const directPathValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(editedPathValue).toBeTruthy();
  expect(editedPathValue).toBe(directPathValue);
});

test("guided workbench distinguishes editor rows from solver layers when identical live rows collapse", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await page.getByLabel("Common layer").selectOption("screed");
  await page.getByRole("button", { name: /Add common layer/i }).click();
  await page.getByLabel("Floor role").last().selectOption("floating_screed");
  await page.getByLabel("Move layer 5 up").click();
  await page.getByLabel("Move layer 4 up").click();

  await expect(page.getByText("5 live rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("5 editor rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 solver layers", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("1 adjacent duplicate live row collapses before calculation.").first()).toBeVisible();
  await expect(page.getByText("5 live rows collapse to 4 solver layers before the live calculation.").first()).toBeVisible();
});

test("guided workbench stays usable with a 10-layer stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  for (let index = 0; index < 6; index += 1) {
    await page.getByLabel("Common layer").selectOption("vinyl_flooring");
    await page.getByRole("button", { name: /Add common layer/i }).click();
  }

  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(10);
  await expect(page.getByLabel("Floor role")).toHaveCount(10);
  await expect(page.getByText("10 layers", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Move rows only when the physical build-up changes.")).toBeVisible();
  await expect(page.getByText("Preview row 10 of 10", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read the outputs" })).toBeVisible();
});

test("guided workbench keeps the live result stable when an incomplete extra row is left in the stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const baselineValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await page.getByRole("button", { name: /Add layer/i }).click();
  await page.getByLabel("Thickness").last().fill("");

  await expect(page.getByText(/Layer 5 is missing a valid thickness/i).first()).toBeVisible();
  const withBlankRowValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(baselineValue).toBeTruthy();
  expect(withBlankRowValue).toBe(baselineValue);
});

test("guided workbench reports live and parked row counts in the stack summary", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await expect(page.getByText("Solver branch", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Heavy floating floor", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Scoped estimate", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Published family blend · reinforced concrete/i).first()).toBeVisible();
  await expect(page.getByText("4 live rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("No parked rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live · 0 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live rows used", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Every visible row currently contributes to this read.").first()).toBeVisible();
  await expect(page.getByText("Read posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Read this as a supported floor estimate, not as a measured claim.").first()).toBeVisible();
  await expect(page.getByText("Ready now", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Unsupported on lane", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Unsupported on this lane", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("These outputs stay visible, but the current solver lane cannot defend them on this topology.").first()
  ).toBeVisible();
  await expect(page.getByText("Parked by current route", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: /Add layer/i }).click();
  await page.getByLabel("Thickness").last().fill("");

  await expect(page.getByText("4 live rows", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("1 parked row", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live · 1 parked", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("4 live rows used", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("1 parked row stays visible in the draft stack but does not affect this read.").first()).toBeVisible();
});

test("guided workbench keeps the decision basis rail visible on the main result surface", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await page.getByLabel("Project context").selectOption("building_prediction");

  await expect(page.getByRole("heading", { name: "Validation corridor at a glance" })).toBeVisible();
  await expect(page.getByText("Decision basis", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/selected route note/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Open method detail/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Open diagnostics/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Open proposal/i })).toBeVisible();

  await page.getByRole("button", { name: /Open method detail/i }).click();
  await expect(page.getByRole("heading", { name: "Why this route is active" })).toBeVisible();
});

test("guided workbench packages the live result into a client-facing proposal surface", async ({ page }) => {
  test.slow();
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await page.getByRole("tab", { name: "Proposal" }).click();
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
  await expect(page.getByText("Output coverage register", { exact: true })).toBeVisible();
  await expect(page.getByText("Issue sequence register", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Reserve next issue no/i })).toBeVisible();
  await expect(page.getByText(/ready · .* parked · .* unsupported/i).first()).toBeVisible();
  await expect(page.getByText(/Dynamic airborne anchor|Exact floor family|Source posture/).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Download branded PDF/i })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Open print view/i })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Copy proposal summary/i })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Print \/ save PDF/i })).toBeEnabled();

  const pdfResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/proposal-pdf") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Download branded PDF/i }).click();
  const pdfResponse = await pdfResponsePromise;
  expect(pdfResponse.status()).toBe(200);
  expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");

  const printViewPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Open print view/i }).click();
  const printView = await printViewPromise;
  await printView.waitForLoadState("domcontentloaded");

  await expect(printView.getByRole("heading", { name: "Official issue preview" })).toBeVisible();
  await expect(printView.getByText("Issue dossier", { exact: true })).toBeVisible();
  await expect(printView.getByRole("heading", { name: "Audit posture at a glance" })).toBeVisible();
  await expect(printView.getByText("Validation corridor package", { exact: true })).toBeVisible();
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
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Solver Rationale Appendix", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Airborne lane", { exact: true }).first()
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Impact lane", { exact: true }).first()
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
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Signature and Issue Authority", { exact: true })
  ).toBeVisible();
  await expect(
    printView.frameLocator('iframe[title="Proposal print preview frame"]').getByText("Citation Appendix", { exact: true })
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

  await page.getByRole("tab", { name: "Proposal" }).click();
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

  await page.getByRole("tab", { name: "Proposal" }).click();
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

  await expect(page.getByText("Machinity Istanbul office", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Logo saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Set default/i }).click();
  await expect(page.getByText("Default office", { exact: true }).first()).toBeVisible();

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

  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("tab", { name: "Proposal" }).click();

  await expect(page.getByLabel("Consultant company")).toHaveValue("Machinity Acoustic Consultants");
  await expect(page.getByLabel("Template profile")).toHaveValue("developer");
  await expect(page.getByLabel("Prepared by")).toHaveValue("O. Tuna");
  await expect(page.getByLabel("Issue code prefix")).toHaveValue("MIA");
  await expect(page.getByText("Matched preset", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Issue purpose")).toHaveValue("Tender review and design coordination");
  await expect(page.getByLabel("Validity note")).toHaveValue("Budget pricing valid for 21 calendar days.");
  await expect(page.getByText("Active on this issue", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /Delete/i }).first().click({ force: true });
  await expect(page.getByText("No local company profiles yet.")).toBeVisible();
});

test("guided workbench can export and re-import the proposal company profile library", async ({ page }, testInfo) => {
  test.slow();
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  await page.getByRole("tab", { name: "Proposal" }).click();
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
  await expect(page.getByText("Machinity Export Office", { exact: true }).first()).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Export library JSON/i }).click()
  ]);
  expect(download.suggestedFilename()).toBe("dynecho-proposal-company-profiles.json");
  const exportedLibraryPath = testInfo.outputPath("dynecho-proposal-company-profiles.json");
  await download.saveAs(exportedLibraryPath);
  await expect(page.getByText("Company profile library exported", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Delete/i }).first().click({ force: true });
  await expect(page.getByText("No local company profiles yet.")).toBeVisible();

  await page.getByLabel("Consultant company").fill("Temporary Import Check");
  await page.getByLabel("Template profile").selectOption("lab_ready");
  await page.getByLabel("Prepared by").fill("Temporary Operator");
  await page.getByLabel("Issue purpose").fill("Temporary import purpose");
  await page.getByLabel("Validity note").fill("Temporary import validity");
  await page.getByRole("button", { name: /Clear logo/i }).click();

  await page.locator('input[type="file"][accept="application/json,.json"]').setInputFiles(exportedLibraryPath);
  await expect(page.getByText("Company profile library imported", { exact: true })).toBeVisible();
  await expect(page.getByText("Machinity Export Office", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Logo saved", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /Apply profile/i }).first().click();

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
  await page.getByLabel("Project context").selectOption("building_prediction");

  await page.getByRole("tab", { name: "Method detail" }).click();

  await expect(page.getByRole("heading", { name: "Why this route is active" })).toBeVisible();
  await expect(page.getByText("Validation corridor", { exact: true })).toBeVisible();
  await expect(page.getByText("Active lane notes", { exact: true })).toBeVisible();
  await expect(page.getByText("Visible stack on this route", { exact: true })).toBeVisible();
  await expect(page.getByText("Airborne lane", { exact: true })).toBeVisible();
  await expect(page.getByText("Impact lane", { exact: true })).toBeVisible();
  await expect(page.getByText("What still blocks parked outputs")).toBeVisible();
  await expect(page.getByText("Enter partition width and height").first()).toBeVisible();
  await expect(page.getByText("Enter impact K correction").first()).toBeVisible();
  await expect(page.getByText("Current caution log")).toBeVisible();
  await expect(page.getByText("Reading discipline")).toBeVisible();
});

test("guided diagnostics keeps provenance and trace surfaces visible without leaving the guided flow", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");
  await page.getByLabel("Project context").selectOption("building_prediction");

  await page.getByRole("tab", { name: "Diagnostics" }).click();

  await expect(page.getByRole("heading", { name: "Provenance, confidence, and advanced traces" })).toBeVisible();
  await expect(page.getByText("Validation corridor package", { exact: true })).toBeVisible();
  await expect(page.getByText("Decision trail signal", { exact: true })).toBeVisible();
  await expect(page.getByText("Source posture board", { exact: true })).toBeVisible();
  await expect(page.getByText("Selected route notes", { exact: true })).toBeVisible();
  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Predictor trace", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open operator desk/i })).toHaveAttribute("href", "/workbench?view=advanced");
});

test("guided exact floor presets keep exact-family notes visible without generic screening-only copy", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("dataholz_clt_dry_exact");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Exact evidence", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Read posture", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("This route is anchored by exact or official source evidence instead of a screening-only estimate.").first()
  ).toBeVisible();
  await expect(
    page.getByText(
      "Primary floor-family Rw and Ln,w companions come from the curated exact match. STC, C, and Ctr stay on the local airborne curve when shown, so read them as curve-derived companions."
    ).first()
  ).toBeVisible();
  await expect(page.getByText(/^Curated exact floor-system match active:/).first()).toBeVisible();
  await expect(
    page.getByText("Screening estimate only. This result is coming from the local calibrated seed lane.", { exact: true })
  ).toHaveCount(0);

  await page.getByRole("tab", { name: "Proposal" }).click();
  await expect(page.getByText("Source citations", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open source" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open source" }).first()).toHaveAttribute("href", /dataholz\.eu|https?:\/\//);
});

test("guided bound floor presets keep the next action on evidence tightening", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("ubiq_open_web_300_bound");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Conservative bound", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Prefer exact evidence", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("The current lane is conservative support only. Prefer an exact or narrower supported family before treating this as a delivery-ready result.").first()
  ).toBeVisible();
});

test("guided steel crossover bound can lock the support form into a narrower family corridor", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("ubiq_steel_300_unspecified_bound");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Conservative bound", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Fix support form", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(
      "This lightweight-steel bound lane is still conservative because the live stack leaves the carrier open between steel joist / purlin and open-web / rolled steel. Fix the base-structure row to one support form so DynEcho can stay inside the narrower FL-32 or FL-33 family-bound corridor."
    ).first()
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toBeVisible();

  await page.getByRole("button", { name: "Set open-web / rolled carrier" }).click();

  await expect(page.getByText("Fix support form", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Topology gap", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Prefer exact evidence", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toHaveCount(0);
});

test("guided converged 200 mm steel bound stays off the support-form gap lane", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("ubiq_steel_200_unspecified_bound");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Conservative bound", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Prefer exact evidence", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Fix support form", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Topology gap", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Set open-web / rolled carrier" })).toHaveCount(0);
  await expect(page.getByText(/support form was left unspecified/i)).toHaveCount(0);
});

test("guided steel suspended preset keeps the fallback posture explicit while flagging the remaining topology gap", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("steel_suspended_fallback");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Low-confidence fallback", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Scoped estimate", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Solver branch", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Suspended ceiling only", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(/This is the final published-family fallback, so treat it as a last-resort estimate rather than a narrow solver match\./i).first()
  ).toBeVisible();
  await expect(
    page.getByText(/Final published-family fallback on the suspended ceiling only topology/i).first()
  ).toBeVisible();
  await expect(page.getByText("Topology gap", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Topology still broad", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(/model the resilient layer as its own live row and add the dry-deck, screed, or upper-fill package above the support/i).first()
  ).toBeVisible();
});

test("guided timber bare low-confidence preset keeps the broad fallback and exposed companions explicit", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("timber_bare_impact_only_fallback");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await expect(page.getByText("Validation posture", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Low-confidence fallback", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Solver branch", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Bare floor", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(
      /DynEcho is now exposing the published-family airborne companions on the same low-confidence lane/i
    ).first()
  ).toBeVisible();
  await expect(
    page.getByText("Airborne companion carried on the active floor lane.").first()
  ).toBeVisible();
  await expect(page.getByText("Combined weighted impact result with CI carry-over.").first()).toBeVisible();
  await expect(page.getByText("Add the ceiling package", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(
      "This bare-floor timber lane is still broad because the live stack only pins down the joist deck and floor finish. Add the ceiling board row, then choose whether that board sits direct to the joists or on furring channels. If mineral wool exists below, add it as a ceiling-fill row so DynEcho can move into a narrower Knauf timber corridor."
    ).first()
  ).toBeVisible();
});

test("guided timber fallback helper can move the stack into a narrower timber family lane", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await page.getByLabel("Sample assembly").selectOption("timber_bare_impact_only_fallback");
  await page.getByRole("button", { name: /Load sample/i }).click();

  await page.getByRole("button", { name: "Add direct ceiling board" }).click();

  await expect(page.getByText("Low-confidence fallback", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Scoped estimate", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Add the ceiling package", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Topology gap", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText("Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.").first()
  ).toBeVisible();
});

test("guided route signals change with empty, incomplete, and role-missing floor states", async ({ page }) => {
  await openFloorGuidedFlow(page);

  await expect(page.getByText("Add the first layer", { exact: true })).toBeVisible();
  await expect(page.getByText("Waiting for layers", { exact: true })).toBeVisible();

  await loadGuidedSample(page, "Floor Study");

  await expect(page.getByText("Review warnings", { exact: true }).first()).toBeVisible();

  await page.getByLabel("Floor role").last().selectOption("");
  await expect(page.getByText("Tag floor roles", { exact: true })).toBeVisible();

  await page.getByLabel("Thickness").last().fill("");
  await expect(page.getByText("Finish thickness", { exact: true })).toBeVisible();
});

test("guided floor rows spotlight the matching preview and legend entries", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Floor Study");

  await expect(page.getByText("Hover or focus a row to spotlight it here.").first()).toBeVisible();

  await page.getByTestId("editor-row-2").hover();
  await expect(page.getByTestId("editor-row-2")).toHaveAttribute("data-active", "true");
  await expect(page.getByTestId("preview-row-2")).toHaveAttribute("data-active", "true");
  await expect(page.getByTestId("legend-row-2")).toHaveAttribute("data-active", "true");
  await expect(page.getByText("Focused editor row is spotlighted here.").first()).toBeVisible();

  await page.locator('[data-testid="editor-row-3"] input[placeholder="mm"]').focus();
  await expect(page.getByTestId("preview-row-3")).toHaveAttribute("data-active", "true");
  await expect(page.getByTestId("legend-row-3")).toHaveAttribute("data-active", "true");
  await expect(page.getByTestId("preview-row-2")).toHaveAttribute("data-active", "false");
});

test("guided workbench keeps a moved blank row parked even after it is inserted into the middle of the stack", async ({ page }) => {
  await openFloorGuidedFlow(page);
  await loadGuidedSample(page, "Impact Floor");

  const baselineValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  await page.getByRole("button", { name: /Add layer/i }).click();
  await page.getByTestId("editor-row-5").locator('input[placeholder="mm"]').fill("");
  await page.getByTestId("editor-row-5").getByLabel("Move layer 5 up").click();
  await page.getByTestId("editor-row-4").getByLabel("Move layer 4 up").click();

  await expect(page.getByTestId("editor-row-3")).toHaveAttribute("data-ready", "false");
  await expect(page.getByTestId("preview-row-3")).toHaveAttribute("data-ready", "false");
  await expect(page.getByTestId("legend-row-3")).toHaveAttribute("data-ready", "false");
  await expect(page.getByTestId("editor-row-3").getByText("Parked", { exact: true }).first()).toBeVisible();

  const withMovedBlankRowValue = await readPrimaryGuidedMetric(page, "Primary floor read");

  expect(baselineValue).toBeTruthy();
  expect(withMovedBlankRowValue).toBe(baselineValue);
});

test("guided wall flow keeps the wall lane explicit and floor-only controls out of view", async ({ page }) => {
  await openWallGuidedFlow(page);
  await loadGuidedSample(page, "Wall Study");

  await expect(page.getByLabel("Floor role")).toHaveCount(0);
  const solverBranchCard = page.locator("article").filter({ has: page.getByText("Solver branch", { exact: true }) }).first();
  const validationCard = page.locator("article").filter({ has: page.getByText("Validation posture", { exact: true }) }).first();
  await expect(solverBranchCard).toBeVisible();
  await expect(solverBranchCard).toContainText("Lined Massive Wall");
  await expect(solverBranchCard).toContainText("Mass Law anchor");
  await expect(validationCard).toBeVisible();
  await expect(validationCard).toContainText("Scoped estimate");
  await expect(page.getByText("Solver order follows the list exactly, from Side A to Side B.")).toBeVisible();
  await expect(page.getByText("Row 1 starts on Side A.").first()).toBeVisible();
  await expect(page.getByText("Preview row 4 of 4", { exact: true })).toBeVisible();
  await expect(page.getByText("Review warnings", { exact: true }).first()).toBeVisible();
});

test("guided wall field routes keep airborne corridor language explicit instead of floor-family copy", async ({ page }) => {
  await openWallGuidedFlow(page);
  await loadGuidedSample(page, "Wall Study");
  await page.getByLabel("Project context").selectOption("field_between_rooms");

  const decisionBasis = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Validation corridor at a glance" })
  }).first();

  await expect(decisionBasis.getByText("Airborne lane", { exact: true })).toBeVisible();
  await expect(decisionBasis.getByText("Route posture", { exact: true })).toBeVisible();
  await expect(decisionBasis.getByText("Solver spread", { exact: true })).toBeVisible();
  await expect(decisionBasis.getByText("Field route", { exact: true })).toBeVisible();
  await expect(decisionBasis.getByText("Active family", { exact: true })).toHaveCount(0);
  await expect(decisionBasis.getByText("Tolerance band", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: /Open method detail/i }).click();
  await expect(page.getByRole("heading", { name: "Why this route is active" })).toBeVisible();
  await expect(page.getByText("Field route", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Active family", { exact: true })).toHaveCount(0);
});

test("workbench remains usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Build the layer stack" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read the outputs" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Add layer/i })).toBeVisible();
  await page.getByRole("tab", { name: "Diagnostics" }).click();
  await expect(page.getByRole("link", { name: /Open operator desk/i })).toBeVisible();
});

test("workbench keeps the guided flow focused while still exposing the advanced desk", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByText("Current study")).toBeVisible();
  await expect(page.getByText("Live calculation ledger")).toBeVisible();
  await expect(page.getByText("Primary wall read")).toBeVisible();
  await expect(page.getByText("Supporting metrics")).toBeVisible();
  await page.getByRole("tab", { name: "Diagnostics" }).click();
  await expect(page.getByRole("link", { name: /Open operator desk/i })).toHaveAttribute(
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

  await expect(page.getByRole("heading", { name: "Ln,w and DeltaLw" })).toBeVisible();
  await expect(page.getByText("Scoped live").first()).toBeVisible();
  await expect(lnwCard.getByText(/^50 dB$/)).toBeVisible();
  await expect(deltaLwCard.getByText(/^N\/A$/)).toBeVisible();
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
  await expect(tracePanel.getByText("predictor heavy concrete published upper treatment estimate").first()).toBeVisible();
  await expect(tracePanel.getByText(/Implemented formula estimate is active/i)).toBeVisible();
  await expect(tracePanel.getByText(/Implemented family estimate is active/i)).toBeVisible();
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
  await expect(page.getByText(/Research-tracked outputs are active too: IIC/i)).toBeVisible();
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
  await expect(page.getByText(/Requested but unresolved on the current path: .*DeltaLw/i)).toBeVisible();
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
  const tracePanel = page.locator("section, article, div").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  });

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
  const tracePanel = page.locator("section, article, div").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  });

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

  const tracePanel = page.locator("section, article, div").filter({
    has: page.getByRole("heading", { name: "Predictor status and evidence trace" })
  });
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
  await expect(tracePanel.getByText("Field path trace")).toBeVisible();
  await expect(tracePanel.getByText("Support envelope")).not.toBeVisible();
  await expect(page.getByText(/Current direct-path offset is 1 dB before flanking energy summation/i)).toBeVisible();
  await expect(page.getByText(/Family-aware flanking path models were applied for: reinforced concrete/i)).toBeVisible();
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

test("workbench tracks field-risk flags and updates the delivery context", async ({ page }) => {
  await gotoAdvancedWorkbench(page);

  await page.getByRole("button", { name: /Perimeter bridge risk/i }).click();
  await page.getByRole("button", { name: /Service penetrations open/i }).click();

  await expect(page.getByText("Field risk elevated")).toBeVisible();
  await expect(page.getByText("5 risk score")).toBeVisible();
  await expect(page.getByText(/Field risk board is elevated/i)).toBeVisible();
});
