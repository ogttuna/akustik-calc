import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { ASTM_E989_IMPACT_RATING_BASIS } from "./impact-astm-e989";
import {
  buildLayerCombinationResolverRegistryContract,
  LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS,
  type LayerCombinationResolverBasis,
  type LayerCombinationResolverCandidateDeclaration,
  type LayerCombinationResolverCandidateKind,
  type LayerCombinationResolverMetricId,
  type LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE =
  "layer_combination_resolver_runtime_candidate_adapter_plan";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS =
  "layer_combination_resolver_runtime_candidate_adapter_landed_no_runtime_selected_surface_parity";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_runtime_candidate_surface_parity_plan";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL =
  "layer combination resolver runtime candidate surface parity";

const NEEDS_INPUT_CANDIDATE_ID = "generic.required_input_owner.needs_input_boundary";
const BASIS_BOUNDARY_CANDIDATE_ID = "generic.lab_field_building_basis_boundary";
const ASTM_UNSUPPORTED_CANDIDATE_ID = "generic.astm_iic_aiic.unsupported_boundary";

export type LayerCombinationResolverRuntimeCandidateAdapterInput = {
  readonly missingPhysicalInputIds?: readonly string[];
  readonly requestedBasis: LayerCombinationResolverBasis;
  readonly requestedMetricAliases?: readonly LayerCombinationResolverMetricId[];
  readonly route: LayerCombinationResolverRoute;
  readonly runtimeBasisId?: string | null;
  readonly unsupportedOutputIds?: readonly LayerCombinationResolverMetricId[];
};

export type LayerCombinationResolverAdaptedCandidate = {
  readonly basis: LayerCombinationResolverBasis;
  readonly errorBudgetMetrics: readonly LayerCombinationResolverMetricId[];
  readonly id: string;
  readonly kind: LayerCombinationResolverCandidateKind;
  readonly ownedRuntimeBasisId: string | null;
  readonly priorityRank: number;
  readonly requiredInputs: readonly string[];
  readonly supportedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly valuePins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
};

export type LayerCombinationResolverRuntimeCandidateAdapterResult = {
  readonly adapterVersion: "2026-05-21.layer-combination-resolver-runtime-candidate-adapter.v1";
  readonly boundaryCandidateIds: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly rejectedCandidateIds: readonly string[];
  readonly requestedBasis: LayerCombinationResolverBasis;
  readonly route: LayerCombinationResolverRoute;
  readonly runtimeBasisId: string | null;
  readonly selectedCandidate: LayerCombinationResolverAdaptedCandidate;
  readonly selectedCandidateId: string;
};

export type LayerCombinationResolverRuntimeCandidateAdapterContract = {
  readonly adapterRows: readonly LayerCombinationResolverRuntimeCandidateAdapterResult[];
  readonly adapterVersion: LayerCombinationResolverRuntimeCandidateAdapterResult["adapterVersion"];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousRegistry: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS;
  readonly summary: {
    readonly adaptedRuntimeBasisCount: number;
    readonly boundaryCandidateCount: number;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION;
  };
};

function candidateToAdapterCandidate(
  candidate: LayerCombinationResolverCandidateDeclaration
): LayerCombinationResolverAdaptedCandidate {
  return {
    basis: candidate.basis,
    errorBudgetMetrics: candidate.errorBudgetTerms.map((term) => term.metric),
    id: candidate.id,
    kind: candidate.kind,
    ownedRuntimeBasisId: candidate.ownedRuntimeBasisId,
    priorityRank: candidate.priorityRank,
    requiredInputs: candidate.requiredInputs,
    supportedMetrics: candidate.supportedMetrics,
    valuePins: candidate.valuePins
  };
}

function candidateAppliesToRoute(candidate: LayerCombinationResolverCandidateDeclaration, route: LayerCombinationResolverRoute) {
  if (
    candidate.ownedRuntimeBasisId === LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS &&
    (route === "wall" || route === "floor")
  ) {
    return true;
  }

  return candidate.route === route || candidate.id.startsWith("generic.");
}

function sortCandidates(
  candidates: readonly LayerCombinationResolverCandidateDeclaration[]
): LayerCombinationResolverCandidateDeclaration[] {
  return [...candidates].sort((left, right) => {
    if (left.priorityRank !== right.priorityRank) {
      return left.priorityRank - right.priorityRank;
    }
    return left.id.localeCompare(right.id);
  });
}

function getCandidateById(id: string): LayerCombinationResolverCandidateDeclaration {
  const candidate = buildLayerCombinationResolverRegistryContract().candidateDeclarations.find((entry) => entry.id === id);
  if (!candidate) {
    throw new Error(`Layer combination resolver adapter is missing candidate declaration ${id}.`);
  }
  return candidate;
}

function hasAstmAlias(input: LayerCombinationResolverRuntimeCandidateAdapterInput): boolean {
  const aliases = [...(input.requestedMetricAliases ?? []), ...(input.unsupportedOutputIds ?? [])];
  return aliases.some((metric) => metric === "IIC" || metric === "AIIC");
}

function buildBoundaryCandidateIds(input: LayerCombinationResolverRuntimeCandidateAdapterInput): string[] {
  const ids: string[] = [];
  if ((input.missingPhysicalInputIds ?? []).length > 0) {
    ids.push(NEEDS_INPUT_CANDIDATE_ID);
  }
  if (input.requestedBasis === "building_prediction") {
    ids.push(BASIS_BOUNDARY_CANDIDATE_ID);
  }
  if (
    input.runtimeBasisId !== ASTM_E989_IMPACT_RATING_BASIS &&
    (input.requestedBasis === "astm_rating_boundary" || hasAstmAlias(input))
  ) {
    ids.push(ASTM_UNSUPPORTED_CANDIDATE_ID);
  }
  return [...new Set(ids)];
}

function selectCandidate(input: LayerCombinationResolverRuntimeCandidateAdapterInput): LayerCombinationResolverCandidateDeclaration {
  const registry = buildLayerCombinationResolverRegistryContract();
  const runtimeBasisId = input.runtimeBasisId ?? null;

  if (runtimeBasisId) {
    const runtimeCandidate = registry.candidateDeclarations.find(
      (candidate) => candidateAppliesToRoute(candidate, input.route) && candidate.ownedRuntimeBasisId === runtimeBasisId
    );
    if (!runtimeCandidate) {
      throw new Error(`Layer combination resolver adapter cannot map runtime basis ${runtimeBasisId}.`);
    }
    return runtimeCandidate;
  }

  const boundaryCandidateIds = buildBoundaryCandidateIds(input);
  if (boundaryCandidateIds.length > 0) {
    return getCandidateById(boundaryCandidateIds[0] ?? NEEDS_INPUT_CANDIDATE_ID);
  }

  return getCandidateById(ASTM_UNSUPPORTED_CANDIDATE_ID);
}

export function adaptLayerCombinationRuntimeCandidate(
  input: LayerCombinationResolverRuntimeCandidateAdapterInput
): LayerCombinationResolverRuntimeCandidateAdapterResult {
  const registry = buildLayerCombinationResolverRegistryContract();
  const selectedCandidate = selectCandidate(input);
  const routeCandidateIds = sortCandidates(
    registry.candidateDeclarations.filter((candidate) => candidateAppliesToRoute(candidate, input.route))
  ).map((candidate) => candidate.id);
  const boundaryCandidateIds = buildBoundaryCandidateIds(input).filter((id) => id !== selectedCandidate.id);
  const reservedCandidateIds = new Set([selectedCandidate.id, ...boundaryCandidateIds]);

  return {
    adapterVersion: "2026-05-21.layer-combination-resolver-runtime-candidate-adapter.v1",
    boundaryCandidateIds,
    noRuntimeValueMovement: true,
    rejectedCandidateIds: routeCandidateIds.filter((id) => !reservedCandidateIds.has(id)),
    requestedBasis: input.requestedBasis,
    route: input.route,
    runtimeBasisId: input.runtimeBasisId ?? null,
    selectedCandidate: candidateToAdapterCandidate(selectedCandidate),
    selectedCandidateId: selectedCandidate.id
  };
}

const BOUNDARY_CONTRACT_ROWS = [
  {
    missingPhysicalInputIds: ["ceiling_board"],
    requestedBasis: "element_lab",
    route: "floor",
    runtimeBasisId: null
  },
  {
    requestedBasis: "building_prediction",
    route: "floor",
    runtimeBasisId: null,
    unsupportedOutputIds: ["L'nT,w"]
  },
  {
    requestedBasis: "astm_rating_boundary",
    requestedMetricAliases: ["IIC", "AIIC"],
    route: "floor",
    runtimeBasisId: null
  }
] as const satisfies readonly LayerCombinationResolverRuntimeCandidateAdapterInput[];

export function buildLayerCombinationResolverRuntimeCandidateAdapterContract(): LayerCombinationResolverRuntimeCandidateAdapterContract {
  const registry = buildLayerCombinationResolverRegistryContract();
  const activeRuntimeRows = registry.candidateDeclarations
    .filter((candidate) => candidate.runtimeSelectionState === "active_runtime_existing" && candidate.ownedRuntimeBasisId)
    .map(
      (candidate): LayerCombinationResolverRuntimeCandidateAdapterInput => ({
        requestedBasis: candidate.basis,
        route: candidate.route,
        runtimeBasisId: candidate.ownedRuntimeBasisId
      })
    );
  const adapterRows = [...activeRuntimeRows, ...BOUNDARY_CONTRACT_ROWS].map((row) =>
    adaptLayerCombinationRuntimeCandidate(row)
  );

  return {
    adapterRows,
    adapterVersion: "2026-05-21.layer-combination-resolver-runtime-candidate-adapter.v1",
    landedGate: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousRegistry: {
      landedGate: LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS
    },
    selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTION_STATUS,
    summary: {
      adaptedRuntimeBasisCount: adapterRows.filter((row) => row.runtimeBasisId !== null).length,
      boundaryCandidateCount: adapterRows.filter(
        (row) =>
          row.selectedCandidate.kind === "basis_boundary" ||
          row.selectedCandidate.kind === "needs_input_boundary" ||
          row.selectedCandidate.kind === "unsupported_boundary"
      ).length,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_RUNTIME_CANDIDATE_ADAPTER_SELECTED_NEXT_ACTION
    }
  };
}
