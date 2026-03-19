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
  RwPrime: z.number().nonnegative().optional(),
  apparent: z.boolean().optional(),
  composite: z.string().min(1),
  descriptor: z.string().min(1)
});

export const AstmE413RatingSchema = z.object({
  ASTC: z.number().nonnegative().optional(),
  STC: z.number().nonnegative(),
  basis: z.string().min(1).optional(),
  estimated: z.boolean().optional()
});

export const FieldAirborneRatingSchema = z.object({
  C: z.number().optional(),
  Ctr: z.number().optional(),
  DnA: z.number().optional(),
  DnC: z.number().optional(),
  DnCtr: z.number().optional(),
  DnTA: z.number().optional(),
  DnTAk: z.number().optional(),
  DnTC: z.number().optional(),
  DnTCtr: z.number().optional(),
  DnTw: z.number().optional(),
  DnW: z.number().optional(),
  RwPrime: z.number().nonnegative().optional(),
  absorptionAreaM2Sabine: z.number().positive().optional(),
  absorptionDataMissing: z.boolean().optional(),
  absorptionDataNeeded: z.array(z.string().min(1)).optional(),
  basis: z.string().min(1).optional(),
  compositePrime: z.string().min(1).optional(),
  dnBasis: z.string().min(1).optional(),
  dnOffsetDb: z.number().optional(),
  estimated: z.boolean().optional(),
  geometryMissing: z.boolean().optional(),
  geometryNeeded: z.array(z.string().min(1)).optional(),
  levelDifferenceOffsetDb: z.number().optional(),
  normalizationDb: z.number().optional(),
  partitionAreaM2: z.number().positive().optional(),
  receivingRoomRt60S: z.number().positive().optional(),
  receivingRoomVolumeM3: z.number().positive().optional()
});

export const AssemblyRatingsSchema = z.object({
  astmE413: AstmE413RatingSchema,
  field: FieldAirborneRatingSchema.optional(),
  iso717: Iso717RatingSchema
});

export type TransmissionLossCurve = z.infer<typeof TransmissionLossCurveSchema>;
export type Iso717Rating = z.infer<typeof Iso717RatingSchema>;
export type AstmE413Rating = z.infer<typeof AstmE413RatingSchema>;
export type FieldAirborneRating = z.infer<typeof FieldAirborneRatingSchema>;
export type AssemblyRatings = z.infer<typeof AssemblyRatingsSchema>;
