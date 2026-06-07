import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS,
  summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL
} from "./post-v1-wall-visible-layer-formula-route-second-pass-gate-el";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_em_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_em_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_LABEL =
  "post-V1 wall direct-fixed double-leaf bridge-loss owner Gate EN" as const;

export const POST_V1_GATE_EM_SELECTED_CANDIDATE_ID =
  "wall.direct_fixed_double_leaf_bridge_loss_owner_gap" as const;

export const POST_V1_GATE_EM_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EM_EN_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate EL found no fresh visible-wall runtime route; the already-live wall routes and closed repeats must be subtracted before selecting any new wall work.",
    rejectedDirections: [
      "repeating advanced-wall or double-leaf/framed resolver reachability that Gate EL proved already live",
      "reopening Gate CS/CU/CW/DN/DP/DG/DT/DV/DX wall repeats as if they were fresh runtime gaps",
      "counting supportless or roleless wall entries as scope when the correct calculator result is needs_input"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest remaining ROI is the direct-fixed double-leaf bridge-loss owner proof: complete direct-fixed double-leaf input is common and physically valid, but the current Gate R/S framed bridge solver intentionally blocks it because independent/resilient bridge deltas would be the wrong formula.",
    rejectedDirections: [
      "promoting direct-fixed into the existing Gate S runtime without a dedicated bridge-loss owner",
      "using lab Rw/STC to alias field/building outputs",
      "broad source-row crawling, confidence wording, or frontend polish without a selected owner"
    ]
  }
] as const;

