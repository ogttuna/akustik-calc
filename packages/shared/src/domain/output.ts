import { z } from "zod";

export const RequestedOutputSchema = z.enum([
  "Rw",
  "R'w",
  "STC",
  "C",
  "Ctr",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
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
