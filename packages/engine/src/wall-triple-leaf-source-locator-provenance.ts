import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceLocatorIntake,
  type WallTripleLeafSourceLocatorCandidate,
  type WallTripleLeafSourceLocatorIntakeEvaluation
} from "./wall-triple-leaf-source-locator-intake";

export type WallTripleLeafGateOAccessCheckId =
  | "crossref_doi_metadata_and_elsevier_tdm_links"
  | "doi_linkinghub_redirect"
  | "sciencedirect_article_page_public_summary"
  | "sciencedirect_pdf_route_local_http_403";

export type WallTripleLeafGateOAccessStatus =
  | "blocked_by_local_http_403"
  | "metadata_only_no_band_vectors"
  | "partial_article_summary_no_numeric_band_vectors"
  | "redirects_to_sciencedirect_article";

export type WallTripleLeafGateOAccessCheck = {
  accessStatus: WallTripleLeafGateOAccessStatus;
  checkedOn: "2026-05-01";
  fullOneThirdOctaveCurvesAvailableNow: false;
  id: WallTripleLeafGateOAccessCheckId;
  locator: string;
  observedEvidence: readonly string[];
  pageImageOrPlotBoxAvailableNow: false;
  sourceUrl: string;
};

export type WallTripleLeafGateOProvenanceBlockerId =
  | "fixed_weighted_index_penalty_not_curve"
  | "missing_axis_lock"
  | "missing_curve_identity"
  | "missing_full_band_vectors"
  | "missing_local_material_mapping"
  | "missing_page_image_or_pdf"
  | "missing_rw_stc_derivation_owner";

export type WallTripleLeafGateOProvenanceBlocker = {
  id: WallTripleLeafGateOProvenanceBlockerId;
  reason: string;
};

