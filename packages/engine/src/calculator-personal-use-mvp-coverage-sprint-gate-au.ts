import type { RequestedOutputId } from "@dynecho/shared";

import type {
  PersonalUseMvpCoverageFailureClass,
  PersonalUseMvpCoverageMetricValuePin,
  PersonalUseMvpCoverageOutputBasis,
  PersonalUseMvpCoveragePosture,
  PersonalUseMvpCoverageRoute,
  PersonalUseMvpCoverageScenarioRow,
  PersonalUseMvpCoverageVisibleSurface
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateAULanes,
  summarizePersonalUseMvpCoverageSprintGateAT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE =
  "gate_au_personal_use_mvp_daily_use_release_handoff_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS =
  "gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION =
  "gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS;

export type PersonalUseMvpCoverageSprintGateAVLaneId =
  | "astm_iic_aiic_adapter_runtime_after_release"
  | "direct_budget_tightening_without_holdouts"
  | "opening_leak_building_adapter_runtime_after_release"
  | "post_release_accuracy_and_adapter_roadmap";

export type PersonalUseMvpCoverageSprintGateAVLaneCandidate = {
  id: PersonalUseMvpCoverageSprintGateAVLaneId;
  reason: string;
  releaseBlocker: boolean;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAVLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAVLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAVLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpDailyUseMetricEnvelope = {
  basis: PersonalUseMvpCoverageOutputBasis;
  caveat: string;
  outOfScope: readonly RequestedOutputId[];
  route: PersonalUseMvpCoverageRoute;
  supportedMetrics: readonly RequestedOutputId[];
};

export type PersonalUseMvpDailyUseResidualRisk = {
  id: string;
  releaseBlocker: boolean;
  resolutionLane: PersonalUseMvpCoverageSprintGateAVLaneId;
  summary: string;
};

export type PersonalUseMvpCoverageSprintGateAUReleaseHandoff = {
  acceptedFailClosedBoundaryRowCount: number;
  acceptedFailClosedBoundaryRowIds: readonly string[];
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  companyInternalDailyUseReady: true;
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  dailyUseReleaseBlockerIds: readonly [];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  gateAtLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE;
  gateAtSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION;
  gateAtSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE;
  metricEnvelope: readonly PersonalUseMvpDailyUseMetricEnvelope[];
  noRuntimeValueMovement: true;
  operatingRules: readonly string[];
  postReleaseResidualRisks: readonly PersonalUseMvpDailyUseResidualRisk[];
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_PREVIOUS_SELECTION_STATUS;
  releaseDecision:
    "company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries";
  releaseRequiresBroadSourceCrawl: false;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 41;
  selectedGateAVLane: PersonalUseMvpCoverageSprintGateAVLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS;
  supportedValuePins: readonly PersonalUseMvpCoverageMetricValuePin[];
  supportedValueRowCount: number;
  supportedValueRowIds: readonly string[];
  visibleSurfaceCoverage: readonly PersonalUseMvpCoverageVisibleSurface[];
};

const METRIC_ENVELOPE = [
  {
    basis: "element_lab",
    caveat: "Lab wall outputs remain lab-basis values with explicit source/exact/family-physics origin.",
    outOfScope: ["R'w", "DnT,w"],
    route: "wall",
    supportedMetrics: ["Rw", "STC", "C", "Ctr"]
  },
  {
    basis: "field_apparent",
    caveat: "Airborne field outputs require explicit field_between_rooms geometry and room context.",
    outOfScope: ["Rw", "STC"],
    route: "wall",
    supportedMetrics: ["R'w", "DnT,w"]
  },
  {
    basis: "building_prediction",
    caveat: "Building-prediction outputs are source-absent formula estimates with the Gate AQ +/-9 dB budget.",
    outOfScope: ["Rw", "STC"],
    route: "wall",
    supportedMetrics: ["R'w", "DnT,w"]
  },
  {
    basis: "element_lab",
    caveat: "Floor impact lab outputs require explicit family input contracts; exact rows still win first.",
    outOfScope: ["IIC", "AIIC", "L'nT,50"],
    route: "floor",
    supportedMetrics: ["Ln,w", "DeltaLw", "Rw"]
  },
  {
    basis: "field_apparent",
    caveat: "Floor impact field outputs require owned field context and cannot borrow ASTM/IIC aliases.",
    outOfScope: ["IIC", "AIIC", "L'nT,50"],
    route: "floor",
    supportedMetrics: ["L'n,w", "L'nT,w"]
  }
] as const satisfies readonly PersonalUseMvpDailyUseMetricEnvelope[];

const OPERATING_RULES = [
  "User selects wall or floor before metric selection.",
  "Opened physical fields must be filled; missing owners return needs_input with exact fields.",
  "Exact measured/source rows override only true same-stack matches.",
  "Source-absent results must expose origin, method, tolerance or error budget, and unsupported outputs.",
  "Lab, field, building-prediction, and ASTM rating bases must remain separate.",
  "Hostile many-layer, duplicate, invalid, or unsafe reorder inputs must fail closed instead of returning a confident value.",
  "Post-release calibration or adapter lanes may improve accuracy/coverage but do not block this daily-use release envelope."
] as const;

const POST_RELEASE_RESIDUAL_RISKS = [
  {
    id: "source_absent_formula_budget_tightening",
    releaseBlocker: false,
    resolutionLane: "post_release_accuracy_and_adapter_roadmap",
    summary:
      "Current formula budgets are visible and bounded, but tighter budgets require source-owned holdouts and residual policy gates."
  },
  {
    id: "opening_leak_building_adapter",
    releaseBlocker: false,
    resolutionLane: "opening_leak_building_adapter_runtime_after_release",
    summary:
      "Opening/leak lab Rw/STC is ready, while opening/leak building R'w/DnT,w remains an explicit unsupported basis boundary."
  },
  {
    id: "astm_iic_aiic_adapter",
    releaseBlocker: false,
    resolutionLane: "astm_iic_aiic_adapter_runtime_after_release",
    summary:
      "ASTM IIC/AIIC remains unsupported in the ISO daily-use route until a named adapter owns the rating basis."
  },
  {
    id: "direct_tolerance_movement_without_holdouts",
    releaseBlocker: false,
    resolutionLane: "direct_budget_tightening_without_holdouts",
    summary:
      "Direct retune or tolerance tightening is intentionally blocked without source-owned holdouts and paired negative boundaries."
  }
] as const satisfies readonly PersonalUseMvpDailyUseResidualRisk[];

const VISIBLE_SURFACE_ORDER = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function uniqueOrdered<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function supportedPins(matrix: readonly PersonalUseMvpCoverageScenarioRow[]): PersonalUseMvpCoverageMetricValuePin[] {
  return matrix.flatMap((row) => row.runtime.valuePins.map((pin) => ({
    metric: pin.metric,
    value: round1(pin.value)
  })));
}

function acceptedFailClosedBoundaryRows(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): readonly PersonalUseMvpCoverageScenarioRow[] {
  return matrix.filter((row) => row.failureClass !== "none");
}

export function rankPersonalUseMvpCoverageSprintGateAVLanes(): PersonalUseMvpCoverageSprintGateAVLaneSelection {
  const candidates = [
    {
      id: "post_release_accuracy_and_adapter_roadmap",
      reason:
        "Daily-use release is now ready; the next safest move is a post-release roadmap that ranks accuracy, calibration, and adapter work without moving runtime values prematurely.",
      releaseBlocker: false,
      score: 1.4,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      id: "opening_leak_building_adapter_runtime_after_release",
      reason:
        "Useful coverage expansion, but it needs separate building-basis ownership and should follow the release handoff.",
      releaseBlocker: false,
      score: 0.6,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      id: "astm_iic_aiic_adapter_runtime_after_release",
      reason:
        "Valuable for regional workflows, but it is outside the current ISO daily-use release basis.",
      releaseBlocker: false,
      score: 0.5,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      id: "direct_budget_tightening_without_holdouts",
      reason:
        "Accuracy remains important, but direct tolerance movement without source-owned holdouts is explicitly unsafe.",
      releaseBlocker: false,
      score: 0.1,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly PersonalUseMvpCoverageSprintGateAVLaneCandidate[];
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AU requires a selected Gate AV lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "release only when Gate AT matrix has zero coverage gaps and zero daily-use blockers",
      "treat needs_input and unsupported rows as accepted boundaries when they name the missing basis or field",
      "do not tighten budgets, promote sources, or alias lab/field/building/ASTM metrics during release handoff",
      "route post-release accuracy, calibration, and adapter work through a separate roadmap gate"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateAUReleaseHandoff(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAUReleaseHandoff {
  const gateATSummary = summarizePersonalUseMvpCoverageSprintGateAT(matrix);
  const gateAULaneSelection = rankPersonalUseMvpCoverageSprintGateAULanes();

  if (!gateATSummary.dailyUseAcceptanceMatrixReadyForReleaseHandoff) {
    throw new Error("Gate AU requires Gate AT daily-use release readiness.");
  }

  if (gateAULaneSelection.selectedCandidate.id !== "daily_use_release_handoff") {
    throw new Error("Gate AU can only land after Gate AT selects daily-use release handoff.");
  }

  const releaseBlockerIds = [
    ...gateATSummary.remainingCoverageGapRowIds,
    ...gateATSummary.dailyUseReleaseBlockerIds
  ];

  if (releaseBlockerIds.length > 0) {
    throw new Error(`Gate AU release blockers remain: ${releaseBlockerIds.join(", ")}`);
  }

  const supportedValueRowIds = matrix
    .filter((row) => row.runtime.valuePins.length > 0)
    .map((row) => row.id);
  const acceptedBoundaryRows = acceptedFailClosedBoundaryRows(matrix);
  const gateAVSelection = rankPersonalUseMvpCoverageSprintGateAVLanes();

  return {
    acceptedFailClosedBoundaryRowCount: acceptedBoundaryRows.length,
    acceptedFailClosedBoundaryRowIds: acceptedBoundaryRows.map((row) => row.id),
    basisCoverage: gateATSummary.basisCoverage,
    companyInternalDailyUseReady: true,
    currentPostureCoverage: gateATSummary.currentPostureCoverage,
    dailyUseReleaseBlockerIds: [],
    failureClassCounts: gateATSummary.failureClassCounts,
    gateAtLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE,
    gateAtSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
    gateAtSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_LANDED_GATE,
    metricEnvelope: METRIC_ENVELOPE,
    noRuntimeValueMovement: true,
    operatingRules: OPERATING_RULES,
    postReleaseResidualRisks: POST_RELEASE_RESIDUAL_RISKS,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_PREVIOUS_SELECTION_STATUS,
    releaseDecision:
      "company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries",
    releaseRequiresBroadSourceCrawl: false,
    routeCoverage: gateATSummary.routeCoverage,
    rowCount: gateATSummary.rowCount,
    selectedGateAVLane: gateAVSelection.selectedCandidate.id,
    selectedNextAction: gateAVSelection.selectedNextAction,
    selectedNextFile: gateAVSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_SELECTION_STATUS,
    supportedValuePins: supportedPins(matrix),
    supportedValueRowCount: supportedValueRowIds.length,
    supportedValueRowIds,
    visibleSurfaceCoverage: uniqueOrdered(
      matrix.flatMap((row) => row.visibleSurfaceParityTarget),
      VISIBLE_SURFACE_ORDER
    )
  };
}
