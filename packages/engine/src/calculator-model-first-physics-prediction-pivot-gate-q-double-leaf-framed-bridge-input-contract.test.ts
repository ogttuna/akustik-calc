import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateQDoubleLeafFramedBridgeInputContract,
  buildGateQDoubleLeafFramedBridgeScenarioPack,
  classifyGateQDoubleLeafFrameBridge
} from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_Q = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts",
  selectionStatus:
    "gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r",
  workbenchInputBehaviorChange: true
} as const;

const REQUIRED_GATE_Q_SURFACES = [
  "packages/shared/src/domain/airborne-context.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md"
] as const;

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DIRECT_FIXED_EMPTY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_LEAF_COMPLETE_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_MISSING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_plaster", thicknessMm: 3 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 30 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 3 }
] as const;

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate Q", () => {
  it("lands the double-leaf/framed bridge input contract and selects Gate R", () => {
    expect(MODEL_FIRST_GATE_Q).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts",
      selectionStatus:
        "gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r",
      workbenchInputBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_Q_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("builds a source-independent benchmark pack for the selected double-leaf/framed family", () => {
    const pack = buildGateQDoubleLeafFramedBridgeScenarioPack();

    expect(pack.map((entry) => entry.id)).toEqual([
      "gate_q_double_leaf_explicit_independent_absorbed_cavity",
      "gate_q_double_leaf_missing_bridge_and_spacing_needs_input",
      "gate_q_double_leaf_resilient_bridge_side_count_needs_input",
      "gate_q_double_leaf_direct_fixed_bridge_negative",
      "gate_q_multicavity_flat_list_stays_out_of_double_leaf"
    ]);
    expect(pack.map((entry) => entry.contract.inputCompleteness.status)).toEqual([
      "complete_with_defaults",
      "needs_input",
      "needs_input",
      "complete",
      "needs_input"
    ]);
    expect(pack.every((entry) => entry.contract.runtimeValueMovement === false)).toBe(true);
    expect(pack.every((entry) => entry.contract.runtimePromotionAllowed === false)).toBe(true);
    expect(pack.every((entry) => entry.contract.sourceRowsRequiredForInputContract === false)).toBe(
      true
    );
    expect(pack[0]?.contract.inputCompleteness.appliedDefaults).toEqual([
      expect.objectContaining({
        fieldId: "flowResistivityPaSM2",
        uncertaintyEffect: "widen_error_budget"
      })
    ]);
  });

  it("adds complete explicit double-leaf/framed route assessment without treating source absence as needs_input", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      route: "wall",
      sourceEvidenceAvailable: false,
      targetOutputs: WALL_OUTPUTS
    });
    const contract = buildGateQDoubleLeafFramedBridgeInputContract({
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      targetOutputs: WALL_OUTPUTS
    });

    expect(classifyGateQDoubleLeafFrameBridge(DOUBLE_LEAF_COMPLETE_CONTEXT)).toBe(
      "independent_frame"
    );
    expect(assessment.status).toBe("complete_with_defaults");
    expect(assessment.routeFamilies).toEqual(["double_leaf_framed_airborne"]);
    expect(assessment.missingPhysicalInputs).toEqual([]);
    expect(assessment.missingSourceEvidence).toEqual(["exact_full_stack_source_absent"]);
    expect(assessment.prompts).toEqual([]);
    expect(assessment.sourceCatalogQueueOnly).toBe(false);
    expect(assessment.sourceAbsenceBlocksOnlyExactOrCalibration).toBe(true);
    expect(assessment.inputCompletenessSet[0]).toMatchObject({
      id: "gate_q_double_leaf_framed_bridge_route_inputs",
      missingPhysicalInputs: [],
      routeFamily: "double_leaf_framed_airborne",
      status: "complete_with_defaults"
    });
    expect(assessment.inputCompletenessSet[0]?.requiredFields).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(contract.positiveScenarioIds).toEqual([
      "gate_q_double_leaf_explicit_independent_absorbed_cavity",
      "gate_q_double_leaf_missing_bridge_and_spacing_needs_input",
      "gate_q_double_leaf_resilient_bridge_side_count_needs_input"
    ]);
    expect(contract.negativeScenarioIds).toEqual([
      "gate_q_double_leaf_direct_fixed_bridge_negative",
      "gate_q_multicavity_flat_list_stays_out_of_double_leaf"
    ]);
  });

  it("turns missing bridge class, grouping, cavity depth, and spacing into exact prompts", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: DOUBLE_LEAF_MISSING_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      route: "wall",
      targetOutputs: WALL_OUTPUTS
    });

    expect(assessment.status).toBe("needs_input");
    expect(assessment.routeFamilies).toEqual(["double_leaf_framed_airborne"]);
    expect(assessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(assessment.prompts.map((prompt) => prompt.fieldId)).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(assessment.inputCompletenessSet[0]?.missingSourceEvidence).toEqual([
      "exact_full_stack_source_absent"
    ]);
  });

  it("requires resilient side count only for resilient bridge classes", () => {
    const resilient = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      route: "wall",
      targetOutputs: WALL_OUTPUTS
    });
    const directFixed = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: DIRECT_FIXED_CONTEXT,
      layers: DIRECT_FIXED_EMPTY_STACK,
      route: "wall",
      targetOutputs: WALL_OUTPUTS
    });

    expect(classifyGateQDoubleLeafFrameBridge(RESILIENT_MISSING_SIDE_COUNT_CONTEXT)).toBe(
      "resilient_bridge"
    );
    expect(resilient.status).toBe("needs_input");
    expect(resilient.missingPhysicalInputs).toEqual(["resilientBarSideCount"]);
    expect(resilient.prompts[0]).toMatchObject({
      fieldId: "resilientBarSideCount",
      promptId: "gate_q_double_leaf_resilientBarSideCount",
      source: "wall_topology"
    });

    expect(classifyGateQDoubleLeafFrameBridge(DIRECT_FIXED_CONTEXT)).toBe(
      "direct_fixed_bridge"
    );
    expect(directFixed.status).toBe("complete");
    expect(directFixed.missingPhysicalInputs).toEqual([]);
    expect(directFixed.inputCompletenessSet[0]?.status).toBe("complete");
  });

  it("keeps multi-cavity flat lists and Gate O/G runtime pins out of the Gate Q runtime move", () => {
    const multicavity = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: { contextMode: "element_lab" },
      layers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      route: "wall",
      targetOutputs: WALL_OUTPUTS
    });
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const singleGypsum = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: 12.5 }], {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(multicavity.routeFamilies).toEqual(["triple_leaf_multicavity_airborne"]);
    expect(multicavity.inputCompletenessSet.map((entry) => entry.id)).not.toContain(
      "gate_q_double_leaf_framed_bridge_route_inputs"
    );

    expect(groupedRockwool.metrics).toMatchObject({ estimatedRwDb: 50, estimatedStc: 55 });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "family_physics_prediction"
    });

    expect(singleGypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(singleGypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate Q closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts"
    );
  });
});
