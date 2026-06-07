import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS,
  buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
} from "./gate-ay-advanced-wall-runtime-constants";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS,
  summarizePostV1GateEKNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ek";

export const POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE =
  "post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan" as const;

export const POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS =
  "post_v1_wall_visible_layer_formula_route_second_pass_gate_el_landed_no_runtime_selected_next_numeric_coverage_gap_gate_em" as const;

export const POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_em_plan" as const;

export const POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts" as const;

export const POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate EM" as const;

export const POST_V1_GATE_EL_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EK_EL_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EL_SELECTED_OUTCOME_ID =
  "wall.visible_layer_formula_route_second_pass_no_fresh_runtime_candidate_after_current_reconciliation" as const;

export const POST_V1_GATE_EL_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EL_NO_RUNTIME_COUNTERS = {
  alreadyLiveProbeCount: 2,
  closedRepeatProbeCount: 7,
  freshCandidateCount: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  needsInputBoundaryProbeCount: 1,
  probeCount: 12,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundaryProbeCount: 2
} as const;

const VISIBLE_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_DOUBLE_LEAF_LAB_CONTEXT = {
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames",
    topologyMode: "flat_layer_order"
  }
} as const satisfies AirborneContext;

export type PostV1GateELProbeClassification =
  | "already_live"
  | "closed_repeat"
  | "fresh_candidate"
  | "needs_input_boundary"
  | "unsupported_boundary";

export type PostV1GateELProbeId =
  | "wall.clt_laminated_visible_repeat_gate_dp"
  | "wall.common_flat_order_double_leaf_building_repeat_gate_cs"
  | "wall.direct_fixed_double_leaf_bridge_owner_gap"
  | "wall.double_leaf_framed_visible_resolver_reachability_gap"
  | "wall.exact_source_mixed_companion_repeat_gate_dt_dv_dx"
  | "wall.flat_layer_order_multicavity_repeat_gate_cu"
  | "wall.heavy_core_lined_massive_repeat_gate_dg"
  | "wall.local_substitution_building_repeat_gate_cw"
  | "wall.source_row_or_holdout_tightening"
  | "wall.supportless_or_no_stud_flat_entry_gap"
  | "wall.timber_stud_visible_repeat_gate_dn"
  | "wall.visible_advanced_wall_payload_surface_gap";

export type PostV1GateELProbe = {
  readonly candidateFilterPasses: boolean;
  readonly classification: PostV1GateELProbeClassification;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateELProbeId;
  readonly reason: string;
  readonly routeOwnedEnoughForRuntime: boolean;
  readonly selectedForNextRuntimeGate: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: false;
};

export type PostV1GateELRuntimeProbeEvidence = {
  readonly advancedWall: {
    readonly activeCandidateId: string | undefined;
    readonly activeMethod: string | undefined;
    readonly activeOrigin: string | undefined;
    readonly activeSupportedOutputs: readonly RequestedOutputId[];
    readonly fieldBoundaryOrigin: string | undefined;
    readonly fieldBoundaryUnsupportedOutputs: readonly RequestedOutputId[];
    readonly missingInputFields: readonly string[];
    readonly missingInputOrigin: string | undefined;
  };
  readonly doubleLeafResolver: {
    readonly candidateId: string | undefined;
    readonly method: string | undefined;
    readonly origin: string | undefined;
    readonly resolverCandidateId: string | undefined;
    readonly resolverRuntimeBasisId: string | null | undefined;
    readonly supportedOutputs: readonly RequestedOutputId[];
    readonly valuePins: readonly {
      readonly metric: string;
      readonly value: number;
    }[];
  };
};

export type PostV1GateELSummary = {
  readonly noRuntimeCounters: typeof POST_V1_GATE_EL_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EL_PLAN_DOC_PATH;
  readonly previousGateEK: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EK_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS;
  };
  readonly probes: readonly PostV1GateELProbe[];
  readonly runtimeProbeEvidence: PostV1GateELRuntimeProbeEvidence;
  readonly selectedNextAction: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_LABEL;
  readonly selectedOutcomeId: typeof POST_V1_GATE_EL_SELECTED_OUTCOME_ID;
  readonly selectionStatus: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS;
};

