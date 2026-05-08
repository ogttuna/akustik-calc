import {
  buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract,
  type SteelFloorFormulaBudgetTermEvidenceOwner,
  type SteelFloorFormulaBudgetTermReadiness,
  type SteelFloorFormulaBudgetTermReadinessTermId,
} from "./steel-floor-formula-error-budget-calibration-readiness";
import {
  buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract,
  type GateARSteelFloorFormulaCalibrationEvidenceBucket,
} from "./steel-floor-formula-calibration-evidence-intake";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
  GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts";

export const GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_ACTION =
  "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan";

export type GateASSteelFloorFormulaOwnerEvidenceTargetKind =
  | "source_packet_target"
  | "solver_readiness_target";

export type GateASSteelFloorFormulaOwnerEvidenceRejectionBoundary =
  | "reject_astm_iic_stc_field_or_building_basis"
  | "reject_boundary_reference_only"
  | "reject_concrete_or_solid_reference_floor"
  | "reject_missing_source_owned_physical_owner_fields"
  | "reject_product_or_inferred_delta_lw"
  | "require_exact_source_only_for_full_assembly_match";

export type GateASSteelFloorFormulaOwnerEvidenceTarget = {
  readonly acquisitionFeasibilityScore: number;
  readonly calculatorImpactScore: number;
  readonly currentAcceptedPacketIds: readonly string[];
  readonly currentBlocker: string;
  readonly evidenceTargetKind: GateASSteelFloorFormulaOwnerEvidenceTargetKind;
  readonly localLedgerGapScore: number;
  readonly metricIds: readonly string[];
  readonly owner: SteelFloorFormulaBudgetTermEvidenceOwner;
  readonly priorityRank: number;
  readonly rejectionBoundaries: readonly GateASSteelFloorFormulaOwnerEvidenceRejectionBoundary[];
  readonly rejectionBoundaryRiskScore: number;
  readonly requiredPacketFields: readonly string[];
  readonly selectedForNextGate: boolean;
  readonly termId: SteelFloorFormulaBudgetTermReadinessTermId;
  readonly totalPriorityScore: number;
};

export type GateASSteelFloorFormulaSelectedOwnerTarget = {
  readonly acquisitionPacketShape: {
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly minimumAcceptedPacketCountBeforeRetune: typeof GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT;
    readonly minimumPairedNegativeBoundaryCountBeforeRetune: typeof GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly referenceFloor: "same_stack_steel";
    readonly requiredSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  };
  readonly target: GateASSteelFloorFormulaOwnerEvidenceTarget;
};

