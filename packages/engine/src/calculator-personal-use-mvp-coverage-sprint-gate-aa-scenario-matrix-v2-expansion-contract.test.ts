import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTION_STATUS,
  PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
  rankPersonalUseMvpCoverageSprintGateABLanes,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS } from "./calculator-personal-use-mvp-coverage-sprint-gate-z";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AA = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_LANDED_GATE,
  matrixRows: 40,
  matrixV2AddedRows: 12,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AA_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_HANDOFF.md"
] as const;

const EXPECTED_GATE_AA_ADDED_ROW_IDS = [
  "wall.double_leaf_split_board_layers.lab",
  "wall.grouped_triple_leaf_safe_reverse_order.lab",
  "wall.flat_multicavity_many_layer_schedule.needs_input",
  "wall.opening_leak_two_openings.lab",
  "wall.opening_leak_stc_target.lab",
  "wall.opening_leak_duplicate_id.refused",
  "wall.building_prediction_partial_context.needs_input",
  "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
  "floor.lightweight_steel_formula_missing_spacing.needs_input",
  "floor.lightweight_steel_formula_wrong_family.inactive",
  "floor.clt_mass_timber_field_lnt50.local_guide",
  "floor.heavy_concrete_floating_floor_safe_reorder.lab"
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

describe("Personal-Use MVP Coverage Sprint Gate AA scenario matrix v2 expansion", () => {
  it("lands a no-runtime matrix v2 expansion and selects the flat multi-cavity input surface", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AA).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan",
      matrixRows: 40,
      matrixV2AddedRows: 12,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts",
      selectionStatus:
        "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AA_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("expands the gap-free matrix to 40 rows and keeps blocked rows explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateAA(rows);

    expect(rows).toHaveLength(40);
    expect(summary).toMatchObject({
      basisCoverage: ["element_lab", "field_apparent", "astm_rating_boundary", "building_prediction"],
      currentPostureCoverage: ["family_physics", "needs_input", "unsupported", "exact", "source_anchored_delta"],
      failureClassCoverage: ["none", "correct_block", "hostile_input_refusal", "unsupported_metric", "basis_boundary"],
      gapFreeAfterGateAA: true,
      matrixV2AddedRowCount: 12,
      matrixV2AddedRowIds: [...EXPECTED_GATE_AA_ADDED_ROW_IDS],
      numericRuntimeValueMovement: false,
      remainingCoverageGapRowIds: [],
      routeCoverage: ["wall", "floor"],
      rowCount: 40,
      selectedGateABLane: "flat_multicavity_topology_input_surface",
      selectedNextAction: "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan"
    });
    expect(summary.failureClassCounts).toEqual({
      basis_boundary: 2,
      correct_block: 10,
      coverage_gap: 0,
      hostile_input_refusal: 3,
      none: 24,
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
      "wall.opening_leak_composite_partial.needs_input",
      "wall.opening_leak_composite_building_boundary.unsupported",
      "wall.complete_building_prediction.unsupported",
      ...EXPECTED_GATE_AA_ADDED_ROW_IDS.filter((id) =>
        ![
          "wall.double_leaf_split_board_layers.lab",
          "wall.grouped_triple_leaf_safe_reverse_order.lab",
          "wall.opening_leak_two_openings.lab",
          "wall.opening_leak_stc_target.lab",
          "floor.clt_mass_timber_field_lnt50.local_guide",
          "floor.heavy_concrete_floating_floor_safe_reorder.lab"
        ].includes(id)
      )
    ]);

    for (const row of rows) {
      for (const pin of row.runtime.valuePins) {
        expect(row.runtime.supportedTargetOutputs, `${row.id}:${pin.metric}`).toContain(pin.metric);
      }
    }
  });

  it("pins the new realistic numeric rows by value, basis, and supported metric set", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const splitDoubleLeaf = byId(rows, "wall.double_leaf_split_board_layers.lab");
    const safeTripleLeaf = byId(rows, "wall.grouped_triple_leaf_safe_reverse_order.lab");
    const openingTwo = byId(rows, "wall.opening_leak_two_openings.lab");
    const cltFieldLnt50 = byId(rows, "floor.clt_mass_timber_field_lnt50.local_guide");
    const heavyReorder = byId(rows, "floor.heavy_concrete_floating_floor_safe_reorder.lab");

    expect(splitDoubleLeaf).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime",
        errorBudgetDb: 7,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(splitDoubleLeaf)).toEqual({ C: -1.7, Ctr: -6.7, Rw: 53, STC: 53 });

    expect(safeTripleLeaf).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "triple_leaf_two_cavity_frequency_solver",
        errorBudgetDb: 5,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(safeTripleLeaf)).toEqual({ C: 0.8, Ctr: -7.3, Rw: 50, STC: 55 });

    expect(openingTwo).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["Rw", "STC"],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
    expect(values(openingTwo)).toEqual({ Rw: 33.7, STC: 34 });

    expect(cltFieldLnt50).toMatchObject({
      basis: "field_apparent",
      currentPosture: "family_physics",
      runtime: {
        basisId: "mixed_predicted_plus_estimated_local_guide",
        supportedTargetOutputs: ["L'nT,50"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(cltFieldLnt50)).toEqual({ "L'nT,50": 49 });

    expect(heavyReorder).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        supportedTargetOutputs: ["Ln,w", "DeltaLw"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(heavyReorder)).toEqual({ "DeltaLw": 32.6, "Ln,w": 39.2 });
  });

  it("keeps new hostile and partial rows out of numeric support with precise missing fields", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const flatMany = byId(rows, "wall.flat_multicavity_many_layer_schedule.needs_input");
    const openingStc = byId(rows, "wall.opening_leak_stc_target.lab");
    const duplicateOpening = byId(rows, "wall.opening_leak_duplicate_id.refused");
    const partialBuilding = byId(rows, "wall.building_prediction_partial_context.needs_input");
    const timberMissing = byId(rows, "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input");
    const steelMissing = byId(rows, "floor.lightweight_steel_formula_missing_spacing.needs_input");
    const steelWrong = byId(rows, "floor.lightweight_steel_formula_wrong_family.inactive");

    expect(flatMany).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "correct_block",
      runtime: {
        basisId: "element_lab",
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
        valuePins: []
      }
    });

    expect(openingStc).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        origin: "family_physics_prediction",
        supportedTargetOutputs: ["STC"],
        unsupportedTargetOutputs: [],
        valuePins: [{ metric: "STC", value: 39 }]
      }
    });
    expect(duplicateOpening).toMatchObject({
      currentPosture: "unsupported",
      failureClass: "hostile_input_refusal",
      runtime: {
        basisId: PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD,
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Rw", "STC"],
        valuePins: []
      }
    });

    expect(partialBuilding.runtime.missingPhysicalInputs).toEqual([
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);
    expect(partialBuilding.runtime.valuePins).toEqual([]);
    expect(timberMissing.runtime.missingPhysicalInputs).toEqual(["resilientLayerDynamicStiffnessMNm3"]);
    expect(steelMissing.runtime.missingPhysicalInputs).toEqual(["steelCarrierSpacingMm"]);
    expect(steelWrong).toMatchObject({
      currentPosture: "unsupported",
      runtime: {
        origin: "inactive",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"],
        valuePins: []
      }
    });
  });

  it("selects flat multi-cavity input ownership ahead of high-leakage adapters and source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateABLanes();

    expect(selection.selectedCandidate).toMatchObject({
      id: "flat_multicavity_topology_input_surface",
      score: 12,
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
        id: "flat_multicavity_topology_input_surface",
        score: 12,
        selected: true,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "opening_leak_stc_spectrum_adapter",
        score: 1.7,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "airborne_building_prediction_runtime_terms",
        score: 1.5,
        selected: false,
        sourceRowsRequiredForRuntimeSelection: false
      },
      {
        id: "timber_steel_floor_input_surface_polish",
        score: 1.7,
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
      "expand representative realistic and hostile rows before promoting another narrow adapter",
      "score user_frequency * blocked_or_unsupported_evidence / (implementation_cost + basis_leakage_risk)",
      "prefer low-basis-leakage input ownership when it unlocks many-layer calculator workflows",
      "keep building, ASTM, opening STC, and broad source crawling behind explicit basis owners"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate AA closeout and Gate AB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_LANDED_GATE);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTION_STATUS);
      expect(content).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION);
      expect(content).toContain("flat multicavity topology input surface");
      expect(content).toContain("scenario matrix v2");
      expect(content).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts"
    );
  });
});
