import { z } from "zod";

import { ExactImpactSourceSchema } from "./exact-impact-source";
import { ImpactBoundCalculationSchema } from "./impact-bound";
import { ImpactCalculationSchema } from "./impact";
import {
  ImpactPredictorFloorCoveringModeSchema,
  ImpactPredictorLowerTreatmentSupportClassSchema,
  ImpactPredictorLowerTreatmentTypeSchema,
  ImpactPredictorStructuralSupportTypeSchema,
  ImpactPredictorSupportFormSchema,
  ImpactPredictorSystemTypeSchema
} from "./impact-predictor-input";
import { FloorRoleSchema } from "./layer";

export const FloorSystemSourceTypeSchema = z.enum([
  "official_manufacturer_system_table",
  "official_open_component_library",
  "open_measured_dataset"
]);

export const FloorSystemTrustTierSchema = z.enum([
  "official_manufacturer",
  "peer_reviewed_open_access"
]);

export const FloorSystemRoleCriteriaSchema = z.object({
  layerCount: z.number().int().positive().optional(),
  materialIds: z.array(z.string().min(1)).min(1).optional(),
  materialScheduleIds: z.array(z.string().min(1)).min(1).optional(),
  thicknessScheduleMm: z.array(z.number().positive()).min(1).optional(),
  thicknessMm: z.number().positive().optional()
});

export const FloorSystemMatchCriteriaSchema = z.object({
  absentRoles: z.array(FloorRoleSchema).default([]),
  baseStructure: FloorSystemRoleCriteriaSchema.optional(),
  ceilingBoard: FloorSystemRoleCriteriaSchema.optional(),
  ceilingCavity: FloorSystemRoleCriteriaSchema.optional(),
  ceilingFill: FloorSystemRoleCriteriaSchema.optional(),
  floatingScreed: FloorSystemRoleCriteriaSchema.optional(),
  floorCovering: FloorSystemRoleCriteriaSchema.optional(),
  resilientLayer: FloorSystemRoleCriteriaSchema.optional(),
  upperFill: FloorSystemRoleCriteriaSchema.optional()
});

export const FloorSystemImpactRatingsSchema = z.object({
  CI: z.number().optional(),
  CI50_2500: z.number().optional(),
  LnW: z.number().positive(),
  LnWPlusCI: z.number().optional()
});

export const FloorSystemImpactBoundsSchema = z
  .object({
    DeltaLwLowerBound: z.number().nonnegative().optional(),
    LnWPlusCIUpperBound: z.number().positive().optional(),
    LnWUpperBound: z.number().positive().optional()
  })
  .superRefine((value, ctx) => {
    if (
      !Number.isFinite(value.LnWUpperBound) &&
      !Number.isFinite(value.LnWPlusCIUpperBound) &&
      !Number.isFinite(value.DeltaLwLowerBound)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Floor-system bound support requires at least one bound metric."
      });
    }
  });

export const FloorSystemAirborneCompanionSemanticSchema = z.enum([
  "rw_plus_ctr",
  "rw_plus_c",
  "ctr_term"
]);

export const FloorSystemAirborneRatingsSchema = z.object({
  Rw: z.number().positive(),
  RwCtr: z.number().optional(),
  RwCtrSemantic: FloorSystemAirborneCompanionSemanticSchema.optional()
});

export const FloorSystemSummarySchema = z.object({
  carrier: z.string().min(1),
  ceiling: z.string().min(1),
  floorBuildUp: z.string().min(1)
});

