import { z } from "zod";

import { RequestedOutputSchema } from "./output";

export const AcousticAnswerBoundaryOriginSchema = z.enum(["needs_input", "unsupported"]);
export type AcousticAnswerBoundaryOrigin = z.infer<typeof AcousticAnswerBoundaryOriginSchema>;

export const AcousticAnswerBoundaryRouteSchema = z.enum(["wall", "floor"]);
export type AcousticAnswerBoundaryRoute = z.infer<typeof AcousticAnswerBoundaryRouteSchema>;

const AcousticAnswerBoundarySchemaInternal = z
  .object({
    method: z.string().min(1),
    missingPhysicalInputs: z.array(z.string().min(1)).default([]),
    origin: AcousticAnswerBoundaryOriginSchema,
    requiredInputs: z.array(z.string().min(1)).default([]),
    route: AcousticAnswerBoundaryRouteSchema,
    unsupportedOutputs: z.array(RequestedOutputSchema).default([])
  })
  .superRefine((boundary, ctx) => {
    if (boundary.origin === "needs_input" && boundary.missingPhysicalInputs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_input acoustic answer boundary must name missing physical inputs",
        path: ["missingPhysicalInputs"]
      });
    }
  });

export type AcousticAnswerBoundary = z.infer<typeof AcousticAnswerBoundarySchemaInternal>;

export const AcousticAnswerBoundarySchema: z.ZodType<
  AcousticAnswerBoundary,
  z.ZodTypeDef,
  z.input<typeof AcousticAnswerBoundarySchemaInternal>
> = AcousticAnswerBoundarySchemaInternal;
