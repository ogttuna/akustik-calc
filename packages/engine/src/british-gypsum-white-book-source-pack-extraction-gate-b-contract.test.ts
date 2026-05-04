import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import { WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS } from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GateBDecision =
  | "already_landed_exact_anchor_no_new_runtime"
  | "block_immediate_runtime_import"
  | "keep_context_only";

type GateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "already_landed_as_resilient_timber_both_sides_exact_anchor"
    | "floor_row_not_live_exact_floor_catalog_topology"
    | "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity"
    | "not_live_lined_masonry_route"
    | "not_live_twin_frame_audio_route";
  firstMissingRequirement: string;
  gateBDecision: GateBDecision;
  localMaterialMapping:
    | "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing"
    | "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing"
    | "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing"
    | "blocked_twin_frame_bracing_multi_cavity_mapping_missing"
    | "complete_existing_wall_timber_lightweight_exact_import";
  metricOwner:
    | "already_owned_existing_lab_rw_anchor"
    | "floor_lab_rw_rw_ctr_lnw_context_without_field_floor_owner"
    | "wall_lab_rw_rw_ctr_context_without_field_owner";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  runtimeImportReadyNow: false;
  selectedNewRuntimeImportNow: false;
  systemCode: string;
  toleranceOwnerNamed: boolean;
};

type MetricPolicyDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext:
    | "existing_exact_lab_rw_anchor"
    | "source_floor_lab_rw_rw_ctr_lnw"
    | "source_wall_lab_rw_plus_ctr";
  runtimeOutputReadyNow: false;
};

const BRITISH_GYPSUM_WHITE_BOOK_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_british_gypsum_white_book_rows_no_runtime",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "british_gypsum_white_book_source_pack_extraction_v1",
  status:
    "british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
] as const;

