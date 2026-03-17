import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemAirborneCompanionSemantic,
  FloorSystemEstimateKind,
  FloorSystemEstimateResult,
  FloorSystemRecommendation,
  ImpactCalculation,
  ResolvedLayer
} from "@dynecho/shared";
import { getFloorSystemCompanionSemantic } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { deriveLightweightSteelFl28Estimate } from "./lightweight-steel-fl28-estimate";
import { round1 } from "./math";

type StructuralFamily =
  | "composite_panel"
  | "hollow_core_precast"
  | "lightweight_steel"
  | "mass_timber_clt"
  | "open_box_timber"
  | "reinforced_concrete"
  | "timber_frame"
  | "unknown";

type FloorProfile = "bare" | "combined" | "heavy_floating" | "lower_only" | "upper_only";

const UPPER_ROLES: FloorRole[] = ["floating_screed", "floor_covering", "resilient_layer", "upper_fill"];
const LOWER_ROLES: FloorRole[] = ["ceiling_board", "ceiling_cavity", "ceiling_fill"];

function structuralFamilyFromMaterialIds(materialIds: readonly string[]): StructuralFamily {
  if (
    materialIds.includes("steel_joist_floor") ||
    materialIds.includes("open_web_steel_floor") ||
    materialIds.includes("lightweight_steel_floor")
  ) {
    return "lightweight_steel";
  }

  if (materialIds.includes("composite_steel_deck")) {
    return "composite_panel";
  }

  if (materialIds.includes("hollow_core_plank")) {
    return "hollow_core_precast";
  }

  if (materialIds.includes("clt_panel")) {
    return "mass_timber_clt";
  }

  if (materialIds.includes("open_box_timber_slab")) {
    return "open_box_timber";
  }

  if (materialIds.includes("timber_frame_floor") || materialIds.includes("timber_joist_floor")) {
    return "timber_frame";
  }

  if (materialIds.includes("concrete")) {
    return "reinforced_concrete";
  }

  return "unknown";
}

function getSystemStructuralFamily(system: ExactFloorSystem): StructuralFamily {
  return structuralFamilyFromMaterialIds(system.match.baseStructure?.materialIds ?? []);
}

function getLayerStructuralFamily(layers: readonly ResolvedLayer[]): StructuralFamily {
  const baseMaterialIds = layers
    .filter((layer) => layer.floorRole === "base_structure")
    .map((layer) => layer.material.id);

  return structuralFamilyFromMaterialIds(baseMaterialIds);
}

function getProfile(hasUpper: boolean, hasLower: boolean, hasFloatingScreed: boolean): FloorProfile {
  if (hasLower && hasUpper) {
    return "combined";
  }

  if (hasLower) {
    return "lower_only";
  }

  if (hasFloatingScreed) {
    return "heavy_floating";
  }

  if (hasUpper) {
    return "upper_only";
  }

  return "bare";
}

function getLayerProfile(layers: readonly ResolvedLayer[]): FloorProfile {
  const hasUpper = layers.some((layer) => layer.floorRole !== undefined && UPPER_ROLES.includes(layer.floorRole));
  const hasLower = layers.some((layer) => layer.floorRole !== undefined && LOWER_ROLES.includes(layer.floorRole));
  const hasFloatingScreed = layers.some((layer) => layer.floorRole === "floating_screed");

  return getProfile(hasUpper, hasLower, hasFloatingScreed);
}

function getSystemProfile(system: ExactFloorSystem): FloorProfile {
  const hasUpper = Boolean(
    system.match.resilientLayer ||
      system.match.floorCovering ||
      system.match.upperFill ||
      system.match.floatingScreed
  );
  const hasLower = Boolean(
    system.match.ceilingBoard ||
      system.match.ceilingCavity ||
      system.match.ceilingFill
  );
  const hasFloatingScreed = Boolean(system.match.floatingScreed);

  return getProfile(hasUpper, hasLower, hasFloatingScreed);
}

function formatStructuralFamily(family: StructuralFamily): string {
  switch (family) {
    case "composite_panel":
      return "composite panel";
    case "hollow_core_precast":
      return "hollow-core / precast concrete";
    case "lightweight_steel":
      return "lightweight steel";
    case "mass_timber_clt":
      return "mass-timber CLT";
    case "open_box_timber":
      return "open-box timber";
    case "reinforced_concrete":
      return "reinforced concrete";
    case "timber_frame":
      return "timber frame / joist";
    case "unknown":
      return "mixed";
  }
}

function getImpactBasis(kind: FloorSystemEstimateKind): ImpactCalculation["basis"] {
  switch (kind) {
    case "family_archetype":
      return "predictor_floor_system_family_archetype_estimate";
    case "family_general":
      return "predictor_floor_system_family_general_estimate";
    case "low_confidence":
      return "predictor_floor_system_low_confidence_estimate";
  }
}

