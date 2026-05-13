import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateAVRoadmap,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-av";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE =
  "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS =
  "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION =
  "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_PREVIOUS_SELECTION_STATUS =
  "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw";

export type PersonalUseMvpCoverageSprintGateAXLaneId =
  | "advanced_wall_source_absent_solver_contract"
  | "astm_impact_rating_adapter_contract"
  | "broad_source_row_crawl"
  | "calibration_budget_tightening_with_holdouts"
  | "floor_impact_source_absent_solver_cartography"
  | "opening_leak_building_adapter_contract";

export type PersonalUseMvpCoverageSprintGateAWCellBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";

export type PersonalUseMvpCoverageSprintGateAWCellStatus =
  | "adapter_gap"
  | "needs_input_boundary"
  | "runtime_owned"
  | "solver_gap"
  | "unsupported_boundary";

export type PersonalUseMvpCoverageSprintGateAWRoute = "floor" | "wall";

export type PersonalUseMvpCoverageSprintGateAWCartographyCell = {
  basis: PersonalUseMvpCoverageSprintGateAWCellBasis;
  currentStatus: PersonalUseMvpCoverageSprintGateAWCellStatus;
  currentSupportBucket: "blocked" | "explicit_boundary" | "formula_owned" | "source_exact_or_anchor";
  family:
    | "airborne_building_prediction"
    | "astm_impact_rating"
    | "clt_mass_timber_wall"
    | "floor_clt_mass_timber"
    | "floor_concrete_floating_resilient"
    | "floor_field_impact"
    | "floor_lightweight_steel"
    | "floor_timber_joist"
    | "opening_leak_composite"
    | "wall_aac_nonhomogeneous_masonry"
    | "wall_exact_source_precedence"
    | "wall_flat_multicavity_boundary"
    | "wall_grouped_triple_leaf"
    | "wall_lined_massive_masonry"
    | "wall_mixed_n_layer_multicavity"
    | "wall_multicavity_direct_curve"
    | "wall_single_leaf_massive"
    | "wall_timber_or_steel_framed";
  gapOwner: PersonalUseMvpCoverageSprintGateAXLaneId | null;
  hostileVariant: string | null;
  id: string;
  layerCombinationClass: string;
  metrics: readonly RequestedOutputId[];
  nextAction: string;
  priority: number;
  route: PersonalUseMvpCoverageSprintGateAWRoute;
  whyItMatters: string;
};

