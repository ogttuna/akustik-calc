import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_FILE,
  POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTION_STATUS
} from "./post-v1-wall-double-leaf-auto-topology-gate-p";
import {
  POST_V1_GATE_Q_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_LANDED_GATE,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_FILE,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTION_STATUS
} from "./post-v1-wall-full-fill-multicavity-auto-topology-gate-q";
import { inferSafeFlatWallMulticavityAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const FULL_FILL_FLAT_MULTICAVITY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXPLICIT_SUPPORT_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const LEGACY_SUPPORT_HINT_ONLY_CONTEXT = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600
} as const satisfies AirborneContext;

const EXPLICIT_FLAT_CONTEXT = {
  contextMode: "element_lab",
  wallTopology: {
    supportTopology: "independent_frames",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall full-fill multicavity auto-topology Gate Q", () => {
  it("turns explicit-support full-fill flat triple-leaf walls into a numeric family formula answer", () => {
    const inferred = inferSafeFlatWallMulticavityAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: EXPLICIT_SUPPORT_CONTEXT,
      layers: FULL_FILL_FLAT_MULTICAVITY_STACK,
      targetOutputs: WALL_OUTPUTS
    });
    const result = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: EXPLICIT_SUPPORT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(inferred).toMatchObject({
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: 90,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [3],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [2],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [4],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -2.6,
      estimatedCtrDb: -9.4,
      estimatedRwDb: 52,
      estimatedStc: 53
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "triple_leaf_two_cavity_frequency_solver",
      selectedCandidateId: "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [...POST_V1_GATE_Q_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_VALUE_PINS]
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("does not guess full-fill support topology from legacy hints or override explicit flat topology", () => {
    const legacyHintOnly = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: LEGACY_SUPPORT_HINT_ONLY_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const explicitFlat = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: EXPLICIT_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(
      inferSafeFlatWallMulticavityAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: LEGACY_SUPPORT_HINT_ONLY_CONTEXT,
        layers: FULL_FILL_FLAT_MULTICAVITY_STACK,
        targetOutputs: WALL_OUTPUTS
      })
    ).toBeNull();

    for (const result of [legacyHintOnly, explicitFlat]) {
      expect(result.airborneBasis?.method).not.toBe("triple_leaf_two_cavity_frequency_solver");
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        "candidate_grouped_rockwool_family_physics_prediction"
      );
    }
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTION_STATUS).toBe(
      "post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_q_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_AUTO_TOPOLOGY_GATE_P_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-q-contract.test.ts"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_LANDED_GATE).toBe(
      "post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTION_STATUS).toBe(
      "post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_r_plan"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-r-contract.test.ts"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate R"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts"
    );
  });
});
