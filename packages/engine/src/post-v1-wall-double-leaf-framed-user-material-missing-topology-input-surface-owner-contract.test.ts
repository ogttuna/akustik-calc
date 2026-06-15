import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.user_material_missing_topology_input_surface_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after user-material missing-topology input surface";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md";

const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";
const BUILDING_ADAPTER_SELECTED_CANDIDATE_ID = GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;

const MISSING_TOPOLOGY_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "sideBLeafGroup",
  "frameBridgeClass",
  "supportTopology",
  "supportSpacingMm"
] as const;

const OWNER_COUNTERS = {
  estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12,
  frontendImplementationFilesTouched: 0,
  inputSurfaceOwnerContractFilesTouched: 1,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_MATERIAL_CATALOG: readonly MaterialDefinition[] = [
  ...getDefaultMaterialCatalog(),
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: CUSTOM_PANEL_ID,
    name: "Custom Panel Leaf",
    tags: ["gypsum", "board", "custom"]
  },
  {
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "insulation",
    densityKgM3: 45,
    id: CUSTOM_ABSORBER_ID,
    name: "Custom Porous Absorber",
    tags: ["porous", "rockwool", "mineral_wool", "custom"]
  }
] as const;

const EXPLICIT_DOUBLE_LEAF_CONTEXT: AirborneContext = {
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

const FIELD_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42
};

const MISSING_TOPOLOGY_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const DOUBLE_LEAF_MODE_ONLY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_CAVITY_DEPTH_ONLY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 90,
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_CAVITY_TYPED_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    topologyMode: "double_leaf_framed"
  }
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateCustomWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: CUSTOM_MATERIAL_CATALOG,
    targetOutputs
  });
}

function buildTopologyAssessment(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: context,
    catalog: CUSTOM_MATERIAL_CATALOG,
    layers: CUSTOM_DOUBLE_LEAF_STACK,
    route: "wall",
    targetOutputs
  });
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    noRuntimeValueMovement: true,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    planDocPath: OWNER_PLAN_DOC,
    previousRerank: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectMissingTopologyBoundary(
  result: ReturnType<typeof calculateCustomWall>,
  expectedMissing: readonly string[],
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS,
  method = "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology"
) {
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...targetOutputs]);
  expect(result.airborneBasis).toMatchObject({
    method,
    missingPhysicalInputs: [...expectedMissing],
    origin: "needs_input",
    propertyDefaults: []
  });
  expect(result.airborneBasis?.method).not.toBe(
    LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
  );
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "needs_input_boundary",
    requiredInputs: [...expectedMissing],
    runtimeBasisId: null,
    selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
    supportBucket: "needs_input",
    supportedMetrics: []
  });
}

describe("post-V1 wall double-leaf/framed user-material missing-topology input-surface owner", () => {
  it("lands the no-runtime owner and selects the next numeric rerank", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      noRuntimeValueMovement: true,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("keeps explicit custom user-material topology on the owned formula route", () => {
    const lab = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const field = calculateCustomWall(FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const building = calculateCustomWall(BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(lab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 46 },
        { metric: "STC", value: 46 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ]
    });

    for (const result of [field, building]) {
      expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject({
        estimatedDnADb: 39.5,
        estimatedDnTADb: 41.9,
        estimatedDnTwDb: 43,
        estimatedDnWDb: 41,
        estimatedRwPrimeDb: 40
      });
      expect(result.airborneBasis?.assumptions.join("\n")).toContain(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
      );
    }
    expect(field.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
    });
    expect(building.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
    });
  });

  it("owns the missing-topology boundary for user-material leaf/absorber/leaf stacks", () => {
    const noTopology = calculateCustomWall(MISSING_TOPOLOGY_CONTEXT, LAB_OUTPUTS);
    const modeOnly = calculateCustomWall(DOUBLE_LEAF_MODE_ONLY_CONTEXT, LAB_OUTPUTS);
    const cavityOnly = calculateCustomWall(DOUBLE_LEAF_CAVITY_DEPTH_ONLY_CONTEXT, LAB_OUTPUTS);
    const typedCavity = calculateCustomWall(DOUBLE_LEAF_CAVITY_TYPED_CONTEXT, LAB_OUTPUTS);

    expectMissingTopologyBoundary(noTopology, MISSING_TOPOLOGY_INPUTS);
    expectMissingTopologyBoundary(
      modeOnly,
      MISSING_TOPOLOGY_INPUTS,
      LAB_OUTPUTS,
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expectMissingTopologyBoundary(
      cavityOnly,
      ["sideALeafGroup", "sideBLeafGroup", "frameBridgeClass", "supportTopology", "supportSpacingMm"],
      LAB_OUTPUTS,
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expectMissingTopologyBoundary(
      typedCavity,
      [
        "sideALeafGroup",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      LAB_OUTPUTS,
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
  });

  it("keeps route-input prompts deterministic instead of inventing support defaults", () => {
    const modeOnlyAssessment = buildTopologyAssessment(DOUBLE_LEAF_MODE_ONLY_CONTEXT, LAB_OUTPUTS);
    const typedCavityAssessment = buildTopologyAssessment(DOUBLE_LEAF_CAVITY_TYPED_CONTEXT, LAB_OUTPUTS);

    expect(modeOnlyAssessment.status).toBe("needs_input");
    expect(modeOnlyAssessment.runtimeValueMovement).toBe(false);
    expect(modeOnlyAssessment.sourceCatalogQueueOnly).toBe(false);
    expect(modeOnlyAssessment.missingPhysicalInputs).toEqual(MISSING_TOPOLOGY_INPUTS);
    expect(modeOnlyAssessment.prompts.map((prompt) => prompt.fieldId)).toEqual(MISSING_TOPOLOGY_INPUTS);
    expect(modeOnlyAssessment.prompts.map((prompt) => prompt.source)).toEqual(
      expect.arrayContaining(["wall_topology"])
    );

    expect(typedCavityAssessment.status).toBe("needs_input");
    expect(typedCavityAssessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(typedCavityAssessment.prompts.map((prompt) => prompt.fieldId)).toEqual([
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(typedCavityAssessment.inputCompletenessSet).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          missingPhysicalInputs: [
            "sideALeafGroup",
            "sideBLeafGroup",
            "frameBridgeClass",
            "supportTopology",
            "supportSpacingMm"
          ],
          routeFamily: "double_leaf_framed_airborne",
          status: "needs_input"
        })
      ])
    );
  });

  it("preserves unknown-material, ASTM/IIC/AIIC, and impact boundaries", () => {
    const unknown = calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_DOUBLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const astm = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, ASTM_OUTPUTS);
    const impact = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, IMPACT_OUTPUTS);

    expect(unknown.supportedTargetOutputs).toEqual([]);
    expect(unknown.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(unknown.warnings.join("\n")).toContain("unknown material");

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(astm.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.impact).toBeNull();
  });

  it("keeps docs and current-gate runner aligned with the owner closeout and selected rerank", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12");
      expect(content, path).toContain("inputSurfaceOwnerContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts"
    );
  });
});
