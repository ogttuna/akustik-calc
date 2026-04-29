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

type ExtractionOutcome =
  | "eligible_for_later_row_mapping"
  | "formula_tolerance_context_only"
  | "rejection_context_only";

type MetricPosture =
  | "stc_astc_metric_mapping_required"
  | "stc_and_transmission_loss_context_for_formula_tolerance"
  | "database_pointer_requires_underlying_report"
  | "floor_only_metric_context_rejected_for_wall";

type SourceGroup = {
  assemblyOrientation: "wall" | "floor" | "mixed_or_database_pointer";
  dynEchoMapping:
    | "current_wall_clt_local_route"
    | "future_nlt_wall_family_only"
    | "future_double_clt_wall_family_only"
    | "source_intake_pointer_only"
    | "floor_only_source_truth";
  extractionOutcome: ExtractionOutcome;
  groupId: string;
  locator: string;
  metricPosture: MetricPosture;
  missingBeforeAnyRuntimeMovement: readonly string[];
  pairedTestShapeBeforeVisibleMovement: readonly string[];
  reportedMetrics: readonly string[];
  retrievalDate: "2026-04-29";
  runtimeImportReadyNow: false;
  sourceLabel: string;
  sourceUrl: string;
  topologyScope: string;
};

const CLT_MASS_TIMBER_WALL_SOURCE_PACK_GATE_A = {
  landedGate: "gate_a_extract_clt_mass_timber_wall_source_groups_no_runtime",
  previousSlice: "calculator_source_pack_readiness_triage_v1",
  runtimeBehaviorChange: false,
  selectedNextAction: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
  sliceId: "clt_mass_timber_wall_source_pack_extraction_v1",
  status: "no_runtime_source_group_extraction_landed",
  targetNextGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/MASTER_PLAN.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "AGENTS.md"
] as const;

