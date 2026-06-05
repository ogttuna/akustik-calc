import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cr";
import {
  POST_V1_GATE_CS_COUNTERS,
  POST_V1_GATE_CS_TARGET_OUTPUTS,
  POST_V1_GATE_CS_VALUE_PINS,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_LABEL,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS,
  summarizePostV1WallCommonAutoTopologySecondPassGateCS
} from "./post-v1-wall-common-auto-topology-second-pass-gate-cs";
import { inferSafeFlatWallAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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
    supportTopology: "independent_frames",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const COMPLETE_RESILIENT_BUILDING_CONTEXT = {
  ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
  resilientBarSideCount: "both_sides",
  wallTopology: {
    supportTopology: "resilient_channel",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const metricFieldByOutput = {
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb"
} as const satisfies Record<
  (typeof POST_V1_GATE_CS_TARGET_OUTPUTS)[number],
  keyof ReturnType<typeof calculateAssembly>["metrics"]
>;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall common auto-topology second pass Gate CS", () => {
  it("lands Gate CS after Gate CR and selects the next numeric coverage rerank", () => {
    const summary = summarizePostV1WallCommonAutoTopologySecondPassGateCS();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CS_COUNTERS,
      landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_CS_VALUE_PINS
    });
  });

  it("routes safe explicit flat_layer_order double-leaf building requests through the Gate S direct curve owner", () => {
    const cases = [
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: SIMPLE_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CS_VALUE_PINS[0]
      },
      {
        context: COMPLETE_RESILIENT_BUILDING_CONTEXT,
        layers: SIMPLE_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CS_VALUE_PINS[1]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: MULTI_BOARD_DOUBLE_LEAF_STACK,
        pin: POST_V1_GATE_CS_VALUE_PINS[2]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: SPLIT_AIR_POROUS_CAVITY_STACK,
        pin: POST_V1_GATE_CS_VALUE_PINS[3]
      },
      {
        context: COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        layers: ASYMMETRIC_BOARD_COUNT_STACK,
        pin: POST_V1_GATE_CS_VALUE_PINS[4]
      }
    ] as const;

    for (const testCase of cases) {
      const inferred = inferSafeFlatWallAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: testCase.context,
        layers: testCase.layers,
        targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS
      });
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.context,
        calculator: "dynamic",
        targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS
      });

      expect(inferred, testCase.pin.id).toMatchObject({
        supportTopology: testCase.context.wallTopology.supportTopology,
        topologyMode: "double_leaf_framed"
      });
      expect(result.supportedTargetOutputs, testCase.pin.id).toEqual([...POST_V1_GATE_CS_TARGET_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, testCase.pin.id).toEqual([]);
      expect(result.airborneBasis, testCase.pin.id).toMatchObject({
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
      expect(result.layerCombinationResolverTrace, testCase.pin.id).toMatchObject({
        requestedBasis: "building_prediction",
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction",
        supportedMetrics: [...POST_V1_GATE_CS_TARGET_OUTPUTS]
      });

      for (const output of POST_V1_GATE_CS_TARGET_OUTPUTS) {
        expect(result.metrics[metricFieldByOutput[output]], `${testCase.pin.id}:${output}`).toBe(
          testCase.pin.metrics[output]
        );
      }
    }
  });

  it("keeps the unsafe flat-order boundaries closed instead of guessing", () => {
    const missingSupport = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        wallTopology: {
          topologyMode: "flat_layer_order"
        }
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS
    });
    const missingStudSpacing = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_INDEPENDENT_BUILDING_CONTEXT,
        studSpacingMm: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS
    });
    const missingResilientSideCount = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_RESILIENT_BUILDING_CONTEXT,
        resilientBarSideCount: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS
    });
    for (const result of [missingSupport, missingStudSpacing, missingResilientSideCount]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_CS_TARGET_OUTPUTS]);
      expect(result.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    }
    expect(missingSupport.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportedMetrics: []
    });
    expect(missingStudSpacing.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportedMetrics: []
    });
    expect(missingResilientSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(POST_V1_GATE_CS_COUNTERS.wrongFallbackOrAliasBlocks).toContain(
      "explicit flat_layer_order multicavity stacks are carried forward for a separate grouped multicavity owner instead of being widened by Gate CS"
    );
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CS runtime move", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("flat_layer_order");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts");
  });
});
