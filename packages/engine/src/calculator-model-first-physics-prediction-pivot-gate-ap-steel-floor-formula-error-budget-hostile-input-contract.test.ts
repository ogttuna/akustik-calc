import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ExactImpactSource,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_ACTION,
  GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_FILE,
  buildGateAPSteelFloorFormulaErrorBudgetHostileInputContract
} from "./steel-floor-formula-error-budget-hostile-input";
import {
  buildSteelFloorFormulaPredictorInputFromSurface
} from "./steel-floor-formula-input-surface";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const STEEL_FORMULA_LAYER_INPUTS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const SAFE_REORDERED_STEEL_FORMULA_LAYER_INPUTS = [
  STEEL_FORMULA_LAYER_INPUTS[2],
  STEEL_FORMULA_LAYER_INPUTS[0],
  STEEL_FORMULA_LAYER_INPUTS[1],
  STEEL_FORMULA_LAYER_INPUTS[3],
  STEEL_FORMULA_LAYER_INPUTS[5],
  STEEL_FORMULA_LAYER_INPUTS[4],
  STEEL_FORMULA_LAYER_INPUTS[6]
] as const satisfies readonly LayerInput[];

const UNSAFE_DUPLICATE_BASE_STEEL_FORMULA_LAYER_INPUTS = [
  ...STEEL_FORMULA_LAYER_INPUTS,
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
] as const satisfies readonly LayerInput[];

const COMPLETE_OPEN_WEB_SURFACE = {
  loadBasisKgM2: 64,
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  resilientLayerDynamicStiffnessMNm3: 35,
  steelCarrierDepthMm: 200,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "open_web_or_rolled"
} as const;

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

const EXACT_LAB_IMPACT_SOURCE = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab",
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
} as const satisfies ExactImpactSource;

function getFormulaBudgetSnapshot(impact: ImpactCalculation | null | undefined) {
  return {
    DeltaLw: impact?.DeltaLw,
    LnW: impact?.LnW,
    basis: impact?.basis,
    errorBudgets: impact?.errorBudgets ?? []
  };
}

function getBudgetMetrics(errorBudgets: readonly ImpactErrorBudget[]) {
  return errorBudgets.map((budget) => budget.metricId);
}

