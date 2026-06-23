import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_AH_WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_FILE,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTION_STATUS
} from "./post-v1-wall-multileaf-screening-rw-field-companion-gate-ah";
import {
  POST_V1_GATE_AI_WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS,
  POST_V1_GATE_AI_WALL_FLAT_MULTICAVITY_FIELD_VALUE_PINS,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_LANDED_GATE,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTION_STATUS
} from "./post-v1-wall-flat-multicavity-field-physics-companion-gate-ai";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS = [
  ...POST_V1_GATE_AI_WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const metricFieldByOutput = {
  C: "estimatedCDb",
  Ctr: "estimatedCtrDb",
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb",
  Rw: "estimatedRwDb",
  STC: "estimatedStc"
} as const satisfies Record<(typeof WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS)[number], keyof ReturnType<typeof calculateAssembly>["metrics"]>;

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function supportBackedFieldContext(context: AirborneContext | null | undefined): AirborneContext {
  return {
    ...(context ?? {}),
    contextMode: "field_between_rooms",
    wallTopology: {
      ...context?.wallTopology,
      supportTopology: "independent_frames"
    }
  };
}

function supportBackedFieldContextMissingRt60(context: AirborneContext | null | undefined): AirborneContext {
  return {
    ...supportBackedFieldContext(context),
    receivingRoomRt60S: undefined
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall flat multicavity field physics companion Gate AI", () => {
  it("promotes support-backed AAC/multileaf field output from screening into the Gate AE two-cavity solver plus Gate I field adapter", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: supportBackedFieldContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS
    });

    for (const pin of POST_V1_GATE_AI_WALL_FLAT_MULTICAVITY_FIELD_VALUE_PINS) {
      expect(result.metrics[metricFieldByOutput[pin.metric]]).toBe(pin.value);
    }
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 9,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toContain(
      "base lab-family method remains gate_ae_flat_multicavity_two_cavity_frequency_solver"
    );
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
      visibleLeafCount: 3
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
  });

  it("does not guess multileaf support topology when the physical support owner is missing", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: expect.arrayContaining([
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "supportTopology"
      ]),
      origin: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS]);
  });

  it("does not run the field adapter when the room absorption context is incomplete", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: supportBackedFieldContextMissingRt60(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      selectedMethod: "screening_mass_law_curve_seed_v3",
      strategy: "multileaf_screening_blend"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "Dn,A"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,w", "DnT,A"]);
  });

  it("keeps floor bound C and exact floor STC/Ctr aliases closed while adding the wall physics companion", () => {
    const bound = generatedCase("floor-open-web-bound");
    const exact = generatedCase("floor-clt-dry");
    const boundResult = calculateAssembly(bound.rows, {
      ...bound.fieldOptions,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });
    const exactResult = calculateAssembly(exact.rows, {
      ...exact.fieldOptions,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });

    expect(boundResult.floorSystemRatings?.basis).toBe("official_floor_system_bound_support");
    expect(boundResult.unsupportedTargetOutputs).toEqual(["C", "DeltaLw"]);

    expect(exactResult.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(exactResult.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr", "DeltaLw"]);
  });

  it("consumes Gate AH and hands off to numeric coverage Gate AJ", () => {
    expect(POST_V1_GATE_AH_WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS).toEqual([
      ...WALL_FLAT_MULTICAVITY_FIELD_OUTPUTS
    ]);
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTION_STATUS).toBe(
      "post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_landed_selected_next_numeric_coverage_gap_gate_ai"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ai_plan"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ai-contract.test.ts"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_LANDED_GATE).toBe(
      "post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_landed_selected_next_numeric_coverage_gap_gate_aj"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aj_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aj-contract.test.ts"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AJ"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-flat-multicavity-field-physics-companion-gate-ai-contract.test.ts"
    );
  });
});
