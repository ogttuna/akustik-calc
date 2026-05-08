import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION,
  GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_FILE,
  buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract,
  classifyGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedger,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger";
import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
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

describe("calculator model-first physics prediction pivot Gate AX - steel floor same-stack ISO DeltaLw packet request ledger", () => {
  it("lands Gate AX as a no-runtime packet request ledger and selects Gate AY", () => {
    const contract =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
      previousLandedGate:
        "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay",
    });
    expect(contract.requestLedgerEntryIds).toEqual([
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ]);
    expect(contract.blockedLedgerRowIds).toHaveLength(6);
  });

  it("uses only Gate AW ready packet request rows as request-ledger entries", () => {
    const gateAW =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();
    const contract =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();

    expect(contract.requestLedgerEntryIds).toEqual(
      gateAW.readyPacketRequestIds,
    );
    expect(contract.blockedLedgerRowIds).toEqual(
      gateAW.blockedPacketRequestIds,
    );
    expect(contract.packetRequestLedgerSurface).toEqual({
      requiredPacketLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredPacketOwnerFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      sourceLeadIntakeScope: {
        measuredMetricIds: ["DeltaLw"],
        metricBasis: "lab_iso_10140_717_2",
        referenceFloor: "same_stack_steel",
        rightsSafeMetadataOnly: true,
        usesGateAWReadyRowsOnly: true,
      },
    });
  });

  it("keeps request-ledger entries rights-safe and separate from packet acceptance", () => {
    const contract =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();
    const ledgerEntries = contract.packetRequestLedgerRows.filter(
      (row) => row.ledgerEntryAllowed,
    );

    expect(ledgerEntries).toHaveLength(3);
    expect(
      ledgerEntries.every(
        (row) =>
          row.ledgerDecision ===
            "queued_rights_safe_packet_request_ledger_entry" &&
          row.ledgerEntryUse === "rights_safe_packet_request_ledger_entry" &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeSourcePacketNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.measuredMetricValueIngested === false &&
          row.runtimeValueMovement === false &&
          row.sourceDocumentCopied === false &&
          row.sourceTextIngested === false &&
          row.rightsSafeMetadataOnly === true,
      ),
    ).toBe(true);
    expect(
      ledgerEntries.every(
        (row) =>
          row.nextPacketAcceptanceBoundaryGate ===
          GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION,
      ),
    ).toBe(true);
  });

  it("keeps blocked Gate AW rows out of the request ledger", () => {
    const contract =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();
    const blockedRows = contract.packetRequestLedgerRows.filter(
      (row) => !row.ledgerEntryAllowed,
    );

    expect(blockedRows).toHaveLength(6);
    expect(
      blockedRows.every(
        (row) =>
          row.ledgerDecision === "blocked_packet_request_ledger_boundary" &&
          row.ledgerEntryUse === "blocked_packet_request_ledger_boundary" &&
          row.packetReadinessRow.packetRequestAllowed === false &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeSourcePacketNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false,
      ),
    ).toBe(true);
  });

  it("blocks hostile request-ledger probes when packet readiness is not allowed", () => {
    const gateAW =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();
    const readyRow = gateAW.packetAcquisitionReadinessRows.find(
      (row) => row.packetRequestAllowed,
    );
    expect(readyRow).toBeDefined();

    const hostileRow =
      classifyGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedger({
        ...readyRow!,
        packetRequestAllowed: false,
        packetReadinessDecision:
          "blocked_missing_rights_safe_locator_metadata",
        packetRequestUse: "blocked_packet_request_boundary",
      });

    expect(hostileRow).toMatchObject({
      ledgerDecision: "blocked_packet_request_ledger_boundary",
      ledgerEntryAllowed: false,
      ledgerEntryUse: "blocked_packet_request_ledger_boundary",
      measuredMetricValueIngested: false,
      sourceDocumentCopied: false,
      sourceTextIngested: false,
    });
  });

  it("keeps runtime pins, exact-source override policy, and lab/field/building separation explicit", () => {
    const contract =
      buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();

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
      requestLedgerEntriesAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate AX and selected Gate AY", async () => {
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
        "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts",
      );
      expect(content).toContain(
        "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts",
    );
  });
});
