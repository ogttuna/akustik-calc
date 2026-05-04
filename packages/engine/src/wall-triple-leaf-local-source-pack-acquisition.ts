import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafLocalSourceAcquisition,
  type WallTripleLeafLocalSourceAcquisitionEvaluation,
  type WallTripleLeafLocalSourceRequirement
} from "./wall-triple-leaf-local-source-acquisition";

export type WallTripleLeafLocalSourcePackCandidateStatus =
  | "blocked_adjacent_reference_only"
  | "blocked_needs_bounded_effect_source"
  | "blocked_needs_direct_measured_or_digitized_row"
  | "blocked_needs_local_product_datasheet"
  | "blocked_needs_topology_input_owner";

export type WallTripleLeafLocalSourcePackCandidate = {
  blocker: string;
  candidateId: string;
  requirementId: WallTripleLeafLocalSourceRequirement["id"];
  sourceRole: "bounded_effect_model_candidate" | "local_mapping_candidate" | "source_family_reference";
  status: WallTripleLeafLocalSourcePackCandidateStatus;
  usableForRuntime: false;
};

export type WallTripleLeafOrderTopologyRiskId =
  | "duplicate_stack_family_flip"
  | "heavy_multileaf_lined_massive_boundary_flip"
  | "masonry_lined_massive_swap_flip"
  | "raw_floor_order_role_inference_sensitivity"
  | "triple_leaf_double_leaf_route_flip";

export type WallTripleLeafOrderTopologyRisk = {
  currentPosture: "already_pinned_order_sensitive" | "already_pinned_role_defined_floor_boundary" | "new_gate_g7_watch_item";
  id: WallTripleLeafOrderTopologyRiskId;
  requiredFutureGuard: string;
  symptom: string;
};

