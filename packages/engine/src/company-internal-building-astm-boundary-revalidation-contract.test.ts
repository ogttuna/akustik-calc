import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type {
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalBuildingAstmBoundaryRevalidationContract,
  buildCompanyInternalCalculationGradeMainlineMatrixV6,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
  rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes,
  summarizeCompanyInternalBuildingAstmBoundaryRevalidation
} from "./company-internal-calculation-grade-mainline-matrix";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_BOUNDARY_REVALIDATION_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts",
  "packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md",
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
    throw new Error(`Missing company-internal boundary revalidation row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal building/ASTM boundary revalidation", () => {
  it("lands the selected boundary revalidation after Matrix V6 and selects final internal-use rehearsal", () => {
    expect(buildCompanyInternalBuildingAstmBoundaryRevalidationContract()).toEqual({
      astmBoundaryRowsStayUnsupported: true,
      buildingBoundaryRowsStayNeedsInput: true,
      landedGate: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE,
      matrixRows: 71,
      newRuntimeBehaviorChangeInRevalidation: false,
      previousMatrixV6LandedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
      previousMatrixV6SelectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
      previousMatrixV6SelectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
      previousMatrixV6SelectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
      revalidatedBoundaryRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS],
      revalidatedBuildingRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS],
      revalidatedCrossRouteAstmRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS],
      revalidatedFloorAstmRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS],
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_BOUNDARY_REVALIDATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps building partial-context and opening/leak missing-owner rows as precise needs_input", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const openingBuilding = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID);
    const partialBuilding = byId(rows, "wall.building_prediction_partial_context.needs_input");

    expect(openingBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: ["sourceRoomVolumeM3"],
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["R'w", "DnT,w"],
        valuePins: []
      }
    });
    expect(openingBuilding.valueOrBlockedReason).toContain("Needs sourceRoomVolumeM3");

    expect(partialBuilding).toMatchObject({
      basis: "building_prediction",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
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
        origin: "needs_input",
        supportedTargetOutputs: [],
        valuePins: []
      }
    });
    expect(partialBuilding.valueOrBlockedReason).toContain("flanking");
  });

  it("keeps floor and cross-route ASTM requests parked without ISO alias values or budgets", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const floorAstmRows = COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS.map((rowId) =>
      byId(rows, rowId)
    );
    const crossRouteAstm = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID);

    for (const row of floorAstmRows) {
      expect(row).toMatchObject({
        basis: "astm_rating_boundary",
        currentPosture: "unsupported",
        expectedPosture: "unsupported",
        failureClass: "unsupported_metric",
        requestedMetrics: ["IIC", "AIIC"],
        runtime: {
          errorBudgetDb: null,
          supportedTargetOutputs: [],
          unsupportedTargetOutputs: ["IIC", "AIIC"],
          valuePins: []
        }
      });
      expect(row.toleranceOrErrorBudget).toContain("blocked_until");
    }

    expect(crossRouteAstm).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      expectedPosture: "unsupported",
      failureClass: "basis_boundary",
      requestedMetrics: ["IIC", "AIIC"],
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
    expect(crossRouteAstm.valueOrBlockedReason).toContain("does not calculate impact ASTM");
  });

  it("summarizes the revalidation without moving Matrix V6 supported A-weighted values", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const summary = summarizeCompanyInternalBuildingAstmBoundaryRevalidation(rows);
    const fieldAWeighted = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID);
    const buildingAWeighted = byId(rows, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID);

    expect(summary).toEqual({
      astmUnsupportedRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS],
      boundaryRowsWithoutErrorBudget: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS],
      boundaryRowsWithoutValuePins: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS],
      buildingMissingPhysicalInputsByRowId: {
        [COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID]: ["sourceRoomVolumeM3"],
        "wall.building_prediction_partial_context.needs_input": [
          "sourceRoomVolumeM3",
          "flankingJunctionClass",
          "conservativeFlankingAssumption",
          "junctionCouplingLengthM",
          "buildingPredictionOutputBasis"
        ]
      },
      buildingNeedsInputRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS],
      crossRouteAstmUnsupportedRowIds: [...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS],
      finalRehearsalReady: true,
      matrixRows: 71,
      matrixV6AWeightedValuePinsPreserved: true,
      selectedLane: "final_internal_use_rehearsal",
      selectedNextAction: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE
    });
    expect(values(fieldAWeighted)).toEqual({ "Dn,A": 35.9, "DnT,A": 36.1 });
    expect(values(buildingAWeighted)).toEqual({ "DnT,A": 31.3 });
  });

  it("ranks final internal-use rehearsal ahead of ASTM runtime and broad source crawl", () => {
    const selection = rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "final_internal_use_rehearsal",
      score: 7,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "astm_runtime_adapter")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "building prediction partial contexts must remain needs_input with named physical owners and no value pins",
      "opening/leak building missing-owner rows must not borrow field values or expose a building budget",
      "ASTM IIC/AIIC rows must remain unsupported until a real ASTM rating adapter owns the route",
      "A-weighted airborne Dn,A/DnT,A rows must not become impact ASTM aliases",
      "after these boundaries are stable, run the final internal-use rehearsal instead of broad source crawling"
    ]);
  });

  it("keeps docs and the current-gate runner aligned with final rehearsal as the next selected lane", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE);
      expect(content, path).toContain("sourceRoomVolumeM3");
      expect(content, path).toContain("IIC");
      expect(content, path).toContain("AIIC");
      expect(content, path).toContain("final internal-use rehearsal");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-building-astm-boundary-revalidation-contract.test.ts"
    );
  });
});
