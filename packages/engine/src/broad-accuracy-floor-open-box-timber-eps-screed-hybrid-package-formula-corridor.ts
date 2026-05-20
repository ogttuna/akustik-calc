import type { RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor open-box timber EPS/screed hybrid package runtime corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaMetricId =
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw"
  | "Rw+C";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_disjoint_duplicate_roles"
  | "blocked_dry_package_route"
  | "blocked_exact_source_precedence"
  | "blocked_lower_missing_mass_boundary"
  | "blocked_missing_owner_fields"
  | "blocked_mixed_staged_upper_boundary"
  | "blocked_partial_finish_boundary"
  | "blocked_screed_only_boundary"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSupportFamily =
  | "mass_timber_clt"
  | "open_box_timber"
  | "open_web_steel"
  | "unknown";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageUpperState =
  | "complete_eps_screed_laminate"
  | "dry_gypsum_fiber_upper"
  | "mixed_staged_upper"
  | "partial_laminate_eps"
  | "screed_only_missing_upper_fill";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageLowerState =
  | "hybrid_family_a_resilient_stud"
  | "missing_lower_mass"
  | "tuas_family_a_or_b"
  | "unknown";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState =
  | "disjoint_duplicate_roles"
  | "safe_split_equivalent"
  | "source_equivalent";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRequestedBasis =
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTermId =
  | "element_lab_iso717_metric_boundaries"
  | "exact_source_and_generic_package_transfer_exclusion"
  | "hostile_topology_and_safe_split_equivalence"
  | "hybrid_lower_treatment_transfer"
  | "open_box_370mm_support_geometry"
  | "r7b_same_stack_anchor_packet"
  | "sibling_negative_boundary_residuals"
  | "source_absent_budget_decomposition"
  | "wet_eps_screed_upper_transfer";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTermId;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTermId =
  | "hybrid_lower_transfer"
  | "input_precision"
  | "r7b_single_packet_anchor"
  | "sibling_negative_boundary_spread"
  | "source_table_rounding"
  | "wet_eps_screed_mass_resilience_transfer";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTerm = {
  readonly basis: "source_absent_eps_screed_hybrid_package_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget = {
  readonly metricId: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageDesignMetrics = {
  readonly C: number | null;
  readonly CI: number | null;
  readonly CI50_2500: number | null;
  readonly LnW: number | null;
  readonly LnWPlusCI: number | null;
  readonly Rw: number | null;
  readonly RwPlusC: number | null;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput = {
  readonly ceilingBoardLayerCount?: number;
  readonly ceilingBoardThicknessMm?: number;
  readonly ceilingFillThicknessMm?: number;
  readonly exactSourceId?: string;
  readonly floatingScreedMassKgM2?: number;
  readonly lowerState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageLowerState;
  readonly packageUpperState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageUpperState;
  readonly requestedBasis?: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRequestedBasis;
  readonly resilientLayerThicknessMm?: number;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState;
  readonly separatorThicknessMm?: number;
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSupportFamily;
  readonly supportThicknessMm?: number;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly upperFillThicknessMm?: number;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly anchorSourceIds: readonly string[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly blockedSourceIds: readonly string[];
  readonly corridorStatus: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaStatus;
  readonly designMetrics: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTerm[];
  readonly genericPackageTransferBasisForbidden: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly lowerState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageLowerState;
  readonly missingOwnerFields: readonly string[];
  readonly packageUpperState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageUpperState;
  readonly requestedBasis: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRequestedBasis;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly C: null;
    readonly CI: null;
    readonly CI50_2500: null;
    readonly LnW: null;
    readonly LnWPlusCI: null;
    readonly Rw: null;
    readonly RwPlusC: null;
  };
  readonly supportFamily: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSupportFamily;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget[];
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly forbiddenBorrowedGenericPackageTransferBasis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousPackageOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: true;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);

const FORMULA_TERMS = [
  {
    description: "Use the owned R7b same-stack TUAS lab packet as the single EPS/screed hybrid package design anchor.",
    owner: "epsScreedHybridR7bSameStackAnchorOwner",
    requiredInputs: ["sourceId=tuas_r7b_open_box_timber_measured_2026", "Ln,w", "CI", "CI,50-2500", "Rw", "Rw+C"],
    runtimeOwnedInGate: false,
    termId: "r7b_same_stack_anchor_packet"
  },
  {
    description: "Keep the corridor fixed to the 370 mm open-box timber slab until another support owner exists.",
    owner: "epsScreedHybridOpenBoxSupportGeometryOwner",
    requiredInputs: ["supportFamily=open_box_timber", "supportForm=open_box_timber_slab", "supportThicknessMm=370"],
    runtimeOwnedInGate: false,
    termId: "open_box_370mm_support_geometry"
  },
  {
    description: "Own the wet EPS board, geotextile separator, and screed transfer as a separate package from dry gypsum-fiber floors.",
    owner: "epsScreedHybridWetUpperTransferOwner",
    requiredInputs: [
      "upperFill.materialId=eps_floor_insulation_board",
      "upperFill.thicknessMm=35",
      "separator.materialId=geotextile",
      "separator.thicknessMm=1",
      "floatingScreed.materialId=screed",
      "floatingScreed.thicknessMm=40",
      "floatingScreedMassKgM2"
    ],
    runtimeOwnedInGate: false,
    termId: "wet_eps_screed_upper_transfer"
  },
  {
    description: "Own the hybrid lower treatment separately from family A/B and missing-mass lower packages.",
    owner: "epsScreedHybridLowerTreatmentTransferOwner",
    requiredInputs: [
      "lowerState=hybrid_family_a_resilient_stud",
      "ceilingCavity.thicknessScheduleMm=45+25",
      "ceilingFill.thicknessMm=100",
      "ceilingBoard.layerCount=2",
      "ceilingBoard.thicknessMm=13"
    ],
    runtimeOwnedInGate: false,
    termId: "hybrid_lower_treatment_transfer"
  },
  {
    description: "Use R8b, R9b, R2c, and R10a only as negative boundaries around partial, screed-only, missing-mass, and mixed-staged packets.",
    owner: "epsScreedHybridSiblingNegativeBoundaryOwner",
    requiredInputs: [
      "partialFinishNegative=tuas_r8b_open_box_timber_measured_2026",
      "screedOnlyNegative=tuas_r9b_open_box_timber_measured_2026",
      "missingMassNegative=tuas_r2c_open_box_timber_measured_2026",
      "mixedStagedNegative=tuas_r10a_open_box_timber_measured_2026"
    ],
    runtimeOwnedInGate: false,
    termId: "sibling_negative_boundary_residuals"
  },
  {
    description: "Keep exact measured rows and the older dry-package transfer corridor ahead of this source-absent formula corridor.",
    owner: "epsScreedHybridExactAndGenericTransferExclusionOwner",
    requiredInputs: ["exactSourceId", "genericPackageTransferBasis", "dryPackageRouteExclusion"],
    runtimeOwnedInGate: false,
    termId: "exact_source_and_generic_package_transfer_exclusion"
  },
  {
    description: "Keep Rw/C/Rw+C and Ln,w/CI/CI,50-2500/Ln,w+CI on element-lab ISO bases.",
    owner: "epsScreedHybridIso717MetricBoundaryOwner",
    requiredInputs: ["requestedBasis=element_lab", "notFieldBasis", "notBuildingPredictionBasis", "notAstmIicAiicBasis"],
    runtimeOwnedInGate: false,
    termId: "element_lab_iso717_metric_boundaries"
  },
  {
    description: "Treat safe split schedules as source-equivalent, while disjoint duplicates and overlaps fail closed.",
    owner: "epsScreedHybridHostileTopologyOwner",
    requiredInputs: ["roleTopologyState", "safeSplitEquivalencePolicy", "duplicateRoleRefusalPolicy"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_and_safe_split_equivalence"
  },
  {
    description: "Attach not-measured budgets until source-owned same-stack sweeps and negative-boundary residuals support tightening.",
    owner: "epsScreedHybridSourceAbsentBudgetOwner",
    requiredInputs: [
      "RwBudget",
      "CBudget",
      "LnWBudget",
      "CIBudget",
      "wetDryInteractionBudget",
      "hybridLowerTransferBudget"
    ],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Rw", 7),
  buildBudget("C", 3),
  buildBudget("Rw+C", 7.5),
  buildBudget("Ln,w", 8),
  buildBudget("CI", 2.5),
  buildBudget("CI,50-2500", 3),
  buildBudget("Ln,w+CI", 8.5)
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildBudget(
  metricId: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget {
  const sourceTableRounding = round1(totalBudgetDb * 0.12);
  const singlePacketAnchor = round1(totalBudgetDb * 0.24);
  const wetUpperTransfer = round1(totalBudgetDb * 0.22);
  const hybridLowerTransfer = round1(totalBudgetDb * 0.18);
  const siblingNegativeSpread = round1(totalBudgetDb * 0.14);
  const inputPrecision = round1(
    totalBudgetDb - sourceTableRounding - singlePacketAnchor - wetUpperTransfer - hybridLowerTransfer - siblingNegativeSpread
  );

  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: sourceTableRounding,
        termId: "source_table_rounding",
        tightenRequires: ["source_owned_unrounded_tuas_eps_screed_lab_values"]
      },
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: singlePacketAnchor,
        termId: "r7b_single_packet_anchor",
        tightenRequires: ["additional_same_stack_eps_screed_hybrid_holdouts"]
      },
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: wetUpperTransfer,
        termId: "wet_eps_screed_mass_resilience_transfer",
        tightenRequires: ["same_lower_family_eps_screed_thickness_sweep_holdouts"]
      },
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: hybridLowerTransfer,
        termId: "hybrid_lower_transfer",
        tightenRequires: ["same_upper_package_lower_hybrid_transfer_holdouts"]
      },
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: siblingNegativeSpread,
        termId: "sibling_negative_boundary_spread",
        tightenRequires: ["r8b_r9b_r2c_r10a_source_owned_boundary_residual_policy"]
      },
      {
        basis: "source_absent_eps_screed_hybrid_package_formula_design_budget",
        db: inputPrecision,
        termId: "input_precision",
        tightenRequires: ["explicit_screed_density_mass_and_dynamic_stiffness_inputs"]
      }
    ],
    totalBudgetDb
  };
}

