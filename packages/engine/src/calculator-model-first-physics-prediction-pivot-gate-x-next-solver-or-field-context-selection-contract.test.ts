import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateXNextSolverOrFieldContextSelection } from "./dynamic-calculator-next-solver-or-field-context-selection";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_X = {
  landedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousLandedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts",
  selectionStatus:
    "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_X_SURFACES = [
  "packages/engine/src/dynamic-calculator-next-solver-or-field-context-selection.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md"
] as const;

const LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate X", () => {
  it("lands a no-runtime next solver/field-context selection and selects Gate Y", () => {
    expect(MODEL_FIRST_GATE_X).toEqual({
      landedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousLandedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts",
      selectionStatus:
        "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_X_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects floor-impact field context ownership instead of catalog or broad solver work", () => {
    const selection = buildGateXNextSolverOrFieldContextSelection();

    expect(selection).toMatchObject({
      landedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
      selectedNextAction: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts",
      selectionStatus:
        "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y"
    });
    expect(selection.candidateIds).toEqual([
      "floor_impact_field_context_adapter",
      "floor_impact_input_surfacing",
      "wall_field_building_context_adapter",
      "triple_multicavity_generalized_solver",
      "astm_impact_rating_adapter",
      "double_leaf_framed_calibration_holdout"
    ]);
    expect(selection.selectionPolicy).toEqual([
      "after Gate W, continue the floor-impact lane by owning field-context inputs before any field runtime value movement",
      "prefer source-absent adapter and input ownership over collecting a finite catalog of measured rows",
      "keep exact rows and calibration rows as later anchors or overrides when topology and metric basis truly match",
      "do not promote L'n,w, L'nT,w, IIC, or AIIC by relabelling the ISO 717-2 lab Ln,w result"
    ]);
    expect(selection.gateWCompletionEvidence).toEqual({
      fieldAndAstmStillBlocked: ["L'n,w", "L'nT,w", "IIC", "AIIC"],
      labImpactRuntimeBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      promotedLabOutputs: ["Ln,w", "DeltaLw"],
      promotedPins: {
        DeltaLw: 24.3,
        LnW: 50.3
      },
      runtimeValueMovementInGateX: false
    });
    expect(selection.selectedCandidate).toMatchObject({
      calibrationTighteningOnly: false,
      id: "floor_impact_field_context_adapter",
      nextSafeMoveType: "floor_impact_field_context_contract",
      route: "floor",
      runtimePromotionAllowedNow: false,
      selected: true,
      sourceRowsRequiredForNextMove: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(selection.selectedCandidate.requiredOwnersBeforeRuntime).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "impactFieldContext",
      "flankingPathOrJunctionPolicy",
      "ISO7172FieldImpactAdapter"
    ]);
    expect(selection.selectedCandidate.whyNotRuntimeYet).toEqual([
      "lab_Ln_w_must_not_be_relabelled_as_field_L_prime_outputs",
      "room_volume_area_RT60_and_flanking_context_must_be_explicit_before_field_values_promote",
      "field_output_cards_and_reports_need_positive_and_nearby_negative_parity_tests"
    ]);
    expect(selection.selectedCandidate.scoring.score).toBeGreaterThan(
      Math.max(
        ...selection.candidates
          .filter((candidate) => candidate.id !== selection.selectedCandidate.id)
          .map((candidate) => candidate.scoring.score)
      )
    );
  });

  it("keeps Gate W runtime values stable while field impact stays a Gate Y boundary", () => {
    const lab = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: LAB_IMPACT_OUTPUTS
    });
    const fieldMissingContext = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(lab.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(lab.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);

    expect(fieldMissingContext.impact).toMatchObject({
      LnW: 50
    });
    expect(fieldMissingContext.impact?.DeltaLw).toBeUndefined();
    expect(fieldMissingContext.impact?.LPrimeNW).toBeUndefined();
    expect(fieldMissingContext.impact?.LPrimeNTw).toBeUndefined();
    expect(fieldMissingContext.supportedTargetOutputs).toEqual([]);
    expect(fieldMissingContext.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldMissingContext.airborneCandidateResolution?.selectedOrigin).toBe("needs_input");
    expect(fieldMissingContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
  });

  it("keeps deferred candidates explicit with source rows as anchors, not the product", () => {
    const selection = buildGateXNextSolverOrFieldContextSelection();
    const byId = new Map(selection.candidates.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("floor_impact_input_surfacing")).toMatchObject({
      nextSafeMoveType: "floor_impact_input_surface_contract",
      route: "floor",
      runtimePromotionAllowedNow: false,
      sourceRowsRequiredForNextMove: false
    });
    expect(byId.get("wall_field_building_context_adapter")).toMatchObject({
      nextSafeMoveType: "wall_field_building_context_contract",
      route: "wall",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("triple_multicavity_generalized_solver")).toMatchObject({
      nextSafeMoveType: "generalized_multicavity_transfer_contract",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("astm_impact_rating_adapter")).toMatchObject({
      nextSafeMoveType: "astm_impact_rating_adapter_contract",
      route: "floor",
      runtimePromotionAllowedNow: false
    });
    expect(byId.get("double_leaf_framed_calibration_holdout")).toMatchObject({
      calibrationTighteningOnly: true,
      nextSafeMoveType: "calibration_holdout_contract",
      sourceRowsRequiredForNextMove: true
    });
    expect(byId.get("double_leaf_framed_calibration_holdout")?.whyNotRuntimeYet).toContain(
      "source_rows_must_not_replace_algorithm_and_context_ownership"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate X closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts"
    );
  });
});
