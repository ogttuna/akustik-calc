import { z } from "zod";

import { MaterialDefinitionSchema } from "./material";

export const FloorRoleSchema = z.enum([
  "base_structure",
  "resilient_layer",
  "floating_screed",
  "upper_fill",
  "floor_covering",
  "ceiling_cavity",
  "ceiling_fill",
  "ceiling_board"
]);

export const LayerInputSchema = z.object({
  floorRole: FloorRoleSchema.optional(),
  materialId: z.string().min(1),
  thicknessMm: z.number().positive()
});

export const ResolvedLayerSchema = LayerInputSchema.extend({
  material: MaterialDefinitionSchema,
  surfaceMassKgM2: z.number().nonnegative()
});

export type LayerInput = z.infer<typeof LayerInputSchema>;
export type ResolvedLayer = z.infer<typeof ResolvedLayerSchema>;
export type FloorRole = z.infer<typeof FloorRoleSchema>;
