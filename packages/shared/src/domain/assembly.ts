import { z } from "zod";

import { AirborneOverlaySchema } from "./airborne-overlay";
import { AirborneCalculatorIdSchema, AirborneCalculatorSchema } from "./calculator";
import { DynamicAirborneTraceSchema } from "./dynamic-airborne";
import { DynamicImpactTraceSchema } from "./dynamic-impact";
import {
  FloorSystemBoundEstimateResultSchema,
  FloorSystemBoundMatchResultSchema,
  FloorSystemEstimateResultSchema,
  FloorSystemMatchResultSchema,
  FloorSystemRecommendationSchema
} from "./floor-system";
import { FloorSystemRatingsSchema } from "./floor-system-ratings";
import { ImpactBoundCalculationSchema } from "./impact-bound";
import { ImpactCalculationSchema } from "./impact";
import { ImpactPredictorStatusSchema } from "./impact-predictor-status";
import { ImpactCatalogMatchResultSchema } from "./impact-product-catalog";
import { ImpactSupportSchema } from "./impact-support";
import { ResolvedLayerSchema } from "./layer";
import { RequestedOutputSchema } from "./output";
import { AssemblyRatingsSchema, TransmissionLossCurveSchema } from "./rating";

export const AssemblyMethodSchema = z.enum([
  "screening_mass_law_seed_v2",
  "screening_mass_law_curve_seed_v3",
  "dynamic",
  "ks_rw_calibrated",
  "mass_law",
  "sharp",
  "kurtovic"
]);
export type AssemblyMethod = z.infer<typeof AssemblyMethodSchema>;

const AssemblyMetricsShape = {
  airborneIsoDescriptor: z.string().min(1).optional(),
  totalThicknessMm: z.number().nonnegative(),
  surfaceMassKgM2: z.number().nonnegative(),
  estimatedRwDb: z.number().nonnegative(),
  estimatedRwPrimeDb: z.number().nonnegative().optional(),
  estimatedCDb: z.number(),
  estimatedCtrDb: z.number(),
  estimatedDnTwDb: z.number().optional(),
  estimatedDnTADb: z.number().optional(),
  estimatedDnTAkDb: z.number().optional(),
  estimatedDnWDb: z.number().optional(),
  estimatedDnADb: z.number().optional(),
  estimatedStc: z.number().nonnegative(),
  airGapCount: z.number().int().nonnegative(),
  insulationCount: z.number().int().nonnegative(),
  method: AssemblyMethodSchema
} satisfies z.ZodRawShape;

const AssemblyMetricsSchemaInternal = z.object(AssemblyMetricsShape);

const AssemblyCalculationShape: z.ZodRawShape = {
  availableCalculators: z.array(AirborneCalculatorSchema).default([]),
  boundFloorSystemEstimate: FloorSystemBoundEstimateResultSchema.nullable().optional(),
  boundFloorSystemMatch: FloorSystemBoundMatchResultSchema.nullable().optional(),
  airborneOverlay: AirborneOverlaySchema.nullable().optional(),
  calculatorId: AirborneCalculatorIdSchema.optional(),
  calculatorLabel: z.string().min(1).optional(),
  dynamicAirborneTrace: DynamicAirborneTraceSchema.optional(),
  dynamicImpactTrace: DynamicImpactTraceSchema.optional(),
  impact: ImpactCalculationSchema.nullable(),
  impactCatalogMatch: ImpactCatalogMatchResultSchema.nullable().optional(),
  impactPredictorStatus: ImpactPredictorStatusSchema.nullable().optional(),
  impactSupport: ImpactSupportSchema.nullable().optional(),
  floorSystemEstimate: FloorSystemEstimateResultSchema.nullable().optional(),
  floorSystemMatch: FloorSystemMatchResultSchema.nullable().optional(),
  floorSystemRatings: FloorSystemRatingsSchema.nullable().optional(),
  floorSystemRecommendations: z.array(FloorSystemRecommendationSchema).default([]),
  lowerBoundImpact: ImpactBoundCalculationSchema.nullable().optional(),
  ok: z.literal(true),
  curve: TransmissionLossCurveSchema,
  layers: z.array(ResolvedLayerSchema),
  metrics: AssemblyMetricsSchemaInternal,
  ratings: AssemblyRatingsSchema,
  supportedImpactOutputs: z.array(RequestedOutputSchema).default([]),
  supportedTargetOutputs: z.array(RequestedOutputSchema).default([]),
  targetOutputs: z.array(RequestedOutputSchema).default([]),
  unsupportedImpactOutputs: z.array(RequestedOutputSchema).default([]),
  unsupportedTargetOutputs: z.array(RequestedOutputSchema).default([]),
  warnings: z.array(z.string())
};

const AssemblyCalculationSchemaInternal: z.ZodObject<typeof AssemblyCalculationShape> = z.object(
  AssemblyCalculationShape
);

export type AssemblyMetrics = z.infer<typeof AssemblyMetricsSchemaInternal>;
export type AssemblyCalculation = z.infer<typeof AssemblyCalculationSchemaInternal>;

export const AssemblyMetricsSchema: z.ZodType<
  AssemblyMetrics,
  z.ZodTypeDef,
  z.input<typeof AssemblyMetricsSchemaInternal>
> = AssemblyMetricsSchemaInternal;

export const AssemblyCalculationSchema: z.ZodType<
  AssemblyCalculation,
  z.ZodTypeDef,
  z.input<typeof AssemblyCalculationSchemaInternal>
> = AssemblyCalculationSchemaInternal;
