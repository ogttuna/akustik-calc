import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract
} from "./broad-accuracy-floor-open-web-raw-bare-coverage-refresh";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_LANDED_GATE =
  "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTION_STATUS =
  "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_field_building_adapter_owner_plan";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts";

const BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL =
  "floor open-web field/building adapter owner";

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["L'n,w", "L'nT,w", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor.ts",
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/lightweight-steel-open-web-direct-fixed-lining-estimate.ts",
  "packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts",
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

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_400 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
] as const satisfies readonly LayerInput[];

const UBIQ_FL26_EXACT_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const OPEN_BOX_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const POST_RAW_BARE_OPEN_WEB_REVALIDATION_CONTRACT = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_LANDED_GATE,
  noRuntimeValueMovement: true,
  numericRuntimeBehaviorChange: false,
  previousCoverageRefresh: {
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS
  },
  routeCardValueChange: false,
  selectedNextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const POST_RAW_BARE_OPEN_WEB_REVALIDATION_LANE_RANKING = [
  {
    id: "open_web_field_building_adapter",
    nextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
    reason:
      "selected because raw-bare, exact package, direct-fixed, and supported-band open-web lab lanes are now bounded, while common field/building floor requests still need an explicit basis owner",
    selectedNext: true
  },
  {
    id: "carrier_only_holdout_acquisition",
    nextAction: "broad_accuracy_floor_open_web_raw_bare_carrier_only_holdout_acquisition_plan",
    reason:
      "not selected because narrow holdout acquisition can improve later calibration but must not block the source-absent calculator corridor or become broad source crawl",
    selectedNext: false
  },
  {
    id: "astm_iic_aiic_rating_curve_owner",
    nextAction: "broad_accuracy_floor_open_web_astm_iic_aiic_rating_curve_owner_plan",
    reason:
      "not selected because ISO Ln,w/CI lab evidence cannot create ASTM IIC/AIIC ratings without a separate rating procedure owner",
    selectedNext: false
  },
  {
    id: "broad_source_crawl",
    nextAction: "blocked_until_narrow_formula_or_owner_gap_requires_sources",
    reason:
      "not selected because this is a local calculator coverage revalidation over owned lanes, not internet/source measurement ingestion",
    selectedNext: false
  },
  {
    id: "raw_bare_tolerance_retune",
    nextAction: "blocked_until_source_owned_raw_bare_holdouts_exist",
    reason:
      "not selected because no new measured raw-bare open-web holdout entered the evidence set and the not-measured budgets remain explicit",
    selectedNext: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy post raw-bare open-web coverage revalidation contract", () => {
  it("lands a no-runtime revalidation and selects open-web field/building adapter ownership next", () => {
    expect(POST_RAW_BARE_OPEN_WEB_REVALIDATION_CONTRACT).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan",
      noRuntimeValueMovement: true,
      numericRuntimeBehaviorChange: false,
      previousCoverageRefresh: {
        landedGate: "broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan",
        selectedNextAction: "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan",
        selectedNextFile:
          "packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts",
        selectionStatus:
          "broad_accuracy_floor_open_web_raw_bare_coverage_refresh_landed_selected_post_raw_bare_open_web_revalidation"
      },
      routeCardValueChange: false,
      selectedNextAction: "broad_accuracy_floor_open_web_field_building_adapter_owner_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts",
      selectedNextLabel: "floor open-web field/building adapter owner",
      selectionStatus:
        "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("revalidates the raw-bare open-web coverage matrix without moving posture or values", () => {
    const coverage = buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract();

    expect(coverage.summary).toEqual({
      basisBoundaryRowIds: ["floor.open_web_raw_bare_field_building.boundary"],
      correctlyBlockedRowIds: [
        "floor.open_web_raw_bare_partial_package.boundary",
        "floor.open_web_raw_bare_deck_only.boundary",
        "floor.open_web_raw_bare_out_of_range.boundary",
        "floor.open_web_raw_bare_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: ["floor.open_web_raw_bare_ubiq_fl26_exact_precedence.lab"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 4,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        none: 4,
        separate_lane_boundary: 3
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["floor.open_web_raw_bare_post_revalidation.next"],
      rowCount: 14,
      selectedNextAction: "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts",
      selectedNextLabel: "post raw-bare open-web coverage revalidation",
      separateLaneRowIds: [
        "floor.open_web_raw_bare_direct_fixed_separate_lane.lab",
        "floor.open_web_raw_bare_supported_band_separate_lane.lab",
        "floor.open_web_raw_bare_wrong_support_open_box.boundary"
      ],
      supportedRuntimeRowIds: [
        "floor.open_web_raw_bare_300.lab",
        "floor.open_web_raw_bare_split_150_150.lab",
        "floor.open_web_raw_bare_fragmented_6x50.lab",
        "floor.open_web_raw_bare_400.lab"
      ]
    });
  });

  it("keeps raw-bare, exact, direct-fixed, supported-band, and wrong-family values pinned", () => {
    const raw300 = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const raw400 = calculateAssembly(RAW_OPEN_WEB_400, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const exact = calculateAssembly(UBIQ_FL26_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const wrongFamily = calculateAssembly(OPEN_BOX_WRONG_FAMILY, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });

    expect(raw300.impact).toMatchObject({
      CI: 1.8,
      CI50_2500: 5.2,
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(raw300.floorSystemRatings).toMatchObject({ C: -2.2, Ctr: -7.8, Rw: 32 });
    expect(raw300.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual([
      ["Rw", 9],
      ["C", 3],
      ["Ctr", 4.5],
      ["Ln,w", 12],
      ["CI", 4],
      ["CI,50-2500", 5],
      ["Ln,w+CI", 12.5]
    ]);

    expect(raw400.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 4.6,
      LnW: 92.8,
      LnWPlusCI: 94.1,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(raw400.floorSystemRatings).toMatchObject({ C: -2, Ctr: -7.5, Rw: 36.6 });

    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026");
    expect(exact.impact).toMatchObject({ CI: -2, LnW: 61, LnWPlusCI: 59, basis: "official_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 62, basis: "official_floor_system_exact_match" });

    expect(directFixed.impact).toMatchObject({ CI: -0.5, LnW: 77, LnWPlusCI: 76.5, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });

    expect(supportedBand.impact).toMatchObject({ CI: -1.5, LnW: 61.5, LnWPlusCI: 60, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });

    expect(wrongFamily.impact).toMatchObject({
      CI: -1,
      CI50_2500: 3.3,
      LnW: 89.4,
      LnWPlusCI: 88.4,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(wrongFamily.floorSystemRatings).toMatchObject({ C: -1.5, Ctr: -6, Rw: 40.5 });
  });

  it("keeps building and ASTM/IIC blocked while raw-bare field transfer is active", () => {
    const fieldBuilding = calculateAssembly(RAW_OPEN_WEB_300, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: ASTM_OUTPUTS });

    expect(fieldBuilding.impact).toMatchObject({
      LnW: 96,
      LPrimeNW: 99,
      LPrimeNTw: 97,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldBuilding.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(astm.impact).toBeNull();
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(POST_RAW_BARE_OPEN_WEB_REVALIDATION_LANE_RANKING.find((lane) => lane.selectedNext)).toMatchObject({
      id: "open_web_field_building_adapter",
      nextAction: BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION
    });
    expect(POST_RAW_BARE_OPEN_WEB_REVALIDATION_LANE_RANKING.filter((lane) => !lane.selectedNext).map((lane) => lane.id)).toEqual([
      "carrier_only_holdout_acquisition",
      "astm_iic_aiic_rating_curve_owner",
      "broad_source_crawl",
      "raw_bare_tolerance_retune"
    ]);
  });

  it("keeps docs and current-gate runner aligned with the post raw-bare open-web revalidation", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_POST_RAW_BARE_OPEN_WEB_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("floor open-web field/building adapter owner");
      expect(normalizedWhitespaceContent, path).toContain("post raw-bare open-web coverage revalidation");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare open-web");
      expect(normalizedContent, path).toContain("rw 32");
      expect(normalizedContent, path).toContain("ln,w 96");
      expect(normalizedContent, path).toContain("400 mm");
      expect(normalizedWhitespaceContent, path).toContain("exact ubiq");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("supported-band");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts");
  });
});
