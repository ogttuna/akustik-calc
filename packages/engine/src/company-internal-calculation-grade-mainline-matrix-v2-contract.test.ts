import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV2,
  buildCompanyInternalCalculationGradeMainlineMatrixV2Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
  rankCompanyInternalCalculationGradeV2NextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV2
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS
} from "./company-internal-airborne-building-prediction-runtime-terms-owner-contract";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import { STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS } from "./steel-floor-formula-input-surface";
import { STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_V2_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts",
  "packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RECONCILIATION_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix v2 row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix v2 refresh", () => {
  it("lands matrix v2 after building reconciliation and selects steel DeltaLw numeric runtime", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixV2Contract()).toEqual({
      buildingRuntimeRowsImportedFromGateAT: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS],
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE,
      matrixRows: 60,
      newRuntimeBehaviorChangeInRefresh: false,
      previousMatrixRows: 61,
      reclassifiedOriginRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      steelDeltaLwOwnerRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID
    });
    expect(COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS).toContain(
      "landed_selected_matrix_v2_refresh"
    );
    expect(COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE
    );
    expect(COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE).toContain(
      "company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts"
    );

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_V2_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix without stale building rows or hidden screening origins", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV2();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV2(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(60);
    for (const retired of COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS) {
      expect(rowIds).not.toContain(retired);
    }
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
        "wall.building_prediction_partial_context.needs_input"
      ]),
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      failureClassCounts: {
        basis_boundary: 5,
        correct_block: 14,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 34,
        unsupported_metric: 3
      },
      hiddenScreeningOriginRowIds: [],
      importedBuildingRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS],
      noNewRuntimeValueMovement: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      reclassifiedOriginRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS],
      remainingCalculationGradeBlockerRowIds: [
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
      ],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS],
      routeCoverage: ["wall", "floor"],
      rowCount: 60,
      selectedLane: "steel_suspended_ceiling_delta_lw_runtime_corridor",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE
    });
  });

  it("imports complete and partial Gate AT building-prediction rows into the company matrix", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV2();
    const complete = byId(rows, "wall.complete_building_prediction.runtime");
    const broad = byId(rows, "wall.complete_building_prediction_broad_targets.alias_boundary");
    const partial = byId(rows, "wall.building_prediction_partial_context.needs_input");

    expect(complete).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(complete)).toEqual({ "R'w": 58, "DnT,w": 59 });

    expect(broad).toMatchObject({
      failureClass: "basis_boundary",
      requestedMetrics: ["Rw", "STC", "R'w", "DnT,w"],
      runtime: {
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: ["Rw", "STC"]
      }
    });
    expect(values(broad)).toEqual({ "R'w": 58, "DnT,w": 59 });

    expect(partial).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        errorBudgetDb: null,
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: [],
        valuePins: []
      }
    });
    expect(partial.runtime.missingPhysicalInputs.length).toBeGreaterThan(0);
  });

  it("keeps steel DeltaLw as a precise owner prompt and normalizes the heavy-floating matrix origin", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV2();
    const steelDelta = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID);
    const heavyFloating = byId(rows, "floor.heavy_concrete_floating_floor.lab");

    expect(steelDelta).toMatchObject({
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        basisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
        errorBudgetDb: null,
        missingPhysicalInputs: [...STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS],
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["DeltaLw"],
        valuePins: []
      }
    });

    expect(heavyFloating).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        origin: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        selectedMethod: "formula_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(heavyFloating)).toEqual({ "Ln,w": 44.9, DeltaLw: 26.9 });
  });

  it("ranks steel suspended-ceiling DeltaLw runtime ahead of low-frequency, opening/building, and source crawl work", () => {
    const selection = rankCompanyInternalCalculationGradeV2NextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "steel_suspended_ceiling_delta_lw_runtime_corridor",
      score: 8,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "import accepted building-prediction runtime rows before adding new building formulas",
      "keep DeltaLw owner prompts as needs_input until upper/reference package inputs are complete",
      "fail any complete company-internal row that still exposes screening_fallback origin",
      "prefer the now-owned steel suspended-ceiling DeltaLw runtime over broad source crawling"
    ]);
  });

  it("keeps docs and current-gate runner aligned with matrix v2 closeout and next runtime selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE);
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts"
    );
  });
});
