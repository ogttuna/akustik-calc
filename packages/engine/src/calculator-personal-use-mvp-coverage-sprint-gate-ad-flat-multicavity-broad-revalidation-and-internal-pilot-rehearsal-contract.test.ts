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
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS } from "./calculator-personal-use-mvp-coverage-sprint-gate-ac";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAELanes,
  summarizePersonalUseMvpCoverageSprintGateAD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ad";
import { GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AD = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE,
  matrixRows: 40,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AD_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AD broad revalidation and internal pilot rehearsal", () => {
  it("lands Gate AD as a no-runtime broad revalidation and selects flat multicavity solver broadening", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AD).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan",
      matrixRows: 40,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts",
      selectionStatus:
        "gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AD_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the 40-row matrix gap-free and classifies internal-pilot use honestly", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(rows);
    const gateADSummary = summarizePersonalUseMvpCoverageSprintGateAD(rows);
    const classifiedRows = new Set([
      ...gateADSummary.pilotReadyRowIds,
      ...gateADSummary.controlledUseRowIds,
      ...gateADSummary.blockedRowIds
    ]);

    expect(gateAASummary.remainingCoverageGapRowIds).toEqual([]);
    expect(gateADSummary).toMatchObject({
      blockedRowCount: 15,
      gateAAMatrixRows: 40,
      gapFreeAfterGateAD: true,
      internalPilotStatus: "controlled_internal_pilot_ready_with_gate_ae_solver_broadening_next",
      noRuntimeValueMovement: true,
      numericSupportedRowCount: 25,
      previousSelectionStatus:
        "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad",
      remainingCoverageGapRowIds: [],
      selectedGateAELane: "flat_multicavity_solver_broadening",
      selectedNextAction: "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan"
    });
    expect(classifiedRows.size).toBe(40);
    expect(gateADSummary.blockedRowIds).toContain("wall.flat_multicavity_many_layer_schedule.needs_input");
    expect(gateADSummary.pilotReadyRowIds).toContain("wall.opening_leak_stc_target.lab");
    expect(gateADSummary.blockedRowIds).toContain("floor.lightweight_steel_formula_missing_spacing.needs_input");
    expect(gateADSummary.controlledUseRowIds).toContain("wall.opening_leak_two_openings.lab");
    expect(gateADSummary.pilotReadyRowIds).toContain("wall.double_leaf_split_board_layers.lab");
    expect(gateADSummary.pilotReadyRowIds).toContain("wall.grouped_triple_leaf_safe_reverse_order.lab");
  });

  it("proves the flat grouped stack is visible and now routes through the Gate AE solver", () => {
    const flatAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const flatRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const pinnedRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(flatAssessment).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      status: "complete_with_defaults"
    });
    expect(flatRuntime.metrics).toMatchObject({
      estimatedCDb: -0.6,
      estimatedCtrDb: -8,
      estimatedRwDb: 53,
      estimatedStc: 57
    });
    expect(flatRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(pinnedRuntime.metrics).toMatchObject({
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(pinnedRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
  });

  it("selects the next lane by algorithmic ROI rather than broad source crawling", () => {
    const selection = rankPersonalUseMvpCoverageSprintGateAELanes();
    const sourceCrawl = selection.candidates.find((candidate) => candidate.id === "broad_source_crawl");
    const fieldBuilding = selection.candidates.find(
      (candidate) => candidate.id === "airborne_field_building_basis_expansion"
    );
    const openingStc = selection.candidates.find(
      (candidate) => candidate.id === "opening_leak_stc_spectrum_adapter"
    );

    expect(selection.selectedCandidate).toMatchObject({
      id: "flat_multicavity_solver_broadening",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selection.selectedCandidate.reason).toContain("source-absent flat multicavity stacks");
    expect(sourceCrawl).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(fieldBuilding).toMatchObject({ selected: false });
    expect(openingStc).toMatchObject({ selected: false });
    expect(selection.selectedCandidate.score).toBeGreaterThan(sourceCrawl?.score ?? 0);
    expect(selection.selectionPolicy).toContain(
      "prefer algorithmic source-absent solver coverage when explicit physical inputs already exist"
    );
  });

  it("keeps docs, exports, and the current-gate runner aligned with Gate AD closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE);
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("calculator-personal-use-mvp-coverage-sprint-gate-ad");
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/flat-multicavity-topology-surface-parity.test.ts");
    expect(runner).toContain("features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts");
  });
});
