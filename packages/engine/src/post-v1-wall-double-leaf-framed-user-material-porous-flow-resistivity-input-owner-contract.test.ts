import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateQDoubleLeafFramedBridgeInputContract } from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md";

const OWNER_COUNTERS = {
  accuracyBoundaryRowsMoved: 2,
  frontendImplementationFilesTouched: 0,
  inputSurfaceOwnerContractFilesTouched: 1,
  needsInputBoundaryRowsAdded: 1,
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
const IMPACT_OUTPUTS = ["Ln,w", "L'n,w"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

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

const CONTEXT_OWNED_FLOW_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 90,
        depthMm: 90,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  }
};

type FlowPosture = "engineering_default" | "missing_unknown" | "missing_user_supplied" | "user_supplied";

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

function buildCustomMaterialCatalog(flow: FlowPosture): readonly MaterialDefinition[] {
  const absorberAcoustic =
    flow === "missing_user_supplied"
      ? {
          absorberClass: "porous_absorptive" as const,
          behavior: "porous_absorber" as const,
          notes: [],
          propertySourceStatus: "user_supplied" as const
        }
      : flow === "missing_unknown"
        ? {
            absorberClass: "porous_absorptive" as const,
            behavior: "porous_absorber" as const,
            notes: [],
            propertySourceStatus: "unknown" as const
          }
        : {
            absorberClass: "porous_absorptive" as const,
            behavior: "porous_absorber" as const,
            flowResistivityPaSM2: 15000,
            notes: [],
            propertySourceStatus: flow
          };

  return [
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
      acoustic: absorberAcoustic,
      category: "insulation",
      densityKgM3: 45,
      id: CUSTOM_ABSORBER_ID,
      name: "Custom Porous Absorber",
      tags: ["porous", "rockwool", "mineral_wool", "custom"]
    }
  ];
}

function calculateCustomWall(
  flow: FlowPosture,
  context: AirborneContext = EXPLICIT_DOUBLE_LEAF_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS
) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: buildCustomMaterialCatalog(flow),
    targetOutputs
  });
}

function buildBridgeInputContract(flow: FlowPosture, context: AirborneContext = EXPLICIT_DOUBLE_LEAF_CONTEXT) {
  return buildGateQDoubleLeafFramedBridgeInputContract({
    airborneContext: context,
    catalog: buildCustomMaterialCatalog(flow),
    layers: CUSTOM_DOUBLE_LEAF_STACK,
    targetOutputs: LAB_OUTPUTS
  });
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    noFormulaRetune: true,
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

function expectMissingFlowBoundary(
  result: ReturnType<typeof calculateCustomWall>,
  targetOutputs: readonly RequestedOutputId[]
) {
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...targetOutputs]);
  expect(result.airborneBasis).toMatchObject({
    method: "dynamic_calculator_route_input_contract_missing_physical_fields",
    missingPhysicalInputs: ["flowResistivityPaSM2"],
    origin: "needs_input",
    propertyDefaults: []
  });
  expect(result.acousticAnswerBoundary).toMatchObject({
    method: "dynamic_calculator_route_input_contract_missing_physical_fields",
    missingPhysicalInputs: ["flowResistivityPaSM2"],
    origin: "needs_input",
    requiredInputs: ["flowResistivityPaSM2"],
    route: "wall",
    unsupportedOutputs: [...targetOutputs]
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "needs_input_boundary",
    requiredInputs: ["flowResistivityPaSM2"],
    runtimeBasisId: null,
    selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
    supportBucket: "needs_input",
    supportedMetrics: []
  });
}

