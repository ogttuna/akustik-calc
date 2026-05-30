import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBACartography,
  rankPersonalUseMvpCoverageSprintGateBBLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import {
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS
} from "./post-v1-floor-tuas-c11c-iso-impact-gate-ay";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_az_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION =
  "post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL =
  "post-V1 floor dynamic stiffness/load basis owner Gate BA" as const;

export type PostV1GateAZCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "floor.material_owner_gap.dynamic_stiffness_load_basis"
  | "floor.mixed_support_family.multi_family_solver_gap"
  | "floor.suspended_ceiling.lower_treatment_coupling_gap";

export type PostV1GateAZSliceKind =
  | "blocked_non_goal"
  | "fail_closed_boundary"
  | "input_owner_contract"
  | "runtime_corridor";

export type PostV1GateAZCandidate = {
  accuracyRisk: number;
  broadSourceCrawl: boolean;
  coverageImpact: number;
  expectedBeforeAfter: readonly string[];
  id: PostV1GateAZCandidateId;
  implementationReadiness: number;
  reason: string;
  selected: boolean;
  sliceKind: PostV1GateAZSliceKind;
  sourceRowsRequiredForSelection: boolean;
  score: number;
};

export type PostV1GateAZImplementationSurface = {
  path: string;
  role: string;
};

export type PostV1GateAZSummary = {
  blockedNonGoalIds: readonly PostV1GateAZCandidateId[];
  broadSourceCrawlSelected: false;
  candidateCount: number;
  currentGapEvidenceIds: readonly string[];
  currentPostV1GateAySelectedNextAction: typeof POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION;
  currentPostV1GateAySelectedNextFile: typeof POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE;
  currentPostV1GateAySelectionStatus: typeof POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS;
  landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousLandedGate: typeof POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE;
  selectedCandidateId: PostV1GateAZCandidateId;
  selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL;
  selectionCandidates: readonly PostV1GateAZCandidate[];
  selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS;
  surfaces: readonly PostV1GateAZImplementationSurface[];
  targetMetricsForSelectedSlice: readonly RequestedOutputId[];
};

const GATE_AZ_SOURCE_ABSENT_GAP_IDS = [
  "floor.material_owner_gap.dynamic_stiffness_load_basis",
  "floor.suspended_ceiling.lower_treatment_coupling_gap",
  "floor.mixed_support_family.multi_family_solver_gap"
] as const;

const TARGET_METRICS_FOR_SELECTED_SLICE = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const IMPLEMENTATION_SURFACES = [
  {
    path: "packages/engine/src/impact-lane.ts",
    role: "current floor-impact route arbitration and runtime merge surface"
  },
  {
    path: "packages/engine/src/dynamic-impact.ts",
    role: "visible impact trace and named basis surface"
  },
  {
    path: "packages/shared/src/domain/impact-predictor-input.ts",
    role: "shared dynamic stiffness, load-basis, and lower-treatment input schema"
  },
  {
    path: "packages/shared/src/domain/input-completeness.ts",
    role: "shared missing physical input completeness policy"
  },
  {
    path: "apps/web/features/workbench/simple-workbench-output-model.ts",
    role: "visible missing-input and supported-output card model"
  },
  {
    path: "apps/web/features/workbench/impact-metric-basis-view.ts",
    role: "visible impact metric basis labels"
  }
] as const satisfies readonly PostV1GateAZImplementationSurface[];

const NON_GOAL_CANDIDATES = [
  {
    accuracyRisk: 0.35,
    broadSourceCrawl: true,
    coverageImpact: 0.22,
    expectedBeforeAfter: [
      "may add finite exact rows later",
      "does not solve source-absent arbitrary layer combinations"
    ],
    id: "broad_source_row_crawl",
    implementationReadiness: 0.2,
    reason: "Source crawling does not improve arbitrary source-absent layer-combination calculation by itself.",
    selected: false,
    sliceKind: "blocked_non_goal",
    sourceRowsRequiredForSelection: true,
    score: 0.12
  },
  {
    accuracyRisk: 0.1,
    broadSourceCrawl: false,
    coverageImpact: 0.05,
    expectedBeforeAfter: [
      "does not add supported metrics",
      "does not add a physics owner or formula lane"
    ],
    id: "confidence_wording_or_low_confidence_surface",
    implementationReadiness: 0.9,
    reason: "Wording cannot be the next slice while physical solver gaps remain open.",
    selected: false,
    sliceKind: "blocked_non_goal",
    sourceRowsRequiredForSelection: false,
    score: 0.08
  }
] as const satisfies readonly PostV1GateAZCandidate[];

