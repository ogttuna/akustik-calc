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
  buildGateQOpeningLeakCompositeAssessment,
  buildGateQOpeningLeakCompositeInputContract,
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
  GATE_Q_OPENING_LEAK_COMPOSITE_NO_RUNTIME_WARNING,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS,
  GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE
} from "./dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract";
import {
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Q = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  selectionStatus: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_Q_SURFACES = [
  "packages/shared/src/domain/airborne-context.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md",
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

const OPENING_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

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

describe("Personal-Use MVP Coverage Sprint Gate Q opening/leak composite transmission-loss input contract", () => {
  it("lands Gate Q as a first-class input contract and selects the formula corridor next", () => {
    const contract = buildGateQOpeningLeakCompositeInputContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Q).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts",
      selectionStatus:
        "gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      landedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
      noRuntimeWarning: GATE_Q_OPENING_LEAK_COMPOSITE_NO_RUNTIME_WARNING,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
      previousSelectionStatus: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
      requiredOwnerInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
      requiredPhysicalInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS,
      routeCardValueChange: false,
      runtimePromotionAllowedInGateQ: false,
      selectedNextAction: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
      selectionStatus: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract.basisBoundariesPreserved).toEqual({
      doorOrWindowRowsDoNotReplaceHostWall: true,
      hostWallCandidatePrecedence: true,
      labFieldBuildingSeparation: true,
      leakagePenaltyRequiresExplicitSealInput: true
    });

    for (const path of REQUIRED_GATE_Q_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("accepts complete opening fields as schema-owned input but keeps runtime parked", () => {
    const parsed = AirborneContextSchema.parse(COMPLETE_OPENING_CONTEXT);
    const assessment = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: parsed,
      openingRouteRequested: true,
      scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
      targetOutputs: OPENING_OUTPUTS
    });
    const ownedAssessment = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: parsed,
      openingRouteRequested: true,
      owners: {
        compositeAreaTransmissionLossEnergyFormulaOwner: true,
        hostWallCandidateBoundaryOwner: true,
        openingLeakagePenaltyFormulaOwner: true,
        openingOriginPolicyOwner: true
      },
      scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
      targetOutputs: OPENING_OUTPUTS
    });

    expect(assessment).toMatchObject({
      blockedOutputs: ["Rw", "STC", "R'w", "DnT,w"],
      effectiveOpeningAreaM2: 1.8,
      hostileInputBoundaries: [],
      missingPhysicalInputs: [],
      openingCount: 1,
      requestedOutputs: ["Rw", "STC", "R'w", "DnT,w"],
      runtimePromotionAllowedInGateQ: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "ready_for_formula_corridor"
    });
    expect(assessment.missingOwnerInputs).toEqual([
      "hostWallCandidateBoundaryOwner",
      "compositeAreaTransmissionLossEnergyFormulaOwner",
      "openingLeakagePenaltyFormulaOwner",
      "openingOriginPolicyOwner"
    ]);
    expect(ownedAssessment.missingOwnerInputs).toEqual([]);
  });

  it("names the exact missing physical fields instead of defaulting small openings or good seals", () => {
    const missingEverything = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: { contextMode: "element_lab" },
      openingRouteRequested: true,
      scenarioId: "gate_q_missing_host_wall_and_opening_fields_needs_input",
      targetOutputs: ["Rw", "STC"]
    });
    const unknownBasisAndSeal = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1.2,
            count: 1,
            elementRwDb: 30,
            id: "window-unknown",
            origin: "source_absent",
            ratingBasis: "unknown",
            sealLeakageClass: "unknown"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_unknown_rating_and_seal_needs_input",
      targetOutputs: ["Rw"]
    });

    expect(missingEverything.status).toBe("needs_input");
    expect(missingEverything.missingPhysicalInputs).toEqual([
      "hostWallAreaM2",
      "openingAreaM2",
      "openingElementRwDb",
      "openingRatingBasis",
      "openingSealLeakageClass",
      "openingCount",
      "openingOrigin"
    ]);
    expect(unknownBasisAndSeal.status).toBe("needs_input");
    expect(unknownBasisAndSeal.missingPhysicalInputs).toEqual([
      "openingRatingBasis",
      "openingSealLeakageClass"
    ]);
  });

  it("rejects hostile opening inputs while preserving safe reorder invariance", () => {
    const excessiveArea = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 2,
        openingLeakElements: [
          {
            areaM2: 3,
            count: 1,
            elementRwDb: 30,
            id: "too-large",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_excessive_opening_area_invalid",
      targetOutputs: ["Rw"]
    });
    const duplicateOpenings = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] },
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_duplicate_openings_invalid",
      targetOutputs: ["Rw"]
    });
    const zeroArea = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 0,
            count: 1,
            elementRwDb: 30,
            id: "zero",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_excessive_opening_area_invalid",
      targetOutputs: ["Rw"]
    });
    const ordered = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 20,
        openingLeakElements: REORDERED_OPENINGS
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
      targetOutputs: ["Rw"]
    });
    const reversed = buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 20,
        openingLeakElements: [...REORDERED_OPENINGS].reverse()
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
      targetOutputs: ["Rw"]
    });

    expect(excessiveArea).toMatchObject({
      hostileInputBoundaries: ["openingAreaExceedsHostWallArea"],
      status: "invalid_input"
    });
    expect(duplicateOpenings.hostileInputBoundaries).toEqual([
      "duplicateOpeningId",
      "duplicateOpeningSignature"
    ]);
    expect(duplicateOpenings.status).toBe("invalid_input");
    expect(zeroArea.hostileInputBoundaries).toEqual(["nonPositiveOpeningArea"]);
    expect(zeroArea.status).toBe("invalid_input");
    expect(reversed.normalizedOpeningKeys).toEqual(ordered.normalizedOpeningKeys);
    expect(reversed.effectiveOpeningAreaM2).toBe(ordered.effectiveOpeningAreaM2);
  });

  it("keeps Gate Q no-runtime while later Gate S owns opening runtime movement and boundaries", () => {
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
    const manyLayerHostWithOpening = calculateAssembly(
      Array.from({ length: 6 }).flatMap(() => HOST_WALL),
      {
        airborneContext: COMPLETE_OPENING_CONTEXT,
        calculator: "dynamic",
        targetOutputs: ["Rw", "STC"]
      }
    );

    expect(withOpening.metrics.estimatedRwDb).toBe(38.2);
    expect(withOpening.metrics.estimatedStc).toBe(39);
    expect(withOpening.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(withOpening.unsupportedTargetOutputs).toEqual([]);
    expect(withOpening.airborneBasis?.method).toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(withOpening.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
    expect(buildingWithOpening.supportedTargetOutputs).toEqual([]);
    expect(buildingWithOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildingWithOpening.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(buildingWithOpening.metrics.estimatedDnTwDb).toBeUndefined();
    expect(buildingWithOpening.warnings).toContain(
      GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
    );
    expect(Number.isFinite(manyLayerHostWithOpening.metrics.estimatedRwDb)).toBe(true);
  });

  it("keeps docs and the current-gate runner aligned with Gate Q closeout and Gate R selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN);
      expect(content).toContain(GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS);
      expect(content).toContain(GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts"
    );
    expect(readRepoFile("docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md")).toContain(
      GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE
    );
  });
});
