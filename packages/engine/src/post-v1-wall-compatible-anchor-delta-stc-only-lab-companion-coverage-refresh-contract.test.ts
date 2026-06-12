import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextRuntimeBasisPromotions: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  webSurfaceParityContractFilesTouched: 1
} as const;

const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const DIRECT_RW_OUTPUT = ["Rw"] as const satisfies readonly RequestedOutputId[];
const C_ONLY_OUTPUT = ["C"] as const satisfies readonly RequestedOutputId[];
const CTR_ONLY_OUTPUT = ["Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const A_WEIGHTED_OUTPUTS = ["Rw", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["Rw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

const EXACT_LSF_PLUS_OUTER_BOARD_START = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK
] as const satisfies readonly LayerInput[];

const NON_KNAUF_ONE_SIDE_BOARD_STACK = [
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md",
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
    previousSurfaceParity: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectStcOnlyLabCompanionResult(
  result: ReturnType<typeof calculateAssembly>,
  expectedStc: number,
  expectedScopeInput: "oneSideCompatibleExteriorBoardDelta" | "pairedCompatibleExteriorBoardDelta"
) {
  expect(result.supportedTargetOutputs).toEqual(STC_ONLY_OUTPUT);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics.estimatedStc).toBe(expectedStc);
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    errorBudgetDb: 6,
    kind: "airborne_physics_prediction",
    method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    origin: "family_physics_prediction",
    toleranceClass: "uncalibrated_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "exactReducedStackSourceRow:Rw",
      "compatibleExteriorBoardDelta",
      expectedScopeInput,
      "calculatedTransmissionLossCurve",
      "ASTM E413 STC rating adapter"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["STC", "C", "Ctr"],
    noRuntimeValueMovement: true,
    runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: [...STC_ONLY_OUTPUT],
    valuePins: [{ metric: "STC", value: expectedStc }]
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
  expect(result.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
}

describe("post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh", () => {
  it("lands no-runtime STC-only closeout and selects the C/Ctr-only lab companion owner", () => {
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
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_SURFACE_PARITY_FILE,
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

  it("keeps the calculated lab companion visible in registry, adapter, surface, matrix, and V0 budget", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const declaration = getById(
      registry.candidateDeclarations,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const adapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const surfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const matrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const v0Row = getByCandidateId(
      companyV0.operatingEnvelopeRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "company V0"
    );

    expect(declaration).toMatchObject({
      basis: "element_lab",
      id: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
    expect(declaration.errorBudgetTerms).toEqual(
      expect.arrayContaining([
        { metric: "STC", notMeasuredEvidence: true, toleranceDb: 6 },
        { metric: "C", notMeasuredEvidence: true, toleranceDb: 3 },
        { metric: "Ctr", notMeasuredEvidence: true, toleranceDb: 3 }
      ])
    );
    expect(declaration.requiredInputs).toEqual(
      expect.arrayContaining([
        "exactReducedStackSourceRow:Rw",
        "compatibleExteriorBoardDelta",
        "oneSideCompatibleExteriorBoardDelta",
        "calculatedTransmissionLossCurve",
        "ASTM_E413_STC_curve_rating",
        "ISO_717_1_C_Ctr_curve_rating"
      ])
    );
    expect(declaration.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "source_id=knauf_lab_416889_primary_2026",
        "source_metric=Rw",
        "compatible_exterior_board_delta_applied",
        "one_side_compatible_exterior_board_delta_allowed",
        "no_field_or_building_metric_promotion"
      ])
    );

    expect(adapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidate: {
        id: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
        supportedMetrics: [...WALL_LAB_OUTPUTS],
        valuePins: []
      },
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    });

    expect(surfaceRow).toMatchObject({
      noRuntimeValueMovement: true,
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });

    expect(matrixRow).toMatchObject({
      candidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      noRuntimeValueMovement: true,
      readinessBucket: "ready_with_budget",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
    expect(v0Row).toMatchObject({
      candidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      noRuntimeValueMovement: true,
      readinessBucket: "ready_with_budget",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
  });

  it("re-probes STC-only values and keeps direct, mixed, C/Ctr-only, field/building, A-weighted, ASTM, and non-Knauf boundaries", () => {
    const pairedStcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const oneSideStcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_START, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const rwOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: DIRECT_RW_OUTPUT
    });
    const mixedLab = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const cOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });
    const ctrOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: CTR_ONLY_OUTPUT
    });
    const buildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });
    const aWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const astm = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });
    const nonKnaufMixed = calculateAssembly(NON_KNAUF_ONE_SIDE_BOARD_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expectStcOnlyLabCompanionResult(pairedStcOnly, 59, "pairedCompatibleExteriorBoardDelta");
    expectStcOnlyLabCompanionResult(oneSideStcOnly, 57, "oneSideCompatibleExteriorBoardDelta");

    expect(rwOnly.supportedTargetOutputs).toEqual(DIRECT_RW_OUTPUT);
    expect(rwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(59);
    expect(rwOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 59 }]
    });

    expect(mixedLab.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(mixedLab.unsupportedTargetOutputs).toEqual([]);
    expect(mixedLab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6,
      estimatedRwDb: 59,
      estimatedStc: 59
    });
    expect(mixedLab.airborneBasis?.method).toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD
    );

    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.unsupportedTargetOutputs).toEqual([]);
    expect(cOnly.metrics.estimatedCDb).toBe(-1.1);
    expect(cOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["C"],
      valuePins: [{ metric: "C", value: -1.1 }]
    });
    expect(ctrOnly.supportedTargetOutputs).toEqual(["Ctr"]);
    expect(ctrOnly.unsupportedTargetOutputs).toEqual([]);
    expect(ctrOnly.metrics.estimatedCtrDb).toBe(-6);
    expect(ctrOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Ctr"],
      valuePins: [{ metric: "Ctr", value: -6 }]
    });

    expect(buildingMixed.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(aWeighted.supportedTargetOutputs).toEqual(["Rw"]);
    expect(aWeighted.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(astm.supportedTargetOutputs).toEqual(["Rw"]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(nonKnaufMixed.supportedTargetOutputs).toEqual(["Rw"]);
    expect(nonKnaufMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(nonKnaufMixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with closeout and the next value-moving C/Ctr-only owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD);
      expect(content, path).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("STC 59");
      expect(content, path).toContain("STC 57");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("allowed_with_budget");
      expect(normalized, path).toContain("C/Ctr-only");
      expect(normalized, path).toContain("value-moving");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
