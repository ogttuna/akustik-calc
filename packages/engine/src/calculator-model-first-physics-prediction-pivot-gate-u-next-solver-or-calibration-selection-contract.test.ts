import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateUNextSolverOrCalibrationSelection } from "./dynamic-calculator-next-solver-or-calibration-selection";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_U = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts",
  selectionStatus:
    "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_U_SURFACES = [
  "packages/engine/src/dynamic-calculator-next-solver-or-calibration-selection.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_FRAMED_CONTEXT: AirborneContext = {
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

const DOUBLE_LEAF_FRAMED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const VISIBLE_AIRBORNE_STACK_FOR_IMPACT_PREDICTOR: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 90 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate U", () => {
  it("lands the next solver/calibration selection and selects Gate V", () => {
    expect(MODEL_FIRST_GATE_U).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts",
      selectionStatus:
        "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_U_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects floor impact dynamic-stiffness input and adapter ownership instead of source catalog expansion", () => {
    const selection = buildGateUNextSolverOrCalibrationSelection();

    expect(selection).toMatchObject({
      landedGate: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
      selectedNextAction:
        "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts",
      selectionStatus:
        "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v"
    });
    expect(selection.candidateIds).toEqual([
      "floor_impact_dynamic_stiffness_solver",
      "field_building_prediction_context_solver",
      "triple_multicavity_generalized_solver",
      "lined_massive_masonry_clt_solver",
      "double_leaf_framed_calibration_holdout",
      "single_leaf_massive_panel_calibration_holdout"
    ]);
    expect(selection.selectionPolicy).toEqual([
      "after Gate T, prefer the highest personal-use coverage gap whose required material properties are complete",
      "prefer a source-absent algorithm/input contract over collecting a finite catalog of measured rows",
      "keep calibration and exact-source rows as later override/holdout work when they tighten an already-owned solver",
      "do not promote Ln,w, L'n,w, L'nT,w, IIC, or AIIC until ISO 717-2 and ASTM E989 adapter boundaries are explicit"
    ]);
    expect(selection.gateTMaterialGapClosureEvidence.map((entry) => [entry.scenarioId, entry.status])).toEqual([
      ["gate_t_board_leaf_finish_default_closure", "complete"],
      ["gate_t_masonry_core_finish_default_closure", "complete"],
      ["gate_t_porous_absorber_default_closure", "complete"],
      ["gate_t_floor_deck_screed_default_closure", "complete"],
      ["gate_t_limp_membrane_default_closure", "complete"],
      ["gate_t_resilient_impact_layer_default_closure", "complete"]
    ]);
    expect(selection.selectedCandidate).toMatchObject({
      id: "floor_impact_dynamic_stiffness_solver",
      materialReadiness: {
        scenarioIds: [
          "gate_t_floor_deck_screed_default_closure",
          "gate_t_limp_membrane_default_closure",
          "gate_t_resilient_impact_layer_default_closure"
        ],
        status: "complete"
      },
      nextSafeMoveType: "floor_impact_dynamic_stiffness_input_adapter_contract",
      route: "floor",
      runtimePromotionAllowedNow: false,
      selected: true,
      sourceRowsRequiredForNextMove: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "IIC"]
    });
    expect(selection.selectedCandidate.requiredOwnersBeforeRuntime).toEqual([
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ISO7172LnwAdapter",
      "fieldImpactContextBoundary",
      "ASTME989IICAdapterBoundary"
    ]);
    expect(selection.selectedCandidate.whyNotRuntimeYet).toEqual([
      "Ln_w_and_IIC_must_not_be_aliased",
      "field_impact_outputs_need_explicit_lab_or_field_basis_before_values_can_promote",
      "dynamic_stiffness_and_load_basis_need_positive_and_nearby_negative_contract_tests"
    ]);
    expect(selection.selectedCandidate.scoring.score).toBeGreaterThan(
      Math.max(
        ...selection.candidates
          .filter((candidate) => candidate.id !== selection.selectedCandidate.id)
          .map((candidate) => candidate.scoring.score)
      )
    );
  });

  it("keeps calibration and higher-risk wall continuations explicit but not selected", () => {
    const selection = buildGateUNextSolverOrCalibrationSelection();
    const byId = new Map(selection.candidates.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("field_building_prediction_context_solver")).toMatchObject({
      nextSafeMoveType: "field_building_context_contract",
      route: "wall",
      runtimePromotionAllowedNow: false,
      sourceRowsRequiredForNextMove: false
    });
    expect(byId.get("triple_multicavity_generalized_solver")).toMatchObject({
      nextSafeMoveType: "generalized_multicavity_transfer_contract",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("lined_massive_masonry_clt_solver")).toMatchObject({
      nextSafeMoveType: "lined_masonry_clt_boundary_contract",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("double_leaf_framed_calibration_holdout")).toMatchObject({
      calibrationTighteningOnly: true,
      nextSafeMoveType: "calibration_holdout_contract",
      sourceRowsRequiredForNextMove: true
    });
    expect(byId.get("single_leaf_massive_panel_calibration_holdout")).toMatchObject({
      calibrationTighteningOnly: true,
      nextSafeMoveType: "calibration_holdout_contract",
      sourceRowsRequiredForNextMove: true
    });
    expect(
      selection.candidates
        .filter((candidate) => candidate.sourceRowsRequiredForNextMove)
        .every((candidate) => candidate.selected === false)
    ).toBe(true);
  });

  it("keeps existing wall and floor runtime values stable while Gate U only selects the next contract", () => {
    const wall = calculateAssembly(DOUBLE_LEAF_FRAMED_STACK, {
      airborneContext: DOUBLE_LEAF_FRAMED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const floor = calculateAssembly(VISIBLE_AIRBORNE_STACK_FOR_IMPACT_PREDICTOR, {
      impactPredictorInput: {
        baseSlab: {
          densityKgM3: 2400,
          materialClass: "heavy_concrete",
          thicknessMm: 150
        },
        floatingScreed: {
          densityKgM3: 2000,
          materialClass: "generic_screed",
          thicknessMm: 30
        },
        floorCovering: {
          densityKgM3: 2000,
          materialClass: "ceramic_tile",
          mode: "material_layer",
          thicknessMm: 8
        },
        impactSystemType: "heavy_floating_floor",
        resilientLayer: {
          dynamicStiffnessMNm3: 30,
          thicknessMm: 8
        },
        structuralSupportType: "reinforced_concrete"
      },
      targetOutputs: IMPACT_OUTPUTS
    });

    expect(wall.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(wall.airborneBasis).toMatchObject({
      method: "gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime",
      origin: "family_physics_prediction"
    });
    expect(floor.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(floor.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps docs and current-gate runner aligned with Gate U closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts"
    );
  });
});
