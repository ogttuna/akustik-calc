import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceGapAndOrderRisk,
  type WallTripleLeafOrderTopologyRiskDecision,
  type WallTripleLeafSourceGapAndOrderRiskEvaluation,
  type WallTripleLeafSourceGapDecision
} from "./wall-triple-leaf-source-gap-and-order-risk";

export type WallTripleLeafVisibleDiagnosticSurface =
  | "developer_trace"
  | "output_card"
  | "proposal_report"
  | "route_card"
  | "workbench_input";

export type WallTripleLeafVisibleDiagnosticId =
  | "triple_leaf_visible_50mm_cavity_source_gap"
  | "triple_leaf_visible_duplicate_stack_grouped_topology_guard"
  | "triple_leaf_visible_gypsum_plaster_effect_model_gap"
  | "triple_leaf_visible_local_type_c_board_source_gap"
  | "triple_leaf_visible_mlv_effect_model_gap"
  | "triple_leaf_visible_rockwool_equivalence_source_gap"
  | "triple_leaf_visible_route_flip_grouped_topology_guard"
  | "triple_leaf_visible_runtime_promotion_missing_paired_tests"
  | "triple_leaf_visible_screening_result_not_validated"
  | "triple_leaf_visible_support_topology_owner_gap";

export type WallTripleLeafVisibleDiagnostic = {
  audience: "developer" | "user" | "user_and_developer";
  blocksRuntime: true;
  detail: string;
  id: WallTripleLeafVisibleDiagnosticId;
  requiredBeforeRuntime: readonly string[];
  source:
    | "gate_g5_screening_diagnostic"
    | "gate_g8_order_risk"
    | "gate_g8_source_gap"
    | "gate_g9_runtime_test_guard";
  summary: string;
  surfaces: readonly WallTripleLeafVisibleDiagnosticSurface[];
};

export type WallTripleLeafGroupedTopologyGuardId =
  | "duplicate_stack_guard_required"
  | "flat_list_route_flip_guard_required"
  | "grouped_triple_leaf_roles_required"
  | "paired_visible_tests_runtime_block_guard"
  | "source_gap_runtime_block_guard";

export type WallTripleLeafGroupedTopologyGuard = {
  blocksRuntime: true;
  coveredRiskIds: readonly WallTripleLeafOrderTopologyRiskDecision["id"][];
  id: WallTripleLeafGroupedTopologyGuardId;
  ownedByGateG9: true;
  readyForRuntimePromotion: false;
  requiredBeforeRuntime: readonly string[];
  surfaces: readonly WallTripleLeafVisibleDiagnosticSurface[];
};

