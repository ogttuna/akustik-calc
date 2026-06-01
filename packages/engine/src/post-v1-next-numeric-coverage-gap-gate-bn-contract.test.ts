import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_GATE_BN_MAX_SOURCE_ABSENT_SINGLE_NUMBER_UPLIFT_DB,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS,
  buildPostV1GateBNPlausibilityMatrix,
  rankPostV1GateBNNumericCoverageCandidates,
  summarizePostV1GateBNNumericPlausibilityAndCalibration
} from "./post-v1-next-numeric-coverage-gap-gate-bn";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md"
] as const;

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_370 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const FIELD_OUTPUTS = [
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

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
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const FIELD_AIRBORNE_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const BUILDING_PREDICTION_CONTEXT = {
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

const FIELD_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const DIRECT_FLANKING_IMPACT_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "gate_bn_rigid_edge_path",
      label: "Characterized open-web edge path",
      levelOffsetDb: -6,
      pathCount: 1
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      edgeIsolationClass: "rigid",
      id: "gate_bn_severe_double_count_path",
      junctionClass: "rigid",
      label: "Synthetic severe open-web edge path",
      levelOffsetDb: 8,
      pathCount: 1,
      pathType: "edge",
      shortCircuitRisk: "medium",
      supportingElementFamily: "steel_joists"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function rowById(id: ReturnType<typeof buildPostV1GateBNPlausibilityMatrix>[number]["id"]) {
  const row = buildPostV1GateBNPlausibilityMatrix().find((item) => item.id === id);

  if (!row) {
    throw new Error(`Missing Gate BN plausibility row ${id}`);
  }

  return row;
}

describe("post-V1 next numeric coverage gap Gate BN", () => {
  it("lands a no-runtime numeric plausibility gate and selects the next runtime coverage action", () => {
    const summary = summarizePostV1GateBNNumericPlausibilityAndCalibration();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
      matrixPassed: true,
      noRuntimeValueMovement: true,
      previousGateBM: {
        landedGate: "post_v1_next_numeric_coverage_gap_gate_bm_plan",
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
        selectionStatus:
          "post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn"
      },
      selectedCandidateId:
        "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextCandidateId: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS,
      unsafePublishedOutlierIds: []
    });
    expect(summary.blockedOutlierRowIds).toEqual(["open_web_raw_bare_300_severe_direct_flanking_blocked"]);
    expect(summary.plausibilityMatrix.map((row) => row.id)).toEqual([
      "open_web_raw_bare_300_field_context",
      "open_web_raw_bare_300_building_direct_flanking",
      "open_web_raw_bare_300_severe_direct_flanking_blocked",
      "open_box_raw_bare_220_field_context",
      "open_box_raw_bare_370_field_context",
      "lower_treatment_acoustic_hanger_field",
      "mixed_support_single_primary_carrier_field",
      "c11c_weighted_tuple_field_guarded"
    ]);
  });

  it("ranks the numeric plausibility sweep above immediate runtime expansion and non-calculator work", () => {
    const candidates = rankPostV1GateBNNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes",
      "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
    expect(selected).toMatchObject({
      id: "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes",
      score: 2.46,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_guard",
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

  it("keeps current raw-bare source-absent field and building values synchronized with the plausibility matrix", () => {
    const openWebField = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: FIELD_AIRBORNE_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_IMPACT_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const openWebBuilding = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: MIXED_BUILDING_OUTPUTS
    });
    const openBox220 = calculateAssembly(RAW_OPEN_BOX_220, {
      airborneContext: FIELD_AIRBORNE_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_IMPACT_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const openBox370 = calculateAssembly(RAW_OPEN_BOX_370, {
      airborneContext: FIELD_AIRBORNE_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FIELD_IMPACT_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(openWebField.impact).toMatchObject({
      LPrimeNT50: rowById("open_web_raw_bare_300_field_context").lPrimeNT50Db,
      LPrimeNTw: rowById("open_web_raw_bare_300_field_context").lPrimeNTwDb,
      LPrimeNW: rowById("open_web_raw_bare_300_field_context").lPrimeNWDb,
      LnW: rowById("open_web_raw_bare_300_field_context").lnWDb
    });
    expect(openWebField.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(openWebBuilding.impact).toMatchObject({
      LPrimeNT50: rowById("open_web_raw_bare_300_building_direct_flanking").lPrimeNT50Db,
      LPrimeNTw: rowById("open_web_raw_bare_300_building_direct_flanking").lPrimeNTwDb,
      LPrimeNW: rowById("open_web_raw_bare_300_building_direct_flanking").lPrimeNWDb,
      LnW: rowById("open_web_raw_bare_300_building_direct_flanking").lnWDb
    });
    expect(openWebBuilding.supportedTargetOutputs).toEqual([
      "R'w",
      "DnT,w",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(openWebBuilding.unsupportedTargetOutputs).toEqual(["Ln,w", "IIC", "AIIC"]);
    expect(openWebBuilding.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedRwPrimeDb: 30
    });

    expect(openBox220.impact).toMatchObject({
      LPrimeNT50: rowById("open_box_raw_bare_220_field_context").lPrimeNT50Db,
      LPrimeNTw: rowById("open_box_raw_bare_220_field_context").lPrimeNTwDb,
      LPrimeNW: rowById("open_box_raw_bare_220_field_context").lPrimeNWDb,
      LnW: rowById("open_box_raw_bare_220_field_context").lnWDb
    });
    expect(openBox370.impact).toMatchObject({
      LPrimeNT50: rowById("open_box_raw_bare_370_field_context").lPrimeNT50Db,
      LPrimeNTw: rowById("open_box_raw_bare_370_field_context").lPrimeNTwDb,
      LPrimeNW: rowById("open_box_raw_bare_370_field_context").lPrimeNWDb,
      LnW: rowById("open_box_raw_bare_370_field_context").lnWDb
    });
  });

  it("keeps severe direct/flanking uplift blocked while published source-absent rows stay within the uplift guard", () => {
    const severe = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });
    const matrix = buildPostV1GateBNPlausibilityMatrix();

    expect(severe.supportedTargetOutputs).toEqual([]);
    expect(severe.unsupportedTargetOutputs).toEqual([...BUILDING_IMPACT_OUTPUTS]);
    expect(severe.impact).toMatchObject({
      LnW: 96
    });
    expect(severe.impact?.LPrimeNW).toBeUndefined();

    expect(rowById("open_web_raw_bare_300_severe_direct_flanking_blocked")).toMatchObject({
      lPrimeNWDb: 112.1,
      status: "blocked_as_outlier",
      upliftOverLnWDb: 16.1
    });
    expect(
      matrix
        .filter((row) => row.status === "published_admissible" && row.sourceAbsentSingleNumber)
        .every((row) =>
          typeof row.upliftOverLnWDb === "number" &&
          row.upliftOverLnWDb <= POST_V1_GATE_BN_MAX_SOURCE_ABSENT_SINGLE_NUMBER_UPLIFT_DB
        )
    ).toBe(true);
  });

  it("keeps docs and current-gate runner aligned with Gate BN and the selected Gate BO next step", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(
        "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes"
      );
      expect(contents, path).toContain("floor.open_box_timber_raw_bare.building_prediction_owner_gap");
      expect(contents, path).toContain("source-absent");
      expect(contents, path).toContain("12 dB");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts");
  });
});
