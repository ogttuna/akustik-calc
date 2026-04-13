import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { expect } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

export const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

export const FIELD_TRACE_OUTPUTS: readonly RequestedOutputId[] = ["DnT,w"];
export const ROUTE_DEEP_HYBRID_TIMEOUT_MS = 40_000;
export const ROUTE_DEEP_HYBRID_SWAP_TIMEOUT_MS = 45_000;
export const ROUTE_DEEP_HYBRID_RUNNER_YIELD_INTERVAL = 50;

export function yieldToVitestWorker() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export const DEEP_HYBRID_PREFIXES = [
  [],
  [{ materialId: "rockwool", thicknessMm: "25" }],
  [{ materialId: "air_gap", thicknessMm: "25" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "rockwool", thicknessMm: "25" }
  ]
] as const;

export const DEEP_HYBRID_SUFFIXES = [
  [],
  [{ materialId: "glasswool", thicknessMm: "25" }],
  [{ materialId: "air_gap", thicknessMm: "25" }],
  [
    { materialId: "air_gap", thicknessMm: "25" },
    { materialId: "glasswool", thicknessMm: "25" }
  ]
] as const;

export const DEEP_HYBRID_CAVITY_PACKS = [
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

export const DEEP_HYBRID_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "ytong_aac_d700", thicknessMm: "120" },
  { materialId: "ytong_g5_800", thicknessMm: "100" },
  { materialId: "porotherm_pls_140", thicknessMm: "140" },
  { materialId: "silka_cs_block", thicknessMm: "150" },
  { materialId: "concrete", thicknessMm: "120" }
] as const;

export const BOARDS = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "diamond_board", thicknessMm: "12.5" },
  { materialId: "firestop_board", thicknessMm: "15" },
  { materialId: "security_board", thicknessMm: "12.5" }
] as const;

const FAST_BOARD_PAIR = [BOARDS[0], BOARDS[1]] as const;
const SLOW_BOARD_PAIR = [BOARDS[2], BOARDS[3]] as const;

export type DeepHybridCore = (typeof DEEP_HYBRID_CORES)[number];
export type DeepHybridBoard = (typeof BOARDS)[number];
export type DeepHybridRouteLayer = { materialId: string; thicknessMm: string };
export type DeepHybridSwapCohort = {
  boards: readonly DeepHybridBoard[];
  cores: readonly DeepHybridCore[];
  label: string;
};

export const DEEP_HYBRID_AAC_SWAP_SCAN_COHORTS: readonly DeepHybridSwapCohort[] = [
  {
    boards: BOARDS,
    cores: [DEEP_HYBRID_CORES[0]] as const,
    label: `${DEEP_HYBRID_CORES[0].materialId}:${DEEP_HYBRID_CORES[0].thicknessMm}`
  },
  {
    boards: FAST_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[1]] as const,
    label: `${DEEP_HYBRID_CORES[1].materialId}:${DEEP_HYBRID_CORES[1].thicknessMm}:boards-a`
  },
  {
    boards: SLOW_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[1]] as const,
    label: `${DEEP_HYBRID_CORES[1].materialId}:${DEEP_HYBRID_CORES[1].thicknessMm}:boards-b`
  },
  {
    boards: FAST_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[2]] as const,
    label: `${DEEP_HYBRID_CORES[2].materialId}:${DEEP_HYBRID_CORES[2].thicknessMm}:boards-a`
  },
  {
    boards: SLOW_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[2]] as const,
    label: `${DEEP_HYBRID_CORES[2].materialId}:${DEEP_HYBRID_CORES[2].thicknessMm}:boards-b`
  }
] as const;

export const DEEP_HYBRID_AAC_D700_SWAP_SCAN_COHORTS = DEEP_HYBRID_AAC_SWAP_SCAN_COHORTS.slice(0, 3);
export const DEEP_HYBRID_AAC_G5_SWAP_SCAN_COHORTS = DEEP_HYBRID_AAC_SWAP_SCAN_COHORTS.slice(3);
export const DEEP_HYBRID_AAC_D700_100_SWAP_SCAN_COHORTS: readonly DeepHybridSwapCohort[] = [
  {
    boards: FAST_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[0]] as const,
    label: `${DEEP_HYBRID_CORES[0].materialId}:${DEEP_HYBRID_CORES[0].thicknessMm}:boards-a`
  },
  {
    boards: SLOW_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[0]] as const,
    label: `${DEEP_HYBRID_CORES[0].materialId}:${DEEP_HYBRID_CORES[0].thicknessMm}:boards-b`
  }
] as const;
export const DEEP_HYBRID_AAC_D700_120_SWAP_SCAN_COHORTS = DEEP_HYBRID_AAC_D700_SWAP_SCAN_COHORTS.slice(1);

