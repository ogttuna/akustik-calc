import { z } from "zod";

import { RequestedOutputSchema } from "./output";

export const ImpactEstimateBasisSchema = z.enum([
  "exact_source_band_curve_iso7172",
  "exact_source_improvement_curve_iso7172",
  "mixed_exact_plus_estimated_direct_flanking_energy_sum",
  "mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum",
  "mixed_bound_plus_estimated_standardized_field_volume_normalization",
  "mixed_bound_plus_estimated_tr_small_room_normalization",
  "mixed_predicted_plus_estimated_direct_flanking_energy_sum",
  "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
  "mixed_exact_plus_estimated_standardized_field_volume_normalization",
  "mixed_exact_plus_estimated_field_k_correction",
  "mixed_exact_plus_estimated_local_guide",
  "mixed_exact_plus_estimated_tr_small_room_normalization",
  "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  "mixed_predicted_plus_estimated_field_k_correction",
  "mixed_predicted_plus_estimated_local_guide",
  "mixed_predicted_plus_estimated_tr_small_room_normalization",
  "official_floor_system_bound_support",
  "official_floor_system_exact_match",
  "open_measured_floor_system_exact_match",
  "peer_reviewed_floor_system_exact_match",
  "predictor_composite_panel_published_interaction_estimate",
  "predictor_heavy_concrete_published_upper_treatment_estimate",
  "predictor_mass_timber_clt_bare_interpolation_estimate",
  "predictor_mass_timber_clt_dataholz_dry_estimate",
  "predictor_mass_timber_clt_dry_interaction_estimate",
  "predictor_lightweight_steel_fl28_interpolation_estimate",
  "predictor_lightweight_steel_bound_interpolation_estimate",
  "predictor_lightweight_steel_missing_support_form_bound_estimate",
  "predictor_floor_system_family_archetype_estimate",
  "predictor_floor_system_family_general_estimate",
  "predictor_floor_system_low_confidence_estimate",
  "predictor_catalog_exact_match_official",
  "predictor_catalog_lower_bound_official",
  "predictor_catalog_product_delta_official",
  "predictor_explicit_delta_heavy_reference_derived",
  "predictor_heavy_bare_floor_iso12354_annexc_estimate",
  "predictor_heavy_floating_floor_iso12354_annexc_estimate"
]);

export const ImpactConfidenceLevelSchema = z.enum(["high", "medium", "low"]);
export const ImpactConfidenceProvenanceSchema = z.enum([
  "exact_band_curve",
  "exact_floor_system_family",
  "published_family_estimate",
  "formula_estimate_narrow_scope",
  "manual_guide_supplement",
  "official_product_catalog",
  "reference_derived"
]);

export const ImpactMetricBasisLabelSchema = z.union([
  ImpactEstimateBasisSchema,
  z.enum([
    "exact_source_dutch_lnta_from_octave_bands",
    "estimated_field_lprimenw_from_direct_flanking_energy_sum",
    "estimated_field_lprimenw_from_lnw_plus_k",
    "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd",
    "estimated_local_guide_tr_small_rooms_lnw_plus_3",
    "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500",
    "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
    "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume",
    "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
    "exact_source_rating_override",
    "predictor_bare_massive_floor_iso12354_annexc_estimate",
    "predictor_explicit_delta_user_input",
    "predictor_catalog_product_delta_heavy_reference_derived"
  ])
]);

export const ImpactMetricBasisSchema = z
  .object({
    CI: ImpactMetricBasisLabelSchema.optional(),
    CI50_2500: ImpactMetricBasisLabelSchema.optional(),
    DeltaLw: ImpactMetricBasisLabelSchema.optional(),
    LPrimeNW: ImpactMetricBasisLabelSchema.optional(),
    LPrimeNT50: ImpactMetricBasisLabelSchema.optional(),
    LPrimeNTw: ImpactMetricBasisLabelSchema.optional(),
    LnTA: ImpactMetricBasisLabelSchema.optional(),
    LnW: ImpactMetricBasisLabelSchema.optional(),
    LnWPlusCI: ImpactMetricBasisLabelSchema.optional()
  })
  .partial();

export const ImpactScopeSchema = z.enum([
  "exact_band_curve",
  "exact_floor_system_family",
  "family_estimate",
  "family_bound_estimate",
  "exact_improvement_reference_floor",
  "narrow_heavy_concrete_only",
  "reference_heavy_floor_derived"
]);

export const ImpactLabOrFieldSchema = z.enum(["lab", "field"]);

export const ImpactConfidenceSchema = z.object({
  level: ImpactConfidenceLevelSchema,
  provenance: ImpactConfidenceProvenanceSchema,
  score: z.number().min(0).max(1),
  summary: z.string().min(1)
});

