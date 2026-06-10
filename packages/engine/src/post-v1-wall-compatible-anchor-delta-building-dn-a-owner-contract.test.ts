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
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_GAP_ACTION = "post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan";
const PREVIOUS_GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts";
const PREVIOUS_GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner";

const BUILDING_DN_A_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan";
const BUILDING_DN_A_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts";
const BUILDING_DN_A_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta building Dn,A coverage refresh";

const BUILDING_DN_A_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
  sourceRowsImported: 0,
  webSurfaceParityContractFilesTouched: 1
} as const;

const BUILDING_DN_A_OUTPUT = ["Dn,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALL_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_COMPATIBLE_OWNER_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const LAB_A_WEIGHTED_MIXED_OUTPUTS = ["Rw", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const NON_OWNER_MIXED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A",
  "STC",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

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

const NON_SELECTED_COMPATIBLE_ANCHOR_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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

const EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT: AirborneContext = {
  ...EXACT_LSF_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeBuildingDnAOwner() {
  return {
    counters: BUILDING_DN_A_OWNER_COUNTERS,
    landedGate: BUILDING_DN_A_OWNER_ACTION,
    previousGap: {
      selectedNextAction: BUILDING_DN_A_OWNER_ACTION,
      selectedNextFile: BUILDING_DN_A_OWNER_FILE,
      selectionStatus: PREVIOUS_GAP_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: BUILDING_DN_A_OWNER_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta building Dn,A owner", () => {
  it("lands after the A-weighted field/building gap rerank and selects coverage refresh next", () => {
    expect(summarizeBuildingDnAOwner()).toMatchObject({
      counters: BUILDING_DN_A_OWNER_COUNTERS,
      landedGate: BUILDING_DN_A_OWNER_ACTION,
      previousGap: {
        selectedNextAction: BUILDING_DN_A_OWNER_ACTION,
        selectedNextFile: BUILDING_DN_A_OWNER_FILE,
        selectionStatus: PREVIOUS_GAP_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: BUILDING_DN_A_OWNER_STATUS
    });
  });

  it("publishes paired and one-side building Dn,A from the compatible anchor-delta Gate AR route", () => {
    const paired = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_A_OUTPUT
    });
    const oneSide = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_A_OUTPUT
    });

    expect(paired.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(paired.unsupportedTargetOutputs).toEqual([]);
    expect(paired.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(paired.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(paired.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(paired.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: BUILDING_DN_A_OUTPUT,
      valuePins: [{ metric: "Dn,A", value: 49.5 }]
    });
    expect(paired.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
    expect(paired.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A out")])
    );

    expect(oneSide.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(oneSide.unsupportedTargetOutputs).toEqual([]);
    expect(oneSide.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4,
      estimatedDnTwDb: 51,
      estimatedDnWDb: 49,
      estimatedRwPrimeDb: 49
    });
    expect(oneSide.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(oneSide.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: BUILDING_DN_A_OUTPUT,
      valuePins: [{ metric: "Dn,A", value: 48 }]
    });
  });

  it("keeps paired building Dn,A/DnT,A and full building mixed targets on the same owner", () => {
    const buildingAWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_A_WEIGHTED_OUTPUTS
    });
    const buildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const fieldAWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });

    expect(buildingAWeighted.supportedTargetOutputs).toEqual(BUILDING_A_WEIGHTED_OUTPUTS);
    expect(buildingAWeighted.unsupportedTargetOutputs).toEqual([]);
    expect(buildingAWeighted.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportedMetrics: BUILDING_A_WEIGHTED_OUTPUTS,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });

    expect(buildingMixed.supportedTargetOutputs).toEqual(BUILDING_COMPATIBLE_OWNER_OUTPUTS);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual([]);
    expect(buildingMixed.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportedMetrics: expect.arrayContaining(BUILDING_COMPATIBLE_OWNER_OUTPUTS),
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 50 },
        { metric: "Dn,w", value: 51 },
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,w", value: 53 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });

    expect(fieldAWeighted.supportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);
    expect(fieldAWeighted.unsupportedTargetOutputs).toEqual([]);
    expect(fieldAWeighted.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  });

  it("preserves lab, missing-input, non-selected-anchor, and ASTM boundaries", () => {
    const labAlias = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_A_WEIGHTED_MIXED_OUTPUTS
    });
    const buildingMissingOutputBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_A_WEIGHTED_OUTPUTS
    });
    const nonSelectedBuilding = calculateAssembly(NON_SELECTED_COMPATIBLE_ANCHOR_STACK, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const mixedAstm = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: NON_OWNER_MIXED_OUTPUTS
    });

    expect(labAlias.supportedTargetOutputs).toEqual(["Rw"]);
    expect(labAlias.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(labAlias.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);

    expect(buildingMissingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(buildingMissingOutputBasis.unsupportedTargetOutputs).toEqual(BUILDING_A_WEIGHTED_OUTPUTS);
    expect(buildingMissingOutputBasis.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });

    expect(nonSelectedBuilding.airborneBasis?.anchorSourceId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
    );
    expect(nonSelectedBuilding.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(nonSelectedBuilding.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);

    expect(mixedAstm.supportedTargetOutputs).toEqual(BUILDING_COMPATIBLE_OWNER_OUTPUTS);
    expect(mixedAstm.unsupportedTargetOutputs).toEqual(["STC", "IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with the landed building Dn,A owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalized = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(PREVIOUS_GAP_ACTION);
      expect(contents, path).toContain(PREVIOUS_GAP_FILE);
      expect(contents, path).toContain(PREVIOUS_GAP_STATUS);
      expect(contents, path).toContain(BUILDING_DN_A_OWNER_ACTION);
      expect(contents, path).toContain(BUILDING_DN_A_OWNER_FILE);
      expect(contents, path).toContain(BUILDING_DN_A_OWNER_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("Dn,A 49.5");
      expect(contents, path).toContain("Dn,A 48");
      expect(contents, path).toContain("runtimeValuesMoved 2");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("webSurfaceParityContractFilesTouched: 1");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(BUILDING_DN_A_OWNER_FILE.replace("packages/engine/", ""));
  });
});
