import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ImpactCalculationSchema,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type ImpactPredictorInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_FILE,
  buildGateAOSteelFloorFormulaErrorBudgetSurfaceParityContract
} from "./steel-floor-formula-error-budget-surface-parity";
import {
  buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract
} from "./steel-floor-formula-source-absent-uncertainty";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18
  },
  floorCovering: {
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 10
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled"
} as const satisfies ImpactPredictorInput;

describe("calculator model-first physics prediction pivot Gate AO - steel floor formula error-budget surface parity", () => {
  it("lands Gate AO without moving steel formula values and selects Gate AP", () => {
    const contract = buildGateAOSteelFloorFormulaErrorBudgetSurfaceParityContract();

    expect(contract).toMatchObject({
      budgetMetricIds: ["Ln,w", "DeltaLw"],
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
      noBudgetCases: ["exact_source_precedence", "needs_input", "unsafe_topology"],
      previousLandedGate:
        "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: TARGET_OUTPUTS,
      tolerance: {
        DeltaLwDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        LnWDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
      }
    });
    expect(contract.paritySurfaces).toEqual(
      expect.arrayContaining([
        "packages/shared/src/domain/impact.ts",
        "packages/engine/src/steel-floor-impact-formula-corridor.ts",
        "apps/web/features/workbench/simple-workbench-output-model.ts",
        "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
        "apps/web/features/workbench/compose-workbench-report.ts",
        "apps/web/app/api/estimate/route.ts",
        "apps/web/app/api/impact-only/route.ts"
      ])
    );
  });

  it("carries the structured error budget on the runtime impact payload and shared schema", () => {
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
    const budgets: ImpactErrorBudget[] = runtime.impact?.errorBudgets ?? [];
    expect(budgets).toHaveLength(2);
    expect(budgets.find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w")).toMatchObject({
      estimate: 55.6,
      max: 60.1,
      min: 51.1,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 4.5,
      totalBudgetDb: 4.5
    });
    expect(budgets.find((budget: ImpactErrorBudget) => budget.metricId === "DeltaLw")).toMatchObject({
      estimate: 22.4,
      max: 24.4,
      min: 20.4,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 2,
      totalBudgetDb: 2
    });
    expect(
      budgets
        .find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w")
        ?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)
    ).toEqual([
      "source_owned_delta_lw_holdout_absence",
      "source_absent_bare_steel_reference_model",
      "support_form_transfer_efficiency",
      "lower_support_class_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision"
    ]);
    expect(
      budgets
        .find((budget: ImpactErrorBudget) => budget.metricId === "DeltaLw")
        ?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)
    ).toEqual([
      "source_owned_delta_lw_holdout_absence",
      "dynamic_stiffness_precision",
      "load_basis_precision",
      "upper_resilient_topology_simplification"
    ]);

    const parsed = ImpactCalculationSchema.parse(runtime.impact);
    expect(parsed.errorBudgets).toEqual(budgets);
  });

  it("carries the same payload into impact-support trace notes without presenting it as measured evidence", () => {
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impactSupport?.formulaNotes).toEqual([
      "Gate AD steel-floor mass-spring formula corridor remains a source-absent lab estimate, not a measured row.",
      "Steel DeltaLw uses 13 log10(m'load) - 14.2 log10(s') + 20.8 before steel carrier-transfer correction.",
      "Gate AN error budgets are structured: Ln,w 55.6 dB [51.1..60.1] +/-4.5 dB; DeltaLw 22.4 dB [20.4..24.4] +/-2 dB; origin source_absent_formula_error_budget; not measured evidence.",
      "Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw."
    ]);
  });

  it("keeps exact-source, needs-input, and unsafe-topology cases free of formula budgets", () => {
    const gateAN = buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract();

    for (const evaluation of [
      gateAN.evaluations.exactSourcePrecedence,
      gateAN.evaluations.missingInput,
      gateAN.evaluations.unsafeTopology
    ]) {
      expect(evaluation.errorBudgets).toEqual([]);
      expect(evaluation.impact?.errorBudgets).toBeUndefined();
    }
  });

  it("keeps docs and current-gate runner aligned with Gate AO and next Gate AP", async () => {
    const [agentsDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md"
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts")
      ]);

    for (const content of [agentsDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_ao_steel_floor_formula_error_budget_surface_parity_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts"
      );
      expect(content).toContain(
        "gate_ap_steel_floor_formula_error_budget_hostile_input_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts"
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts"
    );
  });
});
