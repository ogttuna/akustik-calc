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
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID =
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;
const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta STC-only lab companion owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextRuntimeBasisPromotions: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const BUILDING_DN_A_OUTPUT = ["Dn,A"] as const satisfies readonly RequestedOutputId[];
const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_ALL_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const FIELD_ALL_OUTPUTS = BUILDING_ALL_OUTPUTS;
const BUILDING_DECLARED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const FIELD_DECLARED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const LAB_A_WEIGHTED_MIXED_OUTPUTS = ["Rw", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
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
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
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
    previousOwner: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectBuildingDnAResult(result: ReturnType<typeof calculateAssembly>, expectedDnA: number) {
  expect(result.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics.estimatedDnADb).toBe(expectedDnA);
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    supportedMetrics: BUILDING_DN_A_OUTPUT,
    valuePins: [{ metric: "Dn,A", value: expectedDnA }]
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
}

describe("post-V1 wall compatible anchor-delta building Dn,A coverage refresh", () => {
  it("lands no-runtime coverage refresh and selects a value-moving STC-only lab companion owner", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      previousOwner: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_OWNER_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      COVERAGE_REFRESH_FILE,
      SELECTED_NEXT_PLAN_DOC,
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

  it("keeps Gate I and Gate AR field/building owners visible in registry, adapter, surface, coverage matrix, and V0", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const fieldDeclaration = getById(registry.candidateDeclarations, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "registry");
    const buildingDeclaration = getById(
      registry.candidateDeclarations,
      BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const fieldAdapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const buildingAdapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const fieldSurfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const buildingSurfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const fieldMatrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const buildingMatrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const fieldV0Row = getByCandidateId(companyV0.operatingEnvelopeRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "V0");
    const buildingV0Row = getByCandidateId(
      companyV0.operatingEnvelopeRows,
      BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      "V0"
    );

    expect(fieldDeclaration).toMatchObject({
      basis: "field_apparent",
      id: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: FIELD_DECLARED_OUTPUTS,
      valuePins: []
    });
    expect(buildingDeclaration).toMatchObject({
      basis: "building_prediction",
      id: BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS,
      valuePins: []
    });

    expect(fieldAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidate: {
        supportedMetrics: FIELD_DECLARED_OUTPUTS,
        valuePins: []
      }
    });
    expect(buildingAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      route: "wall",
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidate: {
        supportedMetrics: BUILDING_DECLARED_OUTPUTS,
        valuePins: []
      }
    });
    for (const row of [fieldSurfaceRow, fieldMatrixRow, fieldV0Row]) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        route: "wall",
        runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        supportedMetrics: FIELD_DECLARED_OUTPUTS,
        valuePins: []
      });
    }
    for (const row of [buildingSurfaceRow, buildingMatrixRow, buildingV0Row]) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        route: "wall",
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        supportedMetrics: BUILDING_DECLARED_OUTPUTS,
        valuePins: []
      });
    }

    expect(fieldMatrixRow).toMatchObject({
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      hasVisibleCandidateTrace: true,
      readinessBucket: "ready_with_budget"
    });
    expect(buildingMatrixRow).toMatchObject({
      candidateId: BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      hasVisibleCandidateTrace: true,
      readinessBucket: "ready_with_budget"
    });
    expect(fieldV0Row).toMatchObject({
      candidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      readinessBucket: "ready_with_budget"
    });
    expect(buildingV0Row).toMatchObject({
      candidateId: BUILDING_FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      readinessBucket: "ready_with_budget"
    });
  });

  it("re-probes paired and one-side building Dn,A plus already-live A-weighted companions", () => {
    const pairedBuildingDnA = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_A_OUTPUT
    });
    const oneSideBuildingDnA = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_A_OUTPUT
    });
    const pairedBuildingAll = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_ALL_OUTPUTS
    });
    const oneSideBuildingAWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const pairedFieldAll = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ALL_OUTPUTS
    });

    expectBuildingDnAResult(pairedBuildingDnA, 49.5);
    expectBuildingDnAResult(oneSideBuildingDnA, 48);

    expect(pairedBuildingAll.supportedTargetOutputs).toEqual(BUILDING_ALL_OUTPUTS);
    expect(pairedBuildingAll.unsupportedTargetOutputs).toEqual([]);
    expect(pairedBuildingAll.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: expect.arrayContaining(BUILDING_ALL_OUTPUTS),
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 50 },
        { metric: "Dn,w", value: 51 },
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,w", value: 53 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });

    expect(oneSideBuildingAWeighted.supportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
    expect(oneSideBuildingAWeighted.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideBuildingAWeighted.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 48 },
        { metric: "DnT,A", value: 50.4 }
      ])
    });

    expect(pairedFieldAll.supportedTargetOutputs).toEqual(FIELD_ALL_OUTPUTS);
    expect(pairedFieldAll.unsupportedTargetOutputs).toEqual([]);
    expect(pairedFieldAll.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(pairedFieldAll.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([
        { metric: "Dn,A", value: 49.5 },
        { metric: "DnT,A", value: 51.9 }
      ])
    });
  });

  it("keeps lab aliases, missing-input, non-selected-anchor, and ASTM boundaries pinned while the selected STC-only owner lands", () => {
    const labAlias = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_A_WEIGHTED_MIXED_OUTPUTS
    });
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const buildingMissingOutputBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const nonSelectedBuilding = calculateAssembly(NON_SELECTED_COMPATIBLE_ANCHOR_STACK, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_ALL_OUTPUTS
    });
    const mixedAstm = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: NON_OWNER_MIXED_OUTPUTS
    });

    expect(labAlias.supportedTargetOutputs).toEqual(["Rw"]);
    expect(labAlias.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual([]);
    expect(stcOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["STC"],
      valuePins: [{ metric: "STC", value: 59 }]
    });

    expect(buildingMissingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(buildingMissingOutputBasis.unsupportedTargetOutputs).toEqual(A_WEIGHTED_OUTPUTS);
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

    expect(mixedAstm.supportedTargetOutputs).toEqual(BUILDING_ALL_OUTPUTS);
    expect(mixedAstm.unsupportedTargetOutputs).toEqual(["STC", "IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with the refresh and selected value-moving plan", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("Dn,A 49.5");
      expect(content, path).toContain("Dn,A 48");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(normalized, path).toContain("STC-only");
      expect(normalized, path).toContain("value-moving");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
