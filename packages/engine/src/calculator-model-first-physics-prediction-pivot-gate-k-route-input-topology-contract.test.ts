import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  buildGateKRouteInputTopologyScenarioPack,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_K = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_k_define_route_input_topology_contracts_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts",
  selectionStatus:
    "gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_K_SURFACES = [
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts",
  "packages/engine/src/index.ts",
  "packages/engine/src/airborne-personal-use-readiness-scenario-pack.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/shared/src/domain/airborne-context.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md"
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

const FLOATING_HEAVY_FLOOR_STACK: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
] as const;

const FLOATING_FLOOR_MISSING_STIFFNESS_STACK: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "gate_k_soft_underlay_without_stiffness", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function catalogWithMissingDynamicStiffness(): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    {
      category: "support",
      densityKgM3: 120,
      id: "gate_k_soft_underlay_without_stiffness",
      name: "Gate K Soft Underlay Without Stiffness",
      tags: ["support", "resilient", "impact"]
    }
  ];
}

describe("calculator model-first physics prediction pivot Gate K", () => {
  it("lands route input/topology contracts and selects topology normalizer Gate L", () => {
    expect(MODEL_FIRST_GATE_K).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_k_define_route_input_topology_contracts_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts",
      selectionStatus:
        "gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_K_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the route/input scenario pack calculator-first and source-catalog independent", () => {
    const pack = buildGateKRouteInputTopologyScenarioPack();

    expect(pack).toHaveLength(5);
    expect(pack.map((entry) => entry.route)).toEqual(["wall", "wall", "wall", "floor", "floor"]);
    expect(pack.every((entry) => entry.sourceCatalogQueueOnly === false)).toBe(true);
    expect(pack.every((entry) => entry.runtimeValueMovement === false)).toBe(true);
    expect(pack.map((entry) => entry.status)).toEqual([
      "complete_with_defaults",
      "needs_input",
      "needs_input",
      "needs_input",
      "unsupported"
    ]);
  });

  it("proves source absence alone does not become needs_input when grouped wall physics inputs are complete", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: GROUPED_SPLIT_ROCKWOOL_STACK,
      route: "wall",
      sourceEvidenceAvailable: false,
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(assessment.status).toBe("complete_with_defaults");
    expect(assessment.outputBasis).toBe("element_lab");
    expect(assessment.routeFamilies).toEqual(["triple_leaf_multicavity_airborne"]);
    expect(assessment.missingSourceEvidence).toEqual(["exact_full_stack_source_absent"]);
    expect(assessment.missingPhysicalInputs).toEqual([]);
    expect(assessment.prompts).toEqual([]);
    expect(assessment.sourceAbsenceBlocksOnlyExactOrCalibration).toBe(true);
    expect(assessment.inputCompletenessSet[0]).toMatchObject({
      appliedDefaults: [
        expect.objectContaining({
          fieldId: "flowResistivityPaSM2",
          uncertaintyEffect: "widen_error_budget"
        })
      ],
      missingPhysicalInputs: [],
      routeFamily: "triple_leaf_multicavity_airborne",
      status: "complete_with_defaults"
    });
  });

  it("turns the ACON-like flat-list multi-cavity wall into targeted grouped-topology prompts", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_LAB_CONTEXT,
      layers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(assessment.status).toBe("needs_input");
    expect(assessment.routeFamilies).toEqual(["triple_leaf_multicavity_airborne"]);
    expect(assessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
    expect(assessment.prompts.map((prompt) => [prompt.fieldId, prompt.source])).toEqual([
      ["sideALeafGroup", "wall_topology"],
      ["cavity1DepthMm", "wall_topology"],
      ["internalLeafGroup", "wall_topology"],
      ["internalLeafCoupling", "wall_topology"],
      ["cavity2DepthMm", "wall_topology"],
      ["sideBLeafGroup", "wall_topology"],
      ["supportTopology", "wall_topology"]
    ]);
  });

  it("separates field/building outputs from lab Rw by asking for room, area, RT60, and flanking context", () => {
    const field = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: {
        ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
        contextMode: "field_between_rooms"
      },
      layers: GROUPED_SPLIT_ROCKWOOL_STACK,
      route: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const building = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: {
        ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
        contextMode: "building_prediction",
        panelHeightMm: 2700,
        panelWidthMm: 5000,
        receivingRoomRt60S: 0.6,
        receivingRoomVolumeM3: 45
      },
      layers: GROUPED_SPLIT_ROCKWOOL_STACK,
      route: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(field.outputBasis).toBe("field_apparent");
    expect(field.missingPhysicalInputs).toEqual([
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(field.prompts.map((prompt) => prompt.label)).toEqual([
      "Partition area",
      "Receiving-room volume",
      "Receiving-room RT60"
    ]);

    expect(building.outputBasis).toBe("building_prediction");
    expect(building.routeFamilies).toEqual(
      expect.arrayContaining(["triple_leaf_multicavity_airborne", "building_prediction_airborne_context"])
    );
    expect(
      building.inputCompletenessSet.find((entry) => entry.routeFamily === "building_prediction_airborne_context")
        ?.requiredFields
    ).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(building.missingPhysicalInputs).toEqual([
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);
    expect(building.prompts.map((prompt) => prompt.fieldId)).toEqual([
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ]);
    expect(building.prompts.map((prompt) => prompt.source)).toEqual([
      "field_context",
      "field_context",
      "field_context",
      "field_context",
      "output_basis"
    ]);
    expect(building.prompts.map((prompt) => prompt.label)).toEqual([
      "Source-room volume",
      "Flanking junction class",
      "Conservative flanking assumption",
      "Junction coupling length",
      "Building output basis"
    ]);
  });

  it("keeps floor impact high-accuracy prompts explicit and unsupported IIC/AIIC out of runtime", () => {
    const floating = buildDynamicCalculatorRouteInputTopologyAssessment({
      layers: FLOATING_FLOOR_MISSING_STIFFNESS_STACK,
      catalog: catalogWithMissingDynamicStiffness(),
      route: "floor",
      targetOutputs: ["DeltaLw", "L'n,w", "L'nT,w"]
    });
    const supportedNarrow = buildDynamicCalculatorRouteInputTopologyAssessment({
      floorImpactContext: {
        loadBasisKgM2: 100
      },
      layers: FLOATING_HEAVY_FLOOR_STACK,
      route: "floor",
      targetOutputs: ["Rw", "Ln,w"]
    });
    const unsupported = buildDynamicCalculatorRouteInputTopologyAssessment({
      layers: FLOATING_HEAVY_FLOOR_STACK,
      route: "floor",
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(floating.status).toBe("needs_input");
    expect(floating.missingPhysicalInputs).toEqual([
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(floating.prompts.map((prompt) => prompt.source)).toEqual([
      "material_property",
      "floor_role",
      "output_basis",
      "field_context",
      "field_context",
      "field_context"
    ]);

    expect(supportedNarrow).toMatchObject({
      missingPhysicalInputs: [],
      outputBasis: "element_lab",
      routeFamilies: ["floating_floor_impact"],
      status: "complete",
      unsupportedOutputs: []
    });

    expect(unsupported).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["floating_floor_impact"],
      status: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("keeps later floor-impact runtime honest when required physical inputs are missing", () => {
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
    const floor = calculateAssembly(FLOATING_HEAVY_FLOOR_STACK, {
      calculator: "dynamic",
      targetOutputs: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
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
    expect(floor.supportedTargetOutputs).toEqual(["Rw"]);
    expect(floor.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]);
    expect(floor.impact).toBeNull();
    expect(floor.airborneBasis).toMatchObject({
      missingPhysicalInputs: [
        "loadBasisKgM2",
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      origin: "needs_input"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate K closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts"
    );
  });
});
