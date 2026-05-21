import type { RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract
} from "./broad-accuracy-floor-open-web-raw-bare-carrier-owner";
import { clamp, log10Safe, round1 } from "./math";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor open-web raw-bare runtime corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor";

export type BroadAccuracyFloorOpenWebRawBareFormulaMetricId =
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw";

export type BroadAccuracyFloorOpenWebRawBareFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_exact_source_precedence"
  | "blocked_hostile_topology"
  | "blocked_missing_owner_fields"
  | "blocked_missing_source_or_physics_basis"
  | "blocked_nonfinite_geometry"
  | "blocked_package_evidence"
  | "blocked_partial_or_ambiguous_reference_surface"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorOpenWebRawBareSupportFamily =
  | "lightweight_steel"
  | "open_box_timber"
  | "unknown";

export type BroadAccuracyFloorOpenWebRawBareSupportForm =
  | "joist_or_purlin"
  | "open_web_or_rolled"
  | "other_floor_carrier";

export type BroadAccuracyFloorOpenWebRawBareSupportMaterial =
  | "open_web_steel_floor"
  | "other_floor_material";

export type BroadAccuracyFloorOpenWebRawBareReferenceSurfaceState =
  | "explicit_bare_steel_walking_surface"
  | "inex_or_finish_package_present"
  | "missing_or_ambiguous";

export type BroadAccuracyFloorOpenWebRawBareLowerTreatmentState =
  | "direct_fixed_ceiling"
  | "explicit_none"
  | "missing_or_ambiguous"
  | "suspended_ceiling_elastic_hanger";

export type BroadAccuracyFloorOpenWebRawBarePackageEvidenceState =
  | "no_package"
  | "partial_lower_package"
  | "partial_upper_package"
  | "ubiq_inex_firestop_package";

export type BroadAccuracyFloorOpenWebRawBareRoleTopologyState =
  | "ambiguous_duplicate_or_overlap"
  | "safe_split_equivalent"
  | "source_equivalent";

export type BroadAccuracyFloorOpenWebRawBareSourceOrPhysicsBasis =
  | "missing"
  | "source_absent_physics_model"
  | "source_owned_bare_packet";

export type BroadAccuracyFloorOpenWebRawBareRequestedBasis =
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type BroadAccuracyFloorOpenWebRawBareFormulaTermId =
  | "airborne_direct_curve_open_web_mobility"
  | "bare_impact_reference_curve_structural_mobility"
  | "bare_reference_surface_and_package_exclusion"
  | "exact_source_and_package_precedence"
  | "hostile_topology_and_safe_split_equivalence"
  | "iso717_metric_adapter_boundaries"
  | "open_web_support_form_and_geometry"
  | "source_absent_budget_decomposition";

export type BroadAccuracyFloorOpenWebRawBareFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorOpenWebRawBareFormulaTermId;
};

export type BroadAccuracyFloorOpenWebRawBareErrorBudgetTermId =
  | "bare_steel_walking_surface_model_gap"
  | "carrier_only_holdout_absence"
  | "input_precision"
  | "iso717_adapter_uncertainty"
  | "package_exclusion_uncertainty"
  | "structural_mobility_simplification";

