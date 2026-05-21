import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LANDED_GATE = "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan";
const SELECTION_STATUS =
  "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh";
const SELECTED_NEXT_ACTION = "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL = "post open-web field/building input-surface matrix refresh";

const PREVIOUS_INPUT_SURFACE_GATE = "broad_accuracy_floor_open_web_field_building_input_surface_plan";
const PREVIOUS_INPUT_SURFACE_STATUS =
  "broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation";
const PREVIOUS_INPUT_SURFACE_FILE = "apps/web/features/workbench/open-web-field-building-input-surface.test.ts";

const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

const EXACT_FL23_OPEN_WEB = [
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const REVALIDATION_CONTRACT = {
  apiShapeChange: false,
  broadSourceCrawl: false,
  buildingPredictionRuntimePromotion: false,
  evidencePromotion: false,
  landedGate: LANDED_GATE,
  noRuntimeValueMovement: true,
  previousGate: PREVIOUS_INPUT_SURFACE_GATE,
  previousInputSurfaceFile: PREVIOUS_INPUT_SURFACE_FILE,
  previousSelectionStatus: PREVIOUS_INPUT_SURFACE_STATUS,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectedNextFile: SELECTED_NEXT_FILE,
  selectedNextLabel: SELECTED_NEXT_LABEL,
  selectionStatus: SELECTION_STATUS,
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts",
  "apps/web/features/workbench/open-web-field-building-input-surface.ts",
  PREVIOUS_INPUT_SURFACE_FILE,
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const FIELD_REVALIDATION_CASES = [
  {
    basis: "official_floor_system_exact_match",
    expected: {
      DnTw: 80,
      LPrimeNT50: 70,
      LPrimeNTw: 70.6,
      LPrimeNW: 73,
      LnW: 71,
      Rw: 51,
      RwPrime: 77
    },
    id: "exact_fl23_open_web",
    layers: EXACT_FL23_OPEN_WEB
  },
  {
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    expected: {
      DnTw: 78,
      LPrimeNT50: 76.5,
      LPrimeNTw: 76.6,
      LPrimeNW: 79,
      LnW: 77,
      Rw: 52,
      RwPrime: 75
    },
    id: "direct_fixed_open_web",
    layers: DIRECT_FIXED_PACKAGE
  },
  {
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    expected: {
      DnTw: 48,
      LPrimeNT50: 60,
      LPrimeNTw: 61.1,
      LPrimeNW: 63.5,
      LnW: 61.5,
      Rw: 61.5,
      RwPrime: 45
    },
    id: "supported_band_open_web",
    layers: SUPPORTED_BAND_PACKAGE
  }
] as const;

const NEXT_MATRIX_REFRESH_LANES = [
  {
    id: "post_open_web_field_building_input_surface_matrix_refresh",
    nextAction: SELECTED_NEXT_ACTION,
    reason:
      "selected because the input surface is landed and the next decision must rank observed unsupported/needs-input calculator gaps before choosing another runtime solver lane",
    selectedNext: true
  },
  {
    id: "raw_bare_impact_field_transfer_runtime",
    nextAction: "broad_accuracy_floor_open_web_raw_bare_field_impact_transfer_owner_plan",
    reason:
      "not selected directly because raw-bare impact field transfer still needs the refreshed matrix to prove it outranks source-absent family-solver coverage",
    selectedNext: false
  },
  {
    id: "building_prediction_runtime",
    nextAction: "broad_accuracy_floor_open_web_building_prediction_runtime_owner_plan",
    reason: "not selected because flanking, junction, room-normalization, and building uncertainty owners remain separate gaps",
    selectedNext: false
  },
  {
    id: "astm_iic_aiic_rating_owner",
    nextAction: "broad_accuracy_floor_open_web_astm_iic_aiic_rating_curve_owner_plan",
    reason: "not selected because ASTM/IIC/AIIC are separate rating bases and cannot be inferred from ISO field adapters",
    selectedNext: false
  },
  {
    id: "broad_source_crawl",
    nextAction: "blocked_until_specific_owner_gap_requires_source_evidence",
    reason: "not selected because the calculator needs model-family coverage, not another source-library expansion pass",
    selectedNext: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateFieldCase(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });
}

describe("broad accuracy floor open-web field/building post-input-surface revalidation contract", () => {
  it("lands no-runtime revalidation and selects the matrix refresh next", () => {
    expect(REVALIDATION_CONTRACT).toEqual({
      apiShapeChange: false,
      broadSourceCrawl: false,
      buildingPredictionRuntimePromotion: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan",
      noRuntimeValueMovement: true,
      previousGate: "broad_accuracy_floor_open_web_field_building_input_surface_plan",
      previousInputSurfaceFile: "apps/web/features/workbench/open-web-field-building-input-surface.test.ts",
      previousSelectionStatus:
        "broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation",
      selectedNextAction: "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts",
      selectedNextLabel: "post open-web field/building input-surface matrix refresh",
      selectionStatus:
        "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh",
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    expect(NEXT_MATRIX_REFRESH_LANES.filter((lane) => lane.selectedNext).map((lane) => lane.id)).toEqual([
      "post_open_web_field_building_input_surface_matrix_refresh"
    ]);
  });

  it("keeps exact, direct-fixed, and supported-band open-web field values pinned after input-surface wiring", () => {
    for (const entry of FIELD_REVALIDATION_CASES) {
      const result = calculateFieldCase(entry.layers);

      expect(result.supportedTargetOutputs, entry.id).toEqual([
        "Rw",
        "R'w",
        "DnT,w",
        "Ln,w",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]);
      expect(result.unsupportedTargetOutputs, entry.id).toEqual(["IIC"]);
      expect(result.floorSystemRatings, entry.id).toMatchObject({
        Rw: entry.expected.Rw,
        basis: entry.basis
      });
      expect(result.metrics, entry.id).toMatchObject({
        estimatedDnTwDb: entry.expected.DnTw,
        estimatedRwPrimeDb: entry.expected.RwPrime
      });
      expect(result.impact, entry.id).toMatchObject({
        LPrimeNT50: entry.expected.LPrimeNT50,
        LPrimeNTw: entry.expected.LPrimeNTw,
        LPrimeNW: entry.expected.LPrimeNW,
        LnW: entry.expected.LnW
      });
      expect(result.impact?.errorBudgets?.some((budget) => budget.origin === "source_absent_field_building_adapter_error_budget")).toBe(true);
      expect(result.dynamicImpactTrace, entry.id).toMatchObject({
        fieldContinuation: "local_guide_simple",
        fieldOutputsActive: true,
        guideActive: true,
        hasFieldContext: true
      });
    }
  });

  it("keeps raw-bare impact field transfer, building prediction, and ASTM/IIC aliases blocked", () => {
    const rawBareField = calculateFieldCase(RAW_OPEN_WEB_300);
    const building = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(rawBareField.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w"]);
    expect(rawBareField.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC"]);
    expect(rawBareField.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact).toMatchObject({
      CI: 1.8,
      CI50_2500: 5.2,
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(rawBareField.impact?.LPrimeNW).toBeUndefined();
    expect(
      rawBareField.impact?.errorBudgets?.some((budget) => budget.origin === "source_absent_field_building_adapter_error_budget")
    ).toBe(false);

    expect(building.supportedTargetOutputs).toEqual([]);
    expect(building.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(building.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(building.metrics.estimatedDnTwDb).toBeUndefined();
    expect(building.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and the current-gate runner aligned with the revalidation closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(LANDED_GATE);
      expect(content, path).toContain(SELECTION_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("exact, direct-fixed, and supported-band");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare impact field transfer remains blocked");
      expect(normalizedWhitespaceContent, path).toContain("building prediction");
      expect(normalizedWhitespaceContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("matrix refresh");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
      expect(normalizedContent, path).toContain("runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts");
    expect(runner).toContain("open-web-field-building-input-surface.test.ts");
  });
});
