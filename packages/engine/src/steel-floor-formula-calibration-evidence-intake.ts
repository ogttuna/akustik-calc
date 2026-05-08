import {
  buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract,
  type SteelFloorFormulaBudgetTermEvidenceOwner,
  type SteelFloorFormulaBudgetTermReadinessTermId,
} from "./steel-floor-formula-error-budget-calibration-readiness";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";
import {
  evaluateSteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualMetricPolicy,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract,
  type SteelFloorDeltaLwHoldoutBasis,
  type SteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutSourceKind,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract,
  type GateAMSourcePacketLead,
  type GateAMSourcePacketLeadKind,
} from "./steel-floor-formula-source-owned-delta-lw-source-packet-acquisition";

export const GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts";

export const GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_ACTION =
  "gate_as_steel_floor_formula_owner_evidence_targeting_plan";

export type GateARSteelFloorFormulaCalibrationEvidenceBucket =
  | "accepted_source_owned_calibration_packet"
  | "rejected_boundary_reference_only"
  | "rejected_missing_source_owned_owner_field"
  | "rejected_product_or_inferred_metric"
  | "rejected_reference_floor_not_same_stack_steel"
  | "rejected_wrong_metric_basis";

export type GateARSteelFloorFormulaCalibrationEvidenceSource =
  | "gate_ak_local_candidate_audit"
  | "gate_am_source_packet_acquisition"
  | "gate_ar_future_probe";

export type GateARSteelFloorFormulaCalibrationEvidenceKind =
  | GateAMSourcePacketLeadKind
  | SteelFloorDeltaLwHoldoutSourceKind;

export type GateARSteelFloorFormulaCalibrationEvidenceReferenceFloor =
  | "same_stack_steel"
  | "solid_or_concrete_reference_floor"
  | "not_a_candidate_packet"
  | "unknown";

export type GateARSteelFloorFormulaCalibrationEvidenceInput = {
  readonly evidenceKind: GateARSteelFloorFormulaCalibrationEvidenceKind;
  readonly id: string;
  readonly measuredMetricIds: readonly string[];
  readonly metricBasis: SteelFloorDeltaLwHoldoutBasis;
  readonly missingSourceOwnedOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  readonly referenceFloor: GateARSteelFloorFormulaCalibrationEvidenceReferenceFloor;
  readonly representedRowCount: number;
  readonly residualCaseCountIfAccepted: number;
  readonly source: GateARSteelFloorFormulaCalibrationEvidenceSource;
  readonly sourceLabel: string;
  readonly sourceOwnedGateAQOwners: readonly SteelFloorFormulaBudgetTermEvidenceOwner[];
  readonly sourceUrl: string | null;
};

export type GateARSteelFloorFormulaCalibrationEvidenceClassification =
  GateARSteelFloorFormulaCalibrationEvidenceInput & {
    readonly acceptedForCalibrationResidual: boolean;
    readonly bucket: GateARSteelFloorFormulaCalibrationEvidenceBucket;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSource: false;
    readonly residualPolicyIfAccepted: SteelFloorFormulaResidualMetricPolicy | null;
    readonly runtimeValueMovement: false;
    readonly satisfiedGateAQTermIds: readonly SteelFloorFormulaBudgetTermReadinessTermId[];
    readonly sourceRowsAreCalibrationEvidenceNotProduct: true;
  };

export type GateARSteelFloorFormulaCalibrationTermOwner = {
  readonly owner: SteelFloorFormulaBudgetTermEvidenceOwner;
  readonly termId: SteelFloorFormulaBudgetTermReadinessTermId;
};

