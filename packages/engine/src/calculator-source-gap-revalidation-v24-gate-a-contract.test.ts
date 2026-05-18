import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EstimateRequestSchema, type AirborneContext, type LayerInput, type RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  completeSourcePromotionOwnerSet: boolean;
  controlledUseHandoffClosed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  fieldOutputOwnerPolicyClosed: boolean;
  frequentCombinationGuardGreen: boolean;
  hostileApiImportGuardGreen: boolean;
  localMaterialMappingNamed: boolean;
  metricContextOwnerNamed: boolean;
  nearSourceAliasOwnerNamed: boolean;
  pairedEngineTestsNamed: boolean;
  pairedVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceCurveProvenanceNamed: boolean;
  sourcePromotionOwnerNamed: boolean;
  toleranceOwnerNamed: boolean;
};

type V24Candidate = {
  currentProof: string;
  firstMissingRequirement: string;
  id: string;
  rank: number;
  readiness: RuntimeReadiness;
  reason: string;
  runtimeBehaviorChange: false;
  selectedNext: boolean;
  selectedNextAction: string;
  selectedPlanningSurface: string;
  targetFile: string;
  userVisibleRisk: string;
  validationScope: readonly string[];
};

const CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
  latestClosedSlice: "company_internal_controlled_use_handoff_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "source_promotion_owner_set_readiness_guard_v1",
  selectedNextAction: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
  selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
  selectedRouteFamily: "source_promotion_owner_set_no_runtime_after_controlled_use_handoff",
  selectionStatus:
    "selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed",
  sliceId: "calculator_source_gap_revalidation_v24",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts",
  "packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts",
  "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const CONTROLLED_USE_HANDOFF_CLOSEOUT_CONSUMED = {
  artifact: "controlled_use_handoff_gate_c_closeout_consumed",
  controlledUsePackIsCurrentOperatorHandoff: true,
  directHighAccuracyLabelAllowedNow: false,
  handoffClosedNoRuntime: true,
  selectedSourceGapRevalidationV24: true
} as const;

