import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafBlockedDiagnostics,
  type WallTripleLeafBlockedDiagnosticsEvaluation,
  type WallTripleLeafSourceAcquisitionTargetId
} from "./wall-triple-leaf-blocked-diagnostics";

export type WallTripleLeafLocalSourceRequirementStatus =
  | "blocked_needs_bounded_effect_model"
  | "blocked_needs_exact_input_mapping"
  | "blocked_needs_local_product_mapping"
  | "blocked_needs_measured_or_digitized_source_row";

export type WallTripleLeafLocalSourceEvidenceClass =
  | "bounded_effect_model"
  | "direct_measured_row"
  | "local_material_mapping"
  | "topology_input_mapping";

export type WallTripleLeafLocalSourceRequirement = {
  acceptanceCriteria: readonly string[];
  blocksRuntime: true;
  evidenceClass: WallTripleLeafLocalSourceEvidenceClass;
  id: WallTripleLeafSourceAcquisitionTargetId;
  minimumEvidenceCount: number;
  priority: number;
  reason: string;
  selectedForGateG7: true;
  status: WallTripleLeafLocalSourceRequirementStatus;
};

export type WallTripleLeafLocalSourceAcquisitionEvaluation = {
  apiShapeChange: false;
  blockedDiagnosticsEvaluation: WallTripleLeafBlockedDiagnosticsEvaluation;
  confidencePromotion: false;
  evidencePromotion: false;
  minimumNewSourceRowsRequired: number;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  requirements: readonly WallTripleLeafLocalSourceRequirement[];
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectedNextFile;
  sourceAcquisitionPackReady: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g6_local_source_acquisition_and_effect_model_requirements_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g7_local_source_pack_acquisition_intake",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts",
  selectionStatus:
    "gate_g6_landed_local_source_and_effect_model_requirements_no_runtime_selected_source_pack_acquisition_gate_g7",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIREMENT_DEFINITIONS: Record<WallTripleLeafSourceAcquisitionTargetId, Omit<WallTripleLeafLocalSourceRequirement, "priority">> = {
  gypsum_plaster_face_finish_effect_model: {
    acceptanceCriteria: [
      "source row or bounded model for gypsum plaster as an added face finish",
      "one-third-octave delta tolerance for plaster mass and damping effects",
      "negative-boundary proof that lined masonry / one-side lining rows do not leak into this lane"
    ],
    blocksRuntime: true,
    evidenceClass: "bounded_effect_model",
    id: "gypsum_plaster_face_finish_effect_model",
    minimumEvidenceCount: 1,
    reason: "No current source-family row contains wet gypsum plaster as a face finish.",
    selectedForGateG7: true,
    status: "blocked_needs_bounded_effect_model"
  },
  local_50mm_rockwool_cavity_source_row: {
    acceptanceCriteria: [
      "measured or reproducibly graph-digitized two-cavity triple-leaf row with 50 mm cavities",
      "rockwool/mineral-wool fill placement and coverage matching the local grouped topology",
      "Rw/STC sanity check plus one-third-octave curve tolerance"
    ],
    blocksRuntime: true,
    evidenceClass: "direct_measured_row",
    id: "local_50mm_rockwool_cavity_source_row",
    minimumEvidenceCount: 1,
    reason: "The local 50 mm cavity family cannot inherit the NRC 92.1 mm cavity calibration without a direct row or bounded tolerance.",
    selectedForGateG7: true,
    status: "blocked_needs_measured_or_digitized_source_row"
  },
  local_type_c_board_product_mapping: {
    acceptanceCriteria: [
      "specific local board product identity instead of generic gypsum_board",
      "surface mass and board thickness tolerance against NRC 12.7 mm Type C gypsum board at 9.80 kg/m2",
      "board-count mapping for outer and internal leaves"
    ],
    blocksRuntime: true,
    evidenceClass: "local_material_mapping",
    id: "local_type_c_board_product_mapping",
    minimumEvidenceCount: 1,
    reason: "The current catalog material is generic gypsum_board and does not encode Type C board identity.",
    selectedForGateG7: true,
    status: "blocked_needs_local_product_mapping"
  },
  mlv_limp_mass_triple_leaf_effect_model: {
    acceptanceCriteria: [
      "measured source row with MLV in the same leaf position or a bounded limp-mass delta model",
      "one-third-octave tolerance for low-frequency and midband changes",
      "proof that MLV does not invalidate the Gate G3 source-family calibration boundaries"
    ],
    blocksRuntime: true,
    evidenceClass: "bounded_effect_model",
    id: "mlv_limp_mass_triple_leaf_effect_model",
    minimumEvidenceCount: 1,
    reason: "No current NRC-like source-family row includes a limp-mass membrane.",
    selectedForGateG7: true,
    status: "blocked_needs_bounded_effect_model"
  },
  rockwool_absorber_equivalence_or_measured_row: {
    acceptanceCriteria: [
      "rockwool/mineral-wool triple-leaf row in the same two-cavity topology or flow-resistivity/density equivalence",
      "band-curve tolerance showing the substitution stays inside the calibrated absorber family",
      "separate handling for full-fill and partial-fill regimes"
    ],
    blocksRuntime: true,
    evidenceClass: "direct_measured_row",
    id: "rockwool_absorber_equivalence_or_measured_row",
    minimumEvidenceCount: 1,
    reason: "The calibrated source-family absorber is glass-fiber batt; rockwool equivalence is not owned.",
    selectedForGateG7: true,
    status: "blocked_needs_measured_or_digitized_source_row"
  },
  support_gauge_depth_and_spacing_mapping: {
    acceptanceCriteria: [
      "explicit local support inputs for stud gauge, depth, spacing, and frame independence",
      "mapping tolerance against NRC double 18 gauge 92.1 mm steel studs at 610 mm centers",
      "negative-boundary proof for generic twin-frame and independent-frame labels"
    ],
    blocksRuntime: true,
    evidenceClass: "topology_input_mapping",
    id: "support_gauge_depth_and_spacing_mapping",
    minimumEvidenceCount: 1,
    reason: "Current wallTopology can express generic support class but not the exact NRC stud gauge/depth support.",
    selectedForGateG7: true,
    status: "blocked_needs_exact_input_mapping"
  }
} as const;

function buildRequirements(
  diagnosticsEvaluation: WallTripleLeafBlockedDiagnosticsEvaluation
): readonly WallTripleLeafLocalSourceRequirement[] {
  return diagnosticsEvaluation.sourceAcquisitionTargets.map((target) => ({
    ...REQUIREMENT_DEFINITIONS[target.id],
    priority: target.priority
  }));
}

export function evaluateWallTripleLeafLocalSourceAcquisition(input: {
  airborneContext: AirborneContext;
  blockedDiagnosticsEvaluation?: WallTripleLeafBlockedDiagnosticsEvaluation;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): WallTripleLeafLocalSourceAcquisitionEvaluation {
  const blockedDiagnosticsEvaluation =
    input.blockedDiagnosticsEvaluation ??
    evaluateWallTripleLeafBlockedDiagnostics({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const requirements = buildRequirements(blockedDiagnosticsEvaluation);
  const directSourceRowRequirements = requirements.filter(
    (requirement) => requirement.evidenceClass === "direct_measured_row"
  ).length;

  return {
    apiShapeChange: false,
    blockedDiagnosticsEvaluation,
    confidencePromotion: false,
    evidencePromotion: false,
    minimumNewSourceRowsRequired: directSourceRowRequirements,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    requirements,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectedNextFile,
    sourceAcquisitionPackReady: false,
    workbenchInputBehaviorChange: false
  };
}
