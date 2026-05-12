import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateMAirborneBuildingPredictionContract,
  buildGateMAirborneBuildingPredictionScenarioPack,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE
} from "./dynamic-airborne-gate-m-building-prediction-input-contract";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_M = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
  runtimeOriginPromotion: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
  selectionStatus: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: true,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_M_SURFACES = [
  "packages/shared/src/domain/airborne-context.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-m-building-prediction-input-contract.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/calculate-assembly.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
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

describe("Personal-Use MVP Coverage Sprint Gate M airborne building-prediction input contract", () => {
  it("lands the complete no-runtime input contract and selects the runtime-adapter gate next", () => {
    const contract = buildGateMAirborneBuildingPredictionContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_M).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
      runtimeOriginPromotion: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts",
      selectionStatus:
        "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: true,
      workbenchVisibleBehaviorChange: true
    });
    expect(contract).toMatchObject({
      landedGate: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN,
      numericRuntimeBehaviorChange: false,
      runtimePromotionAllowedInGateM: false,
      selectedNextAction: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
      selectionStatus: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract.requiredPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "sourceRoomVolumeM3",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);
    expect(contract.requiredOwnerInputs).toEqual([
      "ISO_12354_1_flanking_transmission_adapter_owner",
      "junctionCouplingLengthOwner",
      "apparentBuildingMetricBasisOwner",
      "standardizedBuildingMetricBasisOwner"
    ]);
    expect(contract.requiredPhysicalInputs).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(contract.requiredOwnerInputs).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS
    ]);

    for (const path of REQUIRED_GATE_M_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("distinguishes complete physical input readiness from runtime-adapter ownership", () => {
    const scenarios = Object.fromEntries(
      buildGateMAirborneBuildingPredictionScenarioPack().map((scenario) => [scenario.id, scenario])
    );
    const complete = scenarios.gate_m_complete_owner_set_ready_for_runtime_gate;
    const missingRuntimeOwner = scenarios.gate_m_complete_physical_inputs_missing_runtime_owner;

    expect(complete.status).toBe("ready_for_runtime_gate");
    expect(complete.runtimePromotionAllowedInGateM).toBe(false);
    expect(complete.missingPhysicalInputs).toEqual([]);
    expect(complete.missingOwnerInputs).toEqual([]);
    expect(complete.readyOutputs).toEqual(["R'w", "DnT,w"]);
    expect(complete.routeInputAssessment).toMatchObject({
      missingPhysicalInputs: [],
      outputBasis: "building_prediction",
      routeFamilies: ["building_prediction_airborne_context"],
      status: "complete"
    });

    expect(missingRuntimeOwner.status).toBe("blocked_runtime_owner");
    expect(missingRuntimeOwner.missingPhysicalInputs).toEqual([]);
    expect(missingRuntimeOwner.missingOwnerInputs).toEqual([
      "ISO_12354_1_flanking_transmission_adapter_owner",
      "junctionCouplingLengthOwner",
      "apparentBuildingMetricBasisOwner",
      "standardizedBuildingMetricBasisOwner"
    ]);
    expect(missingRuntimeOwner.blockedOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps nearby partial owner sets as precise needs_input cases", () => {
    const scenarios = Object.fromEntries(
      buildGateMAirborneBuildingPredictionScenarioPack().map((scenario) => [scenario.id, scenario])
    );

    expect(scenarios.gate_m_missing_source_room_geometry_needs_input).toMatchObject({
      missingPhysicalInputs: ["sourceRoomVolumeM3"],
      status: "needs_input"
    });
    expect(scenarios.gate_m_missing_flanking_assumption_needs_input).toMatchObject({
      missingPhysicalInputs: ["flankingJunctionClass", "conservativeFlankingAssumption"],
      status: "needs_input"
    });
    expect(scenarios.gate_m_missing_junction_length_and_output_basis_needs_input).toMatchObject({
      missingPhysicalInputs: ["junctionCouplingLengthM", "buildingPredictionOutputBasis"],
      status: "needs_input"
    });
    expect(scenarios.gate_m_field_between_rooms_stays_out_of_building_contract.status).toBe("not_requested");
  });

  it("feeds the route-input topology assessment while Gate AR now promotes complete building-prediction runtime values", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: BUILDING_OUTPUTS
    });
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(assessment).toMatchObject({
      missingPhysicalInputs: [],
      outputBasis: "building_prediction",
      routeFamilies: ["building_prediction_airborne_context"],
      status: "complete"
    });
    expect(assessment.inputCompletenessSet[0]?.requiredFields).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution?.selectedBasis?.missingPhysicalInputs ?? []).toEqual([]);
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwPrimeDb).toBe(58);
    expect(result.metrics.estimatedDnTwDb).toBe(59);
    expect(
      result.airborneCandidateResolution?.candidates.find((candidate: { id: string; selected?: boolean }) =>
        candidate.id === "candidate_airborne_field_context_family_physics_prediction"
      )?.selected
    ).not.toBe(true);
    expect(result.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
    expect(result.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  });

  it("keeps Gate I room-to-room field values stable while Gate M owns only building input readiness", () => {
    const field = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_airborne_field_context_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.metrics.estimatedRwPrimeDb).toBe(58);
    expect(field.metrics.estimatedDnTwDb).toBe(59);
    expect(field.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("keeps docs and the current-gate runner aligned with Gate M and Gate N", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan");
      expect(content).toContain("gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan");
      expect(content).toContain("source-room volume");
      expect(content).toContain("junction coupling length");
      expect(content).toContain("building output basis");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts"
    );
  });
});
