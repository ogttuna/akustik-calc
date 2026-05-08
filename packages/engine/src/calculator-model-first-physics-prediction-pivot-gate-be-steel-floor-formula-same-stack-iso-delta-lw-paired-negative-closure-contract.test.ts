import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-holdout-closure";
import {
  GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT,
  GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS,
  GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_ACTION,
  GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_FILE,
  buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract,
  classifyGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosure,
} from "./steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BE - steel floor same-stack ISO DeltaLw paired negative closure", () => {
  it("lands Gate BE as a no-runtime paired-negative closure boundary and selects Gate BF", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
      previousLandedGate:
        "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf",
    });
    expect(contract.acceptedPairedNegativeClosureProbeIds).toEqual([
      "gate_be_future_wrong_support_concrete_iso_delta_lw_boundary",
      "gate_be_future_wrong_reference_concrete_floor_iso_delta_lw_boundary",
      "gate_be_future_wrong_support_timber_iso_delta_lw_boundary",
    ]);
  });

  it("uses Gate BD's landed holdout-closure contract and selected paired-negative lane as input", () => {
    const gateBD =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();

    expect(contract.selectedHoldoutClosureInput).toEqual(gateBD);
    expect(
      contract.selectedHoldoutClosureInput.futureHoldoutClosureReadiness,
    ).toEqual({
      acceptedAdditionalHoldoutCount: 2,
      closesGateBCHoldoutCountShortfall: true,
      remainingHoldoutShortfall: 0,
      selectedNextClosureLaneId: "paired_negative_boundary_closure",
    });
    expect(
      contract.pairedNegativeClosureProbeRows.every(
        (row) =>
          row.holdoutClosureContract.futureHoldoutClosureReadiness
            .selectedNextClosureLaneId === "paired_negative_boundary_closure",
      ),
    ).toBe(true);
    expect(contract.remainingFollowupClosureLaneIds).toEqual([
      "open_web_formula_input_ownership_closure",
      "field_building_basis_owner_closure",
    ]);
  });

  it("defines the three additional source-owned paired negative-boundary requirements", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();

    expect(GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT).toBe(3);
    expect(contract.pairedNegativeClosureSurface).toEqual({
      currentAdmittedDeltaLwHoldoutCount: 1,
      currentPairedNegativeBoundaryCount: 1,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      requiredAdditionalPairedNegativeBoundaryCount: 3,
      requiredBoundaryOwnerFields: [
        ...GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS,
      ],
      requiredCitationLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredTotalPairedNegativeBoundaryCount: 4,
      selectedGateBDNextLaneId: "paired_negative_boundary_closure",
      selectedOwner: "same_stack_iso_delta_lw_paired_negative_boundaries",
      selectedTermId: "paired_negative_boundaries_missing",
    });
    expect(contract.pairedNegativeClosurePolicy).toMatchObject({
      explicitWrongSupportOrReferenceBoundaryRequired: true,
      gateBDSelectedPairedNegativeLaneOnly: true,
      isoLabBasisOwnerRequired: true,
      rightsSafeLocatorMetadataRequired: true,
      sameTargetMetricFamilyRequired: true,
      sourceOwnedBoundaryProofRequired: true,
    });
  });

  it("accepts complete wrong-support and wrong-reference boundaries only as residual-policy readiness evidence", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const acceptedRows = contract.pairedNegativeClosureProbeRows.filter(
      (row) => row.closureEvidenceAccepted,
    );

    expect(acceptedRows).toHaveLength(3);
    expect(
      acceptedRows.every(
        (row) =>
          row.additionalPairedNegativeBoundaryContribution === 1 &&
          row.closureDecision ===
            "accepted_residual_readiness_paired_negative_boundary" &&
          row.closureEvidenceUse ===
            "residual_policy_readiness_evidence_only" &&
          row.countsTowardPairedNegativeBoundaryShortfallClosure === true &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canRetuneRuntimeNow === false &&
          row.measuredMetricValueIngestedForRuntime === false &&
          row.sourceDocumentCopied === false &&
          row.sourceTextIngested === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
    expect(contract.pairedNegativeReadiness).toEqual({
      acceptedAdditionalPairedNegativeBoundaryCount: 3,
      closesGateBEPairedNegativeShortfall: true,
      remainingPairedNegativeBoundaryShortfall: 0,
      selectedNextClosureLaneId: "open_web_formula_input_ownership_closure",
    });
  });

  it("rejects missing boundary owner fields or locator metadata", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const rowsById = new Map(
      contract.pairedNegativeClosureProbeRows.map((row) => [row.id, row]),
    );

    expect(rowsById.get("gate_be_missing_boundary_support_identity_owner")).toMatchObject({
      closureDecision: "rejected_missing_source_owned_boundary_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedBoundaryFields: [
        "boundary_support_or_reference_identity",
      ],
    });
    expect(rowsById.get("gate_be_missing_locator_metadata_boundary")).toMatchObject({
      closureDecision: "rejected_missing_rights_safe_locator_metadata",
      closureEvidenceAccepted: false,
      missingLocatorMetadataFields: ["source_locator"],
    });
  });

  it("rejects wrong metric basis, wrong metric family, product/inferred, and rights-blocked boundaries", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const rowsById = new Map(
      contract.pairedNegativeClosureProbeRows.map((row) => [row.id, row]),
    );

    expect(rowsById.get("gate_be_wrong_metric_basis_boundary")).toMatchObject({
      closureDecision: "rejected_wrong_metric_basis",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_be_wrong_metric_family_boundary")).toMatchObject({
      closureDecision: "rejected_wrong_metric_family",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_be_product_or_inferred_boundary")).toMatchObject({
      closureDecision: "rejected_product_or_inferred_boundary",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_be_rights_blocked_boundary")).toMatchObject({
      closureDecision: "rejected_rights_blocked_boundary",
      closureEvidenceAccepted: false,
    });
  });

  it("rejects non-explicit or same-stack steel rows that are not true negative boundaries", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();
    const rowsById = new Map(
      contract.pairedNegativeClosureProbeRows.map((row) => [row.id, row]),
    );

    expect(rowsById.get("gate_be_same_stack_steel_not_negative_boundary")).toMatchObject({
      closureDecision:
        "rejected_same_stack_steel_holdout_not_negative_boundary",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_be_not_explicit_negative_boundary")).toMatchObject({
      closureDecision: "rejected_not_explicit_negative_boundary",
      closureEvidenceAccepted: false,
    });
  });

  it("blocks paired-negative closure when Gate BD did not select that next lane", () => {
    const acceptedRow =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract()
        .pairedNegativeClosureProbeRows[0];
    const hostileGateBD =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();
    const hostileRow =
      classifyGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosure({
        holdoutClosureContract: {
          ...hostileGateBD,
          futureHoldoutClosureReadiness: {
            ...hostileGateBD.futureHoldoutClosureReadiness,
            selectedNextClosureLaneId:
              "open_web_formula_input_ownership_closure" as "paired_negative_boundary_closure",
          },
        },
        id: "gate_be_hostile_gate_bd_did_not_select_paired_negative",
        sourceBoundary: acceptedRow.sourceBoundary,
      });

    expect(hostileRow).toMatchObject({
      closureDecision:
        "blocked_gate_bd_next_lane_not_paired_negative_boundary",
      closureEvidenceAccepted: false,
      canMoveRuntimeNow: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, lab/field/building separation, and Gate BD holdout closure explicit", () => {
    const contract =
      buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();

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
      pairedNegativeClosureRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanCloseLabPairedNegativeShortfall: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
    expect(
      contract.selectedHoldoutClosureInput.futureHoldoutClosureReadiness
        .closesGateBCHoldoutCountShortfall,
    ).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with landed Gate BE and selected Gate BF", async () => {
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
        "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts",
    );
  });
});
