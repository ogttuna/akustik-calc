import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract
} from "./broad-accuracy-floor-open-web-raw-bare-coverage-refresh";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const RAW_BARE_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "IIC",
  "R'w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["L'n,w", "L'nT,w", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor.ts",
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "apps/web/features/workbench/open-web-raw-bare-surface.ts",
  "apps/web/features/workbench/open-web-raw-bare-surface-parity.test.ts",
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

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_SAFE_SPLIT = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_MANY_FRAGMENTS = Array.from({ length: 6 }, () => ({
  floorRole: "base_structure",
  materialId: "open_web_steel_floor",
  thicknessMm: 50
})) satisfies readonly LayerInput[];

const RAW_OPEN_WEB_400 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_401 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 401 }
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

const PARTIAL_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DECK_ONLY = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 }
] as const satisfies readonly LayerInput[];

const OPEN_BOX_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 300 }
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
  expect(result.floorSystemEstimate).toMatchObject({
    kind: "family_archetype",
    structuralFamily: "open-web steel raw-bare"
  });
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Rw", 9],
    ["C", 3],
    ["Ctr", 4.5],
    ["Ln,w", 12],
    ["CI", 4],
    ["CI,50-2500", 5],
    ["Ln,w+CI", 12.5]
  ]);
  expect(result.impact?.errorBudgets?.every((budget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);

  return result;
}

describe("broad accuracy floor open-web raw-bare coverage refresh contract", () => {
  it("lands a no-runtime coverage matrix and selects post raw-bare open-web revalidation next", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "post_raw_bare_open_web_revalidation",
        reason:
          "selected now because raw-bare, exact package, direct-fixed, and supported-band open-web lanes are all visible and need one ranked ledger pass before another runtime lane",
        selectedNow: true
      },
      {
        id: "carrier_only_holdout_acquisition",
        reason:
          "not selected here because source acquisition is a narrow holdout task and must not replace the source-absent calculator corridor",
        selectedNow: false
      },
      {
        id: "open_web_field_building_adapter",
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

  it("summarizes supported, exact, separate-lane, blocked, basis-boundary, and follow-up rows", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCoverageRefreshContract();

    expect(contract.summary).toEqual({
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
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
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
    expect(contract.matrixRows.find((row) => row.id === "floor.open_web_raw_bare_post_revalidation.next")).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "globalOpenWebCoverageLedgerRefresh",
        "postRawBareWeakLaneDebtRanking",
        "nextHighestRoiFamilySolverSelection"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    });
  });

  it("keeps raw-bare value pins and not-measured budgets unchanged through public calculator entry points", () => {
    for (const layers of [RAW_OPEN_WEB_300, RAW_OPEN_WEB_SAFE_SPLIT, RAW_OPEN_WEB_MANY_FRAGMENTS]) {
      expectRawBareRuntime(layers, {
        C: -2.2,
        CI: 1.8,
        CI50_2500: 5.2,
        Ctr: -7.8,
        LnW: 96,
        LnWPlusCI: 97.8,
        Rw: 32
      });
    }
    expectRawBareRuntime(RAW_OPEN_WEB_400, {
      C: -2,
      CI: 1.3,
      CI50_2500: 4.6,
      Ctr: -7.5,
      LnW: 92.8,
      LnWPlusCI: 94.1,
      Rw: 36.6
    });
  });

  it("keeps exact UBIQ, direct-fixed, supported-band, and open-box lanes separate from raw-bare open-web", () => {
    const exact = calculateAssembly(UBIQ_FL26_EXACT_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const wrongFamily = calculateAssembly(OPEN_BOX_WRONG_FAMILY, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026");
    expect(exact.impact).toMatchObject({
      CI: -2,
      LnW: 61,
      LnWPlusCI: 59,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 62,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemEstimate).toBeNull();

    expect(directFixed.impact).toMatchObject({
      CI: -0.5,
      LnW: 77,
      LnWPlusCI: 76.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(directFixed.floorSystemRatings).toMatchObject({
      Rw: 52,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });

    expect(supportedBand.impact).toMatchObject({
      CI: -1.5,
      LnW: 61.5,
      LnWPlusCI: 60,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });
    expect(supportedBand.floorSystemRatings).toMatchObject({
      Rw: 61.5,
      basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    });

    expect(wrongFamily.impact).toMatchObject({
      CI: -1,
      CI50_2500: 3.3,
      LnW: 89.4,
      LnWPlusCI: 88.4,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(wrongFamily.floorSystemRatings).toMatchObject({
      C: -1.5,
      Ctr: -6,
      Rw: 40.5,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });

    for (const separate of [exact, directFixed, supportedBand, wrongFamily]) {
      expect(separate.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
      expect(separate.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    }
  });

  it("keeps partial packages, deck-only rows, out-of-range carriers, building, and ASTM/IIC outside raw-bare runtime", () => {
    const partial = calculateAssembly(PARTIAL_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const deckOnly = calculateAssembly(DECK_ONLY, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const outOfRange = calculateAssembly(RAW_OPEN_WEB_401, {
      calculator: "dynamic",
      targetOutputs: RAW_BARE_OUTPUTS
    });
    const fieldBuilding = calculateAssembly(RAW_OPEN_WEB_300, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(RAW_OPEN_WEB_300, {
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });

    for (const blocked of [partial, deckOnly, outOfRange, astm]) {
      expect(blocked.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
      expect(blocked.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
      expect(blocked.impact?.errorBudgets).toBeUndefined();
    }

    for (const screening of [partial, deckOnly, outOfRange]) {
      expect(screening.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr"]);
      expect(screening.unsupportedTargetOutputs).toEqual([
        "Ln,w",
        "CI",
        "CI,50-2500",
        "Ln,w+CI",
        "L'n,w",
        "IIC",
        "R'w",
        "DnT,w"
      ]);
      expect(screening.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    }

    expect(fieldBuilding.impact).toMatchObject({
      LnW: 96,
      LPrimeNW: 99,
      LPrimeNTw: 97,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldBuilding.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs, exports, and current-gate runner aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("coverage refresh");
      expect(normalizedContent, path).toContain("raw-bare open-web");
      expect(normalizedContent, path).toContain("split 150/150");
      expect(normalizedContent, path).toContain("6x50");
      expect(normalizedContent, path).toContain("400 mm");
      expect(normalizedContent, path).toContain("rw 32");
      expect(normalizedContent, path).toContain("ln,w 96");
      expect(normalizedContent, path).toContain("ci,50-2500 5.2");
      expect(normalizedContent, path).toContain("+/-9 db");
      expect(normalizedContent, path).toContain("+/-12 db");
      expect(normalizedWhitespaceContent, path).toContain("exact ubiq");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("supported-band");
      expect(normalizedContent, path).toContain("partial-package");
      expect(normalizedContent, path).toContain("deck-only");
      expect(normalizedContent, path).toContain("out-of-range");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("post raw-bare open-web");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-web-raw-bare-coverage-refresh");
    expect(runner).toContain("broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts");
  });
});
