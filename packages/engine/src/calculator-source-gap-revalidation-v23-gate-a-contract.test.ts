import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  boundedScreeningPolicyReadyToSelect: boolean;
  concreteUncoveredApiOrImportPathNamed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  fieldOutputOwnerPolicyClosed: boolean;
  hostileInputOwnerNamed: boolean;
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

type V23Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_field_output_owner_policy_closeout",
  latestClosedSlice: "field_output_owner_and_design_grade_policy_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
  selectedNextAction: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
  selectedPlanningSurface:
    "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  selectedRouteFamily: "rockwool_triple_leaf_explicit_screening_only_no_runtime",
  selectionStatus:
    "selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed",
  sliceId: "calculator_source_gap_revalidation_v23",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts",
  "packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts",
  "apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const FIELD_OUTPUT_OWNER_POLICY_CLOSEOUT_CONSUMED = {
  artifact: "field_output_owner_policy_gate_c_closeout_summary",
  designGradeFieldOutputsAllowedNow: false,
  fieldOutputOwnerPolicyClosed: true,
  fieldOutputPolicyIsRockwoolSourceEvidence: false,
  finiteFieldOutputsRemainNonDesignGrade: true,
  selectedNextMustNotRepeatFieldOutputCopyOnlyWork: true
} as const;

