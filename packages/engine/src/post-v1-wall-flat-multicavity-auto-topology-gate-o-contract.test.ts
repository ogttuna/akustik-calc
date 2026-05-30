import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_STALE_FLAT_ORDER_CONTEXT,
  GATE_AB_WALL_LAB_CONTEXT,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ae-flat-multicavity";
import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS
} from "./post-v1-floor-field-building-expansion-gate-n";
import {
  POST_V1_GATE_O_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_LANDED_GATE,
  POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTION_STATUS
} from "./post-v1-wall-flat-multicavity-auto-topology-gate-o";
import { inferSafeFlatWallMulticavityAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const AMBIGUOUS_NO_AIR_GAP_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall flat multicavity auto-topology Gate O", () => {
  it("turns a safe flat wall layer order into a grouped two-cavity runtime calculation", () => {
    const inferred = inferSafeFlatWallMulticavityAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: GATE_AB_WALL_LAB_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const result = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(inferred).toMatchObject({
      cavity1DepthMm: 70,
      cavity1LayerIndices: [3, 4],
      cavity2DepthMm: 80,
      cavity2LayerIndices: [6, 7],
      internalLeafLayerIndices: [5],
      sideALeafLayerIndices: [0, 1, 2],
      sideBLeafLayerIndices: [8, 9, 10],
      topologyMode: "grouped_triple_leaf"
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.6,
      estimatedCtrDb: -8,
      estimatedRwDb: 53,
      estimatedStc: 57
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      selectedCandidateId: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "STC", value: 57 },
        { metric: "C", value: -0.6 },
        { metric: "Ctr", value: -8 }
      ]
    });
    expect(POST_V1_GATE_O_AUTO_TOPOLOGY_VALUE_PINS).toEqual([
      { metric: "Rw", value: 53 },
      { metric: "STC", value: 57 },
      { metric: "C", value: -0.6 },
      { metric: "Ctr", value: -8 }
    ]);
  });

  it("keeps ambiguous or explicitly contradicted flat topology out of the auto route", () => {
    const ambiguous = calculateAssembly(AMBIGUOUS_NO_AIR_GAP_STACK, {
      airborneContext: GATE_AB_WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const explicitFlat = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_STALE_FLAT_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const duplicateGroups = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(ambiguous.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      origin: "needs_input"
    });
    for (const result of [explicitFlat, duplicateGroups]) {
      expect(result.airborneBasis?.method).not.toBe(GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
      );
    }
  });

  it("keeps the active plan on numeric coverage instead of input-surface drift", () => {
    expect(POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_LANDED_GATE).toBe(
      "post_v1_wall_flat_multicavity_auto_topology_gate_o_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_multicavity_auto_topology_gate_o_landed_selected_next_numeric_coverage_gap"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_selection_gate_p_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-selection-gate-p-contract.test.ts"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_AUTO_TOPOLOGY_GATE_O_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap selection Gate P"
    );
    expect(POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE).toBe(
      "post_v1_floor_field_building_expansion_gate_n_plan"
    );
    expect(POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS).toBe(
      "post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields"
    );
    expect(POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION).toBe(
      "post_v1_input_surface_guided_physical_fields_gate_o_plan"
    );
    expect(POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-flat-multicavity-auto-topology-gate-o-contract.test.ts"
    );
  });
});
