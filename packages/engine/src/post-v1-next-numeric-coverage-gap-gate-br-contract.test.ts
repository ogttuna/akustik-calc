import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS
} from "./post-v1-floor-raw-bare-airborne-building-prediction-gate-bq";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS,
  rankPostV1GateBRNumericCoverageCandidates,
  summarizePostV1GateBRNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-br";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

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
  "docs/calculator/POST_V1_GATE_BQ_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BR_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BR", () => {
  it("lands a no-runtime rerank after Gate BQ and selects open-box finished-package field companions", () => {
    const summary = summarizePostV1GateBRNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBQ: {
        landedGate: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS
      },
      selectedCandidateId: "floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS
    });
    expect(summary.candidateCount).toBe(8);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("prioritizes calculable field output coverage over residual, ASTM alias, and generic surface work", () => {
    const candidates = rankPostV1GateBRNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(selected?.id).toBe("floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap");
    expect(selected?.targetMetrics).toEqual([...FIELD_TARGET_OUTPUTS]);
    expect(selected?.sourceRowsRequiredForSelection).toBe(false);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.open_box_timber_finished_package.airborne_building_companion_gap")?.score ?? 0
    );
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

  it("proves the selected Gate BS runtime gap is EPS/screed field companion placement", () => {
    const dryPackageMixed = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "CI,50-2500", ...FIELD_TARGET_OUTPUTS]
    });
    const epsScreedMixed = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "CI,50-2500", ...FIELD_TARGET_OUTPUTS]
    });
    const dryPackageFieldOnly = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });
    const epsScreedFieldOnly = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });

    expect(dryPackageMixed.impact).toMatchObject({
      CI50_2500: 3.3,
      LnW: 50.8,
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(dryPackageMixed.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(dryPackageMixed.supportedTargetOutputs).toEqual(["Ln,w", "CI,50-2500", ...FIELD_TARGET_OUTPUTS]);
    expect(dryPackageMixed.unsupportedTargetOutputs).toEqual([]);

    expect(epsScreedMixed.impact).toMatchObject({
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(epsScreedMixed.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(epsScreedMixed.supportedTargetOutputs).toEqual(["Ln,w", "CI,50-2500", ...FIELD_TARGET_OUTPUTS]);
    expect(epsScreedMixed.unsupportedTargetOutputs).toEqual([]);

    expect(dryPackageFieldOnly.supportedTargetOutputs).toEqual([...FIELD_TARGET_OUTPUTS]);
    expect(dryPackageFieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(dryPackageFieldOnly.impact).toMatchObject({
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(dryPackageFieldOnly.impact?.LPrimeNW).toBe(dryPackageMixed.impact?.LPrimeNW);
    expect(dryPackageFieldOnly.impact?.LPrimeNTw).toBe(dryPackageMixed.impact?.LPrimeNTw);
    expect(dryPackageFieldOnly.impact?.LPrimeNT50).toBe(dryPackageMixed.impact?.LPrimeNT50);

    expect(epsScreedFieldOnly.supportedTargetOutputs).toEqual([...FIELD_TARGET_OUTPUTS]);
    expect(epsScreedFieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(epsScreedFieldOnly.impact).toMatchObject({
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BR selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap");
      expect(contents, path).toContain("L'n,w");
      expect(contents, path).toContain("L'nT,w");
      expect(contents, path).toContain("ASTM `IIC` / `AIIC`");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts");
  });
});
