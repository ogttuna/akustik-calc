import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure";
import {
  GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS,
  GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS,
  GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT,
  GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_ACTION,
  GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_FILE,
  buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract,
  classifyGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosure,
} from "./steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BF - steel floor same-stack ISO DeltaLw open-web input ownership closure", () => {
  it("lands Gate BF as a no-runtime open-web formula-input ownership boundary and selects Gate BG", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
      previousLandedGate:
        "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg",
    });
    expect(contract.acceptedOpenWebInputOwnershipClosureProbeIds).toEqual([
      "gate_bf_future_source_owned_open_web_formula_input_packet",
    ]);
    expect(contract.remainingFollowupClosureLaneIds).toEqual([
      "field_building_basis_owner_closure",
    ]);
  });

  it("uses Gate BE's landed paired-negative closure and selected open-web lane as input", () => {
    const gateBE =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();

    expect(contract.selectedPairedNegativeClosureInput).toEqual(gateBE);
    expect(
      contract.selectedPairedNegativeClosureInput.pairedNegativeReadiness,
    ).toEqual({
      acceptedAdditionalPairedNegativeBoundaryCount: 3,
      closesGateBEPairedNegativeShortfall: true,
      remainingPairedNegativeBoundaryShortfall: 0,
      selectedNextClosureLaneId: "open_web_formula_input_ownership_closure",
    });
    expect(
      contract.openWebInputOwnershipClosureProbeRows.every(
        (row) =>
          row.pairedNegativeClosureContract.pairedNegativeReadiness
            .selectedNextClosureLaneId ===
          "open_web_formula_input_ownership_closure",
      ),
    ).toBe(true);
  });

  it("defines source-owned open-web formula input and rights-safe locator requirements", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();

    expect(GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT).toBe(1);
    expect(contract.openWebInputOwnershipClosureSurface).toEqual({
      acceptedGateBEAdditionalPairedNegativeBoundaryCount: 3,
      metricBasis: "lab_iso_10140_717_2",
      pairedNegativeClosureComplete: true,
      requiredCitationLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredOpenWebFormulaInputOwnerFields: [
        ...GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS,
      ],
      requiredOpenWebFormulaInputPacketCount: 1,
      requiredOpenWebFormulaInputValueFields: [
        ...GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS,
      ],
      selectedGateBENextLaneId: "open_web_formula_input_ownership_closure",
      selectedOwner: "source_owned_open_web_formula_input_packet",
      selectedTermId: "open_web_formula_inputs_not_source_owned",
    });
    expect(contract.openWebInputOwnershipClosurePolicy).toMatchObject({
      gateBESelectedOpenWebInputOwnershipLaneOnly: true,
      isoLabBasisOwnerRequired: true,
      openWebSupportFormRequired: true,
      rightsSafeLocatorMetadataRequired: true,
      sourceOwnedFormulaInputProofRequired: true,
    });
  });

  it("accepts a complete source-owned open-web formula input packet only as residual-policy readiness evidence", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();
    const acceptedRows = contract.openWebInputOwnershipClosureProbeRows.filter(
      (row) => row.closureEvidenceAccepted,
    );

    expect(acceptedRows).toHaveLength(1);
    expect(acceptedRows[0]).toMatchObject({
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canRetuneRuntimeNow: false,
      closureDecision:
        "accepted_residual_readiness_open_web_formula_input_ownership",
      closureEvidenceUse: "residual_policy_readiness_evidence_only",
      countsTowardOpenWebInputOwnershipClosure: true,
      exactSourceOverrideAllowedNow: false,
      fieldBuildingAliasAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      openWebFormulaInputOwnershipContribution: 1,
      residualRetuneAllowedNow: false,
      runtimeValueMovement: false,
      sourceDocumentCopied: false,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
    expect(contract.openWebInputOwnershipReadiness).toEqual({
      acceptedSourceOwnedOpenWebFormulaInputPacketCount: 1,
      openWebFormulaInputOwnershipComplete: true,
      remainingOpenWebFormulaInputOwnershipPacketShortfall: 0,
      selectedNextClosureLaneId: "field_building_basis_owner_closure",
    });
  });

  it("rejects missing owner fields, missing physical input values, and missing locator metadata", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();
    const rowsById = new Map(
      contract.openWebInputOwnershipClosureProbeRows.map((row) => [
        row.id,
        row,
      ]),
    );

    expect(rowsById.get("gate_bf_missing_carrier_spacing_owner")).toMatchObject({
      closureDecision:
        "rejected_missing_source_owned_open_web_formula_input_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedInputFields: ["carrier_spacing"],
    });
    expect(rowsById.get("gate_bf_missing_dynamic_stiffness_value")).toMatchObject({
      closureDecision: "rejected_missing_open_web_formula_input_values",
      closureEvidenceAccepted: false,
      missingInputValueFields: ["dynamic_stiffness_mn_m3"],
    });
    expect(rowsById.get("gate_bf_missing_locator_metadata")).toMatchObject({
      closureDecision: "rejected_missing_rights_safe_locator_metadata",
      closureEvidenceAccepted: false,
      missingLocatorMetadataFields: ["source_locator"],
    });
  });

  it("rejects wrong basis, wrong support form, product/inferred claims, rights-blocked packets, and missing upper topology", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();
    const rowsById = new Map(
      contract.openWebInputOwnershipClosureProbeRows.map((row) => [
        row.id,
        row,
      ]),
    );

    expect(rowsById.get("gate_bf_wrong_metric_basis")).toMatchObject({
      closureDecision: "rejected_wrong_metric_basis",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bf_wrong_support_form_steel_joist")).toMatchObject({
      closureDecision: "rejected_wrong_support_form",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bf_product_catalog_or_inferred_claim")).toMatchObject({
      closureDecision: "rejected_product_or_inferred_open_web_input_claim",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bf_rights_blocked_input_packet")).toMatchObject({
      closureDecision: "rejected_rights_blocked_open_web_input_packet",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bf_missing_upper_resilient_topology")).toMatchObject({
      closureDecision: "rejected_missing_open_web_formula_input_values",
      closureEvidenceAccepted: false,
    });
  });

  it("blocks open-web input ownership closure when Gate BE did not select that next lane", () => {
    const acceptedRow =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract()
        .openWebInputOwnershipClosureProbeRows[0];
    const hostileGateBE =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const hostileRow =
      classifyGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosure({
        id: "gate_bf_hostile_gate_be_did_not_select_open_web_input_ownership",
        pairedNegativeClosureContract: {
          ...hostileGateBE,
          pairedNegativeReadiness: {
            ...hostileGateBE.pairedNegativeReadiness,
            selectedNextClosureLaneId:
              "field_building_basis_owner_closure" as "open_web_formula_input_ownership_closure",
          },
        },
        sourceInputPacket: acceptedRow.sourceInputPacket,
      });

    expect(hostileRow).toMatchObject({
      closureDecision:
        "blocked_gate_be_next_lane_not_open_web_formula_input_ownership",
      closureEvidenceAccepted: false,
      canMoveRuntimeNow: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, lab/field/building separation, and Gate BE paired-negative closure explicit", () => {
    const contract =
      buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();

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
      openWebInputOwnershipClosureRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanCloseLabOpenWebInputOwnership: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
    expect(
      contract.selectedPairedNegativeClosureInput.pairedNegativeReadiness
        .closesGateBEPairedNegativeShortfall,
    ).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with landed Gate BF and selected Gate BG", async () => {
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
        "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts",
    );
  });
});
