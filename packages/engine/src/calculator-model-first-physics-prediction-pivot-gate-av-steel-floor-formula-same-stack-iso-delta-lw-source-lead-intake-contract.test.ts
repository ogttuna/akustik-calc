import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION,
  GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_FILE,
  buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract,
  classifyGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntake,
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

describe("calculator model-first physics prediction pivot Gate AV - steel floor same-stack ISO DeltaLw source lead intake", () => {
  it("lands Gate AV as a no-runtime source-lead intake ledger and selects Gate AW", () => {
    const contract =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
      previousLandedGate:
        "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw",
    });
    expect(contract.acceptedIntakeRowIds).toEqual([
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ]);
    expect(contract.rejectedIntakeRowIds).toHaveLength(6);
  });

  it("uses the Gate AU narrow lead scope as the only source-lead intake surface", () => {
    const contract =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();

    expect(contract.leadScope).toEqual({
      broadSourceLibraryCrawlAllowed: false,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredSourceOwnedFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      rightsSafeMetadataOnly: true,
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateATPacketAcceptanceSurfaceOnly: true,
      usesGateAUNarrowLeadScopeOnly: true,
    });
    expect(contract.intakeLedgerPolicy).toEqual({
      acceptedRowsAreAcquisitionTargetsOnly: true,
      broadSourceLibraryCrawlAllowed: false,
      calibrationEvidenceAllowedNow: false,
      exactOverrideAllowedNow: false,
      measuredMetricValueIngestionAllowed: false,
      rightsSafeMetadataOnly: true,
      sourcePacketAcceptanceAllowedNow: false,
      sourceTextIngestionAllowed: false,
    });
  });

  it("keeps accepted intake rows as metadata-only acquisition request targets", () => {
    const contract =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();
    const acceptedRows = contract.leadIntakeRows.filter(
      (row) => row.acquisitionRequestAllowed,
    );

    expect(acceptedRows).toHaveLength(3);
    expect(
      acceptedRows.every(
        (row) =>
          row.intakeDecision ===
            "accepted_metadata_only_source_lead_intake_row" &&
          row.intakeLedgerUse ===
            "metadata_only_source_lead_packet_request_target" &&
          row.canBecomeCalibrationEvidenceNow === false &&
          row.canBecomeSourcePacketNow === false &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.measuredMetricValueIngested === false &&
          row.runtimeValueMovement === false &&
          row.sourceTextIngested === false &&
          row.rightsSafeMetadataOnly === true,
      ),
    ).toBe(true);
    expect(
      acceptedRows.every(
        (row) =>
          row.nextPacketAcquisitionGate ===
          GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION,
      ),
    ).toBe(true);
  });

  it("blocks every Gate AU rejected lead bucket at intake", () => {
    const contract =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();
    const decisionById = new Map(
      contract.leadIntakeRows.map((row) => [row.id, row.intakeDecision]),
    );

    expect(decisionById).toEqual(
      new Map([
        [
          "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
          "accepted_metadata_only_source_lead_intake_row",
        ],
        [
          "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
          "accepted_metadata_only_source_lead_intake_row",
        ],
        [
          "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
          "accepted_metadata_only_source_lead_intake_row",
        ],
        [
          "product_page_delta_lw_claim_lead",
          "rejected_product_or_inferred_source_lead_intake",
        ],
        [
          "astm_iic_stc_or_field_basis_report_lead",
          "rejected_wrong_metric_basis_source_lead_intake",
        ],
        [
          "concrete_reference_iso_delta_lw_lead",
          "rejected_reference_floor_not_same_stack_steel_source_lead_intake",
        ],
        [
          "boundary_scope_reference_lead",
          "rejected_boundary_reference_only_source_lead_intake",
        ],
        [
          "missing_owner_metadata_same_stack_iso_delta_lw_lead",
          "rejected_missing_source_owned_fields_source_lead_intake",
        ],
        [
          "rights_blocked_same_stack_iso_delta_lw_report_lead",
          "rejected_rights_blocked_source_lead_intake",
        ],
      ]),
    );
    expect(
      contract.leadIntakeRows
        .filter((row) => !row.acquisitionRequestAllowed)
        .every(
          (row) =>
            row.intakeLedgerUse === "blocked_source_lead_intake_boundary" &&
            row.canBecomeCalibrationEvidenceNow === false &&
            row.canBecomeSourcePacketNow === false &&
            row.canMoveRuntimeNow === false &&
            row.canPromoteExactSourceNow === false,
        ),
    ).toBe(true);
  });

  it("rejects hostile intake probes even when they mimic full owner metadata", () => {
    const productProbe =
      classifyGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntake({
        basis: "lab_iso_10140_717_2",
        id: "gate_av_product_page_full_metadata_probe",
        leadKind: "product_page_or_catalog_delta_lw_claim",
        leadLabel: "Product page with full metadata probe",
        measuredMetricIds: ["DeltaLw"],
        referenceFloor: "same_stack_steel",
        rightsPosture: "rights_safe_metadata_only",
        sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      });
    const fieldProbe =
      classifyGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntake({
        basis: "field_or_astm_basis",
        id: "gate_av_field_basis_full_metadata_probe",
        leadKind: "manufacturer_report_index_same_stack_steel_iso_delta_lw",
        leadLabel: "Field basis report with full metadata probe",
        measuredMetricIds: ["DeltaLw"],
        referenceFloor: "same_stack_steel",
        rightsPosture: "rights_safe_metadata_only",
        sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      });

    expect(productProbe).toMatchObject({
      acquisitionRequestAllowed: false,
      intakeDecision: "rejected_product_or_inferred_source_lead_intake",
      measuredMetricValueIngested: false,
      sourceTextIngested: false,
    });
    expect(fieldProbe).toMatchObject({
      acquisitionRequestAllowed: false,
      intakeDecision: "rejected_wrong_metric_basis_source_lead_intake",
      measuredMetricValueIngested: false,
      sourceTextIngested: false,
    });
  });

  it("keeps runtime pins, exact-source override policy, and lab/field/building separation explicit", () => {
    const contract =
      buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();

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
      sourceLeadIntakeRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate AV and selected Gate AW", async () => {
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
        "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts",
      );
      expect(content).toContain(
        "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts",
    );
  });
});
