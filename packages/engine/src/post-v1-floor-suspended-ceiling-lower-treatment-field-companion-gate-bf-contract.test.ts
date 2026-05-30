import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_VALUE_PINS,
  POST_V1_GATE_BF_LOWER_TREATMENT_MIXED_OUTPUTS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF
} from "./post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-be";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BF_SURFACES = [
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/impact-field-context.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
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
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateAssemblyFieldOnly(layers = POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS) {
  return calculateAssembly(layers, {
    calculator: "dynamic",
    floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
    impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
    targetOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
  });
}

describe("post-V1 floor suspended-ceiling lower-treatment field companion Gate BF", () => {
  it("lands Gate BF after Gate BE and selects the next numeric coverage gap", () => {
    const summary = summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
      previousGateBE: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS
      },
      runtimeValueMovement: "assembly_field_only_lower_treatment_field_companion_promotion",
      selectedNextAction:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(summary.valuePins).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_VALUE_PINS]);

    for (const path of REQUIRED_GATE_BF_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates assembly field-only lower-treatment values from the same owned lab anchor", () => {
    const acousticHanger = calculateAssemblyFieldOnly();
    const resilientStud = calculateAssemblyFieldOnly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS);

    expect(acousticHanger.impact).toMatchObject({
      DeltaLw: 28.9,
      LPrimeNT50: 48.8,
      LPrimeNTw: 44.8,
      LPrimeNW: 47.6,
      LnW: 45.6,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(resilientStud.impact).toMatchObject({
      DeltaLw: 29.9,
      LPrimeNT50: 47.8,
      LPrimeNTw: 43.8,
      LPrimeNW: 46.6,
      LnW: 44.6
    });

    for (const result of [acousticHanger, resilientStud]) {
      expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.acousticAnswerBoundary).toBeUndefined();
      expect(result.layerCombinationResolverTrace).toMatchObject({
        basis: "field_apparent",
        runtimeBasisId: "source_absent_field_building_adapter_error_budget",
        selectedCandidateId: "floor.impact_field_context.field_building_adapter",
        supportBucket: "field_adapter",
        supportedMetrics: [...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS]
      });
    }
  });

  it("keeps mixed lab-plus-field and impact-only routes on the same numeric pins", () => {
    const mixed = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
      targetOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_MIXED_OUTPUTS
    });
    const impactOnly = calculateImpactOnly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
      targetOutputs: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
    });

    for (const result of [mixed, impactOnly]) {
      expect(result.impact).toMatchObject({
        DeltaLw: 28.9,
        LPrimeNT50: 48.8,
        LPrimeNTw: 44.8,
        LPrimeNW: 47.6,
        LnW: 45.6
      });
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "floor.impact_field_context.field_building_adapter"
      });
    }
    expect(mixed.supportedTargetOutputs).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_MIXED_OUTPUTS]);
    expect(impactOnly.supportedTargetOutputs).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS]);
  });

  it("asks for only the missing low-frequency owner instead of falling back to generic field context", () => {
    const result = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: {
        fieldKDb: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT.fieldKDb,
        receivingRoomVolumeM3: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT.receivingRoomVolumeM3
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 28.9,
      LPrimeNTw: 44.8,
      LPrimeNW: 47.6,
      LnW: 45.6
    });
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
  });

  it("keeps ASTM aliases blocked while opening the ISO field companions", () => {
    const result = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
      targetOutputs: [...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS, "IIC", "AIIC"]
    });

    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate BF closeout and Gate BG selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("assembly field-only lower-treatment");
      expect(contents, path).toContain("L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts"
    );
  });
});
