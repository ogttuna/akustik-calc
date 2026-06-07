import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS,
  POST_V1_GATE_EH_COUNTERS,
  POST_V1_GATE_EH_OWNER_ID
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ei_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ei_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_surface_gate_ej" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION =
  "post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_LABEL =
  "post-V1 floor ASTM IIC/AIIC exact-band input surface Gate EJ" as const;

export const POST_V1_GATE_EI_SELECTED_CANDIDATE_ID =
  "floor.astm_iic_aiic_user_band_input_surface" as const;

export const POST_V1_GATE_EI_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EI_EJ_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EI_SELECTED_TARGET_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate EH, the ASTM exact-band standard owner is pinned, so the remaining candidates were rechecked for true calculator scope or accuracy movement instead of old closed route work.",
    rejectedDirections: [
      "reselecting composite-panel, heavy-concrete lower-treatment, mass-timber, steel, local-substitution, CLT, masonry, LSF, or exact-source runtime-basis repairs already closed by earlier gates",
      "selecting held-AAC or grouped multicavity wall routes because support-backed requests are already runtime-capable and supportless requests are valid needs_input boundaries",
      "selecting open-web/open-box field-building repeats because those routes are already live with explicit impactFieldContext"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest remaining ROI is the ASTM exact-band input surface: Gate EH proved the engine owner, shared/API payloads already carry exactImpactSource.standardMethod, and the current workbench/import path still needs a selected surface gate before ASTM-labelled user bands can safely publish IIC or AIIC.",
    rejectedDirections: [
      "formula aliasing from ISO Ln,w, L'nT,w, DeltaLw, CI, or CI,50-2500 to ASTM IIC/AIIC",
      "lower-treatment DeltaLw subtraction across unrelated floor families because it remains a wrong metric-owner derivation",
      "opening/leak or open-box residual budget tightening because same-family holdouts remain insufficient"
    ]
  }
] as const;

export const POST_V1_GATE_EI_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextInputSurfaceLedgers: 1,
  estimatedNextNewCalculableMetricBasisRequestShapes: 2,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEICandidateId =
  | typeof POST_V1_GATE_EI_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording_or_frontend_polish"
  | "floor.astm_iic_aiic_formula_alias_from_iso_rejected"
  | "floor.closed_floor_formula_route_repeats"
  | "floor.lower_treatment_delta_lw_cross_family_derivation_rejected"
  | "floor.open_box_residual_variants_negative_boundary"
  | "floor.open_web_open_box_field_building_already_live"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.closed_runtime_basis_route_repeats"
  | "wall.held_aac_or_grouped_multicavity_already_live";

export type PostV1GateEISliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_wrong_metric_alias"
  | "blocked_wrong_metric_derivation"
  | "closed_runtime_gap"
  | "input_surface_scope_expansion"
  | "residual_holdout_blocked";

