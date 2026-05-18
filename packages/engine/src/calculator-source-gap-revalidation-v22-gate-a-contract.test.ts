import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  boundedPolicyStepReadyToSelect: boolean;
  concreteUncoveredApiOrImportPathNamed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  fieldOutputOwnerNamed: boolean;
  hostileInputOwnerNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricContextOwnerNamed: boolean;
  nearSourceAliasOwnerNamed: boolean;
  pairedEngineTestsNamed: boolean;
  pairedWebReportTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceCurveProvenanceNamed: boolean;
  toleranceOwnerNamed: boolean;
};

type V22Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
  latestClosedSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "field_output_owner_and_design_grade_policy_v1",
  selectedNextAction: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
  selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  selectedRouteFamily: "field_output_owner_design_grade_policy_no_runtime",
  selectionStatus:
    "selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green",
  sliceId: "calculator_source_gap_revalidation_v22",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts",
  "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  "packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md"
] as const;

const COMPANY_INTERNAL_GATE_C_CLOSEOUT_CONSUMED = {
  artifact: "company_internal_gate_c_closeout_summary",
  companyGateCStatus:
    "closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22",
  frequentCombinationGuardsGreen: true,
  gateCIsRuntimeEvidence: false,
  noRuntimeMovement: true,
  selectedV22GateAFile:
    "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
} as const;

const ROCKWOOL_RW41_SCREENING_AND_URIS_PACKET_STATUS = {
  artifact: "rockwool_rw41_screening_and_uris_packet_status",
  exactSourceValidatedNow: false,
  groupedScreeningAnswer: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  localRuntimeFixReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
} as const;

const URIS_2006_EXTERNAL_SIGNAL_STATUS = {
  artifact: "repeat_uris_acquisition_blocked_without_new_packet",
  doi: "10.1016/j.apacoust.2005.11.006",
  pii: "S0003682X05001799",
  rightsSafeRuntimePacketAvailable: false,
  runtimeUsableSignals: [] as readonly string[],
  signalsChecked: [
    "https://doi.org/10.1016/j.apacoust.2005.11.006",
    "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    "https://docs.opendeved.net/lib/2ZBKZEYN",
    "https://www.elsevier.com/tdm/userlicense/1.0/"
  ],
  stillMissing: [
    "rights_safe_source_owned_curve_payload",
    "page_table_or_figure_locator",
    "octave_or_third_octave_band_vector",
    "rating_metric_and_tolerance_owner",
    "local_material_mapping",
    "paired_engine_web_report_tests"
  ]
} as const;

const FIELD_OUTPUT_NEAR_SOURCE_HOSTILE_CARRY_FORWARD = {
  artifact: "field_output_near_source_hostile_input_and_curve_provenance_status",
  fieldOutputsNeedDesignGradeOwner: true,
  fieldOutputsRemainContinuations: true,
  hostileApiImportMustFailClosed: true,
  nearSourceAliasesRemainContextOnly: true,
  selectedNextBecauseItIsActionableNoRuntimePolicyWork: true,
  sourceCurveProvenanceRequiredBeforeGraphRuntime: true
} as const;

const COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_BLOCKER_STATUS = {
  artifact: "company_internal_high_accuracy_opening_blocker_status",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  currentBlockingIds: [
    "rockwool_triple_leaf_exact_or_explicit_screening_only",
    "field_outputs_never_design_grade_without_owner",
    "frequent_wall_floor_lane_snapshots_green",
    "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
    "hostile_api_import_payloads_fail_closed"
  ],
  selectedNextKeepsOpeningBlocked: true
} as const;

