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
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_GAP_ACTION = "post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan";
const PREVIOUS_GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts";
const PREVIOUS_GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner";

const A_WEIGHTED_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan";
const A_WEIGHTED_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts";
const A_WEIGHTED_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta A-weighted field/building surface parity input acceptance";

const A_WEIGHTED_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 6,
  sourceRowsImported: 0
} as const;

const FIELD_A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALL_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_OWNED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
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

const EXACT_LSF_FIELD_MISSING_RT60_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
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
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeAWeightedOwner() {
  return {
    counters: A_WEIGHTED_OWNER_COUNTERS,
    landedGate: A_WEIGHTED_OWNER_ACTION,
    previousGap: {
      selectedNextAction: A_WEIGHTED_OWNER_ACTION,
      selectedNextFile: A_WEIGHTED_OWNER_FILE,
      selectionStatus: PREVIOUS_GAP_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: A_WEIGHTED_OWNER_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta A-weighted field/building adapter owner", () => {
  it("lands after the one-side lab companion gap rerank and selects A-weighted surface parity next", () => {
    expect(summarizeAWeightedOwner()).toMatchObject({
      counters: A_WEIGHTED_OWNER_COUNTERS,
      landedGate: A_WEIGHTED_OWNER_ACTION,
      previousGap: {
        selectedNextAction: A_WEIGHTED_OWNER_ACTION,
        selectedNextFile: A_WEIGHTED_OWNER_FILE,
        selectionStatus: PREVIOUS_GAP_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: A_WEIGHTED_OWNER_STATUS
    });
  });

  it("publishes paired exterior-board field and building Dn,A/DnT,A from the compatible anchor-delta route", () => {
    const field = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const building = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });

    expect(field.supportedTargetOutputs).toEqual(FIELD_ALL_OUTPUTS);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwDb: 59,
      estimatedRwPrimeDb: 50
    });
    expect(field.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 50 },
        { metric: "Dn,w", value: 51 },
        { metric: "DnT,w", value: 53 },
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });
    expect(field.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING);
    expect(field.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);

    expect(building.supportedTargetOutputs).toEqual(BUILDING_OWNED_OUTPUTS);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwDb: 59,
      estimatedRwPrimeDb: 50
    });
    expect(building.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(building.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: expect.arrayContaining(BUILDING_OWNED_OUTPUTS),
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 50 },
        { metric: "Dn,w", value: 51 },
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,w", value: 53 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });
    expect(building.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
    expect(building.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A out")])
    );
  });

  it("also covers one-side exterior-board A-weighted field/building requests and A-only trigger paths", () => {
    const oneSideField = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const oneSideBuildingAOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });

    expect(oneSideField.supportedTargetOutputs).toEqual(FIELD_ALL_OUTPUTS);
    expect(oneSideField.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideField.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4,
      estimatedDnTwDb: 51,
      estimatedDnWDb: 49,
      estimatedRwDb: 57,
      estimatedRwPrimeDb: 49
    });
    expect(oneSideField.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 48 },
        { metric: "DnT,A", value: 50.4 }
      ])
    });

    expect(oneSideBuildingAOnly.supportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);
    expect(oneSideBuildingAOnly.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideBuildingAOnly.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4
    });
    expect(oneSideBuildingAOnly.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(oneSideBuildingAOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportedMetrics: FIELD_A_WEIGHTED_OUTPUTS,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 48 },
        { metric: "DnT,A", value: 50.4 }
      ])
    });
  });

  it("preserves lab, missing-input, non-selected-anchor, and ASTM boundaries", () => {
    const labAlias = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "Dn,A", "DnT,A"]
    });
    const fieldMissingRt60 = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_MISSING_RT60_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });
    const buildingMissingOutputBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });
    const nonSelectedField = calculateAssembly(NON_SELECTED_COMPATIBLE_ANCHOR_STACK, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
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
    expect(labAlias.warnings).not.toContain(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING
    );

    expect(fieldMissingRt60.supportedTargetOutputs).toEqual([]);
    expect(fieldMissingRt60.unsupportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);
    expect(fieldMissingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });

    expect(buildingMissingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(buildingMissingOutputBasis.unsupportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);
    expect(buildingMissingOutputBasis.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });

    expect(nonSelectedField.airborneBasis?.anchorSourceId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
    );
    expect(nonSelectedField.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(nonSelectedField.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(nonSelectedField.warnings).not.toContain(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING
    );

    expect(mixedAstm.supportedTargetOutputs).toEqual(BUILDING_OWNED_OUTPUTS);
    expect(mixedAstm.unsupportedTargetOutputs).toEqual(["STC", "IIC", "AIIC"]);
    expect(mixedAstm.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
  });

  it("keeps docs and current-gate runner aligned with the A-weighted owner closeout", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_GAP_ACTION);
      expect(contents, path).toContain(PREVIOUS_GAP_FILE);
      expect(contents, path).toContain(PREVIOUS_GAP_STATUS);
      expect(contents, path).toContain(A_WEIGHTED_OWNER_ACTION);
      expect(contents, path).toContain(A_WEIGHTED_OWNER_FILE);
      expect(contents, path).toContain(A_WEIGHTED_OWNER_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("runtimeValuesMoved 6");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(A_WEIGHTED_OWNER_FILE.replace("packages/engine/", ""));
  });
});
