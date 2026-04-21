// Masonry calibration lane carved out of `dynamic-airborne.ts`
// during `dynamic_airborne_split_refactor_v1` commit 7. This module
// owns the family-specific "target Rw" estimators that shift the
// generic single-leaf masonry dynamic curve onto the corridor
// measured by the corresponding manufacturer / lab dataset.
//
// Each function follows the same shape:
//   (layers, topology, [screeningEstimatedRwDb,] currentRw, family)
//     → { notes, shiftDb, strategySuffix, targetRw }
//
// All share the `masonry_nonhomogeneous` / `rigid_massive_wall`
// family gate, the family-detection material predicates, and the
// `interpolateLinear` helper. Carving the estimators together avoids
// fragmenting the calibration surface across multiple commits —
// they do not call each other.
//
// This first commit lifts the two generic masonry estimators
// (`estimateAacMassiveTargetRw`, `estimateSilicateMasonryTargetRw`).
// The material-specific estimators (Ytong / Porotherm / HELUZ /
// Celcon / unfinished aircrete) move in follow-up commits.

import type { DynamicAirborneFamily, ResolvedLayer } from "@dynecho/shared";

import {
  classifyLayerRole,
  materialText,
  summarizeAirborneTopology
} from "./airborne-topology";
import { interpolateLinear, interpolateRwSeries } from "./dynamic-airborne-helpers";
import {
  isAacLikeLayer,
  isCelconAircreteLayer,
  isHeluzClayLayer,
  isPlasterLikeLayer,
  isPorothermClayLayer,
  isSilicateMasonryLayer,
  isYtongCellenbetonblokBuildUp,
  isYtongCellenbetonblokLayer,
  isYtongMassiefG2300Layer,
  isYtongSeparatiePaneelBuildUp,
  isYtongSeparatiePaneelLayer
} from "./dynamic-airborne-family-detection";
import { clamp, ksRound1 } from "./math";

export function estimateAacMassiveTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  screeningEstimatedRwDb: number,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];
  const text = layers.map(materialText).join(" ");

  if (
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport ||
    !/aac|gazbeton|ytong|aircrete|autoclaved/.test(text)
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  let offsetDb = 0;

  if (surfaceMassKgM2 <= 86.8) {
    offsetDb = -2.5;
  } else if (surfaceMassKgM2 < 121.5) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 86.8, -2.5, 121.5, 0);
  } else if (surfaceMassKgM2 < 139) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 121.5, 0, 139, 2);
  } else if (surfaceMassKgM2 < 174) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 139, 2, 174, 3);
  } else {
    offsetDb = 3;
  }

  const targetRw = ksRound1(clamp(screeningEstimatedRwDb + offsetDb, 28, 68));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official AAC masonry references moved the ${family === "masonry_nonhomogeneous" ? "single-leaf masonry" : "rigid-wall"} lane onto a low-density Ytong/Xella corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "aac_massive_calibration",
    targetRw
  };
}

