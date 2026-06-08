import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh";
import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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

const LAB_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
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

const HELPER_ONLY_OPEN_BOX_TIMBER = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_SPLIT = [
  ...HELPER_ONLY_OPEN_BOX_TIMBER.slice(0, -1),
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_FRAGMENTS = [
  ...HELPER_ONLY_OPEN_BOX_TIMBER.slice(0, -1),
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 92.5 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 92.5 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 92.5 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 92.5 }
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

const HELPER_ONLY_OPEN_WEB_SAFE_SPLIT = [
  ...HELPER_ONLY_OPEN_WEB.slice(0, -1),
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 125 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 125 }
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
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
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

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor.ts",
  "packages/engine/src/helper-only-timber-open-web-impact-stack-estimate.ts",
  "apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface.ts",
  "apps/web/features/workbench/helper-only-timber-open-web-impact-stack-surface-parity.test.ts",
  "packages/engine/src/index.ts",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectHelperOnlyRuntime(
  layers: readonly LayerInput[],
  expected: {
    readonly budgets: readonly (readonly [string, number])[];
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly Ctr: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly structuralFamily: string;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate).toMatchObject({
    fitPercent: 100,
    kind: "family_archetype",
    structuralFamily: expected.structuralFamily
  });
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual(expected.budgets);
  expect(result.impact?.errorBudgets?.every((budget: ImpactErrorBudget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);

  return result;
}

describe("broad accuracy floor helper-only timber/open-web impact stack coverage refresh contract", () => {
  it("lands a no-runtime coverage matrix and selects post helper-only revalidation next", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "post_helper_only_revalidation",
        reason:
          "selected now because helper-only open-box, timber-joist, and open-web lower-treatment runtimes are surfaced and need one ranked ledger pass before another lane is promoted",
        selectedNow: true
      },
      {
        id: "helper_only_holdout_acquisition",
        reason:
          "not selected here because source acquisition can tighten later calibration but must not replace the current source-absent calculator lane",
        selectedNow: false
      },
      {
        id: "helper_only_field_building_adapter",
        reason:
          "not selected here because element-lab helper-only Rw/Ln,w cannot alias to field or building outputs without separate ISO 12354 owners",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason:
          "not selected here because ISO Ln,w/CI helper-only evidence cannot create ASTM IIC/AIIC ratings without a separate rating procedure owner",
        selectedNow: false
      },
      {
        id: "tolerance_retune",
        reason:
          "not selected here because no new measured helper-only holdout entered the evidence set and budgets remain not-measured source-absent design budgets",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes helper-only runtime, exact, separate-lane, blocked, basis-boundary, and follow-up rows", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackCoverageRefreshContract();

    expect(contract.summary).toEqual({
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
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
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
    expect(contract.matrixRows.find((row) => row.id === "floor.helper_only_post_coverage_revalidation.next")).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "globalHelperOnlyCoverageLedgerRefresh",
        "postHelperOnlyWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: LAB_OUTPUTS
    });
  });

  it("keeps helper-only value pins and not-measured budgets unchanged through public calculator entry points", () => {
    const openBoxBudgets = [
      ["Rw", 8.5],
      ["C", 3],
      ["Ctr", 4.5],
      ["Ln,w", 10.5],
      ["CI", 4],
      ["CI,50-2500", 5],
      ["Ln,w+CI", 11]
    ] as const;
    const openWebBudgets = [
      ["Rw", 9],
      ["C", 3],
      ["Ctr", 4.5],
      ["Ln,w", 10],
      ["CI", 4],
      ["CI,50-2500", 5],
      ["Ln,w+CI", 10.5]
    ] as const;

    for (const layers of [
      HELPER_ONLY_OPEN_BOX_TIMBER,
      HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_SPLIT,
      HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_FRAGMENTS
    ]) {
      expectHelperOnlyRuntime(layers, {
        budgets: openBoxBudgets,
        C: -1.1,
        CI: 1,
        CI50_2500: 2.3,
        Ctr: -5.9,
        LnW: 59.6,
        LnWPlusCI: 60.6,
        Rw: 54.8,
        structuralFamily: "open-box timber helper-only lower treatment"
      });
    }

    expectHelperOnlyRuntime(HELPER_ONLY_TIMBER_JOIST, {
      budgets: [
        ["Rw", 9.5],
        ["C", 3],
        ["Ctr", 4.5],
        ["Ln,w", 11.5],
        ["CI", 4],
        ["CI,50-2500", 5],
        ["Ln,w+CI", 12]
      ],
      C: -2.1,
      CI: 0.8,
      CI50_2500: 3.5,
      Ctr: -8.3,
      LnW: 65.4,
      LnWPlusCI: 66.2,
      Rw: 47.3,
      structuralFamily: "timber joist helper-only lower treatment"
    });

    for (const layers of [HELPER_ONLY_OPEN_WEB, HELPER_ONLY_OPEN_WEB_SAFE_SPLIT]) {
      expectHelperOnlyRuntime(layers, {
        budgets: openWebBudgets,
        C: -1.7,
        CI: 1,
        CI50_2500: 4,
        Ctr: -7.9,
        LnW: 59.6,
        LnWPlusCI: 60.6,
        Rw: 46.7,
        structuralFamily: "open-web steel helper-only lower treatment"
      });
    }
  });

  it("keeps exact package, package-transfer, raw-bare, direct-fixed, and supported-band lanes separate", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact).toMatchObject({
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 75,
      basis: "open_measured_floor_system_exact_match"
    });

    expect(packageTransfer.impact).toMatchObject({
      CI50_2500: 3.3,
      LnW: 50.8,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(rawOpenBox.impact?.basis).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(rawOpenWeb.impact?.basis).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(directFixed.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(supportedBand.impact?.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);

    for (const separate of [exact, packageTransfer, rawOpenBox, rawOpenWeb, directFixed, supportedBand]) {
      expect(separate.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(separate.floorSystemEstimate?.impact.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    }
  });

  it("keeps partial, roleless, missing-board, field/building, and ASTM/IIC requests outside helper-only runtime", () => {
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

  it("keeps docs, exports, and current-gate runner aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(content, path).toContain(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(normalized, path).toContain("helper-only timber/open-web");
      expect(normalized, path).toContain("coverage refresh");
      expect(normalized, path).toContain("open-box timber 370");
      expect(normalized, path).toContain("split 185/185");
      expect(normalized, path).toContain("4x92.5");
      expect(normalized, path).toContain("timber-joist 250");
      expect(normalized, path).toContain("open-web 250");
      expect(normalized, path).toContain("rw 54.8");
      expect(normalized, path).toContain("ln,w 59.6");
      expect(normalized, path).toContain("rw 47.3");
      expect(normalized, path).toContain("ln,w 65.4");
      expect(normalized, path).toContain("rw 46.7");
      expect(normalized, path).toContain("+/-8.5 db");
      expect(normalized, path).toContain("+/-10.5 db");
      expect(normalized, path).toContain("exact/package");
      expect(normalized, path).toContain("raw-bare");
      expect(normalized, path).toContain("direct-fixed");
      expect(normalized, path).toContain("supported-band");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("post helper-only");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh");
    expect(runner).toContain(
      "src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts"
    );
  });
});