export type BroadAccuracyFloorOpenWebRawBareErrorBudgetTerm = {
  readonly basis: "source_absent_raw_bare_open_web_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorOpenWebRawBareErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorOpenWebRawBareErrorBudget = {
  readonly metricId: BroadAccuracyFloorOpenWebRawBareFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly BroadAccuracyFloorOpenWebRawBareErrorBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorOpenWebRawBareDesignMetrics = {
  readonly C: number | null;
  readonly CI: number | null;
  readonly CI50_2500: number | null;
  readonly Ctr: number | null;
  readonly LnW: number | null;
  readonly LnWPlusCI: number | null;
  readonly Rw: number | null;
};

export type BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput = {
  readonly bareCarrierSurfaceMassKgM2?: number;
  readonly bareReferenceSurfaceState: BroadAccuracyFloorOpenWebRawBareReferenceSurfaceState;
  readonly carrierDepthMm?: number;
  readonly carrierGaugeOrMassKgM2?: number;
  readonly carrierSpacingMm?: number;
  readonly chordWidthMm?: number;
  readonly exactSourceId?: string;
  readonly lowerTreatmentState: BroadAccuracyFloorOpenWebRawBareLowerTreatmentState;
  readonly lossFactor?: number;
  readonly openWebVoidRatio?: number;
  readonly packageEvidenceState: BroadAccuracyFloorOpenWebRawBarePackageEvidenceState;
  readonly requestedBasis?: BroadAccuracyFloorOpenWebRawBareRequestedBasis;
  readonly roleTopologyState: BroadAccuracyFloorOpenWebRawBareRoleTopologyState;
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorOpenWebRawBareSourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorOpenWebRawBareSupportFamily;
  readonly supportForm: BroadAccuracyFloorOpenWebRawBareSupportForm;
  readonly supportMaterial: BroadAccuracyFloorOpenWebRawBareSupportMaterial;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly webDepthMm?: number;
};

export type BroadAccuracyFloorOpenWebRawBareFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly corridorStatus: BroadAccuracyFloorOpenWebRawBareFormulaStatus;
  readonly designMetrics: BroadAccuracyFloorOpenWebRawBareDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaTerms: readonly BroadAccuracyFloorOpenWebRawBareFormulaTerm[];
  readonly missingOwnerFields: readonly string[];
  readonly packageEvidenceForbidden: readonly BroadAccuracyFloorOpenWebRawBarePackageEvidenceState[];
  readonly requestedBasis: BroadAccuracyFloorOpenWebRawBareRequestedBasis;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly C: null;
    readonly CI: null;
    readonly CI50_2500: null;
    readonly Ctr: null;
    readonly LnW: null;
    readonly LnWPlusCI: null;
    readonly Rw: null;
  };
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorOpenWebRawBareSourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorOpenWebRawBareSupportFamily;
  readonly supportForm: BroadAccuracyFloorOpenWebRawBareSupportForm;
  readonly supportMaterial: BroadAccuracyFloorOpenWebRawBareSupportMaterial;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenWebRawBareErrorBudget[];
};

export type BroadAccuracyFloorOpenWebRawBareFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorOpenWebRawBareFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorOpenWebRawBareFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousCarrierOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly toleranceBudgets: readonly BroadAccuracyFloorOpenWebRawBareErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);

const NULL_DESIGN_METRICS = {
  C: null,
  CI: null,
  CI50_2500: null,
  Ctr: null,
  LnW: null,
  LnWPlusCI: null,
  Rw: null
} as const satisfies BroadAccuracyFloorOpenWebRawBareDesignMetrics;

const NULL_RUNTIME_VALUES = {
  C: null,
  CI: null,
  CI50_2500: null,
  Ctr: null,
  LnW: null,
  LnWPlusCI: null,
  Rw: null
} as const;

const FORBIDDEN_PACKAGE_EVIDENCE_STATES = [
  "ubiq_inex_firestop_package",
  "partial_lower_package",
  "partial_upper_package"
] as const satisfies readonly BroadAccuracyFloorOpenWebRawBarePackageEvidenceState[];

