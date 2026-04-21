// Davy/Cremer-style masonry coincidence cap carved out of
// `dynamic-airborne.ts` during `dynamic_airborne_split_refactor_v1`
// commit 4. This lane is exclusively used for single-leaf AAC-core
// masonry: it derives a Davy-style panel profile, builds a Cremer
// transmission-loss curve, and caps the generic single-leaf engine
// output against it when the coincidence dip is otherwise missing.
//
// Split rationale:
// - Self-contained: the three functions form a tight pipeline that
//   only needs curve-math helpers + material-family predicates +
//   panel properties. No coupling to framing / calibration / blending.
// - Large enough to be worth carving (~220 lines) and small enough
//   to validate mechanically with the masonry benchmark + aircrete
//   benchmark + physical invariants matrix.

import type { AssemblyRatings, ResolvedLayer, TransmissionLossCurve } from "@dynecho/shared";

import {
  buildPanelProperties,
  estimateCriticalFrequency,
  finitePanelRadiationEfficiency
} from "./airborne-calculator";
import { calculateLayerTotals, classifyLayerRole, summarizeAirborneTopology } from "./airborne-topology";
import { buildRatingsFromCurve } from "./curve-rating";
import {
  DYNAMIC_AIR_DENSITY,
  DYNAMIC_SOUND_SPEED,
  octaveBandWindowWeight,
  octaveGaussianDip,
  type DynamicAirborneOptions
} from "./dynamic-airborne-helpers";
import {
  isAacLikeLayer,
  isMasonryLikeLayer,
  isPlasterLikeLayer
} from "./dynamic-airborne-family-detection";
import { clamp, log10Safe } from "./math";

type MasonryDavyProfile = {
  bandEndHz: number;
  bandStartHz: number;
  centerHz: number;
  coreDensity: number;
  depthDb: number;
  fcRaw: number;
  fcSigmaOctaves: number;
  hasAacCore: boolean;
  lowDensityBandPenaltyDb: number;
  lowDensityGlobalPenaltyDb: number;
  masonryMassRatio: number;
  transitionOctaves: number;
};

function buildMasonryDavyProfile(
  layers: readonly ResolvedLayer[],
  panel: ReturnType<typeof buildPanelProperties>
): MasonryDavyProfile | null {
  const solids = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (!solids.length) {
    return null;
  }

  const masses = solids.map((layer) => Math.max(layer.surfaceMassKgM2, 0));
  const totalMass = masses.reduce((sum, mass) => sum + mass, 0);
  if (!(totalMass > 0)) {
    return null;
  }

  const masonryMass = solids.reduce(
    (sum, layer, index) => sum + (isMasonryLikeLayer(layer) ? masses[index]! : 0),
    0
  );
  const masonryMassRatio = masonryMass / totalMass;
  if (!(masonryMassRatio >= 0.7)) {
    return null;
  }

  const masonryEntries = solids
    .map((layer, index) => ({ layer, mass: masses[index]! }))
    .filter((entry) => isMasonryLikeLayer(entry.layer) && entry.mass > 0);
  const coreEntries = masonryEntries.filter((entry) => !isPlasterLikeLayer(entry.layer));
  const corePool = coreEntries.length ? coreEntries : masonryEntries;
  const coreMass = corePool.reduce((sum, entry) => sum + entry.mass, 0);
  if (!(coreMass > 0)) {
    return null;
  }

  const coreDensity =
    corePool.reduce((sum, entry) => sum + (entry.mass * entry.layer.material.densityKgM3), 0) / coreMass;
  const hasAacCore = corePool.some((entry) => isAacLikeLayer(entry.layer));
  if (!hasAacCore) {
    return null;
  }

  const fcRaw = Math.max(estimateCriticalFrequency(panel), 40);
  const bandStartHz = 500;
  const bandEndHz = 2000;
  const centerHz = clamp(fcRaw * 3.6, bandStartHz, bandEndHz);
  const depthDb = clamp(
    4.8 +
      (1.2 * clamp((220 - panel.mass) / 160, 0, 1)) +
      (0.8 * clamp((0.03 - panel.damping) / 0.03, 0, 1)),
    0,
    12
  );
  const lowDensityFactor = clamp((680 - coreDensity) / 80, 0, 1);

  return {
    bandEndHz,
    bandStartHz,
    centerHz,
    coreDensity,
    depthDb,
    fcRaw,
    fcSigmaOctaves: 0.38,
    hasAacCore,
    lowDensityBandPenaltyDb: 6 * lowDensityFactor,
    lowDensityGlobalPenaltyDb: 1 * lowDensityFactor,
    masonryMassRatio,
    transitionOctaves: 0.4
  };
}

