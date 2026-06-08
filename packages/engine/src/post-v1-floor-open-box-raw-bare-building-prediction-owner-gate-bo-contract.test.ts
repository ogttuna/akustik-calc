import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import {
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS,
  POST_V1_GATE_BO_BUILDING_PREDICTION_VALUE_PINS,
  POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT,
  POST_V1_GATE_BO_RAW_OPEN_BOX_220,
  POST_V1_GATE_BO_RAW_OPEN_BOX_370,
  summarizePostV1FloorOpenBoxRawBareBuildingPredictionOwnerGateBO
} from "./post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS
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
  "docs/calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BO_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_PLAN_2026-06-01.md"
] as const;

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const;

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

const SIMPLE_K_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      edgeIsolationClass: "rigid",
      id: "gate_bo_severe_double_count_path",
      junctionClass: "rigid",
      label: "Synthetic severe open-box edge path",
      levelOffsetDb: 8,
      pathCount: 1,
      pathType: "edge",
      shortCircuitRisk: "medium",
      supportingElementFamily: "open_box_timber"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box raw-bare building prediction owner Gate BO", () => {
  it("lands runtime coverage after Gate BN selected the open-box building owner gap", () => {
    const summary = summarizePostV1FloorOpenBoxRawBareBuildingPredictionOwnerGateBO();

    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE,
      previousGateBN: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS
      },
      runtimeValueMovement: "open_box_raw_bare_building_direct_flanking_impact_promotion",
      selectedCandidateId: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      selectedNextAction:
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS
    });
    expect(summary.valuePins).toEqual(POST_V1_GATE_BO_BUILDING_PREDICTION_VALUE_PINS);
    expect(summary.valuePins.map((pin) => pin.carrier)).toEqual([
      "open_box_raw_bare_220",
      "open_box_raw_bare_370"
    ]);
  });

  it("calculates 220 mm open-box raw-bare building impact outputs from explicit direct+flanking owners", () => {
    const result = calculateAssembly(POST_V1_GATE_BO_RAW_OPEN_BOX_220, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: MIXED_BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "IIC", "AIIC"]);
    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 39,
      estimatedRwPrimeDb: 36
    });
    expect(result.impact).toMatchObject({
      CI50_2500: 3.4,
      LPrimeNT50: 93.9,
      LPrimeNTw: 90.5,
      LPrimeNW: 92.9,
      LnW: 91.1,
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum",
      fieldEstimateDefaultSupportingElementFamily: "open_box_timber",
      fieldEstimateDirectOffsetDb: 1,
      fieldEstimateFlankingFamilyModels: ["open_box_timber"],
      fieldEstimateFlankingPathCount: 1,
      fieldEstimateMaxPathModifierDb: 0,
      fieldEstimateProfile: "direct_flanking_energy_sum"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_direct_flanking_energy_sum",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500"
    });
    expect(result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")).toBe(true);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"],
      valuePins: [
        { metric: "R'w", value: 36 },
        { metric: "DnT,w", value: 39 },
        { metric: "L'n,w", value: 92.9 },
        { metric: "L'nT,w", value: 90.5 },
        { metric: "L'nT,50", value: 93.9 }
      ]
    });
  });

  it("calculates the 370 mm carrier and derives the lab anchor internally for building-only requests", () => {
    const result = calculateAssembly(POST_V1_GATE_BO_RAW_OPEN_BOX_370, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      CI50_2500: 3.1,
      LPrimeNT50: 90.7,
      LPrimeNTw: 87.6,
      LPrimeNW: 90,
      LnW: 88.2,
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum"
    });
    expect(result.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
  });

  it("keeps simple K, severe source-absent uplift, lab Ln,w, and ASTM aliases outside Gate BO", () => {
    const simpleK = calculateAssembly(POST_V1_GATE_BO_RAW_OPEN_BOX_220, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: SIMPLE_K_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });
    const severeUplift = calculateAssembly(POST_V1_GATE_BO_RAW_OPEN_BOX_220, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: SEVERE_DOUBLE_COUNT_FLANKING_CONTEXT,
      targetOutputs: BUILDING_IMPACT_OUTPUTS
    });

    expect(simpleK.supportedTargetOutputs).toEqual([]);
    expect(simpleK.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(simpleK.impact).toMatchObject({
      LnW: 91.1,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(simpleK.impact?.LPrimeNW).toBeUndefined();

    expect(severeUplift.supportedTargetOutputs).toEqual([]);
    expect(severeUplift.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(severeUplift.impact).toMatchObject({
      LnW: 91.1,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(severeUplift.impact?.LPrimeNW).toBeUndefined();
  });

  it("preserves Gate BM open-web building pins while opening the open-box building lane", () => {
    const result = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: POST_V1_GATE_BO_DIRECT_FLANKING_IMPACT_CONTEXT,
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
      basis: "mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum"
    });
    expect(result.impact?.metricBasis?.LnW).toBe(OPEN_WEB_RAW_BARE_FORMULA_BASIS);
  });

  it("keeps docs and current-gate runner aligned with Gate BO runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain("floor.open_box_timber_raw_bare.building_prediction_owner_gap");
      expect(contents, path).toContain("L'nT,w 90.5");
      expect(contents, path).toContain("direct+flanking");
      expect(contents, path).toContain("R'w");
      expect(contents, path).toContain("ASTM `IIC` / `AIIC` remain");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts"
    );
  });
});