export type WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation = {
  apiShapeChange: false;
  confidencePromotion: false;
  evidencePromotion: false;
  groupedTopologyGuards: readonly WallTripleLeafGroupedTopologyGuard[];
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectedNextFile;
  sourceGapAndOrderRiskEvaluation: WallTripleLeafSourceGapAndOrderRiskEvaluation;
  visibleDiagnosticContractOwned: true;
  visibleDiagnostics: readonly WallTripleLeafVisibleDiagnostic[];
  visibleDiagnosticsBlockRuntime: true;
  webVisibleRuntimeTestsReady: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g9_visible_diagnostics_and_grouped_topology_guard_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_h_engine_integration_fail_closed_prerequisite_check",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts",
  selectionStatus:
    "gate_g9_landed_visible_diagnostics_and_grouped_topology_guard_no_runtime_selected_engine_integration_fail_closed_gate_h",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_GAP_DIAGNOSTICS: Record<
  WallTripleLeafSourceGapDecision["requirementId"],
  Pick<WallTripleLeafVisibleDiagnostic, "audience" | "detail" | "id" | "surfaces" | "summary">
> = {
  gypsum_plaster_face_finish_effect_model: {
    audience: "user_and_developer",
    detail: "Gypsum plaster is still a face-finish effect gap, not an owned triple-leaf source-family layer.",
    id: "triple_leaf_visible_gypsum_plaster_effect_model_gap",
    surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"],
    summary: "Gypsum plaster needs a bounded effect model before exact triple-leaf use."
  },
  local_50mm_rockwool_cavity_source_row: {
    audience: "user_and_developer",
    detail:
      "The local assembly uses 50 mm rockwool cavities, while the calibrated NRC-like rows do not own that cavity depth and fill combination.",
    id: "triple_leaf_visible_50mm_cavity_source_gap",
    surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"],
    summary: "The local 50 mm two-cavity rockwool row is still missing."
  },
  local_type_c_board_product_mapping: {
    audience: "user_and_developer",
    detail:
      "The visible generic gypsum board layer is not tied to a local Type C product with source-family mass/thickness tolerance.",
    id: "triple_leaf_visible_local_type_c_board_source_gap",
    surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"],
    summary: "Local gypsum board needs Type C product ownership."
  },
  mlv_limp_mass_triple_leaf_effect_model: {
    audience: "user_and_developer",
    detail: "MLV remains a limp-mass effect gap because no same-position triple-leaf row or bounded band model is owned.",
    id: "triple_leaf_visible_mlv_effect_model_gap",
    surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"],
    summary: "MLV needs a bounded triple-leaf effect model before exact use."
  },
  rockwool_absorber_equivalence_or_measured_row: {
    audience: "user_and_developer",
    detail:
      "Rockwool/mineral-wool cannot inherit glass-fiber batt behavior until measured rows or flow-resistivity/density equivalence are owned.",
    id: "triple_leaf_visible_rockwool_equivalence_source_gap",
    surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"],
    summary: "Rockwool absorber equivalence is still unowned."
  },
  support_gauge_depth_and_spacing_mapping: {
    audience: "user_and_developer",
    detail:
      "The grouped wall topology still lacks exact support gauge, depth, spacing, and frame-independence ownership.",
    id: "triple_leaf_visible_support_topology_owner_gap",
    surfaces: ["workbench_input", "route_card", "proposal_report", "developer_trace"],
    summary: "Support topology inputs are not exact enough for source-family promotion."
  }
} as const;

const SCREENING_DIAGNOSTIC: WallTripleLeafVisibleDiagnostic = {
  audience: "user_and_developer",
  blocksRuntime: true,
  detail:
    "The current split-rockwool value is the low-confidence screening branch, not a calibrated triple-leaf solver answer.",
  id: "triple_leaf_visible_screening_result_not_validated",
  requiredBeforeRuntime: [
    "close all Gate G8 source gaps",
    "own grouped topology guards",
    "pass paired engine and web-visible runtime tests"
  ],
  source: "gate_g5_screening_diagnostic",
  summary: "Current Rw 41 must stay labeled as screening only.",
  surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"]
};

const PAIRED_TEST_DIAGNOSTIC: WallTripleLeafVisibleDiagnostic = {
  audience: "developer",
  blocksRuntime: true,
  detail:
    "No future triple-leaf runtime path can promote until the engine contract and matching web route/output/proposal/workbench tests are both present.",
  id: "triple_leaf_visible_runtime_promotion_missing_paired_tests",
  requiredBeforeRuntime: [
    "engine runtime-promotion contract",
    "web route-card test",
    "web output-card test",
    "web proposal/report test",
    "web workbench-input test"
  ],
  source: "gate_g9_runtime_test_guard",
  summary: "Paired engine/web visible runtime tests still block promotion.",
  surfaces: ["developer_trace", "route_card", "output_card", "proposal_report"]
};

function buildSourceGapDiagnostic(decision: WallTripleLeafSourceGapDecision): WallTripleLeafVisibleDiagnostic {
  const diagnostic = SOURCE_GAP_DIAGNOSTICS[decision.requirementId];

  return {
    ...diagnostic,
    blocksRuntime: true,
    requiredBeforeRuntime: [decision.nextEvidenceOwner, ...decision.candidateIds],
    source: "gate_g8_source_gap"
  };
}

function buildOrderRiskDiagnostic(decision: WallTripleLeafOrderTopologyRiskDecision): WallTripleLeafVisibleDiagnostic | null {
  if (decision.disposition !== "selected_for_gate_g9_visible_topology_guard") {
    return null;
  }

  if (decision.id === "duplicate_stack_family_flip") {
    return {
      audience: "user_and_developer",
      blocksRuntime: true,
      detail:
        "Duplicating or over-stacking a whole wall can change the selected family; the visible route must keep this as a guarded low-confidence condition.",
      id: "triple_leaf_visible_duplicate_stack_grouped_topology_guard",
      requiredBeforeRuntime: [
        "duplicate-stack normalization policy",
        "many-layer route guard",
        "paired visible tests proving the guard survives user-hostile edits"
      ],
      source: "gate_g8_order_risk",
      summary: "Duplicate stack edits need an explicit topology guard.",
      surfaces: ["workbench_input", "route_card", "output_card", "proposal_report", "developer_trace"]
    };
  }

  return {
    audience: "user_and_developer",
    blocksRuntime: true,
    detail:
      "A small flat-list layer move can flip the wall between double-leaf and multileaf screening; grouped topology must own the leaf/cavity roles before exact runtime.",
    id: "triple_leaf_visible_route_flip_grouped_topology_guard",
    requiredBeforeRuntime: [
      "side A / cavity 1 / internal leaf / cavity 2 / side B role ownership",
      "route-flip guard for flat-list edits",
      "paired visible tests for the rockwool reorder repro"
    ],
    source: "gate_g8_order_risk",
    summary: "Rockwool-like reorder route flips need a grouped topology guard.",
    surfaces: ["workbench_input", "route_card", "output_card", "proposal_report", "developer_trace"]
  };
}

function buildGroupedTopologyGuards(
  evaluation: WallTripleLeafSourceGapAndOrderRiskEvaluation
): readonly WallTripleLeafGroupedTopologyGuard[] {
  const selectedRiskIds = evaluation.orderRiskDecisions
    .filter((decision) => decision.disposition === "selected_for_gate_g9_visible_topology_guard")
    .map((decision) => decision.id);

  return [
    {
      blocksRuntime: true,
      coveredRiskIds: ["triple_leaf_double_leaf_route_flip"],
      id: "grouped_triple_leaf_roles_required",
      ownedByGateG9: true,
      readyForRuntimePromotion: false,
      requiredBeforeRuntime: [
        "visible Side A / cavity 1 / internal leaf / cavity 2 / Side B role ownership",
        "missing-field policy for incomplete grouped topology"
      ],
      surfaces: ["workbench_input", "route_card", "developer_trace"]
    },
    {
      blocksRuntime: true,
      coveredRiskIds: ["triple_leaf_double_leaf_route_flip"],
      id: "flat_list_route_flip_guard_required",
      ownedByGateG9: true,
      readyForRuntimePromotion: false,
      requiredBeforeRuntime: [
        "engine guard proving benign reorder does not silently claim exact runtime",
        "web visible guard for the rockwool reorder repro"
      ],
      surfaces: ["workbench_input", "route_card", "output_card", "developer_trace"]
    },
    {
      blocksRuntime: true,
      coveredRiskIds: ["duplicate_stack_family_flip"],
      id: "duplicate_stack_guard_required",
      ownedByGateG9: true,
      readyForRuntimePromotion: false,
      requiredBeforeRuntime: [
        "many-layer duplicate-stack guard",
        "finite low-confidence fallback for user-hostile over-stacking"
      ],
      surfaces: ["workbench_input", "route_card", "output_card", "developer_trace"]
    },
    {
      blocksRuntime: true,
      coveredRiskIds: selectedRiskIds,
      id: "source_gap_runtime_block_guard",
      ownedByGateG9: true,
      readyForRuntimePromotion: false,
      requiredBeforeRuntime: evaluation.sourceGapDecisions.map((decision) => decision.nextEvidenceOwner),
      surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"]
    },
    {
      blocksRuntime: true,
      coveredRiskIds: selectedRiskIds,
      id: "paired_visible_tests_runtime_block_guard",
      ownedByGateG9: true,
      readyForRuntimePromotion: false,
      requiredBeforeRuntime: [
        evaluation.testOwnership.futureGateG9EngineTarget,
        evaluation.testOwnership.futureGateG9WebTarget
      ],
      surfaces: ["route_card", "output_card", "proposal_report", "developer_trace"]
    }
  ];
}

function buildVisibleDiagnostics(
  evaluation: WallTripleLeafSourceGapAndOrderRiskEvaluation
): readonly WallTripleLeafVisibleDiagnostic[] {
  return [
    SCREENING_DIAGNOSTIC,
    ...evaluation.sourceGapDecisions.map(buildSourceGapDiagnostic),
    ...evaluation.orderRiskDecisions.flatMap((decision) => {
      const diagnostic = buildOrderRiskDiagnostic(decision);

      return diagnostic ? [diagnostic] : [];
    }),
    PAIRED_TEST_DIAGNOSTIC
  ];
}

export function evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceGapAndOrderRiskEvaluation?: WallTripleLeafSourceGapAndOrderRiskEvaluation;
}): WallTripleLeafVisibleDiagnosticsAndTopologyGuardEvaluation {
  const sourceGapAndOrderRiskEvaluation =
    input.sourceGapAndOrderRiskEvaluation ??
    evaluateWallTripleLeafSourceGapAndOrderRisk({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });

  return {
    apiShapeChange: false,
    confidencePromotion: false,
    evidencePromotion: false,
    groupedTopologyGuards: buildGroupedTopologyGuards(sourceGapAndOrderRiskEvaluation),
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectedNextFile,
    sourceGapAndOrderRiskEvaluation,
    visibleDiagnosticContractOwned: true,
    visibleDiagnostics: buildVisibleDiagnostics(sourceGapAndOrderRiskEvaluation),
    visibleDiagnosticsBlockRuntime: true,
    webVisibleRuntimeTestsReady: false,
    workbenchInputBehaviorChange: false
  };
}
