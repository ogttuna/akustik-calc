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

const CLT_WALL_GATE_B_SOURCE_CONTRACT = {
  activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
  candidateId: "wall.clt_formula.field",
  gate: "Gate B",
  generatedCaseId: "wall-clt-local",
  nextAction:
    "close_wall_timber_stud_clt_accuracy_pass_gate_c_then_select_floor_fallback_low_confidence_cleanup",
  runtimeBehaviorChange: false,
  selectedNextSlice: "floor_fallback_low_confidence_cleanup",
  status: "no_runtime_source_formula_contract_landed"
} as const;

const CLT_SOURCE_FORMULA_DECISION = {
  blockedBecause: [
    "generated_clt_wall_stack_has_no_verified_airborne_exact_match",
    "generated_clt_wall_stack_has_no_verified_lab_fallback_match",
    "current_catalog_has_no_wall_specific_clt_exact_row",
    "dataholz_clt_rows_are_floor_system_source_truth_not_wall_exact_truth",
    "current_laminated_single_leaf_lane_is_a_sharp_delegate_formula_not_a_source_row"
  ],
  currentEvidenceTier: "formula",
  currentRuntimePosture: {
    confidence: "medium",
    fieldRwPrimeDb: 41,
    labRwDb: 42,
    strategy: "laminated_leaf_sharp_delegate"
  },
  runtimeChangeAllowedNow: false,
  unlockRequirement:
    "wall_specific_clt_source_row_or_documented_laminated_leaf_solver_with_explicit_tolerance"
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

describe("wall CLT Gate B source/formula contract", () => {
  it("records that CLT Gate B lands as a no-runtime source/formula contract", () => {
    expect(CLT_WALL_GATE_B_SOURCE_CONTRACT).toEqual({
      activeSlice: "wall_timber_stud_clt_accuracy_pass_v1",
      candidateId: "wall.clt_formula.field",
      gate: "Gate B",
      generatedCaseId: "wall-clt-local",
      nextAction:
        "close_wall_timber_stud_clt_accuracy_pass_gate_c_then_select_floor_fallback_low_confidence_cleanup",
      runtimeBehaviorChange: false,
      selectedNextSlice: "floor_fallback_low_confidence_cleanup",
      status: "no_runtime_source_formula_contract_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_GATE_B_HANDOFF.md",
      "packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts",
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the generated CLT wall runtime surface without changing math", () => {
    const testCase = generatedCase("wall-clt-local");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

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

    expect(field.metrics.estimatedRwPrimeDb).toBeLessThanOrEqual(lab.metrics.estimatedRwDb);
    expect(field.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning)))
      .toBe(false);
  });

  it("blocks exact or floor-source promotion because current CLT evidence is floor-only or formula-owned", () => {
    const testCase = generatedCase("wall-clt-local");
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const dataholzDryCltFloorRow = EXACT_FLOOR_SYSTEMS.find(
      (system) => system.id === "dataholz_gdmtxn01_dry_clt_lab_2026"
    );

    expect(dataholzDryCltFloorRow).toMatchObject({
      id: "dataholz_gdmtxn01_dry_clt_lab_2026",
      label: "Dataholz GDMTXN01 | CLT floor | dry screed | no lining",
      sourceType: "official_open_component_library",
      systemSummary: {
        carrier: "140 mm cross-laminated timber",
        floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer [s'=40 MN/m3] + 60 mm elastic bonded fill",
        ceiling: "No lining below"
      }
    });
    expect(dataholzDryCltFloorRow?.airborneRatings.Rw).toBe(62);
    expect(dataholzDryCltFloorRow?.impactRatings?.LnW).toBe(50);

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
    expect(field.warnings.some((warning: string) => /floor-system landed/i.test(warning))).toBe(true);

    expect(CLT_SOURCE_FORMULA_DECISION).toEqual({
      blockedBecause: [
        "generated_clt_wall_stack_has_no_verified_airborne_exact_match",
        "generated_clt_wall_stack_has_no_verified_lab_fallback_match",
        "current_catalog_has_no_wall_specific_clt_exact_row",
        "dataholz_clt_rows_are_floor_system_source_truth_not_wall_exact_truth",
        "current_laminated_single_leaf_lane_is_a_sharp_delegate_formula_not_a_source_row"
      ],
      currentEvidenceTier: "formula",
      currentRuntimePosture: {
        confidence: "medium",
        fieldRwPrimeDb: 41,
        labRwDb: 42,
        strategy: "laminated_leaf_sharp_delegate"
      },
      runtimeChangeAllowedNow: false,
      unlockRequirement:
        "wall_specific_clt_source_row_or_documented_laminated_leaf_solver_with_explicit_tolerance"
    });
  });

  it("moves the slice to Gate C without reopening blocked timber, CLT floor, or heavy-wall surfaces", () => {
    const disallowedMoves = [
      "borrow_dataholz_floor_clt_rows_as_wall_exact_truth",
      "retune_wall_clt_from_workbench_preset_delta_without_a_shared_contract",
      "promote_laminated_single_leaf_delegate_to_exact_confidence_without_a_source_row",
      "reopen_timber_stud_widening_or_wall_exact_row_followups_from_this_green_test",
      "reopen_heavy_core_concrete_or_blocked_floor_source_families_from_this_green_test"
    ];

    expect(disallowedMoves).toEqual([
      "borrow_dataholz_floor_clt_rows_as_wall_exact_truth",
      "retune_wall_clt_from_workbench_preset_delta_without_a_shared_contract",
      "promote_laminated_single_leaf_delegate_to_exact_confidence_without_a_source_row",
      "reopen_timber_stud_widening_or_wall_exact_row_followups_from_this_green_test",
      "reopen_heavy_core_concrete_or_blocked_floor_source_families_from_this_green_test"
    ]);
    expect(CLT_WALL_GATE_B_SOURCE_CONTRACT.selectedNextSlice).toBe("floor_fallback_low_confidence_cleanup");
    expect(CLT_WALL_GATE_B_SOURCE_CONTRACT.runtimeBehaviorChange).toBe(false);
  });
});
