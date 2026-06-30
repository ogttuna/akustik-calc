import { z } from "zod";

import { RequestedOutputSchema, type RequestedOutputId } from "./output";

export const RatingAdapterIdSchema = z.enum([
  "iso_717_1_rw_from_airborne_transmission_loss_curve",
  "iso_717_1_rw_prime_from_apparent_airborne_curve",
  "iso_717_1_dntw_from_standardized_airborne_curve",
  "iso_717_1_dnw_from_normalized_airborne_curve",
  "astm_e413_stc_from_airborne_transmission_loss_curve",
  "astm_e413_astc_from_apparent_airborne_curve",
  "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
  "iso_717_2_lnw_from_impact_level_curve",
  "iso_717_2_lprime_nw_from_field_impact_curve",
  "iso_717_2_lprime_ntw_from_standardized_field_impact_curve",
  "astm_e989_iic_from_impact_level_curve",
  "astm_e989_aiic_from_field_impact_curve",
  "source_report_single_number_rating",
  "engine_native_bounded_estimate"
]);
export type RatingAdapterId = z.infer<typeof RatingAdapterIdSchema>;

export const RatingAdapterMetricFamilySchema = z.enum(["airborne", "impact"]);
export type RatingAdapterMetricFamily = z.infer<typeof RatingAdapterMetricFamilySchema>;

export const RatingAdapterContextBasisSchema = z.enum([
  "element_lab",
  "field_measurement",
  "building_prediction",
  "source_report",
  "screening_prediction"
]);
export type RatingAdapterContextBasis = z.infer<typeof RatingAdapterContextBasisSchema>;

export const RatingAdapterInputBasisSchema = z.enum([
  "airborne_transmission_loss_curve",
  "airborne_apparent_transmission_loss_curve",
  "airborne_standardized_level_difference_curve",
  "airborne_normalized_level_difference_curve",
  "outdoor_indoor_transmission_loss_curve",
  "impact_level_curve",
  "impact_field_level_curve",
  "impact_standardized_field_level_curve",
  "source_single_number_rating",
  "engine_single_number_estimate"
]);
export type RatingAdapterInputBasis = z.infer<typeof RatingAdapterInputBasisSchema>;

export const RatingAdapterStandardSchema = z.enum([
  "ISO 717-1",
  "ISO 717-2",
  "ASTM E413",
  "ASTM E1332",
  "ASTM E989",
  "source_report",
  "engine_native_bounded_estimate"
]);
export type RatingAdapterStandard = z.infer<typeof RatingAdapterStandardSchema>;

export const RatingAdapterImplementationStatusSchema = z.enum([
  "runtime_adapter",
  "source_exact_only",
  "planned_not_implemented",
  "blocked_until_source_owned_curve"
]);
export type RatingAdapterImplementationStatus = z.infer<typeof RatingAdapterImplementationStatusSchema>;

export const RatingAliasBlockSchema = z.object({
  fromMetricId: RequestedOutputSchema,
  reason: z.string().min(1),
  toMetricId: RequestedOutputSchema
});
export type RatingAliasBlock = z.infer<typeof RatingAliasBlockSchema>;

const airborneOutputs = new Set<RequestedOutputId>([
  "Rw",
  "R'w",
  "STC",
  "OITC",
  "C",
  "Ctr",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A"
]);

