import { z } from "zod";

export const ExactImpactSourceLabOrFieldSchema = z.enum(["lab", "field"]);
export const ExactImpactImprovementReferenceFloorTypeSchema = z.enum(["heavy_standard"]);

export const ExactImpactSourceSchema = z
  .object({
    frequenciesHz: z.array(z.number().positive()).min(5),
    label: z.string().min(1).optional(),
    labOrField: ExactImpactSourceLabOrFieldSchema.default("lab"),
    levelsDb: z.array(z.number()),
    standardMethod: z.string().min(1).optional()
  })
  .refine(
    (value) => value.frequenciesHz.length === value.levelsDb.length,
    "Exact impact-source frequencies and values must have the same length."
  );

export const ExactImpactImprovementSourceSchema = z
  .object({
    frequenciesHz: z.array(z.number().positive()).min(16),
    improvementDb: z.array(z.number().nonnegative()),
    label: z.string().min(1).optional(),
    referenceFloorType: ExactImpactImprovementReferenceFloorTypeSchema.default("heavy_standard"),
    standardMethod: z.string().min(1).optional()
  })
  .refine(
    (value) => value.frequenciesHz.length === value.improvementDb.length,
    "Exact impact-improvement frequencies and values must have the same length."
  );

export type ExactImpactSource = z.infer<typeof ExactImpactSourceSchema>;
export type ExactImpactImprovementReferenceFloorType = z.infer<typeof ExactImpactImprovementReferenceFloorTypeSchema>;
export type ExactImpactImprovementSource = z.infer<typeof ExactImpactImprovementSourceSchema>;
export type ExactImpactSourceLabOrField = z.infer<typeof ExactImpactSourceLabOrFieldSchema>;
