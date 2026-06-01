import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];
const ALIAS_ONLY_OUTPUTS = ["L'n,w", "IIC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/open-box-timber-similarity-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/shared/src/domain/impact.ts",
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

const OPEN_WEB_STEEL_WRONG_SUPPORT = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 18 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectRuntimeResult(
  layers: readonly LayerInput[],
  expected: {
    anchors: readonly string[];
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

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
  expect(result.floorSystemEstimate?.impact).toMatchObject({
    CI: expected.ci,
    CI50_2500: expected.ci50,
    LnW: expected.lnw,
    LnWPlusCI: expected.lnwPlusCi,
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    labOrField: "lab",
    scope: "family_estimate"
  });
  expect(result.impact?.basis).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    CI50_2500: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    LnW: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    LnWPlusCI: OPEN_BOX_TIMBER_SIMILARITY_BASIS
  });
  expect(result.impact?.estimateCandidateIds).toEqual(expected.anchors);
  expect(result.impact?.errorBudgets?.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
    ["Ln,w", 7],
    ["CI", 2],
    ["CI,50-2500", 2.5],
    ["Ln,w+CI", 7.5]
  ]);
  expect(result.impact?.errorBudgets?.every((budget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.floorSystemRatings).toMatchObject({
    Rw: expected.rw,
    RwCtr: expected.rwPlusC,
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(
    result.warnings.some((warning: string) => /open-box timber package-transfer corridor/i.test(warning))
  ).toBe(true);

  return result;
}

describe("broad accuracy floor open-box timber similarity runtime corridor contract", () => {
  it("lands runtime movement and selects surface parity next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      exactRowsStayFirst: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.id)).toEqual([
      "source_absent_dry_gypsum_fiber_upper_mid_packet",
      "source_absent_thin_laminate_eps_no_upper_packet",
      "source_absent_reinforced_ceiling_laminate_packet"
    ]);
    expect(contract.negativeBoundaries).toContain(
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_lab_runtime_corridor"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete source-absent dry gypsum-fiber open-box timber input to runtime values", () => {
    expectRuntimeResult(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      anchors: [
        "tuas_r3a_open_box_timber_measured_2026",
        "tuas_r3b_open_box_timber_measured_2026",
        "tuas_r5a_open_box_timber_measured_2026",
        "tuas_r5b_open_box_timber_measured_2026"
      ],
      ci: 1.3,
      ci50: 3.3,
      lnw: 50.8,
      lnwPlusCi: 52,
      rw: 66,
      rwPlusC: 62.1
    });
  });

  it("promotes complete source-absent thin and reinforced open-box timber packets through their own anchors", () => {
    expectRuntimeResult(THIN_LAMINATE_SOURCE_ABSENT, {
      anchors: [
        "tuas_r2a_open_box_timber_measured_2026",
        "tuas_r2b_open_box_timber_measured_2026"
      ],
      ci: 1.5,
      ci50: 3.5,
      lnw: 53.5,
      lnwPlusCi: 55,
      rw: 55.5,
      rwPlusC: 52.3
    });
    expectRuntimeResult(REINFORCED_CEILING_SOURCE_ABSENT, {
      anchors: [
        "tuas_r6a_open_box_timber_measured_2026",
        "tuas_r6b_open_box_timber_measured_2026"
      ],
      ci: 0.5,
      ci50: 2,
      lnw: 53.5,
      lnwPlusCi: 54,
      rw: 63.5,
      rwPlusC: 61.6
    });
  });

  it("keeps exact rows and hostile or wrong-basis inputs outside runtime formula promotion", () => {
    const exact = calculateAssembly(R5B_EXACT_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const rawBare = calculateAssembly(RAW_BARE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const partialFinish = calculateAssembly(PARTIAL_FINISH, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const exactOnlyHybrid = calculateAssembly(EPS_SCREED_EXACT_ONLY, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const wrongSupport = calculateAssembly(OPEN_WEB_STEEL_WRONG_SUPPORT, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const aliasOnly = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: ALIAS_ONLY_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.impact?.LnW).toBe(44);
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 75,
      RwCtr: 71.87531170772152,
      RwCtrSemantic: "rw_plus_c"
    });

    for (const blocked of [rawBare, partialFinish, exactOnlyHybrid, wrongSupport]) {
      expect(blocked.impact?.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
      expect(blocked.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    }
    expect(aliasOnly.impact?.basis).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    expect(aliasOnly.floorSystemEstimate?.impact.basis).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    expect(aliasOnly.impact?.LPrimeNW).toBeUndefined();
    expect(aliasOnly.supportedTargetOutputs).toEqual([]);
    expect(aliasOnly.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "R'w", "DnT,w"]);
  });

  it("keeps docs, exports, schema, and current-gate runner aligned with runtime promotion", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Ln,w 50.8");
      expect(content, path).toContain("CI,50-2500 3.3");
      expect(content, path).toContain("Rw 66");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("+/-2.5 dB");
      expect(content, path).toContain("+/-6 dB");
      expect(normalizedContent, path).toContain("open-box timber");
      expect(normalizedContent, path).toContain("package-transfer");
      expect(normalizedContent, path).toContain("surface parity");
      expect(normalizedContent, path).toContain("exact-only hybrid");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const sharedImpactSchema = readRepoFile("packages/shared/src/domain/impact.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-box-timber-similarity-runtime-corridor");
    expect(sharedImpactSchema).toContain(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
    expect(runner).toContain("broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts");
  });
});
