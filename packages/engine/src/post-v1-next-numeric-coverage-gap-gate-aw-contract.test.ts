import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTION_STATUS
} from "./post-v1-floor-explicit-deltalw-field-companion-gate-av";
import {
  POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_BUILDING_OUTPUTS,
  POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_TARGET_OUTPUTS,
  POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_VALUE_PINS,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_LANDED_GATE,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_FILE,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_LABEL,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTION_STATUS
} from "./post-v1-wall-building-lab-companion-gate-aw";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  ...POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const BUILDING_OUTPUTS = [
  ...POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const metricFieldByOutput = {
  "C": "estimatedCDb",
  "Ctr": "estimatedCtrDb",
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb",
  "Rw": "estimatedRwDb",
  "STC": "estimatedStc"
} as const satisfies Record<
  (typeof TARGET_OUTPUTS)[number],
  keyof ReturnType<typeof calculateAssembly>["metrics"]
>;

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function completeBuildingContext(
  context: AirborneContext | null | undefined,
  patch: Partial<AirborneContext> = {}
): AirborneContext {
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
    ...patch
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate AW", () => {
  it("calculates mixed wall building outputs plus lab companions for complete source-absent Gate AR cases", () => {
    for (const expected of POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_VALUE_PINS) {
      const testCase = generatedCase(expected.caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: completeBuildingContext(
          testCase.fieldOptions.airborneContext,
          expected.caseId === "wall-held-aac"
            ? {
                wallTopology: {
                  ...testCase.fieldOptions.airborneContext?.wallTopology,
                  supportTopology: "independent_frames"
                }
              }
            : {}
        ),
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });

      expect(result.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.airborneBasis).toMatchObject({
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        runtimeValueMovement: true,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "building_prediction",
        route: "wall",
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
        supportedMetrics: [...BUILDING_OUTPUTS]
      });
      expect(result.layerCombinationResolverTrace?.valuePins.map((pin: { metric: RequestedOutputId }) => pin.metric)).toEqual(
        expect.arrayContaining([...BUILDING_OUTPUTS])
      );
      expect(result.layerCombinationResolverTrace?.valuePins).toHaveLength(BUILDING_OUTPUTS.length);

      for (const output of TARGET_OUTPUTS) {
        expect(result.metrics[metricFieldByOutput[output]]).toBe(expected.values[output]);
      }
    }
  });

  it("does not publish lab companions when the complete building request only asks for building outputs", () => {
    const testCase = generatedCase("wall-masonry-brick");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: completeBuildingContext(testCase.fieldOptions.airborneContext),
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      supportedMetrics: [...BUILDING_OUTPUTS]
    });
  });

  it("keeps missing topology and opening/leak building closed while later Gate AX owns framed-wall building outputs", () => {
    const heldAac = generatedCase("wall-held-aac");
    const missingTopology = calculateAssembly(heldAac.rows, {
      ...heldAac.fieldOptions,
      airborneContext: completeBuildingContext(heldAac.fieldOptions.airborneContext),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    expect(missingTopology.airborneBasis).toMatchObject({
      origin: "needs_input",
      missingPhysicalInputs: expect.arrayContaining([
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "supportTopology"
      ])
    });
    expect(missingTopology.supportedTargetOutputs).toEqual([]);
    expect(missingTopology.unsupportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);

    const masonry = generatedCase("wall-masonry-brick");
    const openingLeak = calculateAssembly(masonry.rows, {
      ...masonry.fieldOptions,
      airborneContext: completeBuildingContext(masonry.fieldOptions.airborneContext, {
        openingLeakFieldBuildingAdapterBoundary: true
      }),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    expect(openingLeak.supportedTargetOutputs).toEqual([]);
    expect(openingLeak.unsupportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);

    for (const caseId of ["wall-lsf-knauf", "wall-timber-stud"] as const) {
      const testCase = generatedCase(caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: completeBuildingContext(testCase.fieldOptions.airborneContext),
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });
      expect(result.supportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "building_prediction",
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
        supportedMetrics: [...BUILDING_OUTPUTS]
      });
    }
  });

  it("consumes Gate AV and hands off to Gate AX without source-catalog drift", () => {
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_deltalw_field_companion_gate_av_landed_selected_next_numeric_coverage_gap_gate_aw"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aw_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_LANDED_GATE).toBe(
      "post_v1_wall_building_lab_companion_gate_aw_plan"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTION_STATUS).toBe(
      "post_v1_wall_building_lab_companion_gate_aw_landed_selected_next_numeric_coverage_gap_gate_ax"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ax_plan"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ax-contract.test.ts"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AX"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts"
    );
  });
});
