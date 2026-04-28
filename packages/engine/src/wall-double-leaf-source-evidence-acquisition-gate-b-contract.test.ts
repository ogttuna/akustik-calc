import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const;

type MetricPath = "ratings.iso717.Rw" | "ratings.field.DnTA" | "ratings.field.DnTAk";
type RowFamily = "single_stud_lightweight" | "double_stud_split_cavity";

type ReconciliationRow = {
  airborneContext: AirborneContext;
  currentActualValue: number;
  expectedDetectedFamily: "stud_wall_system" | "double_stud_system";
  expectedRuntimeStrategyToken: string;
  id: string;
  layers: LayerInput[];
  metricPath: MetricPath;
  rowFamily: RowFamily;
  sourceExpectedValue: number;
  sourceToleranceDb: number;
  sourceValueOwner: "framed_benchmark_holdout" | "exact_verified_field_proxy_anchor";
};

const LAB_STEEL_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} satisfies AirborneContext;

const FIELD_STEEL_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} satisfies AirborneContext;

const FIELD_STEEL_RT60_CONTEXT = {
  ...FIELD_STEEL_CONTEXT,
  receivingRoomRt60S: 0.5
} satisfies AirborneContext;

const LAB_DOUBLE_STUD_CONTEXT = {
  ...LAB_STEEL_CONTEXT,
  sharedTrack: "independent"
} satisfies AirborneContext;

function buildLayers(entries: readonly (readonly [string, number])[]): LayerInput[] {
  return entries.map(([materialId, thicknessMm]) => ({
    materialId,
    thicknessMm
  }));
}

