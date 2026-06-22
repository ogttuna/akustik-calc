import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS } from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_landed_no_runtime_selected_field_context_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.single_leaf.explicit_surface_mass_unknown_material_field_context_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 2,
  accuracyPromotedTargetOutputs: 10,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 10,
  sourceRowsImported: 0
} as const;

const FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = FIELD_OUTPUTS;
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

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const INCOMPLETE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 42
};

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
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

function calculateField(
  layers: readonly LayerInput[],
  airborneContext: AirborneContext = FIELD_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = FIELD_OUTPUTS
) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectOwnedFieldAdapter(
  layers: readonly LayerInput[],
  expected: {
    readonly DnA: number;
    readonly DnTA: number;
    readonly DnTw: number;
    readonly DnW: number;
    readonly family: "single_leaf_panel" | "laminated_single_leaf";
    readonly RwPrime: number;
  }
) {
  const result = calculateField(layers);

  expect(result.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: expected.DnA,
    estimatedDnTADb: expected.DnTA,
    estimatedDnTwDb: expected.DnTw,
    estimatedDnWDb: expected.DnW,
    estimatedRwPrimeDb: expected.RwPrime
  });
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "ISO 12354-1",
    errorBudgetDb: 8,
    family: expected.family,
    method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneBasis?.assumptions).toEqual(
    expect.arrayContaining([
      "field/apparent output is computed only from explicit field_between_rooms context",
      "lab Rw/STC is not relabelled as R'w/DnT,w; the field metric adapter owns this output basis",
      "base lab-family method remains layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor",
      "one or more single-leaf layers use user-supplied surfaceMassKgM2 because the project material has no catalog density row"
    ])
  );
  expect(result.airborneBasis?.assumptions.join(" ")).not.toMatch(/field\/building adapters remain separate owners/i);
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "userSuppliedSurfaceMassKgM2",
      "fieldContext.contextMode:field_between_rooms",
      "fieldContext.partitionAreaM2_or_panelWidthHeight",
      "fieldContext.receivingRoomVolumeM3",
      "fieldContext.receivingRoomRt60S",
      "fieldMetricAdapter:R'w/DnT,w"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction",
    selectedBasis: {
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    }
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

describe("post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter owner", () => {
  it("lands the runtime owner after the no-runtime project-panel coverage refresh", () => {
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

  it("promotes complete field outputs for project single-leaf and laminated project panels to Gate I", () => {
    expectOwnedFieldAdapter(UNKNOWN_SINGLE_LEAF_PANEL, {
      DnA: 32.8,
      DnTA: 35.2,
      DnTw: 33,
      DnW: 31,
      family: "single_leaf_panel",
      RwPrime: 30
    });

    expectOwnedFieldAdapter(UNKNOWN_LAMINATED_SINGLE_LEAF, {
      DnA: 31.2,
      DnTA: 33.6,
      DnTw: 32,
      DnW: 30,
      family: "laminated_single_leaf",
      RwPrime: 29
    });
  });

  it("keeps missing mass, missing field inputs, and cavity stacks outside the field owner", () => {
    const missingMass = calculateField(UNKNOWN_SINGLE_LEAF_MISSING_MASS);
    const missingFieldInput = calculateField(UNKNOWN_SINGLE_LEAF_PANEL, INCOMPLETE_FIELD_CONTEXT);
    const cavity = calculateField(UNKNOWN_PANEL_CAVITY_WALL);

    expect(missingMass.supportedTargetOutputs).toEqual([]);
    expect(missingMass.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(missingMass.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(missingMass.warnings.join(" ")).toMatch(/unknown material|surfaceMass/i);

    expect(missingFieldInput.supportedTargetOutputs).toEqual([]);
    expect(missingFieldInput.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(missingFieldInput.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingFieldInput.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomRt60S"])
    );

    expect(cavity.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(cavity.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    );
  });

  it("keeps impact aliases outside while building prediction is owned by the successor adapter", () => {
    const building = calculateField(UNKNOWN_SINGLE_LEAF_PANEL, BUILDING_CONTEXT, BUILDING_OUTPUTS);
    const impact = calculateField(UNKNOWN_SINGLE_LEAF_PANEL, LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(building.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.metrics).toMatchObject({
      estimatedDnADb: 32.8,
      estimatedDnTADb: 35.2,
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
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate runner aligned with the landed runtime owner and selected refresh", () => {
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
      expect(content, path).toContain("accuracyPromotedRequestShapes: 2");
      expect(content, path).toContain("accuracyPromotedTargetOutputs: 10");
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 10");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
