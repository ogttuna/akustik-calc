import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

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

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "DnT,w"];
const ROUTE_SCAN_TIMEOUT_MS = 20_000;

const REPRESENTATIVE_PREFIXES = [
  [],
  [{ materialId: "rockwool", thicknessMm: "25" }],
  [{ materialId: "air_gap", thicknessMm: "25" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "rockwool", thicknessMm: "25" }
  ]
] as const;

const REPRESENTATIVE_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "ytong_aac_d700", thicknessMm: "120" },
  { materialId: "ytong_g5_800", thicknessMm: "100" }
] as const;

const NON_AAC_REPRESENTATIVE_CORES = [
  { materialId: "porotherm_pls_100", thicknessMm: "100" },
  { materialId: "porotherm_pls_140", thicknessMm: "140" },
  { materialId: "porotherm_pls_190", thicknessMm: "190" },
  { materialId: "silka_cs_block", thicknessMm: "100" },
  { materialId: "silka_cs_block", thicknessMm: "150" },
  { materialId: "pumice_block", thicknessMm: "100" },
  { materialId: "pumice_block", thicknessMm: "150" },
  { materialId: "concrete", thicknessMm: "80" },
  { materialId: "concrete", thicknessMm: "120" }
] as const;

const REPRESENTATIVE_BOARDS = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "diamond_board", thicknessMm: "12.5" },
  { materialId: "firestop_board", thicknessMm: "15" },
  { materialId: "security_board", thicknessMm: "12.5" }
] as const;

