import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTION_STATUS,
  buildPersonalUseMvpCoverageSprintGateAScenarioMatrix,
  rankPersonalUseMvpCoverageSprintGateBLanes,
  summarizePersonalUseMvpCoverageSprintGateA,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_A = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_LANDED_GATE,
  matrixRows: 24,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_A_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/steel-floor-formula-input-surface.ts",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md"
] as const;

const EXPECTED_ROW_IDS = [
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
  "hostile.invalid_thickness_zero.refused"
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

describe("Personal-Use MVP Coverage Sprint Gate A scenario matrix", () => {
  it("lands the executable coverage matrix and selects the timber/CLT floor-impact DeltaLw Gate B lane", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_A).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_a_personal_use_mvp_coverage_matrix_plan",
      matrixRows: 24,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts",
      selectionStatus:
        "gate_a_personal_use_mvp_coverage_matrix_landed_no_runtime_selected_timber_clt_floor_impact_delta_lw_gate_b",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_A_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("covers the 24 common and hostile wall/floor rows with every required matrix field", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateA(rows);

    expect(rows.map((row) => row.id)).toEqual([...EXPECTED_ROW_IDS]);
    expect(summary).toMatchObject({
      noRuntimeValueMovement: true,
      routeCoverage: ["wall", "floor"],
      rowCount: 24,
      selectedGateBLane: "timber_clt_floor_impact_delta_lw",
      selectedNextAction: "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan"
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
      "unsupported_metric"
    ]);

    for (const row of rows) {
      expect(row.route, row.id).toMatch(/^(wall|floor)$/u);
      expect(row.family, row.id).toContain("_");
      expect(row.requestedMetrics.length, row.id).toBeGreaterThan(0);
      expect(row.valueOrBlockedReason.length, row.id).toBeGreaterThan(10);
      expect(row.originSupportBucket.length, row.id).toBeGreaterThan(5);
      expect(row.toleranceOrErrorBudget.length, row.id).toBeGreaterThan(5);
      expect(row.visibleSurfaceParityTarget.length, row.id).toBeGreaterThanOrEqual(6);
      expect(row.runtime.publicEntryPoint, row.id).toMatch(
        /^(calculateAssembly|calculateImpactOnly|buildDynamicCalculatorRouteInputTopologyAssessment|buildSteelFloorFormulaPredictorInputFromSurface)$/u
      );
      expect(row.runtime.supportedTargetOutputs, row.id).toBeDefined();
      expect(row.runtime.unsupportedTargetOutputs, row.id).toBeDefined();
    }
  });

  it("pins representative numeric rows from current engine entry points", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix();

    expect(values(byId(rows, "wall.single_leaf_heavy_concrete_masonry.lab"))).toMatchObject({
      C: -1,
      Ctr: -6.5,
      Rw: 58,
      STC: 59
    });
    expect(byId(rows, "wall.single_leaf_heavy_concrete_masonry.lab")).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        errorBudgetDb: 4,
        origin: "family_physics_prediction",
        selectedMethod: "ks_rw_calibrated"
      }
    });

    expect(values(byId(rows, "wall.grouped_triple_leaf_50_50_mineral_wool.lab"))).toMatchObject({
      Rw: 50,
      STC: 55
    });
    expect(values(byId(rows, "wall.grouped_triple_leaf_non_50_50_construction_image.lab"))).toMatchObject({
      Rw: 55,
      STC: 56
    });
    expect(byId(rows, "wall.grouped_triple_leaf_non_50_50_construction_image.lab").runtime.selectedMethod).toBe(
      "triple_leaf_two_cavity_frequency_solver"
    );

    expect(values(byId(rows, "floor.heavy_concrete_floating_floor.lab"))).toMatchObject({
      DeltaLw: 26.9,
      "Ln,w": 44.9
    });
    expect(values(byId(rows, "floor.lightweight_steel_complete_formula.lab"))).toMatchObject({
      DeltaLw: 22.4,
      "Ln,w": 55.6
    });
    expect(byId(rows, "floor.lightweight_steel_complete_formula.lab")).toMatchObject({
      currentPosture: "family_physics",
      runtime: {
        basisId: "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate",
        errorBudgetDb: 4.5,
        publicEntryPoint: "buildSteelFloorFormulaPredictorInputFromSurface"
      }
    });
  });

  it("pins blocked and partial-output rows without fabricating missing physics or unsupported ratings", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix();

    expect(byId(rows, "wall.flat_list_multicavity_ambiguity.needs_input")).toMatchObject({
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
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

    expect(byId(rows, "wall.missing_field_context.needs_input").runtime.missingPhysicalInputs).toEqual([
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(byId(rows, "floor.heavy_concrete_floating_floor_missing_load.needs_input").runtime.missingPhysicalInputs)
      .toEqual(["loadBasisKgM2"]);
    expect(byId(rows, "floor.lightweight_steel_duplicate_carrier.refused")).toMatchObject({
      currentPosture: "needs_input",
      failureClass: "hostile_input_refusal",
      runtime: {
        basisId: "unsafe_topology",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
      }
    });
    expect(byId(rows, "hostile.invalid_thickness_zero.refused")).toMatchObject({
      currentPosture: "needs_input",
      runtime: {
        basisId: "invalid_positive_thickness_validation",
        missingPhysicalInputs: ["thicknessMm"]
      }
    });
  });

  it("keeps lab, field, and ASTM bases separated in the matrix", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix();
    const exactSteel = byId(rows, "floor.lightweight_steel_exact_source_precedence.lab");
    const timberField = byId(rows, "floor.complete_field_impact_context.lprime");
    const astmBoundary = byId(rows, "floor.astm_iic_aiic_boundary.unsupported");

    expect(exactSteel).toMatchObject({
      currentPosture: "exact",
      originSupportBucket: "exact_floor_system_precedence",
      runtime: {
        basisId: "official_floor_system_exact_match",
        supportedTargetOutputs: ["Ln,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(exactSteel)).toEqual({ "Ln,w": 51 });

    expect(timberField).toMatchObject({
      basis: "field_apparent",
      currentPosture: "source_anchored_delta",
      runtime: {
        basisId: "mixed_exact_plus_estimated_local_guide",
        supportedTargetOutputs: ["L'n,w", "L'nT,w"],
        unsupportedTargetOutputs: []
      }
    });
    expect(values(timberField)).toEqual({ "L'n,w": 53, "L'nT,w": 50.6 });

    expect(astmBoundary).toMatchObject({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["IIC", "AIIC"]
      }
    });
    expect(values(astmBoundary)).toEqual({});
  });

  it("selects exactly one Gate B lane by coverage ROI and accuracy risk", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix();
    const selection = rankPersonalUseMvpCoverageSprintGateBLanes(rows);

    expect(selection.candidates.map((candidate) => ({
      id: candidate.id,
      score: candidate.score,
      selected: candidate.selected
    }))).toEqual([
      { id: "generalized_wall_multicavity_triple_leaf", score: 2, selected: false },
      { id: "lined_masonry_clt_wall_upgrade", score: 7.2, selected: false },
      { id: "timber_clt_floor_impact_delta_lw", score: 16, selected: true },
      { id: "field_building_context_continuation", score: 2.7, selected: false }
    ]);
    expect(selection.selectedCandidate.evidenceRowIds).toEqual([
      "floor.timber_joist_impact.lab",
      "floor.clt_mass_timber_impact.lab",
      "floor.complete_field_impact_context.lprime"
    ]);
    expect(selection.selectedNextFile).toBe(
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts"
    );
  });

  it("keeps current docs and runner pointed at Gate A and the selected Gate B lane", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_a_personal_use_mvp_coverage_matrix_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts"
      );
      expect(content).toContain("gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts"
    );
  });
});
