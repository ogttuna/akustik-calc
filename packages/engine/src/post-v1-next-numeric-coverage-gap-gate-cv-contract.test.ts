import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_CV_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CV_PLAN_DOC_PATH,
  POST_V1_GATE_CV_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS,
  rankPostV1GateCVNumericCoverageCandidates,
  summarizePostV1GateCVNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cv";
import {
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS
} from "./post-v1-wall-flat-layer-order-multicavity-gate-cu";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CV", () => {
  it("lands the no-runtime Gate CV rerank after Gate CU and selects wall local-substitution building Gate CW", () => {
    const summary = summarizePostV1GateCVNumericCoverageGap();

    expect(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv"
    );
    expect(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE
    );
    expect(POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CV_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CV_PLAN_DOC_PATH,
      selectedCandidateId: "wall.local_substitution_building_prediction_adapter_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS
    });
  });

  it("selects the highest ROI engine-only route and does not mistake already-live pins for new scope", () => {
    const candidates = rankPostV1GateCVNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "wall.local_substitution_building_prediction_adapter_gap",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CV_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.common_floating_lower_treatment_direct_flanking_field_context_gap")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0
    );
    expect(byId.get("floor.common_floating_lower_treatment_direct_flanking_field_context_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });

    for (
      const closedId of [
        "wall.flat_layer_order_multicavity_grouped_owner_gap",
        "wall.common_auto_topology_second_pass_after_cj",
        "floor.common_floating_lower_treatment_published_anchor_gap",
        "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
      ] as const
    ) {
      expect(byId.get(closedId)).toMatchObject({
        selected: false,
        sliceKind: "closed_runtime_gap"
      });
    }

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the Gate CW safety boundary before runtime values move", () => {
    expect(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(1);
    expect(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(5);
    expect(POST_V1_GATE_CV_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "local-substitution building outputs may be admitted only from explicit building_prediction context with flanking, junction, room, and output-basis owners",
      "local-substitution lab Rw/STC/C/Ctr and field R'w/DnT,w must not be relabelled as building-prediction outputs",
      "missing buildingPredictionOutputBasis, flankingJunctionClass, conservativeFlankingAssumption, room volumes, RT60, panel dimensions, or junctionCouplingLengthM remains needs_input or unsupported as currently owned",
      "exact same-stack source rows remain higher precedence than the source-absent local-substitution building adapter",
      "floor ISO impact routes still do not publish ASTM IIC or AIIC aliases"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate CV selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("wall.local_substitution_building_prediction_adapter_gap");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts");
  });
});
