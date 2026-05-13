import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateAWCartography,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAW
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aw";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE =
  "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS =
  "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION =
  "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts";

export type PersonalUseMvpCoverageSprintGateAXOwnerGroupId =
  | "route_basis_and_metric_owner"
  | "explicit_leaf_and_cavity_topology_owner"
  | "panel_dynamic_property_owner"
  | "cavity_absorber_property_owner"
  | "frame_and_coupling_property_owner"
  | "opening_leak_sub_element_owner"
  | "direct_curve_and_rating_adapter_owner"
  | "hostile_input_guard_owner"
  | "source_absent_uncertainty_visibility_owner";

export type PersonalUseMvpCoverageSprintGateAXPhysicalFieldId =
  | "absorberCoverageRatio"
  | "absorberFlowResistivityPaSM2"
  | "absorberThicknessMm"
  | "cavityDepthMm"
  | "cavitySealState"
  | "cavitySequence"
  | "directTransmissionCurveOwner"
  | "duplicateOwnershipGuard"
  | "exactSourcePrecedenceCheck"
  | "fieldBuildingAdapterBoundary"
  | "frameDepthMm"
  | "frameLineCouplingStiffnessMNPerM3"
  | "frameMaterialClass"
  | "frameSpacingMm"
  | "frequencyBandSet"
  | "hostWallAreaM2"
  | "iso717RwCAdapterOwner"
  | "leafGrouping"
  | "leafSequence"
  | "mechanicalBridgeAreaRatio"
  | "openingAreaM2"
  | "openingElementRw"
  | "openingIntent"
  | "openingOrigin"
  | "openingRatingBasis"
  | "openingSealLeakageClass"
  | "openingSubElementIds"
  | "outputBasis"
  | "panelBendingStiffnessNm"
  | "panelCriticalFrequencyHz"
  | "panelLayerOwnership"
  | "panelLossFactor"
  | "panelMaterialClass"
  | "panelSurfaceMassKgM2"
  | "panelThicknessMm"
  | "resilientConnectionStiffnessMNPerM3"
  | "resilientConnectionType"
  | "sourceAbsentErrorBudgetOwner"
  | "splitLayerGuard"
  | "stcAdapterOwner"
  | "wallSolverIntent";

export type PersonalUseMvpCoverageSprintGateAXScenarioStatus =
  | "delegated_to_existing_owned_route"
  | "exact_source_precedence"
  | "invalid_topology"
  | "needs_input"
  | "ready_for_runtime_gate"
  | "unsupported_boundary";

export type PersonalUseMvpCoverageSprintGateAXOwnerGroup = {
  blocksRuntimeWhenMissing: true;
  defaultPolicy: "explicit_input_required" | "material_default_allowed_with_budget_widening" | "not_defaultable";
  id: PersonalUseMvpCoverageSprintGateAXOwnerGroupId;
  purpose: string;
  requiredFields: readonly PersonalUseMvpCoverageSprintGateAXPhysicalFieldId[];
  runtimePromotionAllowedAtGateAX: false;
};

export type PersonalUseMvpCoverageSprintGateAXScenario = {
  basis: "element_lab" | "field_or_building_boundary";
  blockedReason: string | null;
  broadSourceCrawlRequired: false;
  delegatedRoute: string | null;
  exactSourcePrecedenceApplied: boolean;
  fieldOrBuildingAliasAllowed: false;
  id: string;
  missingPhysicalInputs: readonly PersonalUseMvpCoverageSprintGateAXPhysicalFieldId[];
  presentOwnerGroups: readonly PersonalUseMvpCoverageSprintGateAXOwnerGroupId[];
  requestedMetrics: readonly RequestedOutputId[];
  runtimePromotionAllowedAtGateAX: false;
  status: PersonalUseMvpCoverageSprintGateAXScenarioStatus;
};

export type PersonalUseMvpCoverageSprintGateAXBudgetRequirement = {
  activeAtGateAX: false;
  activationGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION;
  budgetDb: number;
  metric: Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">;
  posture: "source_absent_design_budget_required_before_runtime";
};

