import { z } from "zod";

import { AirborneCandidateResolutionSchema, AirborneResultBasisSchema } from "./airborne-basis";
import { AirborneContextSchema } from "./airborne-context";
import { AirborneCalculatorIdSchema } from "./calculator";
import { ExactImpactSourceSchema } from "./exact-impact-source";
import { ImpactFieldContextSchema } from "./impact-field-context";
import { ImpactPredictorInputSchema } from "./impact-predictor-input";
import { LayerInputSchema } from "./layer";
import { MaterialDefinitionSchema, type MaterialDefinition } from "./material";
import { RequestedOutputSchema, type RequestedOutputId } from "./output";
import { JsonValueSchema, type JsonValue } from "./project";
import { RatingAdapterBasisSchema } from "./rating-adapter";
import { SteelFloorFormulaInputSurfaceSchema } from "./steel-floor-formula-input-surface";

export const PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION = 1;
export const PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_FINGERPRINT_PREFIX =
  "dynecho:user-verified-calculated-anchor:v1";

export const ProjectUserVerifiedCalculatedAnchorScopeSchema = z.enum([
  "project_evidence",
  "user_evidence",
  "team_evidence"
]);
export const ProjectUserVerifiedCalculatedAnchorStatusSchema = z.enum([
  "draft",
  "active",
  "conflict",
  "retired",
  "promoted"
]);
export const ProjectUserVerifiedCalculatedAnchorModeSchema = z.enum(["wall", "floor", "ceiling", "opening"]);
export const ProjectUserVerifiedCalculatedAnchorConfidencePolicySchema = z.enum(["exact_only"]);
export const ProjectUserVerifiedCalculatedAnchorMetricBasisSchema = z.enum([
  "airborne_lab",
  "airborne_field",
  "airborne_building_prediction",
  "impact_lab",
  "impact_field"
]);
export type ProjectUserVerifiedCalculatedAnchorMetricBasis = z.infer<
  typeof ProjectUserVerifiedCalculatedAnchorMetricBasisSchema
>;

const IMPACT_OUTPUT_IDS = new Set<RequestedOutputId>([
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
  "LIIC",
  "LIR",
  "HIIC"
]);

type JsonObject = { [key: string]: JsonValue };

const JsonObjectSchema: z.ZodType<JsonObject> = z.record(JsonValueSchema);

const OptionalTrimmedTextSchema = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim().length === 0 ? undefined : value),
    z.string().trim().max(maxLength).optional()
  );

const NonEmptyTrimmedTextSchema = (maxLength: number) => z.string().trim().min(1).max(maxLength);

const ProjectUserVerifiedCalculatedAnchorFloorImpactContextSchema = z
  .object({
    loadBasisKgM2: z.number().positive().optional(),
    resilientLayerDynamicStiffnessMNm3: z.number().positive().optional()
  })
  .partial()
  .strict();

function duplicateMaterialIdsIssue(materials: readonly MaterialDefinition[], context: z.RefinementCtx) {
  const seen = new Map<string, number>();

  materials.forEach((material, index) => {
    const previousIndex = seen.get(material.id);
    if (previousIndex === undefined) {
      seen.set(material.id, index);
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate verified-calculated material id "${material.id}" also appears at materialCatalog.${previousIndex}.`,
      path: [index, "id"]
    });
  });
}

function duplicateRequestedOutputIssues(
  outputs: readonly RequestedOutputId[],
  context: z.RefinementCtx,
  messagePrefix: string
) {
  const seen = new Map<RequestedOutputId, number>();

  outputs.forEach((output, index) => {
    const previousIndex = seen.get(output);
    if (previousIndex === undefined) {
      seen.set(output, index);
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${messagePrefix} duplicate output "${output}" also appears at index ${previousIndex}.`,
      path: [index]
    });
  });
}

