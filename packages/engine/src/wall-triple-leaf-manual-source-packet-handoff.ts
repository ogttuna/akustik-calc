import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourcePacketAvailability,
  type WallTripleLeafSourcePacketAvailabilityEvaluation
} from "./wall-triple-leaf-source-packet-availability";

export type WallTripleLeafGateTAcquisitionChecklistId =
  | "authorized_source_file_or_tdm_payload"
  | "band_vector_or_digitization_payload"
  | "chain_of_custody_review"
  | "curve_identity_map"
  | "page_figure_table_locator"
  | "rating_derivation_and_uncertainty"
  | "rights_and_storage_note"
  | "source_identity_metadata";

export type WallTripleLeafGateTAcquisitionStatus =
  | "manual_external_dependency_required"
  | "required_before_digitization"
  | "required_before_runtime";

export type WallTripleLeafGateTAcquisitionChecklistItem = {
  acceptanceCriteria: readonly string[];
  id: WallTripleLeafGateTAcquisitionChecklistId;
  owner: "manual_source_packet_acquisition";
  status: WallTripleLeafGateTAcquisitionStatus;
};

export type WallTripleLeafGateTSourceLaneDisposition =
  | "paused_waiting_rights_safe_source_packet";

export type WallTripleLeafManualSourcePacketHandoffEvaluation = {
  acquisitionChecklist: readonly WallTripleLeafGateTAcquisitionChecklistItem[];
  apiShapeChange: false;
  confidencePromotion: false;
  digitizationSelectedNow: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  landedGate: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.landedGate;
  manualAcquisitionRequired: true;
  manualPacketHandoffReadyForRuntime: false;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  reRankRecommendedNow: true;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectionStatus;
  sourceLaneDisposition: WallTripleLeafGateTSourceLaneDisposition;
  sourcePacketAvailabilityEvaluation: WallTripleLeafSourcePacketAvailabilityEvaluation;
  sourcePacketProvidedNow: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_t_manual_source_packet_acquisition_handoff_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "calculator_source_gap_revalidation_v8_no_runtime",
  selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts",
  selectionStatus:
    "gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_T_ACQUISITION_CHECKLIST: readonly WallTripleLeafGateTAcquisitionChecklistItem[] = [
  {
    acceptanceCriteria: [
      "store a rights-safe Uris 2006 PDF, page image, numeric table, or authorized TDM output in the local source corpus",
      "artifact identity must trace to DOI 10.1016/j.apacoust.2005.11.006 or PII S0003682X05001799",
      "metadata or public summaries alone do not satisfy this item"
    ],
    id: "authorized_source_file_or_tdm_payload",
    owner: "manual_source_packet_acquisition",
    status: "manual_external_dependency_required"
  },
  {
    acceptanceCriteria: [
      "record whether the artifact may be stored locally and used for internal calculator evidence",
      "keep redistribution notes separate from runtime evidence",
      "do not embed copied source text or source images into runtime code"
    ],
    id: "rights_and_storage_note",
    owner: "manual_source_packet_acquisition",
    status: "manual_external_dependency_required"
  },
  {
    acceptanceCriteria: [
      "capture title, authors, journal, volume, issue, pages, DOI, and PII",
      "link metadata to the Gate N primary locator",
      "mark metadata as identity context only until source curves or page images are present"
    ],
    id: "source_identity_metadata",
    owner: "manual_source_packet_acquisition",
    status: "required_before_digitization"
  },
  {
    acceptanceCriteria: [
      "identify page, figure, or table locations for every curve used by the local two-cavity lane",
      "distinguish double-frame controls from internal-board triple-leaf variants",
      "provide stable locators for later digitization review"
    ],
    id: "page_figure_table_locator",
    owner: "manual_source_packet_acquisition",
    status: "required_before_digitization"
  },
  {
    acceptanceCriteria: [
      "map each source curve to side A, cavity 1, internal leaf, cavity 2, and side B roles",
      "document which curves are controls and which are internal-board variants",
      "block generic near-source promotion when curve roles do not match"
    ],
    id: "curve_identity_map",
    owner: "manual_source_packet_acquisition",
    status: "required_before_digitization"
  },
  {
    acceptanceCriteria: [
      "provide source-owned one-third-octave TL vectors or enough page-image evidence for reproducible digitization",
      "confirm the band grid before any Gate G tolerance comparison",
      "record digitization uncertainty before runtime candidate scoring"
    ],
    id: "band_vector_or_digitization_payload",
    owner: "manual_source_packet_acquisition",
    status: "required_before_runtime"
  },
  {
    acceptanceCriteria: [
      "report or re-derive Rw/STC from the same band data",
      "record ISO 717 or ASTM E413 assumptions when used",
      "name the uncertainty owner before comparing against calibration tolerance"
    ],
    id: "rating_derivation_and_uncertainty",
    owner: "manual_source_packet_acquisition",
    status: "required_before_runtime"
  },
  {
    acceptanceCriteria: [
      "record who supplied or inspected the packet and when",
      "keep review notes linked to the local artifact path",
      "do not reopen runtime until source-packet, mapping, topology, and paired visible tests all pass"
    ],
    id: "chain_of_custody_review",
    owner: "manual_source_packet_acquisition",
    status: "manual_external_dependency_required"
  }
] as const;

export function evaluateWallTripleLeafManualSourcePacketHandoff(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourcePacketAvailabilityEvaluation?: WallTripleLeafSourcePacketAvailabilityEvaluation;
}): WallTripleLeafManualSourcePacketHandoffEvaluation {
  const sourcePacketAvailabilityEvaluation =
    input.sourcePacketAvailabilityEvaluation ??
    evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });

  return {
    acquisitionChecklist: WALL_TRIPLE_LEAF_GATE_T_ACQUISITION_CHECKLIST,
    apiShapeChange: false,
    confidencePromotion: false,
    digitizationSelectedNow: false,
    evidencePromotion: false,
    failClosedStrategy: sourcePacketAvailabilityEvaluation.failClosedStrategy,
    landedGate: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.landedGate,
    manualAcquisitionRequired: true,
    manualPacketHandoffReadyForRuntime: false,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    reRankRecommendedNow: true,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectionStatus,
    sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
    sourcePacketAvailabilityEvaluation,
    sourcePacketProvidedNow: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
