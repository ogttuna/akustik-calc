import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS,
  rankPostV1GateCANumericCoverageCandidates,
  summarizePostV1GateCANumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ca";

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

const FULL_MIXED_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_AIRBORNE_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
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
  "docs/calculator/POST_V1_GATE_BZ_OPEN_BOX_FINISHED_PACKAGE_FULL_MIXED_BUILDING_IMPACT_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_CA_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CA", () => {
  it("lands a no-runtime rerank after Gate BZ and selects EPS/screed full mixed field/building Gate CB", () => {
    const summary = summarizePostV1GateCANumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBZ: {
        landedGate: "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan",
        selectionStatus:
          "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca"
      },
      selectedCandidateId: "floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS
    });
    expect(summary.candidateCount).toBe(7);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("prioritizes already-owned EPS/screed field-impact coverage over residual, ASTM alias, and non-goals", () => {
    const candidates = rankPostV1GateCANumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(selected?.id).toBe("floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap");
    expect(selected?.targetMetrics).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
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

  it("keeps the selected Gate CB lane executable for complete EPS/screed full mixed building and field impact requests", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FULL_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      ...BUILDING_AIRBORNE_OUTPUTS,
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr", "IIC", "AIIC"]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedDnTwDb: 73,
      estimatedRwDb: 72,
      estimatedRwPrimeDb: 70
    });
    expect(result.impact).toMatchObject({
      CI: 0,
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      LnWPlusCI: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate CA selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS);
      expect(contents, path).toContain("floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap");
      expect(contents, path).toContain("L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6");
      expect(contents, path).toContain("Ctr");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts");
  });
});
