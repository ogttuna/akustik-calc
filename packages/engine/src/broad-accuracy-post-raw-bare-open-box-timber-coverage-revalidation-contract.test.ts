import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_LANDED_GATE =
  "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTION_STATUS =
  "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_landed_no_runtime_selected_package_transfer_residual_expansion";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL =
  "floor open-box timber package-transfer residual expansion";

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const BOUNDARY_OUTPUTS = ["L'n,w", "L'nT,w", "R'w", "DnT,w", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts",
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const RAW_BARE_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_PACKAGE_LAYERS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const POST_RAW_BARE_OPEN_BOX_REVALIDATION_CONTRACT = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_LANDED_GATE,
  noRuntimeValueMovement: true,
  numericRuntimeBehaviorChange: false,
  previousCoverageRefresh: {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS
  },
  routeCardValueChange: false,
  selectedNextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const POST_RAW_BARE_OPEN_BOX_REVALIDATION_LANE_RANKING = [
  {
    id: "package_transfer_residual_expansion",
    nextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
    reason:
      "selected because raw-bare and finished package-transfer runtime lanes are now distinct and exact-only hybrid / mixed-staged same-family rows are the nearest remaining lab coverage gap",
    selectedNext: true
  },
  {
    id: "open_box_field_building_adapter",
    nextAction: "broad_accuracy_floor_open_box_timber_field_building_adapter_owner_plan",
    reason:
      "not selected until same-family lab residual expansion is owned; lab raw-bare and package-transfer values still cannot alias to field or building outputs",
    selectedNext: false
  },
  {
    id: "astm_iic_aiic_rating_curve_owner",
    nextAction: "broad_accuracy_floor_open_box_timber_astm_iic_aiic_rating_curve_owner_plan",
    reason:
      "not selected because ISO Ln,w/CI evidence and budgets cannot create ASTM IIC/AIIC ratings without a separate rating-curve owner",
    selectedNext: false
  },
  {
    id: "broad_source_crawl",
    nextAction: "blocked_until_narrow_owner_gap_requires_sources",
    reason:
      "not selected because this revalidation is local coverage ranking over already-ingested TUAS and formula lanes, not source acquisition",
    selectedNext: false
  },
  {
    id: "raw_bare_tolerance_retune",
    nextAction: "blocked_until_raw_bare_holdouts_exist",
    reason:
      "not selected because the raw-bare source-absent budgets remain not-measured design budgets with no new holdout evidence",
    selectedNext: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy post raw-bare open-box timber coverage revalidation contract", () => {
  it("lands a no-runtime revalidation and selects package-transfer residual expansion next", () => {
    expect(POST_RAW_BARE_OPEN_BOX_REVALIDATION_CONTRACT).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan",
      noRuntimeValueMovement: true,
      numericRuntimeBehaviorChange: false,
      previousCoverageRefresh: {
        landedGate: "broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan",
        selectedNextAction: "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan",
        selectedNextFile:
          "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts",
        selectionStatus:
          "broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_landed_selected_post_raw_bare_revalidation"
      },
      routeCardValueChange: false,
      selectedNextAction: "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts",
      selectedNextLabel: "floor open-box timber package-transfer residual expansion",
      selectionStatus:
        "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_landed_no_runtime_selected_package_transfer_residual_expansion",
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("revalidates the raw-bare coverage refresh summary without changing matrix posture", () => {
    const coverage = buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract();

    expect(coverage.summary).toEqual({
      basisBoundaryRowIds: ["floor.open_box_timber_field_building.boundary"],
      correctlyBlockedRowIds: [
        "floor.open_box_timber_partial_package.boundary",
        "floor.open_box_timber_wrong_support_open_web.boundary",
        "floor.open_box_timber_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: ["floor.open_box_timber_r5b_exact_precedence.lab"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 3,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        none: 3,
        separate_lane_boundary: 1
      },
      noRuntimeValueMovement: true,
      packageTransferSeparateLaneRowIds: ["floor.open_box_timber_package_transfer_separate_lane.lab"],
      rankedFollowupRowIds: ["floor.open_box_timber_post_raw_bare_revalidation.next"],
      rowCount: 10,
      selectedNextAction: "broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts",
      selectedNextLabel: "post raw-bare open-box timber coverage revalidation",
      supportedRuntimeRowIds: [
        "floor.open_box_timber_raw_bare_370.lab",
        "floor.open_box_timber_raw_bare_split_185_185.lab",
        "floor.open_box_timber_raw_bare_220.lab"
      ]
    });
  });

  it("keeps lab raw-bare, package-transfer, and exact-source values unchanged while Gate BL opens field companions", () => {
    const raw370 = calculateAssembly(RAW_BARE_370, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const raw220 = calculateAssembly(RAW_BARE_220, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const exact = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const boundaries = calculateAssembly(RAW_BARE_370, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: BOUNDARY_OUTPUTS
    });

    expect(raw370.impact).toMatchObject({
      CI: -1.1,
      CI50_2500: 3.1,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(raw370.floorSystemRatings).toMatchObject({ C: -1.4, Ctr: -5.8, Rw: 42.3 });
    expect(raw370.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual([
      ["Rw", 8],
      ["C", 2.5],
      ["Ctr", 3.5],
      ["Ln,w", 10],
      ["CI", 3],
      ["CI,50-2500", 4],
      ["Ln,w+CI", 10.5]
    ]);

    expect(raw220.impact).toMatchObject({
      CI: -0.9,
      CI50_2500: 3.4,
      LnW: 91.1,
      LnWPlusCI: 90.2,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(raw220.floorSystemRatings).toMatchObject({ C: -1.6, Ctr: -6.2, Rw: 38.1 });

    expect(packageTransfer.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(packageTransfer.floorSystemRatings).toMatchObject({ Rw: 66, RwCtr: 62.1 });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact).toMatchObject({ CI: 0, CI50_2500: 3, LnW: 44, basis: "open_measured_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 75, basis: "open_measured_floor_system_exact_match" });

    expect(boundaries.impact).toMatchObject({
      LPrimeNT50: 92.3,
      LPrimeNTw: 89.2,
      LPrimeNW: 91.2,
      LnW: 88.2,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(boundaries.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(boundaries.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(boundaries.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "IIC", "AIIC"]);
  });

  it("uses exact-only hybrid policy evidence to choose package-transfer residual expansion without admitting runtime", () => {
    const policy = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();

    expect(policy.landedGate).toBe(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE);
    expect(policy.selectionStatus).toBe(
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
    );
    expect(policy.noRuntimeValueMovement).toBe(true);
    expect(policy.runtimePromotionAllowedInGate).toBe(false);
    expect(policy.excludedRuntimeAnchorSourceIds).toEqual([
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r9b_open_box_timber_measured_2026",
      "tuas_r2c_open_box_timber_measured_2026",
      "tuas_r10a_open_box_timber_measured_2026"
    ]);
    expect(policy.policyRows.map((row) => row.policyDecision)).toEqual([
      "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required",
      "partial_finish_no_finish_residual_boundary",
      "screed_only_hybrid_residual_boundary",
      "lower_ceiling_interaction_missing_mass_boundary",
      "mixed_staged_upper_package_owner_gap"
    ]);

    expect(POST_RAW_BARE_OPEN_BOX_REVALIDATION_LANE_RANKING.find((lane) => lane.selectedNext)).toMatchObject({
      id: "package_transfer_residual_expansion",
      nextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION
    });
    expect(POST_RAW_BARE_OPEN_BOX_REVALIDATION_LANE_RANKING.filter((lane) => !lane.selectedNext).map((lane) => lane.id)).toEqual([
      "open_box_field_building_adapter",
      "astm_iic_aiic_rating_curve_owner",
      "broad_source_crawl",
      "raw_bare_tolerance_retune"
    ]);
  });

  it("keeps docs and current-gate runner aligned with the post raw-bare revalidation closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_BOX_TIMBER_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("package-transfer residual expansion");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare open-box timber");
      expect(normalizedContent, path).toContain("rw 42.3");
      expect(normalizedContent, path).toContain("ln,w 88.2");
      expect(normalizedContent, path).toContain("ln,w 50.8");
      expect(normalizedWhitespaceContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts");
  });
});
