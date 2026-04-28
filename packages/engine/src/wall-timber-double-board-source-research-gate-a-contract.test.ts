import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightLinkedHoldoutRow,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

type EvidenceFit =
  | "live_formula_route"
  | "adjacent_single_board_exact_import"
  | "adjacent_resilient_side_count_exact_import"
  | "secondary_direct_double_board_benchmark"
  | "non_timber_holdout_context"
  | "missing_formula_tolerance_owner";

type SourceCandidate = {
  evidenceFit: EvidenceFit;
  id: string;
  missingBeforeRuntimeMovement: readonly string[];
  rowIds: readonly string[];
  runtimeMovementAllowedNow: false;
  selectedForGateBNow: boolean;
  selectedForGateCNow: boolean;
  topologyFit:
    | "current_live_stack"
    | "single_board_timber_only"
    | "resilient_timber_requires_side_count"
    | "direct_double_board_but_not_live_stack"
    | "steel_framed_not_wood_stud"
    | "no_named_bounded_formula";
};

const WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A = {
  landedGate: "gate_a_timber_double_board_source_and_tolerance_inventory",
  previousClosedSlice: "wall_no_stud_double_leaf_source_research_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  sliceId: "wall_timber_double_board_source_research_v1",
  status: "no_runtime_source_and_tolerance_inventory_landed"
} as const;

const CURRENT_LIVE_TIMBER_DOUBLE_BOARD_ROUTE_POSTURE = {
  currentEvidenceTier: "formula",
  currentRuntimePosture: {
    confidence: "low",
    fieldContextDnTwDb: 43,
    fieldRwPrimeDb: 42,
    labRwDb: 50,
    strategy: "stud_surrogate_blend+framed_wall_calibration",
    workbenchBuildingContextDnTwDb: 44
  },
  generatedCaseId: "wall-timber-stud",
  layers: [
    "2x12.5 mm gypsum_board",
    "50 mm rockwool",
    "50 mm air_gap",
    "2x12.5 mm gypsum_board"
  ],
  requiredUnlock: "exact_direct_double_board_timber_row_or_named_bounded_formula_tolerance_owner"
} as const;