export const POST_V1_GATE_EM_NO_RUNTIME_COUNTERS = {
  candidateCount: 11,
  estimatedNextBridgeLossOwnerLedgers: 1,
  estimatedNextBoundaryLedgers: 4,
  estimatedRuntimeCandidateFamiliesToEvaluateAfterGateEN: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const DIRECT_FIXED_DOUBLE_LEAF_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_DOUBLE_LEAF_CONTEXT = {
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
} as const satisfies AirborneContext;

export type PostV1GateEMCandidateId =
  | typeof POST_V1_GATE_EM_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_frontend_confidence_non_goal"
  | "floor.astm_iic_aiic_input_surface_closed_by_ej"
  | "floor.closed_runtime_route_repeats_after_ej"
  | "opening_leak_holdout_tightening_blocked"
  | "wall.closed_wall_route_repeats_after_el"
  | "wall.double_leaf_framed_already_live_after_el"
  | "wall.field_building_alias_from_lab_rejected"
  | "wall.source_row_or_holdout_tightening_without_owner"
  | "wall.supportless_or_roleless_entries_need_input"
  | "wall.visible_advanced_wall_already_live_after_el";

export type PostV1GateEMSliceKind =
  | "already_live"
  | "blocked_metric_alias"
  | "blocked_non_goal"
  | "bridge_loss_owner_gap"
  | "closed_runtime_gap"
  | "input_surface_closed"
  | "needs_input_boundary"
  | "residual_holdout_blocked"
  | "source_or_holdout_blocked";

export type PostV1GateEMCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEMCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEMSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEMDirectFixedEvidence = {
  readonly bridgeClass: string;
  readonly candidateBasisMethod: string | null | undefined;
  readonly candidateFamily: string | null | undefined;
  readonly inputCompletenessStatus: string;
  readonly missingPhysicalInputs: readonly string[];
  readonly negativeBoundaryReasons: readonly string[];
  readonly readinessStatus: string;
  readonly runtimePromotionAllowed: false;
  readonly runtimeValueMovement: false;
  readonly selectedScenarioId: "gate_r_direct_fixed_bridge_negative_boundary";
};

export type PostV1GateEMSummary = {
  readonly candidates: readonly PostV1GateEMCandidate[];
  readonly directFixedEvidence: PostV1GateEMDirectFixedEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EM_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EM_PLAN_DOC_PATH;
  readonly previousGateEL: {
    readonly counters: typeof POST_V1_GATE_EL_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE;
    readonly selectedOutcomeId: typeof POST_V1_GATE_EL_SELECTED_OUTCOME_ID;
    readonly selectionStatus: typeof POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EM_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS;
};

export function buildPostV1GateEMDirectFixedEvidence(): PostV1GateEMDirectFixedEvidence {
  const contract = buildGateRDoubleLeafFramedBridgeSolverContract({
    airborneContext: DIRECT_FIXED_DOUBLE_LEAF_CONTEXT,
    layers: DIRECT_FIXED_DOUBLE_LEAF_LAYERS,
    targetOutputs: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS
  });

  return {
    bridgeClass: contract.bridgeClass,
    candidateBasisMethod: contract.candidateBasis?.method,
    candidateFamily: contract.candidateFamily,
    inputCompletenessStatus: contract.inputContract.inputCompleteness.status,
    missingPhysicalInputs: [...contract.missingPhysicalInputs],
    negativeBoundaryReasons: [...contract.negativeBoundaryReasons],
    readinessStatus: contract.readinessStatus,
    runtimePromotionAllowed: contract.runtimePromotionAllowed,
    runtimeValueMovement: contract.runtimeValueMovement,
    selectedScenarioId: "gate_r_direct_fixed_bridge_negative_boundary"
  };
}

export function rankPostV1GateEMNumericCoverageCandidates(): readonly PostV1GateEMCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate Q/R/S already own complete independent, twin-frame, shared-stud, and resilient double-leaf/framed calculation routes",
        "complete direct-fixed double-leaf input is explicitly classified as direct_fixed_bridge and negative_boundary because it is mechanically coupled",
        "Gate EN must prove the direct-fixed bridge-loss owner before any runtime scope move can calculate Rw/STC/C/Ctr for this visible subset"
      ],
      id: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts",
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner.ts",
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate EL: it targets a real physically valid wall subset that is currently blocked for correctness, and it avoids wrong formula selection by requiring a dedicated direct-fixed bridge-loss owner first.",
      score: 3.21,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
      sliceKind: "bridge_loss_owner_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate EL proved complete visible double-leaf/framed lab stacks already reach the Gate S / resolver corridor",
        "the route publishes Rw/STC/C/Ctr with the current source-absent budget",
        "reselecting this would not increase calculator scope"
      ],
      id: "wall.double_leaf_framed_already_live_after_el",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts",
        "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live after Gate EL.",
      score: 2.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_live",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "advancedWall physical owner payloads already calculate through Gate AY/AZ",
        "missing panel dynamics remain needs_input",
        "field/building aliases remain unsupported"
      ],
      id: "wall.visible_advanced_wall_already_live_after_el",
      implementationEvidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az.ts",
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live after Gate EL.",
      score: 2.05,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_live",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate CS/CU/CW/DN/DP/DG/DT/DV/DX already closed the wall route repeats reconciled by Gate EL",
        "they are evidence that wall work can move scope, not permission to replay the same subsets",
        "Gate EM must select only an uncovered owner gap"
      ],
      id: "wall.closed_wall_route_repeats_after_el",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts",
        "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed wall runtime-basis route repeats.",
      score: 1.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "flat or grouped wall entries without support topology, leaf grouping, cavity depth, or spacing cannot safely pick a formula",
        "the correct calculator response is needs_input",
        "promoting them would weaken required physical-input boundaries"
      ],
      id: "wall.supportless_or_roleless_entries_need_input",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Correct route-required physical-input boundary.",
      score: 1.5,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "needs_input_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "lab Rw/STC/C/Ctr are not field or building metrics",
        "Gate AR/Gate I style adapters require explicit field/building physical context",
        "Gate EM must not manufacture R'w, Dn,w, or DnT,w from a lab bridge owner"
      ],
      id: "wall.field_building_alias_from_lab_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts",
        "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Wrong metric-basis alias.",
      score: 1.24,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_metric_alias",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "source rows can support exact answers, anchors, calibration, or holdouts only after a selected route owner names the route",
        "Gate EL did not find a source-backed owner ready for runtime movement",
        "Gate EN owner proof must come before rights-safe source or holdout tightening"
      ],
      id: "wall.source_row_or_holdout_tightening_without_owner",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked until an owner and same-basis holdout set are selected.",
      score: 1.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "source_or_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "floor formula-route work through Gate EJ already closed or returned to wall rerank",
        "Gate EM should not bounce back to closed floor route repeats",
        "the visible wall direct-fixed owner gap is more specific and currently uncovered"
      ],
      id: "floor.closed_runtime_route_repeats_after_ej",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed floor route repeats after Gate EJ.",
      score: 0.98,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate EJ already carried explicitly ASTM-labelled exact one-third-octave user/import bands to the ASTM owner",
        "ISO formula outputs still do not alias to ASTM ratings",
        "selecting this again would not add calculator scope"
      ],
      id: "floor.astm_iic_aiic_input_surface_closed_by_ej",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate EJ.",
      score: 0.84,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "opening/leak and residual budget tightening still require same-family holdouts",
        "broad source crawling and confidence/frontend wording do not select a calculator formula route",
        "these do not beat the concrete direct-fixed bridge-loss owner gap"
      ],
      id: "opening_leak_holdout_tightening_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Residual tightening remains blocked by insufficient same-family holdouts.",
      score: 0.78,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "broad source crawling might eventually feed exact anchors or calibration holdouts, but it does not choose the formula owner for the current direct-fixed boundary",
        "confidence wording and frontend polish do not make more layer combinations calculate",
        "Gate EM keeps these out of the calculator slice"
      ],
      id: "broad_source_crawl_frontend_confidence_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Non-calculator work for the current slice.",
      score: 0.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEMCandidate[];
}

export function summarizePostV1GateEMNumericCoverageGap(): PostV1GateEMSummary {
  if (
    POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE
  ) {
    throw new Error("Gate EM can only land after Gate EL selects the next numeric coverage rerank.");
  }

  const previousGateEL = summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL();
  const candidates = rankPostV1GateEMNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EM_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate EM must select exactly the direct-fixed double-leaf bridge-loss owner gap.");
  }

  return {
    candidates,
    directFixedEvidence: buildPostV1GateEMDirectFixedEvidence(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EM_PLAN_DOC_PATH,
    previousGateEL: {
      counters: previousGateEL.noRuntimeCounters,
      landedGate: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE,
      selectedNextAction: previousGateEL.selectedNextAction,
      selectedNextFile: previousGateEL.selectedNextFile,
      selectedOutcomeId: previousGateEL.selectedOutcomeId,
      selectionStatus: previousGateEL.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS
  };
}
