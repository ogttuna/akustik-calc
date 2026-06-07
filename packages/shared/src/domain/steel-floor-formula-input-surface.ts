import { z } from "zod";

import { ImpactPredictorSupportFormSchema } from "./impact-predictor-input";

export const SteelFloorLowerCeilingIsolationSupportFormSchema = z.enum([
  "direct_to_joists",
  "elastic_furred_channels",
  "rigid_furred_channels"
]);

const SteelFloorFormulaInputSurfaceSchemaInternal = z
  .object({
    loadBasisKgM2: z.number().positive().optional(),
    lowerCeilingIsolationSupportForm: SteelFloorLowerCeilingIsolationSupportFormSchema.optional(),
    resilientLayerDynamicStiffnessMNm3: z.number().positive().optional(),
    steelCarrierDepthMm: z.number().positive().optional(),
    steelCarrierSpacingMm: z.number().positive().optional(),
    steelSupportForm: ImpactPredictorSupportFormSchema.optional()
  })
  .partial();

export type SteelFloorLowerCeilingIsolationSupportForm = z.infer<
  typeof SteelFloorLowerCeilingIsolationSupportFormSchema
>;
export type SteelFloorFormulaInputSurface = z.infer<typeof SteelFloorFormulaInputSurfaceSchemaInternal>;

export const SteelFloorFormulaInputSurfaceSchema: z.ZodType<
  SteelFloorFormulaInputSurface,
  z.ZodTypeDef,
  z.input<typeof SteelFloorFormulaInputSurfaceSchemaInternal>
> = SteelFloorFormulaInputSurfaceSchemaInternal;
