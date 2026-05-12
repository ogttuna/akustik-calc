import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateAHOpeningLeakStcSpectrumAdapterContract,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
} from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AH = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
  numericRuntimeBehaviorChange: true,
  previousSelectionStatus:
    "gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah",
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
  selectionStatus: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AH_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts",
  "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
  "packages/engine/src/calculate-assembly.ts",
  "apps/web/features/workbench/opening-leak-composite-surface.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AH_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
] as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CONCRETE_HOST_WALL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 200 }
] as const;

const COMPLETE_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
};

const TWO_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 16,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    },
    {
      areaM2: 0.2,
      count: 2,
      elementRwDb: 25,
      id: "duct-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "leaky"
    }
  ]
};

const BUILDING_CONTEXT_WITH_OPENING: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const OPENING_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AH opening/leak STC spectrum adapter", () => {
  it("lands Gate AH as a runtime STC adapter and selects surface parity next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AH).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan",
      numericRuntimeBehaviorChange: true,
      previousSelectionStatus:
        "gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah",
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(buildGateAHOpeningLeakStcSpectrumAdapterContract()).toMatchObject({
      landedGate: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
      numericRuntimeBehaviorChange: true,
      previousRuntimeMethod: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      ratingAdapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      ratingAdapterRuntimeMethod: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      selectedNextAction: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
      selectionStatus: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceDb: 6
    });

    for (const path of REQUIRED_GATE_AH_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete element-lab opening/leak STC from a shifted host spectrum instead of aliasing Rw", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });

    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.metrics.estimatedStc).toBe(39);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.airborneBasis?.assumptions.join(" ")).toContain(
      "Gate AH separately owns element-lab STC"
    );
    expect(result.ratingAdapterBasisSet).toEqual([
      expect.objectContaining({
        adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        inputBasis: "airborne_transmission_loss_curve",
        metricId: "STC",
        ratingStandard: "ASTM E413",
        sourceMetricIds: ["Rw"]
      })
    ]);
    expect(result.ratingAdapterBasisSet?.[0]?.aliasBlocks).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fromMetricId: "Rw",
        toMetricId: "STC"
      }),
      expect.objectContaining({
        fromMetricId: "DnT,w",
        toMetricId: "STC"
      })
    ]));
    expect(result.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("supports an STC-only target request when the opening terms are Rw-compatible", () => {
    const result = calculateAssembly(CONCRETE_HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(result.metrics).toMatchObject({
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(result.supportedTargetOutputs).toEqual(["STC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.ratingAdapterBasisSet?.[0]).toMatchObject({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      metricId: "STC",
      ratingStandard: "ASTM E413"
    });
  });

  it("updates high-leakage matrix values but keeps STC-only opening-basis and building aliases blocked", () => {
    const twoOpening = calculateAssembly(CONCRETE_HOST_WALL, {
      airborneContext: TWO_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const stcOpeningBasis = calculateAssembly(CONCRETE_HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          ratingBasis: "stc_single_number"
        }))
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const buildingAlias = calculateAssembly(HOST_WALL, {
      airborneContext: BUILDING_CONTEXT_WITH_OPENING,
      calculator: "dynamic",
      targetOutputs: ["STC", "R'w", "DnT,w"]
    });

    expect(twoOpening.metrics).toMatchObject({
      estimatedRwDb: 33.7,
      estimatedStc: 34
    });
    expect(twoOpening.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(twoOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(stcOpeningBasis.supportedTargetOutputs).toEqual([]);
    expect(stcOpeningBasis.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(stcOpeningBasis.ratingAdapterBasisSet).toBeUndefined();
    expect(buildingAlias.supportedTargetOutputs).toEqual([]);
    expect(buildingAlias.unsupportedTargetOutputs).toEqual(["STC", "R'w", "DnT,w"]);
    expect(buildingAlias.ratingAdapterBasisSet).toBeUndefined();
  });

  it("keeps docs and the current-gate runner aligned with Gate AH closeout and Gate AI selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN);
      expect(content).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS);
      expect(content).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak STC");
      expect(content).toContain("ASTM E413");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts"
    );
    expect(runner).toContain("opening-leak-composite-input-surface-acceptance.test.ts");
  });
});
