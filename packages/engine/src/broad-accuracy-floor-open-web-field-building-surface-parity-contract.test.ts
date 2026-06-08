import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_web_field_building_surface_parity_plan";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_field_building_surface_parity_landed_no_runtime_selected_input_surface";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_field_building_input_surface_plan";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "apps/web/features/workbench/open-web-field-building-input-surface.test.ts";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "floor open-web field/building input surface";

const PREVIOUS_OWNER_GATE = "broad_accuracy_floor_open_web_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_STATUS =
  "broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity";
const PREVIOUS_OWNER_SELECTED_ACTION = "broad_accuracy_floor_open_web_field_building_surface_parity_plan";
const PREVIOUS_OWNER_SELECTED_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts";

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

const SURFACE_PARITY_CONTRACT = {
  apiShapeChange: false,
  buildingPredictionRuntimePromotion: false,
  landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_LANDED_GATE,
  noRuntimeValueMovement: true,
  previousGate: PREVIOUS_OWNER_GATE,
  previousOwnerSelectedAction: PREVIOUS_OWNER_SELECTED_ACTION,
  previousOwnerSelectedFile: PREVIOUS_OWNER_SELECTED_FILE,
  previousSelectionStatus: PREVIOUS_OWNER_STATUS,
  selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTION_STATUS,
  surfaceTargets: [
    "route_card",
    "output_cards",
    "method_dossier",
    "local_saved_replay",
    "server_snapshot_replay",
    "calculator_api_payload",
    "impact_only_api_payload",
    "markdown_report"
  ],
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/impact-confidence-view.ts",
  "apps/web/features/workbench/impact-lane-view.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const FIELD_SURFACE_CASES = [
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
    id: "exact_fl23_open_web_field_surface",
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
    id: "direct_fixed_open_web_field_surface",
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
    id: "supported_band_open_web_field_surface",
    layers: SUPPORTED_BAND_PACKAGE
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateFieldSurface(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });
}

function expectFieldErrorBudgetSurface(result: ReturnType<typeof calculateFieldSurface>) {
  for (const metricId of ["L'n,w", "L'nT,w", "L'nT,50"]) {
    expect(
      result.impact?.errorBudgets?.some(
        (budget: ImpactErrorBudget) =>
          budget.metricId === metricId &&
          budget.notMeasuredEvidence === true &&
          budget.origin === "source_absent_field_building_adapter_error_budget"
      ),
      metricId
    ).toBe(true);
  }
}

describe("broad accuracy floor open-web field/building surface parity contract", () => {
  it("lands no-runtime surface parity and selects the input-surface follow-up", () => {
    expect(SURFACE_PARITY_CONTRACT).toEqual({
      apiShapeChange: false,
      buildingPredictionRuntimePromotion: false,
      landedGate: "broad_accuracy_floor_open_web_field_building_surface_parity_plan",
      noRuntimeValueMovement: true,
      previousGate: "broad_accuracy_floor_open_web_field_building_adapter_owner_plan",
      previousOwnerSelectedAction: "broad_accuracy_floor_open_web_field_building_surface_parity_plan",
      previousOwnerSelectedFile:
        "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts",
      previousSelectionStatus:
        "broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity",
      selectedNextAction: "broad_accuracy_floor_open_web_field_building_input_surface_plan",
      selectedNextFile: "apps/web/features/workbench/open-web-field-building-input-surface.test.ts",
      selectedNextLabel: "floor open-web field/building input surface",
      selectionStatus:
        "broad_accuracy_floor_open_web_field_building_surface_parity_landed_no_runtime_selected_input_surface",
      surfaceTargets: [
        "route_card",
        "output_cards",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "impact_only_api_payload",
        "markdown_report"
      ],
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps exact, direct-fixed, and supported-band field cards/API/report values aligned", () => {
    for (const entry of FIELD_SURFACE_CASES) {
      const result = calculateFieldSurface(entry.layers);

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
      expect(result.dynamicImpactTrace, entry.id).toMatchObject({
        fieldContinuation: "local_guide_simple",
        fieldContinuationLabel: "Turkish simple guide",
        fieldOutputsActive: true,
        guideActive: true,
        hasFieldContext: true
      });
      expectFieldErrorBudgetSurface(result);
    }
  });

  it("keeps raw-bare open-web field transfer visible through the explicit field adapter", () => {
    const rawBare = calculateFieldSurface(RAW_OPEN_WEB_300);

    expect(rawBare.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(rawBare.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(rawBare.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBare.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(rawBare.impact).toMatchObject({
      CI: 1.8,
      CI50_2500: 5.2,
      LPrimeNW: 98,
      LPrimeNTw: 95.6,
      LPrimeNT50: 100.8,
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(
      rawBare.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")
    ).toBe(true);
  });

  it("keeps building impact and ASTM/IIC surfaces unsupported while later airborne building coverage stays live", () => {
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

    expect(building.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(building.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedRwPrimeDb: 30
    });
    expect(building.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(
      building.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")
    ).toBe(false);

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with the surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("floor open-web field/building input surface");
      expect(normalizedWhitespaceContent, path).toContain("route card");
      expect(normalizedWhitespaceContent, path).toContain("output cards");
      expect(normalizedWhitespaceContent, path).toContain("method dossier");
      expect(normalizedWhitespaceContent, path).toContain("local saved replay");
      expect(normalizedWhitespaceContent, path).toContain("server snapshot replay");
      expect(normalizedWhitespaceContent, path).toContain("calculator api");
      expect(normalizedContent, path).toContain("impact-only api");
      expect(normalizedWhitespaceContent, path).toContain("markdown report");
      expect(normalizedWhitespaceContent, path).toContain("source_absent_field_building_adapter_error_budget");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare open-web field transfer is active");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts");
    expect(runner).toContain("broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts");
  });
});