export type GateARSteelFloorFormulaCalibrationEvidenceIntakeContract = {
  readonly acceptanceBuckets: readonly GateARSteelFloorFormulaCalibrationEvidenceBucket[];
  readonly acceptanceSurface: {
    readonly gateAQTermOwnerMapOnly: true;
    readonly sourceRowsAreHoldoutsOrCalibrationNotProduct: true;
    readonly termOwners: readonly GateARSteelFloorFormulaCalibrationTermOwner[];
  };
  readonly currentLedger: readonly GateARSteelFloorFormulaCalibrationEvidenceClassification[];
  readonly currentLedgerSummary: {
    readonly acceptedSourceOwnedPacketIds: readonly string[];
    readonly bucketCounts: readonly {
      readonly bucket: GateARSteelFloorFormulaCalibrationEvidenceBucket;
      readonly count: number;
    }[];
    readonly noRuntimeRetuneReason:
      "no_local_source_owned_gate_aq_owner_packet_satisfies_residual_policy_thresholds";
    readonly rejectedCandidateIds: readonly string[];
  };
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly futureAcceptedPacketProbe:
    GateARSteelFloorFormulaCalibrationEvidenceClassification;
  readonly landedGate: "gate_ar_steel_floor_formula_calibration_evidence_intake_plan";
  readonly previousLandedGate: "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan";
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as";
};

const acceptanceBuckets = [
  "accepted_source_owned_calibration_packet",
  "rejected_missing_source_owned_owner_field",
  "rejected_wrong_metric_basis",
  "rejected_reference_floor_not_same_stack_steel",
  "rejected_product_or_inferred_metric",
  "rejected_boundary_reference_only",
] as const satisfies readonly GateARSteelFloorFormulaCalibrationEvidenceBucket[];

const acceptanceSurface = ():
  readonly GateARSteelFloorFormulaCalibrationTermOwner[] => {
  const gateAQ = buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract();

  return gateAQ.termReadiness.map((term) => ({
    owner: term.tightenRequires,
    termId: term.termId,
  }));
};

const ownerMapByOwner = (
  termOwners: readonly GateARSteelFloorFormulaCalibrationTermOwner[],
) => new Map(termOwners.map((entry) => [entry.owner, entry.termId] as const));

const missingRequiredFields = (
  packet: SteelFloorDeltaLwHoldoutPacket | GateAMSourcePacketLead,
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] =>
  packet.missingSourceOwnedFields.length > 0
    ? packet.missingSourceOwnedFields
    : [...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS];

const sourceOwnedOwnersForPacket = (
  packet: SteelFloorDeltaLwHoldoutPacket | GateAMSourcePacketLead,
): readonly SteelFloorFormulaBudgetTermEvidenceOwner[] =>
  packet.countsTowardFormulaResidual
    ? ["accepted_source_owned_same_stack_iso_delta_lw_holdouts"]
    : [];

const measuredMetricIdsForPacket = (
  packet: SteelFloorDeltaLwHoldoutPacket | GateAMSourcePacketLead,
): readonly string[] => {
  if (typeof packet.measuredDeltaLwDb === "number") {
    return ["DeltaLw"];
  }

  return packet.sourceKind === "ln_w_only_system_table" ? ["Ln,w"] : [];
};

const referenceFloorForGateAMLead = (
  lead: GateAMSourcePacketLead,
): GateARSteelFloorFormulaCalibrationEvidenceReferenceFloor => {
  if (lead.sourcePacketLeadKind === "basis_boundary_reference") {
    return "not_a_candidate_packet";
  }

  if (lead.sourcePacketLeadKind === "candidate_reference_floor_delta_lw") {
    return "solid_or_concrete_reference_floor";
  }

  return "same_stack_steel";
};

const candidateFromGateAKPacket = (
  packet: SteelFloorDeltaLwHoldoutPacket,
): GateARSteelFloorFormulaCalibrationEvidenceInput => ({
  evidenceKind: packet.sourceKind,
  id: packet.id,
  measuredMetricIds: measuredMetricIdsForPacket(packet),
  metricBasis: packet.basis,
  missingSourceOwnedOwnerFields: missingRequiredFields(packet),
  referenceFloor: "unknown",
  representedRowCount: packet.representedRowCount,
  residualCaseCountIfAccepted: packet.countsTowardFormulaResidual
    ? packet.representedRowCount
    : 0,
  source: "gate_ak_local_candidate_audit",
  sourceLabel: packet.id,
  sourceOwnedGateAQOwners: sourceOwnedOwnersForPacket(packet),
  sourceUrl: null,
});