export type PostV1GateEICandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEICandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly requiresFutureFrontendOrSharedSurfaceWork: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEISliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEISummary = {
  readonly candidates: readonly PostV1GateEICandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EI_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EI_PLAN_DOC_PATH;
  readonly previousGateEH: {
    readonly counters: typeof POST_V1_GATE_EH_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE;
    readonly ownerId: typeof POST_V1_GATE_EH_OWNER_ID;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EI_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS;
};

export function rankPostV1GateEINumericCoverageCandidates(): readonly PostV1GateEICandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate EH proves the exact ASTM E492/E989 lab owner for IIC and ASTM E1007/E989 field owner for AIIC",
        "shared estimate and impact-only API payloads already carry exactImpactSource.standardMethod",
        "the remaining user/import surface must stop ISO bands from being silently treated as ASTM, while allowing explicitly ASTM-labelled one-third-octave bands to publish the owned ratings"
      ],
      id: POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts",
        "packages/shared/src/domain/exact-impact-source.ts",
        "packages/shared/src/api/estimate.ts",
        "packages/shared/src/api/impact-only.ts",
        "apps/web/features/workbench/impact-band-import.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate EH: the formula/standard owner is proven, so the next value is making real user-supplied ASTM bands calculable through the selected input surface without inventing ISO aliases or source-row catalog behavior.",
      requiresFutureFrontendOrSharedSurfaceWork: true,
      score: 3.44,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
      sliceKind: "input_surface_scope_expansion",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EI_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate EH explicitly rejects ISO Ln,w, L'nT,w, DeltaLw, CI, or CI,50-2500 as ASTM rating owners",
        "promoting formula-derived ISO impact answers to IIC/AIIC would create wrong metric-basis output",
        "a true ASTM one-third-octave source remains required"
      ],
      id: "floor.astm_iic_aiic_formula_alias_from_iso_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it would fabricate ASTM metrics from ISO single-number outputs.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_alias",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EI_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "composite-panel, heavy-concrete lower-treatment, lightweight concrete, mass-timber/CLT upper-package, and steel visible formula routes have already been selected and closed by earlier gates",
        "reselecting them would duplicate already landed scope or route-basis work",
        "closed work remains listed only to prevent stale high-ROI handoffs from being picked again"
      ],
      id: "floor.closed_floor_formula_route_repeats",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts",
        "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts",
        "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by prior floor runtime or route-basis gates.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "open-web and open-box field/building companions already calculate when explicit impactFieldContext is supplied",
        "missing field context remains a required-input or unsupported boundary",
        "selecting this again would not add new calculable request shapes"
      ],
      id: "floor.open_web_open_box_field_building_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable in the current implementation.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 1.9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate CS/CU/CW and later wall runtime-basis gates already closed the common flat, multicavity, local-substitution, CLT, masonry, LSF, timber-stud, and exact-source basis repairs",
        "the remaining route-basis repeats are not new scope",
        "new wall work must name a fresh family/owner instead of reopening closed gates"
      ],
      id: "wall.closed_runtime_basis_route_repeats",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts",
        "packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by prior wall formula-routing and runtime-basis gates.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 0.64,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "support-backed held-AAC and grouped multicavity wall requests already calculate through existing family routes",
        "supportless flat entries correctly remain needs_input because supportTopology is route-required",
        "counting that boundary as scope would weaken missing-input correctness"
      ],
      id: "wall.held_aac_or_grouped_multicavity_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when route-required support inputs are present.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 1.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "lower-treatment DeltaLw subtraction across open-web, hollow-core, Pliteq, Knauf, or unrelated source rows remains tempting",
        "but DeltaLw needs a selected family-specific improvement owner, not a generic before/after row subtraction",
        "Gate EI keeps that boundary blocked"
      ],
      id: "floor.lower_treatment_delta_lw_cross_family_derivation_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it is a wrong metric-owner derivation.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_derivation",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "opening/leak and open-box residual ledgers are still useful accuracy work",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting this now would become evidence intake instead of calculable scope"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but still blocked by holdout requirements.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 1.52,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "R8b/R9b-style open-box residual variants remain negative or blocked",
        "same-family calibration and holdout evidence is insufficient",
        "selecting it now would not create defensible runtime values"
      ],
      id: "floor.open_box_residual_variants_negative_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Residual/holdout blocked, not a clean next runtime slice.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 1.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "C", "Ln,w", "L'n,w", "L'nT,w"],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "broad source crawling, confidence copy, and generic frontend polish can be useful in other contexts",
        "none of them makes the engine choose a better formula or calculate a newly owned output by itself",
        "Gate EI keeps them blocked as next calculator slices"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because DynEcho is a formula-based calculator, not a catalog or confidence-label system.",
      requiresFutureFrontendOrSharedSurfaceWork: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: [],
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEICandidate[];
}

export function summarizePostV1GateEINumericCoverageGap(): PostV1GateEISummary {
  if (
    POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE
  ) {
    throw new Error("Gate EI can only land after Gate EH selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateEINumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate EI requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EI_PLAN_DOC_PATH,
    previousGateEH: {
      counters: POST_V1_GATE_EH_COUNTERS,
      landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
      ownerId: POST_V1_GATE_EH_OWNER_ID,
      selectedNextAction: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected.id as typeof POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
  };
}