function getMetricValue(result: unknown, metricPath: MetricPath): number | null {
  const value = metricPath
    .split(".")
    .reduce((current: unknown, key: string) => (current == null ? undefined : (current as Record<string, unknown>)[key]), result);

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B = {
  landedGate: "gate_b_bounded_framed_wall_reconciliation",
  previousGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedGateCAction: "gate_c_close_source_evidence_slice_no_runtime_and_select_next_accuracy_gap",
  sliceId: "wall_double_leaf_source_evidence_acquisition_v1",
  status: "no_runtime_bounded_framed_wall_rows_already_fit"
} as const;

const BOUNDED_FRAMED_RECONCILIATION_ROWS: readonly ReconciliationRow[] = [
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 43,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w111_75_100_60mw_a_rw_holdout_2026",
    layers: buildLayers([["gypsum", 12.5], ["air_gap", 40], ["glasswool", 60], ["gypsum", 12.5]]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 43,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 46,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w111_100_125_80mw_a_rw_holdout_2026",
    layers: buildLayers([["gypsum", 12.5], ["air_gap", 45], ["glasswool", 80], ["gypsum", 12.5]]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 46,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 42,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_50_100_a_rw_holdout_2026",
    layers: buildLayers([["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 100], ["gypsum", 12.5], ["gypsum", 12.5]]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 42,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 50,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_50_100_40mw_a_rw_holdout_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 60],
      ["glasswool", 40],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 50,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 51,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_75_125_60mw_a_rw_holdout_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 65],
      ["glasswool", 60],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 51,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_STEEL_CONTEXT,
    currentActualValue: 52,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_100_150_80mw_a_rw_holdout_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 70],
      ["glasswool", 80],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 52,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_DOUBLE_STUD_CONTEXT,
    currentActualValue: 61,
    expectedDetectedFamily: "double_stud_system",
    expectedRuntimeStrategyToken: "double_stud_calibration",
    id: "knauf_w115_2x75_205_60gw_rw_holdout_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 75],
      ["glasswool", 60],
      ["air_gap", 70],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "double_stud_split_cavity",
    sourceExpectedValue: 61,
    sourceToleranceDb: 4,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: LAB_DOUBLE_STUD_CONTEXT,
    currentActualValue: 61,
    expectedDetectedFamily: "double_stud_system",
    expectedRuntimeStrategyToken: "double_stud_calibration",
    id: "knauf_w119_75_75_206_60gw_rw_holdout_2026",
    layers: buildLayers([
      ["security_board", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 73],
      ["glasswool", 60],
      ["air_gap", 73],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.iso717.Rw",
    rowFamily: "double_stud_split_cavity",
    sourceExpectedValue: 61,
    sourceToleranceDb: 4,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: FIELD_STEEL_CONTEXT,
    currentActualValue: 35,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_50_100_a_field_2026",
    layers: buildLayers([["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 100], ["gypsum", 12.5], ["gypsum", 12.5]]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 35,
    sourceToleranceDb: 3,
    sourceValueOwner: "exact_verified_field_proxy_anchor"
  },
  {
    airborneContext: FIELD_STEEL_CONTEXT,
    currentActualValue: 43,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_50_100_40mw_a_field_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 60],
      ["glasswool", 40],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 43,
    sourceToleranceDb: 3,
    sourceValueOwner: "exact_verified_field_proxy_anchor"
  },
  {
    airborneContext: FIELD_STEEL_CONTEXT,
    currentActualValue: 44,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_75_125_60mw_a_field_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 65],
      ["glasswool", 60],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 44,
    sourceToleranceDb: 3,
    sourceValueOwner: "exact_verified_field_proxy_anchor"
  },
  {
    airborneContext: FIELD_STEEL_CONTEXT,
    currentActualValue: 44,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w112_100_150_80mw_a_field_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 70],
      ["glasswool", 80],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 44,
    sourceToleranceDb: 3,
    sourceValueOwner: "exact_verified_field_proxy_anchor"
  },
  {
    airborneContext: FIELD_STEEL_RT60_CONTEXT,
    currentActualValue: 34.3,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w111_75_100_60mw_a_field_holdout_2026",
    layers: buildLayers([["gypsum", 12.5], ["air_gap", 40], ["glasswool", 60], ["gypsum", 12.5]]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 34,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: FIELD_STEEL_RT60_CONTEXT,
    currentActualValue: 38,
    expectedDetectedFamily: "stud_wall_system",
    expectedRuntimeStrategyToken: "framed_wall_calibration",
    id: "knauf_w111_100_125_80mw_a_field_holdout_2026",
    layers: buildLayers([["gypsum", 12.5], ["air_gap", 45], ["glasswool", 80], ["gypsum", 12.5]]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "single_stud_lightweight",
    sourceExpectedValue: 38,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: FIELD_STEEL_RT60_CONTEXT,
    currentActualValue: 52,
    expectedDetectedFamily: "double_stud_system",
    expectedRuntimeStrategyToken: "double_stud_calibration",
    id: "knauf_w115_2x75_205_60gw_field_holdout_2026",
    layers: buildLayers([
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 75],
      ["glasswool", 60],
      ["air_gap", 70],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "double_stud_split_cavity",
    sourceExpectedValue: 52,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  },
  {
    airborneContext: FIELD_STEEL_RT60_CONTEXT,
    currentActualValue: 52,
    expectedDetectedFamily: "double_stud_system",
    expectedRuntimeStrategyToken: "double_stud_calibration",
    id: "knauf_w119_75_75_206_60gw_field_holdout_2026",
    layers: buildLayers([
      ["security_board", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 73],
      ["glasswool", 60],
      ["air_gap", 73],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]),
    metricPath: "ratings.field.DnTA",
    rowFamily: "double_stud_split_cavity",
    sourceExpectedValue: 52,
    sourceToleranceDb: 3,
    sourceValueOwner: "framed_benchmark_holdout"
  }
] as const;

const GATE_B_NO_RUNTIME_DECISION = {
  directRuntimeMovementRows: [],
  emptyNoStudRowsRemainFrozen: true,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  reason:
    "bounded W111/W112/W115/W119 rows already sit inside their named source tolerances; W112 field rows are already exact proxy anchors",
  routeCardChangeRequiredNow: false,
  runtimeMovementRequiredNow: false
} as const;

describe("wall double-leaf source evidence acquisition Gate B contract", () => {
  it("records Gate B as a no-runtime bounded framed-wall reconciliation", () => {
    expect(WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B).toEqual({
      landedGate: "gate_b_bounded_framed_wall_reconciliation",
      previousGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedGateCAction: "gate_c_close_source_evidence_slice_no_runtime_and_select_next_accuracy_gap",
      sliceId: "wall_double_leaf_source_evidence_acquisition_v1",
      status: "no_runtime_bounded_framed_wall_rows_already_fit"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md",
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts",
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "packages/engine/src/airborne-verified-catalog.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps bounded Knauf W111/W112/W115/W119 rows inside source tolerances without moving runtime", () => {
    expect(BOUNDED_FRAMED_RECONCILIATION_ROWS).toHaveLength(16);

    for (const row of BOUNDED_FRAMED_RECONCILIATION_ROWS) {
      const result = calculateAssembly(row.layers, {
        airborneContext: row.airborneContext,
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });
      const actual = getMetricValue(result, row.metricPath);

      expect(actual, row.id).not.toBeNull();
      expect(actual ?? 0, row.id).toBeCloseTo(row.currentActualValue, 1);
      expect(Math.abs((actual ?? 0) - row.sourceExpectedValue), row.id).toBeLessThanOrEqual(row.sourceToleranceDb);
      expect(result.dynamicAirborneTrace?.detectedFamily, row.id).toBe(row.expectedDetectedFamily);
      expect(result.dynamicAirborneTrace?.strategy ?? "", row.id).toContain(row.expectedRuntimeStrategyToken);

      if (row.sourceValueOwner === "exact_verified_field_proxy_anchor") {
        expect(result.ratings.field?.basis ?? "", row.id).toContain("exact_verified_field_proxy_anchor");
        expect(result.ratings.field?.DnTAk, row.id).toBe(row.sourceExpectedValue);
        expect(
          result.warnings.some((warning: string) => /official DnT,A,k .* through the local DnT,A proxy lane/i.test(warning)),
          row.id
        ).toBe(true);
      }

      if (row.expectedDetectedFamily === "double_stud_system") {
        expect(result.dynamicAirborneTrace?.detectedFamilyLabel, row.id).toBe("Double Frame / Double Stud");
        expect(result.dynamicAirborneTrace?.confidenceClass, row.id).toBe("medium");
        expect(
          result.warnings.some((warning: string) => /calibrated double-stud corridor/i.test(warning)),
          row.id
        ).toBe(true);
      }
    }
  });

  it("summarizes the reconciliation errors by owner and family", () => {
    const errorsByOwner = new Map<string, number[]>();
    const errorsByFamily = new Map<RowFamily, number[]>();

    for (const row of BOUNDED_FRAMED_RECONCILIATION_ROWS) {
      const result = calculateAssembly(row.layers, {
        airborneContext: row.airborneContext,
        calculator: "dynamic",
        targetOutputs: TARGET_OUTPUTS
      });
      const actual = getMetricValue(result, row.metricPath);
      const error = Math.abs((actual ?? Number.NaN) - row.sourceExpectedValue);

      expect(Number.isFinite(error), row.id).toBe(true);
      errorsByOwner.set(row.sourceValueOwner, [...(errorsByOwner.get(row.sourceValueOwner) ?? []), error]);
      errorsByFamily.set(row.rowFamily, [...(errorsByFamily.get(row.rowFamily) ?? []), error]);
    }

    expect(Math.max(...(errorsByOwner.get("exact_verified_field_proxy_anchor") ?? []))).toBe(0);
    expect(Math.max(...(errorsByOwner.get("framed_benchmark_holdout") ?? []))).toBeLessThanOrEqual(0.3);
    expect(Math.max(...(errorsByFamily.get("single_stud_lightweight") ?? []))).toBeLessThanOrEqual(0.3);
    expect(Math.max(...(errorsByFamily.get("double_stud_split_cavity") ?? []))).toBe(0);
  });

  it("blocks runtime movement and route-card copy changes from this reconciliation alone", () => {
    expect(GATE_B_NO_RUNTIME_DECISION).toEqual({
      directRuntimeMovementRows: [],
      emptyNoStudRowsRemainFrozen: true,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      reason:
        "bounded W111/W112/W115/W119 rows already sit inside their named source tolerances; W112 field rows are already exact proxy anchors",
      routeCardChangeRequiredNow: false,
      runtimeMovementRequiredNow: false
    });
  });
});
