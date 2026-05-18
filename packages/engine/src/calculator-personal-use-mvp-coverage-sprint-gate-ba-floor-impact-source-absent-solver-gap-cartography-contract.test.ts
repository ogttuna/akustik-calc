import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateBACartography,
  buildPersonalUseMvpCoverageSprintGateBAProbeSnapshot,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBBLanes,
  summarizePersonalUseMvpCoverageSprintGateBA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BA = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
  sourceAbsentSolverInputsRankedBeforeSourceCrawl: true,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_BA_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BA floor-impact source-absent solver gap cartography", () => {
  it("lands Gate BA as no-runtime floor-impact cartography and selects Gate BB", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_BA).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan",
      previousSelectionStatus:
        "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba",
      selectedNextAction: "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts",
      selectionStatus:
        "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb",
      sourceAbsentSolverInputsRankedBeforeSourceCrawl: true,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_BA_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate AZ handoff continuity and summarizes the current floor-impact map", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateBA();

    expect(summary).toMatchObject({
      adapterGapCellIds: [],
      broadSourceCrawlSelected: false,
      exactSourcePrecedencePreserved: true,
      fieldContextOwnedCellIds: ["floor.field_impact.explicit_context_owned"],
      gateAZSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION,
      gateAZSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
      needsInputBoundaryCellIds: [
        "floor.lightweight_steel.missing_formula_owners_needs_input_boundary",
        "floor.hostile_role_topology.duplicate_split_needs_input_boundary"
      ],
      noRuntimeValueMovement: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
      previousSelectionStatus:
        "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba",
      selectedGateBBLane: "floor_impact_source_absent_input_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
      sourceAbsentSolverInputsRankedBeforeSourceCrawl: true,
      totalCells: 18,
      unsupportedBoundaryCellIds: [
        "floor.astm_iic_aiic.adapter_boundary",
        "floor.building_impact.prediction_adapter_boundary"
      ]
    });
    expect(summary.ownedRuntimeCellIds).toEqual([
      "floor.exact_source_precedence.official_floor_system",
      "floor.heavy_concrete_bare.annex_c_formula_owned",
      "floor.heavy_concrete_floating.explicit_dynamic_stiffness_formula_owned",
      "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned",
      "floor.heavy_concrete_combined.upper_lower_family_anchor_owned",
      "floor.lightweight_concrete.family_estimate_boundary_owned",
      "floor.composite_panel.dry_floating_interaction_owned",
      "floor.lightweight_steel.explicit_formula_corridor_owned",
      "floor.timber_joist.delta_lw_formula_owned",
      "floor.clt_mass_timber.delta_lw_formula_owned",
      "floor.field_impact.explicit_context_owned"
    ]);
    expect(summary.solverGapCellIds).toEqual([
      "floor.material_owner_gap.dynamic_stiffness_load_basis",
      "floor.suspended_ceiling.lower_treatment_coupling_gap",
      "floor.mixed_support_family.multi_family_solver_gap"
    ]);
  }, 30000);

  it("pins actual current floor-impact runtime probes without moving values at Gate BA", () => {
    const probes = buildPersonalUseMvpCoverageSprintGateBAProbeSnapshot();

    expect(probes.exactSourcePrecedence.sourceMode).toBe("official_floor_system");
    expect(probes.exactSourcePrecedence.floorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_exact_lab_2026"
    );
    expect(probes.exactSourcePrecedence.impact).toMatchObject({
      LnW: 51,
      basis: "official_floor_system_exact_match"
    });
    expect(probes.exactSourcePrecedence.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(probes.exactSourcePrecedence.unsupportedImpactOutputs).toEqual(["DeltaLw"]);

    expect(probes.heavyConcreteFormula.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      resilientDynamicStiffnessMNm3: 30
    });
    expect(probes.heavyConcreteFormula.dynamicImpactTrace?.selectionKind).toBe("formula_estimate");
    expect(probes.heavyConcreteFormula.impact?.errorBudgets ?? []).toEqual([]);
    expect(probes.heavyConcreteFormula.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);

    expect(probes.missingLoadBoundary.impact).toMatchObject({
      LnW: 47,
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate"
    });
    expect(probes.missingLoadBoundary.impact?.DeltaLw).toBeUndefined();
    expect(probes.missingLoadBoundary.impactPredictorStatus?.readyForPlannedSolver).toBe(false);
    expect(probes.missingLoadBoundary.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(probes.missingLoadBoundary.unsupportedImpactOutputs).toEqual(["DeltaLw"]);

    expect(probes.fieldContext.impact).toMatchObject({
      LPrimeNTw: 50.3,
      LPrimeNW: 52.3,
      LnW: 50.3,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(probes.fieldContext.supportedImpactOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);

    expect(probes.astmBoundary.supportedImpactOutputs).toEqual([]);
    expect(probes.astmBoundary.unsupportedImpactOutputs).toEqual(["IIC", "AIIC"]);
    expect(probes.astmBoundary.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
  });

  it("maps owned lanes, remaining gaps, and hostile floor-layer boundaries before broad source crawling", () => {
    const cells = buildPersonalUseMvpCoverageSprintGateBACartography();
    const byId = new Map(cells.map((cell) => [cell.id, cell]));

    expect(cells).toHaveLength(18);
    expect(cells.filter((cell) => cell.currentStatus === "solver_gap").map((cell) => cell.id)).toEqual([
      "floor.material_owner_gap.dynamic_stiffness_load_basis",
      "floor.suspended_ceiling.lower_treatment_coupling_gap",
      "floor.mixed_support_family.multi_family_solver_gap"
    ]);
    expect(byId.get("floor.heavy_concrete_floating.explicit_dynamic_stiffness_formula_owned")).toMatchObject({
      currentSupportBucket: "formula_owned",
      currentStatus: "source_absent_formula_owned",
      gapOwner: "floor_impact_error_budget_surface",
      priority: 0.94
    });
    expect(byId.get("floor.material_owner_gap.dynamic_stiffness_load_basis")).toMatchObject({
      currentStatus: "solver_gap",
      gapOwner: "floor_impact_source_absent_input_contract",
      hostileVariant: "missing_dynamic_stiffness_load_basis_or_product_curve",
      priority: 0.96
    });
    expect(byId.get("floor.astm_iic_aiic.adapter_boundary")).toMatchObject({
      basis: "astm_rating_boundary",
      currentStatus: "unsupported_boundary",
      metrics: ["IIC", "AIIC"]
    });
    expect(byId.get("floor.hostile_role_topology.duplicate_split_needs_input_boundary")).toMatchObject({
      currentStatus: "needs_input_boundary",
      hostileVariant: "many_layers_duplicate_roles_split_resilient_layers"
    });
    expect(cells.some((cell) => cell.nextAction.includes("broad source"))).toBe(false);
  });

  it("selects the Gate BB floor-impact input contract before budget, adapters, retune, or source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateBBLanes();
    const selected = candidates.find((candidate) => candidate.selected);
    const broadCrawl = candidates.find((candidate) => candidate.id === "broad_source_row_crawl");

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "floor_impact_source_absent_input_contract",
      runtimeMovementAllowedAtGateBA: false,
      score: 1.64,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(broadCrawl).toMatchObject({
      broadSourceCrawl: true,
      runtimeMovementAllowedAtGateBA: false,
      score: 0.18,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor_impact_source_absent_input_contract",
      "floor_impact_error_budget_surface",
      "floor_impact_field_building_adapter_contract",
      "astm_impact_rating_adapter_contract",
      "floor_impact_formula_retune_with_holdouts",
      "broad_source_row_crawl"
    ]);
    expect(candidates.every((candidate) => candidate.runtimeMovementAllowedAtGateBA === false)).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with Gate BA closeout and Gate BB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor-impact source-absent input contract");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts"
    );
  });
});
