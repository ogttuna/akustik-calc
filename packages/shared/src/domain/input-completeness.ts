import { z } from "zod";

import { RequestedOutputSchema } from "./output";

export const AcousticInputRouteFamilySchema = z.enum([
  "single_leaf_airborne",
  "lined_massive_airborne",
  "mass_timber_airborne",
  "double_leaf_framed_airborne",
  "triple_leaf_multicavity_airborne",
  "advanced_wall_source_absent_airborne",
  "porous_fill_cavity_modifier",
  "ceiling_airborne_plenum",
  "ceiling_roof_suspended_ceiling_route_boundary",
  "roof_airborne",
  "opening_facade_indoor",
  "opening_facade_outdoor_indoor_oitc",
  "floor_astm_iic_aiic_impact_rating",
  "field_building_flanking_context",
  "floating_floor_impact",
  "field_apparent_output_context",
  "building_prediction_airborne_context"
]);
export type AcousticInputRouteFamily = z.infer<typeof AcousticInputRouteFamilySchema>;

export const AcousticInputFieldIdSchema = z.enum([
  "surfaceMassKgM2",
  "densityKgM3",
  "thicknessMm",
  "materialClass",
  "youngModulusPa",
  "lossFactor",
  "leafGrouping",
  "leafSequence",
  "panelLayerOwnership",
  "cavityDepthMm",
  "cavitySequence",
  "frameBridgeClass",
  "fillState",
  "supportSpacingMm",
  "resilientBarSideCount",
  "sideALeafGroup",
  "cavity1DepthMm",
  "cavity1FillCoverage",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "cavity2FillCoverage",
  "sideBLeafGroup",
  "supportTopology",
  "porousFillThicknessMm",
  "porousFillPlacement",
  "porousFillCoverage",
  "flowResistivityPaSM2",
  "absorberClass",
  "absorberCoverageRatio",
  "absorberFlowResistivityPaSM2",
  "absorberThicknessMm",
  "cavitySealState",
  "conservativeAbsorberClassDefault",
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "steelSupportForm",
  "steelCarrierDepthMm",
  "steelCarrierSpacingMm",
  "resilientLayerDynamicStiffnessMNm3",
  "resilientLayerDynamicStiffnessMNPerM3",
  "loadBasisKgM2",
  "ceilingOrLowerAssembly",
  "primaryCarrierFamily",
  "dominantImpactTransferFamily",
  "mixedSupportRolePartition",
  "secondarySupportTreatmentOwner",
  "lowerCeilingIsolationSupportForm",
  "contextMode",
  "partitionAreaM2",
  "panelWidthMm",
  "panelHeightMm",
  "sourceRoomVolumeM3",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis",
  "hostWallAreaM2",
  "openingAreaM2",
  "openingElementType",
  "openingFrequencyBandsOrRatingBasis",
  "openingElementRw",
  "openingElementRwDb",
  "openingElementTransmissionLossCurve",
  "openingRatingBasis",
  "openingSealLeakageClass",
  "openingCount",
  "openingOrigin",
  "facadeOutdoorOrRoomNormalizationContext",
  "openingIntent",
  "openingSubElementIds",
  "outputBasis",
  "wallSolverIntent",
  "frequencyBandSet",
  "routeIntent",
  "roofOrCeilingMountingContext",
  "suspendedCeilingAirborneOrImpactIntent",
  "hangerOrSupportCouplingClass",
  "fieldBuildingAdapterBoundary",
  "exactSourcePrecedenceCheck",
  "directTransmissionCurveOwner",
  "iso717RwCAdapterOwner",
  "stcAdapterOwner",
  "duplicateOwnershipGuard",
  "splitLayerGuard",
  "sourceAbsentErrorBudgetOwner",
  "panelMaterialClass",
  "panelThicknessMm",
  "panelSurfaceMassKgM2",
  "panelBendingStiffnessNm",
  "panelLossFactor",
  "panelCriticalFrequencyHz",
  "frameMaterialClass",
  "frameSpacingMm",
  "frameDepthMm",
  "frameLineCouplingStiffnessMNPerM3",
  "resilientConnectionType",
  "resilientConnectionStiffnessMNPerM3",
  "mechanicalBridgeAreaRatio",
  "impactFieldContext"
]);
export type AcousticInputFieldId = z.infer<typeof AcousticInputFieldIdSchema>;

