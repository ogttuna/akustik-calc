import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type BoundSnapshot = {
  boundFloorSystemMatchId: string | null;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  lnWUpperBound: number | null;
  lPrimeNTwUpperBound: number | null;
  lPrimeNWUpperBound: number | null;
  lowerBoundBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const UBIQ_CARPET_BOUND_ID = "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026";
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

function splitLayer(layer: LayerInput, splitCount: number): LayerInput[] {
  const splitThicknessMm = Math.round((layer.thicknessMm / splitCount) * 1000) / 1000;
  let usedThicknessMm = 0;

  return Array.from({ length: splitCount }, (_, index) => {
    const thicknessMm =
      index === splitCount - 1
        ? Math.round((layer.thicknessMm - usedThicknessMm) * 1000) / 1000
        : splitThicknessMm;
    usedThicknessMm = Math.round((usedThicknessMm + thicknessMm) * 1000) / 1000;

    return { ...layer, thicknessMm };
  });
}

function buildHighSplitEquivalentStack(): LayerInput[] {
  return [
    ...splitLayer(UBIQ_CARPET_STACK[0]!, 2),
    ...splitLayer(UBIQ_CARPET_STACK[1]!, 2),
    ...splitLayer(UBIQ_CARPET_STACK[2]!, 2),
    ...splitLayer(UBIQ_CARPET_STACK[3]!, 10),
    ...splitLayer(UBIQ_CARPET_STACK[4]!, 5),
    ...splitLayer(UBIQ_CARPET_STACK[5]!, 4),
    ...splitLayer(UBIQ_CARPET_STACK[6]!, 4),
    ...splitLayer(UBIQ_CARPET_STACK[7]!, 20)
  ];
}

function snapshot(layers: readonly LayerInput[]): BoundSnapshot {
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
    lnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    lPrimeNTwUpperBound: result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNWUpperBound: result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function expectOfficialCombinedBound(snapshotValue: BoundSnapshot, label: string) {
  expect(snapshotValue, label).toEqual({
    boundFloorSystemMatchId: UBIQ_CARPET_BOUND_ID,
    floorSystemEstimateKind: null,
    impactBasis: null,
    lnW: null,
    lnWPlusCI: null,
    lnWPlusCIUpperBound: 45,
    lnWUpperBound: null,
    lPrimeNTwUpperBound: null,
    lPrimeNWUpperBound: null,
    lowerBoundBasis: "official_floor_system_bound_support",
    rw: 64,
    supported: ["Rw", "Ln,w+CI"],
    unsupported: ["Ln,w", "CI", "L'n,w", "L'nT,w", "L'nT,50"]
  });
}

describe("UBIQ Ln,w+CI bound hostile-input guard", () => {
  it("keeps source-equivalent split and reordered stacks on the same combined official bound", () => {
    const highSplitEquivalent = buildHighSplitEquivalentStack();

    expect(highSplitEquivalent).toHaveLength(49);
    expectOfficialCombinedBound(snapshot(UBIQ_CARPET_STACK), "canonical stack");
    expectOfficialCombinedBound(snapshot(highSplitEquivalent), "49-layer split stack");
    expectOfficialCombinedBound(snapshot([...UBIQ_CARPET_STACK].reverse()), "role-reordered stack");
  });

  it("keeps malformed near-miss stacks off official bound provenance", () => {
    const malformedStacks: Record<string, readonly LayerInput[]> = {
      disjointCarpetSplit: [
        ...UBIQ_CARPET_STACK.slice(0, 5),
        { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 4 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 1 },
        { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 8 },
        ...UBIQ_CARPET_STACK.slice(6)
      ],
      fourCeilingBoards: [
        ...UBIQ_CARPET_STACK.slice(0, 3),
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        ...UBIQ_CARPET_STACK.slice(3)
      ],
      missingCeilingFill: [...UBIQ_CARPET_STACK.slice(0, 3), ...UBIQ_CARPET_STACK.slice(4)],
      wrongJoistDepth: [
        ...UBIQ_CARPET_STACK.slice(0, 7),
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 305 }
      ]
    };

    for (const [id, layers] of Object.entries(malformedStacks)) {
      const actual = snapshot(layers);

      expect(actual.boundFloorSystemMatchId, id).toBeNull();
      expect(actual.lowerBoundBasis, id).toBeNull();
      expect(actual.lnWPlusCIUpperBound, id).toBeNull();
      expect(actual.lnWUpperBound, id).toBeNull();
    }
  });
});
