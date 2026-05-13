import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-av";
import {
  buildPersonalUseMvpCoverageSprintGateAWCartography,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAXLanes,
  summarizePersonalUseMvpCoverageSprintGateAW
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aw";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AW = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
  sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AW_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AW source-absent solver gap cartography", () => {
  it("lands Gate AW as no-runtime executable cartography and selects Gate AX", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AW).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan",
      previousSelectionStatus:
        "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw",
      selectedNextAction: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts",
      selectionStatus:
        "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax",
      sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AW_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate AV handoff continuity and summarizes the current solver map", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateAW();

    expect(summary).toMatchObject({
      adapterGapCellIds: ["wall.opening_leak_composite.field_building_adapter_gap"],
      broadSourceCrawlSelected: false,
      exactSourcePrecedencePreserved: true,
      gateAVSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
      gateAVSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
      selectedGateAXLane: "advanced_wall_source_absent_solver_contract",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
      sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
      totalCells: 20,
      unsupportedBoundaryCellIds: ["floor.astm_iic_aiic.rating_adapter_gap"]
    });
    expect(summary.coveredRuntimeCellIds).toEqual([
      "wall.exact_source_precedence.same_stack_lab",
      "wall.single_leaf_massive.lab_formula_owned",
      "wall.aac_nonhomogeneous_masonry.lab_formula_owned",
      "wall.clt_mass_timber.lab_formula_owned",
      "wall.lined_massive_masonry.lab_formula_owned",
      "wall.grouped_triple_leaf.explicit_topology_formula_owned",
      "wall.opening_leak_composite.element_lab_owned",
      "wall.airborne_field_and_building.context_owned",
      "floor.lightweight_steel.impact_formula_owned",
      "floor.timber_joist.impact_formula_owned",
      "floor.clt_mass_timber.impact_formula_owned",
      "floor.field_impact.context_owned"
    ]);
    expect(summary.solverGapCellIds).toEqual([
      "wall.mixed_n_layer_multicavity.generalized_solver_gap",
      "wall.multicavity_direct_curve.frequency_solver_gap",
      "wall.framed_resilient_split_layers.direct_curve_gap",
      "floor.concrete_floating_resilient.mass_spring_gap",
      "floor.material_property_defaults.dynamic_stiffness_gap"
    ]);
  });

  it("maps realistic wall and floor layer-combination gaps without broad source crawling", () => {
    const cells = buildPersonalUseMvpCoverageSprintGateAWCartography();
    const byId = new Map(cells.map((cell) => [cell.id, cell]));

    expect(cells).toHaveLength(20);
    expect(cells.filter((cell) => cell.currentStatus === "solver_gap").map((cell) => cell.id)).toEqual([
      "wall.mixed_n_layer_multicavity.generalized_solver_gap",
      "wall.multicavity_direct_curve.frequency_solver_gap",
      "wall.framed_resilient_split_layers.direct_curve_gap",
      "floor.concrete_floating_resilient.mass_spring_gap",
      "floor.material_property_defaults.dynamic_stiffness_gap"
    ]);
    expect(byId.get("wall.mixed_n_layer_multicavity.generalized_solver_gap")).toMatchObject({
      gapOwner: "advanced_wall_source_absent_solver_contract",
      hostileVariant: "panels_cavities_studs_resilient_links_openings_mixed",
      priority: 1,
      route: "wall"
    });
    expect(byId.get("wall.flat_multicavity.ambiguous_needs_input_boundary")).toMatchObject({
      currentStatus: "needs_input_boundary",
      gapOwner: "advanced_wall_source_absent_solver_contract",
      hostileVariant: "flat_many_layer_ambiguous_order"
    });
    expect(byId.get("floor.concrete_floating_resilient.mass_spring_gap")).toMatchObject({
      gapOwner: "floor_impact_source_absent_solver_cartography",
      route: "floor"
    });
    expect(cells.some((cell) => cell.nextAction.includes("broad source"))).toBe(false);
  });

  it("selects the advanced wall direct-curve contract before floor/adapters/calibration/source crawl", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateAXLanes();
    const selected = candidates.find((candidate) => candidate.selected);
    const broadCrawl = candidates.find((candidate) => candidate.id === "broad_source_row_crawl");

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "advanced_wall_source_absent_solver_contract",
      runtimeMovementAllowedAtGateAW: false,
      score: 1.72,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(broadCrawl).toMatchObject({
      broadSourceCrawl: true,
      runtimeMovementAllowedAtGateAW: false,
      score: 0.16,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "advanced_wall_source_absent_solver_contract",
      "floor_impact_source_absent_solver_cartography",
      "opening_leak_building_adapter_contract",
      "astm_impact_rating_adapter_contract",
      "calibration_budget_tightening_with_holdouts",
      "broad_source_row_crawl"
    ]);
    expect(candidates.every((candidate) => candidate.runtimeMovementAllowedAtGateAW === false)).toBe(true);
  });

  it("keeps exact-source, needs-input, unsupported, and basis boundaries explicit", () => {
    const cells = buildPersonalUseMvpCoverageSprintGateAWCartography();
    const exact = cells.find((cell) => cell.id === "wall.exact_source_precedence.same_stack_lab");
    const needsInput = cells.find((cell) => cell.id === "wall.flat_multicavity.ambiguous_needs_input_boundary");
    const unsupported = cells.find((cell) => cell.id === "floor.astm_iic_aiic.rating_adapter_gap");
    const openingField = cells.find((cell) => cell.id === "wall.opening_leak_composite.field_building_adapter_gap");

    expect(exact).toMatchObject({
      currentSupportBucket: "source_exact_or_anchor",
      currentStatus: "runtime_owned",
      gapOwner: null
    });
    expect(needsInput).toMatchObject({
      currentSupportBucket: "explicit_boundary",
      currentStatus: "needs_input_boundary"
    });
    expect(unsupported).toMatchObject({
      basis: "astm_rating_boundary",
      currentSupportBucket: "explicit_boundary",
      currentStatus: "unsupported_boundary",
      metrics: ["IIC", "AIIC"]
    });
    expect(openingField).toMatchObject({
      basis: "field_apparent",
      currentStatus: "adapter_gap",
      metrics: ["R'w", "DnT,w"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AW closeout and Gate AX selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE);
      expect(content, path).toContain("advanced wall source-absent solver contract");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts"
    );
  });
});
