import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceLocatorProvenance,
  type WallTripleLeafSourceLocatorProvenanceEvaluation
} from "./wall-triple-leaf-source-locator-provenance";

export type WallTripleLeafGatePAccessPathId =
  | "authorized_elsevier_full_text_or_tdm"
  | "manual_author_or_library_source_packet"
  | "local_pdf_or_page_image_upload"
  | "public_summary_and_metadata_recheck";

export type WallTripleLeafGatePAccessPathStatus =
  | "blocked_metadata_or_summary_only"
  | "blocked_requires_authorized_access"
  | "blocked_requires_local_source_packet";

export type WallTripleLeafGatePAccessPath = {
  acquisitionStatus: WallTripleLeafGatePAccessPathStatus;
  checkedOn: "2026-05-01";
  fullOneThirdOctaveCurvesAvailableNow: false;
  id: WallTripleLeafGatePAccessPathId;
  pageImageOrPlotBoxAvailableNow: false;
  rationale: string;
  requiredNextStep: string;
  runtimeImportReadyNow: false;
  sourceUrl: string;
  targetLocatorId: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame";
};

export type WallTripleLeafGatePAlternativeRowId =
  | "brekke_1981_calculation_methods_context"
  | "nrc_2024_internal_board_glass_fiber_comparator_only"
  | "quirt_1983_triple_glazing_rejected"
  | "tadeu_2001_triple_glazing_rejected"
  | "uris_2008_perforated_absorptive_facing_accessible_adjacent"
  | "utley_1968_double_and_triple_walls_context"
  | "vinokur_1990_low_frequency_triple_partitions_context";

export type WallTripleLeafGatePAlternativeRowUse =
  | "accessible_adjacent_negative_boundary"
  | "existing_comparator_not_alternative_runtime_row"
  | "glazing_rejected"
  | "method_or_physics_context_only";

export type WallTripleLeafGatePAlternativeMeasuredRow = {
  accessiblePublicPageOrPdfNow: boolean;
  candidateRuntimeReadyNow: false;
  has50MmClassMineralWoolCavity: boolean;
  hasInternalBoardLeafContext: boolean;
  hasPerforatedFacingOrNonLocalTopology: boolean;
  hasSourceOwnedNumericBandVectorsNow: boolean;
  id: WallTripleLeafGatePAlternativeRowId;
  missingForRuntime: readonly string[];
  reportedMetricContext: readonly string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceUse: WallTripleLeafGatePAlternativeRowUse;
  topologyContext: readonly string[];
};

export type WallTripleLeafGatePBlockerId =
  | "accessible_alternative_has_perforated_facing_topology"
  | "alternative_rows_are_context_or_glazing_only"
  | "missing_local_material_support_mapping"
  | "missing_paired_visible_runtime_tests"
  | "missing_source_owned_numeric_curves_or_table"
  | "missing_uris_2006_authorized_pdf_or_page_image"
  | "near_source_promotion_rejected";

export type WallTripleLeafGatePBlocker = {
  id: WallTripleLeafGatePBlockerId;
  reason: string;
};

