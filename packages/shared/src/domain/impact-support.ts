import { z } from "zod";

import { ImpactEstimateBasisSchema, ImpactLabOrFieldSchema } from "./impact";

export const ImpactSupportPrimaryCurveTypeSchema = z.enum(["airborne_tl", "impact_curve"]);

export const ImpactSupportSchema = z.object({
  basis: ImpactEstimateBasisSchema.optional(),
  formulaNotes: z.array(z.string()).default([]),
  labOrField: ImpactLabOrFieldSchema.optional(),
  notes: z.array(z.string()).default([]),
  primaryCurveType: ImpactSupportPrimaryCurveTypeSchema.optional(),
  primaryCurveUnaffected: z.boolean().optional(),
  referenceFloorType: z.string().min(1).optional()
});

export type ImpactSupport = z.infer<typeof ImpactSupportSchema>;
export type ImpactSupportPrimaryCurveType = z.infer<typeof ImpactSupportPrimaryCurveTypeSchema>;
