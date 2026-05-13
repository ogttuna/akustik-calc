import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBBProbeSnapshot,
  buildPersonalUseMvpCoverageSprintGateBBScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBBInputContract,
  type PersonalUseMvpCoverageSprintGateBBScenarioId,
  type PersonalUseMvpCoverageSprintGateBBScenarioPackEntry,
  type PersonalUseMvpCoverageSprintGateBBStatus
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bb";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE =
  "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS =
  "gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION =
  "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS =
  "gate_bc_heavy_concrete_combined_upper_lower_coupled_delta_lw_formula_corridor";

export type PersonalUseMvpCoverageSprintGateBCFormulaTermId =
  | "bare_heavy_reference_ln_w"
  | "coupled_system_uncertainty_budget"
  | "lower_ceiling_coupling_delta_lw"
  | "upper_floating_delta_lw_mass_spring"
  | "upper_lower_coupling_penalty"
  | "upper_resonance_frequency_check";

export type PersonalUseMvpCoverageSprintGateBCErrorBudgetTermId =
  | "combined_system_holdout_absence"
  | "dynamic_stiffness_precision"
  | "heavy_reference_floor_family_spread"
  | "load_basis_precision"
  | "lower_assembly_coupling_simplification"
  | "upper_lower_interaction_simplification";

export type PersonalUseMvpCoverageSprintGateBCCorridorStatus =
  | "blocked_basis_alias"
  | "blocked_exact_source_precedence"
  | "blocked_family_specific_contract"
  | "blocked_missing_input"
  | "existing_runtime_corridor_preserved"
  | "fail_closed_hostile_topology"
  | "formula_corridor_defined_runtime_gate_required";

export type PersonalUseMvpCoverageSprintGateBCFormulaTerm = {
  readonly formulaRole:
    | "basis_boundary"
    | "coupling_correction"
    | "lower_improvement"
    | "quality_gate"
    | "reference_floor"
    | "upper_improvement";
  readonly inputFields: readonly AcousticInputFieldId[];
  readonly ownerStatus: "defined_for_gate_bd_runtime_contract";
  readonly runtimeOwnedInGateBC: false;
  readonly termId: PersonalUseMvpCoverageSprintGateBCFormulaTermId;
};

