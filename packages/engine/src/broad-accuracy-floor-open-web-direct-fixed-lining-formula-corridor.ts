import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem, RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract,
  type BroadAccuracyFloorOpenWebDirectFixedFamilyId
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor open-web direct-fixed lining runtime corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor";

export type BroadAccuracyFloorOpenWebDirectFixedBoardSchedule = "2x13" | "2x16" | "3x16";

export type BroadAccuracyFloorOpenWebDirectFixedFinishPackage =
  | "bare"
  | "carpet_with_foam_underlay"
  | "engineered_timber_with_acoustic_underlay";

export type BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId =
  | "CI"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw"
  | "Rw+Ctr";

export type BroadAccuracyFloorOpenWebDirectFixedFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_exact_source_precedence"
  | "blocked_out_of_band_depth"
  | "blocked_unsupported_lining_or_deck"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorOpenWebDirectFixedFormulaTermId =
  | "carrier_depth_interpolation"
  | "deck_panel_mass_delta"
  | "direct_lining_board_schedule_family"
  | "exact_source_anchor_selection"
  | "impact_ci_semantics"
  | "upper_finish_lnw_delta";

export type BroadAccuracyFloorOpenWebDirectFixedFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorOpenWebDirectFixedFormulaTermId;
};

export type BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTermId =
  | "direct_fixed_grid_interpolation_residual"
  | "direct_lining_bridge_simplification"
  | "missing_same_stack_holdout"
  | "source_table_rounding"
  | "support_spacing_assumption";

export type BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTerm = {
  readonly basis: "source_absent_direct_fixed_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorOpenWebDirectFixedErrorBudget = {
  readonly metricId: BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluationInput = {
  readonly boardSchedule: BroadAccuracyFloorOpenWebDirectFixedBoardSchedule;
  readonly carrierDepthMm: number;
  readonly deckThicknessMm: 16 | 19;
  readonly finishPackage: BroadAccuracyFloorOpenWebDirectFixedFinishPackage;
  readonly targetOutputs?: readonly RequestedOutputId[];
};

export type BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly anchorSourceIds: readonly string[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly boardSchedule: BroadAccuracyFloorOpenWebDirectFixedBoardSchedule;
  readonly carrierDepthMm: number;
  readonly corridorStatus: BroadAccuracyFloorOpenWebDirectFixedFormulaStatus;
  readonly deckThicknessMm: 16 | 19;
  readonly designMetrics: {
    readonly CI: number | null;
    readonly LnW: number | null;
    readonly LnWPlusCI: number | null;
    readonly Rw: number | null;
    readonly RwCtr: number | null;
  };
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly familyId: BroadAccuracyFloorOpenWebDirectFixedFamilyId;
  readonly finishPackage: BroadAccuracyFloorOpenWebDirectFixedFinishPackage;
  readonly formulaTerms: readonly BroadAccuracyFloorOpenWebDirectFixedFormulaTerm[];
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly CI: null;
    readonly LnW: null;
    readonly LnWPlusCI: null;
    readonly Rw: null;
    readonly RwCtr: null;
  };
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenWebDirectFixedErrorBudget[];
};

export type BroadAccuracyFloorOpenWebDirectFixedFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorOpenWebDirectFixedFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousTransferOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: true;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenWebDirectFixedErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "Ln,w", "CI", "Ln,w+CI"]);

const BOARD_SCHEDULE_TO_FAMILY_ID: Record<
  BroadAccuracyFloorOpenWebDirectFixedBoardSchedule,
  BroadAccuracyFloorOpenWebDirectFixedFamilyId
> = {
  "2x13": "fl23",
  "2x16": "fl25",
  "3x16": "fl27"
};

