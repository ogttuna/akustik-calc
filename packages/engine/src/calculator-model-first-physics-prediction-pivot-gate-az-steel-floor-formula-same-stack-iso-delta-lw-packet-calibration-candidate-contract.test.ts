import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_ACTION,
  GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_FILE,
  buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract,
  classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate";
import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary";
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

describe("calculator model-first physics prediction pivot Gate AZ - steel floor same-stack ISO DeltaLw packet calibration candidate", () => {
  it("lands Gate AZ as a no-runtime calibration-candidate boundary and selects Gate BA", () => {
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
      previousLandedGate:
        "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba",
    });
    expect(contract.currentAcceptedCalibrationCandidateIds).toEqual([]);
    expect(contract.acceptedCandidateProbeIds).toEqual([
      "gate_az_probe_gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe_calibration_candidate",
    ]);
  });

  it("uses only Gate AY accepted packet boundary rows as calibration candidate inputs", () => {
    const gateAY =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();

    expect(
      contract.currentCalibrationCandidateRows.map(
        (row) => row.acceptedPacketBoundaryRow.id,
      ),
    ).toEqual(gateAY.currentPacketAcceptanceBoundaryRows.map((row) => row.id));
    expect(contract.currentAcceptedCalibrationCandidateIds).toEqual(
      gateAY.currentAcceptedPacketBoundaryIds,
    );
    expect(contract.currentRejectedCalibrationCandidateIds).toHaveLength(
      gateAY.currentPacketAcceptanceBoundaryRows.length,
    );
    expect(contract.candidateBoundarySurface).toEqual({
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredCitationLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredPacketOwnerFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAYAcceptedPacketBoundaryRowsOnly: true,
    });
  });

  it("keeps current request-status rows blocked from calibration candidate use", () => {
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();

    expect(contract.currentCalibrationCandidateRows).toHaveLength(9);
    expect(
      contract.currentCalibrationCandidateRows.every(
        (row) =>
          row.candidateDecision === "blocked_packet_not_accepted_boundary" &&
          row.canBecomeCalibrationEvidenceCandidate === false &&
          row.acceptedForResidualAdmissionNow === false &&
          row.residualAdmissionAllowedNow === false &&
          row.runtimeValueMovement === false,
      ),
    ).toBe(true);
  });

  it("admits only the accepted future packet boundary as a calibration evidence candidate", () => {
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();
    const accepted = contract.packetCalibrationCandidateProbeRows.find(
      (row) => row.canBecomeCalibrationEvidenceCandidate,
    );

    expect(accepted).toBeDefined();
    expect(accepted).toMatchObject({
      acceptedForResidualAdmissionNow: false,
      canBecomeCalibrationEvidenceCandidate: true,
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canRetuneRuntimeNow: false,
      candidateDecision: "accepted_calibration_evidence_candidate_boundary",
      candidateUse: "calibration_evidence_candidate_only",
      exactSourceOverrideAllowedNow: false,
      fieldBuildingAliasAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      residualAdmissionAllowedNow: false,
      runtimeValueMovement: false,
      sourceDocumentCopied: false,
      sourceRowsAreCalibrationEvidenceCandidateNotProduct: true,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
    expect(accepted!.acceptedPacketBoundaryRow.packetAcceptanceAllowed).toBe(
      true,
    );
    expect(accepted!.missingCitationLocatorMetadataFields).toEqual([]);
    expect(accepted!.missingSourceOwnedFields).toEqual([]);
  });

  it("keeps rejected Gate AY probes blocked before residual/runtime use", () => {
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();
    const rejectedProbeRows = contract.packetCalibrationCandidateProbeRows.filter(
      (row) => !row.canBecomeCalibrationEvidenceCandidate,
    );

    expect(rejectedProbeRows).toHaveLength(7);
    expect(
      rejectedProbeRows.every(
        (row) =>
          row.candidateDecision === "blocked_packet_not_accepted_boundary" &&
          row.acceptedPacketBoundaryRow.packetAcceptanceAllowed === false &&
          row.acceptedForResidualAdmissionNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canRetuneRuntimeNow === false &&
          row.exactSourceOverrideAllowedNow === false &&
          row.fieldBuildingAliasAllowedNow === false &&
          row.measuredMetricValueIngestedForRuntime === false &&
          row.residualAdmissionAllowedNow === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
  });

  it("blocks hostile candidate probes when rights-safe citation metadata is missing", () => {
    const gateAY =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const acceptedBoundary = gateAY.packetAcceptanceBoundaryProbeRows.find(
      (row) => row.packetAcceptanceAllowed,
    );
    expect(acceptedBoundary).toBeDefined();

    const hostile = classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate({
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
      id: "hostile_missing_locator_candidate_probe",
    });

    expect(hostile).toMatchObject({
      candidateDecision:
        "blocked_missing_rights_safe_citation_locator_metadata",
      canBecomeCalibrationEvidenceCandidate: false,
      residualAdmissionAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(hostile.missingCitationLocatorMetadataFields).toEqual([
      "source_locator",
    ]);
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactSourceOverridePolicy).toEqual({
      calibrationCandidatesAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate AZ and selected Gate BA", async () => {
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
        "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts",
      );
      expect(content).toContain(
        "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts",
    );
  });
});
