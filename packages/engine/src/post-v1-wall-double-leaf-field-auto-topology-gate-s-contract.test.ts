import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_S_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_LANDED_GATE,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_FILE,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTION_STATUS
} from "./post-v1-wall-double-leaf-field-auto-topology-gate-s";
import {
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_FILE,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTION_STATUS
} from "./post-v1-wall-field-auto-topology-gate-r";
import { inferSafeFlatWallDoubleLeafAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_CORE_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const ABSORBED_DOUBLE_LEAF_FLAT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

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

const MISSING_RT60_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const NO_SUPPORT_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall double-leaf field auto-topology Gate S", () => {
  it("turns explicit-support flat double-leaf field requests into field apparent family-physics answers", () => {
    const inferred = inferSafeFlatWallDoubleLeafAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: COMPLETE_FIELD_CONTEXT,
      layers: ABSORBED_DOUBLE_LEAF_FLAT_STACK,
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(inferred).toMatchObject({
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "independent_frames",
      topologyMode: "double_leaf_framed"
    });
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 38.5,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwPrimeDb: 39
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD}`
      ])
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_airborne_field_context_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: [...POST_V1_GATE_S_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_VALUE_PINS]
    });
    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("uses the inferred double-leaf topology to ask for missing RT60 instead of manual leaf groups", () => {
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: MISSING_RT60_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_CORE_OUTPUTS
    });

    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input",
      route: "wall",
      unsupportedOutputs: ["R'w", "DnT,w"]
    });
    expect(result.acousticAnswerBoundary?.missingPhysicalInputs).not.toEqual(
      expect.arrayContaining(["sideALeafGroup", "cavity1DepthMm", "sideBLeafGroup", "supportTopology"])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      requiredInputs: ["receivingRoomRt60S"]
    });
  });

  it("does not guess support topology for field double-leaf promotion", () => {
    expect(
      inferSafeFlatWallDoubleLeafAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: NO_SUPPORT_FIELD_CONTEXT,
        layers: ABSORBED_DOUBLE_LEAF_FLAT_STACK,
        targetOutputs: WALL_FIELD_CORE_OUTPUTS
      })
    ).toBeNull();

    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: NO_SUPPORT_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_CORE_OUTPUTS
    });

    expect(result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(result.airborneBasis?.method).not.toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
    );
    expect(result.layerCombinationResolverTrace).not.toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
    });
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTION_STATUS).toBe(
      "post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_s_plan"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-s-contract.test.ts"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_LANDED_GATE).toBe(
      "post_v1_wall_double_leaf_field_auto_topology_gate_s_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTION_STATUS).toBe(
      "post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_t_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-t-contract.test.ts"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate T"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts"
    );
  });
});
