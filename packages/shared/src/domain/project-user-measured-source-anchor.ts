import { z } from "zod";

import { MaterialDefinitionSchema, type MaterialDefinition } from "./material";

export const PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION = 1;
export const PROJECT_USER_MEASURED_WALL_RW_ANCHOR_FINGERPRINT_PREFIX =
  "dynecho:wall-rw-anchor:v1";
export const PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION = 1;
export const PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_FINGERPRINT_PREFIX =
  "dynecho:wall-airborne-frequency-anchor:v1";

export const ProjectUserMeasuredSourceAnchorScopeSchema = z.enum([
  "project_measured",
  "user_measured",
  "team_measured",
  "verified_global"
]);
export const ProjectUserMeasuredSourceAnchorStatusSchema = z.enum([
  "draft",
  "active",
  "retired",
  "promoted"
]);
export const ProjectUserMeasuredSourceAnchorSourceModeSchema = z.enum(["lab", "field"]);
export const ProjectUserMeasuredWallRwMetricBasisSchema = z.enum(["lab_rw", "field_apparent", "building_prediction"]);
export const ProjectUserMeasuredWallMeasurementMethodStandardSchema = z.enum([
  "ISO 10140-2",
  "ASTM E90",
  "source_report_unknown"
]);
export const ProjectUserMeasuredWallRatingStandardSchema = z.enum([
  "ISO 717-1",
  "ASTM E413",
  "source_report_unknown"
]);
export const ProjectUserMeasuredWallRwAnchorConfidencePolicySchema = z.enum([
  "exact_only",
  "exact_plus_compatible_exterior_board_delta"
]);
export const ProjectUserMeasuredWallAirborneFrequencyAnchorConfidencePolicySchema = z.enum([
  "exact_only"
]);
export const ProjectUserMeasuredWallAirborneFrequencyMetricBasisSchema = z.enum([
  "lab_airborne_transmission_loss_curve"
]);
export const ProjectUserMeasuredWallAirborneFrequencyBandSetSchema = z.enum([
  "third_octave_100_3150",
  "third_octave_50_5000"
]);

export const ProjectUserMeasuredWallLayerRoleSchema = z.enum([
  "leaf",
  "board",
  "cavity",
  "absorber",
  "support",
  "finish"
]);
export const ProjectUserMeasuredWallLayerSideSchema = z.enum(["side_a", "cavity", "side_b"]);
export const ProjectUserMeasuredWallTopologySchema = z.enum([
  "single_leaf",
  "double_leaf",
  "framed_double_leaf",
  "mass_timber",
  "unknown"
]);
export const ProjectUserMeasuredWallSupportTopologySchema = z.enum([
  "none",
  "timber_stud",
  "steel_stud",
  "resilient_bar",
  "independent_frame",
  "unknown"
]);

const OptionalTrimmedTextSchema = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim().length === 0 ? undefined : value),
    z.string().trim().max(maxLength).optional()
  );

export const ProjectUserMeasuredWallLayerSnapshotSchema = z
  .object({
    materialId: z.string().trim().min(1).max(160),
    role: ProjectUserMeasuredWallLayerRoleSchema.optional(),
    side: ProjectUserMeasuredWallLayerSideSchema.optional(),
    thicknessMm: z.number().finite().positive()
  })
  .strict();

export const ProjectUserMeasuredWallContextSnapshotSchema = z
  .object({
    cavityDepthMm: z.number().finite().positive().optional(),
    cavityFillMaterialId: z.string().trim().min(1).max(160).optional(),
    supportSpacingMm: z.number().finite().positive().optional(),
    supportTopology: ProjectUserMeasuredWallSupportTopologySchema.default("unknown"),
    wallTopology: ProjectUserMeasuredWallTopologySchema
  })
  .strict();

export const ProjectUserMeasuredWallMaterialVisualOverrideSchema = z
  .object({
    color: OptionalTrimmedTextSchema(32),
    materialId: z.string().trim().min(1).max(160)
  })
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
      message: `Duplicate measured-anchor material id "${material.id}" also appears at materialCatalog.${previousIndex}.`,
      path: [index, "id"]
    });
  });
}

