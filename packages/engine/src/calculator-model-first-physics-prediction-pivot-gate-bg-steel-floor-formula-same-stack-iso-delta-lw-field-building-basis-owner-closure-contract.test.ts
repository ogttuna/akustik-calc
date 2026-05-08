import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure";
import {
  GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS,
  GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT,
  GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS,
  GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT,
  GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS,
  GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_ACTION,
  GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_FILE,
  buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract,
  classifyGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosure,
} from "./steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BG - steel floor same-stack ISO DeltaLw field/building basis owner closure", () => {
  it("lands Gate BG as a no-runtime field/building basis owner boundary and selects Gate BH", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
      previousLandedGate:
        "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh",
    });
    expect(contract.acceptedFieldBuildingBasisOwnerClosureProbeIds).toEqual([
      "gate_bg_future_source_owned_field_apparent_basis_owner_packet",
      "gate_bg_future_project_owned_building_prediction_basis_owner_packet",
    ]);
    expect(contract.remainingFollowupClosureLaneIds).toEqual([]);
  });

  it("uses Gate BF's landed open-web input ownership closure and selected field/building lane as input", () => {
    const gateBF =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();

    expect(contract.selectedOpenWebInputOwnershipClosureInput).toEqual(gateBF);
    expect(
      contract.selectedOpenWebInputOwnershipClosureInput
        .openWebInputOwnershipReadiness,
    ).toEqual({
      acceptedSourceOwnedOpenWebFormulaInputPacketCount: 1,
      openWebFormulaInputOwnershipComplete: true,
      remainingOpenWebFormulaInputOwnershipPacketShortfall: 0,
      selectedNextClosureLaneId: "field_building_basis_owner_closure",
    });
    expect(
      contract.fieldBuildingBasisOwnerClosureProbeRows.every(
        (row) =>
          row.openWebInputOwnershipClosureContract
            .openWebInputOwnershipReadiness.selectedNextClosureLaneId ===
          "field_building_basis_owner_closure",
      ),
    ).toBe(true);
  });

  it("defines separate source-owned field and building basis owner requirements", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();

    expect(GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT).toBe(1);
    expect(GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT).toBe(1);
    expect(contract.fieldBuildingBasisOwnerClosureSurface).toEqual({
      acceptedGateBFOpenWebFormulaInputPacketCount: 1,
      metricFamilies: ["field_apparent_impact", "building_prediction"],
      openWebFormulaInputOwnershipComplete: true,
      requiredBuildingBasisOwnerFields: [
        ...GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS,
      ],
      requiredBuildingBasisOwnerPacketCount: 1,
      requiredContextValueFields: [
        ...GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS,
      ],
      requiredFieldBasisOwnerFields: [
        ...GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS,
      ],
      requiredFieldBasisOwnerPacketCount: 1,
      requiredLocatorOrProjectContextMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      selectedGateBFNextLaneId: "field_building_basis_owner_closure",
      selectedOwner: "separate_field_and_building_basis_owners",
      selectedTermId: "field_and_building_basis_owners_missing",
    });
    expect(contract.fieldBuildingBasisOwnerClosurePolicy).toMatchObject({
      fieldAndBuildingOwnersMustBeSeparate: true,
      gateBFSelectedFieldBuildingBasisOwnerLaneOnly: true,
      labCorridorAliasAllowed: false,
      rightsSafeLocatorOrProjectContextMetadataRequired: true,
      sourceOwnedBasisProofRequired: true,
    });
  });

  it("accepts complete field and building basis owner packets only as residual-policy readiness evidence", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();
    const acceptedRows =
      contract.fieldBuildingBasisOwnerClosureProbeRows.filter(
        (row) => row.closureEvidenceAccepted,
      );

    expect(acceptedRows).toHaveLength(2);
    expect(acceptedRows.map((row) => row.closureDecision)).toEqual([
      "accepted_residual_readiness_field_apparent_basis_owner",
      "accepted_residual_readiness_building_prediction_basis_owner",
    ]);
    expect(
      acceptedRows.every(
        (row) =>
          row.closureEvidenceUse ===
            "residual_policy_readiness_evidence_only" &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canRetuneRuntimeNow === false &&
          row.fieldBuildingAliasAllowedNow === false &&
          row.labCorridorConvertedToFieldOrBuildingOutput === false &&
          row.measuredMetricValueIngestedForRuntime === false &&
          row.sourceDocumentCopied === false &&
          row.sourceTextIngested === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
    expect(contract.fieldBuildingBasisOwnerReadiness).toEqual({
      acceptedBuildingBasisOwnerPacketCount: 1,
      acceptedFieldBasisOwnerPacketCount: 1,
      fieldBuildingBasisOwnerClosureComplete: true,
      remainingBuildingBasisOwnerPacketShortfall: 0,
      remainingFieldBasisOwnerPacketShortfall: 0,
      selectedNextClosureLaneId: "residual_policy_closed_owner_revalidation",
    });
  });

  it("rejects missing source-owned field/building owner fields, missing context values, and missing locator/project metadata", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();
    const rowsById = new Map(
      contract.fieldBuildingBasisOwnerClosureProbeRows.map((row) => [
        row.id,
        row,
      ]),
    );

    expect(rowsById.get("gate_bg_missing_field_room_geometry_owner")).toMatchObject({
      closureDecision: "rejected_missing_source_owned_basis_owner_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedBasisFields: ["receiving_room_geometry_or_volume"],
    });
    expect(rowsById.get("gate_bg_missing_building_flanking_model_owner")).toMatchObject({
      closureDecision: "rejected_missing_source_owned_basis_owner_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedBasisFields: ["flanking_path_model"],
    });
    expect(rowsById.get("gate_bg_missing_receiving_room_volume_value")).toMatchObject({
      closureDecision: "rejected_missing_field_building_context_values",
      closureEvidenceAccepted: false,
      missingContextValueFields: ["receiving_room_volume_m3"],
    });
    expect(
      rowsById.get("gate_bg_missing_locator_and_project_context_metadata"),
    ).toMatchObject({
      closureDecision:
        "rejected_missing_rights_safe_locator_or_project_context_metadata",
      closureEvidenceAccepted: false,
      missingLocatorOrProjectContextMetadataFields: ["source_locator"],
    });
  });

  it("rejects lab/wrong basis, lab corridor alias, wrong metric family, product/inferred claims, and rights-blocked packets", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();
    const rowsById = new Map(
      contract.fieldBuildingBasisOwnerClosureProbeRows.map((row) => [
        row.id,
        row,
      ]),
    );

    expect(rowsById.get("gate_bg_wrong_lab_basis_for_field_context")).toMatchObject({
      closureDecision: "rejected_wrong_metric_basis",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bg_lab_corridor_alias_attempt")).toMatchObject({
      closureDecision: "rejected_lab_corridor_alias_attempt",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bg_wrong_metric_family_iic_claim")).toMatchObject({
      closureDecision: "rejected_wrong_metric_family",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bg_product_or_inferred_basis_claim")).toMatchObject({
      closureDecision: "rejected_product_or_inferred_basis_claim",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bg_rights_blocked_basis_owner_packet")).toMatchObject({
      closureDecision: "rejected_rights_blocked_basis_owner_packet",
      closureEvidenceAccepted: false,
    });
  });

  it("blocks field/building basis owner closure when Gate BF did not select that next lane", () => {
    const acceptedRow =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract()
        .fieldBuildingBasisOwnerClosureProbeRows[0];
    const hostileGateBF =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();
    const hostileRow =
      classifyGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosure({
        id: "gate_bg_hostile_gate_bf_did_not_select_field_building_basis",
        openWebInputOwnershipClosureContract: {
          ...hostileGateBF,
          openWebInputOwnershipReadiness: {
            ...hostileGateBF.openWebInputOwnershipReadiness,
            selectedNextClosureLaneId:
              "residual_policy_closed_owner_revalidation" as "field_building_basis_owner_closure",
          },
        },
        sourceBasisPacket: acceptedRow.sourceBasisPacket,
      });

    expect(hostileRow).toMatchObject({
      closureDecision:
        "blocked_gate_bf_next_lane_not_field_building_basis_owner",
      closureEvidenceAccepted: false,
      canMoveRuntimeNow: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, lab/field/building separation, and Gate BF open-web input ownership explicit", () => {
    const contract =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();

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
      fieldBuildingBasisOwnerRowsAreNotExactRows: true,
      fullAssemblyExactMatchRequired: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      buildingPredictionRequiresOwnContextBeforeRuntime: true,
      fieldImpactRequiresOwnContextBeforeRuntime: true,
      labDeltaLwCanAliasFieldMetrics: false,
      labLnWCanAliasApparentOrBuildingMetrics: false,
    });
    expect(
      contract.selectedOpenWebInputOwnershipClosureInput
        .openWebInputOwnershipReadiness.openWebFormulaInputOwnershipComplete,
    ).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with landed Gate BG and selected Gate BH", async () => {
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
        "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts",
    );
  });
});
