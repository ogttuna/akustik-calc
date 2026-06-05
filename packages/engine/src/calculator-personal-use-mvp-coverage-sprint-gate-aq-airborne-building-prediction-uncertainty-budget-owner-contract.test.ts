import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ap";
import {
  buildPersonalUseMvpCoverageSprintGateAQContract,
  buildPersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID,
  rankPersonalUseMvpCoverageSprintGateARLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aq";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AQ = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AQ_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_GATE_AQ_PLAN_REVALIDATION_AND_IMPLEMENTATION_READY_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md"
] as const;

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

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

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
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

const COMPLETE_FORMULA_OWNERS = {
  buildingPredictionUncertaintyBudgetOwner: true,
  directSeparatingElementFrequencyCurveOwner: true,
  flankingPathTransmissionTermsOwner: true,
  junctionVibrationReductionIndexOwner: true,
  roomAbsorptionNormalizationOwner: true
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

describe("Personal-Use MVP Coverage Sprint Gate AQ airborne building-prediction uncertainty-budget owner contract", () => {
  it("lands Gate AQ as no-runtime uncertainty-budget owner contract and selects Gate AR", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAQContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AQ).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate:
        "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      allGateALOwnerContractsAccountedFor: true,
      directCurveOwnerPreserved: true,
      downstreamOwnerGapsStillBlocked: [],
      flankingPathEnergyOwnerPreserved: true,
      gateALOwnerGapCount: 5,
      gateNAllOwnerAssessmentStatus: "ready_for_formula_corridor",
      gateNRuntimePromotionAllowed: false,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      junctionVibrationOwnerPreserved: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS,
      roomStandardizationOwnerPreserved: true,
      runtimePromotionAllowedInGateAQ: false,
      runtimeValueMovement: false,
      selectedGateARLane: "all_owner_building_prediction_runtime_corridor",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AQ_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("owns both metric-specific +/-9 dB budgets without claiming measured evidence", () => {
    const roomStandardizationOwner = buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract();
    const owner = buildPersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract({
      roomStandardizationOwner
    });

    expect(owner).toMatchObject({
      acceptedRequirementIds: [
        "room_standardization_owner_dependency",
        "gate_o_metric_specific_budget_decomposition",
        "apparent_r_prime_w_budget_terms_owner",
        "standardized_dnt_w_budget_terms_owner",
        "direct_curve_residual_budget_term_owner",
        "flanking_energy_simplification_budget_term_owner",
        "junction_vibration_surrogate_budget_term_owner",
        "input_geometry_or_room_standardization_precision_budget_term_owner",
        "same_building_holdout_absence_owner",
        "source_absent_design_budget_posture",
        "not_measured_evidence_posture",
        "basis_compatible_metric_scope"
      ],
      budgetCanCreateRuntimeByItself: false,
      budgetMustComeFrom: "metric_specific_gate_o_source_absent_building_prediction_design_budget",
      downstreamOwnerGapsStillBlocked: [],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID,
      rejectedSignalIds: [
        "lab_rw_stc_tolerance_alias",
        "gate_i_field_budget_alias",
        "opening_leak_lab_adapter_budget_alias",
        "source_single_number_without_building_terms",
        "stc_iic_product_only_evidence",
        "generic_safety_factor_without_decomposition",
        "exact_source_row_without_same_building_basis",
        "measured_evidence_claim_without_same_building_holdout"
      ],
      requiredInputs: [
        "buildingPredictionUncertaintyBudgetOwner",
        "metricSpecificBudgetDecompositionOwner",
        "sameBuildingHoldoutAbsenceOwner",
        "sourceAbsentDesignBudgetPostureOwner",
        "notMeasuredEvidencePostureOwner",
        "basisCompatibleMetricScope"
      ],
      runtimePromotionAllowedInGateAQ: false,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceMovementAllowedInGateAQ: false,
      uncertaintyOwnerContractedInGateAQ: true
    });
    expect(owner.roomStandardizationOwnerDependency).toBe(roomStandardizationOwner);
    expect(owner.gateALOwnerGap.ownerId).toBe("building_prediction_uncertainty_budget");
    expect(owner.gatePBlockerPreserved).toContain("+/-9 dB budget");

    expect(owner.metricBudgets).toEqual([
      {
        metricId: "R'w",
        notMeasuredEvidence: true,
        sourceAbsentDesignBudget: true,
        termOwners: [
          {
            budgetTermId: "direct_family_curve_residual",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 2.4,
            measuredEvidence: false,
            metricId: "R'w",
            ownerSignal: "direct_curve_owner_dependency"
          },
          {
            budgetTermId: "flanking_energy_path_simplification",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 2.7,
            measuredEvidence: false,
            metricId: "R'w",
            ownerSignal: "flanking_path_energy_owner_dependency"
          },
          {
            budgetTermId: "junction_vibration_reduction_surrogate",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1.8,
            measuredEvidence: false,
            metricId: "R'w",
            ownerSignal: "junction_vibration_owner_dependency"
          },
          {
            budgetTermId: "input_geometry_precision",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1.1,
            measuredEvidence: false,
            metricId: "R'w",
            ownerSignal: "geometry_precision_owner"
          },
          {
            budgetTermId: "same_building_holdout_absence",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1,
            measuredEvidence: false,
            metricId: "R'w",
            ownerSignal: "same_building_holdout_absence_owner"
          }
        ],
        toleranceDb: 9,
        totalBudgetDb: 9
      },
      {
        metricId: "DnT,w",
        notMeasuredEvidence: true,
        sourceAbsentDesignBudget: true,
        termOwners: [
          {
            budgetTermId: "direct_family_curve_residual",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 2.4,
            measuredEvidence: false,
            metricId: "DnT,w",
            ownerSignal: "direct_curve_owner_dependency"
          },
          {
            budgetTermId: "flanking_energy_path_simplification",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 2.7,
            measuredEvidence: false,
            metricId: "DnT,w",
            ownerSignal: "flanking_path_energy_owner_dependency"
          },
          {
            budgetTermId: "junction_vibration_reduction_surrogate",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1.8,
            measuredEvidence: false,
            metricId: "DnT,w",
            ownerSignal: "junction_vibration_owner_dependency"
          },
          {
            budgetTermId: "receiving_room_standardization_precision",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1.1,
            measuredEvidence: false,
            metricId: "DnT,w",
            ownerSignal: "room_standardization_precision_owner"
          },
          {
            budgetTermId: "same_building_holdout_absence",
            canTightenRuntimeToleranceInGateAQ: false,
            db: 1,
            measuredEvidence: false,
            metricId: "DnT,w",
            ownerSignal: "same_building_holdout_absence_owner"
          }
        ],
        toleranceDb: 9,
        totalBudgetDb: 9
      }
    ]);
  });

  it("classifies all building formula owners as ready for Gate AR while runtime remains parked", () => {
    const withoutBudget = buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      formulaOwners: DIRECT_FLANKING_JUNCTION_AND_ROOM_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_complete_gate_m_owner_set_missing_formula_owner",
      targetOutputs: BUILDING_OUTPUTS
    });
    const withBudget = buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      formulaOwners: COMPLETE_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(withoutBudget.status).toBe("blocked_formula_owner");
    expect(withoutBudget.missingFormulaOwnerInputs).toEqual([
      "buildingPredictionUncertaintyBudgetOwner"
    ]);
    expect(withoutBudget.blockedOutputs).toEqual(["R'w", "DnT,w"]);

    expect(withBudget).toMatchObject({
      blockedOutputs: [],
      formulaCorridorPromotionRequiresGateO: true,
      missingFormulaOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["R'w", "DnT,w"],
      runtimePromotionAllowedInGateN: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "ready_for_formula_corridor"
    });
  });

  it("preserves Gate AQ boundaries while Gate AR now promotes complete building runtime", () => {
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
    expect(partial.supportedTargetOutputs).toEqual([]);
    expect(partial.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);

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

  it("ranks Gate AR all-owner runtime corridor ahead of parity-only work and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateARLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "all_owner_building_prediction_runtime_corridor",
      score: 6.7,
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
        id: "all_owner_building_prediction_runtime_corridor",
        score: 6.7,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "surface_parity_without_runtime",
        score: 2.7,
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
      "keep Gate AQ no-runtime: uncertainty-budget ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select the all-owner runtime corridor only after direct, flanking, junction, room, and uncertainty owners are all accounted for",
      "reject surface parity and broad source crawling before the runtime corridor has an executable value path"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AQ closeout and Gate AR selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE);
      expect(content, path).toContain("uncertainty-budget owner");
      expect(content, path).toContain("all-owner runtime corridor");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts"
    );
  });
});
