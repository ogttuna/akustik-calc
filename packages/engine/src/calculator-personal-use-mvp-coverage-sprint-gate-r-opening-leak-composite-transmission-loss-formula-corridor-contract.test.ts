import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AirborneContextSchema,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateROpeningLeakCompositeFormulaAssessment,
  buildGateROpeningLeakCompositeFormulaCorridorContract,
  buildGateROpeningLeakCompositeSealDecisionTable,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
  GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS,
  GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB
} from "./dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor";
import {
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_R = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  selectionStatus: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_R_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_R_HANDOFF.md",
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

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const COMPLETE_OWNER_INPUTS = {
  areaWeightedTransmissionCoefficientFormulaOwner: true,
  compositeAreaTransmissionLossEnergyFormulaOwner: true,
  compositeUncertaintyBudgetOwner: true,
  hostWallCandidateBoundaryOwner: true,
  hostWallRwCandidateOwner: true,
  openingLeakagePenaltyFormulaOwner: true,
  openingOriginPolicyOwner: true,
  openingRatingBasisPolicyOwner: true,
  sealLeakagePenaltyTableOwner: true,
  sourceAbsentOpeningValueBudgetOwner: true
} as const;

const COMPLETE_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
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

const COMPLETE_BUILDING_CONTEXT_WITH_OPENING: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const REORDERED_OPENINGS: NonNullable<AirborneContext["openingLeakElements"]> = [
  {
    areaM2: 1,
    count: 1,
    elementRwDb: 32,
    id: "door",
    origin: "catalogued",
    ratingBasis: "rw_single_number",
    sealLeakageClass: "average"
  },
  {
    areaM2: 0.8,
    count: 2,
    elementRwDb: 36,
    id: "window",
    origin: "measured",
    ratingBasis: "iso_717_1_curve",
    sealLeakageClass: "sealed"
  }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate R opening/leak composite formula corridor", () => {
  it("lands Gate R as a no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildGateROpeningLeakCompositeFormulaCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_R).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
      previousSelectionStatus: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
      runtimePromotionAllowedInGateR: false,
      runtimeValueMovement: false,
      selectedNextAction: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
      selectionStatus: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract.basisAliasBlocked).toEqual({
      buildingPredictionMetrics: true,
      fieldRuntimeMetrics: true,
      stcOpeningBasisWithoutRwAdapter: true
    });
    expect(contract.candidateFormulaAssessment.requiredPhysicalInputs).toEqual(
      GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS
    );
    expect(contract.candidateFormulaAssessment.requiredInputContractOwnerInputs).toEqual(
      GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS
    );
    expect(contract.candidateFormulaAssessment.requiredFormulaOwnerInputs).toEqual(
      GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS
    );

    for (const path of REQUIRED_GATE_R_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines the area-energy Rw corridor with explicit opening leakage penalty and visible budget", () => {
    const parsed = AirborneContextSchema.parse(COMPLETE_OPENING_CONTEXT);
    const assessment = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: parsed,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_complete_average_seal_formula_corridor_defined",
      targetOutputs: ["Rw", "STC"]
    });

    expect(assessment).toMatchObject({
      affectedFormulaOutputs: ["Rw"],
      basisId: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
      blockedOutputs: ["STC"],
      designCorridorEstimateDb: 38.2,
      effectiveOpeningAreaM2: 1.8,
      exactMeasuredRowsRemainPrecedence: true,
      hostNetWallAreaM2: 10.2,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      missingFormulaInputs: [],
      missingFormulaOwnerInputs: [],
      missingPhysicalInputs: [],
      openingAreaRatio: 0.15,
      proposedRuntimeEstimateDb: null,
      runtimePromotionAllowedInGateR: false,
      runtimeValueMovement: false,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "formula_corridor_defined_runtime_gate_required"
    });
    expect(assessment.openingContributions).toEqual([
      {
        areaM2: 1.8,
        count: 1,
        effectiveAreaM2: 1.8,
        effectiveRwDb: 30,
        id: "door-01",
        leakagePenaltyDb: 2,
        origin: "catalogued",
        ratingBasis: "rw_single_number",
        sealLeakageClass: "average",
        transmissionCoefficient: 0.001
      }
    ]);
    expect(assessment.formulaTerms.map((term) => term.termId)).toEqual([
      "host_wall_candidate_transmission_coefficient",
      "area_weighted_transmission_coefficient_sum",
      "opening_seal_leakage_penalty",
      "opening_rating_basis_policy",
      "source_absent_composite_uncertainty_budget"
    ]);
    expect(assessment.toleranceBudget).toMatchObject({
      metricId: "Rw",
      notMeasuredEvidence: true,
      toleranceDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB,
      totalBudgetDb: 6
    });
    expect(assessment.toleranceBudget.terms.map((term) => term.termId)).toEqual([
      "host_wall_candidate_residual",
      "opening_single_number_basis_simplification",
      "seal_leakage_penalty_surrogate",
      "area_measurement_precision",
      "same_stack_opening_holdout_absence"
    ]);
  });

  it("keeps the seal decision table monotonic across sealed, average, leaky, and open-gap cases", () => {
    const table = buildGateROpeningLeakCompositeSealDecisionTable();

    expect(table).toEqual([
      {
        designCorridorEstimateDb: 43.7,
        effectiveOpeningRwDb: 34,
        leakagePenaltyDb: 0,
        sealLeakageClass: "sealed"
      },
      {
        designCorridorEstimateDb: 41.8,
        effectiveOpeningRwDb: 32,
        leakagePenaltyDb: 2,
        sealLeakageClass: "average"
      },
      {
        designCorridorEstimateDb: 37.9,
        effectiveOpeningRwDb: 28,
        leakagePenaltyDb: 6,
        sealLeakageClass: "leaky"
      },
      {
        designCorridorEstimateDb: 32,
        effectiveOpeningRwDb: 22,
        leakagePenaltyDb: 12,
        sealLeakageClass: "open_gap"
      }
    ]);
    expect(table[0]?.designCorridorEstimateDb).toBeGreaterThan(table[1]?.designCorridorEstimateDb ?? 0);
    expect(table[1]?.designCorridorEstimateDb).toBeGreaterThan(table[2]?.designCorridorEstimateDb ?? 0);
    expect(table[2]?.designCorridorEstimateDb).toBeGreaterThan(table[3]?.designCorridorEstimateDb ?? 0);
  });

  it("blocks missing owners, STC-only opening basis, source-absent unbudgeted values, and building outputs", () => {
    const missingPhysical = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: { contextMode: "element_lab" },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_missing_gate_q_physical_fields_blocked",
      targetOutputs: ["Rw"]
    });
    const missingOwners = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: COMPLETE_OPENING_CONTEXT,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: {
        compositeAreaTransmissionLossEnergyFormulaOwner: true,
        hostWallCandidateBoundaryOwner: true,
        openingLeakagePenaltyFormulaOwner: true,
        openingOriginPolicyOwner: true
      },
      scenarioId: "gate_r_missing_formula_owner_blocked",
      targetOutputs: ["Rw"]
    });
    const stcOnlyBasis = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0],
            id: "stc-only-door",
            ratingBasis: "stc_single_number"
          }
        ]
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_stc_only_opening_basis_blocked",
      targetOutputs: ["Rw"]
    });
    const sourceAbsentWithoutBudget = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0],
            id: "source-absent-window",
            origin: "source_absent"
          }
        ]
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: {
        ...COMPLETE_OWNER_INPUTS,
        sourceAbsentOpeningValueBudgetOwner: false
      },
      scenarioId: "gate_r_source_absent_opening_without_budget_owner_blocked",
      targetOutputs: ["Rw"]
    });
    const buildingOutputLeakage = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT_WITH_OPENING,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_building_prediction_outputs_blocked",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(missingPhysical).toMatchObject({
      designCorridorEstimateDb: null,
      missingPhysicalInputs: [
        "hostWallAreaM2",
        "openingAreaM2",
        "openingElementRwDb",
        "openingRatingBasis",
        "openingSealLeakageClass",
        "openingCount",
        "openingOrigin"
      ],
      status: "blocked_missing_physical_input"
    });
    expect(missingOwners).toMatchObject({
      designCorridorEstimateDb: null,
      missingFormulaOwnerInputs: [
        "hostWallRwCandidateOwner",
        "areaWeightedTransmissionCoefficientFormulaOwner",
        "openingRatingBasisPolicyOwner",
        "sealLeakagePenaltyTableOwner",
        "compositeUncertaintyBudgetOwner"
      ],
      status: "blocked_missing_formula_owner"
    });
    expect(stcOnlyBasis).toMatchObject({
      designCorridorEstimateDb: null,
      status: "blocked_basis_alias"
    });
    expect(sourceAbsentWithoutBudget).toMatchObject({
      designCorridorEstimateDb: null,
      missingFormulaOwnerInputs: ["sourceAbsentOpeningValueBudgetOwner"],
      status: "blocked_source_absent_opening_budget_owner"
    });
    expect(buildingOutputLeakage).toMatchObject({
      affectedFormulaOutputs: [],
      blockedOutputs: ["R'w", "DnT,w"],
      designCorridorEstimateDb: null,
      status: "not_element_lab_context"
    });
  });

  it("keeps safe opening reorders invariant while Gate S owns later runtime movement", () => {
    const ordered = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 20,
        openingLeakElements: REORDERED_OPENINGS
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_safe_reordered_openings_invariant",
      targetOutputs: ["Rw"]
    });
    const reversed = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 20,
        openingLeakElements: [...REORDERED_OPENINGS].reverse()
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_safe_reordered_openings_invariant",
      targetOutputs: ["Rw"]
    });
    const baseline = calculateAssembly(HOST_WALL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const withOpening = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const buildingWithOpening = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT_WITH_OPENING,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(ordered.designCorridorEstimateDb).toBe(41.4);
    expect(reversed.designCorridorEstimateDb).toBe(ordered.designCorridorEstimateDb);
    expect(reversed.normalizedOpeningKeys).toEqual(ordered.normalizedOpeningKeys);
    expect(reversed.openingContributions).toEqual([...ordered.openingContributions].reverse());
    expect(withOpening.metrics.estimatedRwDb).toBe(38.2);
    expect(withOpening.metrics.estimatedStc).toBe(baseline.metrics.estimatedStc);
    expect(withOpening.supportedTargetOutputs).toEqual(["Rw"]);
    expect(withOpening.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(withOpening.airborneBasis?.method).toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(withOpening.warnings).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING);
    expect(buildingWithOpening.supportedTargetOutputs).toEqual([]);
    expect(buildingWithOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps docs and the current-gate runner aligned with Gate R closeout and Gate S selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN);
      expect(content).toContain(GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS);
      expect(content).toContain(GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts"
    );
    expect(readRepoFile("docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_R_HANDOFF.md")).toContain(
      GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE
    );
  });
});
