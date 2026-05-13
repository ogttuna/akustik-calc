import {
  AcousticInputCompletenessSchema,
  type AcousticInputCompleteness,
  type AcousticInputDefaultPolicy,
  type AcousticInputFieldId,
  type AcousticInputMissingBehavior,
  type ImpactOnlyCalculation,
  type ImpactPredictorInput,
  type RequestedOutputId
} from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateBA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import type { DynamicCalculatorPromptSource, DynamicCalculatorRouteInputPrompt } from "./dynamic-calculator-route-input-topology";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE =
  "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS =
  "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION =
  "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts";

export type PersonalUseMvpCoverageSprintGateBBFamilyId =
  | "astm_impact_rating"
  | "building_impact_prediction"
  | "clt_mass_timber"
  | "composite_panel"
  | "field_impact_context"
  | "heavy_concrete_bare"
  | "heavy_concrete_combined_upper_lower"
  | "heavy_concrete_floating"
  | "hostile_role_topology"
  | "lightweight_concrete"
  | "lightweight_steel"
  | "mixed_support_family"
  | "timber_joist"
  | "trusted_exact_source";

export type PersonalUseMvpCoverageSprintGateBBStatus =
  | "exact_source_precedence"
  | "fail_closed_hostile_topology"
  | "fail_closed_mixed_family"
  | "family_specific_contract_required"
  | "needs_input"
  | "published_anchor_lnw_only_delta_lw_needs_input"
  | "ready_existing_runtime_corridor"
  | "ready_for_formula_corridor_gate"
  | "unsupported_basis";

export type PersonalUseMvpCoverageSprintGateBBFormulaLaneStatus =
  | "already_owned_runtime_corridor"
  | "blocked_by_basis_boundary"
  | "blocked_by_exact_source_precedence"
  | "fail_closed_hostile_topology"
  | "family_specific_contract_required"
  | "needs_input"
  | "not_applicable"
  | "ready_for_formula_corridor_gate";

export type PersonalUseMvpCoverageSprintGateBBFormulaLaneId =
  | "clt_mass_timber_delta_lw_existing_corridor"
  | "composite_panel_dry_floating_interaction_contract"
  | "heavy_concrete_annex_c_upper_delta_lw_existing_corridor"
  | "heavy_concrete_combined_upper_lower_coupled_delta_lw"
  | "lightweight_concrete_family_specific_delta_lw_contract"
  | "steel_mass_spring_delta_lw_existing_corridor"
  | "timber_joist_delta_lw_existing_corridor";

export type PersonalUseMvpCoverageSprintGateBBOwnerGroup =
  | "astm_or_building_basis_boundary"
  | "base_carrier_family"
  | "field_context_boundary"
  | "hostile_topology_guard"
  | "lower_treatment_coupling"
  | "steel_carrier_geometry"
  | "upper_delta_lw_package";

export type PersonalUseMvpCoverageSprintGateBBPhysicalOwnerRequirement = {
  defaultPolicy: AcousticInputDefaultPolicy;
  fieldId: AcousticInputFieldId;
  label: string;
  missingBehavior: AcousticInputMissingBehavior;
  ownerGroup: PersonalUseMvpCoverageSprintGateBBOwnerGroup;
  requiredForFamilies: readonly PersonalUseMvpCoverageSprintGateBBFamilyId[];
  source: DynamicCalculatorPromptSource;
};

export type PersonalUseMvpCoverageSprintGateBBFormulaLane = {
  appliesToFamilies: readonly PersonalUseMvpCoverageSprintGateBBFamilyId[];
  laneId: PersonalUseMvpCoverageSprintGateBBFormulaLaneId;
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  status: PersonalUseMvpCoverageSprintGateBBFormulaLaneStatus;
};