export type GateASSteelFloorFormulaOwnerEvidenceTargetingContract = {
  readonly currentLedgerSnapshot: {
    readonly acceptedSourceOwnedPacketIds: readonly string[];
    readonly bucketCounts: readonly {
      readonly bucket: GateARSteelFloorFormulaCalibrationEvidenceBucket;
      readonly count: number;
    }[];
    readonly rejectedCandidateIds: readonly string[];
  };
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_as_steel_floor_formula_owner_evidence_targeting_plan";
  readonly ownerTargetingScope: {
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly exactRowsAreExactOverridesOnlyOnFullAssemblyMatch: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceRowsAreCalibrationEvidenceNotProduct: true;
  };
  readonly previousLandedGate: "gate_ar_steel_floor_formula_calibration_evidence_intake_plan";
  readonly rankedOwnerTargets: readonly GateASSteelFloorFormulaOwnerEvidenceTarget[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_FILE;
  readonly selectedOwnerTarget: GateASSteelFloorFormulaSelectedOwnerTarget;
  readonly selectionStatus: "gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at";
};

type OwnerPriorityInput = {
  readonly acquisitionFeasibilityScore: number;
  readonly calculatorImpactScore: number;
  readonly evidenceTargetKind: GateASSteelFloorFormulaOwnerEvidenceTargetKind;
  readonly owner: SteelFloorFormulaBudgetTermEvidenceOwner;
  readonly rejectionBoundaryRiskScore: number;
  readonly requiredPacketFields: readonly string[];
};

const SELECTED_TARGET_REJECTION_BOUNDARIES = [
  "reject_product_or_inferred_delta_lw",
  "reject_astm_iic_stc_field_or_building_basis",
  "reject_concrete_or_solid_reference_floor",
  "reject_boundary_reference_only",
  "reject_missing_source_owned_physical_owner_fields",
  "require_exact_source_only_for_full_assembly_match",
] as const satisfies readonly GateASSteelFloorFormulaOwnerEvidenceRejectionBoundary[];

const ownerPriorityInputs = [
  {
    acquisitionFeasibilityScore: 5,
    calculatorImpactScore: 10,
    evidenceTargetKind: "source_packet_target",
    owner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
    rejectionBoundaryRiskScore: 3,
    requiredPacketFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  },
  {
    acquisitionFeasibilityScore: 5,
    calculatorImpactScore: 8,
    evidenceTargetKind: "source_packet_target",
    owner: "same_stack_bare_steel_reference_rows",
    rejectionBoundaryRiskScore: 2,
    requiredPacketFields: [
      "bare_steel_metric_value",
      "topology_and_support_family",
      "carrier_spacing",
      "load_basis",
      "lower_support_class",
    ],
  },
  {
    acquisitionFeasibilityScore: 4,
    calculatorImpactScore: 7,
    evidenceTargetKind: "solver_readiness_target",
    owner: "source_owned_steel_transfer_efficiency_curve",
    rejectionBoundaryRiskScore: 3,
    requiredPacketFields: [
      "support_form_family",
      "source_owned_open_web_or_steel_joist_transfer_curve",
      "carrier_spacing",
      "load_basis",
      "paired_negative_boundary_owner",
    ],
  },
  {
    acquisitionFeasibilityScore: 5,
    calculatorImpactScore: 6,
    evidenceTargetKind: "solver_readiness_target",
    owner: "frequency_dependent_dynamic_stiffness_or_product_curve_owner",
    rejectionBoundaryRiskScore: 2,
    requiredPacketFields: [
      "frequency_dependent_dynamic_stiffness_curve",
      "load_basis",
      "upper_resilient_topology",
      "source_owned_product_or_test_basis",
    ],
  },
  {
    acquisitionFeasibilityScore: 6,
    calculatorImpactScore: 5,
    evidenceTargetKind: "solver_readiness_target",
    owner: "source_owned_load_basis_schedule",
    rejectionBoundaryRiskScore: 2,
    requiredPacketFields: [
      "load_basis_schedule",
      "area_mass_or_service_load",
      "measurement_or_design_standard_basis",
    ],
  },
  {
    acquisitionFeasibilityScore: 4,
    calculatorImpactScore: 5,
    evidenceTargetKind: "source_packet_target",
    owner: "lower_ceiling_support_family_holdouts",
    rejectionBoundaryRiskScore: 3,
    requiredPacketFields: [
      "lower_support_class",
      "support_spacing",
      "ceiling_or_isolation_topology",
      "same_family_holdout_metric",
    ],
  },
  {
    acquisitionFeasibilityScore: 5,
    calculatorImpactScore: 4,
    evidenceTargetKind: "source_packet_target",
    owner: "upper_resilient_topology_holdouts",
    rejectionBoundaryRiskScore: 2,
    requiredPacketFields: [
      "upper_resilient_topology",
      "dynamic_stiffness",
      "load_basis",
      "same_stack_delta_lw_or_ln_w_holdout_metric",
    ],
  },
] as const satisfies readonly OwnerPriorityInput[];

const termReadinessByOwner = (
  terms: readonly SteelFloorFormulaBudgetTermReadiness[],
) => new Map(terms.map((term) => [term.tightenRequires, term] as const));

const acceptedPacketIdsForOwner = (
  owner: SteelFloorFormulaBudgetTermEvidenceOwner,
): readonly string[] => {
  const gateAR = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();

  return gateAR.currentLedger
    .filter(
      (entry) =>
        entry.acceptedForCalibrationResidual &&
        entry.sourceOwnedGateAQOwners.includes(owner),
    )
    .map((entry) => entry.id);
};

const totalPriorityScore = (
  input: OwnerPriorityInput,
  localLedgerGapScore: number,
): number =>
  input.calculatorImpactScore * 10 +
  input.acquisitionFeasibilityScore * 3 +
  localLedgerGapScore -
  input.rejectionBoundaryRiskScore;

const buildRankedOwnerTargets =
  (): readonly GateASSteelFloorFormulaOwnerEvidenceTarget[] => {
    const gateAQ =
      buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();
    const termsByOwner = termReadinessByOwner(gateAQ.termReadiness);
    const ranked = ownerPriorityInputs.map((input) => {
      const term = termsByOwner.get(input.owner);
      if (!term) {
        throw new Error(`Missing Gate AQ term readiness for owner ${input.owner}`);
      }

      const currentAcceptedPacketIds = acceptedPacketIdsForOwner(input.owner);
      const localLedgerGapScore = currentAcceptedPacketIds.length === 0 ? 10 : 0;

      return {
        acquisitionFeasibilityScore: input.acquisitionFeasibilityScore,
        calculatorImpactScore: input.calculatorImpactScore,
        currentAcceptedPacketIds,
        currentBlocker: term.currentBlocker,
        evidenceTargetKind: input.evidenceTargetKind,
        localLedgerGapScore,
        metricIds: term.metricIds,
        owner: input.owner,
        priorityRank: 0,
        rejectionBoundaries: SELECTED_TARGET_REJECTION_BOUNDARIES,
        rejectionBoundaryRiskScore: input.rejectionBoundaryRiskScore,
        requiredPacketFields: input.requiredPacketFields,
        selectedForNextGate: false,
        termId: term.termId,
        totalPriorityScore: totalPriorityScore(input, localLedgerGapScore),
      } satisfies Omit<
        GateASSteelFloorFormulaOwnerEvidenceTarget,
        "priorityRank" | "selectedForNextGate"
      > & {
        readonly priorityRank: 0;
        readonly selectedForNextGate: false;
      };
    });

    return ranked
      .sort((a, b) => b.totalPriorityScore - a.totalPriorityScore)
      .map((target, index) => ({
        ...target,
        priorityRank: index + 1,
        selectedForNextGate: index === 0,
      }));
  };

export function buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract():
  GateASSteelFloorFormulaOwnerEvidenceTargetingContract {
  const gateAR = buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract();
  const rankedOwnerTargets = buildRankedOwnerTargets();
  const selectedTarget = rankedOwnerTargets.find(
    (target) => target.selectedForNextGate,
  );

  if (!selectedTarget) {
    throw new Error("Gate AS must select exactly one owner evidence target");
  }

  return {
    currentLedgerSnapshot: {
      acceptedSourceOwnedPacketIds:
        gateAR.currentLedgerSummary.acceptedSourceOwnedPacketIds,
      bucketCounts: gateAR.currentLedgerSummary.bucketCounts,
      rejectedCandidateIds: gateAR.currentLedgerSummary.rejectedCandidateIds,
    },
    exactMeasuredRowsRemainPrecedence: true,
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
    ownerTargetingScope: {
      broadSourceLibraryCrawlAllowed: false,
      exactRowsAreExactOverridesOnlyOnFullAssemblyMatch: true,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      sourceRowsAreCalibrationEvidenceNotProduct: true,
    },
    previousLandedGate:
      "gate_ar_steel_floor_formula_calibration_evidence_intake_plan",
    rankedOwnerTargets,
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_FILE,
    selectedOwnerTarget: {
      acquisitionPacketShape: {
        metricBasis: "lab_iso_10140_717_2",
        minimumAcceptedPacketCountBeforeRetune:
          GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
        minimumPairedNegativeBoundaryCountBeforeRetune:
          GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
        measuredMetricIds: ["DeltaLw"],
        referenceFloor: "same_stack_steel",
        requiredSourceOwnedFields: [
          ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
        ],
      },
      target: selectedTarget,
    },
    selectionStatus:
      "gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at",
  };
}
