const CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM = 0.25;

export const TUAS_R6A_CEILING_BOARD_THICKNESS_SCHEDULE_MM = [13, 13, 15, 15, 15, 15] as const;

type ThicknessLikeLayer = {
  material: {
    id: string;
  };
  thicknessMm?: number;
};

type ThicknessRun = {
  totalThicknessMm: number;
  unitThicknessMm: number;
};

const NOMINAL_CEILING_BOARD_THICKNESSES_BY_MATERIAL: Record<string, readonly number[]> = {
  acoustic_gypsum_board: [12.5, 13, 15],
  firestop_board: [15, 16],
  gypsum_board: [12.5, 13, 15],
  impactstop_board: [15, 16],
  nrc_type_c_gypsum_board: [12.5, 13, 15]
};

const DEFAULT_NOMINAL_CEILING_BOARD_THICKNESSES_MM = [12.5, 13, 15, 16] as const;

function getNominalCeilingBoardThicknessesMm(materialId: string | undefined): readonly number[] {
  return materialId ? NOMINAL_CEILING_BOARD_THICKNESSES_BY_MATERIAL[materialId] ?? DEFAULT_NOMINAL_CEILING_BOARD_THICKNESSES_MM
    : DEFAULT_NOMINAL_CEILING_BOARD_THICKNESSES_MM;
}

function allSameMaterial(layers: readonly ThicknessLikeLayer[]): boolean {
  const materialId = layers[0]?.material.id;

  return Boolean(materialId) && layers.every((layer) => layer.material.id === materialId);
}

function isUniformBoardSchedule(thicknessesMm: readonly number[]): boolean {
  const firstThicknessMm = thicknessesMm[0];

  return (
    typeof firstThicknessMm === "number" &&
    firstThicknessMm >= 10 &&
    thicknessesMm.every(
      (thicknessMm) => Math.abs(thicknessMm - firstThicknessMm) <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM
    )
  );
}

function toThicknessRuns(expectedScheduleMm: readonly number[]): ThicknessRun[] {
  const runs: ThicknessRun[] = [];

  for (const thicknessMm of expectedScheduleMm) {
    const currentRun = runs.at(-1);

    if (currentRun && Math.abs(currentRun.unitThicknessMm - thicknessMm) <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
      currentRun.totalThicknessMm += thicknessMm;
      continue;
    }

    runs.push({
      totalThicknessMm: thicknessMm,
      unitThicknessMm: thicknessMm
    });
  }

  return runs;
}

function matchesOrderedPackedThicknessRuns(
  actualThicknessesMm: readonly number[],
  expectedScheduleMm: readonly number[]
): boolean {
  const runs = toThicknessRuns(expectedScheduleMm);
  if (runs.length === 0) {
    return false;
  }

  let runIndex = 0;
  let remainingRunThicknessMm = runs[0]?.totalThicknessMm ?? 0;

  for (const actualThicknessMm of actualThicknessesMm) {
    if (!(typeof actualThicknessMm === "number" && actualThicknessMm > 0)) {
      return false;
    }

    let remainingActualThicknessMm = actualThicknessMm;

    while (remainingActualThicknessMm > CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
      const currentRun = runs[runIndex];
      if (!currentRun || remainingRunThicknessMm <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
        return false;
      }

      if (remainingActualThicknessMm > remainingRunThicknessMm + CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
        return false;
      }

      const packedBoardCount = Math.round(remainingActualThicknessMm / currentRun.unitThicknessMm);
      if (
        packedBoardCount <= 0 ||
        Math.abs(packedBoardCount * currentRun.unitThicknessMm - remainingActualThicknessMm) > CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM
      ) {
        return false;
      }

      remainingRunThicknessMm -= remainingActualThicknessMm;
      remainingActualThicknessMm = 0;

      if (remainingRunThicknessMm <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
        runIndex += 1;
        remainingRunThicknessMm = runs[runIndex]?.totalThicknessMm ?? 0;
      }
    }
  }

  return (
    runIndex === runs.length ||
    (runIndex === runs.length - 1 && remainingRunThicknessMm <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM)
  );
}

export function matchesPackedThicknessSchedule(
  actualThicknessesMm: readonly number[],
  expectedScheduleMm: readonly number[]
): boolean {
  return (
    actualThicknessesMm.length > 0 &&
    expectedScheduleMm.length > 0 &&
    (
      matchesOrderedPackedThicknessRuns(actualThicknessesMm, expectedScheduleMm) ||
      matchesOrderedPackedThicknessRuns(actualThicknessesMm, [...expectedScheduleMm].reverse())
    )
  );
}

export function inferScheduleEquivalentCeilingBoardThicknesses(
  layers: readonly ThicknessLikeLayer[]
): number[] | null {
  if (layers.length === 0 || !allSameMaterial(layers)) {
    return null;
  }

  const thicknessesMm = layers.map((layer) => layer.thicknessMm);
  if (thicknessesMm.some((thicknessMm) => !(typeof thicknessMm === "number" && thicknessMm > 0))) {
    return null;
  }

  const actualThicknessesMm = thicknessesMm as number[];
  if (isUniformBoardSchedule(actualThicknessesMm)) {
    return [...actualThicknessesMm];
  }

  const totalThicknessMm = actualThicknessesMm.reduce((sum, thicknessMm) => sum + thicknessMm, 0);
  const maxPieceThicknessMm = Math.max(...actualThicknessesMm);
  const nominalThicknessesMm = getNominalCeilingBoardThicknessesMm(layers[0]?.material.id);
  let best:
    | {
        boardCount: number;
        boardThicknessMm: number;
        nominalDeltaMm: number;
      }
    | null = null;

  for (let boardCount = 1; boardCount <= layers.length; boardCount += 1) {
    const boardThicknessMm = totalThicknessMm / boardCount;
    if (boardThicknessMm + CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM < maxPieceThicknessMm) {
      continue;
    }

    const nominalDeltaMm = Math.min(
      ...nominalThicknessesMm.map((nominalThicknessMm) => Math.abs(boardThicknessMm - nominalThicknessMm))
    );
    if (nominalDeltaMm > CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM) {
      continue;
    }

    if (
      !best ||
      nominalDeltaMm < best.nominalDeltaMm ||
      (Math.abs(nominalDeltaMm - best.nominalDeltaMm) <= CEILING_BOARD_SCHEDULE_PACK_TOLERANCE_MM &&
        boardThicknessMm > best.boardThicknessMm)
    ) {
      best = {
        boardCount,
        boardThicknessMm,
        nominalDeltaMm
      };
    }
  }

  if (!best) {
    return null;
  }

  return Array.from(
    { length: best.boardCount },
    () => Math.round(best.boardThicknessMm * 1000) / 1000
  );
}

export function layersMatchPackedThicknessSchedule(
  layers: readonly ThicknessLikeLayer[],
  expectedScheduleMm: readonly number[],
  materialId?: string
): boolean {
  if (layers.length === 0) {
    return false;
  }

  const firstMaterialId = layers[0]?.material.id;
  if (!firstMaterialId) {
    return false;
  }

  if (materialId && firstMaterialId !== materialId) {
    return false;
  }

  if (!layers.every((layer) => layer.material.id === firstMaterialId)) {
    return false;
  }

  const actualThicknessesMm = layers.map((layer) => layer.thicknessMm);
  if (actualThicknessesMm.some((thicknessMm) => !(typeof thicknessMm === "number" && thicknessMm > 0))) {
    return false;
  }

  return matchesPackedThicknessSchedule(actualThicknessesMm as number[], expectedScheduleMm);
}
