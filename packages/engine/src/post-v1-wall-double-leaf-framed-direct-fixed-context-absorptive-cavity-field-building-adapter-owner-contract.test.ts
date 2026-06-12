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
  GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity";
const OWNER_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 3,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_BUILDING_WITH_LAB_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
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

function calculateWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = WALL_FIELD_BUILDING_OUTPUTS
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

function expectFieldBuildingRuntime(
  context: AirborneContext,
  expected: {
    DnTw: number;
    Dnw: number;
    RwPrime: number;
  },
  basis: {
    method: string;
    selectedCandidateId: string;
  }
) {
  const result = calculateWall(context);

  expect(result.supportedTargetOutputs).toEqual([...WALL_FIELD_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTwDb: expected.DnTw,
    estimatedDnWDb: expected.Dnw,
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
  expect(result.airborneBasis?.requiredInputs ?? []).toEqual(
    expect.arrayContaining([
      "directFixedContextAbsorptiveCavityOwner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner",
      "GateER_direct_fixed_field_building_adapter_owner"
    ])
  );
  expect(result.warnings).toContain(GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING);

  return result;
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousCoverageRefresh: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    routeFamily: "wall.double_leaf_framed",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS,
    targetOutputs: WALL_FIELD_BUILDING_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner", () => {
  it("lands the value-moving owner and selects surface parity", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousCoverageRefresh: {
        selectedNextAction: OWNER_ACTION,
        selectedNextFile: OWNER_FILE,
        selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
      },
      routeFamily: "wall.double_leaf_framed",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS,
      targetOutputs: WALL_FIELD_BUILDING_OUTPUTS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
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

  it("routes full and partial direct-fixed context absorptive field requests through Gate EO plus Gate I", () => {
    expectFieldBuildingRuntime(
      withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      {
        DnTw: 32,
        Dnw: 30,
        RwPrime: 29
      },
      {
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      }
    );
    expectFieldBuildingRuntime(
      withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      {
        DnTw: 30,
        Dnw: 28,
        RwPrime: 27
      },
      {
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("routes full and partial direct-fixed context absorptive building requests through Gate EO plus Gate AR", () => {
    expectFieldBuildingRuntime(
      withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      {
        DnTw: 32,
        Dnw: 30,
        RwPrime: 29
      },
      {
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
    expectFieldBuildingRuntime(
      withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
      {
        DnTw: 30,
        Dnw: 28,
        RwPrime: 27
      },
      {
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("keeps lab values, empty direct-fixed adapters, and non-direct-fixed absorber ownership pinned", () => {
    const fullLab = calculateWall(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, WALL_LAB_OUTPUTS);
    const partialLab = calculateWall(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT, WALL_LAB_OUTPUTS);
    const emptyField = calculateWall(withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT));
    const emptyBuilding = calculateWall(withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT));
    const nonDirect = calculateWall(NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, WALL_LAB_OUTPUTS);

    expect(fullLab.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 35,
      estimatedStc: 35
    });
    expect(partialLab.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 33,
      estimatedStc: 33
    });
    for (const result of [fullLab, partialLab]) {
      expect(result.airborneBasis).toMatchObject({
        method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
        origin: "family_physics_prediction"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
      });
    }

    expect(emptyField.metrics).toMatchObject({
      estimatedDnTwDb: 28,
      estimatedDnWDb: 26,
      estimatedRwPrimeDb: 25
    });
    expect(emptyField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(emptyBuilding.metrics).toMatchObject({
      estimatedDnTwDb: 28,
      estimatedDnWDb: 26,
      estimatedRwPrimeDb: 25
    });
    expect(emptyBuilding.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });

    expect(nonDirect.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(nonDirect.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });
    expect(nonDirect.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    });
  });

  it("keeps missing input, Gate AY panels, ASTM, and impact outside while the later A-weighted owner opens A-only requests", () => {
    const missingFlow = calculateWall(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW);
    const gateAyPanels = calculateWall(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT);
    const fieldAWeighted = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), A_WEIGHTED_OUTPUTS);
    const buildingAWeighted = calculateWall(
      withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      A_WEIGHTED_OUTPUTS
    );
    const astm = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), ASTM_OUTPUTS);
    const impact = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), IMPACT_OUTPUTS);
    const fieldMixed = calculateWall(
      withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      WALL_FIELD_BUILDING_WITH_LAB_OUTPUTS
    );

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingFlow.airborneBasis?.missingPhysicalInputs ?? []).toEqual(
      expect.arrayContaining(["cavity1FillCoverage", "absorberClass"])
    );

    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "unsupported"
    });

    expect(fieldAWeighted.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(fieldAWeighted.unsupportedTargetOutputs).toEqual([]);
    expect(fieldAWeighted.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31
    });
    expect(fieldAWeighted.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(buildingAWeighted.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(buildingAWeighted.unsupportedTargetOutputs).toEqual([]);
    expect(buildingAWeighted.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31
    });
    expect(buildingAWeighted.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(fieldMixed.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "STC", "C", "Ctr"]);
    expect(fieldMixed.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(fieldMixed.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
  });

  it("keeps docs and current-gate runner aligned with the owner and selected surface parity follow-up", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(content, path).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(content, path).toContain("R'w 29");
      expect(content, path).toContain("Dn,w 30");
      expect(content, path).toContain("DnT,w 32");
      expect(content, path).toContain("R'w 27");
      expect(content, path).toContain("Dn,w 28");
      expect(content, path).toContain("DnT,w 30");
      expect(content, path).toContain("newCalculableRequestShapes: 4");
      expect(content, path).toContain("newCalculableTargetOutputs: 3");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 12");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(OWNER_LABEL);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("direct-fixed");
      expect(normalized.toLowerCase(), path).toContain("field/building");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
