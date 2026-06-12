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
import { buildGateQDoubleLeafFramedBridgeInputContract } from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
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

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner";

const CONTEXT_ABSORPTIVE_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan";
const CONTEXT_ABSORPTIVE_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts";
const CONTEXT_ABSORPTIVE_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity";
const CONTEXT_ABSORPTIVE_OWNER_LABEL =
  "post-V1 wall double-leaf/framed context absorptive cavity input owner";
const CONTEXT_ABSORPTIVE_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md";

const CONTEXT_ABSORPTIVE_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 4,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
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

const CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT: AirborneContext = {
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

const CONTEXT_ONLY_ABSORPTIVE_WITHOUT_FLOW: AirborneContext = {
  ...CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
  advancedWall: undefined
};

const CONTEXT_ONLY_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS: AirborneContext = {
  ...CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
  wallTopology: {
    cavity1DepthMm: 90,
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const GATE_AY_ADVANCED_WALL_STILL_OWNS_PANELS_CONTEXT: AirborneContext = {
  ...CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
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
  CONTEXT_ABSORPTIVE_OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
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

function summarizeOwner() {
  return {
    counters: CONTEXT_ABSORPTIVE_OWNER_COUNTERS,
    landedGate: CONTEXT_ABSORPTIVE_OWNER_ACTION,
    previousCoverageRefresh: {
      selectedNextAction: CONTEXT_ABSORPTIVE_OWNER_ACTION,
      selectedNextFile: CONTEXT_ABSORPTIVE_OWNER_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    routeFamily: "wall.double_leaf_framed",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: CONTEXT_ABSORPTIVE_OWNER_STATUS,
    targetOutputs: WALL_LAB_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed context absorptive cavity input owner", () => {
  it("lands the value-moving owner and selects the no-runtime surface parity follow-up", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: CONTEXT_ABSORPTIVE_OWNER_COUNTERS,
      landedGate: CONTEXT_ABSORPTIVE_OWNER_ACTION,
      previousCoverageRefresh: {
        selectedNextAction: CONTEXT_ABSORPTIVE_OWNER_ACTION,
        selectedNextFile: CONTEXT_ABSORPTIVE_OWNER_FILE,
        selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
      },
      routeFamily: "wall.double_leaf_framed",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: CONTEXT_ABSORPTIVE_OWNER_STATUS,
      targetOutputs: WALL_LAB_OUTPUTS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      CONTEXT_ABSORPTIVE_OWNER_FILE,
      CONTEXT_ABSORPTIVE_OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates a two-board context-owned absorptive cavity through the double-leaf/framed source-absent runtime", () => {
    const inputContract = buildGateQDoubleLeafFramedBridgeInputContract({
      airborneContext: CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
      layers: TWO_BOARD_CONTEXT_STACK,
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const solverContract = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
      layers: TWO_BOARD_CONTEXT_STACK,
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const result = calculateWall(TWO_BOARD_CONTEXT_STACK, CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT);

    expect(inputContract.inputCompleteness.status).toBe("complete");
    expect(inputContract.missingPhysicalInputs).toEqual([]);
    expect(solverContract.readinessStatus).toBe("solver_candidate_ready");
    expect(solverContract.physicalInputs).toMatchObject({
      bridgeClass: "independent_frame",
      cavityDepthMm: 90,
      flowResistivitySource: "user_supplied",
      leafMassRatio: 1,
      sideALeafMassKgM2: 10.6,
      sideBLeafMassKgM2: 10.6,
      supportSpacingMm: 600
    });
    expect(solverContract.benchmarkRange).toMatchObject({
      bridgeCouplingDeltaDb: 4,
      dampingCreditDb: 3.5,
      estimatedRwDb: {
        center: 46,
        max: 52,
        min: 40
      },
      estimatedStcDb: {
        adapterBoundary: "not_alias",
        max: 53,
        min: 39
      },
      massAirMassResonanceHz: 86.6,
      toleranceDb: 6
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
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
      origin: "family_physics_prediction",
      propertyDefaults: []
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 46 },
        { metric: "STC", value: 46 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ]
    });
    expect(result.warnings).toContain(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
    );
  });

  it("keeps missing absorber ownership and Gate AY advanced-wall input surface outside this bounded owner", () => {
    const missingFlow = calculateWall(TWO_BOARD_CONTEXT_STACK, CONTEXT_ONLY_ABSORPTIVE_WITHOUT_FLOW);
    const missingClass = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_ABSORPTIVE_WITH_FLOW_BUT_MISSING_CLASS
    );
    const gateAyPanels = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      GATE_AY_ADVANCED_WALL_STILL_OWNS_PANELS_CONTEXT
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

    expect(gateAyPanels.airborneBasis?.method).toBe(
      "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor"
    );
    expect(gateAyPanels.airborneCandidateResolution?.selectedCandidateId).toBe(
      "candidate_dynamic_needs_input"
    );
    expect(gateAyPanels.airborneBasis?.origin).toBe("needs_input");
    expect(gateAyPanels.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
  });

  it("preserves empty-cavity value pins and direct-fixed, exact, anchor, thick-board, alias, ASTM, and impact boundaries", () => {
    const empty = calculateWall(TWO_BOARD_CONTEXT_STACK, CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT);
    const directFixed = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      DIRECT_FIXED_CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT
    );
    const exact = calculateWall(EXACT_LSF_LAB_STACK, EXACT_LSF_LAB_CONTEXT);
    const anchorDelta = calculateWall(EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_LAB_CONTEXT, ["Rw"]);
    const thickBoardAuto = calculateWall(THICK_BOARD_AUTO_STACK, { contextMode: "element_lab" });
    const labFieldAlias = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
      WALL_FIELD_ALIAS_OUTPUTS
    );
    const astm = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
      ASTM_OUTPUTS
    );
    const impact = calculateWall(
      TWO_BOARD_CONTEXT_STACK,
      CONTEXT_ONLY_ABSORPTIVE_CAVITY_CONTEXT,
      IMPACT_OUTPUTS
    );

    expect(empty.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 42,
      estimatedStc: 42
    });
    expect(empty.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 42 },
        { metric: "STC", value: 42 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ]
    });

    expect(directFixed.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(directFixed.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixed.airborneBasis).toMatchObject({
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.airborneBasis?.exactSourceId).toBe("knauf_lab_416889_primary_2026");
    expect(exact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(anchorDelta.metrics.estimatedRwDb).toBe(57);
    expect(anchorDelta.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
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

  it("keeps docs and current-gate runner aligned with the owner and selected surface parity follow-up", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(CONTEXT_ABSORPTIVE_OWNER_ACTION);
      expect(content, path).toContain(CONTEXT_ABSORPTIVE_OWNER_FILE);
      expect(content, path).toContain(CONTEXT_ABSORPTIVE_OWNER_STATUS);
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
      expect(content, path).toContain("C -1");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("newCalculableLayerTemplates: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 1");
      expect(content, path).toContain("newCalculableTargetOutputs: 4");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(CONTEXT_ABSORPTIVE_OWNER_LABEL);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("context-owned");
      expect(normalized.toLowerCase(), path).toContain("absorptive cavity");
      expect(normalized.toLowerCase(), path).toContain("flowresistivitysource=user_supplied");
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(CONTEXT_ABSORPTIVE_OWNER_FILE.replace("packages/engine/", ""));
  });
});
