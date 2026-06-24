import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateASContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-as";
import {
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAULanes,
  summarizePersonalUseMvpCoverageSprintGateAT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AT = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
  matrixRows: 41,
  matrixRowsAddedAtGateAT: 1,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AT_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar.ts",
  "apps/web/features/workbench/airborne-building-prediction-surface.ts",
  "apps/web/features/workbench/airborne-building-prediction-surface-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_HANDOFF.md"
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

describe("Personal-Use MVP Coverage Sprint Gate AT acceptance matrix refresh after building prediction", () => {
  it("lands Gate AT as a no-runtime acceptance matrix refresh and selects Gate AU release handoff", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AT).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan",
      matrixRows: 41,
      matrixRowsAddedAtGateAT: 1,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan",
      previousSelectionStatus:
        "gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_landed_selected_acceptance_matrix_gate_at",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_au_personal_use_mvp_daily_use_release_handoff_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts",
      selectionStatus:
        "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_landed_selected_daily_use_release_handoff_gate_au",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the daily-use matrix after Gate AS without stale building unsupported ids or coverage gaps", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateAT(rows);

    expect(buildPersonalUseMvpCoverageSprintGateASContract()).toMatchObject({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS
    });
    expect(rows).toHaveLength(41);
    expect(rows.map((row) => row.id)).not.toContain("wall.complete_building_prediction.unsupported");
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "bounded_screening", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      dailyUseAcceptanceMatrixReadyForReleaseHandoff: true,
      dailyUseReleaseBlockerIds: [],
      gapFreeAfterGateAT: true,
      matrixRowsAddedAtGateAT: 1,
      matrixRowsRenamedAtGateAT: [
        {
          from: "wall.complete_building_prediction.unsupported",
          to: "wall.complete_building_prediction.runtime"
        }
      ],
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS,
      remainingCoverageGapRowIds: [],
      retiredStaleRowIds: ["wall.complete_building_prediction.unsupported"],
      routeCoverage: ["wall", "floor"],
      rowCount: 41,
      selectedGateAULane: "daily_use_release_handoff",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 0,
      correct_block: 10,
      coverage_gap: 0,
      hostile_input_refusal: 3,
      none: 27,
      unsupported_metric: 1
    });
  });

  it("pins complete building prediction runtime and broad-target lab companions", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();
    const completeBuilding = byId(rows, "wall.complete_building_prediction.runtime");
    const broadAlias = byId(rows, "wall.complete_building_prediction_broad_targets.alias_boundary");

    expect(completeBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
      runtime: {
        basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD,
        errorBudgetDb: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: []
      },
      toleranceOrErrorBudget: "gate_aq_plus_minus_9_db_source_absent_budget_not_measured"
    });
    expect(values(completeBuilding)).toEqual({ "R'w": 58, "DnT,w": 59 });

    expect(broadAlias).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      hostileVariant: "lab_rw_stc_requested_beside_building_metrics",
      requestedMetrics: ["Rw", "STC", "R'w", "DnT,w"],
      runtime: {
        basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD,
        errorBudgetDb: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC", "R'w", "DnT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(broadAlias)).toEqual({ Rw: 60, STC: 60, "R'w": 58, "DnT,w": 59 });
  });

  it("keeps partial building, opening/building, ASTM, hostile-layer, and exact-source boundaries explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateAT(rows);
    const partialBuilding = byId(rows, "wall.building_prediction_partial_context.needs_input");
    const openingBuilding = byId(rows, "wall.opening_leak_composite_building_boundary.unsupported");
    const astmBoundary = byId(rows, "floor.astm_iic_aiic_boundary.unsupported");
    const exactSteel = byId(rows, "floor.lightweight_steel_exact_source_precedence.lab");
    const manyLayer = byId(rows, "floor.many_layer_stress_exact_stable");

    expect(summary.partialBuildingPredictionRowIds).toEqual([
      "wall.building_prediction_partial_context.needs_input"
    ]);
    expect(summary.aliasNegativeRowIds).toEqual([
      "floor.astm_iic_aiic_boundary.unsupported"
    ]);
    expect(summary.hostileLayerEditRowIds).toEqual([
      "wall.grouped_triple_leaf_safe_reverse_order.lab",
      "wall.flat_multicavity_many_layer_schedule.needs_input",
      "floor.heavy_concrete_floating_floor_safe_reorder.lab",
      "floor.many_layer_stress_exact_stable"
    ]);
    expect(summary.exactSourcePrecedenceRowIds).toEqual([
      "floor.lightweight_steel_exact_source_precedence.lab"
    ]);
    expect(summary.openingLeakBoundaryRowIds).toEqual([
      "wall.opening_leak_composite.lab",
      "wall.opening_leak_two_openings.lab",
      "wall.opening_leak_stc_target.lab",
      "wall.opening_leak_duplicate_id.refused",
      "wall.opening_leak_composite_building_boundary.unsupported"
    ]);

    expect(partialBuilding).toMatchObject({
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
    expect(openingBuilding).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
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
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
    expect(exactSteel.currentPosture).toBe("exact");
    expect(exactSteel.runtime.supportedTargetOutputs).toContain("Ln,w");
    expect(manyLayer.runtime.valuePins.length).toBeGreaterThan(0);
  });

  it("selects daily-use release handoff ahead of post-release accuracy and adapter work", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAULanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "daily_use_release_handoff",
      score: 1.7,
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
        id: "daily_use_release_handoff",
        score: 1.7,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "budget_tightening_and_calibration_phase",
        score: 0.3,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      },
      {
        id: "opening_leak_building_adapter_after_release",
        score: 0.3,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "astm_iic_aiic_adapter_after_release",
        score: 0.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      }
    ]);
    expect(selection.selectionPolicy).toContain(
      "select release handoff only when the matrix has no coverage gaps or release blockers"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate AT closeout and Gate AU selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE);
      expect(content, path).toContain("acceptance matrix refresh");
      expect(content, path).toContain("daily-use release handoff");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts"
    );
  });
});
