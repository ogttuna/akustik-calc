import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const POST_MWI2A_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
  nextExecutionAction: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
  selectedRouteFamily: "twin_timber_knauf_ttf302a_mapping_tolerance_no_runtime",
  selectionStatus:
    "closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership",
  sliceId: "post_lined_masonry_knauf_mwi2a_mapping_tolerance_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const MWI2A_CLOSEOUT_EVIDENCE = {
  gateAContract: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
  gateAResult: "context_only_no_source_ready_runtime_candidate",
  liveRoutePosture: "screening_formula_owned_lined_massive_wall_route",
  preservedBoundaries: [
    "MWI.1A_adhesive_both_sides_no_furring_stays_adjacent_not_mwi2a_or_live_lined_heavy_truth",
    "MWI.2I_impactstop_rows_do_not_promote_sheetrock_one_or_generic_lined_masonry_mapping",
    "AAC.1A_discontinuous_aac_panel_and_steel_frame_context_stays_out_of_generic_masonry_truth",
    "floor_or_ceiling_lining_rows_do_not_supply_wall_specific_lined_masonry_truth",
    "timber_clt_no_stud_and_generated_floor_context_does_not_promote_mwi2a_or_live_screening_concrete"
  ],
  runtimeImportReadyNow: false,
  sourceContext: {
    acousticRatingsBasis: "RT&A TE405-20S09(R4)",
    boardAndMounting: "1x13 mm SHEETROCK ONE each side with side 2 on 28 mm furring channels",
    metric: "lab Rw plus Rw+Ctr context only",
    systemCode: "MWI.2A",
    values: ["source Rw span 52-61", "source Rw+Ctr span 44-51"]
  },
  unresolvedRuntimePrerequisites: [
    "exact_concrete_panel_or_core_filled_block_substrate_mass_is_not_selectable_from_live_engine_inputs",
    "sheetrock_one_to_generic_gypsum_board_mapping_is_context_only",
    "side2_furring_channel_clip_coupling_is_not_live_unsided_air_gap_truth",
    "ki25g24_or_ki50g11_glasswool_mapping_to_rockwool_is_blocked",
    "lab_rw_plus_ctr_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "mwi2a_runtime_import_confidence_or_visible_promotion",
    reason:
      "gate_a_found_mwi2a_is_context_only_because_substrate_mass_furring_coupling_material_mapping_field_output_policy_tolerance_and_paired_visible_tests_are_incomplete",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "knauf_ttf302a_twin_timber_mapping_tolerance",
    reason:
      "ttf302a_is_the_remaining_concrete_knauf_row_with_a_double_leaf_twin_timber_topology_and_it_can_map_the_no_stud_raw_open_box_and_simple_timber_negative_boundaries_without_authorizing_runtime_movement",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "knauf_tsf1201a_staggered_timber_mapping",
    reason:
      "tsf1201a_is_useful_staggered_timber_context_but_gate_b_classified_it_adjacent_only_and_ttf302a_has_the_broader_double_leaf_boundary_risk_to_resolve_first",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "clt_mass_timber_metric_policy_tolerance",
    reason:
      "clt_and_mass_timber_source_pack_extraction_already_closed_no_runtime_and_still_needs_metric_conversion_exact_wall_rows_and_tolerance_owner_before_import",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "generated_floor_fallback_or_no_stud_reopen",
    reason:
      "generated_floor_and_no_stud_double_leaf_families_already_have_recent_no_runtime_boundaries_and_still_need_exact_topology_or_local_formula_tolerance_ownership",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled_internal_use_and_productization_remain_lower_priority_than_source_accuracy_while_no_operator_defect_or_source_ready_runtime_pack_has_appeared",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md"
  }
] as const;

const SELECTED_TTF302A_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
  requiredArtifacts: [
    "ttf302a_exact_table_row_and_70_or_90_mm_column_decision",
    "twin_timber_two_frame_20_mm_gap_mapping_or_rejection",
    "asymmetric_one_by_two_13_mm_fiberock_aqua_tough_side_mapping_or_rejection",
    "ki50g11_ki75g11_ki90g11_or_nil_cavity_fill_mapping_or_rejection",
    "lab_rw_rw_ctr_versus_field_output_policy",
    "double_leaf_or_twin_frame_tolerance_owner_or_explicit_tolerance_gap",
    "negative_boundaries_for_no_stud_raw_open_box_simple_timber_tb5a_tsf1201a_and_to1201a",
    "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
  targetFirstGateFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts"
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post MWI.2A mapping / tolerance Gate C next-slice selection contract", () => {
  it("closes the MWI.2A slice without runtime or visible-surface movement", () => {
    expect(POST_MWI2A_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate:
        "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
      nextExecutionAction:
        "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
      selectedRouteFamily: "twin_timber_knauf_ttf302a_mapping_tolerance_no_runtime",
      selectionStatus:
        "closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership",
      sliceId: "post_lined_masonry_knauf_mwi2a_mapping_tolerance_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses MWI.2A Gate A evidence as closeout evidence, not import permission", () => {
    expect(MWI2A_CLOSEOUT_EVIDENCE.runtimeImportReadyNow).toBe(false);
    expect(MWI2A_CLOSEOUT_EVIDENCE.sourceContext).toMatchObject({
      acousticRatingsBasis: "RT&A TE405-20S09(R4)",
      metric: "lab Rw plus Rw+Ctr context only",
      systemCode: "MWI.2A"
    });
    expect(MWI2A_CLOSEOUT_EVIDENCE.unresolvedRuntimePrerequisites).toEqual([
      "exact_concrete_panel_or_core_filled_block_substrate_mass_is_not_selectable_from_live_engine_inputs",
      "sheetrock_one_to_generic_gypsum_board_mapping_is_context_only",
      "side2_furring_channel_clip_coupling_is_not_live_unsided_air_gap_truth",
      "ki25g24_or_ki50g11_glasswool_mapping_to_rockwool_is_blocked",
      "lab_rw_plus_ctr_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership"
    ]);
    expect(MWI2A_CLOSEOUT_EVIDENCE.preservedBoundaries.every((boundary) => boundary.length > 70)).toBe(true);
  });

  it("selects TTF30.2A as the next no-runtime source accuracy step", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "knauf_ttf302a_twin_timber_mapping_tolerance",
        reason:
          "ttf302a_is_the_remaining_concrete_knauf_row_with_a_double_leaf_twin_timber_topology_and_it_can_map_the_no_stud_raw_open_box_and_simple_timber_negative_boundaries_without_authorizing_runtime_movement",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected TTF30.2A Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_TTF302A_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
      requiredArtifacts: [
        "ttf302a_exact_table_row_and_70_or_90_mm_column_decision",
        "twin_timber_two_frame_20_mm_gap_mapping_or_rejection",
        "asymmetric_one_by_two_13_mm_fiberock_aqua_tough_side_mapping_or_rejection",
        "ki50g11_ki75g11_ki90g11_or_nil_cavity_fill_mapping_or_rejection",
        "lab_rw_rw_ctr_versus_field_output_policy",
        "double_leaf_or_twin_frame_tolerance_owner_or_explicit_tolerance_gap",
        "negative_boundaries_for_no_stud_raw_open_box_simple_timber_tb5a_tsf1201a_and_to1201a",
        "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
      targetFirstGateFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts"
    });
  });

  it("keeps docs aligned on the selected TTF30.2A next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_MWI2A_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_MWI2A_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_MWI2A_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("TTF30.2A");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
