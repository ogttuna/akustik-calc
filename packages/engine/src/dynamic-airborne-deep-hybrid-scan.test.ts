import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BOARDS,
  buildDeepHybridStack,
  BUILDING_CONTEXT,
  DEEP_HYBRID_CAVITY_PACKS,
  DEEP_HYBRID_CORES,
  DEEP_HYBRID_PREFIXES,
  DEEP_HYBRID_SUFFIXES,
  DEEP_HYBRID_TIMEOUT_MS,
  stackKey
} from "./dynamic-airborne-deep-hybrid-test-helpers";

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
