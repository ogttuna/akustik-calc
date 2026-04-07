import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const FIELD_TRACE_OUTPUTS: readonly RequestedOutputId[] = ["DnT,w"];
const ROUTE_DEEP_HYBRID_TIMEOUT_MS = 40_000;

const DEEP_HYBRID_PREFIXES = [
  [],
  [{ materialId: "rockwool", thicknessMm: "25" }],
  [{ materialId: "air_gap", thicknessMm: "25" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "rockwool", thicknessMm: "25" }
  ]
] as const;

const DEEP_HYBRID_SUFFIXES = [
  [],
  [{ materialId: "glasswool", thicknessMm: "25" }],
  [{ materialId: "air_gap", thicknessMm: "25" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "glasswool", thicknessMm: "25" }
  ]
] as const;

const DEEP_HYBRID_CAVITY_PACKS = [
  [{ materialId: "air_gap", thicknessMm: "50" }],
  [
    { materialId: "rockwool", thicknessMm: "25" },
    { materialId: "air_gap", thicknessMm: "50" }
  ],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "rockwool", thicknessMm: "25" },
    { materialId: "air_gap", thicknessMm: "50" }
  ]
] as const;

const DEEP_HYBRID_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "ytong_aac_d700", thicknessMm: "120" },
  { materialId: "ytong_g5_800", thicknessMm: "100" },
  { materialId: "porotherm_pls_140", thicknessMm: "140" },
  { materialId: "silka_cs_block", thicknessMm: "150" },
  { materialId: "concrete", thicknessMm: "120" }
] as const;

const BOARDS = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "diamond_board", thicknessMm: "12.5" },
  { materialId: "firestop_board", thicknessMm: "15" },
  { materialId: "security_board", thicknessMm: "12.5" }
] as const;

function buildRows(
  stack: readonly { materialId: string; thicknessMm: string }[],
  id: string
) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${id}-${index + 1}`
  }));
}

function evaluateDynamicWallField(
  stack: readonly { materialId: string; thicknessMm: string }[],
  id: string
) {
  const result = evaluateScenario({
    airborneContext: BUILDING_CONTEXT,
    calculator: "dynamic",
    id,
    name: id,
    rows: buildRows(stack, id),
    source: "current",
    studyMode: "wall",
    targetOutputs: FIELD_TRACE_OUTPUTS
  });

  expect(result.result?.ok, `${id} field should stay ok`).toBe(true);
  return result.result!;
}

function buildDeepHybridStack(input: {
  board: (typeof BOARDS)[number];
  cavityPack: readonly { materialId: string; thicknessMm: string }[];
  core: (typeof DEEP_HYBRID_CORES)[number];
  prefix: readonly { materialId: string; thicknessMm: string }[];
  suffix: readonly { materialId: string; thicknessMm: string }[];
}) {
  return [
    ...input.prefix,
    input.core,
    ...input.cavityPack,
    input.board,
    ...input.suffix
  ] as const;
}

function stackKey(stack: readonly { materialId: string; thicknessMm: string }[]) {
  return stack.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

describe("dynamic route deep hybrid boundary scan contracts", () => {
  it("keeps the representative deeper hybrid trailing-trim route palette on the same defended pairing", () => {
    const boundaryCounts = new Map<string, number>();
    const conflictCounts = new Map<string, number>();
    const holdTrimCounts = new Map<string, number>();
    const hits: Array<{
      stack: string;
      trace: NonNullable<ReturnType<typeof evaluateDynamicWallField>["dynamicAirborneTrace"]>;
    }> = [];
    let scanIndex = 0;

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
              const result = evaluateDynamicWallField(stack, `deep-hybrid-${scanIndex++}`);
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
  }, ROUTE_DEEP_HYBRID_TIMEOUT_MS);
});
