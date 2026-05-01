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

const POST_TB5A_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
  nextExecutionAction: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
  selectedRouteFamily: "lined_masonry_knauf_mwi2a_mapping_tolerance_no_runtime",
  selectionStatus:
    "closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership",
  sliceId: "post_timber_double_board_knauf_tb5a_mapping_tolerance_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const TB5A_CLOSEOUT_EVIDENCE = {
  gateAContract: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  gateAResult: "context_only_no_source_ready_runtime_candidate",
  liveRoutePosture: "formula_owned_low_confidence_generated_timber_double_board_route",
  preservedBoundaries: [
    "TO120.1A_one_side_lined_row_stays_negative_and_never_becomes_two_sided_timber_truth",
    "TSF120.1A_staggered_stud_context_stays_adjacent_until_exact_staggered_inputs_exist",
    "TTF30.2A_twin_timber_context_stays_out_of_direct_timber_route_without_twin_frame_mapping",
    "single_board_and_resilient_timber_rows_do_not_promote_double_board_direct_route",
    "steel_clt_masonry_context_does_not_promote_tb5a_or_the_live_timber_route"
  ],
  runtimeImportReadyNow: false,
  sourceContext: {
    acousticRatingsBasis: "RT&A TE405-20S04(R4)",
    boardAndFill: "2x13 mm SHEETROCK ONE each side with KI 75G11",
    metric: "lab Rw plus Rw+Ctr context only",
    systemCode: "TB.5A",
    values: ["70 mm stud / 122 mm wall: Rw 46 (Rw+Ctr 39)", "90 mm stud / 142 mm wall: Rw 47 (Rw+Ctr 40)"]
  },
  unresolvedRuntimePrerequisites: [
    "exact_stud_depth_column_is_not_selectable_from_live_engine_inputs",
    "sheetrock_one_to_generic_gypsum_board_mapping_is_context_only",
    "ki75g11_to_rockwool_plus_air_gap_mapping_is_blocked",
    "lab_rw_does_not_supply_field_outputs_or_dyn_echo_c_ctr_stc_policy",
    "tolerance_owner_is_not_named"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "tb5a_runtime_import_confidence_or_visible_promotion",
    reason:
      "gate_a_found_tb5a_is_context_only_because exact stud depth material mapping field output policy tolerance ownership and paired visible tests are incomplete",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "knauf_mwi2a_lined_masonry_mapping_tolerance",
    reason:
      "mwi2a_is_the_next_ranked_concrete_knauf_locator_after_tb5a_and_directly_attacks_the_lined_masonry_heavy_core_screening_gap_without authorizing runtime movement",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "knauf_ttf302a_twin_timber_double_leaf_mapping",
    reason:
      "ttf302a_is_useful_adjacent_timber_double_leaf_context_but its twin frame gap side asymmetry and fiberock mapping are farther from the current live direct routes",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "clt_mass_timber_metric_policy_tolerance",
    reason:
      "clt_and_mass_timber_sources_still_need_stc_fstc_astc_iic_metric_policy_exact_wall_rows_and_tolerance_owner_before any runtime import can be honest",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "generated_floor_fallback_or_historical_blocked_reopen",
    reason:
      "floor fallback and historical blocked families already closed recent no-runtime deltas and still need exact topology or original-blocker evidence before reopening",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled internal use and productization remain lower priority than source accuracy while no operator defect or source-ready runtime pack has appeared",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md"
  }
] as const;

const SELECTED_MWI2A_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
  requiredArtifacts: [
    "mwi2a_exact_table_row_and_substrate_variant_decision",
    "concrete_panel_or_core_filled_block_mass_mapping_or_rejection",
    "sheetrock_one_to_local_board_mapping_or_rejection",
    "furring_channel_cavity_coupling_and_insulation_mapping_or_rejection",
    "lab_field_metric_and_output_policy",
    "tolerance_owner_or_explicit_tolerance_gap",
    "negative_boundaries_for_aac1a_mwi1a_floor_only_lining_and_generic_heavy_core_routes",
    "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
  targetFirstGateFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts"
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

describe("post TB.5A mapping / tolerance Gate C next-slice selection contract", () => {
  it("closes the TB.5A slice without runtime or visible-surface movement", () => {
    expect(POST_TB5A_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
      nextExecutionAction:
        "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
      selectedRouteFamily: "lined_masonry_knauf_mwi2a_mapping_tolerance_no_runtime",
      selectionStatus:
        "closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership",
      sliceId: "post_timber_double_board_knauf_tb5a_mapping_tolerance_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses TB.5A Gate A evidence as closeout evidence, not import permission", () => {
    expect(TB5A_CLOSEOUT_EVIDENCE.runtimeImportReadyNow).toBe(false);
    expect(TB5A_CLOSEOUT_EVIDENCE.sourceContext).toMatchObject({
      acousticRatingsBasis: "RT&A TE405-20S04(R4)",
      metric: "lab Rw plus Rw+Ctr context only",
      systemCode: "TB.5A"
    });
    expect(TB5A_CLOSEOUT_EVIDENCE.unresolvedRuntimePrerequisites).toEqual([
      "exact_stud_depth_column_is_not_selectable_from_live_engine_inputs",
      "sheetrock_one_to_generic_gypsum_board_mapping_is_context_only",
      "ki75g11_to_rockwool_plus_air_gap_mapping_is_blocked",
      "lab_rw_does_not_supply_field_outputs_or_dyn_echo_c_ctr_stc_policy",
      "tolerance_owner_is_not_named"
    ]);
    expect(TB5A_CLOSEOUT_EVIDENCE.preservedBoundaries.every((boundary) => boundary.length > 60)).toBe(true);
  });

  it("selects MWI.2A as the next no-runtime source accuracy step", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "knauf_mwi2a_lined_masonry_mapping_tolerance",
        reason:
          "mwi2a_is_the_next_ranked_concrete_knauf_locator_after_tb5a_and_directly_attacks_the_lined_masonry_heavy_core_screening_gap_without authorizing runtime movement",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected MWI.2A Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_MWI2A_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
      requiredArtifacts: [
        "mwi2a_exact_table_row_and_substrate_variant_decision",
        "concrete_panel_or_core_filled_block_mass_mapping_or_rejection",
        "sheetrock_one_to_local_board_mapping_or_rejection",
        "furring_channel_cavity_coupling_and_insulation_mapping_or_rejection",
        "lab_field_metric_and_output_policy",
        "tolerance_owner_or_explicit_tolerance_gap",
        "negative_boundaries_for_aac1a_mwi1a_floor_only_lining_and_generic_heavy_core_routes",
        "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
      targetFirstGateFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts"
    });
  });

  it("keeps docs aligned on the selected MWI.2A next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_TB5A_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_TB5A_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_TB5A_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("MWI.2A");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