export const AcousticInputRequirementTypeSchema = z.enum([
  "required_physical_input",
  "conditional_physical_input",
  "optional_precision_input",
  "source_evidence"
]);
export type AcousticInputRequirementType = z.infer<typeof AcousticInputRequirementTypeSchema>;

export const AcousticInputMissingBehaviorSchema = z.enum([
  "needs_input",
  "widen_uncertainty",
  "source_promotion_blocker_only",
  "unsupported"
]);
export type AcousticInputMissingBehavior = z.infer<typeof AcousticInputMissingBehaviorSchema>;

export const AcousticInputDefaultPolicySchema = z.enum([
  "no_default",
  "documented_conservative_default",
  "documented_precision_default",
  "source_required"
]);
export type AcousticInputDefaultPolicy = z.infer<typeof AcousticInputDefaultPolicySchema>;

export const AcousticInputUncertaintyEffectSchema = z.enum([
  "none",
  "widen_error_budget",
  "lower_confidence_only"
]);
export type AcousticInputUncertaintyEffect = z.infer<typeof AcousticInputUncertaintyEffectSchema>;

export const AcousticInputCompletenessStatusSchema = z.enum([
  "complete",
  "complete_with_defaults",
  "needs_input",
  "source_blocked_exact_or_calibration_only",
  "unsupported"
]);
export type AcousticInputCompletenessStatus = z.infer<typeof AcousticInputCompletenessStatusSchema>;

export const AcousticInputRequirementSchema = z.object({
  defaultPolicy: AcousticInputDefaultPolicySchema.default("no_default"),
  fieldId: AcousticInputFieldIdSchema,
  label: z.string().min(1),
  missingBehavior: AcousticInputMissingBehaviorSchema,
  notes: z.array(z.string().min(1)).default([]),
  requirementType: AcousticInputRequirementTypeSchema,
  targetOutputs: z.array(RequestedOutputSchema).default([]),
  uncertaintyEffect: AcousticInputUncertaintyEffectSchema.default("none")
});
export type AcousticInputRequirement = z.infer<typeof AcousticInputRequirementSchema>;

export const AcousticInputAppliedDefaultSchema = z.object({
  fieldId: AcousticInputFieldIdSchema,
  reason: z.string().min(1),
  uncertaintyEffect: AcousticInputUncertaintyEffectSchema
});
export type AcousticInputAppliedDefault = z.infer<typeof AcousticInputAppliedDefaultSchema>;

function addIssue(ctx: z.RefinementCtx, path: (string | number)[], message: string): void {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message,
    path
  });
}

function assertUniqueFields(
  ctx: z.RefinementCtx,
  pathPrefix: string,
  fields: readonly AcousticInputFieldId[]
): void {
  const seen = new Set<AcousticInputFieldId>();
  for (const [index, field] of fields.entries()) {
    if (seen.has(field)) {
      addIssue(ctx, [pathPrefix, index], `duplicate input field ${field}`);
    }

    seen.add(field);
  }
}

