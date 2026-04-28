import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  applySplitPlans,
  ENGINE_MIXED_GENERATED_CASES,
  type EngineMixedGeneratedCase
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const ALL_WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

type FramedCaseId = "wall-lsf-knauf" | "wall-timber-stud";

type FramedSplitValues = {
  c: number | null;
  ctr: number | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  rw: number | null;
  rwPrime: number | null;
  stc: number | null;
};

type FramedSplitSnapshot = {
  confidenceClass: string | null;
  detectedFamily: string | null;
  exactLabMatchActive: boolean;
  originalSolidLayerCount: number | null;
  strategy: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: FramedSplitValues;
  warnings: readonly string[];
};

const WALL_FRAMED_FACING_SPLIT_GATE_A = {
  activeSlice: "wall_framed_facing_split_warning_stability_v1",
  landedGate: "gate_a_framed_board_split_value_warning_inventory_no_runtime",
  numericRuntimeBehaviorChange: false,
  routeCardMovement: false,
  selectedNextAction: "gate_b_lsf_field_board_split_value_warning_stability_fix",
  selectedNextContract:
    "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
  selectedReason:
    "gate_a_found_lsf_field_board_split_plus_1db_value_drift_and_extra_monotonic_floor_warning_while_timber_and_lsf_lab_stayed_stable",
  warningOnlyAssumptionStillValid: false
} as const;

const WEB_ROUTE_CARD_REQUIREMENTS = [
  {
    currentlyExists: true,
    id: "existing_wall_reorder_card_guard",
    requiredBeforeVisibleMovement: true,
    targetFile: "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts"
  },
  {
    currentlyExists: true,
    id: "future_framed_split_warning_route_card_matrix",
    requiredBeforeVisibleMovement: true,
    targetFile:
      "apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts"
  }
] as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "fix_gate_b_by_global_same_material_entry_coalescing",
    "merge_distinct_double_board_layers_into_single_25mm_board_topology",
    "treat_lsf_field_split_values_as_source_equivalent_to_unrelated_single_board_field_corrections",
    "change_visible_route_card_warning_copy_without_paired_web_route_card_tests",
    "reopen_source_blocked_wall_or_floor_families_from_this_local_split_inventory"
  ]
} as const;

const COMMON_FRAMED_WARNINGS = [
  "Airborne estimate is using the Dynamic Topology path instead of the screening seed.",
  "The selected airborne lane is local to this repo; higher-order family solvers and broader comparison envelopes are still being expanded.",
  "Cavity assemblies are running on a selected local airborne lane; topology-specific dynamic branches are still maturing.",
  "Lightweight assemblies still need broader local family coverage before the selected airborne lane can be treated as the highest-confidence path.",
  "Explicit framed-wall metadata is active on the dynamic airborne lane, but only because the visible morphology still looks like a board-dominant framed cavity.",
  "Dynamic airborne confidence is low on this topology; small layer or support changes may move the best-fit family and result.",
  "The dynamic family blend moved materially away from its anchor delegate, so treat the result as a family-level estimate rather than a single-formula output.",
  "The current family read sits near the boundary between Stud Wall Surrogate and Double Leaf. Small thickness or support changes can switch the lane even when the assembly still looks broadly similar."
] as const;

const LSF_EXACT_LAB_WARNING =
  "Curated exact airborne lab match active: Knauf accredited lab report 416889. DynEcho anchored the dynamic curve to official Rw 55.0 dB.";
const LSF_FIELD_FLANKING_WARNING =
  "Airborne field-side overlay active. The current building prediction context is carrying a conservative flanking penalty of 7.4 dB.";
const TIMBER_FIELD_FLANKING_WARNING =
  "Airborne field-side overlay active. The current building prediction context is carrying a conservative flanking penalty of 6.6 dB.";
const UNSUPPORTED_LAB_WARNING =
  "Unsupported target outputs: R'w, Dn,w, Dn,A, DnT,w, DnT,A. These outputs were requested but not calculated.";
const UNSUPPORTED_FIELD_WARNING = "Unsupported target outputs: Rw. These outputs were requested but not calculated.";
const NO_EXACT_FLOOR_WARNING =
  "No curated exact floor-system landed. Nearby scored rows existed, but DynEcho withheld the closest candidate label because it drifted outside the defended same-family route.";

const LSF_LAB_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  LSF_EXACT_LAB_WARNING,
  UNSUPPORTED_LAB_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

const LSF_FIELD_BASE_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  LSF_FIELD_FLANKING_WARNING,
  UNSUPPORTED_FIELD_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

const TIMBER_LAB_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  UNSUPPORTED_LAB_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