const FloorSystemEstimateSectionSchema = z
  .object({
    densityKgM3: z.number().positive().optional(),
    materialClass: z.string().min(1).optional(),
    productId: z.string().min(1).optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const FloorSystemEstimateFloorCoveringSchema = z
  .object({
    deltaLwDb: z.number().nonnegative().optional(),
    densityKgM3: z.number().positive().optional(),
    materialClass: z.string().min(1).optional(),
    mode: ImpactPredictorFloorCoveringModeSchema.optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const FloorSystemEstimateResilientLayerSchema = z
  .object({
    dynamicStiffnessMNm3: z.number().positive().optional(),
    productId: z.string().min(1).optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const FloorSystemEstimateLowerTreatmentSchema = z
  .object({
    boardLayerCount: z.number().int().positive().optional(),
    boardMaterialClass: z.string().min(1).optional(),
    boardThicknessScheduleMm: z.array(z.number().positive()).min(1).optional(),
    boardThicknessMm: z.number().positive().optional(),
    cavityDepthMm: z.number().positive().optional(),
    cavityFillThicknessMm: z.number().nonnegative().optional(),
    supportClass: ImpactPredictorLowerTreatmentSupportClassSchema.optional(),
    type: ImpactPredictorLowerTreatmentTypeSchema.optional()
  })
  .partial();

export const FloorSystemEstimateMatchSchema = z.object({
  baseSlab: FloorSystemEstimateSectionSchema.optional(),
  floorCovering: FloorSystemEstimateFloorCoveringSchema.optional(),
  floatingScreed: FloorSystemEstimateSectionSchema.optional(),
  impactSystemType: ImpactPredictorSystemTypeSchema.optional(),
  lowerTreatment: FloorSystemEstimateLowerTreatmentSchema.optional(),
  resilientLayer: FloorSystemEstimateResilientLayerSchema.optional(),
  structuralSupportType: ImpactPredictorStructuralSupportTypeSchema.optional(),
  supportForm: ImpactPredictorSupportFormSchema.optional(),
  upperFill: FloorSystemEstimateSectionSchema.optional()
});

export const ExactFloorSystemSchema = z.object({
  airborneRatings: FloorSystemAirborneRatingsSchema,
  estimateMatch: FloorSystemEstimateMatchSchema.optional(),
  familyEstimateEligible: z.boolean().optional(),
  id: z.string().min(1),
  impactBands: ExactImpactSourceSchema.optional(),
  impactRatings: FloorSystemImpactRatingsSchema,
  label: z.string().min(1),
  manualMatch: z.boolean().optional(),
  match: FloorSystemMatchCriteriaSchema,
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  sourceType: FloorSystemSourceTypeSchema,
  systemSummary: FloorSystemSummarySchema,
  trustTier: FloorSystemTrustTierSchema
});

export const BoundFloorSystemSchema = z.object({
  airborneRatings: FloorSystemAirborneRatingsSchema,
  id: z.string().min(1),
  impactBounds: FloorSystemImpactBoundsSchema,
  label: z.string().min(1),
  match: FloorSystemMatchCriteriaSchema,
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  sourceType: FloorSystemSourceTypeSchema,
  systemSummary: FloorSystemSummarySchema,
  trustTier: FloorSystemTrustTierSchema
});

export const FloorSystemMatchResultSchema = z.object({
  impact: ImpactCalculationSchema,
  matchKind: z.literal("automatic"),
  notes: z.array(z.string()).min(1),
  score: z.number().nonnegative(),
  system: ExactFloorSystemSchema
});

export const FloorSystemBoundMatchResultSchema = z.object({
  lowerBoundImpact: ImpactBoundCalculationSchema,
  matchKind: z.literal("automatic"),
  notes: z.array(z.string()).min(1),
  score: z.number().nonnegative(),
  system: BoundFloorSystemSchema
});

export const FloorSystemRecommendationSchema = z.object({
  fitPercent: z.number().min(0).max(100),
  matchedSignalCount: z.number().int().nonnegative(),
  missingSignals: z.array(z.string()).min(1),
  score: z.number().nonnegative(),
  system: ExactFloorSystemSchema,
  totalSignalCount: z.number().int().positive()
});

export const FloorSystemEstimateKindSchema = z.enum([
  "family_archetype",
  "family_general",
  "low_confidence"
]);

export const FloorSystemBoundEstimateKindSchema = z.enum([
  "bound_interpolation",
  "missing_support_form_bound"
]);

export const FloorSystemEstimateResultSchema = z.object({
  airborneRatings: FloorSystemAirborneRatingsSchema,
  fitPercent: z.number().min(0).max(100),
  impact: ImpactCalculationSchema,
  kind: FloorSystemEstimateKindSchema,
  notes: z.array(z.string()).min(1),
  sourceSystems: z.array(ExactFloorSystemSchema).min(1),
  structuralFamily: z.string().min(1)
});

export const FloorSystemBoundEstimateResultSchema = z.object({
  airborneRatings: FloorSystemAirborneRatingsSchema,
  fitPercent: z.number().min(0).max(100),
  kind: FloorSystemBoundEstimateKindSchema,
  lowerBoundImpact: ImpactBoundCalculationSchema,
  notes: z.array(z.string()).min(1),
  sourceSystems: z.array(BoundFloorSystemSchema).min(1),
  structuralFamily: z.string().min(1)
});

export type BoundFloorSystem = z.infer<typeof BoundFloorSystemSchema>;
export type ExactFloorSystem = z.infer<typeof ExactFloorSystemSchema>;
export type FloorSystemAirborneCompanionSemantic = z.infer<typeof FloorSystemAirborneCompanionSemanticSchema>;
export type FloorSystemAirborneRatings = z.infer<typeof FloorSystemAirborneRatingsSchema>;
export type FloorSystemBoundEstimateKind = z.infer<typeof FloorSystemBoundEstimateKindSchema>;
export type FloorSystemBoundEstimateResult = z.infer<typeof FloorSystemBoundEstimateResultSchema>;
export type FloorSystemBoundMatchResult = z.infer<typeof FloorSystemBoundMatchResultSchema>;
export type FloorSystemEstimateMatch = z.infer<typeof FloorSystemEstimateMatchSchema>;
export type FloorSystemEstimateKind = z.infer<typeof FloorSystemEstimateKindSchema>;
export type FloorSystemEstimateResult = z.infer<typeof FloorSystemEstimateResultSchema>;
export type FloorSystemImpactBounds = z.infer<typeof FloorSystemImpactBoundsSchema>;
export type FloorSystemImpactRatings = z.infer<typeof FloorSystemImpactRatingsSchema>;
export type FloorSystemMatchCriteria = z.infer<typeof FloorSystemMatchCriteriaSchema>;
export type FloorSystemMatchResult = z.infer<typeof FloorSystemMatchResultSchema>;
export type FloorSystemRecommendation = z.infer<typeof FloorSystemRecommendationSchema>;
export type FloorSystemRoleCriteria = z.infer<typeof FloorSystemRoleCriteriaSchema>;
export type FloorSystemSourceType = z.infer<typeof FloorSystemSourceTypeSchema>;
export type FloorSystemSummary = z.infer<typeof FloorSystemSummarySchema>;
export type FloorSystemTrustTier = z.infer<typeof FloorSystemTrustTierSchema>;
