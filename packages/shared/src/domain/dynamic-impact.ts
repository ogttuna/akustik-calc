import { z } from "zod";

import { FloorSystemEstimateKindSchema } from "./floor-system";
import { ImpactEstimateBasisSchema, ImpactConfidenceLevelSchema } from "./impact";
import { ImpactSupportingElementFamilySchema } from "./impact-flanking";
import {
  ImpactPredictorStructuralSupportTypeSchema,
  ImpactPredictorSupportFormSchema,
  ImpactPredictorSystemTypeSchema
} from "./impact-predictor-input";
import { ImpactPredictorInputModeSchema } from "./impact-predictor-status";

export const DynamicImpactSelectionKindSchema = z.enum([
  "exact_band_source",
  "exact_floor_system",
  "official_catalog",
  "reference_derived",
  "formula_estimate",
  "family_estimate",
  "bound_floor_system",
  "bound_family_estimate"
]);
export type DynamicImpactSelectionKind = z.infer<typeof DynamicImpactSelectionKindSchema>;

export const DynamicImpactEvidenceTierSchema = z.enum(["exact", "estimate", "bound", "derived"]);
export type DynamicImpactEvidenceTier = z.infer<typeof DynamicImpactEvidenceTierSchema>;

export const DynamicImpactFieldContinuationSchema = z.enum([
  "none",
  "explicit_k_correction",
  "direct_flanking_energy_sum",
  "standardized_room_volume",
  "local_guide_simple",
  "local_guide_small_room",
  "bound_room_volume"
]);
export type DynamicImpactFieldContinuation = z.infer<typeof DynamicImpactFieldContinuationSchema>;

const DynamicImpactTraceShape = {
  availableMetricLabels: z.array(z.string().min(1)).default([]),
  boundOnly: z.boolean(),
  candidateRowCount: z.number().int().nonnegative(),
  confidenceClass: ImpactConfidenceLevelSchema,
  confidenceScore: z.number().min(0).max(1),
  confidenceSummary: z.string().min(1),
  detectedSupportFamily: ImpactSupportingElementFamilySchema.optional(),
  detectedSupportFamilyLabel: z.string().min(1).optional(),
  directFlankingActive: z.boolean(),
  estimateTier: FloorSystemEstimateKindSchema.optional(),
  estimateTierLabel: z.string().min(1).optional(),
  evidenceTier: DynamicImpactEvidenceTierSchema,
  evidenceTierLabel: z.string().min(1),
  fieldContinuation: DynamicImpactFieldContinuationSchema,
  fieldContinuationLabel: z.string().min(1),
  fieldOutputsActive: z.boolean(),
  fitPercent: z.number().min(0).max(100).optional(),
  guideActive: z.boolean(),
  hasFieldContext: z.boolean(),
  impactBasis: ImpactEstimateBasisSchema.optional(),
  impactBasisLabel: z.string().min(1),
  matchedCatalogCaseId: z.string().min(1).optional(),
  matchedFloorSystemId: z.string().min(1).optional(),
  notes: z.array(z.string()).default([]),
  predictorInputMode: ImpactPredictorInputModeSchema.optional(),
  selectedLabel: z.string().min(1),
  selectedSourceIds: z.array(z.string().min(1)).default([]),
  selectedSourceLabels: z.array(z.string().min(1)).default([]),
  selectionKind: DynamicImpactSelectionKindSchema,
  selectionKindLabel: z.string().min(1),
  standardizedFieldActive: z.boolean(),
  structuralSupportLabel: z.string().min(1).optional(),
  structuralSupportType: ImpactPredictorStructuralSupportTypeSchema.optional(),
  supportForm: ImpactPredictorSupportFormSchema.optional(),
  supportFormLabel: z.string().min(1).optional(),
  systemType: ImpactPredictorSystemTypeSchema.optional(),
  systemTypeLabel: z.string().min(1).optional()
} satisfies z.ZodRawShape;

const DynamicImpactTraceSchemaInternal = z.object(DynamicImpactTraceShape);

export type DynamicImpactTrace = z.infer<typeof DynamicImpactTraceSchemaInternal>;

export const DynamicImpactTraceSchema: z.ZodType<
  DynamicImpactTrace,
  z.ZodTypeDef,
  z.input<typeof DynamicImpactTraceSchemaInternal>
> = DynamicImpactTraceSchemaInternal;