const SOURCE_GROUPS: readonly SourceGroup[] = [
  {
    groupId: "woodworks_table_7_single_clt_wall",
    sourceLabel: "WoodWorks Acoustically Tested Mass Timber Assemblies",
    sourceUrl: "https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf",
    locator: "Contents Table 7, Single CLT Wall, PDF pp.29-33",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "wall",
    topologyScope:
      "single_clt_wall_panel_with_none_or_gypsum_stud_resilient_channel_and_insulation_side_finishes",
    reportedMetrics: ["STC", "FSTC", "ASTC"],
    metricPosture: "stc_astc_metric_mapping_required",
    dynEchoMapping: "current_wall_clt_local_route",
    extractionOutcome: "eligible_for_later_row_mapping",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "select_exact_row_locator_instead_of_table_group",
      "map_or_reject_stc_fstc_astc_against_iso_rw_r_prime_w_dntw_outputs",
      "name_wall_clt_tolerance_owner",
      "add_paired_engine_value_tests_and_web_route_card_or_report_tests"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_clt_wall_selected_row_value_pin",
      "web_clt_wall_route_card_metric_context_and_source_posture"
    ]
  },
  {
    groupId: "woodworks_table_8_single_nlt_wall",
    sourceLabel: "WoodWorks Acoustically Tested Mass Timber Assemblies",
    sourceUrl: "https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf",
    locator: "Contents Table 8, Single NLT Wall, PDF pp.34-36",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "wall",
    topologyScope: "single_nlt_wall_panel_with_lining_variants",
    reportedMetrics: ["STC"],
    metricPosture: "stc_and_transmission_loss_context_for_formula_tolerance",
    dynEchoMapping: "future_nlt_wall_family_only",
    extractionOutcome: "formula_tolerance_context_only",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "no_live_nlt_wall_route_exists",
      "stc_context_does_not_map_to_iso_rw_or_field_outputs_yet",
      "nlt_formula_family_and_tolerance_owner_not_named",
      "paired_engine_and_web_tests_not_defined_for_nlt_visibility"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_nlt_wall_family_support_decision",
      "web_nlt_wall_source_gated_route_card_decision"
    ]
  },
  {
    groupId: "woodworks_table_9_double_clt_wall",
    sourceLabel: "WoodWorks Acoustically Tested Mass Timber Assemblies",
    sourceUrl: "https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf",
    locator: "Contents Table 9, Double CLT Wall, PDF pp.37-39",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "wall",
    topologyScope: "double_clt_wall_assembly_with_cavity_or_separated_leaf_context",
    reportedMetrics: ["STC"],
    metricPosture: "stc_astc_metric_mapping_required",
    dynEchoMapping: "future_double_clt_wall_family_only",
    extractionOutcome: "eligible_for_later_row_mapping",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "current_live_wall_clt_local_route_is_single_leaf_not_double_clt",
      "double_leaf_mass_timber_mapping_and_formula_precedence_not_named",
      "stc_context_does_not_map_to_iso_rw_or_field_outputs_yet",
      "paired_engine_and_web_tests_not_defined_for_double_clt_visibility"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_double_clt_family_boundary_and_value_pin",
      "web_double_clt_route_card_metric_context"
    ]
  },
  {
    groupId: "woodworks_mass_timber_fire_acoustic_database",
    sourceLabel: "WoodWorks Mass Timber Fire & Acoustic Database",
    sourceUrl: "https://www.woodworks.org/resources/inventory-of-fire-resistance-tested-mass-timber-assemblies-penetrations/",
    locator: "Acoustic Tests database surface; underlying report links must be named row-by-row",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "mixed_or_database_pointer",
    topologyScope: "database_pointer_to_mass_timber_acoustic_assemblies_and_reports",
    reportedMetrics: ["STC", "IIC"],
    metricPosture: "database_pointer_requires_underlying_report",
    dynEchoMapping: "source_intake_pointer_only",
    extractionOutcome: "rejection_context_only",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "database_pointer_is_not_a_source_row",
      "underlying_report_table_and_row_locator_not_named",
      "wall_floor_orientation_not_fixed_by_database_entry_alone",
      "metric_context_and_tolerance_owner_not_extracted"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_report_locator_required_before_source_row_candidate",
      "web_no_database_pointer_as_evidence_tier_truth"
    ]
  },
  {
    groupId: "nrc_rr335_mass_timber_buildings",
    sourceLabel: "NRC RR-335 Apparent sound insulation in mass timber buildings",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f",
    locator: "RR-335 second edition archive record and report; abstract and subject metadata",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "mixed_or_database_pointer",
    topologyScope:
      "clt_nlt_dlt_wall_floor_transmission_loss_and_flanking_prediction_context_for_astc",
    reportedMetrics: ["ASTC", "laboratory_measured_sound_transmission_loss", "vibration_reduction_index"],
    metricPosture: "stc_and_transmission_loss_context_for_formula_tolerance",
    dynEchoMapping: "source_intake_pointer_only",
    extractionOutcome: "formula_tolerance_context_only",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "report_context_mixes_wall_floor_and_flanking_prediction_data",
      "exact_wall_row_locator_and_assembly_mapping_not_extracted",
      "astc_prediction_context_not_mapped_to_dyn_echo_direct_iso_rw_outputs",
      "formula_tolerance_owner_not_selected"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_metric_mapping_contract_for_astc_and_transmission_loss",
      "web_consultant_trail_displays_formula_context_without_promotion"
    ]
  },
  {
    groupId: "nrc_rr335_nlt_addendum",
    sourceLabel: "NRC Addendum to RR-335: Sound transmission through NLT assemblies",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/ft/?id=9e3b39be-e0ed-415b-9649-3e7ec228f52c",
    locator: "NLT addendum Sections 2.1/2.2 and Appendix A1 tables",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "wall",
    topologyScope: "nlt_wall_and_floor_base_assemblies_with_lining_transmission_loss_context",
    reportedMetrics: ["STC", "one_third_octave_transmission_loss", "ASTC_context"],
    metricPosture: "stc_and_transmission_loss_context_for_formula_tolerance",
    dynEchoMapping: "future_nlt_wall_family_only",
    extractionOutcome: "formula_tolerance_context_only",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "nlt_is_not_the_current_live_clt_wall_route",
      "one_third_octave_data_requires_metric_mapping_contract_before_single_number_use",
      "nlt_wall_family_and_tolerance_owner_not_named",
      "paired_engine_and_web_tests_not_defined_for_nlt_visibility"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_nlt_metric_mapping_and_formula_tolerance_contract",
      "web_nlt_context_only_honesty_card_if_route_is_introduced"
    ]
  },
  {
    groupId: "dataholz_clt_floor_exact_rows",
    sourceLabel: "Local Dataholz CLT exact floor catalog rows",
    sourceUrl: "packages/catalogs/src",
    locator: "EXACT_FLOOR_SYSTEMS rows with dataholz_*_clt_* ids",
    retrievalDate: "2026-04-29",
    assemblyOrientation: "floor",
    topologyScope: "floor_only_clt_source_truth_with_impact_and_floor_airborne_context",
    reportedMetrics: ["Rw", "Ln,w", "Ln,w+CI", "L'nT,50"],
    metricPosture: "floor_only_metric_context_rejected_for_wall",
    dynEchoMapping: "floor_only_source_truth",
    extractionOutcome: "rejection_context_only",
    runtimeImportReadyNow: false,
    missingBeforeAnyRuntimeMovement: [
      "floor_orientation_does_not_supply_wall_clt_source_truth",
      "impact_metrics_do_not_supply_wall_rw_tolerance",
      "mounting_and_boundary_conditions_do_not_match_wall_clt_route",
      "existing_negative_boundary_tests_must_remain_green"
    ],
    pairedTestShapeBeforeVisibleMovement: [
      "engine_dataholz_floor_rows_remain_floor_only",
      "web_dataholz_clt_route_does_not_promote_wall_clt"
    ]
  }
] as const;

