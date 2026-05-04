import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard,
  type WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation,
  type WallTripleLeafVisibleDiagnosticId
} from "./wall-triple-leaf-visible-diagnostics-and-topology-guard";

export type WallTripleLeafEngineIntegrationPrerequisiteId =
  | "complete_grouped_wall_topology"
  | "gate_g2b_executable_source_curves"
  | "gate_g3_calibration_holdout_negative_boundaries"
  | "gate_g4_local_material_mapping"
  | "gate_g7_usable_local_source_pack"
  | "gate_g8_source_gaps_closed"
  | "gate_g9_route_topology_guards_runtime_ready"
  | "paired_engine_web_visible_runtime_tests";

export type WallTripleLeafEngineIntegrationPrerequisiteStatus = "blocked" | "passed";

export type WallTripleLeafEngineIntegrationPrerequisite = {
  diagnosticIds: readonly WallTripleLeafVisibleDiagnosticId[];
  gateOwner: "G2B" | "G3" | "G4" | "G7" | "G8" | "G9" | "H";
  id: WallTripleLeafEngineIntegrationPrerequisiteId;
  requiredForRuntime: true;
  status: WallTripleLeafEngineIntegrationPrerequisiteStatus;
};

export type WallTripleLeafEngineIntegrationFailClosedEvaluation = {
  apiShapeChange: false;
  blockedPrerequisiteIds: readonly WallTripleLeafEngineIntegrationPrerequisiteId[];
  canIntegrateRuntime: false;
  confidencePromotion: false;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  integrationDecision: "fail_closed_screening_runtime_remains_active";
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  passedPrerequisiteIds: readonly WallTripleLeafEngineIntegrationPrerequisiteId[];
  prerequisites: readonly WallTripleLeafEngineIntegrationPrerequisite[];
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectedNextFile;
  visibleDiagnosticsAndTopologyGuardEvaluation: WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_h_engine_integration_fail_closed_prerequisite_check_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_i_web_visible_grouped_topology_inputs_no_runtime",
  selectedNextFile: "apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts",
  selectionStatus:
    "gate_h_landed_engine_integration_fail_closed_prerequisite_check_no_runtime_selected_web_visible_grouped_topology_inputs_gate_i",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

function status(value: boolean): WallTripleLeafEngineIntegrationPrerequisiteStatus {
  return value ? "passed" : "blocked";
}

function buildPrerequisites(
  evaluation: WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation
): readonly WallTripleLeafEngineIntegrationPrerequisite[] {
  const sourceGapEvaluation = evaluation.sourceGapAndOrderRiskEvaluation;
  const sourcePackEvaluation = sourceGapEvaluation.localSourcePackEvaluation;
  const localSourceEvaluation = sourcePackEvaluation.localSourceAcquisitionEvaluation;
  const localMappingEvaluation = localSourceEvaluation.blockedDiagnosticsEvaluation.localMappingEvaluation;
  const guardRuntimeReady = evaluation.groupedTopologyGuards.every((guard) => guard.readyForRuntimePromotion);

  return [
    {
      diagnosticIds: [],
      gateOwner: "G2B",
      id: "gate_g2b_executable_source_curves",
      requiredForRuntime: true,
      status: status(localMappingEvaluation.calibrationFit.qcPassed)
    },
    {
      diagnosticIds: [],
      gateOwner: "G3",
      id: "gate_g3_calibration_holdout_negative_boundaries",
      requiredForRuntime: true,
      status: status(localMappingEvaluation.sourceFamilyCalibrationPass && localMappingEvaluation.negativeBoundariesPreserved)
    },
    {
      diagnosticIds: ["triple_leaf_visible_route_flip_grouped_topology_guard"],
      gateOwner: "H",
      id: "complete_grouped_wall_topology",
      requiredForRuntime: true,
      status: status(localMappingEvaluation.groupedTopologyComplete)
    },
    {
      diagnosticIds: [
        "triple_leaf_visible_local_type_c_board_source_gap",
        "triple_leaf_visible_rockwool_equivalence_source_gap",
        "triple_leaf_visible_50mm_cavity_source_gap",
        "triple_leaf_visible_mlv_effect_model_gap",
        "triple_leaf_visible_gypsum_plaster_effect_model_gap",
        "triple_leaf_visible_support_topology_owner_gap"
      ],
      gateOwner: "G4",
      id: "gate_g4_local_material_mapping",
      requiredForRuntime: true,
      status: status(localMappingEvaluation.localMappingOwned)
    },
    {
      diagnosticIds: [
        "triple_leaf_visible_local_type_c_board_source_gap",
        "triple_leaf_visible_rockwool_equivalence_source_gap",
        "triple_leaf_visible_50mm_cavity_source_gap",
        "triple_leaf_visible_mlv_effect_model_gap",
        "triple_leaf_visible_gypsum_plaster_effect_model_gap"
      ],
      gateOwner: "G7",
      id: "gate_g7_usable_local_source_pack",
      requiredForRuntime: true,
      status: status(sourcePackEvaluation.usableRuntimeCandidateCount > 0 && sourcePackEvaluation.sourcePackReadyForMappingTolerance)
    },
    {
      diagnosticIds: [
        "triple_leaf_visible_local_type_c_board_source_gap",
        "triple_leaf_visible_rockwool_equivalence_source_gap",
        "triple_leaf_visible_50mm_cavity_source_gap",
        "triple_leaf_visible_mlv_effect_model_gap",
        "triple_leaf_visible_gypsum_plaster_effect_model_gap",
        "triple_leaf_visible_support_topology_owner_gap"
      ],
      gateOwner: "G8",
      id: "gate_g8_source_gaps_closed",
      requiredForRuntime: true,
      status: status(sourceGapEvaluation.sourceGapsClosed)
    },
    {
      diagnosticIds: [
        "triple_leaf_visible_route_flip_grouped_topology_guard",
        "triple_leaf_visible_duplicate_stack_grouped_topology_guard"
      ],
      gateOwner: "G9",
      id: "gate_g9_route_topology_guards_runtime_ready",
      requiredForRuntime: true,
      status: status(guardRuntimeReady)
    },
    {
      diagnosticIds: ["triple_leaf_visible_runtime_promotion_missing_paired_tests"],
      gateOwner: "G9",
      id: "paired_engine_web_visible_runtime_tests",
      requiredForRuntime: true,
      status: status(evaluation.webVisibleRuntimeTestsReady && localMappingEvaluation.pairedVisibleRuntimeTestsReady)
    }
  ];
}

export function evaluateWallTripleLeafEngineIntegrationFailClosed(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  visibleDiagnosticsAndTopologyGuardEvaluation?: WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation;
}): WallTripleLeafEngineIntegrationFailClosedEvaluation {
  const visibleDiagnosticsAndTopologyGuardEvaluation =
    input.visibleDiagnosticsAndTopologyGuardEvaluation ??
    evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const prerequisites = buildPrerequisites(visibleDiagnosticsAndTopologyGuardEvaluation);
  const blockedPrerequisiteIds = prerequisites
    .filter((prerequisite) => prerequisite.status === "blocked")
    .map((prerequisite) => prerequisite.id);
  const passedPrerequisiteIds = prerequisites
    .filter((prerequisite) => prerequisite.status === "passed")
    .map((prerequisite) => prerequisite.id);

  return {
    apiShapeChange: false,
    blockedPrerequisiteIds,
    canIntegrateRuntime: false,
    confidencePromotion: false,
    evidencePromotion: false,
    failClosedStrategy: "multileaf_screening_blend",
    integrationDecision: "fail_closed_screening_runtime_remains_active",
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    passedPrerequisiteIds,
    prerequisites,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectedNextFile,
    visibleDiagnosticsAndTopologyGuardEvaluation,
    workbenchInputBehaviorChange: false
  };
}
