import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const DEEP_HYBRID_TIMEOUT_MS = 35_000;

const DEEP_HYBRID_PREFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "rockwool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 }
  ]
] as const;

const DEEP_HYBRID_SUFFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "glasswool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "glasswool", thicknessMm: 25 }
  ]
] as const;

const DEEP_HYBRID_CAVITY_PACKS: readonly (readonly LayerInput[])[] = [
  [{ materialId: "air_gap", thicknessMm: 50 }],
  [
    { materialId: "rockwool", thicknessMm: 25 },
    { materialId: "air_gap", thicknessMm: 50 }
  ],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 },
    { materialId: "air_gap", thicknessMm: 50 }
  ]
] as const;

const DEEP_HYBRID_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "ytong_aac_d700", thicknessMm: 120 },
  { materialId: "ytong_g5_800", thicknessMm: 100 },
  { materialId: "porotherm_pls_140", thicknessMm: 140 },
  { materialId: "silka_cs_block", thicknessMm: 150 },
  { materialId: "concrete", thicknessMm: 120 }
] as const;

const BOARDS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "diamond_board", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 },
  { materialId: "security_board", thicknessMm: 12.5 }
] as const;

function stackKey(layers: readonly LayerInput[]) {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

function buildDeepHybridStack(input: {
  board: (typeof BOARDS)[number];
  cavityPack: readonly LayerInput[];
  core: (typeof DEEP_HYBRID_CORES)[number];
  prefix: readonly LayerInput[];
  suffix: readonly LayerInput[];
}) {
  return [
    ...input.prefix,
    input.core,
    ...input.cavityPack,
    { materialId: input.board.materialId, thicknessMm: input.board.thicknessMm },
    ...input.suffix
  ] as const;
}

describe("dynamic airborne deep hybrid boundary scan contracts", () => {
  it("keeps the representative deeper hybrid trailing-trim palette on the same defended pairing", () => {
    const boundaryCounts = new Map<string, number>();
    const conflictCounts = new Map<string, number>();
    const holdTrimCounts = new Map<string, number>();
    const hits: Array<{
      stack: string;
      trace: NonNullable<ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"]>;
    }> = [];

    for (const prefix of DEEP_HYBRID_PREFIXES) {
      for (const suffix of DEEP_HYBRID_SUFFIXES) {
        for (const cavityPack of DEEP_HYBRID_CAVITY_PACKS) {
          for (const core of DEEP_HYBRID_CORES) {
            for (const board of BOARDS) {
              const stack = buildDeepHybridStack({
                board,
                cavityPack,
                core,
                prefix,
                suffix
              });
              const result = calculateAssembly(stack, {
                airborneContext: BUILDING_CONTEXT,
                calculator: "dynamic",
                targetOutputs: ["DnT,w"]
              });
              const trace = result.dynamicAirborneTrace;

              if (trace?.familyDecisionClass || trace?.runnerUpFamily || trace?.familyBoundaryHoldApplied) {
                const coreKey = `${core.materialId}:${core.thicknessMm}`;
                const trimKey = `${trace?.trimmedOuterLeadingCount ?? 0}/${trace?.trimmedOuterTrailingCount ?? 0}`;

                boundaryCounts.set(coreKey, (boundaryCounts.get(coreKey) ?? 0) + 1);
                holdTrimCounts.set(trimKey, (holdTrimCounts.get(trimKey) ?? 0) + 1);
                if (trace.familyDecisionSelectedBelowRunnerUp) {
                  conflictCounts.set(coreKey, (conflictCounts.get(coreKey) ?? 0) + 1);
                }

                hits.push({
                  stack: stackKey(stack),
                  trace
                });
              }
            }
          }
        }
      }
    }

    for (const hit of hits) {
      expect(hit.trace.detectedFamily, hit.stack).toBe("lined_massive_wall");
      expect(hit.trace.runnerUpFamily, hit.stack).toBe("double_leaf");
      expect(hit.trace.familyDecisionMultiplePlausibleFamilies, hit.stack).toBeUndefined();
      expect(hit.trace.familyBoundaryHoldApplied, hit.stack).toBe(true);
      expect(hit.trace.strategy.includes("family_boundary_hold"), hit.stack).toBe(true);
      expect(hit.trace.familyDecisionClass === "ambiguous" || hit.trace.familyDecisionClass === "narrow", hit.stack).toBe(
        true
      );
      expect(hit.trace.trimmedOuterLeadingCount ?? 0, hit.stack).toBeLessThanOrEqual(2);
      expect(hit.trace.trimmedOuterTrailingCount ?? 0, hit.stack).toBeLessThanOrEqual(2);
    }

    expect(hits).toHaveLength(480);
    expect(Object.fromEntries([...boundaryCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 192,
      "ytong_aac_d700:120": 96,
      "ytong_g5_800:100": 192
    });
    expect(Object.fromEntries([...conflictCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 144
    });
    expect(Object.fromEntries([...holdTrimCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "0/0": 30,
      "0/1": 60,
      "0/2": 30,
      "1/0": 60,
      "1/1": 120,
      "1/2": 60,
      "2/0": 30,
      "2/1": 60,
      "2/2": 30
    });
  }, DEEP_HYBRID_TIMEOUT_MS);
});