const candidateFromGateAMLead = (
  lead: GateAMSourcePacketLead,
): GateARSteelFloorFormulaCalibrationEvidenceInput => ({
  evidenceKind:
    lead.sourcePacketLeadKind === "candidate_reference_floor_delta_lw" ||
    lead.sourcePacketLeadKind === "basis_boundary_reference"
      ? lead.sourcePacketLeadKind
      : lead.sourceKind,
  id: lead.id,
  measuredMetricIds: measuredMetricIdsForPacket(lead),
  metricBasis: lead.basis,
  missingSourceOwnedOwnerFields: missingRequiredFields(lead),
  referenceFloor: referenceFloorForGateAMLead(lead),
  representedRowCount: lead.representedRowCount,
  residualCaseCountIfAccepted: lead.countsTowardFormulaResidual
    ? lead.representedRowCount
    : 0,
  source: "gate_am_source_packet_acquisition",
  sourceLabel: lead.sourceLabel,
  sourceOwnedGateAQOwners: sourceOwnedOwnersForPacket(lead),
  sourceUrl: lead.sourceUrl,
});

const isProductOrInferred = (
  kind: GateARSteelFloorFormulaCalibrationEvidenceKind,
): boolean =>
  kind === "product_catalog_delta_lw" ||
  kind === "annex_c_or_companion_inferred_delta_lw";

const isBoundaryReference = (
  input: GateARSteelFloorFormulaCalibrationEvidenceInput,
): boolean =>
  input.evidenceKind === "basis_boundary_reference" ||
  input.referenceFloor === "not_a_candidate_packet";

const isReferenceFloorMismatch = (
  input: GateARSteelFloorFormulaCalibrationEvidenceInput,
): boolean =>
  input.evidenceKind === "candidate_reference_floor_delta_lw" ||
  input.referenceFloor === "solid_or_concrete_reference_floor";

const residualPolicyForAcceptedPacket = (
  residualCaseCount: number,
): SteelFloorFormulaResidualMetricPolicy =>
  evaluateSteelFloorFormulaResidualMetricPolicy({
    currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
    fieldAndBuildingBasisOwnersPresent: false,
    maxAbsoluteResidualDb: 1.1,
    meanAbsoluteResidualDb: 0.8,
    metricId: "DeltaLw",
    openWebFormulaInputsSourceOwned: false,
    pairedNegativeBoundaryCount: 1,
    requiredHoldoutCount: 3,
    requiredPairedNegativeBoundaryCount: 4,
    residualCaseCount,
    sourceOwnedCorrectionAvailable: false,
    sourceOwnedMetricHoldoutsPresent: true,
  });

export function classifyGateARSteelFloorFormulaCalibrationEvidence(
  input: GateARSteelFloorFormulaCalibrationEvidenceInput,
  termOwners: readonly GateARSteelFloorFormulaCalibrationTermOwner[] =
    acceptanceSurface(),
): GateARSteelFloorFormulaCalibrationEvidenceClassification {
  const termOwnerMap = ownerMapByOwner(termOwners);
  const satisfiedGateAQTermIds = input.sourceOwnedGateAQOwners
    .map((owner) => termOwnerMap.get(owner))
    .filter(
      (termId): termId is SteelFloorFormulaBudgetTermReadinessTermId =>
        typeof termId === "string",
    );
  const hasGateAQOwner = satisfiedGateAQTermIds.length > 0;
  const hasDeltaLwMetric = input.measuredMetricIds.includes("DeltaLw");
  const missingSourceOwnedOwnerFields =
    input.missingSourceOwnedOwnerFields.length > 0;

  let bucket: GateARSteelFloorFormulaCalibrationEvidenceBucket;
  if (input.metricBasis !== "lab_iso_10140_717_2") {
    bucket = "rejected_wrong_metric_basis";
  } else if (isBoundaryReference(input)) {
    bucket = "rejected_boundary_reference_only";
  } else if (isReferenceFloorMismatch(input)) {
    bucket = "rejected_reference_floor_not_same_stack_steel";
  } else if (isProductOrInferred(input.evidenceKind)) {
    bucket = "rejected_product_or_inferred_metric";
  } else if (!hasDeltaLwMetric || !hasGateAQOwner || missingSourceOwnedOwnerFields) {
    bucket = "rejected_missing_source_owned_owner_field";
  } else {
    bucket = "accepted_source_owned_calibration_packet";
  }

  const acceptedForCalibrationResidual =
    bucket === "accepted_source_owned_calibration_packet";

  return {
    ...input,
    acceptedForCalibrationResidual,
    bucket,
    canMoveRuntimeNow: false,
    canPromoteExactSource: false,
    residualPolicyIfAccepted: acceptedForCalibrationResidual
      ? residualPolicyForAcceptedPacket(input.residualCaseCountIfAccepted)
      : null,
    runtimeValueMovement: false,
    satisfiedGateAQTermIds,
    sourceRowsAreCalibrationEvidenceNotProduct: true,
  };
}

