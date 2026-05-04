import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceAccess,
  type WallTripleLeafGatePBlockerId,
  type WallTripleLeafSourceAccessEvaluation
} from "./wall-triple-leaf-source-access";

export type WallTripleLeafGateQBacklogItemId =
  | "local_material_and_effect_mapping_packet"
  | "paired_visible_runtime_acceptance_packet"
  | "support_topology_mapping_packet"
  | "uris_2006_authorized_curve_packet"
  | "uris_2006_digitization_qc_packet"
  | "uris_2008_perforated_facing_separate_lane";

export type WallTripleLeafGateQBacklogKind =
  | "digitization_qc"
  | "local_mapping_tolerance"
  | "paired_runtime_tests"
  | "separate_negative_boundary_lane"
  | "source_access_packet"
  | "support_topology_owner";

export type WallTripleLeafGateQBacklogStatus =
  | "blocked_waiting_source_packet"
  | "manual_source_packet_required"
  | "negative_boundary_keep_out_of_runtime";

export type WallTripleLeafGateQBacklogItem = {
  closesRuntimeGapNow: false;
  id: WallTripleLeafGateQBacklogItemId;
  kind: WallTripleLeafGateQBacklogKind;
  priority: number;
  requiredArtifacts: readonly string[];
  status: WallTripleLeafGateQBacklogStatus;
  target: string;
  unblocks: readonly WallTripleLeafGatePBlockerId[];
};

export type WallTripleLeafGateQRevalidationStatus = "still_open_no_runtime";

export type WallTripleLeafGateQRuntimeBlockerRevalidation = {
  blockerId: WallTripleLeafGatePBlockerId;
  mappedBacklogItemIds: readonly WallTripleLeafGateQBacklogItemId[];
  revalidationStatus: WallTripleLeafGateQRevalidationStatus;
  runtimePromotionAllowed: false;
};

