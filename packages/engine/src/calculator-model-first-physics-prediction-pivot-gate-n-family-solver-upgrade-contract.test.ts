import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateNDynamicCalculatorFamilySolverUpgradeSelection } from "./dynamic-calculator-family-solver-upgrade-selection";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_N = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts",
  selectionStatus:
    "gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_N_SURFACES = [
  "packages/engine/src/dynamic-calculator-family-solver-upgrade-selection.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md"
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

describe("calculator model-first physics prediction pivot Gate N", () => {
  it("lands the family-solver upgrade selection contract and selects Gate O", () => {
    expect(MODEL_FIRST_GATE_N).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts",
      selectionStatus:
        "gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_N_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects single-leaf/massive/panel as the first runtime family upgrade instead of a source-library path", () => {
    const selection = buildGateNDynamicCalculatorFamilySolverUpgradeSelection();

    expect(selection.numericRuntimeBehaviorChange).toBe(false);
    expect(selection.candidateIds).toEqual([
      "single_leaf_massive_panel_solver",
      "double_leaf_framed_bridge_solver",
      "triple_multicavity_generalized_solver",
      "lined_massive_masonry_clt_solver",
      "floor_impact_dynamic_stiffness_solver",
      "field_building_prediction_context_solver"
    ]);
    expect(selection.selectionPolicy).toEqual([
      "pick the smallest source-independent family runtime move that improves calculator origin/basis correctness",
      "prefer an already-visible family candidate whose values can be pinned while support/origin metadata is upgraded",
      "defer families whose first safe runtime move depends on bridge, room, impact, or generalized multi-cavity topology owners",
      "trusted source rows remain calibration/override evidence, not the reason a source-absent physics solver exists"
    ]);
    expect(selection.selectedCandidate).toMatchObject({
      currentRuntimePosture: "screening_selected_family_candidate_visible",
      dynamicAirborneFamilies: ["single_leaf_panel", "laminated_single_leaf", "rigid_massive_wall"],
      hardBlockersBeforeGate: [],
      id: "single_leaf_massive_panel_solver",
      materialReadinessStatus: "complete",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.selectedCandidate.delegateMethods).toEqual([
      "mass_law",
      "sharp",
      "kurtovic",
      "ks_rw_calibrated"
    ]);
    expect(selection.selectedCandidate.methodOwners).toEqual([
      "mass_law_surface_density_curve",
      "sharp_single_panel_coincidence_delegate",
      "kurtovic_cremer_coincidence_signal",
      "ks_massive_wall_reference_curve"
    ]);
    expect(selection.selectedCandidate.requiredPhysicalInputs).toEqual([
      "materialClass",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm"
    ]);
    expect(selection.selectedCandidate.acceptanceChecklist).toEqual(
      expect.arrayContaining([
        "single_leaf_input_completeness_row_names_density_thickness_surface_mass_and_optional_stiffness_loss_factor",
        "family_physics_candidate_can_select_without_source_rows_when_physical_inputs_are_complete",
        "visible_card_saved_replay_pdf_and_docx_basis_origin_parity_is_asserted"
      ])
    );
  });

  it("keeps higher-risk families deferred with explicit physics blockers, not missing-source excuses", () => {
    const selection = buildGateNDynamicCalculatorFamilySolverUpgradeSelection();
    const byId = new Map(selection.candidates.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("triple_multicavity_generalized_solver")).toMatchObject({
      currentRuntimePosture: "narrow_family_prediction_already_landed",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(byId.get("triple_multicavity_generalized_solver")?.deferralReasons).toEqual([
      "Gate_G_already_landed_the_narrow_grouped_Rockwool_two_cavity_runtime_move",
      "general_multi_cavity_solver_needs_transfer_matrix_or_impedance_network_scope_before_broad_promotion"
    ]);
    expect(byId.get("double_leaf_framed_bridge_solver")?.hardBlockersBeforeGate).toEqual([
      "frameBridgeClass",
      "studSpacingMm",
      "resilientSideCount"
    ]);
    expect(byId.get("floor_impact_dynamic_stiffness_solver")?.hardBlockersBeforeGate).toEqual([
      "dynamicStiffnessMNm3",
      "loadBasisKgM2",
      "impactRatingAdapterOwner"
    ]);
    expect(byId.get("field_building_prediction_context_solver")?.hardBlockersBeforeGate).toEqual([
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption"
    ]);
    expect(
      selection.candidates.every((candidate) => candidate.sourceRowsRequiredForRuntimeSelection === false)
    ).toBe(true);
    expect(selection.selectedCandidate.ranking.score).toBeGreaterThan(
      Math.max(
        ...selection.candidates
          .filter((candidate) => candidate.id !== selection.selectedCandidate.id)
          .map((candidate) => candidate.ranking.score)
      )
    );
  });

  it("pins the selected Gate O runtime values after family-physics origin promotion lands", () => {
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
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(gypsum.metrics).toMatchObject({
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(gypsum.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "single_leaf_panel",
      selectedMethod: "sharp",
      strategy: "single_leaf_sharp_delegate"
    });
    expect(gypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(laminated.metrics).toMatchObject({
      estimatedRwDb: 34,
      estimatedStc: 34
    });
    expect(laminated.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "laminated_single_leaf",
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(laminated.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(concrete.metrics).toMatchObject({
      estimatedRwDb: 55,
      estimatedStc: 55
    });
    expect(concrete.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "rigid_massive_wall",
      selectedMethod: "ks_rw_calibrated",
      strategy: "rigid_massive_blend"
    });
    expect(concrete.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(groupedRockwool.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate N closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts"
    );
  });
});
