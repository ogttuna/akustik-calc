import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ax";
import {
  calculateGateAYAdvancedWallRuntimeCorridor,
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  buildPersonalUseMvpCoverageSprintGateAYRuntimeCorridorContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AY = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
  numericRuntimeBehaviorChange: true,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
  previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
  previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AY_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AY advanced wall source-absent solver runtime corridor", () => {
  it("lands Gate AY as a bounded runtime corridor and selects Gate AZ input surface", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AY).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan",
      numericRuntimeBehaviorChange: true,
      previousLandedGate: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
      previousSelectedNextAction:
        "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan",
      previousSelectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts",
      previousSelectionStatus:
        "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay",
      selectedNextAction:
        "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts",
      selectionStatus:
        "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az",
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AY_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete Gate AX owner input to calculated lab Rw/STC/C/Ctr with visible source-absent budgets", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAYRuntimeCorridorContract();
    const result = contract.activeRuntimeResult;

    expect(contract).toMatchObject({
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
      numericRuntimeBehaviorChange: true,
      runtimeMethod: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(result).toMatchObject({
      missingPhysicalInputs: [],
      metrics: {
        C: -1.1,
        Ctr: -6.4,
        Rw: 65,
        STC: 65
      },
      status: "runtime_corridor_promoted",
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      supportLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL,
      unsupportedTargetOutputs: []
    });
    expect(result.basis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 8,
      kind: "airborne_physics_prediction",
      measurementStandard: "none",
      method: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.curve?.frequenciesHz).toEqual([
      100,
      125,
      160,
      200,
      250,
      315,
      400,
      500,
      630,
      800,
      1000,
      1250,
      1600,
      2000,
      2500,
      3150
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution?.rejectedCandidateIds).toEqual([
      "candidate_blocked_gate_ay_advanced_wall_exact_source",
      "candidate_calibrated_gate_ay_advanced_wall_family",
      "candidate_gate_ay_advanced_wall_screening_fallback"
    ]);
    expect(result.errorBudgets).toEqual([
      expect.objectContaining({
        estimate: 65,
        max: 73,
        metricId: "Rw",
        min: 57,
        notMeasuredEvidence: true,
        origin: "source_absent_formula_error_budget",
        toleranceDb: 8
      }),
      expect.objectContaining({
        estimate: 65,
        metricId: "STC",
        notMeasuredEvidence: true,
        toleranceDb: 8
      }),
      expect.objectContaining({
        estimate: -1.1,
        metricId: "C",
        notMeasuredEvidence: true,
        toleranceDb: 3
      }),
      expect.objectContaining({
        estimate: -6.4,
        metricId: "Ctr",
        notMeasuredEvidence: true,
        toleranceDb: 3
      })
    ]);
  });

  it("does not ignore explicit opening/leak sub-elements when the advanced wall route owns them", () => {
    const withWeakDoor = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      hostWallAreaM2: 12,
      openingIntent: "present",
      openings: [
        {
          areaM2: 1.8,
          count: 1,
          elementRwDb: 32,
          id: "door-1",
          origin: "catalogued",
          ratingBasis: "rw_single_number",
          sealLeakageClass: "average"
        }
      ]
    });

    expect(withWeakDoor).toMatchObject({
      metrics: {
        C: 1.2,
        Ctr: 1.2,
        Rw: 37,
        STC: 36
      },
      status: "runtime_corridor_promoted"
    });
    expect(withWeakDoor.errorBudgets.find((budget) => budget.metricId === "Rw")).toMatchObject({
      estimate: 37,
      max: 45,
      min: 29,
      notMeasuredEvidence: true,
      toleranceDb: 8
    });
  });

  it("keeps missing physical owners parked as needs_input with no runtime budget", () => {
    const missingPanelDynamics = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel, index) =>
        index === 0
          ? {
              ...panel,
              criticalFrequencyHz: undefined,
              lossFactor: undefined
            }
          : panel
      )
    });
    const partialOpening = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      hostWallAreaM2: undefined,
      openingIntent: "present",
      openings: [
        {
          id: "partial-door"
        }
      ]
    });

    expect(missingPanelDynamics).toMatchObject({
      errorBudgets: [],
      metrics: null,
      missingPhysicalInputs: ["panelLossFactor", "panelCriticalFrequencyHz"],
      status: "needs_input"
    });
    expect(missingPanelDynamics.basis).toMatchObject({
      kind: "airborne_needs_input",
      missingPhysicalInputs: ["panelLossFactor", "panelCriticalFrequencyHz"],
      origin: "needs_input"
    });
    expect(partialOpening).toMatchObject({
      errorBudgets: [],
      metrics: null,
      missingPhysicalInputs: [
        "hostWallAreaM2",
        "openingAreaM2",
        "openingElementRw",
        "openingRatingBasis",
        "openingSealLeakageClass",
        "openingOrigin"
      ],
      status: "needs_input"
    });
  });

  it("protects exact-source precedence, owned delegates, and field/building basis boundaries", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAYRuntimeCorridorContract();
    const delegated = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      existingOwnedDelegateRoute: "triple_leaf_two_cavity_frequency_solver"
    });
    const field = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      outputBasis: "field_between_rooms",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(contract.exactSourcePrecedenceResult).toMatchObject({
      airborneCandidateResolution: null,
      errorBudgets: [],
      metrics: null,
      status: "exact_source_precedence"
    });
    expect(delegated).toMatchObject({
      errorBudgets: [],
      metrics: null,
      status: "delegated_to_existing_owned_route"
    });
    expect(field).toMatchObject({
      errorBudgets: [],
      metrics: null,
      missingPhysicalInputs: ["fieldBuildingAdapterBoundary"],
      status: "unsupported_boundary",
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(field.basis).toMatchObject({
      kind: "airborne_unsupported",
      origin: "unsupported"
    });
  });

  it("is stable under safe explicit reorders and refuses duplicate/split ownership", () => {
    const baseline = calculateGateAYAdvancedWallRuntimeCorridor(GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT);
    const safeReordered = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      cavities: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.cavities].reverse(),
      panels: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels].reverse()
    });
    const duplicatePanel = calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel, index) =>
        index === 1
          ? {
              ...panel,
              id: "panel-a",
              layerIds: ["a-gypsum-1"]
            }
          : panel
      )
    });

    expect(safeReordered.status).toBe("runtime_corridor_promoted");
    expect(safeReordered.metrics).toEqual(baseline.metrics);
    expect(safeReordered.errorBudgets).toEqual(baseline.errorBudgets);

    expect(duplicatePanel).toMatchObject({
      errorBudgets: [],
      metrics: null,
      status: "invalid_topology"
    });
    expect(duplicatePanel.missingPhysicalInputs).toEqual([
      "leafGrouping",
      "leafSequence",
      "duplicateOwnershipGuard",
      "panelLayerOwnership",
      "splitLayerGuard"
    ]);
  });

  it("does not supersede current grouped triple-leaf runtime values", () => {
    const groupedRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(groupedRuntime.metrics).toMatchObject({
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(groupedRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AY closeout and Gate AZ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE);
      expect(content, path).toContain("advanced wall source-absent solver runtime corridor");
      expect(content, path).toContain("Gate AZ");
      expect(content, path).toContain("source-absent");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts"
    );
  });
});
