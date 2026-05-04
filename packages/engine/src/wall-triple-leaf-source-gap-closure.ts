import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafRuntimePromotionReadiness,
  type WallTripleLeafRuntimePromotionReadinessEvaluation,
  type WallTripleLeafSourceGapClosureItem
} from "./wall-triple-leaf-runtime-promotion-readiness";

export type WallTripleLeafSourceGapClosureStatus =
  | "open_adjacent_reference_only"
  | "open_missing_bounded_effect_model"
  | "open_missing_direct_row_or_equivalence"
  | "open_missing_local_product_mapping"
  | "open_missing_topology_input_owner";

export type WallTripleLeafSourceGapClosureVerdict = {
  availableEvidence: readonly string[];
  canCloseNow: false;
  candidateIds: readonly string[];
  closureStatus: WallTripleLeafSourceGapClosureStatus;
  missingEvidence: readonly string[];
  nextEvidenceOwner: string;
  requirementId: WallTripleLeafSourceGapClosureItem["requirementId"];
  runtimeBlocked: true;
  selectedForGateM: true;
};

export type WallTripleLeafSourceGapClosureEvaluation = {
  apiShapeChange: false;
  closedGapCount: 0;
  confidencePromotion: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  numericRuntimeBehaviorChange: false;
  openGapCount: number;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadinessEvaluation: WallTripleLeafRuntimePromotionReadinessEvaluation;
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectedNextFile;
  sourceGapClosureReadyForRuntime: false;
  sourceGapVerdicts: readonly WallTripleLeafSourceGapClosureVerdict[];
  sourceGapsClosed: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_l_source_gap_closure_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_m_source_evidence_acquisition_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts",
  selectionStatus:
    "gate_l_confirmed_source_gaps_remain_open_no_runtime_selected_source_evidence_acquisition_gate_m",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const CLOSURE_VERDICTS: Record<
  WallTripleLeafSourceGapClosureItem["requirementId"],
  Omit<WallTripleLeafSourceGapClosureVerdict, "candidateIds" | "nextEvidenceOwner" | "requirementId">
> = {
  gypsum_plaster_face_finish_effect_model: {
    availableEvidence: ["local stack contains gypsum_plaster as a face finish"],
    canCloseNow: false,
    closureStatus: "open_missing_bounded_effect_model",
    missingEvidence: [
      "measured triple-leaf source row with gypsum plaster in the same face-finish role",
      "bounded one-third-octave mass/damping delta for gypsum plaster",
      "negative-boundary proof that lined-masonry plaster assumptions do not leak into this triple-leaf lane"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  },
  local_50mm_rockwool_cavity_source_row: {
    availableEvidence: [
      "NRC 2024 source family owns 92.1 mm-class glass-fiber cavities",
      "local grouped topology identifies two 50 mm full rockwool cavities"
    ],
    canCloseNow: false,
    closureStatus: "open_adjacent_reference_only",
    missingEvidence: [
      "measured or reproducibly digitized 50 mm two-cavity rockwool triple-leaf TL curve",
      "Rw/STC sanity check derived from the same one-third-octave row",
      "tolerance proving the 50 mm cavity substitution stays inside the calibrated source family"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  },
  local_type_c_board_product_mapping: {
    availableEvidence: [
      "NRC 2024 Type C board mass/thickness reference exists",
      "local stack only names generic gypsum_board"
    ],
    canCloseNow: false,
    closureStatus: "open_missing_local_product_mapping",
    missingEvidence: [
      "specific local gypsum board product identity",
      "surface-mass and thickness tolerance against NRC 12.7 mm Type C board",
      "board-count mapping for outer and internal leaves"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  },
  mlv_limp_mass_triple_leaf_effect_model: {
    availableEvidence: ["local stack contains MLV in a face leaf"],
    canCloseNow: false,
    closureStatus: "open_missing_bounded_effect_model",
    missingEvidence: [
      "measured triple-leaf source row with MLV in the same leaf position",
      "bounded limp-mass one-third-octave delta model",
      "proof that the MLV delta does not break Gate G3 calibration / holdout boundaries"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  },
  rockwool_absorber_equivalence_or_measured_row: {
    availableEvidence: [
      "NRC 2024 source family owns glass-fiber batt absorber behavior",
      "local stack uses rockwool/mineral-wool as the cavity absorber"
    ],
    canCloseNow: false,
    closureStatus: "open_missing_direct_row_or_equivalence",
    missingEvidence: [
      "direct rockwool/mineral-wool triple-leaf measured or digitized band curve",
      "flow-resistivity/density equivalence accepted against one-third-octave tolerance",
      "separate full-fill and partial-fill regime handling"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  },
  support_gauge_depth_and_spacing_mapping: {
    availableEvidence: [
      "NRC 2024 source family names double 18 gauge 92.1 mm steel studs at 610 mm centers",
      "local grouped topology currently names only generic independent_frames"
    ],
    canCloseNow: false,
    closureStatus: "open_missing_topology_input_owner",
    missingEvidence: [
      "explicit local support gauge, depth, spacing, and frame-independence inputs",
      "mapping tolerance against the NRC double-stud support context",
      "negative-boundary proof for generic independent-frame and twin-frame labels"
    ],
    runtimeBlocked: true,
    selectedForGateM: true
  }
} as const;

function buildVerdict(item: WallTripleLeafSourceGapClosureItem): WallTripleLeafSourceGapClosureVerdict {
  return {
    ...CLOSURE_VERDICTS[item.requirementId],
    candidateIds: item.candidateIds,
    nextEvidenceOwner: item.nextEvidenceOwner,
    requirementId: item.requirementId
  };
}

export function evaluateWallTripleLeafSourceGapClosure(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  runtimePromotionReadinessEvaluation?: WallTripleLeafRuntimePromotionReadinessEvaluation;
}): WallTripleLeafSourceGapClosureEvaluation {
  const runtimePromotionReadinessEvaluation =
    input.runtimePromotionReadinessEvaluation ??
    evaluateWallTripleLeafRuntimePromotionReadiness({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const sourceGapVerdicts = runtimePromotionReadinessEvaluation.sourceGapClosurePlan.map(buildVerdict);

  return {
    apiShapeChange: false,
    closedGapCount: 0,
    confidencePromotion: false,
    evidencePromotion: false,
    failClosedStrategy: runtimePromotionReadinessEvaluation.failClosedStrategy,
    numericRuntimeBehaviorChange: false,
    openGapCount: sourceGapVerdicts.length,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadinessEvaluation,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectedNextFile,
    sourceGapClosureReadyForRuntime: false,
    sourceGapVerdicts,
    sourceGapsClosed: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
