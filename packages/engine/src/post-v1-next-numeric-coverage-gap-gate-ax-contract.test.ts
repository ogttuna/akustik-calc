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
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_FILE,
  POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTION_STATUS
} from "./post-v1-wall-building-lab-companion-gate-aw";
import {
  POST_V1_GATE_AX_WALL_FRAMED_BUILDING_OUTPUTS,
  POST_V1_GATE_AX_WALL_FRAMED_LAB_OUTPUTS,
  POST_V1_GATE_AX_WALL_FRAMED_TARGET_OUTPUTS,
  POST_V1_GATE_AX_WALL_FRAMED_VALUE_PINS,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_LANDED_GATE,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS
} from "./post-v1-wall-framed-building-adapter-gate-ax";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  ...POST_V1_GATE_AX_WALL_FRAMED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const BUILDING_OUTPUTS = [
  ...POST_V1_GATE_AX_WALL_FRAMED_BUILDING_OUTPUTS
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
  context: AirborneContext | undefined,
  patch: Partial<AirborneContext> = {}
): AirborneContext {
  return {
    ...context,
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

describe("post-V1 next numeric coverage gap Gate AX", () => {
  it("calculates framed LSF and timber building outputs from explicit framed metadata instead of asking for multileaf grouping", () => {
    for (const expected of POST_V1_GATE_AX_WALL_FRAMED_VALUE_PINS) {
      const testCase = generatedCase(expected.caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: completeBuildingContext(testCase.fieldOptions.airborneContext),
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
      expect(result.dynamicAirborneTrace).toMatchObject({
        detectedFamily: "stud_wall_system",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "building_prediction",
        route: "wall",
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
        supportedMetrics: [...BUILDING_OUTPUTS]
      });
      expect(result.layerCombinationResolverTrace?.valuePins.map((pin) => pin.metric)).toEqual(
        expect.arrayContaining([...BUILDING_OUTPUTS])
      );
      expect(result.layerCombinationResolverTrace?.valuePins).toHaveLength(BUILDING_OUTPUTS.length);

      for (const output of TARGET_OUTPUTS) {
        expect(result.metrics[metricFieldByOutput[output]]).toBe(expected.values[output]);
      }
    }
  });

  it("keeps explicit framed metadata and complete building context as hard requirements", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const missingFramedMetadata = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      airborneContext: completeBuildingContext(lsf.fieldOptions.airborneContext, {
        connectionType: undefined,
        studType: undefined
      }),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(missingFramedMetadata.supportedTargetOutputs).toEqual([]);
    expect(missingFramedMetadata.unsupportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(missingFramedMetadata.airborneBasis).toMatchObject({
      origin: "needs_input",
      missingPhysicalInputs: expect.arrayContaining([
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "supportTopology"
      ])
    });
    expect(missingFramedMetadata.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });

    const missingJunction = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      airborneContext: completeBuildingContext(lsf.fieldOptions.airborneContext, {
        flankingJunctionClass: undefined
      }),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(missingJunction.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AX_WALL_FRAMED_LAB_OUTPUTS
    ]);
    expect(missingJunction.unsupportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(missingJunction.airborneBasis).toMatchObject({
      origin: "needs_input",
      missingPhysicalInputs: ["flankingJunctionClass"]
    });
  });

  it("does not disturb opening/leak boundaries or grouped topology prompts", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const openingLeak = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      airborneContext: completeBuildingContext(lsf.fieldOptions.airborneContext, {
        openingLeakFieldBuildingAdapterBoundary: true
      }),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(openingLeak.supportedTargetOutputs).toEqual([]);
    expect(openingLeak.unsupportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(openingLeak.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(openingLeak.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportBucket: "basis_boundary",
      supportedMetrics: []
    });

    const heldAac = generatedCase("wall-held-aac");
    const heldAacResult = calculateAssembly(heldAac.rows, {
      ...heldAac.fieldOptions,
      airborneContext: completeBuildingContext(heldAac.fieldOptions.airborneContext),
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(heldAacResult.supportedTargetOutputs).toEqual([]);
    expect(heldAacResult.unsupportedTargetOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(heldAacResult.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["sideALeafGroup", "internalLeafGroup", "supportTopology"])
    );
  });

  it("consumes Gate AW and selects Gate AY without source-catalog drift", () => {
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTION_STATUS).toBe(
      "post_v1_wall_building_lab_companion_gate_aw_landed_selected_next_numeric_coverage_gap_gate_ax"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ax_plan"
    );
    expect(POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ax-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_LANDED_GATE).toBe(
      "post_v1_wall_framed_building_adapter_gate_ax_plan"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ay_plan"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AY"
    );

    for (const path of [
      "AGENTS.md",
      "docs/README.md",
      "docs/calculator/README.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md"
    ]) {
      const contents = readRepoFile(path);
      expect(contents, path).toContain(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("wall-lsf-knauf");
      expect(contents, path).toContain("wall-timber-stud");
      expect(contents, path).toContain("floor-tuas-c11c-fail-closed");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-gate-ax-contract.test.ts"
    );
  });
});
