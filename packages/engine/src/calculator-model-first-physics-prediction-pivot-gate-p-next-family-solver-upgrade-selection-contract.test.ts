import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGatePNextFamilySolverUpgradeSelection } from "./dynamic-calculator-next-family-solver-upgrade-selection";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_P = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts",
  selectionStatus:
    "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_P_SURFACES = [
  "packages/engine/src/dynamic-calculator-next-family-solver-upgrade-selection.ts",
  "packages/engine/src/dynamic-calculator-family-solver-upgrade-selection.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md"
] as const;

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_GYPSUM_BOARD_LAMINATED: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const RIGID_CONCRETE_PANEL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 150 }
] as const;

const CLT_PANEL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 100 }
] as const;

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate P", () => {
  it("lands the next-family solver selection contract and selects Gate Q", () => {
    expect(MODEL_FIRST_GATE_P).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts",
      selectionStatus:
        "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_P_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects double-leaf framed bridge as the next calculator family without turning the project into a source library", () => {
    const selection = buildGatePNextFamilySolverUpgradeSelection();

    expect(selection).toMatchObject({
      landedGate: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
      numericRuntimeBehaviorChange: false,
      previousLandedGate:
        "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
      selectedNextAction:
        "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts",
      selectionStatus:
        "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q"
    });
    expect(selection.candidateIds).toEqual([
      "double_leaf_framed_bridge_solver",
      "triple_multicavity_generalized_solver",
      "lined_massive_masonry_clt_solver",
      "floor_impact_dynamic_stiffness_solver",
      "field_building_prediction_context_solver"
    ]);
    expect(selection.selectionPolicy).toEqual([
      "after Gate O, exclude the already-landed single-leaf family from the next-upgrade ranking",
      "select the next family whose input contract can unlock broad source-absent calculator coverage without moving runtime values yet",
      "prefer wall lab-element family physics before field/building continuation when room and flanking context are still unowned",
      "trusted source rows can override, calibrate, or hold out the selected family later, but they are not required for this solver contract"
    ]);
    expect(selection.singleLeafGateOCompletionEvidence).toEqual({
      coveredFamilies: ["single_leaf_panel", "laminated_single_leaf", "rigid_massive_wall"],
      gateOSelectedOrigin: "family_physics_prediction",
      runtimeValueMovement: false,
      valuePinsRemainRequired: true
    });
    expect(selection.selectedCandidate).toMatchObject({
      baseCandidateId: "double_leaf_framed_bridge_solver",
      id: "double_leaf_framed_bridge_solver",
      nextSafeMoveType: "double_leaf_bridge_input_and_benchmark_contract",
      routeBasisRisk: "lab_element",
      runtimePromotionAllowedNow: false,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.selectedCandidate.baseCandidate).toMatchObject({
      currentRuntimePosture: "needs_topology_and_coupling_owner",
      dynamicAirborneFamilies: ["double_leaf", "stud_wall_system", "double_stud_system"],
      materialReadinessStatus: "complete",
      route: "wall",
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(selection.selectedCandidate.baseCandidate.hardBlockersBeforeGate).toEqual([
      "frameBridgeClass",
      "studSpacingMm",
      "resilientSideCount"
    ]);
    expect(selection.selectedCandidate.requiredOwnersBeforeRuntime).toEqual([
      "frameBridgeClass",
      "studSpacingMm",
      "resilientSideCount",
      "supportTopology",
      "porousCavityDampingOwner",
      "massAirMassResonanceOwner"
    ]);
    expect(selection.selectedCandidate.whyNotRuntimeYet).toEqual([
      "frame_bridge_class_and_stud_spacing_are_not_yet_runtime_owned",
      "resilient_side_count_and_support_topology_need_visible_missing_input_prompts",
      "mass_air_mass_resonance_and_porous_cavity_damping_need_positive_and_negative_benchmarks"
    ]);
    expect(selection.selectedCandidate.scoring.score).toBeGreaterThan(
      Math.max(
        ...selection.candidates
          .filter((candidate) => candidate.id !== selection.selectedCandidate.id)
          .map((candidate) => candidate.scoring.score)
      )
    );
  });

  it("keeps deferred families explicit by physics blocker and output basis", () => {
    const selection = buildGatePNextFamilySolverUpgradeSelection();
    const byId = new Map(selection.candidates.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("triple_multicavity_generalized_solver")).toMatchObject({
      nextSafeMoveType: "generalized_multicavity_transfer_contract",
      routeBasisRisk: "lab_element_high_risk",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("triple_multicavity_generalized_solver")?.requiredOwnersBeforeRuntime).toEqual([
      "generalGroupedLeafGraph",
      "limpMassPositionOwner",
      "multiCavityTransferOwner",
      "unsafeFlatListInternalLeafGuard"
    ]);
    expect(byId.get("floor_impact_dynamic_stiffness_solver")).toMatchObject({
      nextSafeMoveType: "floor_impact_adapter_contract",
      routeBasisRisk: "impact_route",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("floor_impact_dynamic_stiffness_solver")?.requiredOwnersBeforeRuntime).toEqual([
      "dynamicStiffnessMNm3",
      "loadBasisKgM2",
      "impactRatingAdapterOwner",
      "ISO7172LnwAdapter",
      "ASTME989IICAdapterBoundary"
    ]);
    expect(byId.get("field_building_prediction_context_solver")).toMatchObject({
      nextSafeMoveType: "field_building_context_contract",
      routeBasisRisk: "field_context",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("field_building_prediction_context_solver")?.requiredOwnersBeforeRuntime).toEqual([
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "labToFieldBasisDeltaOwner"
    ]);
    expect(byId.get("lined_massive_masonry_clt_solver")).toMatchObject({
      nextSafeMoveType: "lined_masonry_clt_boundary_contract",
      runtimePromotionAllowedNow: false
    });
    expect(selection.candidates.every((candidate) => candidate.sourceRowsRequiredForRuntimeSelection === false)).toBe(
      true
    );
  });

  it("keeps Gate O and Gate G runtime values pinned while Gate P only selects the next contract", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const laminated = calculateAssembly(DOUBLE_GYPSUM_BOARD_LAMINATED, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const concrete = calculateAssembly(RIGID_CONCRETE_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const clt = calculateAssembly(CLT_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(gypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(gypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(laminated.metrics).toMatchObject({ estimatedRwDb: 34, estimatedStc: 34 });
    expect(laminated.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(concrete.metrics).toMatchObject({ estimatedRwDb: 55, estimatedStc: 55 });
    expect(concrete.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(clt.metrics).toMatchObject({ estimatedRwDb: 40, estimatedStc: 40 });
    expect(clt.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "screening_fallback"
    });

    expect(groupedRockwool.metrics).toMatchObject({ estimatedRwDb: 50, estimatedStc: 55 });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate P closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts"
    );
  });
});
