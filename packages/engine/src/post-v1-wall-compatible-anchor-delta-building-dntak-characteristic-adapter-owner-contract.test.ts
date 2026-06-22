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
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.compatible_anchor_delta.building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
  sourceRowsImported: 0
} as const;

const CHARACTERISTIC_BUILDING_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const LAB_MIXED_OUTPUTS = ["Rw", "DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_END = [
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_LSF_FIELD_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const EXACT_LSF_BUILDING_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 48
};

const EXACT_LSF_BUILDING_APPARENT_ONLY_CONTEXT: AirborneContext = {
  ...EXACT_LSF_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const EXACT_LSF_BUILDING_MISSING_VOLUME_CONTEXT: AirborneContext = {
  ...EXACT_LSF_BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT: AirborneContext = {
  ...EXACT_LSF_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
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
  layers: readonly LayerInput[] = EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES,
  airborneContext: AirborneContext = EXACT_LSF_BUILDING_CONTEXT,
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
  expected: { readonly DnTA: number; readonly DnTAk: number }
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
    anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
    valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: expected.DnTAk }])
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
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

describe("post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter owner", () => {
  it("lands the runtime owner after the double-leaf/framed characteristic coverage refresh", () => {
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

  it("opens DnT,A,k for paired and one-side exterior-board compatible anchor-delta building requests", () => {
    expectOwnedCharacteristicDnTAk(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      DnTA: 51.9,
      DnTAk: 49
    });
    expectOwnedCharacteristicDnTAk(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      DnTA: 50.4,
      DnTAk: 47.5
    });
  });

  it("keeps DnT,A,k available beside mixed compatible anchor-delta Gate AR building outputs", () => {
    const result = calculateBuilding(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTAkDb: 49,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
      valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: 49 }])
    });
  });

  it("keeps missing input, apparent-only basis, field context, lab context, and impact aliases outside", () => {
    const missingVolume = calculateBuilding(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_BUILDING_MISSING_VOLUME_CONTEXT);
    const missingOutputBasis = calculateBuilding(
      EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES,
      EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT
    );
    const apparentOnly = calculateBuilding(
      EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES,
      EXACT_LSF_BUILDING_APPARENT_ONLY_CONTEXT
    );
    const field = calculateBuilding(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_FIELD_CONTEXT, FIELD_OUTPUTS);
    const lab = calculateBuilding(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_LAB_CONTEXT, LAB_MIXED_OUTPUTS);
    const impact = calculateBuilding(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

    expect(missingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(missingOutputBasis.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingOutputBasis.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });

    expect(apparentOnly.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(apparentOnly.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(apparentOnly.metrics.estimatedDnTAkDb).toBeUndefined();

    expect(field.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(field.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["DnT,A,k", "DnT,A"]);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
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
      expect(content, path).toContain("newCalculableTargetOutputs: 1");
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
