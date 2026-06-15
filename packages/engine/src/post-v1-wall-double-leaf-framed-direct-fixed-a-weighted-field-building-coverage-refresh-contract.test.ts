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
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity";

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after direct-fixed A-weighted field/building";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
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

const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BASE_FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_DECLARED_OUTPUTS = [
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
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const TWO_BOARD_CONTEXT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_EMPTY_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 0.5,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 22.5,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  wallTopology: {
    ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: undefined
};

const DIRECT_FIXED_GATE_AY_PANEL_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ],
    panels: [
      {
        criticalFrequencyHz: 2500,
        id: "panel-a",
        lossFactor: 0.03,
        materialClass: "gypsum_board",
        sequence: 1,
        surfaceMassKgM2: 10.6,
        thicknessMm: 12.5
      }
    ],
    wallSolverIntent: "advanced_source_absent_wall"
  }
};

const NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  connectionType: undefined,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT.wallTopology,
    cavity1DepthMm: 90,
    supportTopology: "independent_frames"
  }
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md",
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

function calculateWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = A_WEIGHTED_OUTPUTS
) {
  return calculateAssembly(TWO_BOARD_CONTEXT_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function withFieldContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    contextMode: "field_between_rooms",
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50
  };
}

function withBuildingContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50,
    sourceRoomVolumeM3: 45
  };
}

