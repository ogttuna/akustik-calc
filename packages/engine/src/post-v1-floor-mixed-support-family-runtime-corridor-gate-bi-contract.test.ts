import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_LN_W_TOLERANCE_DB,
  MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID
} from "./mixed-support-floor-impact-runtime-corridor";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS
} from "./post-v1-floor-mixed-support-family-owner-boundary-gate-bh";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS,
  POST_V1_GATE_BI_FIELD_CONTEXT,
  POST_V1_GATE_BI_FIELD_OUTPUTS,
  POST_V1_GATE_BI_LAB_OUTPUTS,
  POST_V1_GATE_BI_MIXED_OUTPUTS,
  POST_V1_GATE_BI_RUNTIME_VALUE_PINS,
  POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
  summarizePostV1FloorMixedSupportFamilyRuntimeCorridorGateBI
} from "./post-v1-floor-mixed-support-family-runtime-corridor-gate-bi";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BI_SURFACES = [
  "packages/shared/src/domain/impact-predictor-input.ts",
  "packages/shared/src/domain/impact.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/mixed-support-floor-impact-runtime-corridor.ts",
  "packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi.ts",
  "packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts",
  "packages/engine/src/impact-estimate.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateGateBILab() {
  return calculateImpactOnly([], {
    impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
    targetOutputs: POST_V1_GATE_BI_LAB_OUTPUTS
  });
}

describe("post-V1 floor mixed-support family runtime corridor Gate BI", () => {
  it("lands Gate BI after Gate BH and selects mixed-support surface parity Gate BJ", () => {
    const summary = summarizePostV1FloorMixedSupportFamilyRuntimeCorridorGateBI();

    expect(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS).toBe(
      "post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi"
    );
    expect(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE
    );
    expect(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts"
    );
    expect(summary).toMatchObject({
      fieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
      landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE,
      previousGateBH: {
        landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS
      },
      runtimeValueMovement: "single_primary_carrier_mixed_support_lab_and_field_promotion",
      selectedNextAction:
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(summary.valuePins).toEqual([...POST_V1_GATE_BI_RUNTIME_VALUE_PINS]);

    for (const path of REQUIRED_GATE_BI_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates the explicit single-primary-carrier mixed-support lab subset instead of failing closed", () => {
    const result = calculateGateBILab();

    expect(result.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
      confidence: {
        level: "medium",
        provenance: "formula_estimate_narrow_scope",
        score: 0.66
      },
      floatingLoadSurfaceMassKgM2: 100,
      resilientDynamicStiffnessMNm3: 30,
      scope: "mixed_support_floor_formula_corridor"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
      LnW: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(result.impact?.errorBudgets?.map((budget) => [budget.metricId, budget.toleranceDb])).toEqual([
      ["Ln,w", MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_LN_W_TOLERANCE_DB],
      ["DeltaLw", MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB]
    ]);
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BI_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      runtimeBasisId: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
      selectedCandidateId: MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...POST_V1_GATE_BI_LAB_OUTPUTS],
      valuePins: [
        {
          metric: "Ln,w",
          value: 44.6
        },
        {
          metric: "DeltaLw",
          value: 29.9
        }
      ]
    });
  });

  it("keeps the same mixed-support lab anchor live when field companions have their own context", () => {
    const result = calculateImpactOnly([], {
      impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
      impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
      targetOutputs: POST_V1_GATE_BI_MIXED_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 29.9,
      LPrimeNT50: 47.8,
      LPrimeNTw: 43.8,
      LPrimeNW: 46.6,
      LnW: 44.6
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BI_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...POST_V1_GATE_BI_FIELD_OUTPUTS]
    });
    expect(result.impact?.metricBasis?.LnW).toBe(MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS);
  });

  it("asks for missing mixed-support owner fields instead of falling through to the heavy-concrete formula", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        ...POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
        mixedSupport: {
          ...POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT.mixedSupport,
          duplicateOwnershipGuard: undefined
        }
      },
      targetOutputs: POST_V1_GATE_BI_LAB_OUTPUTS
    });

    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_BI_LAB_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["duplicateOwnershipGuard"],
      origin: "needs_input",
      unsupportedOutputs: [...POST_V1_GATE_BI_LAB_OUTPUTS]
    });
    expect(result.warnings.some((warning) => warning.includes("mixed-support floor impact runtime is waiting"))).toBe(true);
  });

  it("blocks unsafe mixed-support partitions without silently selecting another family solver", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: {
        ...POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
        mixedSupport: {
          ...POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT.mixedSupport,
          mixedSupportRolePartition: "duplicate_primary_carriers"
        }
      },
      targetOutputs: POST_V1_GATE_BI_LAB_OUTPUTS
    });

    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_BI_LAB_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_mixed_support_partition_unsupported_boundary",
      origin: "unsupported",
      unsupportedOutputs: [...POST_V1_GATE_BI_LAB_OUTPUTS]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      supportBucket: "unsupported"
    });
    expect(
      result.warnings.some((warning) =>
        warning.includes("only supports the explicit single-primary reinforced-concrete carrier")
      )
    ).toBe(true);
  });

  it("keeps ASTM IIC and AIIC unsupported for the ISO mixed-support corridor", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BI closeout and Gate BJ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_RUNTIME_CORRIDOR_GATE_BI_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("single-primary-carrier");
      expect(contents, path).toContain("Ln,w 44.6");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts");
  });
});
