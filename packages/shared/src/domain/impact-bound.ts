import { z } from "zod";

import {
  ImpactConfidenceSchema,
  ImpactEstimateBasisSchema,
  ImpactScopeSchema
} from "./impact";

export const ImpactBoundCalculationSchema = z
  .object({
    CI: z.number().optional(),
    CI50_2500: z.number().optional(),
    DeltaLwLowerBound: z.number().nonnegative().optional(),
    guideEstimateHdCorrectionDb: z.number().optional(),
    guideEstimateHdSource: z.enum(["explicit_input", "lookup_from_receiving_room_volume"]).optional(),
    guideEstimateKCorrectionDb: z.number().optional(),
    guideEstimateKSource: z.enum(["explicit_input", "lookup_from_mass_ratio"]).optional(),
    guideEstimateMassRatio: z.number().positive().optional(),
    guideEstimateMassRatioBracket: z.string().min(1).optional(),
    guideEstimateProfile: z.literal("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd").optional(),
    guideEstimateReceivingRoomVolumeBracket: z.string().min(1).optional(),
    guideEstimateReceivingRoomVolumeM3: z.number().positive().optional(),
    LPrimeNT50UpperBound: z.number().positive().optional(),
    LPrimeNTwUpperBound: z.number().positive().optional(),
    LPrimeNWUpperBound: z.number().positive().optional(),
    LnWPlusCIUpperBound: z.number().positive().optional(),
    LnWUpperBound: z.number().positive().optional(),
    basis: ImpactEstimateBasisSchema,
    confidence: ImpactConfidenceSchema,
    notes: z.array(z.string()).min(1),
    scope: ImpactScopeSchema
  })
  .superRefine((value, ctx) => {
    if (
      !Number.isFinite(value.LnWUpperBound) &&
      !Number.isFinite(value.LnWPlusCIUpperBound) &&
      !Number.isFinite(value.LPrimeNWUpperBound) &&
      !Number.isFinite(value.LPrimeNT50UpperBound) &&
      !Number.isFinite(value.LPrimeNTwUpperBound) &&
      !Number.isFinite(value.DeltaLwLowerBound)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Impact bound calculation requires at least one bound metric."
      });
    }
  });

export type ImpactBoundCalculation = z.infer<typeof ImpactBoundCalculationSchema>;
