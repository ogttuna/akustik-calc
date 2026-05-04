import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const RISK_REGISTER_PATH = "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md";
const TRIPLE_LEAF_HANDOFF_PATH = "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md";
const CURRENT_STATE_PATH = "docs/calculator/CURRENT_STATE.md";
const NEXT_PLAN_PATH = "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md";
const FLOOR_TOLERANCE_PLAN_PATH = "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md";
const SOURCE_GAP_REVALIDATION_V19_PLAN_PATH = "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md";
const AGENTS_PATH = "AGENTS.md";

const RISK_IDS = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"] as const;

const RISK_NAMES = [
  "Flat-list route-family flip",
  "Duplicate / Many-Layer Stack Drift",
  "Masonry / Lined-Massive Boundary Drift",
  "Raw Floor Role Inference",
  "Near-Source False Promotion",
  "Field-Output Leakage",
  "Material Alias / Coalescing",
  "Hostile API Input",
  "Curve Digitization / Provenance"
] as const;

const REMEDIATION_TOKENS = [
  "grouped topology",
  "Duplicate-stack matrix",
  "Boundary-scan tests",
  "Role-row reorder tests",
  "No-runtime mapping/tolerance contract",
  "field/ISO 12354-style overlay policy",
  "per-role material mapping",
  "shared fail-closed guards at engine boundary",
  "Gate-O-style provenance/QC"
] as const;

const HOTSPOT_IDS = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"] as const;

const HOTSPOT_TOKENS = [
  "ROCKWOOL ISS / IWS / ESS source rows",
  "Heavy multileaf -> lined-massive swap",
  "AAC / pumice / lightweight masonry lining boundary",
  "One-side lining vs independent leaf",
  "Twin-frame / double-frame timber and steel sources",
  "Raw floor role inference and duplicate roles",
  "Floor tolerance-edge promotions",
  "Same-material split / coalescing",
  "Field-output leakage",
  "Hostile API/import input",
  "Source metric / digitization mix-up",
  "Output copy over-certainty",
  "Near-term triage"
] as const;

const PLANNING_PASS_TOKENS = [
  "gate_b_closeout_file_currently_absent_and_next_to_create",
  "wrong_measurement_triage_loop",
  "frequent_combination_lane_suspicion_reproduce_trace_document_or_bounded_fix",
  "external_source_research_deferred_until_source_acquisition_gate_or_source_packet",
  "exact_promotion_requires_source_topology_material_metric_tolerance_negative_visible_proof",
  "inspected_floor_exact_bound_implementation_surfaces",
  "gate_b_contract_blueprint_snapshot_matrix",
  "exact_bound_screening_visible_surface_parity_check",
  "contiguous_duplicate_vs_disjoint_duplicate_role_boundary",
  "current_gate_runner_must_include_gate_b_after_creation",
  "source_gap_revalidation_v19_candidate_after_floor_closeout",
  "no_internet_research_before_gate_b_selects_source_acquisition",
  "gate_b_preflight_exact_bound_fixture_map",
  "gate_b_plus_2mm_inside_plus_2p1mm_outside_boundary",
  "direct_floor_system_id_bypass_is_not_layer_match_promotion",
  "field_context_warning_copy_not_field_metric_promotion",
  "gate_b_validation_order_engine_contract_then_runner_then_current_gate",
  "web_visible_changes_deferred_until_gate_b_selects_bounded_fix",
  "broad_check_2026_05_04_toolbar_copy_alignment_passed",
  "full_check_found_toolbar_copy_test_drift_not_calculator_runtime_drift",
  "wrong_lane_broad_suites_green_no_runtime_movement_selected",
  "gate_b_closeout_remains_first_implementation_step_after_broad_check",
  "rockwool_uris_status_unchanged_after_broad_check",
  "gate_b_implementation_cross_check_passed",
  "gate_b_file_absent_runner_absent_by_design_until_creation",
  "gate_a_fixture_ids_verified_in_catalog_and_existing_tests",
  "packed_same_role_merge_safe_but_split_single_entry_schedules_blocked",
  "official_floor_system_id_bypass_must_not_seed_layer_match_proof",
  "gate_b_no_external_research_needed_until_source_acquisition_selected",
  "gate_b_next_steps_order_contract_runner_current_gate_then_rerank",
  "targeted_gate_a_v18_risk_register_validation_green",
  "floor_tolerance_edge_gate_b_closeout_summary",
  "closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19",
  "gate_b_exact_bound_edges_remained_protected_no_support_promotion",
  "calculator_source_gap_revalidation_v19",
  "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts"
] as const;