const FORMULA_TERMS = [
  {
    description: "Pick same-family UBIQ direct-fixed rows before any interpolation.",
    owner: "sameFamilyDirectFixedExactAnchorSelectionOwner",
    requiredInputs: ["boardSchedule", "deckThicknessMm", "finishPackage", "metricBasis"],
    runtimeOwnedInGate: false,
    termId: "exact_source_anchor_selection"
  },
  {
    description: "Map direct lining board schedule to FL-23, FL-25, or FL-27 family behavior.",
    owner: "directLiningBoardScheduleFamilyOwner",
    requiredInputs: ["boardLayerCount", "boardThicknessMm", "lowerTreatment.supportClass"],
    runtimeOwnedInGate: false,
    termId: "direct_lining_board_schedule_family"
  },
  {
    description: "Interpolate only inside the measured 200/300/400 mm open-web carrier band.",
    owner: "carrierDepthLinearInterpolationOwner",
    requiredInputs: ["carrierDepthMm", "supportForm", "carrierSpacingMm"],
    runtimeOwnedInGate: false,
    termId: "carrier_depth_interpolation"
  },
  {
    description: "Keep 16 mm and 19 mm INEX deck tables separate instead of applying a generic mass bonus.",
    owner: "inexDeckPanelMassDeltaOwner",
    requiredInputs: ["floatingScreed.materialClass", "floatingScreed.thicknessMm"],
    runtimeOwnedInGate: false,
    termId: "deck_panel_mass_delta"
  },
  {
    description: "Apply bare, timber-underlay, and carpet impact packages from same-family source rows only.",
    owner: "upperFinishImpactDeltaOwner",
    requiredInputs: ["floorCovering.mode", "floorCovering.materialClass"],
    runtimeOwnedInGate: false,
    termId: "upper_finish_lnw_delta"
  },
  {
    description: "Keep CI and Ln,w+CI as ISO lab impact terms, not ASTM/IIC or field aliases.",
    owner: "directFixedImpactCiSemanticsOwner",
    requiredInputs: ["CI", "Ln,w+CI", "metricBasis"],
    runtimeOwnedInGate: false,
    termId: "impact_ci_semantics"
  }
] as const satisfies readonly BroadAccuracyFloorOpenWebDirectFixedFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Ln,w", 4),
  buildBudget("CI", 1.5),
  buildBudget("Ln,w+CI", 4.5),
  buildBudget("Rw", 3),
  buildBudget("Rw+Ctr", 3.5)
] as const satisfies readonly BroadAccuracyFloorOpenWebDirectFixedErrorBudget[];

function buildBudget(
  metricId: BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorOpenWebDirectFixedErrorBudget {
  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_direct_fixed_formula_design_budget",
        db: 1,
        termId: "source_table_rounding",
        tightenRequires: ["source_row_unrounded_band_or_lab_report_values"]
      },
      {
        basis: "source_absent_direct_fixed_formula_design_budget",
        db: 1,
        termId: "direct_fixed_grid_interpolation_residual",
        tightenRequires: ["same_family_mid_depth_direct_fixed_holdouts"]
      },
      {
        basis: "source_absent_direct_fixed_formula_design_budget",
        db: 0.75,
        termId: "support_spacing_assumption",
        tightenRequires: ["explicit_open_web_spacing_owner"]
      },
      {
        basis: "source_absent_direct_fixed_formula_design_budget",
        db: 0.75,
        termId: "direct_lining_bridge_simplification",
        tightenRequires: ["board_fastening_and_bridge_loss_owner"]
      },
      {
        basis: "source_absent_direct_fixed_formula_design_budget",
        db: Math.max(0, totalBudgetDb - 3.5),
        termId: "missing_same_stack_holdout",
        tightenRequires: ["source_owned_same_stack_mid_depth_lab_holdout"]
      }
    ],
    totalBudgetDb
  };
}

function isOpenWebSteelDirectFixed(system: ExactFloorSystem): boolean {
  return (
    system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true &&
    system.estimateMatch?.lowerTreatment?.type === "direct_fixed_ceiling"
  );
}

function getBoardSchedule(system: ExactFloorSystem): BroadAccuracyFloorOpenWebDirectFixedBoardSchedule {
  const board = system.match.ceilingBoard;
  const schedule = `${String(board?.layerCount ?? 0)}x${String(board?.thicknessMm ?? 0)}`;

  if (schedule === "2x13" || schedule === "2x16" || schedule === "3x16") {
    return schedule;
  }

  throw new Error(`Unexpected direct-fixed board schedule for ${system.id}: ${schedule}`);
}