const buildCurrentEvidenceInputs = ():
  readonly GateARSteelFloorFormulaCalibrationEvidenceInput[] => {
  const gateAK = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();
  const gateAM = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();

  return [
    ...gateAK.localCandidateAudit.map(candidateFromGateAKPacket),
    ...gateAM.searchedSourcePacketLeads.map(candidateFromGateAMLead),
  ];
};

const futureAcceptedPacketInput: GateARSteelFloorFormulaCalibrationEvidenceInput = {
  evidenceKind: "source_owned_same_stack_lab_delta_lw",
  id: "gate_ar_future_source_owned_same_stack_iso_delta_lw_packet_probe",
  measuredMetricIds: ["DeltaLw"],
  metricBasis: "lab_iso_10140_717_2",
  missingSourceOwnedOwnerFields: [],
  referenceFloor: "same_stack_steel",
  representedRowCount: 1,
  residualCaseCountIfAccepted: 1,
  source: "gate_ar_future_probe",
  sourceLabel: "Future source-owned same-stack ISO DeltaLw packet probe",
  sourceOwnedGateAQOwners: [
    "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
  ],
  sourceUrl: null,
};

const bucketCountsFor = (
  ledger: readonly GateARSteelFloorFormulaCalibrationEvidenceClassification[],
) =>
  acceptanceBuckets.map((bucket) => ({
    bucket,
    count: ledger.filter((entry) => entry.bucket === bucket).length,
  }));

export function buildGateARSteelFloorFormulaCalibrationEvidenceIntakeContract():
  GateARSteelFloorFormulaCalibrationEvidenceIntakeContract {
  const termOwners = acceptanceSurface();
  const currentLedger = buildCurrentEvidenceInputs().map((candidate) =>
    classifyGateARSteelFloorFormulaCalibrationEvidence(candidate, termOwners),
  );
  const acceptedSourceOwnedPacketIds = currentLedger
    .filter((entry) => entry.acceptedForCalibrationResidual)
    .map((entry) => entry.id);

  return {
    acceptanceBuckets,
    acceptanceSurface: {
      gateAQTermOwnerMapOnly: true,
      sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
      termOwners,
    },
    currentLedger,
    currentLedgerSummary: {
      acceptedSourceOwnedPacketIds,
      bucketCounts: bucketCountsFor(currentLedger),
      noRuntimeRetuneReason:
        "no_local_source_owned_gate_aq_owner_packet_satisfies_residual_policy_thresholds",
      rejectedCandidateIds: currentLedger
        .filter((entry) => !entry.acceptedForCalibrationResidual)
        .map((entry) => entry.id),
    },
    exactMeasuredRowsRemainPrecedence: true,
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    futureAcceptedPacketProbe:
      classifyGateARSteelFloorFormulaCalibrationEvidence(
        futureAcceptedPacketInput,
        termOwners,
      ),
    landedGate: "gate_ar_steel_floor_formula_calibration_evidence_intake_plan",
    previousLandedGate:
      "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan",
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
      GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AR_STEEL_FLOOR_FORMULA_CALIBRATION_EVIDENCE_INTAKE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as",
  };
}
