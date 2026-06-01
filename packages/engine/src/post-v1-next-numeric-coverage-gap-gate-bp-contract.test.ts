import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS,
  rankPostV1GateBPNumericCoverageCandidates,
  summarizePostV1GateBPNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bp";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BO_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BP_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BP", () => {
  it("lands a no-runtime rerank and selects the raw-bare floor airborne building runtime", () => {
    const summary = summarizePostV1GateBPNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBO: {
        landedGate: "post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan",
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
        selectionStatus:
          "post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp"
      },
      selectedCandidateId: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS
    });
  });

  it("ranks calculable building airborne coverage above non-calculator work", () => {
    const candidates = rankPostV1GateBPNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
    expect(selected).toMatchObject({
      id: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      score: 2.38,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      wrongNumberRisk: 0.9
    });
    expect(
      candidates
        .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
        .map((candidate) => candidate.id)
    ).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("keeps docs and the current-gate runner aligned with Gate BP and selected Gate BQ", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.raw_bare_floor_airborne_building_prediction_owner_gap");
      expect(contents, path).toContain("generic screening");
      expect(contents, path).toContain("R'w");
      expect(contents, path).toContain("DnT,w");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts");
  });
});