function emptyMetrics(): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageDesignMetrics {
  return {
    C: null,
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

function missingOwnerFields(
  input: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput
): readonly string[] {
  const missing: string[] = [];

  if (input.supportThicknessMm !== 370) {
    missing.push("supportThicknessMm=370");
  }

  if (input.upperFillThicknessMm !== 35) {
    missing.push("upperFillThicknessMm=35");
  }

  if (input.separatorThicknessMm !== 1) {
    missing.push("separatorThicknessMm=1");
  }

  if (typeof input.floatingScreedMassKgM2 !== "number" || !Number.isFinite(input.floatingScreedMassKgM2)) {
    missing.push("floatingScreedMassKgM2");
  }

  if (input.resilientLayerThicknessMm !== 3) {
    missing.push("resilientLayerThicknessMm=3");
  }

  if (input.ceilingFillThicknessMm !== 100) {
    missing.push("ceilingFillThicknessMm=100");
  }

  if (input.ceilingBoardLayerCount !== 2) {
    missing.push("ceilingBoardLayerCount=2");
  }

  if (input.ceilingBoardThicknessMm !== 13) {
    missing.push("ceilingBoardThicknessMm=13");
  }

  return missing;
}

function statusForInput(
  input: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput,
  missing: readonly string[]
): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaStatus {
  if (input.requestedBasis && input.requestedBasis !== "element_lab") {
    return "blocked_basis_alias";
  }

  if (input.supportFamily !== "open_box_timber") {
    return "blocked_wrong_support_family";
  }

  if (input.roleTopologyState === "disjoint_duplicate_roles") {
    return "blocked_disjoint_duplicate_roles";
  }

  if (input.exactSourceId) {
    return "blocked_exact_source_precedence";
  }

  if (input.packageUpperState === "dry_gypsum_fiber_upper") {
    return "blocked_dry_package_route";
  }

  if (input.packageUpperState === "partial_laminate_eps") {
    return "blocked_partial_finish_boundary";
  }

  if (input.packageUpperState === "screed_only_missing_upper_fill") {
    return "blocked_screed_only_boundary";
  }

  if (input.packageUpperState === "mixed_staged_upper") {
    return "blocked_mixed_staged_upper_boundary";
  }

  if (input.lowerState === "missing_lower_mass") {
    return "blocked_lower_missing_mass_boundary";
  }

  if (missing.length > 0 || input.lowerState !== "hybrid_family_a_resilient_stud") {
    return "blocked_missing_owner_fields";
  }

  return "formula_corridor_defined_runtime_gate_required";
}

function designMetrics(): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageDesignMetrics {
  const packet = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract().candidateExactPacket;

  return {
    C: round1(packet.airborneMetrics.RwPlusC - packet.airborneMetrics.Rw),
    CI: packet.impactMetrics.CI,
    CI50_2500: packet.impactMetrics.CI50_2500,
    LnW: packet.impactMetrics.LnW,
    LnWPlusCI: packet.impactMetrics.LnWPlusCI,
    Rw: packet.airborneMetrics.Rw,
    RwPlusC: round1(packet.airborneMetrics.RwPlusC)
  };
}

export function evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor(
  input: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput
): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluation {
  const { affectedFormulaOutputs, blockedFormulaOutputs } = splitOutputs(input.targetOutputs);
  const missing = missingOwnerFields(input);
  const corridorStatus = statusForInput(input, missing);
  const shouldExposeDesignMetrics = corridorStatus === "formula_corridor_defined_runtime_gate_required";

  return {
    affectedFormulaOutputs: shouldExposeDesignMetrics ? affectedFormulaOutputs : [],
    anchorSourceIds: shouldExposeDesignMetrics ? ["tuas_r7b_open_box_timber_measured_2026"] : [],
    basisId: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs,
    blockedSourceIds:
      corridorStatus === "blocked_partial_finish_boundary" ||
      corridorStatus === "blocked_screed_only_boundary" ||
      corridorStatus === "blocked_lower_missing_mass_boundary" ||
      corridorStatus === "blocked_mixed_staged_upper_boundary"
        ? [
            "tuas_r8b_open_box_timber_measured_2026",
            "tuas_r9b_open_box_timber_measured_2026",
            "tuas_r2c_open_box_timber_measured_2026",
            "tuas_r10a_open_box_timber_measured_2026"
          ]
        : [],
    corridorStatus,
    designMetrics: shouldExposeDesignMetrics ? designMetrics() : emptyMetrics(),
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: input.exactSourceId ?? null,
    formulaTerms: FORMULA_TERMS,
    genericPackageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    lowerState: input.lowerState,
    missingOwnerFields: corridorStatus === "blocked_missing_owner_fields" ? missing : [],
    packageUpperState: input.packageUpperState,
    requestedBasis: input.requestedBasis ?? "element_lab",
    roleTopologyState: input.roleTopologyState,
    runtimePromotionAllowedInGate: false,
    runtimeValues: {
      C: null,
      CI: null,
      CI50_2500: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null,
      RwPlusC: null
    },
    supportFamily: input.supportFamily,
    toleranceBudgets: shouldExposeDesignMetrics ? TOLERANCE_BUDGETS : []
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract():
  BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridorContract {
  const previous = buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract();

  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: previous.basisAliasBlocked,
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor(completeInput("source_equivalent")),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor(completeInput("safe_split_equivalent")),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        exactSourceId: "tuas_r7b_open_box_timber_measured_2026"
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        packageUpperState: "partial_laminate_eps"
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        packageUpperState: "screed_only_missing_upper_fill"
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        lowerState: "missing_lower_mass"
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        packageUpperState: "mixed_staged_upper"
      }),
      evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
        ...completeInput("source_equivalent"),
        requestedBasis: "field",
        targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    forbiddenBorrowedGenericPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    formulaStatement: [
      "Use R7b only as an owned same-stack EPS/screed hybrid design anchor; exact R7b still wins before any formula row.",
      "Define source-absent lab design metrics and budgets for complete EPS board + geotextile + screed + EPS underlay + laminate + hybrid lower stacks.",
      "Keep R8b, R9b, R2c, and R10a as negative boundaries until their missing or mismatched owner terms are explicitly solved.",
      "This formula-corridor gate is no-runtime: cards, APIs, and estimates stay unchanged until the selected runtime-corridor gate."
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousPackageOwner: {
      landedGate: previous.landedGate,
      selectedNextAction: previous.selectedNextAction,
      selectedNextFile: previous.selectedNextFile,
      selectionStatus: previous.selectionStatus
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_keep_open_measured_floor_system_exact_match_ahead_of_eps_screed_formula_rows",
      "public_runtime_must_require_complete_eps_board_geotextile_screed_eps_underlay_laminate_and_hybrid_lower_inputs",
      "public_runtime_must_not_borrow_the_generic_dry_package_transfer_basis",
      "public_runtime_must_block_r8b_r9b_r2c_and_r10a_negative_boundaries",
      "formula_surface_must_show_not_measured_error_budget_for_each_supported_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: true,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

function completeInput(
  roleTopologyState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState
): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaEvaluationInput {
  return {
    ceilingBoardLayerCount: 2,
    ceilingBoardThicknessMm: 13,
    ceilingFillThicknessMm: 100,
    floatingScreedMassKgM2: 84,
    lowerState: "hybrid_family_a_resilient_stud",
    packageUpperState: "complete_eps_screed_laminate",
    requestedBasis: "element_lab",
    resilientLayerThicknessMm: 3,
    roleTopologyState,
    separatorThicknessMm: 1,
    supportFamily: "open_box_timber",
    supportThicknessMm: 370,
    targetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "R'w", "IIC"],
    upperFillThicknessMm: 35
  };
}
