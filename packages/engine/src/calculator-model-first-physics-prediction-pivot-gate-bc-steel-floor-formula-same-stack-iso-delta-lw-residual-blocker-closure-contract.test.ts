import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision";
import {
  GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_ACTION,
  GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_FILE,
  buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract,
  classifyGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureLane,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate BC - steel floor same-stack ISO DeltaLw residual blocker closure", () => {
  it("lands Gate BC as a no-runtime blocker-closure ranking and selects Gate BD", () => {
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

    expect(contract).toMatchObject({
      landedGate:
        "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
      previousLandedGate:
        "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd",
    });
    expect(contract.selectedClosureLaneIds).toEqual([
      "same_stack_iso_delta_lw_holdout_count_closure",
    ]);
  });

  it("uses only Gate BB accepted policy-decision rows as blocker-closure inputs", () => {
    const gateBB =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

    expect(contract.acceptedPolicyDecisionInputIds).toEqual(
      gateBB.acceptedPolicyDecisionProbeIds,
    );
    expect(contract.blockedCurrentPolicyDecisionInputIds).toHaveLength(9);
    expect(contract.blockedProbePolicyDecisionInputIds).toEqual(
      gateBB.blockedPolicyDecisionProbeIds,
    );
    expect(
      new Set(contract.closureLaneRanking.map((lane) => lane.policyDecisionRow.id)),
    ).toEqual(new Set(gateBB.acceptedPolicyDecisionProbeIds));
    expect(contract.residualBlockerClosurePolicy).toMatchObject({
      broadSourceCrawlAllowed: false,
      gateBBAcceptedPolicyDecisionRowsOnly: true,
      rejectedOrBlockedPolicyRowsRemainBlocked: true,
      selectedLaneCanMoveRuntimeNow: false,
      selectedLaneCanMoveToleranceNow: false,
    });
  });

  it("ranks the explicit hold blockers without changing residual thresholds", () => {
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

    expect(
      contract.closureLaneRanking.map((lane) => ({
        associatedBlocker: lane.associatedBlocker,
        closureLaneScope: lane.closureLaneScope,
        laneId: lane.laneId,
        priorityRank: lane.priorityRank,
        selectedForNextGate: lane.selectedForNextGate,
        shortfallCount: lane.shortfallCount,
      })),
    ).toEqual([
      {
        associatedBlocker: "holdout_count_below_policy_threshold",
        closureLaneScope: "metric_holdout_count_closure",
        laneId: "same_stack_iso_delta_lw_holdout_count_closure",
        priorityRank: 1,
        selectedForNextGate: true,
        shortfallCount: 2,
      },
      {
        associatedBlocker: "paired_negative_boundaries_missing",
        closureLaneScope: "paired_negative_boundary_closure",
        laneId: "paired_negative_boundary_closure",
        priorityRank: 2,
        selectedForNextGate: false,
        shortfallCount: 3,
      },
      {
        associatedBlocker: "open_web_formula_inputs_not_source_owned",
        closureLaneScope: "carrier_formula_input_owner_closure",
        laneId: "open_web_formula_input_ownership_closure",
        priorityRank: 3,
        selectedForNextGate: false,
        shortfallCount: null,
      },
      {
        associatedBlocker: "field_and_building_basis_owners_missing",
        closureLaneScope: "basis_owner_closure",
        laneId: "field_building_basis_owner_closure",
        priorityRank: 4,
        selectedForNextGate: false,
        shortfallCount: null,
      },
    ]);
  });

  it("selects the same-stack ISO DeltaLw holdout-count closure lane without runtime movement", () => {
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

    expect(contract.selectedClosureLane).toMatchObject({
      associatedBlocker: "holdout_count_below_policy_threshold",
      blockerPresent: true,
      broadSourceCrawlAllowed: false,
      canMoveRuntimeNow: false,
      canPromoteExactSourceNow: false,
      closureDecision: "selected_next_narrow_closure_lane",
      closureLaneScope: "metric_holdout_count_closure",
      closureReadinessImpact: "residual_case_count_readiness",
      laneId: "same_stack_iso_delta_lw_holdout_count_closure",
      measuredMetricValueIngestedForRuntime: false,
      priorityRank: 1,
      selectedForNextGate: true,
      shortfallCount: 2,
      sourceDocumentCopied: false,
      sourceTextIngested: false,
      toleranceChangeAllowedNow: false,
    });
    expect(contract.selectedClosureLane.policyDecisionRow.policyDecision).toBe(
      "hold",
    );
  });

  it("keeps blocked Gate BB policy rows out of blocker-closure ranking", () => {
    const gateBB =
      buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();
    const rankedPolicyIds = new Set(
      contract.closureLaneRanking.map((lane) => lane.policyDecisionRow.id),
    );

    for (const blockedId of [
      ...contract.blockedCurrentPolicyDecisionInputIds,
      ...contract.blockedProbePolicyDecisionInputIds,
    ]) {
      expect(rankedPolicyIds.has(blockedId)).toBe(false);
    }

    const blockedProbe = gateBB.packetPolicyDecisionProbeRows.find(
      (row) => !row.acceptedForPolicyDecision,
    );
    expect(blockedProbe).toBeDefined();
    const hostileLane =
      classifyGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureLane({
        laneId: "same_stack_iso_delta_lw_holdout_count_closure",
        policyDecisionRow: blockedProbe!,
      });

    expect(hostileLane).toMatchObject({
      closureDecision: "blocked_policy_decision_not_admitted",
      selectedForNextGate: false,
      canMoveRuntimeNow: false,
      toleranceChangeAllowedNow: false,
    });
  });

  it("keeps follow-up closure lanes ranked but not selected for Gate BD", () => {
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();
    const followups = contract.closureLaneRanking.filter(
      (lane) => !lane.selectedForNextGate,
    );

    expect(followups).toHaveLength(3);
    expect(
      followups.every(
        (lane) =>
          lane.blockerPresent === true &&
          lane.closureDecision === "ranked_followup_closure_lane" &&
          lane.broadSourceCrawlAllowed === false &&
          lane.canMoveRuntimeNow === false &&
          lane.toleranceChangeAllowedNow === false,
      ),
    ).toBe(true);
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation explicit", () => {
    const contract =
      buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

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
      residualBlockerClosureRowsAreNotExactRows: true,
    });
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with landed Gate BC and selected Gate BD", async () => {
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
        "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts",
      );
      expect(content).toContain(
        "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts",
    );
  });
});