const ROCKWOOL_URIS_EXACT_RUNTIME_STILL_BLOCKED_AFTER_CONTROLLED_USE = {
  artifact: "rockwool_uris_exact_runtime_still_blocked_after_controlled_use",
  exactSourceValidatedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  groupedScreeningAnswer: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  localRuntimeFixReadyNow: false,
  repeatUrisAcquisitionAllowedNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const SOURCE_PROMOTION_OWNER_SET_GUARD_SELECTED = {
  artifact: "source_promotion_owner_set_guard_selected",
  exactRuntimePromotionAllowedNow: false,
  requiredOwnerSet: [
    "source_provenance",
    "topology_owner",
    "material_mapping_owner",
    "metric_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_engine_tests",
    "paired_visible_tests"
  ],
  selectedNextSlice: "source_promotion_owner_set_readiness_guard_v1",
  selectedReason:
    "rockwool_exact_runtime_is_blocked_and_hostile_frequent_combination_guards_are_green_so_the_next_actionable_accuracy_step_is_preventing_near_source_source_row_or_source_locator_metadata_from_becoming_runtime_evidence_without_the_full_owner_set",
  targetFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts"
} as const;

const HOSTILE_API_IMPORT_AND_FREQUENT_COMBINATION_GREEN_CARRY_FORWARD = {
  artifact: "hostile_api_import_and_frequent_combination_green_carry_forward",
  estimateJson1e309RejectedByFiniteLayerSchema: true,
  frequentCombinationSnapshotsGreen: true,
  hostileApiImportMustRemainFailClosed: true,
  importSnapshotCannotSeedRuntime: true,
  noNewUncoveredBypassPathNamed: true
} as const;

const FIELD_OUTPUTS_NON_DESIGN_GRADE_CARRY_FORWARD = {
  artifact: "field_outputs_non_design_grade_carry_forward",
  designGradeFieldOutputsAllowedNow: false,
  finiteFieldOutputsRemainContinuations: true,
  fieldOutputOwnerPolicyClosed: true,
  sourceGapV24UsesFieldOutputPolicyAsGuardNotRuntimeEvidence: true
} as const;

const V24_RERANK_CANDIDATES: readonly V24Candidate[] = [
  {
    currentProof:
      "controlled_use_handoff_closeout_and_rockwool_policy_confirm_grouped_split_rockwool_is_rw41_screening_and_uris_packet_is_absent",
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_local_material_mapping_metric_context_and_tolerance_owner",
    id: "rockwool_uris_exact_source_owned_runtime_readiness",
    rank: 1,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: true,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: true,
      pairedVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "highest_visible_accuracy_defect_but_not_runtime_actionable_without_rights_safe_source_owned_curve_payload_and_complete_owner_set",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "hold_until_new_rights_safe_source_packet_or_equivalent_curve_payload_exists",
    selectedPlanningSurface: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "rockwool_rw41_screening_result_can_still_be_misread_as_exact_if_future_promotions_are_loose",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    currentProof:
      "source_promotion_hostile_gate_closed_finite_input_tightening_but_near_source_source_rows_and_source_locator_metadata_still_need_a_dedicated_owner_set_guard",
    firstMissingRequirement: "complete_source_provenance_topology_material_metric_tolerance_negative_boundary_and_visible_test_owner_set",
    id: "source_promotion_owner_set_readiness_guard",
    rank: 2,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: true,
      pairedVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "this_is_the_highest_actionable_no_runtime_accuracy_step_after_controlled_use_because_it_blocks_false_promotion_from_source_like_names_imports_or_locator_metadata_without_waiting_for_a_new_uris_packet",
    runtimeBehaviorChange: false,
    selectedNext: true,
    selectedNextAction: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
    selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
    targetFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts",
    userVisibleRisk:
      "near_source_or_official_sounding_rows_can_look_defensible_if_the_owner_set_is_not_explicit_at_runtime_boundaries",
    validationScope: [
      "source_promotion_owner_set_readiness_gate_a",
      "source_promotion_hostile_input_readiness_guard_gate_a",
      "company_internal_frequent_combination_lane_snapshot_guard_gate_a",
      "company_internal_frequent_combination_lane_snapshot_guard_gate_b_visible",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentProof: "finite_schema_import_and_hostile_matrix_guards_are_green_after_source_promotion_hostile_closeout",
    firstMissingRequirement: "new_uncovered_public_api_import_or_serialization_bypass_path",
    id: "hostile_api_import_fail_closed_followup",
    rank: 3,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_standalone_because_v24_names_no_new_uncovered_bypass_path",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_fail_closed_guards",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "bad_import_payloads_can_return_plausible_numeric_claims_if_guard_coverage_regresses",
    validationScope: ["raw_wall_hostile_input_answer_matrix", "raw_floor_hostile_input_answer_matrix"]
  },
  {
    currentProof: "company_internal_frequent_combination_gate_a_b_c_and_current_gate_remain_green",
    firstMissingRequirement: "new_frequent_wall_or_floor_lane_misclassification_repro_after_controlled_use",
    id: "frequent_combination_snapshot_followup",
    rank: 4,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_because_the_snapshot_guard_is_green_and_v24_found_no_new_lane_misclassification_repro",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_frequent_combination_snapshots",
    selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
    targetFile: "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
    userVisibleRisk: "common_wall_floor_combinations_can_silently_move_lanes_if_guard_coverage_regresses",
    validationScope: ["company_internal_frequent_combination_gate_a_b_c"]
  },
  {
    currentProof:
      "field_output_owner_policy_closed_and_controlled_use_handoff_keeps_field_outputs_non_design_grade",
    firstMissingRequirement: "new_uncovered_field_output_owner_or_visible_design_grade_leak",
    id: "field_output_owner_policy_followup",
    rank: 5,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: true,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: true
    },
    reason: "not_selected_because_v24_found_no_remaining_design_grade_leak_path",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_closed_non_design_grade_policy",
    selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
    targetFile: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
    userVisibleRisk: "finite_field_outputs_can_still_be_misused_if_copy_guard_is_removed",
    validationScope: ["field_output_owner_gate_a_b_c"]
  },
  {
    currentProof: "controlled_use_handoff_is_current_but_source_promotion_and_rockwool_exactness_remain_open",
    firstMissingRequirement: "source_promotion_owner_set_and_rockwool_exact_source_packet_or_explicit_hold",
    id: "productization_report_polish_after_correctness_blockers",
    rank: 6,
    readiness: {
      completeSourcePromotionOwnerSet: false,
      controlledUseHandoffClosed: true,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      frequentCombinationGuardGreen: true,
      hostileApiImportGuardGreen: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: false,
      pairedVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      sourcePromotionOwnerNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_until_correctness_blockers_are_fixed_or_explicitly_held",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "wait_for_correctness_blocker_closeout",
    selectedPlanningSurface: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    userVisibleRisk: "polished_outputs_can_increase_trust_in_screening_or_ownerless_values",
    validationScope: ["future_productization_slice"]
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const STUD_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const LSF_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const;

const LSF_NEAR_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "rockwool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const NEAR_SOURCE_ALIAS_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("calculator source-gap revalidation v24 Gate A contract", () => {
  it("lands V24 Gate A no-runtime and selects source-promotion owner-set readiness guard", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
      latestClosedSlice: "company_internal_controlled_use_handoff_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "source_promotion_owner_set_readiness_guard_v1",
      selectedNextAction: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
      selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
      selectedRouteFamily: "source_promotion_owner_set_no_runtime_after_controlled_use_handoff",
      selectionStatus:
        "selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed",
      sliceId: "calculator_source_gap_revalidation_v24",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("consumes controlled-use handoff closeout without turning it into runtime evidence", () => {
    const closeout = readRepoFile(
      "packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts"
    );

    expect(CONTROLLED_USE_HANDOFF_CLOSEOUT_CONSUMED).toEqual({
      artifact: "controlled_use_handoff_gate_c_closeout_consumed",
      controlledUsePackIsCurrentOperatorHandoff: true,
      directHighAccuracyLabelAllowedNow: false,
      handoffClosedNoRuntime: true,
      selectedSourceGapRevalidationV24: true
    });
    expect(closeout).toContain("company_internal_controlled_use_handoff_closed");
    expect(closeout).toContain("controlled_use_pack_is_current_operator_handoff");
    expect(closeout).toContain("calculator_source_gap_revalidation_v24_selected");
    expect(closeout).toContain("highAccuracyLabelAllowedByThisCloseout: false");
  });

  it("re-ranks source and accuracy candidates and selects exactly the owner-set guard", () => {
    expect(V24_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "rockwool_uris_exact_source_owned_runtime_readiness",
      "source_promotion_owner_set_readiness_guard",
      "hostile_api_import_fail_closed_followup",
      "frequent_combination_snapshot_followup",
      "field_output_owner_policy_followup",
      "productization_report_polish_after_correctness_blockers"
    ]);
    expect(V24_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(V24_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V24_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );

    expect(V24_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "source_promotion_owner_set_readiness_guard",
        readiness: expect.objectContaining({
          completeSourcePromotionOwnerSet: false,
          controlledUseHandoffClosed: true,
          frequentCombinationGuardGreen: true,
          hostileApiImportGuardGreen: true,
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false
        }),
        selectedNextAction: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
        selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
        targetFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts"
      })
    ]);
  });

  it("keeps Rockwool grouped triple-leaf flat-list and field outputs frozen as screening-only", () => {
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(ROCKWOOL_URIS_EXACT_RUNTIME_STILL_BLOCKED_AFTER_CONTROLLED_USE).toEqual({
      artifact: "rockwool_uris_exact_runtime_still_blocked_after_controlled_use",
      exactSourceValidatedNow: false,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      groupedScreeningAnswer: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      localRuntimeFixReadyNow: false,
      repeatUrisAcquisitionAllowedNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"]
    });
  });

  it("keeps exact source rows near-source aliases and source-like names separated", () => {
    const exact = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const near = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_NEAR_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const alias = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: NEAR_SOURCE_ALIAS_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(SOURCE_PROMOTION_OWNER_SET_GUARD_SELECTED).toEqual({
      artifact: "source_promotion_owner_set_guard_selected",
      exactRuntimePromotionAllowedNow: false,
      requiredOwnerSet: [
        "source_provenance",
        "topology_owner",
        "material_mapping_owner",
        "metric_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_engine_tests",
        "paired_visible_tests"
      ],
      selectedNextSlice: "source_promotion_owner_set_readiness_guard_v1",
      selectedReason:
        "rockwool_exact_runtime_is_blocked_and_hostile_frequent_combination_guards_are_green_so_the_next_actionable_accuracy_step_is_preventing_near_source_source_row_or_source_locator_metadata_from_becoming_runtime_evidence_without_the_full_owner_set",
      targetFile: "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts"
    });

    expect(exact).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 55,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(exact.warnings).toMatch(/Curated exact airborne lab match active/i);

    expect(near).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 53
    });
    expect(near.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(alias).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(alias.warnings).not.toMatch(/Curated exact airborne lab match active/i);
  });

  it("carries forward hostile import frequent-combination and field-output non-design-grade guards", () => {
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);
    const frequentEngineGuard = readRepoFile(
      "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts"
    );
    const frequentVisibleGuard = readRepoFile(
      "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts"
    );

    expect(HOSTILE_API_IMPORT_AND_FREQUENT_COMBINATION_GREEN_CARRY_FORWARD).toEqual({
      artifact: "hostile_api_import_and_frequent_combination_green_carry_forward",
      estimateJson1e309RejectedByFiniteLayerSchema: true,
      frequentCombinationSnapshotsGreen: true,
      hostileApiImportMustRemainFailClosed: true,
      importSnapshotCannotSeedRuntime: true,
      noNewUncoveredBypassPathNamed: true
    });
    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
    expect(frequentEngineGuard).toContain("company_internal_frequent_combination_snapshot_matrix");
    expect(frequentVisibleGuard).toContain("company_internal_visible_route_output_snapshot_guard");

    expect(FIELD_OUTPUTS_NON_DESIGN_GRADE_CARRY_FORWARD).toEqual({
      artifact: "field_outputs_non_design_grade_carry_forward",
      designGradeFieldOutputsAllowedNow: false,
      finiteFieldOutputsRemainContinuations: true,
      fieldOutputOwnerPolicyClosed: true,
      sourceGapV24UsesFieldOutputPolicyAsGuardNotRuntimeEvidence: true
    });
  });

  it("keeps docs and current-gate runner aligned with V24 and selected owner-set guard", () => {
    const docs = REQUIRED_ALIGNED_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of [
      CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A.selectionStatus,
      CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A.selectedImplementationSlice,
      CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A.targetFirstGateFile,
      CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A.selectedPlanningSurface,
      CONTROLLED_USE_HANDOFF_CLOSEOUT_CONSUMED.artifact,
      ROCKWOOL_URIS_EXACT_RUNTIME_STILL_BLOCKED_AFTER_CONTROLLED_USE.artifact,
      SOURCE_PROMOTION_OWNER_SET_GUARD_SELECTED.artifact,
      HOSTILE_API_IMPORT_AND_FREQUENT_COMBINATION_GREEN_CARRY_FORWARD.artifact,
      FIELD_OUTPUTS_NON_DESIGN_GRADE_CARRY_FORWARD.artifact
    ]) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts");
  });
});
