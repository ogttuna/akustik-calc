import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh";
import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_LANDED_GATE =
  "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan";

const BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTION_STATUS =
  "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry";

const BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_registry_plan";

const BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-registry-contract.test.ts";

const BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL =
  "layer combination resolver registry";

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "DnT,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const BUILDING_PREDICTION_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor.ts",
  "packages/engine/src/helper-only-timber-open-web-impact-stack-estimate.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/lightweight-steel-open-web-direct-fixed-lining-estimate.ts",
  "packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
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
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

const HELPER_ONLY_OPEN_BOX_TIMBER = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_TIMBER_JOIST = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 120 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB_MISSING_BOARD = [
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB_ROLELESS = [
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "rockwool", thicknessMm: 145 },
  { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_PARTIAL_UPPER_PACKAGE = [
  ...HELPER_ONLY_OPEN_WEB,
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_PACKAGE = [
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

const RAW_OPEN_BOX_TIMBER = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
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

const POST_HELPER_ONLY_REVALIDATION_CONTRACT = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_LANDED_GATE,
  noRuntimeValueMovement: true,
  numericRuntimeBehaviorChange: false,
  previousCoverageRefresh: {
    landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE,
    selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
    selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS
  },
  routeCardValueChange: false,
  selectedNextAction: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const POST_HELPER_ONLY_REVALIDATION_LANE_RANKING = [
  {
    id: "layer_combination_resolver_registry",
    nextAction: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION,
    reason:
      "selected because helper-only, raw-bare, direct-fixed, supported-band, package-transfer, field/building, and ASTM/IIC boundaries now repeat the same candidate-declaration pattern and need a shared resolver contract before another narrow runtime lane",
    selectedNext: true
  },
  {
    id: "helper_only_holdout_acquisition",
    nextAction: "broad_accuracy_floor_helper_only_holdout_acquisition_plan",
    reason:
      "not selected because source acquisition can tighten later calibration but does not improve arbitrary source-absent layer-combination routing by itself",
    selectedNext: false
  },
  {
    id: "helper_only_field_building_adapter",
    nextAction: "broad_accuracy_floor_helper_only_field_building_adapter_owner_plan",
    reason:
      "not selected because helper-only element-lab Rw/Ln,w still cannot alias to field/building outputs without the shared basis and required-input registry",
    selectedNext: false
  },
  {
    id: "astm_iic_aiic_rating_curve_owner",
    nextAction: "broad_accuracy_floor_helper_only_astm_iic_aiic_rating_curve_owner_plan",
    reason:
      "not selected because ISO impact values still need a separate ASTM rating procedure owner and must be represented as a distinct candidate basis",
    selectedNext: false
  },
  {
    id: "broad_source_crawl",
    nextAction: "blocked_until_registry_identifies_source_required_holdouts",
    reason:
      "not selected because this revalidation is a calculator routing closeout; exact rows remain useful evidence, not the product",
    selectedNext: false
  },
  {
    id: "tolerance_retune",
    nextAction: "blocked_until_measured_helper_only_holdouts_exist",
    reason:
      "not selected because no measured helper-only holdout entered the evidence set and the current budgets remain source-absent design budgets",
    selectedNext: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectHelperOnlyPins(
  layers: readonly LayerInput[],
  expected: {
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly Rw: number;
    readonly lnwBudgetToleranceDb: number;
    readonly rwBudgetToleranceDb: number;
  }
): void {
  const result = calculateAssembly(layers, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.impact).toMatchObject({
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    Rw: expected.Rw,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Rw")).toMatchObject({
    notMeasuredEvidence: true,
    toleranceDb: expected.rwBudgetToleranceDb
  });
  expect(result.impact?.errorBudgets?.find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w")).toMatchObject({
    notMeasuredEvidence: true,
    toleranceDb: expected.lnwBudgetToleranceDb
  });
  expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);
}

describe("broad accuracy post helper-only timber/open-web coverage revalidation contract", () => {
  it("lands no-runtime post-helper-only revalidation and selects the layer-combination resolver registry", () => {
    expect(POST_HELPER_ONLY_REVALIDATION_CONTRACT).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan",
      noRuntimeValueMovement: true,
      numericRuntimeBehaviorChange: false,
      previousCoverageRefresh: {
        landedGate: "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan",
        selectedNextAction: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan",
        selectedNextFile:
          "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts",
        selectionStatus:
          "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_landed_no_runtime_selected_post_helper_only_revalidation"
      },
      routeCardValueChange: false,
      selectedNextAction: "layer_combination_resolver_registry_plan",
      selectedNextFile: "packages/engine/src/layer-combination-resolver-registry-contract.test.ts",
      selectedNextLabel: "layer combination resolver registry",
      selectionStatus:
        "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry",
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("revalidates the helper-only coverage refresh matrix without changing row posture", () => {
    const coverage = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract();

    expect(coverage.summary).toEqual({
      basisBoundaryRowIds: ["floor.helper_only_field_building.boundary"],
      correctlyBlockedRowIds: [
        "floor.helper_only_missing_board.boundary",
        "floor.helper_only_roleless.boundary",
        "floor.helper_only_partial_upper_package.boundary",
        "floor.helper_only_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: ["floor.helper_only_exact_package_precedence.lab"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 4,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        none: 6,
        separate_lane_boundary: 5
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["floor.helper_only_post_coverage_revalidation.next"],
      rowCount: 18,
      selectedNextAction: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts",
      selectedNextLabel: "post helper-only timber/open-web impact stack coverage revalidation",
      separateLaneBoundaryRowIds: [
        "floor.helper_only_open_box_package_transfer_separate_lane.lab",
        "floor.helper_only_open_box_raw_bare_separate_lane.lab",
        "floor.helper_only_open_web_raw_bare_separate_lane.lab",
        "floor.helper_only_open_web_direct_fixed_separate_lane.lab",
        "floor.helper_only_open_web_supported_band_separate_lane.lab"
      ],
      supportedRuntimeRowIds: [
        "floor.helper_only_open_box_timber_370.lab",
        "floor.helper_only_open_box_timber_split_185_185.lab",
        "floor.helper_only_open_box_timber_fragmented_4x92_5.lab",
        "floor.helper_only_timber_joist_250.lab",
        "floor.helper_only_open_web_250.lab",
        "floor.helper_only_open_web_split_125_125.lab"
      ]
    });
  });

  it("keeps helper-only runtime pins and separate exact/package/formula lanes unchanged", () => {
    expectHelperOnlyPins(HELPER_ONLY_OPEN_BOX_TIMBER, {
      CI50_2500: 2.3,
      LnW: 59.6,
      Rw: 54.8,
      lnwBudgetToleranceDb: 10.5,
      rwBudgetToleranceDb: 8.5
    });
    expectHelperOnlyPins(HELPER_ONLY_TIMBER_JOIST, {
      CI50_2500: 3.5,
      LnW: 65.4,
      Rw: 47.3,
      lnwBudgetToleranceDb: 11.5,
      rwBudgetToleranceDb: 9.5
    });
    expectHelperOnlyPins(HELPER_ONLY_OPEN_WEB, {
      CI50_2500: 4,
      LnW: 59.6,
      Rw: 46.7,
      lnwBudgetToleranceDb: 10,
      rwBudgetToleranceDb: 9
    });

    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

    expect(exact.impact).toMatchObject({ CI: 0, CI50_2500: 3, LnW: 44, basis: "open_measured_floor_system_exact_match" });
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 75, basis: "open_measured_floor_system_exact_match" });
    expect(packageTransfer.impact).toMatchObject({ CI50_2500: 3.3, LnW: 50.8, basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS });
    expect(rawOpenBox.impact).toMatchObject({ CI50_2500: 3.1, LnW: 88.2, basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS });
    expect(rawOpenWeb.impact).toMatchObject({ CI50_2500: 5.2, LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(directFixed.impact).toMatchObject({ CI: -0.5, LnW: 77, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(supportedBand.impact).toMatchObject({ CI: -1.5, LnW: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });

    for (const separate of [exact, packageTransfer, rawOpenBox, rawOpenWeb, directFixed, supportedBand]) {
      expect(separate.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(separate.floorSystemEstimate?.impact.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    }
  });

  it("keeps incomplete topology, field/building, and ASTM/IIC outside helper-only runtime", () => {
    const missingBoard = calculateAssembly(HELPER_ONLY_OPEN_WEB_MISSING_BOARD, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const roleless = calculateAssembly(HELPER_ONLY_OPEN_WEB_ROLELESS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const partialUpper = calculateAssembly(HELPER_ONLY_PARTIAL_UPPER_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const fieldBuilding = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });

    for (const blocked of [missingBoard, roleless, partialUpper, fieldBuilding, astm]) {
      expect(blocked.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(blocked.floorSystemEstimate?.impact.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    }

    expect(fieldBuilding.supportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("ranks the resolver registry ahead of narrow holdouts, aliases, source crawl, and tolerance retune", () => {
    expect(POST_HELPER_ONLY_REVALIDATION_LANE_RANKING.find((lane) => lane.selectedNext)).toMatchObject({
      id: "layer_combination_resolver_registry",
      nextAction: BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION
    });
    expect(POST_HELPER_ONLY_REVALIDATION_LANE_RANKING.filter((lane) => !lane.selectedNext).map((lane) => lane.id)).toEqual([
      "helper_only_holdout_acquisition",
      "helper_only_field_building_adapter",
      "astm_iic_aiic_rating_curve_owner",
      "broad_source_crawl",
      "tolerance_retune"
    ]);
    expect(POST_HELPER_ONLY_REVALIDATION_LANE_RANKING.map((lane) => lane.reason).join(" ")).toContain(
      "candidate-declaration pattern"
    );
  });

  it("keeps docs and current-gate runner aligned with post-helper-only revalidation", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(
        BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_POST_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REVALIDATION_SELECTED_NEXT_FILE
      );
      expect(content, path).toContain(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(normalized, path).toContain("post-helper-only");
      expect(normalized, path).toContain("coverage revalidation");
      expect(normalized, path).toContain("layer combination resolver registry");
      expect(normalized, path).toContain("helper-only timber/open-web");
      expect(normalized, path).toContain("rw 54.8");
      expect(normalized, path).toContain("ln,w 59.6");
      expect(normalized, path).toContain("timber-joist");
      expect(normalized, path).toContain("open-web");
      expect(normalized, path).toContain("exact/package");
      expect(normalized, path).toContain("raw-bare");
      expect(normalized, path).toContain("direct-fixed");
      expect(normalized, path).toContain("supported-band");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts"
    );
  });
});