export function estimateSilicateMasonryTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (
    solidLayers.length === 0 ||
    solidLayers.some((layer) => isPlasterLikeLayer(layer)) ||
    !solidLayers.every((layer) => isSilicateMasonryLayer(layer))
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  const points = [
    { surfaceMassKgM2: 175.3, rw: 43 },
    { surfaceMassKgM2: 262.9, rw: 50 },
    { surfaceMassKgM2: 306.7, rw: 52 },
    { surfaceMassKgM2: 375.1, rw: 55 }
  ] as const;

  let targetRw: number = points[0].rw;
  if (surfaceMassKgM2 <= points[0].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      120,
      39,
      points[0].surfaceMassKgM2,
      points[0].rw
    );
  } else if (surfaceMassKgM2 < points[1].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[0].surfaceMassKgM2,
      points[0].rw,
      points[1].surfaceMassKgM2,
      points[1].rw
    );
  } else if (surfaceMassKgM2 < points[2].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[1].surfaceMassKgM2,
      points[1].rw,
      points[2].surfaceMassKgM2,
      points[2].rw
    );
  } else if (surfaceMassKgM2 < points[3].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[2].surfaceMassKgM2,
      points[2].rw,
      points[3].surfaceMassKgM2,
      points[3].rw
    );
  } else {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[3].surfaceMassKgM2,
      points[3].rw,
      470,
      59
    );
  }

  targetRw = ksRound1(clamp(targetRw, 39, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Silka references moved the single-leaf silicate masonry lane onto a dense calcium-silicate corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "silicate_masonry_calibration",
    targetRw
  };
}
export function estimateUnfinishedAircreteTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (
    solidLayers.length === 0 ||
    solidLayers.some((layer) => isPlasterLikeLayer(layer)) ||
    !solidLayers.every((layer) => isAacLikeLayer(layer))
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  if (!(surfaceMassKgM2 > 0)) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp((27.7 * Math.log10(surfaceMassKgM2)) - 11.6, 28, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official H+H Celcon unfinished-aircrete guidance moved the bare aircrete lane onto the published mass-law corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "aircrete_unfinished_calibration",
    targetRw
  };
}
export function estimateCelconFinishedAircreteTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isCelconAircreteLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    Math.abs(leftLayer.thicknessMm - 13) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const finishMaterialId = leftLayer.material.id;
  const finishLabel =
    finishMaterialId === "celcon_lwt_plaster"
      ? "13 mm lightweight plaster"
      : finishMaterialId === "celcon_dense_plaster"
        ? "13 mm dense plaster"
        : null;

  const officialRwByFinish: Record<string, Record<string, readonly { thicknessMm: number; rw: number }[]>> = {
    celcon_lwt_plaster: {
      celcon_solar_grade: [
        { thicknessMm: 75, rw: 38.2 },
        { thicknessMm: 100, rw: 40.6 },
        { thicknessMm: 140, rw: 43.8 },
        { thicknessMm: 150, rw: 44.4 },
        { thicknessMm: 215, rw: 48.0 },
        { thicknessMm: 275, rw: 50.6 },
        { thicknessMm: 300, rw: 51.6 },
        { thicknessMm: 355, rw: 53.4 }
      ],
      celcon_standard_grade: [
        { thicknessMm: 75, rw: 40.0 },
        { thicknessMm: 100, rw: 42.6 },
        { thicknessMm: 140, rw: 45.8 },
        { thicknessMm: 150, rw: 46.5 },
        { thicknessMm: 215, rw: 50.3 },
        { thicknessMm: 275, rw: 52.9 },
        { thicknessMm: 300, rw: 53.9 },
        { thicknessMm: 355, rw: 55.7 }
      ],
      celcon_high_strength: [
        { thicknessMm: 75, rw: 41.4 },
        { thicknessMm: 100, rw: 44.1 },
        { thicknessMm: 140, rw: 47.5 },
        { thicknessMm: 150, rw: 48.2 },
        { thicknessMm: 215, rw: 52.0 },
        { thicknessMm: 275, rw: 54.7 },
        { thicknessMm: 300, rw: 55.7 },
        { thicknessMm: 355, rw: 57.6 }
      ]
    },
    celcon_dense_plaster: {
      celcon_solar_grade: [
        { thicknessMm: 75, rw: 42.6 },
        { thicknessMm: 100, rw: 44.4 },
        { thicknessMm: 140, rw: 46.7 },
        { thicknessMm: 150, rw: 47.3 },
        { thicknessMm: 215, rw: 50.2 },
        { thicknessMm: 275, rw: 52.4 },
        { thicknessMm: 300, rw: 53.2 },
        { thicknessMm: 355, rw: 54.8 }
      ],
      celcon_standard_grade: [
        { thicknessMm: 75, rw: 43.9 },
        { thicknessMm: 100, rw: 45.8 },
        { thicknessMm: 140, rw: 48.4 },
        { thicknessMm: 150, rw: 49.0 },
        { thicknessMm: 215, rw: 52.1 },
        { thicknessMm: 275, rw: 54.4 },
        { thicknessMm: 300, rw: 55.3 },
        { thicknessMm: 355, rw: 56.9 }
      ],
      celcon_high_strength: [
        { thicknessMm: 75, rw: 45.0 },
        { thicknessMm: 100, rw: 47.0 },
        { thicknessMm: 140, rw: 49.7 },
        { thicknessMm: 150, rw: 50.3 },
        { thicknessMm: 215, rw: 53.6 },
        { thicknessMm: 275, rw: 56.0 },
        { thicknessMm: 300, rw: 56.9 },
        { thicknessMm: 355, rw: 58.6 }
      ]
    }
  };

  const points = officialRwByFinish[finishMaterialId]?.[coreLayer.material.id];
  if (!finishLabel || !points?.length) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(interpolateRwSeries(coreLayer.thicknessMm, points), 36, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official H+H Celcon finished-aircrete guidance moved the ${finishLabel} lane onto the published ${coreLayer.material.name} corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "celcon_finished_aircrete_calibration",
    targetRw
  };
}
export function estimatePorothermPlasteredTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isPorothermClayLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const finishMaterialId = leftLayer.material.id;
  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  let points: readonly { rw: number; surfaceMassKgM2: number }[] | null = null;
  let finishLabel = "";

  if (finishMaterialId === "dense_plaster") {
    points = [
      { surfaceMassKgM2: 149.0, rw: 43 },
      { surfaceMassKgM2: 172.9, rw: 44 },
      { surfaceMassKgM2: 215.5, rw: 48 }
    ];
    finishLabel = "13 mm dense plaster";
  } else if (finishMaterialId === "lightweight_plaster") {
    points = [
      { surfaceMassKgM2: 118.6, rw: 40 },
      { surfaceMassKgM2: 142.6, rw: 41 },
      { surfaceMassKgM2: 185.1, rw: 46 }
    ];
    finishLabel = "13 mm lightweight plaster";
  }

  if (!points) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  let targetRw = points[0].rw;
  if (surfaceMassKgM2 <= points[0].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      Math.max(points[0].surfaceMassKgM2 - 35, 80),
      points[0].rw - 3,
      points[0].surfaceMassKgM2,
      points[0].rw
    );
  } else if (surfaceMassKgM2 < points[1].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[0].surfaceMassKgM2,
      points[0].rw,
      points[1].surfaceMassKgM2,
      points[1].rw
    );
  } else if (surfaceMassKgM2 < points[2].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[1].surfaceMassKgM2,
      points[1].rw,
      points[2].surfaceMassKgM2,
      points[2].rw
    );
  } else {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[2].surfaceMassKgM2,
      points[2].rw,
      points[2].surfaceMassKgM2 + 60,
      points[2].rw + 4
    );
  }

  targetRw = ksRound1(clamp(targetRw, 36, 58));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Wienerberger Porotherm guidance moved the perforated-clay single-leaf lane onto the published ${finishLabel} declaration corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "porotherm_plastered_calibration",
    targetRw
  };
}

export function estimateHeluzPlasteredClayTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isHeluzClayLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !/^lime_cement_plaster_/.test(leftLayer.material.id)
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const exactTargets: Record<string, { coreThicknessMm: number; finishId: string; finishThicknessMm: number; rw: number }> = {
    heluz_14_brushed: { coreThicknessMm: 140, finishId: "lime_cement_plaster_1300", finishThicknessMm: 15, rw: 41 },
    heluz_aku_115: { coreThicknessMm: 115, finishId: "lime_cement_plaster_1700", finishThicknessMm: 15, rw: 47 },
    heluz_aku_200_p15: { coreThicknessMm: 200, finishId: "lime_cement_plaster_1780", finishThicknessMm: 17, rw: 53 },
    heluz_aku_300_333_p20: { coreThicknessMm: 300, finishId: "lime_cement_plaster_1700", finishThicknessMm: 15, rw: 56 }
  };
  const exactTarget = exactTargets[coreLayer.material.id];

  if (
    !exactTarget ||
    leftLayer.material.id !== exactTarget.finishId ||
    Math.abs(leftLayer.thicknessMm - exactTarget.finishThicknessMm) > 0.6 ||
    Math.abs(coreLayer.thicknessMm - exactTarget.coreThicknessMm) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(exactTarget.rw, 37, 58));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official HELUZ measured lab rows moved the plastered hollow-clay masonry lane onto a HELUZ-specific corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "heluz_plastered_clay_calibration",
    targetRw
  };
}