describe("post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner", () => {
  it("lands the runtime boundary owner and selects coverage refresh next", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      noFormulaRetune: true,
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

  it("keeps numeric user flow and explicit engineering-default flow calculable with different budgets", () => {
    const userFlow = calculateCustomWall("user_supplied");
    const engineeringDefaultFlow = calculateCustomWall("engineering_default");
    const contextOwnedFlow = calculateCustomWall("missing_user_supplied", CONTEXT_OWNED_FLOW_CONTEXT);

    expect(userFlow.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(userFlow.unsupportedTargetOutputs).toEqual([]);
    expect(userFlow.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(userFlow.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      propertyDefaults: []
    });
    expect(userFlow.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(engineeringDefaultFlow.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(engineeringDefaultFlow.unsupportedTargetOutputs).toEqual([]);
    expect(engineeringDefaultFlow.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(engineeringDefaultFlow.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      propertyDefaults: [
        {
          field: "porousFill.flowResistivityPaSM2",
          source: "engineering_default"
        }
      ]
    });

    expect(contextOwnedFlow.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(contextOwnedFlow.unsupportedTargetOutputs).toEqual([]);
    expect(contextOwnedFlow.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("holds user-supplied or unknown porous absorbers at needs_input when flow resistivity is absent", () => {
    const missingUserFlow = calculateCustomWall("missing_user_supplied");
    const missingUnknownFlow = calculateCustomWall("missing_unknown");
    const missingFieldFlow = calculateCustomWall("missing_user_supplied", FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const missingBuildingFlow = calculateCustomWall("missing_user_supplied", BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expectMissingFlowBoundary(missingUserFlow, LAB_OUTPUTS);
    expectMissingFlowBoundary(missingUnknownFlow, LAB_OUTPUTS);
    expectMissingFlowBoundary(missingFieldFlow, FIELD_BUILDING_OUTPUTS);
    expectMissingFlowBoundary(missingBuildingFlow, FIELD_BUILDING_OUTPUTS);
  });

  it("surfaces the flow-resistivity prompt as a material-property conditional input", () => {
    const missingFlowContract = buildBridgeInputContract("missing_user_supplied");
    const unknownFlowContract = buildBridgeInputContract("missing_unknown");
    const numericFlowContract = buildBridgeInputContract("user_supplied");
    const engineeringDefaultContract = buildBridgeInputContract("engineering_default");
    const contextOwnedContract = buildBridgeInputContract("missing_user_supplied", CONTEXT_OWNED_FLOW_CONTEXT);

    for (const contract of [missingFlowContract, unknownFlowContract]) {
      expect(contract.inputCompleteness.status).toBe("needs_input");
      expect(contract.inputCompleteness.missingPhysicalInputs).toEqual(["flowResistivityPaSM2"]);
      expect(contract.inputCompleteness.conditionalFields).toContain("flowResistivityPaSM2");
      expect(contract.prompts).toEqual([
        expect.objectContaining({
          fieldId: "flowResistivityPaSM2",
          promptId: "gate_q_double_leaf_flowResistivityPaSM2",
          source: "material_property",
          targetOutputs: [...LAB_OUTPUTS]
        })
      ]);
      expect(contract.inputCompleteness.requirements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fieldId: "flowResistivityPaSM2",
            missingBehavior: "needs_input",
            requirementType: "conditional_physical_input",
            targetOutputs: [...LAB_OUTPUTS]
          })
        ])
      );
    }

    expect(numericFlowContract.inputCompleteness.status).toBe("complete");
    expect(numericFlowContract.inputCompleteness.missingPhysicalInputs).toEqual([]);
    expect(numericFlowContract.prompts).toEqual([]);

    expect(engineeringDefaultContract.inputCompleteness.status).toBe("complete_with_defaults");
    expect(engineeringDefaultContract.inputCompleteness.missingPhysicalInputs).toEqual([]);
    expect(engineeringDefaultContract.inputCompleteness.appliedDefaults).toEqual([
      expect.objectContaining({
        fieldId: "flowResistivityPaSM2",
        uncertaintyEffect: "widen_error_budget"
      })
    ]);

    expect(contextOwnedContract.inputCompleteness.status).toBe("complete");
    expect(contextOwnedContract.inputCompleteness.missingPhysicalInputs).toEqual([]);
    expect(contextOwnedContract.prompts).toEqual([]);
  });

  it("preserves unknown-material, ASTM/IIC/AIIC, and impact boundaries", () => {
    const unknown = calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_DOUBLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const astm = calculateCustomWall("user_supplied", EXPLICIT_DOUBLE_LEAF_CONTEXT, ASTM_OUTPUTS);
    const impact = calculateCustomWall("user_supplied", EXPLICIT_DOUBLE_LEAF_CONTEXT, IMPACT_OUTPUTS);

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

  it("keeps docs and current-gate runner aligned with the owner closeout and selected refresh", () => {
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
      expect(content, path).toContain("accuracyBoundaryRowsMoved: 2");
      expect(content, path).toContain("needsInputBoundaryRowsAdded: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts"
    );
  });
});