export const ImpactCalculationSchema = z
  .object({
    CI: z.number().optional(),
    CI50_2500: z.number().optional(),
    DeltaLw: z.number().nonnegative().optional(),
    guideEstimateHdCorrectionDb: z.number().optional(),
    guideEstimateHdSource: z.enum(["explicit_input", "lookup_from_receiving_room_volume"]).optional(),
    guideEstimateKCorrectionDb: z.number().optional(),
    guideEstimateKSource: z.enum(["explicit_input", "lookup_from_mass_ratio"]).optional(),
    guideEstimateMassRatio: z.number().positive().optional(),
    guideEstimateMassRatioBracket: z.string().min(1).optional(),
    guideEstimateProfile: z.literal("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd").optional(),
    guideEstimateReceivingRoomVolumeBracket: z.string().min(1).optional(),
    guideEstimateReceivingRoomVolumeM3: z.number().positive().optional(),
    LPrimeNW: z.number().positive().optional(),
    LPrimeNT50: z.number().positive().optional(),
    LPrimeNTw: z.number().positive().optional(),
    LnTA: z.number().positive().optional(),
    LnW: z.number().positive().optional(),
    LnWPlusCI: z.number().optional(),
    availableOutputs: z.array(RequestedOutputSchema).min(1),
    bandSet: z.string().min(1).optional(),
    bareReferenceLnW: z.number().positive().optional(),
    baseSurfaceMassKgM2: z.number().positive().optional(),
    basis: ImpactEstimateBasisSchema,
    ci50_2500BandSet: z.string().min(1).optional(),
    ciBandSet: z.string().min(1).optional(),
    confidence: ImpactConfidenceSchema,
    estimateCandidateIds: z.array(z.string().min(1)).min(1).optional(),
    metricBasis: ImpactMetricBasisSchema.optional(),
    fieldEstimateDefaultSupportingElementFamily: z.string().min(1).optional(),
    fieldEstimateDirectOffsetDb: z.number().optional(),
    fieldEstimateExpertPathModifierCount: z.number().int().positive().optional(),
    fieldEstimateFlankingFamilyModels: z.array(z.string().min(1)).min(1).optional(),
    fieldEstimateFlankingPathCount: z.number().int().positive().optional(),
    fieldEstimateFlankingPathModifiersDb: z.array(z.number()).min(1).optional(),
    fieldEstimateKCorrectionDb: z.number().optional(),
    fieldEstimateLowerTreatmentBandReduction: z.boolean().optional(),
    fieldEstimateLowerTreatmentReductionDb: z.number().optional(),
    fieldEstimateMaxPathModifierDb: z.number().optional(),
    fieldEstimateProfile: z.enum(["explicit_field_lprimenw_from_lnw_plus_k", "direct_flanking_energy_sum"]).optional(),
    floatingLoadSurfaceMassKgM2: z.number().positive().optional(),
    floatingScreedSurfaceMassKgM2: z.number().positive().optional(),
    floorCoveringSurfaceMassKgM2: z.number().positive().optional(),
    labOrField: ImpactLabOrFieldSchema.optional(),
    notes: z.array(z.string()).min(1),
    predictorResonanceHz: z.number().positive().optional(),
    referenceFloorType: z.string().min(1).optional(),
    resilientDynamicStiffnessMNm3: z.number().positive().optional(),
    scope: ImpactScopeSchema,
    standardMethod: z.string().min(1).optional(),
    standardizedFieldEstimateProfile: z
      .enum([
        "standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume",
        "standardized_field_lprimentw_from_lprimenw_plus_room_volume"
      ])
      .optional(),
    standardizedFieldOffsetDb: z.number().optional(),
    standardizedFieldVolumeM3: z.number().positive().optional(),
    treatedReferenceLnW: z.number().positive().optional()
  })
  .superRefine((value, ctx) => {
    if (!Number.isFinite(value.LnW) && !Number.isFinite(value.LPrimeNTw)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Impact calculation requires either LnW or LPrimeNTw."
      });
    }
  });

export type ImpactEstimateBasis = z.infer<typeof ImpactEstimateBasisSchema>;
export type ImpactConfidence = z.infer<typeof ImpactConfidenceSchema>;
export type ImpactConfidenceLevel = z.infer<typeof ImpactConfidenceLevelSchema>;
export type ImpactConfidenceProvenance = z.infer<typeof ImpactConfidenceProvenanceSchema>;
export type ImpactCalculation = z.infer<typeof ImpactCalculationSchema>;
export type ImpactLabOrField = z.infer<typeof ImpactLabOrFieldSchema>;
export type ImpactMetricBasis = z.infer<typeof ImpactMetricBasisSchema>;
export type ImpactMetricBasisLabel = z.infer<typeof ImpactMetricBasisLabelSchema>;
export type ImpactScope = z.infer<typeof ImpactScopeSchema>;
