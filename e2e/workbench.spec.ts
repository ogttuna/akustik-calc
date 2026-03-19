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

test("workbench supports preset switching and quick insert", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByText("Guided Acoustic Calculator")).toBeVisible();
  await expect(page.getByText("212.5 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await page.getByRole("button", { name: /Floor Impact and airborne companion metrics/i }).click();
  await expect(page.getByText("No layers yet").first()).toBeVisible();

  await page.getByRole("button", { name: /Floor Study/i }).click();

  await expect(page.getByText("Floor", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("219 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(4);

  await page.getByRole("button", { name: /Vinyl Flooring 4 mm starter thickness/i }).click();

  await expect(page.getByRole("button", { name: /^Remove$/ })).toHaveCount(5);
  await expect(page.getByText("223 mm total thickness", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("DeltaLw", { exact: true }).first()).toBeVisible();
});

test("workbench remains usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoSimpleWorkbench(page);

  await expect(page.getByRole("heading", { name: "Build the layer stack" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read the outputs" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Add layer/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open operator desk/i })).toBeVisible();
});

test("workbench keeps the guided flow focused while still exposing the advanced desk", async ({ page }) => {
  await gotoSimpleWorkbench(page);

  await expect(page.getByText("Current study")).toBeVisible();
  await expect(page.getByText("Live calculation ledger")).toBeVisible();
  await expect(page.getByText("Primary wall read")).toBeVisible();
  await expect(page.getByText("Supporting metrics")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open operator desk/i })).toHaveAttribute(
    "href",
    "/workbench?view=advanced"
  );
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