const SOURCE_CANDIDATES: readonly SourceCandidate[] = [
  {
    evidenceFit: "live_formula_route",
    id: "current_wall_timber_stud_generated_route",
    missingBeforeRuntimeMovement: [
      "no_verified_airborne_exact_match",
      "no_verified_lab_fallback_match",
      "no_direct_same_stack_source_row",
      "no_named_bounded_timber_stud_formula_tolerance_owner"
    ],
    rowIds: ["wall-timber-stud"],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "current_live_stack"
  },
  {
    evidenceFit: "adjacent_single_board_exact_import",
    id: "direct_single_board_timber_exact_rows",
    missingBeforeRuntimeMovement: [
      "board_count_is_single_board_not_live_double_board",
      "live_layer_signature_does_not_match",
      "paired_engine_and_web_import_tests_not_named"
    ],
    rowIds: [
      "knauf_gb_en_tp_63_38_1x12p5_wb_direct_uninsulated_lab_2026",
      "knauf_gb_en_tp_63_38_1x12p5_wb_50_acoustic_roll_lab_2026"
    ],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "single_board_timber_only"
  },
  {
    evidenceFit: "adjacent_resilient_side_count_exact_import",
    id: "rb1_rb2_resilient_double_board_timber_exact_rows",
    missingBeforeRuntimeMovement: [
      "live_route_is_direct_line_connection_not_resilient_channel",
      "resilient_bar_side_count_must_stay_explicit",
      "acoustic_board_topology_does_not_match_live_gypsum_board_stack",
      "paired_engine_and_web_import_tests_not_named"
    ],
    rowIds: [
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "resilient_timber_requires_side_count"
  },
  {
    evidenceFit: "secondary_direct_double_board_benchmark",
    id: "gyproc_fireline_direct_double_board_secondary_benchmark",
    missingBeforeRuntimeMovement: [
      "proprietary_fireline_board_mapping_is_not_exact",
      "uninsulated_100_mm_cavity_does_not_match_live_rockwool_plus_air_gap_stack",
      "2x15_mm_board_each_side_does_not_match_live_2x12p5_mm_board_each_side",
      "secondary_benchmark_is_not_an_import_ready_exact_row"
    ],
    rowIds: ["gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026"],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "direct_double_board_but_not_live_stack"
  },
  {
    evidenceFit: "non_timber_holdout_context",
    id: "lightweight_steel_linked_holdout_context",
    missingBeforeRuntimeMovement: [
      "stud_material_is_lightweight_steel_not_wood_stud",
      "holdout_rows_keep_existing_generic_dataset_as_source_of_truth",
      "not_a_timber_double_board_import_unlock"
    ],
    rowIds: [
      "knauf_w111_75_100_60mw_a_rw_holdout_2026",
      "knauf_w112_75_125_60mw_a_rw_holdout_2026"
    ],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "steel_framed_not_wood_stud"
  },
  {
    evidenceFit: "missing_formula_tolerance_owner",
    id: "published_timber_stud_formula_tolerance_owner",
    missingBeforeRuntimeMovement: [
      "no_named_published_formula_in_repo_with_local_single_number_rw_tolerance_for_this_route",
      "no_route_specific_fit_corridor_for_stud_surrogate_blend_and_framed_wall_calibration",
      "no_negative_boundaries_for_resilient_proprietary_steel_or_clt_contexts"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "no_named_bounded_formula"
  }
] as const;

const GATE_A_DECISION = {
  directImportReadyNow: false,
  formulaToleranceGateReadyNow: false,
  noRuntimeCloseoutReadyNow: true,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  runtimePosture:
    "keep_live_timber_double_board_formula_owned_low_confidence_until_exact_source_row_or_bounded_formula_tolerance_exists",
  selectedDirectImportNow: false,
  selectedFormulaToleranceGateNow: false
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "single_board_timber_exact_imports_do_not_promote_double_board_live_stack",
  "resilient_timber_rows_do_not_promote_direct_line_connection_without_explicit_side_count",
  "gyproc_fireline_secondary_benchmark_does_not_override_live_gypsum_board_rockwool_air_gap_stack",
  "lightweight_steel_holdouts_do_not_promote_wood_stud_truth",
  "clt_floor_floor_impact_product_delta_and_report_rows_remain_non_wall_source_truth",
  "runtime_values_support_confidence_evidence_text_warnings_api_and_route_card_copy_remain_frozen_during_gate_a"
] as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function context(options: Parameters<typeof calculateAssembly>[1], label: string): AirborneContext {
  const value = options?.airborneContext;

  if (!value) {
    throw new Error(`${label} airborne context missing`);
  }

  return value;
}

function hasExactLayerSignature(left: readonly LayerInput[], right: readonly LayerInput[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (layer, index) =>
        layer.materialId === right[index]?.materialId &&
        layer.thicknessMm === right[index]?.thicknessMm
    )
  );
}

function hasExactContextSignature(left: AirborneContext, right: Partial<AirborneContext>): boolean {
  return (
    left.contextMode === right.contextMode &&
    left.connectionType === right.connectionType &&
    left.studType === right.studType &&
    left.studSpacingMm === right.studSpacingMm &&
    left.resilientBarSideCount === right.resilientBarSideCount
  );
}

function officialRows(): WallTimberLightweightOfficialSourceRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightOfficialSourceRow => entry.kind === "official_row"
  );
}

function linkedHoldoutRows(): WallTimberLightweightLinkedHoldoutRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightLinkedHoldoutRow => entry.kind === "linked_holdout"
  );
}

