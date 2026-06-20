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

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan";
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

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall context-owned porous-cavity field/building lab-companion basis integrity";

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

const MISSING_SIDE_GROUP_CONTEXT: AirborneContext = {
  ...FIELD_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const MISSING_ABSORPTIVE_CAVITY_CONTEXT: AirborneContext = {
  ...FIELD_CONTEXT,
  wallTopology: {
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_FIELD_OUTPUTS = ["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_BUILDING_OUTPUTS = ["DnT,w", "Rw", "STC", "C", "Ctr", "R'w"] as const satisfies readonly RequestedOutputId[];
const PARTIAL_LAB_OUTPUTS = ["Ctr", "Rw"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

function calculateContextOwnedWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CONTEXT_ONLY_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: OWNER_ACTION,
    previousOwnerFile: OWNER_FILE,
    previousOwnerStatus: OWNER_STATUS,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
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

describe("post-V1 wall context-owned porous-cavity field/building lab-companion basis integrity coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next runtime-first rerank", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes the lab route and lab-only field/building companions on the direct lab basis", () => {
    const lab = calculateContextOwnedWall(LAB_CONTEXT, LAB_OUTPUTS);
    const field = calculateContextOwnedWall(FIELD_CONTEXT, LAB_OUTPUTS);
    const building = calculateContextOwnedWall(BUILDING_CONTEXT, LAB_OUTPUTS);

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

    for (const result of [field, building]) {
      expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expectLabCompanionsFromOwnedDirectCurve(result);
      expectFieldBuildingValuesStayOnAdapter(result);
    }
    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("re-probes single and partial lab companion target-output independence", () => {
    const fieldRwOnly = calculateContextOwnedWall(FIELD_CONTEXT, ["Rw"]);
    const fieldCtrOnly = calculateContextOwnedWall(FIELD_CONTEXT, ["Ctr"]);
    const buildingPartial = calculateContextOwnedWall(BUILDING_CONTEXT, PARTIAL_LAB_OUTPUTS);

    expect(fieldRwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(fieldRwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldRwOnly.metrics).toMatchObject({
      estimatedRwDb: 46
    });
    expect(fieldCtrOnly.supportedTargetOutputs).toEqual(["Ctr"]);
    expect(fieldCtrOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldCtrOnly.metrics).toMatchObject({
      estimatedCtrDb: -6.1
    });
    expect(buildingPartial.supportedTargetOutputs).toEqual([...PARTIAL_LAB_OUTPUTS]);
    expect(buildingPartial.unsupportedTargetOutputs).toEqual([]);
    expect(buildingPartial.metrics).toMatchObject({
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46
    });
  });

  it("re-probes mixed field/building requests without copying lab values into adapter outputs", () => {
    const field = calculateContextOwnedWall(FIELD_CONTEXT, MIXED_FIELD_OUTPUTS);
    const building = calculateContextOwnedWall(BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);
    const fieldOnly = calculateContextOwnedWall(FIELD_CONTEXT, FIELD_OUTPUTS);

    expect(field.supportedTargetOutputs).toEqual([...MIXED_FIELD_OUTPUTS]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expectLabCompanionsFromOwnedDirectCurve(field);
    expectFieldBuildingValuesStayOnAdapter(field);

    expect(building.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expectLabCompanionsFromOwnedDirectCurve(building);
    expectFieldBuildingValuesStayOnAdapter(building);

    expect(fieldOnly.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldOnly.metrics).toMatchObject({
      estimatedDnADb: 39.5,
      estimatedDnTADb: 41.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwDb: 40,
      estimatedRwPrimeDb: 40,
      estimatedStc: 40
    });
  });

  it("keeps missing physical inputs, missing topology, and impact aliases outside this refresh", () => {
    const missingFlow = calculateContextOwnedWall(MISSING_CONTEXT_OWNED_FLOW_CONTEXT, LAB_OUTPUTS);
    const missingSideGroups = calculateContextOwnedWall(MISSING_SIDE_GROUP_CONTEXT, LAB_OUTPUTS);
    const missingAbsorptiveClass = calculateContextOwnedWall(MISSING_ABSORPTIVE_CAVITY_CONTEXT, LAB_OUTPUTS);
    const impact = calculateContextOwnedWall(FIELD_CONTEXT, IMPACT_OUTPUTS);

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });

    for (const result of [missingSideGroups, missingAbsorptiveClass]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.metrics.estimatedRwDb).not.toBe(46);
      expect(result.metrics.estimatedStc).not.toBe(46);
    }

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
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
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("STC 46");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("R'w 40");
      expect(content, path).toContain("DnT,w 43");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
