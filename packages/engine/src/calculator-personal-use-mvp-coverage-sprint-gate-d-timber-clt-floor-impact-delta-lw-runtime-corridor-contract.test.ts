import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { ImpactErrorBudget, ImpactErrorBudgetTerm, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS,
  buildGateBTimberCltDeltaLwScenarioPack,
  type GateBTimberCltDeltaLwScenarioId
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_D = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan",
  numericRuntimeBehaviorChange: true,
  previousLandedGate: "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan",
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts",
  selectionStatus:
    "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_landed_selected_surface_parity_gate_e",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_D_SURFACES = [
  "packages/shared/src/domain/impact.ts",
  "packages/engine/src/timber-clt-floor-impact-delta-lw-runtime-corridor.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/impact-support.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-predictor-status.ts",
  "packages/engine/src/impact-confidence.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md"
] as const;

function readRepoFile(path: string): Promise<string> {
  return readFile(join(REPO_ROOT, path), "utf8");
}

function contractById(id: GateBTimberCltDeltaLwScenarioId) {
  const entry = buildGateBTimberCltDeltaLwScenarioPack().find((scenario) => scenario.id === id);

  if (!entry) {
    throw new Error(`Missing Gate B scenario ${id}`);
  }

  return entry.contract;
}

function layersFor(id: GateBTimberCltDeltaLwScenarioId) {
  return id.includes("clt") || id === "gate_b_missing_topping_mass_needs_input"
    ? GATE_B_CLT_LAYERS
    : GATE_B_TIMBER_JOIST_LAYERS;
}

function runScenario(
  id: GateBTimberCltDeltaLwScenarioId,
  targetOutputs: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw"]
) {
  const contract = contractById(id);

  if (!contract.normalizedPredictorInput) {
    throw new Error(`Gate B scenario ${id} has no predictor input`);
  }

  return calculateImpactOnly(layersFor(id), {
    impactPredictorInput: contract.normalizedPredictorInput,
    targetOutputs
  });
}

describe("Personal-Use MVP Coverage Sprint Gate D timber/CLT DeltaLw runtime corridor", () => {
  it("lands runtime movement for explicit timber/CLT DeltaLw predictor input and selects surface parity Gate E", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_D).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan",
      numericRuntimeBehaviorChange: true,
      previousLandedGate: "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan",
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_landed_selected_surface_parity_gate_e",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_D_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("supplements the exact timber joist Ln,w lane with source-absent lab DeltaLw instead of overwriting it", () => {
    const result = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor");

    expect(result.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51,
      basis: "official_floor_system_exact_match",
      labOrField: "lab",
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      },
      scope: "exact_floor_system_family"
    });
    expect(result.impact?.availableOutputs).toEqual(expect.arrayContaining(["Ln,w", "DeltaLw"]));
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact?.notes).toContain(
      "DeltaLw companion was carried from the explicit timber/CLT formula corridor while Ln,w stayed on its exact or published-family lane."
    );
  });

  it("supplements the mass-timber CLT published-family Ln,w lane with a separate DeltaLw formula basis", () => {
    const result = runScenario("gate_b_clt_complete_ready_for_formula_corridor");

    expect(result.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50,
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      labOrField: "lab",
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      },
      scope: "family_estimate"
    });
    expect(result.impact?.availableOutputs).toEqual(expect.arrayContaining(["Ln,w", "DeltaLw"]));
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.impactPredictorStatus).toMatchObject({
      implementedFormulaEstimate: true,
      inputMode: "explicit_predictor_input"
    });
    expect(result.dynamicImpactTrace?.availableMetricLabels).toEqual(expect.arrayContaining(["Ln,w", "DeltaLw"]));
    expect(result.dynamicImpactTrace?.selectionKind).toBe("family_estimate");
  });

  it("attaches the Gate C source-absent DeltaLw error budget to both runtime formula metrics", () => {
    const timber = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor");
    const clt = runScenario("gate_b_clt_complete_ready_for_formula_corridor");
    const timberBudget = timber.impact?.errorBudgets?.find(
      (budget: ImpactErrorBudget) => budget.metricId === "DeltaLw"
    );
    const cltBudget = clt.impact?.errorBudgets?.find(
      (budget: ImpactErrorBudget) => budget.metricId === "DeltaLw"
    );

    expect(timberBudget).toMatchObject({
      estimate: 25.2,
      max: 32.7,
      metricId: "DeltaLw",
      min: 17.7,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
      totalBudgetDb: 7.5
    });
    expect(timberBudget?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)).toEqual([
      "timber_joist_exact_lnw_not_delta_lw",
      "lower_assembly_coupling_simplification",
      "dynamic_stiffness_precision",
      "upper_mass_precision"
    ]);
    expect(cltBudget).toMatchObject({
      estimate: 22.6,
      max: 30.1,
      min: 15.1,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: TIMBER_CLT_DELTA_LW_FORMULA_TOLERANCE_DB,
      totalBudgetDb: 7.5
    });
    expect(cltBudget?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)).toEqual([
      "clt_reference_floor_family_spread",
      "reference_floor_ln_w_anchor_scope",
      "dynamic_stiffness_precision",
      "delta_lw_holdout_absence"
    ]);
  });

  it("keeps missing physical inputs parked instead of guessing timber/CLT DeltaLw", () => {
    const missingCases: GateBTimberCltDeltaLwScenarioId[] = [
      "gate_b_missing_dynamic_stiffness_needs_input",
      "gate_b_missing_load_basis_needs_input",
      "gate_b_missing_topping_mass_needs_input",
      "gate_b_missing_lower_isolation_needs_input"
    ];

    for (const id of missingCases) {
      const result = runScenario(id);

      expect(result.impact?.DeltaLw, id).toBeUndefined();
      expect(result.impact?.metricBasis?.DeltaLw, id).toBeUndefined();
      expect(
        result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.metricId === "DeltaLw") ?? false,
        id
      ).toBe(false);
      expect(result.supportedTargetOutputs, id).toEqual(["Ln,w"]);
      expect(result.unsupportedTargetOutputs, id).toEqual(["DeltaLw"]);
    }
  });

  it("does not promote the formula for Ln,w-only, ASTM, field, or wrong-family requests", () => {
    const lnWOnly = runScenario("gate_b_timber_joist_complete_ready_for_formula_corridor", ["Ln,w"]);
    const astm = runScenario("gate_b_astm_iic_aiic_boundary_unsupported", ["IIC", "AIIC"]);
    const field = runScenario("gate_b_field_context_non_alias_blocked", ["L'n,w", "L'nT,w"]);
    const steel = runScenario("gate_b_wrong_family_steel_not_timber_clt");

    expect(lnWOnly.impact?.DeltaLw).toBeUndefined();
    expect(lnWOnly.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(lnWOnly.unsupportedTargetOutputs).toEqual([]);

    expect(astm.impact?.DeltaLw).toBeUndefined();
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(field.impact?.DeltaLw).toBeUndefined();
    expect(field.supportedTargetOutputs).toEqual([]);
    expect(field.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);

    expect(steel.impact?.metricBasis?.DeltaLw).not.toBe(TIMBER_JOIST_DELTA_LW_FORMULA_BASIS);
    expect(steel.impact?.metricBasis?.DeltaLw).not.toBe(MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS);
  });

  it("keeps docs and the current-gate runner aligned with Gate D and next Gate E", async () => {
    const docs = await Promise.all(CURRENT_SELECTION_DOCS.map((path) => readRepoFile(path)));
    const runner = await readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const content of docs) {
      expect(content).toContain(
        "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan"
      );
      expect(content).toContain(
        "calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts"
      );
      expect(content).toContain(
        "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan"
      );
    }

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts"
    );
  });
});
