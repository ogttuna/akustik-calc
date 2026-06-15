import { z } from "zod";

import { AssemblyCalculationSchema } from "../domain/assembly";
import { AirborneContextSchema } from "../domain/airborne-context";
import { AirborneCalculatorIdSchema } from "../domain/calculator";
import { ExactImpactSourceSchema } from "../domain/exact-impact-source";
import { ImpactFieldContextSchema } from "../domain/impact-field-context";
import { ImpactPredictorInputSchema } from "../domain/impact-predictor-input";
import { LayerInputSchema } from "../domain/layer";
import { MaterialDefinitionSchema } from "../domain/material";
import { RequestedOutputSchema } from "../domain/output";
import { SteelFloorFormulaInputSurfaceSchema } from "../domain/steel-floor-formula-input-surface";

const FloorImpactContextSchema = z
  .object({
    loadBasisKgM2: z.number().positive().optional(),
    resilientLayerDynamicStiffnessMNm3: z.number().positive().optional()
  })
  .partial();

const EstimateMaterialCatalogSchema = z
  .array(MaterialDefinitionSchema)
  .max(64)
  .superRefine((materials, context) => {
    const seen = new Map<string, number>();

    materials.forEach((material, index) => {
      const previousIndex = seen.get(material.id);
      if (previousIndex === undefined) {
        seen.set(material.id, index);
        return;
      }

      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate material id "${material.id}" also appears at materialCatalog.${previousIndex}.`,
        path: [index, "id"]
      });
    });
  });

const EstimateRequestSchemaInternal = z.object({
  airborneContext: AirborneContextSchema.optional(),
  calculator: AirborneCalculatorIdSchema.optional(),
  exactImpactSource: ExactImpactSourceSchema.optional(),
  floorImpactContext: FloorImpactContextSchema.optional(),
  impactFieldContext: ImpactFieldContextSchema.optional(),
  impactPredictorInput: ImpactPredictorInputSchema.optional(),
  layers: z.array(LayerInputSchema).min(1),
  materialCatalog: EstimateMaterialCatalogSchema.optional(),
  steelFloorFormulaSurface: SteelFloorFormulaInputSurfaceSchema.optional(),
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
