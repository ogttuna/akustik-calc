import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION,
  GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE,
  buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract,
} from "./steel-floor-formula-source-absent-uncertainty";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AN - steel floor source-absent uncertainty", () => {
  it("lands Gate AN as a no-runtime structured error-budget gate and selects Gate AO", () => {
    const contract =
      buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate:
        "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
      previousLandedGate:
        "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AN_STEEL_FLOOR_FORMULA_SOURCE_ABSENT_UNCERTAINTY_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao",
      sourceRowsRequiredForRuntimeSelection: false,
    });
    expect(contract.corridorDecision).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      decision: "hold_existing_corridor_with_structured_error_budget",
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
  });

  it("splits the complete source-absent formula corridor into explicit metric error budgets", () => {
    const contract =
      buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();
    const complete = contract.evaluations.completeSourceAbsent;
    const budgetsByMetric = new Map(
      complete.errorBudgets.map((budget) => [budget.metricId, budget]),
    );

    expect(complete.status).toBe("ready_with_source_absent_error_budget");
    expect(complete.runtimeValueMovement).toBe(false);
    expect(complete.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab",
    });
    expect(budgetsByMetric.get("Ln,w")).toMatchObject({
      estimate: 55.6,
      max: 60.1,
      metricId: "Ln,w",
      min: 51.1,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 4.5,
      totalBudgetDb: 4.5,
    });
    expect(budgetsByMetric.get("DeltaLw")).toMatchObject({
      estimate: 22.4,
      max: 24.4,
      metricId: "DeltaLw",
      min: 20.4,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 2,
      totalBudgetDb: 2,
    });
    expect(
      budgetsByMetric.get("Ln,w")?.terms.map((term) => term.termId),
    ).toEqual([
      "source_owned_delta_lw_holdout_absence",
      "source_absent_bare_steel_reference_model",
      "support_form_transfer_efficiency",
      "lower_support_class_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision",
    ]);
    expect(
      budgetsByMetric.get("DeltaLw")?.terms.map((term) => term.termId),
    ).toEqual([
      "source_owned_delta_lw_holdout_absence",
      "dynamic_stiffness_precision",
      "load_basis_precision",
      "upper_resilient_topology_simplification",
    ]);
  });

  it("keeps source packet rules strict while using source absence as an uncertainty term, not a fake source", () => {
    const contract =
      buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();
    const complete = contract.evaluations.completeSourceAbsent;
    const allTerms = complete.errorBudgets.flatMap((budget) => budget.terms);

    expect(contract.sourcePacketRules).toMatchObject({
      acceptedSourceOwnedDeltaLwHoldoutCount: 0,
      broadSourceLibraryCrawlAllowedNext: false,
      sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
    });
    expect(contract.sourcePacketRules.requiredOwnerFields).toEqual([
      "metric_value",
      "topology_and_support_family",
      "carrier_spacing",
      "load_basis",
      "dynamic_stiffness",
      "lower_support_class",
      "upper_resilient_topology",
      "paired_negative_boundary_owner",
    ]);
    expect(
      allTerms.filter(
        (term) => term.termId === "source_owned_delta_lw_holdout_absence",
      ).length,
    ).toBe(2);
    expect(
      allTerms
        .filter((term) => term.origin === "missing_source_owned_holdout")
        .every((term) =>
          term.tightenRequires.includes(
            "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
          ),
        ),
    ).toBe(true);
  });

  it("does not surface an error budget for exact-source, needs-input, or unsafe-topology cases", () => {
    const contract =
      buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();

    expect(contract.evaluations.exactSourcePrecedence).toMatchObject({
      errorBudgets: [],
      impact: null,
      missingPhysicalInputs: [],
      status: "exact_source_precedence",
    });
    expect(contract.evaluations.missingInput).toMatchObject({
      errorBudgets: [],
      impact: null,
      missingPhysicalInputs: ["steelCarrierSpacingMm"],
      status: "needs_input",
    });
    expect(contract.evaluations.unsafeTopology).toMatchObject({
      errorBudgets: [],
      impact: null,
      missingPhysicalInputs: [],
      status: "unsafe_topology",
    });
    expect(contract.evaluations.unsafeTopology.unsafeTopologyReason).toContain(
      "Duplicate or ambiguous steel base-structure rows",
    );
  });

  it("defines the card/report/API payload shape for the next surface-parity gate", () => {
    const contract =
      buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();

    expect(contract.surfacePayloadContract).toEqual({
      notMeasuredEvidence: true,
      paritySurfaces: [
        "output_cards",
        "report_payload",
        "calculator_api_payload",
        "impact_only_api_payload",
      ],
      requiredPayloadFields: [
        "metricId",
        "estimate",
        "min",
        "max",
        "toleranceDb",
        "totalBudgetDb",
        "terms",
        "origin",
        "notMeasuredEvidence",
      ],
      selectedNextSurfaceGate:
        "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AN and next Gate AO", async () => {
    const [agentsDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts"),
      ]);

    for (const content of [agentsDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts",
      );
      expect(content).toContain(
        "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts",
    );
  });
});
