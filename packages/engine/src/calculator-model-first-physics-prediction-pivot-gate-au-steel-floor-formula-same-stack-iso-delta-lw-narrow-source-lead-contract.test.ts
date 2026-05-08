import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_ACTION,
  GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_FILE,
  buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract,
  classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead,
} from "./steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead";
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

describe("calculator model-first physics prediction pivot Gate AU - steel floor same-stack ISO DeltaLw narrow source lead", () => {
  it("lands Gate AU as a no-runtime source-lead plan and selects Gate AV", () => {
    const contract =
      buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
      previousLandedGate:
        "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av",
    });
    expect(contract.acceptedLeadIds).toEqual([
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ]);
    expect(contract.rejectedLeadIds).toHaveLength(6);
  });

  it("uses the Gate AT packet acceptance surface as the only source-lead scope", () => {
    const contract =
      buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();

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
    });
  });

  it("keeps accepted narrow leads as metadata-only packet acquisition targets, not calibration evidence yet", () => {
    const contract =
      buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();
    const acceptedLeads = contract.leadClassifications.filter(
      (lead) => lead.canProceedToPacketAcquisition,
    );

    expect(acceptedLeads).toHaveLength(3);
    expect(
      acceptedLeads.every(
        (lead) =>
          lead.bucket ===
            "accepted_narrow_source_lead_for_packet_acquisition" &&
          lead.canBecomeCalibrationEvidenceNow === false &&
          lead.canMoveRuntimeNow === false &&
          lead.canPromoteExactSourceNow === false &&
          lead.missingSourceOwnedFields.length === 0 &&
          lead.runtimeValueMovement === false &&
          lead.sourceLeadUse === "metadata_only_packet_acquisition_target",
      ),
    ).toBe(true);
    expect(acceptedLeads.map((lead) => lead.leadKind)).toEqual([
      "manufacturer_report_index_same_stack_steel_iso_delta_lw",
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw",
      "internal_measurement_packet_same_stack_steel_iso_delta_lw",
    ]);
  });

  it("rejects product, wrong-basis, concrete-reference, boundary-only, missing-owner, and rights-blocked leads", () => {
    const contract =
      buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();
    const bucketById = new Map(
      contract.leadClassifications.map((lead) => [lead.id, lead.bucket]),
    );

    expect(bucketById).toEqual(
      new Map([
        [
          "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
          "accepted_narrow_source_lead_for_packet_acquisition",
        ],
        [
          "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
          "accepted_narrow_source_lead_for_packet_acquisition",
        ],
        [
          "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
          "accepted_narrow_source_lead_for_packet_acquisition",
        ],
        ["product_page_delta_lw_claim_lead", "rejected_product_or_inferred_lead"],
        [
          "astm_iic_stc_or_field_basis_report_lead",
          "rejected_wrong_metric_basis_lead",
        ],
        [
          "concrete_reference_iso_delta_lw_lead",
          "rejected_reference_floor_not_same_stack_steel_lead",
        ],
        ["boundary_scope_reference_lead", "rejected_boundary_reference_only_lead"],
        [
          "missing_owner_metadata_same_stack_iso_delta_lw_lead",
          "rejected_missing_source_owned_lead_fields",
        ],
        [
          "rights_blocked_same_stack_iso_delta_lw_report_lead",
          "rejected_rights_blocked_lead",
        ],
      ]),
    );
    expect(
      contract.leadClassifications
        .filter((lead) => !lead.canProceedToPacketAcquisition)
        .every(
          (lead) =>
            lead.canBecomeCalibrationEvidenceNow === false &&
            lead.canMoveRuntimeNow === false &&
            lead.canPromoteExactSourceNow === false,
        ),
    ).toBe(true);
  });

  it("rejects otherwise plausible leads with any missing Gate AT owner field", () => {
    const classified =
      classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead({
        basis: "lab_iso_10140_717_2",
        id: "gate_au_missing_load_basis_probe",
        leadKind: "manufacturer_report_index_same_stack_steel_iso_delta_lw",
        leadLabel: "Missing load basis probe",
        measuredMetricIds: ["DeltaLw"],
        referenceFloor: "same_stack_steel",
        rightsPosture: "rights_safe_metadata_only",
        sourceOwnedFields: [
          "metric_value",
          "topology_and_support_family",
          "carrier_spacing",
          "dynamic_stiffness",
          "lower_support_class",
          "upper_resilient_topology",
          "paired_negative_boundary_owner",
        ],
      });

    expect(classified).toMatchObject({
      bucket: "rejected_missing_source_owned_lead_fields",
      canProceedToPacketAcquisition: false,
      missingSourceOwnedFields: ["load_basis"],
    });
  });

  it("keeps runtime pins, exact-source override policy, and lab/field/building basis separation explicit", () => {
    const contract =
      buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();

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
      sourceLeadsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AU and selected Gate AV", async () => {
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
        "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts",
      );
      expect(content).toContain(
        "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts",
    );
  });
});
