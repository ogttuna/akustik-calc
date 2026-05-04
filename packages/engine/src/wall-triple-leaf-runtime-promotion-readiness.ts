import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafEngineIntegrationFailClosed,
  type WallTripleLeafEngineIntegrationFailClosedEvaluation,
  type WallTripleLeafEngineIntegrationPrerequisiteId
} from "./wall-triple-leaf-engine-integration-fail-closed";
import type { WallTripleLeafSourceGapDecision } from "./wall-triple-leaf-source-gap-and-order-risk";
import type { WallTripleLeafVisibleDiagnosticId } from "./wall-triple-leaf-visible-diagnostics-and-topology-guard";

export type WallTripleLeafRuntimePromotionReadinessPrerequisiteId =
  | WallTripleLeafEngineIntegrationPrerequisiteId
  | "gate_j_company_internal_acceptance_rehearsal";

export type WallTripleLeafRuntimePromotionBlockerId =
  | "local_material_mapping_unowned"
  | "paired_runtime_tests_missing"
  | "runtime_topology_guards_not_ready"
  | "source_gaps_open"
  | "usable_local_source_pack_missing";

export type WallTripleLeafRuntimePromotionBlocker = {
  blocksRuntimePromotion: true;
  detail: string;
  id: WallTripleLeafRuntimePromotionBlockerId;
  prerequisiteId: WallTripleLeafEngineIntegrationPrerequisiteId;
  requiredBeforePromotion: readonly string[];
  visibleDiagnosticIds: readonly WallTripleLeafVisibleDiagnosticId[];
};

export type WallTripleLeafSourceGapClosureItem = {
  bucket: WallTripleLeafSourceGapDecision["bucket"];
  candidateIds: readonly string[];
  nextEvidenceOwner: string;
  requirementId: WallTripleLeafSourceGapDecision["requirementId"];
  requiredBeforeRuntime: true;
  selectedFollowUp: WallTripleLeafSourceGapDecision["selectedFollowUp"];
  selectedForGateL: true;
};

