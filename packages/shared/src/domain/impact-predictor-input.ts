import { z } from "zod";

export const ImpactPredictorStructuralSupportTypeSchema = z.enum([
  "reinforced_concrete",
  "hollow_core",
  "steel_joists",
  "timber_joists",
  "open_box_timber",
  "mass_timber_clt",
  "composite_panel"
]);

export const ImpactPredictorSupportFormSchema = z.enum([
  "joist_or_purlin",
  "open_web_or_rolled"
]);

export const ImpactPredictorSystemTypeSchema = z.enum([
  "bare_floor",
  "suspended_ceiling_only",
  "dry_floating_floor",
  "combined_upper_lower_system",
  "heavy_floating_floor"
]);

export const ImpactPredictorFloorCoveringModeSchema = z.enum([
  "none",
  "material_layer",
  "delta_lw_catalog"
]);

export const ImpactPredictorLowerTreatmentTypeSchema = z.enum([
  "none",
  "direct_fixed_ceiling",
  "suspended_ceiling_rigid_hanger",
  "suspended_ceiling_elastic_hanger",
  "suspended_ceiling_spring_hanger"
]);

export const ImpactPredictorLowerTreatmentSupportClassSchema = z.enum([
  "direct_to_joists",
  "furred_channels",
  "tuas_open_box_family_a",
  "tuas_open_box_family_b"
]);

const ImpactPredictorSectionSchema = z
  .object({
    densityKgM3: z.number().positive().optional(),
    materialClass: z.string().min(1).optional(),
    productId: z.string().min(1).optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const ImpactPredictorFloorCoveringSchema = z
  .object({
    deltaLwDb: z.number().nonnegative().optional(),
    densityKgM3: z.number().positive().optional(),
    materialClass: z.string().min(1).optional(),
    mode: ImpactPredictorFloorCoveringModeSchema.optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const ImpactPredictorResilientLayerSchema = z
  .object({
    dynamicStiffnessMNm3: z.number().positive().optional(),
    productId: z.string().min(1).optional(),
    thicknessMm: z.number().positive().optional()
  })
  .partial();

const ImpactPredictorLowerTreatmentSchema = z
  .object({
    boardLayerCount: z.number().int().positive().optional(),
    boardMaterialClass: z.string().min(1).optional(),
    boardThicknessMm: z.number().positive().optional(),
    cavityDepthMm: z.number().positive().optional(),
    cavityFillThicknessMm: z.number().nonnegative().optional(),
    supportClass: ImpactPredictorLowerTreatmentSupportClassSchema.optional(),
    type: ImpactPredictorLowerTreatmentTypeSchema.optional()
  })
  .partial();

const ImpactPredictorInputSchemaInternal = z.object({
  baseSlab: ImpactPredictorSectionSchema.optional(),
  floorCovering: ImpactPredictorFloorCoveringSchema.optional(),
  floatingScreed: ImpactPredictorSectionSchema.optional(),
  impactSystemType: ImpactPredictorSystemTypeSchema.optional(),
  lowerTreatment: ImpactPredictorLowerTreatmentSchema.optional(),
  officialFloorSystemId: z.string().min(1).optional(),
  referenceFloorType: z.string().min(1).optional(),
  resilientLayer: ImpactPredictorResilientLayerSchema.optional(),
  structuralSupportType: ImpactPredictorStructuralSupportTypeSchema.optional(),
  supportForm: ImpactPredictorSupportFormSchema.optional(),
  upperFill: ImpactPredictorSectionSchema.optional()
});

export type ImpactPredictorFloorCoveringMode = z.infer<typeof ImpactPredictorFloorCoveringModeSchema>;
export type ImpactPredictorInput = z.infer<typeof ImpactPredictorInputSchemaInternal>;
export type ImpactPredictorLowerTreatmentSupportClass = z.infer<
  typeof ImpactPredictorLowerTreatmentSupportClassSchema
>;
export type ImpactPredictorLowerTreatmentType = z.infer<typeof ImpactPredictorLowerTreatmentTypeSchema>;
export type ImpactPredictorStructuralSupportType = z.infer<typeof ImpactPredictorStructuralSupportTypeSchema>;
export type ImpactPredictorSupportForm = z.infer<typeof ImpactPredictorSupportFormSchema>;
export type ImpactPredictorSystemType = z.infer<typeof ImpactPredictorSystemTypeSchema>;

export const ImpactPredictorInputSchema: z.ZodType<
  ImpactPredictorInput,
  z.ZodTypeDef,
  z.input<typeof ImpactPredictorInputSchemaInternal>
> = ImpactPredictorInputSchemaInternal;