const CURRENT_ROCKWOOL_TOKENS = [
  "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
  "rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "gate_b_mapping_tolerance_decision_no_runtime",
  "rockwool_gate_b_found_no_runtime_ready_row_selected_closeout",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "gate_c_closeout_and_next_slice_selection_no_runtime",
  "closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row",
  "calculator_source_gap_revalidation_v10",
  "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts",
  "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
  "usg_acoustical_assemblies_source_pack_extraction_v1",
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
  "selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import",
  "usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "usg_gate_b_found_no_runtime_ready_row_selected_closeout",
  "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "gate_c_closeout_and_next_slice_selection_no_runtime",
  "closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row",
  "calculator_source_gap_revalidation_v11",
  "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts",
  "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
  "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
  "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
  "selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import",
  "national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts",
  "national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout",
  "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "gate_c_closeout_and_next_slice_selection_no_runtime",
  "closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row",
  "calculator_source_gap_revalidation_v12",
  "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts",
  "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
  "selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import",
  "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
  "georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "gate_b_mapping_tolerance_decision_no_runtime",
  "georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout",
  "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "gate_c_closeout_and_next_slice_selection_no_runtime",
  "closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row",
  "calculator_source_gap_revalidation_v13",
  "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
  "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
  "selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime",
  "calculator_post_georgia_pacific_source_acquisition_v1",
  "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
  "gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import",
  "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
  "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
  "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
  "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
  "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
  "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
  "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363",
  "Georgia-Pacific Fire & Sound Assemblies",
  "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
  "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
  "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
  "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
  "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA",
  "national_gypsum_stc_rows_do_not_directly_promote_dyn_echo_rw_or_field_outputs",
  "national_gypsum_gate_b_source_rows_are_not_runtime_import_approval",
  "national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
  "national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "National Gypsum Fire & Sound Assembly Selector",
  "LEVELROCK_I_JOIST_SRM25_CARPET",
  "USG_STEEL_FRAMED_A8",
  "STC",
  "IIC",
  "USG Acoustical Assemblies",
  "paused_waiting_rights_safe_source_packet",
  "ROCKWOOL Acoustic Wall Assemblies Catalog",
  "multileaf_screening_blend",
  "Rw 41"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator route/source risk register contract", () => {
  it("documents all nine risk classes and their 2026-05-02 remediation pass", () => {
    const riskRegister = readRepoFile(RISK_REGISTER_PATH);

    expect(riskRegister).toContain("Latest risk-analysis pass: 2026-05-02");
    expect(riskRegister).toContain("## Remediation Matrix - 2026-05-02");
    expect(riskRegister).toContain("## Cross-Risk Implementation Order");

    for (const riskId of RISK_IDS) {
      expect(riskRegister, riskId).toContain(`| ${riskId} |`);
      expect(riskRegister, riskId).toContain(`## ${riskId} -`);
    }

    for (const riskName of RISK_NAMES) {
      expect(riskRegister, riskName).toContain(riskName);
    }

    for (const token of REMEDIATION_TOKENS) {
      expect(riskRegister, token).toContain(token);
    }
  });

  it("documents concrete sibling hotspots that can fail like the rockwool route flip", () => {
    const riskRegister = readRepoFile(RISK_REGISTER_PATH);

    expect(riskRegister).toContain("## Concrete Hotspot Scan - 2026-05-02");

    for (const hotspotId of HOTSPOT_IDS) {
      expect(riskRegister, hotspotId).toContain(`| ${hotspotId} |`);
    }

    for (const token of HOTSPOT_TOKENS) {
      expect(riskRegister, token).toContain(token);
    }

    expect(riskRegister).toContain("Treat H1, H5, and H11 as the highest-risk ROCKWOOL v10 rerank blockers");
    expect(riskRegister).toContain("Treat H6 and H7 as floor-side equivalents of the rockwool issue");
    expect(riskRegister).toContain("Any new source/runtime lane needs paired engine and web tests");
  });

  it("keeps the original rockwool triple-leaf problem blocked, current, and not falsely fixed", () => {
    const docs = [
      readRepoFile(RISK_REGISTER_PATH),
      readRepoFile(TRIPLE_LEAF_HANDOFF_PATH),
      readRepoFile(CURRENT_STATE_PATH),
      readRepoFile(NEXT_PLAN_PATH)
    ];

    for (const doc of docs) {
      for (const token of CURRENT_ROCKWOOL_TOKENS) {
        expect(doc, token).toContain(token);
      }
    }

    const riskRegister = docs[0];
    expect(riskRegister).toContain("Status on 2026-05-02");
    expect(riskRegister).toContain("does not validate the live split-rockwool");
    expect(riskRegister).toContain("Local exact runtime is still blocked");
  });

  it("keeps every high-risk failure mode tied to required proof before runtime promotion", () => {
    const riskRegister = readRepoFile(RISK_REGISTER_PATH);

    expect(riskRegister).toContain("Required proof before promotion");
    expect(riskRegister).toContain("A green source");
    expect(riskRegister).toContain("locator test is not enough to close any risk by itself");
    expect(riskRegister).toContain("If topology");
    expect(riskRegister).toContain("boundary hold over a precise-looking value");
    expect(riskRegister).toContain("Field metrics, API responses, output cards, and reports");
  });

  it("documents the current v19 planning refresh and historical wrong-measurement triage loop", () => {
    const docs = [
      readRepoFile(RISK_REGISTER_PATH),
      readRepoFile(CURRENT_STATE_PATH),
      readRepoFile(NEXT_PLAN_PATH),
      readRepoFile(FLOOR_TOLERANCE_PLAN_PATH),
      readRepoFile(AGENTS_PATH)
    ];

    for (const doc of docs) {
      for (const token of PLANNING_PASS_TOKENS) {
        expect(doc, token).toContain(token);
      }
    }

    const riskRegister = docs[0];
    expect(riskRegister).toContain("Every calculator-hardening slice must treat wrong route-family/source");
    expect(riskRegister).toMatch(/Gate B\s+has now landed; the current next implementation step is v19 Gate A/);
    expect(riskRegister).toMatch(/The older Gate B planning notes below are historical/);
    expect(riskRegister).toMatch(/Research should now start only if\s+v19 selects source acquisition/);
    expect(riskRegister).toContain("v19_candidate_matrix_must_rank_uris_field_alias_hostile_and_closeout_paths");
    expect(riskRegister).toContain("Uris 2006 / equivalent rockwool two-cavity source packet");
    expect(riskRegister).toMatch(/accidental\s+over-certainty near exact\/bound tolerance edges/);
    expect(riskRegister).toContain("floor role scoring and `+/- 2 mm` tolerance");
    expect(riskRegister).toMatch(/current-gate runner\s+coverage/);
    expect(riskRegister).toContain("tuas_x3_clt140_measured_2026");
    expect(riskRegister).toContain("ubiq_fl33_open_web_steel_300_lab_2026");
    expect(riskRegister).toMatch(/\+2 mm[\s\S]+\+2\.1 mm/);
    expect(riskRegister).toContain("Direct `officialFloorSystemId`");
    expect(riskRegister).toContain("not proof that an ambiguous layer stack has earned exact support");

    const v19Plan = readRepoFile(SOURCE_GAP_REVALIDATION_V19_PLAN_PATH);
    expect(v19Plan).toContain("Candidate Buckets To Evaluate");
    expect(v19Plan).toContain("wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane");
    expect(v19Plan).toContain("field_output_lab_screening_leakage_guard");
    expect(v19Plan).toContain("material_alias_and_near_source_false_promotion_guard");
    expect(v19Plan).toContain("hostile_input_and_curve_provenance_guard");
    expect(v19Plan).toContain("Expected Gate A Contract Shape");
  });
});
