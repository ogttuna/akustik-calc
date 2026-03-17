import { z } from "zod";

export const TransmissionLossCurveSchema = z
  .object({
    frequenciesHz: z.array(z.number().positive()).min(1),
    transmissionLossDb: z.array(z.number())
  })
  .refine(
    (value) => value.frequenciesHz.length === value.transmissionLossDb.length,
    "Curve frequencies and values must have the same length."
  );

export const Iso717RatingSchema = z.object({
  C: z.number(),
  Ctr: z.number(),
  Rw: z.number().nonnegative(),
  composite: z.string().min(1),
  descriptor: z.string().min(1)
});

export const AstmE413RatingSchema = z.object({
  STC: z.number().nonnegative()
});

export const AssemblyRatingsSchema = z.object({
  astmE413: AstmE413RatingSchema,
  iso717: Iso717RatingSchema
});

export type TransmissionLossCurve = z.infer<typeof TransmissionLossCurveSchema>;
export type Iso717Rating = z.infer<typeof Iso717RatingSchema>;
export type AstmE413Rating = z.infer<typeof AstmE413RatingSchema>;
export type AssemblyRatings = z.infer<typeof AssemblyRatingsSchema>;