function gapCell<TId extends (typeof GATE_AZ_SOURCE_ABSENT_GAP_IDS)[number]>(id: TId) {
  const cell = buildPersonalUseMvpCoverageSprintGateBACartography().find((entry) => entry.id === id);

  if (!cell) {
    throw new Error(`Gate AZ source-absent gap evidence is missing: ${id}`);
  }

  return {
    ...cell,
    id
  };
}

export function rankPostV1GateAZNumericCoverageCandidates(): readonly PostV1GateAZCandidate[] {
  const dynamicStiffness = gapCell("floor.material_owner_gap.dynamic_stiffness_load_basis");
  const lowerTreatment = gapCell("floor.suspended_ceiling.lower_treatment_coupling_gap");
  const mixedSupport = gapCell("floor.mixed_support_family.multi_family_solver_gap");

  return [
    {
      accuracyRisk: 0.93,
      broadSourceCrawl: false,
      coverageImpact: dynamicStiffness.priority,
      expectedBeforeAfter: [
        "partial resilient-layer or floor-covering stacks stay needs_input with exact missing physical fields",
        "complete dynamic-stiffness and load-basis stacks become eligible for the next named source-absent owner/runtime slice",
        "unsafe default s' or load assumptions remain blocked"
      ],
      id: dynamicStiffness.id,
      implementationReadiness: 0.86,
      reason: dynamicStiffness.whyItMatters,
      selected: true,
      sliceKind: "input_owner_contract",
      sourceRowsRequiredForSelection: false,
      score: 1.77
    },
    {
      accuracyRisk: 0.9,
      broadSourceCrawl: false,
      coverageImpact: lowerTreatment.priority,
      expectedBeforeAfter: [
        "suspended-ceiling lower treatment can become a follow-up runtime corridor",
        "hanger/support class, cavity, absorber, and board mass stay explicit owner fields"
      ],
      id: lowerTreatment.id,
      implementationReadiness: 0.78,
      reason: lowerTreatment.whyItMatters,
      selected: false,
      sliceKind: "runtime_corridor",
      sourceRowsRequiredForSelection: false,
      score: 1.61
    },
    {
      accuracyRisk: 0.88,
      broadSourceCrawl: false,
      coverageImpact: mixedSupport.priority,
      expectedBeforeAfter: [
        "mixed carrier families fail closed with duplicateOwnershipGuard",
        "no formula runs until the user selects a single explicit carrier family"
      ],
      id: mixedSupport.id,
      implementationReadiness: 0.72,
      reason: mixedSupport.whyItMatters,
      selected: false,
      sliceKind: "fail_closed_boundary",
      sourceRowsRequiredForSelection: false,
      score: 1.44
    },
    ...NON_GOAL_CANDIDATES
  ];
}

export function summarizePostV1GateAZNumericCoverageGap(): PostV1GateAZSummary {
  const selected = rankPostV1GateAZNumericCoverageCandidates().find((candidate) => candidate.selected);
  const oldFloorImpactSelection = rankPersonalUseMvpCoverageSprintGateBBLanes().find((candidate) => candidate.selected);

  if (POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE) {
    throw new Error("Gate AZ can only land after Gate AY selects the Gate AZ numeric coverage gap.");
  }

  if (!selected) {
    throw new Error("Gate AZ requires exactly one selected numeric coverage candidate.");
  }

  if (oldFloorImpactSelection?.id !== "floor_impact_source_absent_input_contract") {
    throw new Error("Gate AZ expected the existing floor-impact input-contract evidence to be selected before source crawling.");
  }

  return {
    blockedNonGoalIds: NON_GOAL_CANDIDATES.map((candidate) => candidate.id),
    broadSourceCrawlSelected: false,
    candidateCount: rankPostV1GateAZNumericCoverageCandidates().length,
    currentGapEvidenceIds: [...GATE_AZ_SOURCE_ABSENT_GAP_IDS],
    currentPostV1GateAySelectedNextAction: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION,
    currentPostV1GateAySelectedNextFile: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE,
    currentPostV1GateAySelectionStatus: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousLandedGate: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE,
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL,
    selectionCandidates: rankPostV1GateAZNumericCoverageCandidates(),
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS,
    surfaces: IMPLEMENTATION_SURFACES,
    targetMetricsForSelectedSlice: TARGET_METRICS_FOR_SELECTED_SLICE
  };
}
