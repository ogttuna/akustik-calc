import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix,
  buildPersonalUseMvpCoverageSprintGateBHLandingContract,
  GATE_BH_HEAVY_CONCRETE_COMBINED_REQUIRED_INPUTS,
  GATE_BH_HEAVY_CONCRETE_COMBINED_ROW_IDS,
  GATE_BH_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_EXPECTED_ROW_IDS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBILanes,
  summarizePersonalUseMvpCoverageSprintGateBH
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bh";
import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BH_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "packages/engine/src/heavy-concrete-combined-impact-input-surface.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing Gate BH floor-impact matrix row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate BH floor-impact source-absent coverage matrix refresh", () => {
  it("lands Gate BH as a no-runtime floor-impact matrix refresh and selects the field/building adapter next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBHLandingContract();

    expect(contract).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
      matrixRows: 21,
      numericRuntimeBehaviorChange: false,
      previousGateBG: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS
      },
      routeCardValueChange: false,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bg_floor_impact_source_absent_coverage_matrix_refresh",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_BH_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes the executable floor-impact source-absent matrix without introducing coverage gaps", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateBH(rows);

    expect(rows.map((row) => row.id)).toEqual([...PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_EXPECTED_ROW_IDS]);
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      failureClassCounts: {
        basis_boundary: 1,
        correct_block: 6,
        coverage_gap: 0,
        hostile_input_refusal: 2,
        none: 11,
        unsupported_metric: 1
      },
      heavyConcreteCombinedRowIds: [...GATE_BH_HEAVY_CONCRETE_COMBINED_ROW_IDS],
      matrixRowsAddedAtGateBH: 5,
      noRuntimeValueMovement: true,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS,
      routeCoverage: ["floor"],
      rowCount: 21,
      selectedGateBILane: "floor_impact_field_building_adapter_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
      sourceAbsentValueRowIds: [
        "floor.heavy_concrete_floating_floor.lab",
        "floor.heavy_concrete_floating_floor_safe_reorder.lab",
        "floor.heavy_concrete_combined_input_surface.lab",
        "floor.heavy_concrete_combined_safe_reorder.lab",
        "floor.lightweight_steel_complete_formula.lab",
        "floor.timber_joist_impact.lab",
        "floor.clt_mass_timber_impact.lab",
        "floor.clt_mass_timber_field_lnt50.local_guide"
      ]
    });
    expect(summary.correctlyBlockedRowIds).toEqual([
      "floor.heavy_concrete_floating_floor_missing_load.needs_input",
      "floor.heavy_concrete_combined_missing_load.needs_input",
      "floor.heavy_concrete_combined_duplicate_base.refused",
      "floor.lightweight_steel_duplicate_carrier.refused",
      "floor.lightweight_steel_formula_missing_spacing.needs_input",
      "floor.lightweight_steel_formula_wrong_family.inactive",
      "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
      "floor.missing_field_impact_context.needs_input",
      "floor.building_impact.prediction_adapter_boundary",
      "floor.astm_iic_aiic_boundary.unsupported"
    ]);
  });

  it("pins the Gate BF heavy-concrete combined input-surface rows by value, basis, budget, and blocked fields", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix();
    const complete = byId(rows, "floor.heavy_concrete_combined_input_surface.lab");
    const safeReorder = byId(rows, "floor.heavy_concrete_combined_safe_reorder.lab");
    const missingLoad = byId(rows, "floor.heavy_concrete_combined_missing_load.needs_input");
    const duplicateBase = byId(rows, "floor.heavy_concrete_combined_duplicate_base.refused");

    for (const row of [complete, safeReorder]) {
      expect(row).toMatchObject({
        basis: "element_lab",
        currentPosture: "family_physics",
        failureClass: "none",
        originSupportBucket: "source_absent_heavy_concrete_combined_input_surface_formula",
        runtime: {
          basisId: GATE_BH_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
          errorBudgetDb: 6.5,
          missingPhysicalInputs: [],
          origin: GATE_BH_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
          publicEntryPoint: "calculateAssembly",
          selectedMethod: "formula_estimate",
          supportedTargetOutputs: ["Ln,w", "DeltaLw"],
          unsupportedTargetOutputs: []
        },
        toleranceOrErrorBudget: "Ln,w +/-6.5 dB; DeltaLw +/-5.5 dB source_absent_formula_error_budget"
      });
      expect(values(row)).toEqual({ "DeltaLw": 30.1, "Ln,w": 44.4 });
    }

    expect(missingLoad).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      hostileVariant: "missing_load_basis",
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: ["loadBasisKgM2"],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"],
        valuePins: []
      },
      toleranceOrErrorBudget: "blocked_no_budget_surface"
    });

    expect(duplicateBase).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "hostile_input_refusal",
      hostileVariant: "duplicate_heavy_concrete_base_structure",
      runtime: {
        errorBudgetDb: null,
        missingPhysicalInputs: [...GATE_BH_HEAVY_CONCRETE_COMBINED_REQUIRED_INPUTS],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"],
        valuePins: []
      },
      toleranceOrErrorBudget: "blocked_no_budget_surface"
    });
  });

  it("keeps existing floor rows and basis boundaries pinned while adding the building-impact adapter boundary", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix();

    expect(values(byId(rows, "floor.heavy_concrete_floating_floor.lab"))).toEqual({
      "DeltaLw": 26.9,
      "Ln,w": 44.9
    });
    expect(values(byId(rows, "floor.heavy_concrete_floating_floor_safe_reorder.lab"))).toEqual({
      "DeltaLw": 32.6,
      "Ln,w": 39.2
    });
    expect(values(byId(rows, "floor.lightweight_steel_complete_formula.lab"))).toEqual({
      "DeltaLw": 22.4,
      "Ln,w": 55.6
    });
    expect(values(byId(rows, "floor.lightweight_steel_exact_source_precedence.lab"))).toEqual({
      "Ln,w": 51
    });
    expect(values(byId(rows, "floor.timber_joist_impact.lab"))).toEqual({
      "DeltaLw": 25.2,
      "Ln,w": 51
    });
    expect(values(byId(rows, "floor.clt_mass_timber_impact.lab"))).toEqual({
      "DeltaLw": 22.6,
      "Ln,w": 50
    });
    expect(values(byId(rows, "floor.clt_mass_timber_field_lnt50.local_guide"))).toEqual({
      "L'nT,50": 49
    });
    expect(values(byId(rows, "floor.complete_field_impact_context.lprime"))).toEqual({
      "L'n,w": 53,
      "L'nT,w": 50.6
    });
    expect(values(byId(rows, "floor.many_layer_stress_exact_stable"))).toEqual({
      "L'n,w": 55,
      "L'nT,w": 52.2,
      "Ln,w": 52,
      Rw: 52
    });

    expect(byId(rows, "floor.building_impact.prediction_adapter_boundary")).toMatchObject({
      basis: "building_prediction",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
      originSupportBucket: "floor_impact_building_prediction_adapter_not_owned",
      runtime: {
        errorBudgetDb: null,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["L'nT,w", "L'nT,50"],
        valuePins: []
      },
      toleranceOrErrorBudget: "blocked_no_lab_or_field_to_building_alias"
    });

    expect(byId(rows, "floor.astm_iic_aiic_boundary.unsupported")).toMatchObject({
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

  it("ranks Gate BI field/building ownership ahead of ASTM, retune, and broad source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateBILanes();

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor_impact_field_building_adapter_contract",
      "astm_impact_rating_adapter_contract",
      "floor_impact_low_frequency_owner_contract",
      "floor_impact_formula_retune_with_holdouts",
      "broad_floor_source_row_crawl"
    ]);
    expect(candidates[0]).toMatchObject({
      evidenceRowIds: [
        "floor.complete_field_impact_context.lprime",
        "floor.missing_field_impact_context.needs_input",
        "floor.building_impact.prediction_adapter_boundary",
        "floor.clt_mass_timber_field_lnt50.local_guide"
      ],
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(candidates.find((candidate) => candidate.id === "floor_impact_formula_retune_with_holdouts")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(candidates.find((candidate) => candidate.id === "broad_floor_source_row_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BH closeout and Gate BI selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("Heavy concrete combined input surface");
      expect(content, path).toContain("Ln,w 44.4");
      expect(content, path).toContain("DeltaLw 30.1");
      expect(content, path).toContain("floor.building_impact.prediction_adapter_boundary");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts"
    );
  });
});
