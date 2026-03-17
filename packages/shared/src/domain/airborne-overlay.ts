import { z } from "zod";

import { AirborneContextModeSchema } from "./airborne-context";

export const AirborneDetectedFamilySchema = z.enum([
  "single_leaf_surrogate",
  "cavity_wall_surrogate",
  "double_stud_surrogate"
]);
export type AirborneDetectedFamily = z.infer<typeof AirborneDetectedFamilySchema>;

export const AirborneFlankingPathCategorySchema = z.enum([
  "connection",
  "junction",
  "boundary",
  "aperture",
  "flanking"
]);
export type AirborneFlankingPathCategory = z.infer<typeof AirborneFlankingPathCategorySchema>;

export const AirborneFlankingPathSchema = z.object({
  active: z.boolean(),
  category: AirborneFlankingPathCategorySchema,
  id: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  severityDb: z.number().nonnegative()
});
export type AirborneFlankingPath = z.infer<typeof AirborneFlankingPathSchema>;

export const AirborneFlankingGraphSchema = z.object({
  active: z.boolean(),
  combineMode: z.enum(["additive_conservative"]),
  model: z.enum(["heuristic_additive_path_graph"]),
  paths: z.array(AirborneFlankingPathSchema),
  totalPenaltyDb: z.number().nonnegative()
});
export type AirborneFlankingGraph = z.infer<typeof AirborneFlankingGraphSchema>;

const AirborneOverlayShape = {
  baseRwDb: z.number().nonnegative(),
  baseStc: z.number().nonnegative(),
  contextMode: AirborneContextModeSchema,
  detectedFamily: AirborneDetectedFamilySchema,
  fieldFlankingPenaltyApplied: z.boolean(),
  fieldFlankingPenaltyDb: z.number().nonnegative(),
  finalRwDb: z.number().nonnegative(),
  finalStc: z.number().nonnegative(),
  junctionFlankingGraph: AirborneFlankingGraphSchema.nullable(),
  leakagePenaltyApplied: z.boolean(),
  leakagePenaltyDb: z.number().nonnegative(),
  notes: z.array(z.string())
} satisfies z.ZodRawShape;

const AirborneOverlaySchemaInternal = z.object(AirborneOverlayShape);

export type AirborneOverlay = z.infer<typeof AirborneOverlaySchemaInternal>;

export const AirborneOverlaySchema: z.ZodType<
  AirborneOverlay,
  z.ZodTypeDef,
  z.input<typeof AirborneOverlaySchemaInternal>
> = AirborneOverlaySchemaInternal;
