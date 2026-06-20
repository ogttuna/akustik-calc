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
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building";

const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 next numeric coverage gap after A-weighted field/building";

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

const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALL_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const FIELD_ADAPTER_DECLARED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_DECLARED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
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

function getById<Row extends { readonly id: string }>(rows: readonly Row[], id: string, label: string): Row {
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error(`Missing ${label} row ${id}.`);
  }
  return row;
}

function getByCandidateId<Row extends { readonly candidateId: string }>(
  rows: readonly Row[],
  candidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.candidateId === candidateId);
  if (!row) {
    throw new Error(`Missing ${label} candidate row ${candidateId}.`);
  }
  return row;
}

function getBySelectedCandidateId<Row extends { readonly selectedCandidateId: string }>(
  rows: readonly Row[],
  selectedCandidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.selectedCandidateId === selectedCandidateId);
  if (!row) {
    throw new Error(`Missing ${label} selected-candidate row ${selectedCandidateId}.`);
  }
  return row;
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectPairedFieldAWeightedResult(result: ReturnType<typeof calculateAssembly>) {
  expect(result.supportedTargetOutputs).toEqual(FIELD_ALL_OUTPUTS);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: 49.5,
    estimatedDnTADb: 51.9,
    estimatedDnTwDb: 53,
    estimatedDnWDb: 51,
    estimatedRwPrimeDb: 50
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
    method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
    supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
    valuePins: expect.arrayContaining([
      { metric: "R'w", value: 50 },
      { metric: "Dn,w", value: 51 },
      { metric: "DnT,w", value: 53 },
      { metric: "Dn,A", value: 49.5 },
      { metric: "DnT,A", value: 51.9 }
    ])
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
}

