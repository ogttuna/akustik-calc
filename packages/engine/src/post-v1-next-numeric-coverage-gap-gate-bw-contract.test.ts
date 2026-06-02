import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS,
  rankPostV1GateBWNumericCoverageCandidates,
  summarizePostV1GateBWNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bw";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const LAB_IMPACT_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const LAB_FIELD_IMPACT_OUTPUTS = ["Rw", "C", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

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
  "docs/calculator/POST_V1_GATE_BW_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BW", () => {
  it("lands a no-runtime rerank after Gate BV and selects lab metric projection Gate BX", () => {
    const summary = summarizePostV1GateBWNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBV: {
        landedGate: "post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan",
        selectionStatus:
          "post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw"
      },
      selectedCandidateId: "floor.open_box_timber_finished_package.lab_metric_projection_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS
    });
    expect(summary.candidateCount).toBe(7);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("prioritizes visible wrong-number package Rw/C correction over residual, ASTM alias, and non-goals", () => {
    const candidates = rankPostV1GateBWNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(selected?.id).toBe("floor.open_box_timber_finished_package.lab_metric_projection_gap");
    expect(selected?.targetMetrics).toEqual(["Rw", "C"]);
    expect(selected?.sourceRowsRequiredForSelection).toBe(false);
    expect(selected?.wrongNumberRisk).toBeGreaterThan(
      byId.get("floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap")?.wrongNumberRisk ?? 0
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

  it("keeps the selected Gate BX lane executable for lab-impact and lab-field-impact mixed requests", () => {
    const dryLabImpact = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: LAB_IMPACT_OUTPUTS
    });
    const epsLabFieldImpact = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: LAB_FIELD_IMPACT_OUTPUTS
    });

    expect(dryLabImpact.supportedTargetOutputs).toEqual([...LAB_IMPACT_OUTPUTS]);
    expect(dryLabImpact.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedRwDb: 66
    });
    expect(dryLabImpact.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52
    });

    expect(epsLabFieldImpact.supportedTargetOutputs).toEqual([...LAB_FIELD_IMPACT_OUTPUTS]);
    expect(epsLabFieldImpact.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedRwDb: 72
    });
    expect(epsLabFieldImpact.impact).toMatchObject({
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BW selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS);
      expect(contents, path).toContain("floor.open_box_timber_finished_package.lab_metric_projection_gap");
      expect(contents, path).toContain("Rw 66 / C -3.9");
      expect(contents, path).toContain("Rw 72 / C -1.3");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts");
  });
});
