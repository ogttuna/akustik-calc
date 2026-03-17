import { z } from "zod";

import {
  ImpactConfidenceSchema,
  ImpactEstimateBasisSchema,
  ImpactScopeSchema
} from "./impact";

export const ImpactBoundCalculationSchema = z
  .object({
    DeltaLwLowerBound: z.number().nonnegative().optional(),
    LPrimeNT50UpperBound: z.number().positive().optional(),
    LPrimeNTwUpperBound: z.number().positive().optional(),
    LPrimeNWUpperBound: z.number().positive().optional(),
    LnWUpperBound: z.number().positive().optional(),
    basis: ImpactEstimateBasisSchema,
    confidence: ImpactConfidenceSchema,
    notes: z.array(z.string()).min(1),
    scope: ImpactScopeSchema
  })
  .superRefine((value, ctx) => {
    if (
      !Number.isFinite(value.LnWUpperBound) &&
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
