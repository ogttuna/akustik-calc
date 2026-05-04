import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafManualSourcePacket,
  type WallTripleLeafGateRArtifactId,
  type WallTripleLeafManualSourcePacketEvaluation
} from "./wall-triple-leaf-manual-source-packet";

export type WallTripleLeafGateSBlockedReasonId =
  | "adjacent_nrc_packet_not_primary_uris_2006_packet"
  | "local_user_repro_pdfs_not_source_evidence"
  | "metadata_only_not_rights_safe_packet"
  | "no_source_owned_band_vectors"
  | "no_uris_2006_page_image_or_pdf"
  | "rights_safe_packet_absent"
  | "unrelated_local_pdfs_not_source_packet";

export type WallTripleLeafGateSAvailabilityItemId =
  | "docs_and_engine_typed_uris_2006_metadata"
  | "expected_uris_2006_manual_packet_path"
  | "root_miscellaneous_pdf_artifacts"
  | "root_user_repro_pdf_artifacts"
  | "tmp_nrc_2024_graph_digitization_packet";

export type WallTripleLeafGateSAvailabilityStatus =
  | "absent_expected_packet_path"
  | "adjacent_source_packet_not_primary_locator"
  | "metadata_only_not_packet_artifact"
  | "unrelated_pdf_artifacts_not_source_packet"
  | "user_repro_pdfs_not_source_evidence";

export type WallTripleLeafGateSAvailabilityItem = {
  id: WallTripleLeafGateSAvailabilityItemId;
  inspectedPath: string;
  packetArtifactIdsSatisfied: readonly WallTripleLeafGateRArtifactId[];
  rationale: string;
  status: WallTripleLeafGateSAvailabilityStatus;
  runtimeUsable: false;
};

export type WallTripleLeafSourcePacketAvailabilityEvaluation = {
  apiShapeChange: false;
  availabilityItems: readonly WallTripleLeafGateSAvailabilityItem[];
  blockedReasonIds: readonly WallTripleLeafGateSBlockedReasonId[];
  confidencePromotion: false;
  digitizationSelectedNow: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  landedGate: typeof WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.landedGate;
  manualSourcePacketEvaluation: WallTripleLeafManualSourcePacketEvaluation;
  missingArtifactIds: readonly WallTripleLeafGateRArtifactId[];
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  rightsSafePacketAvailableNow: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectionStatus;
  sourceOwnedBandVectorAvailableNow: false;
  sourcePacketAvailabilityReadyForDigitization: false;
  sourcePacketAvailabilityReadyForRuntime: false;
  sourcePacketCandidateCount: number;
  sourcePacketProvidedNow: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_s_source_packet_availability_check_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_t_manual_source_packet_acquisition_handoff_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
  selectionStatus:
    "gate_s_confirmed_no_rights_safe_uris_2006_packet_no_runtime_selected_manual_source_packet_handoff_gate_t",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_S_AVAILABILITY_ITEMS: readonly WallTripleLeafGateSAvailabilityItem[] = [
  {
    id: "expected_uris_2006_manual_packet_path",
    inspectedPath: "source-packets/uris-2006/ or equivalent rights-safe local corpus packet",
    packetArtifactIdsSatisfied: [],
    rationale:
      "Gate S found no rights-safe local Uris 2006 PDF, page image, authorized TDM payload, numeric table, or curve packet to validate.",
    runtimeUsable: false,
    status: "absent_expected_packet_path"
  },
  {
    id: "docs_and_engine_typed_uris_2006_metadata",
    inspectedPath:
      "docs/calculator/*Gate N/O/P/Q/R* and packages/engine/src/wall-triple-leaf-source-locator-*",
    packetArtifactIdsSatisfied: [],
    rationale:
      "The repo owns locator metadata and no-runtime decisions, but metadata alone is not a rights-safe source packet and cannot satisfy the Gate R artifact contract.",
    runtimeUsable: false,
    status: "metadata_only_not_packet_artifact"
  },
  {
    id: "tmp_nrc_2024_graph_digitization_packet",
    inspectedPath: "tmp/pdfs/nrc-2024-triple-leaf.pdf and rendered page images",
    packetArtifactIdsSatisfied: [],
    rationale:
      "The NRC 2024 packet remains an adjacent graph-digitized comparator with glass-fiber / 92.1 mm cavity context, not the primary Uris 2006 50 mm mineral-wool internal-board packet.",
    runtimeUsable: false,
    status: "adjacent_source_packet_not_primary_locator"
  },
  {
    id: "root_user_repro_pdf_artifacts",
    inspectedPath: "root user repro PDFs: dogru-gibi and muhtemelen_yanlis",
    packetArtifactIdsSatisfied: [],
    rationale:
      "The user repro PDFs are valuable defect inputs but do not contain source-owned Uris 2006 curves, page locators, rights notes, or rating derivation.",
    runtimeUsable: false,
    status: "user_repro_pdfs_not_source_evidence"
  },
  {
    id: "root_miscellaneous_pdf_artifacts",
    inspectedPath: "VSP-20260430-0001.pdf and purchase-orders-batch.pdf",
    packetArtifactIdsSatisfied: [],
    rationale:
      "Miscellaneous local PDFs are not Uris 2006 source packets and must not be treated as acoustic curve evidence.",
    runtimeUsable: false,
    status: "unrelated_pdf_artifacts_not_source_packet"
  }
] as const;

export const WALL_TRIPLE_LEAF_GATE_S_BLOCKED_REASONS: readonly WallTripleLeafGateSBlockedReasonId[] = [
  "rights_safe_packet_absent",
  "no_uris_2006_page_image_or_pdf",
  "no_source_owned_band_vectors",
  "metadata_only_not_rights_safe_packet",
  "adjacent_nrc_packet_not_primary_uris_2006_packet",
  "local_user_repro_pdfs_not_source_evidence",
  "unrelated_local_pdfs_not_source_packet"
] as const;

export function evaluateWallTripleLeafSourcePacketAvailability(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  manualSourcePacketEvaluation?: WallTripleLeafManualSourcePacketEvaluation;
}): WallTripleLeafSourcePacketAvailabilityEvaluation {
  const manualSourcePacketEvaluation =
    input.manualSourcePacketEvaluation ??
    evaluateWallTripleLeafManualSourcePacket({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });

  return {
    apiShapeChange: false,
    availabilityItems: WALL_TRIPLE_LEAF_GATE_S_AVAILABILITY_ITEMS,
    blockedReasonIds: WALL_TRIPLE_LEAF_GATE_S_BLOCKED_REASONS,
    confidencePromotion: false,
    digitizationSelectedNow: false,
    evidencePromotion: false,
    failClosedStrategy: manualSourcePacketEvaluation.failClosedStrategy,
    landedGate: WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.landedGate,
    manualSourcePacketEvaluation,
    missingArtifactIds: manualSourcePacketEvaluation.packetValidation.missingArtifactIds,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    rightsSafePacketAvailableNow: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectionStatus,
    sourceOwnedBandVectorAvailableNow: false,
    sourcePacketAvailabilityReadyForDigitization: false,
    sourcePacketAvailabilityReadyForRuntime: false,
    sourcePacketCandidateCount: WALL_TRIPLE_LEAF_GATE_S_AVAILABILITY_ITEMS.length,
    sourcePacketProvidedNow: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
