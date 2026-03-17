import { z } from "zod";

import { ImpactBoundCalculationSchema } from "./impact-bound";
import { RequestedOutputSchema } from "./output";

export const ImpactPredictorInputModeSchema = z.enum([
  "derived_from_visible_layers",
  "explicit_predictor_input"
]);

export const ImpactPredictorStatusSchema = z.object({
  active: z.boolean(),
  futureSupportedTargetOutputs: z.array(RequestedOutputSchema).default([]),
  implementedFamilyEstimate: z.boolean().default(false),
  implementedFormulaEstimate: z.boolean().default(false),
  implementedLowConfidenceEstimate: z.boolean().default(false),
  inputMode: ImpactPredictorInputModeSchema.optional(),
  lowerBoundImpact: ImpactBoundCalculationSchema.nullable().optional(),
  matchedCatalogCaseId: z.string().min(1).optional(),
  matchedFloorSystemId: z.string().min(1).optional(),
  notes: z.array(z.string()).default([]),
  readyForPlannedSolver: z.boolean(),
  warnings: z.array(z.string()).default([])
});

export type ImpactPredictorInputMode = z.infer<typeof ImpactPredictorInputModeSchema>;
export type ImpactPredictorStatus = z.infer<typeof ImpactPredictorStatusSchema>;
