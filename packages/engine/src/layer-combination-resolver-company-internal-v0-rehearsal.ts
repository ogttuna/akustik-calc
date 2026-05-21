import {
  buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS,
  type LayerCombinationResolverCandidateCoverageMatrixRow,
  type LayerCombinationResolverCandidateReadinessBucket
} from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import type {
  LayerCombinationResolverBasis,
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE =
  "layer_combination_resolver_company_internal_v0_rehearsal_plan";

export const LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS =
  "layer_combination_resolver_company_internal_v0_rehearsal_landed_no_runtime_selected_single_leaf_mass_law_banded_solver_owner";

export const LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan";

export const LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL =
  "layer combination resolver single-leaf mass-law banded solver owner";

export type LayerCombinationResolverCompanyInternalUseDecision =
  | "allowed_exact"
  | "allowed_with_budget"
  | "blocked"
  | "needs_user_input"
  | "research_only";

export type LayerCombinationResolverCompanyInternalV0GapId =
  | "astm_iic_aiic_rating_owner"
  | "broad_source_crawl"
  | "double_leaf_framed_wall_banded_solver_owner"
  | "field_building_prediction_flanking_owner"
  | "floor_cover_delta_lw_dynamic_stiffness_owner"
  | "wall_floor_single_leaf_mass_law_banded_solver_owner";

export type LayerCombinationResolverCompanyInternalV0BlockedActionId =
  | "astm_iic_aiic_alias_runtime"
  | "broad_source_crawl"
  | "field_building_runtime_promotion"
  | "tolerance_retune_without_holdouts";

export type LayerCombinationResolverCompanyInternalV0OperatingEnvelopeRow = {
  readonly basis: LayerCombinationResolverBasis;
  readonly budgetMetrics: readonly LayerCombinationResolverMetricId[];
  readonly candidateId: string;
  readonly companyInternalUse: LayerCombinationResolverCompanyInternalUseDecision;
  readonly errorBudgetTerms: LayerCombinationResolverCandidateCoverageMatrixRow["errorBudgetTerms"];
  readonly hasVisibleCandidateTrace: true;
  readonly noRuntimeValueMovement: true;
  readonly readinessBucket: LayerCombinationResolverCandidateReadinessBucket;
  readonly requiredUserFields: readonly string[];
  readonly route: LayerCombinationResolverRoute;
  readonly runtimeBasisId: string | null;
  readonly supportBucket: string;
  readonly supportedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly valuePins: LayerCombinationResolverCandidateCoverageMatrixRow["valuePins"];
  readonly visibleReason: string;
};

export type LayerCombinationResolverCompanyInternalV0ResearchGapRow = {
  readonly basis: LayerCombinationResolverBasis;
  readonly candidateId: `research_gap.${string}`;
  readonly currentReadinessBucket: "research_only";
  readonly id: LayerCombinationResolverCompanyInternalV0GapId;
  readonly noRuntimeValueMovement: true;
  readonly rank: number;
  readonly reason: string;
  readonly requiredOwnerFields: readonly string[];
  readonly route: LayerCombinationResolverRoute;
  readonly selected: boolean;
  readonly selectedNextAction: string | null;
  readonly selectedNextFile: string | null;
};

export type LayerCombinationResolverCompanyInternalV0BlockedAction = {
  readonly id: LayerCombinationResolverCompanyInternalV0BlockedActionId;
  readonly reason: string;
  readonly selectedNow: false;
};

export type LayerCombinationResolverCompanyInternalV0RehearsalContract = {
  readonly blockedNextActions: readonly LayerCombinationResolverCompanyInternalV0BlockedAction[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly operatingEnvelopeRows: readonly LayerCombinationResolverCompanyInternalV0OperatingEnvelopeRow[];
  readonly previousCoverageMatrix: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS;
  };
  readonly rankedResearchOnlyGaps: readonly LayerCombinationResolverCompanyInternalV0ResearchGapRow[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS;
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly allowedExactRowCount: number;
    readonly allowedWithBudgetRowCount: number;
    readonly blockedActionCount: number;
    readonly blockedRowCount: number;
    readonly coverageMatrixRowCount: number;
    readonly companyInternalV0AllowedRowCount: number;
    readonly needsUserInputRowCount: number;
    readonly readinessBucketCount: Record<LayerCombinationResolverCandidateReadinessBucket, number>;
    readonly researchOnlyGapCount: number;
    readonly selectedGapId: LayerCombinationResolverCompanyInternalV0GapId;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION;
  };
};

function companyInternalUseForReadiness(
  readinessBucket: LayerCombinationResolverCandidateReadinessBucket
): LayerCombinationResolverCompanyInternalUseDecision {
  switch (readinessBucket) {
    case "ready":
      return "allowed_exact";
    case "ready_with_budget":
      return "allowed_with_budget";
    case "needs_input":
      return "needs_user_input";
    case "research_only":
      return "research_only";
    case "unsupported":
    default:
      return "blocked";
  }
}

function visibleReasonForRow(row: LayerCombinationResolverCandidateCoverageMatrixRow): string {
  switch (row.readinessBucket) {
    case "ready":
      return `${row.candidateId} is allowed for company-internal V0 only when the exact same route, topology, metric basis, and explicit layer roles match.`;
    case "ready_with_budget":
      return `${row.candidateId} is allowed for company-internal V0 with visible not-measured or calibrated budgets and the listed hard compatibility gates.`;
    case "needs_input":
      return `${row.candidateId} must stop as needs_input and name the missing physical fields before any formula or source anchor is attempted.`;
    case "research_only":
      return `${row.candidateId} is research-only until a bounded owner, candidate contract, and validation surface exist.`;
    case "unsupported":
    default:
      return `${row.candidateId} remains blocked for company-internal V0 because the requested basis or rating procedure has no runtime owner.`;
  }
}

function countReadinessBuckets(
  rows: readonly LayerCombinationResolverCompanyInternalV0OperatingEnvelopeRow[]
): Record<LayerCombinationResolverCandidateReadinessBucket, number> {
  return {
    needs_input: rows.filter((row) => row.readinessBucket === "needs_input").length,
    ready: rows.filter((row) => row.readinessBucket === "ready").length,
    ready_with_budget: rows.filter((row) => row.readinessBucket === "ready_with_budget").length,
    research_only: rows.filter((row) => row.readinessBucket === "research_only").length,
    unsupported: rows.filter((row) => row.readinessBucket === "unsupported").length
  };
}

function buildOperatingEnvelopeRows():
  readonly LayerCombinationResolverCompanyInternalV0OperatingEnvelopeRow[] {
  const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();

  return coverageMatrix.coverageMatrixRows.map((row) => ({
    basis: row.basis,
    budgetMetrics: row.errorBudgetTerms.map((term) => term.metric),
    candidateId: row.candidateId,
    companyInternalUse: companyInternalUseForReadiness(row.readinessBucket),
    errorBudgetTerms: row.errorBudgetTerms,
    hasVisibleCandidateTrace: true,
    noRuntimeValueMovement: true,
    readinessBucket: row.readinessBucket,
    requiredUserFields: row.requiredInputs,
    route: row.route,
    runtimeBasisId: row.runtimeBasisId,
    supportBucket: row.supportBucket,
    supportedMetrics: row.supportedMetrics,
    valuePins: row.valuePins,
    visibleReason: visibleReasonForRow(row)
  }));
}

function buildResearchOnlyGaps(): readonly LayerCombinationResolverCompanyInternalV0ResearchGapRow[] {
  return [
    {
      basis: "element_lab",
      candidateId: "research_gap.wall_floor.single_leaf_mass_law_banded_solver_owner",
      currentReadinessBucket: "research_only",
      id: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      noRuntimeValueMovement: true,
      rank: 1,
      reason:
        "single-leaf massive wall/floor surfaces are common and already have partial banded delegates, but the shared layer-combination resolver still needs an explicit owner before claiming broad V0 coverage",
      requiredOwnerFields: [
        "route-specific single visible leaf topology",
        "material density and surface mass",
        "thickness and stiffness/coincidence family",
        "one-third-octave transmission-loss curve",
        "ISO 717-1 rating adapter",
        "exact-source precedence and holdout residual budget"
      ],
      route: "wall",
      selected: true,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE
    },
    {
      basis: "element_lab",
      candidateId: "research_gap.wall.double_leaf_framed_banded_solver_owner",
      currentReadinessBucket: "research_only",
      id: "double_leaf_framed_wall_banded_solver_owner",
      noRuntimeValueMovement: true,
      rank: 2,
      reason:
        "double-leaf, framed, resilient, and cavity walls are common but need a separately owned mass-air-mass/coupling solver and residual budget",
      requiredOwnerFields: [
        "leaf grouping",
        "frame or stud topology",
        "cavity depth",
        "absorber state",
        "mechanical coupling class",
        "one-third-octave wall curve"
      ],
      route: "wall",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "element_lab",
      candidateId: "research_gap.floor.floor_cover_delta_lw_dynamic_stiffness_owner",
      currentReadinessBucket: "research_only",
      id: "floor_cover_delta_lw_dynamic_stiffness_owner",
      noRuntimeValueMovement: true,
      rank: 3,
      reason:
        "floating covers and resilient layers need dynamic-stiffness and load-basis owners before they can generalize beyond the existing package-transfer corridors",
      requiredOwnerFields: [
        "resilient layer dynamic stiffness",
        "load basis",
        "covering mass",
        "base slab family",
        "DeltaLw curve or octave-band adapter",
        "impact residual budget"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "building_prediction",
      candidateId: "research_gap.floor.field_building_prediction_flanking_owner",
      currentReadinessBucket: "research_only",
      id: "field_building_prediction_flanking_owner",
      noRuntimeValueMovement: true,
      rank: 4,
      reason:
        "field/building prediction remains outside V0 except exact-anchor continuations because direct, flanking, junction, and room-normalization owners are not complete",
      requiredOwnerFields: [
        "junction coupling",
        "flanking path topology",
        "source and receiving room volumes",
        "partition area",
        "RT60 normalization",
        "field/building uncertainty budget"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "astm_rating_boundary",
      candidateId: "research_gap.floor.astm_iic_aiic_rating_owner",
      currentReadinessBucket: "research_only",
      id: "astm_iic_aiic_rating_owner",
      noRuntimeValueMovement: true,
      rank: 5,
      reason:
        "ASTM IIC/AIIC cannot be derived by alias from ISO Ln,w/CI; it needs a named ASTM rating curve and procedure owner",
      requiredOwnerFields: [
        "ASTM reference contour",
        "one-third-octave impact curve",
        "test standard basis",
        "field versus lab rating owner",
        "alias rejection tests"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "element_lab",
      candidateId: "research_gap.floor.broad_source_crawl",
      currentReadinessBucket: "research_only",
      id: "broad_source_crawl",
      noRuntimeValueMovement: true,
      rank: 6,
      reason:
        "broad source crawling is blocked until a specific owner names exact rows, holdouts, anchors, or residuals needed by a bounded solver lane",
      requiredOwnerFields: [
        "bounded target family",
        "source rights and provenance",
        "exact versus holdout purpose",
        "metric and basis scope",
        "negative-boundary rows"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    }
  ];
}

export function buildLayerCombinationResolverCompanyInternalV0RehearsalContract():
  LayerCombinationResolverCompanyInternalV0RehearsalContract {
  const rows = buildOperatingEnvelopeRows();
  const rankedResearchOnlyGaps = buildResearchOnlyGaps();
  const readinessBucketCount = countReadinessBuckets(rows);
  const allowedExactRowCount = rows.filter((row) => row.companyInternalUse === "allowed_exact").length;
  const allowedWithBudgetRowCount = rows.filter((row) => row.companyInternalUse === "allowed_with_budget").length;

  return {
    blockedNextActions: [
      {
        id: "broad_source_crawl",
        reason:
          "not selected because the V0 rehearsal needs solver-depth owners first; sources enter only as exact rows, anchors, or holdouts for a named gap",
        selectedNow: false
      },
      {
        id: "field_building_runtime_promotion",
        reason:
          "not selected because exact-anchor field continuations are allowed, but new building prediction runtime still needs flanking and junction owners",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_alias_runtime",
        reason:
          "not selected because ASTM IIC/AIIC remains a rating-procedure gap, not an ISO Ln,w or CI alias",
        selectedNow: false
      },
      {
        id: "tolerance_retune_without_holdouts",
        reason:
          "not selected because no new measured residual set entered this no-runtime rehearsal",
        selectedNow: false
      }
    ],
    landedGate: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
    noRuntimeValueMovement: true,
    operatingEnvelopeRows: rows,
    previousCoverageMatrix: {
      landedGate: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS
    },
    rankedResearchOnlyGaps,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS,
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      allowedExactRowCount,
      allowedWithBudgetRowCount,
      blockedActionCount: 4,
      blockedRowCount: rows.filter((row) => row.companyInternalUse === "blocked").length,
      coverageMatrixRowCount: rows.length,
      companyInternalV0AllowedRowCount: allowedExactRowCount + allowedWithBudgetRowCount,
      needsUserInputRowCount: rows.filter((row) => row.companyInternalUse === "needs_user_input").length,
      readinessBucketCount,
      researchOnlyGapCount: rankedResearchOnlyGaps.length,
      selectedGapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION
    }
  };
}