const FORMULA_TERMS = [
  {
    description: "Own lightweight-steel open-web support form before replacing raw carrier screening.",
    owner: "rawBareOpenWebSupportFormOwner",
    requiredInputs: [
      "supportFamily=lightweight_steel",
      "supportForm=open_web_or_rolled",
      "supportMaterial=open_web_steel_floor",
      "carrierDepthMm",
      "carrierSpacingMm",
      "carrierGaugeOrMassKgM2"
    ],
    runtimeOwnedInGate: false,
    termId: "open_web_support_form_and_geometry"
  },
  {
    description: "Normalize open-web mobility from depth, spacing, chord width, void ratio, web depth, surface mass, and loss factor.",
    owner: "rawBareOpenWebStructuralMobilityOwner",
    requiredInputs: [
      "bareCarrierSurfaceMassKgM2",
      "webDepthMm",
      "chordWidthMm",
      "openWebVoidRatio",
      "carrierSpacingMm",
      "lossFactor"
    ],
    runtimeOwnedInGate: false,
    termId: "airborne_direct_curve_open_web_mobility"
  },
  {
    description: "Derive a bare walking-surface impact curve from open-web mobility without borrowing INEX or firestop package rows.",
    owner: "rawBareOpenWebImpactReferenceOwner",
    requiredInputs: [
      "bareReferenceSurfaceState=explicit_bare_steel_walking_surface",
      "bareSteelReferenceSurfaceClass",
      "structuralMobilityModel",
      "impactRadiationEfficiency",
      "iso717ImpactRatingAdapter"
    ],
    runtimeOwnedInGate: false,
    termId: "bare_impact_reference_curve_structural_mobility"
  },
  {
    description: "Require an explicit bare reference surface and no upper or lower package evidence before using the raw-bare route.",
    owner: "rawBareOpenWebPackageExclusionOwner",
    requiredInputs: [
      "bareReferenceSurfaceState=explicit_bare_steel_walking_surface",
      "packageEvidenceState=no_package",
      "lowerTreatmentState=explicit_none",
      "inexDeckAbsence=true",
      "firestopBoardAbsence=true"
    ],
    runtimeOwnedInGate: false,
    termId: "bare_reference_surface_and_package_exclusion"
  },
  {
    description: "Keep exact measured full packages and UBIQ INEX/firestop rows ahead of any source-absent raw-bare formula.",
    owner: "rawBareOpenWebExactAndPackagePrecedenceOwner",
    requiredInputs: ["exactSourceId", "packageEvidenceState", "sameStackMetricBasis"],
    runtimeOwnedInGate: false,
    termId: "exact_source_and_package_precedence"
  },
  {
    description: "Keep Rw/C/Ctr and Ln,w/CI/CI,50-2500 on element-lab ISO bases; field, building, and ASTM/IIC need separate owners.",
    owner: "rawBareOpenWebIso717MetricBoundaryOwner",
    requiredInputs: ["requestedBasis=element_lab", "iso717AirborneRatingAdapter", "iso717ImpactRatingAdapter"],
    runtimeOwnedInGate: false,
    termId: "iso717_metric_adapter_boundaries"
  },
  {
    description: "Treat safe split carriers as equivalent while ambiguous duplicate, overlapping, or roleless carrier ownership fails closed.",
    owner: "rawBareOpenWebHostileTopologyOwner",
    requiredInputs: ["roleTopologyState", "duplicateCarrierPolicy", "safeSplitEquivalencePolicy"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_and_safe_split_equivalence"
  },
  {
    description: "Attach wide not-measured source-absent budgets until source-owned raw-bare open-web holdouts exist.",
    owner: "rawBareOpenWebSourceAbsentBudgetOwner",
    requiredInputs: [
      "RwToleranceBudgetOwner",
      "LnWToleranceBudgetOwner",
      "CIBudgetOwner",
      "LnWPlusCIBudgetOwner",
      "inputPrecisionBudgetOwner"
    ],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  }
] as const satisfies readonly BroadAccuracyFloorOpenWebRawBareFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Rw", 9),
  buildBudget("C", 3),
  buildBudget("Ctr", 4.5),
  buildBudget("Ln,w", 12),
  buildBudget("CI", 4),
  buildBudget("CI,50-2500", 5),
  buildBudget("Ln,w+CI", 12.5)
] as const satisfies readonly BroadAccuracyFloorOpenWebRawBareErrorBudget[];

