import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

type EvidenceFit =
  | "live_formula_route"
  | "floor_only_exact_source_rows"
  | "missing_wall_specific_source_rows"
  | "missing_laminated_leaf_tolerance_owner"
  | "non_source_report_or_product_context";

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
    | "floor_system_not_wall"
    | "wall_source_missing"
    | "formula_without_bounded_tolerance"
    | "non_source_context";
};

const WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A = {
  landedGate: "gate_a_wall_specific_clt_source_and_laminated_leaf_tolerance_inventory",
  previousClosedSlice: "wall_timber_double_board_source_research_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  sliceId: "wall_clt_wall_source_research_v1",
  status: "no_runtime_source_and_tolerance_inventory_landed"
} as const;

const CURRENT_LIVE_CLT_WALL_ROUTE_POSTURE = {
  currentEvidenceTier: "formula",
  currentRuntimePosture: {
    confidence: "medium",
    fieldDnTwDb: 42,
    fieldRwPrimeDb: 41,
    labRwDb: 42,
    strategy: "laminated_leaf_sharp_delegate"
  },
  generatedCaseId: "wall-clt-local",
  requiredUnlock: "wall_specific_clt_source_row_or_named_laminated_leaf_formula_tolerance_owner"
} as const;

const DATAHOLZ_CLT_FLOOR_SOURCE_ROW_IDS = [
  "dataholz_gdmnxn02_wet_clt_lab_2026",
  "dataholz_gdmnxn02_05_wet_clt_lab_2026",
  "dataholz_gdmnxn05_wet_clt_lab_2026",
  "dataholz_gdmtxn01_dry_clt_lab_2026",
  "dataholz_gdmnxn06_fill_clt_lab_2026",
  "dataholz_gdmnxa02a_00_clt_lab_2026",
  "dataholz_gdmnxa02a_02_clt_lab_2026",
  "dataholz_gdmtxa01a_clt_lab_2026",
  "dataholz_gdmtxa04a_clt_lab_2026"
] as const;

