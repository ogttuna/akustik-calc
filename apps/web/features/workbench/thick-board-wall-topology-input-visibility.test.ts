import { calculateAssembly } from "@dynecho/engine";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const SCREENING_METHOD = "screening_mass_law_curve_seed_v3";

const THICK_BOARD_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 100 }
] as const satisfies readonly LayerInput[];

const ACOUSTIC_GYPSUM_THICK_BOARD_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 100 }
] as const satisfies readonly LayerInput[];

function missingPhysicalInputs(result: ReturnType<typeof calculateAssembly>): readonly string[] {
  return [...new Set([
    ...(result.airborneBasis?.missingPhysicalInputs ?? []),
    ...(result.acousticAnswerBoundary?.missingPhysicalInputs ?? [])
  ])];
}

function calculateWall(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });
}

function typedCavityDraft(patch: Partial<WorkbenchWallTopologyDraft> = {}): WorkbenchWallTopologyDraft {
  return {
    ...DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
    airborneWallCavity1AbsorptionClass: "porous_absorptive",
    airborneWallCavity1DepthMm: "50",
    airborneWallCavity1FillCoverage: "full",
    airborneWallTopologyMode: "double_leaf_framed",
    ...patch
  };
}

describe("thick-board wall topology input visibility", () => {
  it("keeps a workbench typed-cavity draft wired into the engine missing-input surface", () => {
    const wallTopology = buildWorkbenchWallTopology(typedCavityDraft(), THICK_BOARD_STACK.length);

    expect(wallTopology).toEqual({
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 50,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: undefined,
      sideALeafLayerIndices: undefined,
      sideBLeafLayerIndices: undefined,
      supportTopology: "unknown",
      topologyMode: "double_leaf_framed"
    });

    const result = calculateWall(THICK_BOARD_STACK, {
      contextMode: "element_lab",
      wallTopology
    });

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
    expect(missingPhysicalInputs(result)).toEqual([
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it("keeps workbench layer-role ownership parked only on support and bridge fields", () => {
    const wallTopology = buildWorkbenchWallTopology(
      typedCavityDraft({
        airborneWallCavity1LayerIndices: "2",
        airborneWallSideALeafLayerIndices: "1",
        airborneWallSideBLeafLayerIndices: "3"
      }),
      THICK_BOARD_STACK.length
    );

    expect(wallTopology).toMatchObject({
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2]
    });

    const result = calculateWall(THICK_BOARD_STACK, {
      contextMode: "element_lab",
      wallTopology
    });

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingPhysicalInputs(result)).toEqual([
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it("keeps acoustic gypsum substitution plus typed cavity out of the screening fallback", () => {
    const wallTopology = buildWorkbenchWallTopology(typedCavityDraft(), ACOUSTIC_GYPSUM_THICK_BOARD_STACK.length);

    const result = calculateWall(ACOUSTIC_GYPSUM_THICK_BOARD_STACK, {
      contextMode: "element_lab",
      wallTopology
    });

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingPhysicalInputs(result)).toEqual([
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it("keeps complete independent workbench topology on the owned double-leaf formula corridor", () => {
    const wallTopology = buildWorkbenchWallTopology(
      typedCavityDraft({
        airborneWallCavity1LayerIndices: "2",
        airborneWallSideALeafLayerIndices: "1",
        airborneWallSideBLeafLayerIndices: "3",
        airborneWallSupportTopology: "independent_frames"
      }),
      THICK_BOARD_STACK.length
    );

    const result = calculateWall(THICK_BOARD_STACK, {
      airtightness: "good",
      contextMode: "element_lab",
      sharedTrack: "independent",
      studSpacingMm: 600,
      wallTopology
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      method: "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor",
      origin: "family_physics_prediction"
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(missingPhysicalInputs(result)).toEqual([]);
  });
});
