import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A = {
  followUpPlanningAction: "internal_use_operating_envelope_v1_gate_a_short_pilot_pack",
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_framed_split_fix",
  latestClosedRuntimeOrSourceSlice: "wall_framed_facing_split_warning_stability_v1",
  nextExecutionAction: "internal_use_operating_envelope_v1_gate_a_short_pilot_usage_note_and_scenario_summary",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "internal_use_operating_envelope_v1",
  selectedOutputSurface: "company_internal_pilot_operating_envelope_and_scenario_summary",
  selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
  selectedRouteFamily: "calculator_internal_use_operating_envelope",
  selectionStatus:
    "selected_no_runtime_internal_use_operating_envelope_after_source_and_drift_gaps_remain_blocked",
  sliceId: "calculator_source_gap_revalidation_v3"
} as const;

const FRAMED_SPLIT_CLOSEOUT_RECHECK = {
  currentPosture: "closed_runtime_fix_with_regression_coverage",
  docOwner:
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md",
  evidenceOwners: [
    "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
    "apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts"
  ],
  remainingDriftEligibleNow: false,
  reason:
    "lsf_field_board_split_values_and_warning_posture_are_fixed_and_paired_route_card_coverage_is_green"
} as const;

const WALL_SOURCE_HOLDOUTS = [
  {
    id: "wall_no_stud_double_leaf",
    currentPosture: "formula_owned_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "no_direct_no_stud_no_rail_row_mapping_or_local_davy_sharp_single_number_tolerance_owner_is_ready",
    runtimeEligibleNow: false
  },
  {
    id: "wall_timber_double_board",
    currentPosture: "formula_low_confidence_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "single_board_resilient_and_secondary_double_board_context_still_do_not_match_the_live_stack",
    runtimeEligibleNow: false
  },
  {
    id: "wall_clt_mass_timber",
    currentPosture: "formula_medium_confidence_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "floor_only_clt_rows_stay_rejected_and_no_wall_specific_clt_or_laminated_leaf_tolerance_owner_exists",
    runtimeEligibleNow: false
  },
  {
    id: "wall_lined_massive_heavy_core",
    currentPosture: "screening_no_wall_source_or_bounded_lining_rule",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "wall_specific_lined_heavy_rows_are_missing_and_floor_only_or_adjacent_lining_context_is_not_importable",
    runtimeEligibleNow: false
  }
] as const;

const FLOOR_AND_HISTORICAL_HOLDOUTS = [
  {
    id: "floor_steel_fallback_low_confidence",
    currentPosture: "low_confidence_screening",
    evidenceOwner: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
    reason:
      "generated_stack_lacks_exact_pliteq_or_bounded_ubiq_topology_and_no_bounded_steel_open_web_family_rule_exists",
    runtimeEligibleNow: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
    reason:
      "visible_surface_still_needs_source_equivalent_composite_dry_screed_modeling_before_exact_reopen",
    runtimeEligibleNow: false
  },
  {
    id: "tuas_c11c_exact_import",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
    reason:
      "combined_wet_tuple_anomaly_still_lacks_raw_spectrum_or_correction_evidence_for_exact_import",
    runtimeEligibleNow: false
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    reason:
      "source_rows_still_describe_packaged_systems_not_true_bare_carrier_impact_behavior",
    runtimeEligibleNow: false
  },
  {
    id: "wall_selector_behavior_widening",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
    reason: "no_fresh_classified_wall_selector_red_exists_beyond_the_closed_trace_guard",
    runtimeEligibleNow: false
  }
] as const;

const SOURCE_INTAKE_CANDIDATES = [
  {
    id: "knauf_uk_drywall_systems_performance_guide_2026",
    candidateFor: "timber_stud_and_wall_lining_source_research",
    importReadyNow: false,
    reason:
      "requires_topology_metric_tolerance_and_negative_boundary_extraction_and_some_live_double_board_rows_are_not_tested"
  },
  {
    id: "knauf_au_systems_plus_2025",
    candidateFor: "timber_stud_masonry_upgrade_ceiling_and_clt_source_research",
    importReadyNow: false,
    reason:
      "section_level_tables_must_be_extracted_and_matched_to_engine_topology_before_any_import"
  },
  {
    id: "nrc_mass_timber_report_archive",
    candidateFor: "clt_nlt_dlt_wall_and_floor_dataset_research",
    importReadyNow: false,
    reason:
      "measured_transmission_loss_data_must_be_mapped_to_live_wall_floor_fields_and_single_number_metrics"
  },
  {
    id: "woodworks_mass_timber_inventory",
    candidateFor: "mass_timber_wall_floor_intake",
    importReadyNow: false,
    reason:
      "many_rows_are_stc_iic_or_floor_oriented_and_need_metric_conversion_or_rejection_decisions"
  },
  {
    id: "ubiq_inex_floor_fire_acoustic_tables",
    candidateFor: "floor_fallback_source_family_research",
    importReadyNow: false,
    reason:
      "current_generated_fallback_lacks_the_exact_inex_ceiling_and_joist_topology_required_by_existing_contracts"
  }
] as const;

