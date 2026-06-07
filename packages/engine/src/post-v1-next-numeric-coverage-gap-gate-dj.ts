import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS
} from "./post-v1-floor-steel-visible-formula-input-bridge-gate-di";
import {
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
} from "./steel-floor-formula-input-surface";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dj_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dj_landed_no_runtime_selected_floor_steel_visible_formula_input_surface_parity_gate_dk" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION =
  "post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_LABEL =
  "post-V1 floor steel visible formula input surface parity Gate DK" as const;

export const POST_V1_GATE_DJ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID =
  "floor.steel_visible_formula_input_surface_parity_gap" as const;

export const POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  estimatedNextSurfaceRequestShapes: 4,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  selectedCalculatorSurfaceParityRequired: true,
  selectedRequiredPhysicalInputs: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  wrongAliasOrFallbackBlocks: [
    "Gate DK must reuse the Gate DI steel formula input owner instead of adding a new steel formula",
    "missing steelSupportForm, steelCarrierDepthMm, steelCarrierSpacingMm, toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, or lowerCeilingIsolationSupportForm remains needs_input",
    "bound-only UBIQ/open-web Ln,w rows and generic steel family archetypes must not publish DeltaLw by proximity",
    "wall-held AAC/multicavity stacks are already runtime-capable when supportTopology is provided and must not be selected as fake scope",
    "exact ASTM E492/E1007 bands already own IIC/AIIC; ISO impact routes still do not publish ASTM aliases",
    "Gate DJ does not touch frontend implementation"
  ]
} as const;

export type PostV1GateDJCandidateId =
  | typeof POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.steel_bound_delta_lw_from_family_row"
  | "floor.steel_fallback_low_frequency_field_context_gap"
  | "floor.steel_visible_formula_runtime_bridge_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.held_aac_board_fill_gap_multicavity_gap";

export type PostV1GateDJSliceKind =
  | "accuracy_holdout_intake"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_safe_owner"
  | "calculator_surface_parity"
  | "closed_runtime_gap"
  | "metric_basis_input_surface"
  | "wrong_alias_or_fallback";

export type PostV1GateDJCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDJCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDJSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDJSummary = {
  readonly candidates: readonly PostV1GateDJCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DJ_PLAN_DOC_PATH;
  readonly previousGateDI: {
    readonly landedGate: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS;
};

export function rankPostV1GateDJNumericCoverageCandidates(): readonly PostV1GateDJCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate DI made the visible steel/open-web formula bridge live inside calculateAssembly when steelFloorFormulaSurface is supplied",
        "the next product-scope risk is leaving that route as an internal-only option instead of a calculator surface path",
        "Gate DK can carry the same required physical inputs across impact/estimate surfaces without retuning the steel mass-spring formula or borrowing bound-only rows"
      ],
      id: POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/calculate-impact-only.ts",
        "packages/shared/src/api/impact-only.ts",
        "packages/shared/src/api/estimate.ts",
        "packages/engine/src/steel-floor-formula-input-surface.ts"
      ],
      nextActionMovesRuntimeValues: true,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DI: the formula route is now correct in the engine, so the next scope move is calculator surface parity for the same steel owner inputs. This makes the new route usable without inventing a formula, crawling rows, or touching frontend implementation in Gate DJ.",
      score: 4.38,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
      sliceKind: "calculator_surface_parity",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "the Gate DI runtime bridge is already closed for calculateAssembly",
        "selecting the same runtime bridge again would not add a new calculable layer combination",
        "Gate DK must be about carrying that bridge through calculator surfaces, not re-landing the formula route"
      ],
      id: "floor.steel_visible_formula_runtime_bridge_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DI.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DJ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit wall-held AAC/multicavity requests without supportTopology correctly stop as needs_input",
        "when supportTopology is supplied, the existing Gate AE/Gate I multicavity formula path calculates lab and field metrics",
        "selecting it now would count a missing physical input as a fake runtime gap"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-flat-multicavity-auto-topology.ts",
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Already runtime-capable when the route-required supportTopology input is present; the supportless request must stay needs_input.",
      score: 1.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 one-third-octave sources already calculate IIC/AIIC through the ASTM E989 owner",
        "ISO impact formulas still must not alias to IIC or AIIC",
        "a broader user-band surface is valid later, but it is lower ROI than making the newly landed Gate DI steel route surface-reachable"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts",
        "packages/shared/src/domain/exact-impact-source.ts",
        "packages/shared/src/api/impact-only.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Metric-basis important, but exact ASTM bands are already live; Gate DJ should not reselect it while a just-landed layer/formula route still needs calculator surface parity.",
      score: 2.58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "UBIQ/open-web bound rows and generic steel archetypes can keep Ln,w visible",
        "they still do not own same-stack DeltaLw",
        "publishing DeltaLw from those rows would be source proximity or family fallback, not calculation"
      ],
      id: "floor.steel_bound_delta_lw_from_family_row",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts",
        "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Rejected as wrong alias/fallback; Gate DI's steel formula owner is the only selected DeltaLw route.",
      score: 1.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "wrong_alias_or_fallback",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "steel fallback L'nT,50 is already calculable when explicit impactFieldContext.ci50_2500Db is present",
        "requests missing that field should continue to stop rather than infer low-frequency adaptation",
        "selecting it now would not add formula scope"
      ],
      id: "floor.steel_fallback_low_frequency_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit CI50 field context.",
      score: 0.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'nT,50"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CL recorded opening/leak and common-wall residual ledgers",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would be holdout intake, not the highest immediate scope move"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but still blocked from runtime movement by holdout requirements.",
      score: 1.76,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate DG promoted the lined-massive runtime basis without changing numeric values",
        "direct retune still lacks a wall-specific same-stack source row or a new bounded coefficient rule",
        "moving values now would weaken the accuracy guard"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Still blocked until a source row or coefficient rule authorizes numeric movement.",
      score: 1.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_safe_owner",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
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
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
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
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    }
  ] as const satisfies readonly PostV1GateDJCandidate[];
}

export function summarizePostV1GateDJNumericCoverageGap(): PostV1GateDJSummary {
  if (
    POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE
  ) {
    throw new Error("Gate DJ can only land after Gate DI selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDJNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DJ requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DJ_PLAN_DOC_PATH,
    previousGateDI: {
      landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS
  };
}
