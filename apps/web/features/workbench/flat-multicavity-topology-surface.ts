import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, WallTopology } from "@dynecho/shared";

import type { EvaluatedScenario } from "./scenario-analysis";

export const WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL =
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL;

export const WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_GATE =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE;

export type GateACFlatMulticavityTopologySurface = {
  detail: string;
  groupLine: string;
  label: typeof WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL;
  method: string;
  origin: string;
  status: "screening_with_explicit_topology" | "solver_with_explicit_topology";
};

function formatRows(indices: readonly number[] | undefined): string {
  return indices && indices.length > 0
    ? indices.map((index) => String(index + 1)).join(", ")
    : "missing";
}

function formatDepth(value: number | undefined): string {
  return typeof value === "number" ? `${value.toFixed(1)} mm` : "missing";
}

function formatToken(value: string | undefined): string {
  return value ? value.replaceAll("_", " ") : "missing";
}

function hasOwnedGroupedTripleLeafTopology(topology: WallTopology | undefined): topology is WallTopology {
  return Boolean(
    topology?.topologyMode === "grouped_triple_leaf" &&
      topology.sideALeafLayerIndices?.length &&
      topology.cavity1LayerIndices?.length &&
      typeof topology.cavity1DepthMm === "number" &&
      topology.internalLeafLayerIndices?.length &&
      topology.internalLeafCoupling &&
      topology.cavity2LayerIndices?.length &&
      typeof topology.cavity2DepthMm === "number" &&
      topology.sideBLeafLayerIndices?.length &&
      topology.supportTopology
  );
}

function buildGroupLine(topology: WallTopology): string {
  return [
    `side A rows ${formatRows(topology.sideALeafLayerIndices)}`,
    `cavity 1 rows ${formatRows(topology.cavity1LayerIndices)} at ${formatDepth(topology.cavity1DepthMm)}, ${formatToken(topology.cavity1FillCoverage)} fill, ${formatToken(topology.cavity1AbsorptionClass)}`,
    `internal leaf rows ${formatRows(topology.internalLeafLayerIndices)}, coupling ${formatToken(topology.internalLeafCoupling)}`,
    `cavity 2 rows ${formatRows(topology.cavity2LayerIndices)} at ${formatDepth(topology.cavity2DepthMm)}, ${formatToken(topology.cavity2FillCoverage)} fill, ${formatToken(topology.cavity2AbsorptionClass)}`,
    `side B rows ${formatRows(topology.sideBLeafLayerIndices)}`,
    `support ${formatToken(topology.supportTopology)}`
  ].join("; ");
}

export function getGateACFlatMulticavityTopologySurface(input: {
  airborneContext?: AirborneContext | null;
  result: AssemblyCalculation | null;
}): GateACFlatMulticavityTopologySurface | null {
  const topology = input.airborneContext?.wallTopology;

  if (!input.result || !hasOwnedGroupedTripleLeafTopology(topology)) {
    return null;
  }

  const method = input.result.airborneBasis?.method ?? input.result.metrics.method;
  const origin = input.result.airborneBasis?.origin ?? "unknown";
  const status =
    method === "triple_leaf_two_cavity_frequency_solver" ||
    method === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD ||
    method === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD ||
    method === GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD
      ? "solver_with_explicit_topology"
      : "screening_with_explicit_topology";
  const groupLine = buildGroupLine(topology);

  return {
    detail:
      `${WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL} is carried from visible workbench row groups through Gate AC. ` +
      `Method ${method}; origin ${origin}; ${groupLine}.`,
    groupLine,
    label: WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
    method,
    origin,
    status
  };
}

export function getGateACFlatMulticavityTopologyReportLines(
  scenario: EvaluatedScenario
): string[] {
  const surface = getGateACFlatMulticavityTopologySurface({
    airborneContext: scenario.airborneContext ?? null,
    result: scenario.result
  });

  if (!surface) {
    return [];
  }

  return [
    `- Wall multicavity topology basis: ${surface.label} carried from visible row groups; method ${surface.method}; origin ${surface.origin}; not measured evidence.`,
    `- Wall multicavity topology groups: ${surface.groupLine}.`
  ];
}
