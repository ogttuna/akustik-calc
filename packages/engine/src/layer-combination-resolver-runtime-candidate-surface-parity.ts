import type {
  AcousticAnswerBoundary,
  AssemblyCalculation,
  FloorSystemAirborneRatings,
  ImpactBoundCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactOnlyCalculation,
  LayerCombinationResolverTrace,
  RequestedOutputId
} from "@dynecho/shared";
import { getFloorSystemC, getFloorSystemCtr } from "@dynecho/shared";

import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import { ASTM_E989_IMPACT_RATING_BASIS } from "./impact-astm-e989";
import {
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
} from "./impact-field-adapter-error-budget";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD } from "./dynamic-airborne-gate-ae-flat-multicavity";
import { COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-company-internal-heavy-composite-wall";
import { GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
  FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD
} from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  adaptLayerCombinationRuntimeCandidate,
  buildLayerCombinationResolverRuntimeCandidateAdapterContract,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS,
  type LayerCombinationResolverRuntimeCandidateAdapterInput,
  type LayerCombinationResolverRuntimeCandidateAdapterResult
} from "./layer-combination-resolver-runtime-candidate-adapter";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD
} from "./post-v1-wall-compatible-anchor-delta";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import { round1 } from "./math";
import type {
  LayerCombinationResolverBasis,
  LayerCombinationResolverCandidateKind,
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE =
  "layer_combination_resolver_runtime_candidate_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS =
  "layer_combination_resolver_runtime_candidate_surface_parity_landed_no_runtime_selected_candidate_coverage_matrix_refresh";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_candidate_coverage_matrix_refresh_plan";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "layer combination resolver candidate coverage matrix refresh";

const RESOLVER_METRIC_IDS = new Set<string>([
  "AIIC",
  "C",
  "CI",
  "CI,50-2500",
  "Ctr",
  "DeltaLw",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "IIC",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "Ln,w",
  "Ln,w+CI",
  "R'w",
  "Rw",
  "STC"
]);

const FLOOR_IMPACT_METRIC_IDS = new Set<string>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "IIC",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "Ln,w",
  "Ln,w+CI"
]);
const FLOOR_FIELD_IMPACT_METRIC_IDS = new Set<string>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const ANSWER_ENGINE_STOP_ORIGINS = new Set(["needs_input", "unsupported"]);
const WALL_VERIFIED_AIRBORNE_EXACT_SOURCE_BASIS = "verified_airborne_exact_source";
const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_source_absent_rw_runtime_corridor";
const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime";
const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_field_context_harmonization_runtime";
const POST_V1_WALL_MULTILEAF_GENERALIZED_RUNTIME_METHOD =
  "triple_leaf_two_cavity_frequency_solver";
const FLOOR_SCREENING_AIRBORNE_RUNTIME_BASIS = "screening_mass_law_curve_seed_v3";
const FLOOR_VERIFIED_EXACT_SOURCE_BASES = new Set<string>([
  "official_floor_system_exact_match",
  "open_measured_floor_system_exact_match"
]);
const TIMBER_CLT_DELTA_LW_FORMULA_BASES = new Set<string>([
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
]);
const POST_V1_WALL_MULTILEAF_GENERALIZED_LAB_METRICS = new Set<RequestedOutputId>([
  "Rw",
  "STC",
  "C",
  "Ctr"
]);

export type LayerCombinationResolverRuntimeCandidateSurfaceParityTarget =
  | "calculator_api_payload"
  | "candidate_trace"
  | "confidence_provenance"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "metric_basis_rows"
  | "output_cards"
  | "route_posture"
  | "server_snapshot_replay";

export type LayerCombinationResolverRuntimeCandidateSurfaceRow = LayerCombinationResolverTrace & {
  readonly boundaryCount: number;
  readonly rejectedCount: number;
};

export type LayerCombinationResolverRuntimeCandidateSurfaceParityContract = {
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousAdapter: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceRows: readonly LayerCombinationResolverRuntimeCandidateSurfaceRow[];
  readonly surfaceTargets: readonly LayerCombinationResolverRuntimeCandidateSurfaceParityTarget[];
  readonly summary: {
    readonly boundarySurfaceRowCount: number;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly surfaceRowCount: number;
  };
};

type ResolverImpactCarrier = {
  readonly acousticAnswerBoundary?: AcousticAnswerBoundary;
  readonly airborneBasis?: AssemblyCalculation["airborneBasis"];
  readonly impact?: Pick<
    ImpactCalculation,
    "LPrimeNT50" | "LPrimeNTw" | "LPrimeNW" | "errorBudgets"
  > | null;
};

type FloorRuntimeValuePinCarrier = {
  readonly floorSystemRatings?: FloorSystemAirborneRatings | null;
  readonly impact?: Pick<
    ImpactCalculation,
    | "AIIC"
    | "CI"
    | "CI50_2500"
    | "DeltaLw"
    | "IIC"
    | "availableOutputs"
    | "LnW"
    | "LnWPlusCI"
    | "LPrimeNT50"
    | "LPrimeNTw"
    | "LPrimeNW"
    | "LnTA"
      | "metricBasis"
  > | null;
	  readonly lowerBoundImpact?: Pick<
	    ImpactBoundCalculation,
	    | "CI"
	    | "CI50_2500"
	    | "DeltaLwLowerBound"
	    | "LnWPlusCIUpperBound"
	    | "LnWUpperBound"
    | "LPrimeNT50UpperBound"
    | "LPrimeNTwUpperBound"
    | "LPrimeNWUpperBound"
  > | null;
  readonly metrics?: Partial<
    Pick<
      AssemblyCalculation["metrics"],
      | "estimatedDnADb"
      | "estimatedDnTADb"
      | "estimatedDnTAkDb"
      | "estimatedDnTwDb"
      | "estimatedDnWDb"
      | "estimatedRwPrimeDb"
    >
  >;
};

