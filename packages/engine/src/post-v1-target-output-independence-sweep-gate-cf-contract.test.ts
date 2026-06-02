import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT } from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import { COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT } from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ce";
import {
  POST_V1_GATE_CF_COVERAGE_COUNTERS,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_LANDED_GATE,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_LABEL,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS
} from "./post-v1-target-output-independence-sweep-gate-cf";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const RAW_BARE_IMPACT_FIELD_OUTPUTS = [
  "Ln,w",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const HEAVY_CONCRETE_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const STEEL_SUSPENDED_FIELD_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const WALL_FIELD_LAB_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const RAW_BARE_OPEN_WEB_LAYERS = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_BARE_OPEN_BOX_LAYERS = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const ABSORBED_DOUBLE_LEAF_FLAT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FULL_FILL_FLAT_MULTICAVITY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DOUBLE_LEAF_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const MULTILEAF_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const DOUBLE_LEAF_MISSING_RT60_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

type CalculatorResult = ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>;

type TargetOutputParityFamily = {
  readonly calculate: (outputs: readonly RequestedOutputId[]) => CalculatorResult;
  readonly expected: Readonly<Partial<Record<RequestedOutputId, number>>>;
  readonly name: string;
  readonly outputs: readonly RequestedOutputId[];
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function repoFileExists(path: string): boolean {
  return existsSync(join(REPO_ROOT, path));
}

function outputValue(result: CalculatorResult, output: RequestedOutputId): number | undefined {
  switch (output) {
    case "Rw":
      return "metrics" in result ? result.metrics.estimatedRwDb : undefined;
    case "STC":
      return "metrics" in result ? result.metrics.estimatedStc : undefined;
    case "C":
      return "metrics" in result ? result.metrics.estimatedCDb : undefined;
    case "Ctr":
      return "metrics" in result ? result.metrics.estimatedCtrDb : undefined;
    case "R'w":
      return "metrics" in result ? result.metrics.estimatedRwPrimeDb : undefined;
    case "Dn,w":
      return "metrics" in result ? result.metrics.estimatedDnWDb : undefined;
    case "Dn,A":
      return "metrics" in result ? result.metrics.estimatedDnADb : undefined;
    case "DnT,w":
      return "metrics" in result ? result.metrics.estimatedDnTwDb : undefined;
    case "DnT,A":
      return "metrics" in result ? result.metrics.estimatedDnTADb : undefined;
    case "Ln,w":
      return result.impact?.LnW;
    case "DeltaLw":
      return result.impact?.DeltaLw;
    case "CI,50-2500":
      return result.impact?.CI50_2500;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI;
    case "L'n,w":
      return result.impact?.LPrimeNW;
    case "L'nT,w":
      return result.impact?.LPrimeNTw;
    case "L'nT,50":
      return result.impact?.LPrimeNT50;
    default:
      return undefined;
  }
}

function expectSingleOutputParity(family: TargetOutputParityFamily): void {
  const mixed = family.calculate(family.outputs);

  expect(mixed.supportedTargetOutputs, `${family.name} mixed supported`).toEqual([...family.outputs]);
  expect(mixed.unsupportedTargetOutputs, `${family.name} mixed unsupported`).toEqual([]);

  for (const output of family.outputs) {
    expect(outputValue(mixed, output), `${family.name} mixed ${output}`).toBe(family.expected[output]);

    const single = family.calculate([output]);

    expect(single.supportedTargetOutputs, `${family.name} single ${output}`).toEqual([output]);
    expect(single.unsupportedTargetOutputs, `${family.name} single ${output}`).toEqual([]);
    expect(outputValue(single, output), `${family.name} single ${output} value`).toBe(family.expected[output]);
  }
}

function calculateSteelSuspendedField(outputs: readonly RequestedOutputId[]): ReturnType<typeof calculateAssembly> {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: outputs
  });

  if (!surface.impactPredictorInput) {
    throw new Error("Gate CF steel suspended-ceiling probe requires a complete impact predictor input.");
  }

  return calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactFieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: outputs
  });
}