export const DEEP_HYBRID_NON_AAC_SWAP_SCAN_COHORTS: readonly DeepHybridSwapCohort[] = [
  {
    boards: BOARDS,
    cores: [DEEP_HYBRID_CORES[3]] as const,
    label: `${DEEP_HYBRID_CORES[3].materialId}:${DEEP_HYBRID_CORES[3].thicknessMm}`
  },
  {
    boards: BOARDS,
    cores: [DEEP_HYBRID_CORES[4]] as const,
    label: `${DEEP_HYBRID_CORES[4].materialId}:${DEEP_HYBRID_CORES[4].thicknessMm}`
  },
  {
    boards: BOARDS,
    cores: [DEEP_HYBRID_CORES[5]] as const,
    label: `${DEEP_HYBRID_CORES[5].materialId}:${DEEP_HYBRID_CORES[5].thicknessMm}`
  }
] as const;

export function buildRows(stack: readonly DeepHybridRouteLayer[], id: string) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${id}-${index + 1}`
  }));
}

export function evaluateDynamicWallField(stack: readonly DeepHybridRouteLayer[], id: string) {
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

export function buildDeepHybridStack(input: {
  board: DeepHybridBoard;
  cavityPack: readonly DeepHybridRouteLayer[];
  core: DeepHybridCore;
  prefix: readonly DeepHybridRouteLayer[];
  suffix: readonly DeepHybridRouteLayer[];
}) {
  return [
    ...input.prefix,
    input.core,
    ...input.cavityPack,
    input.board,
    ...input.suffix
  ] as const;
}

export function stackKey(stack: readonly DeepHybridRouteLayer[]) {
  return stack.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

function swapAdjacent<T>(arr: readonly T[], index: number) {
  const copy = [...arr];
  [copy[index], copy[index + 1]] = [copy[index + 1]!, copy[index]!];
  return copy;
}

export function buildSnapshotReader() {
  const cache = new Map<
    string,
    {
      dnTw: number | null | undefined;
      flagged: boolean;
      rw: number | null | undefined;
    }
  >();

  return (stack: readonly DeepHybridRouteLayer[]) => {
    const key = stackKey(stack);
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    const id = `deep-hybrid-swap-${cache.size + 1}`;
    const rows = buildRows(stack, id);
    const lab = evaluateScenario({
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      id: `${id}-lab`,
      name: `${id} lab`,
      rows,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["Rw"]
    });
    const field = evaluateScenario({
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      id: `${id}-field`,
      name: `${id} field`,
      rows,
      source: "current",
      studyMode: "wall",
      targetOutputs: FIELD_TRACE_OUTPUTS
    });

    expect(lab.result?.ok, `${id} lab should stay ok`).toBe(true);
    expect(field.result?.ok, `${id} field should stay ok`).toBe(true);

    const snapshot = {
      dnTw: field.result?.metrics.estimatedDnTwDb,
      flagged: (field.result?.warnings ?? []).some((warning: string) =>
        /boundary|hold|order-sensitive|triple-leaf|excluded from the dynamic airborne span/i.test(warning)
      ),
      rw: lab.result?.metrics.estimatedRwDb
    };

    cache.set(key, snapshot);
    return snapshot;
  };
}

export async function collectSilentSwapOffenders(
  readSnapshot: ReturnType<typeof buildSnapshotReader>,
  cohort: DeepHybridSwapCohort
) {
  const offenders: Array<{
    baseStack: string;
    changedStack: string;
    delta: number;
    swapIndex: number;
  }> = [];
  let comparisonCount = 0;

  for (const prefix of DEEP_HYBRID_PREFIXES) {
    for (const suffix of DEEP_HYBRID_SUFFIXES) {
      for (const cavityPack of DEEP_HYBRID_CAVITY_PACKS) {
        for (const core of cohort.cores) {
          for (const board of cohort.boards) {
            const stack = buildDeepHybridStack({
              board,
              cavityPack,
              core,
              prefix,
              suffix
            });
            const base = readSnapshot(stack);

            for (let swapIndex = 0; swapIndex < stack.length - 1; swapIndex += 1) {
              const changedStack = swapAdjacent(stack, swapIndex);
              const changed = readSnapshot(changedStack);
              const delta = Math.max(
                Math.abs((changed.rw ?? 0) - (base.rw ?? 0)),
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

              comparisonCount += 1;
              if (comparisonCount % ROUTE_DEEP_HYBRID_RUNNER_YIELD_INTERVAL === 0) {
                await yieldToVitestWorker();
              }
            }
          }
        }
      }
    }
  }

  return offenders;
}