function getFinishPackage(system: ExactFloorSystem): BroadAccuracyFloorOpenWebDirectFixedFinishPackage {
  const finish = system.match.floorCovering?.materialIds?.[0];

  if (finish === "carpet_with_foam_underlay" || finish === "engineered_timber_with_acoustic_underlay") {
    return finish;
  }

  return "bare";
}

function metricValue(
  system: ExactFloorSystem,
  metricId: BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId
): number {
  switch (metricId) {
    case "CI":
      return system.impactRatings?.CI ?? 0;
    case "Ln,w":
      return system.impactRatings?.LnW ?? 0;
    case "Ln,w+CI":
      return system.impactRatings?.LnWPlusCI ?? 0;
    case "Rw":
      return system.airborneRatings?.Rw ?? 0;
    case "Rw+Ctr":
      return system.airborneRatings?.RwCtr ?? 0;
  }
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function splitOutputs(targetOutputs: readonly RequestedOutputId[] | undefined): {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
} {
  const requestedOutputs = targetOutputs && targetOutputs.length > 0 ? targetOutputs : (["Rw", "Ln,w"] as const);

  return {
    affectedFormulaOutputs: requestedOutputs.filter((output) => FORMULA_OUTPUTS.has(output)),
    blockedFormulaOutputs: requestedOutputs.filter((output) => !FORMULA_OUTPUTS.has(output))
  };
}

function matchingRows(input: BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluationInput): readonly ExactFloorSystem[] {
  const familyId = BOARD_SCHEDULE_TO_FAMILY_ID[input.boardSchedule];

  return EXACT_FLOOR_SYSTEMS.filter(
    (system) =>
      isOpenWebSteelDirectFixed(system) &&
      getBoardSchedule(system) === input.boardSchedule &&
      system.match.floatingScreed?.thicknessMm === input.deckThicknessMm &&
      getFinishPackage(system) === input.finishPackage &&
      /^ubiq_(fl23|fl25|fl27)_/u.exec(system.id)?.[1] === familyId
  ).sort((a, b) => (a.match.baseStructure?.thicknessMm ?? 0) - (b.match.baseStructure?.thicknessMm ?? 0));
}

function interpolateMetric(input: {
  depthMm: number;
  metricId: BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId;
  rows: readonly ExactFloorSystem[];
}): number {
  const lower = [...input.rows]
    .reverse()
    .find((row) => (row.match.baseStructure?.thicknessMm ?? 0) <= input.depthMm);
  const upper = input.rows.find((row) => (row.match.baseStructure?.thicknessMm ?? 0) >= input.depthMm);

  if (!lower || !upper) {
    throw new Error(`Cannot interpolate ${input.metricId} outside direct-fixed open-web source depth band.`);
  }

  const lowerDepth = lower.match.baseStructure?.thicknessMm ?? 0;
  const upperDepth = upper.match.baseStructure?.thicknessMm ?? 0;
  const lowerValue = metricValue(lower, input.metricId);
  const upperValue = metricValue(upper, input.metricId);

  if (lowerDepth === upperDepth) {
    return round1(lowerValue);
  }

  return round1(lowerValue + ((upperValue - lowerValue) * (input.depthMm - lowerDepth)) / (upperDepth - lowerDepth));
}

export function evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor(
  input: BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluationInput
): BroadAccuracyFloorOpenWebDirectFixedFormulaEvaluation {
  const { affectedFormulaOutputs, blockedFormulaOutputs } = splitOutputs(input.targetOutputs);
  const rows = matchingRows(input);
  const familyId = BOARD_SCHEDULE_TO_FAMILY_ID[input.boardSchedule];
  const exact = rows.find((row) => row.match.baseStructure?.thicknessMm === input.carrierDepthMm) ?? null;
  const inMeasuredBand = input.carrierDepthMm >= 200 && input.carrierDepthMm <= 400;
  const anchors = inMeasuredBand
    ? rows.filter((row) => {
        const depth = row.match.baseStructure?.thicknessMm ?? 0;
        if (exact) {
          return depth === input.carrierDepthMm;
        }
        const lowerDepth = Math.max(
          ...rows.map((sourceRow) => sourceRow.match.baseStructure?.thicknessMm ?? 0).filter((depthMm) => depthMm <= input.carrierDepthMm)
        );
        const upperDepth = Math.min(
          ...rows.map((sourceRow) => sourceRow.match.baseStructure?.thicknessMm ?? 0).filter((depthMm) => depthMm >= input.carrierDepthMm)
        );
        return depth === lowerDepth || depth === upperDepth;
      })
    : [];
  const corridorStatus: BroadAccuracyFloorOpenWebDirectFixedFormulaStatus = exact
    ? "blocked_exact_source_precedence"
    : inMeasuredBand
      ? "formula_corridor_defined_runtime_gate_required"
      : "blocked_out_of_band_depth";
  const designMetrics = inMeasuredBand && rows.length > 0
    ? {
        CI: interpolateMetric({ depthMm: input.carrierDepthMm, metricId: "CI", rows }),
        LnW: interpolateMetric({ depthMm: input.carrierDepthMm, metricId: "Ln,w", rows }),
        LnWPlusCI: interpolateMetric({ depthMm: input.carrierDepthMm, metricId: "Ln,w+CI", rows }),
        Rw: interpolateMetric({ depthMm: input.carrierDepthMm, metricId: "Rw", rows }),
        RwCtr: interpolateMetric({ depthMm: input.carrierDepthMm, metricId: "Rw+Ctr", rows })
      }
    : {
        CI: null,
        LnW: null,
        LnWPlusCI: null,
        Rw: null,
        RwCtr: null
      };

  return {
    affectedFormulaOutputs,
    anchorSourceIds: anchors.map((row) => row.id),
    basisId: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs,
    boardSchedule: input.boardSchedule,
    carrierDepthMm: input.carrierDepthMm,
    corridorStatus,
    deckThicknessMm: input.deckThicknessMm,
    designMetrics,
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: exact?.id ?? null,
    familyId,
    finishPackage: input.finishPackage,
    formulaTerms: FORMULA_TERMS,
    runtimePromotionAllowedInGate: false,
    runtimeValues: {
      CI: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwCtr: null
    },
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

export function buildBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridorContract():
  BroadAccuracyFloorOpenWebDirectFixedFormulaCorridorContract {
  const previous = buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract();

  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
        boardSchedule: "2x13",
        carrierDepthMm: 250,
        deckThicknessMm: 19,
        finishPackage: "engineered_timber_with_acoustic_underlay",
        targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI", "IIC"]
      }),
      evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
        boardSchedule: "2x16",
        carrierDepthMm: 250,
        deckThicknessMm: 16,
        finishPackage: "bare",
        targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI"]
      }),
      evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
        boardSchedule: "3x16",
        carrierDepthMm: 350,
        deckThicknessMm: 19,
        finishPackage: "carpet_with_foam_underlay",
        targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "Select same-family direct-fixed UBIQ rows by board schedule, deck thickness, finish package, and ISO lab basis.",
      "Metric(depth) = linear interpolation between nearest 200/300/400 mm same-family source rows; no extrapolation beyond that band.",
      "Ln,w+CI is interpolated from the source-owned Ln,w+CI term and cross-checked against interpolated Ln,w plus CI before runtime promotion.",
      "Gate formula-corridor defines design values and budgets only; runtime values stay frozen until the selected runtime-corridor gate."
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousTransferOwner: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_same_family_direct_fixed_rows_not_resilient_ceiling_rows",
      "carrier_depth_must_stay_within_200_400_mm_or_return_needs_input_unsupported",
      "exact_source_rows_must_precede_formula_rows",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: true,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}
