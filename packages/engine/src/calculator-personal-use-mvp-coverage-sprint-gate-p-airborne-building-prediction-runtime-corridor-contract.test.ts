import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_P = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
  selectionStatus: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_P_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md",
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
  airtightness: "good",
  contextMode: "field_between_rooms",
  junctionQuality: "good",
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

describe("Personal-Use MVP Coverage Sprint Gate P airborne building-prediction runtime corridor", () => {
  it("lands the runtime-corridor decision as no-runtime and selects opening/leak composite modelling next", () => {
    const contract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_P).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts",
      selectionStatus:
        "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      decisionBranch: "runtime_blocked_formula_terms_not_owned",
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
      metricRuntimeMethod: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
      previousSelectionStatus: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
      runtimePromotionAllowedInGateP: false,
      runtimeValueMovement: false,
      selectedNextAction: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
      selectionStatus: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
    });

    for (const path of REQUIRED_GATE_P_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps both promotion branches explicit but blocks runtime because no formula term is executable", () => {
    const contract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();

    expect(contract.promotionBranches).toEqual([
      "runtime_promoted_with_owned_formula_terms",
      "runtime_blocked_formula_terms_not_owned"
    ]);
    expect(contract.formulaTermDecisions.map((decision) => decision.termId)).toEqual([
      "direct_separating_element_frequency_curve",
      "flanking_path_energy_sum",
      "junction_vibration_reduction_index",
      "room_absorption_standardization",
      "building_prediction_uncertainty_budget"
    ]);
    expect(
      contract.formulaTermDecisions.every(
        (decision) =>
          decision.gateODesignTermDefined &&
          decision.requiredBeforePromotion &&
          decision.runtimeExecutableInGateP === false &&
          decision.promotionBlocker.length > 40
      )
    ).toBe(true);
    expect(contract.corridorDecisions).toEqual([
      {
        blockedReason:
          "Gate P found named formula terms but no executable path-by-path building-prediction runtime owner.",
        metricId: "R'w",
        proposedRuntimeEstimateDb: null,
        runtimePromotionAllowedInGateP: false,
        selectedCandidateId: "candidate_dynamic_unsupported",
        targetOutputs: ["R'w"]
      },
      {
        blockedReason:
          "Gate P found named formula terms but no executable path-by-path building-prediction runtime owner.",
        metricId: "DnT,w",
        proposedRuntimeEstimateDb: null,
        runtimePromotionAllowedInGateP: false,
        selectedCandidateId: "candidate_dynamic_unsupported",
        targetOutputs: ["DnT,w"]
      }
    ]);
  });

  it("keeps the Gate P no-runtime governance while Gate AR now promotes complete building-prediction values", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

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
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwPrimeDb).toBe(58);
    expect(result.metrics.estimatedDnTwDb).toBe(59);
    expect(result.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("preserves field/source boundaries while Gate AW keeps broad building lab companions live", () => {
    const contract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
    const fieldResult = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });
    const labAliasAttempt = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        buildingPredictionOutputBasis: "apparent_and_standardized"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });

    expect(contract.aliasBoundariesPreserved).toEqual({
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      sourceSingleNumberWithoutCurve: true
    });
    expect(fieldResult.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      "candidate_dynamic_unsupported"
    );
    expect(fieldResult.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(fieldResult.metrics.estimatedRwPrimeDb).toBeGreaterThan(0);
    expect(fieldResult.metrics.estimatedDnTwDb).toBeGreaterThan(0);

    expect(labAliasAttempt.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(labAliasAttempt.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(labAliasAttempt.supportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(labAliasAttempt.unsupportedTargetOutputs).toEqual([]);
  });

  it("selects the next highest-ROI calculator lane without reopening broad source crawling", () => {
    const contract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();

    expect(contract.nextLaneCandidates.map((candidate) => ({
      id: candidate.id,
      score: candidate.score,
      selected: candidate.selected,
      sourceRowsRequiredForRuntimeSelection: candidate.sourceRowsRequiredForRuntimeSelection
    }))).toEqual([
      {
        id: "opening_leak_composite_transmission_loss",
        score: 1.3,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "field_context_surface_hardening",
        score: 0.7,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "broad_source_crawl",
        score: 0.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
  });

  it("keeps docs and the current-gate runner aligned with Gate P closeout and Gate Q selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN);
      expect(content).toContain(GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS);
      expect(content).toContain(GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts"
    );
    expect(readRepoFile("docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md")).toContain(
      GATE_O_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION
    );
  });
});
