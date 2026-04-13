import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

export const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

export const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

// These CPU-heavy stress scans slow down under full-suite worker contention.
export const DEEP_HYBRID_TIMEOUT_MS = 60_000;
export const DEEP_HYBRID_SWAP_TIMEOUT_MS = 90_000;
export const DEEP_HYBRID_RUNNER_YIELD_INTERVAL = 50;

export function yieldToVitestWorker() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export const DEEP_HYBRID_PREFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "rockwool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "rockwool", thicknessMm: 25 }
  ]
] as const;

export const DEEP_HYBRID_SUFFIXES: readonly (readonly LayerInput[])[] = [
  [],
  [{ materialId: "glasswool", thicknessMm: 25 }],
  [{ materialId: "air_gap", thicknessMm: 25 }],
  [
    { materialId: "air_gap", thicknessMm: 25 },
    { materialId: "glasswool", thicknessMm: 25 }
  ]
] as const;

export const DEEP_HYBRID_CAVITY_PACKS: readonly (readonly LayerInput[])[] = [
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

export const DEEP_HYBRID_CORES = [
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "ytong_aac_d700", thicknessMm: 120 },
  { materialId: "ytong_g5_800", thicknessMm: 100 },
  { materialId: "porotherm_pls_140", thicknessMm: 140 },
  { materialId: "silka_cs_block", thicknessMm: 150 },
  { materialId: "concrete", thicknessMm: 120 }
] as const;

export const BOARDS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "diamond_board", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 },
  { materialId: "security_board", thicknessMm: 12.5 }
] as const;

export const FAST_BOARD_PAIR = [BOARDS[0], BOARDS[1]] as const;
export const SLOW_BOARD_PAIR = [BOARDS[2], BOARDS[3]] as const;

export type DeepHybridCore = (typeof DEEP_HYBRID_CORES)[number];
export type DeepHybridBoard = (typeof BOARDS)[number];
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
    boards: FAST_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[3]] as const,
    label: `${DEEP_HYBRID_CORES[3].materialId}:${DEEP_HYBRID_CORES[3].thicknessMm}:boards-a`
  },
  {
    boards: SLOW_BOARD_PAIR,
    cores: [DEEP_HYBRID_CORES[3]] as const,
    label: `${DEEP_HYBRID_CORES[3].materialId}:${DEEP_HYBRID_CORES[3].thicknessMm}:boards-b`
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

export function stackKey(layers: readonly LayerInput[]) {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}

export function buildDeepHybridStack(input: {
  board: DeepHybridBoard;
  cavityPack: readonly LayerInput[];
  core: DeepHybridCore;
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

function swapAdjacent(stack: readonly LayerInput[], leftIndex: number) {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
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
      targetOutputs: ["DnT,w"]
    });

    const snapshot = {
      dnTw: field.metrics.estimatedDnTwDb,
      flagged: field.warnings.some((warning: string) =>
        /boundary|hold|order-sensitive|triple-leaf|excluded from the dynamic airborne span/i.test(warning)
      ),
      rw: lab.metrics.estimatedRwDb
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
              if (comparisonCount % DEEP_HYBRID_RUNNER_YIELD_INTERVAL === 0) {
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
