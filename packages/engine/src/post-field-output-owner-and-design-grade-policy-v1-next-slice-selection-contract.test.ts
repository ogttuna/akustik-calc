import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "field_output_owner_and_design_grade_policy_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_b_pin_visible_field_output_design_grade_owner_policy",
  latestLandedStatus:
    "gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_field_output_owner_policy_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v23",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_field_output_owner_policy_closeout",
  selectionStatus:
    "closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23",
  sliceId: "post_field_output_owner_and_design_grade_policy_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts",
  visibleCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  "packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md"
] as const;

const FIELD_OUTPUT_OWNER_POLICY_CLOSEOUT_SUMMARY = {
  artifact: "field_output_owner_policy_gate_c_closeout_summary",
  designGradeFieldOutputsAllowedNow: false,
  fieldOutputOwnerPolicyClosed: true,
  gateAInventoryClosed: true,
  gateBVisibleCopyClosed: true,
  ownerPolicyIsRuntimeSourceEvidence: false,
  visibleOwnerPolicyGuardActive: true
} as const;

const FIELD_OUTPUT_DESIGN_GRADE_BOUNDARY_CARRY_FORWARD = {
  artifact: "field_output_owner_and_design_grade_policy_closed_carry_forward",
  exactFloorFieldCompanionsRemainContinuations: true,
  finiteFieldOutputsRemainNonDesignGrade: true,
  missingGeometryFieldKOrRoomVolumeStillNeedsInput: true,
  requiredBeforeDesignGrade: [
    "field_metric_owner",
    "source_basis_owner",
    "geometry_or_room_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_engine_tests",
    "paired_web_report_tests"
  ],
  rockwoolFieldOutputsCarryScreeningPosture: true
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

const PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS = {
  artifact: "pre_company_internal_use_exit_criteria",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  criteriaClosedByThisSlice: ["field_outputs_never_design_grade_without_owner"],
  remainingBlockingIds: [
    "rockwool_triple_leaf_exact_or_explicit_screening_only",
    "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
    "hostile_api_import_payloads_fail_closed",
    "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "post_field_output_owner_policy_source_accuracy_order_revalidation",
    id: "calculator_source_gap_revalidation_v23",
    reason:
      "field_output_owner_policy_is_now_closed_visible_and_non_design_grade_so_the_next_bounded_accuracy_step_is_to_rerank_rockwool_uris_source_packet_status_source_promotion_ownership_hostile_input_guards_and_company_opening_blockers_before_any_runtime_or_exact_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_material_mapping_and_tolerance_owner",
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "rockwool_triple_leaf_remains_the_highest_visible_accuracy_blocker_but_direct_exact_runtime_fix_is_still_blocked_until_a_rights_safe_uris_2006_or_equivalent_source_owned_curve_packet_local_material_mapping_metric_context_tolerance_negative_boundaries_and_paired_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "new_rights_safe_packet_authorized_tdm_payload_page_image_or_numeric_band_vector",
    id: "repeat_uris_source_acquisition_without_new_packet",
    reason:
      "gate_u_and_v22_already_confirmed_uris_identity_and_absent_rights_safe_runtime_payload_so_repeating_acquisition_without_new_packet_would_not_improve_calculator_accuracy",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  },
  {
    firstMissingRequirement: "rockwool_exact_or_explicit_screening_and_source_promotion_ownership",
    id: "company_internal_high_accuracy_opening",
    reason:
      "field_output_owner_policy_is_now_closed_but_company_internal_high_accuracy_opening_still_requires_rockwool_exact_or_explicit_screening_only_source_promotion_ownership_hostile_input_green_current_gate_and_broad_check_evidence",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    firstMissingRequirement: "correctness_blocker_closeout_before_trust_increasing_polish",
    id: "productization_or_report_polish",
    reason:
      "productization_and_report_polish_remain_secondary_because_improving_trust_surfaces_before_rockwool_and_source_promotion_blockers_are_revalidated_can_make_screening_values_look_over_defended",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const FIELD_OUTPUT_OWNER_VISIBLE_COPY_SURFACES = [
  {
    path: "apps/web/features/workbench/field-output-owner-policy-copy.ts",
    token: "design-grade field owner"
  },
  {
    path: "apps/web/features/workbench/field-airborne-output.ts",
    token: "FIELD_OUTPUT_CONTINUATION_BASIS_GUARD"
  },
  {
    path: "apps/web/features/workbench/simple-workbench-output-model.ts",
    token: "FIELD_OUTPUT_OWNER_POLICY_GUARD"
  },
  {
    path: "apps/web/features/workbench/simple-workbench-output-posture.ts",
    token: "FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD"
  },
  {
    path: "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
    token: "FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD"
  }
] as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card status",
  "proposal/report values",
  "workbench-input"
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

describe("post field-output owner and design-grade policy Gate C next-slice selection contract", () => {
  it("closes the field-output owner policy no-runtime and selects source-gap revalidation v23", () => {
    expect(FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "field_output_owner_and_design_grade_policy_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_b_pin_visible_field_output_design_grade_owner_policy",
      latestLandedStatus:
        "gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_field_output_owner_policy_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v23",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_field_output_owner_policy_closeout",
      selectionStatus:
        "closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23",
      sliceId: "post_field_output_owner_and_design_grade_policy_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts",
      visibleCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries forward field-output owner policy without making field outputs design-grade", () => {
    expect(FIELD_OUTPUT_OWNER_POLICY_CLOSEOUT_SUMMARY).toEqual({
      artifact: "field_output_owner_policy_gate_c_closeout_summary",
      designGradeFieldOutputsAllowedNow: false,
      fieldOutputOwnerPolicyClosed: true,
      gateAInventoryClosed: true,
      gateBVisibleCopyClosed: true,
      ownerPolicyIsRuntimeSourceEvidence: false,
      visibleOwnerPolicyGuardActive: true
    });
    expect(FIELD_OUTPUT_DESIGN_GRADE_BOUNDARY_CARRY_FORWARD).toEqual({
      artifact: "field_output_owner_and_design_grade_policy_closed_carry_forward",
      exactFloorFieldCompanionsRemainContinuations: true,
      finiteFieldOutputsRemainNonDesignGrade: true,
      missingGeometryFieldKOrRoomVolumeStillNeedsInput: true,
      requiredBeforeDesignGrade: [
        "field_metric_owner",
        "source_basis_owner",
        "geometry_or_room_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_engine_tests",
        "paired_web_report_tests"
      ],
      rockwoolFieldOutputsCarryScreeningPosture: true
    });

    for (const surface of FIELD_OUTPUT_OWNER_VISIBLE_COPY_SURFACES) {
      const contents = readRepoFile(surface.path);
      expect(contents).toContain(surface.token);
    }
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

  it("selects v23 revalidation before direct runtime fix, repeated Uris acquisition, opening, or polish", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "post_field_output_owner_policy_source_accuracy_order_revalidation",
        id: "calculator_source_gap_revalidation_v23",
        reason:
          "field_output_owner_policy_is_now_closed_visible_and_non_design_grade_so_the_next_bounded_accuracy_step_is_to_rerank_rockwool_uris_source_packet_status_source_promotion_ownership_hostile_input_guards_and_company_opening_blockers_before_any_runtime_or_exact_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("keeps company-internal high-accuracy opening blocked with one criterion closed", () => {
    expect(PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS).toEqual({
      artifact: "pre_company_internal_use_exit_criteria",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      criteriaClosedByThisSlice: ["field_outputs_never_design_grade_without_owner"],
      remainingBlockingIds: [
        "rockwool_triple_leaf_exact_or_explicit_screening_only",
        "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
        "hostile_api_import_payloads_fail_closed",
        "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
      ]
    });
  });

  it("keeps active docs and current-gate runner aligned with Gate C closeout and V23 selection", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT.selectionStatus);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_POLICY_GATE_C_CLOSEOUT.selectedPlanningSurface);
      expect(contents).toContain("field_output_owner_policy_gate_c_closeout_summary");
      expect(contents).toContain("field_output_owner_and_design_grade_policy_closed_carry_forward");
      expect(contents).toContain("rockwool_rw41_screening_and_uris_packet_status");
      expect(contents).toContain("paused_waiting_rights_safe_source_packet");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
    }

    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const surface of FROZEN_SURFACES) {
      expect(checkpoint).toContain(surface);
    }

    expect(runner).toContain(
      "src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts"
    );
    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
