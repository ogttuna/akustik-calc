import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL } from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_R_WALL_FIELD_AUTO_TOPOLOGY_VALUE_PINS,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_LANDED_GATE,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_FILE,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTION_STATUS
} from "./post-v1-wall-field-auto-topology-gate-r";
import {
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_FILE,
  POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTION_STATUS
} from "./post-v1-wall-full-fill-multicavity-auto-topology-gate-q";
import { inferSafeFlatWallMulticavityAutoTopology } from "./wall-flat-multicavity-auto-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_CORE_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const FULL_FILL_FLAT_MULTICAVITY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
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
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const MISSING_RT60_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const NO_SUPPORT_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall field auto-topology Gate R", () => {
  it("turns explicit-support full-fill flat multicavity field requests into field apparent numeric answers", () => {
    const inferred = inferSafeFlatWallMulticavityAutoTopology({
      catalog: getDefaultMaterialCatalog(),
      context: COMPLETE_FIELD_CONTEXT,
      layers: FULL_FILL_FLAT_MULTICAVITY_STACK,
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const result = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
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
      estimatedDnADb: 48.5,
      estimatedDnTADb: 50.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 50,
      estimatedRwPrimeDb: 50
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_airborne_field_context_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: [...POST_V1_GATE_R_WALL_FIELD_AUTO_TOPOLOGY_VALUE_PINS]
    });
    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("uses the inferred topology to ask for missing field context instead of manual leaf groups", () => {
    const result = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
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
      expect.arrayContaining(["sideALeafGroup", "cavity1DepthMm", "internalLeafGroup", "supportTopology"])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      requiredInputs: ["receivingRoomRt60S"]
    });
  });

  it("does not guess field support topology or promote air-gap-only Gate O field requests", () => {
    expect(
      inferSafeFlatWallMulticavityAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: NO_SUPPORT_FIELD_CONTEXT,
        layers: FULL_FILL_FLAT_MULTICAVITY_STACK,
        targetOutputs: WALL_FIELD_CORE_OUTPUTS
      })
    ).toBeNull();
    expect(
      inferSafeFlatWallMulticavityAutoTopology({
        catalog: getDefaultMaterialCatalog(),
        context: NO_SUPPORT_FIELD_CONTEXT,
        layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
        targetOutputs: WALL_FIELD_CORE_OUTPUTS
      })
    ).toBeNull();

    const result = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: NO_SUPPORT_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_CORE_OUTPUTS
    });

    expect(result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      "candidate_airborne_field_context_family_physics_prediction"
    );
    expect(result.layerCombinationResolverTrace).not.toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTION_STATUS).toBe(
      "post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_r_plan"
    );
    expect(POST_V1_WALL_FULL_FILL_MULTICAVITY_AUTO_TOPOLOGY_GATE_Q_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-r-contract.test.ts"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_LANDED_GATE).toBe(
      "post_v1_wall_field_auto_topology_gate_r_plan"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTION_STATUS).toBe(
      "post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_s_plan"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-s-contract.test.ts"
    );
    expect(POST_V1_WALL_FIELD_AUTO_TOPOLOGY_GATE_R_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate S"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts");
  });
});
