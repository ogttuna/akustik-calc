import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ao";
import {
  buildPersonalUseMvpCoverageSprintGateAPContract,
  buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAQLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ap";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment,
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

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AP = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AP_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_HANDOFF.md"
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
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
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

const COMPLETE_GATE_M_RUNTIME_OWNERS = {
  apparentBuildingMetricBasisOwner: true,
  iso12354FlankingAdapterOwner: true,
  junctionCouplingLengthOwner: true,
  standardizedBuildingMetricBasisOwner: true
} as const;

const DIRECT_FLANKING_JUNCTION_AND_ROOM_FORMULA_OWNERS = {
  directSeparatingElementFrequencyCurveOwner: true,
  flankingPathTransmissionTermsOwner: true,
  junctionVibrationReductionIndexOwner: true,
  roomAbsorptionNormalizationOwner: true
} as const;

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AP airborne building-prediction room standardization owner contract", () => {
  it("lands Gate AP as no-runtime room standardization owner contract and selects uncertainty budget next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAPContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AP).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate:
        "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_landed_no_runtime_selected_room_standardization_gate_ap",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts",
      selectionStatus:
        "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      directCurveOwnerPreserved: true,
      downstreamOwnerGapsStillBlocked: ["building_prediction_uncertainty_budget"],
      flankingPathEnergyOwnerPreserved: true,
      gateALOwnerGapCount: 5,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      junctionVibrationOwnerPreserved: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS,
      runtimePromotionAllowedInGateAP: false,
      runtimeValueMovement: false,
      selectedGateAQLane: "building_prediction_uncertainty_budget_owner_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AP_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("requires basis-compatible room absorption terms instead of generic room or field aliases", () => {
    const junctionVibrationOwner = buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract();
    const owner = buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract({
      junctionVibrationOwner
    });

    expect(owner).toMatchObject({
      acceptedRequirementIds: [
        "junction_vibration_owner_dependency",
        "separating_element_area_owner",
        "receiving_room_volume_owner",
        "receiving_room_rt60_owner",
        "building_standardization_basis_owner",
        "basis_compatible_room_absorption_owner",
        "basis_compatible_metric_scope"
      ],
      directFlankingJunctionOwnersAloneCanPromoteBuildingRuntime: false,
      downstreamOwnerGapsStillBlocked: ["building_prediction_uncertainty_budget"],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      genericRoomLabelCanSatisfyStandardization: false,
      ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID,
      rejectedSignalIds: [
        "direct_flanking_junction_without_room_standardization",
        "generic_room_label_without_rt60_or_volume",
        "apparent_r_prime_w_relabelled_as_dntw",
        "lab_rw_single_number",
        "stc_single_number",
        "source_row_single_number_without_room_terms",
        "field_room_correction_alias",
        "opening_leak_lab_adapter",
        "legacy_raw_dynamic_field_building_continuation"
      ],
      requiredInputs: [
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "separatingElementAreaOwner",
        "receivingRoomVolumeOwner",
        "receivingRoomRt60Owner",
        "buildingStandardizationBasisOwner",
        "basisCompatibleRoomAbsorptionOwner",
        "basisCompatibleMetricScope"
      ],
      roomStandardizationMustComeFrom:
        "basis_compatible_receiving_room_absorption_standardization_for_iso_12354_1_building_prediction",
      runtimeOwnedInGateAP: false,
      runtimePromotionAllowedInGateAP: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(owner.junctionVibrationOwnerDependency).toBe(junctionVibrationOwner);
    expect(owner.gateALOwnerGap.ownerId).toBe("room_absorption_standardization");
    expect(owner.gatePBlockerPreserved).toContain("Room geometry and RT60");
    expect(owner.gatePBlockerPreserved).toContain("building-standardization term");
  });

  it("keeps direct, flanking, junction, and room owner sets blocked until uncertainty ownership exists", () => {
    const assessment = buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      formulaOwners: DIRECT_FLANKING_JUNCTION_AND_ROOM_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_complete_gate_m_owner_set_missing_formula_owner",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(assessment.status).toBe("blocked_formula_owner");
    expect(assessment.blockedOutputs).toEqual(["R'w", "DnT,w"]);
    expect(assessment.readyOutputs).toEqual([]);
    expect(assessment.missingFormulaOwnerInputs).toEqual([
      "buildingPredictionUncertaintyBudgetOwner"
    ]);
    expect(assessment.missingPhysicalInputs).toEqual([]);
    expect(assessment.runtimePromotionAllowedInGateN).toBe(false);
  });

  it("preserves Gate AR building runtime, missing-room needs-input, field, lab, and opening/leak boundaries", () => {
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
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(partial.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });

    expect(lab.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.airborneBasis?.method).not.toBe(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD);

    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.airborneBasis?.method).not.toBe(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD);

    expect(openingBuilding.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_company_internal_opening_leak_building_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(openingBuilding.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(openingBuilding.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(openingBuilding.metrics.estimatedRwPrimeDb).toBe(31.6);
    expect(openingBuilding.metrics.estimatedDnTwDb).toBe(32.1);
  });

  it("ranks Gate AQ uncertainty ownership ahead of runtime promotion and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAQLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "building_prediction_uncertainty_budget_owner_contract",
      score: 4.8,
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
        id: "building_prediction_uncertainty_budget_owner_contract",
        score: 4.8,
        selected: true,
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
      "keep Gate AP no-runtime: room standardization ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select uncertainty-budget ownership after direct, flanking, junction, and room physical owners are defined",
      "reject broad source crawling and direct runtime promotion while the Gate AL uncertainty owner remains unowned"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AP closeout and Gate AQ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE);
      expect(content, path).toContain("room standardization");
      expect(content, path).toContain("uncertainty budget");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts"
    );
  });
});
