import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_GATE_CG_COVERAGE_COUNTERS,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS
} from "./post-v1-floor-common-floating-covering-expansion-gate-cg";
import {
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE,
  POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS
} from "./post-v1-target-output-independence-sweep-gate-cf";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COVERING_ONLY_HEAVY_CONCRETE_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];
const COVERING_ONLY_HEAVY_CONCRETE_FIELD_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const DELTA_LW_MISSING_INPUTS = [
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const;

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

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

type CoveringOnlyCase = {
  expected: {
    LPrimeNT50: number;
    LPrimeNTw: number;
    LPrimeNW: number;
    LnW: number;
  };
  layers: readonly LayerInput[];
  name: string;
};

const COVERING_ONLY_CASES: readonly CoveringOnlyCase[] = [
  {
    expected: {
      LPrimeNT50: 74.8,
      LPrimeNTw: 70.8,
      LPrimeNW: 73.2,
      LnW: 71.2
    },
    layers: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
    ],
    name: "ceramic tile on heavy concrete"
  },
  {
    expected: {
      LPrimeNT50: 75.2,
      LPrimeNTw: 71.2,
      LPrimeNW: 73.6,
      LnW: 71.6
    },
    layers: [
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
    ],
    name: "vinyl on heavy concrete"
  },
  {
    expected: {
      LPrimeNT50: 75.1,
      LPrimeNTw: 71.1,
      LPrimeNW: 73.5,
      LnW: 71.5
    },
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
    ],
    name: "laminate on heavy concrete"
  },
  {
    expected: {
      LPrimeNT50: 75,
      LPrimeNTw: 71,
      LPrimeNW: 73.4,
      LnW: 71.4
    },
    layers: [
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
    ],
    name: "engineered timber finish on heavy concrete"
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor common floating/covering expansion Gate CG", () => {
  it("lands the first common floor covering runtime correction and selects Gate CG2 continuation", () => {
    expect({
      coverageCounters: POST_V1_GATE_CG_COVERAGE_COUNTERS,
      landedGate: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE,
      previousGateCFSelectedNextAction: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION,
      previousGateCFSelectedNextFile: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE,
      previousGateCFSelectionStatus: POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS
    }).toMatchObject({
      coverageCounters: {
        auditedRuntimeFamilies: 1,
        newCalculableLayerTemplates: 4,
        newCalculableRequestShapes: 20,
        runtimeCorrectedRequestShapes: 12,
        surfaceParityRequired: false
      },
      landedGate: "post_v1_floor_common_floating_covering_expansion_gate_cg_plan",
      previousGateCFSelectedNextAction: "post_v1_floor_common_floating_covering_expansion_gate_cg_plan",
      previousGateCFSelectedNextFile:
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts",
      previousGateCFSelectionStatus:
        "post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan",
      selectedNextFile:
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts",
      selectedNextLabel: "post-V1 common floor floating/covering expansion Gate CG2",
      selectionStatus:
        "post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2"
    });
  });

  it("keeps covering-only heavy concrete Ln,w live when DeltaLw is requested but route inputs are incomplete", () => {
    for (const testCase of COVERING_ONLY_CASES) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: COVERING_ONLY_HEAVY_CONCRETE_OUTPUTS
      });

      expect(result.supportedTargetOutputs, testCase.name).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, testCase.name).toEqual(["DeltaLw"]);
      expect(result.impact, testCase.name).toMatchObject({
        LnW: testCase.expected.LnW,
        availableOutputs: ["Ln,w"],
        basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate"
      });
      expect(result.impact?.DeltaLw, testCase.name).toBeUndefined();
      expect(result.acousticAnswerBoundary, testCase.name).toMatchObject({
        missingPhysicalInputs: [...DELTA_LW_MISSING_INPUTS],
        origin: "needs_input",
        unsupportedOutputs: ["DeltaLw"]
      });
    }
  });

  it("publishes field impact from the live Ln,w anchor with complete field context while DeltaLw still stops", () => {
    for (const testCase of COVERING_ONLY_CASES) {
      const result = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: COVERING_ONLY_HEAVY_CONCRETE_FIELD_OUTPUTS
      });

      expect(result.supportedTargetOutputs, testCase.name).toEqual([
        "Ln,w",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]);
      expect(result.unsupportedTargetOutputs, testCase.name).toEqual(["DeltaLw"]);
      expect(result.impact, testCase.name).toMatchObject({
        LPrimeNT50: testCase.expected.LPrimeNT50,
        LPrimeNTw: testCase.expected.LPrimeNTw,
        LPrimeNW: testCase.expected.LPrimeNW,
        LnW: testCase.expected.LnW,
        basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
      });
      expect(result.impact?.DeltaLw, testCase.name).toBeUndefined();
      expect(result.impact?.metricBasis).toMatchObject({
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LnW: "predictor_bare_massive_floor_iso12354_annexc_estimate"
      });
      expect(result.acousticAnswerBoundary, testCase.name).toMatchObject({
        missingPhysicalInputs: [...DELTA_LW_MISSING_INPUTS],
        origin: "needs_input",
        unsupportedOutputs: ["DeltaLw"]
      });
    }
  });

  it("keeps missing field context, DeltaLw-only, ASTM aliases, and complete floating-floor boundaries strict", () => {
    const coveringOnly = COVERING_ONLY_CASES[0];
    const missingFieldContext = calculateAssembly(coveringOnly.layers, {
      calculator: "dynamic",
      targetOutputs: ["Ln,w", "L'n,w"]
    });
    const deltaOnly = calculateAssembly(coveringOnly.layers, {
      calculator: "dynamic",
      targetOutputs: ["DeltaLw"]
    });
    const astmAliases = calculateAssembly(coveringOnly.layers, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });
    const completeFloating = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 76,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      targetOutputs: COVERING_ONLY_HEAVY_CONCRETE_OUTPUTS
    });

    expect(missingFieldContext.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual(["L'n,w"]);
    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext"],
      origin: "needs_input",
      unsupportedOutputs: ["L'n,w"]
    });

    expect(deltaOnly.impact).toBeNull();
    expect(deltaOnly.supportedTargetOutputs).toEqual([]);
    expect(deltaOnly.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(deltaOnly.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...DELTA_LW_MISSING_INPUTS],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });

    expect(astmAliases.supportedTargetOutputs).toEqual([]);
    expect(astmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmAliases.impact?.IIC).toBeUndefined();
    expect(astmAliases.impact?.AIIC).toBeUndefined();

    expect(completeFloating.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(completeFloating.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(completeFloating.unsupportedTargetOutputs).toEqual([]);
    expect(completeFloating.acousticAnswerBoundary).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate CG partial closeout and Gate CG2 selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("newCalculableLayerTemplates 4");
      expect(contents, path).toContain("newCalculableRequestShapes 20");
      expect(contents, path).toContain("runtimeCorrectedRequestShapes 12");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts");
  });
});