function resolveSpecificFamilyEstimateBasis(input: {
  family: StructuralFamily;
  currentProfile: FloorProfile;
  kind: FloorSystemEstimateKind;
  sources: readonly FloorSystemRecommendation[];
}): {
  basis: ImpactCalculation["basis"];
  label: string;
} {
  const sourceIds = input.sources.map((entry) => entry.system.id);
  const hasPrefix = (prefix: string) => sourceIds.some((id) => id.startsWith(prefix));

  if (
    input.family === "composite_panel" &&
    sourceIds.length > 1 &&
    sourceIds.some((id) => id.includes("dry_") || id.includes("plus_"))
  ) {
    return {
      basis: "predictor_composite_panel_published_interaction_estimate",
      label: "Published composite-panel interaction estimate"
    };
  }

  if (
    input.family === "reinforced_concrete" &&
    (input.currentProfile === "upper_only" || input.currentProfile === "heavy_floating" || input.currentProfile === "combined")
  ) {
    return {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      label: "Published heavy-concrete upper-treatment estimate"
    };
  }

  if (input.family === "mass_timber_clt") {
    if (hasPrefix("dataholz_") && (input.currentProfile === "upper_only" || input.currentProfile === "combined")) {
      return {
        basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
        label: "Published Dataholz CLT dry-family estimate"
      };
    }

    if (hasPrefix("tuas_") && (input.currentProfile === "bare" || input.currentProfile === "upper_only")) {
      return {
        basis: "predictor_mass_timber_clt_bare_interpolation_estimate",
        label: "Measured CLT bare-floor interpolation estimate"
      };
    }

    if (hasPrefix("tuas_") && input.currentProfile === "combined") {
      return {
        basis: "predictor_mass_timber_clt_dry_interaction_estimate",
        label: "Measured CLT dry interaction estimate"
      };
    }
  }

  return {
    basis: getImpactBasis(input.kind),
    label:
      input.kind === "family_archetype"
        ? "Same-family archetype estimate"
        : input.kind === "family_general"
          ? "Published family blend estimate"
          : "Low-confidence family fallback"
  };
}

function compatibleProfiles(left: FloorProfile, right: FloorProfile): boolean {
  if (left === right) {
    return true;
  }

  if (left === "upper_only" && right === "heavy_floating") {
    return true;
  }

  if (left === "heavy_floating" && right === "upper_only") {
    return true;
  }

  return false;
}

function weightFromRecommendation(recommendation: FloorSystemRecommendation): number {
  const signalGap = recommendation.totalSignalCount - recommendation.score;
  return 1 / ((1 + signalGap) * (1 + signalGap));
}

function weightedAverage(
  recommendations: readonly FloorSystemRecommendation[],
  pick: (recommendation: FloorSystemRecommendation) => number | undefined
): number | undefined {
  let numerator = 0;
  let denominator = 0;

  for (const recommendation of recommendations) {
    const value = pick(recommendation);
    if (typeof value !== "number") {
      continue;
    }

    const weight = weightFromRecommendation(recommendation);
    numerator += value * weight;
    denominator += weight;
  }

  if (denominator === 0) {
    return undefined;
  }

  return round1(numerator / denominator);
}

function getFamilyEstimatePool(
  family: StructuralFamily,
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemRecommendation[] {
  const sameFamily = recommendations.filter((entry) => getSystemStructuralFamily(entry.system) === family);

  if (sameFamily.length > 0) {
    return sameFamily;
  }

  if (family === "hollow_core_precast") {
    return recommendations.filter((entry) => {
      const candidateFamily = getSystemStructuralFamily(entry.system);
      return candidateFamily === "hollow_core_precast" || candidateFamily === "reinforced_concrete";
    });
  }

  if (family === "composite_panel") {
    return recommendations.filter((entry) => {
      const candidateFamily = getSystemStructuralFamily(entry.system);
      return (
        candidateFamily === "composite_panel" ||
        candidateFamily === "lightweight_steel" ||
        candidateFamily === "reinforced_concrete"
      );
    });
  }

  if (family === "unknown") {
    return recommendations.slice();
  }

  return recommendations.slice();
}

function getStableCompanionSemantic(
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemAirborneCompanionSemantic | undefined {
  const semantics = new Set(
    recommendations
      .filter((entry) => typeof entry.system.airborneRatings.RwCtr === "number")
      .map((entry) => getFloorSystemCompanionSemantic(entry.system.airborneRatings))
  );

  if (semantics.size !== 1) {
    return undefined;
  }

  return semantics.values().next().value;
}

function buildImpactEstimate(
  kind: FloorSystemEstimateKind,
  family: StructuralFamily,
  currentProfile: FloorProfile,
  sources: readonly FloorSystemRecommendation[]
): ImpactCalculation {
  const basisInfo = resolveSpecificFamilyEstimateBasis({
    currentProfile,
    family,
    kind,
    sources
  });
  const lnW = weightedAverage(sources, (entry) => entry.system.impactRatings.LnW);
  const ci = weightedAverage(sources, (entry) => entry.system.impactRatings.CI);
  const ci50_2500 = weightedAverage(sources, (entry) => entry.system.impactRatings.CI50_2500);
  const lnWPlusCI = weightedAverage(sources, (entry) => entry.system.impactRatings.LnWPlusCI);
  const availableOutputs: ImpactCalculation["availableOutputs"] = ["Ln,w"];

  if (typeof ci === "number") {
    availableOutputs.push("CI");
  }

  if (typeof ci50_2500 === "number") {
    availableOutputs.push("CI,50-2500");
  }

  if (typeof lnWPlusCI === "number") {
    availableOutputs.push("Ln,w+CI");
  }

  return {
    CI: ci,
    CI50_2500: ci50_2500,
    LnW: lnW ?? 0,
    LnWPlusCI: lnWPlusCI,
    availableOutputs,
    basis: basisInfo.basis,
    confidence: getImpactConfidenceForBasis(basisInfo.basis),
    estimateCandidateIds: sources.map((entry) => entry.system.id),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: ci,
        CI50_2500: ci50_2500,
        LnW: lnW ?? undefined,
        LnWPlusCI: lnWPlusCI
      },
      basisInfo.basis
    ),
    notes: [
      `${basisInfo.label} derived from nearby ${formatStructuralFamily(family)} rows.`,
      `Current profile ${currentProfile.replaceAll("_", " ")} stayed inside the curated ${formatStructuralFamily(family)} branch.`,
      `Source rows: ${sources.map((entry) => `${entry.system.label} (${entry.fitPercent}% fit)`).join("; ")}.`,
      "This remains a labeled published-family estimate, not an exact floor-system match or a universal physical predictor."
    ],
    scope: "family_estimate"
  };
}

