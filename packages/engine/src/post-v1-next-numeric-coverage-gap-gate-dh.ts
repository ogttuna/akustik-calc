import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg";
import { STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS } from "./steel-floor-formula-input-surface";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dh_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dh_landed_no_runtime_selected_floor_steel_visible_formula_input_bridge_gate_di" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION =
  "post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_LABEL =
  "post-V1 floor steel visible formula input bridge Gate DI" as const;

export const POST_V1_GATE_DH_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DH_SELECTED_CANDIDATE_ID =
  "floor.steel_visible_formula_input_bridge_gap" as const;

export const POST_V1_GATE_DH_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DH_NO_RUNTIME_COUNTERS = {
  candidateCount: 13,
  estimatedNextNewCalculableLayerTemplates: 2,
  estimatedNextNewCalculableRequestShapes: 4,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedCurrentlyUnsupportedRequestShapes: 5,
  runtimeValuesMoved: 0,
  selectedRequiredPhysicalInputs: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  wrongAliasOrFallbackBlocks: [
    "Gate DI may route visible steel/open-web floors to the existing steel formula only when the steel formula owner inputs are present",
    "bound-only UBIQ/open-web Ln,w rows and generic steel family archetypes must not publish DeltaLw by proximity",
    "missing steelSupportForm, steelCarrierDepthMm, steelCarrierSpacingMm, toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, or lowerCeilingIsolationSupportForm remains needs_input",
    "suspended-ceiling-only steel floors keep Ln,w only until upper-package DeltaLw owner inputs are present",
    "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateDHCandidateId =
  | typeof POST_V1_GATE_DH_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.composite_panel_delta_lw_published_interaction_owner_gap"
  | "floor.lightweight_concrete_delta_lw_runtime_corridor_gap"
  | "floor.steel_bound_delta_lw_from_family_row"
  | "floor.steel_fallback_low_frequency_field_context_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.held_aac_board_fill_gap_multicavity_gap";

export type PostV1GateDHSliceKind =
  | "accuracy_holdout_intake"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_safe_owner"
  | "closed_runtime_gap"
  | "formula_input_bridge"
  | "metric_basis_input_surface"
  | "wrong_alias_or_fallback";

export type PostV1GateDHCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDHCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDHSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateDHSummary = {
  readonly candidates: readonly PostV1GateDHCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DH_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DH_PLAN_DOC_PATH;
  readonly previousGateDG: {
    readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DH_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS;
};

export function rankPostV1GateDHNumericCoverageCandidates(): readonly PostV1GateDHCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "visible steel/open-web generated floor stacks currently keep Ln,w live but leave DeltaLw unsupported unless a separate explicit impactPredictorInput is supplied",
        "the steel mass-spring formula corridor and input surface already define the required physical owner fields",
        "Gate DI can increase scope by bridging visible steel layers plus complete steel owner inputs into the existing formula corridor without borrowing bound-only rows"
      ],
      id: POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/steel-floor-impact-formula-corridor.ts",
        "packages/engine/src/steel-floor-formula-input-surface.ts",
        "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeValues: true,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DG: common steel/open-web visible floor stacks have an owned steel formula path, but generated layer-entry requests still stop DeltaLw. The next step should bridge only complete steel owner inputs into that formula and keep missing inputs explicit.",
      score: 4.12,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
      sliceKind: "formula_input_bridge",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DH_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "UBIQ/open-web bound rows and the generic steel family archetype provide Ln,w anchors or bounds",
        "they do not own the same-stack upper/lower ISO DeltaLw improvement",
        "publishing DeltaLw from those rows would be a proximity alias rather than formula calculation"
      ],
      id: "floor.steel_bound_delta_lw_from_family_row",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-bound-explicit-ci-local-guide-gate-ap.ts",
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Rejected as wrong route selection; Gate DI must use the steel formula owner, not bound-only rows or family archetype proximity.",
      score: 1.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "wrong_alias_or_fallback",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit ASTM impact one-third-octave source input already routes through the engine ASTM E989 owner",
        "ISO impact formulas still must not alias to IIC or AIIC",
        "a broader user-band entry surface would touch shared/API/workbench/report/replay and is not this engine-only formula-routing slice"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/shared/src/domain/exact-impact-source.ts",
        "packages/shared/src/api/impact-only.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later as a cross-surface input program, but not the best engine-only layer/formula coverage move after Gate DG.",
      score: 2.24,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "the generated steel fallback row historically listed L'nT,50 as unsupported without explicit CI50 context",
        "with explicit impactFieldContext.ci50_2500Db the route calculates L'nT,50 through the existing field adapter",
        "selecting it now would claim fake scope movement for an already-owned input path"
      ],
      id: "floor.steel_fallback_low_frequency_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when the explicit CI50 physical input is present.",
      score: 1.9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate DB closed the lightweight-concrete DeltaLw runtime corridor",
        "complete visible and predictor-input lightweight-concrete stacks now calculate DeltaLw",
        "closed work must not be selected again"
      ],
      id: "floor.lightweight_concrete_delta_lw_runtime_corridor_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DB.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CY closed the composite-panel DeltaLw published-interaction owner gap",
        "dry, suspended, and combined composite-panel profiles now publish DeltaLw",
        "closed work must not be selected again"
      ],
      id: "floor.composite_panel_delta_lw_published_interaction_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CY.",
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CO landed visible timber/CLT upper-package DeltaLw routing",
        "the same candidate should not be picked again for steel because steel has its own formula owner and required physical input surface"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CO for timber/CLT; steel must use the steel owner, not that route.",
      score: 0.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "direct/flanking field companions calculate when explicit field context is supplied",
        "selecting it now would add pins for already-live behavior"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable for explicit direct/flanking field context.",
      score: 0.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate CL recorded common wall and opening/leak residual ledgers",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would be holdout intake rather than immediate formula-routing scope"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but still blocked from runtime movement by the Gate CL holdout requirements.",
      score: 1.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "Gate DG already moved the lined-massive lab route basis to bounded_prediction without retuning values",
        "a direct retune still lacks a wall-specific same-stack source row or new bounded coefficient rule",
        "selecting it now would move values without owner evidence"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Still blocked until a source row or coefficient rule authorizes numeric movement.",
      score: 1.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_safe_owner",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "Gate X intentionally admits single-leaf AAC masonry only",
        "AAC plus board/fill/cavity/grouped multicavity stacks need a separate topology owner before values can publish",
        "selecting it now would be a high-risk wall topology expansion with unclear owner boundaries"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Important later, but unsafe until a grouped AAC/multicavity owner is selected.",
      score: 0.92,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_safe_owner",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 12,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the product goal is formula-based calculator coverage, not catalog growth.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 13,
      expectedBeforeAfter: [
        "confidence wording and frontend polish can improve presentation",
        "they cannot choose the correct wall or floor formula or calculate a new output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or numeric accuracy.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateDHCandidate[];
}

export function summarizePostV1GateDHNumericCoverageGap(): PostV1GateDHSummary {
  if (
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE
  ) {
    throw new Error("Gate DH can only land after Gate DG selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDHNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DH requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DH_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DH_PLAN_DOC_PATH,
    previousGateDG: {
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS
  };
}
