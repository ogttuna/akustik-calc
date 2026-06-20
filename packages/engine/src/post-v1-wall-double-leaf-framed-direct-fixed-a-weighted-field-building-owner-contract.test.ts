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
  GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md";
const OWNER_CANDIDATE_ID =
  "wall.direct_fixed_double_leaf.a_weighted_field_building_owner";
const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md";

const OWNER_COUNTERS = {
  correctedRequestShapes: 2,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 2,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0
} as const;

const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BASE_FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
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
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
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

function expectAWeightedRuntime(input: {
  context: AirborneContext;
  expected: {
    DnA: number;
    DnTA: number;
    DnTw: number;
    DnW: number;
    RwPrime: number;
  };
  method: string;
  selectedCandidateId: string;
  traceSelectedCandidateId?: string;
}) {
  const result = calculateWall(input.context);

  expect(result.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: input.expected.DnA,
    estimatedDnTADb: input.expected.DnTA,
    estimatedDnTwDb: input.expected.DnTw,
    estimatedDnWDb: input.expected.DnW,
    estimatedRwPrimeDb: input.expected.RwPrime
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: input.selectedCandidateId,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.airborneBasis).toMatchObject({
    method: input.method,
    origin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: input.method,
    selectedCandidateId: input.traceSelectedCandidateId ?? input.selectedCandidateId,
    supportedMetrics: [...A_WEIGHTED_OUTPUTS]
  });
  expect(result.warnings).toContain(GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING);

  return result;
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    selectedCandidateId: OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS,
    targetOutputs: A_WEIGHTED_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner", () => {
  it("lands the runtime owner and selects surface parity", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousRerank: {
        selectedNextAction: OWNER_ACTION,
        selectedNextFile: OWNER_FILE,
        selectionStatus: PREVIOUS_RERANK_STATUS
      },
      selectedCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS,
      targetOutputs: A_WEIGHTED_OUTPUTS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("routes empty, full, and partial direct-fixed A-weighted field requests through Gate EO plus Gate I", () => {
    expectAWeightedRuntime({
      context: withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT),
      expected: { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
    });
    expectAWeightedRuntime({
      context: withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      expected: { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
    });
    expectAWeightedRuntime({
      context: withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      expected: { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      traceSelectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
    });
  });

  it("routes empty, full, and partial direct-fixed A-weighted building requests through Gate EO plus Gate AR", () => {
    expectAWeightedRuntime({
      context: withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT),
      expected: { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
    expectAWeightedRuntime({
      context: withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      expected: { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
    expectAWeightedRuntime({
      context: withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      expected: { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
  });

  it("preserves base field/building values and the lab/ASTM/impact/boundary rows", () => {
    const fullFieldBase = calculateWall(
      withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      BASE_FIELD_BUILDING_OUTPUTS
    );
    const missingFlow = calculateWall(withFieldContext(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW));
    const gateAyPanels = calculateWall(withFieldContext(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT));
    const nonDirect = calculateWall(
      { ...NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, contextMode: "element_lab" },
      LAB_OUTPUTS
    );
    const astm = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), ASTM_OUTPUTS);
    const impact = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), IMPACT_OUTPUTS);

    expect(fullFieldBase.supportedTargetOutputs).toEqual([...BASE_FIELD_BUILDING_OUTPUTS]);
    expect(fullFieldBase.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(fullFieldBase.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "unsupported"
    });
    expect(nonDirect.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(nonDirect.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the owner and selected surface parity follow-up", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 12");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts"
    );
  });
});