describe("post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh", () => {
  it("lands no-runtime coverage refresh and selects the next numeric gap after A-weighted field/building", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      previousSurfaceParity: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_SURFACE_PARITY_FILE,
      COVERAGE_REFRESH_FILE,
      "packages/engine/src/layer-combination-resolver-registry.ts",
      "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
      "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps A-weighted field/building owners visible in registry, adapter, surface, coverage matrix, and V0", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const fieldDeclaration = getById(registry.candidateDeclarations, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "registry");
    const buildingDeclaration = getById(
      registry.candidateDeclarations,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const fieldAdapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const buildingAdapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const fieldSurfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const buildingSurfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const fieldMatrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const buildingMatrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const fieldV0Row = getByCandidateId(companyV0.operatingEnvelopeRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "V0");
    const buildingV0Row = getByCandidateId(
      companyV0.operatingEnvelopeRows,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "V0"
    );

    expect(fieldDeclaration).toMatchObject({
      basis: "field_apparent",
      id: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: FIELD_ADAPTER_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(fieldDeclaration.formulaTerms).toEqual(
      expect.arrayContaining([
        "field_context_partition_area",
        "receiving_room_volume_normalization",
        "receiving_room_rt60_standardization",
        "owned_lab_family_curve_adapter"
      ])
    );
    expect(fieldDeclaration.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "field_between_rooms_context",
        "receiving_room_volume_present",
        "receiving_room_rt60_present",
        "no_building_prediction_transfer"
      ])
    );

    expect(buildingDeclaration).toMatchObject({
      basis: "building_prediction",
      id: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(buildingDeclaration.formulaTerms).toEqual(
      expect.arrayContaining([
        "owned_direct_separating_element_frequency_curve",
        "explicit_flanking_path_energy_overlay",
        "source_and_receiving_room_volume_normalization",
        "receiving_room_rt60_standardization",
        "iso_12354_1_building_prediction_runtime_budget"
      ])
    );
    expect(buildingDeclaration.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "building_prediction_context",
        "complete_flanking_junction_context",
        "complete_room_standardization_context",
        "owned_direct_lab_family_curve"
      ])
    );

    expect(fieldAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        id: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
        kind: "field_building_adapter",
        ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        supportedMetrics: FIELD_ADAPTER_DECLARED_OUTPUTS
      }
    });
    expect(buildingAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      requestedBasis: "building_prediction",
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedCandidate: {
        id: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
        kind: "field_building_adapter",
        ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        supportedMetrics: BUILDING_DECLARED_OUTPUTS
      }
    });

    expect(fieldSurfaceRow).toMatchObject({
      basis: "field_apparent",
      candidateKind: "field_building_adapter",
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: FIELD_ADAPTER_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(fieldMatrixRow).toMatchObject({
      basis: "field_apparent",
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      candidateKind: "field_building_adapter",
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: FIELD_ADAPTER_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(fieldV0Row).toMatchObject({
      basis: "field_apparent",
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: FIELD_ADAPTER_DECLARED_OUTPUTS,
      valuePins: []
    });

    expect(buildingSurfaceRow).toMatchObject({
      basis: "building_prediction",
      candidateKind: "field_building_adapter",
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(buildingMatrixRow).toMatchObject({
      basis: "building_prediction",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      candidateKind: "field_building_adapter",
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(buildingV0Row).toMatchObject({
      basis: "building_prediction",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      supportBucket: "field_adapter",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS,
      valuePins: []
    });

    expect(fieldMatrixRow).toMatchObject({
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      hasVisibleCandidateTrace: true,
      readinessBucket: "ready_with_budget"
    });
    expect(buildingMatrixRow).toMatchObject({
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      hasVisibleCandidateTrace: true,
      readinessBucket: "ready_with_budget"
    });
    expect(fieldV0Row).toMatchObject({
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      readinessBucket: "ready_with_budget"
    });
    expect(buildingV0Row).toMatchObject({
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      readinessBucket: "ready_with_budget"
    });
  });

  it("re-probes paired and one-side A-weighted field/building values with live calculator traces", () => {
    const pairedField = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const oneSideFieldAOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const pairedBuilding = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });
    const oneSideBuildingAOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });

    expectPairedFieldAWeightedResult(pairedField);

    expect(oneSideFieldAOnly.supportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
    expect(oneSideFieldAOnly.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideFieldAOnly.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4
    });
    expect(oneSideFieldAOnly.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(oneSideFieldAOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      supportedMetrics: A_WEIGHTED_OUTPUTS,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 48 },
        { metric: "DnT,A", value: 50.4 }
      ])
    });

    expect(pairedBuilding.supportedTargetOutputs).toEqual(BUILDING_COMPATIBLE_OWNER_OUTPUTS);
    expect(pairedBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(pairedBuilding.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(pairedBuilding.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(pairedBuilding.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: expect.arrayContaining([...BUILDING_COMPATIBLE_OWNER_OUTPUTS]),
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 50 },
        { metric: "Dn,w", value: 51 },
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,w", value: 53 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });

    expect(oneSideBuildingAOnly.supportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
    expect(oneSideBuildingAOnly.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideBuildingAOnly.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4
    });
    expect(oneSideBuildingAOnly.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(oneSideBuildingAOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: A_WEIGHTED_OUTPUTS,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 48 },
        { metric: "DnT,A", value: 50.4 }
      ])
    });
  });

  it("keeps lab, missing-input, ASTM, and non-selected-anchor boundaries outside the owner", () => {
    const labAWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_A_WEIGHTED_MIXED_OUTPUTS
    });
    const fieldMissingRt60 = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_MISSING_RT60_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const buildingMissingOutputBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
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

    expect(labAWeighted.supportedTargetOutputs).toEqual(["Rw"]);
    expect(labAWeighted.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(labAWeighted.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(FIELD_ADAPTER_SELECTED_CANDIDATE_ID);

    expect(fieldMissingRt60.supportedTargetOutputs).toEqual([]);
    expect(fieldMissingRt60.unsupportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
    expect(fieldMissingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });

    expect(buildingMissingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(buildingMissingOutputBasis.unsupportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
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

    expect(mixedAstm.supportedTargetOutputs).toEqual(BUILDING_COMPATIBLE_OWNER_OUTPUTS);
    expect(mixedAstm.unsupportedTargetOutputs).toEqual(["STC", "IIC", "AIIC"]);
    expect(mixedAstm.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
  });

  it("keeps docs and current-gate runner aligned with the landed coverage refresh and selected next plan", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(content, path).toContain("Dn,A 49.5 / DnT,A 51.9");
      expect(content, path).toContain("Dn,A 48 / DnT,A 50.4");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("allowed_with_budget");
      expect(normalized, path).toContain("building `dn,a`");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
