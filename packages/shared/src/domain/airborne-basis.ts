import { z } from "zod";

import { DynamicAirborneFamilySchema } from "./dynamic-airborne";
import { RequestedOutputSchema } from "./output";

export const AirborneResultOriginSchema = z.enum([
  "measured_exact_full_stack",
  "measured_exact_subassembly_plus_calculated_delta",
  "calibrated_family_physics",
  "family_physics_prediction",
  "bounded_prediction",
  "screening_fallback",
  "needs_input",
  "unsupported"
]);
export type AirborneResultOrigin = z.infer<typeof AirborneResultOriginSchema>;

export const AirborneBasisKindSchema = z.enum([
  "airborne_measured_exact",
  "airborne_anchored_delta",
  "airborne_calibrated_prediction",
  "airborne_physics_prediction",
  "airborne_bound",
  "airborne_screening",
  "airborne_needs_input",
  "airborne_unsupported"
]);
export type AirborneBasisKind = z.infer<typeof AirborneBasisKindSchema>;

export const AirborneMeasurementStandardSchema = z.enum([
  "ISO 10140-2",
  "ISO 10140-3",
  "ISO 16283-1",
  "ISO 16283-2",
  "ASTM E90",
  "ASTM E336",
  "ASTM E492",
  "ASTM E1007",
  "source_report",
  "none"
]);
export type AirborneMeasurementStandard = z.infer<typeof AirborneMeasurementStandardSchema>;

export const AirborneCalculationStandardSchema = z.enum([
  "ISO 12354-1",
  "ISO 12354-2",
  "engine_mass_law",
  "engine_double_leaf_cavity",
  "engine_triple_leaf_two_cavity_frequency_solver",
  "engine_bounded_estimate",
  "engine_screening",
  "none"
]);
export type AirborneCalculationStandard = z.infer<typeof AirborneCalculationStandardSchema>;

export const AirborneRatingStandardSchema = z.enum([
  "ISO 717-1",
  "ISO 717-2",
  "ASTM E413",
  "ASTM E989",
  "engine_native_bounded_estimate",
  "source_report",
  "none"
]);
export type AirborneRatingStandard = z.infer<typeof AirborneRatingStandardSchema>;

export const AirborneToleranceClassSchema = z.enum([
  "exact_source",
  "calibrated_prediction",
  "uncalibrated_prediction",
  "bounded_prediction",
  "screening_fallback"
]);
export type AirborneToleranceClass = z.infer<typeof AirborneToleranceClassSchema>;

export const AirborneCurveBasisSchema = z.enum([
  "measured_frequency_curve",
  "source_single_number_rating",
  "calculated_frequency_curve",
  "calculated_single_number_estimate",
  "screening_mass_law_curve",
  "no_curve"
]);
export type AirborneCurveBasis = z.infer<typeof AirborneCurveBasisSchema>;

const AirborneFrequencyBandsSchema = z.object({
  bandSet: z.string().min(1),
  frequenciesHz: z.array(z.number().positive()).min(1).optional()
});
export type AirborneFrequencyBands = z.infer<typeof AirborneFrequencyBandsSchema>;

const AirbornePropertyDefaultValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const AirbornePropertyDefaultSchema = z.object({
  field: z.string().min(1),
  reason: z.string().min(1),
  source: z.string().min(1),
  unit: z.string().min(1).optional(),
  value: AirbornePropertyDefaultValueSchema
});
export type AirbornePropertyDefault = z.infer<typeof AirbornePropertyDefaultSchema>;

const uncertaintyOrigins = new Set<AirborneResultOrigin>([
  "calibrated_family_physics",
  "family_physics_prediction",
  "bounded_prediction",
  "screening_fallback"
]);

