import { z } from "zod";

import {
  FloorSystemAirborneRatingsSchema,
  FloorSystemBoundEstimateResultSchema,
  FloorSystemBoundMatchResultSchema,
  FloorSystemEstimateResultSchema,
  FloorSystemMatchResultSchema
} from "./floor-system";
import { FloorSystemRatingsSchema } from "./floor-system-ratings";
import { ImpactBoundCalculationSchema } from "./impact-bound";
import { ImpactCalculationSchema } from "./impact";
import { DynamicImpactTraceSchema } from "./dynamic-impact";
import { ImpactPredictorStatusSchema } from "./impact-predictor-status";
import { ImpactCatalogMatchResultSchema } from "./impact-product-catalog";
import { ImpactSupportSchema } from "./impact-support";
import { ResolvedLayerSchema } from "./layer";
import { RequestedOutputSchema } from "./output";

export const ImpactOnlySourceModeSchema = z.enum([
  "visible_stack",
  "source_layers",
  "predictor_input",
  "exact_band_source",
  "official_floor_system",
  "official_product_catalog"
]);
export type ImpactOnlySourceMode = z.infer<typeof ImpactOnlySourceModeSchema>;

const ImpactOnlyCalculationShape: z.ZodRawShape = {
  boundFloorSystemEstimate: FloorSystemBoundEstimateResultSchema.nullable().optional(),
  boundFloorSystemMatch: FloorSystemBoundMatchResultSchema.nullable().optional(),
  floorCarrier: FloorSystemAirborneRatingsSchema.nullable().optional(),
  floorSystemEstimate: FloorSystemEstimateResultSchema.nullable().optional(),
  floorSystemMatch: FloorSystemMatchResultSchema.nullable().optional(),
  floorSystemRatings: FloorSystemRatingsSchema.nullable().optional(),
  dynamicImpactTrace: DynamicImpactTraceSchema.optional(),
  impact: ImpactCalculationSchema.nullable(),
  impactCatalogMatch: ImpactCatalogMatchResultSchema.nullable().optional(),
  impactPredictorStatus: ImpactPredictorStatusSchema.nullable().optional(),
  impactSupport: ImpactSupportSchema.nullable().optional(),
  lowerBoundImpact: ImpactBoundCalculationSchema.nullable().optional(),
  ok: z.literal(true),
  partialType: z.literal("impact_only"),
  supportedImpactOutputs: z.array(RequestedOutputSchema).default([]),
  supportedTargetOutputs: z.array(RequestedOutputSchema).default([]),
  sourceLayers: z.array(ResolvedLayerSchema),
  sourceMode: ImpactOnlySourceModeSchema,
  targetOutputs: z.array(RequestedOutputSchema).default([]),
  unsupportedImpactOutputs: z.array(RequestedOutputSchema).default([]),
  unsupportedTargetOutputs: z.array(RequestedOutputSchema).default([]),
  visibleLayers: z.array(ResolvedLayerSchema),
  warnings: z.array(z.string())
};

const ImpactOnlyCalculationBaseSchema: z.ZodObject<typeof ImpactOnlyCalculationShape> = z.object(
  ImpactOnlyCalculationShape
);

const ImpactOnlyCalculationSchemaInternal: z.ZodEffects<typeof ImpactOnlyCalculationBaseSchema> = ImpactOnlyCalculationBaseSchema
  .superRefine((value, ctx) => {
    const hasResolvedImpactLane = Boolean(
      value.impact ||
      value.lowerBoundImpact ||
      value.floorSystemMatch ||
      value.boundFloorSystemMatch ||
      value.floorSystemEstimate ||
      value.boundFloorSystemEstimate ||
      value.impactCatalogMatch
    );

    if (!hasResolvedImpactLane && value.supportedImpactOutputs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Impact-only calculation cannot advertise supported impact outputs without a resolved impact lane."
      });
      return;
    }

    if (
      !hasResolvedImpactLane &&
      !value.floorCarrier &&
      !value.floorSystemRatings &&
      !value.impactSupport
    ) {
      return;
    }
  });

export type ImpactOnlyCalculation = z.infer<typeof ImpactOnlyCalculationSchemaInternal>;

export const ImpactOnlyCalculationSchema: z.ZodType<
  ImpactOnlyCalculation,
  z.ZodTypeDef,
  z.input<typeof ImpactOnlyCalculationSchemaInternal>
> = ImpactOnlyCalculationSchemaInternal;