export const ProjectUserMeasuredWallConstructionSnapshotSchema = z
  .object({
    layers: z.array(ProjectUserMeasuredWallLayerSnapshotSchema).min(1).max(64),
    materialCatalog: z.array(MaterialDefinitionSchema).max(64).default([]).superRefine(duplicateMaterialIdsIssue),
    materialVisualOverrides: z.array(ProjectUserMeasuredWallMaterialVisualOverrideSchema).max(64).default([]),
    wallContext: ProjectUserMeasuredWallContextSnapshotSchema
  })
  .strict();

export const ProjectUserMeasuredWallRwAnchorFingerprintSchema = z
  .string()
  .regex(/^dynecho:wall-rw-anchor:v1:[a-f0-9]{16}$/u);
export const ProjectUserMeasuredWallAirborneFrequencyAnchorFingerprintSchema = z
  .string()
  .regex(/^dynecho:wall-airborne-frequency-anchor:v1:[a-f0-9]{16}$/u);

export const ProjectUserMeasuredWallAirborneFrequencyBandValueSchema = z
  .object({
    frequencyHz: z.number().finite().positive(),
    transmissionLossDb: z.number().finite().min(0).max(120)
  })
  .strict();

function duplicateFrequencyBandIssues(
  bands: readonly z.infer<typeof ProjectUserMeasuredWallAirborneFrequencyBandValueSchema>[],
  context: z.RefinementCtx
) {
  const seen = new Map<string, number>();

  bands.forEach((band, index) => {
    const key = roundNumber(band.frequencyHz, 3).toFixed(3);
    const previousIndex = seen.get(key);
    if (previousIndex === undefined) {
      seen.set(key, index);
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate measured airborne frequency band ${key} Hz also appears at values.${previousIndex}.`,
      path: [index, "frequencyHz"]
    });
  });
}

export const ProjectUserMeasuredWallAirborneFrequencyBandsSchema = z
  .object({
    bandSet: ProjectUserMeasuredWallAirborneFrequencyBandSetSchema,
    values: z
      .array(ProjectUserMeasuredWallAirborneFrequencyBandValueSchema)
      .min(1)
      .max(64)
      .superRefine(duplicateFrequencyBandIssues)
  })
  .strict();

function duplicateRatingStandardIssues(
  ratingStandards: readonly z.infer<typeof ProjectUserMeasuredWallRatingStandardSchema>[],
  context: z.RefinementCtx
) {
  const seen = new Map<string, number>();

  ratingStandards.forEach((ratingStandard, index) => {
    const previousIndex = seen.get(ratingStandard);
    if (previousIndex === undefined) {
      seen.set(ratingStandard, index);
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate measured airborne rating standard "${ratingStandard}" also appears at ratingStandards.${previousIndex}.`,
      path: [index]
    });
  });
}

export const ProjectUserMeasuredWallRatingStandardsSchema = z
  .array(ProjectUserMeasuredWallRatingStandardSchema)
  .min(1)
  .max(4)
  .superRefine(duplicateRatingStandardIssues);

export const ProjectUserMeasuredWallRwAnchorBaseSchema = z
  .object({
    canonicalizationVersion: z.literal(PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION),
    confidencePolicy: ProjectUserMeasuredWallRwAnchorConfidencePolicySchema.default("exact_only"),
    createdAtIso: z.string().datetime(),
    createdBy: OptionalTrimmedTextSchema(128),
    createdFromPresetId: OptionalTrimmedTextSchema(160),
    createdFromProjectId: OptionalTrimmedTextSchema(160),
    fingerprint: ProjectUserMeasuredWallRwAnchorFingerprintSchema,
    id: z.string().trim().min(1).max(160),
    measurementMethodStandard: ProjectUserMeasuredWallMeasurementMethodStandardSchema,
    metric: z.literal("Rw"),
    metricBasis: ProjectUserMeasuredWallRwMetricBasisSchema,
    ratingStandard: ProjectUserMeasuredWallRatingStandardSchema,
    revision: z.number().int().positive(),
    scope: ProjectUserMeasuredSourceAnchorScopeSchema,
    snapshot: ProjectUserMeasuredWallConstructionSnapshotSchema,
    sourceDescription: OptionalTrimmedTextSchema(1000),
    sourceLabel: z.string().trim().min(1).max(240),
    sourceMode: ProjectUserMeasuredSourceAnchorSourceModeSchema,
    sourceStatus: ProjectUserMeasuredSourceAnchorStatusSchema,
    sourceUrl: OptionalTrimmedTextSchema(500),
    toleranceDb: z.number().finite().nonnegative().max(20),
    updatedAtIso: z.string().datetime(),
    valueDb: z.number().finite().min(0).max(120)
  })
  .strict();

