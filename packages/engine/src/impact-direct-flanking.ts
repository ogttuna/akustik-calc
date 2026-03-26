import type {
  ExactImpactSource,
  ImpactCalculation,
  ImpactFieldContext,
  ImpactFlankingPath,
  ImpactSupportingElementFamily,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { computeImpactSpectrumAdaptationTerms, computeImpactWeightedRating } from "./impact-iso717";
import { createImpactMetricBasis, mergeImpactMetricBasis } from "./impact-metric-basis";
import { inferImpactSupportingElementFamilyFromLayers } from "./impact-supporting-element-family";
import { buildImpactTraceFromDerivedCurves } from "./impact-trace";
import { clamp, ksRound1, log10Safe } from "./math";

type DirectFlankingResult = {
  impact: ImpactCalculation;
  warnings: string[];
};

type DirectFlankingCandidateInput = {
  defaultSupportingElementFamily?: ImpactSupportingElementFamily | null;
  exactImpactSource?: ExactImpactSource | null;
  fieldContext: ImpactFieldContext;
  impact: ImpactCalculation;
  resolvedLayers?: readonly ResolvedLayer[] | null;
};

type ImpactPathFamilyProfile = {
  biasDb: number;
  family: string;
  isolationScale: number;
  junctionScale: number;
  lengthScale: number;
  pathTypeScales: Record<string, number>;
  shortCircuitScale: number;
};

type PathComputation = {
  curveValuesDb?: number[];
  familyAwareModelApplied: boolean;
  pathModifierDb: number;
  supportingElementFamily: ImpactSupportingElementFamily | null;
};

const IMPACT_PATH_FAMILY_PROFILES: Record<ImpactSupportingElementFamily, Omit<ImpactPathFamilyProfile, "family">> = {
  reinforced_concrete: {
    biasDb: 0.4,
    isolationScale: 1.15,
    junctionScale: 1.1,
    lengthScale: 0.95,
    pathTypeScales: {
      ceiling: 0.8,
      direct: 0,
      edge: 1.2,
      perimeter: 1.25,
      service: 1.1,
      structure: 1.05,
      wall: 0.9
    },
    shortCircuitScale: 1.05
  },
  hollow_core: {
    biasDb: 0.6,
    isolationScale: 1.25,
    junctionScale: 1.15,
    lengthScale: 1,
    pathTypeScales: {
      ceiling: 0.9,
      direct: 0,
      edge: 1.35,
      perimeter: 1.45,
      service: 1.2,
      structure: 1.2,
      wall: 1
    },
    shortCircuitScale: 1.1
  },
  timber_joists: {
    biasDb: 0.9,
    isolationScale: 1.45,
    junctionScale: 1,
    lengthScale: 1.1,
    pathTypeScales: {
      ceiling: 1.2,
      direct: 0,
      edge: 1.35,
      perimeter: 1.4,
      service: 1.25,
      structure: 1.25,
      wall: 1.1
    },
    shortCircuitScale: 1.55
  },
  open_box_timber: {
    biasDb: 0.8,
    isolationScale: 1.35,
    junctionScale: 1,
    lengthScale: 1.05,
    pathTypeScales: {
      ceiling: 1.15,
      direct: 0,
      edge: 1.25,
      perimeter: 1.3,
      service: 1.2,
      structure: 1.2,
      wall: 1.05
    },
    shortCircuitScale: 1.45
  },
  mass_timber_clt: {
    biasDb: 0.7,
    isolationScale: 1.3,
    junctionScale: 1.05,
    lengthScale: 1,
    pathTypeScales: {
      ceiling: 1.05,
      direct: 0,
      edge: 1.25,
      perimeter: 1.3,
      service: 1.15,
      structure: 1.15,
      wall: 1
    },
    shortCircuitScale: 1.35
  },
  steel_joists: {
    biasDb: 1,
    isolationScale: 1.55,
    junctionScale: 1.05,
    lengthScale: 1.15,
    pathTypeScales: {
      ceiling: 1.25,
      direct: 0,
      edge: 1.4,
      perimeter: 1.45,
      service: 1.35,
      structure: 1.3,
      wall: 1.15
    },
    shortCircuitScale: 1.6
  },
  composite_panel: {
    biasDb: 0.9,
    isolationScale: 1.4,
    junctionScale: 1.05,
    lengthScale: 1.1,
    pathTypeScales: {
      ceiling: 1.15,
      direct: 0,
      edge: 1.35,
      perimeter: 1.4,
      service: 1.25,
      structure: 1.25,
      wall: 1.05
    },
    shortCircuitScale: 1.45
  }
};

function getImpactPathFamilyProfile(
  supportingElementFamily: ImpactSupportingElementFamily | null
): ImpactPathFamilyProfile {
  const family = supportingElementFamily ?? "generic";
  const generic: ImpactPathFamilyProfile = {
    biasDb: 0,
    family,
    isolationScale: 1,
    junctionScale: 1,
    lengthScale: 1,
    pathTypeScales: {
      ceiling: 1,
      direct: 0,
      edge: 1,
      perimeter: 1,
      service: 1,
      structure: 1,
      wall: 1
    },
    shortCircuitScale: 1
  };

  if (!supportingElementFamily) {
    return generic;
  }

  return {
    ...generic,
    ...IMPACT_PATH_FAMILY_PROFILES[supportingElementFamily],
    family: supportingElementFamily,
    pathTypeScales: {
      ...generic.pathTypeScales,
      ...IMPACT_PATH_FAMILY_PROFILES[supportingElementFamily].pathTypeScales
    }
  };
}

function scaleImpactPathModifier(baseValue: number, scale = 1): number {
  return ksRound1(baseValue * scale);
}

function buildPathModifier(
  path: ImpactFlankingPath,
  defaultSupportingElementFamily: ImpactSupportingElementFamily | null
): PathComputation {
  const supportingElementFamily = path.supportingElementFamily ?? defaultSupportingElementFamily;
  const familyProfile = getImpactPathFamilyProfile(supportingElementFamily);
  const explicitModifierDb = path.kijDb ?? 0;
  const pathPenaltyDb = path.pathPenaltyDb ?? 0;
  const rawJunctionLengthModifierDb =
    typeof path.junctionLengthM === "number" && path.junctionLengthM > 0
      ? clamp(10 * log10Safe(path.junctionLengthM), -6, 6)
      : 0;
  const rawPathTypeModifierDb = path.pathType
    ? {
        ceiling: 0.5,
        edge: 1,
        perimeter: 1.2,
        service: 2,
        structure: 0.8,
        wall: 0.5
      }[path.pathType] ?? 0
    : 0;
  const rawJunctionModifierDb = path.junctionClass
    ? {
        continuous: 1.5,
        flexible: -1,
        isolated: -2,
        resilient: -1.5,
        rigid: 1
      }[path.junctionClass] ?? 0
    : 0;
  const rawEdgeIsolationModifierDb = path.edgeIsolationClass
    ? {
        isolated: -3,
        partial: -1,
        rigid: 1.5,
        short_circuit: 3
      }[path.edgeIsolationClass] ?? 0
    : 0;
  const rawShortCircuitModifierDb = path.shortCircuitRisk
    ? {
        high: 3,
        low: 0,
        medium: 1.5,
        severe: 5
      }[path.shortCircuitRisk] ?? 0
    : 0;

  const pathTypeModifierDb = scaleImpactPathModifier(
    rawPathTypeModifierDb,
    familyProfile.pathTypeScales[path.pathType ?? ""] ?? 1
  );
  const junctionModifierDb = scaleImpactPathModifier(rawJunctionModifierDb, familyProfile.junctionScale);
  const edgeIsolationModifierDb = scaleImpactPathModifier(rawEdgeIsolationModifierDb, familyProfile.isolationScale);
  const shortCircuitModifierDb = scaleImpactPathModifier(rawShortCircuitModifierDb, familyProfile.shortCircuitScale);
  const junctionLengthModifierDb = scaleImpactPathModifier(rawJunctionLengthModifierDb, familyProfile.lengthScale);
  const supportFamilyModifierDb = ksRound1(path.pathType === undefined ? 0 : familyProfile.biasDb);

  return {
    familyAwareModelApplied: Boolean(supportingElementFamily),
    pathModifierDb: ksRound1(
      clamp(
        explicitModifierDb +
          pathPenaltyDb +
          junctionLengthModifierDb +
          pathTypeModifierDb +
          junctionModifierDb +
          edgeIsolationModifierDb +
          shortCircuitModifierDb +
          supportFamilyModifierDb,
        -8,
        8
      )
    ),
    supportingElementFamily
  };
}

function buildShiftedCurve(
  levelsDb: readonly number[],
  offsetDb: number
): number[] {
  return levelsDb.map((value) => ksRound1(value + offsetDb));
}

function sumImpactLevels(levelsDb: readonly number[]): number {
  const totalEnergy = levelsDb.reduce((sum, level) => sum + Math.pow(10, level / 10), 0);
  return totalEnergy > 0 ? ksRound1(10 * log10Safe(totalEnergy)) : Number.NaN;
}

function sumImpactCurves(curves: readonly number[][]): number[] | null {
  if (!curves.length) {
    return null;
  }

  const referenceLength = curves[0]?.length ?? 0;
  if (!referenceLength || curves.some((curve) => curve.length !== referenceLength)) {
    return null;
  }

  return curves[0].map((_, index) => {
    const totalEnergy = curves.reduce((sum, curve) => sum + Math.pow(10, curve[index] / 10), 0);
    return totalEnergy > 0 ? ksRound1(10 * log10Safe(totalEnergy)) : Number.NaN;
  });
}

function hasDirectFlankingContext(
  fieldContext: ImpactFieldContext | null | undefined,
  allowDirectOnly: boolean
): boolean {
  const hasFlankingPaths = Array.isArray(fieldContext?.flankingPaths) && fieldContext.flankingPaths.length > 0;
  const hasExplicitDirectOffset = typeof fieldContext?.directPathOffsetDb === "number";
  const hasFlankingDrivenOffset = hasFlankingPaths && typeof fieldContext?.fieldKDb === "number";

  return Boolean(
    fieldContext &&
      (hasExplicitDirectOffset || hasFlankingDrivenOffset) &&
      (hasFlankingPaths || (allowDirectOnly && hasExplicitDirectOffset))
  );
}

function buildAvailableOutputs(baseImpact: ImpactCalculation, hasStandardizedField: boolean): ImpactCalculation["availableOutputs"] {
  const availableOutputs = [...baseImpact.availableOutputs];

  if (!availableOutputs.includes("L'n,w")) {
    availableOutputs.push("L'n,w");
  }
  if (hasStandardizedField && !availableOutputs.includes("L'nT,w")) {
    availableOutputs.push("L'nT,w");
  }
  if (hasStandardizedField && typeof baseImpact.CI50_2500 === "number" && !availableOutputs.includes("L'nT,50")) {
    availableOutputs.push("L'nT,50");
  }

  return availableOutputs;
}

function resolveMixedBasis(baseImpact: ImpactCalculation, standardizedField: boolean): ImpactCalculation["basis"] {
  const exactBases = new Set<ImpactCalculation["basis"]>([
    "exact_source_band_curve_iso7172",
    "official_floor_system_exact_match",
    "open_measured_floor_system_exact_match",
    "peer_reviewed_floor_system_exact_match",
    "predictor_catalog_exact_match_official"
  ]);

  if (exactBases.has(baseImpact.basis)) {
    return standardizedField
      ? "mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum"
      : "mixed_exact_plus_estimated_direct_flanking_energy_sum";
  }

  return standardizedField
    ? "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum"
    : "mixed_predicted_plus_estimated_direct_flanking_energy_sum";
}

function buildCurveDerivedFieldMetrics(
  exactImpactSource: ExactImpactSource,
  fieldCurveDb: readonly number[],
  standardizedCurveDb: readonly number[] | null
): {
  ci: number | undefined;
  ci50_2500: number | undefined;
  lPrimeNT50: number | undefined;
  lPrimeNTw: number | undefined;
  lPrimeNW: number | undefined;
} {
  const weightedField = computeImpactWeightedRating(exactImpactSource.frequenciesHz, fieldCurveDb);
  const lPrimeNW = Number.isFinite(weightedField.value) ? ksRound1(weightedField.value) : undefined;
  const fieldAdaptation =
    typeof lPrimeNW === "number"
      ? computeImpactSpectrumAdaptationTerms(exactImpactSource.frequenciesHz, fieldCurveDb, lPrimeNW)
      : null;
  const ci = fieldAdaptation && Number.isFinite(fieldAdaptation.ci) ? ksRound1(fieldAdaptation.ci) : undefined;
  const ci50_2500 =
    fieldAdaptation && Number.isFinite(fieldAdaptation.ci50_2500) ? ksRound1(fieldAdaptation.ci50_2500) : undefined;

  if (!standardizedCurveDb) {
    return {
      ci,
      ci50_2500,
      lPrimeNT50: undefined,
      lPrimeNTw: undefined,
      lPrimeNW
    };
  }

  const weightedStandardized = computeImpactWeightedRating(exactImpactSource.frequenciesHz, standardizedCurveDb);
  const lPrimeNTw = Number.isFinite(weightedStandardized.value) ? ksRound1(weightedStandardized.value) : undefined;
  const standardizedAdaptation =
    typeof lPrimeNTw === "number"
      ? computeImpactSpectrumAdaptationTerms(exactImpactSource.frequenciesHz, standardizedCurveDb, lPrimeNTw)
      : null;
  const standardizedCi50 =
    standardizedAdaptation && Number.isFinite(standardizedAdaptation.ci50_2500)
      ? ksRound1(standardizedAdaptation.ci50_2500)
      : ci50_2500;

  return {
    ci,
    ci50_2500: standardizedCi50,
    lPrimeNT50:
      typeof lPrimeNTw === "number" && typeof standardizedCi50 === "number"
        ? ksRound1(lPrimeNTw + standardizedCi50)
        : undefined,
    lPrimeNTw,
    lPrimeNW
  };
}

export function applyDirectFlankingFieldEstimate(
  input: DirectFlankingCandidateInput
): DirectFlankingResult | null {
  if (!hasDirectFlankingContext(input.fieldContext, Boolean(input.exactImpactSource))) {
    return null;
  }

  if (input.impact.labOrField === "field") {
    return null;
  }

  const directOffsetDb = ksRound1(
    input.fieldContext.directPathOffsetDb ?? input.fieldContext.fieldKDb ?? 0
  );
  const lowerTreatmentReductionDb =
    typeof input.fieldContext.lowerTreatmentReductionDb === "number"
      ? ksRound1(input.fieldContext.lowerTreatmentReductionDb)
      : undefined;
  const defaultSupportingElementFamily =
    input.defaultSupportingElementFamily ?? inferImpactSupportingElementFamilyFromLayers(input.resolvedLayers);
  const flankingPaths = input.fieldContext.flankingPaths ?? [];
  const computedPaths = flankingPaths.map((path) => {
    const modifier = buildPathModifier(path, defaultSupportingElementFamily);
    return {
      ...modifier,
      countOffsetDb: path.pathCount > 1 ? ksRound1(10 * log10Safe(path.pathCount)) : 0,
      path
    };
  });
  const expertModifiedCount = computedPaths.filter((entry) => Math.abs(entry.pathModifierDb) > 0.05).length;
  const familyModels = Array.from(
    new Set(
      computedPaths
        .filter((entry) => entry.familyAwareModelApplied && entry.supportingElementFamily)
        .map((entry) => entry.supportingElementFamily as string)
    )
  );
  const pathModifierValues = computedPaths.map((entry) => entry.pathModifierDb);
  const maxPathModifierDb =
    pathModifierValues.length > 0 ? ksRound1(Math.max(...pathModifierValues)) : undefined;
  const standardizedOffsetDb =
    typeof input.fieldContext.receivingRoomVolumeM3 === "number" && input.fieldContext.receivingRoomVolumeM3 > 0
      ? ksRound1(10 * log10Safe(31.3 / input.fieldContext.receivingRoomVolumeM3))
      : undefined;

  const exactCurve = input.exactImpactSource
    ? buildShiftedCurve(
        input.exactImpactSource.levelsDb,
        directOffsetDb - (lowerTreatmentReductionDb ?? 0)
      )
    : null;
  const flankingCurves = input.exactImpactSource
    ? computedPaths.map((entry) =>
        buildShiftedCurve(
          input.exactImpactSource!.levelsDb,
          (entry.path.levelOffsetDb ?? 0) + entry.countOffsetDb + entry.pathModifierDb
        )
      )
    : [];
  const exactFieldCurve =
    exactCurve && flankingCurves.length > 0
      ? sumImpactCurves([exactCurve, ...flankingCurves])
      : exactCurve;
  const standardizedCurve =
    exactFieldCurve && typeof standardizedOffsetDb === "number"
      ? buildShiftedCurve(exactFieldCurve, standardizedOffsetDb)
      : null;

  const singleNumberDirect = typeof input.impact.LnW === "number"
    ? ksRound1(input.impact.LnW + directOffsetDb - (lowerTreatmentReductionDb ?? 0))
    : undefined;
  const singleNumberFlanking = typeof input.impact.LnW === "number"
    ? computedPaths.map((entry) =>
        ksRound1(input.impact.LnW! + (entry.path.levelOffsetDb ?? 0) + entry.countOffsetDb + entry.pathModifierDb)
      )
    : [];
  const singleNumberField =
    typeof singleNumberDirect === "number" && singleNumberFlanking.length > 0
      ? sumImpactLevels([singleNumberDirect, ...singleNumberFlanking])
      : undefined;

  const derivedCurveMetrics =
    input.exactImpactSource && exactFieldCurve
      ? buildCurveDerivedFieldMetrics(input.exactImpactSource, exactFieldCurve, standardizedCurve)
      : null;

  const lPrimeNW =
    derivedCurveMetrics?.lPrimeNW ??
    (typeof singleNumberField === "number" && Number.isFinite(singleNumberField) ? singleNumberField : undefined);

  if (typeof lPrimeNW !== "number") {
    return null;
  }

  const standardizedField = typeof standardizedOffsetDb === "number";
  const lPrimeNTw =
    derivedCurveMetrics?.lPrimeNTw ??
    (standardizedField ? ksRound1(lPrimeNW + standardizedOffsetDb) : undefined);
  const ci50_2500 = derivedCurveMetrics?.ci50_2500 ?? input.impact.CI50_2500;
  const lPrimeNT50 =
    derivedCurveMetrics?.lPrimeNT50 ??
    (typeof lPrimeNTw === "number" && typeof ci50_2500 === "number"
      ? ksRound1(lPrimeNTw + ci50_2500)
      : undefined);
  const basis = resolveMixedBasis(input.impact, standardizedField && typeof lPrimeNTw === "number");

  const impact: ImpactCalculation = {
    ...input.impact,
    CI: derivedCurveMetrics?.ci ?? input.impact.CI,
    CI50_2500: ci50_2500,
    LPrimeNT50: lPrimeNT50 ?? input.impact.LPrimeNT50,
    LPrimeNTw: lPrimeNTw ?? input.impact.LPrimeNTw,
    LPrimeNW: lPrimeNW,
    availableOutputs: buildAvailableOutputs(input.impact, typeof lPrimeNTw === "number"),
    basis,
    confidence: getImpactConfidenceForBasis(basis),
    fieldEstimateDefaultSupportingElementFamily: defaultSupportingElementFamily ?? undefined,
    fieldEstimateDirectOffsetDb: directOffsetDb,
    fieldEstimateExpertPathModifierCount: expertModifiedCount > 0 ? expertModifiedCount : undefined,
    fieldEstimateFlankingFamilyModels: familyModels.length > 0 ? familyModels : undefined,
    fieldEstimateFlankingPathCount: flankingPaths.length > 0 ? flankingPaths.length : undefined,
    fieldEstimateFlankingPathModifiersDb: pathModifierValues.length > 0 ? pathModifierValues : undefined,
    fieldEstimateLowerTreatmentBandReduction: false,
    fieldEstimateLowerTreatmentReductionDb: lowerTreatmentReductionDb,
    fieldEstimateMaxPathModifierDb: maxPathModifierDb,
    fieldEstimateProfile: "direct_flanking_energy_sum",
    metricBasis: mergeImpactMetricBasis(
      input.impact.metricBasis,
      createImpactMetricBasis({
        LPrimeNT50:
          typeof lPrimeNT50 === "number"
            ? "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500"
            : undefined,
        LPrimeNTw:
          typeof lPrimeNTw === "number"
            ? "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
            : undefined,
        LPrimeNW: "estimated_field_lprimenw_from_direct_flanking_energy_sum"
      })
    ),
    notes: [
      ...input.impact.notes,
      exactCurve
        ? `Direct+flanking field estimate re-rated the supplied impact curve with ${flankingPaths.length} active flanking path(s).`
        : `Direct+flanking field estimate used a weighted-impact energy sum with ${flankingPaths.length} active flanking path(s) because no exact impact curve was available.`,
      ...(familyModels.length > 0
        ? [`Family-aware flanking path models stayed active for: ${familyModels.join(", ")}.`]
        : [])
    ],
    trace:
      input.exactImpactSource && exactFieldCurve
        ? buildImpactTraceFromDerivedCurves({
            exactImpactSource: input.exactImpactSource,
            fieldCurveDb: exactFieldCurve,
            standardizedCurveDb: standardizedCurve
          })
        : input.impact.trace,
    standardizedFieldEstimateProfile:
      typeof lPrimeNTw === "number"
        ? "standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
        : input.impact.standardizedFieldEstimateProfile,
    standardizedFieldOffsetDb:
      typeof lPrimeNTw === "number" ? standardizedOffsetDb : input.impact.standardizedFieldOffsetDb,
    standardizedFieldVolumeM3:
      typeof lPrimeNTw === "number" && typeof input.fieldContext.receivingRoomVolumeM3 === "number"
        ? input.fieldContext.receivingRoomVolumeM3
        : input.impact.standardizedFieldVolumeM3
  };

  const warnings = [
    exactCurve
      ? "Field-side L'n,w was estimated from a direct+flanking path energy sum using band-by-band impact curves and then re-rated with ISO 717-2."
      : "Field-side L'n,w was estimated from a direct+flanking energy sum on the available weighted impact rating. This remains a single-number approximation because no exact impact band curve was available.",
    ...(typeof lPrimeNTw === "number"
      ? [
          exactCurve
            ? "Field-side L'nT,w was estimated from the direct+flanking band curve using room-volume standardization and then re-rated with ISO 717-2."
            : "Field-side L'nT,w was estimated from the direct+flanking weighted field result using room-volume standardization."
        ]
      : []),
    ...(typeof lPrimeNT50 === "number"
      ? ["Field-side L'nT,50 was estimated from the standardized direct+flanking field path and CI,50-2500."]
      : []),
    ...(typeof lowerTreatmentReductionDb === "number"
      ? ["An explicit impact-side lower-treatment reduction ΔLd was applied to the direct path before direct+flanking energy summation; this was not inferred from airborne ΔR."]
      : []),
    ...(expertModifiedCount > 0
      ? ["Explicit flanking-path modifiers were also applied from expert junction inputs (length / isolation / short-circuit / Kij-style penalties)."]
      : [])
  ];

  return {
    impact,
    warnings
  };
}
