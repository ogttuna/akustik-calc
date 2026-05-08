import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_ACTION,
  GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_FILE,
  buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract,
  classifyGateARSteelFloorFormulaCalibrationEvidence,
} from "./steel-floor-formula-calibration-evidence-intake";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AR - steel floor formula calibration evidence intake", () => {
  it("lands Gate AR as a no-runtime evidence-intake ledger and selects Gate AS", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: "gate_ar_steel_floor_formula_calibration_evidence_intake_plan",
      previousLandedGate:
        "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as",
    });
    expect(contract.runtimePins.runtimeValueMovement).toBe(false);
    expect(contract.runtimePins.runtimeRetuneAllowedNow).toBe(false);
  });

  it("uses the Gate AQ owner map as the only acceptance surface", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();

    expect(contract.acceptanceSurface).toMatchObject({
      gateAQTermOwnerMapOnly: true,
      sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
    });
    expect(contract.acceptanceSurface.termOwners).toEqual([
      {
        owner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
        termId: "source_owned_delta_lw_holdout_absence",
      },
      {
        owner: "same_stack_bare_steel_reference_rows",
        termId: "source_absent_bare_steel_reference_model",
      },
      {
        owner: "source_owned_steel_transfer_efficiency_curve",
        termId: "support_form_transfer_efficiency",
      },
      {
        owner: "lower_ceiling_support_family_holdouts",
        termId: "lower_support_class_simplification",
      },
      {
        owner: "frequency_dependent_dynamic_stiffness_or_product_curve_owner",
        termId: "dynamic_stiffness_precision",
      },
      {
        owner: "source_owned_load_basis_schedule",
        termId: "load_basis_precision",
      },
      {
        owner: "upper_resilient_topology_holdouts",
        termId: "upper_resilient_topology_simplification",
      },
    ]);
  });

  it("classifies the current local ledger without accepting product, inferred, wrong-basis, concrete-reference, or boundary-only evidence", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();
    const ledgerById = new Map(contract.currentLedger.map((entry) => [entry.id, entry]));

    expect(contract.currentLedger).toHaveLength(10);
    expect(contract.currentLedgerSummary.acceptedSourceOwnedPacketIds).toEqual([]);
    expect(
      contract.currentLedger.every(
        (entry) =>
          entry.acceptedForCalibrationResidual === false &&
          entry.canMoveRuntimeNow === false &&
          entry.canPromoteExactSource === false,
      ),
    ).toBe(true);
    expect(contract.currentLedgerSummary.bucketCounts).toEqual([
      { bucket: "accepted_source_owned_calibration_packet", count: 0 },
      { bucket: "rejected_missing_source_owned_owner_field", count: 2 },
      { bucket: "rejected_wrong_metric_basis", count: 3 },
      { bucket: "rejected_reference_floor_not_same_stack_steel", count: 2 },
      { bucket: "rejected_product_or_inferred_metric", count: 2 },
      { bucket: "rejected_boundary_reference_only", count: 1 },
    ]);

    expect(ledgerById.get("pliteq_steel_joist_ln_w_only_rows")?.bucket).toBe(
      "rejected_missing_source_owned_owner_field",
    );
    expect(ledgerById.get("impact_product_catalog_delta_lw_rows")?.bucket).toBe(
      "rejected_product_or_inferred_metric",
    );
    expect(
      ledgerById.get("regupol_us_l0146_steel_deck_steel_joist_stc_iic_only")
        ?.bucket,
    ).toBe("rejected_wrong_metric_basis");
    expect(
      ledgerById.get("regupol_us_sonusfit_solid_reference_iso_delta_lw_only")
        ?.bucket,
    ).toBe("rejected_reference_floor_not_same_stack_steel");
    expect(
      ledgerById.get("soundadvisor_iso_delta_lw_boundary_concrete_reference_only")
        ?.bucket,
    ).toBe("rejected_boundary_reference_only");
  });

  it("proves a future accepted packet satisfies only its Gate AQ owner and still cannot move runtime values", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();
    const probe = contract.futureAcceptedPacketProbe;

    expect(probe).toMatchObject({
      acceptedForCalibrationResidual: true,
      bucket: "accepted_source_owned_calibration_packet",
      canMoveRuntimeNow: false,
      canPromoteExactSource: false,
      runtimeValueMovement: false,
      satisfiedGateAQTermIds: ["source_owned_delta_lw_holdout_absence"],
      sourceOwnedGateAQOwners: [
        "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      ],
      sourceRowsAreCalibrationEvidenceNotProduct: true,
    });
    expect(probe.residualPolicyIfAccepted).toMatchObject({
      blockers: [
        "holdout_count_below_policy_threshold",
        "paired_negative_boundaries_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ],
      decision: "hold",
      metricId: "DeltaLw",
      retuneAllowedNow: false,
      runtimeValueMovement: false,
    });
  });

  it("rejects a source-looking packet when the Gate AQ owner field is missing", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();
    const classified = classifyGateARSteelFloorFormulaCalibrationEvidence(
      {
        evidenceKind: "source_owned_same_stack_lab_delta_lw",
        id: "gate_ar_missing_gate_aq_owner_probe",
        measuredMetricIds: ["DeltaLw"],
        metricBasis: "lab_iso_10140_717_2",
        missingSourceOwnedOwnerFields: [],
        referenceFloor: "same_stack_steel",
        representedRowCount: 1,
        residualCaseCountIfAccepted: 1,
        source: "gate_ar_future_probe",
        sourceLabel: "Missing Gate AQ owner probe",
        sourceOwnedGateAQOwners: [],
        sourceUrl: null,
      },
      contract.acceptanceSurface.termOwners,
    );

    expect(classified).toMatchObject({
      acceptedForCalibrationResidual: false,
      bucket: "rejected_missing_source_owned_owner_field",
      residualPolicyIfAccepted: null,
      satisfiedGateAQTermIds: [],
    });
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building basis separation explicit", () => {
    const contract = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactMeasuredRowsRemainPrecedence).toBe(true);
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AR and next Gate AS", async () => {
    const [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/README.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts"),
      ]);

    for (const content of [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_ar_steel_floor_formula_calibration_evidence_intake_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts",
      );
      expect(content).toContain(
        "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts",
    );
  });
});