function buildBudget(
  metricId: BroadAccuracyFloorOpenWebRawBareFormulaMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorOpenWebRawBareErrorBudget {
  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: 1.25,
        termId: "input_precision",
        tightenRequires: ["explicit_open_web_depth_spacing_gauge_and_mass_measurement"]
      },
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: 1.5,
        termId: "structural_mobility_simplification",
        tightenRequires: ["source_owned_open_web_mobility_or_frequency_response_packet"]
      },
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: 1.25,
        termId: "bare_steel_walking_surface_model_gap",
        tightenRequires: ["source_owned_bare_steel_reference_surface_impact_curve"]
      },
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: 0.75,
        termId: "package_exclusion_uncertainty",
        tightenRequires: ["source_owned_no_inex_no_firestop_no_finish_packet"]
      },
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: 0.75,
        termId: "iso717_adapter_uncertainty",
        tightenRequires: ["raw_open_web_frequency_band_curve_holdout"]
      },
      {
        basis: "source_absent_raw_bare_open_web_formula_design_budget",
        db: Math.max(0, totalBudgetDb - 5.5),
        termId: "carrier_only_holdout_absence",
        tightenRequires: ["source_owned_raw_bare_open_web_lab_holdout"]
      }
    ],
    totalBudgetDb
  };
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

function missingOwnerFields(input: BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput): readonly string[] {
  const fields = [
    "carrierDepthMm",
    "carrierSpacingMm",
    "carrierGaugeOrMassKgM2",
    "bareCarrierSurfaceMassKgM2",
    "webDepthMm",
    "chordWidthMm",
    "openWebVoidRatio",
    "lossFactor"
  ] as const;

  return fields.filter((field) => !Number.isFinite(input[field]));
}

function geometryOutOfRange(input: RequiredFormulaGeometry): boolean {
  return (
    input.carrierDepthMm < 150 ||
    input.carrierDepthMm > 600 ||
    input.carrierSpacingMm < 250 ||
    input.carrierSpacingMm > 1200 ||
    input.carrierGaugeOrMassKgM2 <= 0 ||
    input.bareCarrierSurfaceMassKgM2 <= 0 ||
    input.webDepthMm <= 0 ||
    input.chordWidthMm <= 0 ||
    input.openWebVoidRatio < 0.2 ||
    input.openWebVoidRatio > 0.95 ||
    input.lossFactor < 0.001 ||
    input.lossFactor > 0.2
  );
}

type RequiredFormulaGeometry = Required<
  Pick<
    BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput,
    | "bareCarrierSurfaceMassKgM2"
    | "carrierDepthMm"
    | "carrierGaugeOrMassKgM2"
    | "carrierSpacingMm"
    | "chordWidthMm"
    | "lossFactor"
    | "openWebVoidRatio"
    | "webDepthMm"
  >
>;

function getRequiredGeometry(
  input: BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput
): RequiredFormulaGeometry | null {
  if (missingOwnerFields(input).length > 0) {
    return null;
  }

  return {
    bareCarrierSurfaceMassKgM2: input.bareCarrierSurfaceMassKgM2 as number,
    carrierDepthMm: input.carrierDepthMm as number,
    carrierGaugeOrMassKgM2: input.carrierGaugeOrMassKgM2 as number,
    carrierSpacingMm: input.carrierSpacingMm as number,
    chordWidthMm: input.chordWidthMm as number,
    lossFactor: input.lossFactor as number,
    openWebVoidRatio: input.openWebVoidRatio as number,
    webDepthMm: input.webDepthMm as number
  };
}