const ROCKWOOL_URIS_EXACT_RUNTIME_STILL_BLOCKED = {
  artifact: "rockwool_uris_exact_runtime_still_blocked",
  exactSourceValidatedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  groupedScreeningAnswer: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  localRuntimeFixReadyNow: false,
  repeatUrisAcquisitionAllowedNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const ROCKWOOL_EXPLICIT_SCREENING_ONLY_POLICY_SELECTED = {
  artifact: "rockwool_explicit_screening_only_policy_selected",
  exactRuntimePromotionAllowedNow: false,
  nextSliceClosesCompanyOpeningRockwoolCriterionOnlyIfVisibleAndEngineSurfacesAgree: true,
  selectedNextSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
  selectedReason:
    "exact_runtime_is_blocked_but_company_internal_opening_requires_rockwool_to_be_exact_or_explicitly_screening_only",
  targetFile:
    "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts"
} as const;

const SOURCE_PROMOTION_AND_HOSTILE_INPUT_CARRY_FORWARD = {
  artifact: "source_promotion_and_hostile_input_ownership_carry_forward",
  hostileApiImportMustFailClosed: true,
  nearSourceAliasesRemainContextOnly: true,
  sourcePromotionRequires: [
    "topology_owner",
    "material_mapping_owner",
    "metric_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_visible_tests"
  ],
  sourcePromotionStillOpenAfterV23: true
} as const;

const PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS = {
  artifact: "pre_company_internal_use_exit_criteria",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  criteriaClosedBeforeV23: ["field_outputs_never_design_grade_without_owner"],
  criteriaTargetedBySelectedNextSlice: ["rockwool_triple_leaf_exact_or_explicit_screening_only"],
  remainingBlockingIdsAfterSelectedNextLands: [
    "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
    "hostile_api_import_payloads_fail_closed",
    "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
  ]
} as const;

const URIS_2006_PACKET_BLOCKER = {
  artifact: "repeat_uris_acquisition_blocked_without_new_packet",
  blockedWithout: [
    "rights_safe_source_owned_curve_payload",
    "authorized_tdm_payload",
    "page_image_packet",
    "numeric_band_vector_packet",
    "rating_metric_and_tolerance_owner"
  ],
  repeatAcquisitionSelectedNow: false,
  rightsSafeRuntimePacketAvailable: false
} as const;

const V23_RERANK_CANDIDATES: readonly V23Candidate[] = [
  {
    currentProof:
      "gate_u_v22_and_field_owner_gate_c_all_confirm_uris_payload_absent_and_grouped_split_rockwool_is_rw41_screening_not_source_validated",
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_local_material_mapping_metric_context_and_tolerance_owner",
    id: "rockwool_uris_exact_source_owned_runtime_readiness",
    rank: 1,
    readiness: {
      boundedScreeningPolicyReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: true,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
      "highest_visible_accuracy_blocker_but_not_runtime_actionable_without_a_source_owned_packet_and_complete_owner_set",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "hold_until_new_rights_safe_source_packet_or_equivalent_curve_payload_exists",
    selectedPlanningSurface: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "rw41_screening_answer_can_be_misread_as_exact_if_policy_surfaces_are_weak",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    currentProof:
      "field_output_owner_criterion_is_closed_and_company_opening_still_requires_rockwool_exact_or_explicit_screening_only",
    firstMissingRequirement: "engine_route_output_card_report_policy_that_marks_rockwool_triple_leaf_as_screening_only_not_fixed",
    id: "rockwool_triple_leaf_explicit_screening_only_company_opening_policy",
    rank: 2,
    readiness: {
      boundedScreeningPolicyReadyToSelect: true,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: true,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
    reason:
      "this_is_the_highest_actionable_no_runtime_accuracy_step_because_it_reduces_private_use_risk_without_pretending_rockwool_is_fixed",
    runtimeBehaviorChange: false,
    selectedNext: true,
    selectedNextAction: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
    selectedPlanningSurface:
      "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
    targetFile:
      "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
    userVisibleRisk:
      "company_internal_users_can_treat_the_rw41_triple_leaf_screening_result_as_a_defensible_exact_design_value",
    validationScope: [
      "rockwool_triple_leaf_screening_only_policy_gate_a",
      "wall_triple_leaf_company_internal_acceptance_rehearsal",
      "wall_flat_list_multileaf_family_guard_route_card",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentProof:
      "near_source_manufacturer_and_material_alias_rows_remain_context_only_and_do_not_promote_runtime_without_owned_mapping",
    firstMissingRequirement: "row_specific_topology_material_metric_tolerance_negative_boundaries_and_visible_tests",
    id: "source_promotion_ownership_for_near_source_aliases_and_source_rows",
    rank: 3,
    readiness: {
      boundedScreeningPolicyReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
    reason: "important_but_no_new_false_promotion_or_unowned_source_row_was_reproduced_after_field_owner_closeout",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_source_promotion_ownership_until_a_bounded_row_or_false_promotion_bug_is_named",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "official_or_similar_material_names_can_look_exact_without_owned_mapping",
    validationScope: ["calculator_route_source_risk_register"]
  },
  {
    currentProof: "hostile_api_import_and_frequent_combination_guards_are_green_but_must_remain_exit_criteria",
    firstMissingRequirement: "new_uncovered_public_api_import_or_serialization_bypass_path",
    id: "hostile_api_import_and_frequent_combination_guardrails",
    rank: 4,
    readiness: {
      boundedScreeningPolicyReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
    reason: "not_selected_standalone_because_v23_names_no_new_uncovered_bypass_path",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_fail_closed_guards",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "bad_import_payloads_can_return_plausible_numeric_claims_if_guard_coverage_regresses",
    validationScope: ["raw_wall_hostile_input_answer_matrix", "raw_floor_hostile_input_answer_matrix"]
  },
  {
    currentProof:
      "field_output_owner_gate_a_b_c_closed_the_visible_non_design_grade_policy_and_v23_found_no_remaining_copy_only_gap",
    firstMissingRequirement: "new_uncovered_field_output_owner_or_visible_policy_regression",
    id: "field_output_owner_policy_followup",
    rank: 5,
    readiness: {
      boundedScreeningPolicyReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
    reason: "not_selected_because_the_policy_closed_and_v23_should_not_repeat_copy_only_work",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_closed_policy_as_company_opening_prerequisite",
    selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
    targetFile: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
    userVisibleRisk: "finite_field_outputs_can_still_be_misused_if_copy_guard_is_removed",
    validationScope: ["field_output_owner_gate_a_b_c"]
  },
  {
    currentProof: "productization_remains_secondary_while_rockwool_and_source_promotion_blockers_are_open",
    firstMissingRequirement: "rockwool_explicit_screening_policy_source_promotion_hostile_input_and_final_validation",
    id: "productization_report_polish_after_correctness_blockers",
    rank: 6,
    readiness: {
      boundedScreeningPolicyReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerPolicyClosed: true,
      hostileInputOwnerNamed: true,
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
    reason: "not_selected_until_correctness_blockers_are_fixed_or_explicitly_screening_only",
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

const WALL_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[], airborneContext: AirborneContext = WALL_LAB_CONTEXT) {
  const result = calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    stc: result.metrics.estimatedStc,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation v23 Gate A contract", () => {
  it("lands V23 Gate A no-runtime and selects explicit Rockwool screening-only policy work", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_field_output_owner_policy_closeout",
      latestClosedSlice: "field_output_owner_and_design_grade_policy_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
      selectedNextAction: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
      selectedPlanningSurface:
        "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
      selectedRouteFamily: "rockwool_triple_leaf_explicit_screening_only_no_runtime",
      selectionStatus:
        "selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed",
      sliceId: "calculator_source_gap_revalidation_v23",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(existsSync(join(REPO_ROOT, CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A.targetFirstGateFile))).toBe(
      true
    );
  });

  it("consumes field-output owner policy closeout without treating it as runtime source evidence", () => {
    expect(FIELD_OUTPUT_OWNER_POLICY_CLOSEOUT_CONSUMED).toEqual({
      artifact: "field_output_owner_policy_gate_c_closeout_summary",
      designGradeFieldOutputsAllowedNow: false,
      fieldOutputOwnerPolicyClosed: true,
      fieldOutputPolicyIsRockwoolSourceEvidence: false,
      finiteFieldOutputsRemainNonDesignGrade: true,
      selectedNextMustNotRepeatFieldOutputCopyOnlyWork: true
    });
  });

  it("re-ranks source and accuracy candidates and selects only the bounded Rockwool screening policy step", () => {
    expect(V23_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "rockwool_uris_exact_source_owned_runtime_readiness",
      "rockwool_triple_leaf_explicit_screening_only_company_opening_policy",
      "source_promotion_ownership_for_near_source_aliases_and_source_rows",
      "hostile_api_import_and_frequent_combination_guardrails",
      "field_output_owner_policy_followup",
      "productization_report_polish_after_correctness_blockers"
    ]);
    expect(V23_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(V23_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V23_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );

    expect(V23_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "rockwool_triple_leaf_explicit_screening_only_company_opening_policy",
        readiness: expect.objectContaining({
          boundedScreeningPolicyReadyToSelect: true,
          fieldOutputOwnerPolicyClosed: true,
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false
        }),
        selectedNextAction: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
        selectedPlanningSurface:
          "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
        targetFile:
          "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts"
      })
    ]);
  });

  it("keeps Rockwool grouped triple-leaf and flat-list swaps screening-only and not source validated", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, GROUPED_SPLIT_ROCKWOOL_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));

    expect(ROCKWOOL_URIS_EXACT_RUNTIME_STILL_BLOCKED).toEqual({
      artifact: "rockwool_uris_exact_runtime_still_blocked",
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
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw", "STC"]
    });
    expect(grouped.warnings).toContain("family physics prediction");
    expect(grouped.warnings).toContain("Dynamic airborne confidence is medium");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
      supported: ["Rw", "STC"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
  });

  it("keeps Uris acquisition blocked and records why direct exact promotion is not available", () => {
    expect(URIS_2006_PACKET_BLOCKER).toEqual({
      artifact: "repeat_uris_acquisition_blocked_without_new_packet",
      blockedWithout: [
        "rights_safe_source_owned_curve_payload",
        "authorized_tdm_payload",
        "page_image_packet",
        "numeric_band_vector_packet",
        "rating_metric_and_tolerance_owner"
      ],
      repeatAcquisitionSelectedNow: false,
      rightsSafeRuntimePacketAvailable: false
    });
    expect(ROCKWOOL_EXPLICIT_SCREENING_ONLY_POLICY_SELECTED).toEqual({
      artifact: "rockwool_explicit_screening_only_policy_selected",
      exactRuntimePromotionAllowedNow: false,
      nextSliceClosesCompanyOpeningRockwoolCriterionOnlyIfVisibleAndEngineSurfacesAgree: true,
      selectedNextSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
      selectedReason:
        "exact_runtime_is_blocked_but_company_internal_opening_requires_rockwool_to_be_exact_or_explicitly_screening_only",
      targetFile:
        "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts"
    });
  });

  it("carries forward source-promotion hostile-input and company-opening blockers", () => {
    expect(SOURCE_PROMOTION_AND_HOSTILE_INPUT_CARRY_FORWARD).toEqual({
      artifact: "source_promotion_and_hostile_input_ownership_carry_forward",
      hostileApiImportMustFailClosed: true,
      nearSourceAliasesRemainContextOnly: true,
      sourcePromotionRequires: [
        "topology_owner",
        "material_mapping_owner",
        "metric_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_visible_tests"
      ],
      sourcePromotionStillOpenAfterV23: true
    });
    expect(PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS).toEqual({
      artifact: "pre_company_internal_use_exit_criteria",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      criteriaClosedBeforeV23: ["field_outputs_never_design_grade_without_owner"],
      criteriaTargetedBySelectedNextSlice: ["rockwool_triple_leaf_exact_or_explicit_screening_only"],
      remainingBlockingIdsAfterSelectedNextLands: [
        "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
        "hostile_api_import_payloads_fail_closed",
        "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
      ]
    });
  });

  it("keeps active docs aligned with V23 decision and selected Rockwool screening-only policy slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A.selectedImplementationSlice);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A.targetFirstGateFile);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A.selectedPlanningSurface);
      expect(contents).toContain("rockwool_uris_exact_runtime_still_blocked");
      expect(contents).toContain("rockwool_explicit_screening_only_policy_selected");
      expect(contents).toContain("source_promotion_and_hostile_input_ownership_carry_forward");
      expect(contents).toContain("repeat_uris_acquisition_blocked_without_new_packet");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts");
  });
});
