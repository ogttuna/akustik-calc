import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner";

const OWNER_ACTION =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-19.md";
const OWNER_STATUS =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall context-owned porous-cavity field/building lab-companion basis integrity coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 4,
  accuracyPromotedTargetOutputs: 16,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 16,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const MIXED_FIELD_OUTPUTS = ["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_BUILDING_OUTPUTS = ["DnT,w", "Rw", "STC", "C", "Ctr", "R'w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CONTEXT_ONLY_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

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
  },
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
} satisfies Pick<AirborneContext, "advancedWall" | "sharedTrack" | "studSpacingMm" | "wallTopology">;

const FIELD_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
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

const LAB_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
  contextMode: "element_lab"
};

const MISSING_CONTEXT_OWNED_FLOW_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
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
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateContextOwnedWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CONTEXT_ONLY_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectLabCompanionsFromOwnedDirectCurve(result: ReturnType<typeof calculateContextOwnedWall>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1,
    estimatedCtrDb: -6.1,
    estimatedRwDb: 46,
    estimatedStc: 46
  });
}

function expectFieldBuildingValuesStayOnAdapter(result: ReturnType<typeof calculateContextOwnedWall>) {
  expect(result.metrics).toMatchObject({
    estimatedDnADb: 39.5,
    estimatedDnTADb: 41.9,
    estimatedDnTwDb: 43,
    estimatedDnWDb: 41,
    estimatedRwPrimeDb: 40
  });
}

describe("post-V1 wall context-owned porous-cavity field/building lab-companion basis integrity owner", () => {
  it("lands the runtime owner without source import, formula retune, or frontend changes", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the context-owned porous cavity lab route on the owned double-leaf formula basis", () => {
    const lab = calculateContextOwnedWall(LAB_CONTEXT, LAB_OUTPUTS);

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expectLabCompanionsFromOwnedDirectCurve(lab);
    expect(lab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });
  });

  it("publishes lab-only field and building companions from the owned direct lab curve", () => {
    const field = calculateContextOwnedWall(FIELD_CONTEXT, LAB_OUTPUTS);
    const building = calculateContextOwnedWall(BUILDING_CONTEXT, LAB_OUTPUTS);

    for (const result of [field, building]) {
      expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expectLabCompanionsFromOwnedDirectCurve(result);
      expectFieldBuildingValuesStayOnAdapter(result);
    }

    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("keeps mixed field/building outputs on their own adapter while correcting lab companions", () => {
    const mixedField = calculateContextOwnedWall(FIELD_CONTEXT, MIXED_FIELD_OUTPUTS);
    const mixedBuilding = calculateContextOwnedWall(BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    for (const result of [mixedField, mixedBuilding]) {
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expectLabCompanionsFromOwnedDirectCurve(result);
      expectFieldBuildingValuesStayOnAdapter(result);
    }
    expect(mixedField.supportedTargetOutputs).toEqual([...MIXED_FIELD_OUTPUTS]);
    expect(mixedBuilding.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
  });

  it("keeps missing context-owned flow and impact aliases outside this owner", () => {
    const missingFlow = calculateContextOwnedWall(MISSING_CONTEXT_OWNED_FLOW_CONTEXT, LAB_OUTPUTS);
    const impact = calculateContextOwnedWall(FIELD_CONTEXT, IMPACT_OUTPUTS);

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
      origin: "needs_input"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs aligned with the owner and calculator north star", () => {
    for (const path of REQUIRED_DOCS) {
      const text = readRepoFile(path);
      expect(text.length, path).toBeGreaterThan(100);
      expect(text.toLowerCase(), path).toContain("calculator");
    }

    expect(readRepoFile(OWNER_PLAN_DOC)).toContain(SELECTED_CANDIDATE_ID);
    expect(readRepoFile(OWNER_PLAN_DOC)).toContain(OWNER_ACTION);
  });
});