function calculateDesignMetrics(input: RequiredFormulaGeometry): BroadAccuracyFloorOpenWebRawBareDesignMetrics {
  const massRatio = input.bareCarrierSurfaceMassKgM2 / 28;
  const gaugeRatio = input.carrierGaugeOrMassKgM2 / 14;
  const depthRatio = input.carrierDepthMm / 300;
  const spacingRatio = input.carrierSpacingMm / 600;
  const chordRatio = input.chordWidthMm / 50;
  const webDepthRatio = input.webDepthMm / 240;
  const voidDelta = input.openWebVoidRatio - 0.72;
  const lossDelta = log10Safe(input.lossFactor / 0.015);
  const mobilityPenaltyDb = clamp(
    ((spacingRatio - 1) * 2) +
      (voidDelta * 3) -
      (2 * log10Safe(webDepthRatio)) -
      (1.5 * log10Safe(chordRatio)),
    -4,
    5
  );
  const rw = round1(
    clamp(
      32 +
        (18 * log10Safe(massRatio)) +
        (3 * log10Safe(gaugeRatio)) +
        (2 * log10Safe(depthRatio)) +
        log10Safe(chordRatio) -
        (4 * voidDelta) +
        (4 * lossDelta),
      20,
      55
    )
  );
  const c = round1(clamp(-2.2 - (1.2 * voidDelta) + (1.2 * lossDelta), -7, 0.5));
  const ctr = round1(clamp(c - 5.6 - (2 * voidDelta), -14, -3));
  const lnW = round1(
    clamp(
      96 -
        (10 * log10Safe(massRatio)) -
        (2 * log10Safe(gaugeRatio)) -
        log10Safe(depthRatio) +
        mobilityPenaltyDb -
        (4 * lossDelta),
      70,
      115
    )
  );
  const ci = round1(clamp(1.8 + (1.6 * voidDelta) + (0.4 * mobilityPenaltyDb) - lossDelta, -3, 6));
  const ci50_2500 = round1(clamp(5.2 + (2.3 * voidDelta) + (0.5 * mobilityPenaltyDb) - (1.5 * lossDelta), 0, 10));

  return {
    C: c,
    CI: ci,
    CI50_2500: ci50_2500,
    Ctr: ctr,
    LnW: lnW,
    LnWPlusCI: round1(lnW + ci),
    Rw: rw
  };
}

