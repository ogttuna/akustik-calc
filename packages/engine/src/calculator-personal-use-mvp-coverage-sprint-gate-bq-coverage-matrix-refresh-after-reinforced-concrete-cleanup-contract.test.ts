import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bn";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bp";
import {
  buildPersonalUseMvpCoverageSprintGateBQContract,
  buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_RUNTIME_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBRLanes,
  summarizePersonalUseMvpCoverageSprintGateBQ
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bq";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
} from "./heavy-concrete-combined-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BQ_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BQ_COVERAGE_MATRIX_REFRESH_AFTER_REINFORCED_CONCRETE_CLEANUP_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const found = rows.find((row) => row.id === id);

  if (!found) {
    throw new Error(`Missing Gate BQ matrix row ${id}`);
  }

  return found;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate BQ coverage matrix refresh after reinforced-concrete cleanup", () => {
  it("lands Gate BQ as a no-runtime matrix refresh and selects the ASTM IIC/AIIC adapter contract next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBQContract();

    expect(contract).toEqual({
      apiShapeChange: false,
      calculationGradeBlockerRowsRemovedAtGateBQ: [
        ...PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS
      ],
      evidencePromotion: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
      matrixRows: 58,
      matrixRowsAddedAtGateBQ: 8,
      matrixRowsReplacedAtGateBQ: 1,
      numericRuntimeBehaviorChange: false,
      previousGateBP: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS
      },
      reinforcedConcreteRuntimeBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_RUNTIME_BASIS,
      routeCardValueChange: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bp_coverage_matrix_refresh_after_reinforced_concrete_cleanup",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceDb: {
        "DeltaLw": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
        "Ln,w": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
      },
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_BQ_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the matrix with reinforced-concrete formula and boundary rows and removes the old low-confidence gap", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateBQ(rows);

    expect(rows).toHaveLength(58);
    expect(rows.some((row) => row.id === "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate"))
      .toBe(false);
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      exactSourcePrecedenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      matrixRowsAddedAtGateBQ: 8,
      noRuntimeValueMovement: true,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS,
      reinforcedConcreteRowIds: [...PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS],
      remainingCalculationGradeBlockerRowIds: [],
      replacedCalculationGradeBlockerRowIds: [
        "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate"
      ],
      routeCoverage: ["wall", "floor"],
      rowCount: 58,
      selectedGateBRLane: "floor_impact_astm_iic_aiic_adapter_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
      unsupportedAstmBoundaryRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ]
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 4,
      correct_block: 13,
      coverage_gap: 0,
      hostile_input_refusal: 4,
      none: 33,
      unsupported_metric: 4
    });
    expect(summary.correctlyBlockedRowIds).toEqual(expect.arrayContaining([
      "floor.reinforced_concrete_combined_visible_derived.needs_input",
      "floor.reinforced_concrete_combined_incomplete_explicit.needs_input",
      "floor.reinforced_concrete_combined_field_building.non_alias",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ]));
  });

  it("pins reinforced-concrete complete, needs-input, exact, and adjacent formula-boundary behavior", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix();
    const complete = byId(rows, "floor.reinforced_concrete_combined_complete_formula.lab");
    const visibleNeedsInput = byId(rows, "floor.reinforced_concrete_combined_visible_derived.needs_input");
    const explicitNeedsInput = byId(rows, "floor.reinforced_concrete_combined_incomplete_explicit.needs_input");
    const exact = byId(rows, "floor.reinforced_concrete_combined_exact_source_precedence.lab");
    const bare = byId(rows, "floor.reinforced_concrete_bare_floor_existing_corridor.lab");
    const floating = byId(rows, "floor.reinforced_concrete_upper_only_floating_existing_corridor.lab");

    expect(complete).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_RUNTIME_BASIS,
        errorBudgetDb: 6.5,
        missingPhysicalInputs: [],
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: ["Rw", "Ctr"]
      }
    });
    expect(values(complete)).toEqual({ "DeltaLw": 13.7, "Ln,w": 58.1 });

    expect(visibleNeedsInput).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        basisId: null,
        errorBudgetDb: null,
        missingPhysicalInputs: [
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2",
          "ceilingOrLowerAssembly"
        ],
        origin: "needs_input",
        supportedTargetOutputs: ["Rw", "Ctr"],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
      }
    });
    expect(values(visibleNeedsInput)).toEqual({ Ctr: 53.8, Rw: 60 });

    expect(explicitNeedsInput).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        missingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
        origin: "needs_input",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"],
        valuePins: []
      }
    });

    expect(exact).toMatchObject({
      currentPosture: "exact",
      failureClass: "none",
      runtime: {
        basisId: "official_floor_system_exact_match",
        supportedTargetOutputs: ["Rw", "Ln,w"],
        unsupportedTargetOutputs: ["Ctr", "DeltaLw"]
      }
    });
    expect(values(exact)).toEqual({ "Ln,w": 48, Rw: 62 });

    expect(bare).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
        supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      }
    });
    expect(values(bare)).toEqual({ Ctr: 51.8, "Ln,w": 71.8, Rw: 58 });

    expect(floating).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: ["Rw", "Ctr"]
      }
    });
    expect(values(floating)).toEqual({ "DeltaLw": 7, "Ln,w": 64.8 });
  });

  it("keeps field/building and ASTM requests outside the lab reinforced-concrete budget", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix();
    const fieldBuilding = byId(rows, "floor.reinforced_concrete_combined_field_building.non_alias");
    const astm = byId(rows, "floor.reinforced_concrete_combined_astm_iic.unsupported");

    expect(fieldBuilding).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      failureClass: "basis_boundary",
      runtime: {
        basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        errorBudgetDb: 5,
        supportedTargetOutputs: ["L'n,w", "L'nT,w"],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
    expect(values(fieldBuilding)).toEqual({ "L'n,w": 61.1, "L'nT,w": 58.3 });

    expect(astm).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
      runtime: {
        errorBudgetDb: null,
        origin: "unsupported_astm_e989_adapter",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
  });

  it("selects the ASTM adapter ahead of reopening reinforced concrete, narrow steel companions, and broad source crawl", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateBRLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "floor_impact_astm_iic_aiic_adapter_contract",
      score: 3.8,
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
        id: "floor_impact_astm_iic_aiic_adapter_contract",
        score: 3.8,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "post_reinforced_concrete_cleanup_internal_use_revalidation",
        score: 2.9,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "steel_suspended_ceiling_delta_lw_owner_contract",
        score: 2.8,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "floor_impact_low_frequency_field_owner_contract",
        score: 1.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "reinforced_concrete_reopen",
        score: 0.8,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "broad_floor_source_crawl",
        score: 0.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate BQ closeout and Gate BR selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Ln,w 58.1");
      expect(content, path).toContain("DeltaLw 13.7");
      expect(content, path).toContain("ASTM IIC/AIIC adapter");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts"
    );
  });
});
