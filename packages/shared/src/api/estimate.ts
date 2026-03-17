import { z } from "zod";

import { AssemblyCalculationSchema } from "../domain/assembly";
import { AirborneContextSchema } from "../domain/airborne-context";
import { AirborneCalculatorIdSchema } from "../domain/calculator";
import { ExactImpactSourceSchema } from "../domain/exact-impact-source";
import { ImpactFieldContextSchema } from "../domain/impact-field-context";
import { ImpactPredictorInputSchema } from "../domain/impact-predictor-input";
import { LayerInputSchema } from "../domain/layer";
import { RequestedOutputSchema } from "../domain/output";

const EstimateRequestSchemaInternal = z.object({
  airborneContext: AirborneContextSchema.optional(),
  calculator: AirborneCalculatorIdSchema.optional(),
  exactImpactSource: ExactImpactSourceSchema.optional(),
  impactFieldContext: ImpactFieldContextSchema.optional(),
  impactPredictorInput: ImpactPredictorInputSchema.optional(),
  layers: z.array(LayerInputSchema).min(1),
  targetOutputs: z.array(RequestedOutputSchema).min(1).optional()
});

const EstimateResponseSchemaInternal = z.object({
  ok: z.literal(true),
  result: AssemblyCalculationSchema
});

export type EstimateRequest = z.infer<typeof EstimateRequestSchemaInternal>;
export type EstimateResponse = z.infer<typeof EstimateResponseSchemaInternal>;

export const EstimateRequestSchema: z.ZodType<
  EstimateRequest,
  z.ZodTypeDef,
  z.input<typeof EstimateRequestSchemaInternal>
> = EstimateRequestSchemaInternal;

export const EstimateResponseSchema: z.ZodType<
  EstimateResponse,
  z.ZodTypeDef,
  z.input<typeof EstimateResponseSchemaInternal>
> = EstimateResponseSchemaInternal;
