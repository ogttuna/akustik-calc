import { z } from "zod";

export const DynamicAirborneFamilySchema = z.enum([
  "rigid_massive_wall",
  "masonry_nonhomogeneous",
  "single_leaf_panel",
  "laminated_single_leaf",
  "double_leaf",
  "lined_massive_wall",
  "stud_wall_system",
  "double_stud_system",
  "multileaf_multicavity"
]);
export type DynamicAirborneFamily = z.infer<typeof DynamicAirborneFamilySchema>;

export const DynamicAirborneConfidenceClassSchema = z.enum(["low", "medium", "high"]);
export type DynamicAirborneConfidenceClass = z.infer<typeof DynamicAirborneConfidenceClassSchema>;

export const DynamicAirborneFamilyDecisionClassSchema = z.enum(["clear", "narrow", "ambiguous"]);
export type DynamicAirborneFamilyDecisionClass = z.infer<typeof DynamicAirborneFamilyDecisionClassSchema>;

export const DynamicAirborneDelegateMethodSchema = z.enum([
  "screening_mass_law_curve_seed_v3",
  "ks_rw_calibrated",
  "mass_law",
  "sharp",
  "kurtovic"
]);
export type DynamicAirborneDelegateMethod = z.infer<typeof DynamicAirborneDelegateMethodSchema>;

export const DynamicAirborneCandidateSchema = z.object({
  label: z.string().min(1),
  method: DynamicAirborneDelegateMethodSchema,
  rwDb: z.number(),
  selected: z.boolean()
});
export type DynamicAirborneCandidate = z.infer<typeof DynamicAirborneCandidateSchema>;

const DynamicAirborneTraceShape = {
  adjustmentDb: z.number(),
  candidateMethods: z.array(DynamicAirborneCandidateSchema),
  cavityCount: z.number().int().nonnegative(),
  confidenceClass: DynamicAirborneConfidenceClassSchema,
  confidenceScore: z.number().min(0).max(1),
  detectedFamily: DynamicAirborneFamilySchema,
  detectedFamilyLabel: z.string().min(1),
  familyBoundaryHoldAllowedLeadDb: z.number().nonnegative().optional(),
  familyBoundaryHoldApplied: z.boolean().optional(),
  familyBoundaryHoldBoundaryCeilingDb: z.number().optional(),
  familyDecisionClass: DynamicAirborneFamilyDecisionClassSchema.optional(),
  familyDecisionMargin: z.number().nonnegative().optional(),
  familyBoundaryHoldCurrentMetricDb: z.number().optional(),
  familyBoundaryHoldRunnerUpMetricDb: z.number().optional(),
  familyBoundaryHoldTargetMetricDb: z.number().optional(),
  hasPorousFill: z.boolean(),
  hasStudLikeSupport: z.boolean(),
  notes: z.array(z.string()),
  originalSolidLayerCount: z.number().int().nonnegative(),
  porousLayerCount: z.number().int().nonnegative(),
  runnerUpFamily: DynamicAirborneFamilySchema.optional(),
  runnerUpFamilyLabel: z.string().min(1).optional(),
  selectedLabel: z.string().min(1),
  selectedMethod: DynamicAirborneDelegateMethodSchema,
  solverSpreadRwDb: z.number().nonnegative(),
  strategy: z.string().min(1),
  supportLayerCount: z.number().int().nonnegative(),
  surfaceMassKgM2: z.number().nonnegative(),
  totalGapThicknessMm: z.number().nonnegative(),
  trimmedOuterLeadingCount: z.number().int().nonnegative().optional(),
  trimmedOuterLayersApplied: z.boolean().optional(),
  trimmedOuterTrailingCount: z.number().int().nonnegative().optional(),
  visibleLeafCount: z.number().int().nonnegative(),
  visibleLeafMassRatio: z.number().positive().optional()
} satisfies z.ZodRawShape;

const DynamicAirborneTraceSchemaInternal = z.object(DynamicAirborneTraceShape);

export type DynamicAirborneTrace = z.infer<typeof DynamicAirborneTraceSchemaInternal>;

export const DynamicAirborneTraceSchema: z.ZodType<
  DynamicAirborneTrace,
  z.ZodTypeDef,
  z.input<typeof DynamicAirborneTraceSchemaInternal>
> = DynamicAirborneTraceSchemaInternal;