export const ProjectUserMeasuredWallAirborneFrequencyAnchorBaseSchema = z
  .object({
    canonicalizationVersion: z.literal(PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION),
    confidencePolicy: ProjectUserMeasuredWallAirborneFrequencyAnchorConfidencePolicySchema.default("exact_only"),
    createdAtIso: z.string().datetime(),
    createdBy: OptionalTrimmedTextSchema(128),
    createdFromPresetId: OptionalTrimmedTextSchema(160),
    createdFromProjectId: OptionalTrimmedTextSchema(160),
    curveBasis: z.literal("measured_frequency_curve"),
    fingerprint: ProjectUserMeasuredWallAirborneFrequencyAnchorFingerprintSchema,
    frequencyBands: ProjectUserMeasuredWallAirborneFrequencyBandsSchema,
    id: z.string().trim().min(1).max(160),
    inputBasis: z.literal("airborne_transmission_loss_curve"),
    measurementMethodStandard: ProjectUserMeasuredWallMeasurementMethodStandardSchema,
    metricBasis: ProjectUserMeasuredWallAirborneFrequencyMetricBasisSchema,
    metricFamily: z.literal("airborne"),
    ratingStandards: ProjectUserMeasuredWallRatingStandardsSchema,
    revision: z.number().int().positive(),
    scope: ProjectUserMeasuredSourceAnchorScopeSchema,
    snapshot: ProjectUserMeasuredWallConstructionSnapshotSchema,
    sourceDescription: OptionalTrimmedTextSchema(1000),
    sourceLabel: z.string().trim().min(1).max(240),
    sourceMode: ProjectUserMeasuredSourceAnchorSourceModeSchema,
    sourceStatus: ProjectUserMeasuredSourceAnchorStatusSchema,
    sourceUrl: OptionalTrimmedTextSchema(500),
    toleranceDb: z.number().finite().nonnegative().max(20).optional(),
    updatedAtIso: z.string().datetime()
  })
  .strict();

export type ProjectUserMeasuredSourceAnchorScope = z.infer<typeof ProjectUserMeasuredSourceAnchorScopeSchema>;
export type ProjectUserMeasuredSourceAnchorStatus = z.infer<typeof ProjectUserMeasuredSourceAnchorStatusSchema>;
export type ProjectUserMeasuredWallConstructionSnapshot = z.infer<
  typeof ProjectUserMeasuredWallConstructionSnapshotSchema
>;
export type ProjectUserMeasuredWallRwAnchor = z.infer<typeof ProjectUserMeasuredWallRwAnchorBaseSchema>;
export type ProjectUserMeasuredWallAirborneFrequencyBands = z.infer<
  typeof ProjectUserMeasuredWallAirborneFrequencyBandsSchema
>;
export type ProjectUserMeasuredWallAirborneFrequencyAnchor = z.infer<
  typeof ProjectUserMeasuredWallAirborneFrequencyAnchorBaseSchema
>;

