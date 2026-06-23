import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type FieldAirborneRating,
  type RequestedOutputId
} from "@dynecho/shared";

import { GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB } from "./dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor";
import {
  maybeBuildGateSOpeningLeakCompositeRuntimeCorridor,
  type GateSOpeningLeakCompositeRuntimeInput
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { clamp, log10, round1 } from "./math";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE =
  "company_internal_opening_leak_building_runtime_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_building_surface_parity_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "opening/leak field/building card/report/API parity";

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD =
  "company_internal_opening_leak_field_area_energy_runtime_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD =
  "company_internal_opening_leak_building_area_energy_runtime_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_field_family_physics_prediction";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_building_family_physics_prediction";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_a_weighted_family_physics_prediction";

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB = 8;
export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB = 10;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB_RUNTIME = -0.8;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB_RUNTIME = 1;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB = 9;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB = 11;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET =
  "third_octave_100_3150";

export const COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING =
  "Opening/leak field/building runtime corridor active: field and building outputs are calculated from the Gate S lab composite opening/leak Rw plus explicit flanking, junction, and room-normalization terms. The result is source-absent, not measured field/building evidence.";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING =
  "Opening/leak A-weighted runtime corridor active: Dn,A / DnT,A are calculated from the same-route opening/leak field/building value plus the owned -0.8 dB A-weighted adapter over third-octave 100-3150 Hz input. The result is source-absent, not measured A-weighted evidence.";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING =
  "Opening/leak A-weighted runtime is waiting for frequencyBandSet before promoting Dn,A / DnT,A.";

type CompleteOpeningLeakFieldContext = AirborneContext & {
  contextMode: "field_between_rooms";
  frequencyBandSet?: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET;
  openingLeakFieldBuildingAdapterBoundary?: true;
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
};

type CompleteOpeningLeakBuildingContext = AirborneContext & {
  buildingPredictionOutputBasis: "apparent" | "apparent_and_standardized" | "standardized";
  conservativeFlankingAssumption: "multi_path_conservative" | "single_conservative_path" | "worst_case_screening";
  contextMode: "building_prediction";
  flankingJunctionClass:
    | "isolated_junction"
    | "lightweight_junction"
    | "mixed_junction"
    | "rigid_cross_junction"
    | "rigid_t_junction";
  junctionCouplingLengthM: number;
  frequencyBandSet?: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET;
  openingLeakFieldBuildingAdapterBoundary?: true;
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
  sourceRoomVolumeM3: number;
};

export type CompanyInternalOpeningLeakRuntimeBasis = "building_prediction" | "field_apparent";

export type CompanyInternalOpeningLeakRuntimeStatus =
  | "blocked_missing_input"
  | "blocked_unsupported"
  | "not_requested"
  | "runtime_corridor_promoted";

export type CompanyInternalOpeningLeakRuntimeResult = {
  basis: AirborneResultBasis | null;
  basisId:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD
    | null;
  blockedOutputs: readonly RequestedOutputId[];
  dnTwDb: number | null;
  dnWDb: number | null;
  errorBudgetDb: number | null;
  fieldRating: FieldAirborneRating | null;
  labCompositeRwDb: number | null;
  missingPhysicalInputs: readonly string[];
  partitionAreaM2: number | null;
  requestedOutputs: readonly RequestedOutputId[];
  roomNormalizationDb: number | null;
  rwPrimeDb: number | null;
  status: CompanyInternalOpeningLeakRuntimeStatus;
  supportedOutputs: readonly RequestedOutputId[];
  warning: string | null;
  warnings: readonly string[];
};

const FIELD_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "DnT,w"]);
const BUILDING_APPARENT_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w"]);
const BUILDING_STANDARDIZED_OUTPUTS = new Set<RequestedOutputId>(["DnT,w"]);
const A_WEIGHTED_OUTPUTS = new Set<RequestedOutputId>(["Dn,A", "DnT,A"]);
const OPENING_ROUTE_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "R'w"
]);

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function hasOpeningLeakFieldBuildingAdapterBoundary(
  context: AirborneContext | null | undefined
): boolean {
  return context?.openingLeakFieldBuildingAdapterBoundary === true;
}

function openingRouteRequested(context: AirborneContext | null | undefined): boolean {
  return finitePositive(context?.hostWallAreaM2) || (context?.openingLeakElements?.length ?? 0) > 0;
}

function hasOpeningLeakFieldBuildingRouteOwner(context: AirborneContext | null | undefined): boolean {
  return hasOpeningLeakFieldBuildingAdapterBoundary(context) || openingRouteRequested(context);
}

function requestedOpeningFieldBuildingOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => OPENING_ROUTE_OUTPUTS.has(output));
}

function requestedAWeightedOpeningOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => A_WEIGHTED_OUTPUTS.has(output));
}

function hasAWeightedFrequencyBandSet(context: AirborneContext): boolean {
  return context.frequencyBandSet === COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET;
}

function missingCommonFieldInputs(context: AirborneContext): string[] {
  const missing: string[] = [];

  if (!finitePositive(context.panelWidthMm)) missing.push("panelWidthMm");
  if (!finitePositive(context.panelHeightMm)) missing.push("panelHeightMm");
  if (!finitePositive(context.receivingRoomVolumeM3)) missing.push("receivingRoomVolumeM3");
  if (!finitePositive(context.receivingRoomRt60S)) missing.push("receivingRoomRt60S");

  return missing;
}

function completeFieldContext(
  context: AirborneContext | null | undefined
): context is CompleteOpeningLeakFieldContext {
  return (
    context?.contextMode === "field_between_rooms" &&
    hasOpeningLeakFieldBuildingRouteOwner(context) &&
    missingCommonFieldInputs(context).length === 0
  );
}

function missingBuildingInputs(context: AirborneContext): string[] {
  const missing = missingCommonFieldInputs(context);

  if (!finitePositive(context.sourceRoomVolumeM3)) missing.push("sourceRoomVolumeM3");
  if (!finitePositive(context.junctionCouplingLengthM)) missing.push("junctionCouplingLengthM");
  if (!context.flankingJunctionClass || context.flankingJunctionClass === "unknown") {
    missing.push("flankingJunctionClass");
  }
  if (!context.conservativeFlankingAssumption || context.conservativeFlankingAssumption === "unknown") {
    missing.push("conservativeFlankingAssumption");
  }
  if (!context.buildingPredictionOutputBasis || context.buildingPredictionOutputBasis === "unknown") {
    missing.push("buildingPredictionOutputBasis");
  }

  return missing;
}

function completeBuildingContext(
  context: AirborneContext | null | undefined
): context is CompleteOpeningLeakBuildingContext {
  return (
    context?.contextMode === "building_prediction" &&
    hasOpeningLeakFieldBuildingRouteOwner(context) &&
    missingBuildingInputs(context).length === 0
  );
}

