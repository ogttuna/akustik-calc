import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-24.md";
const OWNER_STATUS =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_landed_runtime_accuracy_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.user_material_double_leaf_building_lab_companion_target_output_independence_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-rerank-after-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first rerank after wall user-material double-leaf building lab-companion target-output independence coverage refresh";

const GATE_AR_BUILDING_METHOD =
  "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";
const GATE_S_LEAF_MASS_METHOD =
  "gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input";

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

const EXPLICIT_MASS_PANEL_ID = "custom_double_leaf_building_metric_independence_panel";
const ZERO_MASS_PANEL_ID = "custom_double_leaf_building_metric_independence_zero_panel";
const ABSORBER_ID = "custom_double_leaf_building_metric_independence_absorber";

const EXPLICIT_MASS_STACK = [
  { materialId: EXPLICIT_MASS_PANEL_ID, surfaceMassKgM2: 10.6, thicknessMm: 12.5 },
  { materialId: ABSORBER_ID, thicknessMm: 90 },
  { materialId: EXPLICIT_MASS_PANEL_ID, surfaceMassKgM2: 10.6, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ZERO_MASS_STACK = [
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
    densityKgM3: 0,
    id: EXPLICIT_MASS_PANEL_ID,
    name: "Custom Double Leaf Building Metric Independence Panel",
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
    name: "Custom Double Leaf Building Metric Independence Zero Panel",
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
    name: "Custom Double Leaf Building Metric Independence Absorber",
    tags: ["custom", "porous", "mineral_wool"]
  }
] as const;

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sharedTrack: "independent",
  sourceRoomVolumeM3: 42,
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
const MIXED_OUTPUTS = [
  ...LAB_OUTPUTS,
  ...FIELD_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const EXPECTED_LAB_COMPANIONS = {
  C: -1,
  Ctr: -6.1,
  Rw: 46,
  STC: 46
} as const;

const EXPECTED_FIELD_BUILDING_COMPANIONS = {
  DnA: 39.5,
  DnTA: 41.9,
  DnTAk: 39,
  DnTw: 43,
  DnW: 41,
  RwPrime: 40
} as const;

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

function calculateWall(targetOutputs: readonly RequestedOutputId[], layers: readonly LayerInput[] = EXPLICIT_MASS_STACK) {
  return calculateAssembly(layers, {
    airborneContext: BUILDING_CONTEXT,
    calculator: "dynamic",
    catalog: MATERIAL_CATALOG,
    targetOutputs
  });
}

function metricSnapshot(result: ReturnType<typeof calculateWall>) {
  return {
    C: result.metrics.estimatedCDb,
    Ctr: result.metrics.estimatedCtrDb,
    DnA: result.metrics.estimatedDnADb,
    DnTA: result.metrics.estimatedDnTADb,
    DnTAk: result.metrics.estimatedDnTAkDb,
    DnTw: result.metrics.estimatedDnTwDb,
    DnW: result.metrics.estimatedDnWDb,
    Rw: result.metrics.estimatedRwDb,
    RwPrime: result.metrics.estimatedRwPrimeDb,
    STC: result.metrics.estimatedStc
  };
}

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousOwner: {
      action: OWNER_ACTION,
      file: OWNER_FILE,
      status: OWNER_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall user-material double-leaf building lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime coverage refresh and selects the runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      ownerCandidateId: OWNER_CANDIDATE_ID,
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

  it("re-probes mixed and single-output requests on the same direct-curve lab companions", () => {
    const mixed = calculateWall(MIXED_OUTPUTS);

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.airborneBasis).toMatchObject({
      method: GATE_AR_BUILDING_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(metricSnapshot(mixed)).toMatchObject({
      ...EXPECTED_LAB_COMPANIONS,
      ...EXPECTED_FIELD_BUILDING_COMPANIONS
    });

    for (const output of MIXED_OUTPUTS) {
      const single = calculateWall([output]);

      expect(single.supportedTargetOutputs).toEqual([output]);
      expect(single.unsupportedTargetOutputs).toEqual([]);
      expect(metricSnapshot(single)).toMatchObject({
        ...EXPECTED_LAB_COMPANIONS,
        ...EXPECTED_FIELD_BUILDING_COMPANIONS
      });
    }
  });

  it("re-probes representative partial requests without widening supported outputs", () => {
    const fieldOnly = calculateWall(["DnT,A,k"]);
    const labOnly = calculateWall(["STC"]);
    const partialMixed = calculateWall(["Ctr", "Dn,w", "DnT,A"]);

    expect(fieldOnly.supportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(fieldOnly.metrics.estimatedRwDb).toBe(EXPECTED_LAB_COMPANIONS.Rw);
    expect(fieldOnly.metrics.estimatedStc).toBe(EXPECTED_LAB_COMPANIONS.STC);
    expect(fieldOnly.metrics.estimatedDnTAkDb).toBe(EXPECTED_FIELD_BUILDING_COMPANIONS.DnTAk);

    expect(labOnly.supportedTargetOutputs).toEqual(["STC"]);
    expect(labOnly.metrics.estimatedRwDb).toBe(EXPECTED_LAB_COMPANIONS.Rw);
    expect(labOnly.metrics.estimatedStc).toBe(EXPECTED_LAB_COMPANIONS.STC);
    expect(labOnly.metrics.estimatedCDb).toBe(EXPECTED_LAB_COMPANIONS.C);
    expect(labOnly.metrics.estimatedCtrDb).toBe(EXPECTED_LAB_COMPANIONS.Ctr);

    expect(partialMixed.supportedTargetOutputs).toEqual(["Ctr", "Dn,w", "DnT,A"]);
    expect(metricSnapshot(partialMixed)).toMatchObject({
      Ctr: EXPECTED_LAB_COMPANIONS.Ctr,
      DnTA: EXPECTED_FIELD_BUILDING_COMPANIONS.DnTA,
      DnW: EXPECTED_FIELD_BUILDING_COMPANIONS.DnW,
      Rw: EXPECTED_LAB_COMPANIONS.Rw,
      STC: EXPECTED_LAB_COMPANIONS.STC
    });
  });

  it("keeps zero-mass leaf and impact aliases outside the refresh", () => {
    const zeroMass = calculateWall(MIXED_OUTPUTS, ZERO_MASS_STACK);
    const impact = calculateWall(IMPACT_OUTPUTS);

    expect(zeroMass.supportedTargetOutputs).toEqual([]);
    expect(zeroMass.unsupportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(zeroMass.airborneBasis).toMatchObject({
      method: GATE_S_LEAF_MASS_METHOD,
      missingPhysicalInputs: ["surfaceMassKgM2"],
      origin: "needs_input"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis?.method).not.toBe(GATE_AR_BUILDING_METHOD);
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("STC 46");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("R'w 40");
      expect(content, path).toContain("DnT,A,k 39");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
