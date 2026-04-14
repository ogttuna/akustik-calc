import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

type PostureSnapshot = {
  boundFloorSystemMatchId: string | null;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"];
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_CARPET_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const UBIQ_CARPET_NEAR_MISSES: Record<string, readonly LayerInput[]> = {
  disjointCarpetSplit: [
    ...UBIQ_CARPET_STACK.slice(0, 5),
    { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 4 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 1 },
    { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 8 },
    ...UBIQ_CARPET_STACK.slice(6)
  ],
  extraCeilingBoard: [
    ...UBIQ_CARPET_STACK.slice(0, 3),
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    ...UBIQ_CARPET_STACK.slice(3)
  ],
  missingCeilingFill: [...UBIQ_CARPET_STACK.slice(0, 3), ...UBIQ_CARPET_STACK.slice(4)],
  missingInexFloorPanel: [...UBIQ_CARPET_STACK.slice(0, 6), UBIQ_CARPET_STACK[7]!],
  wrongJoistDepth: [
    ...UBIQ_CARPET_STACK.slice(0, 7),
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 305 }
  ]
};

function snapshotAssembly(layers: readonly LayerInput[]): PostureSnapshot {
  const result = calculateAssembly(layers, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function snapshotImpactOnly(layers: readonly LayerInput[]): PostureSnapshot {
  const result = calculateImpactOnly(layers, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function expectAssemblyImpactFailClosed(actual: PostureSnapshot, label: string) {
  expect(actual, label).toEqual({
    boundFloorSystemMatchId: null,
    floorSystemEstimateKind: null,
    impactBasis: null,
    lnW: null,
    lnWPlusCI: null,
    lnWPlusCIUpperBound: null,
    rw: expect.any(Number),
    supported: ["Rw"],
    unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
  });
}

function expectImpactOnlyFailClosed(actual: PostureSnapshot, label: string) {
  expect(actual, label).toEqual({
    boundFloorSystemMatchId: null,
    floorSystemEstimateKind: null,
    impactBasis: null,
    lnW: null,
    lnWPlusCI: null,
    lnWPlusCIUpperBound: null,
    rw: expect.any(Number),
    supported: [],
    unsupported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
  });
}

describe("UBIQ Ln,w+CI bound near-miss estimate posture", () => {
  it("keeps malformed carpet bound near-misses impact-fail-closed on the assembly route", () => {
    for (const [id, layers] of Object.entries(UBIQ_CARPET_NEAR_MISSES)) {
      expectAssemblyImpactFailClosed(snapshotAssembly(layers), id);
    }
  });

  it("keeps malformed carpet bound near-misses impact-fail-closed on the impact-only route", () => {
    for (const [id, layers] of Object.entries(UBIQ_CARPET_NEAR_MISSES)) {
      expectImpactOnlyFailClosed(snapshotImpactOnly(layers), id);
    }
  });
});