export function buildPostV1GateELVisibleWallRouteProbes(): readonly PostV1GateELProbe[] {
  return [
    {
      candidateFilterPasses: false,
      classification: "already_live",
      evidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "complete advancedWall physical owner payload already calculates through the Gate AY source-absent runtime",
        "missing panel loss factor or critical frequency remains needs_input",
        "field/building aliases remain unsupported instead of borrowing lab Rw/STC/C/Ctr"
      ],
      id: "wall.visible_advanced_wall_payload_surface_gap",
      reason:
        "Complete explicit advanced-wall input is already live; visible-only rows without panel dynamics are correctly stopped.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "already_live",
      evidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor.ts",
        "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts"
      ],
      expectedBeforeAfter: [
        "complete visible double-leaf/framed lab stacks with support topology and stud spacing already select the Gate S / resolver banded route",
        "the route publishes Rw/STC/C/Ctr with source-absent budgets and resolver candidate trace",
        "there is no remaining visibility bridge gap to select in Gate EL"
      ],
      id: "wall.double_leaf_framed_visible_resolver_reachability_gap",
      reason:
        "Dynamic Calculator already reaches the layer-combination resolver double-leaf/framed runtime for complete visible lab stacks.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: ["packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts"],
      expectedBeforeAfter: [
        "safe explicit flat_layer_order double-leaf building requests already use Gate S plus Gate AR",
        "missing support topology, stud spacing, and resilient side count remain stopped",
        "Gate EL must not reopen Gate CS"
      ],
      id: "wall.common_flat_order_double_leaf_building_repeat_gate_cs",
      reason: "Closed by Gate CS.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: ["packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts"],
      expectedBeforeAfter: [
        "complete explicit flat-order multicavity requests already route through Gate AE and field/building adapters",
        "ambiguous flat lists remain stopped",
        "Gate EL must not collapse grouped multicavity boundaries into double-leaf logic"
      ],
      id: "wall.flat_layer_order_multicavity_repeat_gate_cu",
      reason: "Closed by Gate CU.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: POST_V1_GATE_EL_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: ["packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts"],
      expectedBeforeAfter: [
        "local-substitution triple-leaf building outputs are already calculated from the owned lab route plus building adapter",
        "lab, field, and building owners remain separate",
        "Gate EL must not repeat this adapter"
      ],
      id: "wall.local_substitution_building_repeat_gate_cw",
      reason: "Closed by Gate CW.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: ["packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts"],
      expectedBeforeAfter: [
        "timber-stud visible wall route already carries its bounded runtime basis",
        "field outputs stay on the field-context adapter",
        "Gate EL found no new timber visible subset outside DN"
      ],
      id: "wall.timber_stud_visible_repeat_gate_dn",
      reason: "Closed by Gate DN.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: ["packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts"],
      expectedBeforeAfter: [
        "CLT/mass-timber laminated visible wall route already carries the Gate H CLT family basis",
        "field outputs remain adapter-owned",
        "Gate EL found no new CLT visible subset outside DP"
      ],
      id: "wall.clt_laminated_visible_repeat_gate_dp",
      reason: "Closed by Gate DP.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "heavy-core/outlined lined-massive visible route already carries the bounded runtime basis",
        "AAC and multicavity boundaries stay outside it",
        "Gate EL found no new bounded heavy-core subset"
      ],
      id: "wall.heavy_core_lined_massive_repeat_gate_dg",
      reason: "Closed by Gate DG.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "closed_repeat",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts",
        "packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts",
        "packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "masonry and LSF exact-source mixed metric companions already publish only owned lab companions beside exact Rw",
        "exact-source field context basis is handled by Gate DX",
        "Gate EL must not alias lab exact companions into field/building metrics"
      ],
      id: "wall.exact_source_mixed_companion_repeat_gate_dt_dv_dx",
      reason: "Closed by Gates DT, DV, and DX.",
      routeOwnedEnoughForRuntime: true,
      selectedForNextRuntimeGate: false,
      targetMetrics: POST_V1_GATE_EL_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "unsupported_boundary",
      evidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh.ts"
      ],
      expectedBeforeAfter: [
        "direct-fixed double-leaf bridge remains blocked until a bridge-loss owner is selected",
        "using the independent/resilient frame owner here would produce wrong formula selection",
        "Gate EL leaves this for a later owner gate"
      ],
      id: "wall.direct_fixed_double_leaf_bridge_owner_gap",
      reason: "Missing owner boundary, not ready runtime scope.",
      routeOwnedEnoughForRuntime: false,
      selectedForNextRuntimeGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "needs_input_boundary",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      expectedBeforeAfter: [
        "supportless or roleless flat/grouped entries cannot select a wall route owner safely",
        "route-required support topology, support spacing, resilient side count, and grouped topology fields remain user inputs",
        "Gate EL keeps this stopped rather than treating missing owner fields as scope"
      ],
      id: "wall.supportless_or_no_stud_flat_entry_gap",
      reason: "Correct missing physical-input boundary.",
      routeOwnedEnoughForRuntime: false,
      selectedForNextRuntimeGate: false,
      targetMetrics: POST_V1_GATE_EL_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateFilterPasses: false,
      classification: "unsupported_boundary",
      evidencePaths: [
        "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
      ],
      expectedBeforeAfter: [
        "source rows can be exact answers, anchors, calibration, or holdout evidence only after a selected owner names the route",
        "Gate EL did not select a source-backed owner or holdout-tightening route",
        "broad source crawling remains blocked"
      ],
      id: "wall.source_row_or_holdout_tightening",
      reason: "Missing selected owner and rights-safe holdout set for immediate runtime or budget movement.",
      routeOwnedEnoughForRuntime: false,
      selectedForNextRuntimeGate: false,
      targetMetrics: POST_V1_GATE_EL_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    }
  ] as const satisfies readonly PostV1GateELProbe[];
}

