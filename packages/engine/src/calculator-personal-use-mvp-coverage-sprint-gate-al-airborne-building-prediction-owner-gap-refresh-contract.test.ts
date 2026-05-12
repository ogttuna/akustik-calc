import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ak";
import {
  buildPersonalUseMvpCoverageSprintGateALContract,
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAMLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import type { PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
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

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AL = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AL_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak.ts",
  "packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_HANDOFF.md"
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

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing scenario row ${id}`);
  }

  return row;
}

describe("Personal-Use MVP Coverage Sprint Gate AL airborne building-prediction owner gap refresh", () => {
  it("lands Gate AL as no-runtime owner-gap refresh and selects direct curve ownership next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateALContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AL).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts",
      selectionStatus:
        "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_landed_no_runtime_selected_direct_curve_owner_gate_am",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      buildingEvidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      gateAKMatrixRows: 40,
      gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned",
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS,
      runtimePromotionAllowedInGateAL: false,
      runtimeValueMovement: false,
      selectedGateAMLane: "direct_separating_element_curve_owner_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AL_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("maps every Gate O/P building formula term to a runtime-unowned owner gap", () => {
    const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();

    expect(ownerGaps.map((gap) => gap.ownerId)).toEqual([
      "direct_separating_element_frequency_curve",
      "flanking_path_energy_sum",
      "junction_vibration_reduction_index",
      "room_absorption_standardization",
      "building_prediction_uncertainty_budget"
    ]);
    expect(
      ownerGaps.every(
        (gap) =>
          gap.gateODesignTermDefined &&
          gap.requiredBeforeBuildingRuntime &&
          gap.runtimeOwnedInGateAL === false &&
          gap.sourceRowsRequiredForRuntimeSelection === false &&
          gap.gatePBlocker.length > 50
      )
    ).toBe(true);
    expect(ownerGaps[0]).toMatchObject({
      blockedAliasBoundaries: [
        "field_runtime_budget_alias_blocked",
        "lab_rw_stc_single_number_alias_blocked",
        "opening_leak_lab_adapter_alias_blocked",
        "source_single_number_without_curve_alias_blocked"
      ],
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      ownerId: "direct_separating_element_frequency_curve",
      requiredInputs: ["selectedDynamicAirborneCurve", "ISO717-1 rating adapter"]
    });
  });

  it("keeps complete and partial building-prediction requests parked without numeric aliases", () => {
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
    const matrixRows = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix();
    const partialMatrixRow = byId(matrixRows, "wall.building_prediction_partial_context.needs_input");

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
    expect(partialMatrixRow.currentPosture).toBe("needs_input");
    expect(partialMatrixRow.runtime.supportedTargetOutputs).toEqual([]);
    expect(partialMatrixRow.runtime.valuePins).toEqual([]);
  });

  it("preserves field, lab, opening/leak, and source-single-number alias boundaries", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateALContract();
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

    expect(contract.aliasBoundariesPreserved).toEqual({
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      openingLeakLabAdapter: true,
      sourceSingleNumberWithoutCurve: true
    });

    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics.estimatedRwPrimeDb).toBeGreaterThan(0);
    expect(field.metrics.estimatedDnTwDb).toBeGreaterThan(0);

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
  });

  it("ranks Gate AM direct curve ownership ahead of flanking, runtime promotion, and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAMLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "direct_separating_element_curve_owner_contract",
      score: 8,
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
        id: "direct_separating_element_curve_owner_contract",
        score: 8,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "flanking_path_energy_owner_contract",
        score: 1.1,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "junction_vibration_reduction_owner_contract",
        score: 1.4,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "room_standardization_owner_contract",
        score: 2.4,
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
      "keep Gate AL no-runtime: owner-gap mapping does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select the first prerequisite owner needed by every building energy path before flanking or runtime work",
      "reject broad source crawling and direct runtime promotion while any Gate AL owner gap is unowned"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AL closeout and Gate AM selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE);
      expect(content, path).toContain("building prediction owner gap");
      expect(content, path).toContain("direct separating-element frequency curve");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts"
    );
  });
});
