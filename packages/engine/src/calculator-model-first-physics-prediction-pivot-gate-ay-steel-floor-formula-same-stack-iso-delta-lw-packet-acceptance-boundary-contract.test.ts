import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_ACTION,
  GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_FILE,
  buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract,
  classifyGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundary,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary";
import {
  buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger";
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

describe("calculator model-first physics prediction pivot Gate AY - steel floor same-stack ISO DeltaLw packet acceptance boundary", () => {
  it("lands Gate AY as a no-runtime packet acceptance boundary and selects Gate AZ", () => {
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
      previousLandedGate:
        "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az",
    });
    expect(contract.currentAcceptedPacketBoundaryIds).toEqual([]);
    expect(contract.acceptedBoundaryProbeIds).toEqual([
      "gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe",
    ]);
  });

  it("uses only Gate AX request-ledger rows as current packet acceptance boundary rows", () => {
    const gateAX =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();

    expect(
      contract.currentPacketAcceptanceBoundaryRows.map(
        (row) => row.requestLedgerRow.requestLedgerId,
      ),
    ).toEqual(
      gateAX.packetRequestLedgerRows.map((row) => row.requestLedgerId),
    );
    expect(contract.requestLedgerEntryIds).toEqual(
      gateAX.requestLedgerEntryIds,
    );
    expect(contract.currentRejectedPacketBoundaryIds).toHaveLength(
      gateAX.packetRequestLedgerRows.length,
    );
    expect(contract.packetAcceptanceBoundarySurface).toEqual({
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredPacketOwnerFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAXRequestLedgerEntriesOnly: true,
    });
  });

  it("keeps current request-ledger entries in request status until a source packet is present", () => {
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const readyCurrentRows = contract.currentPacketAcceptanceBoundaryRows.filter(
      (row) => row.requestLedgerRow.ledgerEntryAllowed,
    );

    expect(readyCurrentRows).toHaveLength(3);
    expect(
      readyCurrentRows.every(
        (row) =>
          row.acceptanceDecision === "rejected_missing_source_packet" &&
          row.packetAcceptanceAllowed === false &&
          row.sourcePacketAccepted === false &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeCalibrationEvidenceCandidateLater === false &&
          row.measuredMetricValueAcceptedAsPacket === false,
      ),
    ).toBe(true);
  });

  it("accepts only a complete future source-owned same-stack ISO DeltaLw packet boundary", () => {
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const accepted = contract.packetAcceptanceBoundaryProbeRows.find(
      (row) => row.packetAcceptanceAllowed,
    );

    expect(accepted).toBeDefined();
    expect(accepted).toMatchObject({
      acceptanceDecision:
        "accepted_source_owned_same_stack_iso_delta_lw_packet_boundary",
      canBecomeCalibrationEvidenceCandidateLater: true,
      canBecomeCalibrationEvidenceNow: false,
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canRetuneRuntimeNow: false,
      measuredMetricValueAcceptedAsPacket: true,
      measuredMetricValueIngestedForRuntime: false,
      pairedNegativeBoundaryOwned: true,
      packetAcceptanceAllowed: true,
      runtimeValueMovement: false,
      sourceDocumentCopied: false,
      sourcePacketAccepted: true,
      sourceRowsAreCalibrationEvidenceNow: false,
      sourceTextIngested: false,
    });
    expect(accepted!.missingSourceOwnedFields).toEqual([]);
    expect(accepted!.sourcePacket).toMatchObject({
      basis: "lab_iso_10140_717_2",
      measuredDeltaLwDb: 23,
      referenceFloor: "same_stack_steel",
      rightsPosture: "rights_safe_metadata_only",
      sourceKind: "source_owned_same_stack_lab_delta_lw",
    });
  });

  it("rejects wrong or incomplete packet probes before calibration/runtime use", () => {
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();
    const decisionsById = new Map(
      contract.packetAcceptanceBoundaryProbeRows.map((row) => [
        row.id,
        row.acceptanceDecision,
      ]),
    );

    expect(decisionsById.get("gate_ay_missing_measured_delta_lw_packet_probe"))
      .toBe("rejected_missing_source_owned_packet_fields");
    expect(
      decisionsById.get(
        "gate_ay_missing_paired_negative_boundary_owner_packet_probe",
      ),
    ).toBe("rejected_missing_source_owned_packet_fields");
    expect(decisionsById.get("gate_ay_wrong_metric_basis_packet_probe"))
      .toBe("rejected_wrong_metric_basis_packet");
    expect(decisionsById.get("gate_ay_concrete_reference_floor_packet_probe"))
      .toBe("rejected_reference_floor_not_same_stack_steel_packet");
    expect(decisionsById.get("gate_ay_product_delta_lw_packet_probe"))
      .toBe("rejected_product_or_inferred_delta_lw_packet");
    expect(decisionsById.get("gate_ay_rights_blocked_packet_probe")).toBe(
      "rejected_rights_blocked_packet",
    );
    expect(decisionsById.get("gate_ay_blocked_request_ledger_packet_probe"))
      .toBe("blocked_request_ledger_row_not_allowed");
    expect(
      decisionsById.get(
        "gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe",
      ),
    ).toBe(
      "accepted_source_owned_same_stack_iso_delta_lw_packet_boundary",
    );
    expect(
      contract.packetAcceptanceBoundaryProbeRows
        .filter((row) => !row.packetAcceptanceAllowed)
        .every(
          (row) =>
            row.canBecomeCalibrationEvidenceNow === false &&
            row.canMoveRuntimeNow === false &&
            row.canPromoteExactSourceNow === false &&
            row.canRetuneRuntimeNow === false &&
            row.measuredMetricValueIngestedForRuntime === false,
        ),
    ).toBe(true);
  });

  it("blocks hostile acceptance probes when the Gate AX ledger row is not allowed", () => {
    const gateAX =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();
    const readyLedgerRow = gateAX.packetRequestLedgerRows.find(
      (row) => row.ledgerEntryAllowed,
    );
    expect(readyLedgerRow).toBeDefined();

    const hostile = classifyGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundary({
      id: "hostile_blocked_ledger_acceptance_probe",
      requestLedgerRow: {
        ...readyLedgerRow!,
        ledgerDecision: "blocked_packet_request_ledger_boundary",
        ledgerEntryAllowed: false,
        ledgerEntryUse: "blocked_packet_request_ledger_boundary",
      },
      sourcePacket: {
        basis: "lab_iso_10140_717_2",
        measuredDeltaLwDb: 23,
        referenceFloor: "same_stack_steel",
        representedRowCount: 1,
        rightsPosture: "rights_safe_metadata_only",
        sourceKind: "source_owned_same_stack_lab_delta_lw",
        sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      },
    });

    expect(hostile).toMatchObject({
      acceptanceDecision: "blocked_request_ledger_row_not_allowed",
      measuredMetricValueAcceptedAsPacket: false,
      measuredMetricValueIngestedForRuntime: false,
      packetAcceptanceAllowed: false,
      sourcePacketAccepted: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactSourceOverridePolicy).toEqual({
      acceptedBoundaryPacketsAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate AY and selected Gate AZ", async () => {
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
        "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts",
      );
      expect(content).toContain(
        "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts",
    );
  });
});
