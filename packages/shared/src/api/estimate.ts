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
import {
  ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema,
  ActiveProjectUserMeasuredWallRwAnchorSchema
} from "../domain/project-user-measured-source-anchor";
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

const EstimateAirborneMeasuredSourceAnchorsSchema = z
  .array(ActiveProjectUserMeasuredWallRwAnchorSchema)
  .max(32)
  .superRefine((anchors, context) => {
    const seenIds = new Map<string, number>();
    const seenFingerprints = new Map<string, number>();

    anchors.forEach((anchor, index) => {
      const previousIdIndex = seenIds.get(anchor.id);
      if (previousIdIndex === undefined) {
        seenIds.set(anchor.id, index);
      } else {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate measured wall Rw anchor id "${anchor.id}" also appears at airborneMeasuredSourceAnchors.${previousIdIndex}.`,
          path: [index, "id"]
        });
      }

      const previousFingerprintIndex = seenFingerprints.get(anchor.fingerprint);
      if (previousFingerprintIndex === undefined) {
        seenFingerprints.set(anchor.fingerprint, index);
      } else {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate measured wall Rw anchor fingerprint "${anchor.fingerprint}" also appears at airborneMeasuredSourceAnchors.${previousFingerprintIndex}.`,
          path: [index, "fingerprint"]
        });
      }
    });
  });

const EstimateAirborneMeasuredFrequencySourceAnchorsSchema = z
  .array(ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema)
  .max(32)
  .superRefine((anchors, context) => {
    const seenIds = new Map<string, number>();
    const seenFingerprints = new Map<string, number>();

    anchors.forEach((anchor, index) => {
      const previousIdIndex = seenIds.get(anchor.id);
      if (previousIdIndex === undefined) {
        seenIds.set(anchor.id, index);
      } else {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate measured wall airborne frequency anchor id "${anchor.id}" also appears at airborneMeasuredFrequencySourceAnchors.${previousIdIndex}.`,
          path: [index, "id"]
        });
      }

      const previousFingerprintIndex = seenFingerprints.get(anchor.fingerprint);
      if (previousFingerprintIndex === undefined) {
        seenFingerprints.set(anchor.fingerprint, index);
      } else {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate measured wall airborne frequency anchor fingerprint "${anchor.fingerprint}" also appears at airborneMeasuredFrequencySourceAnchors.${previousFingerprintIndex}.`,
          path: [index, "fingerprint"]
        });
      }
    });
  });

const EstimateRequestSchemaInternal = z.object({
  airborneContext: AirborneContextSchema.optional(),
  airborneMeasuredFrequencySourceAnchors: EstimateAirborneMeasuredFrequencySourceAnchorsSchema.optional(),
  airborneMeasuredSourceAnchors: EstimateAirborneMeasuredSourceAnchorsSchema.optional(),
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
