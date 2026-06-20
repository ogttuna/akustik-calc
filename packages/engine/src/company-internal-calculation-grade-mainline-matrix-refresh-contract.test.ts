import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { PersonalUseMvpCoverageMetricValuePin, PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  assertCompanyInternalHeavyCompositeRuntimeRows,
  buildCompanyInternalCalculationGradeMainlineMatrix,
  buildCompanyInternalCalculationGradeMainlineMatrixContract,
  COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS,
  rankCompanyInternalCalculationGradeNextLanes,
  summarizeCompanyInternalCalculationGradeMainlineMatrix
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-company-internal-heavy-composite-wall";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_MATRIX_REFRESH_SURFACES = [
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts",
  "packages/engine/src/company-internal-heavy-composite-wall-family-physics-contract.test.ts",
  "packages/engine/src/dynamic-airborne-company-internal-heavy-composite-wall.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_HEAVY_COMPOSITE_WALL_SOLVER_CLEANUP_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("company-internal calculation-grade mainline matrix refresh after heavy-composite cleanup", () => {
  it("lands a no-runtime matrix refresh and selects the next ISO floor-impact lane", () => {
    expect(buildCompanyInternalCalculationGradeMainlineMatrixContract()).toEqual({
      astmRuntimeContinuesParked: true,
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_LANDED_GATE,
      matrixRows: 61,
      matrixRowsAddedAfterHeavyComposite: 3,
      newRuntimeBehaviorChangeInRefresh: false,
      previousGateBQSelectedNextAction: "gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan",
      previousGateBQSelectionStatus:
        "gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br",
      priorHeavyCompositeRuntimeMovementPreserved: true,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_COMPANY_INTERNAL_MATRIX_REFRESH_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable matrix after heavy-composite cleanup without selecting ASTM runtime work", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrix();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrix(rows);
    const rowIds = rows.map((row) => row.id);

    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rows).toHaveLength(61);
    expect(summary).toEqual({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      correctlyBlockedRowIds: expect.arrayContaining([
        "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
        "wall.building_prediction_missing_context.needs_input"
      ]),
      currentPostureCoverage: [
        "family_physics",
        "bounded_screening",
        "needs_input",
        "unsupported",
        "exact",
        "source_anchored_delta"
      ],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      failureClassCounts: {
        basis_boundary: 3,
        correct_block: 14,
        coverage_gap: 0,
        hostile_input_refusal: 4,
        none: 36,
        unsupported_metric: 4
      },
      heavyCompositeRowIds: [...COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS],
      noNewRuntimeValueMovement: true,
      parkedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      remainingCalculationGradeBlockerRowIds: [
        "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
        "wall.building_prediction_missing_context.needs_input"
      ],
      routeCoverage: ["wall", "floor"],
      rowCount: 61,
      selectedLane: "steel_suspended_ceiling_delta_lw_owner_contract",
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE
    });
  });

  it("pins the heavy-composite lab, field, and building-prediction rows against route drift", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrix();
    const lab = byId(rows, "wall.heavy_composite_complete_family_physics.lab");
    const field = byId(rows, "wall.heavy_composite_complete_field_adapter.field");
    const building = byId(rows, "wall.building_prediction_missing_context.needs_input");

    assertCompanyInternalHeavyCompositeRuntimeRows(rows);

    expect(lab).toMatchObject({
      basis: "element_lab",
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
        errorBudgetDb: 8,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        selectedMethod: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(lab)).toEqual({ C: -1.4, Ctr: -6.3, Rw: 63, STC: 63 });

    expect(field).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        errorBudgetDb: 10,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        selectedMethod: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(field)).toEqual({ "Dn,w": 60, "DnT,A": 60.1, "DnT,w": 61, "R'w": 60 });

    expect(building).toMatchObject({
      basis: "building_prediction",
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        basisId: "dynamic_calculator_route_input_contract_missing_physical_fields",
        errorBudgetDb: null,
        origin: "needs_input",
        selectedMethod: "candidate_dynamic_needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["R'w", "DnT,w"],
        valuePins: []
      }
    });
    expect(building.runtime.missingPhysicalInputs).toEqual(expect.arrayContaining([
      "buildingPredictionOutputBasis",
      "conservativeFlankingAssumption",
      "flankingJunctionClass",
      "junctionCouplingLengthM",
      "sourceRoomVolumeM3"
    ]));
  });

  it("ranks the next lane toward ISO DeltaLw coverage instead of broad source crawl or parked ASTM work", () => {
    const selection = rankCompanyInternalCalculationGradeNextLanes();

    expect(selection.selectedCandidate).toMatchObject({
      basisLeakageRisk: 2,
      calculationGradeRisk: 8,
      id: "steel_suspended_ceiling_delta_lw_owner_contract",
      implementationCost: 4,
      score: 9.1,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 8
    });
    expect(selection.candidates.find((candidate) => candidate.id === "astm_iic_aiic_parked_boundary")).toMatchObject({
      selected: false
    });
    expect(selection.candidates.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toEqual([
      "keep ASTM IIC/AIIC parked unless an active mainline plan explicitly reselects it",
      "score user_frequency * calculation_grade_risk / (implementation_cost + basis_leakage_risk + 1)",
      "prefer ISO floor-impact DeltaLw gaps before specialized low-frequency or building-prediction adapters",
      "do not select broad source crawling when a source-absent formula owner can increase calculator coverage"
    ]);
  });

  it("keeps the current docs pointed at the matrix refresh and selected ISO next lane", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toEqual(
        expect.stringMatching(
          /CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF\.md|CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF\.md/
        )
      );
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE);
    }
  });
});
