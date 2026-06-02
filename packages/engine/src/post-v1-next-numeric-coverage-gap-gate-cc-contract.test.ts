import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTION_STATUS,
  rankPostV1GateCCNumericCoverageCandidates,
  summarizePostV1GateCCNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-cc";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const SINGLE_METRIC_PROBE_OUTPUTS = [
  "Rw",
  "C",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_CC_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CC", () => {
  it("lands a no-runtime rerank after Gate CB and selects target-output independence Gate CD", () => {
    const summary = summarizePostV1GateCCNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateCB: {
        landedGate: "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan",
        selectionStatus:
          "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc"
      },
      selectedCandidateId: "floor.open_box_timber_finished_package.target_output_independence_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTION_STATUS
    });
    expect(summary.candidateCount).toBe(7);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("prioritizes already-computed target-output support over residual, ASTM alias, and non-goals", () => {
    const candidates = rankPostV1GateCCNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(selected?.id).toBe("floor.open_box_timber_finished_package.target_output_independence_gap");
    expect(selected?.targetMetrics).toEqual([...SINGLE_METRIC_PROBE_OUTPUTS]);
    expect(selected?.sourceRowsRequiredForSelection).toBe(false);
    expect(selected?.coverageImpact).toBeGreaterThan(
      byId.get("floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap")?.coverageImpact ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap")?.score ?? 0
    );
    expect(byId.get("floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap")).toMatchObject({
      selected: false,
      sourceRowsRequiredForSelection: true,
      wrongNumberRisk: 0.96
    });
    for (const blockedId of [
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ] as const) {
      expect(byId.get(blockedId)).toMatchObject({ selected: false, sliceKind: "blocked_non_goal" });
    }
  });

  it("keeps the selected Gate CD lane executable for complete single-output open-box requests", () => {
    for (const output of SINGLE_METRIC_PROBE_OUTPUTS) {
      const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
        airborneContext: BUILDING_CONTEXT,
        calculator: "dynamic",
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: [output]
      });

      expect(result.supportedTargetOutputs, output).toEqual([output]);
      expect(result.unsupportedTargetOutputs, output).toEqual([]);
    }
  });

  it("keeps docs and current-gate runner aligned with Gate CC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTION_STATUS);
      expect(contents, path).toContain("floor.open_box_timber_finished_package.target_output_independence_gap");
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CC_SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts");
  });
});
