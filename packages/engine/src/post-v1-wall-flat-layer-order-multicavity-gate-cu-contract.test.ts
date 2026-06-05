import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_STALE_FLAT_ORDER_CONTEXT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import { calculateAssembly } from "./calculate-assembly";
import { GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_CU_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CU_COUNTERS,
  POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS,
  POST_V1_GATE_CU_LAB_TARGET_OUTPUTS,
  POST_V1_GATE_CU_VALUE_PINS,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS,
  summarizePostV1WallFlatLayerOrderMulticavityGateCU
} from "./post-v1-wall-flat-layer-order-multicavity-gate-cu";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ct";
import { inferSafeFlatWallMulticavityAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_FLAT_LAYER_ORDER_CONTEXT = {
  airtightness: "good",
  contextMode: "element_lab",
  wallTopology: {
    supportTopology: "independent_frames",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

const FIELD_FLAT_LAYER_ORDER_CONTEXT = {
  ...LAB_FLAT_LAYER_ORDER_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
} as const satisfies AirborneContext;

const BUILDING_FLAT_LAYER_ORDER_CONTEXT = {
  ...LAB_FLAT_LAYER_ORDER_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sourceRoomVolumeM3: 42
} as const satisfies AirborneContext;

const AST_MIC_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const labMetricFieldByOutput = {
  C: "estimatedCDb",
  Ctr: "estimatedCtrDb",
  Rw: "estimatedRwDb",
  STC: "estimatedStc"
} as const satisfies Record<
  (typeof POST_V1_GATE_CU_LAB_TARGET_OUTPUTS)[number],
  keyof ReturnType<typeof calculateAssembly>["metrics"]
>;

const fieldMetricFieldByOutput = {
  "Dn,A": "estimatedDnADb",
  "Dn,w": "estimatedDnWDb",
  "DnT,A": "estimatedDnTADb",
  "DnT,w": "estimatedDnTwDb",
  "R'w": "estimatedRwPrimeDb"
} as const satisfies Record<
  (typeof POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS)[number],
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

describe("post-V1 wall flat layer-order multicavity Gate CU", () => {
  it("lands Gate CU after Gate CT and selects the next numeric coverage rerank", () => {
    const summary = summarizePostV1WallFlatLayerOrderMulticavityGateCU();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CU_COUNTERS,
      landedGate: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS,
      valuePins: POST_V1_GATE_CU_VALUE_PINS
    });
  });

  it("routes explicit flat_layer_order multicavity lab requests through the Gate AE two-cavity formula owner", () => {
    const inferred = inferSafeFlatWallMulticavityAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: LAB_FLAT_LAYER_ORDER_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      targetOutputs: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    });
    const result = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: LAB_FLAT_LAYER_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    });

    expect(inferred).toMatchObject({
      cavity1DepthMm: 70,
      cavity1LayerIndices: [3, 4],
      cavity2DepthMm: 80,
      cavity2LayerIndices: [6, 7],
      internalLeafLayerIndices: [5],
      sideALeafLayerIndices: [0, 1, 2],
      sideBLeafLayerIndices: [8, 9, 10],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_CU_LAB_TARGET_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: POST_V1_GATE_CU_VALUE_PINS.lab.candidateId,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_GATE_CU_VALUE_PINS.lab.basis,
      selectedCandidateId: POST_V1_GATE_CU_VALUE_PINS.lab.candidateId,
      supportedMetrics: [...POST_V1_GATE_CU_LAB_TARGET_OUTPUTS]
    });

    for (const output of POST_V1_GATE_CU_LAB_TARGET_OUTPUTS) {
      expect(result.metrics[labMetricFieldByOutput[output]], output).toBe(
        POST_V1_GATE_CU_VALUE_PINS.lab.metrics[output]
      );
    }
  });

  it("routes explicit flat_layer_order multicavity field and building outputs through their owned adapters", () => {
    const cases = [
      {
        basis: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        context: FIELD_FLAT_LAYER_ORDER_CONTEXT,
        pin: POST_V1_GATE_CU_VALUE_PINS.field,
        targetOutputs: POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS
      },
      {
        basis: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        context: BUILDING_FLAT_LAYER_ORDER_CONTEXT,
        pin: POST_V1_GATE_CU_VALUE_PINS.building,
        targetOutputs: POST_V1_GATE_CU_BUILDING_TARGET_OUTPUTS
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
        airborneContext: testCase.context,
        calculator: "dynamic",
        targetOutputs: testCase.targetOutputs
      });

      expect(result.supportedTargetOutputs, testCase.basis).toEqual([...testCase.targetOutputs]);
      expect(result.unsupportedTargetOutputs, testCase.basis).toEqual([]);
      expect(result.airborneBasis, testCase.basis).toMatchObject({
        method: testCase.basis,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.assumptions, testCase.basis).toContain(
        `base lab-family method remains ${GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD}`
      );
      expect(result.airborneCandidateResolution, testCase.basis).toMatchObject({
        selectedCandidateId: testCase.pin.candidateId,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.layerCombinationResolverTrace, testCase.basis).toMatchObject({
        runtimeBasisId: testCase.pin.basis,
        supportedMetrics: [...testCase.targetOutputs]
      });

      for (const output of testCase.targetOutputs) {
        expect(result.metrics[fieldMetricFieldByOutput[output]], `${testCase.basis}:${output}`).toBe(
          testCase.pin.metrics[output]
        );
      }
    }
  });

  it("keeps unsafe flat-layer-order multicavity boundaries closed", () => {
    const missingSupportInference = inferSafeFlatWallMulticavityAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: {
        ...LAB_FLAT_LAYER_ORDER_CONTEXT,
        wallTopology: {
          topologyMode: "flat_layer_order"
        }
      },
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      targetOutputs: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    });
    const missingSupport = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: {
        ...LAB_FLAT_LAYER_ORDER_CONTEXT,
        wallTopology: {
          topologyMode: "flat_layer_order"
        }
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    });
    const contradictoryFlatGroups = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_STALE_FLAT_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    });
    const missingFieldRt60 = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: {
        ...FIELD_FLAT_LAYER_ORDER_CONTEXT,
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS
    });

    expect(missingSupportInference).toBeNull();
    expect(missingSupport.supportedTargetOutputs).toEqual([]);
    expect(missingSupport.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_CU_LAB_TARGET_OUTPUTS]);
    expect(missingSupport.airborneBasis).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["supportTopology"]),
      origin: "needs_input"
    });

    expect(contradictoryFlatGroups.airborneBasis?.method).not.toBe(GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD);
    expect(contradictoryFlatGroups.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      POST_V1_GATE_CU_VALUE_PINS.lab.candidateId
    );

    expect(missingFieldRt60.supportedTargetOutputs).toEqual([]);
    expect(missingFieldRt60.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS]);
    expect(missingFieldRt60.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
  });

  it("keeps ASTM impact aliases unsupported while widening ISO wall airborne formula routing", () => {
    const astm = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: LAB_FLAT_LAYER_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: AST_MIC_OUTPUTS
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astm.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(POST_V1_GATE_CU_COUNTERS.wrongFallbackOrAliasBlocks).toContain(
      "lab Rw/STC/C/Ctr are not relabelled as field or building outputs without the Gate I/Gate AR adapters"
    );
  });

  it("keeps docs and current-gate runner aligned with the landed Gate CU runtime move", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("Rw 53 / STC 57 / C -0.6 / Ctr -8");
      expect(contents, path).toContain("R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts");
  });
});