const AirborneResultBasisSchemaInternal = z
  .object({
    anchorSourceId: z.string().min(1).optional(),
    assumptions: z.array(z.string().min(1)).default([]),
    calculationStandard: AirborneCalculationStandardSchema.optional(),
    curveBasis: AirborneCurveBasisSchema,
    errorBudgetDb: z.number().positive().optional(),
    exactSourceId: z.string().min(1).optional(),
    family: DynamicAirborneFamilySchema.optional(),
    frequencyBands: AirborneFrequencyBandsSchema.optional(),
    kind: AirborneBasisKindSchema,
    measurementStandard: AirborneMeasurementStandardSchema.optional(),
    method: z.string().min(1),
    missingPhysicalInputs: z.array(z.string().min(1)).default([]),
    missingSourceEvidence: z.array(z.string().min(1)).default([]),
    origin: AirborneResultOriginSchema,
    propertyDefaults: z.array(AirbornePropertyDefaultSchema).default([]),
    ratingStandard: AirborneRatingStandardSchema.optional(),
    requiredInputs: z.array(z.string().min(1)).default([]),
    toleranceClass: AirborneToleranceClassSchema.optional()
  })
  .superRefine((basis, ctx) => {
    if (basis.origin === "needs_input" && basis.missingPhysicalInputs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_input airborne basis must name missing physical inputs",
        path: ["missingPhysicalInputs"]
      });
    }

    if (uncertaintyOrigins.has(basis.origin) && !basis.errorBudgetDb && !basis.toleranceClass) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "non-exact airborne prediction basis requires errorBudgetDb or toleranceClass",
        path: ["errorBudgetDb"]
      });
    }
  });

export type AirborneResultBasis = z.infer<typeof AirborneResultBasisSchemaInternal>;

export const AirborneResultBasisSchema: z.ZodType<
  AirborneResultBasis,
  z.ZodTypeDef,
  z.input<typeof AirborneResultBasisSchemaInternal>
> = AirborneResultBasisSchemaInternal;

export const AirborneCandidateRejectionReasonSchema = z.object({
  code: z.string().min(1),
  detail: z.string().min(1)
});
export type AirborneCandidateRejectionReason = z.infer<typeof AirborneCandidateRejectionReasonSchema>;

const AirborneCandidateSchemaInternal = z
  .object({
    basis: AirborneResultBasisSchema,
    id: z.string().min(1),
    metricIds: z.array(z.string().min(1)).default([]),
    origin: AirborneResultOriginSchema,
    outputIds: z.array(RequestedOutputSchema).default([]),
    rejectionReasons: z.array(AirborneCandidateRejectionReasonSchema).default([]),
    selected: z.boolean()
  })
  .superRefine((candidate, ctx) => {
    if (candidate.basis.origin !== candidate.origin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "airborne candidate origin must match basis origin",
        path: ["basis", "origin"]
      });
    }
  });

export type AirborneCandidate = z.infer<typeof AirborneCandidateSchemaInternal>;

export const AirborneCandidateSchema: z.ZodType<
  AirborneCandidate,
  z.ZodTypeDef,
  z.input<typeof AirborneCandidateSchemaInternal>
> = AirborneCandidateSchemaInternal;

export const AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE = [
  "measured_exact_full_stack",
  "measured_exact_subassembly_plus_calculated_delta",
  "calibrated_family_physics",
  "family_physics_prediction",
  "bounded_prediction",
  "screening_fallback",
  "needs_input",
  "unsupported"
] as const satisfies readonly AirborneResultOrigin[];

export const AirborneCandidateResolverTieBreakerSchema = z.enum([
  "origin_precedence",
  "input_completeness_status",
  "family_confidence_class",
  "error_budget_db",
  "source_evidence_completeness",
  "stable_candidate_id"
]);
export type AirborneCandidateResolverTieBreaker = z.infer<
  typeof AirborneCandidateResolverTieBreakerSchema
>;

