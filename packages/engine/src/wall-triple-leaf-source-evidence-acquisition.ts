import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceGapClosure,
  type WallTripleLeafSourceGapClosureEvaluation,
  type WallTripleLeafSourceGapClosureVerdict
} from "./wall-triple-leaf-source-gap-closure";

export type WallTripleLeafSourceEvidenceRequirementId = WallTripleLeafSourceGapClosureVerdict["requirementId"];

export type WallTripleLeafSourceEvidenceAcquisitionMode =
  | "effect_model_research"
  | "local_product_mapping_intake"
  | "source_locator_intake"
  | "topology_input_owner";

export type WallTripleLeafSourceEvidenceAcquisitionStatus =
  | "blocked_follow_on_required"
  | "selected_first_no_runtime";

export type WallTripleLeafSourceEvidenceAcquisitionTrackId =
  | "gypsum_plaster_face_finish_delta_pack"
  | "local_type_c_board_product_mapping_pack"
  | "mlv_limp_mass_effect_model_pack"
  | "rockwool_two_cavity_band_curve_source_pack"
  | "support_topology_input_owner_pack";

export type WallTripleLeafSourceEvidenceAcquisitionTrack = {
  acceptanceCriteria: readonly string[];
  acquisitionMode: WallTripleLeafSourceEvidenceAcquisitionMode;
  acquisitionStatus: WallTripleLeafSourceEvidenceAcquisitionStatus;
  closesRuntimeGapNow: false;
  gapIds: readonly WallTripleLeafSourceEvidenceRequirementId[];
  id: WallTripleLeafSourceEvidenceAcquisitionTrackId;
  neededEvidence: readonly string[];
  priority: number;
  rationale: string;
  runtimeBlocked: true;
  selectedForGateN: boolean;
};

