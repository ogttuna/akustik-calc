import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateZScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAALanes,
  summarizePersonalUseMvpCoverageSprintGateZ
} from "./calculator-personal-use-mvp-coverage-sprint-gate-z";
import { GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD } from "./dynamic-airborne-gate-x-aac-nonhomogeneous-masonry";
import { GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD } from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Z = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_LANDED_GATE,
  matrixRows: 28,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus:
    "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_Z_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_HANDOFF.md"
] as const;

const EXPECTED_GATE_Z_ROW_IDS = [
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

describe("Personal-Use MVP Coverage Sprint Gate Z post-CLT-Ctr coverage revalidation", () => {
  it("lands a no-runtime post-Gate-Y revalidation and selects matrix v2 expansion", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Z).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan",
      matrixRows: 28,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts",
      selectionStatus:
        "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_Z_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the 28-row matrix is gap-free after Gate X and Gate Y while keeping correct blocks explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateZScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateZ(rows);

    expect(rows.map((row) => row.id)).toEqual([...EXPECTED_GATE_Z_ROW_IDS]);
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "bounded_screening", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      failureClassCoverage: ["none", "correct_block", "hostile_input_refusal", "unsupported_metric"],
      gapFreeAfterGatesXAndY: true,
      numericRuntimeValueMovement: false,
      previousSelectionStatus:
        "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z",
      remainingCoverageGapRowIds: [],
      routeCoverage: ["wall", "floor"],
      rowCount: 28,
      selectedGateAALane: "scenario_matrix_v2_realistic_combination_expansion",
      selectedNextAction: "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan"
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 0,
      correct_block: 5,
      coverage_gap: 0,
      hostile_input_refusal: 2,
      none: 20,
      unsupported_metric: 1
    });
    expect(summary.correctlyBlockedRowIds).toEqual([
      "wall.flat_list_multicavity_ambiguity.needs_input",
      "wall.missing_field_context.needs_input",
      "floor.heavy_concrete_floating_floor_missing_load.needs_input",
      "floor.lightweight_steel_duplicate_carrier.refused",
      "floor.missing_field_impact_context.needs_input",
      "floor.astm_iic_aiic_boundary.unsupported",
      "hostile.invalid_thickness_zero.refused",
      "wall.opening_leak_composite_partial.needs_input"
    ]);

    for (const row of rows) {
      for (const pin of row.runtime.valuePins) {
        expect(row.runtime.supportedTargetOutputs, `${row.id}:${pin.metric}`).toContain(pin.metric);
      }
    }
  });

  it("keeps the landed algorithmic rows numerically pinned and basis-labelled", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateZScenarioMatrix();
    const aac = byId(rows, "wall.aac_nonhomogeneous_masonry.lab");
    const cltWall = byId(rows, "wall.clt_mass_timber.lab");
    const opening = byId(rows, "wall.opening_leak_composite.lab");
    const timberFloor = byId(rows, "floor.timber_joist_impact.lab");
    const cltFloor = byId(rows, "floor.clt_mass_timber_impact.lab");
    const steelFloor = byId(rows, "floor.lightweight_steel_complete_formula.lab");

    expect(aac).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(aac)).toEqual({ C: -0.7, Ctr: -5.2, Rw: 44, STC: 44 });

    expect(cltWall).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(cltWall)).toEqual({ C: -1.2, Ctr: -6.1, Rw: 42, STC: 42 });

    expect(opening).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
        errorBudgetDb: 6,
        supportedTargetOutputs: ["Rw", "STC"],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
    expect(values(opening)).toEqual({ Rw: 38.2, STC: 39 });

    expect(timberFloor).toMatchObject({
      currentPosture: "exact",
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
      runtime: {
        basisId: "predictor_mass_timber_clt_delta_lw_formula_corridor_estimate",
        errorBudgetDb: 7.5,
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(cltFloor)).toEqual({ "DeltaLw": 22.6, "Ln,w": 50 });

    expect(steelFloor).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate",
        errorBudgetDb: 4.5,
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(steelFloor)).toEqual({ "DeltaLw": 22.4, "Ln,w": 55.6 });
  });

  it("keeps needs-input, unsupported, and basis-boundary rows out of defended numeric support", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateZScenarioMatrix();
    const flatList = byId(rows, "wall.flat_list_multicavity_ambiguity.needs_input");
    const building = byId(rows, "wall.complete_building_prediction.unsupported");
    const openingBuilding = byId(rows, "wall.opening_leak_composite_building_boundary.unsupported");
    const astm = byId(rows, "floor.astm_iic_aiic_boundary.unsupported");
    const duplicateSteel = byId(rows, "floor.lightweight_steel_duplicate_carrier.refused");

    expect(flatList).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
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
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "STC", "C", "Ctr"]
      }
    });

    expect(building).toMatchObject({
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(building)).toEqual({
      "DnT,w": 59,
      "R'w": 58
    });

    expect(openingBuilding).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: "company_internal_opening_leak_building_area_energy_runtime_corridor",
        errorBudgetDb: 10,
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: ["Rw", "STC"]
      }
    });
    expect(openingBuilding.runtime.valuePins).toEqual([
      { metric: "R'w", value: 31.6 },
      { metric: "DnT,w", value: 32.1 }
    ]);

    expect(astm).toMatchObject({
      currentPosture: "unsupported",
      failureClass: "unsupported_metric",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"],
        valuePins: []
      }
    });
    expect(duplicateSteel).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "hostile_input_refusal",
      runtime: {
        origin: "unsafe_topology",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"],
        valuePins: []
      }
    });
  });

  it("selects matrix v2 expansion ahead of high-leakage adapters and broad source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAALanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "scenario_matrix_v2_realistic_combination_expansion",
      score: 10,
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
        id: "scenario_matrix_v2_realistic_combination_expansion",
        score: 10,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "airborne_building_prediction_runtime_terms",
        score: 0.4,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "opening_leak_field_or_stc_adapter",
        score: 0.8,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "flat_multicavity_topology_input_surface",
        score: 0.9,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "astm_iic_aiic_rating_adapter",
        score: 0.7,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "broad_source_crawl",
        score: 0.1,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      }
    ]);
    expect(selection.selectionPolicy).toEqual([
      "do not select broad source crawling when current algorithmic coverage_gap rows are closed",
      "score calculator_coverage_gain * readiness / (implementation_cost + basis_leakage_risk)",
      "when the MVP matrix is gap-free, expand realistic combinations before promoting high-leakage adapters",
      "keep building-prediction, ASTM, and opening field/STC adapters parked until their basis owners are executable"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate Z closeout and Gate AA selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_LANDED_GATE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION);
      expect(content).toContain("scenario matrix v2");
      expect(content).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts"
    );
  });
});