type FloorRuntimeTraceCarrier = FloorRuntimeValuePinCarrier & {
  readonly supportedTargetOutputs?: readonly RequestedOutputId[];
};

function supportBucketForKind(kind: LayerCombinationResolverCandidateKind): LayerCombinationResolverTrace["supportBucket"] {
  switch (kind) {
    case "exact_measured_override":
      return "exact";
    case "similarity_anchor":
      return "anchored_estimate";
    case "calibrated_family_solver":
      return "calibrated_estimate";
    case "source_absent_family_solver":
      return "source_absent_estimate";
    case "field_building_adapter":
      return "field_adapter";
    case "needs_input_boundary":
      return "needs_input";
    case "basis_boundary":
      return "basis_boundary";
    case "unsupported_boundary":
    default:
      return "unsupported";
  }
}

function labelForKind(kind: LayerCombinationResolverCandidateKind): string {
  switch (kind) {
    case "exact_measured_override":
      return "Exact measured resolver candidate";
    case "similarity_anchor":
      return "Similarity-anchor resolver candidate";
    case "calibrated_family_solver":
      return "Calibrated family resolver candidate";
    case "source_absent_family_solver":
      return "Source-absent formula resolver candidate";
    case "field_building_adapter":
      return "Field/building adapter resolver candidate";
    case "needs_input_boundary":
      return "Needs-input resolver boundary";
    case "basis_boundary":
      return "Basis-boundary resolver candidate";
    case "unsupported_boundary":
    default:
      return "Unsupported resolver boundary";
  }
}

function detailForAdapterRow(row: LayerCombinationResolverRuntimeCandidateAdapterResult): string {
  const selected = row.selectedCandidate;
  const boundaryText =
    row.boundaryCandidateIds.length > 0
      ? ` Boundary candidates: ${row.boundaryCandidateIds.join(", ")}.`
      : " No additional boundary candidate is active.";
  const requiredText =
    selected.requiredInputs.length > 0
      ? ` Required inputs: ${selected.requiredInputs.join(", ")}.`
      : " No additional required inputs are declared by this candidate.";

  return `${selected.id} is the selected ${selected.kind} for ${row.route} ${row.requestedBasis}; runtime basis ${row.runtimeBasisId ?? "none"}.${boundaryText}${requiredText}`;
}

function toRequestedOutputIds(
  outputs: readonly RequestedOutputId[] | readonly LayerCombinationResolverMetricId[]
): RequestedOutputId[] {
  return outputs.filter((output) => RESOLVER_METRIC_IDS.has(output)) as RequestedOutputId[];
}

function toResolverMetricIds(
  outputs: readonly RequestedOutputId[] | readonly LayerCombinationResolverMetricId[]
): LayerCombinationResolverMetricId[] {
  return outputs.filter((output) => RESOLVER_METRIC_IDS.has(output)) as LayerCombinationResolverMetricId[];
}

export function buildLayerCombinationResolverSurfaceTraceFromAdapterRow(
  row: LayerCombinationResolverRuntimeCandidateAdapterResult
): LayerCombinationResolverTrace {
  const selected = row.selectedCandidate;

  return {
    adapterVersion: row.adapterVersion,
    basis: selected.basis,
    boundaryCandidateIds: [...row.boundaryCandidateIds],
    candidateKind: selected.kind,
    errorBudgetMetrics: toRequestedOutputIds(selected.errorBudgetMetrics),
    noRuntimeValueMovement: true,
    priorityRank: selected.priorityRank,
    rejectedCandidateIds: [...row.rejectedCandidateIds],
    requestedBasis: row.requestedBasis,
    requiredInputs: [...selected.requiredInputs],
    route: row.route,
    runtimeBasisId: row.runtimeBasisId,
    selectedCandidateId: row.selectedCandidateId,
    supportBucket: supportBucketForKind(selected.kind),
    supportedMetrics: toRequestedOutputIds(selected.supportedMetrics),
    surfaceDetail: detailForAdapterRow(row),
    surfaceLabel: labelForKind(selected.kind),
    valuePins: selected.valuePins.map((pin) => ({
      metric: pin.metric as RequestedOutputId,
      value: pin.value
    }))
  };
}

function hasAstmAlias(outputs: readonly string[]): boolean {
  return outputs.some((output) => output === "IIC" || output === "AIIC");
}

function hasRequestedImpactMetric(outputs: readonly string[]): boolean {
  return outputs.some((output) => FLOOR_IMPACT_METRIC_IDS.has(output));
}

function hasFieldAdapterBudget(result: ResolverImpactCarrier): boolean {
  return Boolean(
    result.impact?.errorBudgets?.some(
      (budget: ImpactErrorBudget) => budget.origin === FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
    )
  );
}

function hasFieldImpactValues(result: ResolverImpactCarrier): boolean {
  return Boolean(
    typeof result.impact?.LPrimeNW === "number" ||
      typeof result.impact?.LPrimeNTw === "number" ||
      typeof result.impact?.LPrimeNT50 === "number"
  );
}

function adaptSafely(input: LayerCombinationResolverRuntimeCandidateAdapterInput): LayerCombinationResolverTrace | undefined {
  try {
    return buildLayerCombinationResolverSurfaceTraceFromAdapterRow(adaptLayerCombinationRuntimeCandidate(input));
  } catch {
    if (hasAstmAlias(input.unsupportedOutputIds ?? []) || hasAstmAlias(input.requestedMetricAliases ?? [])) {
      return buildLayerCombinationResolverSurfaceTraceFromAdapterRow(
        adaptLayerCombinationRuntimeCandidate({
          requestedBasis: "astm_rating_boundary",
          requestedMetricAliases: ["IIC"],
          route: input.route,
          runtimeBasisId: null
        })
      );
    }

    return undefined;
  }
}

