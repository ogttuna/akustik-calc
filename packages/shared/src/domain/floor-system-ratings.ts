import { z } from "zod";

import { FloorSystemAirborneRatingsSchema } from "./floor-system";
import { ImpactEstimateBasisSchema } from "./impact";

export const FloorSystemRatingsBasisSchema = z.union([
  ImpactEstimateBasisSchema,
  z.enum(["predictor_heavy_concrete_floor_airborne_companion_estimate", "screening_mass_law_curve_seed_v3"])
]);

export const FloorSystemRatingsSchema = FloorSystemAirborneRatingsSchema.extend({
  basis: FloorSystemRatingsBasisSchema
});

export type FloorSystemRatings = z.infer<typeof FloorSystemRatingsSchema>;
export type FloorSystemRatingsBasis = z.infer<typeof FloorSystemRatingsBasisSchema>;
