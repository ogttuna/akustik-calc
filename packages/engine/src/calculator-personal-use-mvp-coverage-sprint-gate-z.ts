import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageOutputBasis,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageRoute,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateYScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-y";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_LANDED_GATE =
  "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS =
  "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION =
  "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan";

export type PersonalUseMvpCoverageSprintGateAALaneId =
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_rating_adapter"
  | "broad_source_crawl"
  | "flat_multicavity_topology_input_surface"
  | "opening_leak_field_or_stc_adapter"
  | "scenario_matrix_v2_realistic_combination_expansion";

export type PersonalUseMvpCoverageSprintGateAALaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateAALaneId;
  implementationCost: number;
  readiness: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAALaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAALaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAALaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateZSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  gapFreeAfterGatesXAndY: true;
  numericRuntimeValueMovement: false;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS;
  remainingCoverageGapRowIds: readonly [];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 28;
  selectedGateAALane: PersonalUseMvpCoverageSprintGateAALaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE;
};

const POSTURE_COVERAGE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const FAILURE_CLASS_ORDER = [
  "none",
  "correct_block",
  "hostile_input_refusal",
  "unsupported_metric",
  "basis_boundary",
  "coverage_gap"
] as const satisfies readonly PersonalUseMvpCoverageFailureClass[];

const BASIS_ORDER = [
  "element_lab",
  "field_apparent",
  "astm_rating_boundary",
  "building_prediction"
] as const satisfies readonly PersonalUseMvpCoverageOutputBasis[];

const ROUTE_ORDER = ["wall", "floor"] as const satisfies readonly PersonalUseMvpCoverageRoute[];

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function scoreLane(input: {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  implementationCost: number;
  readiness: number;
}): number {
  return Math.round(
    ((input.calculatorCoverageGain * input.readiness) / (input.implementationCost + input.basisLeakageRisk)) * 10
  ) / 10;
}

function failureClassCounts(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  return FAILURE_CLASS_ORDER.reduce((accumulator, failureClass) => {
    accumulator[failureClass] = matrix.filter((row) => row.failureClass === failureClass).length;
    return accumulator;
  }, {} as Record<PersonalUseMvpCoverageFailureClass, number>);
}

export function buildPersonalUseMvpCoverageSprintGateZScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return buildPersonalUseMvpCoverageSprintGateYScenarioMatrix();
}

export function rankPersonalUseMvpCoverageSprintGateAALanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateZScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAALaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 1,
      calculatorCoverageGain: 8,
      evidenceRowIds: [
        "wall.single_leaf_heavy_concrete_masonry.lab",
        "wall.flat_list_multicavity_ambiguity.needs_input",
        "wall.opening_leak_composite.lab",
        "floor.lightweight_steel_complete_formula.lab"
      ],
      id: "scenario_matrix_v2_realistic_combination_expansion",
      implementationCost: 3,
      readiness: 5,
      reason:
        "The 28-row MVP matrix has no remaining coverage_gap rows; the highest ROI is expanding representative realistic combinations before promoting another narrow adapter.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 7,
      calculatorCoverageGain: 5,
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      id: "airborne_building_prediction_runtime_terms",
      implementationCost: 6,
      readiness: 1,
      reason:
        "Gate P already proved complete building-prediction requests must stay parked until executable path-by-path flanking and junction terms exist.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 5,
      calculatorCoverageGain: 4,
      evidenceRowIds: ["wall.opening_leak_composite.lab", "wall.opening_leak_composite_building_boundary.unsupported"],
      id: "opening_leak_field_or_stc_adapter",
      implementationCost: 5,
      readiness: 2,
      reason:
        "Opening/leak lab Rw is live, but STC and field/building adapters need separate spectrum and context owners before runtime promotion.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 4,
      calculatorCoverageGain: 4,
      evidenceRowIds: ["wall.flat_list_multicavity_ambiguity.needs_input"],
      id: "flat_multicavity_topology_input_surface",
      implementationCost: 5,
      readiness: 2,
      reason:
        "Flat multi-cavity stacks correctly need explicit grouping today; improving the input surface is useful after a broader matrix confirms the most common topology shapes.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 5,
      calculatorCoverageGain: 3,
      evidenceRowIds: ["floor.astm_iic_aiic_boundary.unsupported"],
      id: "astm_iic_aiic_rating_adapter",
      implementationCost: 4,
      readiness: 2,
      reason:
        "ASTM IIC/AIIC support is user-visible but must not alias ISO Ln,w; it stays behind broader ISO-route coverage expansion.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab", "wall.clt_mass_timber.lab"],
      id: "broad_source_crawl",
      implementationCost: 8,
      readiness: 1,
      reason:
        "Broad source crawling is not selected because all current algorithmic coverage gaps are closed and source rows should be anchors/holdouts, not the product.",
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAALaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate AA lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Personal-use MVP Coverage Sprint Gate Z requires a Gate AA lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate Z did not mark a selected Gate AA lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "do not select broad source crawling when current algorithmic coverage_gap rows are closed",
      "score calculator_coverage_gain * readiness / (implementation_cost + basis_leakage_risk)",
      "when the MVP matrix is gap-free, expand realistic combinations before promoting high-leakage adapters",
      "keep building-prediction, ASTM, and opening field/STC adapters parked until their basis owners are executable"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateZ(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateZScenarioMatrix()
): PersonalUseMvpCoverageSprintGateZSummary {
  const remainingCoverageGapRowIds = matrix
    .filter((row) => row.failureClass === "coverage_gap")
    .map((row) => row.id);

  if (remainingCoverageGapRowIds.length > 0) {
    throw new Error(`Gate Z expected a gap-free matrix after Gate Y, found: ${remainingCoverageGapRowIds.join(", ")}`);
  }

  const laneSelection = rankPersonalUseMvpCoverageSprintGateAALanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCounts: failureClassCounts(matrix),
    failureClassCoverage: unique(matrix.map((row) => row.failureClass)),
    gapFreeAfterGatesXAndY: true,
    numericRuntimeValueMovement: false,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS,
    remainingCoverageGapRowIds: [],
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 28,
    selectedGateAALane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}
