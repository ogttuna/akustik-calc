import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type Readiness = {
  exactTopologyExtracted: boolean;
  metricContextMapped: boolean;
  negativeBoundariesNamed: boolean;
  pairedEngineTestsNamed: boolean;
  pairedWebTestsNamed: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type RevalidationCandidate = {
  docOwner: string;
  existingEvidenceOwners: readonly string[];
  firstMissingRequirement: string;
  id: string;
  rank: number;
  readiness: Readiness;
  reason: string;
  runtimeBehaviorChange: false;
  selectedNext: boolean;
  sourceLocators: readonly string[];
  targetFile: string;
  userVisibleRisk: string;
};

const CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
  latestClosedSlice: "generated_floor_fallback_topology_delta_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "knauf_wall_systems_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "knauf_wall_systems_source_pack_extraction_no_runtime",
  selectionStatus:
    "selected_no_runtime_knauf_wall_systems_source_pack_extraction_after_v4_rerank_found_no_runtime_ready_candidate",
  sliceId: "calculator_source_gap_revalidation_v4",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md",
  "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const SOURCE_LOCATOR_RECHECK = [
  {
    id: "knauf_uk_drywall_systems_performance_guide_april_2026",
    locator:
      "https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB",
    observedScope:
      "official_90_page_performance_guide_with_en_and_bs_specification_tables_and_rw_rw_ctr_columns",
    retrievalDate: "2026-04-29",
    runtimeImportApproval: false
  },
  {
    id: "knauf_au_systems_plus_october_2025_page",
    locator: "https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus",
    observedScope:
      "official_systems_plus_page_links_sections_for_steel_stud_timber_stud_masonry_upgrades_ceilings_and_clt_context",
    retrievalDate: "2026-04-29",
    runtimeImportApproval: false
  },
  {
    id: "knauf_au_systems_plus_section_d_timber_stud_walls",
    locator:
      "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
    observedScope:
      "official_timber_stud_wall_section_with_lined_one_side_lined_both_sides_furred_staggered_and_twin_stud_systems",
    retrievalDate: "2026-04-29",
    runtimeImportApproval: false
  },
  {
    id: "knauf_au_systems_plus_section_f_masonry_upgrades",
    locator:
      "https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU",
    observedScope:
      "official_masonry_upgrade_section_with_aac_panel_upgrade_rows_and_rw_rw_ctr_columns",
    retrievalDate: "2026-04-29",
    runtimeImportApproval: false
  }
] as const;

