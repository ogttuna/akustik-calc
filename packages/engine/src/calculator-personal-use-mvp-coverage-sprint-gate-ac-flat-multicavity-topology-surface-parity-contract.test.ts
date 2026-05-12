import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_FILE,
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_PARITY_FILE,
  GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS,
  GATE_AC_SURFACE_PARITY_TARGETS,
  GATE_AC_WALL_LAB_OUTPUTS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAC
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ac";
import { GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AC = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: true
} as const;

const REQUIRED_GATE_AC_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts",
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_FILE,
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_PARITY_FILE,
  "apps/web/features/workbench/simple-workbench-wall-topology.ts",
  "apps/web/features/workbench/workbench-store.ts",
  "apps/web/features/workbench/scenario-analysis.ts",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/app/api/estimate/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AC flat multicavity topology surface parity", () => {
  it("lands Gate AC as a no-runtime surface-parity gate and selects Gate AD revalidation", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AC).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan",
      numericRuntimeBehaviorChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts",
      selectionStatus:
        "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: true
    });

    expect(summarizePersonalUseMvpCoverageSprintGateAC()).toEqual({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
      surfaceLabel: GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
      surfaceParityTargets: [...GATE_AC_SURFACE_PARITY_TARGETS],
      topologyOwnerFields: [...GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS]
    });

    expect(GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS).toEqual([
      ...GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS
    ]);
    expect(GATE_AC_SURFACE_PARITY_TARGETS).toEqual([
      "workbench_card",
      "saved_replay",
      "calculator_api",
      "markdown_report"
    ]);

    for (const path of REQUIRED_GATE_AC_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries complete topology through the current Gate AE runtime solver surface", () => {
    const flatAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: GATE_AC_WALL_LAB_OUTPUTS
    });
    const flatRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AC_WALL_LAB_OUTPUTS
    });
    const pinnedRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AC_WALL_LAB_OUTPUTS
    });

    expect(flatAssessment).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      status: "complete_with_defaults"
    });
    expect(flatRuntime.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedCDb: -0.6,
      estimatedCtrDb: -8,
      estimatedStc: 57
    });
    expect(flatRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(flatRuntime.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(pinnedRuntime.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedStc: 55
    });
    expect(pinnedRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
  });

  it("requires workbench, saved replay, API, and Markdown report parity for the same owner fields", () => {
    const webSurface = readRepoFile(GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_FILE);
    const webParityTest = readRepoFile(GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_PARITY_FILE);

    expect(webSurface).toContain("WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL");
    expect(webSurface).toContain("not measured evidence");
    expect(webSurface).toContain("getGateACFlatMulticavityTopologyReportLines");

    for (const ownerField of [
      "airborneWallSideALeafLayerIndices",
      "airborneWallCavity1LayerIndices",
      "airborneWallCavity1DepthMm",
      "airborneWallInternalLeafLayerIndices",
      "airborneWallInternalLeafCoupling",
      "airborneWallCavity2LayerIndices",
      "airborneWallCavity2DepthMm",
      "airborneWallSideBLeafLayerIndices",
      "airborneWallSupportTopology"
    ] as const) {
      expect(webParityTest, ownerField).toContain(ownerField);
    }

    expect(webParityTest).toContain("saveCurrentScenario");
    expect(webParityTest).toContain("../../app/api/estimate/route");
    expect(webParityTest).toContain("composeWorkbenchReport");
  });

  it("keeps docs and the current-gate runner aligned with Gate AC closeout and Gate AD selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/flat-multicavity-topology-surface-parity.test.ts");
  });
});
