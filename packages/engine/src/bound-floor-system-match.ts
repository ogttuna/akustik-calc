import { BOUND_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  BoundFloorSystem,
  FloorSystemBoundEstimateResult,
  FloorSystemBoundMatchResult,
  ImpactBoundCalculation,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import {
  evaluateMatchedFloorSystem,
  hasAmbiguousSingleEntryRoleTopology,
  hasSplitSingleEntryRoleSchedules,
  THICKNESS_TOLERANCE_MM
} from "./floor-system-evaluation";
import {
  deriveMissingSupportFormLightweightSteelBoundEstimate,
  deriveSpecificLightweightSteelBoundEstimate
} from "./lightweight-steel-bound-estimate";
import { round1 } from "./math";

function buildOfficialBoundImpact(system: BoundFloorSystem): ImpactBoundCalculation {
  const lnWUpperBound = system.impactBounds.LnWUpperBound;
  const lnWPlusCIUpperBound = system.impactBounds.LnWPlusCIUpperBound;
  const deltaLwLowerBound = system.impactBounds.DeltaLwLowerBound;
  const metricNotes = [
    ...(typeof lnWUpperBound === "number"
      ? [`Impact remains conservative: Ln,w stays at or below ${round1(lnWUpperBound)} dB.`]
      : []),
    ...(typeof lnWPlusCIUpperBound === "number"
      ? [`Impact remains conservative: Ln,w+CI stays at or below ${round1(lnWPlusCIUpperBound)} dB.`]
      : []),
    ...(typeof deltaLwLowerBound === "number"
      ? [`Impact remains conservative: DeltaLw stays at or above ${round1(deltaLwLowerBound)} dB.`]
      : [])
  ];

  return {
    DeltaLwLowerBound: deltaLwLowerBound,
    LnWPlusCIUpperBound: lnWPlusCIUpperBound,
    LnWUpperBound: lnWUpperBound,
    basis: "official_floor_system_bound_support",
    confidence: getImpactConfidenceForBasis("official_floor_system_bound_support"),
    notes: [
      `${system.label} matched the curated official bound-only floor-system lane.`,
      ...metricNotes,
      `Carrier: ${system.systemSummary.carrier}.`
    ],
    scope: "exact_floor_system_family"
  };
}

function toBoundMatchResult(
  evaluation: ReturnType<typeof evaluateMatchedFloorSystem<BoundFloorSystem>>
): FloorSystemBoundMatchResult {
  const lowerBoundImpact = buildOfficialBoundImpact(evaluation.system);

  return {
    lowerBoundImpact,
    matchKind: "automatic",
    notes: [
      `${evaluation.system.sourceLabel} bound-only family match landed without fabricating an exact Ln,w metric.`,
      `Published airborne companion stays exact: Rw ${round1(evaluation.system.airborneRatings.Rw)} dB${typeof evaluation.system.airborneRatings.RwCtr === "number" ? `, companion ${round1(evaluation.system.airborneRatings.RwCtr)} dB` : ""}.`,
      `Curated match score ${evaluation.score}. Thickness tolerance is +/- ${THICKNESS_TOLERANCE_MM} mm for explicit role checks.`
    ],
    score: evaluation.score,
    system: evaluation.system
  };
}

export function resolveBoundFloorSystemById(id: string): FloorSystemBoundMatchResult | null {
  const system = BOUND_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    return null;
  }

  return {
    lowerBoundImpact: buildOfficialBoundImpact(system),
    matchKind: "automatic",
    notes: [
      `Curated bound-only floor-system id was selected directly: ${system.label}.`,
      `Published airborne companion stays exact: Rw ${round1(system.airborneRatings.Rw)} dB${typeof system.airborneRatings.RwCtr === "number" ? `, companion ${round1(system.airborneRatings.RwCtr)} dB` : ""}.`,
      "Layer scoring was bypassed because the exact curated bound-only floor-system id is already known."
    ],
    score: 0,
    system
  };
}

export function matchBoundFloorSystem(layers: readonly ResolvedLayer[]): FloorSystemBoundMatchResult | null {
  if (hasSplitSingleEntryRoleSchedules(layers)) {
    return null;
  }

  const exactMatches = BOUND_FLOOR_SYSTEMS.map((system) => evaluateMatchedFloorSystem(layers, system))
    .filter((evaluation) => evaluation.exact)
    .sort((left, right) => right.score - left.score);

  const best = exactMatches[0];
  return best ? toBoundMatchResult(best) : null;
}

export function deriveBoundFloorSystemEstimate(
  layers: readonly ResolvedLayer[]
): FloorSystemBoundEstimateResult | null {
  if (hasAmbiguousSingleEntryRoleTopology(layers)) {
    return null;
  }

  return (
    deriveSpecificLightweightSteelBoundEstimate(layers) ??
    deriveMissingSupportFormLightweightSteelBoundEstimate(layers)
  );
}
