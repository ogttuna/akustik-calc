import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const HOLD_SCAN_PREFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "rockwool", thicknessMm: 25 }],
  [{ materialId: "rockwool", thicknessMm: 50 }],
  [{ materialId: "glasswool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 50 }],
  [
    { materialId: "rockwool", thicknessMm: 25 },
    { materialId: "air_gap", thicknessMm: 25 }
  ],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 }
  ]
] as const;

const HOLD_SCAN_CORES = [
  { materialId: "ytong_aac_d700", thicknessesMm: [80, 100, 120, 160] },
  { materialId: "ytong_g5_800", thicknessesMm: [100, 150] },
  { materialId: "porotherm_pls_100", thicknessesMm: [100] },
  { materialId: "porotherm_pls_140", thicknessesMm: [140] },
  { materialId: "porotherm_pls_190", thicknessesMm: [190] },
  { materialId: "silka_cs_block", thicknessesMm: [100, 150] },
  { materialId: "pumice_block", thicknessesMm: [100, 150] },
  { materialId: "concrete", thicknessesMm: [80, 120] }
] as const;

const NON_AAC_SCAN_CORES = [
  { materialId: "porotherm_pls_100", thicknessesMm: [100] },
  { materialId: "porotherm_pls_140", thicknessesMm: [140] },
  { materialId: "porotherm_pls_190", thicknessesMm: [190] },
  { materialId: "silka_cs_block", thicknessesMm: [100, 150] },
  { materialId: "pumice_block", thicknessesMm: [100, 150] },
  { materialId: "concrete", thicknessesMm: [80, 120] }
] as const;

const NON_AAC_SWAP_CORE_COHORTS = [
  [
    { materialId: "porotherm_pls_100", thicknessesMm: [100] },
    { materialId: "porotherm_pls_140", thicknessesMm: [140] },
    { materialId: "porotherm_pls_190", thicknessesMm: [190] },
    { materialId: "silka_cs_block", thicknessesMm: [100, 150] }
  ],
  [
    { materialId: "pumice_block", thicknessesMm: [100, 150] },
    { materialId: "concrete", thicknessesMm: [80, 120] }
  ]
] as const;

const HOLD_SCAN_BOARDS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "diamond_board", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 },
  { materialId: "security_board", thicknessMm: 12.5 }
] as const;

const EXPANDED_SWAP_PREFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "rockwool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [
    { materialId: "rockwool", thicknessMm: 25 },
    { materialId: "air_gap", thicknessMm: 25 }
  ],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 }
  ]
] as const;

const EXPANDED_SWAP_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "ytong_aac_d700", thicknessMm: 120 },
  { materialId: "ytong_g5_800", thicknessMm: 100 }
] as const;

const FRAMED_MULTI_CANDIDATE_CONTEXTS = [
  {
    id: "steel_independent",
    targetOutputs: ["Rw"] as const,
    airborneContext: {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      sharedTrack: "independent"
    } satisfies AirborneContext
  },
  {
    id: "resilient_channel",
    targetOutputs: ["R'w"] as const,
    airborneContext: {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 600,
      airtightness: "good",
      panelHeightMm: 2700,
      panelWidthMm: 3000,
      receivingRoomRt60S: 0.5,
      receivingRoomVolumeM3: 30,
      sharedTrack: "independent"
    } satisfies AirborneContext
  }
] as const;

const FRAMED_MULTI_CANDIDATE_BOARDS: readonly (readonly LayerInput[])[] = [
  [{ materialId: "gypsum", thicknessMm: 12.5 }],
  [
    { materialId: "gypsum", thicknessMm: 12.5 },
    { materialId: "gypsum", thicknessMm: 12.5 }
  ],
  [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "diamond_board", thicknessMm: 12.5 }
  ],
  [
    { materialId: "diamond_board", thicknessMm: 12.5 },
    { materialId: "diamond_board", thicknessMm: 12.5 }
  ]
] as const;

