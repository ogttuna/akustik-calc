import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-au";
import {
  buildPersonalUseMvpCoverageSprintGateAVRoadmap,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAWLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-av";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AV = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
  sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AV_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md",
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
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AV post-release accuracy and adapter roadmap", () => {
  it("lands Gate AV as a no-runtime roadmap and selects Gate AW source-absent cartography", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AV).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_au_personal_use_mvp_daily_use_release_handoff_plan",
      previousSelectionStatus:
        "gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av",
      selectedNextAction: "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts",
      selectionStatus:
        "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw",
      sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AV_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves the Gate AU daily-use envelope without runtime, source, or budget movement", () => {
    const gateAU = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff();
    const roadmap = buildPersonalUseMvpCoverageSprintGateAVRoadmap();

    expect(roadmap).toMatchObject({
      acceptedBoundaryRowCount: 16,
      companyInternalDailyUseReady: true,
      exactSourcePrecedencePreserved: true,
      gateAUSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
      gateAUSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
      releaseRequiresBroadSourceCrawl: false,
      selectedGateAWLane: "source_absent_solver_gap_cartography",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
      sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
      supportedValueRowCount: 26
    });
    expect(gateAU.selectedNextAction).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE);
    expect(roadmap.roadmapRules).toContain(
      "Exact measured/source rows win only when route, topology, metric, and basis truly match."
    );
    expect(roadmap.roadmapRules).toContain(
      "Source-absent assemblies should calculate from the best owned family solver when physical inputs are complete."
    );
    expect(roadmap.roadmapRules).toContain("Missing physical owners must return needs_input with exact fields.");
  });

  it("ranks source-absent solver gap cartography ahead of broad source crawling and premature runtime", () => {
    const candidates = rankPersonalUseMvpCoverageSprintGateAWLanes();
    const selected = candidates.find((candidate) => candidate.selected);
    const broadCrawl = candidates.find((candidate) => candidate.id === "broad_source_row_crawl");

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "source_absent_solver_gap_cartography",
      runtimeMovementAllowedAtGateAV: false,
      score: 1.6,
      selected: true,
      sourceRowsRequiredForSelection: false
    });
    expect(broadCrawl).toMatchObject({
      broadSourceCrawl: true,
      runtimeMovementAllowedAtGateAV: false,
      score: 0.12,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "source_absent_solver_gap_cartography",
      "wall_multicavity_direct_curve_contract",
      "floor_impact_source_absent_solver_cartography",
      "opening_leak_building_adapter_runtime_after_cartography",
      "astm_iic_aiic_adapter_runtime_after_cartography",
      "calibration_budget_tightening_with_holdouts",
      "broad_source_row_crawl"
    ]);
    expect(candidates.every((candidate) => candidate.runtimeMovementAllowedAtGateAV === false)).toBe(true);
  });

  it("keeps current coverage surfaces visible and names the next accuracy risks", () => {
    const roadmap = buildPersonalUseMvpCoverageSprintGateAVRoadmap();

    expect(roadmap.surfaceInventory.map((surface) => [surface.id, surface.state])).toEqual([
      ["exact_source_precedence", "runtime_owned"],
      ["wall_lab_family_physics", "runtime_owned"],
      ["wall_field_context", "runtime_owned"],
      ["airborne_building_prediction_runtime", "runtime_owned"],
      ["opening_leak_lab_rw_stc", "runtime_owned"],
      ["floor_impact_lab_formula_corridors", "runtime_owned"],
      ["floor_field_context", "runtime_owned"],
      ["astm_impact_boundary", "boundary_only"]
    ]);
    expect(roadmap.riskRegister.map((risk) => risk.id)).toEqual([
      "arbitrary_n_layer_wall_source_absent_solver_gap",
      "one_number_wall_estimate_without_direct_curve",
      "floor_impact_mixed_mass_spring_gap",
      "opening_leak_field_building_adapter_gap",
      "astm_impact_rating_adapter_gap",
      "material_property_default_contract_gap",
      "budget_tightening_without_holdouts"
    ]);
    expect(roadmap.riskRegister.every((risk) => risk.blocksDailyUseRelease === false)).toBe(true);
    expect(roadmap.riskRegister[0]).toMatchObject({
      resolutionLane: "source_absent_solver_gap_cartography",
      severity: 0.95
    });
  });

  it("locks the post-Gate-AV order around direct curves, basis adapters, and later calibration", () => {
    const roadmap = buildPersonalUseMvpCoverageSprintGateAVRoadmap();

    expect(roadmap.postGateAVOrder.map((step) => ({
      action: step.action,
      gate: step.gate,
      order: step.order,
      runtimeMovementAllowed: step.runtimeMovementAllowed
    }))).toEqual([
      {
        action: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
        gate: "AW",
        order: 1,
        runtimeMovementAllowed: false
      },
      {
        action: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
        gate: "AX",
        order: 2,
        runtimeMovementAllowed: false
      },
      {
        action: "gate_ay_personal_use_mvp_selected_wall_solver_runtime_corridor_plan",
        gate: "AY",
        order: 3,
        runtimeMovementAllowed: true
      },
      {
        action: "gate_az_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan",
        gate: "AZ",
        order: 4,
        runtimeMovementAllowed: false
      },
      {
        action: "later_floor_impact_runtime_corridor_or_adapter_plan",
        gate: "later",
        order: 5,
        runtimeMovementAllowed: true
      },
      {
        action: "later_basis_adapter_and_calibration_plan",
        gate: "later",
        order: 6,
        runtimeMovementAllowed: false
      }
    ]);
  });

  it("keeps official and public research anchors tied to basis-specific calculation", () => {
    const anchors = buildPersonalUseMvpCoverageSprintGateAVRoadmap().externalReferenceAnchors;
    const anchorIds = anchors.map((anchor) => anchor.id);

    expect(anchorIds).toEqual([
      "iso_12354_1",
      "iso_12354_2",
      "iso_717_1",
      "iso_717_2",
      "astm_e413",
      "astm_e989",
      "insul",
      "acoulatis",
      "sonarchitect",
      "herrick_double_panel_review"
    ]);
    expect(anchors.find((anchor) => anchor.id === "iso_12354_1")?.role).toContain("frequency-band");
    expect(anchors.find((anchor) => anchor.id === "astm_e989")?.role).toContain("rather than an Ln,w alias");
    expect(anchors.find((anchor) => anchor.id === "herrick_double_panel_review")?.role).toContain(
      "not a single shortcut formula"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate AV closeout and Gate AW selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE);
      expect(content, path).toContain("source-absent solver gap cartography");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts"
    );
  });
});
