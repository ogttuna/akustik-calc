import { z } from "zod";

export const MaterialCategorySchema = z.enum([
  "mass",
  "finish",
  "insulation",
  "gap",
  "support"
]);

export const MaterialDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: MaterialCategorySchema,
  densityKgM3: z.number().nonnegative(),
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
