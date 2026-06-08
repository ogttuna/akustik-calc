import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const LANDED_GATE = "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_bl_plan";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const FIELD_OUTPUTS = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "IIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_ONLY_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50", "IIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_ONLY_NO_ALIAS_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

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

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const GATE_BK_CONTRACT = {
  astmAliasesRemainUnsupported: true,
  beforeRuntimeGap: "raw-bare open-web lab Ln,w existed but L'n,w / L'nT,w / L'nT,50 stayed unsupported",
  buildingPredictionPromotion: false,
  landedGate: LANDED_GATE,
  runtimeMovementThisGate: true,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectionStatus: SELECTION_STATUS
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-web raw-bare field companion Gate BK", () => {
  it("opens field impact outputs from the raw-bare open-web lab anchor with explicit field context", () => {
    expect(GATE_BK_CONTRACT).toEqual({
      astmAliasesRemainUnsupported: true,
      beforeRuntimeGap: "raw-bare open-web lab Ln,w existed but L'n,w / L'nT,w / L'nT,50 stayed unsupported",
      buildingPredictionPromotion: false,
      landedGate: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_bl_plan",
      selectionStatus: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl"
    });

    const result = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(result.impact).toMatchObject({
      LnW: 96,
      LPrimeNW: 98,
      LPrimeNTw: 95.6,
      LPrimeNT50: 100.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LnW: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")).toBe(true);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("computes the lab anchor internally for field-only requests instead of requiring Ln,w to be requested", () => {
    const result = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_ONLY_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(result.impact).toMatchObject({
      LnW: 96,
      LPrimeNW: 98,
      LPrimeNTw: 95.6,
      LPrimeNT50: 100.8
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("keeps missing field inputs, building prediction, and ASTM aliases outside Gate BK while Gate BL opens open-box later", () => {
    const missingFieldContext = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ONLY_NO_ALIAS_OUTPUTS
    });
    const openBox = calculateAssembly(RAW_OPEN_BOX_220, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const building = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });
    expect(missingFieldContext.impact).toMatchObject({
      LnW: 96,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(missingFieldContext.impact?.LPrimeNW).toBeUndefined();

    expect(openBox.impact).toMatchObject({
      LPrimeNT50: 94.1,
      LPrimeNTw: 90.7,
      LPrimeNW: 93.1,
      LnW: 91.1,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(openBox.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(openBox.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(openBox.unsupportedTargetOutputs).toEqual(["IIC"]);

    expect(building.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(building.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedRwPrimeDb: 30
    });
    expect(building.impact).toMatchObject({
      LnW: 96,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(building.impact?.LPrimeNW).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate BK runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("L'nT,w 95.6");
      expect(contents, path).toContain("open-box raw-bare field transfer");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-web-raw-bare-field-companion-gate-bk-contract.test.ts"
    );
  });
});
