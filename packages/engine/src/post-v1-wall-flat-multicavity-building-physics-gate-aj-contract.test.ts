import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTION_STATUS
} from "./post-v1-wall-flat-multicavity-field-physics-companion-gate-ai";
import {
  POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_UNSUPPORTED_LAB_OUTPUTS,
  POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_VALUE_PINS,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_LANDED_GATE,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTION_STATUS
} from "./post-v1-wall-flat-multicavity-building-physics-gate-aj";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const GATE_AR_BUILDING_RUNTIME_METHOD = "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";
const GATE_AR_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_airborne_building_prediction_all_owner_family_physics_prediction";

const WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS = [
  ...POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const metricFieldByOutput = {
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb"
} as const satisfies Record<
  (typeof POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_SUPPORTED_OUTPUTS)[number],
  keyof ReturnType<typeof calculateAssembly>["metrics"]
>;

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function completeSupportBackedBuildingContext(context: AirborneContext | null | undefined): AirborneContext {
  return {
    ...(context ?? {}),
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2800,
    panelWidthMm: 3600,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 45,
    sourceRoomVolumeM3: 42,
    wallTopology: {
      ...context?.wallTopology,
      supportTopology: "independent_frames"
    }
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall flat multicavity building physics Gate AJ", () => {
  it("calculates complete support-backed AAC/multileaf building outputs from Gate AE two-cavity physics plus building context", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      calculator: "dynamic",
      airborneContext: completeSupportBackedBuildingContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS
    });

    for (const pin of POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_VALUE_PINS) {
      expect(result.metrics[metricFieldByOutput[pin.metric]]).toBe(pin.value);
    }
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 9,
      method: GATE_AR_BUILDING_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "direct separating-element curve comes from the Gate AE flat multicavity two-cavity frequency solver",
        "base lab-family method remains gate_ae_flat_multicavity_two_cavity_frequency_solver"
      ])
    );
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_BUILDING_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_UNSUPPORTED_LAB_OUTPUTS,
      ...POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_SUPPORTED_OUTPUTS
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.9,
      estimatedCtrDb: -8,
      estimatedRwDb: 60,
      estimatedStc: 60
    });
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw, STC, C, Ctr");
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: R'w");
  });

  it("does not guess support topology for building prediction when the physical support owner is missing", () => {
    const testCase = generatedCase("wall-held-aac");
    const context = completeSupportBackedBuildingContext(testCase.fieldOptions.airborneContext);
    const result = calculateAssembly(testCase.rows, {
      calculator: "dynamic",
      airborneContext: {
        ...context,
        wallTopology: undefined
      },
      targetOutputs: WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS
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
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS]);
  });

  it("does not run the building adapter when a required building physical input is incomplete", () => {
    const testCase = generatedCase("wall-held-aac");
    const context = completeSupportBackedBuildingContext(testCase.fieldOptions.airborneContext);
    const result = calculateAssembly(testCase.rows, {
      calculator: "dynamic",
      airborneContext: {
        ...context,
        sourceRoomVolumeM3: undefined
      },
      targetOutputs: WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["sourceRoomVolumeM3"],
      origin: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS]);
  });

  it("keeps floor bound C and exact floor STC/Ctr aliases closed while adding the building physics route", () => {
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

  it("consumes Gate AI and hands off to numeric coverage Gate AK", () => {
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_landed_selected_next_numeric_coverage_gap_gate_aj"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aj_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_FIELD_PHYSICS_COMPANION_GATE_AI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aj-contract.test.ts"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_LANDED_GATE).toBe(
      "post_v1_wall_flat_multicavity_building_physics_gate_aj_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ak_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ak-contract.test.ts"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AK"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-flat-multicavity-building-physics-gate-aj-contract.test.ts"
    );
  });
});
