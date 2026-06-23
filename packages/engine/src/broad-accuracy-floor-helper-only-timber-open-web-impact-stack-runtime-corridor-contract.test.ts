import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackRuntimeCorridorContract
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";

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

const HELPER_ONLY_OPEN_WEB_UNTAGGED = [
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "rockwool", thicknessMm: 145 },
  { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const R5B_DRY_PACKAGE = [
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
  "packages/engine/src/helper-only-timber-open-web-impact-stack-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/impact-support.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts"
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
    budgets: readonly (readonly [string, number])[];
    C: number;
    CI: number;
    CI50_2500: number;
    Ctr: number;
    LnW: number;
    LnWPlusCI: number;
    Rw: number;
    structuralFamily: string;
  }
) {
  const result = calculateAssembly(layers, {
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(result.floorSystemMatch).toBeNull();
  expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
  expect(result.floorSystemEstimate?.structuralFamily).toBe(expected.structuralFamily);
  expect(result.floorSystemEstimate?.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab",
    scope: "family_estimate"
  });
  expect(result.impact).toMatchObject({
    CI: expected.CI,
    CI50_2500: expected.CI50_2500,
    LnW: expected.LnW,
    LnWPlusCI: expected.LnWPlusCI,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab"
  });
  expect(result.impact?.metricBasis).toMatchObject({
    CI: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    CI50_2500: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    LnW: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    LnWPlusCI: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => [budget.metricId, budget.toleranceDb])).toEqual(expected.budgets);
  expect(result.impact?.errorBudgets?.every((budget: ImpactErrorBudget) => budget.notMeasuredEvidence)).toBe(true);
  expect(result.floorSystemRatings).toMatchObject({
    C: expected.C,
    Ctr: expected.Ctr,
    Rw: expected.Rw,
    RwCtr: Number((expected.Rw + expected.C).toFixed(1)),
    RwCtrSemantic: "rw_plus_c",
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);
  expect(
    result.warnings.some((warning: string) => /helper-only timber\/open-web impact stack formula corridor/i.test(warning))
  ).toBe(true);
  expect(
    result.dynamicImpactTrace?.notes.some((note: string) => /helper-only timber\/open-web formula corridor/i.test(note))
  ).toBe(true);
  expect(
    result.impactSupport?.formulaNotes.some((note: string) => /Helper-only timber\/open-web error budgets/i.test(note))
  ).toBe(true);

  return result;
}

describe("broad accuracy floor helper-only timber/open-web impact stack runtime corridor contract", () => {
  it("lands runtime movement and selects helper-only surface parity next", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
      exactPackageAndRawBareRowsStayFirst: true,
      fieldBuildingAndAstmAliasesBlocked: true,
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS
    });
    expect(contract.previousFormulaCorridor).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.id)).toEqual([
      "open_box_timber_helper_only_lower_treatment",
      "timber_joist_helper_only_lower_treatment",
      "open_web_steel_helper_only_lower_treatment"
    ]);
    expect(contract.negativeBoundaries).toContain(
      "field_building_and_astm_iic_outputs_remain_unpromoted_by_this_element_lab_runtime_corridor"
    );

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete open-box timber and timber-joist helper-only lower-treatment stacks", () => {
    const openBoxBudgets = [
      ["Rw", 8.5],
      ["C", 3],
      ["Ctr", 4.5],
      ["Ln,w", 10.5],
      ["CI", 4],
      ["CI,50-2500", 5],
      ["Ln,w+CI", 11]
    ] as const;

    expectHelperOnlyRuntime(HELPER_ONLY_OPEN_BOX_TIMBER, {
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
    expectHelperOnlyRuntime(HELPER_ONLY_OPEN_BOX_TIMBER_SAFE_SPLIT, {
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
  });

  it("promotes complete open-web helper-only lower-treatment stacks without borrowing package rows", () => {
    expectHelperOnlyRuntime(HELPER_ONLY_OPEN_WEB, {
      budgets: [
        ["Rw", 9],
        ["C", 3],
        ["Ctr", 4.5],
        ["Ln,w", 10],
        ["CI", 4],
        ["CI,50-2500", 5],
        ["Ln,w+CI", 10.5]
      ],
      C: -1.7,
      CI: 1,
      CI50_2500: 4,
      Ctr: -7.9,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      Rw: 46.7,
      structuralFamily: "open-web steel helper-only lower treatment"
    });
  });

  it("keeps exact/package/raw-bare, partial, roleless, field/building, and ASTM boundaries outside the helper-only runtime", () => {
    const dryPackage = calculateAssembly(R5B_DRY_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const rawOpenBox = calculateAssembly(RAW_OPEN_BOX_TIMBER, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const rawOpenWeb = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const missingBoard = calculateAssembly(HELPER_ONLY_OPEN_WEB_MISSING_BOARD, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const roleless = calculateAssembly(HELPER_ONLY_OPEN_WEB_UNTAGGED, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const fieldAlias = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "IIC"]
    });
    const building = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    const astm = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(dryPackage.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(dryPackage.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    expect(rawOpenBox.impact?.basis).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(rawOpenWeb.impact?.basis).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
    expect(directFixed.impact?.basis).toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(supportedBand.impact?.basis).toBe(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS);

    expect(missingBoard.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    expect(roleless.impact?.basis).not.toBe(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);

    expect(fieldAlias.impact).toMatchObject({
      LnW: 59.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      labOrField: "lab"
    });
    expect(fieldAlias.impact?.LPrimeNW).toBeUndefined();
    expect(fieldAlias.impact?.LPrimeNTw).toBeUndefined();
    expect(fieldAlias.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);

    expect(building.impact?.basis).toBeUndefined();
    expect(building.supportedTargetOutputs).toEqual([]);
    expect(building.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs, exports, schema, and the current-gate runner aligned with the runtime corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_RUNTIME_SELECTED_NEXT_FILE);
      expect(content, path).toContain(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
      expect(normalized, path).toContain("helper-only timber/open-web");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      "broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor"
    );
    expect(readRepoFile("packages/shared/src/domain/impact.ts")).toContain(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS);
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts"
    );
  });
});
