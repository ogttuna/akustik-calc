import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateOAirborneBuildingPredictionFormulaCorridorContract,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_O = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
  selectionStatus: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_O_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/calculate-assembly.ts",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
] as const;

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate O airborne building-prediction formula corridor", () => {
  it("lands a no-runtime formula-corridor contract and selects the runtime-corridor gate next", () => {
    const contract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_O).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
      numericRuntimeBehaviorChange: false,
      runtimePromotionAllowedInGateO: false,
      runtimeValueMovement: false,
      selectedNextAction: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
      selectionStatus: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_O_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines separate apparent and standardized building formula corridors with named terms", () => {
    const contract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
    const corridorsByMetric = new Map(
      contract.candidateFormulaCorridors.map((corridor) => [corridor.metricId, corridor])
    );
    const rwPrime = corridorsByMetric.get("R'w");
    const dnTw = corridorsByMetric.get("DnT,w");

    expect(rwPrime).toMatchObject({
      basisId: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS,
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      formulaLaneId: "airborne_building_apparent_r_prime_w_formula_corridor",
      proposedRuntimeEstimateDb: null,
      runtimePromotionAllowedInGateO: false,
      sourceRowsRequiredForFormulaDesign: false
    });
    expect(dnTw).toMatchObject({
      basisId: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_BASIS,
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      formulaLaneId: "airborne_building_standardized_dnt_w_formula_corridor",
      proposedRuntimeEstimateDb: null,
      runtimePromotionAllowedInGateO: false
    });
    expect(rwPrime?.requiredFormulaOwnerInputs).toEqual([
      ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
    ]);
    expect(rwPrime?.requiredPhysicalInputs).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(rwPrime?.formulaTerms.map((term) => term.termId)).toEqual([
      "direct_separating_element_frequency_curve",
      "flanking_path_energy_sum",
      "junction_vibration_reduction_index",
      "room_absorption_standardization",
      "building_prediction_uncertainty_budget"
    ]);
    expect(rwPrime?.formulaTerms.every((term) => term.runtimeOwnedInGateO === false)).toBe(true);
  });

  it("pins source-absent building prediction budgets without presenting them as measured evidence", () => {
    const contract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
    const [rwPrime, dnTw] = contract.candidateFormulaCorridors;

    expect(rwPrime.toleranceBudget).toMatchObject({
      metricId: "R'w",
      notMeasuredEvidence: true,
      toleranceDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      totalBudgetDb: 9
    });
    expect(rwPrime.toleranceBudget.terms.map((term) => term.termId)).toEqual([
      "direct_family_curve_residual",
      "flanking_energy_path_simplification",
      "junction_vibration_reduction_surrogate",
      "input_geometry_precision",
      "same_building_holdout_absence"
    ]);
    expect(rwPrime.toleranceBudget.terms.map((term) => term.db)).toEqual([2.4, 2.7, 1.8, 1.1, 1]);
    expect(
      rwPrime.toleranceBudget.terms.every(
        (term) => term.basis === "source_absent_formula_design_budget"
      )
    ).toBe(true);

    expect(dnTw.toleranceBudget).toMatchObject({
      metricId: "DnT,w",
      notMeasuredEvidence: true,
      totalBudgetDb: 9
    });
    expect(dnTw.toleranceBudget.terms.map((term) => term.termId)).toContain(
      "receiving_room_standardization_precision"
    );
  });

  it("keeps runtime parked until Gate P instead of selecting the current heuristic overlay as building prediction", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_unsupported",
      selectedOrigin: "unsupported"
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
      origin: "unsupported"
    });
    expect(result.airborneBasis?.method).not.toContain("gate_o");
    expect(result.warnings).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("keeps negative boundaries exact instead of guessing building metrics", () => {
    const contract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
    const boundaries = contract.negativeBoundaries.map((boundary) => ({
      estimate: boundary.expectedRuntimeEstimateDb,
      id: boundary.gateNScenarioId ?? "alias_boundary",
      status: boundary.status,
      targetOutputs: boundary.targetOutputs
    }));

    expect(boundaries).toEqual([
      {
        estimate: null,
        id: "gate_n_missing_source_room_geometry_needs_input",
        status: "blocked_missing_physical_input",
        targetOutputs: ["R'w", "DnT,w"]
      },
      {
        estimate: null,
        id: "gate_n_complete_gate_m_owner_set_missing_formula_owner",
        status: "blocked_missing_formula_owner",
        targetOutputs: ["R'w", "DnT,w"]
      },
      {
        estimate: null,
        id: "gate_n_field_between_rooms_stays_out_of_building_runtime_adapter",
        status: "not_building_prediction",
        targetOutputs: ["R'w", "DnT,w"]
      },
      {
        estimate: null,
        id: "alias_boundary",
        status: "blocked_basis_alias",
        targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      }
    ]);
    expect(contract.basisAliasBlocked).toEqual({
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      sourceSingleNumberWithoutCurve: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate O and Gate P", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan");
      expect(content).toContain("gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan");
      expect(content).toContain("building-prediction formula corridor");
      expect(content).toContain("same-building holdout");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts"
    );
  });
});
