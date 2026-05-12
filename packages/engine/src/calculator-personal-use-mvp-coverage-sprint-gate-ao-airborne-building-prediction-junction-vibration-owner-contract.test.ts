import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-an";
import {
  buildPersonalUseMvpCoverageSprintGateAOContract,
  buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAPLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ao";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AO = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AO_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_HANDOFF.md"
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

describe("Personal-Use MVP Coverage Sprint Gate AO airborne building-prediction junction vibration owner contract", () => {
  it("lands Gate AO as no-runtime junction vibration owner contract and selects room standardization next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAOContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AO).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate:
        "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_landed_no_runtime_selected_junction_vibration_gate_ao",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts",
      selectionStatus:
        "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_landed_no_runtime_selected_room_standardization_gate_ap",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      directCurveOwnerPreserved: true,
      downstreamOwnerGapsStillBlocked: [
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      flankingPathEnergyOwnerPreserved: true,
      gateALOwnerGapCount: 5,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS,
      runtimePromotionAllowedInGateAO: false,
      runtimeValueMovement: false,
      selectedGateAPLane: "room_standardization_owner_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AO_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("requires a basis-compatible junction vibration index instead of generic junction or single-number aliases", () => {
    const flankingPathEnergyOwner = buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract();
    const owner = buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract({
      flankingPathEnergyOwner
    });

    expect(owner).toMatchObject({
      acceptedRequirementIds: [
        "flanking_path_energy_owner_dependency",
        "explicit_junction_class_owner",
        "coupling_length_owner",
        "basis_compatible_vibration_reduction_index_owner",
        "path_specific_junction_coupling_owner",
        "basis_compatible_metric_scope"
      ],
      directAndFlankingOwnersAloneCanPromoteBuildingRuntime: false,
      downstreamOwnerGapsStillBlocked: [
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      genericJunctionClassCanSatisfyVibrationReduction: false,
      junctionVibrationMustComeFrom:
        "basis_compatible_junction_vibration_reduction_index_for_iso_12354_1_building_prediction",
      ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID,
      rejectedSignalIds: [
        "direct_and_flanking_only_without_junction_index",
        "generic_junction_class_without_reduction_index",
        "lab_rw_single_number",
        "stc_single_number",
        "source_row_single_number_without_junction_terms",
        "field_runtime_budget",
        "opening_leak_lab_adapter",
        "legacy_raw_dynamic_field_building_continuation"
      ],
      requiredInputs: [
        "junctionVibrationReductionIndexOwner",
        "junctionCouplingLengthM",
        "explicitJunctionClassOwner",
        "junctionCouplingLengthOwner",
        "basisCompatibleVibrationReductionIndexOwner",
        "pathSpecificJunctionCouplingOwner",
        "basisCompatibleMetricScope"
      ],
      runtimeOwnedInGateAO: false,
      runtimePromotionAllowedInGateAO: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(owner.flankingPathEnergyOwnerDependency).toBe(flankingPathEnergyOwner);
    expect(owner.gateALOwnerGap.ownerId).toBe("junction_vibration_reduction_index");
    expect(owner.gatePBlockerPreserved).toContain("Junction class and coupling length");
    expect(owner.gatePBlockerPreserved).toContain("vibration-reduction index formula owner");
  });

  it("promotes complete Gate AR building-prediction runtime after the junction owner contract while partial stays parked", () => {
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
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(complete.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(complete.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(complete.unsupportedTargetOutputs).toEqual([]);
    expect(complete.metrics.estimatedRwPrimeDb).toBe(58);
    expect(complete.metrics.estimatedDnTwDb).toBe(59);
    expect(complete.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);

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

  it("preserves lab, field, opening/leak, direct-and-flanking-only, and source-single-number boundaries", () => {
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
    const owner = buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract();

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
    expect(owner.directAndFlankingOwnersAloneCanPromoteBuildingRuntime).toBe(false);
    expect(owner.genericJunctionClassCanSatisfyVibrationReduction).toBe(false);
    expect(owner.rejectedSignalIds).toEqual([
      "direct_and_flanking_only_without_junction_index",
      "generic_junction_class_without_reduction_index",
      "lab_rw_single_number",
      "stc_single_number",
      "source_row_single_number_without_junction_terms",
      "field_runtime_budget",
      "opening_leak_lab_adapter",
      "legacy_raw_dynamic_field_building_continuation"
    ]);
  });

  it("ranks Gate AP room standardization ahead of uncertainty, runtime promotion, and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAPLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "room_standardization_owner_contract",
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
        id: "room_standardization_owner_contract",
        score: 5,
        selected: true,
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
      "keep Gate AO no-runtime: junction vibration ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select room standardization after direct, flanking, and junction ownership because DnT,w needs room absorption normalization",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AO closeout and Gate AP selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE);
      expect(content, path).toContain("junction vibration");
      expect(content, path).toContain("room standardization");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts"
    );
  });
});