export function deriveFloorSystemEstimate(
  layers: readonly ResolvedLayer[],
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemEstimateResult | null {
  if (recommendations.length === 0) {
    return null;
  }

  const structuralFamily = getLayerStructuralFamily(layers);
  const hasExplicitFloorRoles = layers.some((layer) => Boolean(layer.floorRole));
  if (structuralFamily === "unknown" && !hasExplicitFloorRoles) {
    return null;
  }
  const currentProfile = getLayerProfile(layers);
  const familyPool = getFamilyEstimatePool(structuralFamily, recommendations);
  const profileAligned = familyPool.filter((entry) => compatibleProfiles(currentProfile, getSystemProfile(entry.system)));

  if (structuralFamily === "lightweight_steel") {
    const fl28Estimate = deriveLightweightSteelFl28Estimate(layers, recommendations);
    if (fl28Estimate) {
      return fl28Estimate;
    }
  }

  const archetypeCandidates = profileAligned.filter((entry) => entry.fitPercent >= 55).slice(0, 3);
  const generalCandidates = familyPool.filter((entry) => entry.fitPercent >= 30).slice(0, 3);
  const lowConfidenceCandidates = recommendations.filter((entry) => entry.fitPercent >= 20).slice(0, 3);

  const activeKindAndSources: {
    kind: FloorSystemEstimateKind;
    sources: readonly FloorSystemRecommendation[];
  } | null = archetypeCandidates.length > 0
    ? { kind: "family_archetype", sources: archetypeCandidates }
    : generalCandidates.length > 0
      ? { kind: "family_general", sources: generalCandidates }
      : lowConfidenceCandidates.length > 0
        ? { kind: "low_confidence", sources: lowConfidenceCandidates }
        : null;

  if (!activeKindAndSources) {
    return null;
  }

  const fitPercent = round1(
    activeKindAndSources.sources.reduce((sum, entry) => sum + entry.fitPercent, 0) / activeKindAndSources.sources.length
  );
  const airborneRw = weightedAverage(activeKindAndSources.sources, (entry) => entry.system.airborneRatings.Rw);
  const companionSemantic = getStableCompanionSemantic(activeKindAndSources.sources);
  const airborneCompanion =
    companionSemantic
      ? weightedAverage(activeKindAndSources.sources, (entry) => entry.system.airborneRatings.RwCtr)
      : undefined;
  if (typeof airborneRw !== "number") {
    return null;
  }

  return {
    airborneRatings: {
      Rw: airborneRw,
      RwCtr: airborneCompanion,
      RwCtrSemantic: companionSemantic
    },
    fitPercent,
    impact: buildImpactEstimate(activeKindAndSources.kind, structuralFamily, currentProfile, activeKindAndSources.sources),
    kind: activeKindAndSources.kind,
    notes: [
      `Active family: ${formatStructuralFamily(structuralFamily)}.`,
      `Current profile: ${currentProfile.replaceAll("_", " ")}.`,
      `Estimate fit: ${fitPercent}%.`,
      ...(companionSemantic === "ctr_term"
        ? ["Published airborne companion remains a Ctr adaptation term from Rw(C;Ctr) family rows."]
        : companionSemantic === "rw_plus_ctr"
          ? ["Published airborne companion remains a direct Rw + Ctr family figure."]
          : ["Published family rows did not expose a stable companion airborne figure across the supporting sources."]),
      ...activeKindAndSources.sources.flatMap((entry) =>
        entry.missingSignals.slice(0, 2).map((signal) => `${entry.system.label}: ${signal}`)
      )
    ],
    sourceSystems: activeKindAndSources.sources.map((entry) => entry.system),
    structuralFamily: formatStructuralFamily(structuralFamily)
  };
}
