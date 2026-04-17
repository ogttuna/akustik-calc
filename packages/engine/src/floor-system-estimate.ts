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

import { hasInvalidExplicitFloorBaseStructure } from "./floor-base-structure-eligibility";
import {
  collectCeilingBoardTopologyConflict,
  collectSingleEntryRoleConflicts,
  type CeilingBoardTopologyConflict,
  type SingleEntryRoleConflict
} from "./floor-role-topology";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { hasBoundOnlyUbiqOpenWebCarpetCombinedProfile } from "./bound-only-floor-near-miss";
import { isResolvedHeavyConcreteCarrierEligible } from "./heavy-concrete-carrier-eligibility";
import { deriveLightweightSteelFl28Estimate } from "./lightweight-steel-fl28-estimate";
import { round1 } from "./math";
import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";
import { inferStructuralSupportTypeFromMaterial } from "./structural-material-classification";

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
const DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT = {
  CI: 4,
  LnW: 49,
  LnWPlusCI: 53
} as const;

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
  for (const layer of layers) {
    if (layer.floorRole !== "base_structure") {
      continue;
    }

    switch (inferStructuralSupportTypeFromMaterial(layer.material)) {
      case "reinforced_concrete":
        return "reinforced_concrete";
      case "hollow_core":
        return "hollow_core_precast";
      case "steel_joists":
        return "lightweight_steel";
      case "timber_joists":
        return "timber_frame";
      case "open_box_timber":
        return "open_box_timber";
      case "mass_timber_clt":
        return "mass_timber_clt";
      case "composite_panel":
        return "composite_panel";
    }
  }

  return "unknown";
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

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function hasUpperPackageRole(layers: readonly ResolvedLayer[]): boolean {
  return layers.some(
    (layer) => layer.floorRole === "upper_fill" || layer.floorRole === "floating_screed"
  );
}

function hasSingleSourceBackedLaminateUnderlayPackage(layers: readonly ResolvedLayer[]): boolean {
  const floorCoverings = layers.filter((layer) => layer.floorRole === "floor_covering");
  const resilientLayers = layers.filter((layer) => layer.floorRole === "resilient_layer");

  return (
    floorCoverings.length === 1 &&
    floorCoverings[0]?.material.id === "laminate_flooring" &&
    thicknessNear(floorCoverings[0]?.thicknessMm, 8, 4) &&
    resilientLayers.length === 1 &&
    resilientLayers[0]?.material.id === "eps_underlay" &&
    thicknessNear(resilientLayers[0]?.thicknessMm, 3, 2)
  );
}

function hasSourceBackedLaminateUnderlayPair(layers: readonly ResolvedLayer[]): boolean {
  return (
    layers.some(
      (layer) =>
        layer.floorRole === "floor_covering" &&
        layer.material.id === "laminate_flooring" &&
        thicknessNear(layer.thicknessMm, 8, 4)
    ) &&
    layers.some(
      (layer) =>
        layer.floorRole === "resilient_layer" &&
        layer.material.id === "eps_underlay" &&
        thicknessNear(layer.thicknessMm, 3, 2)
    )
  );
}

// Open-box exact rows use the same +/-2 mm visible-role tolerance as the exact
// matcher; a broader CLT interpolation band would over-promote R2/R5/R9 fallbacks.
function hasSourceBackedOpenBoxLaminateUnderlayPair(layers: readonly ResolvedLayer[]): boolean {
  return (
    layers.some(
      (layer) =>
        layer.floorRole === "floor_covering" &&
        layer.material.id === "laminate_flooring" &&
        thicknessNear(layer.thicknessMm, 8, 2)
    ) &&
    layers.some(
      (layer) =>
        layer.floorRole === "resilient_layer" &&
        layer.material.id === "eps_underlay" &&
        thicknessNear(layer.thicknessMm, 3, 2)
    )
  );
}

