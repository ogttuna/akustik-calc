import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";
import { GATE_M_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BOUNDARY_WARNING } from "./dynamic-airborne-gate-m-building-prediction-input-contract";
import {
  buildGateNAirborneBuildingPredictionRuntimeAdapterContract,
  buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_N = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
  runtimeOriginPromotion: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
  selectionStatus: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_N_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts",
  "packages/engine/src/dynamic-airborne-gate-m-building-prediction-input-contract.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
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

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
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

describe("Personal-Use MVP Coverage Sprint Gate N airborne building-prediction runtime adapter", () => {
  it("lands a no-runtime runtime-adapter boundary and selects the formula-corridor gate next", () => {
    const contract = buildGateNAirborneBuildingPredictionRuntimeAdapterContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_N).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
      runtimeOriginPromotion: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts",
      selectionStatus:
        "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: true
    });
    expect(contract).toMatchObject({
      formulaCorridorPromotionRequiresGateO: true,
      landedGate: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
      numericRuntimeBehaviorChange: false,
      runtimePromotionAllowedInGateN: false,
      selectedNextAction: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
      selectionStatus: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract.requiredPhysicalInputs).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(contract.requiredFormulaOwnerInputs).toEqual([
      "ISO_12354_1_direct_separating_element_frequency_curve_owner",
      "ISO_12354_1_flanking_path_transmission_terms_owner",
      "ISO_12354_1_junction_vibration_reduction_index_owner",
      "ISO_12354_1_room_absorption_normalization_owner",
      "buildingPredictionUncertaintyBudgetOwner"
    ]);
    expect(contract.requiredFormulaOwnerInputs).toEqual([
      ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
    ]);
    expect(contract.requiredOwnerInputs).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
      ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
    ]);
    expect(contract.requiredOwnerInputs).toEqual([
      ...GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS
    ]);

    for (const path of REQUIRED_GATE_N_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("distinguishes Gate M physical/adapter ownership from missing formula ownership", () => {
    const scenarios = Object.fromEntries(
      buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack().map((scenario) => [
        scenario.id,
        scenario
      ])
    );
    const missingFormula = scenarios.gate_n_complete_gate_m_owner_set_missing_formula_owner;
    const readyForGateO = scenarios.gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor;
    const missingGateMOwner = scenarios.gate_n_missing_gate_m_metric_basis_owner;

    expect(missingFormula.status).toBe("blocked_formula_owner");
    expect(missingFormula.runtimePromotionAllowedInGateN).toBe(false);
    expect(missingFormula.formulaCorridorPromotionRequiresGateO).toBe(true);
    expect(missingFormula.missingPhysicalInputs).toEqual([]);
    expect(missingFormula.missingAdapterOwnerInputs).toEqual([]);
    expect(missingFormula.missingFormulaOwnerInputs).toEqual([
      ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
    ]);
    expect(missingFormula.blockedOutputs).toEqual(["R'w", "DnT,w"]);
    expect(missingFormula.readyOutputs).toEqual([]);

    expect(readyForGateO.status).toBe("ready_for_formula_corridor");
    expect(readyForGateO.runtimePromotionAllowedInGateN).toBe(false);
    expect(readyForGateO.missingOwnerInputs).toEqual([]);
    expect(readyForGateO.readyOutputs).toEqual(["R'w", "DnT,w"]);
    expect(readyForGateO.blockedOutputs).toEqual([]);

    expect(missingGateMOwner.status).toBe("blocked_adapter_owner");
    expect(missingGateMOwner.missingAdapterOwnerInputs).toEqual([
      "apparentBuildingMetricBasisOwner",
      "standardizedBuildingMetricBasisOwner"
    ]);
    expect(missingGateMOwner.missingFormulaOwnerInputs).toEqual([]);
  });

  it("keeps partial physical input and non-building contexts outside the formula corridor", () => {
    const scenarios = Object.fromEntries(
      buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack().map((scenario) => [
        scenario.id,
        scenario
      ])
    );

    expect(scenarios.gate_n_missing_source_room_geometry_needs_input).toMatchObject({
      missingPhysicalInputs: ["sourceRoomVolumeM3"],
      status: "needs_input"
    });
    expect(scenarios.gate_n_field_between_rooms_stays_out_of_building_runtime_adapter).toMatchObject({
      blockedOutputs: [],
      missingOwnerInputs: [],
      readyOutputs: [],
      status: "not_requested"
    });
  });

  it("updates complete building-prediction unsupported posture without producing runtime values", () => {
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
      origin: "unsupported",
      requiredInputs: [...GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS]
    });
    expect(result.airborneCandidateResolution?.selectedBasis?.missingPhysicalInputs ?? []).toEqual([]);
    expect(
      result.airborneCandidateResolution?.candidates.find((candidate: { id: string; selected?: boolean }) =>
        candidate.id === GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      )?.selected
    ).not.toBe(true);
    expect(result.warnings).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
    expect(result.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
    expect(result.warnings).not.toContain(GATE_M_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BOUNDARY_WARNING);
    expect(result.warnings.join("\n")).not.toContain("Airborne field-side overlay active");
  });

  it("keeps Gate I room-to-room field values stable while Gate N owns only building adapter readiness", () => {
    const field = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.metrics.estimatedRwPrimeDb).toBe(58);
    expect(field.metrics.estimatedDnTwDb).toBe(59);
    expect(field.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("keeps docs and the current-gate runner aligned with Gate N and Gate O", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan");
      expect(content).toContain("gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan");
      expect(content).toContain("flanking formula terms");
      expect(content).toContain("building-prediction runtime adapter");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts"
    );
  });
});