const impactOutputs = new Set<RequestedOutputId>([
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

const iso7171Metrics = new Set<RequestedOutputId>([
  "Rw",
  "R'w",
  "C",
  "Ctr",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A"
]);

const iso7172Metrics = new Set<RequestedOutputId>([
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);

const astmE989Metrics = new Set<RequestedOutputId>(["IIC", "AIIC", "LIIC", "LIR", "HIIC"]);
const astmE1332Metrics = new Set<RequestedOutputId>(["OITC"]);
const fieldOrBuildingMetrics = new Set<RequestedOutputId>([
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "AIIC",
  "NISR",
  "ISR",
  "LIIC",
  "LIR",
  "HIIC"
]);

function addIssue(ctx: z.RefinementCtx, path: (string | number)[], message: string): void {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message,
    path
  });
}

export const RatingAdapterBasisSchema = z
  .object({
    adapterId: RatingAdapterIdSchema,
    aliasBlocks: z.array(RatingAliasBlockSchema).default([]),
    blockedReasons: z.array(z.string().min(1)).default([]),
    contextBasis: RatingAdapterContextBasisSchema,
    implementationStatus: RatingAdapterImplementationStatusSchema,
    inputBasis: RatingAdapterInputBasisSchema,
    metricFamily: RatingAdapterMetricFamilySchema,
    metricId: RequestedOutputSchema,
    notes: z.array(z.string().min(1)).default([]),
    ratingStandard: RatingAdapterStandardSchema,
    requiredContextInputs: z.array(z.string().min(1)).default([]),
    sourceMetricIds: z.array(RequestedOutputSchema).default([])
  })
  .superRefine((basis, ctx) => {
    if (airborneOutputs.has(basis.metricId) && basis.metricFamily !== "airborne") {
      addIssue(ctx, ["metricFamily"], `${basis.metricId} is an airborne metric and cannot use an impact rating family`);
    }

    if (impactOutputs.has(basis.metricId) && basis.metricFamily !== "impact") {
      addIssue(ctx, ["metricFamily"], `${basis.metricId} is an impact metric and cannot use an airborne rating family`);
    }

    if (basis.metricId === "STC" && basis.ratingStandard !== "ASTM E413") {
      addIssue(ctx, ["ratingStandard"], "STC requires the ASTM E413 rating standard");
    }

    if (basis.metricId === "OITC" && basis.ratingStandard !== "ASTM E1332") {
      addIssue(ctx, ["ratingStandard"], "OITC requires the ASTM E1332 outdoor-indoor rating standard");
    }

    if (iso7171Metrics.has(basis.metricId) && basis.ratingStandard === "ASTM E413") {
      addIssue(ctx, ["ratingStandard"], `${basis.metricId} must not be silently rated as ASTM E413/STC`);
    }

    if (iso7172Metrics.has(basis.metricId) && basis.ratingStandard === "ASTM E989") {
      addIssue(ctx, ["ratingStandard"], `${basis.metricId} must not be silently rated as ASTM E989/IIC`);
    }

    if (astmE989Metrics.has(basis.metricId) && basis.ratingStandard !== "ASTM E989") {
      addIssue(ctx, ["ratingStandard"], `${basis.metricId} requires the ASTM E989 impact rating standard`);
    }

    if (!astmE1332Metrics.has(basis.metricId) && basis.ratingStandard === "ASTM E1332") {
      addIssue(ctx, ["ratingStandard"], `${basis.metricId} must not be silently rated as ASTM E1332/OITC`);
    }

    if (fieldOrBuildingMetrics.has(basis.metricId) && basis.contextBasis === "element_lab") {
      addIssue(ctx, ["contextBasis"], `${basis.metricId} requires field or building context, not element_lab`);
    }

    if (
      basis.implementationStatus === "planned_not_implemented" &&
      basis.blockedReasons.length === 0
    ) {
      addIssue(ctx, ["blockedReasons"], "planned_not_implemented rating adapters must name the blocker");
    }
  });
export type RatingAdapterBasis = z.infer<typeof RatingAdapterBasisSchema>;

const requiredInventoryStandards: readonly RatingAdapterStandard[] = [
  "ISO 717-1",
  "ISO 717-2",
  "ASTM E413",
  "ASTM E989"
];

export const RatingAdapterInventorySchema = z.array(RatingAdapterBasisSchema).min(1).superRefine((inventory, ctx) => {
  for (const standard of requiredInventoryStandards) {
    if (!inventory.some((basis) => basis.ratingStandard === standard)) {
      addIssue(ctx, [], `rating adapter inventory must include ${standard}`);
    }
  }

  const seen = new Set<string>();
  for (const [index, basis] of inventory.entries()) {
    const key = `${basis.metricId}:${basis.adapterId}`;
    if (seen.has(key)) {
      addIssue(ctx, [index, "adapterId"], `duplicate rating adapter inventory entry ${key}`);
    }

    seen.add(key);
  }
});
export type RatingAdapterInventory = z.infer<typeof RatingAdapterInventorySchema>;
