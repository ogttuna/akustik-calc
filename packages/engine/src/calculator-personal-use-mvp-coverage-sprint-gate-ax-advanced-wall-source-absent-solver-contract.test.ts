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
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aw";
import {
  buildPersonalUseMvpCoverageSprintGateAXContract,
  buildPersonalUseMvpCoverageSprintGateAXScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAX
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ax";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AX = {
  apiShapeChange: false,
  broadSourceCrawlSelected: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
  previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
  previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AX_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AX advanced wall source-absent solver contract", () => {
  it("lands Gate AX as a no-runtime advanced wall input contract and selects Gate AY", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AX).toEqual({
      apiShapeChange: false,
      broadSourceCrawlSelected: false,
      evidencePromotion: false,
      landedGate: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan",
      previousSelectedNextAction: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
      previousSelectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts",
      previousSelectionStatus:
        "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax",
      selectedNextAction: "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts",
      selectionStatus:
        "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay",
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AX_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("turns Gate AW's selected wall gaps into explicit physical owner groups", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAXContract();
    const summary = summarizePersonalUseMvpCoverageSprintGateAX();

    expect(contract).toMatchObject({
      acceptedGateAWSolverGapIds: [
        "wall.flat_multicavity.ambiguous_needs_input_boundary",
        "wall.mixed_n_layer_multicavity.generalized_solver_gap",
        "wall.multicavity_direct_curve.frequency_solver_gap",
        "wall.framed_resilient_split_layers.direct_curve_gap"
      ],
      activeRuntimeBudgetAtGateAX: false,
      fieldAndBuildingOutputsBlockedAtGateAX: ["R'w", "DnT,w"],
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedAtGateAX: false,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
      sourceRowsRequiredForGateAX: false,
      wallLabOutputsOwnedByContract: ["Rw", "STC", "C", "Ctr"]
    });
    expect(summary).toMatchObject({
      allScenariosFailClosedOrReadyForLaterRuntime: true,
      completeScenarioId: "gate_ax_complete_mixed_n_layer_wall_ready_for_runtime_gate",
      fieldAndBuildingAliasAllowed: false,
      requiredPhysicalFieldCount: 41,
      scenarioCount: 8
    });
    expect(summary.ownerGroupIds).toEqual([
      "route_basis_and_metric_owner",
      "explicit_leaf_and_cavity_topology_owner",
      "panel_dynamic_property_owner",
      "cavity_absorber_property_owner",
      "frame_and_coupling_property_owner",
      "opening_leak_sub_element_owner",
      "direct_curve_and_rating_adapter_owner",
      "hostile_input_guard_owner",
      "source_absent_uncertainty_visibility_owner"
    ]);
  });

  it("requires direct-curve panel, cavity, coupling, opening, rating, and budget inputs before runtime", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAXContract();
    const groups = new Map(contract.ownerGroups.map((group) => [group.id, group]));

    expect(groups.get("panel_dynamic_property_owner")?.requiredFields).toEqual([
      "panelMaterialClass",
      "panelThicknessMm",
      "panelSurfaceMassKgM2",
      "panelBendingStiffnessNm",
      "panelLossFactor",
      "panelCriticalFrequencyHz"
    ]);
    expect(groups.get("cavity_absorber_property_owner")?.requiredFields).toEqual([
      "cavityDepthMm",
      "absorberThicknessMm",
      "absorberCoverageRatio",
      "absorberFlowResistivityPaSM2",
      "cavitySealState"
    ]);
    expect(groups.get("frame_and_coupling_property_owner")?.requiredFields).toEqual([
      "frameMaterialClass",
      "frameSpacingMm",
      "frameDepthMm",
      "frameLineCouplingStiffnessMNPerM3",
      "resilientConnectionType",
      "resilientConnectionStiffnessMNPerM3",
      "mechanicalBridgeAreaRatio"
    ]);
    expect(groups.get("opening_leak_sub_element_owner")?.requiredFields).toEqual([
      "openingIntent",
      "hostWallAreaM2",
      "openingSubElementIds",
      "openingAreaM2",
      "openingElementRw",
      "openingRatingBasis",
      "openingSealLeakageClass",
      "openingOrigin"
    ]);
    expect(groups.get("direct_curve_and_rating_adapter_owner")?.requiredFields).toEqual([
      "frequencyBandSet",
      "directTransmissionCurveOwner",
      "iso717RwCAdapterOwner",
      "stcAdapterOwner"
    ]);
    expect(contract.budgetRequirements).toEqual([
      {
        activeAtGateAX: false,
        activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
        budgetDb: 8,
        metric: "Rw",
        posture: "source_absent_design_budget_required_before_runtime"
      },
      {
        activeAtGateAX: false,
        activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
        budgetDb: 8,
        metric: "STC",
        posture: "source_absent_design_budget_required_before_runtime"
      },
      {
        activeAtGateAX: false,
        activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
        budgetDb: 3,
        metric: "C",
        posture: "source_absent_design_budget_required_before_runtime"
      },
      {
        activeAtGateAX: false,
        activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
        budgetDb: 3,
        metric: "Ctr",
        posture: "source_absent_design_budget_required_before_runtime"
      }
    ]);
    expect(contract.ownerGroups.every((group) => group.runtimePromotionAllowedAtGateAX === false)).toBe(true);
  });

  it("keeps complete, partial, hostile, exact-source, and field/building scenarios fail-closed", () => {
    const scenarios = Object.fromEntries(
      buildPersonalUseMvpCoverageSprintGateAXScenarioPack().map((scenario) => [scenario.id, scenario])
    );

    expect(scenarios.gate_ax_complete_mixed_n_layer_wall_ready_for_runtime_gate).toMatchObject({
      broadSourceCrawlRequired: false,
      missingPhysicalInputs: [],
      runtimePromotionAllowedAtGateAX: false,
      status: "ready_for_runtime_gate"
    });
    expect(scenarios.gate_ax_missing_panel_dynamic_inputs_needs_input).toMatchObject({
      blockedReason: "panel_dynamic_inputs_missing",
      missingPhysicalInputs: [
        "panelBendingStiffnessNm",
        "panelLossFactor",
        "panelCriticalFrequencyHz"
      ],
      status: "needs_input"
    });
    expect(scenarios.gate_ax_missing_cavity_absorber_inputs_needs_input).toMatchObject({
      missingPhysicalInputs: [
        "cavityDepthMm",
        "absorberCoverageRatio",
        "absorberFlowResistivityPaSM2"
      ],
      status: "needs_input"
    });
    expect(scenarios.gate_ax_partial_opening_leak_sub_elements_needs_input).toMatchObject({
      missingPhysicalInputs: [
        "openingIntent",
        "hostWallAreaM2",
        "openingAreaM2",
        "openingElementRw",
        "openingRatingBasis",
        "openingSealLeakageClass"
      ],
      status: "needs_input"
    });
    expect(scenarios.gate_ax_flat_duplicate_split_topology_invalid).toMatchObject({
      blockedReason: "flat_list_or_duplicate_ownership_cannot_be_auto_grouped",
      missingPhysicalInputs: [
        "leafGrouping",
        "panelLayerOwnership",
        "cavitySequence",
        "duplicateOwnershipGuard",
        "splitLayerGuard"
      ],
      status: "invalid_topology"
    });
    expect(scenarios.gate_ax_exact_same_stack_source_precedence).toMatchObject({
      delegatedRoute: "exact_source_candidate_resolver",
      exactSourcePrecedenceApplied: true,
      status: "exact_source_precedence"
    });
    expect(scenarios.gate_ax_field_building_outputs_blocked).toMatchObject({
      basis: "field_or_building_boundary",
      fieldOrBuildingAliasAllowed: false,
      requestedMetrics: ["R'w", "DnT,w"],
      status: "unsupported_boundary"
    });
    expect(scenarios.gate_ax_existing_grouped_triple_leaf_delegate_not_superseded).toMatchObject({
      delegatedRoute: "triple_leaf_two_cavity_frequency_solver",
      status: "delegated_to_existing_owned_route"
    });
  });

  it("does not supersede current grouped triple-leaf runtime values while Gate AX is contract-only", () => {
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
    expect(buildPersonalUseMvpCoverageSprintGateAXContract().noRuntimeValueMovement).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with Gate AX closeout and Gate AY selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE);
      expect(content, path).toContain("advanced wall source-absent solver contract");
      expect(content, path).toContain("Gate AY");
      expect(content, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts"
    );
  });
});
