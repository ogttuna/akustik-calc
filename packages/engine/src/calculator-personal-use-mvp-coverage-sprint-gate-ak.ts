import type {
  PersonalUseMvpCoverageFailureClass,
  PersonalUseMvpCoverageOutputBasis,
  PersonalUseMvpCoveragePosture,
  PersonalUseMvpCoverageRoute,
  PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE =
  "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS =
  "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION =
  "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_PREVIOUS_SELECTION_STATUS =
  "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak";

export type PersonalUseMvpCoverageSprintGateALLaneId =
  | "airborne_building_prediction_owner_gap_refresh"
  | "astm_iic_aiic_rating_adapter_boundary"
  | "broad_source_crawl"
  | "opening_leak_field_or_building_adapter_boundary";

export type PersonalUseMvpCoverageSprintGateALLaneCandidate = {
  basisLeakageRisk: number;
  blockedOrUnsupportedEvidence: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateALLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateALLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateALLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateALLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAKSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  gapFreeAfterGateAK: true;
  matrixRowsAddedAtGateAK: 0;
  numericRuntimeValueMovement: false;
  openingLeakStcAwareRowIds: readonly string[];
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_PREVIOUS_SELECTION_STATUS;
  remainingCoverageGapRowIds: readonly [];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 40;
  selectedGateALLane: PersonalUseMvpCoverageSprintGateALLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE;
  stcAwareMatrixRefresh: true;
};

const OPENING_LEAK_STC_AWARE_ROW_IDS = [
  "wall.opening_leak_composite.lab",
  "wall.opening_leak_two_openings.lab",
  "wall.opening_leak_stc_target.lab",
  "wall.opening_leak_duplicate_id.refused"
] as const;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateALLaneCandidate, "score" | "selected">
): number {
  return round1(
    (candidate.userFrequency * candidate.blockedOrUnsupportedEvidence * candidate.solverReadiness) /
      (candidate.implementationCost + candidate.basisLeakageRisk + 1)
  );
}

export function buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
}

export function rankPersonalUseMvpCoverageSprintGateALLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix()
): PersonalUseMvpCoverageSprintGateALLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 8,
      blockedOrUnsupportedEvidence: 3,
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      id: "airborne_building_prediction_owner_gap_refresh",
      implementationCost: 6,
      reason:
        "Gate AK leaves building prediction parked, but the refreshed matrix now shows the direct/flanking/junction/normalization owner gap is the highest-value remaining calculator blocker.",
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 7
    },
    {
      basisLeakageRisk: 7,
      blockedOrUnsupportedEvidence: 2,
      evidenceRowIds: [
        "wall.opening_leak_composite.lab",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      id: "opening_leak_field_or_building_adapter_boundary",
      implementationCost: 5,
      reason:
        "Opening/leak field or building adapters must wait until building and field owners are explicit; the current lab Rw/STC corridor remains intentionally narrow.",
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 6,
      blockedOrUnsupportedEvidence: 1,
      evidenceRowIds: ["floor.astm_iic_aiic_boundary.unsupported"],
      id: "astm_iic_aiic_rating_adapter_boundary",
      implementationCost: 4,
      reason:
        "ASTM IIC/AIIC support still matters, but it is a rating-basis boundary and lower ROI than resolving building prediction owner gaps.",
      solverReadiness: 4,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      blockedOrUnsupportedEvidence: 1,
      evidenceRowIds: [
        "wall.aac_nonhomogeneous_masonry.lab",
        "wall.clt_mass_timber.lab",
        "wall.opening_leak_stc_target.lab"
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Broad source crawling remains blocked because the active calculator gap is building-route ownership, not missing source rows.",
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateALLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((entry) => entry.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Gate AL lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AK requires a Gate AL lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AK did not mark a selected Gate AL lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "treat Gate AK as a no-runtime STC-aware matrix refresh after opening/leak Rw and STC landed",
      "score user_frequency * blocked_or_unsupported_evidence * solver_readiness / (implementation_cost + basis_leakage_risk + 1)",
      "prefer calculator-first owner gaps over broad source crawling",
      "do not promote building, field, or ASTM outputs from lab opening/leak or ISO impact values"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateAK(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAKSummary {
  const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(matrix);
  const remainingCoverageGapRowIds = matrix
    .filter((entry) => entry.failureClass === "coverage_gap")
    .map((entry) => entry.id);

  if (remainingCoverageGapRowIds.length > 0) {
    throw new Error(`Gate AK expected a gap-free matrix refresh, found: ${remainingCoverageGapRowIds.join(", ")}`);
  }

  const rowIds = new Set(matrix.map((entry) => entry.id));
  const missingOpeningRows = OPENING_LEAK_STC_AWARE_ROW_IDS.filter((id) => !rowIds.has(id));

  if (missingOpeningRows.length > 0) {
    throw new Error(`Gate AK missing STC-aware opening/leak rows: ${missingOpeningRows.join(", ")}`);
  }

  const laneSelection = rankPersonalUseMvpCoverageSprintGateALLanes(matrix);

  return {
    basisCoverage: gateAASummary.basisCoverage,
    correctlyBlockedRowIds: gateAASummary.correctlyBlockedRowIds,
    currentPostureCoverage: gateAASummary.currentPostureCoverage,
    failureClassCounts: gateAASummary.failureClassCounts,
    gapFreeAfterGateAK: true,
    matrixRowsAddedAtGateAK: 0,
    numericRuntimeValueMovement: false,
    openingLeakStcAwareRowIds: OPENING_LEAK_STC_AWARE_ROW_IDS,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_PREVIOUS_SELECTION_STATUS,
    remainingCoverageGapRowIds: [],
    routeCoverage: gateAASummary.routeCoverage,
    rowCount: 40,
    selectedGateALLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    stcAwareMatrixRefresh: true
  };
}
