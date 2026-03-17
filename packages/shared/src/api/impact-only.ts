import { z } from "zod";

import { ExactImpactSourceSchema } from "../domain/exact-impact-source";
import { ImpactFieldContextSchema } from "../domain/impact-field-context";
import { ImpactOnlyCalculationSchema } from "../domain/impact-only";
import { ImpactPredictorInputSchema } from "../domain/impact-predictor-input";
import { LayerInputSchema } from "../domain/layer";
import { RequestedOutputSchema } from "../domain/output";

const ImpactOnlyRequestSchemaInternal = z
  .object({
    exactImpactSource: ExactImpactSourceSchema.optional(),
    impactFieldContext: ImpactFieldContextSchema.optional(),
    impactPredictorInput: ImpactPredictorInputSchema.optional(),
    layers: z.array(LayerInputSchema).default([]),
    officialFloorSystemId: z.string().min(1).optional(),
    officialImpactCatalogId: z.string().min(1).optional(),
    sourceLayers: z.array(LayerInputSchema).optional(),
    targetOutputs: z.array(RequestedOutputSchema).min(1).optional()
  })
  .superRefine((value, ctx) => {
    const hasVisibleLayers = value.layers.length > 0;
    const hasSourceLayers = Array.isArray(value.sourceLayers) && value.sourceLayers.length > 0;
    const hasDirectId =
      typeof value.officialFloorSystemId === "string" || typeof value.officialImpactCatalogId === "string";

    if (!value.exactImpactSource && !hasVisibleLayers && !hasSourceLayers && !hasDirectId && !value.impactPredictorInput) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Impact-only requests require at least one source: exact impact bands, visible layers, source layers, predictor input, official floor-system id, or official impact catalog id.",
        path: ["layers"]
      });
    }
  });

const ImpactOnlyResponseSchemaInternal = z.object({
  ok: z.literal(true),
  result: ImpactOnlyCalculationSchema
});

export type ImpactOnlyRequest = z.infer<typeof ImpactOnlyRequestSchemaInternal>;
export type ImpactOnlyResponse = z.infer<typeof ImpactOnlyResponseSchemaInternal>;

export const ImpactOnlyRequestSchema: z.ZodType<
  ImpactOnlyRequest,
  z.ZodTypeDef,
  z.input<typeof ImpactOnlyRequestSchemaInternal>
> = ImpactOnlyRequestSchemaInternal;

export const ImpactOnlyResponseSchema: z.ZodType<
  ImpactOnlyResponse,
  z.ZodTypeDef,
  z.input<typeof ImpactOnlyResponseSchemaInternal>
> = ImpactOnlyResponseSchemaInternal;
