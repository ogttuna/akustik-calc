import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_ACTION,
  GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_FILE,
  buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract,
  classifyGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadiness,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake";
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

describe("calculator model-first physics prediction pivot Gate AW - steel floor same-stack ISO DeltaLw packet acquisition readiness", () => {
  it("lands Gate AW as a no-runtime packet-acquisition readiness contract and selects Gate AX", () => {
    const contract =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
      previousLandedGate:
        "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax",
    });
    expect(contract.readyPacketRequestIds).toEqual([
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ]);
    expect(contract.blockedPacketRequestIds).toHaveLength(6);
  });

  it("uses only Gate AV accepted intake rows as packet request candidates", () => {
    const gateAV =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();
    const contract =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();

    expect(contract.readyPacketRequestIds).toEqual(gateAV.acceptedIntakeRowIds);
    expect(contract.blockedPacketRequestIds).toEqual(
      gateAV.rejectedIntakeRowIds,
    );
    expect(contract.packetReadinessSurface).toEqual({
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
        usesGateAVAcceptedIntakeRowsOnly: true,
      },
    });
    expect(contract.packetReadinessPolicy).toMatchObject({
      acceptedGateAVRowsOnly: true,
      broadSourceLibraryCrawlAllowed: false,
      rejectedGateAVRowsRemainBlocked: true,
      rightsSafeMetadataOnly: true,
    });
  });

  it("keeps ready packet requests as metadata-only targets, not packets or evidence", () => {
    const contract =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();
    const readyRows = contract.packetAcquisitionReadinessRows.filter(
      (row) => row.packetRequestAllowed,
    );

    expect(readyRows).toHaveLength(3);
    expect(
      readyRows.every(
        (row) =>
          row.packetReadinessDecision ===
            "ready_metadata_only_packet_request" &&
          row.packetRequestUse === "metadata_only_packet_request_target" &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeSourcePacketNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.measuredMetricValueIngested === false &&
          row.runtimeValueMovement === false &&
          row.sourceDocumentCopied === false &&
          row.sourceTextIngested === false,
      ),
    ).toBe(true);
    expect(
      readyRows.every(
        (row) =>
          row.missingLocatorMetadataFields.length === 0 &&
          row.missingSourceOwnedFields.length === 0 &&
          row.requiredPacketLocatorMetadataFields ===
            GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ),
    ).toBe(true);
  });

  it("keeps every rejected Gate AV intake row blocked from packet requests", () => {
    const contract =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();
    const blockedRows = contract.packetAcquisitionReadinessRows.filter(
      (row) => !row.packetRequestAllowed,
    );

    expect(blockedRows).toHaveLength(6);
    expect(
      blockedRows.every(
        (row) =>
          row.packetReadinessDecision ===
            "blocked_rejected_source_lead_intake_row" &&
          row.packetRequestUse === "blocked_packet_request_boundary" &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeSourcePacketNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false,
      ),
    ).toBe(true);
  });

  it("blocks hostile packet request probes with missing locator or owner metadata", () => {
    const gateAV =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();
    const acceptedRow = gateAV.leadIntakeRows.find(
      (row) => row.acquisitionRequestAllowed,
    );
    expect(acceptedRow).toBeDefined();

    const missingLocatorProbe =
      classifyGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadiness(
        {
          intakeRow: acceptedRow!,
          packetLocatorMetadataFields: [
            "source_locator",
            "report_identifier",
            "source_owner_or_contact",
            "rights_safe_access_method",
          ],
          packetRequestLabel: "Missing citation scope probe",
        },
      );
    const missingOwnerProbe =
      classifyGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadiness(
        {
          intakeRow: {
            ...acceptedRow!,
            missingSourceOwnedFields: ["load_basis"],
            sourceOwnedFields: [
              "metric_value",
              "topology_and_support_family",
              "carrier_spacing",
              "dynamic_stiffness",
              "lower_support_class",
              "upper_resilient_topology",
              "paired_negative_boundary_owner",
            ],
          },
          packetLocatorMetadataFields:
            GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
          packetRequestLabel: "Missing source-owned load basis probe",
        },
      );

    expect(missingLocatorProbe).toMatchObject({
      missingLocatorMetadataFields: ["citation_scope"],
      packetReadinessDecision:
        "blocked_missing_rights_safe_locator_metadata",
      packetRequestAllowed: false,
      sourceTextIngested: false,
    });
    expect(missingOwnerProbe).toMatchObject({
      missingSourceOwnedFields: ["load_basis"],
      packetReadinessDecision: "blocked_missing_source_owned_owner_fields",
      packetRequestAllowed: false,
      measuredMetricValueIngested: false,
    });
  });

  it("keeps runtime pins, exact-source override policy, and lab/field/building separation explicit", () => {
    const contract =
      buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();

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
      readyPacketRequestsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate AW and selected Gate AX", async () => {
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
        "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts",
      );
      expect(content).toContain(
        "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts",
    );
  });
});