describe("wall timber double-board source research Gate A contract", () => {
  it("lands Gate A as a no-runtime source and tolerance inventory", () => {
    expect(WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A).toEqual({
      landedGate: "gate_a_timber_double_board_source_and_tolerance_inventory",
      previousClosedSlice: "wall_no_stud_double_leaf_source_research_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sliceId: "wall_timber_double_board_source_research_v1",
      status: "no_runtime_source_and_tolerance_inventory_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the current live generated timber double-board route without changing math", () => {
    const testCase = generatedCase("wall-timber-stud");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(CURRENT_LIVE_TIMBER_DOUBLE_BOARD_ROUTE_POSTURE).toEqual({
      currentEvidenceTier: "formula",
      currentRuntimePosture: {
        confidence: "low",
        fieldContextDnTwDb: 43,
        fieldRwPrimeDb: 42,
        labRwDb: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration",
        workbenchBuildingContextDnTwDb: 44
      },
      generatedCaseId: "wall-timber-stud",
      layers: [
        "2x12.5 mm gypsum_board",
        "50 mm rockwool",
        "50 mm air_gap",
        "2x12.5 mm gypsum_board"
      ],
      requiredUnlock: "exact_direct_double_board_timber_row_or_named_bounded_formula_tolerance_owner"
    });

    expect(labSnapshot.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      familyDecisionClass: "ambiguous",
      runnerUpFamily: "double_leaf",
      selectedMethod: "mass_law",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      familyDecisionClass: "ambiguous",
      runnerUpFamily: "double_leaf",
      selectedMethod: "mass_law",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });

    expect(labSnapshot).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      dynamicFamily: "stud_wall_system",
      rw: 50,
      rwDb: 50,
      stc: 50
    });
    expect(fieldSnapshot).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwDb: 42,
      rwPrimeDb: 42,
      stc: 42
    });
  });

  it("classifies current corpus rows as adjacent or blocked for the live double-board route", () => {
    const testCase = generatedCase("wall-timber-stud");
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const exactTopologyMatches = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        hasExactLayerSignature(testCase.rows, row.layers) &&
        (
          hasExactContextSignature(labContext, row.airborneContext) ||
          hasExactContextSignature(fieldContext, row.airborneContext)
        )
    );
    const directSingleBoardRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) => row.topology === "timber_direct_single_board"
    );
    const resilientRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        row.topology === "timber_resilient_bar_one_side_double_board" ||
        row.topology === "timber_resilient_bar_both_sides_double_board"
    );
    const secondaryDirectDoubleBoardRows = officialRows().filter(
      (row) =>
        row.classification === "secondary_benchmark" &&
        row.topology === "timber_direct_double_board"
    );
    const linkedHoldouts = linkedHoldoutRows();

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(exactTopologyMatches).toEqual([]);

    expect(directSingleBoardRows.map((row) => row.expectedRw)).toEqual([35, 42]);
    expect(resilientRows.map((row) => row.expectedRw)).toEqual([56, 59, 55, 58]);
    expect(resilientRows.map((row) => row.airborneContext.resilientBarSideCount)).toEqual([
      "one_side",
      "both_sides",
      "one_side",
      "both_sides"
    ]);
    expect(secondaryDirectDoubleBoardRows).toEqual([
      expect.objectContaining({
        classification: "secondary_benchmark",
        expectedRw: 41,
        id: "gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026",
        topology: "timber_direct_double_board"
      })
    ]);
    expect(hasExactLayerSignature(testCase.rows, secondaryDirectDoubleBoardRows[0]?.layers ?? []))
      .toBe(false);
    expect(linkedHoldouts.map((row) => row.topology)).toEqual([
      "lightweight_steel_single_board_holdout",
      "lightweight_steel_double_board_holdout"
    ]);
  });

  it("records the Gate A decision matrix without selecting runtime movement or Gate B", () => {
    expect(SOURCE_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "current_wall_timber_stud_generated_route",
      "direct_single_board_timber_exact_rows",
      "rb1_rb2_resilient_double_board_timber_exact_rows",
      "gyproc_fireline_direct_double_board_secondary_benchmark",
      "lightweight_steel_linked_holdout_context",
      "published_timber_stud_formula_tolerance_owner"
    ]);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateBNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateCNow === true)).toBe(true);
    expect(SOURCE_CANDIDATES.flatMap((candidate) => candidate.missingBeforeRuntimeMovement))
      .toContain("no_named_bounded_timber_stud_formula_tolerance_owner");

    expect(GATE_A_DECISION).toEqual({
      directImportReadyNow: false,
      formulaToleranceGateReadyNow: false,
      noRuntimeCloseoutReadyNow: true,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      runtimePosture:
        "keep_live_timber_double_board_formula_owned_low_confidence_until_exact_source_row_or_bounded_formula_tolerance_exists",
      selectedDirectImportNow: false,
      selectedFormulaToleranceGateNow: false
    });
  });

  it("keeps negative boundaries and visible behavior frozen during Gate A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "single_board_timber_exact_imports_do_not_promote_double_board_live_stack",
      "resilient_timber_rows_do_not_promote_direct_line_connection_without_explicit_side_count",
      "gyproc_fireline_secondary_benchmark_does_not_override_live_gypsum_board_rockwool_air_gap_stack",
      "lightweight_steel_holdouts_do_not_promote_wood_stud_truth",
      "clt_floor_floor_impact_product_delta_and_report_rows_remain_non_wall_source_truth",
      "runtime_values_support_confidence_evidence_text_warnings_api_and_route_card_copy_remain_frozen_during_gate_a"
    ]);

    expect(WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A.runtimeBehaviorChange).toBe(false);
    expect(WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A.routeCardWorkRequiredNow).toBe(false);
  });
});
