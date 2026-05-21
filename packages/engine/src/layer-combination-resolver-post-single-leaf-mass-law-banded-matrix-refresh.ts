import {
  buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract,
  type LayerCombinationResolverCandidateReadinessBucket
} from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import {
  buildLayerCombinationResolverCompanyInternalV0RehearsalContract,
  type LayerCombinationResolverCompanyInternalV0BlockedAction,
  type LayerCombinationResolverCompanyInternalV0GapId
} from "./layer-combination-resolver-company-internal-v0-rehearsal";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS,
  buildLayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract
} from "./layer-combination-resolver-single-leaf-mass-law-banded-surface-parity";

export const LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE =
  "layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS =
  "layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_landed_no_runtime_selected_double_leaf_framed_wall_banded_solver_owner";

export const LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan";

export const LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL =
  "layer combination resolver double-leaf framed wall banded solver owner";

export type LayerCombinationResolverPostSingleLeafGapRow = {
  readonly basis: "astm_rating_boundary" | "building_prediction" | "element_lab";
  readonly currentReadinessBucket: "research_only";
  readonly id: Exclude<LayerCombinationResolverCompanyInternalV0GapId, "wall_floor_single_leaf_mass_law_banded_solver_owner">;
  readonly noRuntimeValueMovement: true;
  readonly rank: number;
  readonly reason: string;
  readonly requiredOwnerFields: readonly string[];
  readonly route: "floor" | "wall";
  readonly selected: boolean;
  readonly selectedNextAction: string | null;
  readonly selectedNextFile: string | null;
};

export type LayerCombinationResolverPostSingleLeafClosedGapRow = {
  readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
  readonly closedGapId: "wall_floor_single_leaf_mass_law_banded_solver_owner";
  readonly currentCompanyInternalUse: "allowed_with_budget";
  readonly currentReadinessBucket: "ready_with_budget";
  readonly errorBudgetDb: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB;
  readonly noRuntimeValueMovement: true;
  readonly runtimeBasisId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly valuePins: readonly {
    readonly metric: "Rw" | "STC";
    readonly value: number;
  }[];
  readonly visibleOnCandidateTrace: true;
};

export type LayerCombinationResolverPostSingleLeafMatrixRefreshContract = {
  readonly blockedNextActions: readonly LayerCombinationResolverCompanyInternalV0BlockedAction[];
  readonly closedSingleLeafGap: LayerCombinationResolverPostSingleLeafClosedGapRow;
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousSingleLeafSurfaceParity: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly rankedResearchOnlyGaps: readonly LayerCombinationResolverPostSingleLeafGapRow[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS;
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly activeRuntimeCandidateCount: number;
    readonly allowedExactRowCount: number;
    readonly allowedWithBudgetRowCount: number;
    readonly blockedActionCount: number;
    readonly blockedRowCount: number;
    readonly coverageMatrixRowCount: number;
    readonly needsUserInputRowCount: number;
    readonly readinessBucketCount: Record<LayerCombinationResolverCandidateReadinessBucket, number>;
    readonly researchOnlyGapCount: number;
    readonly selectedGapId: "double_leaf_framed_wall_banded_solver_owner";
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
    readonly singleLeafClosedAsAllowedWithBudget: true;
  };
};

