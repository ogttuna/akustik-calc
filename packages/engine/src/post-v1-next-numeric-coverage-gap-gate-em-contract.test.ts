import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS
} from "./post-v1-wall-visible-layer-formula-route-second-pass-gate-el";
import {
  POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EM_PLAN_DOC_PATH,
  POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS,
  buildPostV1GateEMDirectFixedEvidence,
  rankPostV1GateEMNumericCoverageCandidates,
  summarizePostV1GateEMNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-em";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EM_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EM", () => {
  it("lands after Gate EL and selects the direct-fixed double-leaf bridge-loss owner Gate EN", () => {
    const summary = summarizePostV1GateEMNumericCoverageGap();

    expect(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS).toBe(
      "post_v1_wall_visible_layer_formula_route_second_pass_gate_el_landed_no_runtime_selected_next_numeric_coverage_gap_gate_em"
    );
    expect(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE
    );
    expect(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EM_PLAN_DOC_PATH,
      previousGateEL: {
        counters: POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
        selectedOutcomeId: POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
        selectionStatus: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS
    });
  }, 30000);

  it("ranks the bridge-loss owner proof above already-live, closed, and non-goal work", () => {
    const candidates = rankPostV1GateEMNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EM_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EM_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
      sliceKind: "bridge_loss_owner_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EM_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_framed_already_live_after_el")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.visible_advanced_wall_already_live_after_el")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.closed_wall_route_repeats_after_el")?.score ?? 0);
    expect(byId.get("wall.supportless_or_roleless_entries_need_input")).toMatchObject({
      selected: false,
      sliceKind: "needs_input_boundary"
    });
    expect(byId.get("wall.field_building_alias_from_lab_rejected")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_metric_alias"
    });
    expect(byId.get("broad_source_crawl_frontend_confidence_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves current implementation keeps complete direct-fixed double-leaf input at the negative boundary", () => {
    const evidence = buildPostV1GateEMDirectFixedEvidence();

    expect(evidence).toMatchObject({
      bridgeClass: "direct_fixed_bridge",
      candidateBasisMethod: undefined,
      candidateFamily: null,
      inputCompletenessStatus: "complete",
      missingPhysicalInputs: [],
      readinessStatus: "negative_boundary",
      runtimePromotionAllowed: false,
      runtimeValueMovement: false,
      selectedScenarioId: "gate_r_direct_fixed_bridge_negative_boundary"
    });
    expect(evidence.negativeBoundaryReasons).toEqual(
      expect.arrayContaining([
        "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned"
      ])
    );
  });

  it("ties every candidate to current implementation evidence and keeps Gate EM no-runtime", () => {
    const candidates = rankPostV1GateEMNumericCoverageCandidates();

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    expect(POST_V1_GATE_EM_NO_RUNTIME_COUNTERS).toMatchObject({
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

  it("keeps docs and current-gate runner aligned with Gate EM closeout and Gate EN selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EM_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EN");
      expect(contents, path).toContain("direct-fixed double-leaf bridge-loss owner");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const gateEmEnPlan = readRepoFile(POST_V1_GATE_EM_PLAN_DOC_PATH);
    expect(gateEmEnPlan).toContain("Gate EM Iteration 1");
    expect(gateEmEnPlan).toContain("Gate EM Iteration 2");
    expect(gateEmEnPlan).toContain("Gate EN Work Order");
    expect(gateEmEnPlan).toContain("wall.direct_fixed_double_leaf_bridge_loss_owner_gap");
    expect(gateEmEnPlan).toContain("direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts");
  });
});
