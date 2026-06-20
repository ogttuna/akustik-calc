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

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity owner";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
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
} satisfies Pick<AirborneContext, "sharedTrack" | "studSpacingMm" | "wallTopology">;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  COVERAGE_REFRESH_PLAN_DOC,
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

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectNominalValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedDnADb: 39.5,
    estimatedDnTADb: 41.9,
    estimatedDnTwDb: 43,
    estimatedDnWDb: 41,
    estimatedRwDb: 46,
    estimatedRwPrimeDb: 40,
    estimatedStc: 46
  });
}

function expectOffNominalValues(result: ReturnType<typeof calculateCustomWall>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedDnADb: 38.5,
    estimatedDnTADb: 40.9,
    estimatedDnTwDb: 42,
    estimatedDnWDb: 40,
    estimatedRwDb: 45,
    estimatedRwPrimeDb: 39,
    estimatedStc: 45
  });
}

describe("post-V1 wall double-leaf/framed porous flow-resistivity numeric sensitivity coverage refresh", () => {
  it("lands the no-runtime refresh and selects coverage-ratio numeric sensitivity next", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: PREVIOUS_OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes nominal and off-nominal user-material flow on lab, field, and building outputs", () => {
    const nominalField = calculateCustomWall(15000, FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const lowField = calculateCustomWall(5000, FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const highBuilding = calculateCustomWall(50000, BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expectNominalValues(nominalField);
    expectOffNominalValues(lowField);
    expectOffNominalValues(highBuilding);
    expect(nominalField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(highBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("re-probes context-owned advancedWall flow and target-output independence", () => {
    const nominal = calculateContextOwnedWall(15000, LAB_OUTPUTS);
    const lowRwOnly = calculateContextOwnedWall(5000, ["Rw"]);
    const highCtrOnly = calculateContextOwnedWall(50000, ["Ctr"]);

    expect(nominal.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(nominal.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(nominal.airborneBasis?.method).toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );
    expect(nominal.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(lowRwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lowRwOnly.metrics.estimatedRwDb).toBe(45);
    expect(highCtrOnly.supportedTargetOutputs).toEqual(["Ctr"]);
    expect(highCtrOnly.metrics.estimatedCtrDb).toBe(-6.1);
  });

  it("keeps missing user flow at needs_input and preserves metric boundaries", () => {
    const missingFlow = calculateCustomWall(undefined, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const impact = calculateCustomWall(15000, EXPLICIT_DOUBLE_LEAF_CONTEXT, ["IIC", "AIIC"]);

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["flowResistivityPaSM2"],
      origin: "needs_input"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the refresh closeout and selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts"
    );
  });
});
