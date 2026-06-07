import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner";
import {
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS
} from "./layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_EMPTY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const SINGLE_GYPSUM_BOARD = [{ materialId: "gypsum_board", thicknessMm: 12.5 }] as const satisfies readonly LayerInput[];

const INDEPENDENT_ABSORBED_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
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
};

const RESILIENT_COMPLETE_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh.ts",
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
  "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function ownerTermById(id: string) {
  const term = buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract().ownerTerms.find(
    (entry) => entry.id === id
  );
  if (!term) {
    throw new Error(`Missing double-leaf/framed wall owner term ${id}.`);
  }

  return term;
}

describe("layer combination resolver double-leaf framed wall banded solver owner contract", () => {
  it("lands the no-runtime owner and selects the formula corridor next", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      plannedFormulaCorridorBasis:
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS,
      previousPostSingleLeafMatrixRefresh: {
        landedGate: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
      selectedPostSingleLeafGapId: "double_leaf_framed_wall_banded_solver_owner",
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS,
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      blockedActionCount: 8,
      gateRScenarioCount: 5,
      negativeOrSeparateBoundaryCount: 4,
      ownerTermCount: 15,
      routeAdmissionCount: 6,
      runtimeProbeCount: 5,
      selectedFormulaScopeCount: 2,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION
    });
    expect(contract.existingDynamicRuntimeCandidate).toMatchObject({
      candidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      currentRuntimeMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      notYetRegisteredAsLayerCombinationResolverCandidate: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("owns the physical fields needed for a double-leaf/framed formula corridor", () => {
    expect(ownerTermById("route_double_leaf_framed_topology_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining([
        "route=wall",
        "wallTopology.topologyMode=double_leaf_framed",
        "sideALeafLayerIndices",
        "sideBLeafLayerIndices",
        "exactlyOnePrimaryCavity"
      ]),
      status: "owned_for_formula_corridor"
    });
    expect(ownerTermById("cavity_depth_mass_air_mass_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["cavity1DepthMm", "massAirMassResonanceHz"]),
      status: "owned_for_formula_corridor"
    });
    expect(ownerTermById("porous_absorber_flow_resistivity_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["flowResistivityPaSM2", "porousDampingCreditDb"]),
      status: "owned_for_formula_corridor"
    });
    expect(ownerTermById("support_bridge_coupling_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["supportTopology", "frameBridgeClass", "bridgeCouplingDeltaDb"]),
      status: "owned_for_formula_corridor"
    });
    expect(ownerTermById("banded_tl_curve_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["oneThirdOctaveBandSet", "transmissionLossCurve50To3150Hz"]),
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(ownerTermById("exact_source_precedence_holdout_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["sameStackExactSourceId", "negativeNearMissRows"]),
      status: "owned_for_formula_corridor"
    });
    expect(ownerTermById("triple_leaf_multicavity_boundary_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining(["doNotReassignTripleLeafRuntime"]),
      status: "owned_for_negative_boundary"
    });
  });

  it("admits only explicit wall double-leaf/framed scopes and keeps nearby boundaries fail-closed", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract();

    expect(contract.routeAdmissions).toEqual([
      expect.objectContaining({
        existingRuntimeCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
        id: "wall.double_leaf_framed.independent_absorbed.element_lab",
        ownedMetrics: ["Rw", "C", "Ctr", "STC"],
        selectedForFormulaCorridor: true,
        status: "selected_formula_scope"
      }),
      expect.objectContaining({
        existingRuntimeCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
        id: "wall.double_leaf_framed.resilient_explicit.element_lab",
        selectedForFormulaCorridor: true,
        status: "selected_formula_scope"
      }),
      expect.objectContaining({
        existingRuntimeCandidateId: "candidate_dynamic_needs_input",
        id: "wall.double_leaf_framed.resilient_missing_side_count.needs_input",
        selectedForFormulaCorridor: false,
        status: "needs_input_boundary"
      }),
      expect.objectContaining({
        id: "wall.double_leaf_framed.direct_fixed.element_lab",
        selectedForFormulaCorridor: false,
        status: "blocked_boundary"
      }),
      expect.objectContaining({
        id: "wall.grouped_triple_leaf_or_multicavity.separate_owner",
        selectedForFormulaCorridor: false,
        status: "separate_owner_boundary"
      }),
      expect.objectContaining({
        basis: "building_prediction",
        id: "wall.field_building_from_lab_double_leaf.blocked",
        selectedForFormulaCorridor: false,
        status: "blocked_boundary"
      })
    ]);
    expect(contract.blockedNextActions.map((action) => action.id)).toEqual([
      "registry_runtime_promotion_before_formula_corridor",
      "direct_fixed_double_leaf_runtime",
      "triple_leaf_runtime_reassignment",
      "field_building_runtime_promotion",
      "floor_impact_from_wall_airborne",
      "astm_stc_alias_runtime",
      "tolerance_retune_without_holdouts",
      "broad_source_crawl"
    ]);
    expect(contract.gateRScenarioStatuses.map((entry) => entry.status)).toEqual([
      "solver_candidate_ready",
      "solver_candidate_ready",
      "needs_input",
      "negative_boundary",
      "family_boundary_rejected"
    ]);
  });

  it("proves existing Gate S and single-leaf values stay frozen while the owner remains no-runtime", () => {
    const independent = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: INDEPENDENT_ABSORBED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const resilient = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_COMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const missingSideCount = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const singleLeaf = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(independent.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(independent.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(independent.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(independent.warnings).toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);

    expect(resilient.metrics).toMatchObject({ estimatedRwDb: 46, estimatedStc: 46 });
    expect(resilient.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
    });

    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });

    expect(directFixed.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixed.metrics).toMatchObject({
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(directFixed.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(directFixed.airborneBasis?.method).not.toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);

    expect(singleLeaf.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(singleLeaf.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    });

    expect(buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract().runtimeProbeExpectations).toEqual([
      expect.objectContaining({ currentRw: 45, currentStc: 45, id: "wall.explicit_independent_absorbed_double_leaf_runtime" }),
      expect.objectContaining({ currentRw: 46, currentStc: 46, id: "wall.resilient_double_leaf_runtime" }),
      expect.objectContaining({ currentRw: null, id: "wall.resilient_double_leaf_missing_side_count_needs_input" }),
      expect.objectContaining({
        currentMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
        currentRw: 31,
        currentStc: 31,
        id: "wall.direct_fixed_double_leaf_gate_eo_separate_runtime",
        selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
      }),
      expect.objectContaining({ currentRw: 53, currentStc: 64, id: "wall.grouped_triple_leaf_calibrated_boundary" })
    ]);
  });

  it("keeps docs, exports, and current gate runner aligned with the double-leaf owner", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE);
      expect(content, path).toContain(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS
      );
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("double-leaf");
      expect(normalized, path).toContain("framed");
      expect(normalized, path).toContain("mass-air-mass");
      expect(normalized, path).toContain("flow resistivity");
      expect(content, path).toContain("resilientBarSideCount");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    expect(index).toContain("./layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner");

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts"
    );
  });
});