function requestedBasisForFloorResult(input: {
  hasFieldAdapter: boolean;
  impactLabOrField?: "field" | "lab" | null;
  runtimeBasisId: string | null;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
}): LayerCombinationResolverBasis {
  if (input.hasFieldAdapter) {
    return "field_apparent";
  }

  if (
    input.runtimeBasisId === ASTM_E989_IMPACT_RATING_BASIS ||
    (
      input.runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS &&
      input.impactLabOrField === "field"
    )
  ) {
    return input.runtimeBasisId === ASTM_E989_IMPACT_RATING_BASIS
      ? "astm_rating_boundary"
      : "field_apparent";
  }

  if (
    !input.runtimeBasisId &&
    [...input.targetOutputs, ...input.unsupportedOutputs].some((output) =>
      FLOOR_FIELD_IMPACT_METRIC_IDS.has(output)
    )
  ) {
    return "field_apparent";
  }

  if (!input.runtimeBasisId && hasAstmAlias([...input.targetOutputs, ...input.unsupportedOutputs])) {
    return "astm_rating_boundary";
  }

  return "element_lab";
}

function buildAirborneRuntimeValuePins(
  result: AssemblyCalculation,
  outputs: readonly RequestedOutputId[]
): LayerCombinationResolverTrace["valuePins"] {
  const pins: LayerCombinationResolverTrace["valuePins"] = [];
  const outputSet = new Set(outputs);

  if (outputSet.has("Rw") && typeof result.metrics.estimatedRwDb === "number") {
    pins.push({ metric: "Rw", value: result.metrics.estimatedRwDb });
  }
  if (outputSet.has("STC") && typeof result.metrics.estimatedStc === "number") {
    pins.push({ metric: "STC", value: result.metrics.estimatedStc });
  }
  if (outputSet.has("C") && typeof result.metrics.estimatedCDb === "number") {
    pins.push({ metric: "C", value: result.metrics.estimatedCDb });
  }
  if (outputSet.has("Ctr") && typeof result.metrics.estimatedCtrDb === "number") {
    pins.push({ metric: "Ctr", value: result.metrics.estimatedCtrDb });
  }
  if (outputSet.has("R'w") && typeof result.metrics.estimatedRwPrimeDb === "number") {
    pins.push({ metric: "R'w", value: result.metrics.estimatedRwPrimeDb });
  }
  if (outputSet.has("DnT,w") && typeof result.metrics.estimatedDnTwDb === "number") {
    pins.push({ metric: "DnT,w", value: result.metrics.estimatedDnTwDb });
  }
  if (outputSet.has("DnT,A") && typeof result.metrics.estimatedDnTADb === "number") {
    pins.push({ metric: "DnT,A", value: result.metrics.estimatedDnTADb });
  }
  if (outputSet.has("DnT,A,k") && typeof result.metrics.estimatedDnTAkDb === "number") {
    pins.push({ metric: "DnT,A,k", value: result.metrics.estimatedDnTAkDb });
  }
  if (outputSet.has("Dn,w") && typeof result.metrics.estimatedDnWDb === "number") {
    pins.push({ metric: "Dn,w", value: result.metrics.estimatedDnWDb });
  }
  if (outputSet.has("Dn,A") && typeof result.metrics.estimatedDnADb === "number") {
    pins.push({ metric: "Dn,A", value: result.metrics.estimatedDnADb });
  }

  return pins;
}

function pushFinitePin(
  pins: LayerCombinationResolverTrace["valuePins"],
  metric: RequestedOutputId,
  value: number | null | undefined
): void {
  if (typeof value === "number" && Number.isFinite(value)) {
    pins.push({ metric, value: round1(value) });
  }
}

function buildFloorRuntimeValuePins(
  result: FloorRuntimeValuePinCarrier,
  outputs: readonly RequestedOutputId[]
): LayerCombinationResolverTrace["valuePins"] {
  const pins: LayerCombinationResolverTrace["valuePins"] = [];
  const outputSet = new Set(outputs);
  const floorRatings = result.floorSystemRatings;

  if (floorRatings) {
    if (outputSet.has("Rw")) {
      pushFinitePin(pins, "Rw", floorRatings.Rw);
    }
    if (outputSet.has("C")) {
      pushFinitePin(pins, "C", getFloorSystemC(floorRatings));
    }
    if (outputSet.has("Ctr")) {
      pushFinitePin(pins, "Ctr", getFloorSystemCtr(floorRatings));
    }
  }

  if (outputSet.has("Ln,w")) {
    pushFinitePin(pins, "Ln,w", result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound);
  }
  if (outputSet.has("CI")) {
    pushFinitePin(pins, "CI", result.impact?.CI ?? result.lowerBoundImpact?.CI);
  }
  if (outputSet.has("CI,50-2500")) {
    pushFinitePin(pins, "CI,50-2500", result.impact?.CI50_2500 ?? result.lowerBoundImpact?.CI50_2500);
  }
  if (outputSet.has("Ln,w+CI")) {
    pushFinitePin(pins, "Ln,w+CI", result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound);
  }
  if (outputSet.has("DeltaLw")) {
    pushFinitePin(pins, "DeltaLw", result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound);
  }
  if (outputSet.has("IIC")) {
    pushFinitePin(pins, "IIC", result.impact?.IIC);
  }
  if (outputSet.has("AIIC")) {
    pushFinitePin(pins, "AIIC", result.impact?.AIIC);
  }
  if (outputSet.has("R'w")) {
    pushFinitePin(pins, "R'w", result.metrics?.estimatedRwPrimeDb);
  }
  if (outputSet.has("Dn,w")) {
    pushFinitePin(pins, "Dn,w", result.metrics?.estimatedDnWDb);
  }
  if (outputSet.has("Dn,A")) {
    pushFinitePin(pins, "Dn,A", result.metrics?.estimatedDnADb);
  }
  if (outputSet.has("DnT,w")) {
    pushFinitePin(pins, "DnT,w", result.metrics?.estimatedDnTwDb);
  }
  if (outputSet.has("DnT,A")) {
    pushFinitePin(pins, "DnT,A", result.metrics?.estimatedDnTADb);
  }
  if (outputSet.has("DnT,A,k")) {
    pushFinitePin(pins, "DnT,A,k", result.metrics?.estimatedDnTAkDb);
  }
  if (outputSet.has("L'n,w")) {
    pushFinitePin(pins, "L'n,w", result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound);
  }
  if (outputSet.has("L'nT,w")) {
    pushFinitePin(pins, "L'nT,w", result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound);
  }
  if (outputSet.has("L'nT,50")) {
    pushFinitePin(pins, "L'nT,50", result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound);
  }
  if (outputSet.has("LnT,A")) {
    pushFinitePin(pins, "LnT,A", result.impact?.LnTA);
  }

  return pins;
}

