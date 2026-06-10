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
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SCOPE_EXPANSION_ACTION = "post_v1_wall_compatible_anchor_delta_scope_expansion_plan";
const PREVIOUS_SCOPE_EXPANSION_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts";
const PREVIOUS_SCOPE_EXPANSION_SELECTION_STATUS =
  "post_v1_wall_compatible_anchor_delta_scope_expansion_landed_runtime_selected_field_building_adapter_owner";

const FIELD_BUILDING_ADAPTER_ACTION =
  "post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan";
const FIELD_BUILDING_ADAPTER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts";
const FIELD_BUILDING_ADAPTER_SELECTION_STATUS =
  "post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance";

const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta field/building surface parity input acceptance";

const FIELD_BUILDING_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 6,
  sourceRowsImported: 0
} as const;

const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_UNOWNED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A",
  "STC"
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
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeFieldBuildingAdapterOwner() {
  return {
    counters: FIELD_BUILDING_COUNTERS,
    landedGate: FIELD_BUILDING_ADAPTER_ACTION,
    previousScopeExpansion: {
      selectedNextAction: FIELD_BUILDING_ADAPTER_ACTION,
      selectedNextFile: FIELD_BUILDING_ADAPTER_FILE,
      selectionStatus: PREVIOUS_SCOPE_EXPANSION_SELECTION_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: FIELD_BUILDING_ADAPTER_SELECTION_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta field/building adapter owner", () => {
  it("lands after scope expansion and selects surface parity/input acceptance next", () => {
    expect(summarizeFieldBuildingAdapterOwner()).toMatchObject({
      counters: FIELD_BUILDING_COUNTERS,
      landedGate: FIELD_BUILDING_ADAPTER_ACTION,
      previousScopeExpansion: {
        selectedNextAction: FIELD_BUILDING_ADAPTER_ACTION,
        selectedNextFile: FIELD_BUILDING_ADAPTER_FILE,
        selectionStatus: PREVIOUS_SCOPE_EXPANSION_SELECTION_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: FIELD_BUILDING_ADAPTER_SELECTION_STATUS
    });
  });

  it("routes complete field and building requests through the anchor-delta direct curve plus Gate I / Gate AR", () => {
    const field = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const building = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });

    expect(field.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwDb: 59,
      estimatedRwPrimeDb: 50
    });
    expect(field.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "exactReducedStackSourceRow",
        "compatibleExteriorBoardDelta",
        "GateI_or_GateAR_field_building_adapter_owner",
        "fieldContext.receivingRoomRt60S"
      ])
    );
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: FIELD_BUILDING_OUTPUTS,
      valuePins: [
        { metric: "R'w", value: 50 },
        { metric: "DnT,w", value: 53 },
        { metric: "Dn,w", value: 51 }
      ]
    });
    expect(field.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
    expect(field.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING);

    expect(building.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwDb: 59,
      estimatedRwPrimeDb: 50
    });
    expect(building.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);
    expect(building.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "exactReducedStackSourceRow",
        "compatibleExteriorBoardDelta",
        "GateI_or_GateAR_field_building_adapter_owner",
        "buildingPredictionOutputBasis"
      ])
    );
    expect(building.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(building.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: FIELD_BUILDING_OUTPUTS,
      valuePins: [
        { metric: "R'w", value: 50 },
        { metric: "DnT,w", value: 53 },
        { metric: "Dn,w", value: 51 }
      ]
    });
    expect(building.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
    expect(building.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING);
  });

  it("preserves missing-input, metric-scope, and lab precedence boundaries", () => {
    const lab = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    const fieldMissingRt60 = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_MISSING_RT60_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const buildingMissingOutputBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const buildingMixedUnowned = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_UNOWNED_OUTPUTS
    });

    expect(lab.metrics.estimatedRwDb).toBe(59);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.airborneBasis?.method).toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD);
    expect(lab.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);

    expect(fieldMissingRt60.supportedTargetOutputs).toEqual([]);
    expect(fieldMissingRt60.unsupportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(fieldMissingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(fieldMissingRt60.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input",
      unsupportedOutputs: FIELD_BUILDING_OUTPUTS
    });

    expect(buildingMissingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(buildingMissingOutputBasis.unsupportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(buildingMissingOutputBasis.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });
    expect(buildingMissingOutputBasis.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(buildingMissingOutputBasis.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: ["buildingPredictionOutputBasis"],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      valuePins: []
    });

    expect(buildingMixedUnowned.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS, "Dn,A", "DnT,A"]);
    expect(buildingMixedUnowned.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(buildingMixedUnowned.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING)])
    );
    expect(buildingMixedUnowned.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A")])
    );
  });

  it("keeps docs and current-gate runner aligned with the landed adapter owner and selected next", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_SCOPE_EXPANSION_ACTION);
      expect(contents, path).toContain(PREVIOUS_SCOPE_EXPANSION_FILE);
      expect(contents, path).toContain(PREVIOUS_SCOPE_EXPANSION_SELECTION_STATUS);
      expect(contents, path).toContain(FIELD_BUILDING_ADAPTER_ACTION);
      expect(contents, path).toContain(FIELD_BUILDING_ADAPTER_FILE);
      expect(contents, path).toContain(FIELD_BUILDING_ADAPTER_SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("runtimeValuesMoved 6");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(FIELD_BUILDING_ADAPTER_FILE.replace("packages/engine/", ""));
  });
});