export type WallTripleLeafLocalSourcePackAcquisitionEvaluation = {
  apiShapeChange: false;
  confidencePromotion: false;
  evidencePromotion: false;
  localSourceAcquisitionEvaluation: WallTripleLeafLocalSourceAcquisitionEvaluation;
  numericRuntimeBehaviorChange: false;
  orderTopologyRisks: readonly WallTripleLeafOrderTopologyRisk[];
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  requirementIntakes: readonly {
    candidates: readonly WallTripleLeafLocalSourcePackCandidate[];
    requirement: WallTripleLeafLocalSourceRequirement;
    selectedForGateG8: true;
    sourcePackReady: false;
  }[];
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectedNextFile;
  sourcePackReadyForMappingTolerance: false;
  usableRuntimeCandidateCount: 0;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g7_local_source_pack_acquisition_intake_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g8_source_gap_and_order_risk_register",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts",
  selectionStatus:
    "gate_g7_landed_local_source_pack_intake_no_runtime_selected_source_gap_and_order_risk_register_gate_g8",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const CANDIDATE_DEFINITIONS: Record<
  WallTripleLeafLocalSourceRequirement["id"],
  readonly WallTripleLeafLocalSourcePackCandidate[]
> = {
  gypsum_plaster_face_finish_effect_model: [
    {
      blocker:
        "No owned one-third-octave delta or measured triple-leaf row currently bounds wet gypsum plaster as an added face finish.",
      candidateId: "gypsum_plaster_finish_delta_source_needed",
      requirementId: "gypsum_plaster_face_finish_effect_model",
      sourceRole: "bounded_effect_model_candidate",
      status: "blocked_needs_bounded_effect_source",
      usableForRuntime: false
    }
  ],
  local_50mm_rockwool_cavity_source_row: [
    {
      blocker:
        "NRC 2024 owns 92.1 mm-class cavities; it does not own the local 50 mm two-cavity rockwool substitution.",
      candidateId: "nrc_2024_92_1mm_internal_board_rows_adjacent_reference_only",
      requirementId: "local_50mm_rockwool_cavity_source_row",
      sourceRole: "source_family_reference",
      status: "blocked_adjacent_reference_only",
      usableForRuntime: false
    },
    {
      blocker:
        "A measured or graph-digitized 50 mm two-cavity rockwool triple-leaf row is still missing.",
      candidateId: "local_50mm_rockwool_two_cavity_measured_row_needed",
      requirementId: "local_50mm_rockwool_cavity_source_row",
      sourceRole: "source_family_reference",
      status: "blocked_needs_direct_measured_or_digitized_row",
      usableForRuntime: false
    }
  ],
  local_type_c_board_product_mapping: [
    {
      blocker:
        "NRC Type C board reference mass/thickness exists, but the local generic gypsum_board catalog row is not tied to a specific Type C product datasheet.",
      candidateId: "nrc_2024_type_c_board_mass_thickness_reference",
      requirementId: "local_type_c_board_product_mapping",
      sourceRole: "local_mapping_candidate",
      status: "blocked_needs_local_product_datasheet",
      usableForRuntime: false
    }
  ],
  mlv_limp_mass_triple_leaf_effect_model: [
    {
      blocker:
        "No owned triple-leaf source row or one-third-octave limp-mass delta model currently bounds MLV in either face leaf.",
      candidateId: "mlv_limp_mass_triple_leaf_delta_source_needed",
      requirementId: "mlv_limp_mass_triple_leaf_effect_model",
      sourceRole: "bounded_effect_model_candidate",
      status: "blocked_needs_bounded_effect_source",
      usableForRuntime: false
    }
  ],
  rockwool_absorber_equivalence_or_measured_row: [
    {
      blocker:
        "NRC 2024 owns glass-fiber batt absorber behavior; local rockwool/mineral-wool equivalence needs flow-resistivity/density or direct band-curve evidence.",
      candidateId: "nrc_2024_glass_fiber_batt_absorber_reference",
      requirementId: "rockwool_absorber_equivalence_or_measured_row",
      sourceRole: "source_family_reference",
      status: "blocked_adjacent_reference_only",
      usableForRuntime: false
    },
    {
      blocker:
        "A local rockwool/mineral-wool triple-leaf measured row or equivalence pack with one-third-octave tolerance is still missing.",
      candidateId: "local_rockwool_absorber_equivalence_pack_needed",
      requirementId: "rockwool_absorber_equivalence_or_measured_row",
      sourceRole: "source_family_reference",
      status: "blocked_needs_direct_measured_or_digitized_row",
      usableForRuntime: false
    }
  ],
  support_gauge_depth_and_spacing_mapping: [
    {
      blocker:
        "NRC support context is double 18 gauge 92.1 mm steel studs at 610 mm centers; current local inputs do not own gauge/depth/frame-independence mapping.",
      candidateId: "nrc_2024_double_18_gauge_92_1mm_steel_stud_reference",
      requirementId: "support_gauge_depth_and_spacing_mapping",
      sourceRole: "local_mapping_candidate",
      status: "blocked_needs_topology_input_owner",
      usableForRuntime: false
    }
  ]
} as const;

export const WALL_TRIPLE_LEAF_ORDER_TOPOLOGY_RISK_REGISTER: readonly WallTripleLeafOrderTopologyRisk[] = [
  {
    currentPosture: "new_gate_g7_watch_item",
    id: "triple_leaf_double_leaf_route_flip",
    requiredFutureGuard:
      "Grouped topology must distinguish harmless flat-order edits from genuine internal-leaf/two-cavity assemblies before exact runtime.",
    symptom:
      "Adjacent layer swaps can flip a lightweight wall between multileaf_multicavity screening and double_leaf delegates with 10 dB or larger movement."
  },
  {
    currentPosture: "already_pinned_order_sensitive",
    id: "heavy_multileaf_lined_massive_boundary_flip",
    requiredFutureGuard:
      "Family-boundary holds must stay visible and later source lanes must not inherit lined-massive values from ambiguous multileaf stacks.",
    symptom:
      "Heavy mixed stacks can cross from multileaf_multicavity screening into lined_massive_wall after a small flat-order edit."
  },
  {
    currentPosture: "already_pinned_order_sensitive",
    id: "masonry_lined_massive_swap_flip",
    requiredFutureGuard:
      "Masonry/nonhomogeneous versus lined-massive boundary warnings must remain paired with value tests before any smoothing or widening.",
    symptom:
      "AAC or masonry plus board/fill stacks can swap between masonry_nonhomogeneous and lined_massive_wall lanes."
  },
  {
    currentPosture: "new_gate_g7_watch_item",
    id: "duplicate_stack_family_flip",
    requiredFutureGuard:
      "Many-layer duplicate edits must remain finite, low-confidence when source ownership is missing, and documented as user-hostile input.",
    symptom:
      "Duplicating a whole wall stack can change the selected family even when the numeric movement is bounded."
  },
  {
    currentPosture: "already_pinned_role_defined_floor_boundary",
    id: "raw_floor_order_role_inference_sensitivity",
    requiredFutureGuard:
      "Role-defined floor exact rows stay reorder-stable, while raw floor order must keep explicit support/value posture instead of claiming arbitrary invariance.",
    symptom:
      "Floor role tags are stable under UI reorder, but raw/order-inferred floor stacks intentionally remain order-sensitive."
  }
] as const;

function buildRequirementIntakes(
  localSourceAcquisitionEvaluation: WallTripleLeafLocalSourceAcquisitionEvaluation
): WallTripleLeafLocalSourcePackAcquisitionEvaluation["requirementIntakes"] {
  return localSourceAcquisitionEvaluation.requirements.map((requirement) => ({
    candidates: CANDIDATE_DEFINITIONS[requirement.id],
    requirement,
    selectedForGateG8: true,
    sourcePackReady: false
  }));
}

export function evaluateWallTripleLeafLocalSourcePackAcquisition(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  localSourceAcquisitionEvaluation?: WallTripleLeafLocalSourceAcquisitionEvaluation;
}): WallTripleLeafLocalSourcePackAcquisitionEvaluation {
  const localSourceAcquisitionEvaluation =
    input.localSourceAcquisitionEvaluation ??
    evaluateWallTripleLeafLocalSourceAcquisition({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const requirementIntakes = buildRequirementIntakes(localSourceAcquisitionEvaluation);

  return {
    apiShapeChange: false,
    confidencePromotion: false,
    evidencePromotion: false,
    localSourceAcquisitionEvaluation,
    numericRuntimeBehaviorChange: false,
    orderTopologyRisks: WALL_TRIPLE_LEAF_ORDER_TOPOLOGY_RISK_REGISTER,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    requirementIntakes,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectedNextFile,
    sourcePackReadyForMappingTolerance: false,
    usableRuntimeCandidateCount: 0,
    workbenchInputBehaviorChange: false
  };
}
