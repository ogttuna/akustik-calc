import type { ImpactOnlyCalculation, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE =
  "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS =
  "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION =
  "gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_PREVIOUS_SELECTION_STATUS =
  "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba";

export type PersonalUseMvpCoverageSprintGateBBLaneId =
  | "astm_impact_rating_adapter_contract"
  | "broad_source_row_crawl"
  | "floor_impact_error_budget_surface"
  | "floor_impact_field_building_adapter_contract"
  | "floor_impact_formula_retune_with_holdouts"
  | "floor_impact_source_absent_input_contract";

export type PersonalUseMvpCoverageSprintGateBABasis =
  | "astm_rating_boundary"
  | "building_prediction_boundary"
  | "element_lab"
  | "field_apparent";

export type PersonalUseMvpCoverageSprintGateBAStatus =
  | "adapter_gap"
  | "exact_source_precedence"
  | "field_context_owned"
  | "low_confidence_family_owned"
  | "needs_input_boundary"
  | "published_family_owned"
  | "solver_gap"
  | "source_absent_formula_owned"
  | "unsupported_boundary";

export type PersonalUseMvpCoverageSprintGateBASupportBucket =
  | "blocked"
  | "exact_source_or_anchor"
  | "explicit_boundary"
  | "formula_owned"
  | "low_confidence_fallback"
  | "published_family_anchor";

export type PersonalUseMvpCoverageSprintGateBAFamily =
  | "floor_astm_impact_rating"
  | "floor_building_impact_prediction"
  | "floor_clt_mass_timber"
  | "floor_composite_panel"
  | "floor_field_impact"
  | "floor_heavy_concrete_bare"
  | "floor_heavy_concrete_combined"
  | "floor_heavy_concrete_floating"
  | "floor_hostile_role_topology"
  | "floor_lightweight_concrete"
  | "floor_lightweight_steel"
  | "floor_material_owner_gap"
  | "floor_mixed_support_family"
  | "floor_suspended_ceiling_lower_treatment"
  | "floor_timber_joist"
  | "floor_trusted_exact_source";

export type PersonalUseMvpCoverageSprintGateBACartographyCell = {
  basis: PersonalUseMvpCoverageSprintGateBABasis;
  currentStatus: PersonalUseMvpCoverageSprintGateBAStatus;
  currentSupportBucket: PersonalUseMvpCoverageSprintGateBASupportBucket;
  family: PersonalUseMvpCoverageSprintGateBAFamily;
  gapOwner: PersonalUseMvpCoverageSprintGateBBLaneId | null;
  hostileVariant: string | null;
  id: string;
  layerCombinationClass: string;
  metrics: readonly RequestedOutputId[];
  nextAction: string;
  priority: number;
  whyItMatters: string;
};

export type PersonalUseMvpCoverageSprintGateBBLaneCandidate = {
  accuracyRisk: number;
  broadSourceCrawl: boolean;
  coverageImpact: number;
  id: PersonalUseMvpCoverageSprintGateBBLaneId;
  implementationReadiness: number;
  reason: string;
  runtimeMovementAllowedAtGateBA: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBAProbeSnapshot = {
  astmBoundary: ImpactOnlyCalculation;
  exactSourcePrecedence: ImpactOnlyCalculation;
  fieldContext: ImpactOnlyCalculation;
  heavyConcreteFormula: ImpactOnlyCalculation;
  missingLoadBoundary: ImpactOnlyCalculation;
};

export type PersonalUseMvpCoverageSprintGateBASummary = {
  adapterGapCellIds: readonly string[];
  broadSourceCrawlSelected: false;
  exactSourcePrecedencePreserved: true;
  fieldContextOwnedCellIds: readonly string[];
  gateAZSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION;
  gateAZSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE;
  needsInputBoundaryCellIds: readonly string[];
  noRuntimeValueMovement: true;
  ownedRuntimeCellIds: readonly string[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_PREVIOUS_SELECTION_STATUS;
  selectedGateBBLane: PersonalUseMvpCoverageSprintGateBBLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE;
  selectionCandidates: readonly PersonalUseMvpCoverageSprintGateBBLaneCandidate[];
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS;
  solverGapCellIds: readonly string[];
  sourceAbsentSolverInputsRankedBeforeSourceCrawl: true;
  totalCells: number;
  unsupportedBoundaryCellIds: readonly string[];
};

const FLOOR_LAB_IMPACT_METRICS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_EXTENDED_METRICS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_FIELD_IMPACT_METRICS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_ASTM_IMPACT_METRICS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const FLOOR_BUILDING_IMPACT_METRICS = ["L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const CARTOGRAPHY_CELLS = [
  {
    basis: "element_lab",
    currentStatus: "exact_source_precedence",
    currentSupportBucket: "exact_source_or_anchor",
    family: "floor_trusted_exact_source",
    gapOwner: null,
    hostileVariant: null,
    id: "floor.exact_source_precedence.official_floor_system",
    layerCombinationClass: "Trusted same-stack official/open floor-system row",
    metrics: FLOOR_LAB_EXTENDED_METRICS,
    nextAction: "preserve exact-source precedence before every future floor-impact solver",
    priority: 1,
    whyItMatters: "Measured same-stack rows remain the safest answer when the physical system truly matches."
  },
  {
    basis: "element_lab",
    currentStatus: "source_absent_formula_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_heavy_concrete_bare",
    gapOwner: null,
    hostileVariant: "lightweight_or_nonstructural_base_rejected",
    id: "floor.heavy_concrete_bare.annex_c_formula_owned",
    layerCombinationClass: "Bare reinforced-concrete or hollow-core heavy base",
    metrics: ["Ln,w"],
    nextAction: "keep as baseline formula anchor for floating-floor and field continuations",
    priority: 0.72,
    whyItMatters: "Bare heavy-floor Ln,w is the reference path for many later DeltaLw and field calculations."
  },
  {
    basis: "element_lab",
    currentStatus: "source_absent_formula_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_heavy_concrete_floating",
    gapOwner: "floor_impact_error_budget_surface",
    hostileVariant: "safe_upper_layer_reorder_keeps_same_load_basis",
    id: "floor.heavy_concrete_floating.explicit_dynamic_stiffness_formula_owned",
    layerCombinationClass: "Heavy concrete slab with floating screed, resilient layer, and explicit dynamic stiffness",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should formalize physical owner fields before any wider runtime promotion",
    priority: 0.94,
    whyItMatters: "This is a common consulting case and already computes, but its input/budget ownership needs a first-class contract."
  },
  {
    basis: "element_lab",
    currentStatus: "published_family_owned",
    currentSupportBucket: "published_family_anchor",
    family: "floor_heavy_concrete_floating",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "generic_resilient_layer_without_source_owned_s_prime",
    id: "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned",
    layerCombinationClass: "Heavy concrete floating floor with generic resilient product or omitted dynamic stiffness",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB must decide which owner fields are required versus allowed to fall back to published-family anchors",
    priority: 0.91,
    whyItMatters: "Silent dynamic-stiffness defaults can move Ln,w/DeltaLw materially, so the calculator needs an explicit owner boundary."
  },
  {
    basis: "element_lab",
    currentStatus: "published_family_owned",
    currentSupportBucket: "published_family_anchor",
    family: "floor_heavy_concrete_combined",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "elastic_vs_rigid_ceiling_selection",
    id: "floor.heavy_concrete_combined.upper_lower_family_anchor_owned",
    layerCombinationClass: "Concrete slab with upper floating package plus suspended ceiling",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should separate upper DeltaLw, lower ceiling reduction, and companion airborne owner fields",
    priority: 0.9,
    whyItMatters: "Combined upper/lower packages are frequent and current rows are anchors, not a universal arbitrary-layer solver."
  },
  {
    basis: "element_lab",
    currentStatus: "published_family_owned",
    currentSupportBucket: "published_family_anchor",
    family: "floor_lightweight_concrete",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "lightweight_concrete_kept_off_heavy_specific_formula",
    id: "floor.lightweight_concrete.family_estimate_boundary_owned",
    layerCombinationClass: "Lightweight concrete or non-heavy massive floor package",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should keep this out of heavy-concrete formula terms unless the base-family owner is explicit",
    priority: 0.78,
    whyItMatters: "Using heavy-floor formulas on lightweight bases would create confident but wrong impact predictions."
  },
  {
    basis: "element_lab",
    currentStatus: "published_family_owned",
    currentSupportBucket: "published_family_anchor",
    family: "floor_composite_panel",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "composite_panel_not_reinforced_concrete",
    id: "floor.composite_panel.dry_floating_interaction_owned",
    layerCombinationClass: "Composite panel / dry floating floor interaction",
    metrics: ["Ln,w"],
    nextAction: "Gate BB should keep composite-panel interaction as a separate family from concrete, steel, timber, and CLT",
    priority: 0.7,
    whyItMatters: "Composite panel floors are not well represented by concrete or joist mass-spring shortcuts."
  },
  {
    basis: "element_lab",
    currentStatus: "source_absent_formula_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_lightweight_steel",
    gapOwner: null,
    hostileVariant: "duplicate_steel_carrier_refused",
    id: "floor.lightweight_steel.explicit_formula_corridor_owned",
    layerCombinationClass: "Explicit lightweight steel floor with carrier, load, upper, and lower isolation owners",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "preserve Gate AD/AO formula corridor, source-absent budget, and exact-source precedence",
    priority: 0.86,
    whyItMatters: "Steel floors already have the strongest source-absent impact corridor when all owner inputs are present."
  },
  {
    basis: "element_lab",
    currentStatus: "needs_input_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "floor_lightweight_steel",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "missing_carrier_spacing_or_lower_support",
    id: "floor.lightweight_steel.missing_formula_owners_needs_input_boundary",
    layerCombinationClass: "Steel floor with missing carrier spacing, support form, load, or lower isolation owner",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "keep broad steel-family borrowing blocked until the missing owner fields are explicit",
    priority: 0.83,
    whyItMatters: "Gate AD deliberately blocks generic steel fallback when physical steel owners are incomplete."
  },
  {
    basis: "element_lab",
    currentStatus: "source_absent_formula_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_timber_joist",
    gapOwner: null,
    hostileVariant: "missing_delta_lw_physical_fields_blocks_companion",
    id: "floor.timber_joist.delta_lw_formula_owned",
    layerCombinationClass: "Timber joist floor with explicit dynamic stiffness, load, topping, and lower assembly",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "preserve Gate D/E/F timber DeltaLw corridor and missing-input boundaries",
    priority: 0.8,
    whyItMatters: "Timber joist impact is common and current DeltaLw is source-absent formula evidence, not a measured row."
  },
  {
    basis: "element_lab",
    currentStatus: "source_absent_formula_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_clt_mass_timber",
    gapOwner: null,
    hostileVariant: "field_or_astm_alias_blocked",
    id: "floor.clt_mass_timber.delta_lw_formula_owned",
    layerCombinationClass: "CLT / mass-timber floor with explicit topping and lower support owners",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "preserve mass-timber CLT DeltaLw formula lane and basis separation",
    priority: 0.79,
    whyItMatters: "CLT impact behavior needs a separate mass-timber family branch, not concrete or timber-joist aliases."
  },
  {
    basis: "field_apparent",
    currentStatus: "field_context_owned",
    currentSupportBucket: "formula_owned",
    family: "floor_field_impact",
    gapOwner: null,
    hostileVariant: "missing_k_or_room_volume_needs_input",
    id: "floor.field_impact.explicit_context_owned",
    layerCombinationClass: "Owned lab impact lane with explicit K and receiving-room volume context",
    metrics: FLOOR_FIELD_IMPACT_METRICS,
    nextAction: "preserve L'n,w and L'nT,w context ownership without aliasing lab Ln,w",
    priority: 0.74,
    whyItMatters: "Field impact outputs are different bases and must stay tied to explicit field context."
  },
  {
    basis: "astm_rating_boundary",
    currentStatus: "unsupported_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "floor_astm_impact_rating",
    gapOwner: "astm_impact_rating_adapter_contract",
    hostileVariant: "iic_aiic_requested_from_iso_ln_w",
    id: "floor.astm_iic_aiic.adapter_boundary",
    layerCombinationClass: "ASTM IIC / AIIC requested from ISO impact lane",
    metrics: FLOOR_ASTM_IMPACT_METRICS,
    nextAction: "later ASTM E989 adapter must own ASTM one-third-octave rating basis",
    priority: 0.65,
    whyItMatters: "IIC/AIIC are useful but must never be aliases for ISO Ln,w."
  },
  {
    basis: "building_prediction_boundary",
    currentStatus: "unsupported_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "floor_building_impact_prediction",
    gapOwner: "floor_impact_field_building_adapter_contract",
    hostileVariant: "lab_or_field_value_requested_as_building_prediction",
    id: "floor.building_impact.prediction_adapter_boundary",
    layerCombinationClass: "Impact output requested as building-prediction metric without building path owners",
    metrics: FLOOR_BUILDING_IMPACT_METRICS,
    nextAction: "later building adapter must own flanking, junction, room normalization, and uncertainty terms",
    priority: 0.62,
    whyItMatters: "Building impact predictions cannot reuse lab or simple field continuations as if they were ISO building outputs."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "floor_material_owner_gap",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "missing_dynamic_stiffness_load_basis_or_product_curve",
    id: "floor.material_owner_gap.dynamic_stiffness_load_basis",
    layerCombinationClass: "Resilient layer or floor covering with missing s', product curve, load basis, or tested DeltaLw owner",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should name required owner fields and default policy before broader solver promotion",
    priority: 0.96,
    whyItMatters: "Dynamic stiffness and supported load are dominant impact inputs; unsafe defaults create large dB errors."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "floor_suspended_ceiling_lower_treatment",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "rigid_elastic_spring_hanger_and_board_stack_mix",
    id: "floor.suspended_ceiling.lower_treatment_coupling_gap",
    layerCombinationClass: "Suspended ceiling lower treatment with arbitrary hanger, cavity, fill, and board stack",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should separate lower treatment coupling terms from upper floating-floor DeltaLw terms",
    priority: 0.92,
    whyItMatters: "Lower ceilings can dominate practical floors and current anchors do not cover arbitrary hanger/board combinations."
  },
  {
    basis: "element_lab",
    currentStatus: "solver_gap",
    currentSupportBucket: "blocked",
    family: "floor_mixed_support_family",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "mixed_timber_steel_clt_concrete_supports_in_one_stack",
    id: "floor.mixed_support_family.multi_family_solver_gap",
    layerCombinationClass: "Mixed timber / steel / CLT / concrete support families in one visible floor stack",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should require a single explicit carrier family or fail closed",
    priority: 0.89,
    whyItMatters: "Mixed support-family inference is a high-risk source of unstable or impossible layer-combination answers."
  },
  {
    basis: "element_lab",
    currentStatus: "needs_input_boundary",
    currentSupportBucket: "explicit_boundary",
    family: "floor_hostile_role_topology",
    gapOwner: "floor_impact_source_absent_input_contract",
    hostileVariant: "many_layers_duplicate_roles_split_resilient_layers",
    id: "floor.hostile_role_topology.duplicate_split_needs_input_boundary",
    layerCombinationClass: "Many-layer floor stack with duplicate base/resilient roles, split impact layers, or unsafe reorder",
    metrics: FLOOR_LAB_IMPACT_METRICS,
    nextAction: "Gate BB should keep role ownership and safe/unsafe reorder rules explicit",
    priority: 0.88,
    whyItMatters: "Hostile layer edits must prompt for ownership instead of producing high-confidence but unstable numbers."
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBACartographyCell[];

const SELECTION_CANDIDATES = [
  {
    accuracyRisk: 0.93,
    broadSourceCrawl: false,
    coverageImpact: 0.9,
    id: "floor_impact_source_absent_input_contract",
    implementationReadiness: 0.82,
    reason:
      "Floor-impact gaps are now concentrated around physical owner fields: dynamic stiffness, load, carrier family, lower treatment, and hostile topology.",
    runtimeMovementAllowedAtGateBA: false,
    score: 1.64,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.82,
    broadSourceCrawl: false,
    coverageImpact: 0.72,
    id: "floor_impact_error_budget_surface",
    implementationReadiness: 0.7,
    reason:
      "Heavy concrete formula values need visible budget ownership, but the input contract must come first so the budget has named owner fields.",
    runtimeMovementAllowedAtGateBA: false,
    score: 1.27,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.72,
    broadSourceCrawl: false,
    coverageImpact: 0.63,
    id: "floor_impact_field_building_adapter_contract",
    implementationReadiness: 0.52,
    reason: "Field/building impact adapters matter, but lab source-absent owner fields should be stabilized first.",
    runtimeMovementAllowedAtGateBA: false,
    score: 1.01,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.66,
    broadSourceCrawl: false,
    coverageImpact: 0.56,
    id: "astm_impact_rating_adapter_contract",
    implementationReadiness: 0.48,
    reason: "ASTM IIC/AIIC is an adapter problem and stays behind ISO floor-impact owner coverage.",
    runtimeMovementAllowedAtGateBA: false,
    score: 0.84,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    accuracyRisk: 0.55,
    broadSourceCrawl: false,
    coverageImpact: 0.42,
    id: "floor_impact_formula_retune_with_holdouts",
    implementationReadiness: 0.25,
    reason: "Retune is blocked until same-family source-owned holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateBA: false,
    score: 0.43,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    accuracyRisk: 0.39,
    broadSourceCrawl: true,
    coverageImpact: 0.3,
    id: "broad_source_row_crawl",
    implementationReadiness: 0.2,
    reason: "Broad source crawling can add exact overrides later but does not solve arbitrary layer-combination prediction.",
    runtimeMovementAllowedAtGateBA: false,
    score: 0.18,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBBLaneCandidate[];

export const GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "heavy_concrete",
    thicknessMm: 150
  },
  floatingScreed: {
    densityKgM3: 2000,
    materialClass: "generic_screed",
    thicknessMm: 30
  },
  floorCovering: {
    densityKgM3: 2000,
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 8
  },
  impactSystemType: "heavy_floating_floor",
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 8
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

export const GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT = {
  baseSlab: {
    densityKgM3: 2400,
    materialClass: "heavy_concrete",
    thicknessMm: 150
  },
  impactSystemType: "heavy_floating_floor",
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 8
  },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

const cellIdsByStatus = (status: PersonalUseMvpCoverageSprintGateBAStatus): readonly string[] =>
  CARTOGRAPHY_CELLS
    .filter((cell) => cell.currentStatus === status)
    .map((cell) => cell.id);

const ownedRuntimeStatuses = new Set<PersonalUseMvpCoverageSprintGateBAStatus>([
  "exact_source_precedence",
  "field_context_owned",
  "low_confidence_family_owned",
  "published_family_owned",
  "source_absent_formula_owned"
]);

export function buildPersonalUseMvpCoverageSprintGateBACartography():
  readonly PersonalUseMvpCoverageSprintGateBACartographyCell[] {
  return CARTOGRAPHY_CELLS;
}

export function rankPersonalUseMvpCoverageSprintGateBBLanes():
  readonly PersonalUseMvpCoverageSprintGateBBLaneCandidate[] {
  return SELECTION_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBAProbeSnapshot():
  PersonalUseMvpCoverageSprintGateBAProbeSnapshot {
  return {
    astmBoundary: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
      targetOutputs: FLOOR_ASTM_IMPACT_METRICS
    }),
    exactSourcePrecedence: calculateImpactOnly([], {
      officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      targetOutputs: FLOOR_LAB_IMPACT_METRICS
    }),
    fieldContext: calculateImpactOnly([], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"] satisfies readonly RequestedOutputId[]
    }),
    heavyConcreteFormula: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
      targetOutputs: FLOOR_LAB_IMPACT_METRICS
    }),
    missingLoadBoundary: calculateImpactOnly([], {
      impactPredictorInput: GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT,
      targetOutputs: FLOOR_LAB_IMPACT_METRICS
    })
  };
}

export function summarizePersonalUseMvpCoverageSprintGateBA(): PersonalUseMvpCoverageSprintGateBASummary {
  const gateAZ = buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract();
  const selectedCandidate = SELECTION_CANDIDATES.find((candidate) => candidate.selected);

  if (gateAZ.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE) {
    throw new Error("Gate BA can only land after Gate AZ selects floor-impact source-absent cartography.");
  }

  if (!selectedCandidate) {
    throw new Error("Gate BA requires one selected Gate BB lane.");
  }

  return {
    adapterGapCellIds: cellIdsByStatus("adapter_gap"),
    broadSourceCrawlSelected: false,
    exactSourcePrecedencePreserved: true,
    fieldContextOwnedCellIds: cellIdsByStatus("field_context_owned"),
    gateAZSelectedNextAction: gateAZ.selectedNextAction,
    gateAZSelectedNextFile: gateAZ.selectedNextFile,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_LANDED_GATE,
    needsInputBoundaryCellIds: cellIdsByStatus("needs_input_boundary"),
    noRuntimeValueMovement: true,
    ownedRuntimeCellIds: CARTOGRAPHY_CELLS
      .filter((cell) => ownedRuntimeStatuses.has(cell.currentStatus))
      .map((cell) => cell.id),
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_PREVIOUS_SELECTION_STATUS,
    selectedGateBBLane: selectedCandidate.id,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTED_NEXT_FILE,
    selectionCandidates: SELECTION_CANDIDATES,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_SELECTION_STATUS,
    solverGapCellIds: cellIdsByStatus("solver_gap"),
    sourceAbsentSolverInputsRankedBeforeSourceCrawl: true,
    totalCells: CARTOGRAPHY_CELLS.length,
    unsupportedBoundaryCellIds: cellIdsByStatus("unsupported_boundary")
  };
}