function makeEvaluation(
  input: BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput,
  corridorStatus: BroadAccuracyFloorOpenWebRawBareFormulaStatus,
  designMetrics: BroadAccuracyFloorOpenWebRawBareDesignMetrics,
  missingOwnerFieldsForInput: readonly string[]
): BroadAccuracyFloorOpenWebRawBareFormulaEvaluation {
  const requestedBasis = input.requestedBasis ?? "element_lab";
  const split = splitOutputs(input.targetOutputs);

  return {
    affectedFormulaOutputs: corridorStatus === "blocked_basis_alias" ? [] : split.affectedFormulaOutputs,
    basisId: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs: corridorStatus === "blocked_basis_alias" ? [...split.affectedFormulaOutputs, ...split.blockedFormulaOutputs] : split.blockedFormulaOutputs,
    corridorStatus,
    designMetrics,
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: input.exactSourceId ?? null,
    formulaTerms: FORMULA_TERMS,
    missingOwnerFields: missingOwnerFieldsForInput,
    packageEvidenceForbidden: FORBIDDEN_PACKAGE_EVIDENCE_STATES,
    requestedBasis,
    runtimePromotionAllowedInGate: false,
    runtimeValues: NULL_RUNTIME_VALUES,
    sourceOrPhysicsBasis: input.sourceOrPhysicsBasis,
    supportFamily: input.supportFamily,
    supportForm: input.supportForm,
    supportMaterial: input.supportMaterial,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

export function evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor(
  input: BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput
): BroadAccuracyFloorOpenWebRawBareFormulaEvaluation {
  const requestedBasis = input.requestedBasis ?? "element_lab";
  const missing = missingOwnerFields(input);
  const geometry = getRequiredGeometry(input);
  const designMetrics = geometry && !geometryOutOfRange(geometry) ? calculateDesignMetrics(geometry) : NULL_DESIGN_METRICS;

  if (
    input.supportFamily !== "lightweight_steel" ||
    input.supportForm !== "open_web_or_rolled" ||
    input.supportMaterial !== "open_web_steel_floor"
  ) {
    return makeEvaluation(input, "blocked_wrong_support_family", NULL_DESIGN_METRICS, missing);
  }
  if (input.exactSourceId) {
    return makeEvaluation(input, "blocked_exact_source_precedence", designMetrics, missing);
  }
  if (input.packageEvidenceState !== "no_package") {
    return makeEvaluation(input, "blocked_package_evidence", designMetrics, missing);
  }
  if (
    input.bareReferenceSurfaceState !== "explicit_bare_steel_walking_surface" ||
    input.lowerTreatmentState !== "explicit_none"
  ) {
    return makeEvaluation(input, "blocked_partial_or_ambiguous_reference_surface", designMetrics, missing);
  }
  if (input.roleTopologyState === "ambiguous_duplicate_or_overlap") {
    return makeEvaluation(input, "blocked_hostile_topology", designMetrics, missing);
  }
  if (input.sourceOrPhysicsBasis === "missing") {
    return makeEvaluation(input, "blocked_missing_source_or_physics_basis", designMetrics, missing);
  }
  if (missing.length > 0) {
    return makeEvaluation(input, "blocked_missing_owner_fields", NULL_DESIGN_METRICS, missing);
  }
  if (!geometry || geometryOutOfRange(geometry)) {
    return makeEvaluation(input, "blocked_nonfinite_geometry", NULL_DESIGN_METRICS, missing);
  }
  if (requestedBasis !== "element_lab") {
    return makeEvaluation(input, "blocked_basis_alias", designMetrics, missing);
  }

  return makeEvaluation(input, "formula_corridor_defined_runtime_gate_required", designMetrics, missing);
}

const REFERENCE_CANDIDATE = {
  bareCarrierSurfaceMassKgM2: 28,
  bareReferenceSurfaceState: "explicit_bare_steel_walking_surface",
  carrierDepthMm: 300,
  carrierGaugeOrMassKgM2: 14,
  carrierSpacingMm: 600,
  chordWidthMm: 50,
  lowerTreatmentState: "explicit_none",
  lossFactor: 0.015,
  openWebVoidRatio: 0.72,
  packageEvidenceState: "no_package",
  roleTopologyState: "source_equivalent",
  sourceOrPhysicsBasis: "source_absent_physics_model",
  supportFamily: "lightweight_steel",
  supportForm: "open_web_or_rolled",
  supportMaterial: "open_web_steel_floor",
  targetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
  webDepthMm: 240
} as const satisfies BroadAccuracyFloorOpenWebRawBareFormulaEvaluationInput;

export function buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract():
  BroadAccuracyFloorOpenWebRawBareFormulaCorridorContract {
  buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract();

  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor(REFERENCE_CANDIDATE),
      evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
        ...REFERENCE_CANDIDATE,
        bareCarrierSurfaceMassKgM2: 42,
        carrierDepthMm: 400,
        carrierGaugeOrMassKgM2: 18,
        chordWidthMm: 60,
        lossFactor: 0.02,
        openWebVoidRatio: 0.66,
        webDepthMm: 330
      }),
      evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
        ...REFERENCE_CANDIDATE,
        requestedBasis: "field",
        targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "element_lab_Rw_uses_open_web_surface_mass_gauge_depth_chord_void_and_loss_factor",
      "element_lab_LnW_uses_bare_steel_reference_surface_and_structural_mobility_proxy",
      "CI_and_CI_50_2500_are_iso717_impact_adapter_terms_not_iic_or_field_aliases",
      "ubiq_inex_firestop_rows_are_package_evidence_not_raw_bare_carrier_calibration",
      "runtime_values_remain_null_until_the_selected_runtime_corridor_owns_public_candidate_selection"
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousCarrierOwner: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_open_web_raw_bare_formula_basis_not_screening_or_package_basis",
      "raw_bare_runtime_must_require_explicit_bare_reference_surface_and_no_inex_firestop_package",
      "carrier_geometry_depth_spacing_mass_void_ratio_and_loss_factor_must_be_finite",
      "exact_source_and_ubiq_package_rows_must_precede_source_absent_raw_bare_formula",
      "formula_surface_must_show_not_measured_budgets_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}
