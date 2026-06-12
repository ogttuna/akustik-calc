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
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md";

const COVERAGE_REFRESH_COUNTERS = {
  broadSourceCrawlSelected: false,
  coverageRefreshContractFilesTouched: 1,
  estimatedNextNewCalculableRequestShapes: 4,
  estimatedNextNewCalculableTargetOutputs: 3,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  webSurfaceParityContractFilesTouched: 1
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

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

const DIRECT_FIXED_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  wallTopology: {
    cavity1DepthMm: 45,
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
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
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = WALL_LAB_OUTPUTS
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

function expectDirectFixedLabRuntime(
  context: AirborneContext,
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
  }
) {
  const result = calculateWall(context);

  expect(result.metrics).toMatchObject({
    estimatedCDb: expected.C,
    estimatedCtrDb: expected.Ctr,
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC
  });
  expect(result.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.airborneBasis).toMatchObject({
    method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.warnings).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING);

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

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh", () => {
  it("lands the no-runtime refresh and selects the context absorptive field/building adapter owner", () => {
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
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes full, partial, empty, and single-metric direct-fixed lab requests", () => {
    expectDirectFixedLabRuntime(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });
    expectDirectFixedLabRuntime(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 33,
      STC: 33
    });
    const empty = expectDirectFixedLabRuntime(DIRECT_FIXED_EMPTY_CONTEXT, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 31,
      STC: 31
    });
    expect(empty.airborneBasis?.requiredInputs ?? []).not.toContain("directFixedContextAbsorptiveCavityOwner");

    const singleMetricProbes = [
      { outputs: ["Rw"], value: { estimatedRwDb: 35 } },
      { outputs: ["STC"], value: { estimatedStc: 35 } },
      { outputs: ["C"], value: { estimatedCDb: -1.2 } },
      { outputs: ["Ctr"], value: { estimatedCtrDb: -5.9 } }
    ] as const satisfies readonly {
      readonly outputs: readonly RequestedOutputId[];
      readonly value: Record<string, number>;
    }[];

    for (const probe of singleMetricProbes) {
      const result = calculateWall(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, probe.outputs);

      expect(result.supportedTargetOutputs).toEqual([...probe.outputs]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject(probe.value);
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
    }
  });

  it("keeps the selected field/building owner landed while the later A-weighted owner opens A-only requests", () => {
    const fullField = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), WALL_FIELD_BUILDING_OUTPUTS);
    const partialField = calculateWall(
      withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      WALL_FIELD_BUILDING_OUTPUTS
    );
    const fullBuilding = calculateWall(
      withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      WALL_FIELD_BUILDING_OUTPUTS
    );
    const partialBuilding = calculateWall(
      withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      WALL_FIELD_BUILDING_OUTPUTS
    );
    const aWeightedField = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), A_WEIGHTED_OUTPUTS);

    expect(fullField.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(fullField.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(fullField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(partialField.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(partialField.metrics).toMatchObject({
      estimatedDnTwDb: 30,
      estimatedDnWDb: 28,
      estimatedRwPrimeDb: 27
    });
    expect(partialField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(fullBuilding.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(fullBuilding.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(fullBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(partialBuilding.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(partialBuilding.metrics).toMatchObject({
      estimatedDnTwDb: 30,
      estimatedDnWDb: 28,
      estimatedRwPrimeDb: 27
    });
    expect(partialBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(aWeightedField.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(aWeightedField.unsupportedTargetOutputs).toEqual([]);
    expect(aWeightedField.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31
    });
    expect(aWeightedField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("preserves already-live empty direct-fixed field/building adapters and non-direct-fixed absorber ownership", () => {
    const emptyField = calculateWall(withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT), WALL_FIELD_BUILDING_OUTPUTS);
    const emptyBuilding = calculateWall(withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT), WALL_FIELD_BUILDING_OUTPUTS);
    const nonDirect = calculateWall(NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT);

    expect(emptyField.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(emptyField.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(emptyField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(emptyBuilding.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
    expect(emptyBuilding.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(emptyBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
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
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
  });

  it("keeps missing absorber ownership, Gate AY panels, ASTM, and impact outside the lab owner", () => {
    const missingFlow = calculateWall(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW);
    const missingClass = calculateWall(DIRECT_FIXED_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS);
    const gateAyPanels = calculateWall(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT);
    const astm = calculateWall(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, ASTM_OUTPUTS);
    const impact = calculateWall(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, IMPACT_OUTPUTS);

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
    }

    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "needs_input"
    });
    expect(gateAyPanels.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the refresh and selected value-moving follow-up", () => {
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
      expect(content, path).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("Rw 35");
      expect(content, path).toContain("STC 35");
      expect(content, path).toContain("Rw 33");
      expect(content, path).toContain("Rw 31");
      expect(content, path).toContain("C -1.2");
      expect(content, path).toContain("Ctr -5.9");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 12");
      expect(content, path).toContain("broadSourceCrawlSelected false");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("direct-fixed");
      expect(normalized.toLowerCase(), path).toContain("field/building");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
