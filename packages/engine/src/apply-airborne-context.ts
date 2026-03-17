import type {
  AirborneContext,
  AirborneDetectedFamily,
  AirborneFlankingGraph,
  AirborneFlankingPath,
  AirborneOverlay,
  AssemblyRatings,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import { clamp, ksRound1 } from "./math";

type AirborneContextOverlayResult = {
  curve: TransmissionLossCurve;
  overlay: AirborneOverlay | null;
  ratings: AssemblyRatings;
  warnings: string[];
};

type NormalizedAirborneContext = {
  airtightness: NonNullable<AirborneContext["airtightness"]>;
  contextMode: NonNullable<AirborneContext["contextMode"]>;
  electricalBoxes: NonNullable<AirborneContext["electricalBoxes"]>;
  junctionQuality: NonNullable<AirborneContext["junctionQuality"]>;
  penetrationState: NonNullable<AirborneContext["penetrationState"]>;
  perimeterSeal: NonNullable<AirborneContext["perimeterSeal"]>;
  receivingRoomRt60S?: number;
  receivingRoomVolumeM3?: number;
  sharedTrack: NonNullable<AirborneContext["sharedTrack"]>;
};

function normalizeAirborneContext(input: AirborneContext | null | undefined): NormalizedAirborneContext | null {
  if (!input) {
    return null;
  }

  return {
    airtightness: input.airtightness ?? "unknown",
    contextMode: input.contextMode ?? "element_lab",
    electricalBoxes: input.electricalBoxes ?? "unknown",
    junctionQuality: input.junctionQuality ?? "unknown",
    penetrationState: input.penetrationState ?? "unknown",
    perimeterSeal: input.perimeterSeal ?? "unknown",
    receivingRoomRt60S: input.receivingRoomRt60S,
    receivingRoomVolumeM3: input.receivingRoomVolumeM3,
    sharedTrack: input.sharedTrack ?? "unknown"
  };
}

function smoothstep01(value: number): number {
  const t = clamp(value, 0, 1);
  return (t * t) * (3 - (2 * t));
}

function octaveBandWindowWeight(freqHz: number, startHz: number, endHz: number, transitionOctaves = 0.3): number {
  const f = Math.max(freqHz, 1e-9);
  const start = Math.max(startHz, 1e-9);
  const end = Math.max(endHz, start + 1e-6);
  const tr = clamp(transitionOctaves, 0.05, 1.5);
  const left = smoothstep01((Math.log2(f / start) + tr) / (2 * tr));
  const right = smoothstep01((Math.log2(end / f) + tr) / (2 * tr));
  return clamp(Math.min(left, right), 0, 1);
}

function detectAirborneFamily(layers: readonly ResolvedLayer[]): AirborneDetectedFamily {
  const gapCount = layers.filter((layer) => layer.material.category === "gap").length;

  if (gapCount >= 2) {
    return "double_stud_surrogate";
  }

  if (gapCount >= 1) {
    return "cavity_wall_surrogate";
  }

  return "single_leaf_surrogate";
}

function applyAirtightnessPenalty(
  curve: TransmissionLossCurve,
  context: NormalizedAirborneContext
): { leakagePenaltyApplied: boolean; leakagePenaltyDb: number; transmissionLossDb: number[] } {
  let leakagePenaltyDb = context.airtightness === "poor" ? 5 : context.airtightness === "average" ? 2 : 0;

  if (context.perimeterSeal === "average") leakagePenaltyDb += 1.2;
  if (context.perimeterSeal === "poor") leakagePenaltyDb += 2.8;
  if (context.penetrationState === "minor") leakagePenaltyDb += 1;
  if (context.penetrationState === "major") leakagePenaltyDb += 3;
  if (context.electricalBoxes === "separated") leakagePenaltyDb += 0.6;
  if (context.electricalBoxes === "back_to_back") leakagePenaltyDb += 1.6;
  if (context.electricalBoxes === "many") leakagePenaltyDb += 2.3;

  if (!(leakagePenaltyDb > 0)) {
    return {
      leakagePenaltyApplied: false,
      leakagePenaltyDb: 0,
      transmissionLossDb: [...curve.transmissionLossDb]
    };
  }

  const transmissionLossDb = curve.frequenciesHz.map((frequencyHz, index) => {
    const broadband = octaveBandWindowWeight(frequencyHz, 100, 4000, 0.85) * leakagePenaltyDb;
    const lowMidBoost = octaveBandWindowWeight(frequencyHz, 125, 1600, 0.55) * leakagePenaltyDb * 0.35;
    const highBoost = octaveBandWindowWeight(frequencyHz, 800, 4000, 0.4) * leakagePenaltyDb * 0.45;
    return clamp(curve.transmissionLossDb[index] - broadband - lowMidBoost - highBoost, 0, 95);
  });

  return {
    leakagePenaltyApplied: transmissionLossDb.some((value, index) => Math.abs(value - curve.transmissionLossDb[index]) > 1e-6),
    leakagePenaltyDb: ksRound1(leakagePenaltyDb),
    transmissionLossDb
  };
}

function buildJunctionFlankingGraph(
  family: AirborneDetectedFamily,
  context: NormalizedAirborneContext
): AirborneFlankingGraph {
  const paths: AirborneFlankingPath[] = [];

  function addPath(
    id: string,
    label: string,
    severityDb: number,
    note: string,
    category: AirborneFlankingPath["category"]
  ) {
    const normalizedSeverity = ksRound1(Math.max(severityDb, 0));
    paths.push({
      active: normalizedSeverity > 0,
      category,
      id,
      label,
      note,
      severityDb: normalizedSeverity
    });
  }

  let frameCouplingPenaltyDb = 0;

  if (family === "double_stud_surrogate") {
    frameCouplingPenaltyDb = 0.15;
    if (context.sharedTrack === "shared") frameCouplingPenaltyDb += 1.1;
    else if (context.sharedTrack === "unknown") frameCouplingPenaltyDb += 0.4;
    else if (context.sharedTrack === "independent") frameCouplingPenaltyDb = Math.max(frameCouplingPenaltyDb - 0.2, 0);
  } else if (family === "cavity_wall_surrogate") {
    frameCouplingPenaltyDb = 0.8;
    if (context.sharedTrack === "shared") frameCouplingPenaltyDb += 0.8;
    else if (context.sharedTrack === "independent") frameCouplingPenaltyDb = Math.max(frameCouplingPenaltyDb - 0.15, 0);
  }

  addPath(
    "frame_coupling_path",
    family === "double_stud_surrogate" ? "Double-stud frame coupling" : "Frame/stud-borne path",
    frameCouplingPenaltyDb,
    family === "double_stud_surrogate"
      ? "Shared tracks or incomplete frame separation reopen the structural path between the two leaves."
      : "Frame continuity and leaf coupling create an indirect structural path in the field.",
    "connection"
  );

  addPath(
    "junction_quality_path",
    "Junction quality",
    context.junctionQuality === "average" ? 0.5 : context.junctionQuality === "poor" ? 1.4 : 0,
    "Corner and edge workmanship alter indirect transmission and sealing reliability.",
    "junction"
  );
  addPath(
    "shared_track_path",
    "Shared track / common profile",
    context.sharedTrack === "shared" ? 1 : 0,
    "A common profile couples both sides more strongly than independent support lines.",
    "connection"
  );
  addPath(
    "perimeter_path",
    "Perimeter detailing",
    context.perimeterSeal === "average" ? 0.5 : context.perimeterSeal === "poor" ? 1.5 : 0,
    "Perimeter defects add both leakage and indirect transmission risk once the assembly leaves the lab.",
    "boundary"
  );
  addPath(
    "penetration_path",
    "Service penetrations",
    context.penetrationState === "minor" ? 0.9 : context.penetrationState === "major" ? 2 : 0,
    "Service penetrations and imperfect closures open bypass paths across the separator.",
    "aperture"
  );
  addPath(
    "electrical_boxes_path",
    "Electrical boxes",
    context.electricalBoxes === "separated"
      ? 0.4
      : context.electricalBoxes === "back_to_back"
        ? 1.1
        : context.electricalBoxes === "many"
          ? 1.7
          : 0,
    "Back-to-back or repeated boxes lower local integrity and raise field-side bypass risk.",
    "aperture"
  );

  const totalPenaltyDb = clamp(
    paths.reduce((sum, path) => sum + (path.active ? path.severityDb : 0), 0),
    family === "double_stud_surrogate" ? 0.45 : 1.8,
    family === "single_leaf_surrogate" ? 10 : 14.5
  );

  return {
    active: true,
    combineMode: "additive_conservative",
    model: "heuristic_additive_path_graph",
    paths,
    totalPenaltyDb: ksRound1(totalPenaltyDb)
  };
}

function applyFieldContextPenalty(
  curve: TransmissionLossCurve,
  family: AirborneDetectedFamily,
  context: NormalizedAirborneContext
): {
  fieldFlankingPenaltyApplied: boolean;
  fieldFlankingPenaltyDb: number;
  junctionFlankingGraph: AirborneFlankingGraph | null;
  transmissionLossDb: number[];
} {
  if (context.contextMode !== "field_between_rooms" && context.contextMode !== "building_prediction") {
    return {
      fieldFlankingPenaltyApplied: false,
      fieldFlankingPenaltyDb: 0,
      junctionFlankingGraph: null,
      transmissionLossDb: [...curve.transmissionLossDb]
    };
  }

  const junctionFlankingGraph = buildJunctionFlankingGraph(family, context);
  const penaltyDb = junctionFlankingGraph.totalPenaltyDb;

  const transmissionLossDb = curve.frequenciesHz.map((frequencyHz, index) => {
    const broadband = octaveBandWindowWeight(frequencyHz, 125, 3150, 0.85) * penaltyDb;
    const lowMidBoost = octaveBandWindowWeight(frequencyHz, 125, 800, 0.55) * penaltyDb * 0.25;
    return clamp(curve.transmissionLossDb[index] - broadband - lowMidBoost, 0, 95);
  });

  return {
    fieldFlankingPenaltyApplied: transmissionLossDb.some((value, index) => Math.abs(value - curve.transmissionLossDb[index]) > 1e-6),
    fieldFlankingPenaltyDb: ksRound1(penaltyDb),
    junctionFlankingGraph,
    transmissionLossDb
  };
}

export function applyAirborneContextOverlay(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  input: AirborneContext | null | undefined
): AirborneContextOverlayResult {
  const context = normalizeAirborneContext(input);
  const baseRatings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);

  if (!context) {
    return {
      curve,
      overlay: null,
      ratings: baseRatings,
      warnings: []
    };
  }

  const family = detectAirborneFamily(layers);
  const leakage = applyAirtightnessPenalty(curve, context);
  const afterLeakageCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: leakage.transmissionLossDb
  };
  const field = applyFieldContextPenalty(afterLeakageCurve, family, context);
  const finalCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: field.transmissionLossDb
  };
  const finalRatings = buildRatingsFromCurve(finalCurve.frequenciesHz, finalCurve.transmissionLossDb);
  const notes: string[] = [];
  const warnings: string[] = [];

  if (leakage.leakagePenaltyApplied) {
    notes.push(
      `Leakage overlay active: airtightness/perimeter/penetration details subtracted ${leakage.leakagePenaltyDb} dB across the airborne curve with octave-shaped emphasis.`
    );
    warnings.push(
      `Airborne leakage overlay active. The current context is subtracting ${leakage.leakagePenaltyDb} dB from the screening curve for airtightness, perimeter, and penetration risk.`
    );
  }

  if (field.fieldFlankingPenaltyApplied) {
    notes.push(
      `Field-flanking overlay active: ${field.fieldFlankingPenaltyDb} dB was applied through a conservative junction-path graph for ${context.contextMode.replaceAll("_", " ")}.`
    );
    warnings.push(
      `Airborne field-side overlay active. The current ${context.contextMode.replaceAll("_", " ")} context is carrying a conservative flanking penalty of ${field.fieldFlankingPenaltyDb} dB.`
    );
  }

  if (context.contextMode !== "element_lab" && context.sharedTrack === "independent" && family === "double_stud_surrogate") {
    notes.push("Independent frame support lowered the double-stud surrogate field penalty relative to a shared-track assumption.");
  }

  const overlay: AirborneOverlay = {
    baseRwDb: baseRatings.iso717.Rw,
    baseStc: baseRatings.astmE413.STC,
    contextMode: context.contextMode,
    detectedFamily: family,
    fieldFlankingPenaltyApplied: field.fieldFlankingPenaltyApplied,
    fieldFlankingPenaltyDb: field.fieldFlankingPenaltyDb,
    finalRwDb: finalRatings.iso717.Rw,
    finalStc: finalRatings.astmE413.STC,
    junctionFlankingGraph: field.junctionFlankingGraph,
    leakagePenaltyApplied: leakage.leakagePenaltyApplied,
    leakagePenaltyDb: leakage.leakagePenaltyDb,
    notes
  };

  return {
    curve: finalCurve,
    overlay,
    ratings: finalRatings,
    warnings
  };
}