export type PersonalUseMvpCoverageSprintGateAXLaneCandidate = {
  accuracyRisk: number;
  broadSourceCrawl: boolean;
  coverageImpact: number;
  id: PersonalUseMvpCoverageSprintGateAXLaneId;
  implementationReadiness: number;
  reason: string;
  runtimeMovementAllowedAtGateAW: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAWSummary = {
  adapterGapCellIds: readonly string[];
  broadSourceCrawlSelected: false;
  coveredRuntimeCellIds: readonly string[];
  exactSourcePrecedencePreserved: true;
  gateAVSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION;
  gateAVSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_PREVIOUS_SELECTION_STATUS;
  selectedGateAXLane: PersonalUseMvpCoverageSprintGateAXLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE;
  selectionCandidates: readonly PersonalUseMvpCoverageSprintGateAXLaneCandidate[];
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS;
  solverGapCellIds: readonly string[];
  sourceAbsentSolverGapsRankedBeforeSourceCrawl: true;
  totalCells: number;
  unsupportedBoundaryCellIds: readonly string[];
};

const WALL_LAB_METRICS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_METRICS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_METRICS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_FIELD_IMPACT_METRICS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_METRICS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CARTOGRAPHY_CELLS = [
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "source_exact_or_anchor",
    family: "wall_exact_source_precedence",
    gapOwner: null,
    hostileVariant: null,
    id: "wall.exact_source_precedence.same_stack_lab",
    layerCombinationClass: "Trusted same-stack source rows",
    metrics: WALL_LAB_METRICS,
    nextAction: "preserve exact-source precedence before every future solver",
    priority: 0.98,
    route: "wall",
    whyItMatters: "Known measured assemblies must remain the safest answer when the full stack truly matches."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "wall_single_leaf_massive",
    gapOwner: null,
    hostileVariant: null,
    id: "wall.single_leaf_massive.lab_formula_owned",
    layerCombinationClass: "Homogeneous massive masonry or concrete single-leaf wall",
    metrics: WALL_LAB_METRICS,
    nextAction: "keep as covered baseline and comparison anchor",
    priority: 0.7,
    route: "wall",
    whyItMatters: "Single-leaf massive walls are common and already provide a stable mass-law/Sharp-Davy baseline."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "wall_aac_nonhomogeneous_masonry",
    gapOwner: null,
    hostileVariant: null,
    id: "wall.aac_nonhomogeneous_masonry.lab_formula_owned",
    layerCombinationClass: "AAC / non-homogeneous masonry single-leaf wall",
    metrics: WALL_LAB_METRICS,
    nextAction: "keep Gate X solver lane as covered",
    priority: 0.72,
    route: "wall",
    whyItMatters: "AAC and non-homogeneous masonry were promoted to named family physics and should stay covered."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "clt_mass_timber_wall",
    gapOwner: null,
    hostileVariant: null,
    id: "wall.clt_mass_timber.lab_formula_owned",
    layerCombinationClass: "CLT / mass-timber single-panel wall",
    metrics: WALL_LAB_METRICS,
    nextAction: "keep Gate Y C/Ctr adapter lane as covered",
    priority: 0.68,
    route: "wall",
    whyItMatters: "Mass timber has distinct stiffness and coincidence behavior and already has an owned lab corridor."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "wall_lined_massive_masonry",
    gapOwner: null,
    hostileVariant: null,
    id: "wall.lined_massive_masonry.lab_formula_owned",
    layerCombinationClass: "Lined massive/masonry wall with cavity and absorber",
    metrics: WALL_LAB_METRICS,
    nextAction: "keep Gate H cavity-aware delegate as covered",
    priority: 0.73,
    route: "wall",
    whyItMatters: "Lined massive walls are common retrofit assemblies and already use a named family basis."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "wall_grouped_triple_leaf",
    gapOwner: null,
    hostileVariant: "safe_group_reorder",
    id: "wall.grouped_triple_leaf.explicit_topology_formula_owned",
    layerCombinationClass: "Explicit grouped triple-leaf / two-cavity wall",
    metrics: WALL_LAB_METRICS,
    nextAction: "keep explicit grouped topology route covered",
    priority: 0.8,
    route: "wall",
    whyItMatters: "Triple-leaf walls are high-risk for wrong answers, but explicit grouping currently reaches a named route."
  },
  {
    basis: "element_lab",
    currentStatus: "needs_input_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "wall_flat_multicavity_boundary",
    gapOwner: "advanced_wall_source_absent_solver_contract",
    hostileVariant: "flat_many_layer_ambiguous_order",
    id: "wall.flat_multicavity.ambiguous_needs_input_boundary",
    layerCombinationClass: "Flat-list multi-cavity wall without explicit leaf/cavity ownership",
    metrics: WALL_LAB_METRICS,
    nextAction: "Gate AX must define whether a generalized solver can safely own grouped input requirements",
    priority: 0.93,
    route: "wall",
    whyItMatters: "Users will enter many-layer walls as flat lists; wrong auto-grouping would create confident but false values."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "wall_mixed_n_layer_multicavity",
    gapOwner: "advanced_wall_source_absent_solver_contract",
    hostileVariant: "panels_cavities_studs_resilient_links_openings_mixed",
    id: "wall.mixed_n_layer_multicavity.generalized_solver_gap",
    layerCombinationClass: "N-layer mixed panel/cavity/stud/resilient/opening wall",
    metrics: WALL_LAB_METRICS,
    nextAction: "select Gate AX direct-curve source-absent solver contract",
    priority: 1,
    route: "wall",
    whyItMatters: "This is the largest unbounded layer-combination gap for practical consulting use."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "wall_multicavity_direct_curve",
    gapOwner: "advanced_wall_source_absent_solver_contract",
    hostileVariant: "one_number_route_needs_frequency_curve",
    id: "wall.multicavity_direct_curve.frequency_solver_gap",
    layerCombinationClass: "Multi-panel / multi-cavity wall needing a one-third-octave direct curve",
    metrics: WALL_LAB_METRICS,
    nextAction: "Gate AX should own direct-curve inputs before runtime promotion",
    priority: 0.97,
    route: "wall",
    whyItMatters: "Frequency curves make Rw/C/Ctr/STC adapters and future field/building paths more defensible than one-number shortcuts."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "wall_timber_or_steel_framed",
    gapOwner: "advanced_wall_source_absent_solver_contract",
    hostileVariant: "duplicate_split_boards_and_resilient_channel_mix",
    id: "wall.framed_resilient_split_layers.direct_curve_gap",
    layerCombinationClass: "Timber/steel framed double leaf with split boards, cavities, and resilient channels",
    metrics: WALL_LAB_METRICS,
    nextAction: "Gate AX should state when existing framed delegates win and when generalized solver may run",
    priority: 0.9,
    route: "wall",
    whyItMatters: "Framed resilient assemblies are frequent and order/duplicate mistakes can otherwise produce unstable outputs."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "opening_leak_composite",
    gapOwner: null,
    hostileVariant: "duplicate_opening_ids_refused",
    id: "wall.opening_leak_composite.element_lab_owned",
    layerCombinationClass: "Host wall with explicit opening area/count/Rw/seal inputs",
    metrics: ["Rw", "STC"],
    nextAction: "keep element-lab opening/leak route covered",
    priority: 0.76,
    route: "wall",
    whyItMatters: "Small weak elements can dominate real wall results and current lab Rw/STC is owned."
  },
  {
    basis: "field_apparent",
    currentStatus: "adapter_gap",
    currentSupportBucket: "blocked",
    family: "opening_leak_composite",
    gapOwner: "opening_leak_building_adapter_contract",
    hostileVariant: "lab_opening_value_requested_as_field",
    id: "wall.opening_leak_composite.field_building_adapter_gap",
    layerCombinationClass: "Opening/leak composite requested as field/building airborne output",
    metrics: WALL_FIELD_METRICS,
    nextAction: "later adapter gate must own direct curve, flanking, room, and uncertainty terms",
    priority: 0.66,
    route: "wall",
    whyItMatters: "Lab opening/leak values must not be reused as R'w or DnT,w without field/building ownership."
  },
  {
    basis: "field_apparent",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "airborne_building_prediction",
    gapOwner: null,
    hostileVariant: "partial_context_needs_input",
    id: "wall.airborne_field_and_building.context_owned",
    layerCombinationClass: "Owned wall family with explicit field/building context",
    metrics: WALL_FIELD_METRICS,
    nextAction: "keep context-owner boundaries explicit",
    priority: 0.75,
    route: "wall",
    whyItMatters: "Room and field/building context are separate output bases and already have owner gates."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_lightweight_steel",
    gapOwner: null,
    hostileVariant: "duplicate_carrier_refused",
    id: "floor.lightweight_steel.impact_formula_owned",
    layerCombinationClass: "Explicit lightweight steel floor with carrier, load, upper, and lower isolation owners",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "keep Gate AD/AO formula corridor and budget visible",
    priority: 0.8,
    route: "floor",
    whyItMatters: "Steel floor lab impact formulas are owned when physical inputs are complete."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_timber_joist",
    gapOwner: null,
    hostileVariant: "missing_dynamic_stiffness_needs_input",
    id: "floor.timber_joist.impact_formula_owned",
    layerCombinationClass: "Timber joist floor with explicit dynamic stiffness/load/topping/lower assembly",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "keep Gate D/E/F timber formula surface covered",
    priority: 0.78,
    route: "floor",
    whyItMatters: "Timber impact reduction is a frequent consulting case and already has a bounded formula lane."
  },
  {
    basis: "element_lab",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_clt_mass_timber",
    gapOwner: null,
    hostileVariant: "field_lnt50_boundary",
    id: "floor.clt_mass_timber.impact_formula_owned",
    layerCombinationClass: "CLT/mass-timber floor with explicit topping and lower support owners",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "keep CLT impact formula lane covered",
    priority: 0.77,
    route: "floor",
    whyItMatters: "Mass-timber floors need separate impact behavior from framed timber and already have a formula lane."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "floor_concrete_floating_resilient",
    gapOwner: "floor_impact_source_absent_solver_cartography",
    hostileVariant: "floating_screed_underlay_suspended_ceiling_mix",
    id: "floor.concrete_floating_resilient.mass_spring_gap",
    layerCombinationClass: "Concrete slab plus floating screed, resilient underlay, covering, and suspended ceiling",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate AZ should map floor impact mass-spring and dynamic-stiffness gaps",
    priority: 0.88,
    route: "floor",
    whyItMatters: "Concrete floating floor packages are common and need more than the current steel/timber/CLT corridors."
  },
  {
    basis: "field_apparent",
    currentStatus: "runtime_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_field_impact",
    gapOwner: null,
    hostileVariant: "missing_field_context_needs_input",
    id: "floor.field_impact.context_owned",
    layerCombinationClass: "Owned floor family with explicit field impact context",
    metrics: FLOOR_FIELD_IMPACT_METRICS,
    nextAction: "keep L'n,w and L'nT,w field context requirements explicit",
    priority: 0.7,
    route: "floor",
    whyItMatters: "Field impact outputs must remain separate from lab Ln,w and ASTM IIC."
  },
  {
    basis: "astm_rating_boundary",
    currentStatus: "unsupported_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "astm_impact_rating",
    gapOwner: "astm_impact_rating_adapter_contract",
    hostileVariant: "iic_aiic_requested_from_iso_ln_w",
    id: "floor.astm_iic_aiic.rating_adapter_gap",
    layerCombinationClass: "ASTM IIC / AIIC requested from ISO impact lane",
    metrics: ASTM_IMPACT_METRICS,
    nextAction: "later ASTM E989 adapter must own one-third-octave ASTM basis",
    priority: 0.63,
    route: "floor",
    whyItMatters: "IIC/AIIC are useful outputs but must never alias ISO Ln,w."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "floor_concrete_floating_resilient",
    gapOwner: "floor_impact_source_absent_solver_cartography",
    hostileVariant: "missing_or_defaulted_dynamic_stiffness",
    id: "floor.material_property_defaults.dynamic_stiffness_gap",
    layerCombinationClass: "Floor covering / resilient layer where dynamic stiffness, load basis, or loss factor is unknown",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate AZ should decide defaultable versus required physical fields",
    priority: 0.74,
    route: "floor",
    whyItMatters: "Wrong defaults for dynamic stiffness or load can move impact ratings by clinically meaningful dB."
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAWCartographyCell[];

const SELECTION_CANDIDATES = [
  {
    accuracyRisk: 0.94,
    broadSourceCrawl: false,
    coverageImpact: 0.96,
    id: "advanced_wall_source_absent_solver_contract",
    implementationReadiness: 0.84,
    reason:
      "Wall N-layer and multicavity gaps have the highest coverage/accuracy risk and can be closed by a no-runtime direct-curve input contract first.",
    runtimeMovementAllowedAtGateAW: false,
    score: 1.72,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.86,
    broadSourceCrawl: false,
    coverageImpact: 0.82,
    id: "floor_impact_source_absent_solver_cartography",
    implementationReadiness: 0.68,
    reason:
      "Floor concrete/floating/resilient gaps are high value but should follow after the wall direct-curve contract starts.",
    runtimeMovementAllowedAtGateAW: false,
    score: 1.32,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.7,
    broadSourceCrawl: false,
    coverageImpact: 0.62,
    id: "opening_leak_building_adapter_contract",
    implementationReadiness: 0.56,
    reason: "Opening/leak field/building outputs need adapter ownership after direct-curve and flanking terms are explicit.",
    runtimeMovementAllowedAtGateAW: false,
    score: 0.95,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.68,
    broadSourceCrawl: false,
    coverageImpact: 0.58,
    id: "astm_impact_rating_adapter_contract",
    implementationReadiness: 0.5,
    reason: "ASTM IIC/AIIC is useful but remains an adapter gap, not the main arbitrary-layer solver gap.",
    runtimeMovementAllowedAtGateAW: false,
    score: 0.86,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.58,
    broadSourceCrawl: false,
    coverageImpact: 0.45,
    id: "calibration_budget_tightening_with_holdouts",
    implementationReadiness: 0.28,
    reason: "Budget tightening is blocked until source-owned holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateAW: false,
    score: 0.5,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    accuracyRisk: 0.4,
    broadSourceCrawl: true,
    coverageImpact: 0.3,
    id: "broad_source_row_crawl",
    implementationReadiness: 0.2,
    reason: "Broad source crawling may add exact overrides later but does not solve unbounded layer combinations.",
    runtimeMovementAllowedAtGateAW: false,
    score: 0.16,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAXLaneCandidate[];

function cellIdsByStatus(status: PersonalUseMvpCoverageSprintGateAWCellStatus): readonly string[] {
  return CARTOGRAPHY_CELLS
    .filter((cell) => cell.currentStatus === status)
    .map((cell) => cell.id);
}

export function buildPersonalUseMvpCoverageSprintGateAWCartography():
  readonly PersonalUseMvpCoverageSprintGateAWCartographyCell[] {
  return CARTOGRAPHY_CELLS;
}

export function rankPersonalUseMvpCoverageSprintGateAXLanes():
  readonly PersonalUseMvpCoverageSprintGateAXLaneCandidate[] {
  return SELECTION_CANDIDATES;
}

export function summarizePersonalUseMvpCoverageSprintGateAW(): PersonalUseMvpCoverageSprintGateAWSummary {
  const gateAV = buildPersonalUseMvpCoverageSprintGateAVRoadmap();
  const selectedCandidate = SELECTION_CANDIDATES.find((candidate) => candidate.selected);

  if (gateAV.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE) {
    throw new Error("Gate AW can only land after Gate AV selects source-absent solver gap cartography.");
  }

  if (!selectedCandidate) {
    throw new Error("Gate AW requires one selected Gate AX lane.");
  }

  return {
    adapterGapCellIds: cellIdsByStatus("adapter_gap"),
    broadSourceCrawlSelected: false,
    coveredRuntimeCellIds: cellIdsByStatus("runtime_owned"),
    exactSourcePrecedencePreserved: true,
    gateAVSelectedNextAction: gateAV.selectedNextAction,
    gateAVSelectedNextFile: gateAV.selectedNextFile,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_PREVIOUS_SELECTION_STATUS,
    selectedGateAXLane: selectedCandidate.id,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
    selectionCandidates: SELECTION_CANDIDATES,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
    solverGapCellIds: cellIdsByStatus("solver_gap"),
    sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
    totalCells: CARTOGRAPHY_CELLS.length,
    unsupportedBoundaryCellIds: cellIdsByStatus("unsupported_boundary")
  };
}