export type PersonalUseMvpCoverageSprintGateAXContract = {
  acceptedGateAWSolverGapIds: readonly string[];
  activeRuntimeBudgetAtGateAX: false;
  budgetRequirements: readonly PersonalUseMvpCoverageSprintGateAXBudgetRequirement[];
  fieldAndBuildingOutputsBlockedAtGateAX: readonly Extract<RequestedOutputId, "DnT,w" | "R'w">[];
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerGroups: readonly PersonalUseMvpCoverageSprintGateAXOwnerGroup[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE;
  previousSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION;
  previousSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS;
  requiredPhysicalFields: readonly PersonalUseMvpCoverageSprintGateAXPhysicalFieldId[];
  runtimePromotionAllowedAtGateAX: false;
  scenarios: readonly PersonalUseMvpCoverageSprintGateAXScenario[];
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS;
  sourceRowsRequiredForGateAX: false;
  wallLabOutputsOwnedByContract: readonly Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">[];
};

export type PersonalUseMvpCoverageSprintGateAXSummary = {
  acceptedGateAWSolverGapIds: readonly string[];
  allScenariosFailClosedOrReadyForLaterRuntime: true;
  completeScenarioId: string;
  fieldAndBuildingAliasAllowed: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerGroupIds: readonly PersonalUseMvpCoverageSprintGateAXOwnerGroupId[];
  requiredPhysicalFieldCount: number;
  scenarioCount: number;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS;
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly Extract<
  RequestedOutputId,
  "C" | "Ctr" | "Rw" | "STC"
>[];

const FIELD_BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly Extract<
  RequestedOutputId,
  "DnT,w" | "R'w"
>[];

const OWNER_GROUPS = [
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "not_defaultable",
    id: "route_basis_and_metric_owner",
    purpose: "Keep the advanced solver inside element-lab wall Rw/STC/C/Ctr until later adapters own field/building bases.",
    requiredFields: [
      "wallSolverIntent",
      "outputBasis",
      "frequencyBandSet",
      "fieldBuildingAdapterBoundary",
      "exactSourcePrecedenceCheck"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "not_defaultable",
    id: "explicit_leaf_and_cavity_topology_owner",
    purpose: "Replace unsafe flat-list guessing with explicit leaf, panel, and cavity ownership for N-layer walls.",
    requiredFields: [
      "leafGrouping",
      "leafSequence",
      "panelLayerOwnership",
      "cavitySequence",
      "cavityDepthMm"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "material_default_allowed_with_budget_widening",
    id: "panel_dynamic_property_owner",
    purpose: "Require panel mass and dynamic inputs, or a named material-default owner, before a direct curve can be promoted.",
    requiredFields: [
      "panelMaterialClass",
      "panelThicknessMm",
      "panelSurfaceMassKgM2",
      "panelBendingStiffnessNm",
      "panelLossFactor",
      "panelCriticalFrequencyHz"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "material_default_allowed_with_budget_widening",
    id: "cavity_absorber_property_owner",
    purpose: "Own airspace depth, absorber amount, and absorber flow resistance instead of silently assuming mineral wool behavior.",
    requiredFields: [
      "cavityDepthMm",
      "absorberThicknessMm",
      "absorberCoverageRatio",
      "absorberFlowResistivityPaSM2",
      "cavitySealState"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "explicit_input_required",
    id: "frame_and_coupling_property_owner",
    purpose: "Own stud/frame spacing and mechanical coupling so resilient channels and bridged cavities cannot be collapsed into one mass-air-mass guess.",
    requiredFields: [
      "frameMaterialClass",
      "frameSpacingMm",
      "frameDepthMm",
      "frameLineCouplingStiffnessMNPerM3",
      "resilientConnectionType",
      "resilientConnectionStiffnessMNPerM3",
      "mechanicalBridgeAreaRatio"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "explicit_input_required",
    id: "opening_leak_sub_element_owner",
    purpose: "Either explicitly declare no openings or provide the Gate S/T/U opening terms so weak elements are not ignored.",
    requiredFields: [
      "openingIntent",
      "hostWallAreaM2",
      "openingSubElementIds",
      "openingAreaM2",
      "openingElementRw",
      "openingRatingBasis",
      "openingSealLeakageClass",
      "openingOrigin"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "not_defaultable",
    id: "direct_curve_and_rating_adapter_owner",
    purpose: "Require a one-third-octave direct curve and named ISO/ASTM rating adapters before any one-number result can promote.",
    requiredFields: [
      "frequencyBandSet",
      "directTransmissionCurveOwner",
      "iso717RwCAdapterOwner",
      "stcAdapterOwner"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "not_defaultable",
    id: "hostile_input_guard_owner",
    purpose: "Refuse duplicate ownership, overlapping split layers, and unsafe reorders before the solver can produce a confident answer.",
    requiredFields: [
      "duplicateOwnershipGuard",
      "splitLayerGuard"
    ],
    runtimePromotionAllowedAtGateAX: false
  },
  {
    blocksRuntimeWhenMissing: true,
    defaultPolicy: "not_defaultable",
    id: "source_absent_uncertainty_visibility_owner",
    purpose: "Make the future source-absent budget visible before runtime, without presenting it as measured evidence.",
    requiredFields: [
      "sourceAbsentErrorBudgetOwner"
    ],
    runtimePromotionAllowedAtGateAX: false
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAXOwnerGroup[];

const OWNER_GROUP_IDS = OWNER_GROUPS.map((group) => group.id);

const COMPLETE_OWNER_GROUPS = [...OWNER_GROUP_IDS] as const;

const SCENARIO_PACK = [
  {
    basis: "element_lab",
    blockedReason: null,
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_complete_mixed_n_layer_wall_ready_for_runtime_gate",
    missingPhysicalInputs: [],
    presentOwnerGroups: COMPLETE_OWNER_GROUPS,
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "ready_for_runtime_gate"
  },
  {
    basis: "element_lab",
    blockedReason: "panel_dynamic_inputs_missing",
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_missing_panel_dynamic_inputs_needs_input",
    missingPhysicalInputs: [
      "panelBendingStiffnessNm",
      "panelLossFactor",
      "panelCriticalFrequencyHz"
    ],
    presentOwnerGroups: [
      "route_basis_and_metric_owner",
      "explicit_leaf_and_cavity_topology_owner",
      "cavity_absorber_property_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "needs_input"
  },
  {
    basis: "element_lab",
    blockedReason: "cavity_absorber_inputs_missing",
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_missing_cavity_absorber_inputs_needs_input",
    missingPhysicalInputs: [
      "cavityDepthMm",
      "absorberCoverageRatio",
      "absorberFlowResistivityPaSM2"
    ],
    presentOwnerGroups: [
      "route_basis_and_metric_owner",
      "explicit_leaf_and_cavity_topology_owner",
      "panel_dynamic_property_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "needs_input"
  },
  {
    basis: "element_lab",
    blockedReason: "opening_intent_or_opening_terms_missing",
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_partial_opening_leak_sub_elements_needs_input",
    missingPhysicalInputs: [
      "openingIntent",
      "hostWallAreaM2",
      "openingAreaM2",
      "openingElementRw",
      "openingRatingBasis",
      "openingSealLeakageClass"
    ],
    presentOwnerGroups: [
      "route_basis_and_metric_owner",
      "explicit_leaf_and_cavity_topology_owner",
      "panel_dynamic_property_owner",
      "cavity_absorber_property_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "needs_input"
  },
  {
    basis: "element_lab",
    blockedReason: "flat_list_or_duplicate_ownership_cannot_be_auto_grouped",
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_flat_duplicate_split_topology_invalid",
    missingPhysicalInputs: [
      "leafGrouping",
      "panelLayerOwnership",
      "cavitySequence",
      "duplicateOwnershipGuard",
      "splitLayerGuard"
    ],
    presentOwnerGroups: [
      "route_basis_and_metric_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "invalid_topology"
  },
  {
    basis: "element_lab",
    blockedReason: "same_stack_lab_source_row_wins_before_formula",
    broadSourceCrawlRequired: false,
    delegatedRoute: "exact_source_candidate_resolver",
    exactSourcePrecedenceApplied: true,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_exact_same_stack_source_precedence",
    missingPhysicalInputs: [],
    presentOwnerGroups: [
      "route_basis_and_metric_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "exact_source_precedence"
  },
  {
    basis: "field_or_building_boundary",
    blockedReason: "field_and_building_outputs_need_later_adapter_ownership",
    broadSourceCrawlRequired: false,
    delegatedRoute: null,
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_field_building_outputs_blocked",
    missingPhysicalInputs: [
      "fieldBuildingAdapterBoundary"
    ],
    presentOwnerGroups: [
      "route_basis_and_metric_owner",
      "direct_curve_and_rating_adapter_owner"
    ],
    requestedMetrics: FIELD_BUILDING_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "unsupported_boundary"
  },
  {
    basis: "element_lab",
    blockedReason: "covered_family_delegate_keeps_existing_runtime_until_generalized_solver_is_promoted",
    broadSourceCrawlRequired: false,
    delegatedRoute: "triple_leaf_two_cavity_frequency_solver",
    exactSourcePrecedenceApplied: false,
    fieldOrBuildingAliasAllowed: false,
    id: "gate_ax_existing_grouped_triple_leaf_delegate_not_superseded",
    missingPhysicalInputs: [],
    presentOwnerGroups: [
      "route_basis_and_metric_owner",
      "explicit_leaf_and_cavity_topology_owner"
    ],
    requestedMetrics: WALL_LAB_OUTPUTS,
    runtimePromotionAllowedAtGateAX: false,
    status: "delegated_to_existing_owned_route"
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAXScenario[];

const BUDGET_REQUIREMENTS = [
  {
    activeAtGateAX: false,
    activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    budgetDb: 8,
    metric: "Rw",
    posture: "source_absent_design_budget_required_before_runtime"
  },
  {
    activeAtGateAX: false,
    activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    budgetDb: 8,
    metric: "STC",
    posture: "source_absent_design_budget_required_before_runtime"
  },
  {
    activeAtGateAX: false,
    activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    budgetDb: 3,
    metric: "C",
    posture: "source_absent_design_budget_required_before_runtime"
  },
  {
    activeAtGateAX: false,
    activationGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    budgetDb: 3,
    metric: "Ctr",
    posture: "source_absent_design_budget_required_before_runtime"
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAXBudgetRequirement[];

function uniqueRequiredPhysicalFields(): readonly PersonalUseMvpCoverageSprintGateAXPhysicalFieldId[] {
  return Array.from(new Set(OWNER_GROUPS.flatMap((group) => group.requiredFields)));
}

function acceptedGateAWSolverGapIds(): readonly string[] {
  return buildPersonalUseMvpCoverageSprintGateAWCartography()
    .filter((cell) => cell.gapOwner === "advanced_wall_source_absent_solver_contract")
    .map((cell) => cell.id);
}

export function buildPersonalUseMvpCoverageSprintGateAXContract():
  PersonalUseMvpCoverageSprintGateAXContract {
  const gateAW = summarizePersonalUseMvpCoverageSprintGateAW();

  if (gateAW.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE) {
    throw new Error("Gate AX can only land after Gate AW selects the advanced wall source-absent solver contract.");
  }

  if (gateAW.selectedGateAXLane !== "advanced_wall_source_absent_solver_contract") {
    throw new Error("Gate AX requires Gate AW's selected lane to remain advanced wall source-absent solver contract.");
  }

  return {
    acceptedGateAWSolverGapIds: acceptedGateAWSolverGapIds(),
    activeRuntimeBudgetAtGateAX: false,
    budgetRequirements: BUDGET_REQUIREMENTS,
    fieldAndBuildingOutputsBlockedAtGateAX: FIELD_BUILDING_OUTPUTS,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerGroups: OWNER_GROUPS,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_LANDED_GATE,
    previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_ACTION,
    previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTED_NEXT_FILE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_SELECTION_STATUS,
    requiredPhysicalFields: uniqueRequiredPhysicalFields(),
    runtimePromotionAllowedAtGateAX: false,
    scenarios: SCENARIO_PACK,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
    sourceRowsRequiredForGateAX: false,
    wallLabOutputsOwnedByContract: WALL_LAB_OUTPUTS
  };
}

export function buildPersonalUseMvpCoverageSprintGateAXScenarioPack():
  readonly PersonalUseMvpCoverageSprintGateAXScenario[] {
  return SCENARIO_PACK;
}

export function summarizePersonalUseMvpCoverageSprintGateAX(): PersonalUseMvpCoverageSprintGateAXSummary {
  const contract = buildPersonalUseMvpCoverageSprintGateAXContract();

  return {
    acceptedGateAWSolverGapIds: contract.acceptedGateAWSolverGapIds,
    allScenariosFailClosedOrReadyForLaterRuntime: true,
    completeScenarioId: "gate_ax_complete_mixed_n_layer_wall_ready_for_runtime_gate",
    fieldAndBuildingAliasAllowed: false,
    landedGate: contract.landedGate,
    noRuntimeValueMovement: true,
    ownerGroupIds: contract.ownerGroups.map((group) => group.id),
    requiredPhysicalFieldCount: contract.requiredPhysicalFields.length,
    scenarioCount: contract.scenarios.length,
    selectedNextAction: contract.selectedNextAction,
    selectedNextFile: contract.selectedNextFile,
    selectionStatus: contract.selectionStatus
  };
}
