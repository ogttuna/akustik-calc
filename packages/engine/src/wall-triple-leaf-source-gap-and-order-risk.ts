import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafLocalSourcePackAcquisition,
  type WallTripleLeafLocalSourcePackAcquisitionEvaluation,
  type WallTripleLeafOrderTopologyRisk,
  type WallTripleLeafOrderTopologyRiskId
} from "./wall-triple-leaf-local-source-pack-acquisition";

type GateG7RequirementId =
  WallTripleLeafLocalSourcePackAcquisitionEvaluation["requirementIntakes"][number]["requirement"]["id"];

export type WallTripleLeafSourceGapBucket =
  | "bounded_effect_model_required"
  | "source_acquisition_required"
  | "topology_input_owner_required";

export type WallTripleLeafSourceGapDecision = {
  bucket: WallTripleLeafSourceGapBucket;
  candidateIds: readonly string[];
  nextEvidenceOwner: string;
  requirementId: GateG7RequirementId;
  runtimeBlocked: true;
  selectedFollowUp:
    | "bounded_local_effect_model_research"
    | "continue_local_source_acquisition"
    | "grouped_topology_input_owner";
};

export type WallTripleLeafOrderTopologyRiskDisposition =
  | "preserve_existing_floor_role_tests"
  | "preserve_existing_order_sensitive_tests"
  | "selected_for_gate_g9_visible_topology_guard";

export type WallTripleLeafOrderTopologyRiskDecision = {
  disposition: WallTripleLeafOrderTopologyRiskDisposition;
  id: WallTripleLeafOrderTopologyRiskId;
  risk: WallTripleLeafOrderTopologyRisk;
  runtimeBlocked: true;
};

export type WallTripleLeafGateG8TestOwnership = {
  engine: readonly {
    path: string;
    role: string;
  }[];
  futureGateG9EngineTarget: string;
  futureGateG9WebTarget: string;
  webVisible: readonly {
    path: string;
    role: string;
  }[];
};

