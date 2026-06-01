import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS,
  rankPostV1GateBMNumericCoverageCandidates,
  summarizePostV1GateBMNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bm";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const BUILDING_IMPACT_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const MIXED_BUILDING_OUTPUTS = [
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_PREDICTION_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  sourceRoomVolumeM3: 55,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  flankingJunctionClass: "rigid_cross_junction",
  conservativeFlankingAssumption: "multi_path_conservative",
  junctionCouplingLengthM: 4,
  buildingPredictionOutputBasis: "apparent_and_standardized"
} as const satisfies AirborneContext;

const DIRECT_FLANKING_IMPACT_CONTEXT = {
  directPathOffsetDb: 1,
  receivingRoomVolumeM3: 55,
  flankingPaths: [
    {
      id: "gate_bm_rigid_edge_path",
      label: "Characterized open-web edge path",
      levelOffsetDb: -6,
      pathCount: 1
    }
  ]
} as const satisfies ImpactFieldContext;

const SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT = {
  directPathOffsetDb: 1,
  receivingRoomVolumeM3: 55,
  flankingPaths: [
    {
      edgeIsolationClass: "rigid",
      id: "gate_bm_severe_double_count_path",
      junctionClass: "rigid",
      label: "Synthetic severe open-web edge path",
      levelOffsetDb: 8,
      pathCount: 1,
      pathType: "edge",
      shortCircuitRisk: "medium",
      supportingElementFamily: "steel_joists"
    }
  ]
} as const satisfies ImpactFieldContext;

const SIMPLE_K_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BM", () => {
  it("lands runtime coverage on the raw-bare open-web building-context impact gap", () => {
    const summary = summarizePostV1GateBMNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
      noRuntimeValueMovement: false,
      previousGateBLRuntime: {
        landedGate: "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan",
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
        selectionStatus:
          "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm"
      },
      selectedCandidateId: "floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS,
      targetMetricsForSelectedSlice: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(summary.selectedAcceptancePins).toEqual([
      {
        carrier: "open_web_raw_bare_300",
        ci50_2500Db: 5.2,
        directPathOffsetDb: 1,
        flankingPathLevelOffsetDb: -6,
        lPrimeNT50Db: 100.6,
        lPrimeNTwDb: 95.4,
        lPrimeNWDb: 97.8,
        lnWDb: 96,
        receivingRoomVolumeM3: 55
      }
    ]);
  });

  it("ranks executable calculator coverage above source crawling and generic work", () => {
    const candidates = rankPostV1GateBMNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap",
      "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
    expect(selected).toMatchObject({
      id: "floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap",
      score: 2.08,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
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

  it("calculates raw-bare open-web building-context impact outputs only with explicit direct+flanking owner fields", () => {
    const result = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      CI50_2500: 5.2,
      LPrimeNT50: 100.6,
      LPrimeNTw: 95.4,
      LPrimeNW: 97.8,
      LnW: 96,
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      fieldEstimateDirectOffsetDb: 1,
      fieldEstimateFlankingPathCount: 1,
      fieldEstimateMaxPathModifierDb: 0,
      fieldEstimateProfile: "direct_flanking_energy_sum"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LnW: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_direct_flanking_energy_sum",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      valuePins: [
        { metric: "L'n,w", value: 97.8 },
        { metric: "L'nT,w", value: 95.4 },
        { metric: "L'nT,50", value: 100.6 }
      ]
    });
  });

  it("keeps airborne building outputs, lab Ln,w, severe uplift, and simple K transfer out while later Gate BO opens open-box", () => {
    const mixed = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: MIXED_BUILDING_OUTPUTS
    });
    const simpleK = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: SIMPLE_K_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });
    const severeUplift = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });
    const openBox = calculateAssembly(RAW_OPEN_BOX_220, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });

    expect(mixed.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(mixed.unsupportedTargetOutputs).toEqual(["Ln,w"]);
    expect(mixed.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedRwPrimeDb: 30
    });

    expect(simpleK.supportedTargetOutputs).toEqual([]);
    expect(simpleK.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(simpleK.impact).toMatchObject({
      LnW: 96,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(simpleK.impact?.LPrimeNW).toBeUndefined();

    expect(severeUplift.supportedTargetOutputs).toEqual([]);
    expect(severeUplift.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(severeUplift.impact).toMatchObject({
      LnW: 96,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(severeUplift.impact?.LPrimeNW).toBeUndefined();

    expect(openBox.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(openBox.unsupportedTargetOutputs).toEqual([]);
    expect(openBox.impact).toMatchObject({
      LPrimeNT50: 93.9,
      LPrimeNTw: 90.5,
      LPrimeNW: 92.9,
      LnW: 91.1,
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum"
    });
    expect(openBox.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
  });

  it("keeps docs and current-gate runner aligned with Gate BM runtime coverage", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap");
      expect(contents, path).toContain("L'nT,w 95.4");
      expect(contents, path).toContain("direct+flanking");
      expect(contents, path).toContain("R'w");
      expect(contents, path).toContain("ASTM `IIC` / `AIIC` remain");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bm-contract.test.ts");
  });
});
