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

type MetricDecision = {
  directDynEchoIsoMappingReady: false;
  firstMissingRequirement: string;
  futureUse:
    | "metric_policy_research_only"
    | "row_recompute_input_only"
    | "impact_metric_rejected_for_wall_airborne"
    | "floor_metric_rejected_for_wall_import";
  metric: "STC" | "FSTC" | "ASTC" | "IIC" | "one_third_octave_transmission_loss" | "floor_Rw";
  sourceStandardOrContext: string;
  targetOutputsBlocked: readonly string[];
};

type GateBSourceDecision = {
  boundedFollowUpReadyNow: false;
  firstMissingRequirement: string;
  gateAOutcome:
    | "eligible_for_later_row_mapping"
    | "formula_tolerance_context_only"
    | "rejection_context_only";
  gateBDecision:
    | "reject_immediate_metric_mapping"
    | "reject_immediate_formula_tolerance"
    | "reject_database_pointer"
    | "reject_floor_only_wall_import";
  groupId:
    | "woodworks_table_7_single_clt_wall"
    | "woodworks_table_8_single_nlt_wall"
    | "woodworks_table_9_double_clt_wall"
    | "woodworks_mass_timber_fire_acoustic_database"
    | "nrc_rr335_mass_timber_buildings"
    | "nrc_rr335_nlt_addendum"
    | "dataholz_clt_floor_exact_rows";
  nextAllowedTrack:
    | "roadmap_exact_row_metric_policy_research"
    | "roadmap_nlt_family_tolerance_research"
    | "roadmap_double_clt_family_boundary_research"
    | "roadmap_report_pointer_row_extraction"
    | "roadmap_astc_transmission_loss_tolerance_research"
    | "none_floor_rows_remain_floor_only";
  runtimeImportReadyNow: false;
};

const CLT_MASS_TIMBER_WALL_SOURCE_PACK_GATE_B = {
  landedGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
  previousGate: "gate_a_extract_clt_mass_timber_wall_source_groups_no_runtime",
  runtimeBehaviorChange: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "clt_mass_timber_wall_source_pack_extraction_v1",
  status: "no_bounded_metric_or_formula_tolerance_path_ready",
  targetNextGateFile:
    "packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/MASTER_PLAN.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "AGENTS.md"
] as const;

