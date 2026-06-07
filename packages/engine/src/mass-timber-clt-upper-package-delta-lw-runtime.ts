import {
  ImpactCalculationSchema,
  type ExactFloorSystem,
  type ImpactCalculation,
  type ImpactEstimateBasis
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { createImpactMetricBasis } from "./impact-metric-basis";
import { mergeImpactCalculations } from "./impact-merge";

export const MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS =
  "open_measured_floor_system_exact_match" as const satisfies ImpactEstimateBasis;

export const MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID =
  "candidate_mass_timber_clt_upper_package_delta_lw_same_source_pair" as const;

export type MassTimberCltUpperPackageDeltaLwSameSourcePair = {
  readonly carrierThicknessMm: 140 | 260;
  readonly deltaLw: number;
  readonly eligibleRuntimeTemplateId: string;
  readonly referenceLnW: number;
  readonly referenceSystemId: string;
  readonly sourceFamilyId: "tuas_open_measured_clt_upper_only";
  readonly treatedLnW: number;
  readonly treatedSystemId: string;
  readonly treatmentClass: "staged_dry_upper_package" | "heavy_dry_upper_package" | "wet_screed_upper_package";
};

export const MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS = [
  {
    carrierThicknessMm: 140,
    deltaLw: 9,
    eligibleRuntimeTemplateId: "tuas_x3_clt140_upper_package_delta_lw_pair",
    referenceLnW: 61,
    referenceSystemId: "tuas_x2_clt140_measured_2026",
    sourceFamilyId: "tuas_open_measured_clt_upper_only",
    treatedLnW: 52,
    treatedSystemId: "tuas_x3_clt140_measured_2026",
    treatmentClass: "staged_dry_upper_package"
  },
  {
    carrierThicknessMm: 140,
    deltaLw: 11,
    eligibleRuntimeTemplateId: "tuas_x4_clt140_upper_package_delta_lw_pair",
    referenceLnW: 61,
    referenceSystemId: "tuas_x2_clt140_measured_2026",
    sourceFamilyId: "tuas_open_measured_clt_upper_only",
    treatedLnW: 50,
    treatedSystemId: "tuas_x4_clt140_measured_2026",
    treatmentClass: "heavy_dry_upper_package"
  },
  {
    carrierThicknessMm: 260,
    deltaLw: 8,
    eligibleRuntimeTemplateId: "tuas_c3_clt260_upper_package_delta_lw_pair",
    referenceLnW: 55,
    referenceSystemId: "tuas_c2_clt260_measured_2026",
    sourceFamilyId: "tuas_open_measured_clt_upper_only",
    treatedLnW: 47,
    treatedSystemId: "tuas_c3_clt260_measured_2026",
    treatmentClass: "staged_dry_upper_package"
  },
  {
    carrierThicknessMm: 260,
    deltaLw: 10,
    eligibleRuntimeTemplateId: "tuas_c4_clt260_upper_package_delta_lw_pair",
    referenceLnW: 55,
    referenceSystemId: "tuas_c2_clt260_measured_2026",
    sourceFamilyId: "tuas_open_measured_clt_upper_only",
    treatedLnW: 45,
    treatedSystemId: "tuas_c4_clt260_measured_2026",
    treatmentClass: "heavy_dry_upper_package"
  },
  {
    carrierThicknessMm: 260,
    deltaLw: 16,
    eligibleRuntimeTemplateId: "tuas_c7_clt260_upper_package_delta_lw_pair",
    referenceLnW: 55,
    referenceSystemId: "tuas_c2_clt260_measured_2026",
    sourceFamilyId: "tuas_open_measured_clt_upper_only",
    treatedLnW: 39,
    treatedSystemId: "tuas_c7_clt260_measured_2026",
    treatmentClass: "wet_screed_upper_package"
  }
] as const satisfies readonly MassTimberCltUpperPackageDeltaLwSameSourcePair[];

const ACCEPTED_PAIR_BY_TREATED_SYSTEM_ID = new Map<string, MassTimberCltUpperPackageDeltaLwSameSourcePair>(
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS.map((pair) => [pair.treatedSystemId, pair])
);

export const MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE =
  "DeltaLw companion was carried from the TUAS same-source CLT upper-package measured pair while Ln,w stayed on the exact treated floor-system row." as const;

function isUpperOnlyCltMeasuredSystem(
  system: ExactFloorSystem,
  pair: MassTimberCltUpperPackageDeltaLwSameSourcePair
): boolean {
  return Boolean(
    system.sourceType === "open_measured_dataset" &&
      system.trustTier === "peer_reviewed_open_access" &&
      system.sourceLabel === "TUAS open measured dataset" &&
      system.match.baseStructure?.materialIds?.includes("clt_panel") &&
      system.match.baseStructure?.thicknessMm === pair.carrierThicknessMm &&
      system.match.ceilingBoard === undefined &&
      system.match.ceilingCavity === undefined &&
      system.match.ceilingFill === undefined &&
      system.match.absentRoles.includes("ceiling_board") &&
      system.match.absentRoles.includes("ceiling_cavity") &&
      system.match.absentRoles.includes("ceiling_fill") &&
      system.impactRatings.LnW === pair.treatedLnW &&
      pair.deltaLw > 0
  );
}

export function resolveMassTimberCltUpperPackageDeltaLwPair(
  system: ExactFloorSystem | null | undefined
): MassTimberCltUpperPackageDeltaLwSameSourcePair | null {
  if (!system) {
    return null;
  }

  const pair = ACCEPTED_PAIR_BY_TREATED_SYSTEM_ID.get(system.id);

  if (!pair || !isUpperOnlyCltMeasuredSystem(system, pair)) {
    return null;
  }

  return pair;
}

export function buildMassTimberCltUpperPackageDeltaLwCompanion(
  system: ExactFloorSystem | null | undefined
): ImpactCalculation | null {
  const pair = resolveMassTimberCltUpperPackageDeltaLwPair(system);

  if (!pair) {
    return null;
  }

  return ImpactCalculationSchema.parse({
    DeltaLw: pair.deltaLw,
    availableOutputs: ["DeltaLw"],
    bareReferenceLnW: pair.referenceLnW,
    basis: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
    confidence: getImpactConfidenceForBasis(MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS),
    estimateCandidateIds: [
      MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
      pair.referenceSystemId,
      pair.treatedSystemId,
      pair.eligibleRuntimeTemplateId
    ],
    labOrField: "lab",
    metricBasis: createImpactMetricBasis({
      DeltaLw: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS
    }),
    notes: [
      MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE,
      `DeltaLw ${pair.deltaLw} dB = reference Ln,w ${pair.referenceLnW} dB - treated Ln,w ${pair.treatedLnW} dB for the same ${pair.carrierThicknessMm} mm CLT carrier.`
    ],
    referenceFloorType: pair.referenceSystemId,
    scope: "exact_improvement_reference_floor",
    standardMethod: "same-source TUAS open measured CLT upper-package Ln,w pair",
    treatedReferenceLnW: pair.treatedLnW
  });
}

export function mergeMassTimberCltUpperPackageDeltaLwCompanion(
  primaryImpact: ImpactCalculation | null,
  system: ExactFloorSystem | null | undefined
): ImpactCalculation | null {
  const companion = buildMassTimberCltUpperPackageDeltaLwCompanion(system);
  const merged = mergeImpactCalculations(primaryImpact, companion);

  if (!merged || !companion) {
    return merged;
  }

  if (!merged.notes.includes(MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE)) {
    merged.notes.push(MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_COMPANION_NOTE);
  }

  return merged;
}
