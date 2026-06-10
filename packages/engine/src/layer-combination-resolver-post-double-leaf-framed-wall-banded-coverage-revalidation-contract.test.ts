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
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID
} from "./post-v1-wall-compatible-anchor-delta";
import {
  POST_V1_GATE_ER_RUNTIME_ASSERTIONS,
  POST_V1_GATE_ER_TARGET_OUTPUTS,
  buildPostV1GateERRuntimeEvidence
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REVALIDATION_ACTION =
  "layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan";
const REVALIDATION_FILE =
  "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts";
const REVALIDATION_SELECTION_STATUS =
  "layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_landed_no_runtime_selected_wall_compatible_anchor_delta_scope_expansion";

const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_scope_expansion_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible measured-anchor delta scope expansion";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_BUILDING_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_EMPTY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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

const INDEPENDENT_EXPLICIT_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const FIELD_CONTEXT: AirborneContext = {
  ...INDEPENDENT_EXPLICIT_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...INDEPENDENT_EXPLICIT_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42
};

const SAFE_FLAT_SUPPORT_HINT_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
};

const BUILDING_SUPPORT_HINT_CONTEXT: AirborneContext = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
};

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

type RevalidationPosture =
  | "accuracy_candidate_blocked"
  | "blocked_non_goal"
  | "closed_runtime_route"
  | "needs_input_surface_candidate"
  | "runtime_scope_candidate";

const RERANK_ROWS = [
  {
    id: "wall.double_leaf_framed.explicit_non_direct_lab_runtime.closed",
    posture: "closed_runtime_route",
    reason: "explicit non-direct-fixed double-leaf/framed lab rows already calculate through the banded formula corridor",
    selectedNow: false
  },
  {
    id: "wall.double_leaf_framed.safe_flat_auto_topology_lab_field_building.closed",
    posture: "closed_runtime_route",
    reason: "safe flat double-leaf rows with support metadata already calculate through Gate S plus Gate I/Gate AR",
    selectedNow: false
  },
  {
    id: "wall.double_leaf_direct_fixed.lab_field_building.closed",
    posture: "closed_runtime_route",
    reason: "direct-fixed double-leaf lab/field/building is live through Gate EO/Gate ER",
    selectedNow: false
  },
  {
    id: "wall.double_leaf.required_input_surface.candidate",
    posture: "needs_input_surface_candidate",
    reason: "support topology, stud spacing, and resilient side count remain important user inputs, but the workbench can already send them",
    selectedNow: false
  },
  {
    id: "wall.compatible_measured_anchor_delta.scope_expansion.selected",
    posture: "runtime_scope_candidate",
    reason: "the measured-anchor delta lane directly matches small bounded layer changes and can widen calculator answers without source crawling",
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNow: true
  },
  {
    id: "wall.double_leaf_banded_tolerance_retune.blocked",
    posture: "accuracy_candidate_blocked",
    reason: "tolerance tightening needs same-basis holdouts before changing the current source-absent budgets",
    selectedNow: false
  },
  {
    id: "broad_source_crawl_or_frontend_polish.blocked",
    posture: "blocked_non_goal",
    reason: "broad source crawling and frontend polish do not improve calculator scope or accuracy for this slice",
    selectedNow: false
  }
] as const satisfies readonly {
  readonly id: string;
  readonly posture: RevalidationPosture;
  readonly reason: string;
  readonly selectedNextAction?: typeof SELECTED_NEXT_ACTION;
  readonly selectedNextFile?: typeof SELECTED_NEXT_FILE;
  readonly selectedNow: boolean;
}[];

const REVALIDATION_COUNTERS = {
  accuracyCandidatesBlocked: 1,
  blockedNonGoalRows: 1,
  closedRuntimeRouteRowsRevalidated: 3,
  frontendImplementationFilesTouched: 0,
  needsInputSurfaceCandidates: 1,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: 3,
  runtimeBasisPromotions: 0,
  runtimeScopeCandidates: 1,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[] = WALL_LAB_OUTPUTS) {
  return calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function buildRevalidationSummary() {
  return {
    counters: REVALIDATION_COUNTERS,
    landedGate: REVALIDATION_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE
    },
    rerankRows: RERANK_ROWS,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: REVALIDATION_SELECTION_STATUS
  };
}

