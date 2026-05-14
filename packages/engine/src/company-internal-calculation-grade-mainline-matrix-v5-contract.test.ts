import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV5,
  buildCompanyInternalCalculationGradeMainlineMatrixV5Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS,
  rankCompanyInternalCalculationGradeV5NextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV5
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_V5_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix v5 row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix v5 refresh", () => {
  it("lands matrix v5 after opening/leak input surface and selects the A-weighted owner next", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixV5Contract()).toEqual({
      importedOpeningLeakFieldBuildingRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS],
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
      matrixRows: 65,
      newRuntimeBehaviorChangeInRefresh: false,
      previousInputSurfaceLandedGate: "company_internal_opening_leak_building_input_surface_plan",
      previousInputSurfaceSelectedNextAction:
        "company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan",
      previousInputSurfaceSelectedNextFile:
        "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts",
      previousInputSurfaceSelectionStatus:
        "company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh",
      previousMatrixRows: 62,
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_V5_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix with opening/leak field/building runtime and no hidden screening origins", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV5();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV5(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(65);
    for (const retired of COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS) {
      expect(rowIds).not.toContain(retired);
    }
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
        "wall.building_prediction_partial_context.needs_input",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported"
      ]),
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_lnt50_exact_field_precedence.field"
      ],
      failureClassCounts: {
        basis_boundary: 4,
        correct_block: 14,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 39,
        unsupported_metric: 4
      },
      hiddenScreeningOriginRowIds: [],
      importedOpeningLeakFieldBuildingRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS],
      noRuntimeValueMovementInRefresh: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      promotedOpeningLeakBuildingRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID,
      promotedOpeningLeakFieldRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID,
      remainingCalculationGradeBlockerRowIds: [
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
        "wall.building_prediction_partial_context.needs_input",
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS],
      routeCoverage: ["wall", "floor"],
      rowCount: 65,
      selectedLane: "opening_leak_a_weighted_spectrum_adapter_owner",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE
    });
  });

  it("records supported opening/leak field and building runtime rows by value, basis, and budget", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV5();
    const field = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID);
    const building = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID);

    expect(field).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_opening_leak_field_area_energy_runtime_corridor",
      requestedMetrics: ["R'w", "Dn,w", "DnT,w"],
      runtime: {
        basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
        errorBudgetDb: 8,
        missingPhysicalInputs: [],
        selectedMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(field)).toEqual({
      "Dn,w": 36.7,
      "DnT,w": 36.9,
      "R'w": 36.4
    });

    expect(building).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_opening_leak_building_area_energy_runtime_corridor",
      requestedMetrics: ["R'w", "DnT,w"],
      runtime: {
        basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
        errorBudgetDb: 10,
        missingPhysicalInputs: [],
        selectedMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(building)).toEqual({
      "DnT,w": 32.1,
      "R'w": 31.6
    });
  });

  it("keeps A-weighted, missing-owner, ASTM, and stale opening/building boundaries explicit", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV5();
    const rowIds = rows.map((row) => row.id);
    const aWeighted = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID);
    const missingOwner = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID);

    expect(rowIds).not.toContain("wall.opening_leak_composite_building_boundary.unsupported");
    expect(aWeighted).toMatchObject({
      basis: "field_apparent",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      inputCompleteness: "complete",
      nextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Dn,A", "DnT,A"],
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Dn,A", "DnT,A"],
        valuePins: []
      }
    });
    expect(aWeighted.valueOrBlockedReason).toContain("A-weighted spectrum adapter");

    expect(missingOwner).toMatchObject({
      basis: "building_prediction",
      currentPosture: "needs_input",
      failureClass: "correct_block",
      inputCompleteness: "partial",
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: ["sourceRoomVolumeM3"],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["R'w", "DnT,w"],
        valuePins: []
      }
    });
    expect(missingOwner.valueOrBlockedReason).toContain("sourceRoomVolumeM3");
  });

  it("ranks the opening/leak A-weighted owner ahead of building-prediction prompts, ASTM, and broad source crawl", () => {
    const selection = rankCompanyInternalCalculationGradeV5NextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "opening_leak_a_weighted_spectrum_adapter_owner",
      score: 4.5,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "astm_iic_aiic_parked_boundary")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "record the landed opening/leak field/building input surface before selecting another runtime lane",
      "retire stale opening/leak field/building unsupported rows only after supported field and building rows are pinned",
      "keep A-weighted opening/leak outputs unsupported until a spectrum-adapter owner exists",
      "keep ASTM IIC/AIIC parked unless a later active plan explicitly reselects ASTM",
      "do not choose broad source crawling when a bounded source-absent adapter can increase calculator coverage"
    ]);
  });

  it("keeps docs and current-gate runner aligned with matrix v5 closeout and next selected lane", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE);
      expect(content, path).toContain("R'w 36.4");
      expect(content, path).toContain("DnT,w 32.1");
      expect(content, path).toContain("Dn,A");
      expect(content, path).toContain("DnT,A");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts"
    );
  });
});