export type ProjectUserMeasuredWallRwAnchorFingerprintInput = {
  readonly measurementMethodStandard: z.infer<typeof ProjectUserMeasuredWallMeasurementMethodStandardSchema>;
  readonly metric?: "Rw";
  readonly metricBasis?: "lab_rw";
  readonly ratingStandard: z.infer<typeof ProjectUserMeasuredWallRatingStandardSchema>;
  readonly snapshot: ProjectUserMeasuredWallConstructionSnapshot;
  readonly sourceMode?: "lab";
};
export type ProjectUserMeasuredWallAirborneFrequencyAnchorFingerprintInput = {
  readonly curveBasis?: "measured_frequency_curve";
  readonly frequencyBands: ProjectUserMeasuredWallAirborneFrequencyBands;
  readonly inputBasis?: "airborne_transmission_loss_curve";
  readonly measurementMethodStandard: z.infer<typeof ProjectUserMeasuredWallMeasurementMethodStandardSchema>;
  readonly metricBasis?: z.infer<typeof ProjectUserMeasuredWallAirborneFrequencyMetricBasisSchema>;
  readonly metricFamily?: "airborne";
  readonly ratingStandards: readonly z.infer<typeof ProjectUserMeasuredWallRatingStandardSchema>[];
  readonly snapshot: ProjectUserMeasuredWallConstructionSnapshot;
  readonly sourceMode?: "lab";
};

function roundNumber(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
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

function canonicalWallSnapshot(snapshot: ProjectUserMeasuredWallConstructionSnapshot) {
  return {
    layers: snapshot.layers.map((layer) => ({
      materialId: layer.materialId,
      role: layer.role,
      side: layer.side,
      thicknessMm: roundNumber(layer.thicknessMm, 3)
    })),
    materialCatalog: [...snapshot.materialCatalog]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(canonicalMaterial),
    wallContext: {
      cavityDepthMm:
        typeof snapshot.wallContext.cavityDepthMm === "number"
          ? roundNumber(snapshot.wallContext.cavityDepthMm, 3)
          : undefined,
      cavityFillMaterialId: snapshot.wallContext.cavityFillMaterialId,
      supportSpacingMm:
        typeof snapshot.wallContext.supportSpacingMm === "number"
          ? roundNumber(snapshot.wallContext.supportSpacingMm, 3)
          : undefined,
      supportTopology: snapshot.wallContext.supportTopology,
      wallTopology: snapshot.wallContext.wallTopology
    }
  };
}

function canonicalFrequencyBands(frequencyBands: ProjectUserMeasuredWallAirborneFrequencyBands) {
  return {
    bandSet: frequencyBands.bandSet,
    values: [...frequencyBands.values]
      .sort((left, right) => left.frequencyHz - right.frequencyHz)
      .map((band) => ({
        frequencyHz: roundNumber(band.frequencyHz, 3),
        transmissionLossDb: roundNumber(band.transmissionLossDb, 3)
      }))
  };
}

export function buildProjectUserMeasuredWallRwAnchorFingerprint(
  input: ProjectUserMeasuredWallRwAnchorFingerprintInput
): string {
  const snapshot = ProjectUserMeasuredWallConstructionSnapshotSchema.parse(input.snapshot);
  const canonical = {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
    measurementMethodStandard: input.measurementMethodStandard,
    metric: input.metric ?? "Rw",
    metricBasis: input.metricBasis ?? "lab_rw",
    ratingStandard: input.ratingStandard,
    routeMode: "wall",
    snapshot: canonicalWallSnapshot(snapshot),
    sourceMode: input.sourceMode ?? "lab"
  };

  return `${PROJECT_USER_MEASURED_WALL_RW_ANCHOR_FINGERPRINT_PREFIX}:${fnv1a64(stableJson(canonical))}`;
}

export function buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint(
  input: ProjectUserMeasuredWallAirborneFrequencyAnchorFingerprintInput
): string {
  const snapshot = ProjectUserMeasuredWallConstructionSnapshotSchema.parse(input.snapshot);
  const frequencyBands = ProjectUserMeasuredWallAirborneFrequencyBandsSchema.parse(input.frequencyBands);
  const ratingStandards = ProjectUserMeasuredWallRatingStandardsSchema.parse(input.ratingStandards);
  const canonical = {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    curveBasis: input.curveBasis ?? "measured_frequency_curve",
    frequencyBands: canonicalFrequencyBands(frequencyBands),
    inputBasis: input.inputBasis ?? "airborne_transmission_loss_curve",
    measurementMethodStandard: input.measurementMethodStandard,
    metricBasis: input.metricBasis ?? "lab_airborne_transmission_loss_curve",
    metricFamily: input.metricFamily ?? "airborne",
    ratingStandards: [...ratingStandards].sort((left, right) => left.localeCompare(right)),
    routeMode: "wall",
    snapshot: canonicalWallSnapshot(snapshot),
    sourceMode: input.sourceMode ?? "lab"
  };

  return `${PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_FINGERPRINT_PREFIX}:${fnv1a64(stableJson(canonical))}`;
}

export const ProjectUserMeasuredWallRwAnchorSchema = ProjectUserMeasuredWallRwAnchorBaseSchema.superRefine(
  (anchor, context) => {
    const expectedFingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: anchor.measurementMethodStandard,
      metric: anchor.metric,
      metricBasis: anchor.metricBasis === "lab_rw" ? anchor.metricBasis : undefined,
      ratingStandard: anchor.ratingStandard,
      snapshot: anchor.snapshot,
      sourceMode: anchor.sourceMode === "lab" ? anchor.sourceMode : undefined
    });

    if (anchor.fingerprint !== expectedFingerprint) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Measured wall Rw anchor fingerprint does not match its calculation-relevant snapshot.",
        path: ["fingerprint"]
      });
    }
  }
);

