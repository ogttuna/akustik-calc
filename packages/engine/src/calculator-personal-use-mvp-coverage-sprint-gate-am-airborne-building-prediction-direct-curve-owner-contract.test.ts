import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAMContract,
  buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateANLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-am";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AM = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AM_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_HANDOFF.md",
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
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_HANDOFF.md"
] as const;

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

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

const PARTIAL_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "building_prediction",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
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

const OPENING_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
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

describe("Personal-Use MVP Coverage Sprint Gate AM airborne building-prediction direct curve owner contract", () => {
  it("lands Gate AM as no-runtime direct curve owner contract and selects flanking path energy next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAMContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AM).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate:
        "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_landed_no_runtime_selected_direct_curve_owner_gate_am",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts",
      selectionStatus:
        "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      downstreamOwnerGapsStillBlocked: [
        "flanking_path_energy_sum",
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      gateALOwnerGapCount: 5,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS,
      runtimePromotionAllowedInGateAM: false,
      runtimeValueMovement: false,
      selectedGateANLane: "flanking_path_energy_owner_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AM_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("requires an owned selected frequency curve instead of lab or source single-number aliases", () => {
    const owner = buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract();

    expect(owner).toMatchObject({
      acceptedRequirementIds: [
        "selected_dynamic_airborne_frequency_curve",
        "frequency_band_resolution_owner",
        "iso_717_1_rating_adapter_basis",
        "selected_candidate_trace_owner",
        "basis_compatible_metric_scope"
      ],
      directCurveMustComeFrom: "selected_dynamic_airborne_family_solver_frequency_curve",
      downstreamOwnerGapsStillBlocked: [
        "flanking_path_energy_sum",
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      labSingleNumberCanSatisfyDirectEnergyTerm: false,
      ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID,
      rejectedSignalIds: [
        "lab_rw_single_number",
        "stc_single_number",
        "source_row_single_number_without_curve",
        "field_runtime_budget",
        "opening_leak_lab_adapter",
        "legacy_raw_dynamic_field_building_continuation"
      ],
      requiredInputs: [
        "selectedDynamicAirborneCurve",
        "ISO717-1 rating adapter",
        "selectedCandidateTraceOwner",
        "frequencyBandResolutionOwner",
        "basisCompatibleMetricScope"
      ],
      runtimeOwnedInGateAM: false,
      runtimePromotionAllowedInGateAM: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(owner.gateALOwnerGap.ownerId).toBe("direct_separating_element_frequency_curve");
    expect(owner.gatePBlockerPreserved).toContain("rated single-number outputs");
    expect(owner.gatePBlockerPreserved).toContain("frequency curve owner");
  });

  it("keeps complete and partial building-prediction requests parked after the direct curve owner contract", () => {
    const complete = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });
    const partial = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(complete.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_unsupported",
      selectedOrigin: "unsupported"
    });
    expect(complete.airborneBasis).toMatchObject({
      method: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
      origin: "unsupported"
    });
    expect(complete.airborneBasis?.errorBudgetDb).toBeUndefined();
    expect(complete.supportedTargetOutputs).toEqual([]);
    expect(complete.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(complete.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(complete.metrics.estimatedDnTwDb).toBeUndefined();
    expect(complete.warnings).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);

    expect(partial.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(partial.airborneBasis?.missingPhysicalInputs).toEqual([
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);
    expect(partial.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
  });

  it("preserves lab, field, opening/leak, and source-single-number direct-energy boundaries", () => {
    const lab = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const field = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });
    const openingBuilding = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: OPENING_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });
    const owner = buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract();

    expect(lab.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedRwDb: 60,
      estimatedStc: 60
    });
    expect(lab.airborneBasis?.method).not.toBe(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD);

    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics.estimatedRwPrimeDb).toBeGreaterThan(0);
    expect(field.metrics.estimatedDnTwDb).toBeGreaterThan(0);
    expect(field.airborneBasis?.method).not.toBe(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD);

    expect(openingBuilding.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_unsupported",
      selectedOrigin: "unsupported"
    });
    expect(openingBuilding.airborneBasis).toMatchObject({
      method: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
      origin: "unsupported"
    });
    expect(openingBuilding.supportedTargetOutputs).toEqual([]);
    expect(openingBuilding.unsupportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(openingBuilding.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(openingBuilding.metrics.estimatedDnTwDb).toBeUndefined();
    expect(owner.labSingleNumberCanSatisfyDirectEnergyTerm).toBe(false);
    expect(owner.rejectedSignalIds).toEqual([
      "lab_rw_single_number",
      "stc_single_number",
      "source_row_single_number_without_curve",
      "field_runtime_budget",
      "opening_leak_lab_adapter",
      "legacy_raw_dynamic_field_building_continuation"
    ]);
  });

  it("ranks Gate AN flanking path energy ahead of room, uncertainty, runtime promotion, and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateANLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "flanking_path_energy_owner_contract",
      score: 5,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.map((candidate) => ({
      id: candidate.id,
      score: candidate.score,
      selected: candidate.selected,
      sourceRowsRequiredForRuntimeSelection: candidate.sourceRowsRequiredForRuntimeSelection
    }))).toEqual([
      {
        id: "flanking_path_energy_owner_contract",
        score: 5,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "junction_vibration_reduction_owner_contract",
        score: 1.6,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "room_standardization_owner_contract",
        score: 2.7,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "building_prediction_uncertainty_budget_owner_contract",
        score: 1.8,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "building_prediction_runtime_promotion",
        score: 0,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "broad_source_crawl",
        score: 0.1,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
    expect(selection.selectionPolicy).toEqual([
      "keep Gate AM no-runtime: direct curve ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select flanking path energy after the direct element curve owner because building prediction needs both direct and indirect energy terms",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AM closeout and Gate AN selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE);
      expect(content, path).toContain("direct separating-element frequency curve");
      expect(content, path).toContain("flanking path energy");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts"
    );
  });
});
