import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorSystemAirborneRatings,
  FloorSystemAirborneCompanionSemantic,
  FloorSystemEstimateKind,
  FloorSystemEstimateResult,
  ImpactCalculation
} from "@dynecho/shared";
import { getFloorSystemCompanionSemantic } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { ksRound1, round1 } from "./math";

type WeightedCandidate = {
  label: string;
  score: number;
};

export type PredictorFamilyEstimateCase = {
  airborneRatings: FloorSystemAirborneRatings;
  basisOverride?: ImpactCalculation["basis"];
  candidateIds: readonly string[];
  candidateScores: readonly number[];
  fitPercentOverride?: number;
  impactRatings: {
    CI?: number;
    CI50_2500?: number;
    LnW: number;
    LnWPlusCI?: number;
  };
  kind: FloorSystemEstimateKind;
  noteLabel: string;
  sourceSystemIds?: readonly string[];
  structuralFamily: string;
};

export function normalizePredictorToken(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function getBasis(kind: FloorSystemEstimateKind): ImpactCalculation["basis"] {
  switch (kind) {
    case "family_archetype":
      return "predictor_floor_system_family_archetype_estimate";
    case "family_general":
      return "predictor_floor_system_family_general_estimate";
    case "low_confidence":
      return "predictor_floor_system_low_confidence_estimate";
  }
}

function buildAvailableOutputs(input: PredictorFamilyEstimateCase["impactRatings"]): ImpactCalculation["availableOutputs"] {
  const outputs: ImpactCalculation["availableOutputs"] = ["Ln,w"];

  if (typeof input.CI === "number") {
    outputs.push("CI");
  }

  if (typeof input.CI50_2500 === "number") {
    outputs.push("CI,50-2500");
  }

  if (typeof input.LnWPlusCI === "number") {
    outputs.push("Ln,w+CI");
  }

  return outputs;
}

function resolveSourceSystems(sourceIds: readonly string[]): ExactFloorSystem[] | null {
  const systems = sourceIds.map((id) => EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id) ?? null);

  if (systems.some((entry) => entry === null)) {
    return null;
  }

  return systems as ExactFloorSystem[];
}

function resolveCandidateLabels(candidateIds: readonly string[]): string[] {
  return candidateIds.map(
    (id) =>
      EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id)?.label ??
      BOUND_FLOOR_SYSTEMS.find((entry) => entry.id === id)?.label ??
      id
  );
}

function estimateFitPercent(candidates: readonly WeightedCandidate[]): number {
  const averageScore = candidates.reduce((sum, candidate) => sum + candidate.score, 0) / candidates.length;
  return round1(Math.max(28, 100 - averageScore * 12));
}

function capPredictorEstimateFitPercent(fitPercent: number, kind: FloorSystemEstimateKind): number {
  if (kind === "low_confidence") {
    // Keep predictor-only low-confidence routes on the same displayed fit ceiling
    // as the broader floor-system estimate pipeline.
    return Math.min(fitPercent, 29);
  }

  return fitPercent;
}

function buildPredictorImpactNotes(
  input: PredictorFamilyEstimateCase,
  candidateLabels: readonly string[]
): string[] {
  const candidateScores = input.candidateScores.map((score) => ksRound1(score)).join(", ");

  if (input.kind === "low_confidence") {
    return [
      `${input.noteLabel} stayed inside nearby published rows instead of drifting into a fabricated topology result.`,
      `Nearby published rows: ${candidateLabels.join("; ")}.`,
      `Nearby-row scores: ${candidateScores}.`,
      "This remains a low-confidence fallback built from nearby published rows, not a narrow published-family claim or an exact lab record."
    ];
  }

  return [
    `${input.noteLabel} stayed inside curated published family rows instead of drifting into a fabricated topology result.`,
    `Candidate rows: ${candidateLabels.join("; ")}.`,
    `Candidate scores: ${candidateScores}.`,
    "This remains a labeled published-family estimate, not an exact lab record."
  ];
}

function buildPredictorEstimateNotes(
  input: PredictorFamilyEstimateCase,
  candidateLabels: readonly string[]
): string[] {
  if (input.kind === "low_confidence") {
    return [
      `Active family: ${input.structuralFamily}.`,
      `${input.noteLabel} is active on the predictor lane.`,
      `Nearby published lineage: ${candidateLabels.join("; ")}.`
    ];
  }

  return [
    `Active family: ${input.structuralFamily}.`,
    `${input.noteLabel} is active on the predictor lane.`,
    `Curated lineage: ${candidateLabels.join("; ")}.`
  ];
}

function resolveAirborneRatingsCompanionSemantic(
  ratings: FloorSystemAirborneRatings,
  sourceSystems: readonly ExactFloorSystem[]
): FloorSystemAirborneRatings {
  if (ratings.RwCtrSemantic || typeof ratings.RwCtr !== "number") {
    return ratings;
  }

  const sourceSemantics = new Set<FloorSystemAirborneCompanionSemantic>(
    sourceSystems
      .filter((system) => typeof system.airborneRatings.RwCtr === "number")
      .map((system) => getFloorSystemCompanionSemantic(system.airborneRatings))
  );

  if (sourceSemantics.size !== 1) {
    // Mixed source semantics cannot safely be rendered as C, Ctr, or Rw+Ctr.
    // Withhold the companion instead of letting the legacy default relabel it.
    return { Rw: ratings.Rw };
  }

  return {
    ...ratings,
    RwCtrSemantic: [...sourceSemantics][0]
  };
}

export function buildPredictorFamilyEstimateCase(input: PredictorFamilyEstimateCase): FloorSystemEstimateResult | null {
  if (input.candidateIds.length === 0 || input.candidateIds.length !== input.candidateScores.length) {
    return null;
  }

  const sourceSystems = resolveSourceSystems(input.sourceSystemIds ?? input.candidateIds);
  if (!sourceSystems) {
    return null;
  }

  const basis = input.basisOverride ?? getBasis(input.kind);
  const candidateLabels = resolveCandidateLabels(input.candidateIds);
  const weightedCandidates: WeightedCandidate[] = input.candidateIds.map((id, index) => ({
    label: candidateLabels[index] ?? id,
    score: input.candidateScores[index] ?? 0
  }));

  const impact: ImpactCalculation = {
    ...input.impactRatings,
    availableOutputs: buildAvailableOutputs(input.impactRatings),
    basis,
    confidence: getImpactConfidenceForBasis(basis),
    estimateCandidateIds: [...input.candidateIds],
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(input.impactRatings, basis),
    notes: buildPredictorImpactNotes(input, candidateLabels),
    scope: "family_estimate"
  };

  return {
    airborneRatings: resolveAirborneRatingsCompanionSemantic(input.airborneRatings, sourceSystems),
    fitPercent:
      typeof input.fitPercentOverride === "number"
        ? input.fitPercentOverride
        : capPredictorEstimateFitPercent(estimateFitPercent(weightedCandidates), input.kind),
    impact,
    kind: input.kind,
    notes: buildPredictorEstimateNotes(input, candidateLabels),
    sourceSystems,
    structuralFamily: input.structuralFamily
  };
}
