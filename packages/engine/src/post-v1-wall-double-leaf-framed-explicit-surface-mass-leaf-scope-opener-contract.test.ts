import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed explicit surface-mass leaf coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 3,
  newCalculableTargetOutputs: 14,
  runtimeBasisPromotions: 3,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 14,
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
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_SURFACE_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const MISSING_SURFACE_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const INSULATION_AS_LEAF_STACK = [
  {
    materialId: "rockwool",
    surfaceMassKgM2: 10.6,
    thicknessMm: 90
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const LAB_CONTEXT: AirborneContext = {
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
  },
  contextMode: "element_lab",
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

const FIELD_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_REFRESH_PLAN_DOC,
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateExplicitSurfaceMassWall(
  layers: readonly LayerInput[],
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousRefresh: {
      action: PREVIOUS_REFRESH_ACTION,
      file: PREVIOUS_REFRESH_FILE,
      selectionStatus: PREVIOUS_REFRESH_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall double-leaf/framed explicit surface-mass leaf scope opener", () => {
  it("lands a runtime scope opener after the frequency-backbone refresh", () => {
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

    for (const path of [
      PREVIOUS_REFRESH_FILE,
      PREVIOUS_REFRESH_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates lab Rw, STC, C, and Ctr for explicit surface-mass leaf layers without catalog density rows", () => {
    const result = calculateExplicitSurfaceMassWall(EXPLICIT_SURFACE_MASS_STACK, LAB_CONTEXT, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "sideALeafMassKgM2",
        "sideBLeafMassKgM2",
        "surfaceMassKgM2",
        "calculatedFrequencyCurveShape"
      ])
    );
  });

  it("moves field and building companions from the same explicit surface-mass base route", () => {
    const field = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      FIELD_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );
    const building = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      BUILDING_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );

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
      expect(result.airborneBasis).toMatchObject({
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
    }

    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("keeps missing surface mass, known insulation-as-leaf, and impact aliases outside the owner", () => {
    const missingSurfaceMass = calculateExplicitSurfaceMassWall(
      MISSING_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );
    const insulationAsLeaf = calculateExplicitSurfaceMassWall(
      INSULATION_AS_LEAF_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );
    const impact = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      IMPACT_OUTPUTS
    );

    for (const result of [missingSurfaceMass, insulationAsLeaf]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.airborneBasis).toMatchObject({
        origin: "needs_input"
      });
      expect(result.airborneBasis?.missingPhysicalInputs).toEqual(
        expect.arrayContaining(["surfaceMassKgM2"])
      );
    }

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the explicit surface-mass scope opener", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableLayerTemplates: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 3");
      expect(content, path).toContain("newCalculableTargetOutputs: 14");
      expect(content, path).toContain("runtimeBasisPromotions: 3");
      expect(content, path).toContain("runtimeValuesMoved 14");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts"
    );
  });
});
