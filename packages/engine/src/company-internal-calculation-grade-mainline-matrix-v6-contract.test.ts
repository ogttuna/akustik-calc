import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV6,
  buildCompanyInternalCalculationGradeMainlineMatrixV6Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS,
  rankCompanyInternalCalculationGradeV6NextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV6
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_V6_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md",
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
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix v6 row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix v6 refresh", () => {
  it("lands matrix v6 after A-weighted surface parity and selects boundary revalidation next", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixV6Contract()).toEqual({
      importedOpeningLeakAWeightedRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS],
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
      matrixRows: 71,
      newRuntimeBehaviorChangeInRefresh: false,
      previousMatrixRows: 65,
      previousSurfaceParityLandedGate: "company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan",
      previousSurfaceParitySelectedNextAction:
        "company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan",
      previousSurfaceParitySelectedNextFile:
        "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts",
      previousSurfaceParitySelectionStatus:
        "company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh",
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_V6_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix with A-weighted runtime pins and no hidden screening origins", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV6(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(71);
    expect(rowIds).not.toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID);
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
        "wall.building_prediction_partial_context.needs_input",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported"
      ]),
      currentPostureCoverage: ["family_physics", "bounded_screening", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_lnt50_exact_field_precedence.field"
      ],
      failureClassCounts: {
        basis_boundary: 5,
        correct_block: 15,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 43,
        unsupported_metric: 4
      },
      hiddenScreeningOriginRowIds: [],
      importedOpeningLeakAWeightedRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS],
      noRuntimeValueMovementInRefresh: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      promotedOpeningLeakAWeightedBuildingRowId:
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
      promotedOpeningLeakAWeightedFieldRowId:
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
      remainingCalculationGradeBlockerRowIds: [
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
        "wall.building_prediction_partial_context.needs_input",
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      retiredRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS],
      routeCoverage: ["wall", "floor"],
      rowCount: 71,
      selectedLane: "boundary_revalidation_building_partial_context_and_astm",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE
    });
  });

  it("records supported opening/leak A-weighted field and building runtime rows by value, basis, and budget", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const field = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID);
    const building = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID);

    expect(field).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_opening_leak_a_weighted_field_spectrum_adapter_runtime_corridor",
      requestedMetrics: ["Dn,A", "DnT,A"],
      runtime: {
        basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
        errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        selectedMethod: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["Dn,A", "DnT,A"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(field)).toEqual({
      "Dn,A": 35.9,
      "DnT,A": 36.1
    });
    expect(field.toleranceOrErrorBudget).toContain("+/-9 dB");

    expect(building).toMatchObject({
      basis: "building_prediction",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      inputCompleteness: "complete",
      originSupportBucket: "source_absent_opening_leak_a_weighted_building_spectrum_adapter_runtime_corridor",
      requestedMetrics: ["DnT,A"],
      runtime: {
        basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
        errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        selectedMethod: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["DnT,A"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(building)).toEqual({
      "DnT,A": 31.3
    });
    expect(building.toleranceOrErrorBudget).toContain("+/-11 dB");
  });

  it("keeps building Dn,A, missing frequency, lab alias, ASTM alias, and exact-source boundaries explicit", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const buildingDnA = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID);
    const missingBand = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID);
    const labAlias = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID);
    const astmAlias = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID);
    const exactBoundary = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID);

    expect(buildingDnA).toMatchObject({
      basis: "building_prediction",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      requestedMetrics: ["Dn,A"],
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Dn,A"],
        valuePins: []
      }
    });
    expect(buildingDnA.valueOrBlockedReason).toContain("does not alias DnT,A to Dn,A");

    expect(missingBand).toMatchObject({
      basis: "field_apparent",
      currentPosture: "needs_input",
      failureClass: "correct_block",
      requestedMetrics: ["Dn,A", "DnT,A"],
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: ["frequencyBandSet"],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Dn,A", "DnT,A"],
        valuePins: []
      }
    });
    expect(missingBand.valueOrBlockedReason).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET);

    expect(labAlias).toMatchObject({
      basis: "element_lab",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Dn,A", "DnT,A"],
        valuePins: []
      }
    });
    expect(labAlias.valueOrBlockedReason).toContain("not aliases");

    expect(astmAlias).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      requestedMetrics: ["IIC", "AIIC"],
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
    expect(astmAlias.valueOrBlockedReason).toContain("does not calculate impact ASTM");

    expect(exactBoundary).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
        errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
        origin: "family_physics_prediction",
        selectedMethod: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["Dn,A", "DnT,A"],
        unsupportedTargetOutputs: []
      }
    });
    expect(exactBoundary.valueOrBlockedReason).toContain("not exact measured evidence");
  });

  it("ranks boundary revalidation ahead of final rehearsal and broad source crawl", () => {
    const selection = rankCompanyInternalCalculationGradeV6NextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "boundary_revalidation_building_partial_context_and_astm",
      score: 3.3,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "final_internal_use_rehearsal")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "retire the stale A-weighted unsupported matrix row only after field and building A-weighted values are pinned",
      "keep missing frequencyBandSet as a user input prompt instead of falling back to base field/building values",
      "keep building Dn,A, lab aliases, and ASTM aliases unsupported unless a later owner explicitly promotes them",
      "revalidate building partial-context and ASTM parked-boundary rows before the final internal-use rehearsal",
      "do not choose broad source crawling while source-absent matrix closeout remains executable"
    ]);
  });

  it("keeps docs and current-gate runner aligned with matrix v6 closeout and next selected lane", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Dn,A 35.9");
      expect(content, path).toContain("DnT,A 36.1");
      expect(content, path).toContain("DnT,A 31.3");
      expect(content, path).toContain("boundary revalidation");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts"
    );
  });
});
