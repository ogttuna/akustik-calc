import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateLTopologyNormalizerScenarioPack,
  normalizeDynamicCalculatorTopologyInput
} from "./dynamic-calculator-topology-normalizer";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_L = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts",
  selectionStatus:
    "gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_L_SURFACES = [
  "packages/engine/src/dynamic-calculator-topology-normalizer.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const ROLE_DEFINED_SPLIT_REORDERED_FLOOR: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 90 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 90 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate L", () => {
  it("lands topology normalizer and hostile input guard while selecting candidate resolver Gate M", () => {
    expect(MODEL_FIRST_GATE_L).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts",
      selectionStatus:
        "gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_L_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the Gate L scenario pack calculator-first and no-runtime", () => {
    const pack = buildGateLTopologyNormalizerScenarioPack();

    expect(pack).toHaveLength(3);
    expect(pack.map((entry) => entry.status)).toEqual([
      "normalized",
      "needs_input",
      "unsupported_hostile_input"
    ]);
    expect(pack.every((entry) => entry.runtimeValueMovement === false)).toBe(true);
    expect(pack.every((entry) => entry.designGradePromotionAllowed === false)).toBe(true);
    expect(pack.every((entry) => entry.topologyAutoGrouped === false)).toBe(true);
  });

  it("normalizes role-defined floor splits and safe UI reorder without moving runtime support", () => {
    const result = normalizeDynamicCalculatorTopologyInput({
      layers: ROLE_DEFINED_SPLIT_REORDERED_FLOOR,
      route: "floor",
      targetOutputs: ["Rw", "Ln,w"]
    });

    expect(result.status).toBe("normalized");
    expect(result.safeReorderApplied).toBe(true);
    expect(result.unsafeReorderBlocked).toBe(false);
    expect(result.blockers).toEqual([]);
    expect(result.actions.map((action) => action.kind)).toEqual([
      "normalized_role_defined_floor_order",
      "coalesced_contiguous_same_role_material",
      "coalesced_contiguous_same_role_material"
    ]);
    expect(result.normalizedLayers).toEqual([
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ]);
    expect(result.routeInputAssessment.status).toBe("complete");
  });

  it("preserves grouped multi-cavity wall order because topology indices are physically meaningful", () => {
    const result = normalizeDynamicCalculatorTopologyInput({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: GROUPED_SPLIT_ROCKWOOL_STACK,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.status).toBe("unchanged");
    expect(result.normalizedLayers).toEqual(GROUPED_SPLIT_ROCKWOOL_STACK);
    expect(result.actions.map((action) => action.kind)).toEqual(["preserved_order_meaningful"]);
    expect(result.blockers).toEqual([]);
    expect(result.routeInputAssessment.status).toBe("complete_with_defaults");
  });

  it("does not auto-group ACON-like flat-list multi-cavity walls and delegates missing topology prompts to Gate K", () => {
    const result = normalizeDynamicCalculatorTopologyInput({
      airborneContext: WALL_LAB_CONTEXT,
      layers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.status).toBe("needs_input");
    expect(result.topologyAutoGrouped).toBe(false);
    expect(result.normalizedLayers).toEqual(ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK);
    expect(result.blockers.map((blocker) => blocker.code)).toEqual([
      "ambiguous_multicavity_flat_list"
    ]);
    expect(result.actions.map((action) => action.kind)).toEqual([
      "preserved_order_meaningful",
      "blocked_ambiguous_multicavity_auto_grouping"
    ]);
    expect(result.routeInputAssessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
  });

  it("blocks unsafe multi-cavity reorder with trace instead of pretending the edit is invariant", () => {
    const reordered = [
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[0],
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[1],
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[2],
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[3],
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[5],
      ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK[4],
      ...ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK.slice(6)
    ] as const satisfies readonly LayerInput[];
    const result = normalizeDynamicCalculatorTopologyInput({
      airborneContext: WALL_LAB_CONTEXT,
      layers: reordered,
      previousLayers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.status).toBe("needs_input");
    expect(result.unsafeReorderBlocked).toBe(true);
    expect(result.safeReorderApplied).toBe(false);
    expect(result.blockers.map((blocker) => blocker.code)).toEqual([
      "unsafe_multicavity_reorder",
      "ambiguous_multicavity_flat_list"
    ]);
    expect(result.actions.map((action) => action.kind)).toContain("blocked_unsafe_multicavity_reorder");
  });

  it("fails closed for hostile layer counts and invalid thickness values without throwing", () => {
    const manyLayers = Array.from({ length: 70 }, () => ({
      floorRole: "base_structure" as const,
      materialId: "concrete",
      thicknessMm: 10
    }));
    const tooMany = normalizeDynamicCalculatorTopologyInput({
      layers: manyLayers,
      route: "floor",
      targetOutputs: ["Rw"]
    });
    const invalid = normalizeDynamicCalculatorTopologyInput({
      layers: [{ materialId: "concrete", thicknessMm: Number.NaN as number }],
      route: "floor",
      targetOutputs: ["Rw"]
    });

    expect(tooMany.status).toBe("needs_input");
    expect(tooMany.blockers.map((blocker) => blocker.code)).toEqual(["excessive_layer_count"]);
    expect(tooMany.normalizedLayers).toHaveLength(70);
    expect(invalid.status).toBe("unsupported_hostile_input");
    expect(invalid.blockers.map((blocker) => blocker.code)).toEqual(["invalid_layer_schema"]);
    expect(invalid.actions.map((action) => action.kind)).toEqual(["blocked_hostile_layer_input"]);
  });

  it("does not move current Dynamic Calculator runtime values while adding the normalizer contract", () => {
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const aconLike = calculateAssembly(ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(grouped.metrics).toMatchObject({
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(aconLike.metrics.estimatedRwDb).toBe(40);
    expect(aconLike.supportedTargetOutputs).toEqual([]);
    expect(aconLike.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate L closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts"
    );
  });
});
