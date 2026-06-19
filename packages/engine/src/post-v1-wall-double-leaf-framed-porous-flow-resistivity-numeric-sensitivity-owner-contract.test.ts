import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed porous flow-resistivity numeric sensitivity coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 4,
  accuracyPromotedTargetOutputs: 18,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 1,
  runtimeValuesMoved: 18,
  sourceRowsImported: 0
} as const;

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CONTEXT_ONLY_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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

const CONTEXT_OWNED_POROUS_CAVITY_BASE = {
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildCustomMaterialCatalog(flowResistivityPaSM2?: number): readonly MaterialDefinition[] {
  const absorberAcoustic =
    typeof flowResistivityPaSM2 === "number"
      ? {
          absorberClass: "porous_absorptive" as const,
          behavior: "porous_absorber" as const,
          flowResistivityPaSM2,
          notes: [],
          propertySourceStatus: "user_supplied" as const
        }
      : {
          absorberClass: "porous_absorptive" as const,
          behavior: "porous_absorber" as const,
          notes: [],
          propertySourceStatus: "user_supplied" as const
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

function contextOwnedPorousCavity(flowResistivityPaSM2: number): AirborneContext {
  return {
    ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
    advancedWall: {
      cavities: [
        {
          absorberCoverageRatio: 1,
          absorberFlowResistivityPaSM2: flowResistivityPaSM2,
          absorberThicknessMm: 90,
          depthMm: 90,
          id: "cavity-1",
          sealState: "sealed"
        }
      ]
    },
    contextMode: "element_lab"
  };
}

function calculateCustomWall(
  flowResistivityPaSM2: number | undefined,
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: buildCustomMaterialCatalog(flowResistivityPaSM2),
    targetOutputs
  });
}

function calculateContextOwnedWall(flowResistivityPaSM2: number, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CONTEXT_ONLY_LEAF_STACK, {
    airborneContext: contextOwnedPorousCavity(flowResistivityPaSM2),
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      selectedNextFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectNominalLabValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedRwDb: 46,
    estimatedStc: 46
  });
}

function expectOffNominalLabValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedRwDb: 45,
    estimatedStc: 45
  });
}

function expectNominalFieldBuildingValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedDnADb: 39.5,
    estimatedDnTADb: 41.9,
    estimatedDnTwDb: 43,
    estimatedDnWDb: 41,
    estimatedRwPrimeDb: 40
  });
}

function expectOffNominalFieldBuildingValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedDnADb: 38.5,
    estimatedDnTADb: 40.9,
    estimatedDnTwDb: 42,
    estimatedDnWDb: 40,
    estimatedRwPrimeDb: 39
  });
}

describe("post-V1 wall double-leaf/framed porous flow-resistivity numeric sensitivity owner", () => {
  it("lands a runtime formula sensitivity owner, not a source crawl or docs-only refresh", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_COVERAGE_REFRESH_FILE, OWNER_FILE, OWNER_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves the nominal 15000 Pa*s/m2 wall result while making low and high flow values numerically distinct", () => {
    const lowFlow = calculateCustomWall(5000, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const nominalFlow = calculateCustomWall(15000, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const highFlow = calculateCustomWall(50000, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);

    expectNominalLabValues(nominalFlow);
    expectOffNominalLabValues(lowFlow);
    expectOffNominalLabValues(highFlow);
    expect(lowFlow.metrics.estimatedRwDb).toBeLessThan(nominalFlow.metrics.estimatedRwDb ?? 0);
    expect(highFlow.metrics.estimatedRwDb).toBeLessThan(nominalFlow.metrics.estimatedRwDb ?? 0);
    expect(nominalFlow.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(nominalFlow.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });
  });

  it("propagates numeric flow sensitivity through field and building adapters without lab-field aliasing", () => {
    const lowField = calculateCustomWall(5000, FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const nominalField = calculateCustomWall(15000, FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const highBuilding = calculateCustomWall(50000, BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const nominalBuilding = calculateCustomWall(15000, BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expectOffNominalLabValues(lowField);
    expectOffNominalFieldBuildingValues(lowField);
    expectNominalLabValues(nominalField);
    expectNominalFieldBuildingValues(nominalField);
    expectOffNominalLabValues(highBuilding);
    expectOffNominalFieldBuildingValues(highBuilding);
    expectNominalLabValues(nominalBuilding);
    expectNominalFieldBuildingValues(nominalBuilding);

    expect(lowField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(highBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("applies the same numeric sensitivity to context-owned advancedWall porous cavities", () => {
    const lowFlow = calculateContextOwnedWall(5000, LAB_OUTPUTS);
    const nominalFlow = calculateContextOwnedWall(15000, LAB_OUTPUTS);
    const highFlow = calculateContextOwnedWall(50000, LAB_OUTPUTS);

    expectOffNominalLabValues(lowFlow);
    expectNominalLabValues(nominalFlow);
    expectOffNominalLabValues(highFlow);
    expect(lowFlow.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("keeps absent user-supplied flow at needs_input instead of inventing a numeric damping value", () => {
    const missingFlow = calculateCustomWall(undefined, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["flowResistivityPaSM2"],
      origin: "needs_input"
    });
    expect(missingFlow.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "needs_input_boundary",
      requiredInputs: ["flowResistivityPaSM2"],
      runtimeBasisId: null,
      supportBucket: "needs_input"
    });
  });

  it("keeps docs and current-gate aligned with the numeric sensitivity owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 18");
      expect(content, path).toContain("runtimeFormulaRetunes: 1");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts"
    );
  });
});
