import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceAccessFollowup,
  type WallTripleLeafSourceAccessFollowupEvaluation
} from "./wall-triple-leaf-source-access-followup";

export type WallTripleLeafGateRArtifactId =
  | "band_vector_or_digitization_payload"
  | "chain_of_custody_and_rights_note"
  | "curve_identity_map"
  | "page_figure_table_locator"
  | "rating_derivation_and_uncertainty"
  | "rights_safe_source_file"
  | "source_locator_metadata";

export type WallTripleLeafGateRArtifactStatus =
  | "missing_required_artifact"
  | "required_before_runtime";

export type WallTripleLeafGateRArtifactRequirement = {
  acceptanceCriteria: readonly string[];
  id: WallTripleLeafGateRArtifactId;
  runtimeRequired: true;
  statusWhenAbsent: WallTripleLeafGateRArtifactStatus;
};

export type WallTripleLeafGateRPacketValidationStatus =
  | "blocked_no_source_packet"
  | "blocked_pending_artifact_validation";

export type WallTripleLeafGateRPacketValidation = {
  id: "uris_2006_manual_source_packet";
  missingArtifactIds: readonly WallTripleLeafGateRArtifactId[];
  packetProvidedNow: false;
  readyForDigitizationNow: false;
  readyForRuntimeNow: false;
  status: WallTripleLeafGateRPacketValidationStatus;
  targetBacklogItemId: "uris_2006_authorized_curve_packet";
};

export type WallTripleLeafManualSourcePacketEvaluation = {
  apiShapeChange: false;
  artifactRequirements: readonly WallTripleLeafGateRArtifactRequirement[];
  confidencePromotion: false;
  digitizationSelectedNow: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  landedGate: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.landedGate;
  manualPacketIntakeReadyForRuntime: false;
  missingArtifactCount: number;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  packetValidation: WallTripleLeafGateRPacketValidation;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectionStatus;
  sourceAccessFollowupEvaluation: WallTripleLeafSourceAccessFollowupEvaluation;
  sourcePacketProvidedNow: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_r_manual_source_packet_intake_contract_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_s_source_packet_availability_check_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts",
  selectionStatus:
    "gate_r_formalized_manual_source_packet_intake_no_runtime_selected_source_packet_availability_gate_s",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_R_ARTIFACT_REQUIREMENTS: readonly WallTripleLeafGateRArtifactRequirement[] = [
  {
    acceptanceCriteria: [
      "source file is rights-safe to store in the local calculator corpus",
      "source file identity can be traced back to Uris 2006 DOI 10.1016/j.apacoust.2005.11.006",
      "file or authorized TDM payload is sufficient to recover the source curves or numeric table"
    ],
    id: "rights_safe_source_file",
    runtimeRequired: true,
    statusWhenAbsent: "missing_required_artifact"
  },
  {
    acceptanceCriteria: [
      "metadata names title, authors, journal, volume, issue, pages, DOI, and PII",
      "metadata resolves to the Gate N primary locator",
      "metadata is source identity only and cannot replace curve/table data"
    ],
    id: "source_locator_metadata",
    runtimeRequired: true,
    statusWhenAbsent: "required_before_runtime"
  },
  {
    acceptanceCriteria: [
      "page, figure, or table locator identifies every curve used by the local lane",
      "locator distinguishes double-frame controls from internal-board triple-leaf variants",
      "locator is stable enough for reproducible review"
    ],
    id: "page_figure_table_locator",
    runtimeRequired: true,
    statusWhenAbsent: "missing_required_artifact"
  },
  {
    acceptanceCriteria: [
      "curve identity maps source curves to local side A, cavity 1, internal leaf, cavity 2, and side B roles",
      "curve identity blocks generic near-source promotion when roles do not match",
      "curve identity is reviewed before any local material mapping"
    ],
    id: "curve_identity_map",
    runtimeRequired: true,
    statusWhenAbsent: "missing_required_artifact"
  },
  {
    acceptanceCriteria: [
      "one-third-octave TL vectors are source-owned or reproducibly digitized from a source page image",
      "band grid matches the calculator one-third-octave bands before solver calibration",
      "digitization uncertainty is recorded before the values can enter a runtime candidate"
    ],
    id: "band_vector_or_digitization_payload",
    runtimeRequired: true,
    statusWhenAbsent: "missing_required_artifact"
  },
  {
    acceptanceCriteria: [
      "Rw/STC is reported by the source or re-derived from the same band data",
      "derivation owner records ISO 717 / ASTM E413 assumptions when applicable",
      "uncertainty owner is available before comparing against Gate G tolerance"
    ],
    id: "rating_derivation_and_uncertainty",
    runtimeRequired: true,
    statusWhenAbsent: "missing_required_artifact"
  },
  {
    acceptanceCriteria: [
      "local source packet notes where the artifact came from and when it was inspected",
      "rights and redistribution notes are kept separate from runtime evidence",
      "no copied source text or image is embedded into runtime code"
    ],
    id: "chain_of_custody_and_rights_note",
    runtimeRequired: true,
    statusWhenAbsent: "required_before_runtime"
  }
] as const;

const GATE_R_PACKET_VALIDATION: WallTripleLeafGateRPacketValidation = {
  id: "uris_2006_manual_source_packet",
  missingArtifactIds: WALL_TRIPLE_LEAF_GATE_R_ARTIFACT_REQUIREMENTS.map((requirement) => requirement.id),
  packetProvidedNow: false,
  readyForDigitizationNow: false,
  readyForRuntimeNow: false,
  status: "blocked_no_source_packet",
  targetBacklogItemId: "uris_2006_authorized_curve_packet"
} as const;

export function evaluateWallTripleLeafManualSourcePacket(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceAccessFollowupEvaluation?: WallTripleLeafSourceAccessFollowupEvaluation;
}): WallTripleLeafManualSourcePacketEvaluation {
  const sourceAccessFollowupEvaluation =
    input.sourceAccessFollowupEvaluation ??
    evaluateWallTripleLeafSourceAccessFollowup({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });

  return {
    apiShapeChange: false,
    artifactRequirements: WALL_TRIPLE_LEAF_GATE_R_ARTIFACT_REQUIREMENTS,
    confidencePromotion: false,
    digitizationSelectedNow: false,
    evidencePromotion: false,
    failClosedStrategy: sourceAccessFollowupEvaluation.failClosedStrategy,
    landedGate: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.landedGate,
    manualPacketIntakeReadyForRuntime: false,
    missingArtifactCount: GATE_R_PACKET_VALIDATION.missingArtifactIds.length,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    packetValidation: GATE_R_PACKET_VALIDATION,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectionStatus,
    sourceAccessFollowupEvaluation,
    sourcePacketProvidedNow: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