const GATE_B_ROW_DECISIONS: readonly GateBRowDecision[] = [
  {
    blockedTargetOutputs: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
    currentImplementationFit: "floor_row_not_live_exact_floor_catalog_topology",
    firstMissingRequirement:
      "c204006_needs_gypframe_sif_channel_timber_joist_rb1_ceiling_soundbloc_plank_and_floor_tolerance_mapping_before_exact_floor_import",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing",
    metricOwner: "floor_lab_rw_rw_ctr_lnw_context_without_field_floor_owner",
    protectedBoundary:
      "c204006_gypfloor_silent_row_is_floor_only_and_must_not_promote_wall_routes_or_generic_generated_floor_fallbacks",
    requiredEngineTestsBeforeRuntime: [
      "engine_c204006_exact_floor_value_or_rejection_pin",
      "engine_c204006_rejects_wall_and_generic_timber_floor_near_miss_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_c204006_floor_route_card_lab_context",
      "web_c204006_report_keeps_field_floor_outputs_source_gated"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "C204006",
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
    currentImplementationFit: "floor_row_not_live_exact_floor_catalog_topology",
    firstMissingRequirement:
      "c204003_needs_gypframe_sif_channel_timber_joist_plank_fireline_ceiling_mapping_and_separate_tolerance_from_c204006",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing",
    metricOwner: "floor_lab_rw_rw_ctr_lnw_context_without_field_floor_owner",
    protectedBoundary:
      "c204003_plank_fireline_variant_does_not_substitute_for_c204006_soundbloc_or_generic_timber_floor_truth",
    requiredEngineTestsBeforeRuntime: [
      "engine_c204003_exact_floor_value_or_rejection_pin",
      "engine_c204003_rejects_c204006_and_generic_timber_floor_substitution"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_c204003_floor_route_card_lab_context",
      "web_c204003_report_keeps_impact_and_airborne_metric_context_explicit"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "C204003",
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    currentImplementationFit: "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity",
    firstMissingRequirement:
      "a206a290_needs_acoustud_soundbloc_apr_cavity_stud_precedence_mapping_and_row_specific_tolerance_before_import",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing",
    metricOwner: "wall_lab_rw_rw_ctr_context_without_field_owner",
    protectedBoundary:
      "a206a290_must_not_override_live_knauf_lsf_exact_anchor_or_promote_field_outputs_without_precedence_tests",
    requiredEngineTestsBeforeRuntime: [
      "engine_a206a290_steel_stud_lab_rw_value_or_rejection_pin",
      "engine_a206a290_does_not_replace_knauf_lab_416889_anchor"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_a206a290_route_card_lab_context",
      "web_a206a290_report_keeps_field_outputs_source_gated"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "A206A290",
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: [],
    currentImplementationFit: "already_landed_as_resilient_timber_both_sides_exact_anchor",
    firstMissingRequirement:
      "none_for_existing_exact_anchor_but_duplicate_import_and_direct_timber_route_promotion_remain_forbidden",
    gateBDecision: "already_landed_exact_anchor_no_new_runtime",
    localMaterialMapping: "complete_existing_wall_timber_lightweight_exact_import",
    metricOwner: "already_owned_existing_lab_rw_anchor",
    protectedBoundary:
      "a046006_is_already_landed_as_resilient_bar_both_sides_exact_anchor_not_a_new_import_or_direct_timber_truth",
    requiredEngineTestsBeforeRuntime: [
      "engine_existing_british_gypsum_a046006_exact_import_stays_value_pinned",
      "engine_a046006_does_not_promote_direct_timber_double_board_without_resilient_bar_context"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_existing_a046006_route_card_exact_context_stays_visible",
      "web_timber_direct_route_rejects_a046006_duplicate_promotion"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "A046006",
    toleranceOwnerNamed: true
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    currentImplementationFit: "not_live_twin_frame_audio_route",
    firstMissingRequirement:
      "a326017b_needs_twin_92s10_frames_gab3_bracing_600mm_width_six_insulation_layers_metric_policy_tolerance_and_negative_boundaries",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_twin_frame_bracing_multi_cavity_mapping_missing",
    metricOwner: "wall_lab_rw_rw_ctr_context_without_field_owner",
    protectedBoundary:
      "a326017b_twin_frame_audio_does_not_reopen_no_stud_raw_open_box_or_simple_timber_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_a326017b_twin_frame_value_or_rejection_pin",
      "engine_a326017b_rejects_no_stud_raw_open_box_and_simple_timber_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_a326017b_route_card_twin_frame_context",
      "web_a326017b_report_keeps_double_leaf_outputs_source_gated"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "A326017B",
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    currentImplementationFit: "not_live_lined_masonry_route",
    firstMissingRequirement:
      "b226010_needs_103mm_solid_brick_density_plaster_gl1_channels_35mm_cavities_apr_lining_policy_and_lined_masonry_tolerance",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing",
    metricOwner: "wall_lab_rw_rw_ctr_context_without_field_owner",
    protectedBoundary:
      "b226010_lined_brick_does_not_promote_generic_lined_concrete_mwi2a_or_heavy_core_screening_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_b226010_lined_brick_value_or_rejection_pin",
      "engine_b226010_does_not_promote_generic_concrete_or_mwi2a_without_substrate_mapping"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_b226010_route_card_lined_brick_context",
      "web_b226010_report_keeps_heavy_core_screening_honest"
    ],
    runtimeImportReadyNow: false,
    selectedNewRuntimeImportNow: false,
    systemCode: "B226010",
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_POLICY_DECISIONS: readonly MetricPolicyDecision[] = [
  {
    blockedTargets: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
    firstMissingRequirement:
      "floor_rows_report_lab_rw_rw_ctr_lnw_but_do_not_supply_wall_outputs_or_field_floor_normalisation_owner",
    metricContext: "source_floor_lab_rw_rw_ctr_lnw",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "wall_rows_report_lab_rw_plus_ctr_but_do_not_supply_field_outputs_or_dyn_echo_spectrum_policy",
    metricContext: "source_wall_lab_rw_plus_ctr",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: [],
    firstMissingRequirement: "none_for_existing_a046006_lab_rw_anchor",
    metricContext: "existing_exact_lab_rw_anchor",
    runtimeOutputReadyNow: false
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "c204006_and_c204003_floor_rows_do_not_promote_wall_outputs_or_generic_generated_floor_fallbacks",
  "c204003_plank_fireline_variant_does_not_substitute_for_c204006_soundbloc_context",
  "a206a290_does_not_override_existing_knauf_lsf_anchor_without_precedence_tests",
  "a046006_is_already_landed_and_must_not_be_reimported_or_used_for_direct_timber_routes",
  "a326017b_twin_frame_audio_does_not_promote_no_stud_raw_open_box_or_simple_timber_routes",
  "b226010_lined_brick_does_not_promote_generic_lined_concrete_mwi2a_or_heavy_core_screening",
  "rw_ctr_context_does_not_promote_standalone_c_ctr_or_field_outputs_without_metric_policy"
] as const;

const GATE_B_DECISION = {
  alreadyRepresentedRows: ["A046006"],
  rowsKeptContextOnly: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("British Gypsum White Book source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(BRITISH_GYPSUM_WHITE_BOOK_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_british_gypsum_white_book_rows_no_runtime",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "british_gypsum_white_book_source_pack_extraction_v1",
      status:
        "british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted row out of new runtime import while preserving A046006", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.systemCode)).toEqual([
      "C204006",
      "C204003",
      "A206A290",
      "A046006",
      "A326017B",
      "B226010"
    ]);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedNewRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.gateBDecision === "already_landed_exact_anchor_no_new_runtime"))
      .toEqual([expect.objectContaining({ systemCode: "A046006", toleranceOwnerNamed: true })]);
    expect(GATE_B_DECISION).toEqual({
      alreadyRepresentedRows: ["A046006"],
      rowsKeptContextOnly: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("keeps GypFloor Silent rows floor-only and out of the current exact floor catalog", () => {
    const floorRows = GATE_B_ROW_DECISIONS.filter((row) => row.systemCode.startsWith("C204"));

    expect(floorRows.map((row) => row.localMaterialMapping)).toEqual([
      "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing",
      "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing"
    ]);
    expect(floorRows.every((row) => row.blockedTargetOutputs.includes("wall_outputs"))).toBe(true);
    expect(floorRows.every((row) => row.metricOwner === "floor_lab_rw_rw_ctr_lnw_context_without_field_floor_owner"))
      .toBe(true);
    expect(
      EXACT_FLOOR_SYSTEMS.some((system) => /c20400[36]|gypfloor|british_gypsum/i.test(`${system.id} ${system.label}`))
    ).toBe(false);
  });

  it("keeps A206A290 from replacing the existing Knauf LSF exact anchor and A046006 from duplicate import", () => {
    const testCase = generatedCase("wall-lsf-knauf");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const a046006 = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
      (entry) => entry.id === "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    );

    expect(GATE_B_ROW_DECISIONS.find((row) => row.systemCode === "A206A290")).toMatchObject({
      currentImplementationFit: "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity",
      localMaterialMapping: "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing",
      toleranceOwnerNamed: false
    });
    expect(resultSnapshot(lab)).toMatchObject({
      dynamicFamily: "stud_wall_system",
      rw: 55,
      rwDb: 55,
      stc: 55
    });
    expect(a046006).toMatchObject({
      classification: "exact_import_landed",
      expectedRw: 58,
      toleranceDb: 3
    });
  });

  it("keeps twin-frame and lined-brick rows as context-only near-source boundaries", () => {
    expect(GATE_B_ROW_DECISIONS.find((row) => row.systemCode === "A326017B")).toMatchObject({
      currentImplementationFit: "not_live_twin_frame_audio_route",
      gateBDecision: "keep_context_only",
      localMaterialMapping: "blocked_twin_frame_bracing_multi_cavity_mapping_missing",
      toleranceOwnerNamed: false
    });
    expect(GATE_B_ROW_DECISIONS.find((row) => row.systemCode === "B226010")).toMatchObject({
      currentImplementationFit: "not_live_lined_masonry_route",
      gateBDecision: "keep_context_only",
      localMaterialMapping: "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing",
      toleranceOwnerNamed: false
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toContain(
      "a326017b_twin_frame_audio_does_not_promote_no_stud_raw_open_box_or_simple_timber_routes"
    );
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toContain(
      "b226010_lined_brick_does_not_promote_generic_lined_concrete_mwi2a_or_heavy_core_screening"
    );
  });

  it("keeps metric and tolerance policy from leaking lab rows into field outputs", () => {
    expect(METRIC_POLICY_DECISIONS).toEqual([
      {
        blockedTargets: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
        firstMissingRequirement:
          "floor_rows_report_lab_rw_rw_ctr_lnw_but_do_not_supply_wall_outputs_or_field_floor_normalisation_owner",
        metricContext: "source_floor_lab_rw_rw_ctr_lnw",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
        firstMissingRequirement:
          "wall_rows_report_lab_rw_plus_ctr_but_do_not_supply_field_outputs_or_dyn_echo_spectrum_policy",
        metricContext: "source_wall_lab_rw_plus_ctr",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: [],
        firstMissingRequirement: "none_for_existing_a046006_lab_rw_anchor",
        metricContext: "existing_exact_lab_rw_anchor",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.systemCode !== "A046006").every((row) => !row.toleranceOwnerNamed))
      .toBe(true);
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toContain(
      "rw_ctr_context_does_not_promote_standalone_c_ctr_or_field_outputs_without_metric_policy"
    );
  });

  it("keeps active docs aligned on Gate C closeout as the next no-runtime action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_B.sliceId);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_B.status);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_B.selectedNextAction);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_B.targetNextGateFile);
      expect(doc).toContain("A046006");
      expect(doc).toContain("C204006");
      expect(doc).toContain("B226010");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
