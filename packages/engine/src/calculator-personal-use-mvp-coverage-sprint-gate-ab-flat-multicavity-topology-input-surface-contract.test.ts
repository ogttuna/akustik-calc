import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS,
  GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
  GATE_AB_EMPTY_CAVITY_GROUP_CONTEXT,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_NO_TOPOLOGY_MISSING_FIELDS,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
  GATE_AB_STALE_FLAT_ORDER_CONTEXT,
  GATE_AB_UNSUPPORTED_ASTM_OUTPUTS,
  GATE_AB_WALL_FIELD_OUTPUTS,
  GATE_AB_WALL_LAB_CONTEXT,
  GATE_AB_WALL_LAB_OUTPUTS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAB
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AB = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AB_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AB flat multicavity topology input surface", () => {
  it("lands Gate AB as an engine/shared input contract and selects surface parity next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AB).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan",
      numericRuntimeBehaviorChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_landed_selected_surface_parity_gate_ac",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    expect(summarizePersonalUseMvpCoverageSprintGateAB()).toMatchObject({
      completeTopologyOwnerFields: [...GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS],
      noRuntimeValueMovement: true,
      selectedNextAction: "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan"
    });

    for (const path of REQUIRED_GATE_AB_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps ambiguous flat many-layer multicavity schedules in needs_input with precise prompts", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_WALL_LAB_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(assessment).toMatchObject({
      missingPhysicalInputs: [...GATE_AB_NO_TOPOLOGY_MISSING_FIELDS],
      outputBasis: "element_lab",
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      runtimeValueMovement: false,
      sourceAbsenceBlocksOnlyExactOrCalibration: true,
      status: "needs_input",
      unsupportedOutputs: []
    });
    expect(assessment.prompts.map((prompt) => prompt.fieldId)).toEqual([
      ...GATE_AB_NO_TOPOLOGY_MISSING_FIELDS
    ]);
    expect(assessment.inputCompletenessSet[0]).toMatchObject({
      conditionalFields: ["cavity1FillCoverage", "cavity2FillCoverage", "absorberClass"],
      id: "gate_k_triple_leaf_multicavity_route_inputs",
      requiredFields: [
        "leafGrouping",
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      routeFamily: "triple_leaf_multicavity_airborne"
    });
  });

  it("marks a complete grouped owner set as topology-ready without source-row promotion", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const contract = assessment.inputCompletenessSet.find(
      (entry) => entry.routeFamily === "triple_leaf_multicavity_airborne"
    );
    const ownedFields = new Set([
      ...(contract?.requiredFields ?? []),
      ...(contract?.conditionalFields ?? [])
    ]);

    expect(assessment).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      sourceCatalogQueueOnly: false,
      status: "complete_with_defaults"
    });
    expect(contract).toMatchObject({
      appliedDefaults: [
        {
          fieldId: "flowResistivityPaSM2",
          uncertaintyEffect: "widen_error_budget"
        }
      ],
      missingPhysicalInputs: [],
      missingSourceEvidence: ["exact_full_stack_source_absent"],
      routeFamily: "triple_leaf_multicavity_airborne"
    });
    for (const field of GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS) {
      expect(ownedFields.has(field), field).toBe(true);
    }
  });

  it("refuses stale flat-mode, duplicate, and empty group ownership before route completion", () => {
    const cases: readonly { context: AirborneContext; name: string }[] = [
      {
        context: GATE_AB_STALE_FLAT_ORDER_CONTEXT,
        name: "flat_layer_order_with_stale_groups"
      },
      {
        context: GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
        name: "duplicate_group_index"
      },
      {
        context: GATE_AB_EMPTY_CAVITY_GROUP_CONTEXT,
        name: "empty_cavity_group"
      }
    ];

    for (const { context, name } of cases) {
      const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
        airborneContext: context,
        layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
        route: "wall",
        targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
      });

      expect(assessment.status, name).toBe("needs_input");
      expect(assessment.missingPhysicalInputs, name).toContain("leafGrouping");
      expect(assessment.inputCompletenessSet[0]?.missingPhysicalInputs, name).toContain("leafGrouping");
    }
  });

  it("keeps grouped runtime pins and field/ASTM basis boundaries separate", () => {
    const groupedRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const fieldAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      layers: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
      route: "wall",
      targetOutputs: GATE_AB_WALL_FIELD_OUTPUTS
    });
    const astmAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      layers: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
      route: "wall",
      targetOutputs: GATE_AB_UNSUPPORTED_ASTM_OUTPUTS
    });

    expect(groupedRuntime.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedStc: 55
    });
    expect(groupedRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
    expect(groupedRuntime.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

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
  });

  it("keeps docs and the current-gate runner aligned with Gate AB closeout and Gate AC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts"
    );
  });
});
