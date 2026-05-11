import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTION_STATUS,
  buildPersonalUseMvpCoverageSprintGateWScenarioMatrix,
  rankPersonalUseMvpCoverageSprintGateXLanes,
  summarizePersonalUseMvpCoverageSprintGateW,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_W = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_LANDED_GATE,
  matrixRows: 28,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus:
    "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_W_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts",
  "packages/engine/src/timber-clt-delta-lw-input-surface.ts",
  "packages/engine/src/calculate-assembly.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_V_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_HANDOFF.md"
] as const;

const EXPECTED_GATE_W_ROW_IDS = [
  "wall.single_leaf_heavy_concrete_masonry.lab",
  "wall.aac_nonhomogeneous_masonry.lab",
  "wall.laminated_board_rigid_panel.lab",
  "wall.double_leaf_independent_stud_absorbed.lab",
  "wall.resilient_bar_framed_leaf.lab",
  "wall.grouped_triple_leaf_50_50_mineral_wool.lab",
  "wall.grouped_triple_leaf_non_50_50_construction_image.lab",
  "wall.flat_list_multicavity_ambiguity.needs_input",
  "wall.lined_massive_masonry.lab",
  "wall.clt_mass_timber.lab",
  "wall.complete_field_context.rprime_dnt",
  "wall.missing_field_context.needs_input",
  "floor.heavy_concrete_floating_floor.lab",
  "floor.heavy_concrete_floating_floor_missing_load.needs_input",
  "floor.lightweight_steel_complete_formula.lab",
  "floor.lightweight_steel_duplicate_carrier.refused",
  "floor.lightweight_steel_exact_source_precedence.lab",
  "floor.timber_joist_impact.lab",
  "floor.clt_mass_timber_impact.lab",
  "floor.complete_field_impact_context.lprime",
  "floor.missing_field_impact_context.needs_input",
  "floor.astm_iic_aiic_boundary.unsupported",
  "floor.many_layer_stress_exact_stable",
  "hostile.invalid_thickness_zero.refused",
  "wall.opening_leak_composite.lab",
  "wall.opening_leak_composite_partial.needs_input",
  "wall.opening_leak_composite_building_boundary.unsupported",
  "wall.complete_building_prediction.unsupported"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing scenario row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate W coverage matrix refresh after opening/leak", () => {
  it("lands the refreshed executable matrix and selects the bounded Gate X AAC/masonry lane", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_W).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan",
      matrixRows: 28,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts",
      selectionStatus:
        "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_W_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("refreshes all original MVP rows plus the opening/building rows with supported value pins only", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateW(rows);

    expect(rows.map((row) => row.id)).toEqual([...EXPECTED_GATE_W_ROW_IDS]);
    expect(summary).toMatchObject({
      noNewRuntimeValueMovement: true,
      refreshedAfterGate:
        "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w",
      remainingCoverageGapRowIds: [
        "wall.aac_nonhomogeneous_masonry.lab",
        "wall.clt_mass_timber.lab"
      ],
      routeCoverage: ["wall", "floor"],
      rowCount: 28,
      selectedGateXLane: "aac_nonhomogeneous_masonry_wall_family_solver",
      selectedNextAction: "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan"
    });
    expect(summary.basisCoverage).toEqual([
      "element_lab",
      "field_apparent",
      "astm_rating_boundary",
      "building_prediction"
    ]);
    expect(summary.currentPostureCoverage).toEqual([
      "family_physics",
      "bounded_screening",
      "needs_input",
      "unsupported",
      "exact",
      "source_anchored_delta"
    ]);
    expect(summary.failureClassCoverage).toEqual([
      "none",
      "coverage_gap",
      "correct_block",
      "hostile_input_refusal",
      "unsupported_metric",
      "basis_boundary"
    ]);

    for (const row of rows) {
      expect(row.runtime.supportedTargetOutputs, row.id).toBeDefined();
      expect(row.runtime.unsupportedTargetOutputs, row.id).toBeDefined();
      for (const pin of row.runtime.valuePins) {
        expect(row.runtime.supportedTargetOutputs, `${row.id}:${pin.metric}`).toContain(pin.metric);
      }
    }
  });

  it("pins landed Gate B-U runtime rows and keeps remaining wall gaps explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix();
    const aac = byId(rows, "wall.aac_nonhomogeneous_masonry.lab");
    const lined = byId(rows, "wall.lined_massive_masonry.lab");
    const cltWall = byId(rows, "wall.clt_mass_timber.lab");
    const timberFloor = byId(rows, "floor.timber_joist_impact.lab");
    const cltFloor = byId(rows, "floor.clt_mass_timber_impact.lab");
    const opening = byId(rows, "wall.opening_leak_composite.lab");

    expect(aac).toMatchObject({
      currentPosture: "bounded_screening",
      failureClass: "coverage_gap",
      nextAction: "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan",
      runtime: {
        basisId: "screening_mass_law_curve_seed_v3",
        errorBudgetDb: 10,
        origin: "screening_fallback",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(values(aac)).toMatchObject({ C: -0.7, Ctr: -5.2, Rw: 44, STC: 44 });

    expect(lined).toMatchObject({
      failureClass: "none",
      originSupportBucket: "source_absent_gate_h_lined_massive_family_physics",
      runtime: {
        basisId: "gate_h_lined_massive_wall_cavity_aware_family_physics_runtime",
        errorBudgetDb: 6,
        origin: "family_physics_prediction"
      }
    });
    expect(values(lined)).toMatchObject({ C: -0.8, Ctr: -5.7, Rw: 60, STC: 60 });

    expect(cltWall).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "coverage_gap",
      runtime: {
        basisId: "gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime",
        supportedTargetOutputs: ["Rw", "STC", "C"],
        unsupportedTargetOutputs: ["Ctr"]
      }
    });
    expect(values(cltWall)).toEqual({ C: -1.2, Rw: 42, STC: 42 });

    expect(timberFloor).toMatchObject({
      currentPosture: "exact",
      originSupportBucket: "exact_Ln,w_plus_source_absent_timber_DeltaLw_formula",
      runtime: {
        basisId: "predictor_timber_joist_delta_lw_formula_corridor_estimate",
        errorBudgetDb: 7.5,
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(timberFloor)).toEqual({ "DeltaLw": 25.2, "Ln,w": 51 });

    expect(cltFloor).toMatchObject({
      currentPosture: "family_physics",
      originSupportBucket: "published_family_Ln,w_plus_source_absent_CLT_DeltaLw_formula",
      runtime: {
        basisId: "predictor_mass_timber_clt_delta_lw_formula_corridor_estimate",
        errorBudgetDb: 7.5,
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(cltFloor)).toEqual({ "DeltaLw": 22.6, "Ln,w": 50 });

    expect(opening).toMatchObject({
      currentPosture: "family_physics",
      originSupportBucket: "source_absent_opening_area_energy_formula",
      runtime: {
        basisId: "gate_s_opening_leak_composite_area_energy_runtime_corridor",
        errorBudgetDb: 6,
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["STC", "R'w", "DnT,w"]
      }
    });
    expect(values(opening)).toEqual({ Rw: 38.2 });
  });

  it("keeps missing input, field/building, ASTM/IIC, and flat multi-cavity boundaries fail-closed", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix();

    expect(byId(rows, "wall.opening_leak_composite_partial.needs_input")).toMatchObject({
      currentPosture: "needs_input",
      runtime: {
        missingPhysicalInputs: [
          "openingElementRwDb",
          "openingRatingBasis",
          "openingSealLeakageClass"
        ],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      }
    });
    expect(values(byId(rows, "wall.opening_leak_composite_partial.needs_input"))).toEqual({});

    expect(byId(rows, "wall.opening_leak_composite_building_boundary.unsupported")).toMatchObject({
      basis: "building_prediction",
      currentPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        basisId: "dynamic_calculator_building_prediction_runtime_adapter_owner_missing",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      }
    });
    expect(values(byId(rows, "wall.opening_leak_composite_building_boundary.unsupported"))).toEqual({});

    expect(byId(rows, "wall.complete_building_prediction.unsupported")).toMatchObject({
      currentPosture: "unsupported",
      nextAction: "airborne_building_prediction_runtime_terms",
      runtime: {
        missingPhysicalInputs: [],
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });

    expect(byId(rows, "floor.astm_iic_aiic_boundary.unsupported")).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"]
      }
    });

    expect(byId(rows, "wall.flat_list_multicavity_ambiguity.needs_input")).toMatchObject({
      currentPosture: "needs_input",
      runtime: {
        missingPhysicalInputs: [
          "sideALeafGroup",
          "cavity1DepthMm",
          "internalLeafGroup",
          "internalLeafCoupling",
          "cavity2DepthMm",
          "sideBLeafGroup",
          "supportTopology"
        ],
        supportedTargetOutputs: []
      }
    });
    expect(values(byId(rows, "wall.flat_list_multicavity_ambiguity.needs_input"))).toEqual({});
  });

  it("selects exactly one Gate X lane by refreshed coverage ROI without broad source crawling", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix();
    const selection = rankPersonalUseMvpCoverageSprintGateXLanes(rows);

    expect(selection.candidates.map((candidate) => ({
      id: candidate.id,
      score: candidate.score,
      selected: candidate.selected,
      sourceRowsRequiredForRuntimeSelection: candidate.sourceRowsRequiredForRuntimeSelection
    }))).toEqual([
      {
        id: "aac_nonhomogeneous_masonry_wall_family_solver",
        score: 16,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "airborne_building_prediction_runtime_terms",
        score: 1.2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "astm_iic_aiic_rating_adapter",
        score: 2,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "clt_mass_timber_ctr_spectrum_adapter",
        score: 1.6,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "flat_multicavity_autogrouping_guarded_topology",
        score: 1.6,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "targeted_aac_source_holdout_packet",
        score: 2.3,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
    expect(selection.selectedCandidate.evidenceRowIds).toEqual(["wall.aac_nonhomogeneous_masonry.lab"]);
    expect(selection.selectedNextFile).toBe(
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts"
    );
    expect(selection.selectionPolicy).toContain(
      "keep broad source crawling unselected unless a row names a source packet as the highest-impact unblocker"
    );
  });

  it("keeps docs and the current-gate runner aligned with Gate W closeout and Gate X selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts"
      );
      expect(content).toContain("gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts"
    );
  });
});