export type WallTripleLeafRuntimePromotionReadinessEvaluation = {
  apiShapeChange: false;
  blockedPrerequisiteIds: readonly WallTripleLeafEngineIntegrationPrerequisiteId[];
  canPromoteRuntime: false;
  confidencePromotion: false;
  engineIntegrationEvaluation: WallTripleLeafEngineIntegrationFailClosedEvaluation;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  gateJCompanyInternalAcceptancePassed: true;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  passedPrerequisiteIds: readonly WallTripleLeafRuntimePromotionReadinessPrerequisiteId[];
  proposalReportCopyChange: false;
  readinessDecision: "runtime_promotion_blocked_select_source_gap_closure";
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionBlockers: readonly WallTripleLeafRuntimePromotionBlocker[];
  runtimePromotionReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectedNextFile;
  sourceGapClosurePlan: readonly WallTripleLeafSourceGapClosureItem[];
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_k_runtime_promotion_readiness_and_source_gap_closure_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_l_source_gap_closure_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts",
  selectionStatus:
    "gate_k_blocked_runtime_promotion_no_runtime_selected_source_gap_closure_gate_l",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

function buildSourceGapClosurePlan(
  decisions: readonly WallTripleLeafSourceGapDecision[]
): readonly WallTripleLeafSourceGapClosureItem[] {
  return decisions.map((decision) => ({
    bucket: decision.bucket,
    candidateIds: decision.candidateIds,
    nextEvidenceOwner: decision.nextEvidenceOwner,
    requirementId: decision.requirementId,
    requiredBeforeRuntime: true,
    selectedFollowUp: decision.selectedFollowUp,
    selectedForGateL: true
  }));
}

function diagnosticIdsFor(
  evaluation: WallTripleLeafEngineIntegrationFailClosedEvaluation,
  prerequisiteId: WallTripleLeafEngineIntegrationPrerequisiteId
): readonly WallTripleLeafVisibleDiagnosticId[] {
  return evaluation.prerequisites.find((prerequisite) => prerequisite.id === prerequisiteId)?.diagnosticIds ?? [];
}

function buildRuntimePromotionBlocker(
  evaluation: WallTripleLeafEngineIntegrationFailClosedEvaluation,
  prerequisiteId: WallTripleLeafEngineIntegrationPrerequisiteId
): WallTripleLeafRuntimePromotionBlocker | null {
  switch (prerequisiteId) {
    case "gate_g4_local_material_mapping":
      return {
        blocksRuntimePromotion: true,
        detail:
          "Local gypsum board, rockwool, MLV, gypsum plaster, cavity, and support mappings are not owned as the NRC-like source family.",
        id: "local_material_mapping_unowned",
        prerequisiteId,
        requiredBeforePromotion: [
          "local gypsum_board Type C product mapping",
          "rockwool/mineral-wool measured row or accepted absorber equivalence",
          "MLV triple-leaf measured row or bounded limp-mass effect model",
          "gypsum plaster face-finish source row or bounded effect model",
          "local support gauge/depth/spacing mapping"
        ],
        visibleDiagnosticIds: diagnosticIdsFor(evaluation, prerequisiteId)
      };
    case "gate_g7_usable_local_source_pack":
      return {
        blocksRuntimePromotion: true,
        detail:
          "The local source-pack has no candidate with source rows, metric context, and tolerance ownership ready for runtime.",
        id: "usable_local_source_pack_missing",
        prerequisiteId,
        requiredBeforePromotion: [
          "at least one usable local source-pack candidate",
          "metric ownership for Rw/STC and one-third-octave TL curves",
          "tolerance owner for local substitutions"
        ],
        visibleDiagnosticIds: diagnosticIdsFor(evaluation, prerequisiteId)
      };
    case "gate_g8_source_gaps_closed": {
      const sourceGapDecisions =
        evaluation.visibleDiagnosticsAndTopologyGuardEvaluation.sourceGapAndOrderRiskEvaluation.sourceGapDecisions;

      return {
        blocksRuntimePromotion: true,
        detail:
          "Gate G8 still has open source-acquisition, bounded-effect-model, and topology-input-owner gaps.",
        id: "source_gaps_open",
        prerequisiteId,
        requiredBeforePromotion: sourceGapDecisions.map((decision) => decision.nextEvidenceOwner),
        visibleDiagnosticIds: diagnosticIdsFor(evaluation, prerequisiteId)
      };
    }
    case "gate_g9_route_topology_guards_runtime_ready":
      return {
        blocksRuntimePromotion: true,
        detail:
          "Grouped topology guards exist, but route-flip and duplicate-stack protections are not runtime-promotion ready.",
        id: "runtime_topology_guards_not_ready",
        prerequisiteId,
        requiredBeforePromotion: [
          "flat-list route-flip guard for rockwool-like edits",
          "duplicate-stack guard for many-layer hostile inputs",
          "paired visible tests proving guards stay active after promotion"
        ],
        visibleDiagnosticIds: diagnosticIdsFor(evaluation, prerequisiteId)
      };
    case "paired_engine_web_visible_runtime_tests":
      return {
        blocksRuntimePromotion: true,
        detail:
          "Acceptance coverage exists, but no paired engine and web visible tests own a future promoted runtime path.",
        id: "paired_runtime_tests_missing",
        prerequisiteId,
        requiredBeforePromotion: [
          "engine runtime-promotion contract",
          "web route-card promoted-path test",
          "web output-card promoted-path test",
          "web proposal/report promoted-path test",
          "web field R'w and DnT,w caveat tests"
        ],
        visibleDiagnosticIds: diagnosticIdsFor(evaluation, prerequisiteId)
      };
    default:
      return null;
  }
}

export function evaluateWallTripleLeafRuntimePromotionReadiness(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  engineIntegrationEvaluation?: WallTripleLeafEngineIntegrationFailClosedEvaluation;
  layers: readonly LayerInput[];
}): WallTripleLeafRuntimePromotionReadinessEvaluation {
  const engineIntegrationEvaluation =
    input.engineIntegrationEvaluation ??
    evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const sourceGapDecisions =
    engineIntegrationEvaluation.visibleDiagnosticsAndTopologyGuardEvaluation.sourceGapAndOrderRiskEvaluation
      .sourceGapDecisions;
  const runtimePromotionBlockers = engineIntegrationEvaluation.blockedPrerequisiteIds.flatMap((prerequisiteId) => {
    const blocker = buildRuntimePromotionBlocker(engineIntegrationEvaluation, prerequisiteId);

    return blocker ? [blocker] : [];
  });

  return {
    apiShapeChange: false,
    blockedPrerequisiteIds: engineIntegrationEvaluation.blockedPrerequisiteIds,
    canPromoteRuntime: false,
    confidencePromotion: false,
    engineIntegrationEvaluation,
    evidencePromotion: false,
    failClosedStrategy: engineIntegrationEvaluation.failClosedStrategy,
    gateJCompanyInternalAcceptancePassed: true,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    passedPrerequisiteIds: [
      ...engineIntegrationEvaluation.passedPrerequisiteIds,
      "gate_j_company_internal_acceptance_rehearsal"
    ],
    proposalReportCopyChange: false,
    readinessDecision: "runtime_promotion_blocked_select_source_gap_closure",
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionBlockers,
    runtimePromotionReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectedNextFile,
    sourceGapClosurePlan: buildSourceGapClosurePlan(sourceGapDecisions),
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
