import { z } from "zod";

export const MaterialCategorySchema = z.enum([
  "mass",
  "finish",
  "insulation",
  "gap",
  "support"
]);

export const AcousticMaterialBehaviorSchema = z.enum([
  "rigid_mass",
  "panel_leaf",
  "limp_mass_membrane",
  "porous_absorber",
  "air_cavity",
  "resilient_layer",
  "structural_bridge",
  "mass_timber"
]);
export type AcousticMaterialBehavior = z.infer<typeof AcousticMaterialBehaviorSchema>;

export const AcousticMaterialPropertyFieldSchema = z.enum([
  "densityKgM3",
  "youngModulusPa",
  "poissonRatio",
  "lossFactor",
  "flowResistivityPaSM2",
  "porosity",
  "limpMassBehavior",
  "dynamicStiffnessMNm3"
]);
export type AcousticMaterialPropertyField = z.infer<typeof AcousticMaterialPropertyFieldSchema>;

export const AcousticMaterialPropertySourceStatusSchema = z.enum([
  "source_owned",
  "catalog_nominal",
  "engineering_default",
  "user_supplied",
  "unknown"
]);
export type AcousticMaterialPropertySourceStatus = z.infer<
  typeof AcousticMaterialPropertySourceStatusSchema
>;

export const MaterialAcousticPropertiesSchema = z.object({
  behavior: AcousticMaterialBehaviorSchema,
  flowResistivityPaSM2: z.number().positive().optional(),
  lossFactor: z.number().positive().max(1).optional(),
  notes: z.array(z.string().min(1)).default([]),
  poissonRatio: z.number().min(0).lt(0.5).optional(),
  porosity: z.number().min(0).max(1).optional(),
  propertySourceStatus: AcousticMaterialPropertySourceStatusSchema.default("unknown"),
  youngModulusPa: z.number().positive().optional()
});
export type MaterialAcousticProperties = z.infer<typeof MaterialAcousticPropertiesSchema>;

export const MaterialDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: MaterialCategorySchema,
  densityKgM3: z.number().nonnegative(),
  acoustic: MaterialAcousticPropertiesSchema.optional(),
  impact: z
    .object({
      dynamicStiffnessMNm3: z.number().positive().optional()
    })
    .optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export type MaterialCategory = z.infer<typeof MaterialCategorySchema>;
export type MaterialDefinition = z.infer<typeof MaterialDefinitionSchema>;
