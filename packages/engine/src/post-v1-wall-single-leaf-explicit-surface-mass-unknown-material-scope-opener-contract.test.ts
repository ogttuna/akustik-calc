import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener";

const OWNER_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_SCOPE_OPENER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.single_leaf.explicit_surface_mass_unknown_material_scope_opener";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall single-leaf explicit surface-mass unknown-material coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 8,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 8,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const UNKNOWN_SINGLE_LEAF_PANEL = [
  {
    materialId: "project_single_leaf_panel_without_catalog_row",
    surfaceMassKgM2: 18,
    thicknessMm: 18
  }
] as const satisfies readonly LayerInput[];

const UNKNOWN_LAMINATED_SINGLE_LEAF = [
  {
    materialId: "project_single_leaf_panel_without_catalog_row_a",
    surfaceMassKgM2: 10,
    thicknessMm: 12
  },
  {
    materialId: "project_single_leaf_panel_without_catalog_row_b",
    surfaceMassKgM2: 8,
    thicknessMm: 9
  }
] as const satisfies readonly LayerInput[];

const UNKNOWN_SINGLE_LEAF_MISSING_MASS = [
  {
    materialId: "project_single_leaf_panel_without_catalog_row",
    thicknessMm: 18
  }
] as const satisfies readonly LayerInput[];

const UNKNOWN_SINGLE_LEAF_ZERO_MASS = [
  {
    materialId: "project_single_leaf_panel_without_catalog_row",
    surfaceMassKgM2: 0,
    thicknessMm: 18
  }
] as const satisfies readonly LayerInput[];

const UNKNOWN_PANEL_CAVITY_WALL = [
  {
    materialId: "project_single_leaf_panel_without_catalog_row",
    surfaceMassKgM2: 18,
    thicknessMm: 18
  },
  {
    materialId: "air_gap",
    thicknessMm: 50
  },
  {
    materialId: "gypsum_board",
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
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

function calculateSingleLeaf(
  layers: readonly LayerInput[],
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS,
  airborneContext: AirborneContext = LAB_CONTEXT
) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectOwnedExplicitMassSingleLeaf(
  layers: readonly LayerInput[],
  expected: {
    readonly C: number;
    readonly Ctr: number;
    readonly family: "single_leaf_panel" | "laminated_single_leaf";
    readonly Rw: number;
    readonly STC: number;
    readonly surfaceMassKgM2: number;
    readonly totalThicknessMm: number;
  }
) {
  const result = calculateSingleLeaf(layers);

  expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedCDb: expected.C,
    estimatedCtrDb: expected.Ctr,
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC,
    surfaceMassKgM2: expected.surfaceMassKgM2,
    totalThicknessMm: expected.totalThicknessMm
  });
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "engine_mass_law",
    errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
    family: expected.family,
    method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneBasis?.assumptions).toEqual(
    expect.arrayContaining([
      "one or more single-leaf layers use user-supplied surfaceMassKgM2 because the project material has no catalog density row",
      "user-supplied surface mass is accepted only for cavity-free single-leaf element-lab requests; field/building adapters remain separate owners"
    ])
  );
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "userSuppliedSurfaceMassKgM2",
      "thicknessMm",
      "stiffness/coincidence family default",
      "one-third-octave TL curve",
      "ISO717-1 rating adapter"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction",
    selectedBasis: {
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    }
  });
  expect(result.warnings).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING);

  return result;
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

describe("post-V1 wall single-leaf explicit surface-mass unknown-material scope opener", () => {
  it("lands a runtime scope opener after the explicit surface-mass double-leaf refresh", () => {
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
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes unknown project single-leaf panels with explicit surface mass from screening to owned mass-law basis", () => {
    expectOwnedExplicitMassSingleLeaf(UNKNOWN_SINGLE_LEAF_PANEL, {
      C: 2.1,
      Ctr: 4.4,
      family: "single_leaf_panel",
      Rw: 32,
      STC: 32,
      surfaceMassKgM2: 18,
      totalThicknessMm: 18
    });

    expectOwnedExplicitMassSingleLeaf(UNKNOWN_LAMINATED_SINGLE_LEAF, {
      C: 1.6,
      Ctr: 2.3,
      family: "laminated_single_leaf",
      Rw: 31,
      STC: 31,
      surfaceMassKgM2: 18,
      totalThicknessMm: 21
    });
  });

  it("keeps missing or non-positive explicit mass from publishing a single-leaf formula value", () => {
    for (const layers of [UNKNOWN_SINGLE_LEAF_MISSING_MASS, UNKNOWN_SINGLE_LEAF_ZERO_MASS]) {
      const result = calculateSingleLeaf(layers);

      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.metrics).toMatchObject({
        estimatedRwDb: 0,
        estimatedStc: 0,
        surfaceMassKgM2: 0
      });
      expect(result.airborneBasis?.method).not.toBe(
        LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
      );
      expect(result.warnings.join(" ")).toMatch(/unknown material|surfaceMass/i);
    }
  });

  it("keeps cavity and impact outside while field and building contexts are owned by successor adapters", () => {
    const cavity = calculateSingleLeaf(UNKNOWN_PANEL_CAVITY_WALL);
    const field = calculateSingleLeaf(UNKNOWN_SINGLE_LEAF_PANEL, FIELD_OUTPUTS, FIELD_CONTEXT);
    const building = calculateSingleLeaf(UNKNOWN_SINGLE_LEAF_PANEL, BUILDING_OUTPUTS, BUILDING_CONTEXT);
    const impact = calculateSingleLeaf(UNKNOWN_SINGLE_LEAF_PANEL, IMPACT_OUTPUTS, LAB_CONTEXT);

    expect(cavity.airborneBasis).toMatchObject({
      family: "double_leaf",
      origin: "screening_fallback"
    });
    expect(cavity.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    );

    expect(field.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 33,
      estimatedRwPrimeDb: 30
    });
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(building.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: 33,
      estimatedDnWDb: 31,
      estimatedRwPrimeDb: 30
    });
    expect(building.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate runner aligned with the landed runtime owner and selected refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
