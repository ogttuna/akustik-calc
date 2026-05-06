import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceLocatorProvenance,
  WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O
} from "./wall-triple-leaf-source-locator-provenance";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_O_HANDOFF.md"
] as const;

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

describe("wall triple-leaf source locator provenance Gate O", () => {
  it("lands full-curve retrieval and provenance QC no-runtime and selects Gate P source access", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_p_source_access_or_alternative_measured_row_acquisition_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("verifies the Uris 2006 locator identity without treating metadata as a numeric source curve", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.primaryLocator).toMatchObject({
      id: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame",
      sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799"
    });
    expect(evaluation.verifiedMetadataCheckCount).toBe(3);
    expect(evaluation.accessChecks.map((check) => check.id)).toEqual([
      "sciencedirect_article_page_public_summary",
      "doi_linkinghub_redirect",
      "crossref_doi_metadata_and_elsevier_tdm_links",
      "sciencedirect_pdf_route_local_http_403"
    ]);
    expect(
      evaluation.accessChecks.every(
        (check) => !check.fullOneThirdOctaveCurvesAvailableNow && !check.pageImageOrPlotBoxAvailableNow
      )
    ).toBe(true);
  });

  it("blocks digitization because full band vectors, PDF/page image, plot axes, and curve identity are missing", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.digitizationReadyNow).toBe(false);
    expect(evaluation.fullBandCurveReadyForDigitizationCount).toBe(0);
    expect(evaluation.sourceAccessReadyForRuntime).toBe(false);
    expect(evaluation.missingForRuntime.map((blocker) => blocker.id)).toEqual([
      "missing_full_band_vectors",
      "missing_page_image_or_pdf",
      "missing_axis_lock",
      "missing_curve_identity",
      "missing_rw_stc_derivation_owner",
      "fixed_weighted_index_penalty_not_curve",
      "missing_local_material_mapping"
    ]);
  });

  it("rejects the reported 7-8 dB weighted-index decrease as a reusable runtime correction", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const penaltyBlocker = evaluation.missingForRuntime.find(
      (blocker) => blocker.id === "fixed_weighted_index_penalty_not_curve"
    );

    expect(evaluation.fixedPenaltyRuntimePromotionRejected).toBe(true);
    expect(penaltyBlocker?.reason).toContain("not a reusable runtime penalty");
    expect(evaluation.runtimeImportSelectedNow).toBe(false);
  });

  it("carries the Gate N comparator/context split forward without promoting near-source rows", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const locatorIntake = evaluation.locatorIntakeEvaluation;

    expect(locatorIntake.selectedComparatorLocators.map((locator) => locator.id)).toEqual([
      "nrc_2024_internal_board_glass_fiber_92mm_source_family"
    ]);
    expect(locatorIntake.selectedEquivalenceContextLocators.map((locator) => locator.id)).toEqual([
      "uris_1999_rockwool_bulk_density_double_wall",
      "wang_2022_lightweight_double_leaf_stone_wool_glass_wool"
    ]);
    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(evaluation.evidencePromotion).toBe(false);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.failClosedStrategy).toBe("multileaf_screening_blend");
    expect(evaluation.numericRuntimeBehaviorChange).toBe(false);
    expect(evaluation.routeCardValueChange).toBe(false);
    expect(evaluation.outputCardStatusChange).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate O, Gate P, and the no-runtime provenance decision", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate O - Full Curve Retrieval and Provenance QC");
    expect(plan).toContain("Gate P - Source Access or Alternative Measured Row Acquisition");
    expect(plan).toContain("sciencedirect_pdf_route_local_http_403");
    expect(plan).toContain("fixed_weighted_index_penalty_not_curve");
  });
});
