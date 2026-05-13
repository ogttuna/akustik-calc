import {
  buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-au";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE =
  "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS =
  "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION =
  "gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_PREVIOUS_SELECTION_STATUS =
  "gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av";

export type PersonalUseMvpCoverageSprintGateAWLaneId =
  | "astm_iic_aiic_adapter_runtime_after_cartography"
  | "broad_source_row_crawl"
  | "calibration_budget_tightening_with_holdouts"
  | "floor_impact_source_absent_solver_cartography"
  | "opening_leak_building_adapter_runtime_after_cartography"
  | "source_absent_solver_gap_cartography"
  | "wall_multicavity_direct_curve_contract";

export type PersonalUseMvpCoverageSprintGateAWLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateAWLaneId;
  reason: string;
  runtimeMovementAllowedAtGateAV: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAVPostReleaseStep = {
  action: string;
  gate: "AW" | "AX" | "AY" | "AZ" | "later";
  order: number;
  runtimeMovementAllowed: boolean;
  summary: string;
};

export type PersonalUseMvpCoverageSprintGateAVReferenceAnchor = {
  id:
    | "acoulatis"
    | "astm_e413"
    | "astm_e989"
    | "herrick_double_panel_review"
    | "insul"
    | "iso_12354_1"
    | "iso_12354_2"
    | "iso_717_1"
    | "iso_717_2"
    | "sonarchitect";
  role: string;
  url: string;
};

export type PersonalUseMvpCoverageSprintGateAVRisk = {
  id:
    | "arbitrary_n_layer_wall_source_absent_solver_gap"
    | "astm_impact_rating_adapter_gap"
    | "budget_tightening_without_holdouts"
    | "floor_impact_mixed_mass_spring_gap"
    | "material_property_default_contract_gap"
    | "opening_leak_field_building_adapter_gap"
    | "one_number_wall_estimate_without_direct_curve";
  blocksDailyUseRelease: false;
  resolutionLane: PersonalUseMvpCoverageSprintGateAWLaneId;
  severity: number;
  summary: string;
};

export type PersonalUseMvpCoverageSprintGateAVSurfaceInventory = {
  basisSeparationRequired: true;
  id:
    | "airborne_building_prediction_runtime"
    | "astm_impact_boundary"
    | "exact_source_precedence"
    | "floor_field_context"
    | "floor_impact_lab_formula_corridors"
    | "opening_leak_lab_rw_stc"
    | "wall_field_context"
    | "wall_lab_family_physics";
  state: "boundary_only" | "runtime_owned";
  summary: string;
};

export type PersonalUseMvpCoverageSprintGateAVRoadmap = {
  acceptedBoundaryRowCount: number;
  companyInternalDailyUseReady: true;
  exactSourcePrecedencePreserved: true;
  externalReferenceAnchors: readonly PersonalUseMvpCoverageSprintGateAVReferenceAnchor[];
  gateAUSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION;
  gateAUSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE;
  noRuntimeValueMovement: true;
  postGateAVOrder: readonly PersonalUseMvpCoverageSprintGateAVPostReleaseStep[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_PREVIOUS_SELECTION_STATUS;
  releaseRequiresBroadSourceCrawl: false;
  riskRegister: readonly PersonalUseMvpCoverageSprintGateAVRisk[];
  roadmapRules: readonly string[];
  selectedGateAWLane: PersonalUseMvpCoverageSprintGateAWLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE;
  selectionCandidates: readonly PersonalUseMvpCoverageSprintGateAWLaneCandidate[];
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS;
  sourceAbsentSolverGapsRankedBeforeSourceCrawl: true;
  supportedValueRowCount: number;
  surfaceInventory: readonly PersonalUseMvpCoverageSprintGateAVSurfaceInventory[];
};

const ROADMAP_RULES = [
  "Exact measured/source rows win only when route, topology, metric, and basis truly match.",
  "Source-absent assemblies should calculate from the best owned family solver when physical inputs are complete.",
  "Missing physical owners must return needs_input with exact fields.",
  "Lab, field, building-prediction, ISO, and ASTM bases must remain separate.",
  "Broad source-row crawling is lower priority than mapping and closing source-absent solver gaps.",
  "Runtime promotion resumes only after a later formula-corridor gate owns inputs, method, budget, boundaries, and visible parity."
] as const;

const SURFACE_INVENTORY = [
  {
    basisSeparationRequired: true,
    id: "exact_source_precedence",
    state: "runtime_owned",
    summary: "Exact/source rows remain first only for true same-stack and same-basis matches."
  },
  {
    basisSeparationRequired: true,
    id: "wall_lab_family_physics",
    state: "runtime_owned",
    summary:
      "Wall lab lanes include massive, AAC, CLT, lined massive, grouped multicavity/triple-leaf, and opening/leak element-lab routes."
  },
  {
    basisSeparationRequired: true,
    id: "wall_field_context",
    state: "runtime_owned",
    summary: "Owned airborne field/apparent routes require explicit field_between_rooms room and geometry inputs."
  },
  {
    basisSeparationRequired: true,
    id: "airborne_building_prediction_runtime",
    state: "runtime_owned",
    summary: "Building prediction is owned through the ISO 12354-1 corridor with explicit budget and non-aliasing."
  },
  {
    basisSeparationRequired: true,
    id: "opening_leak_lab_rw_stc",
    state: "runtime_owned",
    summary: "Opening/leak element-lab Rw and STC are owned; field/building opening adapters are still later work."
  },
  {
    basisSeparationRequired: true,
    id: "floor_impact_lab_formula_corridors",
    state: "runtime_owned",
    summary: "Steel, timber joist, and CLT/mass-timber impact lab corridors are owned when physical inputs are complete."
  },
  {
    basisSeparationRequired: true,
    id: "floor_field_context",
    state: "runtime_owned",
    summary: "Floor field impact routes keep L'n,w and L'nT,w basis separation and explicit context requirements."
  },
  {
    basisSeparationRequired: true,
    id: "astm_impact_boundary",
    state: "boundary_only",
    summary: "IIC and AIIC remain unsupported until an ASTM E989 adapter owns the rating basis."
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAVSurfaceInventory[];

const RISK_REGISTER = [
  {
    blocksDailyUseRelease: false,
    id: "arbitrary_n_layer_wall_source_absent_solver_gap",
    resolutionLane: "source_absent_solver_gap_cartography",
    severity: 0.95,
    summary:
      "Hostile N-layer wall packages can mix panels, cavities, studs, resilient couplings, linings, and openings beyond a single current family delegate."
  },
  {
    blocksDailyUseRelease: false,
    id: "one_number_wall_estimate_without_direct_curve",
    resolutionLane: "wall_multicavity_direct_curve_contract",
    severity: 0.86,
    summary:
      "Some wall paths still rely on one-number family estimates where a frequency-band direct curve would make adapters and uncertainty stronger."
  },
  {
    blocksDailyUseRelease: false,
    id: "floor_impact_mixed_mass_spring_gap",
    resolutionLane: "floor_impact_source_absent_solver_cartography",
    severity: 0.82,
    summary:
      "Concrete slabs, floating screeds, resilient underlays, suspended ceilings, and mixed support packages need a broader impact solver map."
  },
  {
    blocksDailyUseRelease: false,
    id: "opening_leak_field_building_adapter_gap",
    resolutionLane: "opening_leak_building_adapter_runtime_after_cartography",
    severity: 0.68,
    summary:
      "Opening/leak lab Rw and STC are owned, but field/building opening adapters need separate direct-curve and flanking ownership."
  },
  {
    blocksDailyUseRelease: false,
    id: "astm_impact_rating_adapter_gap",
    resolutionLane: "astm_iic_aiic_adapter_runtime_after_cartography",
    severity: 0.64,
    summary:
      "ASTM impact ratings remain unsupported until a named adapter consumes ASTM-basis impact curves or source-owned ASTM data."
  },
  {
    blocksDailyUseRelease: false,
    id: "material_property_default_contract_gap",
    resolutionLane: "source_absent_solver_gap_cartography",
    severity: 0.62,
    summary:
      "Future solver work needs a global map of which density, stiffness, loss, and dynamic-stiffness values can default and which must block."
  },
  {
    blocksDailyUseRelease: false,
    id: "budget_tightening_without_holdouts",
    resolutionLane: "calibration_budget_tightening_with_holdouts",
    severity: 0.45,
    summary:
      "Budget tightening remains intentionally blocked until source-owned holdouts, paired negatives, and residual thresholds exist."
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAVRisk[];

const SELECTION_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "source_absent_solver_gap_cartography",
    reason:
      "Best next move: map source-absent wall and floor solver gaps before selecting a new runtime formula corridor.",
    runtimeMovementAllowedAtGateAV: false,
    score: 1.6,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "wall_multicavity_direct_curve_contract",
    reason:
      "Likely high ROI, but it should follow cartography so the input contract is selected from the full gap map.",
    runtimeMovementAllowedAtGateAV: false,
    score: 1,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_solver_cartography",
    reason:
      "Important for concrete/floating/resilient floor packages, but wall/floor gap ranking should be made in one shared cartography pass first.",
    runtimeMovementAllowedAtGateAV: false,
    score: 0.9,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "opening_leak_building_adapter_runtime_after_cartography",
    reason: "Useful adapter expansion, but it needs direct-curve, flanking, room, and uncertainty ownership.",
    runtimeMovementAllowedAtGateAV: false,
    score: 0.62,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_adapter_runtime_after_cartography",
    reason: "Useful regional output, but it remains a basis-specific adapter and not an ISO impact alias.",
    runtimeMovementAllowedAtGateAV: false,
    score: 0.58,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "calibration_budget_tightening_with_holdouts",
    reason:
      "Accuracy budget tightening is valuable only after source-owned holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateAV: false,
    score: 0.42,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    broadSourceCrawl: true,
    id: "broad_source_row_crawl",
    reason:
      "Broad source crawling can improve exact overrides later, but it does not solve unbounded layer combinations.",
    runtimeMovementAllowedAtGateAV: false,
    score: 0.12,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAWLaneCandidate[];

const POST_GATE_AV_ORDER = [
  {
    action: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
    gate: "AW",
    order: 1,
    runtimeMovementAllowed: false,
    summary: "Build executable source-absent solver gap cartography across realistic wall and floor layer packages."
  },
  {
    action: "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan",
    gate: "AX",
    order: 2,
    runtimeMovementAllowed: false,
    summary: "Select the advanced wall multi-panel / multi-cavity direct-curve input contract from the Gate AW map."
  },
  {
    action: "gate_ay_personal_use_mvp_selected_wall_solver_runtime_corridor_plan",
    gate: "AY",
    order: 3,
    runtimeMovementAllowed: true,
    summary: "Promote one narrow wall runtime corridor only after its route, inputs, basis, budget, and negatives are owned."
  },
  {
    action: "gate_az_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan",
    gate: "AZ",
    order: 4,
    runtimeMovementAllowed: false,
    summary: "Map concrete, floating screed, resilient underlay, suspended ceiling, and mixed support impact gaps."
  },
  {
    action: "later_floor_impact_runtime_corridor_or_adapter_plan",
    gate: "later",
    order: 5,
    runtimeMovementAllowed: true,
    summary: "Promote the highest-ROI floor impact solver selected by Gate AZ, with ISO/ASTM and lab/field bases separated."
  },
  {
    action: "later_basis_adapter_and_calibration_plan",
    gate: "later",
    order: 6,
    runtimeMovementAllowed: false,
    summary:
      "Handle opening/leak field/building adapters, ASTM impact adapters, and budget tightening only through owned later gates."
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAVPostReleaseStep[];

const EXTERNAL_REFERENCE_ANCHORS = [
  {
    id: "iso_12354_1",
    role: "Airborne building-prediction calculation must remain a direct/indirect flanking, frequency-band, basis-owned route.",
    url: "https://www.iso.org/standard/70242.html"
  },
  {
    id: "iso_12354_2",
    role: "Impact building-prediction calculation must remain a direct/indirect flanking, frequency-band, basis-owned route.",
    url: "https://www.iso.org/standard/70243.html"
  },
  {
    id: "iso_717_1",
    role: "Airborne single-number and spectrum-adapter outputs must derive from the correct ISO 717-1 basis.",
    url: "https://www.iso.org/standard/77435.html"
  },
  {
    id: "iso_717_2",
    role: "Impact single-number and floor-covering reduction outputs must derive from the correct ISO 717-2 basis.",
    url: "https://www.iso.org/standard/69867.html"
  },
  {
    id: "astm_e413",
    role: "STC and related airborne ASTM ratings need their own ASTM-basis adapter rather than an Rw alias.",
    url: "https://store.astm.org/e0413-10.html"
  },
  {
    id: "astm_e989",
    role: "IIC and AIIC need their own ASTM impact adapter rather than an Ln,w alias.",
    url: "https://store.astm.org/e0989-21.html"
  },
  {
    id: "insul",
    role: "Public capability shape supports third-octave, multilayer, frame/coupling, impact, and composite solver coverage.",
    url: "https://www.k5-akustik.de/en/software/insul/"
  },
  {
    id: "acoulatis",
    role: "Public capability shape supports element-level third-octave prediction across timber, steel, CLT, masonry, concrete, and floors.",
    url: "https://www.sonusoft.com/acoulatis"
  },
  {
    id: "sonarchitect",
    role: "Public capability shape supports ISO 12354 building calculation by separator, flank, and transmission path.",
    url: "https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit"
  },
  {
    id: "herrick_double_panel_review",
    role: "Double-panel and multi-cavity wall work should use impedance/transfer/cavity reasoning, not a single shortcut formula.",
    url: "https://docs.lib.purdue.edu/herrick/210/"
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAVReferenceAnchor[];

export function rankPersonalUseMvpCoverageSprintGateAWLanes():
  readonly PersonalUseMvpCoverageSprintGateAWLaneCandidate[] {
  return SELECTION_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateAVRoadmap(): PersonalUseMvpCoverageSprintGateAVRoadmap {
  const gateAU = buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff();
  const selectedCandidate = SELECTION_CANDIDATES.find((candidate) => candidate.selected);

  if (gateAU.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE) {
    throw new Error("Gate AV can only land after Gate AU selects the post-release accuracy roadmap.");
  }

  if (!gateAU.companyInternalDailyUseReady) {
    throw new Error("Gate AV requires the Gate AU daily-use release handoff to be ready.");
  }

  if (!selectedCandidate) {
    throw new Error("Gate AV requires one selected Gate AW lane.");
  }

  return {
    acceptedBoundaryRowCount: gateAU.acceptedFailClosedBoundaryRowCount,
    companyInternalDailyUseReady: gateAU.companyInternalDailyUseReady,
    exactSourcePrecedencePreserved: true,
    externalReferenceAnchors: EXTERNAL_REFERENCE_ANCHORS,
    gateAUSelectedNextAction: gateAU.selectedNextAction,
    gateAUSelectedNextFile: gateAU.selectedNextFile,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_LANDED_GATE,
    noRuntimeValueMovement: true,
    postGateAVOrder: POST_GATE_AV_ORDER,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_PREVIOUS_SELECTION_STATUS,
    releaseRequiresBroadSourceCrawl: false,
    riskRegister: RISK_REGISTER,
    roadmapRules: ROADMAP_RULES,
    selectedGateAWLane: selectedCandidate.id,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTED_NEXT_FILE,
    selectionCandidates: SELECTION_CANDIDATES,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_SELECTION_STATUS,
    sourceAbsentSolverGapsRankedBeforeSourceCrawl: true,
    supportedValueRowCount: gateAU.supportedValueRowCount,
    surfaceInventory: SURFACE_INVENTORY
  };
}
