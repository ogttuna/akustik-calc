import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC
} from "./post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc";

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE =
  "post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS =
  "post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_be_plan" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts" as const;

export const POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BE" as const;

export type PostV1GateBDCoverageRowId =
  | "floor.suspended_ceiling_lower_treatment.acoustic_hanger.lab_formula"
  | "floor.suspended_ceiling_lower_treatment.astm_iic_aiic.unsupported"
  | "floor.suspended_ceiling_lower_treatment.impact_only_api.lab_formula"
  | "floor.suspended_ceiling_lower_treatment.missing_load_basis.needs_input"
  | "floor.suspended_ceiling_lower_treatment.missing_lower_assembly.needs_input"
  | "floor.suspended_ceiling_lower_treatment.resilient_stud.lab_formula"
  | "floor.mixed_support_family.multi_family_solver_gap.followup"
  | "post_v1.next_numeric_coverage_gap_gate_be.next";

export type PostV1GateBDCoveragePosture =
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "unsupported";

export type PostV1GateBDFailureClass =
  | "correct_block"
  | "coverage_followup"
  | "none"
  | "unsupported_metric";

export type PostV1GateBDErrorBudgetPin = {
  readonly metric: RequestedOutputId;
  readonly toleranceDb: number;
};

export type PostV1GateBDCoverageRow = {
  readonly basis: "element_lab" | "next_selection" | "astm_rating_boundary";
  readonly currentPosture: PostV1GateBDCoveragePosture;
  readonly errorBudgetPins: readonly PostV1GateBDErrorBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly failureClass: PostV1GateBDFailureClass;
  readonly id: PostV1GateBDCoverageRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "needs_input"
    | "ranked_followup"
    | "source_absent_family_physics"
    | "unsupported_or_incomplete_topology";
  readonly requestedMetrics: readonly RequestedOutputId[];
  readonly route: "floor";
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
  readonly unsupportedTargetOutputs: readonly RequestedOutputId[];
  readonly valuePins: readonly {
    readonly metric: RequestedOutputId;
    readonly value: number;
  }[];
};

export type PostV1GateBDCoverageRefreshSummary = {
  readonly correctlyBlockedRowIds: readonly PostV1GateBDCoverageRowId[];
  readonly failureClassCounts: Record<PostV1GateBDFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly rankedFollowupRowIds: readonly PostV1GateBDCoverageRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL;
  readonly supportedRuntimeRowIds: readonly PostV1GateBDCoverageRowId[];
  readonly unsupportedRowIds: readonly PostV1GateBDCoverageRowId[];
};

export type PostV1GateBDCoverageRefreshContract = {
  readonly landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE;
  readonly matrixRows: readonly PostV1GateBDCoverageRow[];
  readonly noRuntimeValueMovement: true;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "broad_source_row_crawl"
      | "confidence_wording_or_low_confidence_surface"
      | "floor.mixed_support_family.multi_family_solver_gap"
      | "post_v1_next_numeric_coverage_gap_gate_be";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS;
  readonly summary: PostV1GateBDCoverageRefreshSummary;
};

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const ERROR_BUDGETS = [
  { metric: "Ln,w", toleranceDb: 6.5 },
  { metric: "DeltaLw", toleranceDb: 5.5 }
] as const satisfies readonly PostV1GateBDErrorBudgetPin[];

function runtimeRow(input: {
  id: Extract<
    PostV1GateBDCoverageRowId,
    | "floor.suspended_ceiling_lower_treatment.acoustic_hanger.lab_formula"
    | "floor.suspended_ceiling_lower_treatment.impact_only_api.lab_formula"
    | "floor.suspended_ceiling_lower_treatment.resilient_stud.lab_formula"
  >;
  deltaLwDb: number;
  lnWDb: number;
  nextAction: string;
}): PostV1GateBDCoverageRow {
  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    errorBudgetPins: ERROR_BUDGETS,
    expectedBasisId: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
    failureClass: "none",
    id: input.id,
    missingPhysicalInputs: [],
    nextAction: input.nextAction,
    originSupportBucket: "source_absent_family_physics",
    requestedMetrics: LAB_OUTPUTS,
    route: "floor",
    supportedTargetOutputs: LAB_OUTPUTS,
    unsupportedTargetOutputs: [],
    valuePins: [
      { metric: "Ln,w", value: input.lnWDb },
      { metric: "DeltaLw", value: input.deltaLwDb }
    ]
  };
}

function needsInputRow(input: {
  id: Extract<
    PostV1GateBDCoverageRowId,
    | "floor.suspended_ceiling_lower_treatment.missing_load_basis.needs_input"
    | "floor.suspended_ceiling_lower_treatment.missing_lower_assembly.needs_input"
  >;
  missingPhysicalInputs: readonly string[];
  nextAction: string;
}): PostV1GateBDCoverageRow {
  return {
    basis: "element_lab",
    currentPosture: "needs_input",
    errorBudgetPins: [],
    expectedBasisId: null,
    failureClass: "correct_block",
    id: input.id,
    missingPhysicalInputs: input.missingPhysicalInputs,
    nextAction: input.nextAction,
    originSupportBucket: "needs_input",
    requestedMetrics: LAB_OUTPUTS,
    route: "floor",
    supportedTargetOutputs: [],
    unsupportedTargetOutputs: LAB_OUTPUTS,
    valuePins: []
  };
}

