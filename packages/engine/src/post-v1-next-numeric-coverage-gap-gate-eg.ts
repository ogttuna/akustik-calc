import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS,
  POST_V1_GATE_EF_COUNTERS
} from "./post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_eg_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_eg_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_owner_gate_eh" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION =
  "post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_LABEL =
  "post-V1 floor ASTM IIC/AIIC exact-band input owner Gate EH" as const;

export const POST_V1_GATE_EG_SELECTED_CANDIDATE_ID =
  "floor.astm_iic_aiic_exact_band_user_input_owner_gap" as const;

export const POST_V1_GATE_EG_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EG_EH_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EG_SELECTED_TARGET_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "After Gate EF, the composite-panel suspended-ceiling-only boundary is pinned and the remaining apparent floor-impact gaps were rechecked against newer runtime contracts.",
    rejectedDirections: [
      "open-web field/building companions because newer helper-only/raw-bare contracts already calculate them with explicit impactFieldContext",
      "open-box finished package field/building companions because Gates BS through CD already keep those mixed requests live",
      "lower-treatment DeltaLw subtraction across open-web, hollow-core, Pliteq, or Knauf rows because it remains a wrong metric-owner derivation"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest remaining ROI is the ASTM IIC/AIIC exact-band input owner boundary: the engine already owns ASTM E492/E1007 one-third-octave E989 rating, while user/import surfaces can still stamp one-third-octave impact bands as ISO unless a bounded owner/input gate pins the method boundary.",
    rejectedDirections: [
      "adding new formula coefficients before the exact ASTM owner/input boundary is provable",
      "broad source-row crawling for finite ASTM examples",
      "frontend polish or confidence wording without a selected calculator owner"
    ]
  }
] as const;

