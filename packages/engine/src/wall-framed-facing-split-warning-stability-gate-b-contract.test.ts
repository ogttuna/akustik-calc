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

const WALL_FRAMED_FACING_SPLIT_GATE_B = {
  activeSlice: "wall_framed_facing_split_warning_stability_v1",
  landedGate: "gate_b_lsf_field_board_split_value_warning_stability_fix",
  numericRuntimeBehaviorChange: true,
  routeCardMovement: true,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection",
  selectedNextContract:
    "packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts",
  selectedReason:
    "gate_b_removed_lsf_field_board_split_plus_1db_drift_and_extra_monotonic_floor_warning_without_global_board_coalescing",
  visibleMovementHasPairedWebCoverage: true
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
const MONOTONIC_FLOOR_WARNING =
  "A framed reinforcement monotonic floor was applied because one-face board reinforcement unexpectedly scored below its lighter sibling variant.";
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

const LSF_FIELD_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  LSF_FIELD_FLANKING_WARNING,
  UNSUPPORTED_FIELD_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

const TIMBER_FIELD_WARNINGS = [
  ...COMMON_FRAMED_WARNINGS,
  TIMBER_FIELD_FLANKING_WARNING,
  UNSUPPORTED_FIELD_WARNING,
  NO_EXACT_FLOOR_WARNING
] as const;

const LSF_FIELD_VALUES: FramedSplitValues = {
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

describe("wall framed facing split warning stability Gate B contract", () => {
  it("lands Gate B as a bounded runtime fix and selects Gate C closeout", () => {
    expect(WALL_FRAMED_FACING_SPLIT_GATE_B).toEqual({
      activeSlice: "wall_framed_facing_split_warning_stability_v1",
      landedGate: "gate_b_lsf_field_board_split_value_warning_stability_fix",
      numericRuntimeBehaviorChange: true,
      routeCardMovement: true,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection",
      selectedNextContract:
        "packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts",
      selectedReason:
        "gate_b_removed_lsf_field_board_split_plus_1db_drift_and_extra_monotonic_floor_warning_without_global_board_coalescing",
      visibleMovementHasPairedWebCoverage: true
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md",
      "apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/MASTER_PLAN.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("fixes the LSF field split so values, strategy, support, and warnings match baseline", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const baseline = snapshot(lsf, "field", lsf.rows);
    const split = snapshot(lsf, "field", splitBoard(lsf, 0));

    expect(baseline).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: false,
      originalSolidLayerCount: 4,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"],
      values: LSF_FIELD_VALUES,
      warnings: LSF_FIELD_WARNINGS
    });
    expect(split).toEqual({
      ...baseline,
      originalSolidLayerCount: 5
    });
    expect(split.warnings).not.toContain(MONOTONIC_FLOOR_WARNING);
  });

  it("keeps every LSF facing split position stable instead of only fixing the first board", () => {
    const lsf = resolveCase("wall-lsf-knauf");

    expect(boardRowIndexes(lsf)).toEqual([0, 1, 4, 5]);

    for (const rowIndex of boardRowIndexes(lsf)) {
      const split = snapshot(lsf, "field", splitBoard(lsf, rowIndex));

      expect(split.values, `lsf field board row ${rowIndex}`).toEqual(LSF_FIELD_VALUES);
      expect(split.strategy, `lsf field board row ${rowIndex}`).toBe(
        "stud_surrogate_blend+framed_wall_calibration"
      );
      expect(split.warnings, `lsf field board row ${rowIndex}`).toEqual(LSF_FIELD_WARNINGS);
      expect(split.warnings, `lsf field board row ${rowIndex}`).not.toContain(MONOTONIC_FLOOR_WARNING);
      expect(split.originalSolidLayerCount, `lsf field board row ${rowIndex}`).toBe(5);
    }
  });

  it("preserves the LSF lab exact anchor and timber field behavior while changing only the split drift lane", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const timber = resolveCase("wall-timber-stud");

    expect(snapshot(lsf, "lab", splitBoard(lsf, 0))).toEqual({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      exactLabMatchActive: true,
      originalSolidLayerCount: 5,
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

    for (const rowIndex of boardRowIndexes(timber)) {
      expect(snapshot(timber, "field", splitBoard(timber, rowIndex)), `timber field board row ${rowIndex}`).toEqual({
        confidenceClass: "low",
        detectedFamily: "stud_wall_system",
        exactLabMatchActive: false,
        originalSolidLayerCount: 5,
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
    }
  });

  it("keeps global same-material board coalescing outside the fix boundary", () => {
    const lsf = resolveCase("wall-lsf-knauf");
    const fieldBaseline = snapshot(lsf, "field", lsf.rows);
    const split = snapshot(lsf, "field", splitBoard(lsf, 0));
    const coalescedDoubleBoardTopology: readonly LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 25 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 25 }
    ];
    const coalesced = snapshot(lsf, "field", coalescedDoubleBoardTopology);

    expect(split.values).toEqual(fieldBaseline.values);
    expect(coalesced.values).toEqual({
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
    expect(coalesced.values).not.toEqual(split.values);
    expect(coalesced.strategy).toBe(
      "stud_surrogate_blend+framed_wall_calibration+premium_single_board_field_correction"
    );
  });
});