function buildMasonryDavyCremerCurve(
  frequenciesHz: readonly number[],
  panel: ReturnType<typeof buildPanelProperties>,
  profile: MasonryDavyProfile
): number[] {
  const mass = Math.max(panel.mass, 1e-9);
  const fc = Math.max(profile.fcRaw, 40);
  const etaIntBase = clamp(panel.damping, 0.001, 0.45);
  const sigmaNScale = 0.944;
  const sigmaCBase = 0.356;
  const sigmaCSlope = 0.525;
  const etaIScale = 1.0;
  const etaEdgeDen = 814;
  const etaRScale = 1.25;
  const shearCorrection = 0.94;

  return frequenciesHz.map((frequencyHz) => {
    const frequency = Math.max(frequencyHz, 1e-9);
    const omega = 2 * Math.PI * frequency;
    const k = omega / DYNAMIC_SOUND_SPEED;
    const sigmaN = clamp(finitePanelRadiationEfficiency(frequency, 2.7, 4.0) * sigmaNScale, 0.05, 1.4);
    const sigmaC = clamp(sigmaCBase + (sigmaCSlope * sigmaN), 0.1, 2.2);
    const etaI = clamp(etaIntBase * etaIScale, 0.001, 0.6);
    const etaE = mass / (etaEdgeDen * Math.sqrt(Math.max(frequency, 1)));
    const etaR = (sigmaN * DYNAMIC_AIR_DENSITY) / (Math.max(k, 1e-9) * mass);
    const etaTotal = clamp(etaI + etaE + (2 * etaRScale * etaR), 0.002, 0.95);
    const zM = (Math.PI * frequency * mass) / (DYNAMIC_AIR_DENSITY * DYNAMIC_SOUND_SPEED);
    const r = frequency / fc;
    const denom = Math.max(sigmaC + (zM * etaTotal), 1e-9);
    const atanTerm =
      Math.atan((2 * zM) / denom) -
      Math.atan((2 * zM * (1 - r)) / denom);
    const tauR =
      shearCorrection *
      ((sigmaC * sigmaC) / (2 * Math.max(zM * r, 1e-9) * denom)) *
      atanTerm;
    const tauN = (2 * sigmaN) / Math.max(zM * zM, 1e-12);

    let tau = frequency < fc ? (tauR + tauN) : tauR;
    tau = clamp(tau, 1e-12, 1);

    let transmissionLossDb = -10 * log10Safe(tau);
    transmissionLossDb -= octaveGaussianDip(frequency, profile.centerHz, profile.depthDb, profile.fcSigmaOctaves);
    transmissionLossDb -=
      profile.lowDensityBandPenaltyDb *
      octaveBandWindowWeight(frequency, profile.bandStartHz, profile.bandEndHz, profile.transitionOctaves);
    transmissionLossDb -= profile.lowDensityGlobalPenaltyDb;

    return clamp(transmissionLossDb, 0, 95);
  });
}

export function applyMasonryDavyConservativeCap(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions,
  genericMasonryLaneActive: boolean
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    options.disableMasonryDavyCap ||
    !genericMasonryLaneActive ||
    topology.visibleLeafCount !== 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const panel = buildPanelProperties(layers, calculateLayerTotals(layers));
  if (!panel.valid) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const profile = buildMasonryDavyProfile(layers, panel);
  if (!profile) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const davyCurveDb = buildMasonryDavyCremerCurve(curve.frequenciesHz, panel, profile);
  const cappedTransmissionLossDb = curve.transmissionLossDb.map((value, index) =>
    Math.min(value, davyCurveDb[index] ?? value)
  );
  const maxReductionDb = cappedTransmissionLossDb.reduce(
    (maxReduction, value, index) => Math.max(maxReduction, curve.transmissionLossDb[index]! - value),
    0
  );

  if (!(maxReductionDb >= 0.25)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const cappedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: cappedTransmissionLossDb
  };
  const ratings = buildRatingsFromCurve(cappedCurve.frequenciesHz, cappedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    `A Davy/Cremer-style masonry coincidence cap reduced the generic single-leaf AAC lane around ${Math.round(profile.centerHz)} Hz (core density ${profile.coreDensity.toFixed(0)} kg/m3, max reduction ${maxReductionDb.toFixed(1)} dB).`
  );

  return {
    applied: true,
    curve: cappedCurve,
    notes,
    ratings,
    strategySuffix: "masonry_davy_cap",
    targetRw: ratings.iso717.Rw
  };
}