describe("layer combination resolver post double-leaf/framed coverage revalidation contract", () => {
  it("lands the revalidation, closes stale double-leaf followups, and selects anchor-delta scope expansion", () => {
    const previous = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract();
    const summary = buildRevalidationSummary();

    expect(previous.selectedNextAction).toBe(REVALIDATION_ACTION);
    expect(previous.selectedNextFile).toBe(REVALIDATION_FILE);
    expect(summary).toMatchObject({
      counters: REVALIDATION_COUNTERS,
      landedGate: REVALIDATION_ACTION,
      noRuntimeValueMovement: true,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: REVALIDATION_SELECTION_STATUS
    });
    expect(new Set(RERANK_ROWS.map((row) => row.posture))).toEqual(
      new Set<RevalidationPosture>([
        "accuracy_candidate_blocked",
        "blocked_non_goal",
        "closed_runtime_route",
        "needs_input_surface_candidate",
        "runtime_scope_candidate"
      ])
    );
    expect(RERANK_ROWS.filter((row) => row.selectedNow)).toEqual([
      expect.objectContaining({
        id: "wall.compatible_measured_anchor_delta.scope_expansion.selected",
        selectedNextAction: SELECTED_NEXT_ACTION,
        selectedNextFile: SELECTED_NEXT_FILE
      })
    ]);
  });

  it("keeps explicit and safe-flat non-direct-fixed double-leaf wall routes live", () => {
    const explicitLab = calculateWall(INDEPENDENT_EXPLICIT_CONTEXT);
    const safeFlatLab = calculateWall(SAFE_FLAT_SUPPORT_HINT_CONTEXT);
    const field = calculateWall(FIELD_CONTEXT, WALL_FIELD_OUTPUTS);
    const building = calculateWall(BUILDING_CONTEXT, WALL_BUILDING_OUTPUTS);

    expect(explicitLab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(explicitLab.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(explicitLab.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      supportedMetrics: expect.arrayContaining([...WALL_LAB_OUTPUTS])
    });

    expect(safeFlatLab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(safeFlatLab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(safeFlatLab.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(field.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 42,
      estimatedRwPrimeDb: 39
    });

    expect(building.supportedTargetOutputs).toEqual([...WALL_BUILDING_OUTPUTS]);
    expect(building.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(building.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.metrics).toMatchObject({
      estimatedDnADb: 38.5,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwPrimeDb: 39
    });
  });

  it("keeps direct-fixed double-leaf lab, field, and building routes on their separate live owner", () => {
    const directFixedLab = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const evidence = buildPostV1GateERRuntimeEvidence();

    expect(directFixedLab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixedLab.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(directFixedLab.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(evidence.labMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.labExpectedMetrics);
    expect(evidence.fieldSupportedOutputs).toEqual(POST_V1_GATE_ER_TARGET_OUTPUTS);
    expect(evidence.fieldBasisMethod).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(evidence.fieldSelectedCandidateId).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID);
    expect(evidence.fieldMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.fieldExpectedMetrics);
    expect(evidence.buildingSupportedOutputs).toEqual(POST_V1_GATE_ER_TARGET_OUTPUTS);
    expect(evidence.buildingBasisMethod).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(evidence.buildingSelectedCandidateId).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID);
    expect(evidence.buildingMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.buildingExpectedMetrics);
  });

  it("keeps incomplete topology, floor-impact, and ASTM/IIC requests from producing false wall numbers", () => {
    const missingResilientSideCount = calculateWall(RESILIENT_MISSING_SIDE_COUNT_CONTEXT);
    const missingSupportBuilding = calculateWall(
      {
        ...BUILDING_SUPPORT_HINT_CONTEXT,
        wallTopology: undefined
      },
      WALL_BUILDING_OUTPUTS
    );
    const missingStudSpacingBuilding = calculateWall(
      {
        ...BUILDING_SUPPORT_HINT_CONTEXT,
        studSpacingMm: undefined
      },
      WALL_BUILDING_OUTPUTS
    );
    const impact = calculateWall(INDEPENDENT_EXPLICIT_CONTEXT, IMPACT_OUTPUTS);
    const astm = calculateWall(INDEPENDENT_EXPLICIT_CONTEXT, ASTM_OUTPUTS);

    expect(missingResilientSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingResilientSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(missingResilientSideCount.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    for (const result of [missingSupportBuilding, missingStudSpacingBuilding]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...WALL_BUILDING_OUTPUTS]);
      expect(result.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "generic.lab_field_building_basis_boundary",
        supportedMetrics: []
      });
    }

    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["Ln,w", "CI"]));
    expect(astm.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["IIC", "AIIC"]));
  });

  it("keeps exact rows and compatible measured-anchor deltas ahead of source-absent formulas", () => {
    const exact = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const anchorDelta = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.airborneBasis?.exactSourceId).toBe("knauf_lab_416889_primary_2026");
    expect(exact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(anchorDelta.metrics.estimatedRwDb).toBe(57);
    expect(anchorDelta.supportedTargetOutputs).toEqual(["Rw"]);
    expect(anchorDelta.unsupportedTargetOutputs).toEqual([]);
    expect(anchorDelta.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(anchorDelta.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "similarity_anchor",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 57 }]
    });
  });

  it("keeps docs and current-gate runner aligned with the revalidation closeout and selected next plan", () => {
    for (const path of ["docs/calculator/NEXT_IMPLEMENTATION_PLAN.md", "docs/calculator/SYSTEM_MAP.md"] as const) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(REVALIDATION_ACTION);
      expect(contents, path).toContain(REVALIDATION_FILE);
      expect(contents, path).toContain(REVALIDATION_SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(REVALIDATION_FILE.replace("packages/engine/", ""));
  });
});