const READINESS_RERANK = [
  {
    id: "internal_use_operating_envelope_v1",
    currentPosture: "prepared_no_runtime_operating_envelope_ready",
    firstGate: "short_pilot_usage_note_and_test_scenario_summary",
    reason:
      "source_import_candidates_remain_blocked_and_no_fresh_runtime_drift_is_open_so_the_highest_value_next_step_is_making_the_current_safe_caveated_operating_envelope_explicit",
    selectedNext: true,
    targetFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts"
  },
  {
    id: "source_gated_runtime_import_reopen",
    currentPosture: "not_ready",
    firstGate: "not_selected_until_direct_row_or_bounded_tolerance_owner_exists",
    reason:
      "wall_holdouts_floor_fallback_and_historical_blocked_families_all_lack_runtime_eligible_source_or_formula_prerequisites",
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"
  },
  {
    id: "regular_internal_use_visibility_hardening",
    currentPosture: "planned_after_pilot_pack",
    firstGate: "not_selected_before_short_pilot_usage_note_and_scenario_summary",
    reason:
      "regular_internal_use_visibility_hardening_should_follow_the_pilot_pack_so_it can audit concrete card_and_report_surfaces_against_named_scenarios",
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md"
  },
  {
    id: "comprehensive_accuracy_program",
    currentPosture: "roadmap_only_source_gated",
    firstGate: "not_selected_as_a_short_runtime_slice",
    reason:
      "comprehensive_correctness_requires_source_extraction_and_tolerance_ownership_for_multiple_families_not_one_runtime_change",
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"
  },
  {
    id: "productization_only_work",
    currentPosture: "deferred",
    firstGate: "not_selected",
    reason:
      "calculator_scope_and_accuracy_remain_the_active_priority_and_company_pilot_readiness_is_a_calculator_surface_task",
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_INTERNAL_USE_GATE_A_PLAN = {
  planningSurface: "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
  requiredPilotArtifacts: [
    "short_internal_pilot_usage_note",
    "test_scenario_summary_with_evidence_tier_support_outputs_and_warnings",
    "focused_contract_or_matrix_only_where_the_summary_needs_executable_protection",
    "no_confidence_or_evidence_promotion_for_pilot_convenience"
  ],
  requiredScenarioGroups: [
    "lsf_exact_wall_preset",
    "masonry_and_aac_single_leaf_wall",
    "timber_double_board_formula_low_confidence_wall",
    "clt_formula_medium_confidence_wall",
    "lined_heavy_core_screening_wall",
    "exact_or_bound_floor_corridor",
    "generated_steel_floor_fallback_low_confidence",
    "invalid_missing_many_layer_and_reorder_inputs"
  ],
  targetFirstGateFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
  validationScope: ["targeted_gate_a_contract", "pnpm_calculator_gate_current", "git_diff_check"]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_calculator_runtime_values_during_source_gap_revalidation_v3_gate_a",
    "promote_low_confidence_or_screening_families_for_internal_pilot_convenience",
    "import_candidate_public_sources_without_topology_metric_tolerance_and_negative_boundary_extraction",
    "reopen_source_blocked_wall_floor_or_historical_holdouts_from_green_tests_alone",
    "change_route_card_or_report_copy_without_paired_tests",
    "resume_productization_before_internal_use_operating_envelope_gate_a_closes_or_priority_changes"
  ]
} as const;

describe("calculator source-gap revalidation v3 Gate A contract", () => {
  it("closes Gate A without runtime movement and selects the internal-use operating envelope", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A).toEqual({
      followUpPlanningAction: "internal_use_operating_envelope_v1_gate_a_short_pilot_pack",
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_framed_split_fix",
      latestClosedRuntimeOrSourceSlice: "wall_framed_facing_split_warning_stability_v1",
      nextExecutionAction: "internal_use_operating_envelope_v1_gate_a_short_pilot_usage_note_and_scenario_summary",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "internal_use_operating_envelope_v1",
      selectedOutputSurface: "company_internal_pilot_operating_envelope_and_scenario_summary",
      selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
      selectedRouteFamily: "calculator_internal_use_operating_envelope",
      selectionStatus:
        "selected_no_runtime_internal_use_operating_envelope_after_source_and_drift_gaps_remain_blocked",
      sliceId: "calculator_source_gap_revalidation_v3"
    });

    for (const path of [
      CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md",
      "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the framed split fix closed and does not manufacture another runtime follow-up", () => {
    expect(FRAMED_SPLIT_CLOSEOUT_RECHECK).toEqual({
      currentPosture: "closed_runtime_fix_with_regression_coverage",
      docOwner:
        "docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md",
      evidenceOwners: [
        "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
        "apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts"
      ],
      remainingDriftEligibleNow: false,
      reason:
        "lsf_field_board_split_values_and_warning_posture_are_fixed_and_paired_route_card_coverage_is_green"
    });

    for (const path of [FRAMED_SPLIT_CLOSEOUT_RECHECK.docOwner, ...FRAMED_SPLIT_CLOSEOUT_RECHECK.evidenceOwners]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps wall, floor, and historical source holdouts blocked without new evidence", () => {
    expect(WALL_SOURCE_HOLDOUTS.map((candidate) => candidate.id)).toEqual([
      "wall_no_stud_double_leaf",
      "wall_timber_double_board",
      "wall_clt_mass_timber",
      "wall_lined_massive_heavy_core"
    ]);
    expect(FLOOR_AND_HISTORICAL_HOLDOUTS.map((candidate) => candidate.id)).toEqual([
      "floor_steel_fallback_low_confidence",
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening"
    ]);
    expect(WALL_SOURCE_HOLDOUTS.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(FLOOR_AND_HISTORICAL_HOLDOUTS.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);

    const evidencePaths = [
      ...WALL_SOURCE_HOLDOUTS.flatMap((candidate) => [candidate.docOwner, candidate.evidenceOwner]),
      ...FLOOR_AND_HISTORICAL_HOLDOUTS.map((candidate) => candidate.evidenceOwner)
    ];
    for (const path of evidencePaths) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records public source intake as research candidates, not import approvals", () => {
    expect(SOURCE_INTAKE_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "knauf_uk_drywall_systems_performance_guide_2026",
      "knauf_au_systems_plus_2025",
      "nrc_mass_timber_report_archive",
      "woodworks_mass_timber_inventory",
      "ubiq_inex_floor_fire_acoustic_tables"
    ]);
    expect(SOURCE_INTAKE_CANDIDATES.every((candidate) => candidate.importReadyNow === false)).toBe(true);
    expect(SOURCE_INTAKE_CANDIDATES.every((candidate) => candidate.reason.length > 70)).toBe(true);
  });

  it("selects the short internal pilot operating-envelope slice before regular-use or comprehensive work", () => {
    expect(READINESS_RERANK.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "internal_use_operating_envelope_v1",
        currentPosture: "prepared_no_runtime_operating_envelope_ready",
        firstGate: "short_pilot_usage_note_and_test_scenario_summary",
        reason:
          "source_import_candidates_remain_blocked_and_no_fresh_runtime_drift_is_open_so_the_highest_value_next_step_is_making_the_current_safe_caveated_operating_envelope_explicit",
        selectedNext: true,
        targetFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts"
      }
    ]);
    expect(READINESS_RERANK.every((candidate) => candidate.reason.length > 70)).toBe(true);
  });

  it("defines the internal-use Gate A scope and keeps promotion/productization boundaries closed", () => {
    expect(SELECTED_INTERNAL_USE_GATE_A_PLAN).toEqual({
      planningSurface: "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
      requiredPilotArtifacts: [
        "short_internal_pilot_usage_note",
        "test_scenario_summary_with_evidence_tier_support_outputs_and_warnings",
        "focused_contract_or_matrix_only_where_the_summary_needs_executable_protection",
        "no_confidence_or_evidence_promotion_for_pilot_convenience"
      ],
      requiredScenarioGroups: [
        "lsf_exact_wall_preset",
        "masonry_and_aac_single_leaf_wall",
        "timber_double_board_formula_low_confidence_wall",
        "clt_formula_medium_confidence_wall",
        "lined_heavy_core_screening_wall",
        "exact_or_bound_floor_corridor",
        "generated_steel_floor_fallback_low_confidence",
        "invalid_missing_many_layer_and_reorder_inputs"
      ],
      targetFirstGateFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
      validationScope: ["targeted_gate_a_contract", "pnpm_calculator_gate_current", "git_diff_check"]
    });
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_calculator_runtime_values_during_source_gap_revalidation_v3_gate_a",
      "promote_low_confidence_or_screening_families_for_internal_pilot_convenience",
      "import_candidate_public_sources_without_topology_metric_tolerance_and_negative_boundary_extraction",
      "reopen_source_blocked_wall_floor_or_historical_holdouts_from_green_tests_alone",
      "change_route_card_or_report_copy_without_paired_tests",
      "resume_productization_before_internal_use_operating_envelope_gate_a_closes_or_priority_changes"
    ]);
  });
});