function requestedSupportedOutputs(input: {
  aWeightedRuntimeOwned: boolean;
  basis: CompanyInternalOpeningLeakRuntimeBasis;
  buildingOutputBasis?: CompleteOpeningLeakBuildingContext["buildingPredictionOutputBasis"];
  targetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  const baseSupportSet =
    input.basis === "field_apparent"
      ? FIELD_OUTPUTS
    : input.buildingOutputBasis === "apparent"
        ? BUILDING_APPARENT_OUTPUTS
        : input.buildingOutputBasis === "standardized"
          ? BUILDING_STANDARDIZED_OUTPUTS
          : new Set<RequestedOutputId>([
              ...BUILDING_APPARENT_OUTPUTS,
              ...BUILDING_STANDARDIZED_OUTPUTS
            ]);
  const supportSet = new Set<RequestedOutputId>(baseSupportSet);

  if (input.aWeightedRuntimeOwned) {
    if (input.basis === "field_apparent") {
      supportSet.add("Dn,A");
      supportSet.add("DnT,A");
    } else {
      if (input.buildingOutputBasis !== "standardized") {
        supportSet.add("Dn,A");
      }
      if (input.buildingOutputBasis !== "apparent") {
        supportSet.add("DnT,A");
      }
    }
  }

  return input.targetOutputs.filter((output) => supportSet.has(output));
}

function buildLabCompositeRuntime(input: {
  airborneContext: AirborneContext;
  hostWallRatingBasis: GateSOpeningLeakCompositeRuntimeInput["hostWallRatingBasis"];
  hostWallRwDb: number;
}) {
  return maybeBuildGateSOpeningLeakCompositeRuntimeCorridor({
    airborneContext: {
      ...input.airborneContext,
      contextMode: "element_lab"
    },
    hostWallRatingBasis: input.hostWallRatingBasis,
    hostWallRwDb: input.hostWallRwDb,
    targetOutputs: ["Rw"]
  });
}

function partitionAreaM2(context: {
  panelHeightMm: number;
  panelWidthMm: number;
}): number {
  return round1((context.panelWidthMm * context.panelHeightMm) / 1_000_000);
}

function standardizedRoomNormalizationDb(context: {
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
}): number {
  const area = (context.panelWidthMm * context.panelHeightMm) / 1_000_000;
  return round1(10 * log10((0.16 * context.receivingRoomVolumeM3) / (context.receivingRoomRt60S * area)));
}

function dnOffsetDb(context: {
  panelHeightMm: number;
  panelWidthMm: number;
}): number {
  const area = (context.panelWidthMm * context.panelHeightMm) / 1_000_000;
  return round1(10 * log10(area / 10));
}

function junctionPenaltyDb(context: CompleteOpeningLeakBuildingContext): number {
  const byJunctionClass: Record<CompleteOpeningLeakBuildingContext["flankingJunctionClass"], number> = {
    isolated_junction: 0.8,
    lightweight_junction: 2.4,
    mixed_junction: 3,
    rigid_cross_junction: 3.8,
    rigid_t_junction: 3.2
  };
  const byAssumption: Record<CompleteOpeningLeakBuildingContext["conservativeFlankingAssumption"], number> = {
    multi_path_conservative: 1.2,
    single_conservative_path: 0.6,
    worst_case_screening: 2.5
  };
  const couplingLengthPenaltyDb = clamp((context.junctionCouplingLengthM - 3) * 0.2, 0, 1.2);

  return round1(
    byJunctionClass[context.flankingJunctionClass] +
      byAssumption[context.conservativeFlankingAssumption] +
      couplingLengthPenaltyDb
  );
}

function basisForPromotedRuntime(input: {
  aWeightedRuntimeSelected: boolean;
  basis: CompanyInternalOpeningLeakRuntimeBasis;
  buildingJunctionPenaltyDb?: number;
  errorBudgetDb: number;
  fieldFlankingPenaltyDb: number;
  labCompositeRwDb: number;
  partitionAreaM2: number;
  roomNormalizationDb: number;
}): AirborneResultBasis {
  const isBuilding = input.basis === "building_prediction";
  const method = input.aWeightedRuntimeSelected
    ? COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
    : isBuilding
      ? COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
      : COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD;

  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Gate S owns only the element-lab opening/leak composite Rw anchor; this runtime adapts it with explicit field/building terms rather than aliasing lab Rw.",
      `field flanking penalty term: ${input.fieldFlankingPenaltyDb.toFixed(1)} dB`,
      ...(isBuilding
        ? [`building junction/flanking add-on term: ${(input.buildingJunctionPenaltyDb ?? 0).toFixed(1)} dB`]
        : []),
      `room standardization term for DnT,w: ${input.roomNormalizationDb.toFixed(1)} dB`,
      `partition area: ${input.partitionAreaM2.toFixed(1)} m2`,
      ...(input.aWeightedRuntimeSelected
        ? [
            `A-weighted adapter term: ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB_RUNTIME.toFixed(1)} dB`,
            `A-weighted adapter budget term: +/-${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB_RUNTIME} dB`,
            `frequency band set: ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET}`
          ]
        : []),
      `source-absent opening/leak field/building budget is +/-${input.errorBudgetDb} dB and is not measured evidence`
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_single_number_estimate",
    errorBudgetDb: input.errorBudgetDb,
    frequencyBands: input.aWeightedRuntimeSelected
      ? { bandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET }
      : undefined,
    kind: "airborne_physics_prediction",
    measurementStandard: "none",
    method,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "source-owned field/building opening/leak holdout packets are absent for this adapter corridor"
    ],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "GateSOpeningLeakCompositeRw",
      "openingLeakElementsOrHostWallAreaRouteOwner",
      "hostWallAreaM2",
      "openingLeakElements",
      "panelWidthMm",
      "panelHeightMm",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      ...(input.aWeightedRuntimeSelected ? ["frequencyBandSet"] : []),
      ...(isBuilding
        ? [
            "sourceRoomVolumeM3",
            "flankingJunctionClass",
            "conservativeFlankingAssumption",
            "junctionCouplingLengthM",
            "buildingPredictionOutputBasis"
          ]
        : [])
    ],
    toleranceClass: "uncalibrated_prediction"
  });
}

function blockedBasis(input: {
  missingPhysicalInputs: readonly string[];
  targetOutputs: readonly RequestedOutputId[];
}): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Opening/leak field/building runtime is blocked until explicit opening/leak route fields and required room/flanking physical terms are present."
    ],
    calculationStandard: "none",
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    measurementStandard: "none",
    method: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    origin: "needs_input",
    ratingStandard: "none",
    requiredInputs: [...input.missingPhysicalInputs, ...input.targetOutputs]
  });
}