const AcousticInputCompletenessSchemaInternal = z
  .object({
    appliedDefaults: z.array(AcousticInputAppliedDefaultSchema).default([]),
    conditionalFields: z.array(AcousticInputFieldIdSchema).default([]),
    id: z.string().min(1),
    missingPhysicalInputs: z.array(AcousticInputFieldIdSchema).default([]),
    missingSourceEvidence: z.array(z.string().min(1)).default([]),
    notes: z.array(z.string().min(1)).default([]),
    optionalPrecisionFields: z.array(AcousticInputFieldIdSchema).default([]),
    requiredFields: z.array(AcousticInputFieldIdSchema).default([]),
    requirements: z.array(AcousticInputRequirementSchema).default([]),
    routeFamily: AcousticInputRouteFamilySchema,
    status: AcousticInputCompletenessStatusSchema,
    targetOutputs: z.array(RequestedOutputSchema).default([])
  })
  .superRefine((completeness, ctx) => {
    assertUniqueFields(ctx, "requiredFields", completeness.requiredFields);
    assertUniqueFields(ctx, "conditionalFields", completeness.conditionalFields);
    assertUniqueFields(ctx, "optionalPrecisionFields", completeness.optionalPrecisionFields);
    assertUniqueFields(
      ctx,
      "missingPhysicalInputs",
      completeness.missingPhysicalInputs
    );

    const blockerFields = new Set([
      ...completeness.requiredFields,
      ...completeness.conditionalFields
    ]);
    for (const [index, field] of completeness.missingPhysicalInputs.entries()) {
      if (!blockerFields.has(field)) {
        addIssue(
          ctx,
          ["missingPhysicalInputs", index],
          `${field} must be declared as a required or conditional physical input`
        );
      }
    }

    const optionalFields = new Set(completeness.optionalPrecisionFields);
    for (const [index, appliedDefault] of completeness.appliedDefaults.entries()) {
      if (!optionalFields.has(appliedDefault.fieldId)) {
        addIssue(
          ctx,
          ["appliedDefaults", index, "fieldId"],
          `${appliedDefault.fieldId} must be declared as an optional precision input`
        );
      }
    }

    if (completeness.status === "needs_input" && completeness.missingPhysicalInputs.length === 0) {
      addIssue(ctx, ["missingPhysicalInputs"], "needs_input completeness must name missing physical inputs");
    }

    if (
      completeness.status === "source_blocked_exact_or_calibration_only" &&
      completeness.missingSourceEvidence.length === 0
    ) {
      addIssue(
        ctx,
        ["missingSourceEvidence"],
        "source-blocked exact/calibration completeness must name missing source evidence"
      );
    }

    if (completeness.status === "complete_with_defaults" && completeness.appliedDefaults.length === 0) {
      addIssue(ctx, ["appliedDefaults"], "complete_with_defaults requires at least one applied default");
    }

    if (
      completeness.missingSourceEvidence.length > 0 &&
      completeness.missingPhysicalInputs.length === 0 &&
      completeness.status === "needs_input"
    ) {
      addIssue(ctx, ["status"], "missing source evidence alone must not be classified as needs_input");
    }

    if (
      completeness.status === "source_blocked_exact_or_calibration_only" &&
      completeness.missingPhysicalInputs.length > 0
    ) {
      addIssue(
        ctx,
        ["status"],
        "source-blocked exact/calibration completeness cannot hide missing physical inputs"
      );
    }
  });

export type AcousticInputCompleteness = z.infer<typeof AcousticInputCompletenessSchemaInternal>;

export const AcousticInputCompletenessSchema: z.ZodType<
  AcousticInputCompleteness,
  z.ZodTypeDef,
  z.input<typeof AcousticInputCompletenessSchemaInternal>
> = AcousticInputCompletenessSchemaInternal;

const requiredRouteFamilies: readonly AcousticInputRouteFamily[] = [
  "single_leaf_airborne",
  "double_leaf_framed_airborne",
  "triple_leaf_multicavity_airborne",
  "porous_fill_cavity_modifier",
  "floating_floor_impact",
  "field_apparent_output_context"
];

export const AcousticInputCompletenessMatrixSchema = z
  .array(AcousticInputCompletenessSchema)
  .min(1)
  .superRefine((matrix, ctx) => {
    for (const family of requiredRouteFamilies) {
      if (!matrix.some((entry) => entry.routeFamily === family)) {
        addIssue(ctx, [], `input completeness matrix must include ${family}`);
      }
    }

    const seen = new Set<string>();
    for (const [index, entry] of matrix.entries()) {
      if (seen.has(entry.id)) {
        addIssue(ctx, [index, "id"], `duplicate input completeness entry ${entry.id}`);
      }

      seen.add(entry.id);
    }
  });
export type AcousticInputCompletenessMatrix = z.infer<typeof AcousticInputCompletenessMatrixSchema>;
