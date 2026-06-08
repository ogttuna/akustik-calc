import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const RAW_BARE_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "IIC"] as const satisfies readonly RequestedOutputId[];
const PACKAGE_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const EXACT_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["L'n,w", "L'nT,w", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/index.ts",
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

const RAW_BARE_SPLIT_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 185 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
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

const PARTIAL_UPPER_PACKAGE = [
  { materialId: "laminate_flooring", thicknessMm: 8 },
  { materialId: "eps_underlay", thicknessMm: 3 },
  { materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectRawBareRuntime(
  layers: readonly LayerInput[],
  expected: {
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly Ctr: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: RAW_BARE_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Rw", 8],
    ["C", 2.5],
    ["Ctr", 3.5],
    ["Ln,w", 10],
    ["CI", 3],
    ["CI,50-2500", 4],
    ["Ln,w+CI", 10.5]
  ]);
  expect(result.impact?.errorBudgets?.every((budget: ImpactErrorBudget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);

  return result;
}

describe("broad accuracy floor open-box timber raw-bare coverage refresh contract", () => {
  it("lands a no-runtime coverage matrix and selects post-raw-bare revalidation next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "post_raw_bare_revalidation",
        reason:
          "selected now because raw-bare and finished package-transfer lanes are both visible, exact rows stay first, and the next move should rerank the whole open-box coverage ledger before another runtime lane",
        selectedNow: true
      },
      {
        id: "package_transfer_residual_expansion",
        reason:
          "not selected here because package-transfer residual expansion needs a post-raw-bare weak-lane ranking pass first",
        selectedNow: false
      },
      {
        id: "open_box_field_building_adapter",
        reason: "not selected here because lab raw-bare Ln,w/Rw cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI raw-bare evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes raw-bare, exact, package-transfer, blocked, basis-boundary, and follow-up rows", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareCoverageRefreshContract();

    expect(contract.summary).toEqual({
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
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "floor.open_box_timber_raw_bare_370.lab",
        "floor.open_box_timber_raw_bare_split_185_185.lab",
        "floor.open_box_timber_raw_bare_220.lab"
      ]
    });
    expect(
      contract.matrixRows.find((row) => row.id === "floor.open_box_timber_post_raw_bare_revalidation.next")
    ).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "globalOpenBoxCoverageLedgerRefresh",
        "postRawBareWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    });
  });

  it("keeps raw-bare value pins and not-measured budgets unchanged through public calculator entry points", () => {
    expectRawBareRuntime(RAW_BARE_370, {
      C: -1.4,
      CI: -1.1,
      CI50_2500: 3.1,
      Ctr: -5.8,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      Rw: 42.3
    });
    expectRawBareRuntime(RAW_BARE_SPLIT_370, {
      C: -1.4,
      CI: -1.1,
      CI50_2500: 3.1,
      Ctr: -5.8,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      Rw: 42.3
    });
    expectRawBareRuntime(RAW_BARE_220, {
      C: -1.6,
      CI: -0.9,
      CI50_2500: 3.4,
      Ctr: -6.2,
      LnW: 91.1,
      LnWPlusCI: 90.2,
      Rw: 38.1
    });
  });

  it("keeps exact package precedence and finished package-transfer separation ahead of raw-bare coverage", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: EXACT_OUTPUTS
    });
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: PACKAGE_OUTPUTS
    });

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
    expect(exact.floorSystemEstimate).toBeNull();

    expect(packageTransfer.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(packageTransfer.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtr: 62.1,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(packageTransfer.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(packageTransfer.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
  });

  it("keeps partial package, wrong family, building-only, and ASTM/IIC requests outside unsafe raw-bare promotion", () => {
    const partial = calculateAssembly(PARTIAL_UPPER_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const wrongFamily = calculateAssembly(OPEN_WEB_WRONG_FAMILY, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const fieldBuilding = calculateAssembly(RAW_BARE_370, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(RAW_BARE_370, {
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });

    for (const blocked of [partial, astm]) {
      expect(blocked.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
      expect(blocked.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
      expect(blocked.impact?.errorBudgets).toBeUndefined();
    }

    expect(fieldBuilding.impact).toMatchObject({
      LPrimeNTw: 89.2,
      LPrimeNW: 91.2,
      LnW: 88.2,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(fieldBuilding.floorSystemEstimate?.impact.basis).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(fieldBuilding.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);

    expect(wrongFamily.impact).toMatchObject({
      CI: 1.8,
      CI50_2500: 5.2,
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(wrongFamily.floorSystemRatings).toMatchObject({
      C: -2.2,
      Ctr: -7.8,
      Rw: 32,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(wrongFamily.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(wrongFamily.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(wrongFamily.impact?.errorBudgets?.every((budget: ImpactErrorBudget) => budget.notMeasuredEvidence)).toBe(true);

    expect(partial.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr"]);
    expect(partial.unsupportedTargetOutputs).toEqual([
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "IIC"
    ]);
    expect(wrongFamily.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(wrongFamily.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);
    expect(fieldBuilding.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs, exports, current-gate runner, and operating envelope aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("coverage refresh");
      expect(normalizedContent, path).toContain("raw-bare open-box timber");
      expect(normalizedContent, path).toContain("split 185/185");
      expect(normalizedContent, path).toContain("220 mm");
      expect(normalizedContent, path).toContain("rw 42.3");
      expect(normalizedContent, path).toContain("ln,w 88.2");
      expect(normalizedContent, path).toContain("ci,50-2500 3.1");
      expect(normalizedContent, path).toContain("+/-8 db");
      expect(normalizedContent, path).toContain("+/-10 db");
      expect(normalizedWhitespaceContent, path).toContain("exact tuas package precedence");
      expect(normalizedContent, path).toContain("package-transfer separation");
      expect(normalizedContent, path).toContain("partial-package");
      expect(normalizedContent, path).toContain("wrong-family");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("post raw-bare");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts");
  });
});
