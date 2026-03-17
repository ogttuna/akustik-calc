import { z } from "zod";

import { ImpactCalculationSchema } from "./impact";
import { ImpactBoundCalculationSchema } from "./impact-bound";
import { FloorRoleSchema } from "./layer";

export const ImpactProductCatalogMatchModeSchema = z.enum([
  "exact_system",
  "lower_bound_support",
  "product_property_delta"
]);

export const ImpactProductCatalogSourceTypeSchema = z.enum([
  "official_manufacturer_catalog_pdf",
  "official_manufacturer_technical_data_pdf"
]);

export const ImpactProductCatalogTrustTierSchema = z.enum([
  "official_manufacturer"
]);

export const ImpactProductRoleCriteriaSchema = z.object({
  layerCount: z.number().int().positive().optional(),
  materialIds: z.array(z.string().min(1)).min(1).optional(),
  thicknessMm: z.number().positive().optional()
});

export const ImpactProductCatalogMatchCriteriaSchema = z.object({
  absentRoles: z.array(FloorRoleSchema).default([]),
  baseStructure: ImpactProductRoleCriteriaSchema.optional(),
  floatingScreed: ImpactProductRoleCriteriaSchema.optional(),
  floorCovering: ImpactProductRoleCriteriaSchema.optional(),
  resilientLayer: ImpactProductRoleCriteriaSchema.optional()
});

export const ImpactProductCatalogRatingsSchema = z.object({
  DeltaLw: z.number().nonnegative().optional(),
  DeltaLwLowerBound: z.number().nonnegative().optional(),
  LnW: z.number().positive().optional(),
  LnWUpperBound: z.number().positive().optional()
});

export const ImpactProductCatalogEntrySchema = z.object({
  id: z.string().min(1),
  impactRatings: ImpactProductCatalogRatingsSchema,
  impactSystemType: z.string().min(1),
  label: z.string().min(1),
  match: ImpactProductCatalogMatchCriteriaSchema,
  matchMode: ImpactProductCatalogMatchModeSchema,
  referenceFloorType: z.string().min(1),
  source: z.string().url(),
  sourceType: ImpactProductCatalogSourceTypeSchema,
  trustTier: ImpactProductCatalogTrustTierSchema
});

export const ImpactCatalogMatchResultSchema = z.object({
  catalog: ImpactProductCatalogEntrySchema,
  impact: ImpactCalculationSchema.nullable().optional(),
  lowerBoundImpact: ImpactBoundCalculationSchema.nullable().optional(),
  matchKind: z.literal("automatic"),
  notes: z.array(z.string()).min(1),
  score: z.number().nonnegative()
}).superRefine((value, ctx) => {
  if (!value.impact && !value.lowerBoundImpact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Impact catalog match result requires either live impact or lower-bound impact support."
    });
  }
});

export type ImpactCatalogMatchResult = z.infer<typeof ImpactCatalogMatchResultSchema>;
export type ImpactProductCatalogEntry = z.infer<typeof ImpactProductCatalogEntrySchema>;
export type ImpactProductCatalogMatchCriteria = z.infer<typeof ImpactProductCatalogMatchCriteriaSchema>;
export type ImpactProductCatalogMatchMode = z.infer<typeof ImpactProductCatalogMatchModeSchema>;
export type ImpactProductCatalogRatings = z.infer<typeof ImpactProductCatalogRatingsSchema>;
export type ImpactProductCatalogSourceType = z.infer<typeof ImpactProductCatalogSourceTypeSchema>;
export type ImpactProductCatalogTrustTier = z.infer<typeof ImpactProductCatalogTrustTierSchema>;
export type ImpactProductRoleCriteria = z.infer<typeof ImpactProductRoleCriteriaSchema>;
