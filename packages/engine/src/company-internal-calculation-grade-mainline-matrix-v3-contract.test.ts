import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV3,
  buildCompanyInternalCalculationGradeMainlineMatrixV3Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
  rankCompanyInternalCalculationGradeV3NextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV3
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_V3_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix v3 row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix v3 refresh", () => {
  it("lands matrix v3 after steel DeltaLw surface parity and selects low-frequency ownership next", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixV3Contract()).toEqual({
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
      matrixRows: 60,
      newRuntimeBehaviorChangeInRefresh: false,
      previousMatrixRows: 60,
      previousSurfaceParityLandedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE,
      previousSurfaceParitySelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      previousSurfaceParitySelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE,
      previousSurfaceParitySelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS,
      promotedSteelDeltaLwRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_V3_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix with the supported steel DeltaLw row and no hidden screening origins", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV3();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV3(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(60);
    for (const retired of COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS) {
      expect(rowIds).not.toContain(retired);
    }
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "wall.building_prediction_partial_context.needs_input"
      ]),
      currentPostureCoverage: ["family_physics", "bounded_screening", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      failureClassCounts: {
        basis_boundary: 3,
        correct_block: 13,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 37,
        unsupported_metric: 3
      },
      hiddenScreeningOriginRowIds: [],
      noRuntimeValueMovementInRefresh: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      promotedSteelDeltaLwRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
      remainingCalculationGradeBlockerRowIds: [
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
      ],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS],
      routeCoverage: ["wall", "floor"],
      rowCount: 60,
      selectedLane: "steel_suspended_ceiling_low_frequency_owner_contract",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE
    });
  });

  it("records the landed steel suspended-ceiling DeltaLw runtime as calculation-grade matrix evidence", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV3();
    const steelDelta = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID);

    expect(steelDelta).toMatchObject({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_steel_suspended_ceiling_delta_lw_formula_corridor",
      requestedMetrics: ["Ln,w", "DeltaLw"],
      runtime: {
        basisId: STEEL_FLOOR_FORMULA_BASIS,
        errorBudgetDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        missingPhysicalInputs: [],
        origin: STEEL_FLOOR_FORMULA_BASIS,
        selectedMethod: "formula_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      },
      toleranceOrErrorBudget:
        `Ln,w +/-4.5 dB / DeltaLw +/-2 dB source_absent_formula_error_budget; reference ${STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE}`
    });
    expect(values(steelDelta)).toEqual({ DeltaLw: 22.4, "Ln,w": 51.6 });
    expect(steelDelta.valueOrBlockedReason).toContain("Ln,w 51.6 / DeltaLw 22.4");
  });

  it("keeps low-frequency, ASTM, and field/building aliases out of the steel DeltaLw promotion", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV3();
    const lnt50 = byId(rows, "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported");
    const astm = byId(rows, "floor.lightweight_steel_suspended_ceiling_astm.unsupported");
    const field = byId(rows, "floor.lightweight_steel_suspended_ceiling_field_adapter.lprime");

    expect(lnt50).toMatchObject({
      basis: "field_apparent",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        errorBudgetDb: null,
        origin: "unsupported_basis_boundary",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["L'nT,50"],
        valuePins: []
      }
    });
    expect(astm).toMatchObject({
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
    expect(field).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      failureClass: "basis_boundary",
      runtime: {
        supportedTargetOutputs: ["L'n,w", "L'nT,w"],
        unsupportedTargetOutputs: ["L'nT,50"]
      }
    });
    expect(values(field)).toEqual({ "L'n,w": 65.2, "L'nT,w": 62.4 });
  });

  it("ranks low-frequency ownership ahead of ASTM, opening/building adapter, and source crawl work", () => {
    const selection = rankCompanyInternalCalculationGradeV3NextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "steel_suspended_ceiling_low_frequency_owner_contract",
      score: 5.3,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "record the landed steel suspended-ceiling Ln,w/DeltaLw runtime before selecting another runtime lane",
      "keep L'nT,50 blocked until a low-frequency impact spectrum owner exists",
      "keep ASTM IIC/AIIC parked unless a later active plan explicitly reselects ASTM",
      "do not choose broad source crawling while a source-absent owner contract can unlock calculator coverage"
    ]);
  });

  it("keeps docs and current-gate runner aligned with matrix v3 closeout and low-frequency selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Ln,w 51.6");
      expect(content, path).toContain("DeltaLw 22.4");
      expect(content, path).toContain("L'nT,50");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts"
    );
  });
});
