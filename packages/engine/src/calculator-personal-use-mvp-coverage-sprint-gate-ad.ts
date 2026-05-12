import type { PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS } from "./calculator-personal-use-mvp-coverage-sprint-gate-ac";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE =
  "gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS =
  "gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION =
  "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan";

export type PersonalUseMvpCoverageSprintGateAELaneId =
  | "airborne_field_building_basis_expansion"
  | "broad_source_crawl"
  | "flat_multicavity_solver_broadening"
  | "floor_formula_surface_polish"
  | "opening_leak_stc_spectrum_adapter";

export type PersonalUseMvpCoverageSprintGateAELaneCandidate = {
  accuracyLift: number;
  basisLeakageRisk: number;
  blockedOrControlledEvidence: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateAELaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceCrawlDriftRisk: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateAELaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAELaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAELaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateADSummary = {
  blockedRowCount: number;
  blockedRowIds: readonly string[];
  broadRevalidationChecklist: readonly string[];
  controlledUseRowIds: readonly string[];
  gateAAMatrixRows: 40;
  gapFreeAfterGateAD: true;
  internalPilotStatus: "controlled_internal_pilot_ready_with_gate_ae_solver_broadening_next";
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE;
  noRuntimeValueMovement: true;
  numericSupportedRowCount: number;
  pilotReadyRowIds: readonly string[];
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS;
  remainingCoverageGapRowIds: readonly [];
  selectedGateAELane: PersonalUseMvpCoverageSprintGateAELaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS;
};

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAELaneCandidate, "score" | "selected">
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

export function rankPersonalUseMvpCoverageSprintGateAELanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAELaneSelection {
  const candidateSeeds = [
    {
      accuracyLift: 8,
      basisLeakageRisk: 1,
      blockedOrControlledEvidence: 4,
      evidenceRowIds: [
        "wall.flat_list_multicavity_ambiguity.needs_input",
        "wall.flat_multicavity_many_layer_schedule.needs_input",
        "wall.double_leaf_split_board_layers.lab",
        "wall.grouped_triple_leaf_safe_reverse_order.lab"
      ],
      id: "flat_multicavity_solver_broadening",
      implementationCost: 5,
      reason:
        "Gate AC made grouped flat/many-layer topology visible, but complete source-absent flat multicavity stacks still fall back to broad screening; the next ROI is a named solver corridor for that owned topology.",
      solverReadiness: 7,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 8
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
        "Field and building outputs need more room/flanking/junction ownership before they can promote without lab-to-field leakage.",
      solverReadiness: 3,
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
        "wall.opening_leak_stc_target.lab"
      ],
      id: "opening_leak_stc_spectrum_adapter",
      implementationCost: 4,
      reason:
        "Opening/leak lab Rw is useful, but STC needs a separate spectrum/rating adapter and is lower ROI than the now-visible multicavity wall solver gap.",
      solverReadiness: 4,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
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
      implementationCost: 5,
      reason:
        "Floor prompts and formula surfaces remain important, but the current matrix shows no urgent floor correctness blocker ahead of the flat wall solver gap.",
      solverReadiness: 6,
      sourceCrawlDriftRisk: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      accuracyLift: 2,
      basisLeakageRisk: 6,
      blockedOrControlledEvidence: 1,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab", "wall.clt_mass_timber.lab"],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Broad source crawling stays parked because Gate AD found an algorithmic source-absent solver gap with owned inputs already available.",
      solverReadiness: 1,
      sourceCrawlDriftRisk: 8,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAELaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate AE lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AD requires a Gate AE lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AD did not mark a selected Gate AE lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "run broad revalidation before new runtime promotion",
      "prefer algorithmic source-absent solver coverage when explicit physical inputs already exist",
      "do not select broad source crawling while the active blocker is a named family solver gap",
      "keep field/building, ASTM/IIC, and opening STC behind explicit basis owners"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateAD(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateADSummary {
  const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(matrix);
  const selection = rankPersonalUseMvpCoverageSprintGateAELanes(matrix);
  const blockedRowIds = matrix
    .filter((row) => row.failureClass !== "none")
    .map((row) => row.id);
  const numericSupportedRows = matrix.filter((row) => row.failureClass === "none" && row.runtime.valuePins.length > 0);
  const controlledUseRowIds = numericSupportedRows
    .filter((row) =>
      row.runtime.origin === "screening_fallback" ||
      row.runtime.unsupportedTargetOutputs.length > 0 ||
      (row.runtime.errorBudgetDb ?? 0) >= 8
    )
    .map((row) => row.id);
  const controlledUseSet = new Set(controlledUseRowIds);
  const pilotReadyRowIds = numericSupportedRows
    .filter((row) => !controlledUseSet.has(row.id))
    .map((row) => row.id);

  return {
    blockedRowCount: blockedRowIds.length,
    blockedRowIds,
    broadRevalidationChecklist: [
      "focused_gate_ad_engine_contract",
      "gate_aa_ab_ac_ad_engine_continuity",
      "gate_ac_web_surface_parity_continuity",
      "engine_typecheck",
      "web_typecheck",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ],
    controlledUseRowIds,
    gateAAMatrixRows: gateAASummary.rowCount,
    gapFreeAfterGateAD: true,
    internalPilotStatus: "controlled_internal_pilot_ready_with_gate_ae_solver_broadening_next",
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_LANDED_GATE,
    noRuntimeValueMovement: true,
    numericSupportedRowCount: numericSupportedRows.length,
    pilotReadyRowIds,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
    remainingCoverageGapRowIds: [],
    selectedGateAELane: selection.selectedCandidate.id,
    selectedNextAction: selection.selectedNextAction,
    selectedNextFile: selection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS
  };
}