export type PersonalUseMvpCoverageSprintGateBBCurrentRuntimeSnapshot = {
  basisId: string | null;
  deltaLwDb: number | null;
  lnWDb: number | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBBInputContractInput = {
  exactSourceRowAvailable?: boolean;
  family: PersonalUseMvpCoverageSprintGateBBFamilyId;
  hostileFlags?: readonly ("duplicate_role" | "mixed_support_family" | "split_resilient_layer" | "unsafe_reorder")[];
  impactPredictorInput?: ImpactPredictorInput | null;
  publishedFamilyAnchorAllowed?: boolean;
  requestedBasis?: "astm_rating" | "building_prediction" | "element_lab" | "field_apparent";
  targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBBInputContract = {
  basisBoundaries: readonly string[];
  currentRuntimeSnapshot: PersonalUseMvpCoverageSprintGateBBCurrentRuntimeSnapshot | null;
  deltaLwInventedFromFieldOrAstm: false;
  exactSourcePrecedencePreserved: true;
  family: PersonalUseMvpCoverageSprintGateBBFamilyId;
  formulaCorridorReady: boolean;
  formulaLanes: readonly PersonalUseMvpCoverageSprintGateBBFormulaLane[];
  inputCompleteness: AcousticInputCompleteness | null;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  noRuntimeValueMovement: true;
  normalizedPredictorInput: ImpactPredictorInput | null;
  physicalOwnerRequirements: readonly PersonalUseMvpCoverageSprintGateBBPhysicalOwnerRequirement[];
  precedenceOrder: readonly string[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS;
  prompts: readonly DynamicCalculatorRouteInputPrompt[];
  publishedFamilyAnchorAllowedForLnWOnly: boolean;
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS;
  sourceRowsRequiredForInputContract: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: PersonalUseMvpCoverageSprintGateBBStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBBScenarioId =
  | "gate_bb_astm_iic_aiic_basis_unsupported"
  | "gate_bb_clt_existing_corridor_preserved"
  | "gate_bb_complete_combined_upper_lower_ready_for_gate_bc"
  | "gate_bb_complete_heavy_floating_existing_corridor_owned"
  | "gate_bb_composite_panel_family_contract_required"
  | "gate_bb_exact_source_precedence_preserved"
  | "gate_bb_field_or_building_basis_non_alias_blocked"
  | "gate_bb_hostile_duplicate_roles_fail_closed"
  | "gate_bb_lightweight_concrete_not_heavy_formula"
  | "gate_bb_missing_dynamic_stiffness_needs_input"
  | "gate_bb_missing_load_basis_published_anchor_lnw_only"
  | "gate_bb_missing_lower_treatment_needs_input"
  | "gate_bb_mixed_support_family_fail_closed"
  | "gate_bb_steel_missing_carrier_or_lower_inputs_needs_input"
  | "gate_bb_timber_existing_corridor_preserved";

export type PersonalUseMvpCoverageSprintGateBBScenarioPackEntry = {
  contract: PersonalUseMvpCoverageSprintGateBBInputContract;
  description: string;
  expectedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  expectedStatus: PersonalUseMvpCoverageSprintGateBBStatus;
  id: PersonalUseMvpCoverageSprintGateBBScenarioId;
};

export type PersonalUseMvpCoverageSprintGateBCNextLaneId =
  | "astm_impact_adapter"
  | "broad_source_row_crawl"
  | "floor_impact_error_budget_surface"
  | "floor_impact_field_building_adapter"
  | "floor_impact_formula_retune"
  | "floor_impact_source_absent_formula_corridor";

export type PersonalUseMvpCoverageSprintGateBCNextLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBCNextLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBB: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBBProbeSnapshot = {
  astmBoundary: ImpactOnlyCalculation;
  exactSourcePrecedence: ImpactOnlyCalculation;
  heavyConcreteFormula: ImpactOnlyCalculation;
  missingLoadPublishedAnchor: ImpactOnlyCalculation;
};

export type PersonalUseMvpCoverageSprintGateBBSummary = {
  broadSourceCrawlSelected: false;
  gateBASelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION;
  gateBASelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS;
  scenarioCount: number;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS;
  sourceAbsentFormulaCorridorSelectedBeforeBroadSourceCrawl: true;
  statusCounts: Record<PersonalUseMvpCoverageSprintGateBBStatus, number>;
};

const LAB_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "DeltaLw"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);
const ASTM_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["AIIC", "HIIC", "IIC", "LIIC"]);
const BUILDING_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'nT,50"]);

const UPPER_DELTA_LW_PHYSICAL_INPUTS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const satisfies readonly AcousticInputFieldId[];

const COMBINED_UPPER_LOWER_PHYSICAL_INPUTS = [
  ...UPPER_DELTA_LW_PHYSICAL_INPUTS,
  "ceilingOrLowerAssembly"
] as const satisfies readonly AcousticInputFieldId[];

const STEEL_PHYSICAL_INPUTS = [
  "steelSupportForm",
  "steelCarrierDepthMm",
  "steelCarrierSpacingMm",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "lowerCeilingIsolationSupportForm"
] as const satisfies readonly AcousticInputFieldId[];

const FAMILY_SPECIFIC_PHYSICAL_INPUTS = [
  "baseSlabOrFloor",
  "materialClass",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const satisfies readonly AcousticInputFieldId[];

const PRECEDENCE_ORDER = [
  "exact_full_stack_measured_source_for_requested_metric",
  "owned_existing_floor_impact_formula_corridor",
  "Gate_BB_source_absent_formula_corridor_with_explicit_owner_fields",
  "published_family_anchor_for_Ln_w_only_when_DeltaLw_owners_missing",
  "needs_input_or_unsupported_boundary"
] as const;

const BASIS_BOUNDARIES = [
  "ISO_717_2_lab_impact_Ln_w_DeltaLw_only_for_Gate_BB",
  "field_impact_Lprime_outputs_need_impactFieldContext_and_do_not_alias_lab_Ln_w",
  "building_prediction_impact_needs_future_flanking_junction_room_owners",
  "ASTM_E989_IIC_AIIC_need_their_own_adapter_and_do_not_alias_ISO_Ln_w_or_DeltaLw"
] as const;

const REQUIRED_FORMULA_OWNERS = [
  "floorImpactReferenceFamilyOwner",
  "floorImpactDynamicStiffnessOrProductCurveOwner",
  "floorImpactLoadBasisOwner",
  "floorImpactUpperTreatmentMassOwner",
  "floorImpactLowerTreatmentCouplingOwner",
  "floorImpactHostileTopologyBoundaryOwner",
  "floorImpactSourceAbsentBudgetOwner"
] as const;

const PHYSICAL_OWNER_REQUIREMENTS = [
  {
    defaultPolicy: "no_default",
    fieldId: "baseSlabOrFloor",
    label: "Base slab / carrier family",
    missingBehavior: "needs_input",
    ownerGroup: "base_carrier_family",
    requiredForFamilies: [
      "heavy_concrete_bare",
      "heavy_concrete_floating",
      "heavy_concrete_combined_upper_lower",
      "lightweight_concrete",
      "composite_panel",
      "timber_joist",
      "clt_mass_timber"
    ],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "materialClass",
    label: "Base material class",
    missingBehavior: "needs_input",
    ownerGroup: "base_carrier_family",
    requiredForFamilies: ["lightweight_concrete", "composite_panel", "mixed_support_family"],
    source: "material_property"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "toppingOrFloatingLayer",
    label: "Upper topping / floating layer",
    missingBehavior: "needs_input",
    ownerGroup: "upper_delta_lw_package",
    requiredForFamilies: [
      "heavy_concrete_floating",
      "heavy_concrete_combined_upper_lower",
      "lightweight_concrete",
      "composite_panel",
      "timber_joist",
      "clt_mass_timber",
      "lightweight_steel"
    ],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "resilientLayerDynamicStiffnessMNm3",
    label: "Resilient-layer dynamic stiffness",
    missingBehavior: "needs_input",
    ownerGroup: "upper_delta_lw_package",
    requiredForFamilies: [
      "heavy_concrete_floating",
      "heavy_concrete_combined_upper_lower",
      "lightweight_concrete",
      "composite_panel",
      "timber_joist",
      "clt_mass_timber",
      "lightweight_steel"
    ],
    source: "material_property"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "loadBasisKgM2",
    label: "Loaded upper-package mass basis",
    missingBehavior: "needs_input",
    ownerGroup: "upper_delta_lw_package",
    requiredForFamilies: [
      "heavy_concrete_floating",
      "heavy_concrete_combined_upper_lower",
      "lightweight_concrete",
      "composite_panel",
      "timber_joist",
      "clt_mass_timber",
      "lightweight_steel"
    ],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "ceilingOrLowerAssembly",
    label: "Lower treatment / ceiling coupling",
    missingBehavior: "needs_input",
    ownerGroup: "lower_treatment_coupling",
    requiredForFamilies: ["heavy_concrete_combined_upper_lower", "timber_joist", "clt_mass_timber"],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "steelSupportForm",
    label: "Steel support form",
    missingBehavior: "needs_input",
    ownerGroup: "steel_carrier_geometry",
    requiredForFamilies: ["lightweight_steel"],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "steelCarrierDepthMm",
    label: "Steel carrier depth",
    missingBehavior: "needs_input",
    ownerGroup: "steel_carrier_geometry",
    requiredForFamilies: ["lightweight_steel"],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "steelCarrierSpacingMm",
    label: "Steel carrier spacing",
    missingBehavior: "needs_input",
    ownerGroup: "steel_carrier_geometry",
    requiredForFamilies: ["lightweight_steel"],
    source: "floor_role"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "lowerCeilingIsolationSupportForm",
    label: "Steel lower isolation support",
    missingBehavior: "needs_input",
    ownerGroup: "lower_treatment_coupling",
    requiredForFamilies: ["lightweight_steel"],
    source: "floor_role"
  },
  {
    defaultPolicy: "source_required",
    fieldId: "impactFieldContext",
    label: "Field impact context",
    missingBehavior: "unsupported",
    ownerGroup: "field_context_boundary",
    requiredForFamilies: ["field_impact_context"],
    source: "field_context"
  },
  {
    defaultPolicy: "source_required",
    fieldId: "outputBasis",
    label: "ASTM/building basis owner",
    missingBehavior: "unsupported",
    ownerGroup: "astm_or_building_basis_boundary",
    requiredForFamilies: ["astm_impact_rating", "building_impact_prediction"],
    source: "output_basis"
  },
  {
    defaultPolicy: "no_default",
    fieldId: "duplicateOwnershipGuard",
    label: "Floor-role ownership guard",
    missingBehavior: "needs_input",
    ownerGroup: "hostile_topology_guard",
    requiredForFamilies: ["hostile_role_topology", "mixed_support_family"],
    source: "floor_role"
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBBPhysicalOwnerRequirement[];

const COMPLETE_HEAVY_FLOATING_INPUT = {
  ...GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  loadBasisKgM2: 100
} as const satisfies ImpactPredictorInput;

const COMPLETE_HEAVY_COMBINED_INPUT = {
  ...COMPLETE_HEAVY_FLOATING_INPUT,
  impactSystemType: "combined_upper_lower_system",
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 80,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  }
} as const satisfies ImpactPredictorInput;

const COMPLETE_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled"
} as const satisfies ImpactPredictorInput;

const COMPLETE_TIMBER_INPUT = {
  baseSlab: {
    materialClass: "timber_joist_floor",
    thicknessMm: 240
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 25
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 27,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 30
  },
  structuralSupportType: "timber_joists"
} as const satisfies ImpactPredictorInput;

const COMPLETE_CLT_INPUT = {
  baseSlab: {
    densityKgM3: 470,
    materialClass: "clt_panel",
    thicknessMm: 145
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 22
  },
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerTreatment: {
    type: "none"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 40,
    thicknessMm: 20
  },
  structuralSupportType: "mass_timber_clt",
  upperFill: {
    densityKgM3: 500,
    materialClass: "dry_granular_fill",
    thicknessMm: 70
  }
} as const satisfies ImpactPredictorInput;

const COMPLETE_LIGHTWEIGHT_CONCRETE_INPUT = {
  ...COMPLETE_HEAVY_FLOATING_INPUT,
  baseSlab: {
    densityKgM3: 1500,
    materialClass: "lightweight_concrete",
    thicknessMm: 150
  },
  structuralSupportType: "hollow_core"
} as const satisfies ImpactPredictorInput;

const COMPLETE_COMPOSITE_PANEL_INPUT = {
  ...COMPLETE_HEAVY_FLOATING_INPUT,
  baseSlab: {
    densityKgM3: 850,
    materialClass: "composite_panel",
    thicknessMm: 80
  },
  structuralSupportType: "composite_panel"
} as const satisfies ImpactPredictorInput;

const NEXT_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_formula_corridor",
    reason:
      "Gate BB has named the physical owner fields and fail-closed boundaries, so the next highest-ROI work is a bounded formula corridor over those inputs.",
    runtimeMovementAllowedAtGateBB: false,
    score: 1.58,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_error_budget_surface",
    reason:
      "The error-budget surface is still required, but it should follow the bounded formula-corridor design so each term has a runtime owner.",
    runtimeMovementAllowedAtGateBB: false,
    score: 1.22,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_field_building_adapter",
    reason: "Field/building impact adapters stay behind lab source-absent owner coverage.",
    runtimeMovementAllowedAtGateBB: false,
    score: 0.92,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_impact_adapter",
    reason: "ASTM IIC/AIIC needs a separate rating adapter and must not unlock ISO lab formula work.",
    runtimeMovementAllowedAtGateBB: false,
    score: 0.76,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_formula_retune",
    reason: "Retune remains blocked until source-owned holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateBB: false,
    score: 0.39,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    broadSourceCrawl: true,
    id: "broad_source_row_crawl",
    reason: "Broad source crawling can add exact overrides later but still does not define arbitrary source-absent floor behavior.",
    runtimeMovementAllowedAtGateBB: false,
    score: 0.16,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBCNextLaneCandidate[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function outputsIn(
  targetOutputs: readonly RequestedOutputId[],
  outputSet: ReadonlySet<RequestedOutputId>
): RequestedOutputId[] {
  return targetOutputs.filter((output) => outputSet.has(output));
}

function hasMassDefinedLayer(
  layer: NonNullable<ImpactPredictorInput["floorCovering" | "floatingScreed" | "upperFill"]>
): boolean {
  return (
    hasPositiveNumber(layer.thicknessMm) &&
    (hasPositiveNumber(layer.densityKgM3) || hasPositiveNumber("deltaLwDb" in layer ? layer.deltaLwDb : undefined))
  );
}

function hasToppingOrFloatingMass(input: ImpactPredictorInput): boolean {
  if (input.floorCovering?.mode === "delta_lw_catalog") {
    return false;
  }

  return Boolean(
    (input.floatingScreed && hasMassDefinedLayer(input.floatingScreed)) ||
      (input.upperFill && hasMassDefinedLayer(input.upperFill)) ||
      (input.floorCovering && hasMassDefinedLayer(input.floorCovering))
  );
}

function hasExplicitLowerAssembly(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  if (!lower?.type) {
    return false;
  }

  if (lower.type === "none") {
    return input.impactSystemType === "dry_floating_floor" || input.impactSystemType === "bare_floor";
  }

  return Boolean(
    lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function hasCompleteSteelLowerIsolation(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  return Boolean(
    lower?.type &&
      lower.type !== "none" &&
      lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function requestedBasisFrom(input: PersonalUseMvpCoverageSprintGateBBInputContractInput): "astm_rating" | "building_prediction" | "element_lab" | "field_apparent" {
  if (input.requestedBasis) {
    return input.requestedBasis;
  }

  if (outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS).length > 0) {
    return "astm_rating";
  }

  if (outputsIn(input.targetOutputs, BUILDING_IMPACT_OUTPUTS).length > 0 && input.family === "building_impact_prediction") {
    return "building_prediction";
  }

  if (outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS).length > 0) {
    return "field_apparent";
  }

  return "element_lab";
}

function requiredPhysicalInputsForFamily(
  family: PersonalUseMvpCoverageSprintGateBBFamilyId
): readonly AcousticInputFieldId[] {
  switch (family) {
    case "heavy_concrete_bare":
      return ["baseSlabOrFloor"];
    case "heavy_concrete_floating":
      return UPPER_DELTA_LW_PHYSICAL_INPUTS;
    case "heavy_concrete_combined_upper_lower":
      return COMBINED_UPPER_LOWER_PHYSICAL_INPUTS;
    case "lightweight_concrete":
    case "composite_panel":
      return FAMILY_SPECIFIC_PHYSICAL_INPUTS;
    case "lightweight_steel":
      return STEEL_PHYSICAL_INPUTS;
    case "timber_joist":
    case "clt_mass_timber":
      return COMBINED_UPPER_LOWER_PHYSICAL_INPUTS;
    case "hostile_role_topology":
    case "mixed_support_family":
      return ["duplicateOwnershipGuard"];
    default:
      return [];
  }
}

function isUnsupportedBasis(input: PersonalUseMvpCoverageSprintGateBBInputContractInput): boolean {
  const basis = requestedBasisFrom(input);
  return basis !== "element_lab" || outputsIn(input.targetOutputs, LAB_IMPACT_OUTPUTS).length === 0;
}

function buildMissingPhysicalInputs(
  input: PersonalUseMvpCoverageSprintGateBBInputContractInput
): readonly AcousticInputFieldId[] {
  if (input.exactSourceRowAvailable || isUnsupportedBasis(input)) {
    return [];
  }

  if (input.family === "mixed_support_family" || input.family === "hostile_role_topology") {
    return ["duplicateOwnershipGuard"];
  }

  const predictorInput = input.impactPredictorInput;
  const required = requiredPhysicalInputsForFamily(input.family);
  if (!predictorInput) {
    return required;
  }

  const missing: AcousticInputFieldId[] = [];
  if (required.includes("baseSlabOrFloor") && !hasPositiveNumber(predictorInput.baseSlab?.thicknessMm)) {
    missing.push("baseSlabOrFloor");
  }

  if (required.includes("materialClass") && !predictorInput.baseSlab?.materialClass) {
    missing.push("materialClass");
  }

  if (required.includes("toppingOrFloatingLayer") && !hasToppingOrFloatingMass(predictorInput)) {
    missing.push("toppingOrFloatingLayer");
  }

  if (
    required.includes("resilientLayerDynamicStiffnessMNm3") &&
    !hasPositiveNumber(predictorInput.resilientLayer?.dynamicStiffnessMNm3)
  ) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (required.includes("loadBasisKgM2") && !hasPositiveNumber(predictorInput.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (required.includes("ceilingOrLowerAssembly") && !hasExplicitLowerAssembly(predictorInput)) {
    missing.push("ceilingOrLowerAssembly");
  }

  if (required.includes("steelSupportForm") && !predictorInput.supportForm) {
    missing.push("steelSupportForm");
  }

  if (required.includes("steelCarrierDepthMm") && !hasPositiveNumber(predictorInput.baseSlab?.thicknessMm)) {
    missing.push("steelCarrierDepthMm");
  }

  if (required.includes("steelCarrierSpacingMm") && !hasPositiveNumber(predictorInput.carrierSpacingMm)) {
    missing.push("steelCarrierSpacingMm");
  }

  if (required.includes("lowerCeilingIsolationSupportForm") && !hasCompleteSteelLowerIsolation(predictorInput)) {
    missing.push("lowerCeilingIsolationSupportForm");
  }

  return unique(missing);
}

function statusFrom(input: {
  contractInput: PersonalUseMvpCoverageSprintGateBBInputContractInput;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
}): PersonalUseMvpCoverageSprintGateBBStatus {
  if (input.contractInput.exactSourceRowAvailable) {
    return "exact_source_precedence";
  }

  if (isUnsupportedBasis(input.contractInput)) {
    return "unsupported_basis";
  }

  if (input.contractInput.family === "mixed_support_family") {
    return "fail_closed_mixed_family";
  }

  if (input.contractInput.family === "hostile_role_topology" || (input.contractInput.hostileFlags?.length ?? 0) > 0) {
    return "fail_closed_hostile_topology";
  }

  if (
    input.contractInput.publishedFamilyAnchorAllowed &&
    input.missingPhysicalInputs.length > 0 &&
    input.contractInput.family === "heavy_concrete_floating"
  ) {
    return "published_anchor_lnw_only_delta_lw_needs_input";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (input.contractInput.family === "lightweight_concrete" || input.contractInput.family === "composite_panel") {
    return "family_specific_contract_required";
  }

  if (input.contractInput.family === "heavy_concrete_combined_upper_lower") {
    return "ready_for_formula_corridor_gate";
  }

  return "ready_existing_runtime_corridor";
}

function makePrompt(input: {
  detail: string;
  fieldId: AcousticInputFieldId;
  label: string;
  source: DynamicCalculatorPromptSource;
  targetOutputs: readonly RequestedOutputId[];
}): DynamicCalculatorRouteInputPrompt {
  return {
    detail: input.detail,
    fieldId: input.fieldId,
    label: input.label,
    promptId: input.fieldId,
    source: input.source,
    targetOutputs: input.targetOutputs
  };
}

function promptFor(
  fieldId: AcousticInputFieldId,
  targetOutputs: readonly RequestedOutputId[]
): DynamicCalculatorRouteInputPrompt {
  const requirement = PHYSICAL_OWNER_REQUIREMENTS.find((entry) => entry.fieldId === fieldId);

  return makePrompt({
    detail:
      requirement?.missingBehavior === "unsupported"
        ? `Gate BB keeps ${requirement.label} outside the lab source-absent formula contract.`
        : `Gate BB needs ${requirement?.label ?? fieldId} before source-absent floor-impact promotion.`,
    fieldId,
    label: requirement?.label ?? fieldId,
    source: requirement?.source ?? "floor_role",
    targetOutputs
  });
}

function buildInputCompleteness(input: {
  family: PersonalUseMvpCoverageSprintGateBBFamilyId;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  status: PersonalUseMvpCoverageSprintGateBBStatus;
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness | null {
  if (
    input.status === "exact_source_precedence" ||
    input.status === "unsupported_basis" ||
    input.status === "fail_closed_mixed_family" ||
    input.status === "fail_closed_hostile_topology"
  ) {
    return null;
  }

  const lowerFields = input.requiredPhysicalInputs.filter(
    (field) => field === "ceilingOrLowerAssembly" || field === "lowerCeilingIsolationSupportForm"
  );
  const lowerFieldSet = new Set<AcousticInputFieldId>(lowerFields);
  const requiredFields = input.requiredPhysicalInputs.filter((field) => !lowerFieldSet.has(field));

  return AcousticInputCompletenessSchema.parse({
    conditionalFields: lowerFields,
    id: `gate_bb_floor_impact_${input.family}_route_inputs`,
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    requiredFields,
    routeFamily: "floating_floor_impact",
    status: input.missingPhysicalInputs.length > 0 ? "needs_input" : "complete",
    targetOutputs: [...input.targetOutputs]
  });
}

function laneStatusFor(input: {
  contractStatus: PersonalUseMvpCoverageSprintGateBBStatus;
  family: PersonalUseMvpCoverageSprintGateBBFamilyId;
  laneFamilies: readonly PersonalUseMvpCoverageSprintGateBBFamilyId[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
}): PersonalUseMvpCoverageSprintGateBBFormulaLaneStatus {
  if (!input.laneFamilies.includes(input.family)) {
    return "not_applicable";
  }

  switch (input.contractStatus) {
    case "exact_source_precedence":
      return "blocked_by_exact_source_precedence";
    case "unsupported_basis":
      return "blocked_by_basis_boundary";
    case "fail_closed_hostile_topology":
    case "fail_closed_mixed_family":
      return "fail_closed_hostile_topology";
    case "family_specific_contract_required":
      return "family_specific_contract_required";
    case "needs_input":
    case "published_anchor_lnw_only_delta_lw_needs_input":
      return "needs_input";
    case "ready_for_formula_corridor_gate":
      return "ready_for_formula_corridor_gate";
    case "ready_existing_runtime_corridor":
      return "already_owned_runtime_corridor";
  }
}

function buildFormulaLanes(input: {
  family: PersonalUseMvpCoverageSprintGateBBFamilyId;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: PersonalUseMvpCoverageSprintGateBBStatus;
}): readonly PersonalUseMvpCoverageSprintGateBBFormulaLane[] {
  const lane = (
    laneId: PersonalUseMvpCoverageSprintGateBBFormulaLaneId,
    appliesToFamilies: readonly PersonalUseMvpCoverageSprintGateBBFamilyId[],
    requiredPhysicalInputs: readonly AcousticInputFieldId[]
  ): PersonalUseMvpCoverageSprintGateBBFormulaLane => ({
    appliesToFamilies,
    laneId,
    requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
    requiredPhysicalInputs,
    status: laneStatusFor({
      contractStatus: input.status,
      family: input.family,
      laneFamilies: appliesToFamilies,
      missingPhysicalInputs: input.missingPhysicalInputs
    })
  });

  return [
    lane("heavy_concrete_annex_c_upper_delta_lw_existing_corridor", ["heavy_concrete_floating"], UPPER_DELTA_LW_PHYSICAL_INPUTS),
    lane(
      "heavy_concrete_combined_upper_lower_coupled_delta_lw",
      ["heavy_concrete_combined_upper_lower"],
      COMBINED_UPPER_LOWER_PHYSICAL_INPUTS
    ),
    lane("lightweight_concrete_family_specific_delta_lw_contract", ["lightweight_concrete"], FAMILY_SPECIFIC_PHYSICAL_INPUTS),
    lane("composite_panel_dry_floating_interaction_contract", ["composite_panel"], FAMILY_SPECIFIC_PHYSICAL_INPUTS),
    lane("steel_mass_spring_delta_lw_existing_corridor", ["lightweight_steel"], STEEL_PHYSICAL_INPUTS),
    lane("timber_joist_delta_lw_existing_corridor", ["timber_joist"], COMBINED_UPPER_LOWER_PHYSICAL_INPUTS),
    lane("clt_mass_timber_delta_lw_existing_corridor", ["clt_mass_timber"], COMBINED_UPPER_LOWER_PHYSICAL_INPUTS)
  ];
}

function buildCurrentRuntimeSnapshot(
  input: PersonalUseMvpCoverageSprintGateBBInputContractInput
): PersonalUseMvpCoverageSprintGateBBCurrentRuntimeSnapshot | null {
  if (!input.impactPredictorInput && !input.exactSourceRowAvailable) {
    return null;
  }

  const calculation = input.exactSourceRowAvailable
    ? calculateImpactOnly([], {
        officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        targetOutputs: input.targetOutputs
      })
    : calculateImpactOnly([], {
        impactPredictorInput: input.impactPredictorInput ?? undefined,
        targetOutputs: input.targetOutputs
      });

  return {
    basisId: calculation.impact?.basis ?? calculation.lowerBoundImpact?.basis ?? null,
    deltaLwDb: calculation.impact?.DeltaLw ?? null,
    lnWDb: calculation.impact?.LnW ?? null,
    supportedTargetOutputs: calculation.supportedTargetOutputs,
    unsupportedTargetOutputs: calculation.unsupportedTargetOutputs
  };
}

export function buildPersonalUseMvpCoverageSprintGateBBInputContract(
  input: PersonalUseMvpCoverageSprintGateBBInputContractInput
): PersonalUseMvpCoverageSprintGateBBInputContract {
  const missingPhysicalInputs = buildMissingPhysicalInputs(input);
  const status = statusFrom({ contractInput: input, missingPhysicalInputs });
  const requiredPhysicalInputs = requiredPhysicalInputsForFamily(input.family);
  const unsupportedOutputs = unique([
    ...outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS),
    ...outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS),
    ...outputsIn(input.targetOutputs, BUILDING_IMPACT_OUTPUTS)
  ]);

  return {
    basisBoundaries: BASIS_BOUNDARIES,
    currentRuntimeSnapshot: buildCurrentRuntimeSnapshot(input),
    deltaLwInventedFromFieldOrAstm: false,
    exactSourcePrecedencePreserved: true,
    family: input.family,
    formulaCorridorReady: status === "ready_for_formula_corridor_gate",
    formulaLanes: buildFormulaLanes({
      family: input.family,
      missingPhysicalInputs,
      status
    }),
    inputCompleteness: buildInputCompleteness({
      family: input.family,
      missingPhysicalInputs,
      requiredPhysicalInputs,
      status,
      targetOutputs: input.targetOutputs
    }),
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
    missingPhysicalInputs,
    noRuntimeValueMovement: true,
    normalizedPredictorInput: input.impactPredictorInput ?? null,
    physicalOwnerRequirements: PHYSICAL_OWNER_REQUIREMENTS,
    precedenceOrder: PRECEDENCE_ORDER,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
    prompts: missingPhysicalInputs.map((fieldId) => promptFor(fieldId, input.targetOutputs)),
    publishedFamilyAnchorAllowedForLnWOnly: Boolean(
      input.publishedFamilyAnchorAllowed &&
        status === "published_anchor_lnw_only_delta_lw_needs_input"
    ),
    requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
    requiredPhysicalInputs,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
    sourceRowsRequiredForInputContract: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    targetOutputs: input.targetOutputs,
    unsupportedOutputs
  };
}

export function rankPersonalUseMvpCoverageSprintGateBCNextLanes():
  readonly PersonalUseMvpCoverageSprintGateBCNextLaneCandidate[] {
  return NEXT_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBBProbeSnapshot():
  PersonalUseMvpCoverageSprintGateBBProbeSnapshot {
  return {
    astmBoundary: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
      targetOutputs: ["IIC", "AIIC"]
    }),
    exactSourcePrecedence: calculateImpactOnly([], {
      officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      targetOutputs: ["Ln,w", "DeltaLw"]
    }),
    heavyConcreteFormula: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    }),
    missingLoadPublishedAnchor: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    })
  };
}

export function buildPersonalUseMvpCoverageSprintGateBBScenarioPack():
  readonly PersonalUseMvpCoverageSprintGateBBScenarioPackEntry[] {
  const labOutputs = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

  return [
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        exactSourceRowAvailable: true,
        family: "trusted_exact_source",
        targetOutputs: labOutputs
      }),
      description: "Exact same-stack floor impact rows stay first and do not invent missing DeltaLw.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "exact_source_precedence",
      id: "gate_bb_exact_source_precedence_preserved"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "heavy_concrete_floating",
        impactPredictorInput: COMPLETE_HEAVY_FLOATING_INPUT,
        targetOutputs: labOutputs
      }),
      description: "Complete heavy floating-floor input keeps the already-owned Annex-C style runtime corridor.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_existing_runtime_corridor",
      id: "gate_bb_complete_heavy_floating_existing_corridor_owned"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "heavy_concrete_combined_upper_lower",
        impactPredictorInput: COMPLETE_HEAVY_COMBINED_INPUT,
        targetOutputs: labOutputs
      }),
      description:
        "Complete combined upper/lower concrete input is the next bounded source-absent formula-corridor target.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_formula_corridor_gate",
      id: "gate_bb_complete_combined_upper_lower_ready_for_gate_bc"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "heavy_concrete_floating",
        impactPredictorInput: {
          ...COMPLETE_HEAVY_FLOATING_INPUT,
          resilientLayer: {
            thicknessMm: 8
          }
        },
        targetOutputs: labOutputs
      }),
      description: "Missing dynamic stiffness is a needs_input blocker for source-absent DeltaLw.",
      expectedMissingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      expectedStatus: "needs_input",
      id: "gate_bb_missing_dynamic_stiffness_needs_input"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "heavy_concrete_floating",
        impactPredictorInput: GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT,
        publishedFamilyAnchorAllowed: true,
        targetOutputs: labOutputs
      }),
      description:
        "Missing load basis may preserve the current Ln,w published-family anchor, but DeltaLw remains blocked.",
      expectedMissingPhysicalInputs: ["toppingOrFloatingLayer", "loadBasisKgM2"],
      expectedStatus: "published_anchor_lnw_only_delta_lw_needs_input",
      id: "gate_bb_missing_load_basis_published_anchor_lnw_only"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "heavy_concrete_combined_upper_lower",
        impactPredictorInput: {
          ...COMPLETE_HEAVY_COMBINED_INPUT,
          lowerTreatment: undefined
        },
        targetOutputs: labOutputs
      }),
      description: "Combined upper/lower impact formulas cannot silently assume a lower ceiling treatment.",
      expectedMissingPhysicalInputs: ["ceilingOrLowerAssembly"],
      expectedStatus: "needs_input",
      id: "gate_bb_missing_lower_treatment_needs_input"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "lightweight_concrete",
        impactPredictorInput: COMPLETE_LIGHTWEIGHT_CONCRETE_INPUT,
        targetOutputs: labOutputs
      }),
      description: "Lightweight concrete is kept out of heavy concrete formulas until a family-specific corridor owns it.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "family_specific_contract_required",
      id: "gate_bb_lightweight_concrete_not_heavy_formula"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "composite_panel",
        impactPredictorInput: COMPLETE_COMPOSITE_PANEL_INPUT,
        targetOutputs: labOutputs
      }),
      description: "Composite panel dry-floating interaction remains a separate family from concrete, steel, timber, and CLT.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "family_specific_contract_required",
      id: "gate_bb_composite_panel_family_contract_required"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "lightweight_steel",
        impactPredictorInput: {
          ...COMPLETE_STEEL_INPUT,
          carrierSpacingMm: undefined,
          lowerTreatment: {
            ...COMPLETE_STEEL_INPUT.lowerTreatment,
            supportClass: undefined
          }
        },
        targetOutputs: labOutputs
      }),
      description: "Steel floors still name carrier and lower-isolation owner gaps before broad fallback is allowed.",
      expectedMissingPhysicalInputs: ["steelCarrierSpacingMm", "lowerCeilingIsolationSupportForm"],
      expectedStatus: "needs_input",
      id: "gate_bb_steel_missing_carrier_or_lower_inputs_needs_input"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "timber_joist",
        impactPredictorInput: COMPLETE_TIMBER_INPUT,
        targetOutputs: labOutputs
      }),
      description: "Timber joist DeltaLw stays on the existing owned corridor and is not retuned at Gate BB.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_existing_runtime_corridor",
      id: "gate_bb_timber_existing_corridor_preserved"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "clt_mass_timber",
        impactPredictorInput: COMPLETE_CLT_INPUT,
        targetOutputs: labOutputs
      }),
      description: "CLT / mass-timber DeltaLw stays on the existing owned corridor and is not aliased to concrete.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_existing_runtime_corridor",
      id: "gate_bb_clt_existing_corridor_preserved"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "mixed_support_family",
        hostileFlags: ["mixed_support_family"],
        targetOutputs: labOutputs
      }),
      description: "Mixed support families in one floor stack fail closed until one carrier family owns the calculation.",
      expectedMissingPhysicalInputs: ["duplicateOwnershipGuard"],
      expectedStatus: "fail_closed_mixed_family",
      id: "gate_bb_mixed_support_family_fail_closed"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "hostile_role_topology",
        hostileFlags: ["duplicate_role", "split_resilient_layer"],
        targetOutputs: labOutputs
      }),
      description: "Duplicate floor roles and split resilient layers fail closed instead of producing unstable impact values.",
      expectedMissingPhysicalInputs: ["duplicateOwnershipGuard"],
      expectedStatus: "fail_closed_hostile_topology",
      id: "gate_bb_hostile_duplicate_roles_fail_closed"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "astm_impact_rating",
        impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
        targetOutputs: ["IIC", "AIIC"]
      }),
      description: "ASTM IIC/AIIC remains outside the ISO lab input contract.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "unsupported_basis",
      id: "gate_bb_astm_iic_aiic_basis_unsupported"
    },
    {
      contract: buildPersonalUseMvpCoverageSprintGateBBInputContract({
        family: "building_impact_prediction",
        impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
        requestedBasis: "building_prediction",
        targetOutputs: ["L'nT,w", "L'nT,50"]
      }),
      description: "Field/building impact requests remain non-alias boundaries for the lab source-absent contract.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "unsupported_basis",
      id: "gate_bb_field_or_building_basis_non_alias_blocked"
    }
  ];
}