function promotedResult(input: {
  basis: CompanyInternalOpeningLeakRuntimeBasis;
  buildingJunctionPenaltyDb?: number;
  buildingOutputBasis?: CompleteOpeningLeakBuildingContext["buildingPredictionOutputBasis"];
  context: CompleteOpeningLeakBuildingContext | CompleteOpeningLeakFieldContext;
  errorBudgetDb: number;
  fieldFlankingPenaltyDb: number;
  labCompositeRwDb: number;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakRuntimeResult {
  const areaM2 = partitionAreaM2(input.context);
  const roomNormalization = standardizedRoomNormalizationDb(input.context);
  const totalFlankingPenaltyDb = round1(
    input.fieldFlankingPenaltyDb + (input.buildingJunctionPenaltyDb ?? 0)
  );
  const rwPrimeDb = round1(input.labCompositeRwDb - totalFlankingPenaltyDb);
  const normalizedDnWDb = round1(rwPrimeDb + dnOffsetDb(input.context));
  const dnTwDb = round1(rwPrimeDb + roomNormalization);
  const requestedAWeightedOutputs = requestedAWeightedOpeningOutputs(input.targetOutputs);
  const aWeightedRuntimeOwned = hasAWeightedFrequencyBandSet(input.context);
  const supportedOutputs = requestedSupportedOutputs({
    aWeightedRuntimeOwned,
    basis: input.basis,
    buildingOutputBasis: input.buildingOutputBasis,
    targetOutputs: input.targetOutputs
  });
  const aWeightedRuntimeSelected = supportedOutputs.some((output) => A_WEIGHTED_OUTPUTS.has(output));
  const errorBudgetDb = aWeightedRuntimeSelected
    ? input.basis === "building_prediction"
      ? COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB
      : COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB
    : input.errorBudgetDb;
  const dnWDb =
    supportedOutputs.includes("Dn,w") || supportedOutputs.includes("Dn,A")
      ? normalizedDnWDb
      : null;
  const dnADb = supportedOutputs.includes("Dn,A") && dnWDb !== null
    ? round1(dnWDb + COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB_RUNTIME)
    : null;
  const dnTADb = supportedOutputs.includes("DnT,A")
    ? round1(dnTwDb + COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB_RUNTIME)
    : null;
  const missingAWeightedInputs =
    requestedAWeightedOutputs.length > 0 && !aWeightedRuntimeOwned
      ? ["frequencyBandSet"]
      : [];
  const blockedOutputs = requestedOpeningFieldBuildingOutputs(input.targetOutputs).filter(
    (output) => !supportedOutputs.includes(output)
  );
  const fieldRating: FieldAirborneRating = {
    ...(dnADb === null ? {} : { DnA: dnADb }),
    ...(dnWDb === null ? {} : { DnW: dnWDb }),
    ...(dnTADb === null ? {} : { DnTA: dnTADb }),
    DnTw: dnTwDb,
    RwPrime: rwPrimeDb,
    basis: aWeightedRuntimeSelected
      ? "company_internal_opening_leak_a_weighted_spectrum_adapter"
      : input.basis === "building_prediction"
        ? "company_internal_opening_leak_building_prediction_area_energy_adapter"
        : "company_internal_opening_leak_field_area_energy_adapter",
    dnBasis: "ISO_12354_1_area_room_normalization",
    estimated: true,
    normalizationDb: roomNormalization,
    partitionAreaM2: areaM2,
    receivingRoomRt60S: input.context.receivingRoomRt60S,
    receivingRoomVolumeM3: input.context.receivingRoomVolumeM3
  };

  const warnings = [
    aWeightedRuntimeSelected
      ? COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING
      : COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING,
    ...(missingAWeightedInputs.length > 0
      ? [COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING]
      : [])
  ];

  return {
    basis: basisForPromotedRuntime({
      aWeightedRuntimeSelected,
      basis: input.basis,
      buildingJunctionPenaltyDb: input.buildingJunctionPenaltyDb,
      errorBudgetDb,
      fieldFlankingPenaltyDb: input.fieldFlankingPenaltyDb,
      labCompositeRwDb: input.labCompositeRwDb,
      partitionAreaM2: areaM2,
      roomNormalizationDb: roomNormalization
    }),
    basisId: aWeightedRuntimeSelected
      ? COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
      : input.basis === "building_prediction"
        ? COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
        : COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
    blockedOutputs,
    dnTwDb,
    dnWDb,
    errorBudgetDb,
    fieldRating,
    labCompositeRwDb: input.labCompositeRwDb,
    missingPhysicalInputs: missingAWeightedInputs,
    partitionAreaM2: areaM2,
    requestedOutputs: input.targetOutputs,
    roomNormalizationDb: roomNormalization,
    rwPrimeDb,
    status: "runtime_corridor_promoted",
    supportedOutputs,
    warning: warnings[0] ?? null,
    warnings
  };
}

export function maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor(input: {
  airborneContext?: AirborneContext | null;
  fieldFlankingPenaltyDb?: number | null;
  hostWallRatingBasis: GateSOpeningLeakCompositeRuntimeInput["hostWallRatingBasis"];
  hostWallRwDb: number;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakRuntimeResult | null {
  const context = input.airborneContext;
  const requestedOutputs = requestedOpeningFieldBuildingOutputs(input.targetOutputs);

  if (
    requestedOutputs.length === 0 ||
    !openingRouteRequested(context) ||
    (
      context?.contextMode !== "field_between_rooms" &&
      context?.contextMode !== "building_prediction"
    )
  ) {
    return null;
  }

  if (!hasOpeningLeakFieldBuildingRouteOwner(context)) {
    return null;
  }

  const physicalMissing = context.contextMode === "building_prediction"
    ? missingBuildingInputs(context)
    : missingCommonFieldInputs(context);

  if (physicalMissing.length > 0) {
    const warning =
      `Opening/leak field/building runtime is waiting for ${unique(physicalMissing).join(", ")} before promoting R'w / DnT,w.`;

    return {
      basis: blockedBasis({
        missingPhysicalInputs: unique(physicalMissing),
        targetOutputs: input.targetOutputs
      }),
      basisId: null,
      blockedOutputs: requestedOutputs,
      dnTwDb: null,
      dnWDb: null,
      errorBudgetDb: null,
      fieldRating: null,
      labCompositeRwDb: null,
      missingPhysicalInputs: unique(physicalMissing),
      partitionAreaM2: null,
      requestedOutputs: input.targetOutputs,
      roomNormalizationDb: null,
      rwPrimeDb: null,
      status: "blocked_missing_input",
      supportedOutputs: [],
      warning,
      warnings: [warning]
    };
  }

  const labCompositeRuntime = buildLabCompositeRuntime({
    airborneContext: context,
    hostWallRatingBasis: input.hostWallRatingBasis,
    hostWallRwDb: input.hostWallRwDb
  });
  const labCompositeRwDb = labCompositeRuntime?.runtimeRwDb;

  if (!finitePositive(labCompositeRwDb)) {
    const warning =
      labCompositeRuntime?.warning ??
      "Opening/leak field/building runtime is blocked because the lab composite opening/leak anchor is unavailable.";
    const missing = unique([
      ...(labCompositeRuntime?.basis?.missingPhysicalInputs ?? []),
      ...requestedOutputs
    ]);

    return {
      basis: labCompositeRuntime?.basis ?? blockedBasis({
        missingPhysicalInputs: missing,
        targetOutputs: input.targetOutputs
      }),
      basisId: null,
      blockedOutputs: requestedOutputs,
      dnTwDb: null,
      dnWDb: null,
      errorBudgetDb: null,
      fieldRating: null,
      labCompositeRwDb: null,
      missingPhysicalInputs: missing,
      partitionAreaM2: null,
      requestedOutputs: input.targetOutputs,
      roomNormalizationDb: null,
      rwPrimeDb: null,
      status: labCompositeRuntime?.status === "blocked_missing_input" ? "blocked_missing_input" : "blocked_unsupported",
      supportedOutputs: [],
      warning,
      warnings: [warning]
    };
  }

  const fieldFlankingPenaltyDb = round1(clamp(input.fieldFlankingPenaltyDb ?? 1.8, 0, 12));

  if (completeFieldContext(context)) {
    return promotedResult({
      basis: "field_apparent",
      context,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      fieldFlankingPenaltyDb,
      labCompositeRwDb,
      targetOutputs: input.targetOutputs
    });
  }

  if (completeBuildingContext(context)) {
    return promotedResult({
      basis: "building_prediction",
      buildingJunctionPenaltyDb: junctionPenaltyDb(context),
      buildingOutputBasis: context.buildingPredictionOutputBasis,
      context,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      fieldFlankingPenaltyDb,
      labCompositeRwDb,
      targetOutputs: input.targetOutputs
    });
  }

  return null;
}

export { GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB };
