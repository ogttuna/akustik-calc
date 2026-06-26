import { z } from "zod";

import { RequestedOutputSchema } from "./output";

export const LayerCombinationResolverBasisSchema = z.enum([
  "astm_rating_boundary",
  "building_prediction",
  "element_lab",
  "field_apparent"
]);
export type LayerCombinationResolverBasis = z.infer<typeof LayerCombinationResolverBasisSchema>;

export const LayerCombinationResolverCandidateKindSchema = z.enum([
  "basis_boundary",
  "calibrated_family_solver",
  "exact_measured_override",
  "field_building_adapter",
  "needs_input_boundary",
  "similarity_anchor",
  "source_absent_family_solver",
  "unsupported_boundary"
]);
export type LayerCombinationResolverCandidateKind = z.infer<typeof LayerCombinationResolverCandidateKindSchema>;

export const LayerCombinationResolverSupportBucketSchema = z.enum([
  "anchored_estimate",
  "basis_boundary",
  "calibrated_estimate",
  "exact",
  "field_adapter",
  "needs_input",
  "source_absent_estimate",
  "unsupported"
]);
export type LayerCombinationResolverSupportBucket = z.infer<typeof LayerCombinationResolverSupportBucketSchema>;

export const LayerCombinationResolverRouteSchema = z.enum(["ceiling", "floor", "wall"]);
export type LayerCombinationResolverRoute = z.infer<typeof LayerCombinationResolverRouteSchema>;

export const LayerCombinationResolverValuePinSchema = z.object({
  metric: RequestedOutputSchema,
  value: z.number()
});
export type LayerCombinationResolverValuePin = z.infer<typeof LayerCombinationResolverValuePinSchema>;

export const LayerCombinationResolverTraceSchema = z.object({
  adapterVersion: z.string().min(1),
  basis: LayerCombinationResolverBasisSchema,
  boundaryCandidateIds: z.array(z.string().min(1)).default([]),
  candidateKind: LayerCombinationResolverCandidateKindSchema,
  errorBudgetMetrics: z.array(RequestedOutputSchema).default([]),
  noRuntimeValueMovement: z.literal(true),
  priorityRank: z.number().int().nonnegative(),
  rejectedCandidateIds: z.array(z.string().min(1)).default([]),
  requestedBasis: LayerCombinationResolverBasisSchema,
  requiredInputs: z.array(z.string().min(1)).default([]),
  route: LayerCombinationResolverRouteSchema,
  runtimeBasisId: z.string().min(1).nullable(),
  selectedCandidateId: z.string().min(1),
  supportBucket: LayerCombinationResolverSupportBucketSchema,
  supportedMetrics: z.array(RequestedOutputSchema).default([]),
  surfaceDetail: z.string().min(1),
  surfaceLabel: z.string().min(1),
  valuePins: z.array(LayerCombinationResolverValuePinSchema).default([])
});
export type LayerCombinationResolverTrace = z.infer<typeof LayerCombinationResolverTraceSchema>;
