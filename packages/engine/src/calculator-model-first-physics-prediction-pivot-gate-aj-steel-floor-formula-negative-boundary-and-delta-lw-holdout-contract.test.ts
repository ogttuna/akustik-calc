import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract,
  residualPolicyBlockersForMetric
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_GATE_AJ_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AJ_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AJ", () => {
  it("lands steel-floor negative boundaries plus DeltaLw holdout intake and selects Gate AK", () => {
    expect(buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract()).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      labFieldBuildingSeparation: true,
      landedGate: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
      previousLandedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts",
      selectionStatus:
        "gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak",
      sourceRowsAreCalibrationEvidenceNotProduct: true
    });
  });

  it("adds the four paired negative boundaries required before a steel formula retune", () => {
    const contract = buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract();

    expect(contract.negativeBoundaryProof).toMatchObject({
      passed: true,
      protectedBoundaryCount: 4,
      requiredBoundaryCount: 4
    });
    expect(contract.negativeBoundaryProof.cases.map((entry) => entry.id)).toEqual([
      "wrong_support_family_concrete_or_heavy_floor_not_steel_formula",
      "exact_source_precedence_over_formula_residual",
      "lab_formula_does_not_promote_field_or_building_basis",
      "source_absent_design_reference_not_measured_residual"
    ]);
    expect(contract.negativeBoundaryProof.cases.map((entry) => entry.protects)).toEqual([
      "support_family_scope",
      "exact_source_precedence",
      "lab_field_building_basis_separation",
      "measured_evidence_scope"
    ]);
    expect(contract.negativeBoundaryProof.cases.every((entry) => entry.runtimeValueMovement === false)).toBe(true);
  });

  it("keeps DeltaLw measured-holdout intake separate from product, inferred, and wrong-basis values", () => {
    const contract = buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract();

    expect(contract.deltaLwHoldoutIntake).toMatchObject({
      acceptedMeasuredHoldoutCount: 0,
      rejectedInferredOrCompanionCount: 1,
      rejectedProductCatalogCount: 1,
      rejectedWrongBasisCount: 1,
      requiredMeasuredHoldoutCount: 3
    });
    expect(contract.deltaLwHoldoutIntake.measuredHoldoutAcceptanceCriteria).toEqual([
      "same_stack_lab_delta_lw_metric",
      "source_owned_metric_value",
      "source_owned_topology_and_support_family",
      "source_owned_carrier_spacing_and_lower_support_class",
      "source_owned_load_basis_and_dynamic_stiffness",
      "source_owned_upper_resilient_topology",
      "paired_negative_boundary_owner_present",
      "not_product_catalog_only",
      "not_annex_c_or_companion_inferred",
      "not_field_or_building_basis"
    ]);
    expect(contract.deltaLwHoldoutIntake.candidates.map((entry) => entry.decision)).toEqual([
      "accept_when_source_owned_measured_lab_same_stack",
      "reject_product_catalog_only",
      "reject_inferred_companion",
      "reject_basis_mismatch"
    ]);
    expect(contract.deltaLwHoldoutIntake.candidates.every((entry) => !entry.acceptedAsMeasuredHoldoutNow)).toBe(true);
  });

  it("removes the paired-negative blocker while still holding residual movement until source-owned evidence exists", () => {
    const contract = buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract();
    const lnWBlockers = residualPolicyBlockersForMetric(contract, "Ln,w");
    const deltaLwBlockers = residualPolicyBlockersForMetric(contract, "DeltaLw");

    expect(lnWBlockers).not.toContain("paired_negative_boundaries_missing");
    expect(lnWBlockers).toEqual(
      expect.arrayContaining([
        "holdout_count_below_policy_threshold",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing"
      ])
    );
    expect(deltaLwBlockers).not.toContain("paired_negative_boundaries_missing");
    expect(deltaLwBlockers).toEqual(
      expect.arrayContaining([
        "delta_lw_measured_holdouts_missing",
        "source_owned_metric_holdouts_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing"
      ])
    );
    expect(contract.currentResidualPolicyAfterGateAJ.runtimeValueMovement).toBe(false);
    expect(contract.currentResidualPolicyAfterGateAJ.runtimeRetuneAllowedNow).toBe(false);
  });

  it("keeps current docs and runner pointed at Gate AJ after landing", () => {
    for (const path of CURRENT_GATE_AJ_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);

      expect(content).toContain("gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts"
      );
      expect(content).toContain("gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts"
      );
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts"
    );
  });
});