const V4_RERANK_CANDIDATES: readonly RevalidationCandidate[] = [
  {
    id: "knauf_wall_systems_source_pack_extraction",
    rank: 1,
    userVisibleRisk:
      "timber_double_board_and_lined_masonry_wall_routes_remain_caveated_while_official_knauf_rows_need_table_level_extraction",
    existingEvidenceOwners: [
      "packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts"
    ],
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    sourceLocators: SOURCE_LOCATOR_RECHECK.map((source) => source.id),
    firstMissingRequirement:
      "extract_table_rows_with_system_codes_topology_metric_context_tolerance_owner_negative_boundaries_and_test_plan",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "official_knauf_uk_and_au_sources_are_concrete_enough_for_no_runtime_row_topology_extraction_but_not_for_import_or_confidence_promotion",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts"
  },
  {
    id: "clt_mass_timber_second_pass_runtime_or_metric_mapping",
    rank: 2,
    userVisibleRisk:
      "mass_timber_wall_results_are_formula_owned_and_can_look_source_backed_if_stc_astc_or_iic_context_is_overread",
    existingEvidenceOwners: [
      "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts",
      "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
      "packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    ],
    docOwner: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    sourceLocators: [
      "woodworks_acoustically_tested_mass_timber_assemblies_pdf",
      "nrc_mass_timber_report_archive"
    ],
    firstMissingRequirement:
      "exact_wall_row_metric_mapping_or_explicit_stc_astc_iic_rejection_plus_tolerance_owner",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "clt_mass_timber_extraction_already_closed_and_the_remaining_blocker_is_metric_policy_or_tolerance_not_a_new_runtime_slice",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "generated_floor_fallback_runtime_or_confidence_promotion",
    rank: 3,
    userVisibleRisk:
      "generated_floor_fallback_can_overstate_accuracy_if_pliteq_or_ubiq_near_misses_are_treated_as exact_or_bound_matches",
    existingEvidenceOwners: [
      "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
      "packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
    ],
    docOwner: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
    sourceLocators: ["ubiq_inex_floor_fire_acoustic_tables", "pliteq_exact_or_bound_floor_rows"],
    firstMissingRequirement: "exact_live_topology_match_or_bounded_steel_open_web_family_rule",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "the_topology_delta_slice_just_closed_with_near_misses_only_so_floor_fallback_runtime_or_confidence_promotion_is_blocked",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts"
  },
  {
    id: "no_stud_double_leaf_formula_tolerance_owner",
    rank: 4,
    userVisibleRisk:
      "no_stud_or_no_rail_double_leaf_formula_routes_need_local_single_number_tolerance_before_any_value_movement",
    existingEvidenceOwners: [
      "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts"
    ],
    docOwner: "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
    sourceLocators: ["davy_sharp_formula_scope", "nrc_context_only_not_no_stud_wall_truth"],
    firstMissingRequirement: "local_davy_sharp_single_number_tolerance_owner_or_direct_no_stud_no_rail_row",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "formula_context_exists_but_no_local_input_tolerance_owner_or_direct_row_is_ready_for_import_or_retune",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts"
  },
  {
    id: "historical_blocked_family_reopen",
    rank: 5,
    userVisibleRisk:
      "closed_exact_or_bare_family_routes_can_reopen_from_adjacent_source_context_without_satisfying_the_original_blocker",
    existingEvidenceOwners: [
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
      "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts"
    ],
    docOwner: "docs/calculator/SOURCE_GAP_LEDGER.md",
    sourceLocators: [],
    firstMissingRequirement: "new_source_evidence_that_directly_satisfies_the_original_closed_blocker",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "gdmtxa04a_c11c_raw_bare_open_box_open_web_and_wall_selector_remain_fail_closed_until_their_original_blockers_are_satisfied",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md"
  },
  {
    id: "internal_use_or_productization_only",
    rank: 6,
    userVisibleRisk:
      "company_internal_use_is_available_inside_the_handoff_but_product_work_does_not_raise_source_accuracy",
    existingEvidenceOwners: [
      "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts",
      "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts"
    ],
    docOwner: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
    sourceLocators: [],
    firstMissingRequirement: "calculator_accuracy_source_pack_extraction_still_outranks_productization_only_work",
    readiness: {
      exactTopologyExtracted: false,
      metricContextMapped: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "internal_use_handoff_is_closed_controlled_use_evidence_and_must_not_promote_low_confidence_or_source_gated_families",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_KNAUF_GATE_A_SCOPE = {
  firstGate: "gate_a_extract_knauf_wall_systems_source_pack_without_runtime_import",
  requiredArtifacts: [
    "knauf_uk_2026_performance_guide_table_locator_register",
    "knauf_au_systems_plus_section_d_timber_stud_table_locator_register",
    "knauf_au_systems_plus_section_f_masonry_upgrade_table_locator_register",
    "system_code_to_engine_topology_mapping_blocker_matrix",
    "metric_context_and_tolerance_owner_blocker_matrix",
    "positive_negative_engine_test_plan",
    "visible_surface_test_plan_only_if_later_runtime_or_copy_moves"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts"
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

const PROTECTED_BOUNDARIES = [
  "source_locators_are_not_runtime_import_approval",
  "knauf_extraction_must_not_promote_timber_double_board_or_lined_heavy_routes_without_exact_row_mapping",
  "steel_stud_rows_do_not_become_timber_stud_truth",
  "masonry_upgrade_or_floor_ceiling_rows_do_not_become_lined_heavy_wall_truth_without_wall_specific_mapping",
  "generated_floor_fallback_remains_low_confidence_after_topology_near_misses",
  "internal_use_handoff_does_not_promote_source_gated_or_screening_families"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator source-gap revalidation v4 Gate A contract", () => {
  it("lands v4 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
      latestClosedSlice: "generated_floor_fallback_topology_delta_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "knauf_wall_systems_source_pack_extraction_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "knauf_wall_systems_source_pack_extraction_no_runtime",
      selectionStatus:
        "selected_no_runtime_knauf_wall_systems_source_pack_extraction_after_v4_rerank_found_no_runtime_ready_candidate",
      sliceId: "calculator_source_gap_revalidation_v4",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records fresh source locators as extraction inputs, not import approval", () => {
    expect(SOURCE_LOCATOR_RECHECK.map((source) => source.id)).toEqual([
      "knauf_uk_drywall_systems_performance_guide_april_2026",
      "knauf_au_systems_plus_october_2025_page",
      "knauf_au_systems_plus_section_d_timber_stud_walls",
      "knauf_au_systems_plus_section_f_masonry_upgrades"
    ]);
    expect(SOURCE_LOCATOR_RECHECK.every((source) => source.retrievalDate === "2026-04-29")).toBe(true);
    expect(SOURCE_LOCATOR_RECHECK.every((source) => source.runtimeImportApproval === false)).toBe(true);
    expect(SOURCE_LOCATOR_RECHECK.every((source) => source.observedScope.length > 70)).toBe(true);
  });

  it("reranks all current source and accuracy candidates exactly once", () => {
    expect(V4_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "knauf_wall_systems_source_pack_extraction",
      "clt_mass_timber_second_pass_runtime_or_metric_mapping",
      "generated_floor_fallback_runtime_or_confidence_promotion",
      "no_stud_double_leaf_formula_tolerance_owner",
      "historical_blocked_family_reopen",
      "internal_use_or_productization_only"
    ]);
    expect(V4_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(V4_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V4_RERANK_CANDIDATES.length
    );
    expect(V4_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V4_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V4_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 60)).toBe(true);
  });

  it("selects Knauf wall systems only for no-runtime source-pack extraction", () => {
    const selected = V4_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext);

    expect(selected).toEqual([
      expect.objectContaining({
        id: "knauf_wall_systems_source_pack_extraction",
        rank: 1,
        readiness: expect.objectContaining({
          exactTopologyExtracted: false,
          metricContextMapped: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: true,
          toleranceOwnerNamed: false
        }),
        reason:
          "official_knauf_uk_and_au_sources_are_concrete_enough_for_no_runtime_row_topology_extraction_but_not_for_import_or_confidence_promotion",
        selectedNext: true,
        targetFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the next Gate A scope and preserves negative boundaries", () => {
    expect(SELECTED_KNAUF_GATE_A_SCOPE).toEqual({
      firstGate: "gate_a_extract_knauf_wall_systems_source_pack_without_runtime_import",
      requiredArtifacts: [
        "knauf_uk_2026_performance_guide_table_locator_register",
        "knauf_au_systems_plus_section_d_timber_stud_table_locator_register",
        "knauf_au_systems_plus_section_f_masonry_upgrade_table_locator_register",
        "system_code_to_engine_topology_mapping_blocker_matrix",
        "metric_context_and_tolerance_owner_blocker_matrix",
        "positive_negative_engine_test_plan",
        "visible_surface_test_plan_only_if_later_runtime_or_copy_moves"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts"
    });
    expect(PROTECTED_BOUNDARIES).toEqual([
      "source_locators_are_not_runtime_import_approval",
      "knauf_extraction_must_not_promote_timber_double_board_or_lined_heavy_routes_without_exact_row_mapping",
      "steel_stud_rows_do_not_become_timber_stud_truth",
      "masonry_upgrade_or_floor_ceiling_rows_do_not_become_lined_heavy_wall_truth_without_wall_specific_mapping",
      "generated_floor_fallback_remains_low_confidence_after_topology_near_misses",
      "internal_use_handoff_does_not_promote_source_gated_or_screening_families"
    ]);
  });

  it("keeps non-selected families blocked with explicit reasons", () => {
    const nonSelected = V4_RERANK_CANDIDATES.filter((candidate) => !candidate.selectedNext);

    expect(nonSelected.map((candidate) => [candidate.id, candidate.reason])).toEqual([
      [
        "clt_mass_timber_second_pass_runtime_or_metric_mapping",
        "clt_mass_timber_extraction_already_closed_and_the_remaining_blocker_is_metric_policy_or_tolerance_not_a_new_runtime_slice"
      ],
      [
        "generated_floor_fallback_runtime_or_confidence_promotion",
        "the_topology_delta_slice_just_closed_with_near_misses_only_so_floor_fallback_runtime_or_confidence_promotion_is_blocked"
      ],
      [
        "no_stud_double_leaf_formula_tolerance_owner",
        "formula_context_exists_but_no_local_input_tolerance_owner_or_direct_row_is_ready_for_import_or_retune"
      ],
      [
        "historical_blocked_family_reopen",
        "gdmtxa04a_c11c_raw_bare_open_box_open_web_and_wall_selector_remain_fail_closed_until_their_original_blockers_are_satisfied"
      ],
      [
        "internal_use_or_productization_only",
        "internal_use_handoff_is_closed_controlled_use_evidence_and_must_not_promote_low_confidence_or_source_gated_families"
      ]
    ]);
    expect(nonSelected.every((candidate) => candidate.readiness.negativeBoundariesNamed)).toBe(true);
  });

  it("keeps the active docs aligned on the selected next slice and frozen surfaces", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A.targetFirstGateFile);
      expect(doc).toContain("no-runtime");
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs.join("\n"), surface).toContain(surface);
    }
  });
});
