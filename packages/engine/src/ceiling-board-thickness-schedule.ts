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