export const ProjectUserMeasuredWallAirborneFrequencyAnchorSchema =
  ProjectUserMeasuredWallAirborneFrequencyAnchorBaseSchema.superRefine((anchor, context) => {
    const parsedFrequencyBands = ProjectUserMeasuredWallAirborneFrequencyBandsSchema.safeParse(anchor.frequencyBands);
    const parsedRatingStandards = ProjectUserMeasuredWallRatingStandardsSchema.safeParse(anchor.ratingStandards);
    const parsedSnapshot = ProjectUserMeasuredWallConstructionSnapshotSchema.safeParse(anchor.snapshot);

    if (!parsedFrequencyBands.success || !parsedRatingStandards.success || !parsedSnapshot.success) {
      return;
    }

    const expectedFingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      curveBasis: anchor.curveBasis,
      frequencyBands: parsedFrequencyBands.data,
      inputBasis: anchor.inputBasis,
      measurementMethodStandard: anchor.measurementMethodStandard,
      metricBasis: anchor.metricBasis,
      metricFamily: anchor.metricFamily,
      ratingStandards: parsedRatingStandards.data,
      snapshot: parsedSnapshot.data,
      sourceMode: anchor.sourceMode === "lab" ? anchor.sourceMode : undefined
    });

    if (anchor.fingerprint !== expectedFingerprint) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Measured wall airborne frequency anchor fingerprint does not match its calculation-relevant snapshot and bands.",
        path: ["fingerprint"]
      });
    }
  });

export const ActiveProjectUserMeasuredWallRwAnchorSchema = ProjectUserMeasuredWallRwAnchorSchema.superRefine(
  (anchor, context) => {
    if (anchor.sourceStatus !== "active") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only active measured wall Rw anchors can become runtime exact-source candidates.",
        path: ["sourceStatus"]
      });
    }

    if (anchor.metricBasis !== "lab_rw") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project/user measured wall Rw runtime candidates must stay on the lab Rw basis.",
        path: ["metricBasis"]
      });
    }

    if (anchor.sourceMode !== "lab") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project/user measured wall Rw runtime candidates must use lab measurements.",
        path: ["sourceMode"]
      });
    }
  }
);

export type ActiveProjectUserMeasuredWallRwAnchor = z.infer<typeof ActiveProjectUserMeasuredWallRwAnchorSchema>;

export const ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema =
  ProjectUserMeasuredWallAirborneFrequencyAnchorSchema.superRefine((anchor, context) => {
    if (anchor.sourceStatus !== "active") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only active measured wall airborne frequency anchors can become runtime exact-curve candidates.",
        path: ["sourceStatus"]
      });
    }

    if (anchor.metricBasis !== "lab_airborne_transmission_loss_curve") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project/user measured wall airborne frequency runtime candidates must stay on the lab transmission-loss curve basis.",
        path: ["metricBasis"]
      });
    }

    if (anchor.sourceMode !== "lab") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project/user measured wall airborne frequency runtime candidates must use lab measurements.",
        path: ["sourceMode"]
      });
    }
  });

export type ActiveProjectUserMeasuredWallAirborneFrequencyAnchor = z.infer<
  typeof ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema
>;