export type WallTripleLeafSourceAccessFollowupEvaluation = {
  accessBacklog: readonly WallTripleLeafGateQBacklogItem[];
  apiShapeChange: false;
  closedRuntimeBlockerCount: 0;
  confidencePromotion: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  firstBacklogItem: WallTripleLeafGateQBacklogItem;
  landedGate: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.landedGate;
  manualSourcePacketRequired: true;
  numericRuntimeBehaviorChange: false;
  openRuntimeBlockerCount: number;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeBlockerRevalidations: readonly WallTripleLeafGateQRuntimeBlockerRevalidation[];
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectedNextFile;
  selectionStatus: typeof WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectionStatus;
  sourceAccessEvaluation: WallTripleLeafSourceAccessEvaluation;
  sourceAccessReadyForRuntime: false;
  sourceBacklogReadyForRuntime: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_q_source_access_backlog_and_runtime_blocker_revalidation_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_r_manual_source_packet_intake_contract_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts",
  selectionStatus:
    "gate_q_landed_source_access_backlog_and_blocker_revalidation_no_runtime_selected_manual_source_packet_gate_r",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_GATE_Q_SOURCE_ACCESS_BACKLOG: readonly WallTripleLeafGateQBacklogItem[] = [
  {
    closesRuntimeGapNow: false,
    id: "uris_2006_authorized_curve_packet",
    kind: "source_access_packet",
    priority: 1,
    requiredArtifacts: [
      "rights-safe Uris 2006 source PDF, page image, or authorized TDM output",
      "page/figure/table locator for every curve used by the local two-cavity lane",
      "source-owned one-third-octave TL vectors or enough plot evidence for reproducible digitization",
      "reported or derived Rw/STC value and uncertainty owner from the same source packet"
    ],
    status: "manual_source_packet_required",
    target: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame",
    unblocks: ["missing_source_owned_numeric_curves_or_table", "missing_uris_2006_authorized_pdf_or_page_image"]
  },
  {
    closesRuntimeGapNow: false,
    id: "uris_2006_digitization_qc_packet",
    kind: "digitization_qc",
    priority: 2,
    requiredArtifacts: [
      "plot-axis lock or numeric table parser for Uris 2006",
      "band-grid mapping to the calculator one-third-octave bands",
      "curve identity for double-frame controls and internal-board variants",
      "Rw/STC re-derivation check against source-reported weighted values"
    ],
    status: "blocked_waiting_source_packet",
    target: "Uris 2006 source-owned curves/table",
    unblocks: ["missing_source_owned_numeric_curves_or_table"]
  },
  {
    closesRuntimeGapNow: false,
    id: "local_material_and_effect_mapping_packet",
    kind: "local_mapping_tolerance",
    priority: 3,
    requiredArtifacts: [
      "per-role mapping for local rockwool/mineral-wool density and flow-resistivity",
      "per-role mapping for generic gypsum_board versus source board mass/thickness",
      "bounded MLV limp-mass effect model or same-position measured row",
      "bounded gypsum_plaster face-finish effect model or same-position measured row"
    ],
    status: "blocked_waiting_source_packet",
    target: "local gypsum_board / rockwool / mlv / gypsum_plaster roles",
    unblocks: ["missing_local_material_support_mapping", "near_source_promotion_rejected"]
  },
  {
    closesRuntimeGapNow: false,
    id: "support_topology_mapping_packet",
    kind: "support_topology_owner",
    priority: 4,
    requiredArtifacts: [
      "support gauge, depth, spacing, and frame-independence owner",
      "comparison between local support topology and the selected source support topology",
      "negative boundaries for generic independent-frame and twin-frame labels"
    ],
    status: "blocked_waiting_source_packet",
    target: "local grouped support topology",
    unblocks: ["missing_local_material_support_mapping", "near_source_promotion_rejected"]
  },
  {
    closesRuntimeGapNow: false,
    id: "paired_visible_runtime_acceptance_packet",
    kind: "paired_runtime_tests",
    priority: 5,
    requiredArtifacts: [
      "engine exact-runtime test for lab Rw after source row and mapping pass",
      "web route-card and output-card visible tests for promoted and blocked cases",
      "proposal/report tests for lab Rw and field R'w / DnT,w caveat behavior",
      "negative tests for flat-list route flip, duplicate stack drift, and near-source false promotion"
    ],
    status: "blocked_waiting_source_packet",
    target: "paired engine/web visible runtime acceptance",
    unblocks: ["missing_paired_visible_runtime_tests"]
  },
  {
    closesRuntimeGapNow: false,
    id: "uris_2008_perforated_facing_separate_lane",
    kind: "separate_negative_boundary_lane",
    priority: 6,
    requiredArtifacts: [
      "separate perforated-facing topology lane before any reuse",
      "perforation ratio / Helmholtz-facing model owner",
      "negative boundary proving Uris 2008 cannot replace the Uris 2006 internal-board source row"
    ],
    status: "negative_boundary_keep_out_of_runtime",
    target: "uris_2008_perforated_absorptive_facing_accessible_adjacent",
    unblocks: ["accessible_alternative_has_perforated_facing_topology", "alternative_rows_are_context_or_glazing_only"]
  }
] as const;

export const WALL_TRIPLE_LEAF_GATE_Q_RUNTIME_BLOCKER_REVALIDATIONS: readonly WallTripleLeafGateQRuntimeBlockerRevalidation[] = [
  {
    blockerId: "missing_source_owned_numeric_curves_or_table",
    mappedBacklogItemIds: ["uris_2006_authorized_curve_packet", "uris_2006_digitization_qc_packet"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "missing_uris_2006_authorized_pdf_or_page_image",
    mappedBacklogItemIds: ["uris_2006_authorized_curve_packet"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "accessible_alternative_has_perforated_facing_topology",
    mappedBacklogItemIds: ["uris_2008_perforated_facing_separate_lane"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "alternative_rows_are_context_or_glazing_only",
    mappedBacklogItemIds: ["uris_2008_perforated_facing_separate_lane"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "near_source_promotion_rejected",
    mappedBacklogItemIds: ["local_material_and_effect_mapping_packet", "support_topology_mapping_packet"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "missing_local_material_support_mapping",
    mappedBacklogItemIds: ["local_material_and_effect_mapping_packet", "support_topology_mapping_packet"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  },
  {
    blockerId: "missing_paired_visible_runtime_tests",
    mappedBacklogItemIds: ["paired_visible_runtime_acceptance_packet"],
    revalidationStatus: "still_open_no_runtime",
    runtimePromotionAllowed: false
  }
] as const;

export function evaluateWallTripleLeafSourceAccessFollowup(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceAccessEvaluation?: WallTripleLeafSourceAccessEvaluation;
}): WallTripleLeafSourceAccessFollowupEvaluation {
  const sourceAccessEvaluation =
    input.sourceAccessEvaluation ??
    evaluateWallTripleLeafSourceAccess({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const firstBacklogItem = WALL_TRIPLE_LEAF_GATE_Q_SOURCE_ACCESS_BACKLOG[0];

  if (!firstBacklogItem) {
    throw new Error("Gate Q requires at least one source-access backlog item.");
  }

  return {
    accessBacklog: WALL_TRIPLE_LEAF_GATE_Q_SOURCE_ACCESS_BACKLOG,
    apiShapeChange: false,
    closedRuntimeBlockerCount: 0,
    confidencePromotion: false,
    evidencePromotion: false,
    failClosedStrategy: sourceAccessEvaluation.failClosedStrategy,
    firstBacklogItem,
    landedGate: WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.landedGate,
    manualSourcePacketRequired: true,
    numericRuntimeBehaviorChange: false,
    openRuntimeBlockerCount: WALL_TRIPLE_LEAF_GATE_Q_RUNTIME_BLOCKER_REVALIDATIONS.length,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeBlockerRevalidations: WALL_TRIPLE_LEAF_GATE_Q_RUNTIME_BLOCKER_REVALIDATIONS,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectedNextFile,
    selectionStatus: WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectionStatus,
    sourceAccessEvaluation,
    sourceAccessReadyForRuntime: false,
    sourceBacklogReadyForRuntime: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
