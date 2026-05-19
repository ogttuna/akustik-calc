import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem, RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract,
  type BroadAccuracyFloorOpenBoxTimberPackageId
} from "./broad-accuracy-floor-open-box-timber-similarity-transfer-owner";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor open-box timber similarity runtime corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor";

export type BroadAccuracyFloorOpenBoxTimberFormulaMetricId =
  | "CI"
  | "CI,50-2500"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw"
  | "Rw+C";

export type BroadAccuracyFloorOpenBoxTimberFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_disjoint_duplicate_roles"
  | "blocked_exact_only_hybrid_transfer"
  | "blocked_exact_source_precedence"
  | "blocked_mixed_staged_no_predictor_rows"
  | "blocked_partial_laminate_eps_finish"
  | "blocked_raw_bare_open_box"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorOpenBoxTimberFormulaTermId =
  | "airborne_rw_plus_c_semantics"
  | "fragmented_exact_equivalent_package_guard"
  | "impact_lnw_ci_lnw_plus_ci_semantics"
  | "laminate_eps_finish_pair_delta"
  | "lower_ceiling_family_delta"
  | "open_box_370mm_support_family_constraint"
  | "same_family_tuas_open_box_anchor_selection"
  | "source_absent_residual_budget_decomposition"
  | "upper_package_family_delta";

export type BroadAccuracyFloorOpenBoxTimberFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorOpenBoxTimberFormulaTermId;
};

export type BroadAccuracyFloorOpenBoxTimberErrorBudgetTermId =
  | "exact_only_hybrid_transfer_blocker"
  | "lower_ceiling_family_transfer"
  | "same_lab_packet_spread_residual"
  | "source_table_rounding"
  | "upper_package_interaction_simplification";

export type BroadAccuracyFloorOpenBoxTimberErrorBudgetTerm = {
  readonly basis: "source_absent_open_box_timber_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorOpenBoxTimberErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorOpenBoxTimberErrorBudget = {
  readonly metricId: BroadAccuracyFloorOpenBoxTimberFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly BroadAccuracyFloorOpenBoxTimberErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorOpenBoxTimberDesignMetrics = {
  readonly CI: number | null;
  readonly CI50_2500: number | null;
  readonly LnW: number | null;
  readonly LnWPlusCI: number | null;
  readonly Rw: number | null;
  readonly RwPlusC: number | null;
};

export type BroadAccuracyFloorOpenBoxTimberSupportFamily =
  | "open_box_timber"
  | "open_web_steel"
  | "raw_open_box_roleless";

export type BroadAccuracyFloorOpenBoxTimberFinishPairState =
  | "complete_laminate_eps"
  | "missing_eps_or_laminate"
  | "none_raw_bare";

export type BroadAccuracyFloorOpenBoxTimberRoleTopologyState =
  | "disjoint_duplicate_roles"
  | "source_equivalent";

export type BroadAccuracyFloorOpenBoxTimberFormulaEvaluationInput = {
  readonly exactSourceId?: string;
  readonly finishPairState: BroadAccuracyFloorOpenBoxTimberFinishPairState;
  readonly packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberRoleTopologyState;
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberSupportFamily;
  readonly targetOutputs?: readonly RequestedOutputId[];
};

export type BroadAccuracyFloorOpenBoxTimberFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly anchorSourceIds: readonly string[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly blockedSourceIds: readonly string[];
  readonly corridorStatus: BroadAccuracyFloorOpenBoxTimberFormulaStatus;
  readonly designMetrics: BroadAccuracyFloorOpenBoxTimberDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly finishPairState: BroadAccuracyFloorOpenBoxTimberFinishPairState;
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberFormulaTerm[];
  readonly packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberRoleTopologyState;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly CI: null;
    readonly CI50_2500: null;
    readonly LnW: null;
    readonly LnWPlusCI: null;
    readonly Rw: null;
    readonly RwPlusC: null;
  };
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberSupportFamily;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberErrorBudget[];
};

export type BroadAccuracyFloorOpenBoxTimberFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorOpenBoxTimberFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousTransferOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: true;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);