const V22_RERANK_CANDIDATES: readonly V22Candidate[] = [
  {
    currentProof:
      "gate_c_v21_uris_gate_u_and_company_blocker_all_agree_grouped_split_rockwool_is_rw41_screening_and_not_source_validated",
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_material_mapping_and_tolerance_owner",
    id: "rockwool_uris_source_owned_closure_or_packet_intake",
    rank: 1,
    readiness: {
      boundedPolicyStepReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: true,
      fieldOutputOwnerNamed: false,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: true,
      pairedWebReportTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "highest_visible_accuracy_blocker_but_not_actionable_for_exact_runtime_without_a_new_rights_safe_packet",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "wait_for_new_rights_safe_source_packet_or_source_owned_curve_payload",
    selectedPlanningSurface: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "rw41_screening_can_be_misread_as_exact_if_visibility_or_policy_regresses",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    currentProof:
      "company_gate_a_b_c_cover_current_grouped_flat_rockwool_ordinary_double_leaf_lined_massive_raw_floor_near_source_hostile_and_field_output_cells",
    firstMissingRequirement: "specific_public_api_import_proposal_report_or_route_card_bypass",
    id: "remaining_frequent_combination_visible_api_guardrails",
    rank: 2,
    readiness: {
      boundedPolicyStepReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerNamed: true,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebReportTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "green_but_standing_monitoring_only_because_v22_did_not_find_a_concrete_uncovered_api_or_visible_path",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_standing_lane_misclassification_monitoring_mandate",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "common_combinations_can_look_reliable_if_guard_cells_are_removed",
    validationScope: ["company_internal_frequent_combination_gate_a_b_c"]
  },
  {
    currentProof:
      "near_source_manufacturer_and_material_rows_remain_context_only_and_do_not_fix_uris_or_promote_rockwool_exactness",
    firstMissingRequirement: "row_specific_material_alias_mapping_metric_context_tolerance_and_negative_boundaries",
    id: "near_source_alias_source_promotion_ownership",
    rank: 3,
    readiness: {
      boundedPolicyStepReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerNamed: false,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: true,
      pairedWebReportTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "important_but_no_false_promotion_bug_or_mapping_owner_is_newly_reproduced_in_v22",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "keep_context_only_until_a_bounded_false_promotion_bug_is_named",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "official_or_similar_material_names_can_look_exact_without_owned_mapping",
    validationScope: ["calculator_route_source_risk_register"]
  },
  {
    currentProof: "hostile_api_import_guards_are_green_and_must_stay_part_of_every_company_opening_snapshot",
    firstMissingRequirement: "new_uncovered_input_route_or_serialization_shape",
    id: "hostile_api_import_guardrails",
    rank: 4,
    readiness: {
      boundedPolicyStepReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerNamed: false,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebReportTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_standalone_because_no_bypass_path_was_named",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "carry_forward_fail_closed_guards",
    selectedPlanningSurface: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "bad_import_payloads_can_create_design_grade_numeric_claims",
    validationScope: ["raw_wall_hostile_input_answer_matrix", "raw_floor_hostile_input_answer_matrix"]
  },
  {
    currentProof:
      "gate_a_b_made_finite_rprime_dntw_lprime_outputs_visible_as_continuations_but_no_design_grade_policy_owner_exists",
    firstMissingRequirement: "field_metric_owner_source_basis_tolerance_report_copy_and_route_output_visible_tests",
    id: "field_output_owner_and_design_grade_policy",
    rank: 5,
    readiness: {
      boundedPolicyStepReadyToSelect: true,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerNamed: false,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: true,
      nearSourceAliasOwnerNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebReportTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "highest_actionable_no_runtime_accuracy_step_after_source_ready_rockwool_and_uncovered_api_paths_remain_blocked",
    runtimeBehaviorChange: false,
    selectedNext: true,
    selectedNextAction: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
    selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
    targetFile: "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
    userVisibleRisk:
      "finite_rprime_dntw_lprime_and_lprimet_outputs_can_still_be_used_as_if_design_grade_without_an_explicit_owner_policy",
    validationScope: [
      "field_output_owner_design_grade_policy_gate_a",
      "field_output_lab_screening_gate_a_b_continuity",
      "company_internal_frequent_combination_visible_guard",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentProof: "productization_remains_secondary_while_correctness_blockers_are_open",
    firstMissingRequirement: "rockwool_exact_or_explicit_screening_field_output_owner_source_promotion_and_full_validation",
    id: "productization_report_polish_after_correctness_blockers",
    rank: 6,
    readiness: {
      boundedPolicyStepReadyToSelect: false,
      concreteUncoveredApiOrImportPathNamed: false,
      exactLiveTopologyMappingNamed: false,
      fieldOutputOwnerNamed: false,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricContextOwnerNamed: false,
      nearSourceAliasOwnerNamed: false,
      pairedEngineTestsNamed: false,
      pairedWebReportTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceCurveProvenanceNamed: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_until_correctness_blockers_are_fixed_or_exposed_as_screening_only",
    runtimeBehaviorChange: false,
    selectedNext: false,
    selectedNextAction: "wait_for_correctness_blocker_closeout",
    selectedPlanningSurface: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    userVisibleRisk: "polished_reports_can_increase_trust_in_screening_or_ownerless_field_values",
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

describe("calculator source-gap revalidation v22 Gate A contract", () => {
  it("lands V22 Gate A no-runtime and selects field-output owner policy work", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
      latestClosedSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "field_output_owner_and_design_grade_policy_v1",
      selectedNextAction: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
      selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
      selectedRouteFamily: "field_output_owner_design_grade_policy_no_runtime",
      selectionStatus:
        "selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green",
      sliceId: "calculator_source_gap_revalidation_v22",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(existsSync(join(REPO_ROOT, CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A.targetFirstGateFile))).toBe(
      true
    );
  });

  it("consumes company Gate C without treating it as source or runtime evidence", () => {
    expect(COMPANY_INTERNAL_GATE_C_CLOSEOUT_CONSUMED).toEqual({
      artifact: "company_internal_gate_c_closeout_summary",
      companyGateCStatus:
        "closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22",
      frequentCombinationGuardsGreen: true,
      gateCIsRuntimeEvidence: false,
      noRuntimeMovement: true,
      selectedV22GateAFile:
        "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
    });
  });

  it("re-ranks source and accuracy candidates without exact promotion", () => {
    expect(V22_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "rockwool_uris_source_owned_closure_or_packet_intake",
      "remaining_frequent_combination_visible_api_guardrails",
      "near_source_alias_source_promotion_ownership",
      "hostile_api_import_guardrails",
      "field_output_owner_and_design_grade_policy",
      "productization_report_polish_after_correctness_blockers"
    ]);
    expect(V22_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(V22_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V22_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );

    expect(V22_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "field_output_owner_and_design_grade_policy",
        readiness: expect.objectContaining({
          boundedPolicyStepReadyToSelect: true,
          fieldOutputOwnerNamed: false,
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false
        }),
        selectedNextAction: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
        selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
        targetFile: "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts"
      })
    ]);
  });

  it("keeps rockwool grouped triple-leaf and flat-list swap blocked", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, GROUPED_SPLIT_ROCKWOOL_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));

    expect(ROCKWOOL_RW41_SCREENING_AND_URIS_PACKET_STATUS).toEqual({
      artifact: "rockwool_rw41_screening_and_uris_packet_status",
      exactSourceValidatedNow: false,
      groupedScreeningAnswer: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      localRuntimeFixReadyNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
    });
    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC"]
    });
    expect(grouped.warnings).toContain("lab spectrum adapter is active");
    expect(grouped.warnings).toContain("keeps the parent not-measured budget");

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

  it("keeps Uris 2006 acquisition blocked without a new rights-safe packet", () => {
    expect(URIS_2006_EXTERNAL_SIGNAL_STATUS).toMatchObject({
      artifact: "repeat_uris_acquisition_blocked_without_new_packet",
      doi: "10.1016/j.apacoust.2005.11.006",
      pii: "S0003682X05001799",
      rightsSafeRuntimePacketAvailable: false,
      runtimeUsableSignals: []
    });
    expect(URIS_2006_EXTERNAL_SIGNAL_STATUS.signalsChecked).toEqual([
      "https://doi.org/10.1016/j.apacoust.2005.11.006",
      "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
      "https://docs.opendeved.net/lib/2ZBKZEYN",
      "https://www.elsevier.com/tdm/userlicense/1.0/"
    ]);
    expect(URIS_2006_EXTERNAL_SIGNAL_STATUS.stillMissing).toEqual([
      "rights_safe_source_owned_curve_payload",
      "page_table_or_figure_locator",
      "octave_or_third_octave_band_vector",
      "rating_metric_and_tolerance_owner",
      "local_material_mapping",
      "paired_engine_web_report_tests"
    ]);
  });

  it("carries forward field-output near-source hostile-input and company-opening blockers", () => {
    expect(FIELD_OUTPUT_NEAR_SOURCE_HOSTILE_CARRY_FORWARD).toEqual({
      artifact: "field_output_near_source_hostile_input_and_curve_provenance_status",
      fieldOutputsNeedDesignGradeOwner: true,
      fieldOutputsRemainContinuations: true,
      hostileApiImportMustFailClosed: true,
      nearSourceAliasesRemainContextOnly: true,
      selectedNextBecauseItIsActionableNoRuntimePolicyWork: true,
      sourceCurveProvenanceRequiredBeforeGraphRuntime: true
    });
    expect(COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_BLOCKER_STATUS).toEqual({
      artifact: "company_internal_high_accuracy_opening_blocker_status",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      currentBlockingIds: [
        "rockwool_triple_leaf_exact_or_explicit_screening_only",
        "field_outputs_never_design_grade_without_owner",
        "frequent_wall_floor_lane_snapshots_green",
        "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
        "hostile_api_import_payloads_fail_closed"
      ],
      selectedNextKeepsOpeningBlocked: true
    });
  });

  it("keeps active docs aligned with V22 closeout and selected next field-output policy slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A.selectedImplementationSlice);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A.targetFirstGateFile);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A.selectedPlanningSurface);
      expect(contents).toContain("rockwool_rw41_screening_and_uris_packet_status");
      expect(contents).toContain("paused_waiting_rights_safe_source_packet");
      expect(contents).toContain("repeat_uris_acquisition_blocked_without_new_packet");
      expect(contents).toContain("field_output_owner_and_design_grade_policy");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts");
  });
});