export type WallTripleLeafSourceEvidenceAcquisitionEvaluation = {
  acquisitionTracks: readonly WallTripleLeafSourceEvidenceAcquisitionTrack[];
  apiShapeChange: false;
  confidencePromotion: false;
  evidenceAcquisitionReadyForRuntime: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  followOnTrackCount: number;
  numericRuntimeBehaviorChange: false;
  openGapCount: number;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedFirstTrack: WallTripleLeafSourceEvidenceAcquisitionTrack;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectedNextFile;
  sourceEvidencePackReady: false;
  sourceGapClosureEvaluation: WallTripleLeafSourceGapClosureEvaluation;
  sourceGapsClosed: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_m_source_evidence_acquisition_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_n_rockwool_two_cavity_source_locator_intake_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts",
  selectionStatus:
    "gate_m_selected_rockwool_two_cavity_source_evidence_first_no_runtime_selected_source_locator_intake_gate_n",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const ACQUISITION_TRACKS: readonly WallTripleLeafSourceEvidenceAcquisitionTrack[] = [
  {
    acceptanceCriteria: [
      "the same source row or accepted equivalence pack addresses rockwool absorber behavior and 50 mm two-cavity behavior",
      "one-third-octave curve provenance is reproducible enough for the Gate G calibration/holdout tolerance corridor",
      "reported or derived Rw/STC values agree with the source curve within the digitization uncertainty owner",
      "runtime remains frozen until later mapping/tolerance and paired visible runtime tests pass"
    ],
    acquisitionMode: "source_locator_intake",
    acquisitionStatus: "selected_first_no_runtime",
    closesRuntimeGapNow: false,
    gapIds: ["rockwool_absorber_equivalence_or_measured_row", "local_50mm_rockwool_cavity_source_row"],
    id: "rockwool_two_cavity_band_curve_source_pack",
    neededEvidence: [
      "measured or reproducibly graph-digitized one-third-octave TL curve for a triple-leaf two-cavity wall with rockwool/mineral-wool fill",
      "50 mm-class cavity depth, two-cavity topology, and full-fill placement/coverage",
      "flow-resistivity/density equivalence when a direct rockwool row is unavailable",
      "source-owned uncertainty and Rw/STC derivation trail"
    ],
    priority: 1,
    rationale:
      "This is the highest-leverage evidence path for the user defect because it targets both the rockwool substitution and the 50 mm two-cavity topology that make the flat-list reorder result untrustworthy.",
    runtimeBlocked: true,
    selectedForGateN: true
  },
  {
    acceptanceCriteria: [
      "local board product identity replaces generic gypsum_board before exact mapping",
      "surface mass and thickness tolerance are compared against the NRC Type C board reference",
      "outer and internal leaf board counts are mapped without changing runtime"
    ],
    acquisitionMode: "local_product_mapping_intake",
    acquisitionStatus: "blocked_follow_on_required",
    closesRuntimeGapNow: false,
    gapIds: ["local_type_c_board_product_mapping"],
    id: "local_type_c_board_product_mapping_pack",
    neededEvidence: [
      "local Type C gypsum-board product datasheet",
      "surface mass and thickness tolerance against NRC 12.7 mm Type C board",
      "board-count mapping for side A, internal leaf, and side B"
    ],
    priority: 2,
    rationale:
      "The source-family fit uses Type C board behavior, but the local stack only names generic gypsum_board; this is required before any exact local runtime claim.",
    runtimeBlocked: true,
    selectedForGateN: false
  },
  {
    acceptanceCriteria: [
      "support gauge/depth/spacing fields have an explicit input owner",
      "local independent-frame context can be compared against the NRC double-stud support context",
      "generic support labels remain negative boundaries until the exact topology is owned"
    ],
    acquisitionMode: "topology_input_owner",
    acquisitionStatus: "blocked_follow_on_required",
    closesRuntimeGapNow: false,
    gapIds: ["support_gauge_depth_and_spacing_mapping"],
    id: "support_topology_input_owner_pack",
    neededEvidence: [
      "local support gauge, depth, spacing, and frame-independence inputs",
      "mapping tolerance against double 18 gauge 92.1 mm steel studs at 610 mm centers",
      "negative-boundary proof for generic independent-frame and twin-frame labels"
    ],
    priority: 3,
    rationale:
      "Complete grouped topology is not the same as exact support topology; runtime promotion needs support input ownership after the source row path is known.",
    runtimeBlocked: true,
    selectedForGateN: false
  },
  {
    acceptanceCriteria: [
      "MLV is represented by a same-position measured row or bounded one-third-octave limp-mass delta",
      "low-frequency and midband deltas stay inside an owned tolerance",
      "Gate G3 calibration/holdout boundaries remain protected"
    ],
    acquisitionMode: "effect_model_research",
    acquisitionStatus: "blocked_follow_on_required",
    closesRuntimeGapNow: false,
    gapIds: ["mlv_limp_mass_triple_leaf_effect_model"],
    id: "mlv_limp_mass_effect_model_pack",
    neededEvidence: [
      "same-position measured triple-leaf row containing MLV or bounded limp-mass delta model",
      "one-third-octave tolerance for low-frequency and midband changes",
      "negative-boundary proof against leaking unrelated membrane assumptions"
    ],
    priority: 4,
    rationale:
      "MLV can materially reshape the TL curve, but it should not be modeled before the base rockwool/two-cavity source row path is selected.",
    runtimeBlocked: true,
    selectedForGateN: false
  },
  {
    acceptanceCriteria: [
      "gypsum plaster face-finish behavior is bounded by a same-role source row or damping/mass delta",
      "one-third-octave tolerance is owned before applying any finish correction",
      "lined-masonry and one-side-lining assumptions remain negative boundaries"
    ],
    acquisitionMode: "effect_model_research",
    acquisitionStatus: "blocked_follow_on_required",
    closesRuntimeGapNow: false,
    gapIds: ["gypsum_plaster_face_finish_effect_model"],
    id: "gypsum_plaster_face_finish_delta_pack",
    neededEvidence: [
      "same-role measured triple-leaf row containing gypsum plaster or bounded face-finish delta model",
      "one-third-octave mass/damping tolerance for plaster",
      "negative-boundary proof against lined-masonry plaster leakage"
    ],
    priority: 5,
    rationale:
      "Plaster is a required local effect-model gap, but it is lower leverage than the absorber/cavity source path for the reported reorder defect.",
    runtimeBlocked: true,
    selectedForGateN: false
  }
] as const;

function ensureTracksMatchOpenGaps(
  sourceGapClosureEvaluation: WallTripleLeafSourceGapClosureEvaluation
): readonly WallTripleLeafSourceEvidenceAcquisitionTrack[] {
  const openGapIds = new Set(sourceGapClosureEvaluation.sourceGapVerdicts.map((verdict) => verdict.requirementId));

  return ACQUISITION_TRACKS.filter((track) => track.gapIds.every((gapId) => openGapIds.has(gapId)));
}

export function evaluateWallTripleLeafSourceEvidenceAcquisition(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceGapClosureEvaluation?: WallTripleLeafSourceGapClosureEvaluation;
}): WallTripleLeafSourceEvidenceAcquisitionEvaluation {
  const sourceGapClosureEvaluation =
    input.sourceGapClosureEvaluation ??
    evaluateWallTripleLeafSourceGapClosure({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const acquisitionTracks = ensureTracksMatchOpenGaps(sourceGapClosureEvaluation);
  const selectedFirstTrack = acquisitionTracks.find((track) => track.selectedForGateN);

  if (!selectedFirstTrack) {
    throw new Error("Gate M requires one selected Gate N source-evidence acquisition track.");
  }

  return {
    acquisitionTracks,
    apiShapeChange: false,
    confidencePromotion: false,
    evidenceAcquisitionReadyForRuntime: false,
    evidencePromotion: false,
    failClosedStrategy: sourceGapClosureEvaluation.failClosedStrategy,
    followOnTrackCount: acquisitionTracks.filter((track) => !track.selectedForGateN).length,
    numericRuntimeBehaviorChange: false,
    openGapCount: sourceGapClosureEvaluation.openGapCount,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedFirstTrack,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectedNextFile,
    sourceEvidencePackReady: false,
    sourceGapClosureEvaluation,
    sourceGapsClosed: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