export const ProjectUserVerifiedCalculatedAnchorRequestContextSchema = z
  .object({
    airborneContext: AirborneContextSchema.optional(),
    calculator: AirborneCalculatorIdSchema.optional(),
    exactImpactSource: ExactImpactSourceSchema.optional(),
    floorImpactContext: ProjectUserVerifiedCalculatedAnchorFloorImpactContextSchema.optional(),
    impactFieldContext: ImpactFieldContextSchema.optional(),
    impactPredictorInput: ImpactPredictorInputSchema.optional(),
    layers: z.array(LayerInputSchema).min(1).max(128),
    materialCatalog: z.array(MaterialDefinitionSchema).max(128).default([]).superRefine(duplicateMaterialIdsIssue),
    mode: ProjectUserVerifiedCalculatedAnchorModeSchema,
    steelFloorFormulaSurface: SteelFloorFormulaInputSurfaceSchema.optional(),
    targetOutputs: z.array(RequestedOutputSchema).min(1).max(32).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated request context");
    })
  })
  .strict();

export type ProjectUserVerifiedCalculatedAnchorRequestContext = z.infer<
  typeof ProjectUserVerifiedCalculatedAnchorRequestContextSchema
>;

export const ProjectUserVerifiedCalculatedAnchorValueProvenanceSchema = z
  .object({
    basisId: OptionalTrimmedTextSchema(240),
    outputStatus: z.literal("supported"),
    routeId: OptionalTrimmedTextSchema(240),
    source: z.literal("calculated_live_result")
  })
  .strict();

export const ProjectUserVerifiedCalculatedAnchorValueSchema = z
  .object({
    metric: RequestedOutputSchema,
    metricBasis: ProjectUserVerifiedCalculatedAnchorMetricBasisSchema,
    provenance: ProjectUserVerifiedCalculatedAnchorValueProvenanceSchema,
    valueDb: z.number().finite().min(-120).max(160)
  })
  .strict()
  .superRefine((value, context) => {
    const isImpactMetric = IMPACT_OUTPUT_IDS.has(value.metric);
    const isImpactBasis = value.metricBasis === "impact_lab" || value.metricBasis === "impact_field";

    if (isImpactMetric !== isImpactBasis) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Verified-calculated anchor value metric and metricBasis must stay in the same airborne/impact family.",
        path: ["metricBasis"]
      });
    }
  });

export type ProjectUserVerifiedCalculatedAnchorValue = z.infer<
  typeof ProjectUserVerifiedCalculatedAnchorValueSchema
>;

