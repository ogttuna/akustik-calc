import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
  GATE_AB_STALE_FLAT_ORDER_CONTEXT,
  GATE_AB_UNSUPPORTED_ASTM_OUTPUTS,
  GATE_AB_WALL_FIELD_OUTPUTS,
  GATE_AB_WALL_LAB_CONTEXT,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
  GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ae";
import {
  GATE_AF_PROTECTED_GATE_AE_FLAT_MULTICAVITY_PIN,
  GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAGLanes,
  summarizePersonalUseMvpCoverageSprintGateAF
} from "./calculator-personal-use-mvp-coverage-sprint-gate-af";
import {
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ae-flat-multicavity";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AF = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE,
  matrixRows: 40,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AF_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae.ts",
  "packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AF_POST_FLAT_MULTICAVITY_REVALIDATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_HANDOFF.md",
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
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AF_POST_FLAT_MULTICAVITY_REVALIDATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AF post-flat-multicavity revalidation", () => {
  it("lands Gate AF as no-runtime post-promotion revalidation and selects the next lane", () => {
    const summary = summarizePersonalUseMvpCoverageSprintGateAF();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AF).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan",
      matrixRows: 40,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ag_personal_use_mvp_floor_formula_surface_polish_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts",
      selectionStatus:
        "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(summary).toMatchObject({
      blockedRowCount: 17,
      gateAAMatrixRows: 40,
      gapFreeAfterGateAF: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
      protectedGateAEFlatMulticavityPin: GATE_AF_PROTECTED_GATE_AE_FLAT_MULTICAVITY_PIN,
      protectedGateGGroupedTripleLeafPin: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN,
      remainingCoverageGapRowIds: [],
      selectedGateAGLane: "floor_formula_surface_polish",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AF_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the 40-row personal-use matrix gap-free after Gate AE", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(rows);
    const gateAFSummary = summarizePersonalUseMvpCoverageSprintGateAF(rows);

    expect(gateAASummary.rowCount).toBe(40);
    expect(gateAASummary.remainingCoverageGapRowIds).toEqual([]);
    expect(gateAFSummary).toMatchObject({
      blockedRowCount: 17,
      blockedRowIds: expect.arrayContaining([
        "wall.flat_multicavity_many_layer_schedule.needs_input",
        "wall.opening_leak_stc_only.unsupported",
        "floor.lightweight_steel_formula_missing_spacing.needs_input",
        "wall.complete_building_prediction.unsupported"
      ]),
      gateAAMatrixRows: 40,
      gapFreeAfterGateAF: true,
      noRuntimeValueMovement: true,
      remainingCoverageGapRowIds: []
    });
    expect(rows.map((row) => row.id)).toEqual(
      expect.arrayContaining([
        "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
        "floor.heavy_concrete_floating_floor_safe_reorder.lab",
        "wall.opening_leak_two_openings.lab",
        "wall.building_prediction_partial_context.needs_input"
      ])
    );
  });

  it("pins Gate AE flat multicavity and Gate G grouped triple-leaf values", () => {
    const flatRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const pinnedRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(flatRuntime.metrics).toMatchObject(GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS);
    expect(flatRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(flatRuntime.airborneCandidateResolution?.selectedCandidateId).toBe(
      GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
    );

    expect(pinnedRuntime.metrics).toMatchObject(GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.metrics);
    expect(pinnedRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.errorBudgetDb,
      method: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.method,
      origin: "family_physics_prediction"
    });
    expect(pinnedRuntime.airborneCandidateResolution?.selectedCandidateId).toBe(
      GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.selectedCandidateId
    );
  });

  it("keeps stale, duplicate, missing-topology, field, building, ASTM, and IIC boundaries blocked", () => {
    const staleRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_STALE_FLAT_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const duplicateRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const missingTopologyRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const fieldAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: GATE_AB_WALL_FIELD_OUTPUTS
    });
    const astmAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      layers: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
      route: "wall",
      targetOutputs: GATE_AB_UNSUPPORTED_ASTM_OUTPUTS
    });
    const matrixRows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const buildingRow = matrixRows.find((row) => row.id === "wall.complete_building_prediction.unsupported");

    for (const result of [staleRuntime, duplicateRuntime, missingTopologyRuntime]) {
      expect(result.airborneBasis?.method).not.toBe(GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
      );
    }
    expect(fieldAssessment).toMatchObject({
      missingPhysicalInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      routeFamilies: ["triple_leaf_multicavity_airborne", "field_apparent_output_context"],
      status: "needs_input"
    });
    expect(astmAssessment).toMatchObject({
      status: "unsupported",
      unsupportedOutputs: ["IIC"]
    });
    expect(buildingRow).toMatchObject({
      basis: "building_prediction",
      expectedPosture: "unsupported",
      failureClass: "basis_boundary",
      runtime: {
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: ["R'w", "DnT,w"]
      }
    });
  });

  it("selects the post-Gate-AE lane by executable score instead of broad source crawl", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAGLanes();
    const floorPolish = selection.candidates.find((candidate) => candidate.id === "floor_formula_surface_polish");
    const openingStc = selection.candidates.find(
      (candidate) => candidate.id === "opening_leak_stc_spectrum_adapter"
    );
    const fieldBuilding = selection.candidates.find(
      (candidate) => candidate.id === "airborne_field_building_basis_expansion"
    );
    const sourceCrawl = selection.candidates.find((candidate) => candidate.id === "broad_source_crawl");
    const candidateIds: readonly string[] = selection.candidates.map((candidate) => candidate.id);

    expect(candidateIds).not.toContain("flat_multicavity_solver_broadening");
    expect(selection.selectedCandidate).toMatchObject({
      id: "floor_formula_surface_polish",
      score: 27,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.selectedCandidate.reason).toContain("Gate AE closed the flat wall solver gap");
    expect(floorPolish?.evidenceRowIds).toEqual([
      "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
      "floor.lightweight_steel_formula_missing_spacing.needs_input",
      "floor.heavy_concrete_floating_floor_safe_reorder.lab"
    ]);
    expect(openingStc).toMatchObject({ score: 21.8, selected: false });
    expect(fieldBuilding).toMatchObject({ score: 11.3, selected: false });
    expect(sourceCrawl).toMatchObject({
      score: 0.2,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(selection.selectionPolicy).toContain(
      "remove the now-landed flat_multicavity_solver_broadening lane from scoring"
    );
  });

  it("keeps docs, exports, and current-gate runner aligned with Gate AF closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor_formula_surface_polish");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const webParity = readRepoFile("apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts");

    expect(index).toContain("calculator-personal-use-mvp-coverage-sprint-gate-af");
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/flat-multicavity-topology-surface-parity.test.ts");
    expect(webParity).toContain("GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD");
  });
});
