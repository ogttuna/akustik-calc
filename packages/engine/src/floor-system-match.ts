import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactImpactSource,
  ExactFloorSystem,
  FloorSystemMatchResult,
  FloorSystemRecommendation,
  ImpactCalculation,
  ResolvedLayer
} from "@dynecho/shared";
import {
  getFloorSystemCompanionLabel,
  getFloorSystemDerivedRwPlusCtr
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import {
  evaluateMatchedFloorSystem,
  hasSplitSingleEntryRoleSchedules,
  fitPercentFromEvaluation,
  THICKNESS_TOLERANCE_MM
} from "./floor-system-evaluation";
import { round1 } from "./math";

function buildImpactFromFloorSystem(system: ExactFloorSystem): ImpactCalculation {
  const basis =
    system.id.startsWith("pmc_")
      ? "peer_reviewed_floor_system_exact_match"
      : system.sourceType === "open_measured_dataset"
      ? "open_measured_floor_system_exact_match"
      : "official_floor_system_exact_match";
  const availableOutputs: ImpactCalculation["availableOutputs"] = ["Ln,w"];

  if (typeof system.impactRatings.CI === "number") {
    availableOutputs.push("CI");
  }

  if (typeof system.impactRatings.CI50_2500 === "number") {
    availableOutputs.push("CI,50-2500");
  }

  if (typeof system.impactRatings.LnWPlusCI === "number") {
    availableOutputs.push("Ln,w+CI");
  }

  return {
    CI: system.impactRatings.CI,
    CI50_2500: system.impactRatings.CI50_2500,
    LnW: system.impactRatings.LnW,
    LnWPlusCI: system.impactRatings.LnWPlusCI,
    availableOutputs,
    basis,
    confidence: getImpactConfidenceForBasis(basis),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: system.impactRatings.CI,
        CI50_2500: system.impactRatings.CI50_2500,
        LnW: system.impactRatings.LnW,
        LnWPlusCI: system.impactRatings.LnWPlusCI
      },
      basis
    ),
    notes: [
      `${system.label} matched the curated exact floor-system catalog.`,
      `Carrier: ${system.systemSummary.carrier}.`,
      `Floor build-up: ${system.systemSummary.floorBuildUp}.`,
      `Ceiling: ${system.systemSummary.ceiling}.`
    ],
    scope: "exact_floor_system_family"
  };
}

function canManualExactMatch(system: ExactFloorSystem): boolean {
  return system.manualMatch !== false;
}

function canParticipateInRecommendations(system: ExactFloorSystem): boolean {
  return canManualExactMatch(system);
}

function toMatchResult(evaluation: ReturnType<typeof evaluateMatchedFloorSystem<ExactFloorSystem>>): FloorSystemMatchResult {
  const impact = buildImpactFromFloorSystem(evaluation.system);
  const companionLabel = getFloorSystemCompanionLabel(evaluation.system.airborneRatings);
  const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(evaluation.system.airborneRatings);
  const airborneSnippet =
    typeof evaluation.system.airborneRatings.RwCtr === "number"
      ? companionLabel === "Ctr"
        ? `Rw ${round1(evaluation.system.airborneRatings.Rw)} dB, Ctr ${round1(evaluation.system.airborneRatings.RwCtr)} dB, derived Rw + Ctr ${round1(derivedRwPlusCtr ?? evaluation.system.airborneRatings.RwCtr)} dB, Ln,w ${round1(evaluation.system.impactRatings.LnW)} dB.`
        : `Rw ${round1(evaluation.system.airborneRatings.Rw)} dB, Rw + Ctr ${round1(evaluation.system.airborneRatings.RwCtr)} dB, Ln,w ${round1(evaluation.system.impactRatings.LnW)} dB.`
      : `Rw ${round1(evaluation.system.airborneRatings.Rw)} dB, no published ${companionLabel} companion, Ln,w ${round1(evaluation.system.impactRatings.LnW)} dB.`;

  return {
    impact,
    matchKind: "automatic",
    notes: [
      `${evaluation.system.sourceLabel} exact family match landed without touching the upstream working tree.`,
      airborneSnippet,
      `Curated match score ${evaluation.score}. Thickness tolerance is +/- ${THICKNESS_TOLERANCE_MM} mm for explicit role checks.`
    ],
    score: evaluation.score,
    system: evaluation.system
  };
}

