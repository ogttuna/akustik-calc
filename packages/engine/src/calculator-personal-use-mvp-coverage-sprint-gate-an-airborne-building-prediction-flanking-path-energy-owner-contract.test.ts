import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-am";
import {
  buildPersonalUseMvpCoverageSprintGateANContract,
  buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAOLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-an";
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

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AN = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AN_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_HANDOFF.md"
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

describe("Personal-Use MVP Coverage Sprint Gate AN airborne building-prediction flanking path energy owner contract", () => {
  it("lands Gate AN as no-runtime flanking path energy owner contract and selects junction vibration next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateANContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AN).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate:
        "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts",
      selectionStatus:
        "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_landed_no_runtime_selected_junction_vibration_gate_ao",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      directCurveOwnerPreserved: true,
      downstreamOwnerGapsStillBlocked: [
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      gateALOwnerGapCount: 5,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS,
      runtimePromotionAllowedInGateAN: false,
      runtimeValueMovement: false,
      selectedGateAOLane: "junction_vibration_reduction_owner_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AN_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("requires named flanking path energy terms instead of generic flanking or single-number aliases", () => {
    const directCurveOwner = buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract();
    const owner = buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract({
      directCurveOwner
    });

    expect(owner).toMatchObject({
      acceptedRequirementIds: [
        "direct_curve_owner_dependency",
        "named_flanking_path_topology",
        "flanking_path_identity_and_count_owner",
        "basis_compatible_indirect_transmission_terms",
        "coupling_surface_area_owner",
        "source_absent_conservative_assumption_owner",
        "basis_compatible_metric_scope"
      ],
      directCurveOwnerAloneCanPromoteBuildingRuntime: false,
      downstreamOwnerGapsStillBlocked: [
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      flankingEnergyMustComeFrom:
        "named_indirect_path_energy_terms_for_iso_12354_1_building_prediction",
      genericConservativeAssumptionCanSatisfyFlankingEnergy: false,
      ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID,
      rejectedSignalIds: [
        "direct_curve_only_without_indirect_paths",
        "generic_flanking_assumption_without_path_identity",
        "lab_rw_single_number",
        "stc_single_number",
        "source_row_single_number_without_path_terms",
        "field_runtime_budget",
        "opening_leak_lab_adapter",
        "legacy_raw_dynamic_field_building_continuation"
      ],
      requiredInputs: [
        "flankingPathTransmissionTermsOwner",
        "flankingJunctionClass",
        "namedFlankingPathTopologyOwner",
        "flankingPathIdentityAndCountOwner",
        "basisCompatibleIndirectTransmissionTermsOwner",
        "couplingSurfaceAreaOwner",
        "sourceAbsentConservativeAssumptionOwner",
        "basisCompatibleMetricScope"
      ],
      runtimeOwnedInGateAN: false,
      runtimePromotionAllowedInGateAN: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(owner.directCurveOwnerDependency).toBe(directCurveOwner);
    expect(owner.gateALOwnerGap.ownerId).toBe("flanking_path_energy_sum");
    expect(owner.gatePBlockerPreserved).toContain("path-by-path transmission energy terms");
  });

  it("promotes complete Gate AR building-prediction runtime after the flanking owner contract while partial stays parked", () => {
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

  it("preserves direct-curve-only, lab, field, opening/leak, and source-single-number boundaries", () => {
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
    const owner = buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract();

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
      selectedCandidateId: "candidate_company_internal_opening_leak_building_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(openingBuilding.airborneBasis).toMatchObject({
      method: "company_internal_opening_leak_building_area_energy_runtime_corridor",
      origin: "family_physics_prediction"
    });
    expect(openingBuilding.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(openingBuilding.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(openingBuilding.metrics.estimatedRwPrimeDb).toBe(31.6);
    expect(openingBuilding.metrics.estimatedDnTwDb).toBe(32.1);
    expect(owner.directCurveOwnerAloneCanPromoteBuildingRuntime).toBe(false);
    expect(owner.genericConservativeAssumptionCanSatisfyFlankingEnergy).toBe(false);
    expect(owner.rejectedSignalIds).toEqual([
      "direct_curve_only_without_indirect_paths",
      "generic_flanking_assumption_without_path_identity",
      "lab_rw_single_number",
      "stc_single_number",
      "source_row_single_number_without_path_terms",
      "field_runtime_budget",
      "opening_leak_lab_adapter",
      "legacy_raw_dynamic_field_building_continuation"
    ]);
  });

  it("ranks Gate AO junction vibration ahead of room, uncertainty, runtime promotion, and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAOLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "junction_vibration_reduction_owner_contract",
      score: 4.6,
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
        id: "junction_vibration_reduction_owner_contract",
        score: 4.6,
        selected: true,
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
      "keep Gate AN no-runtime: flanking path energy ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select junction vibration reduction after direct and flanking energy because indirect path energy still needs junction coupling ownership",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AN closeout and Gate AO selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE);
      expect(content, path).toContain("flanking path energy");
      expect(content, path).toContain("junction vibration");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts"
    );
  });
});
