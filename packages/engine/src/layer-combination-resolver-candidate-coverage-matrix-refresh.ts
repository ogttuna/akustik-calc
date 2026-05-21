import {
  buildLayerCombinationResolverRegistryContract,
  type LayerCombinationResolverBasis,
  type LayerCombinationResolverCandidateKind,
  type LayerCombinationResolverMetricId,
  type LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";
import {
  buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS,
  type LayerCombinationResolverRuntimeCandidateSurfaceParityTarget
} from "./layer-combination-resolver-runtime-candidate-surface-parity";

export const LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE =
  "layer_combination_resolver_candidate_coverage_matrix_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS =
  "layer_combination_resolver_candidate_coverage_matrix_refresh_landed_no_runtime_selected_company_internal_v0_rehearsal";

export const LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_company_internal_v0_rehearsal_plan";

export const LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL =
  "layer combination resolver company-internal v0 rehearsal";

export type LayerCombinationResolverCandidateReadinessBucket =
  | "needs_input"
  | "ready"
  | "ready_with_budget"
  | "research_only"
  | "unsupported";

export type LayerCombinationResolverCandidateCoverageMatrixRow = {
  readonly basis: LayerCombinationResolverBasis;
  readonly boundaryCandidateIds: readonly string[];
  readonly candidateId: string;
  readonly candidateKind: LayerCombinationResolverCandidateKind;
  readonly errorBudgetTerms: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly notMeasuredEvidence: boolean;
    readonly toleranceDb: number;
  }[];
  readonly exactPrecedenceRules: readonly string[];
  readonly hardCompatibilityGates: readonly string[];
  readonly hasVisibleCandidateTrace: true;
  readonly hostileInputCases: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly priorityRank: number;
  readonly readinessBucket: LayerCombinationResolverCandidateReadinessBucket;
  readonly rejectedCandidateIds: readonly string[];
  readonly requiredInputs: readonly string[];
  readonly route: LayerCombinationResolverRoute;
  readonly runtimeBasisId: string | null;
  readonly surfaceTargets: readonly LayerCombinationResolverRuntimeCandidateSurfaceParityTarget[];
  readonly supportBucket: string;
  readonly supportedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly valuePins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
};

export type LayerCombinationResolverKindCoverageRow = {
  readonly candidateIds: readonly string[];
  readonly kind: LayerCombinationResolverCandidateKind;
  readonly resolverOrderRank: number;
};

export type LayerCombinationResolverCandidateCoverageMatrixRefreshContract = {
  readonly coverageMatrixRows: readonly LayerCombinationResolverCandidateCoverageMatrixRow[];
  readonly kindCoverage: readonly LayerCombinationResolverKindCoverageRow[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS;
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly activeRuntimeCandidateCount: number;
    readonly allCandidateDeclarationsCovered: true;
    readonly boundaryCandidateCount: number;
    readonly candidateDeclarationCount: number;
    readonly coverageMatrixRowCount: number;
    readonly readinessBucketCount: Record<LayerCombinationResolverCandidateReadinessBucket, number>;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
    readonly surfaceRowCount: number;
  };
};

function readinessBucketForKind(kind: LayerCombinationResolverCandidateKind): LayerCombinationResolverCandidateReadinessBucket {
  switch (kind) {
    case "exact_measured_override":
      return "ready";
    case "similarity_anchor":
    case "calibrated_family_solver":
    case "source_absent_family_solver":
    case "field_building_adapter":
      return "ready_with_budget";
    case "needs_input_boundary":
      return "needs_input";
    case "basis_boundary":
    case "unsupported_boundary":
    default:
      return "unsupported";
  }
}

function countReadinessBuckets(
  rows: readonly LayerCombinationResolverCandidateCoverageMatrixRow[]
): Record<LayerCombinationResolverCandidateReadinessBucket, number> {
  return {
    needs_input: rows.filter((row) => row.readinessBucket === "needs_input").length,
    ready: rows.filter((row) => row.readinessBucket === "ready").length,
    ready_with_budget: rows.filter((row) => row.readinessBucket === "ready_with_budget").length,
    research_only: rows.filter((row) => row.readinessBucket === "research_only").length,
    unsupported: rows.filter((row) => row.readinessBucket === "unsupported").length
  };
}

export function buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract():
  LayerCombinationResolverCandidateCoverageMatrixRefreshContract {
  const registry = buildLayerCombinationResolverRegistryContract();
  const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
  const surfaceRowsById = new Map(surfaceParity.surfaceRows.map((row) => [row.selectedCandidateId, row]));

  const coverageMatrixRows = registry.candidateDeclarations.map((candidate) => {
    const surfaceRow = surfaceRowsById.get(candidate.id);
    if (!surfaceRow) {
      throw new Error(`Layer combination resolver coverage matrix is missing surface row for ${candidate.id}.`);
    }

    return {
      basis: candidate.basis,
      boundaryCandidateIds: surfaceRow.boundaryCandidateIds,
      candidateId: candidate.id,
      candidateKind: candidate.kind,
      errorBudgetTerms: candidate.errorBudgetTerms,
      exactPrecedenceRules: candidate.exactPrecedenceRules,
      hardCompatibilityGates: candidate.hardCompatibilityGates,
      hasVisibleCandidateTrace: true,
      hostileInputCases: candidate.hostileInputCases,
      noRuntimeValueMovement: true,
      priorityRank: candidate.priorityRank,
      readinessBucket: readinessBucketForKind(candidate.kind),
      rejectedCandidateIds: surfaceRow.rejectedCandidateIds,
      requiredInputs: candidate.requiredInputs,
      route: candidate.route,
      runtimeBasisId: surfaceRow.runtimeBasisId,
      surfaceTargets: surfaceParity.surfaceTargets,
      supportBucket: surfaceRow.supportBucket,
      supportedMetrics: candidate.supportedMetrics,
      valuePins: candidate.valuePins
    } satisfies LayerCombinationResolverCandidateCoverageMatrixRow;
  });

  const kindCoverage = registry.resolverOrder.map((order) => ({
    candidateIds: coverageMatrixRows.filter((row) => row.candidateKind === order.kind).map((row) => row.candidateId),
    kind: order.kind,
    resolverOrderRank: order.rank
  }));

  return {
    coverageMatrixRows,
    kindCoverage,
    landedGate: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS
    },
    selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTION_STATUS,
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      activeRuntimeCandidateCount: registry.summary.activeRuntimeCandidateCount,
      allCandidateDeclarationsCovered: true,
      boundaryCandidateCount: coverageMatrixRows.filter(
        (row) =>
          row.candidateKind === "basis_boundary" ||
          row.candidateKind === "needs_input_boundary" ||
          row.candidateKind === "unsupported_boundary"
      ).length,
      candidateDeclarationCount: registry.summary.candidateCount,
      coverageMatrixRowCount: coverageMatrixRows.length,
      readinessBucketCount: countReadinessBuckets(coverageMatrixRows),
      selectedNextAction: LAYER_COMBINATION_RESOLVER_CANDIDATE_COVERAGE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      surfaceRowCount: surfaceParity.summary.surfaceRowCount
    }
  };
}
