import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildGateQDoubleLeafFramedBridgeInputContract } from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity";
const OWNER_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 4,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
  sourceRowsImported: 0
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_ALIAS_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
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
  OWNER_PLAN_DOC,
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

function expectDirectFixedAbsorptiveRuntime(
  context: AirborneContext,
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
  }
) {
  const inputContract = buildGateQDoubleLeafFramedBridgeInputContract({
    airborneContext: context,
    layers: TWO_BOARD_CONTEXT_STACK,
    targetOutputs: WALL_LAB_OUTPUTS
  });
  const solverContract = buildGateRDoubleLeafFramedBridgeSolverContract({
    airborneContext: context,
    layers: TWO_BOARD_CONTEXT_STACK,
    targetOutputs: WALL_LAB_OUTPUTS
  });
  const result = calculateWall(context);

  expect(inputContract.inputCompleteness.status).toBe("complete");
  expect(inputContract.missingPhysicalInputs).toEqual([]);
  expect(solverContract.bridgeClass).toBe("direct_fixed_bridge");
  expect(solverContract.readinessStatus).toBe("negative_boundary");
  expect(solverContract.negativeBoundaryReasons).toContain(
    "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned"
  );
  expect(solverContract.physicalInputs).toMatchObject({
    bridgeClass: "direct_fixed_bridge",
    cavityDepthMm: 45,
    flowResistivitySource: "user_supplied",
    leafMassRatio: 1,
    sideALeafMassKgM2: 10.6,
    sideBLeafMassKgM2: 10.6,
    supportSpacingMm: 400
  });

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
    origin: "family_physics_prediction",
    propertyDefaults: []
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "cavity1FillCoverage",
      "cavity1AbsorptionClass=porous_absorptive",
      "absorberFlowResistivityPaSM2",
      "directFixedContextAbsorptiveCavityOwner",
      "porousCavityDampingOwner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner"
    ])
  );
  expect(result.warnings).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING);

  return { result, solverContract };
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
    targetOutputs: WALL_LAB_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner", () => {
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
      targetOutputs: WALL_LAB_OUTPUTS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates full and partial direct-fixed context-owned absorptive cavities through Gate EO", () => {
    const full = expectDirectFixedAbsorptiveRuntime(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 35,
      STC: 35
    });
    expect(full.solverContract.benchmarkRange).toMatchObject({
      bridgeCouplingDeltaDb: -5,
      dampingCreditDb: 3.5,
      estimatedRwDb: {
        center: 35,
        max: 41,
        min: 29
      },
      estimatedStcDb: {
        adapterBoundary: "not_alias",
        max: 42,
        min: 28
      },
      massAirMassResonanceHz: 122.5,
      toleranceDb: 6
    });

    const partial = expectDirectFixedAbsorptiveRuntime(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT, {
      C: -1.2,
      Ctr: -5.9,
      Rw: 33,
      STC: 33
    });
    expect(partial.solverContract.benchmarkRange).toMatchObject({
      bridgeCouplingDeltaDb: -5,
      dampingCreditDb: 2,
      estimatedRwDb: {
        center: 33,
        max: 39,
        min: 27
      },
      massAirMassResonanceHz: 122.5,
      toleranceDb: 6
    });
  });

  it("keeps direct-fixed empty and non-direct-fixed context absorber on their existing owners", () => {
    const empty = calculateWall(DIRECT_FIXED_EMPTY_CONTEXT);
    const nonDirect = calculateWall(NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT);

    expect(empty.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(empty.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(empty.airborneBasis?.requiredInputs).not.toContain("directFixedContextAbsorptiveCavityOwner");

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

  it("keeps missing input, Gate AY panels, field/building aliases, ASTM, and impact outside this lab owner", () => {
    const missingFlow = calculateWall(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW);
    const missingClass = calculateWall(DIRECT_FIXED_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS);
    const gateAyPanels = calculateWall(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT);
    const labFieldAlias = calculateWall(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, WALL_FIELD_ALIAS_OUTPUTS);
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

    expect(labFieldAlias.supportedTargetOutputs).toEqual([]);
    expect(labFieldAlias.unsupportedTargetOutputs).toEqual([...WALL_FIELD_ALIAS_OUTPUTS]);
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

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
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
      expect(content, path).toContain("newCalculableRequestShapes: 1");
      expect(content, path).toContain("newCalculableTargetOutputs: 4");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 4");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(OWNER_LABEL);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("direct-fixed");
      expect(normalized.toLowerCase(), path).toContain("context-owned");
      expect(normalized.toLowerCase(), path).toContain("absorptive cavity");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
