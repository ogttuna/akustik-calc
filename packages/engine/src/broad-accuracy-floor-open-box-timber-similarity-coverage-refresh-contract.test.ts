import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefreshContract
} from "./broad-accuracy-floor-open-box-timber-similarity-coverage-refresh";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-surface-parity";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const ALIAS_ONLY_OUTPUTS = ["L'n,w", "IIC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["L'n,w", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts",
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "apps/web/features/workbench/open-box-timber-similarity-surface.ts",
  "apps/web/features/workbench/open-box-timber-similarity-surface-parity.test.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
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
  "docs/calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md"
] as const;

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

const THIN_LAMINATE_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const REINFORCED_CEILING_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_LAYERS = [
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

const PARTIAL_FINISH = DRY_GYPSUM_FIBER_SOURCE_ABSENT.filter(
  (layer) => layer.floorRole !== "resilient_layer"
) satisfies readonly LayerInput[];

const RAW_BARE = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EPS_SCREED_EXACT_ONLY = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 45 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const MIXED_STAGED_EXACT_ONLY = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_STEEL_WRONG_SUPPORT = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 18 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectOpenBoxRuntime(
  layers: readonly LayerInput[],
  expected: {
    ci: number;
    ci50: number;
    lnw: number;
    lnwPlusCi: number;
    rw: number;
    rwPlusC: number;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.impact).toMatchObject({
    CI: expected.ci,
    CI50_2500: expected.ci50,
    LnW: expected.lnw,
    LnWPlusCI: expected.lnwPlusCi,
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    labOrField: "lab"
  });
  expect(result.floorSystemRatings).toMatchObject({
    Rw: expected.rw,
    RwCtr: expected.rwPlusC,
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Ln,w", 7],
    ["CI", 2],
    ["CI,50-2500", 2.5],
    ["Ln,w+CI", 7.5]
  ]);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

  return result;
}

describe("broad accuracy floor open-box timber similarity coverage refresh contract", () => {
  it("lands a no-runtime coverage matrix and selects exact-only hybrid fragmentation policy next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "source_equivalent_fragmentation_policy",
        reason:
          "selected now because the supported open-box package-transfer lane is visible, exact rows stay first, and exact-only wet/dry hybrid plus mixed staged packets are the nearest same-family coverage gap",
        selectedNow: true
      },
      {
        id: "open_box_raw_bare_reopening_guard",
        reason: "not selected here because raw bare open-box inputs need a separate bare-carrier owner before package-transfer reuse",
        selectedNow: false
      },
      {
        id: "open_box_field_building_adapter",
        reason: "not selected here because lab package-transfer Ln,w/Rw cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported, exact, blocked, basis-boundary, and follow-up rows without readiness inflation", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityCoverageRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: ["floor.open_box_timber_field_building.boundary"],
      correctlyBlockedRowIds: [
        "floor.open_box_timber_raw_bare.boundary",
        "floor.open_box_timber_partial_finish.boundary",
        "floor.open_box_timber_exact_only_hybrid.boundary",
        "floor.open_box_timber_mixed_staged.boundary",
        "floor.open_box_timber_wrong_support_open_web.boundary",
        "floor.open_box_timber_astm_iic.unsupported"
      ],
      exactPrecedenceBoundaryRowIds: ["floor.open_box_timber_r5b_exact_precedence.lab"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 6,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        none: 3
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["floor.open_box_timber_exact_only_hybrid_fragmentation.next"],
      rowCount: 12,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "floor.open_box_timber_dry_gypsum_fiber_upper.lab",
        "floor.open_box_timber_thin_laminate_eps_no_upper.lab",
        "floor.open_box_timber_reinforced_ceiling_laminate.lab"
      ]
    });
    expect(
      contract.matrixRows.find((row) => row.id === "floor.open_box_timber_exact_only_hybrid_fragmentation.next")
    ).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "sourceEquivalentFragmentedPackagePolicy",
        "exactOnlyHybridResidualOwner",
        "mixedStagedUpperPackageOwner"
      ],
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    });
  });

  it("keeps supported open-box package-transfer pins and exact source precedence through public calculator entry points", () => {
    expectOpenBoxRuntime(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      ci: 1.3,
      ci50: 3.3,
      lnw: 50.8,
      lnwPlusCi: 52,
      rw: 66,
      rwPlusC: 62.1
    });
    expectOpenBoxRuntime(THIN_LAMINATE_SOURCE_ABSENT, {
      ci: 1.5,
      ci50: 3.5,
      lnw: 53.5,
      lnwPlusCi: 55,
      rw: 55.5,
      rwPlusC: 52.3
    });
    expectOpenBoxRuntime(REINFORCED_CEILING_SOURCE_ABSENT, {
      ci: 0.5,
      ci50: 2,
      lnw: 53.5,
      lnwPlusCi: 54,
      rw: 63.5,
      rwPlusC: 61.6
    });

    const exact = calculateAssembly(R5B_EXACT_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
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
      RwCtr: 71.87531170772152,
      RwCtrSemantic: "rw_plus_c",
      basis: "open_measured_floor_system_exact_match"
    });
    expect(exact.floorSystemEstimate).toBeNull();
  });

  it("keeps raw, partial, exact-only hybrid, mixed-staged, wrong-support, field/building, and ASTM/IIC boundaries precise", () => {
    const rawBare = calculateAssembly(RAW_BARE, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const partialFinish = calculateAssembly(PARTIAL_FINISH, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const exactOnlyHybrid = calculateAssembly(EPS_SCREED_EXACT_ONLY, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const mixedStaged = calculateAssembly(MIXED_STAGED_EXACT_ONLY, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const wrongSupport = calculateAssembly(OPEN_WEB_STEEL_WRONG_SUPPORT, { calculator: "dynamic", targetOutputs: LAB_OUTPUTS });
    const aliasOnly = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: ALIAS_ONLY_OUTPUTS
    });
    const fieldBuilding = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });

    for (const blocked of [rawBare, partialFinish, exactOnlyHybrid, mixedStaged, wrongSupport]) {
      expect(blocked.impact?.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
      expect(blocked.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    }
    expect(aliasOnly.impact).toMatchObject({
      CI50_2500: 3.3,
      LnW: 50.8,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(aliasOnly.supportedTargetOutputs).toEqual([]);
    expect(aliasOnly.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
    expect(fieldBuilding.impact).toMatchObject({
      CI50_2500: 3.3,
      LnW: 50.8,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(fieldBuilding.supportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual(["L'n,w", "R'w", "DnT,w"]);
  });

  it("keeps docs, exports, current-gate runner, and operating envelope aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("coverage refresh");
      expect(normalizedContent, path).toContain("open-box timber");
      expect(normalizedContent, path).toContain("package-transfer");
      expect(normalizedContent, path).toContain("ln,w 50.8");
      expect(normalizedContent, path).toContain("ci,50-2500 3.3");
      expect(normalizedContent, path).toContain("rw 66");
      expect(normalizedWhitespaceContent, path).toContain("exact source precedence");
      expect(normalizedContent, path).toContain("raw bare");
      expect(normalizedContent, path).toContain("exact-only hybrid");
      expect(normalizedContent, path).toContain("mixed staged");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("exact-only hybrid fragmentation policy");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-similarity-coverage-refresh");
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts");
  });
});
