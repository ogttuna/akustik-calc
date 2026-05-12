import type { AcousticInputFieldId, AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE =
  "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS =
  "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_landed_selected_surface_parity_gate_ac";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION =
  "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan";

export const GATE_AB_WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
export const GATE_AB_WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
export const GATE_AB_UNSUPPORTED_ASTM_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];

export const GATE_AB_NO_TOPOLOGY_MISSING_FIELDS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS = [
  "sideALeafGroup",
  "leafGrouping",
  "cavity1DepthMm",
  "cavity1FillCoverage",
  "absorberClass",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "cavity2FillCoverage",
  "sideBLeafGroup",
  "supportTopology"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_AB_WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

export const GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 60 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const GATE_AB_COMPLETE_GROUPED_FLAT_TOPOLOGY = {
  cavity1AbsorptionClass: "porous_absorptive",
  cavity1DepthMm: 70,
  cavity1FillCoverage: "partial",
  cavity1LayerIndices: [3, 4],
  cavity2AbsorptionClass: "porous_absorptive",
  cavity2DepthMm: 80,
  cavity2FillCoverage: "partial",
  cavity2LayerIndices: [6, 7],
  internalLeafCoupling: "independent",
  internalLeafLayerIndices: [5],
  sideALeafLayerIndices: [0, 1, 2],
  sideBLeafLayerIndices: [8, 9, 10],
  supportTopology: "independent_frames",
  topologyMode: "grouped_triple_leaf"
} as const satisfies NonNullable<AirborneContext["wallTopology"]>;

export const GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT: AirborneContext = {
  ...GATE_AB_WALL_LAB_CONTEXT,
  wallTopology: GATE_AB_COMPLETE_GROUPED_FLAT_TOPOLOGY
};

export const GATE_AB_STALE_FLAT_ORDER_CONTEXT: AirborneContext = {
  ...GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  wallTopology: {
    ...GATE_AB_COMPLETE_GROUPED_FLAT_TOPOLOGY,
    topologyMode: "flat_layer_order"
  }
};

export const GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT: AirborneContext = {
  ...GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  wallTopology: {
    ...GATE_AB_COMPLETE_GROUPED_FLAT_TOPOLOGY,
    cavity1LayerIndices: [2, 3, 4]
  }
};

export const GATE_AB_EMPTY_CAVITY_GROUP_CONTEXT: AirborneContext = {
  ...GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  wallTopology: {
    ...GATE_AB_COMPLETE_GROUPED_FLAT_TOPOLOGY,
    cavity1LayerIndices: []
  }
};

export const GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

export const GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...GATE_AB_WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

export type PersonalUseMvpCoverageSprintGateABSummary = {
  completeTopologyOwnerFields: typeof GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE;
  noRuntimeValueMovement: true;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS;
};

export function summarizePersonalUseMvpCoverageSprintGateAB(): PersonalUseMvpCoverageSprintGateABSummary {
  return {
    completeTopologyOwnerFields: GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_LANDED_GATE,
    noRuntimeValueMovement: true,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_SELECTION_STATUS
  };
}
