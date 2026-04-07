import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];
const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];

const FLOOR_AIRBORNE_CONTEXT = {
  contextMode: "building_prediction" as const,
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_FIELD_CONTEXT = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const WALL_FIELD_CONTEXT = {
  contextMode: "building_prediction" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

function splitRow(
  rows: readonly LayerInput[],
  rowIndex: number,
  firstThicknessMm: number,
  secondThicknessMm: number
): LayerInput[] {
  const row = rows[rowIndex];

  if (!row) {
    throw new Error(`Cannot split missing row at index ${rowIndex}.`);
  }

  return [
    ...rows.slice(0, rowIndex),
    { ...row, thicknessMm: firstThicknessMm },
    { ...row, thicknessMm: secondThicknessMm },
    ...rows.slice(rowIndex + 1)
  ];
}

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    boundFloorSystemEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

const FLOOR_EXACT_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const FLOOR_BOUND_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const WALL_DEEP_ROWS: readonly LayerInput[] = [
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

type ParityCase = {
  fieldRequest: readonly RequestedOutputId[];
  fieldOptions: Parameters<typeof calculateAssembly>[1];
  id: string;
  labRequest: readonly RequestedOutputId[];
  labOptions: Parameters<typeof calculateAssembly>[1];
  rows: readonly LayerInput[];
  variants: readonly {
    id: string;
    rows: readonly LayerInput[];
  }[];
};

const CASES: readonly ParityCase[] = [
  {
    id: "deep open-box exact floor package",
    rows: FLOOR_EXACT_ROWS,
    labRequest: FLOOR_LAB_OUTPUTS,
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    fieldRequest: FLOOR_FIELD_OUTPUTS,
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    variants: [
      {
        id: "split upper fill 20+30",
        rows: splitRow(FLOOR_EXACT_ROWS, 6, 20, 30)
      },
      {
        id: "split floating screed 25+35",
        rows: splitRow(FLOOR_EXACT_ROWS, 7, 25, 35)
      }
    ]
  },
  {
    id: "deep open-web bound floor package",
    rows: FLOOR_BOUND_ROWS,
    labRequest: FLOOR_LAB_OUTPUTS,
    labOptions: { targetOutputs: FLOOR_LAB_OUTPUTS },
    fieldRequest: FLOOR_FIELD_OUTPUTS,
    fieldOptions: {
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_FIELD_OUTPUTS
    },
    variants: [
      {
        id: "split ceiling fill 60+85",
        rows: splitRow(FLOOR_BOUND_ROWS, 3, 60, 85)
      }
    ]
  },
  {
    id: "deep AAC wall package",
    rows: WALL_DEEP_ROWS,
    labRequest: WALL_LAB_OUTPUTS,
    labOptions: { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS },
    fieldRequest: WALL_FIELD_OUTPUTS,
    fieldOptions: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    variants: [
      {
        id: "split first mineral wool 15+35",
        rows: splitRow(WALL_DEEP_ROWS, 1, 15, 35)
      }
    ]
  }
];

describe("mixed floor and wall complex-stack engine parity", () => {
  it("keeps representative deep floor and wall packages stable across neutral contiguous splits", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const baselineLab = calculateAssembly(testCase.rows, testCase.labOptions);
      const baselineField = calculateAssembly(testCase.rows, testCase.fieldOptions);
      const baselineLabSnapshot = resultSnapshot(baselineLab);
      const baselineFieldSnapshot = resultSnapshot(baselineField);

      for (const variant of testCase.variants) {
        const variantLab = calculateAssembly(variant.rows, testCase.labOptions);
        const variantField = calculateAssembly(variant.rows, testCase.fieldOptions);

        if (JSON.stringify(resultSnapshot(variantLab)) !== JSON.stringify(baselineLabSnapshot)) {
          failures.push(
            `${testCase.id} ${variant.id} lab: expected ${JSON.stringify(baselineLabSnapshot)}, got ${JSON.stringify(resultSnapshot(variantLab))}`
          );
        }

        if (JSON.stringify(resultSnapshot(variantField)) !== JSON.stringify(baselineFieldSnapshot)) {
          failures.push(
            `${testCase.id} ${variant.id} field: expected ${JSON.stringify(baselineFieldSnapshot)}, got ${JSON.stringify(resultSnapshot(variantField))}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
