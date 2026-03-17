import { z } from "zod";

export const AirborneCalculatorIdSchema = z.enum(["dynamic", "ks_rw_calibrated", "mass_law", "sharp", "kurtovic"]);

export const AirborneCalculatorSchema = z.object({
  id: AirborneCalculatorIdSchema,
  label: z.string().min(1)
});

export type AirborneCalculatorId = z.infer<typeof AirborneCalculatorIdSchema>;
export type AirborneCalculator = z.infer<typeof AirborneCalculatorSchema>;