function duplicateValueIssues(
  values: readonly ProjectUserVerifiedCalculatedAnchorValue[],
  context: z.RefinementCtx
) {
  const seen = new Map<string, number>();

  values.forEach((value, index) => {
    const key = `${value.metric}|${value.metricBasis}`;
    const previousIndex = seen.get(key);
    if (previousIndex === undefined) {
      seen.set(key, index);
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate verified-calculated value for "${value.metric}" on basis "${value.metricBasis}" also appears at values.${previousIndex}.`,
      path: [index, "metric"]
    });
  });
}

export const ProjectUserVerifiedCalculatedAnchorValuesSchema = z
  .array(ProjectUserVerifiedCalculatedAnchorValueSchema)
  .min(1)
  .max(32)
  .superRefine(duplicateValueIssues);

export const ProjectUserVerifiedCalculatedAnchorResultBasisTraceSchema = z
  .object({
    airborneBasis: AirborneResultBasisSchema.optional(),
    airborneCandidateResolution: AirborneCandidateResolutionSchema.optional(),
    assumptions: z.array(NonEmptyTrimmedTextSchema(500)).max(64).default([]),
    calculator: AirborneCalculatorIdSchema.optional(),
    ratingAdapterBasisSet: z.array(RatingAdapterBasisSchema).max(32).default([]),
    supportedImpactOutputs: z.array(RequestedOutputSchema).max(32).default([]).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated trace supportedImpactOutputs");
    }),
    supportedTargetOutputs: z.array(RequestedOutputSchema).max(32).default([]).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated trace supportedTargetOutputs");
    }),
    targetOutputs: z.array(RequestedOutputSchema).min(1).max(32).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated trace targetOutputs");
    }),
    unsupportedImpactOutputs: z.array(RequestedOutputSchema).max(32).default([]).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated trace unsupportedImpactOutputs");
    }),
    unsupportedTargetOutputs: z.array(RequestedOutputSchema).max(32).default([]).superRefine((outputs, context) => {
      duplicateRequestedOutputIssues(outputs, context, "Verified-calculated trace unsupportedTargetOutputs");
    }),
    warnings: z.array(NonEmptyTrimmedTextSchema(1000)).max(64).default([])
  })
  .strict();

export type ProjectUserVerifiedCalculatedAnchorResultBasisTrace = z.infer<
  typeof ProjectUserVerifiedCalculatedAnchorResultBasisTraceSchema
>;

export const ProjectUserVerifiedCalculatedAnchorFingerprintSchema = z
  .string()
  .regex(/^dynecho:user-verified-calculated-anchor:v1:[a-f0-9]{16}$/u);

export const ProjectUserVerifiedCalculatedAnchorBaseSchema = z
  .object({
    anchorKind: z.literal("user_verified_calculated_result"),
    canonicalizationVersion: z.literal(PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION),
    confidencePolicy: ProjectUserVerifiedCalculatedAnchorConfidencePolicySchema.default("exact_only"),
    createdAtIso: z.string().datetime(),
    createdBy: OptionalTrimmedTextSchema(128),
    createdFromPresetId: OptionalTrimmedTextSchema(160),
    createdFromProjectId: OptionalTrimmedTextSchema(160),
    description: OptionalTrimmedTextSchema(1000),
    fingerprint: ProjectUserVerifiedCalculatedAnchorFingerprintSchema,
    id: NonEmptyTrimmedTextSchema(160),
    name: NonEmptyTrimmedTextSchema(240),
    requestContext: ProjectUserVerifiedCalculatedAnchorRequestContextSchema,
    resultBasisTrace: ProjectUserVerifiedCalculatedAnchorResultBasisTraceSchema,
    revision: z.number().int().positive(),
    scope: ProjectUserVerifiedCalculatedAnchorScopeSchema,
    sourceUrl: OptionalTrimmedTextSchema(500),
    status: ProjectUserVerifiedCalculatedAnchorStatusSchema,
    updatedAtIso: z.string().datetime(),
    values: ProjectUserVerifiedCalculatedAnchorValuesSchema,
    valuesChecksum: OptionalTrimmedTextSchema(160),
    workbenchSnapshot: JsonObjectSchema.default({})
  })
  .strict();

export type ProjectUserVerifiedCalculatedAnchor = z.infer<
  typeof ProjectUserVerifiedCalculatedAnchorBaseSchema
>;

export type ProjectUserVerifiedCalculatedAnchorFingerprintInput = {
  readonly requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext;
};

function roundNumber(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function canonicalJsonValue(value: unknown): unknown {
  if (typeof value === "number") {
    return Number.isFinite(value) ? roundNumber(value, 6) : value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, canonicalJsonValue(entryValue)])
    );
  }

  return value;
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));

  return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableJson(entryValue)}`).join(",")}}`;
}

function fnv1a64(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }

  return hash.toString(16).padStart(16, "0");
}

function canonicalMaterial(material: MaterialDefinition) {
  return {
    acoustic: material.acoustic
      ? {
          absorberClass: material.acoustic.absorberClass,
          behavior: material.acoustic.behavior,
          flowResistivityPaSM2:
            typeof material.acoustic.flowResistivityPaSM2 === "number"
              ? roundNumber(material.acoustic.flowResistivityPaSM2, 3)
              : undefined,
          lossFactor:
            typeof material.acoustic.lossFactor === "number" ? roundNumber(material.acoustic.lossFactor, 6) : undefined,
          poissonRatio:
            typeof material.acoustic.poissonRatio === "number"
              ? roundNumber(material.acoustic.poissonRatio, 6)
              : undefined,
          porosity:
            typeof material.acoustic.porosity === "number" ? roundNumber(material.acoustic.porosity, 6) : undefined,
          propertySourceStatus: material.acoustic.propertySourceStatus,
          youngModulusPa:
            typeof material.acoustic.youngModulusPa === "number"
              ? roundNumber(material.acoustic.youngModulusPa, 3)
              : undefined
        }
      : undefined,
    category: material.category,
    densityKgM3: roundNumber(material.densityKgM3, 6),
    id: material.id,
    impactDynamicStiffnessMNm3:
      typeof material.impact?.dynamicStiffnessMNm3 === "number"
        ? roundNumber(material.impact.dynamicStiffnessMNm3, 6)
        : undefined
  };
}

function canonicalRequestContext(context: ProjectUserVerifiedCalculatedAnchorRequestContext) {
  return {
    airborneContext: canonicalJsonValue(context.airborneContext),
    calculator: context.calculator,
    exactImpactSource: canonicalJsonValue(context.exactImpactSource),
    floorImpactContext: canonicalJsonValue(context.floorImpactContext),
    impactFieldContext: canonicalJsonValue(context.impactFieldContext),
    impactPredictorInput: canonicalJsonValue(context.impactPredictorInput),
    layers: context.layers.map((layer) => ({
      floorRole: layer.floorRole,
      materialId: layer.materialId,
      surfaceMassKgM2:
        typeof layer.surfaceMassKgM2 === "number" ? roundNumber(layer.surfaceMassKgM2, 6) : undefined,
      thicknessMm: roundNumber(layer.thicknessMm, 3)
    })),
    materialCatalog: [...context.materialCatalog]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(canonicalMaterial),
    mode: context.mode,
    steelFloorFormulaSurface: canonicalJsonValue(context.steelFloorFormulaSurface)
  };
}

export function buildProjectUserVerifiedCalculatedAnchorFingerprint(
  input: ProjectUserVerifiedCalculatedAnchorFingerprintInput
): string {
  const requestContext = ProjectUserVerifiedCalculatedAnchorRequestContextSchema.parse(input.requestContext);
  const canonical = {
    anchorKind: "user_verified_calculated_result",
    canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
    requestContext: canonicalRequestContext(requestContext)
  };

  return `${PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_FINGERPRINT_PREFIX}:${fnv1a64(stableJson(canonical))}`;
}

// Agent coordination guard: this schema is intentionally inert. Do not wire it
// into measured/source estimate lanes or engine resolvers without a separate
// exact-runtime owner and provenance tests.
export const ProjectUserVerifiedCalculatedAnchorSchema =
  ProjectUserVerifiedCalculatedAnchorBaseSchema.superRefine((anchor, context) => {
    const expectedFingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({
      requestContext: anchor.requestContext
    });

    if (anchor.fingerprint !== expectedFingerprint) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "User-verified calculated anchor fingerprint does not match its calculation-relevant request context.",
        path: ["fingerprint"]
      });
    }

    const requestedOutputs = new Set(anchor.requestContext.targetOutputs);
    const traceTargetOutputs = new Set(anchor.resultBasisTrace.targetOutputs);
    const supportedOutputs = new Set([
      ...anchor.resultBasisTrace.supportedTargetOutputs,
      ...anchor.resultBasisTrace.supportedImpactOutputs
    ]);
    const unsupportedOutputs = new Set([
      ...anchor.resultBasisTrace.unsupportedTargetOutputs,
      ...anchor.resultBasisTrace.unsupportedImpactOutputs
    ]);

    anchor.values.forEach((value, index) => {
      if (!requestedOutputs.has(value.metric) || !traceTargetOutputs.has(value.metric)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Verified-calculated value "${value.metric}" must come from the saved selected outputs.`,
          path: ["values", index, "metric"]
        });
      }

      if (!supportedOutputs.has(value.metric)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Verified-calculated value "${value.metric}" must be supported by the saved live result trace.`,
          path: ["values", index, "metric"]
        });
      }

      if (unsupportedOutputs.has(value.metric)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Verified-calculated value "${value.metric}" cannot also be listed as unsupported.`,
          path: ["values", index, "metric"]
        });
      }
    });
  });

// Active means auditable and selectable by future owner code, not automatically
// runtime-active today. Estimate request schemas must opt in explicitly.
export const ActiveProjectUserVerifiedCalculatedAnchorSchema =
  ProjectUserVerifiedCalculatedAnchorSchema.superRefine((anchor, context) => {
    if (anchor.status !== "active") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only active user-verified calculated anchors can become future runtime candidates.",
        path: ["status"]
      });
    }

    if (anchor.confidencePolicy !== "exact_only") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "User-verified calculated runtime candidates must remain exact-only.",
        path: ["confidencePolicy"]
      });
    }
  });

export type ActiveProjectUserVerifiedCalculatedAnchor = z.infer<
  typeof ActiveProjectUserVerifiedCalculatedAnchorSchema
>;