const FORMULA_TERMS = [
  {
    description: "Use only TUAS open-box timber rows measured on the 370 mm open-box timber slab.",
    owner: "sameFamilyTuasOpenBoxAnchorSelectionOwner",
    requiredInputs: ["supportFamily", "baseStructure.materialId", "baseStructure.thicknessMm", "sourceDataset"],
    runtimeOwnedInGate: false,
    termId: "same_family_tuas_open_box_anchor_selection"
  },
  {
    description: "Keep the first corridor fixed to the 370 mm open-box timber support family.",
    owner: "openBox370mmSupportFamilyConstraintOwner",
    requiredInputs: ["structuralSupportType", "supportForm", "baseSlab.thicknessMm"],
    runtimeOwnedInGate: false,
    termId: "open_box_370mm_support_family_constraint"
  },
  {
    description: "Separate no-upper, dry gypsum-fiber, reinforced ceiling, EPS/screed, and staged package families.",
    owner: "openBoxUpperPackageFamilyDeltaOwner",
    requiredInputs: ["upperFill.materialClass", "upperFill.thicknessMm", "floatingScreed.materialClass", "floatingScreed.thicknessMm"],
    runtimeOwnedInGate: false,
    termId: "upper_package_family_delta"
  },
  {
    description: "Separate TUAS lower family A, family B, reinforced board, and hybrid lower paths.",
    owner: "openBoxLowerCeilingFamilyDeltaOwner",
    requiredInputs: ["lowerTreatment.supportClass", "lowerTreatment.boardSchedule", "lowerTreatment.cavityDepthMm", "lowerTreatment.cavityFillThicknessMm"],
    runtimeOwnedInGate: false,
    termId: "lower_ceiling_family_delta"
  },
  {
    description: "Require the 8 mm laminate plus 3 mm EPS finish pair when walking-finish transfer is used.",
    owner: "openBoxLaminateEpsFinishPairDeltaOwner",
    requiredInputs: ["floorCovering.materialClass", "floorCovering.thicknessMm", "resilientLayer.productId", "resilientLayer.thicknessMm"],
    runtimeOwnedInGate: false,
    termId: "laminate_eps_finish_pair_delta"
  },
  {
    description: "Allow source-equivalent packed schedules but block disjoint duplicate role fallbacks.",
    owner: "openBoxFragmentedExactEquivalentPackageGuardOwner",
    requiredInputs: ["sourceEquivalentPackedSchedule", "visibleRoleOrder", "singleEntryRoleConflictState"],
    runtimeOwnedInGate: false,
    termId: "fragmented_exact_equivalent_package_guard"
  },
  {
    description: "Keep Ln,w, CI, CI,50-2500, and Ln,w+CI as ISO lab impact terms.",
    owner: "openBoxImpactLnwCiSemanticsOwner",
    requiredInputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "metricBasis"],
    runtimeOwnedInGate: false,
    termId: "impact_lnw_ci_lnw_plus_ci_semantics"
  },
  {
    description: "Keep TUAS Rw+C companion semantics explicit and do not relabel them as Rw+Ctr.",
    owner: "openBoxAirborneRwPlusCSemanticsOwner",
    requiredInputs: ["Rw", "Rw+C", "airborneCompanionSemantic"],
    runtimeOwnedInGate: false,
    termId: "airborne_rw_plus_c_semantics"
  },
  {
    description: "Attach source-absent budgets to package spread, lower-family transfer, and exact-only hybrid blockers.",
    owner: "openBoxSourceAbsentResidualBudgetOwner",
    requiredInputs: ["holdoutPacket", "residualThresholdDb", "errorBudgetDb"],
    runtimeOwnedInGate: false,
    termId: "source_absent_residual_budget_decomposition"
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Ln,w", 7),
  buildBudget("CI", 2),
  buildBudget("CI,50-2500", 2.5),
  buildBudget("Ln,w+CI", 7.5),
  buildBudget("Rw", 6),
  buildBudget("Rw+C", 6.5)
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberErrorBudget[];

function buildBudget(
  metricId: BroadAccuracyFloorOpenBoxTimberFormulaMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorOpenBoxTimberErrorBudget {
  const sourceTableRounding = round1(totalBudgetDb * 0.15);
  const packetSpreadResidual = round1(totalBudgetDb * 0.25);
  const lowerCeilingTransfer = round1(totalBudgetDb * 0.2);
  const upperPackageInteraction = round1(totalBudgetDb * 0.2);
  const exactOnlyHybridBlocker = round1(
    totalBudgetDb - sourceTableRounding - packetSpreadResidual - lowerCeilingTransfer - upperPackageInteraction
  );

  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_open_box_timber_formula_design_budget",
        db: sourceTableRounding,
        termId: "source_table_rounding",
        tightenRequires: ["source_owned_unrounded_tuas_lab_values"]
      },
      {
        basis: "source_absent_open_box_timber_formula_design_budget",
        db: packetSpreadResidual,
        termId: "same_lab_packet_spread_residual",
        tightenRequires: ["leave_one_packet_out_open_box_timber_holdouts"]
      },
      {
        basis: "source_absent_open_box_timber_formula_design_budget",
        db: lowerCeilingTransfer,
        termId: "lower_ceiling_family_transfer",
        tightenRequires: ["same_package_lower_family_a_b_holdouts"]
      },
      {
        basis: "source_absent_open_box_timber_formula_design_budget",
        db: upperPackageInteraction,
        termId: "upper_package_interaction_simplification",
        tightenRequires: ["same_lower_family_upper_package_sweep_holdouts"]
      },
      {
        basis: "source_absent_open_box_timber_formula_design_budget",
        db: exactOnlyHybridBlocker,
        termId: "exact_only_hybrid_transfer_blocker",
        tightenRequires: ["source_equivalent_fragmented_package_residual_policy"]
      }
    ],
    totalBudgetDb
  };
}