function hasLaminateUnderlayFinishInput(layers: readonly ResolvedLayer[]): boolean {
  return layers.some(
    (layer) =>
      (layer.floorRole === "floor_covering" && layer.material.id === "laminate_flooring") ||
      (layer.floorRole === "resilient_layer" && layer.material.id === "eps_underlay")
  );
}

function hasVisibleLowerTreatmentWithoutCavity(layers: readonly ResolvedLayer[]): boolean {
  const hasLowerBoardOrFill = layers.some(
    (layer) => layer.floorRole === "ceiling_board" || layer.floorRole === "ceiling_fill"
  );
  const hasCeilingCavity = layers.some((layer) => layer.floorRole === "ceiling_cavity");

  return hasLowerBoardOrFill && !hasCeilingCavity;
}

function isDataholzGdmtxa04aVisibleCalibrationBoundary(
  layers: readonly ResolvedLayer[],
  basis: ImpactCalculation["basis"],
  sources: readonly FloorSystemRecommendation[]
): boolean {
  if (
    basis !== "predictor_mass_timber_clt_dataholz_dry_estimate" ||
    sources.length !== 1 ||
    sources[0]?.system.id !== "dataholz_gdmtxa01a_clt_lab_2026"
  ) {
    return false;
  }

  const baseStructure = layers.find((layer) => layer.floorRole === "base_structure");
  const floorCovering = layers.find((layer) => layer.floorRole === "floor_covering");
  const upperFill = layers.find((layer) => layer.floorRole === "upper_fill");
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");
  const ceilingCavity = layers.find((layer) => layer.floorRole === "ceiling_cavity");
  const ceilingFill = layers.find((layer) => layer.floorRole === "ceiling_fill");
  const resilientLayer = layers.find((layer) => layer.floorRole === "resilient_layer");
  const floatingScreed = layers.find((layer) => layer.floorRole === "floating_screed");

  return (
    baseStructure?.material.id === "clt_panel" &&
    thicknessNear(baseStructure.thicknessMm, 160, 12) &&
    floorCovering?.material.id === "dry_floating_gypsum_fiberboard" &&
    thicknessNear(floorCovering.thicknessMm, 65, 8) &&
    (upperFill?.material.id === "non_bonded_chippings" || upperFill?.material.id === "bonded_chippings") &&
    thicknessNear(upperFill.thicknessMm, 60, 8) &&
    !resilientLayer &&
    !floatingScreed &&
    ceilingBoards.length === 1 &&
    ceilingBoards[0]?.material.id === "gypsum_board" &&
    thicknessNear(ceilingBoards[0]?.thicknessMm, 12.5, 3) &&
    ceilingCavity?.material.id === "acoustic_hanger_ceiling" &&
    thicknessNear(ceilingCavity.thicknessMm, 70, 30) &&
    ceilingFill?.material.id === "rockwool" &&
    thicknessNear(ceilingFill.thicknessMm, 50, 30)
  );
}

function calibrateMassTimberImpactEstimate(input: {
  basis: ImpactCalculation["basis"];
  ci: number | undefined;
  layers: readonly ResolvedLayer[] | undefined;
  lnW: number | undefined;
  lnWPlusCI: number | undefined;
  sources: readonly FloorSystemRecommendation[];
}): {
  ci: number | undefined;
  lnW: number | undefined;
  lnWPlusCI: number | undefined;
  notes: string[];
} {
  if (!input.layers || !isDataholzGdmtxa04aVisibleCalibrationBoundary(input.layers, input.basis, input.sources)) {
    return {
      ci: input.ci,
      lnW: input.lnW,
      lnWPlusCI: input.lnWPlusCI,
      notes: []
    };
  }

  // Keep the blocked GDMTXA04A visible boundary on the estimate lane, but do
  // not let that nearby-row estimate outrun the direct official exact row on
  // impact while the composite dry-screed surface remains unmodeled.
  return {
    ci: Math.max(input.ci ?? DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.CI, DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.CI),
    lnW: Math.max(input.lnW ?? DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.LnW, DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.LnW),
    lnWPlusCI: Math.max(
      input.lnWPlusCI ?? DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.LnWPlusCI,
      DATAHOLZ_GDMTXA04A_CALIBRATION_IMPACT.LnWPlusCI
    ),
    notes: [
      "The GDMTXA04A-like composite dry-screed boundary stayed on the estimate lane, and its impact outputs were capped against the direct official exact row to avoid optimistic drift."
    ]
  };
}