export function summarizePersonalUseMvpCoverageSprintGateBB(): PersonalUseMvpCoverageSprintGateBBSummary {
  const gateBA = summarizePersonalUseMvpCoverageSprintGateBA();
  if (gateBA.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE) {
    throw new Error("Gate BB can only land after Gate BA selects the floor-impact source-absent input contract.");
  }

  const scenarioPack = buildPersonalUseMvpCoverageSprintGateBBScenarioPack();
  const statusCounts = Object.fromEntries(
    [
      "exact_source_precedence",
      "fail_closed_hostile_topology",
      "fail_closed_mixed_family",
      "family_specific_contract_required",
      "needs_input",
      "published_anchor_lnw_only_delta_lw_needs_input",
      "ready_existing_runtime_corridor",
      "ready_for_formula_corridor_gate",
      "unsupported_basis"
    ].map((status) => [
      status,
      scenarioPack.filter((entry) => entry.contract.status === status).length
    ])
  ) as Record<PersonalUseMvpCoverageSprintGateBBStatus, number>;

  return {
    broadSourceCrawlSelected: false,
    gateBASelectedNextAction: gateBA.selectedNextAction,
    gateBASelectedNextFile: gateBA.selectedNextFile,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
    scenarioCount: scenarioPack.length,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
    sourceAbsentFormulaCorridorSelectedBeforeBroadSourceCrawl: true,
    statusCounts
  };
}
