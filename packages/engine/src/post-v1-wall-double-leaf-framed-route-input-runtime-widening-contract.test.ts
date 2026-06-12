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

const PREVIOUS_CLOSEOUT_ACTION =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan";
const PREVIOUS_CLOSEOUT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_CLOSEOUT_STATUS =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_double_leaf_framed_route_input_runtime_widening";

const RUNTIME_WIDENING_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan";
const RUNTIME_WIDENING_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts";
const RUNTIME_WIDENING_STATUS =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity";
const RUNTIME_WIDENING_LABEL =
  "post-V1 wall double-leaf/framed route-input runtime widening";
const RUNTIME_WIDENING_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed route-input runtime widening surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_SURFACE_PARITY_PLAN_2026-06-11.md";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_ALIAS_OUTPUTS = ["R'w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CONTEXT_ONLY_EMPTY_CAVITY_STACK = [
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

const CONTEXT_ONLY_DEPTH_WITHOUT_EMPTY_CLASSIFICATION: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1DepthMm: 90,
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const CONTEXT_ONLY_ABSORPTIVE_WITHOUT_VISIBLE_FILL_LAYER: AirborneContext = {
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

const THICK_BOARD_COMPLETE_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

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

const RUNTIME_WIDENING_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 4,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  RUNTIME_WIDENING_PLAN_DOC,
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

function buildRuntimeWideningSummary() {
  return {
    counters: RUNTIME_WIDENING_COUNTERS,
    landedGate: RUNTIME_WIDENING_ACTION,
    previousCloseout: {
      action: PREVIOUS_CLOSEOUT_ACTION,
      file: PREVIOUS_CLOSEOUT_FILE,
      status: PREVIOUS_CLOSEOUT_STATUS
    },
    routeFamily: "wall.double_leaf_framed",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: RUNTIME_WIDENING_STATUS,
    targetOutputs: WALL_LAB_OUTPUTS
  };
}

describe("post-V1 wall double-leaf/framed route-input runtime widening", () => {
  it("lands the runtime widening and selects surface parity instead of another process-only ledger", () => {
    expect(buildRuntimeWideningSummary()).toMatchObject({
      counters: RUNTIME_WIDENING_COUNTERS,
      landedGate: RUNTIME_WIDENING_ACTION,
      previousCloseout: {
        action: PREVIOUS_CLOSEOUT_ACTION,
        file: PREVIOUS_CLOSEOUT_FILE,
        status: PREVIOUS_CLOSEOUT_STATUS
      },
      routeFamily: "wall.double_leaf_framed",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: RUNTIME_WIDENING_STATUS,
      targetOutputs: WALL_LAB_OUTPUTS
    });
  });

  it("calculates a context-only empty-cavity double-leaf/framed wall through the owned banded formula corridor", () => {
    const result = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT
    );
    const inputContract = buildGateQDoubleLeafFramedBridgeInputContract({
      airborneContext: CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
      layers: CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(inputContract.inputCompleteness.status).toBe("complete");
    expect(inputContract.missingPhysicalInputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 42,
      estimatedStc: 42
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      family: "double_stud_system",
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(expect.arrayContaining([
      "sideALeafGroup",
      "sideBLeafGroup",
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "cavity1DepthMm",
      "supportTopology",
      "supportSpacingMm",
      "porousCavityDampingCreditDb"
    ]));
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      supportedMetrics: expect.arrayContaining([...WALL_LAB_OUTPUTS]),
      valuePins: [
        { metric: "Rw", value: 42 },
        { metric: "STC", value: 42 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ]
    });
    expect(result.warnings).toContain(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
    );
  });

  it("keeps context-only cavities stopped until the user classifies them as empty instead of pretending porous fill exists", () => {
    const depthOnly = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_DEPTH_WITHOUT_EMPTY_CLASSIFICATION
    );
    const absorptiveWithoutVisibleLayer = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_ABSORPTIVE_WITHOUT_VISIBLE_FILL_LAYER
    );

    for (const result of [depthOnly, absorptiveWithoutVisibleLayer]) {
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
  });

  it("keeps direct-fixed and non-lab/non-wall outputs outside the independent framed widening owner", () => {
    const directFixed = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      DIRECT_FIXED_CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT
    );
    const labFieldAlias = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
      WALL_FIELD_ALIAS_OUTPUTS
    );
    const astm = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
      ASTM_OUTPUTS
    );
    const impact = calculateWall(
      CONTEXT_ONLY_EMPTY_CAVITY_STACK,
      CONTEXT_ONLY_EMPTY_CAVITY_CONTEXT,
      IMPACT_OUTPUTS
    );

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
    expect(directFixed.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );

    expect(labFieldAlias.supportedTargetOutputs).toEqual([]);
    expect(labFieldAlias.unsupportedTargetOutputs).toEqual([...WALL_FIELD_ALIAS_OUTPUTS]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("preserves exact measured rows, compatible measured-anchor deltas, and thick-board Auto boundaries", () => {
    const exact = calculateWall(EXACT_LSF_LAB_STACK, EXACT_LSF_LAB_CONTEXT);
    const anchorDelta = calculateWall(EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_LAB_CONTEXT, ["Rw"]);
    const thickBoardAuto = calculateWall(THICK_BOARD_AUTO_STACK, { contextMode: "element_lab" });
    const thickBoardExplicit = calculateWall(THICK_BOARD_AUTO_STACK, THICK_BOARD_COMPLETE_CONTEXT);

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

    expect(thickBoardExplicit.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(thickBoardExplicit.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with the runtime closeout and selected surface-parity follow-up", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const text = readRepoFile(path);

      expect(text, path).toContain(RUNTIME_WIDENING_ACTION);
      expect(text, path).toContain(RUNTIME_WIDENING_FILE);
      expect(text, path).toContain(RUNTIME_WIDENING_STATUS);
      expect(text, path).toContain(SELECTED_NEXT_ACTION);
      expect(text, path).toContain(SELECTED_NEXT_FILE);
      expect(text, path).toContain(SELECTED_NEXT_LABEL);
      expect(text, path).toContain("newCalculableLayerTemplates: 1");
      expect(text, path).toContain("newCalculableRequestShapes: 1");
      expect(text, path).toContain("newCalculableTargetOutputs: 4");
      expect(text, path).toContain("runtimeBasisPromotions: 1");
      expect(text, path).toContain("runtimeValuesMoved 0");
      expect(text, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(RUNTIME_WIDENING_FILE.replace("packages/engine/", ""));
  });
});