describe("post-V1 target-output independence sweep Gate CF", () => {
  it("lands a value-moving target-output independence sweep selected by Gate CE", () => {
    expect({
      coverageCounters: POST_V1_GATE_CF_COVERAGE_COUNTERS,
      landedGate: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_LANDED_GATE,
      previousGateCESelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
      previousGateCESelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
      previousGateCESelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS
    }).toMatchObject({
      coverageCounters: {
        auditedRuntimeFamilies: 6,
        newCalculableLayerTemplates: 0,
        newCalculableRequestShapes: 8,
        newSingleOutputParityPins: 37,
        runtimeCorrectedRequestShapes: 8,
        surfaceParityRequired: false
      },
      landedGate: "post_v1_target_output_independence_sweep_gate_cf_plan",
      previousGateCESelectedNextAction: "post_v1_target_output_independence_sweep_gate_cf_plan",
      previousGateCESelectedNextFile:
        "packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts",
      previousGateCESelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_floor_common_floating_covering_expansion_gate_cg_plan",
      selectedNextFile:
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts",
      selectedNextLabel: "post-V1 common floor floating/covering expansion Gate CG",
      selectionStatus:
        "post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg"
    });
  });

  it("pins single-output parity across existing floor impact runtime families", () => {
    const families: readonly TargetOutputParityFamily[] = [
      {
        calculate: (outputs) =>
          calculateAssembly(RAW_BARE_OPEN_WEB_LAYERS, {
            airborneContext: AIRBORNE_FIELD_CONTEXT,
            impactFieldContext: IMPACT_FIELD_CONTEXT,
            targetOutputs: outputs
          }),
        expected: {
          "CI,50-2500": 5.2,
          "L'n,w": 98,
          "L'nT,50": 100.8,
          "L'nT,w": 95.6,
          "Ln,w": 96,
          "Ln,w+CI": 97.8
        },
        name: "raw-bare open-web field impact",
        outputs: RAW_BARE_IMPACT_FIELD_OUTPUTS
      },
      {
        calculate: (outputs) =>
          calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, {
            airborneContext: AIRBORNE_FIELD_CONTEXT,
            impactFieldContext: IMPACT_FIELD_CONTEXT,
            targetOutputs: outputs
          }),
        expected: {
          "CI,50-2500": 3.4,
          "L'n,w": 93.1,
          "L'nT,50": 94.1,
          "L'nT,w": 90.7,
          "Ln,w": 91.1,
          "Ln,w+CI": 90.2
        },
        name: "raw-bare open-box field impact",
        outputs: RAW_BARE_IMPACT_FIELD_OUTPUTS
      },
      {
        calculate: (outputs) =>
          calculateImpactOnly([], {
            impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
            targetOutputs: outputs
          }),
        expected: {
          "DeltaLw": 13.7,
          "Ln,w": 58.1
        },
        name: "heavy concrete combined lab impact",
        outputs: HEAVY_CONCRETE_OUTPUTS
      },
      {
        calculate: calculateSteelSuspendedField,
        expected: {
          "DeltaLw": 22.4,
          "L'n,w": 54.6,
          "L'nT,50": 50.8,
          "L'nT,w": 51.8,
          "Ln,w": 51.6
        },
        name: "steel suspended-ceiling field impact",
        outputs: STEEL_SUSPENDED_FIELD_OUTPUTS
      }
    ];

    for (const family of families) {
      expectSingleOutputParity(family);
    }
  });

  it("repairs wall field-context lab companions so single outputs use the owned family route, not screening fallback", () => {
    const families: readonly TargetOutputParityFamily[] = [
      {
        calculate: (outputs) =>
          calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
            airborneContext: DOUBLE_LEAF_FIELD_CONTEXT,
            calculator: "dynamic",
            targetOutputs: outputs
          }),
        expected: {
          C: -1,
          Ctr: -5.7,
          "Dn,A": 38.5,
          "Dn,w": 40,
          "DnT,A": 40.9,
          "DnT,w": 42,
          "R'w": 39,
          Rw: 39,
          STC: 39
        },
        name: "flat double-leaf field plus lab companion",
        outputs: WALL_FIELD_LAB_OUTPUTS
      },
      {
        calculate: (outputs) =>
          calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
            airborneContext: MULTILEAF_FIELD_CONTEXT,
            calculator: "dynamic",
            targetOutputs: outputs
          }),
        expected: {
          C: -2,
          Ctr: -8.5,
          "Dn,A": 48.5,
          "Dn,w": 50,
          "DnT,A": 50.9,
          "DnT,w": 53,
          "R'w": 50,
          Rw: 50,
          STC: 51
        },
        name: "flat multileaf field plus lab companion",
        outputs: WALL_FIELD_LAB_OUTPUTS
      }
    ];

    for (const family of families) {
      expectSingleOutputParity(family);

      const rwOnly = family.calculate(["Rw"]);
      expect(rwOnly.airborneBasis).toMatchObject({
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        origin: "family_physics_prediction"
      });
      expect(rwOnly.airborneBasis?.assumptions).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^base lab-family method remains /)
        ])
      );
    }
  });

  it("preserves needs-input and unsupported metric-basis boundaries while widening single outputs", () => {
    const missingRt60 = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: DOUBLE_LEAF_MISSING_RT60_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const isoAstmAliases = calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, {
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["IIC", "AIIC"]
    });
    const fieldOnly = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: DOUBLE_LEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(missingRt60.supportedTargetOutputs).toEqual([]);
    expect(missingRt60.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(missingRt60.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input",
      unsupportedOutputs: ["R'w", "DnT,w"]
    });

    expect(isoAstmAliases.supportedTargetOutputs).toEqual([]);
    expect(isoAstmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(isoAstmAliases.impact?.IIC).toBeUndefined();
    expect(isoAstmAliases.impact?.AIIC).toBeUndefined();

    expect(fieldOnly.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps docs and current-gate runner aligned with Gate CF closeout and Gate CG selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("newSingleOutputParityPins 37");
      expect(contents, path).toContain("runtimeCorrectedRequestShapes 8");
    }

    expect(repoFileExists("packages/engine/src/post-v1-target-output-independence-sweep-gate-cf.ts")).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts");
  });
});
