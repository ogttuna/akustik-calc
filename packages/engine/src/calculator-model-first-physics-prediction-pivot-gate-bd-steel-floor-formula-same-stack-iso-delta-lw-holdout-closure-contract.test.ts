import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
import {
  GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
  GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_ACTION,
  GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_FILE,
  buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract,
  classifyGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosure,
} from "./steel-floor-formula-same-stack-iso-delta-lw-holdout-closure";
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

describe("calculator model-first physics prediction pivot Gate BD - steel floor same-stack ISO DeltaLw holdout closure", () => {
  it("lands Gate BD as a no-runtime holdout-count closure boundary and selects Gate BE", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
      previousLandedGate:
        "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be",
    });
    expect(contract.acceptedHoldoutClosureProbeIds).toEqual([
      "gate_bd_future_source_owned_same_stack_iso_delta_lw_holdout_one",
      "gate_bd_future_source_owned_same_stack_iso_delta_lw_holdout_two",
    ]);
  });

  it("uses only Gate BC's selected holdout-count closure lane as input", () => {
    const gateBC =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();

    expect(contract.selectedClosureLaneInput).toEqual(gateBC.selectedClosureLane);
    expect(contract.selectedClosureLaneInput).toMatchObject({
      associatedBlocker: "holdout_count_below_policy_threshold",
      laneId: "same_stack_iso_delta_lw_holdout_count_closure",
      selectedForNextGate: true,
      shortfallCount: 2,
    });
    expect(
      contract.holdoutClosureProbeRows.every(
        (row) =>
          row.closureLane.laneId ===
          "same_stack_iso_delta_lw_holdout_count_closure",
      ),
    ).toBe(true);
    expect(contract.blockedFollowupClosureLaneIds).toEqual([
      "paired_negative_boundary_closure",
      "open_web_formula_input_ownership_closure",
      "field_building_basis_owner_closure",
    ]);
    expect(contract.holdoutClosurePolicy).toMatchObject({
      broadSourceCrawlAllowed: false,
      gateBCSelectedHoldoutCountLaneOnly: true,
      rejectedOrFollowupClosureLanesRemainBlocked: true,
    });
  });

  it("defines the two additional source-owned same-stack ISO DeltaLw holdout requirements", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();

    expect(
      GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
    ).toBe(2);
    expect(contract.holdoutClosureSurface).toEqual({
      currentAdmittedDeltaLwHoldoutCount: 1,
      currentPairedNegativeBoundaryCount: 1,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredAdditionalDeltaLwHoldoutCount: 2,
      requiredCitationLocatorMetadataFields: [
        ...GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      ],
      requiredPacketOwnerFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
      requiredPairedNegativeBoundaryCount: 4,
      requiredTotalDeltaLwHoldoutCount: 3,
      selectedGateBCBlocker: "holdout_count_below_policy_threshold",
      selectedGateBCLaneId: "same_stack_iso_delta_lw_holdout_count_closure",
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
    });
    expect(contract.holdoutClosurePolicy).toMatchObject({
      allGateATAKOwnerFieldsRequired: true,
      labIso101407172BasisRequired: true,
      pairedNegativeBoundaryOwnershipRequired: true,
      rightsSafeLocatorMetadataRequired: true,
      sameStackSteelReferenceRequired: true,
      sourceOwnedMeasuredDeltaLwRequired: true,
    });
  });

  it("accepts complete future holdout packets only as residual-readiness evidence", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();
    const acceptedRows = contract.holdoutClosureProbeRows.filter(
      (row) => row.closureEvidenceAccepted,
    );

    expect(acceptedRows).toHaveLength(2);
    expect(
      acceptedRows.every(
        (row) =>
          row.additionalHoldoutCountContribution === 1 &&
          row.closureDecision ===
            "accepted_residual_readiness_holdout_closure_evidence" &&
          row.closureEvidenceUse === "residual_readiness_evidence_only" &&
          row.countsTowardAdditionalHoldoutShortfallClosure === true &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canRetuneRuntimeNow === false &&
          row.measuredMetricValueIngestedForRuntime === false &&
          row.sourceDocumentCopied === false &&
          row.sourceTextIngested === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
    expect(contract.futureHoldoutClosureReadiness).toEqual({
      acceptedAdditionalHoldoutCount: 2,
      closesGateBCHoldoutCountShortfall: true,
      remainingHoldoutShortfall: 0,
      selectedNextClosureLaneId: "paired_negative_boundary_closure",
    });
  });

  it("rejects missing metric value, paired negative ownership, or locator metadata", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();
    const rowsById = new Map(
      contract.holdoutClosureProbeRows.map((row) => [row.id, row]),
    );

    expect(rowsById.get("gate_bd_missing_measured_delta_lw_holdout")).toMatchObject({
      closureDecision: "rejected_missing_source_owned_holdout_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedFields: ["metric_value"],
    });
    expect(
      rowsById.get("gate_bd_missing_paired_negative_boundary_owner_holdout"),
    ).toMatchObject({
      closureDecision: "rejected_missing_source_owned_holdout_fields",
      closureEvidenceAccepted: false,
      missingSourceOwnedFields: ["paired_negative_boundary_owner"],
    });
    expect(rowsById.get("gate_bd_missing_locator_metadata_holdout")).toMatchObject({
      closureDecision: "rejected_missing_rights_safe_locator_metadata",
      closureEvidenceAccepted: false,
      missingLocatorMetadataFields: ["source_locator"],
    });
  });

  it("rejects wrong basis, wrong reference, product/inferred values, and rights-blocked packets", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();
    const rowsById = new Map(
      contract.holdoutClosureProbeRows.map((row) => [row.id, row]),
    );

    expect(rowsById.get("gate_bd_wrong_metric_basis_holdout")).toMatchObject({
      closureDecision: "rejected_wrong_metric_basis_or_reference",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bd_concrete_reference_floor_holdout")).toMatchObject({
      closureDecision: "rejected_wrong_metric_basis_or_reference",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bd_product_delta_lw_holdout")).toMatchObject({
      closureDecision: "rejected_product_or_inferred_delta_lw_holdout",
      closureEvidenceAccepted: false,
    });
    expect(rowsById.get("gate_bd_rights_blocked_holdout")).toMatchObject({
      closureDecision: "rejected_rights_blocked_holdout_evidence",
      closureEvidenceAccepted: false,
    });
  });

  it("keeps follow-up Gate BC lanes blocked before holdout-closure evidence use", () => {
    const gateBC =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();
    const followupLane = gateBC.closureLaneRanking.find(
      (lane) => lane.laneId === "paired_negative_boundary_closure",
    );
    const acceptedRow =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract()
        .holdoutClosureProbeRows[0];

    expect(followupLane).toBeDefined();
    const hostileFollowupLaneRow =
      classifyGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosure({
        closureLane: followupLane!,
        id: "gate_bd_hostile_followup_lane_holdout_closure",
        sourcePacket: acceptedRow.sourcePacket,
      });

    expect(hostileFollowupLaneRow).toMatchObject({
      closureDecision:
        "blocked_gate_bc_lane_not_selected_holdout_count_closure",
      closureEvidenceAccepted: false,
      canMoveRuntimeNow: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();

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
      holdoutClosureRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanCloseLabHoldoutShortfall: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BD and selected Gate BE", async () => {
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
        "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts",
      );
      expect(content).toContain(
        "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts",
    );
  });
});
