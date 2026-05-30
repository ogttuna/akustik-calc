import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS,
  buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract
} from "./post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_be_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION =
  "post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_LABEL =
  "post-V1 floor suspended-ceiling lower-treatment field companion Gate BF" as const;

export type PostV1GateBECandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "floor.mixed_support_family.multi_family_solver_gap"
  | "floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap"
  | "finite_scenario_pack";

export type PostV1GateBESliceKind =
  | "blocked_non_goal"
  | "fail_closed_boundary"
  | "runtime_coverage";

export type PostV1GateBECandidate = {
  readonly coverageImpact: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBECandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly selected: boolean;
  readonly sliceKind: PostV1GateBESliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly score: number;
};

export type PostV1GateBESummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBECandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBD: {
    readonly landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBECandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBECandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS;
  readonly targetMetricsForSelectedSlice: readonly RequestedOutputId[];
};

const SELECTED_FIELD_COMPANION_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBENumericCoverageCandidates(): readonly PostV1GateBECandidate[] {
  return [
    {
      coverageImpact: 0.94,
      expectedBeforeAfter: [
        "assembly route field-only lower-treatment requests still stop behind an unnecessary lab-anchor gap",
        "the same source-absent lower-treatment formula can publish L'n,w, L'nT,w, and L'nT,50 when field inputs are present",
        "missing CI,50-2500 remains a precise needs_input boundary for only L'nT,50"
      ],
      id: "floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap",
      implementationReadiness: 0.92,
      reason:
        "Gate BD already locked the lower-treatment lab formula; the field adapter is present and only needs the assembly route to seed the same lab anchor for field-only requests.",
      selected: true,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      score: 1.86
    },
    {
      coverageImpact: 0.72,
      expectedBeforeAfter: [
        "mixed carrier-family stacks fail closed",
        "future slice should prevent duplicate family ownership before any formula promotion"
      ],
      id: "floor.mixed_support_family.multi_family_solver_gap",
      implementationReadiness: 0.64,
      reason: "Important correctness gap, but it blocks unsafe combinations rather than unlocking already-owned outputs.",
      selected: false,
      sliceKind: "fail_closed_boundary",
      sourceRowsRequiredForSelection: false,
      score: 1.36
    },
    {
      coverageImpact: 0.2,
      expectedBeforeAfter: [
        "may add finite exact rows later",
        "does not improve source-absent arbitrary layer-combination calculation by itself"
      ],
      id: "broad_source_row_crawl",
      implementationReadiness: 0.2,
      reason: "Finite row gathering is not the highest-ROI next calculator-capacity move.",
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      score: 0.1
    },
    {
      coverageImpact: 0.08,
      expectedBeforeAfter: [
        "does not add a physics owner",
        "does not add any supported output"
      ],
      id: "confidence_wording_or_low_confidence_surface",
      implementationReadiness: 0.9,
      reason: "Wording work cannot outrank an available numeric coverage increase.",
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      score: 0.08
    },
    {
      coverageImpact: 0.12,
      expectedBeforeAfter: [
        "adds finite examples",
        "does not widen the solver route for arbitrary user layer stacks"
      ],
      id: "finite_scenario_pack",
      implementationReadiness: 0.75,
      reason: "Scenario packs are useful regression evidence after runtime movement, not the next value-moving slice.",
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      score: 0.07
    }
  ];
}

export function summarizePostV1GateBENumericCoverageGap(): PostV1GateBESummary {
  const gateBD = buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract();
  if (gateBD.selectedNextAction !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE) {
    throw new Error("Gate BE can only land after Gate BD selects the next numeric coverage gap.");
  }

  const selectionCandidates = rankPostV1GateBENumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate BE must select exactly one next calculator-capacity slice.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBD: {
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS,
    targetMetricsForSelectedSlice: SELECTED_FIELD_COMPANION_OUTPUTS
  };
}