export type WallTripleLeafSourceAccessEvaluation = {
  accessPaths: readonly WallTripleLeafGatePAccessPath[];
  accessibleAdjacentAlternativeCount: number;
  alternativeMeasuredRows: readonly WallTripleLeafGatePAlternativeMeasuredRow[];
  apiShapeChange: false;
  confidencePromotion: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  landedGate: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.landedGate;
  missingForRuntime: readonly WallTripleLeafGatePBlocker[];
  noRuntimeAlternativeCandidateCount: number;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  primaryLocatorAccessStillBlocked: true;
  proposalReportCopyChange: false;
  provenanceEvaluation: WallTripleLeafSourceLocatorProvenanceEvaluation;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectionStatus;
  sourceAccessBacklogReadyForManualWork: true;
  sourceAccessReadyForRuntime: false;
  sourceOwnedNumericCurvePackCount: 0;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_p_source_access_or_alternative_measured_row_acquisition_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_q_source_access_backlog_and_runtime_blocker_revalidation_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts",
  selectionStatus:
    "gate_p_found_no_runtime_ready_access_or_equivalent_measured_row_no_runtime_selected_source_access_followup_gate_q",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_P_ACCESS_PATHS: readonly WallTripleLeafGatePAccessPath[] = [
  {
    acquisitionStatus: "blocked_requires_authorized_access",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "authorized_elsevier_full_text_or_tdm",
    pageImageOrPlotBoxAvailableNow: false,
    rationale:
      "The Uris 2006 Crossref record exposes Elsevier TDM links, but the current local session has no authorized full-text or source-owned band vectors.",
    requiredNextStep:
      "Acquire authorized full text/TDM output or a rights-safe source packet containing the Uris 2006 figures, tables, or one-third-octave vectors.",
    runtimeImportReadyNow: false,
    sourceUrl: "https://api.crossref.org/works/10.1016%2Fj.apacoust.2005.11.006",
    targetLocatorId: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
  },
  {
    acquisitionStatus: "blocked_requires_local_source_packet",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "manual_author_or_library_source_packet",
    pageImageOrPlotBoxAvailableNow: false,
    rationale:
      "Author, library, or institutional access can close the source gap, but no inspected local packet currently owns the Uris 2006 curve images or numeric table.",
    requiredNextStep:
      "Store a traceable local source packet with page, figure/table, extraction method, and curve identity before digitization or runtime mapping.",
    runtimeImportReadyNow: false,
    sourceUrl: "https://doi.org/10.1016/j.apacoust.2005.11.006",
    targetLocatorId: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
  },
  {
    acquisitionStatus: "blocked_requires_local_source_packet",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "local_pdf_or_page_image_upload",
    pageImageOrPlotBoxAvailableNow: false,
    rationale:
      "The runtime path needs a reproducible local PDF/page image to lock axes and curve identity; the current corpus does not contain it.",
    requiredNextStep:
      "Add a local source artifact and rerun provenance QC before graph digitization or numeric promotion.",
    runtimeImportReadyNow: false,
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    targetLocatorId: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
  },
  {
    acquisitionStatus: "blocked_metadata_or_summary_only",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "public_summary_and_metadata_recheck",
    pageImageOrPlotBoxAvailableNow: false,
    rationale:
      "Public article summaries and DOI metadata verify identity and qualitative behavior, but they do not expose source-owned one-third-octave TL vectors.",
    requiredNextStep:
      "Keep the public-summary path as identity evidence only; do not use it as a numeric runtime source.",
    runtimeImportReadyNow: false,
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    targetLocatorId: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
  }
] as const;

export const WALL_TRIPLE_LEAF_GATE_P_ALTERNATIVE_MEASURED_ROWS: readonly WallTripleLeafGatePAlternativeMeasuredRow[] = [
  {
    accessiblePublicPageOrPdfNow: true,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: true,
    hasInternalBoardLeafContext: true,
    hasPerforatedFacingOrNonLocalTopology: true,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "uris_2008_perforated_absorptive_facing_accessible_adjacent",
    missingForRuntime: [
      "perforated gypsum board / absorptive-facing topology is not the local internal gypsum-board defect topology",
      "the accessible plot images are not source-owned numeric one-third-octave vectors yet",
      "perforation ratio and Helmholtz-facing behavior need a separate lane before reuse"
    ],
    reportedMetricContext: [
      "Acta Acustica 94(2), 321-325, DOI 10.3813/AAA.918035",
      "reported Rw table spans the inspected perforated-facing partition variants",
      "the source records 50 mm mineral wool with density and flow-resistivity context"
    ],
    sourceLabel: "Uris 2008 perforated absorptive-facing partition",
    sourceUrl: "https://dael.euracoustics.org/landing_pages/aaua/64624.html",
    sourceUse: "accessible_adjacent_negative_boundary",
    topologyContext: [
      "50 x 50 mm steel frames with 50 mm mineral wool",
      "100 mm frame separation appears in the source partition descriptions",
      "perforated gypsum board absorptive facing changes the acoustic mechanism and material role"
    ]
  },
  {
    accessiblePublicPageOrPdfNow: false,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: false,
    hasPerforatedFacingOrNonLocalTopology: false,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "utley_1968_double_and_triple_walls_context",
    missingForRuntime: [
      "not a local 50 mm mineral-wool internal-board row in the current corpus",
      "no inspected source-owned numeric band vectors",
      "older method/physics context cannot replace the Uris 2006 measured source row"
    ],
    reportedMetricContext: ["Applied Acoustics 1, 15-20, DOI 10.1016/0003-682X(68)90004-2"],
    sourceLabel: "Utley and Mulholland 1968 double/triple wall context",
    sourceUrl: "https://www.sciencedirect.com/science/article/abs/pii/0003682X68900042",
    sourceUse: "method_or_physics_context_only",
    topologyContext: ["double and triple wall transmission-loss context", "not mapped to local rockwool layer roles"]
  },
  {
    accessiblePublicPageOrPdfNow: false,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: false,
    hasPerforatedFacingOrNonLocalTopology: false,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "brekke_1981_calculation_methods_context",
    missingForRuntime: [
      "calculation-method context only",
      "no exact measured local mineral-wool/internal-board row",
      "no inspected source-owned numeric curve pack"
    ],
    reportedMetricContext: ["Applied Acoustics 14, 225, DOI 10.1016/0003-682X(81)90034-7"],
    sourceLabel: "Brekke 1981 single/double/triple partition calculation methods",
    sourceUrl: "https://doi.org/10.1016/0003-682X(81)90034-7",
    sourceUse: "method_or_physics_context_only",
    topologyContext: ["single, double, and triple partition calculation context"]
  },
  {
    accessiblePublicPageOrPdfNow: false,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: false,
    hasPerforatedFacingOrNonLocalTopology: false,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "vinokur_1990_low_frequency_triple_partitions_context",
    missingForRuntime: [
      "low-frequency physics context only",
      "no local board/mineral-wool/support mapping",
      "no inspected numeric one-third-octave source row"
    ],
    reportedMetricContext: ["Applied Acoustics 29, 15-24, DOI 10.1016/0003-682X(90)90068-6"],
    sourceLabel: "Vinokur 1990 low-frequency triple partitions",
    sourceUrl: "https://doi.org/10.1016/0003-682X(90)90068-6",
    sourceUse: "method_or_physics_context_only",
    topologyContext: ["low-frequency triple-partition transmission-loss context"]
  },
  {
    accessiblePublicPageOrPdfNow: false,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: false,
    hasPerforatedFacingOrNonLocalTopology: true,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "quirt_1983_triple_glazing_rejected",
    missingForRuntime: [
      "triple glazing is not a gypsum-board/mineral-wool wall",
      "glazing cavity behavior must not be merged into framed wall runtime"
    ],
    reportedMetricContext: ["JASA 74(2), DOI 10.1121/1.389819"],
    sourceLabel: "Quirt 1983 double and triple glazing",
    sourceUrl: "https://doi.org/10.1121/1.389819",
    sourceUse: "glazing_rejected",
    topologyContext: ["double/triple glazing", "non-wall material and support behavior"]
  },
  {
    accessiblePublicPageOrPdfNow: false,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: false,
    hasPerforatedFacingOrNonLocalTopology: true,
    hasSourceOwnedNumericBandVectorsNow: false,
    id: "tadeu_2001_triple_glazing_rejected",
    missingForRuntime: [
      "triple glazing is not the local gypsum-board/mineral-wool wall lane",
      "experimental glazing rows cannot own rockwool/internal-board wall tolerance"
    ],
    reportedMetricContext: ["Applied Acoustics 62, 307, DOI 10.1016/S0003-682X(00)00032-3"],
    sourceLabel: "Tadeu 2001 single/double/triple glazing",
    sourceUrl: "https://doi.org/10.1016/S0003-682X(00)00032-3",
    sourceUse: "glazing_rejected",
    topologyContext: ["single, double, and triple glazing experimental context"]
  },
  {
    accessiblePublicPageOrPdfNow: true,
    candidateRuntimeReadyNow: false,
    has50MmClassMineralWoolCavity: false,
    hasInternalBoardLeafContext: true,
    hasPerforatedFacingOrNonLocalTopology: false,
    hasSourceOwnedNumericBandVectorsNow: true,
    id: "nrc_2024_internal_board_glass_fiber_comparator_only",
    missingForRuntime: [
      "glass-fiber batt and 92.1 mm cavity family is already a comparator, not a local rockwool/50 mm row",
      "local rockwool equivalence and cavity substitution tolerance remain unowned",
      "Gate P must not turn a comparator into the missing direct source row"
    ],
    reportedMetricContext: [
      "Gate G2B/G3 already digitized and calibrated this NRC-like source family",
      "usable as negative-boundary and calibration context only for the local rockwool lane"
    ],
    sourceLabel: "NRC 2024 internal-board double-stud comparator",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2",
    sourceUse: "existing_comparator_not_alternative_runtime_row",
    topologyContext: ["92.1 mm glass-fiber batt cavities", "Type C gypsum board internal-board comparator family"]
  }
] as const;

export const WALL_TRIPLE_LEAF_GATE_P_RUNTIME_BLOCKERS: readonly WallTripleLeafGatePBlocker[] = [
  {
    id: "missing_source_owned_numeric_curves_or_table",
    reason: "No Uris 2006 source-owned one-third-octave curves or direct numeric table are available in the current corpus."
  },
  {
    id: "missing_uris_2006_authorized_pdf_or_page_image",
    reason: "The primary locator still needs an authorized PDF/page image or equivalent source packet for plot-axis and curve-identity QC."
  },
  {
    id: "accessible_alternative_has_perforated_facing_topology",
    reason:
      "Uris 2008 is accessible and measured, but the perforated absorptive-facing topology is not the same as the local internal-board defect lane."
  },
  {
    id: "alternative_rows_are_context_or_glazing_only",
    reason:
      "The remaining alternative papers are method/physics context or glazing rows, not local gypsum-board/mineral-wool wall source rows."
  },
  {
    id: "near_source_promotion_rejected",
    reason: "Gate P rejects using close-looking source pages as runtime rows without exact topology, band data, and tolerance ownership."
  },
  {
    id: "missing_local_material_support_mapping",
    reason: "Local rockwool, gypsum board, MLV, gypsum plaster, and support details remain unmapped to a source-owned runtime row."
  },
  {
    id: "missing_paired_visible_runtime_tests",
    reason: "No paired engine/web visible runtime tests can be added until a source row and mapping/tolerance owner exist."
  }
] as const;

export function evaluateWallTripleLeafSourceAccess(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  provenanceEvaluation?: WallTripleLeafSourceLocatorProvenanceEvaluation;
}): WallTripleLeafSourceAccessEvaluation {
  const provenanceEvaluation =
    input.provenanceEvaluation ??
    evaluateWallTripleLeafSourceLocatorProvenance({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });

  return {
    accessPaths: WALL_TRIPLE_LEAF_GATE_P_ACCESS_PATHS,
    accessibleAdjacentAlternativeCount: WALL_TRIPLE_LEAF_GATE_P_ALTERNATIVE_MEASURED_ROWS.filter(
      (candidate) => candidate.sourceUse === "accessible_adjacent_negative_boundary"
    ).length,
    alternativeMeasuredRows: WALL_TRIPLE_LEAF_GATE_P_ALTERNATIVE_MEASURED_ROWS,
    apiShapeChange: false,
    confidencePromotion: false,
    evidencePromotion: false,
    failClosedStrategy: provenanceEvaluation.failClosedStrategy,
    landedGate: WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.landedGate,
    missingForRuntime: WALL_TRIPLE_LEAF_GATE_P_RUNTIME_BLOCKERS,
    noRuntimeAlternativeCandidateCount: WALL_TRIPLE_LEAF_GATE_P_ALTERNATIVE_MEASURED_ROWS.length,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    primaryLocatorAccessStillBlocked: true,
    proposalReportCopyChange: false,
    provenanceEvaluation,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectionStatus,
    sourceAccessBacklogReadyForManualWork: true,
    sourceAccessReadyForRuntime: false,
    sourceOwnedNumericCurvePackCount: 0,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