const FRAMED_MULTI_CANDIDATE_CAVITIES: readonly (readonly LayerInput[])[] = [
  [{ materialId: "air_gap", thicknessMm: 50 }],
  [{ materialId: "rockwool", thicknessMm: 50 }],
  [{ materialId: "glasswool", thicknessMm: 70 }],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 }
  ],
  [
    { materialId: "rockwool", thicknessMm: 25 },
    { materialId: "air_gap", thicknessMm: 25 }
  ]
] as const;

const HOLD_SCAN_TIMEOUT_MS = 20_000;
const NON_AAC_SWAP_TIMEOUT_MS = 35_000;

function stackKey(layers: readonly LayerInput[]) {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

function buildBoundaryStack(input: {
  board: (typeof HOLD_SCAN_BOARDS)[number];
  coreMaterialId: string;
  coreThicknessMm: number;
  prefix: readonly LayerInput[];
}) {
  return [
    ...input.prefix,
    { materialId: input.coreMaterialId, thicknessMm: input.coreThicknessMm },
    { materialId: "air_gap", thicknessMm: 50 },
    { materialId: input.board.materialId, thicknessMm: input.board.thicknessMm }
  ] as const;
}

function buildSnapshotReader() {
  const cache = new Map<
    string,
    {
      dnTw: number | null | undefined;
      family: string | null | undefined;
      flagged: boolean;
      rw: number | null | undefined;
      rwPrime: number | null | undefined;
      strategy: string | null | undefined;
      trace: ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"];
      warnings: readonly string[];
    }
  >();

  return (layers: readonly LayerInput[]) => {
    const key = stackKey(layers);
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    const lab = calculateAssembly(layers, {
      airborneContext: LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const field = calculateAssembly(layers, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    const warnings = field.warnings.filter((warning) =>
      /boundary|hold|order-sensitive|triple-leaf|excluded from the dynamic airborne span/i.test(warning)
    );

    const snapshot = {
      dnTw: field.metrics.estimatedDnTwDb,
      family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily,
      flagged: warnings.length > 0,
      rw: lab.metrics.estimatedRwDb,
      rwPrime: field.metrics.estimatedRwPrimeDb,
      strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy,
      trace: field.dynamicAirborneTrace ?? lab.dynamicAirborneTrace,
      warnings
    };

    cache.set(key, snapshot);
    return snapshot;
  };
}

function swapAdjacent(stack: readonly LayerInput[], leftIndex: number) {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
}

function collectSilentSwapOffendersForCores(
  readSnapshot: ReturnType<typeof buildSnapshotReader>,
  cores: readonly { materialId: string; thicknessesMm: readonly number[] }[]
) {
  const offenders: Array<{
    baseStack: string;
    changedStack: string;
    delta: number;
    swapIndex: number;
  }> = [];

  for (const prefix of HOLD_SCAN_PREFIXES) {
    for (const core of cores) {
      for (const coreThicknessMm of core.thicknessesMm) {
        for (const board of HOLD_SCAN_BOARDS) {
          const stack = buildBoundaryStack({
            board,
            coreMaterialId: core.materialId,
            coreThicknessMm,
            prefix
          });
          const base = readSnapshot(stack);

          for (let swapIndex = 0; swapIndex < stack.length - 1; swapIndex += 1) {
            const changedStack = swapAdjacent(stack, swapIndex);
            const changed = readSnapshot(changedStack);
            const maxDelta = Math.max(
              Math.abs((changed.rw ?? 0) - (base.rw ?? 0)),
              Math.abs((changed.rwPrime ?? 0) - (base.rwPrime ?? 0)),
              Math.abs((changed.dnTw ?? 0) - (base.dnTw ?? 0))
            );

            if (maxDelta >= 8 && !base.flagged && !changed.flagged) {
              offenders.push({
                baseStack: stackKey(stack),
                changedStack: stackKey(changedStack),
                delta: maxDelta,
                swapIndex
              });
            }
          }
        }
      }
    }
  }

  return offenders;
}

describe("dynamic airborne family boundary scan contracts", () => {
  it("keeps the expanded heavy-core and dual-trim hold scan inside one defended corridor", () => {
    const hits: Array<{
      conflict: boolean;
      dnTw: number | null | undefined;
      key: string;
      rw: number | null | undefined;
      rwPrime: number | null | undefined;
      stack: string;
      trace: NonNullable<ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"]>;
    }> = [];

    for (const prefix of HOLD_SCAN_PREFIXES) {
      for (const core of HOLD_SCAN_CORES) {
        for (const coreThicknessMm of core.thicknessesMm) {
          for (const board of HOLD_SCAN_BOARDS) {
            const stack = buildBoundaryStack({
              board,
              coreMaterialId: core.materialId,
              coreThicknessMm,
              prefix
            });
            const result = calculateAssembly(stack, {
              airborneContext: BUILDING_CONTEXT,
              calculator: "dynamic",
              targetOutputs: ["R'w", "DnT,w"]
            });
            const trace = result.dynamicAirborneTrace;

            if (trace?.strategy.includes("family_boundary_hold")) {
              hits.push({
                conflict: Boolean(
                  (trace.runnerUpFamilyScore ?? -Infinity) > (trace.selectedFamilyScore ?? Infinity) + 1e-9
                ),
                dnTw: result.metrics.estimatedDnTwDb,
                key: `${core.materialId}:${coreThicknessMm}|${board.materialId}:${board.thicknessMm}`,
                rw: calculateAssembly(stack, {
                  airborneContext: LAB_CONTEXT,
                  calculator: "dynamic",
                  targetOutputs: ["Rw"]
                }).metrics.estimatedRwDb,
                rwPrime: result.metrics.estimatedRwPrimeDb,
                stack: stackKey(stack),
                trace
              });
            }
          }
        }
      }
    }

    const holdCountsByCore = new Map<string, number>();
    const conflictCountsByCore = new Map<string, number>();
    const spreadsBySignature = new Map<
      string,
      {
        dnTw: number[];
        rw: number[];
        rwPrime: number[];
      }
    >();

    for (const hit of hits) {
      const coreKey = hit.key.split("|")[0]!;
      holdCountsByCore.set(coreKey, (holdCountsByCore.get(coreKey) ?? 0) + 1);
      if (hit.conflict) {
        conflictCountsByCore.set(coreKey, (conflictCountsByCore.get(coreKey) ?? 0) + 1);
      }

      const spreadEntry = spreadsBySignature.get(hit.key) ?? { dnTw: [], rw: [], rwPrime: [] };
      spreadEntry.dnTw.push(hit.dnTw ?? -Infinity);
      spreadEntry.rw.push(hit.rw ?? -Infinity);
      spreadEntry.rwPrime.push(hit.rwPrime ?? -Infinity);
      spreadsBySignature.set(hit.key, spreadEntry);

      expect(hit.trace.detectedFamily, hit.stack).toBe("lined_massive_wall");
      expect(hit.trace.runnerUpFamily, hit.stack).toBe("double_leaf");
      expect(hit.trace.familyDecisionClass === "ambiguous" || hit.trace.familyDecisionClass === "narrow", hit.stack).toBe(
        true
      );
      expect(hit.trace.familyDecisionMultiplePlausibleFamilies, hit.stack).toBeUndefined();
      expect(hit.trace.familyDecisionSelectedBelowRunnerUp, hit.stack).toBe(hit.conflict || undefined);
      expect(hit.trace.familyBoundaryHoldApplied, hit.stack).toBe(true);
      expect(hit.trace.strategy.includes("family_boundary_hold"), hit.stack).toBe(true);
      expect(hit.trace.familyBoundaryHoldRunnerUpMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldBoundaryCeilingDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldCurrentMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldTargetMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldAllowedLeadDb, hit.stack).toBeTypeOf("number");

      expect(
        (hit.trace.familyBoundaryHoldCurrentMetricDb ?? -Infinity) >
          (hit.trace.familyBoundaryHoldTargetMetricDb ?? Infinity),
        hit.stack
      ).toBe(true);
      expect(
        (hit.trace.familyBoundaryHoldTargetMetricDb ?? -Infinity) >=
          (hit.trace.familyBoundaryHoldBoundaryCeilingDb ?? Infinity),
        hit.stack
      ).toBe(true);
      expect(
        (hit.trace.familyBoundaryHoldBoundaryCeilingDb ?? -Infinity) ===
          (hit.trace.familyBoundaryHoldRunnerUpMetricDb ?? Infinity) + (hit.trace.familyBoundaryHoldAllowedLeadDb ?? Infinity),
        hit.stack
      ).toBe(true);
    }

    expect(hits).toHaveLength(80);
    expect(Object.fromEntries([...holdCountsByCore.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 32,
      "ytong_aac_d700:120": 16,
      "ytong_g5_800:100": 32
    });
    expect(Object.fromEntries([...conflictCountsByCore.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 24
    });

    for (const [signature, spread] of spreadsBySignature.entries()) {
      expect(Math.max(...spread.rwPrime) - Math.min(...spread.rwPrime), `${signature} R'w spread`).toBeLessThanOrEqual(3);
      expect(Math.max(...spread.dnTw) - Math.min(...spread.dnTw), `${signature} DnT,w spread`).toBeLessThanOrEqual(3);
      expect(Math.max(...spread.rw) - Math.min(...spread.rw), `${signature} Rw spread`).toBeLessThanOrEqual(2);
    }
  }, NON_AAC_SWAP_TIMEOUT_MS);

  it("keeps the expanded non-AAC heavy-core palette out of family-boundary diagnostics", () => {
    const boundaryHits: Array<{
      stack: string;
      trace: NonNullable<ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"]>;
      warnings: readonly string[];
    }> = [];
    const familyCounts = new Map<string, number>();
    const trimCounts = new Map<string, number>();

    for (const prefix of HOLD_SCAN_PREFIXES) {
      for (const core of NON_AAC_SCAN_CORES) {
        for (const coreThicknessMm of core.thicknessesMm) {
          for (const board of HOLD_SCAN_BOARDS) {
            const stack = buildBoundaryStack({
              board,
              coreMaterialId: core.materialId,
              coreThicknessMm,
              prefix
            });
            const result = calculateAssembly(stack, {
              airborneContext: BUILDING_CONTEXT,
              calculator: "dynamic",
              targetOutputs: ["R'w", "DnT,w"]
            });
            const trace = result.dynamicAirborneTrace;
            const trimKey = `${trace?.trimmedOuterLeadingCount ?? 0}/${trace?.trimmedOuterTrailingCount ?? 0}`;

            familyCounts.set(trace?.detectedFamily ?? "none", (familyCounts.get(trace?.detectedFamily ?? "none") ?? 0) + 1);
            trimCounts.set(trimKey, (trimCounts.get(trimKey) ?? 0) + 1);

            const boundaryWarnings = result.warnings.filter((warning) =>
              /boundary between|family-boundary hold|still somewhat close/i.test(warning)
            );

            if (
              trace &&
              (trace.familyDecisionClass ||
                trace.familyDecisionSelectedBelowRunnerUp ||
                trace.runnerUpFamily ||
                trace.familyBoundaryHoldApplied ||
                boundaryWarnings.length > 0)
            ) {
              boundaryHits.push({
                stack: stackKey(stack),
                trace,
                warnings: boundaryWarnings
              });
            }
          }
        }
      }
    }

    expect(boundaryHits).toEqual([]);
    expect(Object.fromEntries([...familyCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      lined_massive_wall: 288
    });
    expect(Object.fromEntries([...trimCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "0/0": 36,
      "1/0": 180,
      "2/0": 72
    });
  }, HOLD_SCAN_TIMEOUT_MS);

  it("finds no silent >=8 dB adjacent-swap jumps across the expanded held-boundary palette", () => {
    const readSnapshot = buildSnapshotReader();
    const offenders: Array<{
      baseStack: string;
      changedStack: string;
      delta: number;
      swapIndex: number;
    }> = [];

    for (const prefix of EXPANDED_SWAP_PREFIXES) {
      for (const core of EXPANDED_SWAP_CORES) {
        for (const board of HOLD_SCAN_BOARDS) {
          const stack = buildBoundaryStack({
            board,
            coreMaterialId: core.materialId,
            coreThicknessMm: core.thicknessMm,
            prefix
          });
          const base = readSnapshot(stack);

          for (let swapIndex = 0; swapIndex < stack.length - 1; swapIndex += 1) {
            const changedStack = swapAdjacent(stack, swapIndex);
            const changed = readSnapshot(changedStack);
            const maxDelta = Math.max(
              Math.abs((changed.rw ?? 0) - (base.rw ?? 0)),
              Math.abs((changed.rwPrime ?? 0) - (base.rwPrime ?? 0)),
              Math.abs((changed.dnTw ?? 0) - (base.dnTw ?? 0))
            );

            if (maxDelta >= 8 && !base.flagged && !changed.flagged) {
              offenders.push({
                baseStack: stackKey(stack),
                changedStack: stackKey(changedStack),
                delta: maxDelta,
                swapIndex
              });
            }
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  }, NON_AAC_SWAP_TIMEOUT_MS);

  it("finds no silent >=8 dB adjacent-swap jumps across the first expanded non-AAC heavy-core cohort", () => {
    const readSnapshot = buildSnapshotReader();
    const offenders = collectSilentSwapOffendersForCores(readSnapshot, NON_AAC_SWAP_CORE_COHORTS[0]);

    expect(offenders).toEqual([]);
  }, NON_AAC_SWAP_TIMEOUT_MS);

  it("finds no silent >=8 dB adjacent-swap jumps across the second expanded non-AAC heavy-core cohort", () => {
    const readSnapshot = buildSnapshotReader();
    const offenders = collectSilentSwapOffendersForCores(readSnapshot, NON_AAC_SWAP_CORE_COHORTS[1]);

    expect(offenders).toEqual([]);
  }, NON_AAC_SWAP_TIMEOUT_MS);

  it("finds no multi-candidate boundary surface across the representative framed palette yet", () => {
    const flaggedHits: Array<{
      context: string;
      stack: string;
      reason: string;
      trace: NonNullable<ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"]>;
    }> = [];
    const familyCounts = new Map<string, number>();

    for (const context of FRAMED_MULTI_CANDIDATE_CONTEXTS) {
      for (const leftLeaf of FRAMED_MULTI_CANDIDATE_BOARDS) {
        for (const cavity of FRAMED_MULTI_CANDIDATE_CAVITIES) {
          for (const rightLeaf of FRAMED_MULTI_CANDIDATE_BOARDS) {
            const stack = [...leftLeaf, ...cavity, ...rightLeaf] as const;
            const result = calculateAssembly(stack, {
              airborneContext: context.airborneContext,
              calculator: "dynamic",
              targetOutputs: [...context.targetOutputs]
            });
            const trace = result.dynamicAirborneTrace;

            familyCounts.set(
              `${context.id}:${trace?.detectedFamily ?? "none"}`,
              (familyCounts.get(`${context.id}:${trace?.detectedFamily ?? "none"}`) ?? 0) + 1
            );

            if (trace?.familyDecisionMultiplePlausibleFamilies) {
              flaggedHits.push({
                context: context.id,
                reason: "multiple_plausible",
                stack: stackKey(stack),
                trace
              });
            }

            if (trace?.familyDecisionSelectedBelowRunnerUp) {
              flaggedHits.push({
                context: context.id,
                reason: "selection_conflict",
                stack: stackKey(stack),
                trace
              });
            }
          }
        }
      }
    }

    expect(flaggedHits).toEqual([]);
    expect(Object.fromEntries([...familyCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "resilient_channel:stud_wall_system": 80,
      "steel_independent:stud_wall_system": 80
    });
  }, HOLD_SCAN_TIMEOUT_MS);
});