export const POST_V1_GATE_EG_NO_RUNTIME_COUNTERS = {
  candidateCount: 12,
  estimatedFollowingNewCalculableMetricBasisRequestShapesIfGateEHProvesOwner: 2,
  estimatedNextInputOwnerLedgers: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS.length,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEGCandidateId =
  | typeof POST_V1_GATE_EG_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording_or_frontend_polish"
  | "floor.astm_iic_aiic_formula_alias_from_iso_rejected"
  | "floor.composite_panel_route_boundary_closed_by_ef"
  | "floor.heavy_concrete_resilient_channel_closed_by_ed"
  | "floor.held_aac_or_topology_input_surface_boundary"
  | "floor.lower_treatment_delta_lw_cross_family_derivation_rejected"
  | "floor.mass_timber_clt_delta_lw_closed_by_ea"
  | "floor.open_box_finished_package_field_building_already_live"
  | "floor.open_box_residual_variants_negative_boundary"
  | "floor.open_web_field_building_companion_already_live"
  | "opening_leak_common_wall_holdout_tightening";

export type PostV1GateEGSliceKind =
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_wrong_metric_alias"
  | "blocked_wrong_metric_derivation"
  | "input_owner_gap"
  | "input_surface_boundary"
  | "residual_holdout_blocked"
  | "runtime_route_boundary_closed";

export type PostV1GateEGCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEGCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly requiresFutureInputSurfaceImplementation: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEGSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateEGSummary = {
  readonly candidates: readonly PostV1GateEGCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EG_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EG_PLAN_DOC_PATH;
  readonly previousGateEF: {
    readonly counters: typeof POST_V1_GATE_EF_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EG_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS;
};

export function rankPostV1GateEGNumericCoverageCandidates(): readonly PostV1GateEGCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "ASTM E492/E1007 one-third-octave impact bands already calculate IIC/AIIC through the engine-owned ASTM E989 contour owner",
        "shared estimate and impact-only API payloads already have an exactImpactSource field with standardMethod",
        "user/import surfaces can still stamp one-third-octave impact bands as ISO, so Gate EH must pin the owner/input boundary before any surface implementation promotes user-supplied IIC/AIIC"
      ],
      id: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts",
        "packages/shared/src/domain/exact-impact-source.ts",
        "packages/shared/src/api/estimate.ts",
        "packages/shared/src/api/impact-only.ts",
        "apps/web/features/workbench/impact-band-import.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI now: it increases calculator metric-basis reach for real user-supplied ASTM impact bands without inventing formula aliases or source-row catalog behavior. Gate EH is intentionally an owner/input proof before any frontend/input surface implementation.",
      requiresFutureInputSurfaceImplementation: true,
      score: 3.16,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
      sliceKind: "input_owner_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EG_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "newer helper-only timber/open-web and raw-bare open-web contracts already calculate field impact companions when explicit impactFieldContext is supplied",
        "missing field context remains needs_input or unsupported by route",
        "selecting this as Gate EH would duplicate active runtime behavior"
      ],
      id: "floor.open_web_field_building_companion_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts",
        "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
        "apps/web/features/workbench/open-web-field-building-input-surface.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable in the current implementation with explicit field context.",
      requiresFutureInputSurfaceImplementation: false,
      score: 2.24,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gates BS, BU, BV, BX, BZ, CB, and CD already keep finished open-box package lab, field, building, and mixed single-output companions live",
        "the remaining gaps are residual/negative-boundary variants rather than a clean runtime formula-routing miss",
        "selecting this now would not add new calculable scope"
      ],
      id: "floor.open_box_finished_package_field_building_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable in the current implementation.",
      requiresFutureInputSurfaceImplementation: false,
      score: 2.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate EF already pins the visible composite suspended-ceiling-only stack to predictor_composite_panel_published_interaction_estimate",
        "no additional composite runtime movement is selected without new falsifying evidence",
        "the route remains a closed boundary for this selection pass"
      ],
      id: "floor.composite_panel_route_boundary_closed_by_ef",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate EF.",
      requiresFutureInputSurfaceImplementation: false,
      score: 1.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_route_boundary_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate ED already promoted the bounded resilient_channel lower-treatment stack into the heavy-concrete combined upper/lower formula corridor",
        "missing route-required physical inputs remain needs_input",
        "selecting it again would duplicate a closed runtime slice"
      ],
      id: "floor.heavy_concrete_resilient_channel_closed_by_ed",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate ED.",
      requiresFutureInputSurfaceImplementation: false,
      score: 1.55,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_route_boundary_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate EA already routed visible tagged CLT/timber upper packages to the existing DeltaLw owners",
        "exact/published Ln,w anchors remain first",
        "new mass-timber work would need a separate uncovered topology"
      ],
      id: "floor.mass_timber_clt_delta_lw_closed_by_ea",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate EA.",
      requiresFutureInputSurfaceImplementation: false,
      score: 1.48,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_route_boundary_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "held AAC/topology boundaries remain needs_input where supportTopology or route owner fields are absent",
        "promoting them without those inputs would weaken calculator correctness",
        "the right future slice would be a bounded topology/input owner, not a generic runtime widening"
      ],
      id: "floor.held_aac_or_topology_input_surface_boundary",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "A valid boundary, but lower ROI than ASTM exact-band input ownership now.",
      requiresFutureInputSurfaceImplementation: true,
      score: 1.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "R'w", "DnT,w"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "R8b/R9b style open-box residuals remain negative or blocked because same-family calibration and same-basis holdout evidence is insufficient",
        "promoting them now would be source proximity behavior rather than a formula owner",
        "they remain candidates only after source/rule evidence improves"
      ],
      id: "floor.open_box_residual_variants_negative_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Residual/holdout blocked, not a clean next runtime slice.",
      requiresFutureInputSurfaceImplementation: false,
      score: 1.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "Ln,w", "L'nT,w"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "opening/leak budgets are already held wide by residual ledgers",
        "tightening them needs same-family calibration and same-basis holdouts",
        "no runtime value should move from source proximity alone"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy work remains blocked by insufficient holdouts.",
      requiresFutureInputSurfaceImplementation: false,
      score: 1.08,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "residual_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "ISO Ln,w/DeltaLw/field-impact routes remain separate from ASTM IIC/AIIC",
        "publishing IIC or AIIC from ISO bands would be a wrong-standard alias",
        "Gate EH may only admit ASTM-labelled exact-band sources through the existing ASTM owner"
      ],
      id: "floor.astm_iic_aiic_formula_alias_from_iso_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Wrong metric/basis alias.",
      requiresFutureInputSurfaceImplementation: false,
      score: 0.9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_alias",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EG_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "open-web, hollow-core, steel, Pliteq, and Knauf lower-treatment changes mix carrier, support, and lower ceiling treatment effects",
        "bare-minus-treated subtraction would not own a route-correct DeltaLw",
        "this remains intentionally rejected until a family-specific formula owner is selected"
      ],
      id: "floor.lower_treatment_delta_lw_cross_family_derivation_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/floor-exact-companion-split-parity.test.ts",
        "docs/calculator/POST_V1_GATE_EE_EF_COMPOSITE_PANEL_SUSPENDED_CEILING_ROUTE_PLAN_2026-06-07.md"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Wrong metric derivation.",
      requiresFutureInputSurfaceImplementation: false,
      score: 0.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_wrong_metric_derivation",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["DeltaLw"] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 12,
      expectedBeforeAfter: [
        "broad source crawling, confidence wording, and frontend polish do not by themselves improve formula routing or numeric accuracy",
        "they may support a later selected calculator slice but are not Gate EH",
        "Gate EG imports no source rows and touches no frontend implementation"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Non-goal for the current calculator slice.",
      requiresFutureInputSurfaceImplementation: false,
      score: 0.45,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: [] as const,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    }
  ];
}

export function summarizePostV1GateEGNumericCoverageGap(): PostV1GateEGSummary {
  if (
    POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE
  ) {
    throw new Error("Gate EG can only land after Gate EF returns the chain to numeric coverage rerank.");
  }

  return {
    candidates: rankPostV1GateEGNumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EG_PLAN_DOC_PATH,
    previousGateEF: {
      counters: POST_V1_GATE_EF_COUNTERS,
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
  };
}