function isTuasOpenBoxTimber(system: ExactFloorSystem): boolean {
  return (
    system.id.startsWith("tuas_r") &&
    system.match.baseStructure?.materialIds?.includes("open_box_timber_slab") === true
  );
}

function getPackageId(system: ExactFloorSystem): BroadAccuracyFloorOpenBoxTimberPackageId {
  if (/^tuas_r2[ab]_/u.test(system.id)) {
    return "thin_laminate_eps_no_upper";
  }

  if (/^tuas_r[35][ab]_/u.test(system.id)) {
    return "dry_gypsum_fiber_upper";
  }

  if (/^tuas_r6[ab]_/u.test(system.id)) {
    return "reinforced_ceiling_laminate";
  }

  if (/^tuas_r10a_/u.test(system.id)) {
    return "mixed_staged_upper";
  }

  return "eps_screed_or_hybrid_upper";
}

function buildOpenBoxRows(): readonly ExactFloorSystem[] {
  return EXACT_FLOOR_SYSTEMS.filter(isTuasOpenBoxTimber);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function average(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return round1(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function metricsFromRows(rows: readonly ExactFloorSystem[]): BroadAccuracyFloorOpenBoxTimberDesignMetrics {
  return {
    CI: average(rows.map((row) => row.impactRatings.CI ?? 0)),
    CI50_2500: average(rows.map((row) => row.impactRatings.CI50_2500 ?? 0)),
    LnW: average(rows.map((row) => row.impactRatings.LnW)),
    LnWPlusCI: average(rows.map((row) => row.impactRatings.LnWPlusCI ?? 0)),
    Rw: average(rows.map((row) => row.airborneRatings.Rw)),
    RwPlusC: average(rows.map((row) => row.airborneRatings.RwCtr ?? 0))
  };
}

function emptyMetrics(): BroadAccuracyFloorOpenBoxTimberDesignMetrics {
  return {
    CI: null,
    CI50_2500: null,
    LnW: null,
    LnWPlusCI: null,
    Rw: null,
    RwPlusC: null
  };
}

function splitOutputs(targetOutputs: readonly RequestedOutputId[] | undefined): {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
} {
  const requestedOutputs = targetOutputs && targetOutputs.length > 0 ? targetOutputs : (["Rw", "Ln,w"] as const);

  return {
    affectedFormulaOutputs: requestedOutputs.filter((output) => FORMULA_OUTPUTS.has(output)),
    blockedFormulaOutputs: requestedOutputs.filter((output) => !FORMULA_OUTPUTS.has(output))
  };
}

function rowsForPackage(packageId: BroadAccuracyFloorOpenBoxTimberPackageId): readonly ExactFloorSystem[] {
  return buildOpenBoxRows().filter((row) => getPackageId(row) === packageId);
}

function statusForInput(
  input: BroadAccuracyFloorOpenBoxTimberFormulaEvaluationInput,
  exactSource: ExactFloorSystem | null,
  predictorRows: readonly ExactFloorSystem[]
): BroadAccuracyFloorOpenBoxTimberFormulaStatus {
  if (input.supportFamily === "open_web_steel") {
    return "blocked_wrong_support_family";
  }

  if (input.supportFamily === "raw_open_box_roleless" || input.finishPairState === "none_raw_bare") {
    return "blocked_raw_bare_open_box";
  }

  if (input.roleTopologyState === "disjoint_duplicate_roles") {
    return "blocked_disjoint_duplicate_roles";
  }

  if (input.finishPairState === "missing_eps_or_laminate") {
    return "blocked_partial_laminate_eps_finish";
  }

  if (exactSource) {
    return "blocked_exact_source_precedence";
  }

  if (input.packageId === "eps_screed_or_hybrid_upper") {
    return "blocked_exact_only_hybrid_transfer";
  }

  if (input.packageId === "mixed_staged_upper" || predictorRows.length === 0) {
    return "blocked_mixed_staged_no_predictor_rows";
  }

  return "formula_corridor_defined_runtime_gate_required";
}

export function evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor(
  input: BroadAccuracyFloorOpenBoxTimberFormulaEvaluationInput
): BroadAccuracyFloorOpenBoxTimberFormulaEvaluation {
  const { affectedFormulaOutputs, blockedFormulaOutputs } = splitOutputs(input.targetOutputs);
  const packageRows = rowsForPackage(input.packageId);
  const exactSource = input.exactSourceId
    ? (packageRows.find((row) => row.id === input.exactSourceId) ?? null)
    : null;
  const predictorRows = packageRows.filter((row) => row.estimateMatch);
  const exactOnlyRows = packageRows.filter((row) => !row.estimateMatch);
  const corridorStatus = statusForInput(input, exactSource, predictorRows);
  const shouldExposeDesignMetrics =
    corridorStatus === "formula_corridor_defined_runtime_gate_required" ||
    corridorStatus === "blocked_exact_only_hybrid_transfer";

  return {
    affectedFormulaOutputs,
    anchorSourceIds: shouldExposeDesignMetrics ? predictorRows.map((row) => row.id) : [],
    basisId: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs,
    blockedSourceIds:
      corridorStatus === "blocked_exact_only_hybrid_transfer" ||
      corridorStatus === "blocked_mixed_staged_no_predictor_rows"
        ? exactOnlyRows.map((row) => row.id)
        : [],
    corridorStatus,
    designMetrics: exactSource
      ? metricsFromRows([exactSource])
      : shouldExposeDesignMetrics
        ? metricsFromRows(predictorRows)
        : emptyMetrics(),
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: exactSource?.id ?? null,
    finishPairState: input.finishPairState,
    formulaTerms: FORMULA_TERMS,
    packageId: input.packageId,
    roleTopologyState: input.roleTopologyState,
    runtimePromotionAllowedInGate: false,
    runtimeValues: {
      CI: null,
      CI50_2500: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwPlusC: null
    },
    supportFamily: input.supportFamily,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridorContract():
  BroadAccuracyFloorOpenBoxTimberFormulaCorridorContract {
  const previous = buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract();

  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
        finishPairState: "complete_laminate_eps",
        packageId: "dry_gypsum_fiber_upper",
        roleTopologyState: "source_equivalent",
        supportFamily: "open_box_timber",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "IIC"]
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
        finishPairState: "complete_laminate_eps",
        packageId: "thin_laminate_eps_no_upper",
        roleTopologyState: "source_equivalent",
        supportFamily: "open_box_timber",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
        finishPairState: "complete_laminate_eps",
        packageId: "reinforced_ceiling_laminate",
        roleTopologyState: "source_equivalent",
        supportFamily: "open_box_timber",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
        finishPairState: "complete_laminate_eps",
        packageId: "eps_screed_or_hybrid_upper",
        roleTopologyState: "source_equivalent",
        supportFamily: "open_box_timber",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
        finishPairState: "complete_laminate_eps",
        packageId: "mixed_staged_upper",
        roleTopologyState: "source_equivalent",
        supportFamily: "open_box_timber",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "Select only same-family TUAS open-box timber rows on the 370 mm open-box timber slab.",
      "Clean predictor-owned packets define source-absent design metrics by packet mean until a later runtime gate owns residual policy.",
      "Hybrid or staged exact-only packets are visible as blocked evidence and cannot seed source-absent transfer in this gate.",
      "Gate formula-corridor defines design payloads and budgets only; public runtime values stay frozen until the selected runtime-corridor gate."
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousTransferOwner: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_same_family_tuas_open_box_rows_not_open_web_steel_rows",
      "public_runtime_must_keep_exact_tuas_rows_ahead_of_formula_rows",
      "public_runtime_must_require_complete_laminate_eps_finish_when_finish_transfer_is_requested",
      "public_runtime_must_keep_exact_only_hybrid_and_mixed_staged_packets_blocked_until_fragmented_equivalence_policy_lands",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: true,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}
