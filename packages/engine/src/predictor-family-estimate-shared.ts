import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorSystemAirborneRatings,
  FloorSystemEstimateKind,
  FloorSystemEstimateResult,
  ImpactCalculation
} from "@dynecho/shared";

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
    notes: [
      `${input.noteLabel} stayed inside curated published family rows instead of drifting into a fabricated topology result.`,
      `Candidate rows: ${candidateLabels.join("; ")}.`,
      `Candidate scores: ${input.candidateScores.map((score) => ksRound1(score)).join(", ")}.`,
      "This remains a labeled published-family estimate, not an exact lab record."
    ],
    scope: "family_estimate"
  };

  return {
    airborneRatings: input.airborneRatings,
    fitPercent: estimateFitPercent(weightedCandidates),
    impact,
    kind: input.kind,
    notes: [
      `Active family: ${input.structuralFamily}.`,
      `${input.noteLabel} is active on the predictor lane.`,
      `Curated lineage: ${candidateLabels.join("; ")}.`
    ],
    sourceSystems,
    structuralFamily: input.structuralFamily
  };
}