function hasMultipleRoleLayers(
  layers: readonly ResolvedLayer[],
  role: FloorRole
): boolean {
  return layers.filter((layer) => layer.floorRole === role).length > 1;
}

function hasRuntimeGeneratedPredictorUpperPackage(
  layers: readonly ResolvedLayer[]
): boolean {
  return layers.some(
    (layer) =>
      (layer.floorRole === "floating_screed" || layer.floorRole === "upper_fill") &&
      layer.material.id.startsWith("predictor_")
  );
}

function hasAmbiguousUpperRoleConflict(
  conflicts: readonly SingleEntryRoleConflict[]
): boolean {
  return conflicts.some((conflict) => UPPER_ROLES.includes(conflict.role));
}

function hasOpenBoxHybridFloatingScreedConflict(
  layers: readonly ResolvedLayer[],
  conflicts: readonly SingleEntryRoleConflict[]
): boolean {
  if (!conflicts.some((conflict) => conflict.role === "floating_screed")) {
    return false;
  }

  const floatingScreedMaterialIds = new Set(
    layers.filter((layer) => layer.floorRole === "floating_screed").map((layer) => layer.material.id)
  );

  return floatingScreedMaterialIds.has("geotextile") && floatingScreedMaterialIds.has("screed");
}

function collectAmbiguousSingleEntryRoleConflicts(
  layers: readonly ResolvedLayer[]
) {
  return collectSingleEntryRoleConflicts(layers);
}

function formatAmbiguousSingleEntryRoleConflict(
  conflict: SingleEntryRoleConflict
): string {
  const materialsLabel = conflict.materialLabels.length > 0 ? ` (${conflict.materialLabels.join(", ")})` : "";

  return `${conflict.role.replaceAll("_", " ")} x${conflict.count}${materialsLabel}`;
}

function formatAmbiguousSingleEntryRoleConflicts(
  conflicts: readonly SingleEntryRoleConflict[]
): string {
  return conflicts.map(formatAmbiguousSingleEntryRoleConflict).join(", ");
}

function formatCeilingBoardScheduleConflict(conflict: {
  count: number;
  materialLabels: readonly string[];
}): string {
  const materialsLabel = conflict.materialLabels.length > 0 ? ` (${conflict.materialLabels.join(", ")})` : "";

  return `ceiling board x${conflict.count}${materialsLabel}`;
}

function formatCeilingBoardTopologyConflict(
  conflict: CeilingBoardTopologyConflict
): string {
  const baseLabel = formatCeilingBoardScheduleConflict(conflict);

  return conflict.mixedSchedule
    ? baseLabel
    : `${baseLabel} split across ${conflict.scheduleSegments} separated segments`;
}

