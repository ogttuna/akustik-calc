import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import type { ImpactErrorBudget, ImpactErrorBudgetTerm } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract,
  GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBENextLanes,
  summarizePersonalUseMvpCoverageSprintGateBD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bd";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bc";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BD = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
  numericRuntimeBehaviorChange: true,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
  previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
  previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_BD_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts",
  "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
  "packages/shared/src/domain/impact.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BD floor-impact source-absent runtime corridor", () => {
  it("lands Gate BD as the runtime corridor and selects Gate BE surface parity", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BD).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan",
      numericRuntimeBehaviorChange: true,
      previousLandedGate: "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan",
      previousSelectedNextAction: "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan",
      previousSelectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts",
      previousSelectionStatus:
        "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd",
      selectedNextAction: "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });
    expect(contract).toMatchObject({
      gateBCFormulaBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
      runtimeValueMovement: true,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BD_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete heavy-concrete combined upper/lower input to lab Ln,w and DeltaLw runtime", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4,
      availableOutputs: ["Ln,w", "DeltaLw"],
      basis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      labOrField: "lab",
      metricBasis: {
        DeltaLw: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
        LnW: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS
      },
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.dynamicImpactTrace?.selectedLabel).toBe("Heavy concrete combined upper/lower formula corridor");
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);
    expect(result.impactSupport?.formulaNotes).toContain(
      "Combined upper/lower branch adds an explicit lower-ceiling improvement term and subtracts a bounded interaction penalty."
    );
  });

  it("carries Gate BC not-measured error budgets onto the runtime metrics", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract();
    const budgets = contract.runtimeCandidate.errorBudgets;
    const lnWBudget = budgets.find((budget: ImpactErrorBudget) => budget.metricId === "Ln,w");
    const deltaBudget = budgets.find((budget: ImpactErrorBudget) => budget.metricId === "DeltaLw");

    expect(contract.runtimeCandidate).toMatchObject({
      budgetMetricIds: ["Ln,w", "DeltaLw"],
      deltaLwDb: 30.1,
      deltaLwToleranceDb: 5.5,
      lnWDb: 44.4,
      lnWToleranceDb: 6.5,
      runtimeBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      sourceAbsentNotMeasuredEvidence: true
    });
    expect(lnWBudget).toMatchObject({
      estimate: 44.4,
      max: 50.9,
      metricId: "Ln,w",
      min: 37.9,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 6.5,
      totalBudgetDb: 6.5
    });
    expect(deltaBudget).toMatchObject({
      estimate: 30.1,
      max: 35.6,
      metricId: "DeltaLw",
      min: 24.6,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 5.5,
      totalBudgetDb: 5.5
    });
    expect(lnWBudget?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)).toEqual([
      "heavy_reference_floor_family_spread",
      "lower_assembly_coupling_simplification",
      "upper_lower_interaction_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision"
    ]);
    expect(deltaBudget?.terms.map((term: ImpactErrorBudgetTerm) => term.termId)).toEqual([
      "combined_system_holdout_absence",
      "lower_assembly_coupling_simplification",
      "upper_lower_interaction_simplification",
      "dynamic_stiffness_precision",
      "load_basis_precision"
    ]);
  });

  it("keeps exact, existing-corridor, missing-input, and ASTM boundaries protected", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract();
    const snapshots = Object.fromEntries(contract.boundarySnapshots.map((item) => [item.id, item]));

    expect(snapshots.exact_source_precedence).toMatchObject({
      budgetMetricIds: [],
      deltaLwDb: null,
      impactBasis: "official_floor_system_exact_match",
      lnWDb: 51,
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
    expect(snapshots.heavy_floating_existing_corridor_preserved).toMatchObject({
      budgetMetricIds: [],
      deltaLwDb: 24.3,
      impactBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      lnWDb: 50.3,
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: []
    });
    expect(snapshots.missing_load_published_anchor_preserved).toMatchObject({
      budgetMetricIds: [],
      deltaLwDb: null,
      impactBasis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      lnWDb: 47,
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
    expect(snapshots.missing_lower_treatment_blocks_runtime).toMatchObject({
      budgetMetricIds: [],
      deltaLwDb: null,
      impactBasis: null,
      lnWDb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(snapshots.missing_dynamic_stiffness_blocks_runtime).toMatchObject({
      budgetMetricIds: [],
      deltaLwDb: null,
      impactBasis: null,
      lnWDb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(snapshots.astm_basis_non_alias).toMatchObject({
      impactBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });
  });

  it("selects Gate BE surface parity before input surface, adapters, retune, or source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateBENextLanes();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "floor_impact_source_absent_surface_parity",
      runtimeMovementAllowedAtGateBD: false,
      score: 1.52,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor_impact_source_absent_surface_parity",
      "floor_impact_source_absent_input_surface",
      "floor_impact_field_building_adapter",
      "astm_impact_adapter",
      "floor_impact_source_absent_tolerance_retune",
      "broad_floor_source_row_crawl"
    ]);
    expect(candidates.at(-1)).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BD closeout and Gate BE selection", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBD();

    expect(summary).toEqual({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
      runtimeBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      runtimeDeltaLwDb: 30.1,
      runtimeLnWDb: 44.4,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
      surfaceParitySelectedBeforeInputSurfaceOrSourceCrawl: true
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor-impact source-absent surface parity");
      expect(content, path).toContain("Ln,w 44.4");
      expect(content, path).toContain("DeltaLw 30.1");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts"
    );
  });
});
