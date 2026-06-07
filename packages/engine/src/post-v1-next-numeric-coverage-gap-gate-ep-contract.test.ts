import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EO_COUNTERS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo";
import {
  POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EP_PLAN_DOC_PATH,
  POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS,
  POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS,
  buildPostV1GateEPCurrentRouteEvidence,
  rankPostV1GateEPNumericCoverageCandidates,
  summarizePostV1GateEPNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ep";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EP_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EP", () => {
  it("lands after Gate EO and selects the direct-fixed field/building adapter owner Gate EQ", () => {
    const summary = summarizePostV1GateEPNumericCoverageGap();

    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS).toBe(
      "post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_landed_runtime_selected_next_numeric_coverage_gap_gate_ep"
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EP_PLAN_DOC_PATH,
      previousGateEO: {
        counters: POST_V1_GATE_EO_COUNTERS,
        landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS
    });
  }, 30000);

  it("ranks the adapter owner proof above already-live, closed, and non-goal work", () => {
    const candidates = rankPostV1GateEPNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EP_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
      sliceKind: "adapter_owner_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_lab_closed_by_eo")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.gate_s_non_direct_fixed_field_building_already_live")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_missing_input_boundaries")?.score ?? 0);
    expect(byId.get("wall.direct_fixed_building_alias_without_adapter_rejected")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_metric_alias"
    });
    expect(byId.get("broad_source_crawl_frontend_confidence_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves the current direct-fixed field/building gap from runtime evidence", () => {
    const evidence = buildPostV1GateEPCurrentRouteEvidence();

    expect(evidence).toMatchObject({
      labBasisMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      labMetrics: {
        C: -1.2,
        Ctr: -5.9,
        Rw: 31,
        STC: 31
      },
      labSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
    });

    expect(evidence.fieldSupportedOutputs).toEqual(POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS);
    expect(evidence.fieldUnsupportedOutputs).toEqual([]);
    expect(evidence.fieldMetrics).toEqual(POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldExpectedMetrics);
    expect(evidence.fieldBasisMethod).toBe(POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldCurrentScreeningMethod);
    expect(evidence.fieldSelectedCandidateId).toBe(
      POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldCurrentScreeningCandidateId
    );
    expect(evidence.fieldBasisMethod).not.toBe(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
    expect(evidence.fieldBasisMethod).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(evidence.fieldBasisMethod).not.toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);

    expect(evidence.buildingSupportedOutputs).toEqual([]);
    expect(evidence.buildingUnsupportedOutputs).toEqual(POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS);
    expect(evidence.buildingBasisMethod).toBe(
      POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.buildingCurrentUnsupportedMethod
    );
    expect(evidence.buildingSelectedCandidateId).toBe(
      POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.buildingSelectedCandidateId
    );
    expect(evidence.buildingBasisMethod).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(evidence.missingFieldRt60BasisMethod).toBe(
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expect(evidence.missingFieldRt60MissingPhysicalInputs).toEqual(["receivingRoomRt60S"]);
    expect(evidence.missingFieldRt60SelectedCandidateId).toBe(
      POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.missingFieldRt60CandidateId
    );
  });

  it("ties every candidate to current implementation evidence and keeps Gate EP no-runtime", () => {
    const candidates = rankPostV1GateEPNumericCoverageCandidates();

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    expect(POST_V1_GATE_EP_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesFrontendImplementationNow)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesSharedOrApiSurfaceNow)).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with Gate EP closeout and Gate EQ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EP_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EQ");
      expect(normalizedWhitespaceContent, path).toContain("direct-fixed double-leaf field/building adapter");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const gateEpEqPlan = readRepoFile(POST_V1_GATE_EP_PLAN_DOC_PATH);
    expect(gateEpEqPlan).toContain("Gate EP Iteration 1");
    expect(gateEpEqPlan).toContain("Gate EP Iteration 2");
    expect(gateEpEqPlan).toContain("Gate EQ Work Order");
    expect(gateEpEqPlan).toContain("screening_mass_law_curve_seed_v3");
    expect(gateEpEqPlan).toContain("dynamic_calculator_building_prediction_runtime_adapter_owner_missing");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts");
  });
});
