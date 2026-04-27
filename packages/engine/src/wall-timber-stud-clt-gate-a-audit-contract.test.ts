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
import { WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS } from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

const WALL_TIMBER_STUD_CLT_GATE_A_AUDIT = {
  activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
  candidateIds: ["wall.timber_stud_formula.field", "wall.clt_formula.field"],
  generatedCaseIds: ["wall-timber-stud", "wall-clt-local"],
  gate: "Gate A",
  nextAction:
    "start_gate_b_with_timber_stud_formula_lane_source_formula_contract_before_any_runtime_math_change",
  runtimeBehaviorChange: false,
  status: "no_runtime_source_formula_surface_audit_landed"
} as const;

const GATE_B_SELECTION = {
  selectedFirst: "wall.timber_stud_formula.field",
  selectedSecond: "wall.clt_formula.field",
  selectedBecause: [
    "timber_stud_has_candidate_rank_2_before_clt_candidate_rank_3_in_cartography",
    "timber_stud_is_common_personal_use_wall_topology_and_currently_low_confidence",
    "timber_stud_has_nearby_source_corpus_rows_but_no_exact_match_for_the_live_generated_stack",
    "clt_wall_is_formula_owned_medium_confidence_and_must_not_borrow_floor_clt_source_truth"
  ],
  firstGateBContract:
    "pin_timber_stud_formula_lane_against_exact_row_bleed_and_only_change_runtime_with_named_source_or_bounded_family_rule"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "promote_direct_timber_single_board_exact_rows_to_the_generated_double_board_stack",
    "promote_resilient_bar_exact_rows_without_matching_resilient_side_count_and_connection_metadata",
    "borrow_floor_clt_exact_or_source_rows_as_wall_clt_truth",
    "reopen_heavy_core_concrete_gdmtxa04a_c11c_raw_open_box_open_web_or_wall_selector_from_this_green_audit",
    "change_visible_card_or_warning_posture_without_a_focused_web_contract"
  ]
} as const;

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

describe("wall timber stud + CLT Gate A audit contract", () => {
  it("records the no-runtime Gate A audit surface before any timber or CLT retune", () => {
    expect(WALL_TIMBER_STUD_CLT_GATE_A_AUDIT).toEqual({
      activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
      candidateIds: ["wall.timber_stud_formula.field", "wall.clt_formula.field"],
      generatedCaseIds: ["wall-timber-stud", "wall-clt-local"],
      gate: "Gate A",
      nextAction:
        "start_gate_b_with_timber_stud_formula_lane_source_formula_contract_before_any_runtime_math_change",
      runtimeBehaviorChange: false,
      status: "no_runtime_source_formula_surface_audit_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md",
      "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
      "apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts",
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the generated timber-stud lane and proves landed exact rows do not match the live stack", () => {
    const testCase = generatedCase("wall-timber-stud");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const exactTopologyMatches = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        hasExactLayerSignature(testCase.rows, row.layers) &&
        (
          hasExactContextSignature(labContext, row.airborneContext) ||
          hasExactContextSignature(fieldContext, row.airborneContext)
        )
    );

    expect(testCase.studyMode).toBe("wall");
    expect(lab.calculatorId).toBe("dynamic");
    expect(field.calculatorId).toBe("dynamic");
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

    expect(WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS).toHaveLength(6);
    expect(WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter((row) => row.topology === "timber_direct_single_board"))
      .toHaveLength(2);
    expect(WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter((row) => row.topology.includes("resilient_bar")))
      .toHaveLength(4);
    expect(exactTopologyMatches).toEqual([]);
    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(field.warnings.some((warning: string) => /field-side overlay active/i.test(warning))).toBe(true);
    expect(field.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning)))
      .toBe(false);
  });

  it("pins the generated CLT wall lane as formula-owned wall evidence, not floor CLT source truth", () => {
    const testCase = generatedCase("wall-clt-local");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);

    expect(testCase.studyMode).toBe("wall");
    expect(lab.calculatorId).toBe("dynamic");
    expect(field.calculatorId).toBe("dynamic");
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

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
    expect(field.warnings.some((warning: string) => /floor-system landed/i.test(warning))).toBe(true);
    expect(field.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning)))
      .toBe(false);
  });

  it("selects timber-stud Gate B first and keeps source/exact boundaries explicit", () => {
    expect(GATE_B_SELECTION).toEqual({
      selectedFirst: "wall.timber_stud_formula.field",
      selectedSecond: "wall.clt_formula.field",
      selectedBecause: [
        "timber_stud_has_candidate_rank_2_before_clt_candidate_rank_3_in_cartography",
        "timber_stud_is_common_personal_use_wall_topology_and_currently_low_confidence",
        "timber_stud_has_nearby_source_corpus_rows_but_no_exact_match_for_the_live_generated_stack",
        "clt_wall_is_formula_owned_medium_confidence_and_must_not_borrow_floor_clt_source_truth"
      ],
      firstGateBContract:
        "pin_timber_stud_formula_lane_against_exact_row_bleed_and_only_change_runtime_with_named_source_or_bounded_family_rule"
    });

    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "promote_direct_timber_single_board_exact_rows_to_the_generated_double_board_stack",
      "promote_resilient_bar_exact_rows_without_matching_resilient_side_count_and_connection_metadata",
      "borrow_floor_clt_exact_or_source_rows_as_wall_clt_truth",
      "reopen_heavy_core_concrete_gdmtxa04a_c11c_raw_open_box_open_web_or_wall_selector_from_this_green_audit",
      "change_visible_card_or_warning_posture_without_a_focused_web_contract"
    ]);
  });
});
