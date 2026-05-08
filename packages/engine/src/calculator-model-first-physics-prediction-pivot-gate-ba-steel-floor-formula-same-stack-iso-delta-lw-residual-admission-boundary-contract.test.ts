import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract,
  classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate";
import {
  buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary";
import {
  GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
  GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
  GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_ACTION,
  GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_FILE,
  buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract,
  classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BA - steel floor same-stack ISO DeltaLw residual admission boundary", () => {
  it("lands Gate BA as a no-runtime residual-admission boundary and selects Gate BB", () => {
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
      previousLandedGate:
        "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb",
    });
    expect(contract.currentAcceptedResidualAdmissionIds).toEqual([]);
    expect(contract.acceptedResidualAdmissionProbeIds).toEqual([
      "gate_ba_probe_gate_az_probe_gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe_calibration_candidate_residual_admission",
    ]);
  });

  it("uses only Gate AZ accepted calibration candidates as residual admission inputs", () => {
    const gateAZ =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();

    expect(
      contract.currentResidualAdmissionBoundaryRows.map(
        (row) => row.calibrationCandidateRow.id,
      ),
    ).toEqual(gateAZ.currentCalibrationCandidateRows.map((row) => row.id));
    expect(
      contract.packetResidualAdmissionProbeRows.map(
        (row) => row.calibrationCandidateRow.id,
      ),
    ).toEqual(gateAZ.packetCalibrationCandidateProbeRows.map((row) => row.id));
    expect(contract.residualAdmissionBoundaryPolicy).toMatchObject({
      gateAZAcceptedCalibrationCandidatesOnly: true,
      rejectedGateAZCandidatesRemainBlocked: true,
      residualPolicyDecisionCanMoveRuntimeNow: false,
    });
    expect(contract.residualAdmissionBoundarySurface).toEqual({
      currentDeltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredCitationLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredPacketOwnerFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      residualPolicyThreshold: {
        requiredDeltaLwHoldoutCount:
          GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
        requiredPairedNegativeBoundaryCount:
          GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      },
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAZAcceptedCalibrationCandidatesOnly: true,
    });
  });

  it("keeps current request-status rows blocked from residual admission", () => {
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();

    expect(contract.currentResidualAdmissionBoundaryRows).toHaveLength(9);
    expect(
      contract.currentResidualAdmissionBoundaryRows.every(
        (row) =>
          row.admissionDecision ===
            "blocked_not_calibration_evidence_candidate" &&
          row.acceptedForResidualEvaluation === false &&
          row.residualEvaluationAllowed === false &&
          row.residualPolicyIfAdmitted === null &&
          row.residualPolicyRuntimeMovementAllowedNow === false &&
          row.runtimeValueMovement === false,
      ),
    ).toBe(true);
  });

  it("admits the accepted future calibration candidate to residual evaluation without moving runtime", () => {
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();
    const accepted = contract.packetResidualAdmissionProbeRows.find(
      (row) => row.residualEvaluationAllowed,
    );

    expect(accepted).toBeDefined();
    expect(accepted).toMatchObject({
      acceptedForResidualEvaluation: true,
      admissionDecision: "accepted_residual_evaluation_boundary",
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canRetuneRuntimeNow: false,
      exactSourceOverrideAllowedNow: false,
      fieldBuildingAliasAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      measuredMetricValuePreservedForResidualPolicy: true,
      pairedNegativeBoundaryCount: 1,
      residualAdmissionUse: "residual_policy_evaluation_boundary",
      residualCaseCount: 1,
      residualEvaluationAllowed: true,
      residualPolicyRuntimeMovementAllowedNow: false,
      runtimeValueMovement: false,
      sourceDocumentCopied: false,
      sourceRowsAreResidualEvidenceNotProduct: true,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
    expect(accepted!.missingCitationLocatorMetadataFields).toEqual([]);
    expect(accepted!.missingSourceOwnedFields).toEqual([]);
    expect(accepted!.residualPolicyIfAdmitted).toMatchObject({
      blockers: [
        "holdout_count_below_policy_threshold",
        "paired_negative_boundaries_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ],
      currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      decision: "hold",
      maxAbsoluteResidualDb: 0.6,
      meanAbsoluteResidualDb: 0.6,
      metricId: "DeltaLw",
      residualCaseCount: 1,
      retuneAllowedNow: false,
      runtimeValueMovement: false,
      threshold: {
        requiredHoldoutCount:
          GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
        requiredPairedNegativeBoundaryCount:
          GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      },
    });
  });

  it("keeps rejected Gate AZ probes blocked before residual policy and runtime use", () => {
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();
    const rejectedProbeRows = contract.packetResidualAdmissionProbeRows.filter(
      (row) => !row.residualEvaluationAllowed,
    );

    expect(rejectedProbeRows).toHaveLength(7);
    expect(
      rejectedProbeRows.every(
        (row) =>
          row.admissionDecision ===
            "blocked_not_calibration_evidence_candidate" &&
          row.acceptedForResidualEvaluation === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canRetuneRuntimeNow === false &&
          row.exactSourceOverrideAllowedNow === false &&
          row.fieldBuildingAliasAllowedNow === false &&
          row.residualPolicyIfAdmitted === null &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
  });

  it("blocks hostile residual admission when rights-safe citation or owner fields are missing", () => {
    const gateAY =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const acceptedBoundary = gateAY.packetAcceptanceBoundaryProbeRows.find(
      (row) => row.packetAcceptanceAllowed,
    );
    expect(acceptedBoundary).toBeDefined();

    const missingLocatorCandidate =
      classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate({
        acceptedPacketBoundaryRow: {
          ...acceptedBoundary!,
          requestLedgerRow: {
            ...acceptedBoundary!.requestLedgerRow,
            packetReadinessRow: {
              ...acceptedBoundary!.requestLedgerRow.packetReadinessRow,
              packetLocatorMetadataFields:
                GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
                  (field) => field !== "source_locator",
                ),
            },
          },
        },
        id: "gate_ba_hostile_missing_locator_candidate",
      });
    const missingLocator =
      classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary({
        calibrationCandidateRow: missingLocatorCandidate,
        id: "gate_ba_hostile_missing_locator_residual_admission",
      });

    expect(missingLocator).toMatchObject({
      admissionDecision:
        "blocked_missing_rights_safe_citation_locator_metadata",
      residualEvaluationAllowed: false,
      residualPolicyIfAdmitted: null,
      runtimeValueMovement: false,
    });
    expect(missingLocator.missingCitationLocatorMetadataFields).toEqual([
      "source_locator",
    ]);

    const missingOwnerCandidate =
      classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate({
        acceptedPacketBoundaryRow: {
          ...acceptedBoundary!,
          missingSourceOwnedFields: ["dynamic_stiffness"],
        },
        id: "gate_ba_hostile_missing_owner_candidate",
      });
    const missingOwner =
      classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary({
        calibrationCandidateRow: missingOwnerCandidate,
        id: "gate_ba_hostile_missing_owner_residual_admission",
      });

    expect(missingOwner).toMatchObject({
      admissionDecision: "blocked_missing_source_owned_packet_fields",
      residualEvaluationAllowed: false,
      residualPolicyIfAdmitted: null,
      runtimeValueMovement: false,
    });
    expect(missingOwner.missingSourceOwnedFields).toContain(
      "dynamic_stiffness",
    );
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactSourceOverridePolicy).toEqual({
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      residualAdmissionRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BA and selected Gate BB", async () => {
    const [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/README.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts"),
      ]);

    for (const content of [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts",
    );
  });
});