export type WallTripleLeafSourceLocatorProvenanceEvaluation = {
  accessChecks: readonly WallTripleLeafGateOAccessCheck[];
  apiShapeChange: false;
  confidencePromotion: false;
  digitizationReadyNow: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  fixedPenaltyRuntimePromotionRejected: true;
  fullBandCurveReadyForDigitizationCount: 0;
  landedGate: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.landedGate;
  locatorIntakeEvaluation: WallTripleLeafSourceLocatorIntakeEvaluation;
  missingForRuntime: readonly WallTripleLeafGateOProvenanceBlocker[];
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  primaryLocator: WallTripleLeafSourceLocatorCandidate;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectionStatus;
  sourceAccessReadyForRuntime: false;
  supportPromotion: false;
  verifiedMetadataCheckCount: number;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_o_full_curve_retrieval_and_provenance_qc_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_p_source_access_or_alternative_measured_row_acquisition_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts",
  selectionStatus:
    "gate_o_verified_uris_locator_but_full_curves_not_runtime_ready_no_runtime_selected_source_access_gate_p",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_O_ACCESS_CHECKS: readonly WallTripleLeafGateOAccessCheck[] = [
  {
    accessStatus: "partial_article_summary_no_numeric_band_vectors",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "sciencedirect_article_page_public_summary",
    locator: "ScienceDirect article landing page for PII S0003682X05001799",
    observedEvidence: [
      "abstract and test-specimen text are visible through public article metadata/search surfaces",
      "the page names measured sound reduction data and the 7-8 dB weighted-index decrease",
      "figure narratives are visible, but no source-owned numeric band table is available in the local corpus"
    ],
    pageImageOrPlotBoxAvailableNow: false,
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799"
  },
  {
    accessStatus: "redirects_to_sciencedirect_article",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "doi_linkinghub_redirect",
    locator: "DOI and LinkingHub redirect for 10.1016/j.apacoust.2005.11.006",
    observedEvidence: [
      "DOI resolves to Elsevier LinkingHub and the ScienceDirect article",
      "the redirect confirms the PII and article identity",
      "the redirect does not provide page images, plot boxes, or one-third-octave band vectors"
    ],
    pageImageOrPlotBoxAvailableNow: false,
    sourceUrl: "https://doi.org/10.1016/j.apacoust.2005.11.006"
  },
  {
    accessStatus: "metadata_only_no_band_vectors",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "crossref_doi_metadata_and_elsevier_tdm_links",
    locator: "Crossref DOI metadata plus Elsevier TDM links",
    observedEvidence: [
      "Crossref confirms title, journal, volume, issue, pages, DOI, PII, authors, and Elsevier TDM link targets",
      "the metadata links are not one-third-octave TL curves",
      "authorized Elsevier full-text/TDM access is still needed before digitization can be source-owned"
    ],
    pageImageOrPlotBoxAvailableNow: false,
    sourceUrl: "https://api.crossref.org/works/10.1016%2Fj.apacoust.2005.11.006"
  },
  {
    accessStatus: "blocked_by_local_http_403",
    checkedOn: "2026-05-01",
    fullOneThirdOctaveCurvesAvailableNow: false,
    id: "sciencedirect_pdf_route_local_http_403",
    locator: "local curl HEAD against ScienceDirect article/PDF routes",
    observedEvidence: [
      "local unauthenticated article route returned HTTP 403",
      "local unauthenticated PDF route returned HTTP 403",
      "there is no local source PDF/page image to lock axes or digitize curves from"
    ],
    pageImageOrPlotBoxAvailableNow: false,
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799/pdfft"
  }
] as const;

export const WALL_TRIPLE_LEAF_GATE_O_PROVENANCE_BLOCKERS: readonly WallTripleLeafGateOProvenanceBlocker[] = [
  {
    id: "missing_full_band_vectors",
    reason: "No source-owned one-third-octave TL vectors are available for the Uris 2006 specimens."
  },
  {
    id: "missing_page_image_or_pdf",
    reason: "No local source PDF/page image exists for reproducible plot extraction."
  },
  {
    id: "missing_axis_lock",
    reason: "Without a page image, Gate O cannot lock plot boxes, x-axis bands, or y-axis dB bounds."
  },
  {
    id: "missing_curve_identity",
    reason: "The specific plotted curves for each DF/SF specimen cannot be tied to local band vectors."
  },
  {
    id: "missing_rw_stc_derivation_owner",
    reason: "Rw/STC cannot be derived or cross-checked from missing band data."
  },
  {
    id: "fixed_weighted_index_penalty_not_curve",
    reason: "The reported 7-8 dB weighted-index decrease is a source observation, not a reusable runtime penalty."
  },
  {
    id: "missing_local_material_mapping",
    reason: "Local rockwool, gypsum board, MLV, gypsum plaster, and support topology mapping remain unowned."
  }
] as const;

export function evaluateWallTripleLeafSourceLocatorProvenance(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  locatorIntakeEvaluation?: WallTripleLeafSourceLocatorIntakeEvaluation;
}): WallTripleLeafSourceLocatorProvenanceEvaluation {
  const locatorIntakeEvaluation =
    input.locatorIntakeEvaluation ??
    evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const verifiedMetadataCheckCount = WALL_TRIPLE_LEAF_GATE_O_ACCESS_CHECKS.filter(
    (check) => check.accessStatus !== "blocked_by_local_http_403"
  ).length;

  return {
    accessChecks: WALL_TRIPLE_LEAF_GATE_O_ACCESS_CHECKS,
    apiShapeChange: false,
    confidencePromotion: false,
    digitizationReadyNow: false,
    evidencePromotion: false,
    failClosedStrategy: locatorIntakeEvaluation.failClosedStrategy,
    fixedPenaltyRuntimePromotionRejected: true,
    fullBandCurveReadyForDigitizationCount: 0,
    landedGate: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.landedGate,
    locatorIntakeEvaluation,
    missingForRuntime: WALL_TRIPLE_LEAF_GATE_O_PROVENANCE_BLOCKERS,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    primaryLocator: locatorIntakeEvaluation.selectedPrimaryLocator,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_PROVENANCE_GATE_O.selectionStatus,
    sourceAccessReadyForRuntime: false,
    supportPromotion: false,
    verifiedMetadataCheckCount,
    workbenchInputBehaviorChange: false
  };
}
