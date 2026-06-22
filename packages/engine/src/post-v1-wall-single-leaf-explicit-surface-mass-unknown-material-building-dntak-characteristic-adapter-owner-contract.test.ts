import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_landed_no_runtime_selected_building_dntak_characteristic_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.single_leaf.explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 2,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
  sourceRowsImported: 0
} as const;

const CHARACTERISTIC_BUILDING_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
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

const APPARENT_ONLY_BUILDING_CONTEXT: AirborneContext = {
  ...BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const INCOMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
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

function calculateBuilding(
  layers: readonly LayerInput[],
  airborneContext: AirborneContext = BUILDING_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = CHARACTERISTIC_BUILDING_OUTPUTS
) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectOwnedCharacteristicDnTAk(
  layers: readonly LayerInput[],
  expected: {
    readonly DnTA: number;
    readonly DnTAk: number;
    readonly family: "single_leaf_panel" | "laminated_single_leaf";
  }
) {
  const result = calculateBuilding(layers);

  expect(result.supportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTAkDb: expected.DnTAk,
    estimatedDnTADb: expected.DnTA
  });
  expect(result.ratings.field).toMatchObject({
    DnTA: expected.DnTA,
    DnTAk: expected.DnTAk
  });
  expect(result.ratings.field?.basis).toContain(
    "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
  );
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "ISO 12354-1",
    errorBudgetDb: 9,
    family: expected.family,
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction",
    selectedBasis: {
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    }
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      expect.stringMatching(
        /Gate AR characteristic DnT,A,k adapter active.*receiving-room volume, partition area.*T0=0\.5 s/i
      )
    ])
  );
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

describe("post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter owner", () => {
  it("lands the runtime owner after the no-runtime building-context adapter coverage refresh", () => {
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

  it("opens DnT,A,k for project single-leaf and laminated project panels through the Gate AR characteristic adapter", () => {
    expectOwnedCharacteristicDnTAk(UNKNOWN_SINGLE_LEAF_PANEL, {
      DnTA: 35.2,
      DnTAk: 32.3,
      family: "single_leaf_panel"
    });

    expectOwnedCharacteristicDnTAk(UNKNOWN_LAMINATED_SINGLE_LEAF, {
      DnTA: 33.6,
      DnTAk: 30.7,
      family: "laminated_single_leaf"
    });
  });

  it("keeps the characteristic output available in complete mixed building requests", () => {
    const result = calculateBuilding(UNKNOWN_SINGLE_LEAF_PANEL, BUILDING_CONTEXT, BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 32.8,
      estimatedDnTAkDb: 32.3,
      estimatedDnTADb: 35.2,
      estimatedDnTwDb: 33,
      estimatedDnWDb: 31,
      estimatedRwPrimeDb: 30
    });
  });

  it("keeps missing mass, missing volume, apparent-only basis, field context, and impact aliases outside this owner", () => {
    const missingMass = calculateBuilding(UNKNOWN_SINGLE_LEAF_MISSING_MASS);
    const missingVolume = calculateBuilding(UNKNOWN_SINGLE_LEAF_PANEL, INCOMPLETE_BUILDING_CONTEXT);
    const apparentOnly = calculateBuilding(UNKNOWN_SINGLE_LEAF_PANEL, APPARENT_ONLY_BUILDING_CONTEXT);
    const field = calculateBuilding(UNKNOWN_SINGLE_LEAF_PANEL, FIELD_CONTEXT, FIELD_OUTPUTS);
    const impact = calculateBuilding(UNKNOWN_SINGLE_LEAF_PANEL, LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(missingMass.supportedTargetOutputs).toEqual([]);
    expect(missingMass.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingMass.warnings.join(" ")).toMatch(/unknown material|surfaceMass/i);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

    expect(apparentOnly.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(apparentOnly.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(apparentOnly.metrics.estimatedDnTAkDb).toBeUndefined();
    expect(apparentOnly.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(field.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(field.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(field.metrics.estimatedDnTAkDb).toBeUndefined();
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
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
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 2");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 2");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
