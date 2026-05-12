import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateARContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ar";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aq";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const REQUIRED_GATE_AR_SURFACES = [
  "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne.ts",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AR airborne building-prediction all-owner runtime corridor", () => {
  it("lands Gate AR as the all-owner runtime corridor and selects Gate AS surface parity", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateARContract();

    expect(contract).toEqual({
      acceptedRequirementIds: [
        "direct_dynamic_airborne_curve_owner",
        "flanking_path_energy_overlay_owner",
        "junction_class_and_coupling_length_owner",
        "room_standardization_owner",
        "gate_aq_uncertainty_budget_owner",
        "basis_compatible_building_metric_scope",
        "visible_not_measured_posture"
      ],
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      completeBuildingRuntimePromotionAllowed: true,
      exactMeasuredRowsRemainPrecedence: true,
      gateNReadyStatus: "ready_for_formula_corridor",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
      metricRuntimes: [
        {
          errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
          method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
          metricId: "R'w",
          notMeasuredEvidence: true,
          origin: "family_physics_prediction",
          sourceAbsent: true
        },
        {
          errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
          method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
          metricId: "DnT,w",
          notMeasuredEvidence: true,
          origin: "family_physics_prediction",
          sourceAbsent: true
        }
      ],
      negativeBoundaryIds: [
        "partial_building_context_stays_needs_input",
        "field_between_rooms_stays_gate_i",
        "element_lab_stays_lab_family_route",
        "opening_leak_building_adapter_stays_blocked",
        "lab_rw_stc_source_single_number_alias_blocked",
        "stc_iic_wrong_basis_alias_blocked"
      ],
      numericRuntimeBehaviorChange: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_PREVIOUS_SELECTION_STATUS,
      runtimeMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      supportedRuntimeOutputs: ["R'w", "DnT,w"]
    });

    for (const path of REQUIRED_GATE_AR_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete lined massive building R'w and DnT,w with the Gate AQ +/-9 dB budget", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwPrimeDb).toBe(58);
    expect(result.metrics.estimatedDnTwDb).toBe(59);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      kind: "airborne_physics_prediction",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneBasis?.missingSourceEvidence).toEqual([
      "same_building_source_owned_RwPrime_DnTw_holdouts_absent"
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneOverlay?.fieldFlankingPenaltyApplied).toBe(true);
    expect(result.airborneOverlay?.contextMode).toBe("building_prediction");
    expect(result.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    expect(result.warnings).not.toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("also promotes source-absent complete CLT building output without aliasing lab Rw", () => {
    const result = calculateAssembly(CLT_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwPrimeDb).toBeGreaterThan(0);
    expect(result.metrics.estimatedDnTwDb).toBeGreaterThan(0);
    expect(result.metrics.estimatedRwPrimeDb).toBeLessThanOrEqual(result.metrics.estimatedRwDb ?? 95);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions.join(" ")).toContain("not measured evidence");
  });

  it("keeps partial building context as needs_input with exact missing physical fields", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(result.metrics.estimatedDnTwDb).toBeUndefined();
    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
  });

  it("keeps opening/leak building outputs blocked until a dedicated building adapter owns them", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: OPENING_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(result.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(result.metrics.estimatedDnTwDb).toBeUndefined();
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_unsupported",
      selectedOrigin: "unsupported"
    });
    expect(result.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("preserves field and lab route separation", () => {
    const field = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });
    const lab = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("keeps docs and current-gate runner aligned with Gate AR and Gate AS", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE);
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts"
    );
  });
});
