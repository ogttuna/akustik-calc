import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ci";
import {
  POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
  POST_V1_GATE_CJ_COUNTERS,
  POST_V1_GATE_CJ_PLAN_DOC_PATH,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_LABEL,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS,
  summarizePostV1WallCommonAutoTopologyExpansionGateCJ
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import { inferSafeFlatWallDoubleLeafAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_BUILDING_OUTPUTS = [
  ...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const SIMPLE_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const MULTI_BOARD_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const SPLIT_AIR_POROUS_CAVITY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ASYMMETRIC_BOARD_COUNT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_INDEPENDENT_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const COMPLETE_RESILIENT_BUILDING_CONTEXT = {
  ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
  resilientBarSideCount: "both_sides",
  wallTopology: {
    supportTopology: "resilient_channel"
  }
} as const satisfies AirborneContext;

const EXPLICIT_DOUBLE_LEAF_BUILDING_CONTEXT = {
  ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
} as const satisfies AirborneContext;

const COMPLETE_FIELD_CONTEXT = {
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

const metricFieldByOutput = {
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb"
} as const satisfies Record<
  (typeof POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS)[number],
  keyof ReturnType<typeof calculateAssembly>["metrics"]
>;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall common auto-topology expansion Gate CJ", () => {
  it("lands Gate CJ after Gate CI and selects the next wall opening/leak calculator slice", () => {
    const summary = summarizePostV1WallCommonAutoTopologyExpansionGateCJ();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CJ_COUNTERS,
      landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE,
      planDocPath: POST_V1_GATE_CJ_PLAN_DOC_PATH,
      selectedNextAction: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS,
      valuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS
    });
  });

  it("routes common support-owned flat double-leaf building requests through the Gate S direct curve owner", () => {
    const cases = [
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: SIMPLE_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0]
      },
      {
        context: COMPLETE_RESILIENT_BUILDING_CONTEXT,
        layers: SIMPLE_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[1]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: MULTI_BOARD_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[2]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: SPLIT_AIR_POROUS_CAVITY_STACK,
        pin: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[3]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: ASYMMETRIC_BOARD_COUNT_STACK,
        pin: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[4]
      }
    ] as const;

    for (const testCase of cases) {
      const inferred = inferSafeFlatWallDoubleLeafAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: testCase.context,
        layers: testCase.layers,
        targetOutputs: WALL_BUILDING_OUTPUTS
      });
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.context,
        calculator: "dynamic",
        targetOutputs: WALL_BUILDING_OUTPUTS
      });

      expect(inferred, testCase.pin.id).toMatchObject({
        supportTopology: testCase.context.wallTopology.supportTopology,
        topologyMode: "double_leaf_framed"
      });
      expect(result.supportedTargetOutputs, testCase.pin.id).toEqual([...WALL_BUILDING_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, testCase.pin.id).toEqual([]);
      expect(result.airborneBasis, testCase.pin.id).toMatchObject({
        family: testCase.context.wallTopology.supportTopology === "resilient_channel"
          ? "stud_wall_system"
          : "double_stud_system",
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.assumptions, testCase.pin.id).toEqual(
        expect.arrayContaining([
          "direct separating-element curve comes from the Gate S double-leaf/framed bridge frequency solver",
          `base lab-family method remains ${GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD}`
        ])
      );
      expect(result.dynamicAirborneTrace, testCase.pin.id).toMatchObject({
        selectedLabel: "Double-Leaf Framed Formula Solver",
        strategy: "double_leaf_framed_bridge_mass_air_mass_runtime"
      });
      expect(result.layerCombinationResolverTrace, testCase.pin.id).toMatchObject({
        requestedBasis: "building_prediction",
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction",
        supportedMetrics: [...WALL_BUILDING_OUTPUTS]
      });

      for (const output of WALL_BUILDING_OUTPUTS) {
        expect(result.metrics[metricFieldByOutput[output]], `${testCase.pin.id}:${output}`).toBe(
          testCase.pin.metrics[output]
        );
      }
    }
  });

  it("opens the explicit double-leaf building route without changing existing lab and field pins", () => {
    const explicit = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_DOUBLE_LEAF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_BUILDING_OUTPUTS
    });
    const lab = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        contextMode: "element_lab",
        studSpacingMm: 600,
        wallTopology: { supportTopology: "independent_frames" }
      },
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const field = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(explicit.supportedTargetOutputs).toEqual([...WALL_BUILDING_OUTPUTS]);
    expect(explicit.metrics).toMatchObject({
      estimatedDnADb: 38.5,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwPrimeDb: 39
    });
    expect(explicit.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });

    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 42,
      estimatedRwPrimeDb: 39
    });
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("blocks unsafe double-leaf building fallbacks while Gate CS reopens safe explicit flat-order requests", () => {
    const noSupport = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        wallTopology: undefined
      },
      calculator: "dynamic",
      targetOutputs: WALL_BUILDING_OUTPUTS
    });
    const missingStudSpacing = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        studSpacingMm: undefined
      },
      calculator: "dynamic",
      targetOutputs: WALL_BUILDING_OUTPUTS
    });
    const explicitFlat = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        wallTopology: {
          supportTopology: "independent_frames",
          topologyMode: "flat_layer_order"
        }
      },
      calculator: "dynamic",
      targetOutputs: WALL_BUILDING_OUTPUTS
    });
    const missingSourceRoom = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        sourceRoomVolumeM3: undefined
      },
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const missingResilientSideCount = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        wallTopology: {
          supportTopology: "resilient_channel"
        }
      },
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    for (const result of [noSupport, missingStudSpacing]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...WALL_BUILDING_OUTPUTS]);
      expect(result.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "generic.lab_field_building_basis_boundary",
        supportedMetrics: []
      });
    }

    expect(explicitFlat.supportedTargetOutputs).toEqual([...WALL_BUILDING_OUTPUTS]);
    expect(explicitFlat.unsupportedTargetOutputs).toEqual([]);
    expect(explicitFlat.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(missingSourceRoom.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["sourceRoomVolumeM3"],
      origin: "needs_input"
    });
    expect(missingSourceRoom.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(missingResilientSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(missingResilientSideCount.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CJ runtime move", () => {
    const docs = [
      "AGENTS.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
      "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
      POST_V1_GATE_CJ_PLAN_DOC_PATH
    ] as const;

    for (const path of docs) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("Gate S double-leaf");
      expect(contents, path).toContain("building_prediction");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts");
  });
});
