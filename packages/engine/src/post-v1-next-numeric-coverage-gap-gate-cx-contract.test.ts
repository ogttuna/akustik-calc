import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_CX_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CX_PLAN_DOC_PATH,
  POST_V1_GATE_CX_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS,
  rankPostV1GateCXNumericCoverageCandidates,
  summarizePostV1GateCXNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cx";
import {
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS
} from "./post-v1-wall-local-substitution-building-adapter-gate-cw";

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

describe("post-V1 next numeric coverage gap Gate CX", () => {
  it("lands the no-runtime Gate CX rerank after Gate CW and selects composite-panel DeltaLw Gate CY", () => {
    const summary = summarizePostV1GateCXNumericCoverageGap();

    expect(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS).toBe(
      "post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx"
    );
    expect(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE
    );
    expect(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CX_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CX_PLAN_DOC_PATH,
      selectedCandidateId: "floor.composite_panel_delta_lw_published_interaction_owner_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS
    });
  });

  it("selects the highest ROI engine-only formula owner and rejects fake scope moves", () => {
    const candidates = rankPostV1GateCXNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: "floor.composite_panel_delta_lw_published_interaction_owner_gap",
      passesCalculatorAdvancementTest: true,
      runtimeAdmissibleNext: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.local_substitution_flat_order_second_pass_gap")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("floor.composite_panel_field_companion_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);

    for (
      const alreadyLiveId of [
        "wall.local_substitution_flat_order_second_pass_gap",
        "floor.composite_panel_field_companion_gap",
        "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
      ] as const
    ) {
      expect(byId.get(alreadyLiveId)).toMatchObject({
        runtimeAdmissibleNext: false,
        selected: false,
        sliceKind: "already_runtime_capable"
      });
    }

    expect(byId.get("floor.lightweight_concrete_delta_lw_owner_gap")).toMatchObject({
      runtimeAdmissibleNext: false,
      selected: false,
      sliceKind: "formula_owner_not_ready"
    });

    for (
      const closedId of [
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

  it("records the Gate CY safety boundary before runtime values move", () => {
    expect(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.frontendImplementationFilesTouched).toBe(0);
    expect(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableLayerTemplates).toBe(3);
    expect(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.estimatedNextNewCalculableRequestShapes).toBe(3);
    expect(POST_V1_GATE_CX_NO_RUNTIME_COUNTERS.wrongAliasOrFallbackBlocks).toEqual([
      "composite-panel DeltaLw may be admitted only as a separate published-interaction owner derived from same-family bare and treated Ln,w anchors",
      "heavy-concrete Annex C DeltaLw formulas must not be borrowed for composite-panel or lightweight-concrete families",
      "existing composite-panel Rw and Ln,w pins remain unchanged and exact same-stack floor rows stay higher precedence",
      "missing baseSlabOrFloor, toppingOrFloatingLayer, resilient layer, or lower-treatment physical owner fields remains needs_input",
      "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate CX selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.composite_panel_delta_lw_published_interaction_owner_gap");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts");
  });
});
