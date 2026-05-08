import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure";
import {
  GATE_BH_REQUIRED_CLOSED_OWNER_MAP_GATE_IDS,
  GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION,
  GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_FILE,
  buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract,
  classifyGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidation,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BH - steel floor same-stack ISO DeltaLw residual policy closed-owner revalidation", () => {
  it("lands Gate BH as a no-runtime closed-owner residual-policy revalidation and selects Gate BI", () => {
    const contract =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
      previousLandedGate:
        "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi",
    });
    expect(contract.closedOwnerDecisionSummary).toEqual({
      currentDecisionBeforeClosure: "hold",
      closedOwnerPolicyDecision: "tighten",
      selectedCandidate: "tighten_candidate_policy_signal_only",
      selectedNextGateReason:
        "tighten_candidate_requires_later_governance_before_any_tolerance_change",
      toleranceOrRuntimeMovementAllowedNow: false,
    });
  });

  it("uses Gate BG's selected residual-policy closed-owner lane as input", () => {
    const gateBG =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();
    const contract =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();

    expect(contract.selectedFieldBuildingBasisOwnerClosureInput).toEqual(gateBG);
    expect(
      contract.selectedFieldBuildingBasisOwnerClosureInput
        .fieldBuildingBasisOwnerReadiness,
    ).toEqual({
      acceptedBuildingBasisOwnerPacketCount: 1,
      acceptedFieldBasisOwnerPacketCount: 1,
      fieldBuildingBasisOwnerClosureComplete: true,
      remainingBuildingBasisOwnerPacketShortfall: 0,
      remainingFieldBasisOwnerPacketShortfall: 0,
      selectedNextClosureLaneId: "residual_policy_closed_owner_revalidation",
    });
    expect(
      contract.closedOwnerRevalidationRow.acceptedForClosedOwnerRevalidation,
    ).toBe(true);
  });

  it("reconstructs the closed owner map from Gate BD, BE, BF, and BG evidence-only closures", () => {
    const row =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract()
        .closedOwnerRevalidationRow;

    expect(row.closedOwnerMap).toMatchObject({
      allResidualPolicyOwnerBlockersClosed: true,
      closedOwnerResidualCaseCount: 3,
      currentAdmittedDeltaLwHoldoutCount: 1,
      currentPairedNegativeBoundaryCount: 1,
      fieldAndBuildingBasisOwnersPresent: true,
      openWebFormulaInputsSourceOwned: true,
      policyOnlyAdditionalDeltaLwHoldoutCount: 2,
      policyOnlyAdditionalPairedNegativeBoundaryCount: 3,
      sourceOwnedMetricHoldoutsPresent: true,
      totalPairedNegativeBoundaryCount: 4,
    });
    expect(row.closedOwnerMap.requirements.map((entry) => entry.gateId)).toEqual([
      ...GATE_BH_REQUIRED_CLOSED_OWNER_MAP_GATE_IDS,
    ]);
    expect(
      row.closedOwnerMap.requirements.map((entry) => ({
        acceptedCount: entry.acceptedCount,
        blocker: entry.blocker,
        closed: entry.closed,
        requiredCount: entry.requiredCount,
      })),
    ).toEqual([
      {
        acceptedCount: 2,
        blocker: "holdout_count_below_policy_threshold",
        closed: true,
        requiredCount: 2,
      },
      {
        acceptedCount: 3,
        blocker: "paired_negative_boundaries_missing",
        closed: true,
        requiredCount: 3,
      },
      {
        acceptedCount: 1,
        blocker: "open_web_formula_inputs_not_source_owned",
        closed: true,
        requiredCount: 1,
      },
      {
        acceptedCount: 2,
        blocker: "field_and_building_basis_owners_missing",
        closed: true,
        requiredCount: 2,
      },
    ]);
    expect(
      row.closedOwnerMap.requirements.every(
        (entry) =>
          entry.runtimeValueMovement === false &&
          entry.sourceRowsAreResidualReadinessEvidenceNotProduct === true,
      ),
    ).toBe(true);
  });

  it("revalidates the closed owner map as a tighten candidate without moving runtime or tolerance", () => {
    const row =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract()
        .closedOwnerRevalidationRow;

    expect(row.residualEvidence).toEqual({
      closureRowsUsedAsMeasuredRuntimeEvidence: false,
      maxAbsoluteResidualDb: 0.6,
      meanAbsoluteResidualDb: 0.6,
      measuredMetricValueIngestedForRuntime: false,
      policyOnlyClosureResidualValuesDb: [0.6, 0.5],
      policyOnlyResidualValuesDb: [0.6, 0.6, 0.5],
    });
    expect(row.closedOwnerPolicy).toMatchObject({
      blockers: [],
      currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      decision: "tighten",
      maxAbsoluteResidualDb: 0.6,
      meanAbsoluteResidualDb: 0.6,
      metricId: "DeltaLw",
      residualCaseCount: 3,
      retuneAllowedNow: false,
      runtimeValueMovement: false,
      threshold: {
        requiredHoldoutCount: 3,
        requiredPairedNegativeBoundaryCount: 4,
      },
    });
    expect(row).toMatchObject({
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canRetuneRuntimeNow: false,
      decisionClassification: "tighten_candidate_requires_later_gate",
      exactSourceOverrideAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      policyDecision: "tighten",
      policyDecisionIsRuntimeAction: false,
      residualPolicyDecisionUse: "closed_owner_policy_revalidation_only",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps all closure rows evidence-only and out of runtime evidence", () => {
    const row =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract()
        .closedOwnerRevalidationRow;
    const gateBF =
      row.fieldBuildingBasisOwnerClosureContract
        .selectedOpenWebInputOwnershipClosureInput;
    const gateBE = gateBF.selectedPairedNegativeClosureInput;
    const gateBD = gateBE.selectedHoldoutClosureInput;
    const acceptedGateBDRows = gateBD.holdoutClosureProbeRows.filter(
      (closureRow) => closureRow.closureEvidenceAccepted,
    );
    const acceptedGateBERows = gateBE.pairedNegativeClosureProbeRows.filter(
      (closureRow) => closureRow.closureEvidenceAccepted,
    );
    const acceptedGateBFRows =
      gateBF.openWebInputOwnershipClosureProbeRows.filter(
        (closureRow) => closureRow.closureEvidenceAccepted,
      );
    const acceptedGateBGRows =
      row.fieldBuildingBasisOwnerClosureContract
        .fieldBuildingBasisOwnerClosureProbeRows.filter(
          (closureRow) => closureRow.closureEvidenceAccepted,
        );
    const acceptedClosureRows = [
      ...acceptedGateBDRows,
      ...acceptedGateBERows,
      ...acceptedGateBFRows,
      ...acceptedGateBGRows,
    ];

    expect(acceptedClosureRows).toHaveLength(8);
    expect(
      acceptedClosureRows.every(
        (closureRow) =>
          closureRow.measuredMetricValueIngestedForRuntime === false &&
          closureRow.runtimeValueMovement === false &&
          closureRow.toleranceChangeAllowedNow === false &&
          closureRow.sourceTextIngested === false &&
          closureRow.sourceDocumentCopied === false,
      ),
    ).toBe(true);
  });

  it("blocks closed-owner revalidation when Gate BG did not select that next lane", () => {
    const gateBG =
      buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();
    const hostileRow =
      classifyGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidation(
        {
          fieldBuildingBasisOwnerClosureContract: {
            ...gateBG,
            fieldBuildingBasisOwnerReadiness: {
              ...gateBG.fieldBuildingBasisOwnerReadiness,
              selectedNextClosureLaneId:
                "field_building_basis_owner_closure" as "residual_policy_closed_owner_revalidation",
            },
          },
          id: "gate_bh_hostile_gate_bg_did_not_select_closed_owner_revalidation",
        },
      );

    expect(hostileRow).toMatchObject({
      acceptedForClosedOwnerRevalidation: false,
      closedOwnerPolicy: null,
      decisionClassification:
        "blocked_gate_bg_next_lane_not_residual_policy_closed_owner_revalidation",
      policyDecision: null,
      residualPolicyDecisionUse: "blocked_closed_owner_revalidation_input",
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation frozen", () => {
    const contract =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactSourceOverridePolicy).toEqual({
      closedOwnerRevalidationRowsAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      buildingPredictionRequiresOwnContextBeforeRuntime: true,
      fieldImpactRequiresOwnContextBeforeRuntime: true,
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
      labLnWCanAliasApparentOrBuildingMetrics: false,
    });
    expect(contract.residualPolicyClosedOwnerRevalidationPolicy).toMatchObject({
      closedOwnerDecisionCanMoveRuntimeNow: false,
      closedOwnerDecisionCanMoveToleranceNow: false,
      closureRowsAreEvidenceNotRuntimeAction: true,
      laterGateRequiredBeforeTightenRetuneOrWiden: true,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BH and selected Gate BI", async () => {
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
        "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts",
    );
  });
});