describe("calculator model-first physics prediction pivot Gate AP - steel floor formula error-budget hostile input", () => {
  it("lands Gate AP without moving steel formula values and selects Gate AQ calibration readiness", () => {
    const contract = buildGateAPSteelFloorFormulaErrorBudgetHostileInputContract();

    expect(contract).toMatchObject({
      budgetMetricIds: ["Ln,w", "DeltaLw"],
      exactMeasuredRowsRemainPrecedence: true,
      fieldOutputBudgetMetricAliasesForbidden: ["L'n,w", "L'nT,w"],
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      hostileInputCases: [
        "complete_source_absent_formula",
        "safe_reorder",
        "saved_api_replay",
        "missing_physical_input",
        "duplicate_ambiguous_base_structure",
        "exact_source_precedence",
        "field_output_request"
      ],
      landedGate: "gate_ap_steel_floor_formula_error_budget_hostile_input_plan",
      noBudgetCases: [
        "missing_physical_input",
        "duplicate_ambiguous_base_structure",
        "exact_source_precedence"
      ],
      previousLandedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq",
      stableBudgetCases: [
        "complete_source_absent_formula",
        "safe_reorder",
        "saved_api_replay"
      ],
      targetOutputs: TARGET_OUTPUTS,
      tolerance: {
        DeltaLwDb: 2,
        LnWDb: 4.5
      }
    });
  });

  it("keeps complete, safe-reorder, and saved/API replay cases on the same structured budget", () => {
    const canonicalSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: STEEL_FORMULA_LAYER_INPUTS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    const reorderedSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: SAFE_REORDERED_STEEL_FORMULA_LAYER_INPUTS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(canonicalSurface.status).toBe("ready_for_formula_corridor");
    expect(reorderedSurface.status).toBe("ready_for_formula_corridor");

    const canonical = calculateAssembly(STEEL_FORMULA_LAYER_INPUTS, {
      impactPredictorInput: canonicalSurface.impactPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    });
    const reordered = calculateAssembly(SAFE_REORDERED_STEEL_FORMULA_LAYER_INPUTS, {
      impactPredictorInput: reorderedSurface.impactPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    });
    const replayedLayers = JSON.parse(JSON.stringify(STEEL_FORMULA_LAYER_INPUTS)) as LayerInput[];
    const replayedPredictorInput = JSON.parse(JSON.stringify(COMPLETE_OPEN_WEB_STEEL_INPUT)) as ImpactPredictorInput;
    const replayed = calculateImpactOnly(replayedLayers, {
      impactPredictorInput: replayedPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    });

    const expectedSnapshot = {
      DeltaLw: 22.4,
      LnW: 55.6,
      basis: STEEL_FLOOR_FORMULA_BASIS,
      errorBudgets: canonical.impact?.errorBudgets ?? []
    };

    expect(getFormulaBudgetSnapshot(canonical.impact)).toEqual(expectedSnapshot);
    expect(getFormulaBudgetSnapshot(reordered.impact)).toEqual(expectedSnapshot);
    expect(getFormulaBudgetSnapshot(replayed.impact)).toEqual(expectedSnapshot);
    expect(getBudgetMetrics(expectedSnapshot.errorBudgets)).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("does not surface a formula budget when required physical inputs are missing", () => {
    const missingSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: STEEL_FORMULA_LAYER_INPUTS,
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        steelCarrierSpacingMm: undefined
      },
      targetOutputs: TARGET_OUTPUTS
    });

    expect(missingSurface.status).toBe("needs_input");
    expect(missingSurface.missingPhysicalInputs).toEqual(["steelCarrierSpacingMm"]);

    const runtime = calculateImpactOnly(STEEL_FORMULA_LAYER_INPUTS, {
      impactPredictorInput: missingSurface.impactPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impact?.basis).not.toBe(STEEL_FLOOR_FORMULA_BASIS);
    expect(runtime.impact?.errorBudgets ?? []).toEqual([]);
  });

  it("does not surface a formula budget for duplicate or ambiguous steel base structures", () => {
    const unsafeSurface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: UNSAFE_DUPLICATE_BASE_STEEL_FORMULA_LAYER_INPUTS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(unsafeSurface.status).toBe("unsafe_topology");
    expect(unsafeSurface.impactPredictorInput).toBeNull();

    const runtime = calculateAssembly(UNSAFE_DUPLICATE_BASE_STEEL_FORMULA_LAYER_INPUTS, {
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impact?.basis).not.toBe(STEEL_FLOOR_FORMULA_BASIS);
    expect(runtime.impact?.errorBudgets ?? []).toEqual([]);
  });

  it("keeps exact source precedence budget-free even when formula physical inputs are complete", () => {
    const runtime = calculateImpactOnly(STEEL_FORMULA_LAYER_INPUTS, {
      exactImpactSource: EXACT_LAB_IMPACT_SOURCE,
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.sourceMode).toBe("exact_band_source");
    expect(runtime.impact).toMatchObject({
      basis: "exact_source_band_curve_iso7172",
      labOrField: "lab",
      LnW: 53
    });
    expect(runtime.impact?.basis).not.toBe(STEEL_FLOOR_FORMULA_BASIS);
    expect(runtime.impact?.errorBudgets).toBeUndefined();
  });

  it("keeps field impact targets unsupported and forbids lab-budget aliases on field metrics", () => {
    const runtime = calculateAssembly(STEEL_FORMULA_LAYER_INPUTS, {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });
    const budgets = runtime.impact?.errorBudgets ?? [];

    expect(runtime.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(runtime.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining([...FIELD_TARGET_OUTPUTS])
    );
    expect(runtime.impact?.LPrimeNW).toBeUndefined();
    expect(runtime.impact?.LPrimeNTw).toBeUndefined();
    expect(getBudgetMetrics(budgets)).toEqual(["Ln,w", "DeltaLw"]);
    expect(getBudgetMetrics(budgets)).not.toContain("L'n,w");
    expect(getBudgetMetrics(budgets)).not.toContain("L'nT,w");
  });

  it("keeps docs and current-gate runner aligned with Gate AP and next Gate AQ", async () => {
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
        "gate_ap_steel_floor_formula_error_budget_hostile_input_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts"
      );
      expect(content).toContain(
        "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan"
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts"
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts"
    );
  });
});
