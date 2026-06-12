import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  estimatedNextNewCalculableRequestShapes: 1,
  estimatedNextNewCalculableTargetOutputs: 4,
  estimatedNextRuntimeBasisPromotions: 1,
  frontendImplementationFilesTouched: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  webSurfaceParityContractFilesTouched: 1
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_ALIAS_OUTPUTS = ["R'w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const TWO_BOARD_CONTEXT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "empty",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT: AirborneContext = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 90,
        depthMm: 90,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const CONTEXT_ONLY_PARTIAL_ABSORPTIVE_CAVITY_CONTEXT: AirborneContext = {
  ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 0.5,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 90,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  wallTopology: {
    ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const CONTEXT_ONLY_ABSORPTIVE_WITHOUT_FLOW: AirborneContext = {
  ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
  advancedWall: undefined
};

const CONTEXT_ONLY_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS: AirborneContext = {
  ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
  wallTopology: {
    cavity1DepthMm: 90,
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT: AirborneContext = {
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

const DIRECT_FIXED_CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT: AirborneContext = {
  ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
  connectionType: "direct_fix",
  sharedTrack: undefined,
  studSpacingMm: 400,
  wallTopology: {
    ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT.wallTopology,
    cavity1DepthMm: 45,
    supportTopology: "direct_fixed"
  }
};

const GATE_AY_ADVANCED_WALL_STILL_OWNS_PANELS_CONTEXT: AirborneContext = {
  ...CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 90,
        depthMm: 90,
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

const THICK_BOARD_AUTO_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 100 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md",
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
  layers: readonly LayerInput[],
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = WALL_LAB_OUTPUTS
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectDoubleLeafContextRuntime(
  context: AirborneContext,
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
  }
) {
  const result = calculateWall(TWO_BOARD_CONTEXT_STACK, context);

  expect(result.metrics).toMatchObject({
    estimatedCDb: expected.C,
    estimatedCtrDb: expected.Ctr,
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC
  });
  expect(result.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.airborneBasis).toMatchObject({
    method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    valuePins: [
      { metric: "Rw", value: expected.Rw },
      { metric: "STC", value: expected.STC },
      { metric: "C", value: expected.C },
      { metric: "Ctr", value: expected.Ctr }
    ]
  });
  expect(result.warnings).toContain(
    LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
  );

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
    routeFamily: "wall.double_leaf_framed",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS,
    targetOutputs: WALL_LAB_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh", () => {
  it("lands the no-runtime closeout and selects the direct-fixed context absorptive-cavity owner", () => {
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
      routeFamily: "wall.double_leaf_framed",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS,
      targetOutputs: WALL_LAB_OUTPUTS
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

  it("keeps the double-leaf/framed source-absent route visible in registry, adapter, surface, matrix, and V0 budget", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const declaration = getById(
      registry.candidateDeclarations,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const adapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const surfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const matrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const v0Row = getByCandidateId(
      companyV0.operatingEnvelopeRows,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "company V0"
    );

    expect(declaration).toMatchObject({
      basis: "element_lab",
      id: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: expect.arrayContaining([...WALL_LAB_OUTPUTS])
    });
    expect(declaration.requiredInputs).toEqual(
      expect.arrayContaining([
        "route=wall",
        "topologyMode=double_leaf_framed",
        "sideALeafMassKgM2",
        "sideBLeafMassKgM2",
        "cavity1DepthMm",
        "bridgeClass",
        "supportSpacingMm",
        "absorberFlowResistivityOrDefault",
        "iso717AirborneRatingAdapter"
      ])
    );
    expect(declaration.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "wall_route",
        "double_leaf_framed_topology",
        "single_primary_cavity",
        "non_direct_fixed_bridge_class",
        "element_lab_metric_basis",
        "not_floor_impact_not_field_not_building_not_astm_rating"
      ])
    );

    for (const row of [adapterRow, surfaceRow, matrixRow, v0Row]) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
      });
    }
    expect(matrixRow).toMatchObject({
      candidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      readinessBucket: "ready_with_budget",
      supportBucket: "source_absent_estimate",
      supportedMetrics: expect.arrayContaining([...WALL_LAB_OUTPUTS])
    });
    expect(v0Row).toMatchObject({
      candidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      readinessBucket: "ready_with_budget",
      supportBucket: "source_absent_estimate",
      supportedMetrics: expect.arrayContaining([...WALL_LAB_OUTPUTS])
    });
    expect(matrixRow.valuePins).toEqual(
      expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    );
  });

  it("re-probes context-owned full, partial, empty, and single-metric lab requests", () => {
    expectDoubleLeafContextRuntime(CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 46,
      STC: 46
    });
    expectDoubleLeafContextRuntime(CONTEXT_ONLY_PARTIAL_ABSORPTIVE_CAVITY_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 44,
      STC: 44
    });
    expectDoubleLeafContextRuntime(CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 42,
      STC: 42
    });

    const singleMetricProbes = [
      { outputs: ["Rw"], valuePins: [{ metric: "Rw", value: 46 }] },
      { outputs: ["STC"], valuePins: [{ metric: "STC", value: 46 }] },
      { outputs: ["C"], valuePins: [{ metric: "C", value: -1 }] },
      { outputs: ["Ctr"], valuePins: [{ metric: "Ctr", value: -6.1 }] },
      {
        outputs: ["C", "Ctr"],
        valuePins: [
          { metric: "C", value: -1 },
          { metric: "Ctr", value: -6.1 }
        ]
      }
    ] as const satisfies readonly {
      readonly outputs: readonly RequestedOutputId[];
      readonly valuePins: readonly { readonly metric: RequestedOutputId; readonly value: number }[];
    }[];

    for (const probe of singleMetricProbes) {
      const result = calculateWall(
        TWO_BOARD_CONTEXT_STACK,
        CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
        probe.outputs
      );

      expect(result.supportedTargetOutputs).toEqual([...probe.outputs]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
        selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        valuePins: [...probe.valuePins]
      });
    }
  });

  it("keeps missing inputs, the now-landed direct-fixed owner, Gate AY panels, aliases, ASTM, and impact outside this owner", () => {
    const missingFlow = calculateWall(TWO_BOARD_CONTEXT_STACK, CONTEXT_ONLY_ABSORPTIVE_WITHOUT_FLOW);
    const missingClass = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS
    );
    const directFixedEmpty = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      DIRECT_FIXED_CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT
    );
    const directFixedAbsorptive = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      DIRECT_FIXED_CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT
    );
    const gateAyPanels = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      GATE_AY_ADVANCED_WALL_STILL_OWNS_PANELS_CONTEXT
    );
    const exact = calculateWall(EXACT_LSF_LAB_STACK, EXACT_LSF_LAB_CONTEXT);
    const anchorDelta = calculateWall(EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_LAB_CONTEXT, ["Rw"]);
    const thickBoardAuto = calculateWall(THICK_BOARD_AUTO_STACK, { contextMode: "element_lab" });
    const labFieldAlias = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
      WALL_FIELD_ALIAS_OUTPUTS
    );
    const astm = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
      ASTM_OUTPUTS
    );
    const impact = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_FULL_ABSORPTIVE_CAVITY_CONTEXT,
      IMPACT_OUTPUTS
    );

    for (const result of [missingFlow, missingClass]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: "candidate_dynamic_needs_input",
        selectedOrigin: "needs_input"
      });
      expect(result.airborneBasis).toMatchObject({
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
        origin: "needs_input"
      });
      expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
      );
    }

    expect(directFixedEmpty.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(directFixedEmpty.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixedEmpty.airborneBasis).toMatchObject({
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(directFixedAbsorptive.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 35,
      estimatedStc: 35
    });
    expect(directFixedAbsorptive.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(directFixedAbsorptive.unsupportedTargetOutputs).toEqual([]);
    expect(directFixedAbsorptive.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixedAbsorptive.airborneBasis).toMatchObject({
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(directFixedAbsorptive.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(gateAyPanels.airborneBasis?.method).toBe(
      "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor"
    );
    expect(gateAyPanels.airborneCandidateResolution?.selectedCandidateId).toBe(
      "candidate_dynamic_needs_input"
    );

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.airborneBasis?.exactSourceId).toBe("knauf_lab_416889_primary_2026");
    expect(exact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(anchorDelta.metrics.estimatedRwDb).toBe(57);
    expect(anchorDelta.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 57 }]
    });

    expect(thickBoardAuto.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(thickBoardAuto.airborneBasis).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology",
      origin: "needs_input"
    });
    expect(thickBoardAuto.airborneBasis?.method).not.toBe("screening_mass_law_curve_seed_v3");

    expect(labFieldAlias.supportedTargetOutputs).toEqual([]);
    expect(labFieldAlias.unsupportedTargetOutputs).toEqual([...WALL_FIELD_ALIAS_OUTPUTS]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the closeout and selected value-moving follow-up", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
      );
      expect(content, path).toContain(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
      );
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("STC 46");
      expect(content, path).toContain("Rw 44");
      expect(content, path).toContain("Rw 42");
      expect(content, path).toContain("C -1");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("estimatedNextNewCalculableRequestShapes: 1");
      expect(content, path).toContain("estimatedNextNewCalculableTargetOutputs: 4");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("route family");
      expect(normalized.toLowerCase(), path).toContain("target outputs");
      expect(normalized.toLowerCase(), path).toContain("required physical inputs");
      expect(normalized.toLowerCase(), path).toContain("expected scope");
      expect(normalized.toLowerCase(), path).toContain("direct-fixed");
      expect(normalized.toLowerCase(), path).toContain("absorptive cavity");
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("allowed_with_budget");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
