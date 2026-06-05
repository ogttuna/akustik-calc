import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_PREVIOUS_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateALLanes,
  summarizePersonalUseMvpCoverageSprintGateAK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ak";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AK = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE,
  matrixRows: 40,
  matrixRowsAddedAtGateAK: 0,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_PREVIOUS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  stcAwareMatrixRefresh: true,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AK_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AJ_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_HANDOFF.md"
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

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate AK coverage matrix refresh after opening/leak STC", () => {
  it("lands Gate AK as a no-runtime STC-aware matrix refresh and selects Gate AL", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AK).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan",
      matrixRows: 40,
      matrixRowsAddedAtGateAK: 0,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts",
      selectionStatus:
        "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al",
      sourceRowsRequiredForRuntimeSelection: false,
      stcAwareMatrixRefresh: true,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AK_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the Gate AA 40-row matrix intact and gap-free after STC surface refresh", () => {
    const gateAARows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const gateAKRows = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateAK(gateAKRows);

    expect(gateAKRows.map((row) => row.id)).toEqual(gateAARows.map((row) => row.id));
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      gapFreeAfterGateAK: true,
      matrixRowsAddedAtGateAK: 0,
      numericRuntimeValueMovement: false,
      openingLeakStcAwareRowIds: [
        "wall.opening_leak_composite.lab",
        "wall.opening_leak_two_openings.lab",
        "wall.opening_leak_stc_target.lab",
        "wall.opening_leak_duplicate_id.refused"
      ],
      remainingCoverageGapRowIds: [],
      routeCoverage: ["wall", "floor"],
      rowCount: 40,
      selectedGateALLane: "airborne_building_prediction_owner_gap_refresh",
      selectedNextAction: "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan",
      stcAwareMatrixRefresh: true
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 0,
      correct_block: 10,
      coverage_gap: 0,
      hostile_input_refusal: 3,
      none: 26,
      unsupported_metric: 1
    });

    for (const row of gateAKRows) {
      for (const pin of row.runtime.valuePins) {
        expect(row.runtime.supportedTargetOutputs, `${row.id}:${pin.metric}`).toContain(pin.metric);
      }
    }
  });

  it("preserves the STC-aware opening/leak supported rows by value, basis, and budget", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix();
    const openingComplete = byId(rows, "wall.opening_leak_composite.lab");
    const openingTwo = byId(rows, "wall.opening_leak_two_openings.lab");
    const openingStcOnly = byId(rows, "wall.opening_leak_stc_target.lab");
    const duplicateOpening = byId(rows, "wall.opening_leak_duplicate_id.refused");

    expect(openingComplete).toMatchObject({
      currentPosture: "family_physics",
      originSupportBucket: "source_absent_opening_area_energy_formula",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC"],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
    expect(values(openingComplete)).toEqual({ Rw: 38.2, STC: 39 });

    expect(openingTwo).toMatchObject({
      currentPosture: "family_physics",
      originSupportBucket: "source_absent_opening_leak_area_energy_family_physics",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        errorBudgetDb: 6,
        supportedTargetOutputs: ["Rw", "STC"],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
    expect(values(openingTwo)).toEqual({ Rw: 33.7, STC: 34 });

    expect(openingStcOnly).toMatchObject({
      currentPosture: "family_physics",
      originSupportBucket: "source_absent_opening_leak_stc_spectrum_adapter",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        errorBudgetDb: 6,
        supportedTargetOutputs: ["STC"],
        unsupportedTargetOutputs: [],
        valuePins: [{ metric: "STC", value: 39 }]
      }
    });
    expect(values(openingStcOnly)).toEqual({ STC: 39 });

    expect(duplicateOpening).toMatchObject({
      currentPosture: "unsupported",
      failureClass: "hostile_input_refusal",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "STC"],
        valuePins: []
      }
    });
  });

  it("keeps building, field/building opening, ASTM, and partial-owner negatives budget-free", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix();
    const partialBuilding = byId(rows, "wall.building_prediction_partial_context.needs_input");
    const completeBuilding = byId(rows, "wall.complete_building_prediction.unsupported");
    const openingBuilding = byId(rows, "wall.opening_leak_composite_building_boundary.unsupported");
    const astmBoundary = byId(rows, "floor.astm_iic_aiic_boundary.unsupported");

    expect(partialBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: [
          "sourceRoomVolumeM3",
          "flankingJunctionClass",
          "conservativeFlankingAssumption",
          "junctionCouplingLengthM",
          "buildingPredictionOutputBasis"
        ],
        supportedTargetOutputs: [],
        valuePins: []
      }
    });

    expect(completeBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      nextAction: "airborne_building_prediction_surface_parity",
      runtime: {
        basisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
        missingPhysicalInputs: [],
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: [],
        valuePins: [
          { metric: "R'w", value: 58 },
          { metric: "DnT,w", value: 59 }
        ]
      }
    });

    expect(openingBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: "company_internal_opening_leak_building_area_energy_runtime_corridor",
        errorBudgetDb: 10,
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: ["Rw", "STC"],
        valuePins: [
          { metric: "R'w", value: 31.6 },
          { metric: "DnT,w", value: 32.1 }
        ]
      }
    });

    expect(astmBoundary).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
  });

  it("selects the building-prediction owner gap refresh ahead of ASTM, field/building adapters, and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateALLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "airborne_building_prediction_owner_gap_refresh",
      score: 4.2,
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
        id: "airborne_building_prediction_owner_gap_refresh",
        score: 4.2,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "opening_leak_field_or_building_adapter_boundary",
        score: 1.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "astm_iic_aiic_rating_adapter_boundary",
        score: 1.5,
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
    expect(selection.candidates.map((candidate) => candidate.id)).not.toContain("opening_leak_stc_spectrum_adapter");
    expect(selection.selectionPolicy).toEqual([
      "treat Gate AK as a no-runtime STC-aware matrix refresh after opening/leak Rw and STC landed",
      "score user_frequency * blocked_or_unsupported_evidence * solver_readiness / (implementation_cost + basis_leakage_risk + 1)",
      "prefer calculator-first owner gaps over broad source crawling",
      "do not promote building, field, or ASTM outputs from lab opening/leak or ISO impact values"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AK closeout and Gate AL selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE);
      expect(content, path).toContain("STC-aware matrix refresh");
      expect(content, path).toContain("building prediction owner gap");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts"
    );
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/airborne-building-prediction-boundary.test.ts");
    expect(runner).toContain("features/workbench/opening-leak-composite-surface-parity.test.ts");
  });
});
