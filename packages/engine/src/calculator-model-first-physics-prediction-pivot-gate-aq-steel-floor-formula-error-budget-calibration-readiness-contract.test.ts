import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_ACTION,
  GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_FILE,
  buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract
} from "./steel-floor-formula-error-budget-calibration-readiness";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AQ - steel floor formula error-budget calibration readiness", () => {
  it("lands Gate AQ as a no-runtime calibration-readiness contract and selects Gate AR", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();

    expect(contract).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate:
        "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan",
      previousLandedGate:
        "gate_ap_steel_floor_formula_error_budget_hostile_input_plan",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar",
      sourceRowsAreHoldoutsOrCalibrationNotProduct: true
    });
  });

  it("maps every runtime steel formula budget term to an owner and blocker", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();

    expect(contract.exhaustiveTermMapping).toEqual({
      mappedTermsMissingFromRuntime: [],
      mappedTermIds: [
        "source_owned_delta_lw_holdout_absence",
        "source_absent_bare_steel_reference_model",
        "support_form_transfer_efficiency",
        "lower_support_class_simplification",
        "dynamic_stiffness_precision",
        "load_basis_precision",
        "upper_resilient_topology_simplification"
      ],
      runtimeTermIds: [
        "source_owned_delta_lw_holdout_absence",
        "source_absent_bare_steel_reference_model",
        "support_form_transfer_efficiency",
        "lower_support_class_simplification",
        "dynamic_stiffness_precision",
        "load_basis_precision",
        "upper_resilient_topology_simplification"
      ],
      unmappedRuntimeTermIds: []
    });
    expect(contract.termReadiness.every((term) => term.mappingMatchesRuntime)).toBe(true);
    expect(contract.termReadiness).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metricIds: ["Ln,w", "DeltaLw"],
          termId: "source_owned_delta_lw_holdout_absence",
          tightenRequires: "accepted_source_owned_same_stack_iso_delta_lw_holdouts"
        }),
        expect.objectContaining({
          metricIds: ["Ln,w"],
          termId: "source_absent_bare_steel_reference_model",
          tightenRequires: "same_stack_bare_steel_reference_rows"
        }),
        expect.objectContaining({
          metricIds: ["DeltaLw"],
          termId: "upper_resilient_topology_simplification",
          tightenRequires: "upper_resilient_topology_holdouts"
        })
      ])
    );
    for (const readiness of contract.termReadiness) {
      expect(readiness.mappedRuntimeTightenRequires).toContain(
        readiness.tightenRequires
      );
    }
  });

  it("keeps the current corridor held with runtime values and tolerances pinned", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();

    expect(contract.currentHoldPosture).toEqual({
      acceptedSourceOwnedDeltaLwHoldoutCount: 0,
      decisionsByMetric: ["hold", "hold"],
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false
    });
  });

  it("rejects wrong evidence from shrinking terms or tightening the corridor", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();
    const buckets = new Set(
      contract.wrongEvidenceRejections.map((entry) => entry.evidenceBucket)
    );

    expect(contract.wrongEvidenceRejections.length).toBeGreaterThanOrEqual(10);
    expect(
      contract.wrongEvidenceRejections.every(
        (entry) =>
          entry.canShrinkBudgetTerm === false &&
          entry.canTightenCorridor === false
      )
    ).toBe(true);
    expect([...buckets]).toEqual(
      expect.arrayContaining([
        "ln_w_only_system_table",
        "product_catalog_delta_lw",
        "annex_c_or_companion_inferred_delta_lw",
        "field_astm_or_building_prediction_delta_lw",
        "rejected_wrong_metric_basis_astm_iic_stc",
        "rejected_reference_floor_not_same_stack_steel",
        "rejected_boundary_reference_not_candidate_packet"
      ])
    );
    expect(contract.wrongEvidenceRejections.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "regupol_us_l0146_steel_deck_steel_joist_stc_iic_only",
        "regupol_us_sonusfit_solid_reference_iso_delta_lw_only",
        "soundadvisor_iso_delta_lw_boundary_concrete_reference_only"
      ])
    );
  });

  it("defines hold, tighten, widen, and retune candidates without runtime movement", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();
    const decisionsById = new Map(
      contract.futureDecisionCases.map((entry) => [entry.id, entry])
    );

    expect(decisionsById.get("gate_aq_current_evidence_below_threshold_holds")).toMatchObject({
      decision: "hold",
      retuneAllowedNow: false,
      runtimeValueMovement: false
    });
    expect(
      decisionsById.get("gate_aq_complete_low_residual_evidence_tighten_candidate")
    ).toMatchObject({
      decision: "tighten",
      retuneAllowedNow: false,
      runtimeValueMovement: false
    });
    expect(
      decisionsById.get("gate_aq_outside_corridor_without_correction_widen_candidate")
    ).toMatchObject({
      decision: "widen",
      retuneAllowedNow: false,
      runtimeValueMovement: false
    });
    expect(
      decisionsById.get("gate_aq_outside_corridor_with_all_owners_retune_candidate")
    ).toMatchObject({
      decision: "retune_candidate",
      retuneAllowedNow: true,
      runtimeValueMovement: false
    });
  });

  it("keeps Gate AP hostile-input and Gate AO surface invariants in scope", () => {
    const contract =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();

    expect(contract.apAoInvariants).toMatchObject({
      fieldOutputBudgetMetricAliasesForbidden: ["L'n,w", "L'nT,w"],
      noBudgetCases: [
        "missing_physical_input",
        "duplicate_ambiguous_base_structure",
        "exact_source_precedence"
      ],
      stableBudgetCases: [
        "complete_source_absent_formula",
        "safe_reorder",
        "saved_api_replay"
      ]
    });
    expect(contract.apAoInvariants.requiredPayloadFields).toEqual([
      "metricId",
      "estimate",
      "min",
      "max",
      "toleranceDb",
      "totalBudgetDb",
      "terms",
      "origin",
      "notMeasuredEvidence"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AQ and next Gate AR", async () => {
    const [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/README.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md"
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts")
      ]);

    for (const content of [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts"
      );
      expect(content).toContain(
        "gate_ar_steel_floor_formula_calibration_evidence_intake_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts"
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts"
    );
  });
});
