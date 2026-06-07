import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS
} from "./post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db";
import {
  POST_V1_GATE_DC_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DC_PLAN_DOC_PATH,
  POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DC_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS,
  rankPostV1GateDCNumericCoverageCandidates,
  summarizePostV1GateDCNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dc";

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

describe("post-V1 next numeric coverage gap Gate DC", () => {
  it("lands the no-runtime Gate DC rerank after Gate DB and selects heavy-core / lined-massive Gate DD", () => {
    const summary = summarizePostV1GateDCNumericCoverageGap();

    expect(POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS).toBe(
      "post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_landed_runtime_selected_next_numeric_coverage_gap_gate_dc"
    );
    expect(POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE
    );
    expect(POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DC_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DC_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS
    });
  });

  it("selects the highest ROI accuracy-safe engine slice and rejects fake scope moves", () => {
    const candidates = rankPostV1GateDCNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_readiness_contract",
      sourceRowsRequiredForSelection: true,
      targetMetrics: POST_V1_GATE_DC_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);

    for (
      const closedId of [
        "floor.lightweight_concrete_delta_lw_family_owner_contract_gap",
        "floor.lightweight_concrete_delta_lw_runtime_corridor_gap",
        "floor.composite_panel_delta_lw_published_interaction_owner_gap",
        "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
      ] as const
    ) {
      expect(byId.get(closedId)).toMatchObject({
        selected: false,
        sliceKind: "closed_runtime_gap"
      });
    }

    for (
      const alreadyLiveId of [
        "wall.local_substitution_flat_order_second_pass_gap",
        "floor.composite_panel_field_companion_gap",
        "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
      ] as const
    ) {
      expect(byId.get(alreadyLiveId)).toMatchObject({
        selected: false,
        sliceKind: "already_runtime_capable"
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

  it("records the Gate DD safety boundary before accuracy values move", () => {
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(0);
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(0);
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.accuracyReadinessLedgers).toBe(1);
    expect(POST_V1_GATE_DC_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "heavy-core / lined-massive Rw or field retune must not move until a wall-specific source row or bounded lining rule is named",
      "generated wall-screening-concrete rows, workbench presets, selector pins, and deep-hybrid guards are not calibration holdouts",
      "floor-only concrete ceiling rows do not become wall lining source truth",
      "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and building outputs keep separate metric/basis owners",
      "broad source crawling, confidence wording, and frontend polish remain blocked as next calculator slices"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate DC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DC_SELECTED_CANDIDATE_ID);
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts");
  });
});