const TIMBER_FIELD_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  TIMBER_FIELD_FLANKING_WARNING,
  UNSUPPORTED_FIELD_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

function resolveCase(id: FramedCaseId): EngineMixedGeneratedCase {
  const candidate = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!candidate) {
    throw new Error(`Expected generated wall case "${id}" to exist.`);
  }

  return candidate;
}

function splitBoard(testCase: EngineMixedGeneratedCase, rowIndex: number): LayerInput[] {
  const row = testCase.rows[rowIndex];

  if (!row) {
    throw new Error(`Cannot split missing row ${rowIndex} in ${testCase.id}.`);
  }

  return applySplitPlans(testCase.rows, [
    {
      parts: [row.thicknessMm / 2, row.thicknessMm / 2],
      rowIndex
    }
  ]);
}

function boardRowIndexes(testCase: EngineMixedGeneratedCase): number[] {
  return testCase.rows.flatMap((row, index) =>
    row.materialId.includes("gypsum") ? [index] : []
  );
}

function snapshot(
  testCase: EngineMixedGeneratedCase,
  context: "field" | "lab",
  rows: readonly LayerInput[]
): FramedSplitSnapshot {
  const options = context === "lab" ? testCase.labOptions : testCase.fieldOptions;
  const result = calculateAssembly(rows, {
    ...options,
    targetOutputs: ALL_WALL_OUTPUTS
  });

  return {
    confidenceClass: result.dynamicAirborneTrace?.confidenceClass ?? null,
    detectedFamily: result.dynamicAirborneTrace?.detectedFamily ?? null,
    exactLabMatchActive: result.warnings.some((warning: string) =>
      warning.startsWith("Curated exact airborne lab match active:")
    ),
    originalSolidLayerCount: result.dynamicAirborneTrace?.originalSolidLayerCount ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    values: {
      c: result.metrics.estimatedCDb ?? null,
      ctr: result.metrics.estimatedCtrDb ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTA: result.metrics.estimatedDnTADb ?? null,
      dnTw: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      rw: result.metrics.estimatedRwDb ?? null,
      rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
      stc: result.metrics.estimatedStc ?? null
    },
    warnings: result.warnings
  };
}

function expectCommonFramedPosture(actual: FramedSplitSnapshot): void {
  expect(actual.confidenceClass).toBe("low");
  expect(actual.detectedFamily).toBe("stud_wall_system");
}

