import { z } from "zod";

export const RequestedOutputSchema = z.enum([
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC",
  "NISR",
  "ISR",
  "LIIC",
  "LIR",
  "HIIC"
]);

export const REQUESTED_OUTPUT_IDS = RequestedOutputSchema.options;

export type RequestedOutputId = z.infer<typeof RequestedOutputSchema>;
