import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_CT_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CT_PLAN_DOC_PATH,
  POST_V1_GATE_CT_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS,
  rankPostV1GateCTNumericCoverageCandidates,
  summarizePostV1GateCTNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ct";
import {
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS
} from "./post-v1-wall-common-auto-topology-second-pass-gate-cs";

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

describe("post-V1 next numeric coverage gap Gate CT", () => {
  it("lands the no-runtime Gate CT rerank after Gate CS and selects wall flat-order multicavity Gate CU", () => {
    const summary = summarizePostV1GateCTNumericCoverageGap();

    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS).toBe(
      "post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct"
    );
    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE
    );
    expect(POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CT_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CT_PLAN_DOC_PATH,
      selectedCandidateId: "wall.flat_layer_order_multicavity_grouped_owner_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS
    });
  });

  it("selects the highest ROI formula-routing slice and blocks source crawl, confidence wording, and frontend drift", () => {
    const candidates = rankPostV1GateCTNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "wall.flat_layer_order_multicavity_grouped_owner_gap",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CT_SELECTED_TARGET_OUTPUTS,
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

    for (
      const closedId of [
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

  it("records the Gate CU safety boundary before runtime values move", () => {
    expect(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(1);
    expect(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(14);
    expect(POST_V1_GATE_CT_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "explicit flat_layer_order multicavity may be admitted only when safe five-segment leaf/cavity/leaf/cavity/leaf segmentation and support ownership are present",
      "explicit grouped indices on flat_layer_order remain a contradiction and must not be auto-reinterpreted",
      "missing supportTopology remains needs_input instead of defaulting a multicavity support owner",
      "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and building-prediction outputs keep their metric/basis owners separate",
      "ISO wall airborne routes still do not publish ASTM impact IIC or AIIC aliases"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate CT selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("wall.flat_layer_order_multicavity_grouped_owner_gap");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts");
  });
});