const GATE_A_DECISION = {
  directRuntimeImportReadyNow: false,
  nextGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
  nextGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
  reason:
    "woodworks_wall_tables_and_nrc_reports_are_useful_source_context_but_metric_mapping_and_tolerance_ownership_still_block_import",
  routeCardWorkRequiredNow: false,
  runtimePosture:
    "keep_live_clt_wall_formula_owned_medium_confidence_until_exact_row_metric_mapping_tolerance_and_paired_visible_tests_exist"
} as const;

const CURRENT_LIVE_CLT_WALL_BASELINE = {
  confidence: "medium",
  dynamicFamily: "laminated_single_leaf",
  evidenceTier: "formula",
  fieldDnTwDb: 42,
  fieldRwPrimeDb: 41,
  generatedCaseId: "wall-clt-local",
  labRwDb: 42,
  routeStrategy: "laminated_leaf_sharp_delegate"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "woodworks_table_groups_are_not_import_rows_until_exact_report_and_row_locators_are_selected",
  "stc_fstc_astc_iic_values_do_not_become_iso_rw_r_prime_w_dntw_or_dnta_truth_without_metric_mapping",
  "nrc_rr335_flanking_and_astc_context_does_not_promote_direct_wall_rw_values",
  "nlt_and_double_clt_context_do_not_widen_the_current_single_leaf_wall_clt_local_route",
  "dataholz_clt_floor_exact_rows_remain_floor_only_source_truth",
  "support_confidence_evidence_api_route_card_output_card_and_proposal_copy_remain_frozen"
] as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("CLT / mass-timber wall source-pack extraction Gate A contract", () => {
  it("lands Gate A as a no-runtime source-group and metric-context extraction", () => {
    expect(CLT_MASS_TIMBER_WALL_SOURCE_PACK_GATE_A).toEqual({
      landedGate: "gate_a_extract_clt_mass_timber_wall_source_groups_no_runtime",
      previousSlice: "calculator_source_pack_readiness_triage_v1",
      runtimeBehaviorChange: false,
      selectedNextAction: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
      sliceId: "clt_mass_timber_wall_source_pack_extraction_v1",
      status: "no_runtime_source_group_extraction_landed",
      targetNextGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts bounded source groups with locators, metrics, and eligibility outcomes", () => {
    expect(SOURCE_GROUPS.map((group) => group.groupId)).toEqual([
      "woodworks_table_7_single_clt_wall",
      "woodworks_table_8_single_nlt_wall",
      "woodworks_table_9_double_clt_wall",
      "woodworks_mass_timber_fire_acoustic_database",
      "nrc_rr335_mass_timber_buildings",
      "nrc_rr335_nlt_addendum",
      "dataholz_clt_floor_exact_rows"
    ]);
    expect(new Set(SOURCE_GROUPS.map((group) => group.groupId)).size).toBe(SOURCE_GROUPS.length);
    expect(SOURCE_GROUPS.every((group) => group.locator.length > 20)).toBe(true);
    expect(SOURCE_GROUPS.every((group) => group.reportedMetrics.length > 0)).toBe(true);
    expect(SOURCE_GROUPS.every((group) => group.missingBeforeAnyRuntimeMovement.length >= 4)).toBe(true);
    expect(SOURCE_GROUPS.every((group) => group.runtimeImportReadyNow === false)).toBe(true);
    expect(new Set(SOURCE_GROUPS.map((group) => group.extractionOutcome))).toEqual(
      new Set<ExtractionOutcome>([
        "eligible_for_later_row_mapping",
        "formula_tolerance_context_only",
        "rejection_context_only"
      ])
    );
  });

  it("selects only WoodWorks wall table groups as later row-mapping candidates", () => {
    const rowMappingCandidates = SOURCE_GROUPS.filter(
      (group) => group.extractionOutcome === "eligible_for_later_row_mapping"
    );

    expect(rowMappingCandidates.map((group) => group.groupId)).toEqual([
      "woodworks_table_7_single_clt_wall",
      "woodworks_table_9_double_clt_wall"
    ]);
    expect(rowMappingCandidates.every((group) => group.assemblyOrientation === "wall")).toBe(true);
    expect(rowMappingCandidates.every((group) => group.metricPosture === "stc_astc_metric_mapping_required")).toBe(
      true
    );
    expect(rowMappingCandidates.every((group) => group.dynEchoMapping !== "floor_only_source_truth")).toBe(true);
  });

  it("keeps STC, FSTC, ASTC, IIC, and transmission-loss context blocked from DynEcho ISO outputs", () => {
    const nonIsoMetricGroups = SOURCE_GROUPS.filter((group) =>
      group.reportedMetrics.some((metric) => /STC|ASTC|IIC|transmission_loss/i.test(metric))
    );

    expect(nonIsoMetricGroups).toHaveLength(6);
    expect(nonIsoMetricGroups.every((group) => group.runtimeImportReadyNow === false)).toBe(true);
    expect(
      nonIsoMetricGroups.every((group) =>
        group.missingBeforeAnyRuntimeMovement.some((blocker) =>
          /metric|stc|astc|transmission|iso|rw/i.test(blocker)
        )
      )
    ).toBe(true);
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toContain(
      "stc_fstc_astc_iic_values_do_not_become_iso_rw_r_prime_w_dntw_or_dnta_truth_without_metric_mapping"
    );
  });

  it("pins the current CLT wall runtime baseline while extraction stays no-runtime", () => {
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

  it("keeps Dataholz CLT exact rows as floor-only source truth", () => {
    const dataholzCltRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) => system.id.startsWith("dataholz_") && system.id.includes("_clt_")
    );
    const dataholzGroup = SOURCE_GROUPS.find((group) => group.groupId === "dataholz_clt_floor_exact_rows");

    expect(dataholzCltRows).toHaveLength(9);
    expect(dataholzCltRows.every((row) => row.label.includes("CLT floor"))).toBe(true);
    expect(dataholzCltRows.every((row) => row.sourceType === "official_open_component_library")).toBe(true);
    expect(dataholzGroup).toMatchObject({
      assemblyOrientation: "floor",
      dynEchoMapping: "floor_only_source_truth",
      extractionOutcome: "rejection_context_only",
      metricPosture: "floor_only_metric_context_rejected_for_wall",
      runtimeImportReadyNow: false
    });
  });

  it("selects a no-runtime Gate B metric-mapping decision and preserves visible boundaries", () => {
    expect(GATE_A_DECISION).toEqual({
      directRuntimeImportReadyNow: false,
      nextGate: "gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime",
      nextGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
      reason:
        "woodworks_wall_tables_and_nrc_reports_are_useful_source_context_but_metric_mapping_and_tolerance_ownership_still_block_import",
      routeCardWorkRequiredNow: false,
      runtimePosture:
        "keep_live_clt_wall_formula_owned_medium_confidence_until_exact_row_metric_mapping_tolerance_and_paired_visible_tests_exist"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "woodworks_table_groups_are_not_import_rows_until_exact_report_and_row_locators_are_selected",
      "stc_fstc_astc_iic_values_do_not_become_iso_rw_r_prime_w_dntw_or_dnta_truth_without_metric_mapping",
      "nrc_rr335_flanking_and_astc_context_does_not_promote_direct_wall_rw_values",
      "nlt_and_double_clt_context_do_not_widen_the_current_single_leaf_wall_clt_local_route",
      "dataholz_clt_floor_exact_rows_remain_floor_only_source_truth",
      "support_confidence_evidence_api_route_card_output_card_and_proposal_copy_remain_frozen"
    ]);
  });
});