function rerankPostSingleLeafResearchGaps(): readonly LayerCombinationResolverPostSingleLeafGapRow[] {
  return [
    {
      basis: "element_lab",
      currentReadinessBucket: "research_only",
      id: "double_leaf_framed_wall_banded_solver_owner",
      noRuntimeValueMovement: true,
      rank: 1,
      reason:
        "single-leaf is now trace-visible and budgeted, so the next common wall gap is double-leaf/framed walls with cavities, support coupling, absorber state, and banded TL ownership",
      requiredOwnerFields: [
        "side leaf grouping and surface mass per side",
        "cavity depth and absorber flow-resistivity state",
        "frame, stud, rail, or resilient support topology",
        "mechanical bridge and coupling class",
        "one-third-octave airborne transmission-loss curve",
        "ISO 717-1 Rw/C/Ctr adapter and residual budget",
        "hostile topology rules for duplicates, splits, and unsafe reorders"
      ],
      route: "wall",
      selected: true,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE
    },
    {
      basis: "element_lab",
      currentReadinessBucket: "research_only",
      id: "floor_cover_delta_lw_dynamic_stiffness_owner",
      noRuntimeValueMovement: true,
      rank: 2,
      reason:
        "floating covers and resilient layers remain critical for floors but need dynamic-stiffness, load-basis, package-role, and measured-vs-predicted transfer owners before runtime broadening",
      requiredOwnerFields: [
        "resilient layer dynamic stiffness",
        "load basis and compression range",
        "base slab or carrier family",
        "finish, screed, and underlay mass",
        "DeltaLw or impact curve adapter",
        "measured improvement versus predicted improvement separation"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "building_prediction",
      currentReadinessBucket: "research_only",
      id: "field_building_prediction_flanking_owner",
      noRuntimeValueMovement: true,
      rank: 3,
      reason:
        "field/building outputs still need direct/flanking, junction, room normalization, and uncertainty owners before source-absent lab values can move to R'w, DnT,w, L'n,w, or L'nT,w",
      requiredOwnerFields: [
        "junction coupling",
        "flanking path topology",
        "source and receiving room volumes",
        "partition area",
        "RT60 or equivalent absorption normalization",
        "field/building uncertainty budget"
      ],
      route: "floor",
      selected: false,
      selectedNextAction: null,
      selectedNextFile: null
    },
    {
      basis: "astm_rating_boundary",
      currentReadinessBucket: "research_only",
      id: "astm_iic_aiic_rating_owner",
      noRuntimeValueMovement: true,
      rank: 4,
      reason:
        "ASTM IIC/AIIC remains blocked because it needs a named rating procedure and one-third-octave contour owner, not an ISO Ln,w/CI alias",
      requiredOwnerFields: [
        "ASTM impact reference contour",
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
      currentReadinessBucket: "research_only",
      id: "broad_source_crawl",
      noRuntimeValueMovement: true,
      rank: 5,
      reason:
        "broad source crawling stays blocked until a bounded solver owner names exact rows, anchors, holdouts, or negative boundaries required for that lane",
      requiredOwnerFields: [
        "bounded target family",
        "source rights and provenance",
        "exact versus anchor versus holdout purpose",
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

export function buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract():
  LayerCombinationResolverPostSingleLeafMatrixRefreshContract {
  const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
  const v0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();
  const surfaceParity = buildLayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract();
  const singleLeafRow = v0.operatingEnvelopeRows.find(
    (row) => row.candidateId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
  );

  if (!singleLeafRow) {
    throw new Error("Post-single-leaf matrix refresh is missing the single-leaf operating-envelope row.");
  }

  const singleLeafClosedAsAllowedWithBudget =
    singleLeafRow.companyInternalUse === "allowed_with_budget" &&
    singleLeafRow.readinessBucket === "ready_with_budget" &&
    singleLeafRow.runtimeBasisId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;

  if (!singleLeafClosedAsAllowedWithBudget) {
    throw new Error("Post-single-leaf matrix refresh expected the single-leaf row to be ready with budget.");
  }

  return {
    blockedNextActions: v0.blockedNextActions,
    closedSingleLeafGap: {
      candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      closedGapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      currentCompanyInternalUse: "allowed_with_budget",
      currentReadinessBucket: "ready_with_budget",
      errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
      noRuntimeValueMovement: true,
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      valuePins: [
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ],
      visibleOnCandidateTrace: true
    },
    landedGate: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousSingleLeafSurfaceParity: {
      landedGate: surfaceParity.landedGate,
      selectedNextAction: surfaceParity.selectedNextAction,
      selectedNextFile: surfaceParity.selectedNextFile,
      selectionStatus: surfaceParity.selectionStatus
    },
    rankedResearchOnlyGaps: rerankPostSingleLeafResearchGaps(),
    selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS,
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      activeRuntimeCandidateCount: coverageMatrix.summary.activeRuntimeCandidateCount,
      allowedExactRowCount: v0.summary.allowedExactRowCount,
      allowedWithBudgetRowCount: v0.summary.allowedWithBudgetRowCount,
      blockedActionCount: v0.summary.blockedActionCount,
      blockedRowCount: v0.summary.blockedRowCount,
      coverageMatrixRowCount: v0.summary.coverageMatrixRowCount,
      needsUserInputRowCount: v0.summary.needsUserInputRowCount,
      readinessBucketCount: v0.summary.readinessBucketCount,
      researchOnlyGapCount: rerankPostSingleLeafResearchGaps().length,
      selectedGapId: "double_leaf_framed_wall_banded_solver_owner",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      singleLeafClosedAsAllowedWithBudget: true
    }
  };
}