function capFitPercentForEstimateTier(
  fitPercent: number,
  kind: FloorSystemEstimateKind
): number {
  switch (kind) {
    case "family_archetype":
      return fitPercent;
    case "family_general":
      return Math.min(fitPercent, 54);
    case "low_confidence":
      return Math.min(fitPercent, 29);
  }
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

function hasSystemUpperPackage(system: ExactFloorSystem): boolean {
  return Boolean(system.match.upperFill || system.match.floatingScreed);
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
  allowSpecificBasis?: boolean;
  family: StructuralFamily;
  heavyConcreteCarrierEligible: boolean;
  currentProfile: FloorProfile;
  kind: FloorSystemEstimateKind;
  sources: readonly FloorSystemRecommendation[];
}): {
  basis: ImpactCalculation["basis"];
  label: string;
} {
  if (input.allowSpecificBasis === false) {
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
    input.heavyConcreteCarrierEligible &&
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

function isEligibleFamilyProfile(
  family: StructuralFamily,
  profile: FloorProfile
): boolean {
  if (family === "open_box_timber" && profile !== "combined") {
    return false;
  }

  return true;
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

  return [];
}

function buildRoleSignature(criteria: ExactFloorSystem["match"]["baseStructure"] | undefined): string {
  if (!criteria) {
    return "none";
  }

  const materialIds = criteria.materialIds?.join("/") ?? "*";
  const thickness = typeof criteria.thicknessMm === "number" ? String(criteria.thicknessMm) : "*";
  const layerCount = typeof criteria.layerCount === "number" ? String(criteria.layerCount) : "*";

  return `${materialIds}:${thickness}:${layerCount}`;
}

function dedupeFamilyCandidatesForCurrentProfile(
  family: StructuralFamily,
  currentProfile: FloorProfile,
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemRecommendation[] {
  if (family !== "lightweight_steel" || currentProfile !== "lower_only") {
    return recommendations.slice();
  }

  const seen = new Set<string>();
  const deduped: FloorSystemRecommendation[] = [];

  for (const recommendation of recommendations) {
    const match = recommendation.system.match;
    const signature = [
      buildRoleSignature(match.baseStructure),
      buildRoleSignature(match.ceilingCavity),
      buildRoleSignature(match.ceilingFill),
      buildRoleSignature(match.ceilingBoard)
    ].join("|");

    if (seen.has(signature)) {
      continue;
    }

    seen.add(signature);
    deduped.push(recommendation);
  }

  return deduped;
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
  sources: readonly FloorSystemRecommendation[],
  options: {
    allowSpecificBasis?: boolean;
    heavyConcreteCarrierEligible?: boolean;
    layers?: readonly ResolvedLayer[];
  } = {}
): ImpactCalculation {
  const basisInfo = resolveSpecificFamilyEstimateBasis({
    allowSpecificBasis: options.allowSpecificBasis,
    currentProfile,
    family,
    heavyConcreteCarrierEligible: options.heavyConcreteCarrierEligible ?? false,
    kind,
    sources
  });
  const lnW = weightedAverage(sources, (entry) => entry.system.impactRatings.LnW);
  const ci = weightedAverage(sources, (entry) => entry.system.impactRatings.CI);
  const ci50_2500 = weightedAverage(sources, (entry) => entry.system.impactRatings.CI50_2500);
  const lnWPlusCI = weightedAverage(sources, (entry) => entry.system.impactRatings.LnWPlusCI);
  const calibratedImpact = calibrateMassTimberImpactEstimate({
    basis: basisInfo.basis,
    ci,
    layers: options.layers,
    lnW,
    lnWPlusCI,
    sources
  });
  const availableOutputs: ImpactCalculation["availableOutputs"] = ["Ln,w"];

  if (typeof calibratedImpact.ci === "number") {
    availableOutputs.push("CI");
  }

  if (typeof ci50_2500 === "number") {
    availableOutputs.push("CI,50-2500");
  }

  if (typeof calibratedImpact.lnWPlusCI === "number") {
    availableOutputs.push("Ln,w+CI");
  }

  return {
    CI: calibratedImpact.ci,
    CI50_2500: ci50_2500,
    LnW: calibratedImpact.lnW ?? 0,
    LnWPlusCI: calibratedImpact.lnWPlusCI,
    availableOutputs,
    basis: basisInfo.basis,
    confidence: getImpactConfidenceForBasis(basisInfo.basis),
    estimateCandidateIds: sources.map((entry) => entry.system.id),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: calibratedImpact.ci,
        CI50_2500: ci50_2500,
        LnW: calibratedImpact.lnW ?? undefined,
        LnWPlusCI: calibratedImpact.lnWPlusCI
      },
      basisInfo.basis
    ),
    notes: [
      `${basisInfo.label} derived from nearby ${formatStructuralFamily(family)} rows.`,
      `Current profile ${currentProfile.replaceAll("_", " ")} stayed inside the curated ${formatStructuralFamily(family)} branch.`,
      `Source rows: ${sources.map((entry) => `${entry.system.label} (${entry.fitPercent}% fit)`).join("; ")}.`,
      ...calibratedImpact.notes,
      "This remains a labeled published-family estimate, not an exact floor-system match or a universal physical predictor."
    ],
    scope: "family_estimate"
  };
}

function restrictSourcesForSpecificImpactBasis(
  basis: ImpactCalculation["basis"],
  sources: readonly FloorSystemRecommendation[]
): readonly FloorSystemRecommendation[] {
  const sourceIdFilter =
    basis === "predictor_mass_timber_clt_dataholz_dry_estimate"
      ? (id: string) => id.startsWith("dataholz_")
      : basis === "predictor_mass_timber_clt_bare_interpolation_estimate" ||
          basis === "predictor_mass_timber_clt_dry_interaction_estimate"
        ? (id: string) => id.startsWith("tuas_")
        : null;

  if (!sourceIdFilter) {
    return sources;
  }

  const filtered = sources.filter((entry) => sourceIdFilter(entry.system.id));
  return filtered.length > 0 ? filtered : sources;
}

export function deriveFloorSystemEstimate(
  layers: readonly ResolvedLayer[],
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemEstimateResult | null {
  if (recommendations.length === 0) {
    return null;
  }

  if (hasInvalidExplicitFloorBaseStructure(layers)) {
    return null;
  }

  const structuralFamily = getLayerStructuralFamily(layers);
  const baseStructureLayer = layers.find((layer) => layer.floorRole === "base_structure");
  const heavyConcreteCarrierEligible = isResolvedHeavyConcreteCarrierEligible(baseStructureLayer);
  const hasExplicitFloorRoles = layers.some((layer) => Boolean(layer.floorRole));
  if (structuralFamily === "unknown" && !hasExplicitFloorRoles) {
    return null;
  }
  const currentProfile = getLayerProfile(layers);
  let predictorInputFromLayers:
    | ReturnType<typeof buildImpactPredictorInputFromLayerStack>
    | undefined;
  const getPredictorInputFromLayers = () => {
    if (predictorInputFromLayers !== undefined) {
      return predictorInputFromLayers;
    }

    predictorInputFromLayers = buildImpactPredictorInputFromLayerStack(
      layers.map((layer) => ({
        floorRole: layer.floorRole,
        materialId: layer.material.id,
        thicknessMm: layer.thicknessMm
      }))
    );

    return predictorInputFromLayers;
  };
  if (!isEligibleFamilyProfile(structuralFamily, currentProfile)) {
    return null;
  }

  const lowerOnlyCeilingBoardTopologyConflict =
    currentProfile === "lower_only" ? collectCeilingBoardTopologyConflict(layers) : null;

  if (structuralFamily === "composite_panel" && lowerOnlyCeilingBoardTopologyConflict) {
    const conservativePredictorEstimate = derivePredictorSpecificFloorSystemEstimate(
      getPredictorInputFromLayers()
    );

    if (conservativePredictorEstimate?.kind === "low_confidence") {
      return {
        ...conservativePredictorEstimate,
        notes: [
          ...conservativePredictorEstimate.notes,
          `${
            lowerOnlyCeilingBoardTopologyConflict.mixedSchedule
              ? "Mixed lower-board schedule"
              : "Disjoint lower-board topology"
          } stayed on the conservative composite continuation: ${formatCeilingBoardTopologyConflict(
            lowerOnlyCeilingBoardTopologyConflict
          )}.`
        ]
      };
    }
  }

  const ambiguousSingleEntryRoleConflicts = collectAmbiguousSingleEntryRoleConflicts(layers);
  const lowerOnlyHelperRoleConflicts =
    currentProfile === "lower_only"
      ? ambiguousSingleEntryRoleConflicts.filter(
          (conflict) => conflict.role === "ceiling_fill" || conflict.role === "ceiling_cavity"
        )
      : [];
  const familyPool = dedupeFamilyCandidatesForCurrentProfile(
    structuralFamily,
    currentProfile,
    getFamilyEstimatePool(structuralFamily, recommendations)
  );
  const profileAligned = familyPool.filter((entry) => compatibleProfiles(currentProfile, getSystemProfile(entry.system)));
  const massTimberLowerOnlyTierHold = structuralFamily === "mass_timber_clt" && currentProfile === "lower_only";
  const massTimberCombinedProfileTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    profileAligned.length === 0;
  const massTimberCombinedVisibleUpperPackageTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    hasUpperPackageRole(layers) &&
    !profileAligned.some((entry) => hasSystemUpperPackage(entry.system));
  const massTimberCombinedAmbiguousUpperTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    hasAmbiguousUpperRoleConflict(ambiguousSingleEntryRoleConflicts);
  const massTimberCombinedMultiEntryFloatingScreedTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    hasMultipleRoleLayers(layers, "floating_screed");
  const massTimberCombinedRuntimeGeneratedUpperPackageTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    hasRuntimeGeneratedPredictorUpperPackage(layers);
  const massTimberCombinedIncompleteLowerTreatmentTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "combined" &&
    hasVisibleLowerTreatmentWithoutCavity(layers);
  // The TUAS CLT upper-only interpolation is only source-backed for laminate
  // over thin EPS; keep partial finish packages on screening instead.
  const massTimberIncompleteBareInterpolationFinishTierHold =
    structuralFamily === "mass_timber_clt" &&
    currentProfile === "upper_only" &&
    !hasUpperPackageRole(layers) &&
    !hasSingleSourceBackedLaminateUnderlayPackage(layers);
  // TUAS CLT measured/published interaction rows also carry the thin
  // laminate/EPS finish; malformed walking finishes must not re-enter through
  // same-family fallback after the direct predictor rejects them.
  // Use pair detection here because wet/dry upper packages may also contain
  // source-backed EPS board layers that are not the thin walking underlay.
  const massTimberMalformedLaminateUnderlayFinishTierHold =
    structuralFamily === "mass_timber_clt" &&
    (currentProfile === "upper_only" || currentProfile === "heavy_floating" || currentProfile === "combined") &&
    hasUpperPackageRole(layers) &&
    hasLaminateUnderlayFinishInput(layers) &&
    !hasSourceBackedLaminateUnderlayPair(layers);
  // TUAS open-box hybrid upper packages are source-backed only while the staged
  // upper schedule stays exact; if exact matching falls off because upper roles
  // are split or mixed out of order, do not reopen impact through family blending.
  const openBoxCombinedAmbiguousUpperTierHold =
    structuralFamily === "open_box_timber" &&
    currentProfile === "combined" &&
    hasOpenBoxHybridFloatingScreedConflict(layers, ambiguousSingleEntryRoleConflicts);
  // TUAS open-box source rows that expose a walking finish share the same thin
  // laminate/EPS pair. If that pair is incomplete or visibly outside the source
  // band, exact fallout must not reopen through basic/dry/hybrid family blends.
  const openBoxMalformedLaminateUnderlayFinishTierHold =
    structuralFamily === "open_box_timber" &&
    currentProfile === "combined" &&
    hasLaminateUnderlayFinishInput(layers) &&
    !hasSourceBackedOpenBoxLaminateUnderlayPair(layers);
  const lightweightSteelOpenWebUpperOnlyTierHold =
    structuralFamily === "lightweight_steel" &&
    baseStructureLayer?.material.id === "open_web_steel_floor" &&
    (currentProfile === "upper_only" || currentProfile === "heavy_floating");
  // UBIQ publishes carpet + foam-underlay open-web rows as a combined
  // Ln,w+CI upper bound only. If exact bound matching falls off, do not borrow
  // nearby bare/timber exact rows to fabricate exact Ln,w, CI, or field values.
  const lightweightSteelOpenWebCarpetBoundOnlyTierHold =
    structuralFamily === "lightweight_steel" &&
    hasBoundOnlyUbiqOpenWebCarpetCombinedProfile(layers);

  if (lightweightSteelOpenWebCarpetBoundOnlyTierHold) {
    return null;
  }

  if (structuralFamily === "lightweight_steel") {
    const fl28Estimate = deriveLightweightSteelFl28Estimate(layers, recommendations);
    if (fl28Estimate) {
      return fl28Estimate;
    }
  }

  const lightweightSteelLowerOnlyCeilingBoardTierHold =
    structuralFamily === "lightweight_steel" &&
    currentProfile === "lower_only" &&
    Boolean(lowerOnlyCeilingBoardTopologyConflict && lowerOnlyCeilingBoardTopologyConflict.scheduleSegments > 1);
  const lightweightSteelLowerOnlyHelperTierHold =
    structuralFamily === "lightweight_steel" && currentProfile === "lower_only" && lowerOnlyHelperRoleConflicts.length > 0;
  const compositeLowerOnlyHelperTierHold =
    structuralFamily === "composite_panel" && currentProfile === "lower_only" && lowerOnlyHelperRoleConflicts.length > 0;
  const lowerOnlyFamilyGeneralTierHold =
    lightweightSteelLowerOnlyCeilingBoardTierHold ||
    lightweightSteelLowerOnlyHelperTierHold ||
    compositeLowerOnlyHelperTierHold;

  if (
    massTimberLowerOnlyTierHold ||
    massTimberCombinedProfileTierHold ||
    massTimberCombinedVisibleUpperPackageTierHold ||
    massTimberCombinedAmbiguousUpperTierHold ||
    massTimberCombinedMultiEntryFloatingScreedTierHold ||
    massTimberCombinedRuntimeGeneratedUpperPackageTierHold ||
    massTimberCombinedIncompleteLowerTreatmentTierHold ||
    massTimberIncompleteBareInterpolationFinishTierHold ||
    massTimberMalformedLaminateUnderlayFinishTierHold ||
    openBoxCombinedAmbiguousUpperTierHold ||
    openBoxMalformedLaminateUnderlayFinishTierHold ||
    // UBIQ FL-23/25/27 upper-only open-web source rows are materially weaker
    // than the imported FL-24/26/28 lower-treatment corridor. Until those rows
    // are imported explicitly, do not borrow lower-treatment ratings here.
    lightweightSteelOpenWebUpperOnlyTierHold
  ) {
    return null;
  }

  const archetypeCandidates =
    ambiguousSingleEntryRoleConflicts.length === 0 && !lowerOnlyFamilyGeneralTierHold
      ? profileAligned.filter((entry) => entry.fitPercent >= 55).slice(0, 3)
      : [];
  const generalCandidates = lowerOnlyFamilyGeneralTierHold
    ? []
    : familyPool.filter((entry) => entry.fitPercent >= 30).slice(0, 3);
  const lowConfidencePool = structuralFamily === "unknown" ? recommendations : familyPool;
  const lowConfidenceCandidates = lowConfidencePool.filter((entry) => entry.fitPercent >= 20).slice(0, 3);

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

  const allowSpecificBasis = ambiguousSingleEntryRoleConflicts.length === 0;
  const estimateBasisInfo = resolveSpecificFamilyEstimateBasis({
    allowSpecificBasis,
    currentProfile,
    family: structuralFamily,
    heavyConcreteCarrierEligible,
    kind: activeKindAndSources.kind,
    sources: activeKindAndSources.sources
  });
  const estimateSources = restrictSourcesForSpecificImpactBasis(
    estimateBasisInfo.basis,
    activeKindAndSources.sources
  );

  const rawFitPercent = round1(
    estimateSources.reduce((sum, entry) => sum + entry.fitPercent, 0) / estimateSources.length
  );
  const fitPercent =
    ambiguousSingleEntryRoleConflicts.length > 0 || lowerOnlyFamilyGeneralTierHold
      ? round1(capFitPercentForEstimateTier(rawFitPercent, activeKindAndSources.kind))
      : rawFitPercent;
  const airborneRw = weightedAverage(estimateSources, (entry) => entry.system.airborneRatings.Rw);
  const companionSemantic = getStableCompanionSemantic(estimateSources);
  const airborneCompanion =
    companionSemantic
      ? weightedAverage(estimateSources, (entry) => entry.system.airborneRatings.RwCtr)
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
    impact: buildImpactEstimate(activeKindAndSources.kind, structuralFamily, currentProfile, estimateSources, {
      allowSpecificBasis,
      heavyConcreteCarrierEligible,
      layers
    }),
    kind: activeKindAndSources.kind,
    notes: [
      `Active family: ${formatStructuralFamily(structuralFamily)}.`,
      `Current profile: ${currentProfile.replaceAll("_", " ")}.`,
      `Estimate fit: ${fitPercent}%.`,
      ...(ambiguousSingleEntryRoleConflicts.length > 0
        ? [
            `Archetype-level family matching was withheld because single-entry roles are duplicated or split in the visible stack: ${ambiguousSingleEntryRoleConflicts
              .map(formatAmbiguousSingleEntryRoleConflict)
              .join(", ")}.`
          ]
        : []),
      ...(lightweightSteelLowerOnlyCeilingBoardTierHold && lowerOnlyCeilingBoardTopologyConflict
        ? [
            `Family-general lightweight-steel matching was withheld because the lower-only ceiling-board topology is split in the visible stack: ${formatCeilingBoardTopologyConflict(
              lowerOnlyCeilingBoardTopologyConflict
            )}.`
          ]
        : []),
      ...(lightweightSteelLowerOnlyHelperTierHold
        ? [
            `Family-general lightweight-steel matching was withheld because the lower-only helper topology is split in the visible stack: ${formatAmbiguousSingleEntryRoleConflicts(
              lowerOnlyHelperRoleConflicts
            )}.`
          ]
        : []),
      ...(compositeLowerOnlyHelperTierHold
        ? [
            `Lower-only helper topology stayed on the conservative composite continuation: ${formatAmbiguousSingleEntryRoleConflicts(
              lowerOnlyHelperRoleConflicts
            )}.`
          ]
        : []),
      ...(fitPercent < rawFitPercent
        ? [
            `Displayed fit was capped from ${rawFitPercent}% to ${fitPercent}% so the estimate posture stays inside the active ${activeKindAndSources.kind.replaceAll("_", " ")} tier.`
          ]
        : []),
      ...(companionSemantic === "ctr_term"
        ? ["Published airborne companion remains a Ctr adaptation term from Rw(C;Ctr) family rows."]
        : companionSemantic === "rw_plus_c"
          ? ["Published airborne companion remains a direct Rw + C family figure."]
          : companionSemantic === "rw_plus_ctr"
          ? ["Published airborne companion remains a direct Rw + Ctr family figure."]
          : ["Published family rows did not expose a stable companion airborne figure across the supporting sources."]),
      ...estimateSources.flatMap((entry) =>
        entry.missingSignals.slice(0, 2).map((signal) => `${entry.system.label}: ${signal}`)
      )
    ],
    sourceSystems: estimateSources.map((entry) => entry.system),
    structuralFamily: formatStructuralFamily(structuralFamily)
  };
}