function getExactImpactSourceSupportedMetrics(
  result: FloorRuntimeValuePinCarrier,
  outputs: readonly RequestedOutputId[]
): RequestedOutputId[] {
  if (!result.impact?.availableOutputs) {
    return [];
  }

  const exactImpactOutputSet = new Set(result.impact.availableOutputs);
  return outputs.filter((output) => exactImpactOutputSet.has(output));
}

function getRequestedOutputIds(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => RESOLVER_METRIC_IDS.has(output));
}

function hasFloorRuntimeValue(
  result: FloorRuntimeValuePinCarrier,
  output: RequestedOutputId
): boolean {
  const floorRatings = result.floorSystemRatings;
  switch (output) {
    case "Rw":
      return typeof floorRatings?.Rw === "number" && Number.isFinite(floorRatings.Rw);
    case "C":
      return Boolean(floorRatings && typeof getFloorSystemC(floorRatings) === "number");
    case "Ctr":
      return Boolean(floorRatings && typeof getFloorSystemCtr(floorRatings) === "number");
    case "Ln,w":
      return (
        (typeof result.impact?.LnW === "number" && Number.isFinite(result.impact.LnW)) ||
        (typeof result.lowerBoundImpact?.LnWUpperBound === "number" && Number.isFinite(result.lowerBoundImpact.LnWUpperBound))
      );
    case "CI":
      return (
        (typeof result.impact?.CI === "number" && Number.isFinite(result.impact.CI)) ||
        (typeof result.lowerBoundImpact?.CI === "number" && Number.isFinite(result.lowerBoundImpact.CI))
      );
    case "CI,50-2500":
      return (
        (typeof result.impact?.CI50_2500 === "number" && Number.isFinite(result.impact.CI50_2500)) ||
        (
          typeof result.lowerBoundImpact?.CI50_2500 === "number" &&
          Number.isFinite(result.lowerBoundImpact.CI50_2500)
        )
      );
    case "Ln,w+CI":
      return (
        (typeof result.impact?.LnWPlusCI === "number" && Number.isFinite(result.impact.LnWPlusCI)) ||
        (
          typeof result.lowerBoundImpact?.LnWPlusCIUpperBound === "number" &&
          Number.isFinite(result.lowerBoundImpact.LnWPlusCIUpperBound)
        )
      );
    case "DeltaLw":
      return (
        (typeof result.impact?.DeltaLw === "number" && Number.isFinite(result.impact.DeltaLw)) ||
        (
          typeof result.lowerBoundImpact?.DeltaLwLowerBound === "number" &&
          Number.isFinite(result.lowerBoundImpact.DeltaLwLowerBound)
        )
      );
    case "IIC":
      return typeof result.impact?.IIC === "number" && Number.isFinite(result.impact.IIC);
    case "AIIC":
      return typeof result.impact?.AIIC === "number" && Number.isFinite(result.impact.AIIC);
    case "R'w":
      return typeof result.metrics?.estimatedRwPrimeDb === "number" && Number.isFinite(result.metrics.estimatedRwPrimeDb);
    case "Dn,w":
      return typeof result.metrics?.estimatedDnWDb === "number" && Number.isFinite(result.metrics.estimatedDnWDb);
    case "Dn,A":
      return typeof result.metrics?.estimatedDnADb === "number" && Number.isFinite(result.metrics.estimatedDnADb);
    case "DnT,w":
      return typeof result.metrics?.estimatedDnTwDb === "number" && Number.isFinite(result.metrics.estimatedDnTwDb);
    case "DnT,A":
      return typeof result.metrics?.estimatedDnTADb === "number" && Number.isFinite(result.metrics.estimatedDnTADb);
    case "DnT,A,k":
      return typeof result.metrics?.estimatedDnTAkDb === "number" && Number.isFinite(result.metrics.estimatedDnTAkDb);
    case "L'n,w":
      return (
        (typeof result.impact?.LPrimeNW === "number" && Number.isFinite(result.impact.LPrimeNW)) ||
        (
          typeof result.lowerBoundImpact?.LPrimeNWUpperBound === "number" &&
          Number.isFinite(result.lowerBoundImpact.LPrimeNWUpperBound)
        )
      );
    case "L'nT,w":
      return (
        (typeof result.impact?.LPrimeNTw === "number" && Number.isFinite(result.impact.LPrimeNTw)) ||
        (
          typeof result.lowerBoundImpact?.LPrimeNTwUpperBound === "number" &&
          Number.isFinite(result.lowerBoundImpact.LPrimeNTwUpperBound)
        )
      );
    case "L'nT,50":
      return (
        (typeof result.impact?.LPrimeNT50 === "number" && Number.isFinite(result.impact.LPrimeNT50)) ||
        (
          typeof result.lowerBoundImpact?.LPrimeNT50UpperBound === "number" &&
          Number.isFinite(result.lowerBoundImpact.LPrimeNT50UpperBound)
        )
      );
    case "LnT,A":
      return typeof result.impact?.LnTA === "number" && Number.isFinite(result.impact.LnTA);
    default:
      return false;
  }
}