export function resolveExactFloorSystemById(id: string): FloorSystemMatchResult | null {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    return null;
  }

  const impact = buildImpactFromFloorSystem(system);
  const companionLabel = getFloorSystemCompanionLabel(system.airborneRatings);
  const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(system.airborneRatings);
  const airborneSnippet =
    typeof system.airborneRatings.RwCtr === "number"
      ? companionLabel === "Ctr"
        ? `Rw ${round1(system.airborneRatings.Rw)} dB, Ctr ${round1(system.airborneRatings.RwCtr)} dB, derived Rw + Ctr ${round1(derivedRwPlusCtr ?? system.airborneRatings.RwCtr)} dB, Ln,w ${round1(system.impactRatings.LnW)} dB.`
        : `Rw ${round1(system.airborneRatings.Rw)} dB, Rw + Ctr ${round1(system.airborneRatings.RwCtr)} dB, Ln,w ${round1(system.impactRatings.LnW)} dB.`
      : `Rw ${round1(system.airborneRatings.Rw)} dB, no published ${companionLabel} companion, Ln,w ${round1(system.impactRatings.LnW)} dB.`;

  return {
    impact,
    matchKind: "automatic",
    notes: [
      `Curated exact floor-system id was selected directly: ${system.label}.`,
      airborneSnippet,
      ...(system.manualMatch === false
        ? ["This published row stays preset-only and is intentionally excluded from manual topology exact matching."]
        : []),
      "Layer scoring was bypassed because the exact curated floor-system id is already known."
    ],
    score: 0,
    system
  };
}

export function resolveExactFloorSystemImpactSource(
  system: ExactFloorSystem | null | undefined
): ExactImpactSource | null {
  if (!system?.impactBands) {
    return null;
  }

  return {
    ...system.impactBands,
    label: system.impactBands.label ?? system.label,
    labOrField: system.impactBands.labOrField ?? "lab",
    standardMethod: system.impactBands.standardMethod ?? system.sourceType
  };
}

function toRecommendation(
  evaluation: ReturnType<typeof evaluateMatchedFloorSystem<ExactFloorSystem>>
): FloorSystemRecommendation {
  const fitPercent = fitPercentFromEvaluation(evaluation);

  return {
    fitPercent,
    matchedSignalCount: evaluation.score,
    missingSignals: evaluation.missingSignals.slice(0, 4),
    score: evaluation.score,
    system: evaluation.system,
    totalSignalCount: evaluation.totalSignalCount
  };
}

export function matchExactFloorSystem(layers: readonly ResolvedLayer[]): FloorSystemMatchResult | null {
  if (hasSplitSingleEntryRoleSchedules(layers)) {
    return null;
  }

  const exactMatches = EXACT_FLOOR_SYSTEMS.filter(canManualExactMatch)
    .map((system) => evaluateMatchedFloorSystem(layers, system))
    .filter((evaluation) => evaluation.exact)
    .sort((left, right) => right.score - left.score);

  const best = exactMatches[0];
  return best ? toMatchResult(best) : null;
}

export function recommendFloorSystems(
  layers: readonly ResolvedLayer[],
  limit = 3
): FloorSystemRecommendation[] {
  return EXACT_FLOOR_SYSTEMS.filter(canParticipateInRecommendations)
    .map((system) => evaluateMatchedFloorSystem(layers, system))
    .filter((evaluation) => !evaluation.exact && evaluation.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.missingSignals.length - right.missingSignals.length;
    })
    .slice(0, limit)
    .map(toRecommendation);
}