const AirborneCandidateResolutionSchemaInternal = z
  .object({
    candidatePrecedence: z.array(AirborneResultOriginSchema).default([
      ...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE
    ]),
    candidates: z.array(AirborneCandidateSchema).min(1),
    deterministicTieBreakers: z.array(AirborneCandidateResolverTieBreakerSchema).default([]),
    id: z.string().min(1),
    inputCompletenessIds: z.array(z.string().min(1)).default([]),
    policyId: z.literal("model_first_airborne_candidate_precedence_v1"),
    ratingAdapterBasisIds: z.array(z.string().min(1)).default([]),
    rejectedCandidateIds: z.array(z.string().min(1)),
    runtimeValueMovement: z.boolean().default(false),
    selectedBasis: AirborneResultBasisSchema.optional(),
    selectedCandidateId: z.string().min(1),
    selectedOrigin: AirborneResultOriginSchema
  })
  .superRefine((resolution, ctx) => {
    const expectedPrecedence = AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.join("|");
    const actualPrecedence = resolution.candidatePrecedence.join("|");

    if (actualPrecedence !== expectedPrecedence) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "airborne candidate resolver precedence must use model-first v1 order",
        path: ["candidatePrecedence"]
      });
    }

    const ids = resolution.candidates.map((candidate) => candidate.id);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "airborne candidate resolver requires unique candidate ids",
        path: ["candidates"]
      });
    }

    const selectedCandidates = resolution.candidates.filter((candidate) => candidate.selected);
    if (selectedCandidates.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "airborne candidate resolver requires exactly one selected candidate",
        path: ["candidates"]
      });
    }

    const selectedCandidate = resolution.candidates.find(
      (candidate) => candidate.id === resolution.selectedCandidateId
    );
    if (!selectedCandidate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "selectedCandidateId must reference a resolver candidate",
        path: ["selectedCandidateId"]
      });
    } else {
      if (!selectedCandidate.selected) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "selectedCandidateId must reference the selected candidate",
          path: ["selectedCandidateId"]
        });
      }

      if (selectedCandidate.origin !== resolution.selectedOrigin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "selectedOrigin must match the selected candidate origin",
          path: ["selectedOrigin"]
        });
      }

      if (selectedCandidate.rejectionReasons.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "selected airborne candidate must not carry rejection reasons",
          path: ["candidates"]
        });
      }
    }

    if (resolution.selectedBasis && selectedCandidate?.basis.origin !== resolution.selectedBasis.origin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "selectedBasis must match the selected candidate basis",
        path: ["selectedBasis"]
      });
    }

    const rejectedIdSet = new Set(resolution.rejectedCandidateIds);
    const actualRejectedIds = resolution.candidates
      .filter((candidate) => !candidate.selected)
      .map((candidate) => candidate.id);

    for (const candidate of resolution.candidates) {
      if (candidate.selected) {
        if (rejectedIdSet.has(candidate.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "selected airborne candidate cannot also be rejected",
            path: ["rejectedCandidateIds"]
          });
        }
        continue;
      }

      if (candidate.rejectionReasons.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "rejected airborne candidates must name rejection reasons",
          path: ["candidates"]
        });
      }

      if (!rejectedIdSet.has(candidate.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "rejectedCandidateIds must include every unselected candidate",
          path: ["rejectedCandidateIds"]
        });
      }
    }

    for (const rejectedId of resolution.rejectedCandidateIds) {
      if (!uniqueIds.has(rejectedId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "rejectedCandidateIds must reference resolver candidates",
          path: ["rejectedCandidateIds"]
        });
      }
    }

    if (rejectedIdSet.size !== actualRejectedIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectedCandidateIds must be a one-to-one set of unselected candidates",
        path: ["rejectedCandidateIds"]
      });
    }

    const selectedIsStop =
      selectedCandidate?.origin === "needs_input" || selectedCandidate?.origin === "unsupported";
    const numericRejectedCandidates = resolution.candidates.filter(
      (candidate) =>
        !candidate.selected && candidate.origin !== "needs_input" && candidate.origin !== "unsupported"
    );

    if (selectedIsStop) {
      const numericRejectedWithoutPhysicalOrRouteBlock = numericRejectedCandidates.find(
        (candidate) =>
          !candidate.rejectionReasons.some((reason) =>
            ["missing_physical_input", "missing_required_input", "unsupported_route"].includes(reason.code)
          )
      );

      if (numericRejectedWithoutPhysicalOrRouteBlock) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "needs_input or unsupported selection requires numeric candidates to be physically blocked",
          path: ["candidates"]
        });
      }
    }
  });

export type AirborneCandidateResolution = z.infer<typeof AirborneCandidateResolutionSchemaInternal>;

export const AirborneCandidateResolutionSchema: z.ZodType<
  AirborneCandidateResolution,
  z.ZodTypeDef,
  z.input<typeof AirborneCandidateResolutionSchemaInternal>
> = AirborneCandidateResolutionSchemaInternal;