function getFloorRuntimeSupportedMetrics(
  result: FloorRuntimeValuePinCarrier,
  outputs: readonly RequestedOutputId[]
): RequestedOutputId[] {
  return getRequestedOutputIds(outputs).filter((output) => hasFloorRuntimeValue(result, output));
}

function getFieldAdapterSupportedMetrics(
  trace: LayerCombinationResolverTrace,
  result: FloorRuntimeTraceCarrier
): RequestedOutputId[] {
  const supportedOutputSet = new Set(result.supportedTargetOutputs ?? []);
  return trace.supportedMetrics.filter((metric): metric is RequestedOutputId =>
    supportedOutputSet.has(metric as RequestedOutputId)
  );
}

function getFloorRuntimeCandidateSupportedMetrics(
  trace: LayerCombinationResolverTrace,
  result: FloorRuntimeTraceCarrier
): RequestedOutputId[] {
  const supportedOutputSet = new Set(result.supportedTargetOutputs ?? []);
  if (
    trace.runtimeBasisId &&
    (
      TIMBER_CLT_DELTA_LW_FORMULA_BASES.has(trace.runtimeBasisId) ||
      trace.runtimeBasisId === FLOOR_SCREENING_AIRBORNE_RUNTIME_BASIS
    )
  ) {
    return trace.supportedMetrics.filter((metric): metric is RequestedOutputId =>
      supportedOutputSet.has(metric as RequestedOutputId)
    );
  }

  return getFloorRuntimeSupportedMetrics(result, result.supportedTargetOutputs ?? []);
}

function withScenarioSpecificFloorRuntimePins<T extends FloorRuntimeTraceCarrier>(
  trace: LayerCombinationResolverTrace | undefined,
  result: T
): LayerCombinationResolverTrace | undefined {
  if (!trace || trace.route !== "floor" || !trace.runtimeBasisId) {
    return trace;
  }

  if (trace.runtimeBasisId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS) {
    return trace;
  }

  const isExactFloor = FLOOR_VERIFIED_EXACT_SOURCE_BASES.has(trace.runtimeBasisId);
  const isExactImpactSource = trace.runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS;
  const isAstmImpactRating = trace.runtimeBasisId === ASTM_E989_IMPACT_RATING_BASIS;
  const supportedMetrics = isExactImpactSource
    ? getExactImpactSourceSupportedMetrics(result, result.supportedTargetOutputs ?? [])
    : trace.candidateKind === "field_building_adapter"
      ? getFieldAdapterSupportedMetrics(trace, result)
      : getFloorRuntimeCandidateSupportedMetrics(trace, result);

  const surfaceDetail = isExactImpactSource
    ? `${trace.surfaceDetail} Current assembly value pins come from the selected exact impact-band source; airborne companion outputs stay on their own calculation basis and are not owned by this exact impact candidate.`
    : isAstmImpactRating
      ? `${trace.surfaceDetail} Current value pins come from the selected exact ASTM impact-band contour rating; ISO impact and airborne companion outputs stay on their own calculation basis.`
    : isExactFloor
      ? `${trace.surfaceDetail} Current floor value pins come from the selected exact measured floor row; separately calculated field or companion outputs stay on their own basis.`
      : trace.candidateKind === "field_building_adapter"
        ? `${trace.surfaceDetail} Current field-adapter value pins are scenario-specific and come from the active field or building calculation path.`
        : `${trace.surfaceDetail} Current floor value pins are scenario-specific and follow the outputs published by this calculation path.`;

  return {
    ...trace,
    basis: isExactImpactSource || isAstmImpactRating ? trace.requestedBasis : trace.basis,
    supportedMetrics,
    surfaceDetail,
    valuePins: buildFloorRuntimeValuePins(result, supportedMetrics)
  };
}

function getRuntimeSupportedMetricsForAssembly(
  trace: LayerCombinationResolverTrace,
  result: AssemblyCalculation
): RequestedOutputId[] {
  const supportedTargetOutputs = new Set(result.supportedTargetOutputs);
  const supportedMetrics = trace.supportedMetrics.filter((metric) =>
    supportedTargetOutputs.has(metric)
  );

  return supportedMetrics.length > 0 ? supportedMetrics : trace.supportedMetrics;
}

function withScenarioSpecificAirborneRuntimePins(
  trace: LayerCombinationResolverTrace | undefined,
  result: AssemblyCalculation
): LayerCombinationResolverTrace | undefined {
  if (!trace) {
    return trace;
  }

  const isExactFloor = Boolean(
    trace.route === "floor" &&
      trace.runtimeBasisId &&
      FLOOR_VERIFIED_EXACT_SOURCE_BASES.has(trace.runtimeBasisId)
  );
  const isExactImpactSource = Boolean(
    trace.route === "floor" &&
      trace.runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS
  );
  const isFloorRuntime = trace.route === "floor" && Boolean(trace.runtimeBasisId);
  const isWallLocalSubstitutionFieldAdapter =
    trace.runtimeBasisId === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD;
  const isWallFlatListGuardFieldAdapter =
    trace.runtimeBasisId === FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD;
  const isWallFlatListGuardRuntime =
    trace.runtimeBasisId === FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD || isWallFlatListGuardFieldAdapter;
  const isWallFormulaRuntime =
    trace.runtimeBasisId === GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD ||
    trace.runtimeBasisId === COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD ||
    trace.runtimeBasisId === POST_V1_WALL_MULTILEAF_GENERALIZED_RUNTIME_METHOD ||
    trace.runtimeBasisId === GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD;
  const isWallCompatibleAnchorDelta =
    trace.runtimeBasisId === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD;
  const isWallFieldAdapter =
    trace.runtimeBasisId === GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD ||
    isWallLocalSubstitutionFieldAdapter ||
    isWallFlatListGuardFieldAdapter;
  const isWallBuildingAdapter =
    trace.runtimeBasisId === GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  const isWallContextAdapter = isWallFieldAdapter || isWallBuildingAdapter;
  const isWallLocalSubstitutionRuntime =
    trace.runtimeBasisId === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD ||
    trace.runtimeBasisId === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD ||
    isWallLocalSubstitutionFieldAdapter;

  if (
    trace.runtimeBasisId !== LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS &&
    trace.runtimeBasisId !== LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS &&
    trace.runtimeBasisId !== WALL_VERIFIED_AIRBORNE_EXACT_SOURCE_BASIS &&
    !isWallLocalSubstitutionRuntime &&
    !isWallFlatListGuardRuntime &&
    !isWallFormulaRuntime &&
    !isWallCompatibleAnchorDelta &&
    !isWallContextAdapter &&
    !isFloorRuntime &&
    !isExactFloor &&
    !isExactImpactSource
  ) {
    return trace;
  }

  const isSingleLeaf = trace.runtimeBasisId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  const isExactMeasured = trace.runtimeBasisId === WALL_VERIFIED_AIRBORNE_EXACT_SOURCE_BASIS;
  if (
    !isExactMeasured &&
    !isWallContextAdapter &&
    result.airborneOverlay?.contextMode &&
    result.airborneOverlay.contextMode !== "element_lab"
  ) {
    return withScenarioSpecificFloorRuntimePins(trace, result);
  }

  const floorTrace = withScenarioSpecificFloorRuntimePins(trace, result);
  if (floorTrace !== trace) {
    return floorTrace;
  }

  const supportedMetrics = isExactImpactSource
    ? getExactImpactSourceSupportedMetrics(result, result.supportedTargetOutputs)
    : isWallContextAdapter
      ? getRuntimeSupportedMetricsForAssembly(trace, result)
    : isWallCompatibleAnchorDelta
      ? trace.supportedMetrics.filter((metric) =>
          result.supportedTargetOutputs.includes(metric as RequestedOutputId)
        )
    : isExactMeasured || isExactFloor
      ? result.supportedTargetOutputs
      : getRuntimeSupportedMetricsForAssembly(trace, result);

  if (isExactFloor || isExactImpactSource) {
    return {
      ...trace,
      basis: isExactImpactSource ? trace.requestedBasis : trace.basis,
      supportedMetrics,
      surfaceDetail: isExactImpactSource
        ? `${trace.surfaceDetail} Current assembly value pins come from the selected exact impact-band source; airborne companion outputs stay on their own calculation basis and are not owned by this exact impact candidate.`
        : `${trace.surfaceDetail} Current assembly value pins come from the selected exact measured floor row and any separately owned field continuation outputs.`,
      valuePins: buildFloorRuntimeValuePins(result, supportedMetrics)
    };
  }

  return {
    ...trace,
    basis: isExactMeasured || isWallContextAdapter || isWallCompatibleAnchorDelta ? trace.requestedBasis : trace.basis,
    errorBudgetMetrics: isSingleLeaf ? ["Rw", "STC"] : trace.errorBudgetMetrics,
    supportedMetrics,
    surfaceDetail: isExactMeasured
      ? `${trace.surfaceDetail} Current assembly value pins come from the selected exact measured row.`
      : isWallCompatibleAnchorDelta
        ? `${trace.surfaceDetail} Current assembly value pins come from the measured subassembly anchor plus the owned calculated added-layer delta; companion metrics stay unsupported unless separately owned.`
      : isWallBuildingAdapter
        ? `${trace.surfaceDetail} Current wall building-prediction value pins are scenario-specific and come from the active ISO 12354-1 building calculation path; lab companions stay separate.`
      : isWallFieldAdapter
        ? `${trace.surfaceDetail} Current wall field-adapter value pins are scenario-specific and come from the active field-apparent calculation path.`
        : `${trace.surfaceDetail} Current assembly value pins are scenario-specific and are not measured evidence.`,
    valuePins: buildAirborneRuntimeValuePins(result, supportedMetrics)
  };
}

function withAnswerEngineBoundaryInputs(
  trace: LayerCombinationResolverTrace | undefined,
  result: ResolverImpactCarrier
): LayerCombinationResolverTrace | undefined {
  if (!trace) {
    return trace;
  }

  const boundary = result.acousticAnswerBoundary;
  const shouldIgnoreAirborneNeedsInput =
    !boundary &&
    trace.route === "floor" &&
    trace.candidateKind === "field_building_adapter";
  const missingPhysicalInputs =
    boundary?.origin === "needs_input"
      ? boundary.missingPhysicalInputs
      : !shouldIgnoreAirborneNeedsInput && result.airborneBasis?.origin === "needs_input"
        ? result.airborneBasis.missingPhysicalInputs
        : [];

  if (
    boundary?.origin === "unsupported" &&
    (
      trace.supportBucket === "unsupported" ||
      trace.supportBucket === "basis_boundary"
    )
  ) {
    return {
      ...trace,
      errorBudgetMetrics: [],
      requiredInputs: [...boundary.requiredInputs],
      supportedMetrics: [],
      surfaceDetail: `${trace.surfaceDetail} Unsupported answer outputs: ${boundary.unsupportedOutputs.join(", ")}.`,
      valuePins: []
    };
  }

  if (missingPhysicalInputs.length === 0) {
    return trace;
  }

  if (trace.supportBucket !== "needs_input") {
    const stoppedOutputs =
      boundary?.origin === "needs_input" && boundary.unsupportedOutputs.length > 0
        ? ` Stopped outputs: ${boundary.unsupportedOutputs.join(", ")}.`
        : "";

    return {
      ...trace,
      requiredInputs: [...new Set([...trace.requiredInputs, ...missingPhysicalInputs])],
      surfaceDetail: `${trace.surfaceDetail}${stoppedOutputs} Missing physical inputs: ${missingPhysicalInputs.join(", ")}.`
    };
  }

  return {
    ...trace,
    errorBudgetMetrics: [],
    requiredInputs: [...missingPhysicalInputs],
    supportedMetrics: [],
    surfaceDetail: `${trace.surfaceDetail} Missing physical inputs: ${missingPhysicalInputs.join(", ")}.`,
    valuePins: []
  };
}

