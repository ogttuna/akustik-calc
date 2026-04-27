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

const TIMBER_STUD_GATE_B_SOURCE_CONTRACT = {
  activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
  candidateId: "wall.timber_stud_formula.field",
  gate: "Gate B",
  generatedCaseId: "wall-timber-stud",
  nextAction:
    "start_clt_wall_gate_b_source_formula_contract_before_any_runtime_math_change",
  runtimeBehaviorChange: false,
  selectedNextCandidate: "wall.clt_formula.field",
  status: "no_runtime_source_formula_contract_landed"
} as const;

const TIMBER_SOURCE_FORMULA_DECISION = {
  blockedBecause: [
    "generated_double_board_stack_has_no_verified_airborne_exact_match",
    "generated_double_board_stack_has_no_verified_lab_fallback_match",
    "direct_timber_exact_imports_are_single_board_only",
    "resilient_timber_exact_imports_require_explicit_resilient_bar_side_count_and_acoustic_board_topology",
    "direct_double_board_official_row_is_secondary_benchmark_not_exact_for_live_material_fill_or_cavity_topology",
    "linked_lightweight_holdouts_are_steel_framed_companions_not_wood_stud_exact_truth"
  ],
  currentEvidenceTier: "formula",
  currentRuntimePosture: {
    confidence: "low",
    fieldRwPrimeDb: 42,
    labRwDb: 50,
    strategy: "stud_surrogate_blend+framed_wall_calibration"
  },
  runtimeChangeAllowedNow: false,
  unlockRequirement:
    "exact_matching_source_row_or_documented_bounded_family_rule_with_explicit_tolerance"
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

describe("wall timber-stud Gate B source/formula contract", () => {
  it("records that timber Gate B lands as a no-runtime source/formula contract", () => {
    expect(TIMBER_STUD_GATE_B_SOURCE_CONTRACT).toEqual({
      activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
      candidateId: "wall.timber_stud_formula.field",
      gate: "Gate B",
      generatedCaseId: "wall-timber-stud",
      nextAction:
        "start_clt_wall_gate_b_source_formula_contract_before_any_runtime_math_change",
      runtimeBehaviorChange: false,
      selectedNextCandidate: "wall.clt_formula.field",
      status: "no_runtime_source_formula_contract_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_GATE_B_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md",
      "packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
      "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the generated timber-stud runtime surface without changing math", () => {
    const testCase = generatedCase("wall-timber-stud");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

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

    expect(field.metrics.estimatedRwPrimeDb).toBeLessThanOrEqual(lab.metrics.estimatedRwDb);
    expect(field.warnings.some((warning: string) => /Dynamic airborne confidence is low/i.test(warning)))
      .toBe(true);
    expect(field.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning)))
      .toBe(false);
  });

  it("blocks exact or benchmark promotion because the source corpus does not match the live stack", () => {
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
    const secondaryDirectDoubleBoardRows = officialRows().filter(
      (row) =>
        row.classification === "secondary_benchmark" &&
        row.topology === "timber_direct_double_board"
    );
    const directSingleBoardExactRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) => row.topology === "timber_direct_single_board"
    );
    const resilientExactRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        row.topology === "timber_resilient_bar_one_side_double_board" ||
        row.topology === "timber_resilient_bar_both_sides_double_board"
    );
    const linkedHoldouts = linkedHoldoutRows();

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(exactTopologyMatches).toEqual([]);

    expect(directSingleBoardExactRows.map((row) => row.expectedRw)).toEqual([35, 42]);
    expect(resilientExactRows.map((row) => row.airborneContext.resilientBarSideCount)).toEqual([
      "one_side",
      "both_sides",
      "one_side",
      "both_sides"
    ]);
    expect(secondaryDirectDoubleBoardRows).toHaveLength(1);
    expect(secondaryDirectDoubleBoardRows[0]).toMatchObject({
      expectedRw: 41,
      id: "gyproc_ie_a026025_timber_2x15_fireline_uninsulated_lab_2026",
      topology: "timber_direct_double_board"
    });
    expect(hasExactLayerSignature(testCase.rows, secondaryDirectDoubleBoardRows[0]?.layers ?? []))
      .toBe(false);
    expect(linkedHoldouts.map((row) => row.topology)).toEqual([
      "lightweight_steel_single_board_holdout",
      "lightweight_steel_double_board_holdout"
    ]);

    expect(TIMBER_SOURCE_FORMULA_DECISION).toEqual({
      blockedBecause: [
        "generated_double_board_stack_has_no_verified_airborne_exact_match",
        "generated_double_board_stack_has_no_verified_lab_fallback_match",
        "direct_timber_exact_imports_are_single_board_only",
        "resilient_timber_exact_imports_require_explicit_resilient_bar_side_count_and_acoustic_board_topology",
        "direct_double_board_official_row_is_secondary_benchmark_not_exact_for_live_material_fill_or_cavity_topology",
        "linked_lightweight_holdouts_are_steel_framed_companions_not_wood_stud_exact_truth"
      ],
      currentEvidenceTier: "formula",
      currentRuntimePosture: {
        confidence: "low",
        fieldRwPrimeDb: 42,
        labRwDb: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      runtimeChangeAllowedNow: false,
      unlockRequirement:
        "exact_matching_source_row_or_documented_bounded_family_rule_with_explicit_tolerance"
    });
  });

  it("keeps the slice moving to CLT without reopening blocked timber or heavy-wall surfaces", () => {
    const disallowedMoves = [
      "retune_live_timber_from_direct_single_board_or_resilient_exact_rows_by_adjacency",
      "tighten_confidence_class_from_broad_corridor_evidence_only",
      "borrow_lightweight_steel_holdouts_as_wood_stud_exact_truth",
      "change_visible_web_card_posture_without_web_contract",
      "reopen_heavy_core_concrete_or_blocked_floor_source_families_from_this_green_test"
    ];

    expect(disallowedMoves).toEqual([
      "retune_live_timber_from_direct_single_board_or_resilient_exact_rows_by_adjacency",
      "tighten_confidence_class_from_broad_corridor_evidence_only",
      "borrow_lightweight_steel_holdouts_as_wood_stud_exact_truth",
      "change_visible_web_card_posture_without_web_contract",
      "reopen_heavy_core_concrete_or_blocked_floor_source_families_from_this_green_test"
    ]);
    expect(TIMBER_STUD_GATE_B_SOURCE_CONTRACT.selectedNextCandidate).toBe("wall.clt_formula.field");
    expect(TIMBER_STUD_GATE_B_SOURCE_CONTRACT.runtimeBehaviorChange).toBe(false);
  });
});
