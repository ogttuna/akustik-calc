import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareRuntimeCorridorContract
} from "./broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const PARTIAL_UPPER_PACKAGE = [
  { materialId: "laminate_flooring", thicknessMm: 8 },
  { materialId: "eps_underlay", thicknessMm: 3 },
  { materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-support.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/shared/src/domain/floor-system.ts",
  "packages/shared/src/domain/floor-system-airborne.ts",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectRawBareRuntime(
  layers: readonly LayerInput[],
  expected: {
    C: number;
    CI: number;
    CI50_2500: number;
    Ctr: number;
    LnW: number;
    LnWPlusCI: number;
    Rw: number;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
  expect(result.floorSystemEstimate?.structuralFamily).toBe("open-box timber raw-bare");
  expect(result.floorSystemEstimate?.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab",
    scope: "family_estimate"
  });
  expect(result.impact?.basis).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
  expect(result.impact?.availableOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    CI50_2500: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    LnW: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    LnWPlusCI: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
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
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(
    result.warnings.some((warning: string) => /raw-bare open-box timber formula corridor/i.test(warning))
  ).toBe(true);
  expect(
    result.dynamicImpactTrace?.notes.some((note: string) => /source-absent bare-carrier path/i.test(note))
  ).toBe(true);
  expect(
    result.impactSupport?.formulaNotes.some((note: string) => /Raw-bare open-box timber error budgets/i.test(note))
  ).toBe(true);

  return result;
}

describe("broad accuracy floor open-box timber raw-bare runtime corridor contract", () => {
  it("lands runtime movement and selects raw-bare surface parity next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      exactRowsStayFirst: true,
      fieldBuildingAndAstmAliasesBlocked: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.id)).toEqual([
      "tagged_370mm_raw_bare_open_box_base_only",
      "split_185_185_raw_bare_open_box_base_only",
      "tagged_220mm_raw_bare_open_box_base_only"
    ]);
    expect(contract.negativeBoundaries).toContain(
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_element_lab_runtime_corridor"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes the canonical 370 mm raw-bare open-box timber carrier through the source-absent formula", () => {
    expectRawBareRuntime(RAW_BARE_370, {
      C: -1.4,
      CI: -1.1,
      CI50_2500: 3.1,
      Ctr: -5.8,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      Rw: 42.3
    });
  });

  it("keeps safe split base-only layers stable and promotes the thinner 220 mm corridor separately", () => {
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

  it("keeps exact TUAS package precedence and refuses partial packages, wrong families, and ASTM aliases", () => {
    const exact = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const partial = calculateAssembly(PARTIAL_UPPER_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const wrongFamily = calculateAssembly(OPEN_WEB_WRONG_FAMILY, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const fieldAlias = calculateAssembly(RAW_BARE_370, {
      calculator: "dynamic",
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 50 },
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "IIC"]
    });

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);

    expect(partial.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(partial.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(partial.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);

    expect(wrongFamily.impact?.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(wrongFamily.floorSystemEstimate?.impact.basis).not.toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);

    expect(fieldAlias.impact).toMatchObject({
      LPrimeNTw: 89.2,
      LPrimeNW: 91.2,
      LnW: 88.2,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(fieldAlias.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(fieldAlias.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps docs, exports, schema, and current-gate runner aligned with the landed runtime corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
      expect(content, path).toContain("Rw 42.3");
      expect(content, path).toContain("Ln,w 88.2");
      expect(content, path).toContain("+/-10 dB");
      expect(content, path).toContain("+/-8 dB");
      expect(normalizedContent, path).toContain("raw-bare");
      expect(normalizedContent, path).toContain("surface parity");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor";'
    );
    expect(readRepoFile("packages/shared/src/domain/impact.ts")).toContain(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts"
    );
  });
});