function getPartialWallFormulaRuntimeBasisId(result: AssemblyCalculation): string | null {
  const boundary = result.acousticAnswerBoundary;
  if (
    boundary?.origin !== "needs_input" ||
    boundary.route !== "wall" ||
    result.dynamicAirborneTrace?.selectedMethod !== POST_V1_WALL_MULTILEAF_GENERALIZED_RUNTIME_METHOD
  ) {
    return null;
  }

  const hasOwnedLabOutput = result.supportedTargetOutputs.some((output: RequestedOutputId) =>
    POST_V1_WALL_MULTILEAF_GENERALIZED_LAB_METRICS.has(output)
  );

  return hasOwnedLabOutput && boundary.unsupportedOutputs.length > 0
    ? POST_V1_WALL_MULTILEAF_GENERALIZED_RUNTIME_METHOD
    : null;
}

function requestedBasisForWallResult(result: AssemblyCalculation): LayerCombinationResolverBasis {
  const contextMode = result.airborneOverlay?.contextMode;
  const method = result.airborneBasis?.method ?? "";

  if (contextMode === "building_prediction" || method.includes("building_prediction")) {
    return "building_prediction";
  }

  if (contextMode === "field_between_rooms") {
    return "field_apparent";
  }

  return "element_lab";
}

function getTimberCltDeltaLwRuntimeBasisId(input: {
  impact?: Pick<ImpactCalculation, "DeltaLw" | "metricBasis"> | null;
  supportedTargetOutputs?: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): string | null {
  if (
    !input.targetOutputs.includes("DeltaLw") ||
    !(input.supportedTargetOutputs ?? []).includes("DeltaLw") ||
    typeof input.impact?.DeltaLw !== "number"
  ) {
    return null;
  }

  const metricBasis = input.impact.metricBasis?.DeltaLw;

  return metricBasis && TIMBER_CLT_DELTA_LW_FORMULA_BASES.has(metricBasis)
    ? metricBasis
    : null;
}

function runtimeBasisIdForWallResult(result: AssemblyCalculation): string | null {
  if (
    result.airborneBasis?.origin === "measured_exact_full_stack" &&
    result.airborneBasis.method === "verified_airborne_catalog_exact_match"
  ) {
    return WALL_VERIFIED_AIRBORNE_EXACT_SOURCE_BASIS;
  }

  return result.airborneBasis?.method ?? null;
}

export function buildLayerCombinationResolverTraceForAssembly(
  result: AssemblyCalculation
): LayerCombinationResolverTrace | undefined {
  const answerBoundary = result.acousticAnswerBoundary;
  const hasFloorRoleLayer = result.layers.some(
    (layer: { readonly floorRole?: unknown }) => Boolean(layer.floorRole)
  );
  const requestedOrUnsupportedOutputs = [...result.targetOutputs, ...result.unsupportedTargetOutputs];
  const hasSingleLeafAirborneBasis =
    result.airborneBasis?.method === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  const hasDoubleLeafAirborneBasis =
    result.airborneBasis?.method === LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS;
  const hasWallFlatListGuardBasis =
    result.airborneBasis?.method === FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD ||
    result.airborneBasis?.method === FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD;
  const hasWallLocalSubstitutionBasis =
    result.airborneBasis?.method === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD ||
    result.airborneBasis?.method === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD ||
    result.airborneBasis?.method === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD;
  const hasWallFormulaAirborneBasis =
    result.airborneBasis?.method === GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD ||
    result.airborneBasis?.method === COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD ||
    result.airborneBasis?.method === POST_V1_WALL_MULTILEAF_GENERALIZED_RUNTIME_METHOD;
  const hasWallCompatibleAnchorDeltaBasis =
    result.airborneBasis?.method === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD;
  const hasWallFieldAirborneBasis =
    result.airborneBasis?.method === GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD;
  const hasWallBuildingAirborneBasis =
    result.airborneBasis?.method === GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  const shouldPreferWallAirborneRoute =
    !hasFloorRoleLayer &&
    (
      hasSingleLeafAirborneBasis ||
      hasDoubleLeafAirborneBasis ||
      hasWallFlatListGuardBasis ||
      hasWallLocalSubstitutionBasis ||
      hasWallFormulaAirborneBasis ||
      hasWallCompatibleAnchorDeltaBasis ||
      hasWallFieldAirborneBasis ||
      hasWallBuildingAirborneBasis
    ) &&
    !hasRequestedImpactMetric(requestedOrUnsupportedOutputs);
  const hasFloorImpactResult =
    Boolean(result.impact) ||
    Boolean(result.lowerBoundImpact) ||
    Boolean(result.impactCatalogMatch) ||
    Boolean(result.impactSupport) ||
    Boolean(result.supportedImpactOutputs?.length) ||
    Boolean(result.unsupportedImpactOutputs?.length);
  const hasFloorSystemOnlyResult =
    !result.airborneBasis &&
    (Boolean(result.floorSystemRatings) ||
      Boolean(result.floorSystemEstimate) ||
      Boolean(result.floorSystemMatch) ||
      Boolean(result.dynamicImpactTrace));
  const looksFloor = !shouldPreferWallAirborneRoute && (hasFloorRoleLayer || hasFloorImpactResult || hasFloorSystemOnlyResult);
  const route: LayerCombinationResolverRoute = answerBoundary?.route ?? (looksFloor ? "floor" : "wall");
  const hasFieldAdapter = hasFieldAdapterBudget(result) && hasFieldImpactValues(result);
  const airborneAnswerStop =
    result.airborneBasis &&
    ANSWER_ENGINE_STOP_ORIGINS.has(result.airborneBasis.origin);
  const partialWallFormulaRuntimeBasisId =
    route === "wall" ? getPartialWallFormulaRuntimeBasisId(result) : null;
  const shouldUseSingleLeafFloorAirborneBasis =
    route === "floor" &&
    hasSingleLeafAirborneBasis &&
    !hasRequestedImpactMetric(requestedOrUnsupportedOutputs);
  const timberCltDeltaLwRuntimeBasisId =
    route === "floor"
      ? getTimberCltDeltaLwRuntimeBasisId({
          impact: result.impact,
          supportedTargetOutputs: result.supportedTargetOutputs,
          targetOutputs: result.targetOutputs
        })
      : null;
  const runtimeBasisId = answerBoundary && !partialWallFormulaRuntimeBasisId
    ? null
    : hasFieldAdapter
    ? FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
      : route === "floor"
        ? shouldUseSingleLeafFloorAirborneBasis
          ? airborneAnswerStop
            ? null
            : result.airborneBasis?.method ?? null
        : timberCltDeltaLwRuntimeBasisId ?? result.impact?.basis ?? result.floorSystemRatings?.basis ?? null
      : partialWallFormulaRuntimeBasisId ??
        (airborneAnswerStop
        ? null
        : runtimeBasisIdForWallResult(result));
  const requestedBasis =
    route === "floor"
      ? requestedBasisForFloorResult({
          hasFieldAdapter,
          impactLabOrField: result.impact?.labOrField ?? null,
          runtimeBasisId,
          targetOutputs: result.targetOutputs,
          unsupportedOutputs: result.unsupportedTargetOutputs
        })
      : requestedBasisForWallResult(result);

  return withAnswerEngineBoundaryInputs(
    withScenarioSpecificAirborneRuntimePins(
      adaptSafely({
        missingPhysicalInputIds:
          answerBoundary?.origin === "needs_input"
            ? answerBoundary.missingPhysicalInputs
            : result.airborneBasis?.origin === "needs_input" && runtimeBasisId === null
              ? result.airborneBasis.missingPhysicalInputs
              : undefined,
        requestedBasis,
        requestedMetricAliases: toResolverMetricIds(result.targetOutputs),
        route,
        runtimeBasisId,
        unsupportedOutputIds: toResolverMetricIds(result.unsupportedTargetOutputs)
      }),
      result
    ),
    result
  );
}

export function buildLayerCombinationResolverTraceForImpactOnly(
  result: ImpactOnlyCalculation
): LayerCombinationResolverTrace | undefined {
  const hasFieldAdapter = hasFieldAdapterBudget(result) && hasFieldImpactValues(result);
  const timberCltDeltaLwRuntimeBasisId = getTimberCltDeltaLwRuntimeBasisId({
    impact: result.impact,
    supportedTargetOutputs: result.supportedTargetOutputs,
    targetOutputs: result.targetOutputs
  });
  const runtimeBasisId = result.acousticAnswerBoundary
    ? null
    : hasFieldAdapter
    ? FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
    : timberCltDeltaLwRuntimeBasisId ?? result.impact?.basis ?? result.floorSystemRatings?.basis ?? null;

  const trace = adaptSafely({
    missingPhysicalInputIds:
      result.acousticAnswerBoundary?.origin === "needs_input"
        ? result.acousticAnswerBoundary.missingPhysicalInputs
        : undefined,
    requestedBasis: requestedBasisForFloorResult({
      hasFieldAdapter,
      impactLabOrField: result.impact?.labOrField ?? null,
      runtimeBasisId,
      targetOutputs: result.targetOutputs,
      unsupportedOutputs: result.unsupportedTargetOutputs
    }),
    requestedMetricAliases: toResolverMetricIds(result.targetOutputs),
    route: "floor",
    runtimeBasisId,
    unsupportedOutputIds: toResolverMetricIds(result.unsupportedTargetOutputs)
  });
  const exactSupportedMetrics = runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS
    ? getExactImpactSourceSupportedMetrics(result, result.supportedTargetOutputs)
    : result.supportedTargetOutputs;
  const exactFloorTrace =
    trace &&
    runtimeBasisId &&
    (
      FLOOR_VERIFIED_EXACT_SOURCE_BASES.has(runtimeBasisId) ||
      runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS
    )
      ? {
          ...trace,
          basis:
            runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS
              ? trace.requestedBasis
              : trace.basis,
          supportedMetrics: [...exactSupportedMetrics],
          surfaceDetail:
            runtimeBasisId === EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS
              ? `${trace.surfaceDetail} Current impact-only value pins come from the selected exact impact-band source; non-impact companion outputs are not owned by this exact impact candidate.`
              : `${trace.surfaceDetail} Current impact-only value pins come from the selected exact measured floor row.`,
          valuePins: buildFloorRuntimeValuePins(result, exactSupportedMetrics)
        }
      : trace;

  return withAnswerEngineBoundaryInputs(
    withScenarioSpecificFloorRuntimePins(exactFloorTrace, result),
    result
  );
}

export function buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract():
  LayerCombinationResolverRuntimeCandidateSurfaceParityContract {
  const adapterContract = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
  const surfaceRows = adapterContract.adapterRows.map((row) => {
    const trace = buildLayerCombinationResolverSurfaceTraceFromAdapterRow(row);
    return {
      ...trace,
      boundaryCount: trace.boundaryCandidateIds.length,
      rejectedCount: trace.rejectedCandidateIds.length
    };
  });

  return {
    landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousAdapter: {
      landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS
    },
    selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTION_STATUS,
    surfaceRows,
    surfaceTargets: [
      "candidate_trace",
      "output_cards",
      "route_posture",
      "confidence_provenance",
      "metric_basis_rows",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ],
    summary: {
      boundarySurfaceRowCount: surfaceRows.filter(
        (row) =>
          row.candidateKind === "basis_boundary" ||
          row.candidateKind === "needs_input_boundary" ||
          row.candidateKind === "unsupported_boundary"
      ).length,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      surfaceRowCount: surfaceRows.length
    }
  };
}
