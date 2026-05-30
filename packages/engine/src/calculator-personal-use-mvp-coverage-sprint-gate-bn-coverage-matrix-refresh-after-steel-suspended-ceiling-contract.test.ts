import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateBMRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bm";
import {
  buildPersonalUseMvpCoverageSprintGateBNContract,
  buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_LN_W_TOLERANCE_DB,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_RUNTIME_BASIS,
  rankPersonalUseMvpCoverageSprintGateBOLanes,
  summarizePersonalUseMvpCoverageSprintGateBN
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bn";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BN_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bn.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BN_COVERAGE_MATRIX_REFRESH_AFTER_STEEL_SUSPENDED_CEILING_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const found = rows.find((row) => row.id === id);

  if (!found) {
    throw new Error(`Missing Gate BN matrix row ${id}`);
  }

  return found;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate BN coverage matrix refresh after steel suspended-ceiling", () => {
  it("lands Gate BN as a no-runtime matrix refresh and selects reinforced-concrete cleanup next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBNContract();

    expect(contract).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
      matrixRows: 51,
      matrixRowsAddedAtGateBN: 10,
      numericRuntimeBehaviorChange: false,
      previousGateBM: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
      },
      routeCardValueChange: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bm_steel_suspended_ceiling_matrix_refresh",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(buildPersonalUseMvpCoverageSprintGateBMRevalidationContract()).toMatchObject({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
    });

    for (const path of REQUIRED_GATE_BN_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the matrix with steel suspended-ceiling rows and the remaining calculation-grade blocker", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateBN(rows);

    expect(rows).toHaveLength(51);
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      calculationGradeBlockerRowIds: [...PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS],
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
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab"
      ],
      matrixRowsAddedAtGateBN: 10,
      noRuntimeValueMovement: true,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS,
      remainingCalculationGradeBlockerRowIds: [
        "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate"
      ],
      routeCoverage: ["wall", "floor"],
      rowCount: 51,
      selectedGateBOLane: "reinforced_concrete_low_confidence_cleanup",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
      steelSuspendedCeilingRowIds: [...PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS],
      unsupportedSteelSuspendedCeilingRowIds: [
        "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
      ]
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 3,
      correct_block: 11,
      coverage_gap: 1,
      hostile_input_refusal: 4,
      none: 29,
      unsupported_metric: 3
    });
    expect(summary.correctlyBlockedRowIds).toEqual(expect.arrayContaining([
      "floor.lightweight_steel_suspended_ceiling_partial.needs_input",
      "floor.lightweight_steel_suspended_ceiling_duplicate_carrier.refused",
      "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
      "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate"
    ]));
  });

  it("pins steel suspended-ceiling runtime, safe reorder, exact precedence, and partial/duplicate guards", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix();
    const complete = byId(rows, "floor.lightweight_steel_suspended_ceiling.lab");
    const safeReorder = byId(rows, "floor.lightweight_steel_suspended_ceiling_safe_reorder.lab");
    const partial = byId(rows, "floor.lightweight_steel_suspended_ceiling_partial.needs_input");
    const duplicate = byId(rows, "floor.lightweight_steel_suspended_ceiling_duplicate_carrier.refused");
    const exact = byId(rows, "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab");

    for (const row of [complete, safeReorder]) {
      expect(row).toMatchObject({
        basis: "element_lab",
        currentPosture: "family_physics",
        failureClass: "none",
        runtime: {
          basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_RUNTIME_BASIS,
          errorBudgetDb: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_LN_W_TOLERANCE_DB,
          missingPhysicalInputs: [],
          origin: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_RUNTIME_BASIS,
          supportedTargetOutputs: ["Ln,w"],
          unsupportedTargetOutputs: ["DeltaLw", "IIC", "AIIC", "L'nT,50"]
        },
        toleranceOrErrorBudget: "Ln,w +/-6 dB source_absent_formula_error_budget"
      });
      expect(values(row)).toEqual({ "Ln,w": 62.2 });
    }

    expect(partial).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_RUNTIME_BASIS,
        errorBudgetDb: null,
        missingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC", "L'nT,50"],
        valuePins: []
      }
    });
    expect(duplicate).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "hostile_input_refusal",
      runtime: {
        errorBudgetDb: null,
        origin: "unsafe_topology",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC", "L'nT,50"],
        valuePins: []
      }
    });
    expect(duplicate.runtime.missingPhysicalInputs).toEqual(expect.arrayContaining([
      "steelSupportForm",
      "steelCarrierDepthMm",
      "steelCarrierSpacingMm",
      "lowerCeilingIsolationSupportForm"
    ]));
    expect(exact).toMatchObject({
      currentPosture: "exact",
      failureClass: "none",
      runtime: {
        basisId: "official_floor_system_exact_match",
        supportedTargetOutputs: ["Ln,w", "Rw"],
        unsupportedTargetOutputs: ["DeltaLw", "Ctr", "IIC", "AIIC", "L'nT,50"]
      }
    });
    expect(values(exact)).toEqual({ "Ln,w": 58 });
  });

  it("keeps steel suspended-ceiling field, DeltaLw, ASTM, and low-frequency boundaries explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix();
    const field = byId(rows, "floor.lightweight_steel_suspended_ceiling_field_adapter.lprime");
    const delta = byId(rows, "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported");
    const astm = byId(rows, "floor.lightweight_steel_suspended_ceiling_astm.unsupported");
    const lowFrequency = byId(rows, "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported");

    expect(field).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      failureClass: "basis_boundary",
      runtime: {
        basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        errorBudgetDb: 5,
        missingPhysicalInputs: [],
        supportedTargetOutputs: ["L'n,w", "L'nT,w"],
        unsupportedTargetOutputs: ["L'nT,50"]
      },
      toleranceOrErrorBudget:
        "L'n,w +/-5 dB and L'nT,w +/-5.5 dB source_absent_field_building_adapter_error_budget; L'nT,50 blocked"
    });
    expect(values(field)).toEqual({ "L'n,w": 65.2, "L'nT,w": 62.4 });

    expect(delta).toMatchObject({
      basis: "element_lab",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["DeltaLw"],
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
    expect(lowFrequency).toMatchObject({
      basis: "field_apparent",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["L'nT,50"],
        valuePins: []
      }
    });
  });

  it("selects reinforced-concrete low-confidence cleanup ahead of unsupported adapters and source crawl", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix();
    const reinforced = byId(rows, "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate");
    const selection = rankPersonalUseMvpCoverageSprintGateBOLanes(rows);

    expect(reinforced).toMatchObject({
      basis: "element_lab",
      currentPosture: "bounded_screening",
      expectedPosture: "family_physics",
      failureClass: "coverage_gap",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
      runtime: {
        basisId: "predictor_floor_system_low_confidence_estimate",
        origin: "low_confidence",
        supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      },
      toleranceOrErrorBudget: "low_confidence_29_percent_fit_not_calculation_grade"
    });
    expect(values(reinforced)).toEqual({ Ctr: 57, "Ln,w": 50, Rw: 65.9 });
    expect(selection.selectedCandidate).toMatchObject({
      id: "reinforced_concrete_low_confidence_cleanup",
      score: 8.6,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.map((candidate) => ({
      id: candidate.id,
      selected: candidate.selected,
      sourceRowsRequiredForRuntimeSelection: candidate.sourceRowsRequiredForRuntimeSelection
    }))).toEqual([
      {
        id: "reinforced_concrete_low_confidence_cleanup",
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "steel_suspended_ceiling_delta_lw_owner_contract",
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "astm_iic_aiic_adapter_after_iso",
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "steel_suspended_ceiling_low_frequency_owner_contract",
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "broad_floor_source_crawl",
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate BN closeout and Gate BO selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("Ln,w 62.2");
      expect(content, path).toContain("reinforced-concrete low-confidence cleanup");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts"
    );
  });
});
