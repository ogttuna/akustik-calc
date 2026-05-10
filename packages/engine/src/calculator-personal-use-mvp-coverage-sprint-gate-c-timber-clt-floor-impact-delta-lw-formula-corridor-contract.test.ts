import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTION_STATUS,
  buildGateCTimberCltDeltaLwFormulaCorridorContract
} from "./timber-clt-floor-impact-delta-lw-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_C_SURFACES = [
  "packages/engine/src/timber-clt-floor-impact-delta-lw-formula-corridor.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts",
  "packages/engine/src/timber-clt-floor-impact-delta-lw-input-contract.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md"
] as const;

function readRepoFile(path: string): Promise<string> {
  return readFile(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate C timber/CLT floor-impact DeltaLw formula corridor", () => {
  it("lands the timber/CLT DeltaLw formula corridor contract without runtime movement and selects Gate D", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_d",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C.landedGate,
      previousLandedGate: MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C.previousLandedGate,
      runtimePromotionAllowedInGateC: false,
      runtimeValueMovement: false,
      selectedNextAction: MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C.selectedNextAction,
      selectedNextFile: MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C.selectedNextFile,
      selectionStatus: MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_C.selectionStatus,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_C_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines separate timber joist and mass-timber CLT formula corridors with named physical terms", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();
    const candidatesByLane = new Map(
      contract.candidateFormulaCorridors.map((candidate) => [candidate.formulaLaneId, candidate])
    );
    const timber = candidatesByLane.get("timber_joist_dry_floating_lower_ceiling_delta_lw");
    const clt = candidatesByLane.get("mass_timber_clt_dry_floating_delta_lw");

    expect(timber).toMatchObject({
      basisId: "timber_joist_dry_floating_lower_ceiling_physical_delta_lw_corridor",
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      deltaLwRuntimeEstimateDb: null,
      exactMeasuredRowsRemainPrecedence: true,
      lnWRuntimeAnchor: {
        basisId: "official_floor_system_exact_match",
        lnWDb: 51,
        source: "current_runtime_snapshot_only_not_delta_lw_metric_owner"
      },
      proposedDeltaLwEnvelopeDb: { max: 31, min: 16 },
      structuralSupportType: "timber_joists",
      supportBucketLabel: "timber joist DeltaLw formula corridor design"
    });
    expect(timber?.formulaTerms.map((term) => term.termId)).toEqual([
      "base_reference_floor_ln_w",
      "upper_treatment_loaded_mass",
      "resilient_dynamic_stiffness_transfer",
      "lower_assembly_coupling",
      "structural_family_correction"
    ]);

    expect(clt).toMatchObject({
      basisId: "mass_timber_clt_dry_floating_physical_delta_lw_corridor",
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      deltaLwRuntimeEstimateDb: null,
      lnWRuntimeAnchor: {
        basisId: "predictor_mass_timber_clt_dataholz_dry_estimate",
        lnWDb: 50,
        source: "current_runtime_snapshot_only_not_delta_lw_metric_owner"
      },
      proposedDeltaLwEnvelopeDb: { max: 30, min: 14 },
      structuralSupportType: "mass_timber_clt",
      supportBucketLabel: "mass-timber CLT DeltaLw formula corridor design"
    });
    expect(clt?.formulaTerms.map((term) => term.termId)).toEqual([
      "base_reference_floor_ln_w",
      "upper_treatment_loaded_mass",
      "resilient_dynamic_stiffness_transfer",
      "lower_assembly_coupling",
      "structural_family_correction"
    ]);
  });

  it("pins source-absent DeltaLw design budgets without presenting them as measured evidence", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();
    const [timber, clt] = contract.candidateFormulaCorridors;

    expect(timber.toleranceBudget).toMatchObject({
      metricId: "DeltaLw",
      notMeasuredEvidence: true,
      totalBudgetDb: 7.5
    });
    expect(timber.toleranceBudget.terms.map((term) => term.termId)).toEqual([
      "timber_joist_exact_lnw_not_delta_lw",
      "lower_assembly_coupling_simplification",
      "dynamic_stiffness_precision",
      "upper_mass_precision"
    ]);
    expect(timber.toleranceBudget.terms.map((term) => term.db)).toEqual([2.4, 2.1, 1.8, 1.2]);
    expect(
      timber.toleranceBudget.terms.every(
        (term) => term.basis === "source_absent_formula_design_budget"
      )
    ).toBe(true);

    expect(clt.toleranceBudget).toMatchObject({
      metricId: "DeltaLw",
      notMeasuredEvidence: true,
      totalBudgetDb: 7.5
    });
    expect(clt.toleranceBudget.terms.map((term) => term.termId)).toEqual([
      "clt_reference_floor_family_spread",
      "reference_floor_ln_w_anchor_scope",
      "dynamic_stiffness_precision",
      "delta_lw_holdout_absence"
    ]);
  });

  it("keeps Gate B missing-input negatives exact instead of guessing DeltaLw", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();
    const boundaries = contract.negativeBoundaries.map((boundary) => ({
      id: boundary.gateBScenarioId,
      missing: boundary.exactMissingPhysicalInputs,
      status: boundary.status
    }));

    expect(boundaries).toEqual([
      {
        id: "gate_b_missing_dynamic_stiffness_needs_input",
        missing: ["resilientLayerDynamicStiffnessMNm3"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_load_basis_needs_input",
        missing: ["loadBasisKgM2"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_topping_mass_needs_input",
        missing: ["toppingOrFloatingLayer"],
        status: "needs_input"
      },
      {
        id: "gate_b_missing_lower_isolation_needs_input",
        missing: ["ceilingOrLowerAssembly"],
        status: "needs_input"
      },
      {
        id: "gate_b_astm_iic_aiic_boundary_unsupported",
        missing: [],
        status: "blocked_basis_alias"
      },
      {
        id: "gate_b_field_context_non_alias_blocked",
        missing: [],
        status: "blocked_basis_alias"
      },
      {
        id: "gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted",
        missing: [],
        status: "blocked_exact_lnw_precedence_delta_lw_unowned"
      },
      {
        id: "gate_b_wrong_family_steel_not_timber_clt",
        missing: ["baseSlabOrFloor"],
        status: "not_timber_clt_floor"
      }
    ]);
    expect(contract.negativeBoundaries.every((boundary) => boundary.deltaLwRuntimeEstimateDb === null)).toBe(
      true
    );
  });

  it("blocks ASTM, field, building-prediction, and Ln,w-only aliases from lab DeltaLw promotion", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();

    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldLPrime: true,
      labLnWOnly: true
    });
    expect(
      contract.negativeBoundaries
        .filter((boundary) => boundary.status === "blocked_basis_alias")
        .map((boundary) => boundary.targetOutputs)
    ).toEqual([
      ["IIC", "AIIC"],
      ["L'n,w", "L'nT,w"]
    ]);
  });

  it("defines Gate D runtime entry criteria before any numeric DeltaLw movement", () => {
    const contract = buildGateCTimberCltDeltaLwFormulaCorridorContract();

    expect(contract.gateDRuntimePromotionEntryCriteria).toEqual([
      "keep_exact_source_rows_above_formula_for_requested_metric",
      "calculate_DeltaLw_from_loaded_upper_mass_dynamic_stiffness_reference_floor_and_lower_assembly_terms",
      "emit_source_absent_formula_error_budget_not_measured_evidence",
      "keep_Ln_w_runtime_anchors_separate_from_DeltaLw_metric_owner",
      "preserve_ASTM_field_and_building_basis_non_alias_boundaries",
      "pin_output_card_report_api_payload_parity_if_runtime_values_move"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate C and next Gate D", async () => {
    const docs = await Promise.all(CURRENT_SELECTION_DOCS.map((path) => readRepoFile(path)));
    const runner = await readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const content of docs) {
      expect(content).toContain(
        "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan"
      );
      expect(content).toContain(
        "calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts"
      );
      expect(content).toContain(
        "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan"
      );
      expect(content).toContain(
        "calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts"
      );
    }

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts"
    );
  });
});
