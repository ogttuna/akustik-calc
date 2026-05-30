import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_P_INDEPENDENT_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_GATE_P_RESILIENT_BOTH_SIDES_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_LANDED_GATE,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_FILE,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTION_STATUS
} from "./post-v1-wall-double-leaf-auto-topology-gate-p";
import { inferSafeFlatWallDoubleLeafAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const ABSORBED_DOUBLE_LEAF_FLAT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const INDEPENDENT_SUPPORT_HINT_CONTEXT = {
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const RESILIENT_BOTH_SIDES_HINT_CONTEXT = {
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "resilient_channel"
  }
} as const satisfies AirborneContext;

const RESILIENT_MISSING_SIDE_CONTEXT = {
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "resilient_channel"
  }
} as const satisfies AirborneContext;

const NO_SUPPORT_CONTEXT = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600
} as const satisfies AirborneContext;

const EXPLICIT_FLAT_CONTEXT = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall double-leaf auto-topology Gate P", () => {
  it("routes safe flat independent double-leaf walls into the existing family formula", () => {
    const inferred = inferSafeFlatWallDoubleLeafAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: INDEPENDENT_SUPPORT_HINT_CONTEXT,
      layers: ABSORBED_DOUBLE_LEAF_FLAT_STACK,
      targetOutputs: WALL_OUTPUTS
    });
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: INDEPENDENT_SUPPORT_HINT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
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
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      valuePins: [...POST_V1_GATE_P_INDEPENDENT_AUTO_TOPOLOGY_VALUE_PINS]
    });
  });

  it("calculates resilient double-leaf when side count is explicit and blocks it when side count is missing", () => {
    const resilient = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: RESILIENT_BOTH_SIDES_HINT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const missingSideCount = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: RESILIENT_MISSING_SIDE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(resilient.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 47,
      estimatedStc: 47
    });
    expect(resilient.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      valuePins: [...POST_V1_GATE_P_RESILIENT_BOTH_SIDES_AUTO_TOPOLOGY_VALUE_PINS]
    });
    expect(missingSideCount.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
  });

  it("does not guess support topology or override an explicit flat topology", () => {
    const noSupport = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: NO_SUPPORT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const explicitFlat = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: EXPLICIT_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    for (const result of [noSupport, explicitFlat]) {
      expect(result.airborneBasis?.method).not.toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
      );
    }
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_LANDED_GATE).toBe(
      "post_v1_wall_double_leaf_auto_topology_gate_p_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTION_STATUS).toBe(
      "post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_q_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-q-contract.test.ts"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate Q"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts"
    );
  });
});