export function estimateYtongMassiefG2300TargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongMassiefG2300Layer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const points = [
    { thicknessMm: 240, rw: 46 },
    { thicknessMm: 300, rw: 49 },
    { thicknessMm: 365, rw: 51 }
  ] as const;
  let targetRw: number = points[0].rw;

  if (coreLayer.thicknessMm <= points[0].thicknessMm) {
    targetRw = interpolateLinear(coreLayer.thicknessMm, 180, 42, points[0].thicknessMm, points[0].rw);
  } else if (coreLayer.thicknessMm < points[1].thicknessMm) {
    targetRw = interpolateLinear(
      coreLayer.thicknessMm,
      points[0].thicknessMm,
      points[0].rw,
      points[1].thicknessMm,
      points[1].rw
    );
  } else if (coreLayer.thicknessMm < points[2].thicknessMm) {
    targetRw = interpolateLinear(
      coreLayer.thicknessMm,
      points[1].thicknessMm,
      points[1].rw,
      points[2].thicknessMm,
      points[2].rw
    );
  } else {
    targetRw = interpolateLinear(coreLayer.thicknessMm, points[2].thicknessMm, points[2].rw, 420, 52.5);
  }

  targetRw = ksRound1(clamp(targetRw, 42, 53));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Nederland Ytong Massiefblokken guidance moved the low-density AAC thin-plaster lane onto the published G2/300 corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_massief_g2_300_calibration",
    targetRw
  };
}

export function estimateYtongSeparatiePaneelTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongSeparatiePaneelLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const exactTargets: Record<string, readonly { thicknessMm: number; rw: number }[]> = {
    ytong_separatiepaneel_aac_4_600: [
      { thicknessMm: 70, rw: 34 },
      { thicknessMm: 100, rw: 34 }
    ],
    ytong_separatiepaneel_aac_5_750: [{ thicknessMm: 100, rw: 37 }]
  };
  const points = exactTargets[coreLayer.material.id];
  const exactPoint = points?.find((entry) => Math.abs(entry.thicknessMm - coreLayer.thicknessMm) <= 0.6);

  if (!exactPoint) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(exactPoint.rw, 32, 40));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Nederland separatiepanelen guidance moved the prefab AAC thin-plaster lane onto the published ${coreLayer.material.name} corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_separatiepanelen_calibration",
    targetRw
  };
}

export function estimateYtongCellenbetonblokTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongCellenbetonblokLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const officialRwByCore: Record<string, readonly { thicknessMm: number; rw: number }[]> = {
    ytong_cellenbetonblok_g4_600: [
      { thicknessMm: 70, rw: 33 },
      { thicknessMm: 100, rw: 37 },
      { thicknessMm: 150, rw: 43 },
      { thicknessMm: 200, rw: 44 },
      { thicknessMm: 240, rw: 48 },
      { thicknessMm: 300, rw: 49 }
    ],
    ytong_cellenbetonblok_g5_800: [{ thicknessMm: 100, rw: 39 }]
  };

  const points = officialRwByCore[coreLayer.material.id];
  if (!points?.length) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw =
    points.length === 1
      ? points[0]!.rw
      : interpolateRwSeries(coreLayer.thicknessMm, points);
  const roundedTargetRw = ksRound1(clamp(targetRw, 32, 50));
  const shiftDb = ksRound1(roundedTargetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: roundedTargetRw
    };
  }

  notes.push(
    `Official Xella Nederland cellenbetonblokken guidance moved the AAC block thin-plaster lane onto the published ${coreLayer.material.name} corridor (target Rw ${roundedTargetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_cellenbetonblokken_calibration",
    targetRw: roundedTargetRw
  };
}
