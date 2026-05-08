import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_ACTION,
  GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_FILE,
  buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract,
  classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision";
import {
  evaluateSteelFloorFormulaResidualMetricPolicy,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BB - steel floor same-stack ISO DeltaLw residual policy decision", () => {
  it("lands Gate BB as a no-runtime residual-policy decision surface and selects Gate BC", () => {
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
      overallDecision: "hold_current_steel_floor_formula_corridor",
      previousLandedGate:
        "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc",
    });
    expect(contract.acceptedPolicyDecisionProbeIds).toEqual([
      "gate_bb_probe_gate_ba_probe_gate_az_probe_gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe_calibration_candidate_residual_admission_policy_decision",
    ]);
    expect(contract.heldPolicyDecisionProbeIds).toEqual(
      contract.acceptedPolicyDecisionProbeIds,
    );
  });

  it("uses only Gate BA residual-admitted rows as policy-decision inputs", () => {
    const gateBA =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();

    expect(
      contract.currentPolicyDecisionRows.map(
        (row) => row.residualAdmissionRow.id,
      ),
    ).toEqual(
      gateBA.currentResidualAdmissionBoundaryRows.map((row) => row.id),
    );
    expect(
      contract.packetPolicyDecisionProbeRows.map(
        (row) => row.residualAdmissionRow.id,
      ),
    ).toEqual(
      gateBA.packetResidualAdmissionProbeRows.map((row) => row.id),
    );
    expect(contract.residualPolicyDecisionPolicy).toMatchObject({
      gateBAResidualAdmittedRowsOnly: true,
      policyDecisionRowsAreEvidenceNotRuntimeAction: true,
      rejectedOrBlockedAdmissionRowsRemainBlocked: true,
    });
    expect(contract.residualPolicyDecisionSurface).toEqual({
      blockerClosureOwner: "same_stack_iso_delta_lw_residual_blocker_closure",
      currentDeltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      currentMetricId: "DeltaLw",
      requiredDeltaLwHoldoutCount: 3,
      requiredFieldAndBuildingBasisOwners: true,
      requiredOpenWebFormulaInputOwnership: true,
      requiredPairedNegativeBoundaryCount: 4,
      selectedTermId: "source_owned_delta_lw_holdout_absence",
    });
  });

  it("keeps current blocked residual-admission rows out of policy decisions", () => {
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();

    expect(contract.currentPolicyDecisionRows).toHaveLength(9);
    expect(
      contract.currentPolicyDecisionRows.every(
        (row) =>
          row.acceptedForPolicyDecision === false &&
          row.decisionClassification === "blocked_no_residual_policy_input" &&
          row.policyDecision === null &&
          row.residualPolicy === null &&
          row.residualPolicyDecisionUse === "blocked_policy_decision_input" &&
          row.runtimeValueMovement === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
  });

  it("keeps the admitted future row at hold with explicit blocker-closure requirements", () => {
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();
    const accepted = contract.packetPolicyDecisionProbeRows.find(
      (row) => row.acceptedForPolicyDecision,
    );

    expect(accepted).toBeDefined();
    expect(accepted).toMatchObject({
      acceptedForPolicyDecision: true,
      blockerClosureRequirements: {
        fieldAndBuildingBasisOwnersRequired: true,
        holdoutCountShortfall: 2,
        openWebFormulaInputsSourceOwnedRequired: true,
        pairedNegativeBoundaryShortfall: 3,
        sourceOwnedCorrectionRequiredBeforeRetune: false,
      },
      blockers: [
        "holdout_count_below_policy_threshold",
        "paired_negative_boundaries_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ],
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      canSelectLaterRetuneGate: false,
      canSelectLaterTightenGate: false,
      canSelectLaterWidenGate: false,
      canUseAsExactMeasuredRow: false,
      decisionClassification: "hold_current_corridor_policy_decision",
      exactSourceOverrideAllowedNow: false,
      fieldBuildingAliasAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      policyDecision: "hold",
      policyDecisionIsRuntimeAction: false,
      residualPolicyDecisionUse: "residual_policy_decision_only",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      sourceDocumentCopied: false,
      sourceRowsArePolicyEvidenceNotProduct: true,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
    expect(accepted!.residualPolicy).toMatchObject({
      currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      decision: "hold",
      maxAbsoluteResidualDb: 0.6,
      meanAbsoluteResidualDb: 0.6,
      residualCaseCount: 1,
      retuneAllowedNow: false,
      runtimeValueMovement: false,
      threshold: {
        requiredHoldoutCount: 3,
        requiredPairedNegativeBoundaryCount: 4,
      },
    });
  });

  it("does not convert future tighten, widen, or retune policy labels into runtime movement", () => {
    const gateBA =
      buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();
    const admitted = gateBA.packetResidualAdmissionProbeRows.find(
      (row) => row.residualEvaluationAllowed,
    );
    expect(admitted).toBeDefined();

    const retuneCandidate =
      classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision({
        id: "gate_bb_hostile_retune_candidate_policy_decision",
        residualAdmissionRow: {
          ...admitted!,
          residualPolicyIfAdmitted:
            evaluateSteelFloorFormulaResidualMetricPolicy({
              currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
              fieldAndBuildingBasisOwnersPresent: true,
              maxAbsoluteResidualDb:
                STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB + 1,
              meanAbsoluteResidualDb:
                STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB + 0.2,
              metricId: "DeltaLw",
              openWebFormulaInputsSourceOwned: true,
              pairedNegativeBoundaryCount: 4,
              requiredHoldoutCount: 3,
              requiredPairedNegativeBoundaryCount: 4,
              residualCaseCount: 3,
              sourceOwnedCorrectionAvailable: true,
              sourceOwnedMetricHoldoutsPresent: true,
            }),
        },
      });
    const tightenCandidate =
      classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision({
        id: "gate_bb_hostile_tighten_candidate_policy_decision",
        residualAdmissionRow: {
          ...admitted!,
          residualPolicyIfAdmitted:
            evaluateSteelFloorFormulaResidualMetricPolicy({
              currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
              fieldAndBuildingBasisOwnersPresent: true,
              maxAbsoluteResidualDb: 0.7,
              meanAbsoluteResidualDb: 0.4,
              metricId: "DeltaLw",
              openWebFormulaInputsSourceOwned: true,
              pairedNegativeBoundaryCount: 4,
              requiredHoldoutCount: 3,
              requiredPairedNegativeBoundaryCount: 4,
              residualCaseCount: 3,
              sourceOwnedCorrectionAvailable: false,
              sourceOwnedMetricHoldoutsPresent: true,
            }),
        },
      });
    const widenCandidate =
      classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision({
        id: "gate_bb_hostile_widen_candidate_policy_decision",
        residualAdmissionRow: {
          ...admitted!,
          residualPolicyIfAdmitted:
            evaluateSteelFloorFormulaResidualMetricPolicy({
              currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
              fieldAndBuildingBasisOwnersPresent: false,
              maxAbsoluteResidualDb:
                STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB + 1,
              meanAbsoluteResidualDb:
                STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB + 0.2,
              metricId: "DeltaLw",
              openWebFormulaInputsSourceOwned: false,
              pairedNegativeBoundaryCount: 1,
              requiredHoldoutCount: 3,
              requiredPairedNegativeBoundaryCount: 4,
              residualCaseCount: 1,
              sourceOwnedCorrectionAvailable: false,
              sourceOwnedMetricHoldoutsPresent: true,
            }),
        },
      });

    expect(retuneCandidate).toMatchObject({
      canSelectLaterRetuneGate: true,
      decisionClassification: "retune_candidate_requires_later_gate",
      policyDecision: "retune_candidate",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
    expect(tightenCandidate).toMatchObject({
      canSelectLaterTightenGate: true,
      decisionClassification: "tighten_candidate_requires_later_gate",
      policyDecision: "tighten",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
    expect(widenCandidate).toMatchObject({
      canSelectLaterWidenGate: true,
      decisionClassification: "widen_candidate_requires_later_gate",
      policyDecision: "widen",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps rejected Gate BA probes blocked before policy decision and runtime use", () => {
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();
    const rejectedProbeRows = contract.packetPolicyDecisionProbeRows.filter(
      (row) => !row.acceptedForPolicyDecision,
    );

    expect(rejectedProbeRows).toHaveLength(7);
    expect(
      rejectedProbeRows.every(
        (row) =>
          row.decisionClassification ===
            "blocked_no_residual_policy_input" &&
          row.canMoveRuntimeNow === false &&
          row.canPromoteExactSourceNow === false &&
          row.canUseAsExactMeasuredRow === false &&
          row.exactSourceOverrideAllowedNow === false &&
          row.fieldBuildingAliasAllowedNow === false &&
          row.measuredMetricValueIngestedForRuntime === false &&
          row.policyDecision === null &&
          row.residualPolicy === null &&
          row.runtimeRetuneAllowedNow === false &&
          row.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();

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
      residualPolicyDecisionRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BB and selected Gate BC", async () => {
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
        "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts",
    );
  });
});