describe("wall framed facing split warning stability Gate A contract", () => {
  it("lands Gate A as a no-runtime inventory and selects a bounded Gate B fix", () => {
    expect(WALL_FRAMED_FACING_SPLIT_GATE_A).toEqual({
      activeSlice: "wall_framed_facing_split_warning_stability_v1",
      landedGate: "gate_a_framed_board_split_value_warning_inventory_no_runtime",
      numericRuntimeBehaviorChange: false,
      routeCardMovement: false,
      selectedNextAction: "gate_b_lsf_field_board_split_value_warning_stability_fix",
      selectedNextContract:
        "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
      selectedReason:
        "gate_a_found_lsf_field_board_split_plus_1db_value_drift_and_extra_monotonic_floor_warning_while_timber_and_lsf_lab_stayed_stable",
      warningOnlyAssumptionStillValid: false
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/MASTER_PLAN.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the LSF exact lab and field lanes split-stable after the Gate B runtime fix", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const splitRows = splitBoard(lsf, 0);

    const labBaseline = snapshot(lsf, "lab", lsf.rows);
    const labSplit = snapshot(lsf, "lab", splitRows);
    const fieldBaseline = snapshot(lsf, "field", lsf.rows);
    const fieldSplit = snapshot(lsf, "field", splitRows);

    expectCommonFramedPosture(labBaseline);
    expectCommonFramedPosture(labSplit);
    expectCommonFramedPosture(fieldBaseline);
    expectCommonFramedPosture(fieldSplit);

    expect(labBaseline).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: true,
      originalSolidLayerCount: 4,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      values: {
        c: -1.5,
        ctr: -6.4,
        dnA: null,
        dnTA: null,
        dnTw: null,
        dnW: null,
        rw: 55,
        rwPrime: null,
        stc: 55
      },
      warnings: LSF_LAB_WARNINGS
    });
    expect(labSplit).toEqual({
      ...labBaseline,
      originalSolidLayerCount: 5
    });

    expect(fieldBaseline).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: false,
      originalSolidLayerCount: 4,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"],
      values: {
        c: -1.4,
        ctr: -6.4,
        dnA: 49.6,
        dnTA: 51.1,
        dnTw: 52,
        dnW: 51,
        rw: 51,
        rwPrime: 51,
        stc: 51
      },
      warnings: LSF_FIELD_BASE_WARNINGS
    });
    expect(fieldSplit).toEqual({
      ...fieldBaseline,
      originalSolidLayerCount: 5
    });
  });

  it("pins all representative board split positions so split stability cannot hide behind one row", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const timber = resolveCase("wall-timber-stud");

    expect(boardRowIndexes(lsf)).toEqual([0, 1, 4, 5]);
    expect(boardRowIndexes(timber)).toEqual([0, 1, 4, 5]);

    const expectedLsfFieldSplitValues: FramedSplitValues = {
      c: -1.4,
      ctr: -6.4,
      dnA: 49.6,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rw: 51,
      rwPrime: 51,
      stc: 51
    };

    for (const rowIndex of boardRowIndexes(lsf)) {
      const field = snapshot(lsf, "field", splitBoard(lsf, rowIndex));
      expect(field.values, `lsf field board row ${rowIndex}`).toEqual(expectedLsfFieldSplitValues);
      expect(field.warnings, `lsf field board row ${rowIndex}`).toEqual(LSF_FIELD_BASE_WARNINGS);
    }

    const timberLabBaseline = snapshot(timber, "lab", timber.rows);
    const timberFieldBaseline = snapshot(timber, "field", timber.rows);

    expect(timberLabBaseline).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: false,
      originalSolidLayerCount: 4,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      values: {
        c: 0.5,
        ctr: -4.2,
        dnA: null,
        dnTA: null,
        dnTw: null,
        dnW: null,
        rw: 50,
        rwPrime: null,
        stc: 50
      },
      warnings: TIMBER_LAB_WARNINGS
    });
    expect(timberFieldBaseline).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: false,
      originalSolidLayerCount: 4,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"],
      values: {
        c: 0.4,
        ctr: -4.3,
        dnA: 42.4,
        dnTA: 43.9,
        dnTw: 43,
        dnW: 42,
        rw: 42,
        rwPrime: 42,
        stc: 42
      },
      warnings: TIMBER_FIELD_WARNINGS
    });

    for (const rowIndex of boardRowIndexes(timber)) {
      expect(snapshot(timber, "lab", splitBoard(timber, rowIndex)), `timber lab board row ${rowIndex}`).toEqual({
        ...timberLabBaseline,
        originalSolidLayerCount: 5
      });
      expect(
        snapshot(timber, "field", splitBoard(timber, rowIndex)),
        `timber field board row ${rowIndex}`
      ).toEqual({
        ...timberFieldBaseline,
        originalSolidLayerCount: 5
      });
    }
  });

  it("keeps the negative boundary against global board coalescing executable", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const coalescedDoubleBoardTopology: readonly LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 25 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 25 }
    ];

    const labBaseline = snapshot(lsf, "lab", lsf.rows);
    const fieldBaseline = snapshot(lsf, "field", lsf.rows);
    const labCoalesced = snapshot(lsf, "lab", coalescedDoubleBoardTopology);
    const fieldCoalesced = snapshot(lsf, "field", coalescedDoubleBoardTopology);

    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "fix_gate_b_by_global_same_material_entry_coalescing",
      "merge_distinct_double_board_layers_into_single_25mm_board_topology",
      "treat_lsf_field_split_values_as_source_equivalent_to_unrelated_single_board_field_corrections",
      "change_visible_route_card_warning_copy_without_paired_web_route_card_tests",
      "reopen_source_blocked_wall_or_floor_families_from_this_local_split_inventory"
    ]);

    expect(labCoalesced.values).toEqual({
      ...labBaseline.values,
      c: -0.6,
      ctr: -5.5
    });
    expect(labCoalesced.values).not.toEqual(labBaseline.values);
    expect(fieldCoalesced.values).toEqual({
      c: -1.5,
      ctr: -6.5,
      dnA: 36.5,
      dnTA: 38,
      dnTw: 39,
      dnW: 38,
      rw: 38,
      rwPrime: 38,
      stc: 38
    });
    expect(fieldCoalesced.values).not.toEqual(fieldBaseline.values);
    expect(fieldCoalesced.strategy).toBe(
      "stud_surrogate_blend+framed_wall_calibration+premium_single_board_field_correction"
    );
  });

  it("requires paired web-card coverage before any visible warning or card movement", () => {
    expect(WALL_FRAMED_FACING_SPLIT_GATE_A.routeCardMovement).toBe(false);

    for (const requirement of WEB_ROUTE_CARD_REQUIREMENTS) {
      expect(requirement.requiredBeforeVisibleMovement, requirement.id).toBe(true);

      expect(existsSync(join(REPO_ROOT, requirement.targetFile)), requirement.id).toBe(
        requirement.currentlyExists
      );
    }
  });
});
