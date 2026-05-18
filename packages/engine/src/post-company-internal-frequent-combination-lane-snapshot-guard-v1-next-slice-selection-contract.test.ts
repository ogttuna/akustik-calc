import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CloseoutFinding = {
  id: string;
  nextOwner: "calculator_source_gap_revalidation_v22";
  protectedBoundary: string;
  runtimeImportReadyNow: false;
  sourceValidatedNow: false;
};

type NextSliceCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime",
  latestLandedStatus: "company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v22",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_company_internal_snapshot_guard",
  selectionStatus:
    "closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22",
  sliceId: "post_company_internal_frequent_combination_lane_snapshot_guard_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CLOSEOUT_FINDINGS: readonly CloseoutFinding[] = [
  {
    id: "rockwool_grouped_rw41_screening_not_fixed",
    nextOwner: "calculator_source_gap_revalidation_v22",
    protectedBoundary: "paused_waiting_rights_safe_source_packet",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    id: "flat_list_swap_visible_fail_closed_until_grouped_topology",
    nextOwner: "calculator_source_gap_revalidation_v22",
    protectedBoundary: "multileaf_screening_blend_fail_closed_until_grouped_topology",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    id: "frequent_combination_engine_and_web_guards_green_without_exact_promotion",
    nextOwner: "calculator_source_gap_revalidation_v22",
    protectedBoundary: "standing_lane_misclassification_monitoring_mandate",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    id: "field_output_near_source_and_hostile_input_risks_carry_forward",
    nextOwner: "calculator_source_gap_revalidation_v22",
    protectedBoundary: "note_test_document_or_easy_fix",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    id: "company_internal_high_accuracy_opening_still_blocked",
    nextOwner: "calculator_source_gap_revalidation_v22",
    protectedBoundary: "pre_company_internal_use_exit_criteria",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "calculator_source_gap_revalidation_v22",
    reason:
      "after_company_internal_gate_a_and_gate_b_pinned_engine_and_web_frequent_combination_posture_without_a_source_ready_runtime_candidate_the_next_honest_accuracy_step_is_to_rerank_rockwool_uris_source_packet_status_remaining_visible_api_guardrails_near_source_alias_hostile_input_field_output_owner_and_company_opening_blockers_before_any_runtime_or_exact_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
  },
  {
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "the_rockwool_triple_leaf_defect_remains_the_highest_user_visible_accuracy_problem_but_direct_exact_runtime_fix_is_blocked_until_a_rights_safe_uris_2006_or_equivalent_source_owned_curve_packet_local_material_mapping_tolerance_negative_boundaries_and_paired_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "repeat_uris_source_acquisition_without_new_packet",
    reason:
      "gate_u_already_confirmed_uris_identity_and_no_rights_safe_local_or_authorized_curve_payload; repeating_source_acquisition_without_a_new_packet_would_not_fix_the_runtime_and_must_stay_an_external_dependency_inside_the_v22_rerank",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  },
  {
    id: "company_internal_high_accuracy_opening",
    reason:
      "company_internal_opening_still_requires_rockwool_exact_or_explicit_screening_only_field_output_owner_visibility_frequent_lane_snapshots_source_promotion_ownership_hostile_input_green_and_full_validation_before_it_can_be_called_high_accuracy_ready",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    id: "standalone_visible_api_or_hostile_input_guard",
    reason:
      "gate_a_and_gate_b_now_cover_the_current_bounded_engine_and_web_visible_guard_cells; a_standalone_api_or_hostile_input_slice_should_be_selected_by_v22_only_if_it_finds_a_specific_remaining_import_path_or_public_api_gap",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    id: "productization_or_report_polish",
    reason:
      "productization_remains_secondary_until_the_company_use_blockers_are_revalidated_and_rockwool_or_equivalent_screening_posture_is_kept_explicit",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V22_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
  requiredArtifacts: [
    "company_internal_gate_c_closeout_summary",
    "rockwool_rw41_screening_and_uris_packet_status",
    "frequent_combination_guard_green_carry_forward",
    "field_output_near_source_hostile_input_and_curve_provenance_status",
    "company_internal_high_accuracy_opening_blocker_status",
    "selected_next_slice_with_target_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
} as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
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

describe("post company-internal frequent-combination Gate C next-slice selection contract", () => {
  it("closes the company-internal guard no-runtime and selects source-gap revalidation v22", () => {
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime",
      latestLandedStatus:
        "company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v22",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_company_internal_snapshot_guard",
      selectionStatus:
        "closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22",
      sliceId: "post_company_internal_frequent_combination_lane_snapshot_guard_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses current rockwool behavior as blocked evidence, not exact fix approval", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, GROUPED_SPLIT_ROCKWOOL_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));

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
    expect(CLOSEOUT_FINDINGS.every((finding) => finding.runtimeImportReadyNow === false)).toBe(true);
    expect(CLOSEOUT_FINDINGS.every((finding) => finding.sourceValidatedNow === false)).toBe(true);
  });

  it("selects v22 revalidation before runtime fix, repeated source acquisition, opening, or productization", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v22",
        reason:
          "after_company_internal_gate_a_and_gate_b_pinned_engine_and_web_frequent_combination_posture_without_a_source_ready_runtime_candidate_the_next_honest_accuracy_step_is_to_rerank_rockwool_uris_source_packet_status_remaining_visible_api_guardrails_near_source_alias_hostile_input_field_output_owner_and_company_opening_blockers_before_any_runtime_or_exact_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("defines the selected v22 Gate A scope before source import or exact promotion", () => {
    expect(SELECTED_V22_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout",
      requiredArtifacts: [
        "company_internal_gate_c_closeout_summary",
        "rockwool_rw41_screening_and_uris_packet_status",
        "frequent_combination_guard_green_carry_forward",
        "field_output_near_source_hostile_input_and_curve_provenance_status",
        "company_internal_high_accuracy_opening_blocker_status",
        "selected_next_slice_with_target_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on Gate C closeout and v22 selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md"),
      readRepoFile(
        "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md"
      ),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT.closedImplementationSlice);
      expect(doc).toContain(COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(COMPANY_INTERNAL_FREQUENT_COMBINATION_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("company_internal_gate_c_closeout_summary");
      expect(doc).toContain("rockwool_rw41_screening_and_uris_packet_status");
      expect(doc).toContain("repeat_uris_acquisition_blocked_without_new_packet");
      expect(doc).toContain("company_internal_high_accuracy_opening_still_blocked");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
    }
  });

  it("keeps validation and frozen-surface requirements explicit", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const surface of FROZEN_SURFACES) {
      expect(checkpoint).toContain(surface);
    }

    expect(runner).toContain(
      "src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts"
    );
    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