export type PersonalUseMvpCoverageSprintGateBCErrorBudgetTerm = {
  readonly basis: "source_absent_formula_design_budget";
  readonly db: number;
  readonly termId: PersonalUseMvpCoverageSprintGateBCErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBCErrorBudget = {
  readonly metricId: "DeltaLw" | "Ln,w";
  readonly notMeasuredEvidence: true;
  readonly terms: readonly PersonalUseMvpCoverageSprintGateBCErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type PersonalUseMvpCoverageSprintGateBCCandidate = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS;
  readonly corridorStatus: PersonalUseMvpCoverageSprintGateBCCorridorStatus;
  readonly deltaLwRuntimeEstimateDb: null;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaLaneId: "heavy_concrete_combined_upper_lower_coupled_delta_lw";
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly PersonalUseMvpCoverageSprintGateBCFormulaTerm[];
  readonly gateBBScenarioId: "gate_bb_complete_combined_upper_lower_ready_for_gate_bc";
  readonly inputContractStatus: PersonalUseMvpCoverageSprintGateBBStatus;
  readonly lnWRuntimeEstimateDb: null;
  readonly proposedDeltaLwEnvelopeDb: {
    readonly max: number;
    readonly min: number;
  };
  readonly proposedLnWEnvelopeDb: {
    readonly max: number;
    readonly min: number;
  };
  readonly requiredFormulaOwners: readonly string[];
  readonly requiredPhysicalInputs: readonly AcousticInputFieldId[];
  readonly runtimePromotionAllowedInGateBC: false;
  readonly supportBucketLabel: "heavy concrete combined upper/lower impact formula corridor design";
  readonly toleranceBudgets: readonly PersonalUseMvpCoverageSprintGateBCErrorBudget[];
  readonly upperOnlyRuntimeAnchor: {
    readonly basisId: string | null;
    readonly deltaLwDb: number | null;
    readonly lnWDb: number | null;
    readonly source: "gate_bb_current_upper_only_runtime_snapshot_not_combined_lower_metric_owner";
  };
};

export type PersonalUseMvpCoverageSprintGateBCNegativeBoundary = {
  readonly deltaLwRuntimeEstimateDb: null;
  readonly gateBBScenarioId: PersonalUseMvpCoverageSprintGateBBScenarioId;
  readonly lnWRuntimeEstimateDb: null;
  readonly missingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly reason: string;
  readonly status: Exclude<
    PersonalUseMvpCoverageSprintGateBCCorridorStatus,
    "formula_corridor_defined_runtime_gate_required"
  >;
  readonly targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBCRuntimeFrozenSnapshot = {
  readonly astmSupportedOutputs: readonly RequestedOutputId[];
  readonly exactSourceDeltaLwDb: null;
  readonly exactSourceLnWDb: number | null;
  readonly heavyFloatingDeltaLwDb: number | null;
  readonly heavyFloatingLnWDb: number | null;
  readonly missingLoadDeltaLwDb: null;
  readonly missingLoadLnWDb: number | null;
};

export type PersonalUseMvpCoverageSprintGateBDNextLaneId =
  | "astm_impact_rating_adapter"
  | "broad_floor_source_row_crawl"
  | "floor_impact_budget_surface_parity"
  | "floor_impact_field_building_adapter"
  | "floor_impact_source_absent_runtime_corridor"
  | "floor_impact_source_absent_formula_retune"
  | "workbench_floor_impact_input_surface";

export type PersonalUseMvpCoverageSprintGateBDNextLaneCandidate = {
  readonly broadSourceCrawl: boolean;
  readonly id: PersonalUseMvpCoverageSprintGateBDNextLaneId;
  readonly reason: string;
  readonly runtimeMovementAllowedAtGateBC: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBCFormulaCorridorContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldLPrime: true;
    readonly labLnWOnlyFromPublishedAnchor: true;
  };
  readonly candidateFormulaCorridor: PersonalUseMvpCoverageSprintGateBCCandidate;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly gateBDRuntimePromotionEntryCriteria: readonly string[];
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE;
  readonly negativeBoundaries: readonly PersonalUseMvpCoverageSprintGateBCNegativeBoundary[];
  readonly previousGateBB: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS;
  };
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE;
  readonly runtimeFrozenSnapshot: PersonalUseMvpCoverageSprintGateBCRuntimeFrozenSnapshot;
  readonly runtimePromotionAllowedInGateBC: false;
  readonly runtimeValueMovement: false;
  readonly selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bc_floor_impact_source_absent_formula_corridor";
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateBCSummary = {
  readonly candidateStatus: PersonalUseMvpCoverageSprintGateBCCorridorStatus;
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE;
  readonly negativeBoundaryCount: number;
  readonly noRuntimeValueMovement: true;
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE;
  readonly previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS;
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS;
  readonly sourceAbsentRuntimeCorridorSelectedBeforeBroadSourceCrawl: true;
};

const FORMULA_TERMS = [
  {
    formulaRole: "reference_floor",
    inputFields: ["baseSlabOrFloor"],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "bare_heavy_reference_ln_w"
  },
  {
    formulaRole: "upper_improvement",
    inputFields: [
      "toppingOrFloatingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2"
    ],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "upper_floating_delta_lw_mass_spring"
  },
  {
    formulaRole: "quality_gate",
    inputFields: ["resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "upper_resonance_frequency_check"
  },
  {
    formulaRole: "lower_improvement",
    inputFields: ["ceilingOrLowerAssembly"],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "lower_ceiling_coupling_delta_lw"
  },
  {
    formulaRole: "coupling_correction",
    inputFields: [
      "toppingOrFloatingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ceilingOrLowerAssembly"
    ],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "upper_lower_coupling_penalty"
  },
  {
    formulaRole: "basis_boundary",
    inputFields: ["baseSlabOrFloor", "ceilingOrLowerAssembly"],
    ownerStatus: "defined_for_gate_bd_runtime_contract",
    runtimeOwnedInGateBC: false,
    termId: "coupled_system_uncertainty_budget"
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBCFormulaTerm[];

const FORMULA_STATEMENT = [
  "DeltaLw_total = DeltaLw_upper(m'load, s') + DeltaLw_lower(lower assembly) - couplingPenalty(upper, lower)",
  "Ln,w = Ln,w_bare_heavy_reference - DeltaLw_total",
  "Gate BC defines the terms and error budget only; Gate BD must own runtime calculation and surface parity before values can promote."
] as const;

const LN_W_BUDGET = {
  metricId: "Ln,w",
  notMeasuredEvidence: true,
  terms: [
    {
      basis: "source_absent_formula_design_budget",
      db: 1.3,
      termId: "heavy_reference_floor_family_spread",
      tightenRequires: ["same_stack_bare_heavy_reference_lnw_rows"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 2.1,
      termId: "lower_assembly_coupling_simplification",
      tightenRequires: ["source_owned_lower_ceiling_coupling_holdouts"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.4,
      termId: "upper_lower_interaction_simplification",
      tightenRequires: ["combined_upper_lower_same_stack_holdouts"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1,
      termId: "dynamic_stiffness_precision",
      tightenRequires: ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 0.7,
      termId: "load_basis_precision",
      tightenRequires: ["source_owned_loaded_upper_mass_basis"]
    }
  ],
  totalBudgetDb: 6.5
} as const satisfies PersonalUseMvpCoverageSprintGateBCErrorBudget;

const DELTA_LW_BUDGET = {
  metricId: "DeltaLw",
  notMeasuredEvidence: true,
  terms: [
    {
      basis: "source_absent_formula_design_budget",
      db: 1.6,
      termId: "combined_system_holdout_absence",
      tightenRequires: ["source_owned_combined_upper_lower_iso_delta_lw_holdouts"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.5,
      termId: "lower_assembly_coupling_simplification",
      tightenRequires: ["source_owned_lower_ceiling_coupling_holdouts"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1,
      termId: "upper_lower_interaction_simplification",
      tightenRequires: ["paired_upper_only_and_combined_lower_same_stack_holdouts"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 0.9,
      termId: "dynamic_stiffness_precision",
      tightenRequires: ["frequency_dependent_dynamic_stiffness_or_product_curve_owner"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 0.5,
      termId: "load_basis_precision",
      tightenRequires: ["source_owned_loaded_upper_mass_basis"]
    }
  ],
  totalBudgetDb: 5.5
} as const satisfies PersonalUseMvpCoverageSprintGateBCErrorBudget;

const GATE_BD_RUNTIME_PROMOTION_ENTRY_CRITERIA = [
  "keep_exact_source_rows_above_formula_for_requested_metric",
  "calculate_upper_DeltaLw_from_loaded_mass_dynamic_stiffness_and_resonance_terms",
  "calculate_lower_ceiling_DeltaLw_from_explicit_board_mass_cavity_fill_and_support_class",
  "subtract_a_bounded_upper_lower_coupling_penalty_instead_of_summing_improvements_unchecked",
  "emit_separate_source_absent_error_budgets_for_Ln_w_and_DeltaLw_not_measured_evidence",
  "preserve_heavy_floating_steel_timber_CLT_exact_source_ASTM_field_and_building_boundaries",
  "pin_cards_reports_api_payloads_if_runtime_values_move"
] as const;

const NEXT_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_runtime_corridor",
    reason:
      "Gate BC has defined the bounded combined upper/lower heavy-concrete formula terms and design budgets, so the next highest-ROI step is the runtime corridor over those exact owners.",
    runtimeMovementAllowedAtGateBC: true,
    score: 1.64,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_budget_surface_parity",
    reason:
      "Budget/card/report parity should follow runtime promotion so the visible payload reflects actual values.",
    runtimeMovementAllowedAtGateBC: false,
    score: 1.16,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "workbench_floor_impact_input_surface",
    reason:
      "First-class UI input plumbing is useful only after the runtime corridor owns the combined lower-treatment calculation.",
    runtimeMovementAllowedAtGateBC: false,
    score: 0.98,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_field_building_adapter",
    reason: "Impact field/building adapters remain separate output-basis work and must not borrow the lab corridor.",
    runtimeMovementAllowedAtGateBC: false,
    score: 0.7,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_impact_rating_adapter",
    reason: "ASTM IIC/AIIC requires its own rating adapter and cannot unlock ISO lab DeltaLw runtime.",
    runtimeMovementAllowedAtGateBC: false,
    score: 0.55,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_formula_retune",
    reason: "Retune is blocked until source-owned combined upper/lower holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateBC: false,
    score: 0.31,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    broadSourceCrawl: true,
    id: "broad_floor_source_row_crawl",
    reason:
      "Broad source crawling can add exact overrides later, but it does not define source-absent combined upper/lower behavior.",
    runtimeMovementAllowedAtGateBC: false,
    score: 0.14,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBDNextLaneCandidate[];

function scenarioById(
  pack: readonly PersonalUseMvpCoverageSprintGateBBScenarioPackEntry[],
  id: PersonalUseMvpCoverageSprintGateBBScenarioId
): PersonalUseMvpCoverageSprintGateBBInputContract {
  const scenario = pack.find((entry) => entry.id === id);

  if (!scenario) {
    throw new Error(`Missing Gate BB scenario ${id}`);
  }

  return scenario.contract;
}

function candidateStatusFrom(
  contract: PersonalUseMvpCoverageSprintGateBBInputContract
): PersonalUseMvpCoverageSprintGateBCCorridorStatus {
  return contract.formulaCorridorReady
    ? "formula_corridor_defined_runtime_gate_required"
    : "blocked_missing_input";
}

function boundaryStatusFrom(
  contract: PersonalUseMvpCoverageSprintGateBBInputContract
): PersonalUseMvpCoverageSprintGateBCNegativeBoundary["status"] {
  switch (contract.status) {
    case "exact_source_precedence":
      return "blocked_exact_source_precedence";
    case "unsupported_basis":
      return "blocked_basis_alias";
    case "fail_closed_hostile_topology":
    case "fail_closed_mixed_family":
      return "fail_closed_hostile_topology";
    case "family_specific_contract_required":
      return "blocked_family_specific_contract";
    case "ready_existing_runtime_corridor":
      return "existing_runtime_corridor_preserved";
    case "needs_input":
    case "published_anchor_lnw_only_delta_lw_needs_input":
    case "ready_for_formula_corridor_gate":
      return "blocked_missing_input";
  }
}

function boundaryReasonFrom(
  contract: PersonalUseMvpCoverageSprintGateBBInputContract
): string {
  switch (contract.status) {
    case "exact_source_precedence":
      return "Exact same-stack source rows remain above the source-absent formula corridor.";
    case "unsupported_basis":
      return "Field, building, and ASTM impact metrics need separate adapters and cannot be lab aliases.";
    case "fail_closed_hostile_topology":
    case "fail_closed_mixed_family":
      return "Duplicate, split, unsafe reorder, or mixed support ownership fails closed before formula work.";
    case "family_specific_contract_required":
      return "Lightweight concrete and composite panels need family-specific corridors before promotion.";
    case "ready_existing_runtime_corridor":
      return "Existing heavy-floating, steel, timber, and CLT corridors stay owned and are not redefined by Gate BC.";
    case "needs_input":
      return "Gate BB physical owner fields must be complete before the combined formula can promote.";
    case "published_anchor_lnw_only_delta_lw_needs_input":
      return "Published-family Ln,w anchors cannot invent DeltaLw without dynamic stiffness, load, and lower-treatment owners.";
    case "ready_for_formula_corridor_gate":
      return "This is the positive Gate BC target and is not used as a negative boundary.";
  }
}

function buildBoundary(
  pack: readonly PersonalUseMvpCoverageSprintGateBBScenarioPackEntry[],
  id: PersonalUseMvpCoverageSprintGateBBScenarioId
): PersonalUseMvpCoverageSprintGateBCNegativeBoundary {
  const contract = scenarioById(pack, id);

  return {
    deltaLwRuntimeEstimateDb: null,
    gateBBScenarioId: id,
    lnWRuntimeEstimateDb: null,
    missingPhysicalInputs: contract.missingPhysicalInputs,
    reason: boundaryReasonFrom(contract),
    status: boundaryStatusFrom(contract),
    targetOutputs: contract.targetOutputs
  };
}

function buildRuntimeFrozenSnapshot(): PersonalUseMvpCoverageSprintGateBCRuntimeFrozenSnapshot {
  const probes = buildPersonalUseMvpCoverageSprintGateBBProbeSnapshot();

  return {
    astmSupportedOutputs: probes.astmBoundary.supportedImpactOutputs,
    exactSourceDeltaLwDb: null,
    exactSourceLnWDb: probes.exactSourcePrecedence.impact?.LnW ?? null,
    heavyFloatingDeltaLwDb: probes.heavyConcreteFormula.impact?.DeltaLw ?? null,
    heavyFloatingLnWDb: probes.heavyConcreteFormula.impact?.LnW ?? null,
    missingLoadDeltaLwDb: null,
    missingLoadLnWDb: probes.missingLoadPublishedAnchor.impact?.LnW ?? null
  };
}

function buildCandidate(
  gateBBContract: PersonalUseMvpCoverageSprintGateBBInputContract
): PersonalUseMvpCoverageSprintGateBCCandidate {
  const runtimeSnapshot = buildRuntimeFrozenSnapshot();

  return {
    affectedFormulaOutputs: ["Ln,w", "DeltaLw"],
    basisId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
    corridorStatus: candidateStatusFrom(gateBBContract),
    deltaLwRuntimeEstimateDb: null,
    exactMeasuredRowsRemainPrecedence: true,
    formulaLaneId: "heavy_concrete_combined_upper_lower_coupled_delta_lw",
    formulaStatement: FORMULA_STATEMENT,
    formulaTerms: FORMULA_TERMS,
    gateBBScenarioId: "gate_bb_complete_combined_upper_lower_ready_for_gate_bc",
    inputContractStatus: gateBBContract.status,
    lnWRuntimeEstimateDb: null,
    proposedDeltaLwEnvelopeDb: { max: 38, min: 26 },
    proposedLnWEnvelopeDb: { max: 50, min: 41 },
    requiredFormulaOwners: gateBBContract.requiredFormulaOwners,
    requiredPhysicalInputs: gateBBContract.requiredPhysicalInputs,
    runtimePromotionAllowedInGateBC: false,
    supportBucketLabel: "heavy concrete combined upper/lower impact formula corridor design",
    toleranceBudgets: [LN_W_BUDGET, DELTA_LW_BUDGET],
    upperOnlyRuntimeAnchor: {
      basisId: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      deltaLwDb: runtimeSnapshot.heavyFloatingDeltaLwDb,
      lnWDb: runtimeSnapshot.heavyFloatingLnWDb,
      source: "gate_bb_current_upper_only_runtime_snapshot_not_combined_lower_metric_owner"
    }
  };
}

export function rankPersonalUseMvpCoverageSprintGateBDNextLanes():
  readonly PersonalUseMvpCoverageSprintGateBDNextLaneCandidate[] {
  return NEXT_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract():
  PersonalUseMvpCoverageSprintGateBCFormulaCorridorContract {
  const gateBBPack = buildPersonalUseMvpCoverageSprintGateBBScenarioPack();
  const positive = scenarioById(gateBBPack, "gate_bb_complete_combined_upper_lower_ready_for_gate_bc");

  return {
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldLPrime: true,
      labLnWOnlyFromPublishedAnchor: true
    },
    candidateFormulaCorridor: buildCandidate(positive),
    exactMeasuredRowsRemainPrecedence: true,
    gateBDRuntimePromotionEntryCriteria: GATE_BD_RUNTIME_PROMOTION_ENTRY_CRITERIA,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
    negativeBoundaries: [
      buildBoundary(gateBBPack, "gate_bb_missing_dynamic_stiffness_needs_input"),
      buildBoundary(gateBBPack, "gate_bb_missing_load_basis_published_anchor_lnw_only"),
      buildBoundary(gateBBPack, "gate_bb_missing_lower_treatment_needs_input"),
      buildBoundary(gateBBPack, "gate_bb_lightweight_concrete_not_heavy_formula"),
      buildBoundary(gateBBPack, "gate_bb_composite_panel_family_contract_required"),
      buildBoundary(gateBBPack, "gate_bb_mixed_support_family_fail_closed"),
      buildBoundary(gateBBPack, "gate_bb_hostile_duplicate_roles_fail_closed"),
      buildBoundary(gateBBPack, "gate_bb_exact_source_precedence_preserved"),
      buildBoundary(gateBBPack, "gate_bb_complete_heavy_floating_existing_corridor_owned"),
      buildBoundary(gateBBPack, "gate_bb_astm_iic_aiic_basis_unsupported"),
      buildBoundary(gateBBPack, "gate_bb_field_or_building_basis_non_alias_blocked")
    ],
    previousGateBB: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS
    },
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
    runtimeFrozenSnapshot: buildRuntimeFrozenSnapshot(),
    runtimePromotionAllowedInGateBC: false,
    runtimeValueMovement: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bc_floor_impact_source_absent_formula_corridor",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function summarizePersonalUseMvpCoverageSprintGateBC(): PersonalUseMvpCoverageSprintGateBCSummary {
  const contract = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();
  const nextLanes = rankPersonalUseMvpCoverageSprintGateBDNextLanes();
  const selected = nextLanes.find((candidate) => candidate.selected);

  if (
    selected?.id !== "floor_impact_source_absent_runtime_corridor" ||
    nextLanes.at(-1)?.broadSourceCrawl !== true
  ) {
    throw new Error("Gate BC next-lane ranking drifted from the selected Gate BD runtime corridor.");
  }

  return {
    candidateStatus: contract.candidateFormulaCorridor.corridorStatus,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
    negativeBoundaryCount: contract.negativeBoundaries.length,
    noRuntimeValueMovement: true,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_SELECTION_STATUS,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS,
    sourceAbsentRuntimeCorridorSelectedBeforeBroadSourceCrawl: true
  };
}