export type WallTripleLeafSourceGapAndOrderRiskEvaluation = {
  apiShapeChange: false;
  confidencePromotion: false;
  evidencePromotion: false;
  localSourcePackEvaluation: WallTripleLeafLocalSourcePackAcquisitionEvaluation;
  numericRuntimeBehaviorChange: false;
  openSourceGapCount: number;
  orderRiskDecisions: readonly WallTripleLeafOrderTopologyRiskDecision[];
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  routeGuardReadyForRuntime: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextFile;
  sourceGapDecisions: readonly WallTripleLeafSourceGapDecision[];
  sourceGapsClosed: false;
  testOwnership: WallTripleLeafGateG8TestOwnership;
  visibleDiagnosticsRequired: true;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g8_source_gap_and_order_risk_register_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g9_visible_diagnostics_and_grouped_topology_guard",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts",
  selectionStatus:
    "gate_g8_landed_source_gap_and_order_risk_register_no_runtime_selected_visible_diagnostics_and_topology_guard_gate_g9",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const GAP_FOLLOW_UPS: Record<
  GateG7RequirementId,
  Pick<WallTripleLeafSourceGapDecision, "bucket" | "nextEvidenceOwner" | "selectedFollowUp">
> = {
  gypsum_plaster_face_finish_effect_model: {
    bucket: "bounded_effect_model_required",
    nextEvidenceOwner: "one-third-octave gypsum-plaster face-finish delta source or bounded damping model",
    selectedFollowUp: "bounded_local_effect_model_research"
  },
  local_50mm_rockwool_cavity_source_row: {
    bucket: "source_acquisition_required",
    nextEvidenceOwner: "measured or reproducibly graph-digitized 50 mm two-cavity rockwool source row",
    selectedFollowUp: "continue_local_source_acquisition"
  },
  local_type_c_board_product_mapping: {
    bucket: "source_acquisition_required",
    nextEvidenceOwner: "local Type C gypsum-board product datasheet with mass/thickness tolerance",
    selectedFollowUp: "continue_local_source_acquisition"
  },
  mlv_limp_mass_triple_leaf_effect_model: {
    bucket: "bounded_effect_model_required",
    nextEvidenceOwner: "MLV limp-mass one-third-octave effect source or measured same-position source row",
    selectedFollowUp: "bounded_local_effect_model_research"
  },
  rockwool_absorber_equivalence_or_measured_row: {
    bucket: "source_acquisition_required",
    nextEvidenceOwner: "rockwool/mineral-wool flow-resistivity/density equivalence or direct measured band curve",
    selectedFollowUp: "continue_local_source_acquisition"
  },
  support_gauge_depth_and_spacing_mapping: {
    bucket: "topology_input_owner_required",
    nextEvidenceOwner: "grouped support gauge/depth/spacing and frame-independence input owner",
    selectedFollowUp: "grouped_topology_input_owner"
  }
} as const;

export const WALL_TRIPLE_LEAF_GATE_G8_TEST_OWNERSHIP: WallTripleLeafGateG8TestOwnership = {
  engine: [
    {
      path: "packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts",
      role: "pins blocked source-pack intake and representative rockwool-like route flips"
    },
    {
      path: "packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts",
      role: "classifies remaining source gaps and selects visible diagnostics/topology guard ownership"
    },
    {
      path: "packages/engine/src/dynamic-airborne-order-sensitivity.test.ts",
      role: "protects existing wall order-sensitive route boundaries"
    },
    {
      path: "packages/engine/src/dynamic-airborne-instability-repro.test.ts",
      role: "protects known dynamic-airborne route instability repros"
    },
    {
      path: "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts",
      role: "keeps role-defined floor order invariance separate from raw order inference"
    },
    {
      path: "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
      role: "pins floor layer edit stability before route smoothing"
    }
  ],
  futureGateG9EngineTarget: WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextFile,
  futureGateG9WebTarget: "apps/web/features/workbench/wall-triple-leaf-visible-diagnostics-and-topology-guard.test.ts",
  webVisible: [
    {
      path: "apps/web/features/workbench/dynamic-route-order-sensitivity.test.ts",
      role: "keeps user-visible wall route/order sensitivity explicit"
    },
    {
      path: "apps/web/features/workbench/dynamic-route-instability.test.ts",
      role: "keeps visible route-instability caveats paired with low-confidence values"
    },
    {
      path: "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts",
      role: "protects already-owned wall reorder-invariance classes"
    },
    {
      path: "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts",
      role: "keeps floor role/order edit cards stable while wall triple-leaf remains blocked"
    }
  ]
} as const;

function buildSourceGapDecisions(
  sourcePackEvaluation: WallTripleLeafLocalSourcePackAcquisitionEvaluation
): readonly WallTripleLeafSourceGapDecision[] {
  return sourcePackEvaluation.requirementIntakes.map((intake) => ({
    ...GAP_FOLLOW_UPS[intake.requirement.id],
    candidateIds: intake.candidates.map((candidate) => candidate.candidateId),
    requirementId: intake.requirement.id,
    runtimeBlocked: true
  }));
}

function decideOrderRisk(risk: WallTripleLeafOrderTopologyRisk): WallTripleLeafOrderTopologyRiskDecision {
  if (risk.id === "triple_leaf_double_leaf_route_flip" || risk.id === "duplicate_stack_family_flip") {
    return {
      disposition: "selected_for_gate_g9_visible_topology_guard",
      id: risk.id,
      risk,
      runtimeBlocked: true
    };
  }

  if (risk.id === "raw_floor_order_role_inference_sensitivity") {
    return {
      disposition: "preserve_existing_floor_role_tests",
      id: risk.id,
      risk,
      runtimeBlocked: true
    };
  }

  return {
    disposition: "preserve_existing_order_sensitive_tests",
    id: risk.id,
    risk,
    runtimeBlocked: true
  };
}

export function evaluateWallTripleLeafSourceGapAndOrderRisk(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  localSourcePackEvaluation?: WallTripleLeafLocalSourcePackAcquisitionEvaluation;
}): WallTripleLeafSourceGapAndOrderRiskEvaluation {
  const localSourcePackEvaluation =
    input.localSourcePackEvaluation ??
    evaluateWallTripleLeafLocalSourcePackAcquisition({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const sourceGapDecisions = buildSourceGapDecisions(localSourcePackEvaluation);
  const orderRiskDecisions = localSourcePackEvaluation.orderTopologyRisks.map(decideOrderRisk);

  return {
    apiShapeChange: false,
    confidencePromotion: false,
    evidencePromotion: false,
    localSourcePackEvaluation,
    numericRuntimeBehaviorChange: false,
    openSourceGapCount: sourceGapDecisions.length,
    orderRiskDecisions,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    routeGuardReadyForRuntime: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextFile,
    sourceGapDecisions,
    sourceGapsClosed: false,
    testOwnership: WALL_TRIPLE_LEAF_GATE_G8_TEST_OWNERSHIP,
    visibleDiagnosticsRequired: true,
    workbenchInputBehaviorChange: false
  };
}