const SOURCE_CANDIDATES: readonly SourceCandidate[] = [
  {
    evidenceFit: "live_formula_route",
    id: "current_wall_clt_local_generated_route",
    missingBeforeRuntimeMovement: [
      "no_verified_airborne_exact_match",
      "no_verified_lab_fallback_match",
      "no_wall_specific_clt_source_row",
      "current_laminated_leaf_sharp_delegate_has_no_named_single_number_tolerance_owner"
    ],
    rowIds: ["wall-clt-local"],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "current_live_stack"
  },
  {
    evidenceFit: "floor_only_exact_source_rows",
    id: "dataholz_clt_floor_exact_rows",
    missingBeforeRuntimeMovement: [
      "dataholz_rows_are_floor_system_source_truth_not_wall_truth",
      "floor_impact_metrics_do_not_supply_wall_rw_tolerance",
      "mounting_orientation_and_boundary_conditions_do_not_match_a_wall_source_row",
      "paired_engine_and_web_wall_import_tests_not_named"
    ],
    rowIds: DATAHOLZ_CLT_FLOOR_SOURCE_ROW_IDS,
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "floor_system_not_wall"
  },
  {
    evidenceFit: "missing_wall_specific_source_rows",
    id: "wall_specific_clt_or_mass_timber_source_rows",
    missingBeforeRuntimeMovement: [
      "no_wall_specific_clt_row_in_current_catalog",
      "no_wall_lining_decoupling_or_mounting_metadata_for_live_stack",
      "no_reported_wall_metric_context_or_tolerance_owner"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "wall_source_missing"
  },
  {
    evidenceFit: "missing_laminated_leaf_tolerance_owner",
    id: "published_laminated_leaf_or_mass_timber_wall_formula_tolerance_owner",
    missingBeforeRuntimeMovement: [
      "no_named_published_formula_in_repo_with_local_single_number_rw_tolerance_for_this_route",
      "no_route_specific_fit_corridor_for_laminated_leaf_sharp_delegate",
      "no_negative_boundaries_for_floor_clt_lined_wall_or_product_delta_contexts"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "formula_without_bounded_tolerance"
  },
  {
    evidenceFit: "non_source_report_or_product_context",
    id: "report_export_product_delta_clt_context",
    missingBeforeRuntimeMovement: [
      "proposal_report_or_product_delta_context_is_not_source_truth",
      "cannot_move_runtime_without_source_row_or_bounded_formula_tolerance",
      "visible_copy_changes_require_paired_web_route_card_tests"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "non_source_context"
  }
] as const;

const GATE_A_DECISION = {
  directImportReadyNow: false,
  formulaToleranceGateReadyNow: false,
  noRuntimeCloseoutReadyNow: true,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  runtimePosture:
    "keep_live_clt_wall_formula_owned_medium_confidence_until_wall_specific_source_row_or_bounded_laminated_leaf_tolerance_exists",
  selectedDirectImportNow: false,
  selectedFormulaToleranceGateNow: false
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "dataholz_clt_floor_exact_rows_do_not_promote_wall_clt_truth",
  "floor_impact_or_product_delta_rows_do_not_supply_wall_rw_tolerance",
  "laminated_leaf_sharp_delegate_does_not_become_exact_or_benchmark_backed_without_wall_source_evidence",
  "timber_double_board_no_stud_heavy_core_and_blocked_floor_sources_do_not_reopen_from_this_gate",
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

describe("wall CLT source research Gate A contract", () => {
  it("lands Gate A as a no-runtime wall-specific CLT source and tolerance inventory", () => {
    expect(WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A).toEqual({
      landedGate: "gate_a_wall_specific_clt_source_and_laminated_leaf_tolerance_inventory",
      previousClosedSlice: "wall_timber_double_board_source_research_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sliceId: "wall_clt_wall_source_research_v1",
      status: "no_runtime_source_and_tolerance_inventory_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the current generated CLT wall route without changing math", () => {
    const testCase = generatedCase("wall-clt-local");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(CURRENT_LIVE_CLT_WALL_ROUTE_POSTURE).toEqual({
      currentEvidenceTier: "formula",
      currentRuntimePosture: {
        confidence: "medium",
        fieldDnTwDb: 42,
        fieldRwPrimeDb: 41,
        labRwDb: 42,
        strategy: "laminated_leaf_sharp_delegate"
      },
      generatedCaseId: "wall-clt-local",
      requiredUnlock: "wall_specific_clt_source_row_or_named_laminated_leaf_formula_tolerance_owner"
    });

    expect(testCase.studyMode).toBe("wall");
    expect(labSnapshot.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate"
    });

    expect(labSnapshot).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      dynamicFamily: "laminated_single_leaf",
      rw: 42,
      rwDb: 42,
      stc: 43
    });
    expect(fieldSnapshot).toMatchObject({
      c: -1.8,
      ctr: -7.6,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      dynamicFamily: "laminated_single_leaf",
      rw: 41,
      rwDb: 41,
      rwPrimeDb: 41,
      stc: 41
    });
  });

  it("classifies Dataholz CLT rows as floor-only source truth and blocks wall promotion", () => {
    const testCase = generatedCase("wall-clt-local");
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const dataholzCltRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) => system.id.startsWith("dataholz_") && system.id.includes("_clt_")
    );
    const dryCltRow = EXACT_FLOOR_SYSTEMS.find(
      (system) => system.id === "dataholz_gdmtxn01_dry_clt_lab_2026"
    );

    expect(dataholzCltRows.map((row) => row.id)).toEqual([...DATAHOLZ_CLT_FLOOR_SOURCE_ROW_IDS]);
    expect(dataholzCltRows.every((row) => row.label.includes("CLT floor"))).toBe(true);
    expect(dataholzCltRows.every((row) => row.sourceType === "official_open_component_library")).toBe(true);
    expect(dryCltRow).toMatchObject({
      id: "dataholz_gdmtxn01_dry_clt_lab_2026",
      label: "Dataholz GDMTXN01 | CLT floor | dry screed | no lining",
      systemSummary: {
        carrier: "140 mm cross-laminated timber",
        floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer [s'=40 MN/m3] + 60 mm elastic bonded fill",
        ceiling: "No lining below"
      }
    });
    expect(dryCltRow?.airborneRatings.Rw).toBe(62);
    expect(dryCltRow?.impactRatings?.LnW).toBe(50);

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
    expect(field.warnings.some((warning: string) => /floor-system landed/i.test(warning))).toBe(true);
  });

  it("records the Gate A decision matrix without selecting runtime movement or Gate B", () => {
    expect(SOURCE_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "current_wall_clt_local_generated_route",
      "dataholz_clt_floor_exact_rows",
      "wall_specific_clt_or_mass_timber_source_rows",
      "published_laminated_leaf_or_mass_timber_wall_formula_tolerance_owner",
      "report_export_product_delta_clt_context"
    ]);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateBNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateCNow === true)).toBe(true);
    expect(SOURCE_CANDIDATES.flatMap((candidate) => candidate.missingBeforeRuntimeMovement))
      .toContain("no_wall_specific_clt_source_row");

    expect(GATE_A_DECISION).toEqual({
      directImportReadyNow: false,
      formulaToleranceGateReadyNow: false,
      noRuntimeCloseoutReadyNow: true,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      runtimePosture:
        "keep_live_clt_wall_formula_owned_medium_confidence_until_wall_specific_source_row_or_bounded_laminated_leaf_tolerance_exists",
      selectedDirectImportNow: false,
      selectedFormulaToleranceGateNow: false
    });
  });

  it("keeps negative boundaries and visible behavior frozen during Gate A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "dataholz_clt_floor_exact_rows_do_not_promote_wall_clt_truth",
      "floor_impact_or_product_delta_rows_do_not_supply_wall_rw_tolerance",
      "laminated_leaf_sharp_delegate_does_not_become_exact_or_benchmark_backed_without_wall_source_evidence",
      "timber_double_board_no_stud_heavy_core_and_blocked_floor_sources_do_not_reopen_from_this_gate",
      "runtime_values_support_confidence_evidence_text_warnings_api_and_route_card_copy_remain_frozen_during_gate_a"
    ]);

    expect(WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A.runtimeBehaviorChange).toBe(false);
    expect(WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A.routeCardWorkRequiredNow).toBe(false);
  });
});