const FRAMED_MULTI_CANDIDATE_CONTEXTS = [
  {
    id: "steel_independent",
    outputs: ["Rw"] as const,
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
    outputs: ["R'w"] as const,
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

const FRAMED_MULTI_CANDIDATE_BOARDS = [
  [{ materialId: "gypsum", thicknessMm: "12.5" }],
  [
    { materialId: "gypsum", thicknessMm: "12.5" },
    { materialId: "gypsum", thicknessMm: "12.5" }
  ],
  [
    { materialId: "gypsum_board", thicknessMm: "12.5" },
    { materialId: "diamond_board", thicknessMm: "12.5" }
  ],
  [
    { materialId: "diamond_board", thicknessMm: "12.5" },
    { materialId: "diamond_board", thicknessMm: "12.5" }
  ]
] as const;

const FRAMED_MULTI_CANDIDATE_CAVITIES = [
  [{ materialId: "air_gap", thicknessMm: "50" }],
  [{ materialId: "rockwool", thicknessMm: "50" }],
  [{ materialId: "glasswool", thicknessMm: "70" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "rockwool", thicknessMm: "25" }
  ],
  [
    { materialId: "rockwool", thicknessMm: "25" },
    { materialId: "air_gap", thicknessMm: "25" }
  ]
] as const;

function buildRows(
  stack: readonly { materialId: string; thicknessMm: string }[],
  prefix: string
) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${prefix}-${index + 1}`
  }));
}

function evaluateDynamicWallPair(
  stack: readonly { materialId: string; thicknessMm: string }[],
  id: string
) {
  const rows = buildRows(stack, id);
  const lab = evaluateScenario({
    airborneContext: LAB_CONTEXT,
    calculator: "dynamic",
    id: `${id}-lab`,
    name: `${id} lab`,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: LAB_OUTPUTS
  });
  const field = evaluateScenario({
    airborneContext: BUILDING_CONTEXT,
    calculator: "dynamic",
    id: `${id}-field`,
    name: `${id} field`,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: FIELD_OUTPUTS
  });

  expect(lab.result?.ok, `${id} lab should stay ok`).toBe(true);
  expect(field.result?.ok, `${id} field should stay ok`).toBe(true);

  const warnings = field.result!.warnings.filter((warning: string) =>
    /boundary|hold|order-sensitive|triple-leaf|excluded from the dynamic airborne span/i.test(warning)
  );

  return {
    dnTw: field.result!.metrics.estimatedDnTwDb,
    family:
      field.result!.dynamicAirborneTrace?.detectedFamily ??
      lab.result!.dynamicAirborneTrace?.detectedFamily ??
      null,
    flagged: warnings.length > 0,
    rw: lab.result!.metrics.estimatedRwDb,
    rwPrime: field.result!.metrics.estimatedRwPrimeDb,
    trace: field.result!.dynamicAirborneTrace ?? lab.result!.dynamicAirborneTrace,
    warnings
  };
}

function buildRepresentativeStack(input: {
  board: (typeof REPRESENTATIVE_BOARDS)[number];
  core: (typeof REPRESENTATIVE_CORES)[number] | (typeof NON_AAC_REPRESENTATIVE_CORES)[number];
  prefix: readonly { materialId: string; thicknessMm: string }[];
}) {
  return [
    ...input.prefix,
    input.core,
    { materialId: "air_gap", thicknessMm: "50" },
    input.board
  ] as const;
}

function stackKey(stack: readonly { materialId: string; thicknessMm: string }[]) {
  return stack.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

function swapAdjacent<T>(arr: readonly T[], index: number) {
  const copy = [...arr];
  [copy[index], copy[index + 1]] = [copy[index + 1]!, copy[index]!];
  return copy;
}

describe("dynamic route family boundary scan contracts", () => {
  it("keeps the representative workbench hold corridor on the same defended pairing", () => {
    const hits: Array<{
      conflict: boolean;
      core: string;
      stack: string;
      trace: NonNullable<ReturnType<typeof evaluateDynamicWallPair>["trace"]>;
    }> = [];

    for (const prefix of REPRESENTATIVE_PREFIXES) {
      for (const core of REPRESENTATIVE_CORES) {
        for (const board of REPRESENTATIVE_BOARDS) {
          const stack = buildRepresentativeStack({ board, core, prefix });
          const result = evaluateDynamicWallPair(stack, `scan-${hits.length}`);

          if (result.trace?.strategy.includes("family_boundary_hold")) {
            hits.push({
              conflict: Boolean(
                (result.trace.runnerUpFamilyScore ?? -Infinity) > (result.trace.selectedFamilyScore ?? Infinity) + 1e-9
              ),
              core: `${core.materialId}:${core.thicknessMm}`,
              stack: stackKey(stack),
              trace: result.trace
            });
          }
        }
      }
    }

    const holdCountsByCore = new Map<string, number>();
    const conflictCountsByCore = new Map<string, number>();

    for (const hit of hits) {
      holdCountsByCore.set(hit.core, (holdCountsByCore.get(hit.core) ?? 0) + 1);
      if (hit.conflict) {
        conflictCountsByCore.set(hit.core, (conflictCountsByCore.get(hit.core) ?? 0) + 1);
      }

      expect(hit.trace.detectedFamily, hit.stack).toBe("lined_massive_wall");
      expect(hit.trace.runnerUpFamily, hit.stack).toBe("double_leaf");
      expect(hit.trace.familyDecisionMultiplePlausibleFamilies, hit.stack).toBeUndefined();
      expect(hit.trace.familyDecisionSelectedBelowRunnerUp, hit.stack).toBe(hit.conflict || undefined);
      expect(hit.trace.familyBoundaryHoldApplied, hit.stack).toBe(true);
      expect(hit.trace.strategy.includes("family_boundary_hold"), hit.stack).toBe(true);
      expect(hit.trace.familyDecisionClass === "ambiguous" || hit.trace.familyDecisionClass === "narrow", hit.stack).toBe(
        true
      );
      expect(hit.trace.familyBoundaryHoldRunnerUpMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldBoundaryCeilingDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldCurrentMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldTargetMetricDb, hit.stack).toBeTypeOf("number");
      expect(hit.trace.familyBoundaryHoldAllowedLeadDb, hit.stack).toBeTypeOf("number");
    }

    expect(hits).toHaveLength(40);
    expect(Object.fromEntries([...holdCountsByCore.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 16,
      "ytong_aac_d700:120": 8,
      "ytong_g5_800:100": 16
    });
    expect(Object.fromEntries([...conflictCountsByCore.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "ytong_aac_d700:100": 12
    });
  }, ROUTE_SCAN_TIMEOUT_MS);

  it("keeps representative non-AAC workbench rows outside boundary-hold diagnostics while preserving trim visibility", () => {
    const boundaryHits: Array<{
      stack: string;
      warnings: readonly string[];
    }> = [];
    const familyCounts = new Map<string, number>();
    const trimCounts = new Map<string, number>();

    for (const prefix of REPRESENTATIVE_PREFIXES) {
      for (const core of NON_AAC_REPRESENTATIVE_CORES) {
        for (const board of REPRESENTATIVE_BOARDS) {
          const stack = buildRepresentativeStack({ board, core, prefix });
          const result = evaluateDynamicWallPair(stack, `non-aac-${stackKey(stack)}`);
          const trace = result.trace;
          const trimKey = `${trace?.trimmedOuterLeadingCount ?? 0}/${trace?.trimmedOuterTrailingCount ?? 0}`;
          const boundaryWarnings = result.warnings.filter((warning: string) =>
            /boundary between|family-boundary hold|still somewhat close/i.test(warning)
          );

          familyCounts.set(result.family ?? "none", (familyCounts.get(result.family ?? "none") ?? 0) + 1);
          trimCounts.set(trimKey, (trimCounts.get(trimKey) ?? 0) + 1);

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
              warnings: boundaryWarnings
            });
          }
        }
      }
    }

    expect(boundaryHits).toEqual([]);
    expect(Object.fromEntries([...familyCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      lined_massive_wall: 144
    });
    expect(Object.fromEntries([...trimCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))).toEqual({
      "0/0": 36,
      "1/0": 72,
      "2/0": 36
    });
  }, ROUTE_SCAN_TIMEOUT_MS);

  it("finds no silent >=8 dB adjacent-swap jumps across the representative workbench hold palette", () => {
    const offenders: Array<{
      baseStack: string;
      changedStack: string;
      delta: number;
      swapIndex: number;
    }> = [];

    for (const prefix of REPRESENTATIVE_PREFIXES) {
      for (const core of REPRESENTATIVE_CORES) {
        for (const board of REPRESENTATIVE_BOARDS) {
          const stack = buildRepresentativeStack({ board, core, prefix });
          const base = evaluateDynamicWallPair(stack, `swap-base-${stackKey(stack)}`);

          for (let swapIndex = 0; swapIndex < stack.length - 1; swapIndex += 1) {
            const changedStack = swapAdjacent(stack, swapIndex);
            const changed = evaluateDynamicWallPair(changedStack, `swap-${swapIndex}-${stackKey(changedStack)}`);
            const delta = Math.max(
              Math.abs((changed.rw ?? 0) - (base.rw ?? 0)),
              Math.abs((changed.rwPrime ?? 0) - (base.rwPrime ?? 0)),
              Math.abs((changed.dnTw ?? 0) - (base.dnTw ?? 0))
            );

            if (delta >= 8 && !base.flagged && !changed.flagged) {
              offenders.push({
                baseStack: stackKey(stack),
                changedStack: stackKey(changedStack),
                delta,
                swapIndex
              });
            }
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  }, ROUTE_SCAN_TIMEOUT_MS);

  it("finds no silent >=8 dB adjacent-swap jumps across the representative non-AAC workbench palette", () => {
    const offenders: Array<{
      baseStack: string;
      changedStack: string;
      delta: number;
      swapIndex: number;
    }> = [];

    for (const prefix of REPRESENTATIVE_PREFIXES) {
      for (const core of NON_AAC_REPRESENTATIVE_CORES) {
        for (const board of REPRESENTATIVE_BOARDS) {
          const stack = buildRepresentativeStack({ board, core, prefix });
          const base = evaluateDynamicWallPair(stack, `non-aac-swap-base-${stackKey(stack)}`);

          for (let swapIndex = 0; swapIndex < stack.length - 1; swapIndex += 1) {
            const changedStack = swapAdjacent(stack, swapIndex);
            const changed = evaluateDynamicWallPair(
              changedStack,
              `non-aac-swap-${swapIndex}-${stackKey(changedStack)}`
            );
            const delta = Math.max(
              Math.abs((changed.rw ?? 0) - (base.rw ?? 0)),
              Math.abs((changed.rwPrime ?? 0) - (base.rwPrime ?? 0)),
              Math.abs((changed.dnTw ?? 0) - (base.dnTw ?? 0))
            );

            if (delta >= 8 && !base.flagged && !changed.flagged) {
              offenders.push({
                baseStack: stackKey(stack),
                changedStack: stackKey(changedStack),
                delta,
                swapIndex
              });
            }
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  }, ROUTE_SCAN_TIMEOUT_MS);

  it("finds no multi-candidate boundary surface across the representative framed workbench palette yet", () => {
    const flaggedHits: Array<{
      context: string;
      reason: string;
      stack: string;
    }> = [];
    const familyCounts = new Map<string, number>();

    for (const context of FRAMED_MULTI_CANDIDATE_CONTEXTS) {
      for (const leftLeaf of FRAMED_MULTI_CANDIDATE_BOARDS) {
        for (const cavity of FRAMED_MULTI_CANDIDATE_CAVITIES) {
          for (const rightLeaf of FRAMED_MULTI_CANDIDATE_BOARDS) {
            const stack = [...leftLeaf, ...cavity, ...rightLeaf] as const;
            const rows = buildRows(stack, `${context.id}-${stackKey(stack)}`);
            const result = evaluateScenario({
              airborneContext: context.airborneContext,
              calculator: "dynamic",
              id: context.id,
              name: context.id,
              rows,
              source: "current",
              studyMode: "wall",
              targetOutputs: [...context.outputs]
            });

            expect(result.result?.ok, `${context.id} ${stackKey(stack)} should stay ok`).toBe(true);

            const trace = result.result?.dynamicAirborneTrace;
            familyCounts.set(
              `${context.id}:${trace?.detectedFamily ?? "none"}`,
              (familyCounts.get(`${context.id}:${trace?.detectedFamily ?? "none"}`) ?? 0) + 1
            );

            if (trace?.familyDecisionMultiplePlausibleFamilies) {
              flaggedHits.push({
                context: context.id,
                reason: "multiple_plausible",
                stack: stackKey(stack)
              });
            }

            if (trace?.familyDecisionSelectedBelowRunnerUp) {
              flaggedHits.push({
                context: context.id,
                reason: "selection_conflict",
                stack: stackKey(stack)
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
  }, ROUTE_SCAN_TIMEOUT_MS);
});
