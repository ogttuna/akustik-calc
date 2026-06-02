import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS,
  rankPostV1GateBTNumericCoverageCandidates,
  summarizePostV1GateBTNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bt";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_AIRBORNE_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const MIXED_PACKAGE_BUILDING_OUTPUTS = ["Rw", "C", "Ctr", ...BUILDING_AIRBORNE_OUTPUTS] as const satisfies readonly RequestedOutputId[];

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
  "docs/calculator/POST_V1_GATE_BS_OPEN_BOX_EPS_SCREED_FIELD_COMPANION_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BT_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BT", () => {
  it("lands a no-runtime rerank after Gate BS and selects open-box finished-package airborne building companions", () => {
    const summary = summarizePostV1GateBTNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBS: {
        landedGate: "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan",
        selectionStatus:
          "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt"
      },
      selectedCandidateId: "floor.open_box_timber_finished_package.airborne_building_companion_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS
    });
    expect(summary.candidateCount).toBe(7);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("prioritizes wrong-anchor building airborne correction over residual, ASTM alias, and generic surface work", () => {
    const candidates = rankPostV1GateBTNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(selected?.id).toBe("floor.open_box_timber_finished_package.airborne_building_companion_gap");
    expect(selected?.targetMetrics).toEqual([...BUILDING_AIRBORNE_OUTPUTS]);
    expect(selected?.sourceRowsRequiredForSelection).toBe(false);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap")?.score ?? 0
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

  it("keeps the selected Gate BU finished-package building airborne lane executable", () => {
    const dryBuildingOnly = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_AIRBORNE_OUTPUTS
    });
    const epsBuildingOnly = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_AIRBORNE_OUTPUTS
    });
    const dryMixed = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_PACKAGE_BUILDING_OUTPUTS
    });
    const epsMixed = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_PACKAGE_BUILDING_OUTPUTS
    });

    expect(dryBuildingOnly.floorSystemRatings).toMatchObject({
      Rw: 66,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(dryBuildingOnly.supportedTargetOutputs).toEqual([...BUILDING_AIRBORNE_OUTPUTS]);
    expect(dryBuildingOnly.metrics).toMatchObject({
      estimatedDnTwDb: 67,
      estimatedRwPrimeDb: 64
    });

    expect(epsBuildingOnly.floorSystemRatings).toMatchObject({
      Rw: 72,
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(epsBuildingOnly.supportedTargetOutputs).toEqual([...BUILDING_AIRBORNE_OUTPUTS]);
    expect(epsBuildingOnly.metrics).toMatchObject({
      estimatedDnTwDb: 73,
      estimatedRwPrimeDb: 70
    });

    expect(dryMixed.floorSystemRatings).toMatchObject({
      Rw: 66,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(dryMixed.supportedTargetOutputs).toEqual(["Rw", "C", ...BUILDING_AIRBORNE_OUTPUTS]);
    expect(dryMixed.unsupportedTargetOutputs).toEqual(["Ctr"]);
    expect(dryMixed.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedDnTwDb: 67,
      estimatedRwPrimeDb: 64
    });

    expect(epsMixed.floorSystemRatings).toMatchObject({
      C: -1.3,
      Rw: 72,
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(epsMixed.supportedTargetOutputs).toEqual(["Rw", "C", ...BUILDING_AIRBORNE_OUTPUTS]);
    expect(epsMixed.unsupportedTargetOutputs).toEqual(["Ctr"]);
    expect(epsMixed.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedDnTwDb: 73,
      estimatedRwPrimeDb: 70
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BT selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS);
      expect(contents, path).toContain("floor.open_box_timber_finished_package.airborne_building_companion_gap");
      expect(contents, path).toContain("R'w");
      expect(contents, path).toContain("DnT,w");
      expect(contents, path).toContain("screening_mass_law_curve_seed_v3");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bt-contract.test.ts");
  });
});