export function buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDMatrix():
  readonly PostV1GateBDCoverageRow[] {
  return [
    runtimeRow({
      deltaLwDb: 28.9,
      id: "floor.suspended_ceiling_lower_treatment.acoustic_hanger.lab_formula",
      lnWDb: 45.6,
      nextAction: "keep acoustic-hanger lower-treatment formula answer pinned across calculator surfaces"
    }),
    runtimeRow({
      deltaLwDb: 29.9,
      id: "floor.suspended_ceiling_lower_treatment.resilient_stud.lab_formula",
      lnWDb: 44.6,
      nextAction: "keep resilient-stud lower-treatment formula answer pinned across calculator surfaces"
    }),
    runtimeRow({
      deltaLwDb: 28.9,
      id: "floor.suspended_ceiling_lower_treatment.impact_only_api.lab_formula",
      lnWDb: 45.6,
      nextAction: "keep impact-only API on the same layer-derived lower-treatment formula lane"
    }),
    needsInputRow({
      id: "floor.suspended_ceiling_lower_treatment.missing_load_basis.needs_input",
      missingPhysicalInputs: ["loadBasisKgM2"],
      nextAction: "do not calculate lower-treatment DeltaLw without explicit load basis"
    }),
    needsInputRow({
      id: "floor.suspended_ceiling_lower_treatment.missing_lower_assembly.needs_input",
      missingPhysicalInputs: ["ceilingOrLowerAssembly"],
      nextAction: "do not calculate lower-treatment DeltaLw without an owned lower assembly"
    }),
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "unsupported_metric",
      id: "floor.suspended_ceiling_lower_treatment.astm_iic_aiic.unsupported",
      missingPhysicalInputs: [],
      nextAction: "keep ASTM IIC/AIIC out until an ASTM rating owner exists",
      originSupportBucket: "unsupported_or_incomplete_topology",
      requestedMetrics: ASTM_OUTPUTS,
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ASTM_OUTPUTS,
      valuePins: []
    },
    {
      basis: "next_selection",
      currentPosture: "followup_ranked",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.mixed_support_family.multi_family_solver_gap.followup",
      missingPhysicalInputs: ["singleCarrierFamilyOwner", "duplicateOwnershipGuard"],
      nextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: LAB_OUTPUTS,
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    },
    {
      basis: "next_selection",
      currentPosture: "followup_ranked",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "post_v1.next_numeric_coverage_gap_gate_be.next",
      missingPhysicalInputs: [],
      nextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: LAB_OUTPUTS,
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: LAB_OUTPUTS,
      valuePins: []
    }
  ];
}

function countByFailureClass(
  rows: readonly PostV1GateBDCoverageRow[]
): Record<PostV1GateBDFailureClass, number> {
  return rows.reduce<Record<PostV1GateBDFailureClass, number>>(
    (counts, row) => ({
      ...counts,
      [row.failureClass]: counts[row.failureClass] + 1
    }),
    {
      correct_block: 0,
      coverage_followup: 0,
      none: 0,
      unsupported_metric: 0
    }
  );
}

export function buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract():
  PostV1GateBDCoverageRefreshContract {
  const previous = summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC();
  if (
    previous.selectedNextAction !==
    POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE
  ) {
    throw new Error("Gate BD can only land after Gate BC selects lower-treatment coverage refresh.");
  }

  const matrixRows = buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDMatrix();
  const supportedRuntimeRowIds = matrixRows
    .filter((row) => row.currentPosture === "family_physics")
    .map((row) => row.id);
  const correctlyBlockedRowIds = matrixRows
    .filter((row) => row.failureClass === "correct_block")
    .map((row) => row.id);
  const unsupportedRowIds = matrixRows
    .filter((row) => row.failureClass === "unsupported_metric")
    .map((row) => row.id);
  const rankedFollowupRowIds = matrixRows
    .filter((row) => row.currentPosture === "followup_ranked")
    .map((row) => row.id);

  return {
    landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "post_v1_next_numeric_coverage_gap_gate_be",
        reason: "selected now to rerank remaining numeric calculator gaps after lower-treatment formula coverage is locked",
        selectedNow: true
      },
      {
        id: "floor.mixed_support_family.multi_family_solver_gap",
        reason: "known remaining high-risk floor gap; Gate BE must compare it against other calculator-capacity candidates",
        selectedNow: false
      },
      {
        id: "broad_source_row_crawl",
        reason: "finite source collection still does not solve source-absent arbitrary layer combinations by itself",
        selectedNow: false
      },
      {
        id: "confidence_wording_or_low_confidence_surface",
        reason: "wording does not add a formula lane or supported metric",
        selectedNow: false
      }
    ],
    selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS,
    summary: {
      correctlyBlockedRowIds,
      failureClassCounts: countByFailureClass(matrixRows),
      noRuntimeValueMovement: true,
      rankedFollowupRowIds,
      rowCount: matrixRows.length,
      selectedNextAction:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds,
      unsupportedRowIds
    }
  };
}
