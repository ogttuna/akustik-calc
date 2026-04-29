import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_CLT_MASS_TIMBER_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "clt_mass_timber_wall_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_build_company_internal_acceptance_rehearsal_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "internal_use_acceptance_rehearsal_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
  selectedRouteFamily: "company_internal_acceptance_rehearsal_no_runtime",
  selectionStatus:
    "closed_clt_mass_timber_source_pack_no_runtime_and_selected_internal_acceptance_rehearsal_because_no_source_ready_accuracy_pack_exists",
  sliceId: "post_clt_mass_timber_wall_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts"
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
  "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_ROADMAP_TRACKS = [
  {
    id: "woodworks_table_7_single_clt_wall",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "exact_table_row_locator_underlying_metric_policy_and_tolerance_owner"
  },
  {
    id: "woodworks_table_8_single_nlt_wall",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "live_nlt_wall_family_frequency_mapping_and_formula_tolerance_owner"
  },
  {
    id: "woodworks_table_9_double_clt_wall",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "double_clt_family_boundary_metric_policy_and_tolerance_owner"
  },
  {
    id: "woodworks_mass_timber_fire_acoustic_database",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "underlying_report_table_row_metric_and_lab_or_field_context"
  },
  {
    id: "nrc_rr335_mass_timber_buildings",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "local_dyn_echo_route_tolerance_owner_for_astc_flanking_or_tl_context"
  },
  {
    id: "nrc_rr335_nlt_addendum",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "nlt_wall_family_mapping_metric_policy_and_tolerance_owner"
  },
  {
    id: "dataholz_clt_floor_exact_rows",
    sourceReadyRuntimePack: false,
    firstMissingRequirement: "floor_only_orientation_and_mounting_cannot_supply_wall_clt_truth"
  }
] as const;

const POST_GATE_C_SOURCE_READINESS = [
  {
    id: "timber_double_board_stud_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "direct_live_double_board_timber_stack_row_or_bounded_formula_tolerance_owner",
    nextSourceAction: "defer_until_source_row_or_formula_owner_exists"
  },
  {
    id: "clt_mass_timber_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "wall_specific_clt_nlt_dlt_row_pack_or_laminated_leaf_tolerance_owner",
    nextSourceAction: "defer_after_gate_b_metric_and_tolerance_rejection"
  },
  {
    id: "no_stud_double_leaf_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_tolerance_owner",
    nextSourceAction: "defer_until_local_formula_tolerance_owner_exists"
  },
  {
    id: "generated_floor_fallback",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
    nextSourceAction: "defer_until_floor_family_rule_or_exact_match_exists"
  },
  {
    id: "lined_massive_heavy_core_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule",
    nextSourceAction: "defer_until_wall_specific_lining_source_exists"
  },
  {
    id: "historical_blocked_families",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "new_source_evidence_for_gdmtxa04a_c11c_or_true_bare_carrier_impact_behavior",
    nextSourceAction: "keep_fail_closed_until_old_blocker_is_satisfied"
  }
] as const;

const INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_A = {
  firstGate: "gate_a_build_company_internal_acceptance_rehearsal_matrix_no_runtime",
  requiredScenarioBuckets: [
    "pilot_ready_with_standard_caveat",
    "pilot_allowed_with_visible_caveat",
    "not_defended_fail_closed_or_source_gated",
    "hostile_many_layer_reorder_and_missing_input_edges"
  ],
  requiredScenarioCountRange: {
    minimum: 10,
    target: 20
  },
  requiredAssertions: [
    "value_snapshot_or_supported_output_status",
    "evidence_confidence_and_caveat_visibility",
    "required_input_or_unsupported_output_message",
    "route_card_or_report_posture_when_user_visible",
    "no_runtime_support_confidence_or_evidence_promotion"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts"
} as const;

const CURRENT_LIVE_CLT_WALL_BASELINE = {
  confidence: "medium",
  dynamicFamily: "laminated_single_leaf",
  fieldDnTwDb: 42,
  fieldRwPrimeDb: 41,
  generatedCaseId: "wall-clt-local",
  labRwDb: 42,
  routeStrategy: "laminated_leaf_sharp_delegate"
} as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("post CLT / mass-timber source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the CLT / mass-timber extraction slice no-runtime", () => {
    expect(POST_CLT_MASS_TIMBER_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "clt_mass_timber_wall_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_build_company_internal_acceptance_rehearsal_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "internal_use_acceptance_rehearsal_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
      selectedRouteFamily: "company_internal_acceptance_rehearsal_no_runtime",
      selectionStatus:
        "closed_clt_mass_timber_source_pack_no_runtime_and_selected_internal_acceptance_rehearsal_because_no_source_ready_accuracy_pack_exists",
      sliceId: "post_clt_mass_timber_wall_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts"
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every Gate B roadmap track out of source-ready runtime import", () => {
    expect(GATE_B_ROADMAP_TRACKS.map((track) => track.id)).toEqual([
      "woodworks_table_7_single_clt_wall",
      "woodworks_table_8_single_nlt_wall",
      "woodworks_table_9_double_clt_wall",
      "woodworks_mass_timber_fire_acoustic_database",
      "nrc_rr335_mass_timber_buildings",
      "nrc_rr335_nlt_addendum",
      "dataholz_clt_floor_exact_rows"
    ]);
    expect(GATE_B_ROADMAP_TRACKS.every((track) => track.sourceReadyRuntimePack === false)).toBe(true);
    expect(GATE_B_ROADMAP_TRACKS.every((track) => track.firstMissingRequirement.length > 40)).toBe(true);
  });

  it("preserves the CLT wall runtime baseline and Dataholz floor-only boundary", () => {
    const testCase = generatedCase(CURRENT_LIVE_CLT_WALL_BASELINE.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);
    const dataholzCltRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) => system.id.startsWith("dataholz_") && system.id.includes("_clt_")
    );

    expect(labSnapshot).toMatchObject({
      dynamicFamily: CURRENT_LIVE_CLT_WALL_BASELINE.dynamicFamily,
      rw: CURRENT_LIVE_CLT_WALL_BASELINE.labRwDb,
      rwDb: CURRENT_LIVE_CLT_WALL_BASELINE.labRwDb
    });
    expect(fieldSnapshot).toMatchObject({
      dnTw: CURRENT_LIVE_CLT_WALL_BASELINE.fieldDnTwDb,
      dynamicFamily: CURRENT_LIVE_CLT_WALL_BASELINE.dynamicFamily,
      rw: CURRENT_LIVE_CLT_WALL_BASELINE.fieldRwPrimeDb,
      rwPrimeDb: CURRENT_LIVE_CLT_WALL_BASELINE.fieldRwPrimeDb
    });
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: CURRENT_LIVE_CLT_WALL_BASELINE.confidence,
      strategy: CURRENT_LIVE_CLT_WALL_BASELINE.routeStrategy
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: CURRENT_LIVE_CLT_WALL_BASELINE.confidence,
      strategy: CURRENT_LIVE_CLT_WALL_BASELINE.routeStrategy
    });
    expect(dataholzCltRows).toHaveLength(9);
    expect(dataholzCltRows.every((row) => row.label.includes("CLT floor"))).toBe(true);
  });

  it("confirms no source-ready accuracy pack outranks an internal acceptance rehearsal", () => {
    expect(POST_GATE_C_SOURCE_READINESS.map((candidate) => candidate.id)).toEqual([
      "timber_double_board_stud_wall",
      "clt_mass_timber_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "lined_massive_heavy_core_wall",
      "historical_blocked_families"
    ]);
    expect(POST_GATE_C_SOURCE_READINESS.every((candidate) => candidate.runtimeImportReadyNow === false)).toBe(true);
    expect(POST_GATE_C_SOURCE_READINESS.every((candidate) => candidate.firstMissingRequirement.length > 40)).toBe(
      true
    );
    expect(POST_CLT_MASS_TIMBER_GATE_C_CLOSEOUT.selectedImplementationSlice).toBe(
      "internal_use_acceptance_rehearsal_v1"
    );
  });

  it("defines the next Gate A acceptance-rehearsal contract without runtime promotion", () => {
    expect(INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_A).toEqual({
      firstGate: "gate_a_build_company_internal_acceptance_rehearsal_matrix_no_runtime",
      requiredScenarioBuckets: [
        "pilot_ready_with_standard_caveat",
        "pilot_allowed_with_visible_caveat",
        "not_defended_fail_closed_or_source_gated",
        "hostile_many_layer_reorder_and_missing_input_edges"
      ],
      requiredScenarioCountRange: {
        minimum: 10,
        target: 20
      },
      requiredAssertions: [
        "value_snapshot_or_supported_output_status",
        "evidence_confidence_and_caveat_visibility",
        "required_input_or_unsupported_output_message",
        "route_card_or_report_posture_when_user_visible",
        "no_runtime_support_confidence_or_evidence_promotion"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts"
    });
  });
});
