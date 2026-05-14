import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV4,
  buildCompanyInternalCalculationGradeMainlineMatrixV4Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_MISSING_CI_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
  rankCompanyInternalCalculationGradeV4NextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV4
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_V4_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix v4 row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix v4 refresh", () => {
  it("lands matrix v4 after steel L'nT,50 surface parity and selects opening/leak building adapter next", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixV4Contract()).toEqual({
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
      matrixRows: 62,
      newRuntimeBehaviorChangeInRefresh: false,
      previousMatrixRows: 60,
      previousSurfaceParityLandedGate:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE,
      previousSurfaceParitySelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      previousSurfaceParitySelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE,
      previousSurfaceParitySelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS,
      promotedSteelLnt50RowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_V4_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix with steel L'nT,50 runtime and no hidden screening origins", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV4();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV4(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(62);
    for (const retired of COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS) {
      expect(rowIds).not.toContain(retired);
    }
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        "floor.lightweight_steel_suspended_ceiling_lnt50_missing_ci.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ]),
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
      ],
      failureClassCounts: {
        basis_boundary: 5,
        correct_block: 13,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 37,
        unsupported_metric: 3
      },
      hiddenScreeningOriginRowIds: [],
      importedSteelLnt50RowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS],
      noRuntimeValueMovementInRefresh: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      promotedSteelLnt50RowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
      remainingCalculationGradeBlockerRowIds: [
        "wall.opening_leak_composite_building_boundary.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS],
      routeCoverage: ["wall", "floor"],
      rowCount: 62,
      selectedLane: "opening_leak_building_adapter_owner_contract",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE
    });
  });

  it("records landed steel L'nT,50 as supported calculation-grade matrix evidence", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV4();
    const lnt50 = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID);

    expect(lnt50).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_steel_suspended_ceiling_low_frequency_lnt50_field_adapter",
      requestedMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      runtime: {
        basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        errorBudgetDb: 7,
        missingPhysicalInputs: [],
        origin: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        selectedMethod: "formula_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(lnt50)).toEqual({
      "DeltaLw": 22.4,
      "L'n,w": 54.6,
      "L'nT,50": 50.8,
      "L'nT,w": 51.8,
      "Ln,w": 51.6
    });
    expect(lnt50.toleranceOrErrorBudget).toContain("L'nT,50 +/-7 dB");
    expect(lnt50.valueOrBlockedReason).toContain("CI,50-2500 -1");
  });

  it("keeps missing CI, ASTM, and exact-field precedence as separate boundaries", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV4();
    const missingCi = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_MISSING_CI_ROW_ID);
    const exactField = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID);
    const astm = byId(rows, "floor.lightweight_steel_suspended_ceiling_astm.unsupported");

    expect(missingCi).toMatchObject({
      basis: "field_apparent",
      failureClass: "basis_boundary",
      inputCompleteness: "partial",
      originSupportBucket: "low_frequency_ci50_2500_owner_missing",
      runtime: {
        errorBudgetDb: 5.5,
        supportedTargetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
        unsupportedTargetOutputs: ["L'nT,50"]
      }
    });
    expect(values(missingCi)).toEqual({
      "DeltaLw": 22.4,
      "L'n,w": 54.6,
      "L'nT,w": 51.8,
      "Ln,w": 51.6
    });
    expect(missingCi.valueOrBlockedReason).toContain("CI,50-2500");

    expect(exactField).toMatchObject({
      basis: "field_apparent",
      currentPosture: "exact",
      failureClass: "none",
      runtime: {
        basisId: "exact_source_band_curve_iso7172",
        errorBudgetDb: null,
        publicEntryPoint: "calculateImpactOnly",
        supportedTargetOutputs: ["L'nT,50"],
        unsupportedTargetOutputs: []
      },
      toleranceOrErrorBudget: "exact_field_band_curve_no_source_absent_budget"
    });
    expect(values(exactField)).toEqual({ "L'nT,50": 55 });

    expect(astm).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
  });

  it("ranks opening/leak building adapter ahead of building prediction, ASTM, and source crawl work", () => {
    const selection = rankCompanyInternalCalculationGradeV4NextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "opening_leak_building_adapter_owner_contract",
      score: 4.7,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "record the landed steel suspended-ceiling L'nT,50 runtime before selecting another runtime lane",
      "keep missing CI,50-2500 and exact field-band precedence as separate matrix rows",
      "prefer the next ISO wall/floor calculator gap over ASTM IIC/AIIC while the mainline remains ISO-first",
      "do not choose broad source crawling when a bounded source-absent adapter can increase calculator coverage"
    ]);
  });

  it("keeps docs and current-gate runner aligned with matrix v4 closeout and opening/leak selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE);
      expect(content, path).toContain("L'nT,50 50.8");
      expect(content, path).toContain("opening/leak");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts"
    );
  });
});
