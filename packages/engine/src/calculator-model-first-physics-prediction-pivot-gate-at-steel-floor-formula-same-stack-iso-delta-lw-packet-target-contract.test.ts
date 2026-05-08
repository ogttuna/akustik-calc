import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_ACTION,
  GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_FILE,
  buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract,
  classifyGateATSteelFloorFormulaSameStackIsoDeltaLwPacket,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
  GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AT - steel floor same-stack ISO DeltaLw packet target", () => {
  it("lands Gate AT as a no-runtime packet target and selects Gate AU", () => {
    const contract =
      buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
      previousLandedGate:
        "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au",
    });
    expect(contract.acceptedFixtureProbeIds).toEqual([
      "gate_at_future_source_owned_same_stack_iso_delta_lw_packet_fixture",
    ]);
    expect(contract.rejectedFixtureProbeIds).toHaveLength(6);
  });

  it("uses the Gate AS selected target as the only packet acceptance surface", () => {
    const contract =
      buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract();

    expect(contract.packetAcceptanceSurface).toEqual({
      broadSourceLibraryCrawlAllowed: false,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      minimumAcceptedPacketCountBeforeRetune:
        GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
      minimumPairedNegativeBoundaryCountBeforeRetune:
        GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
      referenceFloor: "same_stack_steel",
      rejectionBoundaries: [
        "reject_product_or_inferred_delta_lw",
        "reject_astm_iic_stc_field_or_building_basis",
        "reject_concrete_or_solid_reference_floor",
        "reject_boundary_reference_only",
        "reject_missing_source_owned_physical_owner_fields",
        "require_exact_source_only_for_full_assembly_match",
      ],
      requiredSourceOwnedFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateASSelectedTargetOnly: true,
    });
  });

  it("accepts only the source-owned same-stack ISO DeltaLw fixture and keeps residual policy on hold", () => {
    const contract =
      buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract();
    const accepted = contract.fixturePacketClassifications.find(
      (packet) =>
        packet.id ===
        "gate_at_future_source_owned_same_stack_iso_delta_lw_packet_fixture",
    );

    expect(accepted).toMatchObject({
      basis: "lab_iso_10140_717_2",
      bucket: "accepted_source_owned_same_stack_iso_delta_lw_packet_fixture",
      canBecomeCalibrationEvidence: true,
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      measuredDeltaLwDb: 23,
      referenceFloor: "same_stack_steel",
      rightsPosture: "rights_safe_metadata_only",
      runtimeValueMovement: false,
      sourceRowsAreCalibrationEvidenceNotProduct: true,
    });
    expect(accepted?.missingSourceOwnedFields).toEqual([]);
    expect(accepted?.residualPolicyIfAccepted).toMatchObject({
      blockers: [
        "holdout_count_below_policy_threshold",
        "paired_negative_boundaries_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ],
      decision: "hold",
      metricId: "DeltaLw",
      retuneAllowedNow: false,
      runtimeValueMovement: false,
      threshold: {
        requiredHoldoutCount: GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
        requiredPairedNegativeBoundaryCount:
          GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
      },
    });
  });

  it("rejects product, wrong-basis, concrete-reference, boundary-only, missing-owner, and rights-blocked fixtures", () => {
    const contract =
      buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract();
    const bucketById = new Map(
      contract.fixturePacketClassifications.map((packet) => [packet.id, packet.bucket]),
    );

    expect(bucketById).toEqual(
      new Map([
        [
          "gate_at_future_source_owned_same_stack_iso_delta_lw_packet_fixture",
          "accepted_source_owned_same_stack_iso_delta_lw_packet_fixture",
        ],
        [
          "gate_at_product_catalog_delta_lw_fixture",
          "rejected_product_or_inferred_delta_lw",
        ],
        [
          "gate_at_astm_iic_stc_or_field_basis_fixture",
          "rejected_wrong_metric_basis",
        ],
        [
          "gate_at_concrete_reference_floor_delta_lw_fixture",
          "rejected_reference_floor_not_same_stack_steel",
        ],
        [
          "gate_at_boundary_reference_only_fixture",
          "rejected_boundary_reference_only",
        ],
        [
          "gate_at_missing_owner_fields_fixture",
          "rejected_missing_source_owned_packet_fields",
        ],
        [
          "gate_at_rights_blocked_same_stack_fixture",
          "rejected_rights_blocked",
        ],
      ]),
    );
    expect(
      contract.fixturePacketClassifications
        .filter((packet) => !packet.canBecomeCalibrationEvidence)
        .every(
          (packet) =>
            packet.canMoveRuntimeNow === false &&
            packet.canPromoteExactSourceNow === false &&
            packet.residualPolicyIfAccepted === null,
        ),
    ).toBe(true);
  });

  it("rejects otherwise source-looking packets with any missing source-owned packet field", () => {
    const classified =
      classifyGateATSteelFloorFormulaSameStackIsoDeltaLwPacket({
        basis: "lab_iso_10140_717_2",
        fullAssemblyExactMatch: false,
        id: "gate_at_missing_dynamic_stiffness_probe",
        measuredDeltaLwDb: 22,
        referenceFloor: "same_stack_steel",
        representedRowCount: 1,
        rightsPosture: "rights_safe_metadata_only",
        sourceKind: "source_owned_same_stack_lab_delta_lw",
        sourceLabel: "Missing dynamic stiffness probe",
        sourceOwnedFields: [
          "metric_value",
          "topology_and_support_family",
          "carrier_spacing",
          "load_basis",
          "lower_support_class",
          "upper_resilient_topology",
          "paired_negative_boundary_owner",
        ],
        sourceUrl: null,
      });

    expect(classified).toMatchObject({
      bucket: "rejected_missing_source_owned_packet_fields",
      canBecomeCalibrationEvidence: false,
      missingSourceOwnedFields: ["dynamic_stiffness"],
    });
  });

  it("keeps runtime pins, exact-source override policy, and lab/field/building basis separation explicit", () => {
    const contract =
      buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract();

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
      targetPacketIsCalibrationEvidenceByDefault: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AT and selected Gate AU", async () => {
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
        "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts",
      );
      expect(content).toContain(
        "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts",
    );
  });
});