function expectDirectFixedAWeightedRuntime(
  context: AirborneContext,
  expected: {
    DnA: number;
    DnTA: number;
    DnTw: number;
    DnW: number;
    RwPrime: number;
  },
  basis: {
    method: string;
    selectedCandidateId: string;
    traceSelectedCandidateId?: string;
  }
) {
  const result = calculateWall(context);

  expect(result.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: expected.DnA,
    estimatedDnTADb: expected.DnTA,
    estimatedDnTwDb: expected.DnTw,
    estimatedDnWDb: expected.DnW,
    estimatedRwPrimeDb: expected.RwPrime
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: basis.selectedCandidateId,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.airborneBasis).toMatchObject({
    method: basis.method,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.assumptions ?? []).toEqual(
    expect.arrayContaining([expect.stringContaining(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD)])
  );
  expect(result.airborneBasis?.requiredInputs ?? []).toEqual(
    expect.arrayContaining([
      "GateER_direct_fixed_field_building_adapter_owner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner"
    ])
  );
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: basis.method,
    selectedCandidateId: basis.traceSelectedCandidateId ?? basis.selectedCandidateId,
    supportedMetrics: [...A_WEIGHTED_OUTPUTS],
    valuePins: expect.arrayContaining([
      { metric: "Dn,A", value: expected.DnA },
      { metric: "DnT,A", value: expected.DnTA }
    ])
  });
  expect(result.warnings).toContain(GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING);

  return result;
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousOwner: {
      selectedNextAction: PREVIOUS_SURFACE_PARITY_ACTION,
      selectedNextFile: PREVIOUS_SURFACE_PARITY_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    previousSurfaceParity: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
    },
    routeFamily: "wall.double_leaf_framed.direct_fixed",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS,
    targetOutputs: A_WEIGHTED_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh", () => {
  it("lands the no-runtime coverage refresh and selects the next numeric gap rerank", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      previousOwner: {
        selectedNextAction: PREVIOUS_SURFACE_PARITY_ACTION,
        selectedNextFile: PREVIOUS_SURFACE_PARITY_FILE,
        selectionStatus: PREVIOUS_OWNER_STATUS
      },
      previousSurfaceParity: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
      },
      routeFamily: "wall.double_leaf_framed.direct_fixed",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS,
      targetOutputs: A_WEIGHTED_OUTPUTS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
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

  it("keeps Gate I and Gate AR A-weighted adapters visible in registry, adapter, surface, matrix, and V0", () => {
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
      "surface"
    );
    const buildingSurfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      "surface"
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
      supportedMetrics: FIELD_DECLARED_OUTPUTS
    });
    expect(buildingDeclaration).toMatchObject({
      basis: "building_prediction",
      id: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS
    });

    expect(fieldAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidate: {
        supportedMetrics: FIELD_DECLARED_OUTPUTS
      }
    });
    for (const row of [fieldSurfaceRow, fieldMatrixRow, fieldV0Row]) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        supportedMetrics: FIELD_DECLARED_OUTPUTS
      });
    }
    expect(buildingAdapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidate: {
        supportedMetrics: BUILDING_DECLARED_OUTPUTS
      }
    });
    for (const row of [buildingSurfaceRow, buildingMatrixRow, buildingV0Row]) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        supportedMetrics: BUILDING_DECLARED_OUTPUTS
      });
    }
    for (const row of [fieldMatrixRow, buildingMatrixRow]) {
      expect(row).toMatchObject({
        candidateKind: "field_building_adapter",
        hasVisibleCandidateTrace: true,
        readinessBucket: "ready_with_budget",
        supportBucket: "field_adapter"
      });
    }
    for (const row of [fieldV0Row, buildingV0Row]) {
      expect(row).toMatchObject({
        companyInternalUse: "allowed_with_budget",
        readinessBucket: "ready_with_budget"
      });
    }
  });

  it("re-probes empty, full, and partial direct-fixed A-weighted field requests through Gate EO plus Gate I", () => {
    expectDirectFixedAWeightedRuntime(
      withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT),
      { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
      {
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
      }
    );
    expectDirectFixedAWeightedRuntime(
      withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
      }
    );
    expectDirectFixedAWeightedRuntime(
      withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
      {
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("re-probes empty, full, and partial direct-fixed A-weighted building requests through Gate EO plus Gate AR", () => {
    expectDirectFixedAWeightedRuntime(
      withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT),
      { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
      {
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
    expectDirectFixedAWeightedRuntime(
      withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
    expectDirectFixedAWeightedRuntime(
      withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
      {
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("keeps base field/building values and lab/ASTM/impact/route boundaries pinned", () => {
    const baseFullField = calculateWall(
      withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      BASE_FIELD_BUILDING_OUTPUTS
    );
    const mixedBaseAndA = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), [
      ...BASE_FIELD_BUILDING_OUTPUTS,
      ...A_WEIGHTED_OUTPUTS
    ]);
    const missingFlow = calculateWall(withFieldContext(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW));
    const gateAyPanels = calculateWall(withFieldContext(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT));
    const nonDirect = calculateWall(NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, LAB_OUTPUTS);
    const labAliases = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), LAB_OUTPUTS);
    const astm = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), ASTM_OUTPUTS);
    const impact = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), IMPACT_OUTPUTS);

    expect(baseFullField.supportedTargetOutputs).toEqual([...BASE_FIELD_BUILDING_OUTPUTS]);
    expect(baseFullField.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(baseFullField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });

    expect(mixedBaseAndA.supportedTargetOutputs).toEqual([...BASE_FIELD_BUILDING_OUTPUTS, ...A_WEIGHTED_OUTPUTS]);
    expect(mixedBaseAndA.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31,
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(mixedBaseAndA.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
      origin: "needs_input"
    });

    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "unsupported"
    });

    expect(nonDirect.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(nonDirect.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(nonDirect.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    });

    expect(labAliases.supportedTargetOutputs).toEqual([]);
    expect(labAliases.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the refresh and selected numeric rerank", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_FILE);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
      expect(content, path).toContain("Dn,A 24.9");
      expect(content, path).toContain("DnT,A 27");
      expect(content, path).toContain("Dn,A 28.9");
      expect(content, path).toContain("DnT,A 31");
      expect(content, path).toContain("Dn,A 26.9");
      expect(content, path).toContain("DnT,A 29");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("allowed_with_budget");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
