import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareRuntimeCorridorContract
} from "./broad-accuracy-floor-open-web-raw-bare-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "R'w",
  "DnT,w",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_SAFE_SPLIT = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_400 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_INEX_DECK_ONLY = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const OPEN_BOX_WRONG_FAMILY = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 300 }
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

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-support.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
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
  expect(result.floorSystemEstimate?.structuralFamily).toBe("open-web steel raw-bare");
  expect(result.floorSystemEstimate?.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    labOrField: "lab",
    scope: "family_estimate"
  });
  expect(result.impact?.basis).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
  expect(result.impact?.availableOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.impact?.metricBasis).toMatchObject({
    CI: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    CI50_2500: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    LnW: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    LnWPlusCI: OPEN_WEB_RAW_BARE_FORMULA_BASIS
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
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);
  expect(result.warnings.some((warning: string) => /raw-bare open-web steel formula corridor/i.test(warning))).toBe(true);
  expect(
    result.dynamicImpactTrace?.notes.some((note: string) => /without borrowing UBIQ INEX\/firestop package rows/i.test(note))
  ).toBe(true);
  expect(
    result.impactSupport?.formulaNotes.some((note: string) => /Raw-bare open-web steel error budgets/i.test(note))
  ).toBe(true);

  return result;
}

describe("broad accuracy floor open-web raw-bare runtime corridor contract", () => {
  it("lands runtime movement and selects raw-bare surface parity next", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      exactAndPackageRowsStayFirst: true,
      fieldBuildingAndAstmAliasesBlocked: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.id)).toEqual([
      "tagged_300mm_raw_bare_open_web_base_only",
      "split_150_150_raw_bare_open_web_base_only",
      "tagged_400mm_raw_bare_open_web_base_only"
    ]);
    expect(contract.negativeBoundaries).toContain(
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_element_lab_runtime_corridor"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes the canonical 300 mm raw-bare open-web steel carrier through the source-absent formula", () => {
    expectRawBareRuntime(RAW_OPEN_WEB_300, {
      C: -2.2,
      CI: 1.8,
      CI50_2500: 5.2,
      Ctr: -7.8,
      LnW: 96,
      LnWPlusCI: 97.8,
      Rw: 32
    });
  });

  it("keeps safe split base-only layers stable and promotes the deeper 400 mm corridor separately", () => {
    expectRawBareRuntime(RAW_OPEN_WEB_SAFE_SPLIT, {
      C: -2.2,
      CI: 1.8,
      CI50_2500: 5.2,
      Ctr: -7.8,
      LnW: 96,
      LnWPlusCI: 97.8,
      Rw: 32
    });
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

  it("keeps package, wrong-family, and unsupported-basis boundaries outside the raw-bare corridor", () => {
    const deckOnly = calculateAssembly(OPEN_WEB_INEX_DECK_ONLY, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const exactPackage = calculateAssembly(UBIQ_FL26_EXACT_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const openBox = calculateAssembly(OPEN_BOX_WRONG_FAMILY, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const aliasOnly = calculateAssembly(RAW_OPEN_WEB_300, {
      calculator: "dynamic",
      targetOutputs: ["L'n,w", "IIC"]
    });

    expect(deckOnly.floorSystemEstimate?.impact.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(deckOnly.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(deckOnly.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");

    expect(exactPackage.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026");
    expect(exactPackage.impact?.basis).toBe("official_floor_system_exact_match");
    expect(exactPackage.floorSystemEstimate).toBeNull();

    expect(directFixed.floorSystemEstimate?.impact.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(directFixed.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(directFixed.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);

    expect(openBox.floorSystemEstimate?.structuralFamily).not.toBe("open-web steel raw-bare");
    expect(openBox.impact?.basis).not.toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);

    expect(aliasOnly.floorSystemEstimate?.impact.basis).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(aliasOnly.impact).toMatchObject({
      LnW: 96,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(aliasOnly.impact?.LPrimeNW).toBeUndefined();
    expect(aliasOnly.supportedTargetOutputs).toEqual([]);
    expect(aliasOnly.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  });

  it("keeps docs, exports, and current-gate runner aligned with the raw open-web runtime corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
      expect(content, path).toContain("Rw 32");
      expect(content, path).toContain("Ln,w 96");
      expect(content, path).toContain("+/-12 dB");
      expect(content, path).toContain("+/-9 dB");
      expect(normalized, path).toContain("open-web raw-bare");
      expect(normalized, path).toContain("source-absent");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-web-raw-bare-runtime-corridor";'
    );
    expect(readRepoFile("packages/engine/src/index.ts")).toContain('export * from "./open-web-raw-bare-estimate";');
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts"
    );
  });
});
