import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";
import {
  buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAVLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-au";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AU = {
  apiShapeChange: false,
  companyInternalDailyUseReady: true,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
  matrixRows: 41,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS,
  releaseDecision: "company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AU_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function envelopeByRouteAndBasis(
  handoff: ReturnType<typeof buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff>,
  route: "floor" | "wall",
  basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent"
) {
  const entry = handoff.metricEnvelope.find((item) => item.route === route && item.basis === basis);

  if (!entry) {
    throw new Error(`Missing Gate AU metric envelope for ${route}/${basis}`);
  }

  return entry;
}

function valuePinSet(handoff: ReturnType<typeof buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff>): Set<string> {
  return new Set(handoff.supportedValuePins.map((pin) => `${pin.metric}:${pin.value}`));
}

describe("Personal-Use MVP Coverage Sprint Gate AU daily-use release handoff", () => {
  it("lands Gate AU as the no-runtime company-internal daily-use release handoff", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AU).toEqual({
      apiShapeChange: false,
      companyInternalDailyUseReady: true,
      evidencePromotion: false,
      landedGate: "gate_au_personal_use_mvp_daily_use_release_handoff_plan",
      matrixRows: 41,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan",
      previousSelectionStatus:
        "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_landed_selected_daily_use_release_handoff_gate_au",
      releaseDecision:
        "company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts",
      selectionStatus:
        "gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AU_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("turns the Gate AT matrix into a gap-free daily-use acceptance handoff", () => {
    const matrix = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();
    const handoff = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff(matrix);

    expect(handoff).toMatchObject({
      acceptedFailClosedBoundaryRowCount: 15,
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      companyInternalDailyUseReady: true,
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      dailyUseReleaseBlockerIds: [],
      gateAtLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
      gateAtSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
      gateAtSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
      noRuntimeValueMovement: true,
      releaseRequiresBroadSourceCrawl: false,
      routeCoverage: ["wall", "floor"],
      rowCount: 41,
      selectedGateAVLane: "post_release_accuracy_and_adapter_roadmap",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
      supportedValueRowCount: 26
    });
    expect(handoff.failureClassCounts).toEqual({
      basis_boundary: 1,
      correct_block: 10,
      coverage_gap: 0,
      hostile_input_refusal: 3,
      none: 26,
      unsupported_metric: 1
    });
  });

  it("keeps supported values, needs_input rows, hostile refusals, and basis boundaries explicit", () => {
    const handoff = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff();
    const supportedRows = new Set(handoff.supportedValueRowIds);
    const boundaryRows = new Set(handoff.acceptedFailClosedBoundaryRowIds);
    const pins = valuePinSet(handoff);

    expect(supportedRows).toEqual(new Set([
      "wall.single_leaf_heavy_concrete_masonry.lab",
      "wall.aac_nonhomogeneous_masonry.lab",
      "wall.laminated_board_rigid_panel.lab",
      "wall.double_leaf_independent_stud_absorbed.lab",
      "wall.resilient_bar_framed_leaf.lab",
      "wall.grouped_triple_leaf_50_50_mineral_wool.lab",
      "wall.grouped_triple_leaf_non_50_50_construction_image.lab",
      "wall.lined_massive_masonry.lab",
      "wall.clt_mass_timber.lab",
      "wall.complete_field_context.rprime_dnt",
      "floor.heavy_concrete_floating_floor.lab",
      "floor.lightweight_steel_complete_formula.lab",
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.timber_joist_impact.lab",
      "floor.clt_mass_timber_impact.lab",
      "floor.complete_field_impact_context.lprime",
      "floor.many_layer_stress_exact_stable",
      "wall.opening_leak_composite.lab",
      "wall.complete_building_prediction.runtime",
      "wall.double_leaf_split_board_layers.lab",
      "wall.grouped_triple_leaf_safe_reverse_order.lab",
      "wall.opening_leak_two_openings.lab",
      "wall.opening_leak_stc_target.lab",
      "floor.clt_mass_timber_field_lnt50.local_guide",
      "floor.heavy_concrete_floating_floor_safe_reorder.lab",
      "wall.complete_building_prediction_broad_targets.alias_boundary"
    ]));
    expect(boundaryRows).toEqual(new Set([
      "wall.flat_list_multicavity_ambiguity.needs_input",
      "wall.missing_field_context.needs_input",
      "floor.heavy_concrete_floating_floor_missing_load.needs_input",
      "floor.lightweight_steel_duplicate_carrier.refused",
      "floor.missing_field_impact_context.needs_input",
      "floor.astm_iic_aiic_boundary.unsupported",
      "hostile.invalid_thickness_zero.refused",
      "wall.opening_leak_composite_partial.needs_input",
      "wall.opening_leak_composite_building_boundary.unsupported",
      "wall.flat_multicavity_many_layer_schedule.needs_input",
      "wall.opening_leak_duplicate_id.refused",
      "wall.building_prediction_partial_context.needs_input",
      "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
      "floor.lightweight_steel_formula_missing_spacing.needs_input",
      "floor.lightweight_steel_formula_wrong_family.inactive"
    ]));
    expect([...pins]).toEqual(expect.arrayContaining([
      "R'w:58",
      "DnT,w:59",
      "Rw:38.2",
      "STC:39",
      "Ln,w:55.6",
      "DeltaLw:22.4",
      "Ln,w:51",
      "DeltaLw:25.2"
    ]));
  });

  it("defines the daily-use metric envelope without lab, field, building, or ASTM aliasing", () => {
    const handoff = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff();
    const wallLab = envelopeByRouteAndBasis(handoff, "wall", "element_lab");
    const wallField = envelopeByRouteAndBasis(handoff, "wall", "field_apparent");
    const wallBuilding = envelopeByRouteAndBasis(handoff, "wall", "building_prediction");
    const floorLab = envelopeByRouteAndBasis(handoff, "floor", "element_lab");
    const floorField = envelopeByRouteAndBasis(handoff, "floor", "field_apparent");

    expect(wallLab.supportedMetrics).toEqual(["Rw", "STC", "C", "Ctr"] satisfies readonly RequestedOutputId[]);
    expect(wallLab.outOfScope).toEqual(["R'w", "DnT,w"] satisfies readonly RequestedOutputId[]);
    expect(wallField.supportedMetrics).toEqual(["R'w", "DnT,w"] satisfies readonly RequestedOutputId[]);
    expect(wallField.outOfScope).toEqual(["Rw", "STC"] satisfies readonly RequestedOutputId[]);
    expect(wallBuilding.supportedMetrics).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A"
    ] satisfies readonly RequestedOutputId[]);
    expect(wallBuilding.outOfScope).toEqual([] satisfies readonly RequestedOutputId[]);
    expect(floorLab.supportedMetrics).toEqual(["Ln,w", "DeltaLw", "Rw"] satisfies readonly RequestedOutputId[]);
    expect(floorLab.outOfScope).toEqual(["IIC", "AIIC", "L'nT,50"] satisfies readonly RequestedOutputId[]);
    expect(floorField.supportedMetrics).toEqual(["L'n,w", "L'nT,w"] satisfies readonly RequestedOutputId[]);
    expect(floorField.outOfScope).toEqual(["IIC", "AIIC", "L'nT,50"] satisfies readonly RequestedOutputId[]);
    expect(handoff.operatingRules).toContain("Lab, field, building-prediction, and ASTM rating bases must remain separate.");
    expect(handoff.operatingRules).toContain(
      "Opened physical fields must be filled; missing owners return needs_input with exact fields."
    );
  });

  it("selects a post-release accuracy roadmap and keeps residual risks non-blocking", () => {
    const handoff = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff();
    const selection = rankPersonalUseMvpCoverageSprintGateAVLanes();

    expect(handoff.postReleaseResidualRisks).toEqual([
      {
        id: "source_absent_formula_budget_tightening",
        releaseBlocker: false,
        resolutionLane: "post_release_accuracy_and_adapter_roadmap",
        summary:
          "Current formula budgets are visible and bounded, but tighter budgets require source-owned holdouts and residual policy gates."
      },
      {
        id: "opening_leak_building_adapter",
        releaseBlocker: false,
        resolutionLane: "opening_leak_building_adapter_runtime_after_release",
        summary:
          "Opening/leak lab Rw/STC is ready, while opening/leak building R'w/DnT,w remains an explicit unsupported basis boundary."
      },
      {
        id: "astm_iic_aiic_adapter",
        releaseBlocker: false,
        resolutionLane: "astm_iic_aiic_adapter_runtime_after_release",
        summary:
          "ASTM IIC/AIIC remains unsupported in the ISO daily-use route until a named adapter owns the rating basis."
      },
      {
        id: "direct_tolerance_movement_without_holdouts",
        releaseBlocker: false,
        resolutionLane: "direct_budget_tightening_without_holdouts",
        summary:
          "Direct retune or tolerance tightening is intentionally blocked without source-owned holdouts and paired negative boundaries."
      }
    ]);
    expect(selection.selectedCandidate).toMatchObject({
      id: "post_release_accuracy_and_adapter_roadmap",
      releaseBlocker: false,
      score: 1.4,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.candidates.map((candidate) => ({
      id: candidate.id,
      releaseBlocker: candidate.releaseBlocker,
      selected: candidate.selected
    }))).toEqual([
      {
        id: "post_release_accuracy_and_adapter_roadmap",
        releaseBlocker: false,
        selected: true
      },
      {
        id: "opening_leak_building_adapter_runtime_after_release",
        releaseBlocker: false,
        selected: false
      },
      {
        id: "astm_iic_aiic_adapter_runtime_after_release",
        releaseBlocker: false,
        selected: false
      },
      {
        id: "direct_budget_tightening_without_holdouts",
        releaseBlocker: false,
        selected: false
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AU closeout and Gate AV selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE);
      expect(content, path).toContain("company-internal daily-use ready");
      expect(content, path).toContain("post-release accuracy roadmap");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts");
  });
});