const METRIC_DECISIONS: readonly MetricDecision[] = [
  {
    metric: "STC",
    sourceStandardOrContext: "ASTM_E413_single_number_rating_for_laboratory_sound_transmission_loss",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["Rw", "R'w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "stc_to_iso717_rw_policy_requires_exact_row_spectrum_or_validated_cross_standard_delta",
    futureUse: "metric_policy_research_only"
  },
  {
    metric: "FSTC",
    sourceStandardOrContext: "ASTM_E413_field_sound_transmission_class_context",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "fstc_field_rating_does_not_supply_dyn_echo_iso_field_normalisation_or_room_context",
    futureUse: "metric_policy_research_only"
  },
  {
    metric: "ASTC",
    sourceStandardOrContext: "ASTM_E336_apparent_transmission_loss_and_astc_flanking_context",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["Rw", "R'w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "astc_flanking_prediction_context_is_not_a_direct_iso_rw_or_dntw_value_mapping",
    futureUse: "metric_policy_research_only"
  },
  {
    metric: "IIC",
    sourceStandardOrContext: "impact_insulation_metric_context_in_woodworks_database_pointer",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["Rw", "R'w", "DnT,w", "DnT,A"],
    firstMissingRequirement: "iic_is_impact_metric_context_not_wall_airborne_metric_truth",
    futureUse: "impact_metric_rejected_for_wall_airborne"
  },
  {
    metric: "one_third_octave_transmission_loss",
    sourceStandardOrContext: "ISO_717_1_single_number_quantities_require_band_results",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["Rw", "R'w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "frequency_bands_need_exact_wall_row_context_and_recomputed_iso717_quantity_before_single_number_use",
    futureUse: "row_recompute_input_only"
  },
  {
    metric: "floor_Rw",
    sourceStandardOrContext: "local_dataholz_clt_floor_exact_rows",
    directDynEchoIsoMappingReady: false,
    targetOutputsBlocked: ["wall_Rw", "wall_R'w", "wall_DnT,w"],
    firstMissingRequirement: "floor_orientation_and_mounting_conditions_do_not_supply_wall_clt_truth",
    futureUse: "floor_metric_rejected_for_wall_import"
  }
] as const;

const SOURCE_GROUP_GATE_B_DECISIONS: readonly GateBSourceDecision[] = [
  {
    groupId: "woodworks_table_7_single_clt_wall",
    gateAOutcome: "eligible_for_later_row_mapping",
    gateBDecision: "reject_immediate_metric_mapping",
    firstMissingRequirement:
      "exact_table_row_locator_and_underlying_metric_method_not_selected_for_single_clt_wall",
    nextAllowedTrack: "roadmap_exact_row_metric_policy_research",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "woodworks_table_8_single_nlt_wall",
    gateAOutcome: "formula_tolerance_context_only",
    gateBDecision: "reject_immediate_formula_tolerance",
    firstMissingRequirement: "no_live_nlt_wall_family_or_formula_tolerance_owner_exists",
    nextAllowedTrack: "roadmap_nlt_family_tolerance_research",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "woodworks_table_9_double_clt_wall",
    gateAOutcome: "eligible_for_later_row_mapping",
    gateBDecision: "reject_immediate_metric_mapping",
    firstMissingRequirement: "double_clt_family_boundary_and_metric_mapping_are_not_selected",
    nextAllowedTrack: "roadmap_double_clt_family_boundary_research",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "woodworks_mass_timber_fire_acoustic_database",
    gateAOutcome: "rejection_context_only",
    gateBDecision: "reject_database_pointer",
    firstMissingRequirement: "underlying_report_table_row_and_metric_context_not_named",
    nextAllowedTrack: "roadmap_report_pointer_row_extraction",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "nrc_rr335_mass_timber_buildings",
    gateAOutcome: "formula_tolerance_context_only",
    gateBDecision: "reject_immediate_formula_tolerance",
    firstMissingRequirement:
      "mixed_wall_floor_flanking_astc_context_has_no_dyn_echo_route_tolerance_owner",
    nextAllowedTrack: "roadmap_astc_transmission_loss_tolerance_research",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "nrc_rr335_nlt_addendum",
    gateAOutcome: "formula_tolerance_context_only",
    gateBDecision: "reject_immediate_formula_tolerance",
    firstMissingRequirement: "nlt_wall_family_frequency_mapping_and_tolerance_owner_not_selected",
    nextAllowedTrack: "roadmap_nlt_family_tolerance_research",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  },
  {
    groupId: "dataholz_clt_floor_exact_rows",
    gateAOutcome: "rejection_context_only",
    gateBDecision: "reject_floor_only_wall_import",
    firstMissingRequirement: "floor_only_source_truth_cannot_promote_wall_clt_route",
    nextAllowedTrack: "none_floor_rows_remain_floor_only",
    boundedFollowUpReadyNow: false,
    runtimeImportReadyNow: false
  }
] as const;

const FORMULA_TOLERANCE_DECISION = {
  boundedFormulaToleranceReadyNow: false,
  reason:
    "woodworks_and_nrc_context_mix_metric_systems_topologies_and_flanking_scope_without_a_named_local_clt_nlt_or_double_clt_tolerance_owner",
  requiredBeforeReopen: [
    "exact_source_row_or_frequency_spectrum_locator",
    "explicit_metric_policy_for_stc_fstc_astc_iic_and_iso_outputs",
    "family_specific_tolerance_owner_for_single_clt_nlt_or_double_clt",
    "paired_engine_value_tests_and_web_visibility_tests"
  ]
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

const PROTECTED_BOUNDARIES = [
  "no_stc_fstc_astc_or_iic_value_is_imported_as_iso_rw_or_field_truth",
  "no_one_third_octave_transmission_loss_context_is_reduced_to_a_single_number_without_row_level_recompute",
  "no_nrc_flanking_or_astc_context_promotes_direct_wall_runtime_values",
  "no_woodworks_database_pointer_is_used_without_underlying_report_table_row_context",
  "no_dataholz_clt_floor_row_promotes_wall_clt_support_confidence_or_evidence",
  "support_confidence_evidence_api_route_card_output_card_proposal_copy_and_workbench_inputs_remain_frozen"
] as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("CLT / mass-timber wall source-pack extraction Gate B contract", () => {
  it("lands Gate B as a no-runtime metric-mapping and formula-tolerance decision", () => {
    expect(CLT_MASS_TIMBER_WALL_SOURCE_PACK_GATE_B).toEqual({
      landedGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
      previousGate: "gate_a_extract_clt_mass_timber_wall_source_groups_no_runtime",
      runtimeBehaviorChange: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "clt_mass_timber_wall_source_pack_extraction_v1",
      status: "no_bounded_metric_or_formula_tolerance_path_ready",
      targetNextGateFile:
        "packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("rejects direct STC/FSTC/ASTC/IIC and transmission-loss promotion into DynEcho ISO outputs", () => {
    expect(METRIC_DECISIONS.map((decision) => decision.metric)).toEqual([
      "STC",
      "FSTC",
      "ASTC",
      "IIC",
      "one_third_octave_transmission_loss",
      "floor_Rw"
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.directDynEchoIsoMappingReady === false)).toBe(true);
    expect(METRIC_DECISIONS.every((decision) => decision.firstMissingRequirement.length > 20)).toBe(true);
    expect(
      METRIC_DECISIONS.filter((decision) => decision.futureUse === "metric_policy_research_only").map(
        (decision) => decision.metric
      )
    ).toEqual(["STC", "FSTC", "ASTC"]);
    expect(METRIC_DECISIONS.find((decision) => decision.metric === "IIC")).toMatchObject({
      futureUse: "impact_metric_rejected_for_wall_airborne"
    });
    expect(METRIC_DECISIONS.find((decision) => decision.metric === "one_third_octave_transmission_loss")).toMatchObject(
      {
        futureUse: "row_recompute_input_only"
      }
    );
  });

  it("rejects every Gate A source group from immediate bounded follow-up with its first missing requirement", () => {
    expect(SOURCE_GROUP_GATE_B_DECISIONS.map((decision) => decision.groupId)).toEqual([
      "woodworks_table_7_single_clt_wall",
      "woodworks_table_8_single_nlt_wall",
      "woodworks_table_9_double_clt_wall",
      "woodworks_mass_timber_fire_acoustic_database",
      "nrc_rr335_mass_timber_buildings",
      "nrc_rr335_nlt_addendum",
      "dataholz_clt_floor_exact_rows"
    ]);
    expect(SOURCE_GROUP_GATE_B_DECISIONS.every((decision) => decision.boundedFollowUpReadyNow === false)).toBe(true);
    expect(SOURCE_GROUP_GATE_B_DECISIONS.every((decision) => decision.runtimeImportReadyNow === false)).toBe(true);
    expect(SOURCE_GROUP_GATE_B_DECISIONS.every((decision) => decision.firstMissingRequirement.length > 20)).toBe(true);
    expect(SOURCE_GROUP_GATE_B_DECISIONS.some((decision) => decision.gateBDecision === "reject_database_pointer")).toBe(
      true
    );
    expect(
      SOURCE_GROUP_GATE_B_DECISIONS.some((decision) => decision.gateBDecision === "reject_floor_only_wall_import")
    ).toBe(true);
  });

  it("keeps formula-tolerance work in roadmap context until a local tolerance owner exists", () => {
    expect(FORMULA_TOLERANCE_DECISION).toEqual({
      boundedFormulaToleranceReadyNow: false,
      reason:
        "woodworks_and_nrc_context_mix_metric_systems_topologies_and_flanking_scope_without_a_named_local_clt_nlt_or_double_clt_tolerance_owner",
      requiredBeforeReopen: [
        "exact_source_row_or_frequency_spectrum_locator",
        "explicit_metric_policy_for_stc_fstc_astc_iic_and_iso_outputs",
        "family_specific_tolerance_owner_for_single_clt_nlt_or_double_clt",
        "paired_engine_value_tests_and_web_visibility_tests"
      ]
    });
    expect(SOURCE_GROUP_GATE_B_DECISIONS.map((decision) => decision.nextAllowedTrack)).toEqual([
      "roadmap_exact_row_metric_policy_research",
      "roadmap_nlt_family_tolerance_research",
      "roadmap_double_clt_family_boundary_research",
      "roadmap_report_pointer_row_extraction",
      "roadmap_astc_transmission_loss_tolerance_research",
      "roadmap_nlt_family_tolerance_research",
      "none_floor_rows_remain_floor_only"
    ]);
  });

  it("pins the current CLT wall runtime values while Gate B stays no-runtime", () => {
    const testCase = generatedCase(CURRENT_LIVE_CLT_WALL_BASELINE.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(testCase.studyMode).toBe("wall");
    expect(labSnapshot).toMatchObject({
      dynamicFamily: CURRENT_LIVE_CLT_WALL_BASELINE.dynamicFamily,
      rw: CURRENT_LIVE_CLT_WALL_BASELINE.labRwDb,
      rwDb: CURRENT_LIVE_CLT_WALL_BASELINE.labRwDb,
      stc: 43
    });
    expect(fieldSnapshot).toMatchObject({
      dnTw: CURRENT_LIVE_CLT_WALL_BASELINE.fieldDnTwDb,
      dynamicFamily: CURRENT_LIVE_CLT_WALL_BASELINE.dynamicFamily,
      rw: CURRENT_LIVE_CLT_WALL_BASELINE.fieldRwPrimeDb,
      rwDb: CURRENT_LIVE_CLT_WALL_BASELINE.fieldRwPrimeDb,
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
  });

  it("keeps local Dataholz CLT exact rows floor-only after the metric decision", () => {
    const dataholzCltRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) => system.id.startsWith("dataholz_") && system.id.includes("_clt_")
    );
    const dataholzDecision = SOURCE_GROUP_GATE_B_DECISIONS.find(
      (decision) => decision.groupId === "dataholz_clt_floor_exact_rows"
    );

    expect(dataholzCltRows).toHaveLength(9);
    expect(dataholzCltRows.every((row) => row.label.includes("CLT floor"))).toBe(true);
    expect(dataholzDecision).toMatchObject({
      gateBDecision: "reject_floor_only_wall_import",
      nextAllowedTrack: "none_floor_rows_remain_floor_only",
      runtimeImportReadyNow: false
    });
  });

  it("selects Gate C closeout and preserves all visible/runtime boundaries", () => {
    expect(CLT_MASS_TIMBER_WALL_SOURCE_PACK_GATE_B.selectedNextAction).toBe(
      "gate_c_closeout_and_next_slice_selection_no_runtime"
    );
    expect(PROTECTED_BOUNDARIES).toEqual([
      "no_stc_fstc_astc_or_iic_value_is_imported_as_iso_rw_or_field_truth",
      "no_one_third_octave_transmission_loss_context_is_reduced_to_a_single_number_without_row_level_recompute",
      "no_nrc_flanking_or_astc_context_promotes_direct_wall_runtime_values",
      "no_woodworks_database_pointer_is_used_without_underlying_report_table_row_context",
      "no_dataholz_clt_floor_row_promotes_wall_clt_support_confidence_or_evidence",
      "support_confidence_evidence_api_route_card_output_card_proposal_copy_and_workbench_inputs_remain_frozen"
    ]);
  });
});
