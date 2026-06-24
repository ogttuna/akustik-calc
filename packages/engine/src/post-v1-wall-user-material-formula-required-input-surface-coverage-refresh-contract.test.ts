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
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_user_material_formula_required_input_surface_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_OWNER_PLAN_2026-06-24.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_user_material_formula_required_input_surface_owner_landed_runtime_input_boundary_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.user_material_formula_required_input_surface_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall user-material formula required input surface coverage refresh";

const REQUIRED_INPUT_SURFACE_METHOD =
  "post_v1_wall_user_material_formula_required_input_surface_missing_leaf_mass";
const REQUIRED_MASS_INPUT =
  "layer.surfaceMassKgM2_or_materialCatalog.densityKgM3_and_thicknessMm";

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

const SINGLE_PANEL_ID = "custom_single_leaf_panel";
const ZERO_MASS_PANEL_ID = "custom_single_leaf_panel_missing_density";
const DOUBLE_PANEL_ID = "custom_required_input_surface_panel";
const DOUBLE_ABSORBER_ID = "custom_required_input_surface_absorber";

const SINGLE_LEAF_STACK = [
  { materialId: SINGLE_PANEL_ID, thicknessMm: 18 }
] as const satisfies readonly LayerInput[];
const ZERO_MASS_SINGLE_LEAF_STACK = [
  { materialId: ZERO_MASS_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const DOUBLE_LEAF_STACK = [
  { materialId: DOUBLE_PANEL_ID, thicknessMm: 12.5 },
  { materialId: DOUBLE_ABSORBER_ID, thicknessMm: 90 },
  { materialId: DOUBLE_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const MATERIAL_CATALOG: readonly MaterialDefinition[] = [
  ...getDefaultMaterialCatalog(),
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 850,
    id: SINGLE_PANEL_ID,
    name: "Custom Single Leaf Panel",
    tags: ["custom", "panel_leaf"]
  },
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 0,
    id: ZERO_MASS_PANEL_ID,
    name: "Custom Single Leaf Panel Missing Density",
    tags: ["custom", "panel_leaf"]
  },
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: DOUBLE_PANEL_ID,
    name: "Custom Required Input Surface Panel",
    tags: ["custom", "gypsum", "board"]
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
    id: DOUBLE_ABSORBER_ID,
    name: "Custom Required Input Surface Absorber",
    tags: ["custom", "porous", "mineral_wool"]
  }
] as const;

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};
const DOUBLE_LEAF_CONTEXT: AirborneContext = {
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
const BUILDING_CONTEXT: AirborneContext = {
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
const DOUBLE_LEAF_BUILDING_CONTEXT: AirborneContext = {
  ...DOUBLE_LEAF_CONTEXT,
  ...BUILDING_CONTEXT
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const MIXED_AIRBORNE_OUTPUTS = [
  ...LAB_OUTPUTS,
  ...BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(
  layers: readonly LayerInput[],
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: MATERIAL_CATALOG,
    targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwner: {
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      status: PREVIOUS_OWNER_STATUS
    },
    reProbedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectRequiredInputSurfaceNeedsInput(
  result: ReturnType<typeof calculateWall>,
  unsupportedOutputs: readonly RequestedOutputId[]
) {
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...unsupportedOutputs]);
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "engine_mass_law",
    curveBasis: "no_curve",
    family: "single_leaf_panel",
    method: REQUIRED_INPUT_SURFACE_METHOD,
    missingPhysicalInputs: [REQUIRED_MASS_INPUT],
    origin: "needs_input"
  });
  expect(result.acousticAnswerBoundary).toMatchObject({
    method: REQUIRED_INPUT_SURFACE_METHOD,
    missingPhysicalInputs: [REQUIRED_MASS_INPUT],
    origin: "needs_input",
    route: "wall",
    unsupportedOutputs: [...unsupportedOutputs]
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: "candidate_dynamic_needs_input",
    selectedOrigin: "needs_input"
  });
}

describe("post-V1 wall user-material formula required input surface coverage refresh", () => {
  it("lands the no-runtime refresh and selects the runtime-first rerank", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      reProbedCandidateId: SELECTED_CANDIDATE_ID,
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

  it("re-probes complete user-material formula routes without changing their calculated outputs", () => {
    const singleLeafLab = calculateWall(SINGLE_LEAF_STACK, LAB_CONTEXT, LAB_OUTPUTS);
    const singleLeafBuilding = calculateWall(SINGLE_LEAF_STACK, BUILDING_CONTEXT, BUILDING_OUTPUTS);
    const doubleLeafLab = calculateWall(DOUBLE_LEAF_STACK, DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const doubleLeafBuilding = calculateWall(
      DOUBLE_LEAF_STACK,
      DOUBLE_LEAF_BUILDING_CONTEXT,
      BUILDING_OUTPUTS
    );

    expect(singleLeafLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(singleLeafLab.metrics).toMatchObject({
      estimatedCDb: 0.7,
      estimatedCtrDb: 2.2,
      estimatedRwDb: 31,
      estimatedStc: 31,
      surfaceMassKgM2: 15.3
    });
    expect(singleLeafLab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(singleLeafLab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(singleLeafBuilding.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(singleLeafBuilding.metrics).toMatchObject({
      estimatedDnADb: 30.4,
      estimatedDnTADb: 32.8,
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(singleLeafBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(singleLeafBuilding.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });

    expect(doubleLeafLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(doubleLeafLab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(doubleLeafLab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });

    expect(doubleLeafBuilding.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(doubleLeafBuilding.metrics).toMatchObject({
      estimatedDnADb: 39.5,
      estimatedDnTADb: 41.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwPrimeDb: 40
    });
    expect(doubleLeafBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("keeps zero-mass user material requests parked behind explicit leaf-mass input", () => {
    const lab = calculateWall(ZERO_MASS_SINGLE_LEAF_STACK, LAB_CONTEXT, LAB_OUTPUTS);
    const building = calculateWall(ZERO_MASS_SINGLE_LEAF_STACK, BUILDING_CONTEXT, BUILDING_OUTPUTS);
    const mixed = calculateWall(ZERO_MASS_SINGLE_LEAF_STACK, BUILDING_CONTEXT, MIXED_AIRBORNE_OUTPUTS);

    // This is the owner boundary: zero density must not become a false 0 dB wall answer.
    expectRequiredInputSurfaceNeedsInput(lab, LAB_OUTPUTS);
    expectRequiredInputSurfaceNeedsInput(building, BUILDING_OUTPUTS);
    expectRequiredInputSurfaceNeedsInput(mixed, MIXED_AIRBORNE_OUTPUTS);
    expect(mixed.warnings.join(" ")).toContain("provide layer.surfaceMassKgM2 or materialCatalog.densityKgM3");
  });

  it("keeps impact aliases and source/manufacturer-rating work outside this refresh", () => {
    const impact = calculateWall(SINGLE_LEAF_STACK, LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis?.method).not.toBe(REQUIRED_INPUT_SURFACE_METHOD);

    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
