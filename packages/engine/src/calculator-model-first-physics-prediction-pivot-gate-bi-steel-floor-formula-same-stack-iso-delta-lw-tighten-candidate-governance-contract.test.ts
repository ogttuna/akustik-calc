import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract,
  type GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation";
import {
  GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES,
  GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION,
  GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE,
  buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract,
  classifyGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernance,
} from "./steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BI - steel floor same-stack ISO DeltaLw tighten-candidate governance", () => {
  it("lands Gate BI as a no-runtime governance guard and selects the coverage sprint", () => {
    const contract =
      buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
      previousLandedGate:
        "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bi_same_stack_iso_delta_lw_tighten_candidate_governance_landed_no_runtime_selected_personal_use_mvp_coverage_sprint_gate_a",
    });
    expect(contract.coverageSprintSelection).toMatchObject({
      initialScenarioRowTargetCount: 24,
      matrixMustUseCurrentEngineEntryPoints: true,
      nextLane: "personal_use_mvp_coverage_sprint_after_gate_bi",
      selectedFirstAction: "gate_a_personal_use_mvp_coverage_matrix_plan",
      selectedFirstFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts",
    });
  });

  it("uses Gate BH's selected tighten candidate only as a governance signal", () => {
    const gateBH =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();
    const contract =
      buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract();

    expect(contract.selectedClosedOwnerRevalidationInput).toEqual(gateBH);
    expect(contract.candidateGovernanceRow).toMatchObject({
      acceptedForGovernance: true,
      governanceDecision: "accepted_tighten_candidate_governance_signal_only",
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
    expect(
      contract.candidateGovernanceRow.closedOwnerRevalidationContract
        .closedOwnerDecisionSummary,
    ).toEqual({
      currentDecisionBeforeClosure: "hold",
      closedOwnerPolicyDecision: "tighten",
      selectedCandidate: "tighten_candidate_policy_signal_only",
      selectedNextGateReason:
        "tighten_candidate_requires_later_governance_before_any_tolerance_change",
      toleranceOrRuntimeMovementAllowedNow: false,
    });
  });

  it("defines all future-runtime prerequisites and keeps closure fixtures from satisfying them", () => {
    const contract =
      buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract();

    expect(contract.governancePrerequisites.map((entry) => entry.id)).toEqual([
      ...GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES,
    ]);
    expect(
      contract.governancePrerequisites.every(
        (entry) =>
          entry.status === "required_for_future_runtime_gate" &&
          entry.requiredBeforeRuntimeMovement === true &&
          entry.closureFixtureRowsCanSatisfy === false,
      ),
    ).toBe(true);
    expect(contract.candidateGovernanceRow.prerequisiteIds).toEqual([
      ...GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES,
    ]);
  });

  it("freezes runtime pins, exact-source precedence, source ingestion, and lab/field/building boundaries", () => {
    const contract =
      buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.frozenSurfacePolicy).toEqual({
      cardsReportsApisCanShowGovernanceLabelOnly: true,
      exactRowsRemainFirstPrecedence: true,
      formulaCoefficientsFrozen: true,
      labFieldBuildingAliasesBlocked: true,
      sourceTextOrDocumentIngestionBlocked: true,
      steelToleranceMovementBlocked: true,
    });
    expect(contract.candidateGovernanceRow).toMatchObject({
      exactSourceOverrideAllowedNow: false,
      fieldBuildingAliasAllowedNow: false,
      formulaCoefficientChangeAllowedNow: false,
      measuredMetricValueIngestedForRuntime: false,
      runtimeRetuneAllowedNow: false,
      sourceDocumentCopied: false,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("blocks governance when Gate BH did not select Gate BI", () => {
    const gateBH =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();
    const hostileGateBH = {
      ...gateBH,
      selectedNextAction: "wrong_next_gate",
    } as unknown as GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract;
    const row =
      classifyGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernance(
        {
          closedOwnerRevalidationContract: hostileGateBH,
          id: "gate_bi_hostile_gate_bh_did_not_select_governance",
        },
      );

    expect(row).toMatchObject({
      acceptedForGovernance: false,
      governanceDecision: "blocked_previous_gate_not_selected_gate_bi",
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("blocks governance when the previous policy is not a tighten candidate", () => {
    const gateBH =
      buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();
    const hostileGateBH = {
      ...gateBH,
      closedOwnerDecisionSummary: {
        ...gateBH.closedOwnerDecisionSummary,
        closedOwnerPolicyDecision: "hold",
      },
      closedOwnerRevalidationRow: {
        ...gateBH.closedOwnerRevalidationRow,
        decisionClassification:
          "hold_current_corridor_after_closed_owner_revalidation",
        policyDecision: "hold",
      },
    } as unknown as GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract;
    const row =
      classifyGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernance(
        {
          closedOwnerRevalidationContract: hostileGateBH,
          id: "gate_bi_hostile_gate_bh_not_tighten_candidate",
        },
      );

    expect(row).toMatchObject({
      acceptedForGovernance: false,
      governanceDecision: "blocked_previous_gate_not_tighten_candidate",
      runtimeValueMovement: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BI and selected coverage Gate A", async () => {
    const [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc, checkpoint, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/README.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
        ),
        readRepoFile(
          "docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BI_HANDOFF.md",
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts"),
      ]);

    for (const content of [
      agentsDoc,
      readmeDoc,
      planDoc,
      stateDoc,
      sliceDoc,
      checkpoint,
    ]) {
      expect(content).toContain(
        "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts",
      );
      expect(content).toContain("personal_use_mvp_coverage_sprint_after_gate_bi");
      expect(content).toContain(
        "calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts",
      );
      expect(content).toContain("gate_a_personal_use_mvp_coverage_matrix_plan");
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts",
    );
  });
});
