import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_leaf_mass_boundary_owner";

const OWNER_ACTION =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_OWNER_PLAN_2026-06-24.md";
const OWNER_STATUS =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_landed_runtime_boundary_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.user_material_double_leaf_building_leaf_mass_boundary_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material double-leaf building leaf-mass boundary coverage refresh";

const GATE_S_LEAF_MASS_METHOD =
  "gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input";
const REQUIRED_LEAF_MASS_INPUT = "surfaceMassKgM2";

const OWNER_COUNTERS = {
  falseGateARBuildingRequestShapesBlocked: 2,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 1,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  targetOutputsMovedToNeedsInput: 10
} as const;

const COMPLETE_PANEL_ID = "custom_double_leaf_boundary_panel";
const ZERO_MASS_PANEL_ID = "custom_double_leaf_boundary_zero_panel";
const ABSORBER_ID = "custom_double_leaf_boundary_absorber";

const COMPLETE_DOUBLE_LEAF_STACK = [
  { materialId: COMPLETE_PANEL_ID, thicknessMm: 12.5 },
  { materialId: ABSORBER_ID, thicknessMm: 90 },
  { materialId: COMPLETE_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ZERO_MASS_DOUBLE_LEAF_STACK = [
  { materialId: ZERO_MASS_PANEL_ID, thicknessMm: 12.5 },
  { materialId: ABSORBER_ID, thicknessMm: 90 },
  { materialId: ZERO_MASS_PANEL_ID, thicknessMm: 12.5 }
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
    densityKgM3: 848,
    id: COMPLETE_PANEL_ID,
    name: "Custom Double Leaf Boundary Panel",
    tags: ["custom", "gypsum", "board"]
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
    name: "Custom Double Leaf Boundary Zero Panel",
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
    id: ABSORBER_ID,
    name: "Custom Double Leaf Boundary Absorber",
    tags: ["custom", "porous", "mineral_wool"]
  }
] as const;

const DOUBLE_LEAF_TOPOLOGY = {
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
} as const satisfies Partial<AirborneContext>;

const ELEMENT_LAB_CONTEXT = {
  ...DOUBLE_LEAF_TOPOLOGY,
  contextMode: "element_lab"
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  ...DOUBLE_LEAF_TOPOLOGY,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  ...DOUBLE_LEAF_TOPOLOGY,
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
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const MIXED_BUILDING_OUTPUTS = [
  ...FIELD_BUILDING_OUTPUTS,
  ...LAB_OUTPUTS
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectLeafMassNeedsInput(
  result: ReturnType<typeof calculateWall>,
  unsupportedOutputs: readonly RequestedOutputId[]
) {
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...unsupportedOutputs]);
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "engine_double_leaf_cavity",
    family: "double_leaf",
    method: GATE_S_LEAF_MASS_METHOD,
    missingPhysicalInputs: [REQUIRED_LEAF_MASS_INPUT],
    origin: "needs_input"
  });
  expect(result.acousticAnswerBoundary).toMatchObject({
    method: GATE_S_LEAF_MASS_METHOD,
    missingPhysicalInputs: [REQUIRED_LEAF_MASS_INPUT],
    origin: "needs_input",
    requiredInputs: ["sideALeafGroup", "sideBLeafGroup", REQUIRED_LEAF_MASS_INPUT],
    route: "wall",
    unsupportedOutputs: [...unsupportedOutputs]
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: "candidate_dynamic_needs_input",
    selectedOrigin: "needs_input"
  });
  expect(result.warnings.join(" ")).toContain("provide surfaceMassKgM2 for each side leaf");
}

describe("post-V1 wall user-material double-leaf building leaf-mass boundary owner", () => {
  it("lands the runtime boundary owner and selects the follow-up coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("parks zero-mass double-leaf building_prediction requests before Gate AR can publish false values", () => {
    const mixed = calculateWall(ZERO_MASS_DOUBLE_LEAF_STACK, BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);
    const characteristicOnly = calculateWall(ZERO_MASS_DOUBLE_LEAF_STACK, BUILDING_CONTEXT, ["DnT,A,k"]);

    expectLeafMassNeedsInput(mixed, MIXED_BUILDING_OUTPUTS);
    expect(mixed.airborneBasis?.method).not.toBe("gate_ar_airborne_building_prediction_all_owner_runtime_corridor");
    expect(mixed.warnings.join(" ")).toContain("DnT,A,k");

    expectLeafMassNeedsInput(characteristicOnly, ["DnT,A,k"]);
  });

  it("keeps adjacent lab and field missing-mass boundaries closed on the same Gate S method", () => {
    const lab = calculateWall(ZERO_MASS_DOUBLE_LEAF_STACK, ELEMENT_LAB_CONTEXT, LAB_OUTPUTS);
    const field = calculateWall(ZERO_MASS_DOUBLE_LEAF_STACK, FIELD_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expectLeafMassNeedsInput(lab, LAB_OUTPUTS);
    expectLeafMassNeedsInput(field, MIXED_BUILDING_OUTPUTS);
  });

  it("leaves complete positive-mass double-leaf building routes calculable", () => {
    const complete = calculateWall(COMPLETE_DOUBLE_LEAF_STACK, BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(complete.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(complete.unsupportedTargetOutputs).toEqual([]);
    expect(complete.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 39.5,
      estimatedDnTAkDb: 39,
      estimatedDnTADb: 41.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwDb: 46,
      estimatedRwPrimeDb: 40,
      estimatedStc: 46
    });
    expect(complete.airborneBasis).toMatchObject({
      method: "gate_ar_airborne_building_prediction_all_owner_runtime_corridor",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("keeps impact aliases and live docs outside this airborne boundary owner", () => {
    const impact = calculateWall(ZERO_MASS_DOUBLE_LEAF_STACK, BUILDING_CONTEXT, IMPACT_OUTPUTS);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis?.method).not.toBe(GATE_S_LEAF_MASS_METHOD);

    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
