import type { PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
  GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ae";
import { GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD } from "./dynamic-airborne-gate-ae-flat-multicavity";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE =
  "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS =
  "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION =
  "gate_ag_personal_use_mvp_floor_formula_surface_polish_plan";

export const GATE_AF_PROTECTED_GATE_AE_FLAT_MULTICAVITY_PIN = {
  errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
  metrics: GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
  method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD
} as const;

export const GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN = {
  errorBudgetDb: 5,
  metrics: {
    estimatedCDb: 0.8,
    estimatedCtrDb: -7.3,
    estimatedRwDb: 50,
    estimatedStc: 55
  },
  method: "triple_leaf_two_cavity_frequency_solver",
  selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction"
} as const;

export type PersonalUseMvpCoverageSprintGateAGLaneId =
  | "airborne_field_building_basis_expansion"
  | "broad_source_crawl"
  | "floor_formula_surface_polish"
  | "opening_leak_stc_spectrum_adapter";

export type PersonalUseMvpCoverageSprintGateAGLaneCandidate = {
  accuracyLift: number;
  basisLeakageRisk: number;
  blockedOrControlledEvidence: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateAGLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceCrawlDriftRisk: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateAGLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAGLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAGLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAFSummary = {
  blockedRowCount: number;
  blockedRowIds: readonly string[];
  gateAAMatrixRows: 40;
  gapFreeAfterGateAF: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS;
  protectedGateAEFlatMulticavityPin: typeof GATE_AF_PROTECTED_GATE_AE_FLAT_MULTICAVITY_PIN;
  protectedGateGGroupedTripleLeafPin: typeof GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN;
  remainingCoverageGapRowIds: readonly [];
  selectedGateAGLane: PersonalUseMvpCoverageSprintGateAGLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAGLaneCandidate, "score" | "selected">
): number {
  const denominator = candidate.implementationCost + candidate.basisLeakageRisk + candidate.sourceCrawlDriftRisk;

  return Math.round(
    (
      (candidate.userFrequency *
        candidate.accuracyLift *
        candidate.solverReadiness *
        candidate.blockedOrControlledEvidence) /
      denominator
    ) * 10
  ) / 10;
}

export function rankPersonalUseMvpCoverageSprintGateAGLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAGLaneSelection {
  const candidateSeeds = [
    {
      accuracyLift: 3,
      basisLeakageRisk: 2,
      blockedOrControlledEvidence: 3,
      evidenceRowIds: [
        "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
        "floor.lightweight_steel_formula_missing_spacing.needs_input",
        "floor.heavy_concrete_floating_floor_safe_reorder.lab"
      ],
      id: "floor_formula_surface_polish",
      implementationCost: 7,
      reason:
        "Gate AE closed the flat wall solver gap; the highest remaining bounded calculator lift is polishing existing floor formula input surfaces and prompts without changing formula values.",
      solverReadiness: 6,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      accuracyLift: 4,
      basisLeakageRisk: 6,
      blockedOrControlledEvidence: 3,
      evidenceRowIds: [
        "wall.opening_leak_composite.lab",
        "wall.opening_leak_two_openings.lab",
        "wall.opening_leak_stc_only.unsupported"
      ],
      id: "opening_leak_stc_spectrum_adapter",
      implementationCost: 4,
      reason:
        "Opening/leak lab Rw is already useful, but STC still needs its own spectrum/rating adapter before it can promote safely.",
      solverReadiness: 4,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      accuracyLift: 6,
      basisLeakageRisk: 8,
      blockedOrControlledEvidence: 2,
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input"
      ],
      id: "airborne_field_building_basis_expansion",
      implementationCost: 7,
      reason:
        "Field and building outputs remain important, but direct/flanking/junction owners still carry higher basis-leakage risk than floor surface polish.",
      solverReadiness: 3,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      accuracyLift: 2,
      basisLeakageRisk: 6,
      blockedOrControlledEvidence: 1,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab", "wall.clt_mass_timber.lab"],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Broad source crawling stays parked because the active post-Gate-AE work is local calculator coverage and input-surface correctness, not a missing exact row.",
      solverReadiness: 1,
      sourceCrawlDriftRisk: 8,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAGLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate AG lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AF requires a Gate AG lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AF did not mark a selected Gate AG lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "revalidate after a runtime promotion before selecting another runtime or source lane",
      "remove the now-landed flat_multicavity_solver_broadening lane from scoring",
      "prefer bounded calculator coverage and input-surface polish over broad source crawling",
      "keep field/building, ASTM/IIC, and opening STC behind explicit basis owners"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateAF(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAFSummary {
  const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(matrix);
  const selection = rankPersonalUseMvpCoverageSprintGateAGLanes(matrix);
  const blockedRowIds = matrix.filter((row) => row.failureClass !== "none").map((row) => row.id);

  return {
    blockedRowCount: blockedRowIds.length,
    blockedRowIds,
    gateAAMatrixRows: gateAASummary.rowCount,
    gapFreeAfterGateAF: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
    protectedGateAEFlatMulticavityPin: GATE_AF_PROTECTED_GATE_AE_FLAT_MULTICAVITY_PIN,
    protectedGateGGroupedTripleLeafPin: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN,
    remainingCoverageGapRowIds: gateAASummary.remainingCoverageGapRowIds,
    selectedGateAGLane: selection.selectedCandidate.id,
    selectedNextAction: selection.selectedNextAction,
    selectedNextFile: selection.selectedNextFile,
    selectionPolicy: selection.selectionPolicy,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
