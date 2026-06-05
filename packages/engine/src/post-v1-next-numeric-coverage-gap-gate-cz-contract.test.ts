import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS
} from "./post-v1-floor-composite-panel-delta-lw-owner-gate-cy";
import {
  POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CZ_PLAN_DOC_PATH,
  POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_CZ_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS,
  rankPostV1GateCZNumericCoverageCandidates,
  summarizePostV1GateCZNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cz";

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

describe("post-V1 next numeric coverage gap Gate CZ", () => {
  it("lands the no-runtime Gate CZ rerank after Gate CY and selects lightweight-concrete DeltaLw Gate DA", () => {
    const summary = summarizePostV1GateCZNumericCoverageGap();

    expect(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS).toBe(
      "post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz"
    );
    expect(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE
    );
    expect(POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CZ_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
    });
  });

  it("selects the highest ROI engine-only owner contract and rejects fake scope moves", () => {
    const candidates = rankPostV1GateCZNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
      sliceKind: "input_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CZ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_accuracy_tightening_gap")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);

    for (
      const alreadyLiveId of [
        "floor.composite_panel_field_companion_gap",
        "wall.local_substitution_flat_order_second_pass_gap",
        "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
      ] as const
    ) {
      expect(byId.get(alreadyLiveId)).toMatchObject({
        nextActionMovesRuntimeValues: false,
        selected: false,
        sliceKind: "already_runtime_capable"
      });
    }

    for (
      const closedId of [
        "floor.composite_panel_delta_lw_published_interaction_owner_gap",
        "wall.local_substitution_building_prediction_adapter_gap",
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

  it("records the lightweight-concrete DeltaLw boundary before runtime values move", () => {
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(0);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(0);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.estimatedFollowOnNewCalculableLayerTemplates).toBe(2);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.estimatedFollowOnNewCalculableRequestShapes).toBe(2);
    expect(POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "lightweight-concrete DeltaLw must be admitted only after a family-specific owner contract pins required physical inputs and basis boundaries",
      "heavy-concrete Annex C, composite-panel bare-minus-treated, timber/CLT, and steel mass-spring DeltaLw routes must not be borrowed for lightweight-concrete stacks",
      "existing lightweight-concrete Rw, Ln,w, and explicit field-impact companion pins remain on their owned bases",
      "missing base slab, lightweight material class, upper treatment, resilient layer, dynamic stiffness, load basis, or family owner fields remains needs_input or unsupported",
      "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate CZ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID);
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts");
  });
});