export function buildPostV1GateELRuntimeProbeEvidence(): PostV1GateELRuntimeProbeEvidence {
  const advancedWall = buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract();
  const doubleLeaf = calculateAssembly(VISIBLE_DOUBLE_LEAF_STACK, {
    airborneContext: COMPLETE_DOUBLE_LEAF_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
  });

  return {
    advancedWall: {
      activeCandidateId: advancedWall.activeAssembly.airborneCandidateResolution?.selectedCandidateId,
      activeMethod: advancedWall.activeAssembly.airborneBasis?.method,
      activeOrigin: advancedWall.activeAssembly.airborneBasis?.origin,
      activeSupportedOutputs: [...advancedWall.activeAssembly.supportedTargetOutputs],
      fieldBoundaryOrigin: advancedWall.fieldBoundaryAssembly.airborneBasis?.origin,
      fieldBoundaryUnsupportedOutputs: [...advancedWall.fieldBoundaryAssembly.unsupportedTargetOutputs],
      missingInputFields: [...(advancedWall.missingInputAssembly.airborneBasis?.missingPhysicalInputs ?? [])],
      missingInputOrigin: advancedWall.missingInputAssembly.airborneBasis?.origin
    },
    doubleLeafResolver: {
      candidateId: doubleLeaf.airborneCandidateResolution?.selectedCandidateId,
      method: doubleLeaf.airborneBasis?.method,
      origin: doubleLeaf.airborneBasis?.origin,
      resolverCandidateId: doubleLeaf.layerCombinationResolverTrace?.selectedCandidateId,
      resolverRuntimeBasisId: doubleLeaf.layerCombinationResolverTrace?.runtimeBasisId,
      supportedOutputs: [...doubleLeaf.supportedTargetOutputs],
      valuePins: [...(doubleLeaf.layerCombinationResolverTrace?.valuePins ?? [])]
    }
  };
}

export function summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL(): PostV1GateELSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE
  ) {
    throw new Error("Gate EL can only land after Gate EK selects the wall visible-layer route reconciliation.");
  }

  const previousGateEK = summarizePostV1GateEKNumericCoverageGap();
  const probes = buildPostV1GateELVisibleWallRouteProbes();
  const freshCandidates = probes.filter((probe) => probe.classification === "fresh_candidate");
  if (freshCandidates.length !== POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.freshCandidateCount) {
    throw new Error("Gate EL no-runtime reconciliation expected zero fresh runtime candidates.");
  }
  if (probes.some((probe) => probe.selectedForNextRuntimeGate)) {
    throw new Error("Gate EL must not select a runtime gate without a fresh candidate.");
  }

  return {
    noRuntimeCounters: POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EL_PLAN_DOC_PATH,
    previousGateEK: {
      landedGate: previousGateEK.landedGate,
      selectedCandidateId: previousGateEK.selectedCandidateId,
      selectedNextAction: previousGateEK.selectedNextAction,
      selectedNextFile: previousGateEK.selectedNextFile,
      selectionStatus: previousGateEK.selectionStatus
    },
    probes,
    runtimeProbeEvidence: buildPostV1GateELRuntimeProbeEvidence(),
    selectedNextAction: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_LABEL,
    selectedOutcomeId: POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
    selectionStatus: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS
  };
}

export const POST_V1_GATE_EL_RUNTIME_EXPECTATIONS = {
  advancedWallActiveCandidateId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  advancedWallActiveMethod: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  doubleLeafResolverCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
  doubleLeafResolverMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
} as const;
