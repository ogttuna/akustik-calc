import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactOnlyCalculation,
  LayerCombinationResolverTrace,
  RequestedOutputId
} from "@dynecho/shared";

import { FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN } from "./impact-field-adapter-error-budget";
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
  "DnT,w",
  "IIC",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
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
  "Ln,w",
  "Ln,w+CI"
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
  readonly impact?: Pick<
    ImpactCalculation,
    "LPrimeNT50" | "LPrimeNTw" | "LPrimeNW" | "errorBudgets"
  > | null;
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
  runtimeBasisId: string | null;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
}): LayerCombinationResolverBasis {
  if (input.hasFieldAdapter) {
    return "field_apparent";
  }

  if (!input.runtimeBasisId && hasAstmAlias([...input.targetOutputs, ...input.unsupportedOutputs])) {
    return "astm_rating_boundary";
  }

  return "element_lab";
}

function buildAirborneRuntimeValuePins(result: AssemblyCalculation): LayerCombinationResolverTrace["valuePins"] {
  const pins: LayerCombinationResolverTrace["valuePins"] = [];

  if (typeof result.metrics.estimatedRwDb === "number") {
    pins.push({ metric: "Rw", value: result.metrics.estimatedRwDb });
  }
  if (typeof result.metrics.estimatedStc === "number") {
    pins.push({ metric: "STC", value: result.metrics.estimatedStc });
  }
  if (typeof result.metrics.estimatedCDb === "number") {
    pins.push({ metric: "C", value: result.metrics.estimatedCDb });
  }
  if (typeof result.metrics.estimatedCtrDb === "number") {
    pins.push({ metric: "Ctr", value: result.metrics.estimatedCtrDb });
  }

  return pins;
}

function withScenarioSpecificAirborneRuntimePins(
  trace: LayerCombinationResolverTrace | undefined,
  result: AssemblyCalculation
): LayerCombinationResolverTrace | undefined {
  if (result.airborneOverlay?.contextMode && result.airborneOverlay.contextMode !== "element_lab") {
    return trace;
  }

  if (
    trace?.runtimeBasisId !== LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS &&
    trace?.runtimeBasisId !== LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
  ) {
    return trace;
  }

  const isSingleLeaf = trace.runtimeBasisId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;

  return {
    ...trace,
    errorBudgetMetrics: isSingleLeaf ? ["Rw", "STC"] : trace.errorBudgetMetrics,
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    surfaceDetail: `${trace.surfaceDetail} Current assembly value pins are scenario-specific and are not measured evidence.`,
    valuePins: buildAirborneRuntimeValuePins(result)
  };
}

export function buildLayerCombinationResolverTraceForAssembly(
  result: AssemblyCalculation
): LayerCombinationResolverTrace | undefined {
  const hasFloorRoleLayer = result.layers.some(
    (layer: { readonly floorRole?: unknown }) => Boolean(layer.floorRole)
  );
  const requestedOrUnsupportedOutputs = [...result.targetOutputs, ...result.unsupportedTargetOutputs];
  const hasSingleLeafAirborneBasis =
    result.airborneBasis?.method === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  const shouldPreferWallAirborneRoute =
    !hasFloorRoleLayer && hasSingleLeafAirborneBasis && !hasRequestedImpactMetric(requestedOrUnsupportedOutputs);
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
  const route: LayerCombinationResolverRoute = looksFloor ? "floor" : "wall";
  const hasFieldAdapter = hasFieldAdapterBudget(result) && hasFieldImpactValues(result);
  const shouldUseSingleLeafFloorAirborneBasis =
    route === "floor" &&
    hasSingleLeafAirborneBasis &&
    !hasRequestedImpactMetric(requestedOrUnsupportedOutputs);
  const runtimeBasisId = hasFieldAdapter
    ? FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
    : route === "floor"
      ? shouldUseSingleLeafFloorAirborneBasis
        ? result.airborneBasis?.method ?? null
        : result.impact?.basis ?? result.floorSystemRatings?.basis ?? null
      : result.airborneBasis?.method ?? null;
  const requestedBasis =
    route === "floor"
      ? requestedBasisForFloorResult({
          hasFieldAdapter,
          runtimeBasisId,
          targetOutputs: result.targetOutputs,
          unsupportedOutputs: result.unsupportedTargetOutputs
        })
      : "element_lab";

  return withScenarioSpecificAirborneRuntimePins(
    adaptSafely({
      requestedBasis,
      requestedMetricAliases: toResolverMetricIds(result.targetOutputs),
      route,
      runtimeBasisId,
      unsupportedOutputIds: toResolverMetricIds(result.unsupportedTargetOutputs)
    }),
    result
  );
}

export function buildLayerCombinationResolverTraceForImpactOnly(
  result: ImpactOnlyCalculation
): LayerCombinationResolverTrace | undefined {
  const hasFieldAdapter = hasFieldAdapterBudget(result) && hasFieldImpactValues(result);
  const runtimeBasisId = hasFieldAdapter
    ? FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
    : result.impact?.basis ?? result.floorSystemRatings?.basis ?? null;

  return adaptSafely({
    requestedBasis: requestedBasisForFloorResult({
      hasFieldAdapter,
      runtimeBasisId,
      targetOutputs: result.targetOutputs,
      unsupportedOutputs: result.unsupportedTargetOutputs
    }),
    requestedMetricAliases: toResolverMetricIds(result.targetOutputs),
    route: "floor",
    runtimeBasisId,
    unsupportedOutputIds: toResolverMetricIds(result.unsupportedTargetOutputs)
  });
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
