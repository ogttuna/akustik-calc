import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
} from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_PLAN =
  "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan";
const GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_STATUS =
  "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj";
const GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan";
const GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts";

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AI = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
  previousSelectionStatus: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_FILE,
  selectionStatus: GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_AI_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts",
  "apps/web/features/workbench/opening-leak-composite-surface.ts",
  "apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/target-output-status.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/app/api/estimate/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md",
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
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md"
] as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
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

const HIGH_LEAKAGE_OPENING_CONTEXT: AirborneContext = {
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

describe("Personal-Use MVP Coverage Sprint Gate AI opening/leak STC surface parity", () => {
  it("lands Gate AI as no-runtime surface parity and selects post-STC revalidation", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AI).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan",
      previousSelectionStatus:
        "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts",
      selectionStatus:
        "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_AI_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate AH complete and high-leakage STC values unchanged while exposing the ASTM adapter basis", () => {
    const complete = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const highLeakage = calculateAssembly(HOST_WALL, {
      airborneContext: HIGH_LEAKAGE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const stcOnlyTarget = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(complete.metrics).toMatchObject({
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(complete.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(complete.ratingAdapterBasisSet).toEqual([
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
    expect(complete.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(complete.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(complete.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);

    expect(highLeakage.metrics).toMatchObject({
      estimatedRwDb: 33.7,
      estimatedStc: 34
    });
    expect(highLeakage.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(highLeakage.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(highLeakage.ratingAdapterBasisSet?.[0]).toMatchObject({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      ratingStandard: "ASTM E413"
    });

    expect(stcOnlyTarget.metrics).toMatchObject({
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(stcOnlyTarget.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnlyTarget.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps missing, source-absent, STC-only opening basis, and building requests outside the budgeted STC surface", () => {
    const missingOpeningRw = calculateAssembly(HOST_WALL, {
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1.8,
            count: 1,
            id: "partial-door",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const sourceAbsentOpening = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "source-absent-door",
          origin: "source_absent"
        }))
      },
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const stcOpeningBasis = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "stc-only-door",
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

    expect(missingOpeningRw.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingElementRwDb"],
      origin: "needs_input"
    });
    expect(missingOpeningRw.ratingAdapterBasisSet).toBeUndefined();
    expect(missingOpeningRw.supportedTargetOutputs).toEqual([]);

    for (const [result, blockedReason] of [
      [sourceAbsentOpening, "sourceAbsentOpeningValueBudgetOwner"],
      [stcOpeningBasis, "STC-only opening ratings cannot be aliased"]
    ] as const) {
      expect(result.airborneBasis?.origin, blockedReason).toBe("unsupported");
      expect(result.airborneBasis?.errorBudgetDb, blockedReason).toBeUndefined();
      expect(result.ratingAdapterBasisSet, blockedReason).toBeUndefined();
      expect(result.supportedTargetOutputs, blockedReason).toEqual([]);
      expect(result.warnings.join("\n"), blockedReason).toContain(blockedReason);
    }

    expect(buildingAlias.supportedTargetOutputs).toEqual([]);
    expect(buildingAlias.unsupportedTargetOutputs).toEqual(["STC", "R'w", "DnT,w"]);
    expect(buildingAlias.ratingAdapterBasisSet).toBeUndefined();
    expect(buildingAlias.warnings.join("\n")).not.toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("requires cards, target status, dossiers, reports, saved replay, and API tests to carry the same Gate AH STC surface", () => {
    const surface = readRepoFile("apps/web/features/workbench/opening-leak-composite-surface.ts");
    const parityTest = readRepoFile("apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts");
    const inputSurfaceTest = readRepoFile("apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts");

    expect(surface).toContain("stcAdapterActive");
    expect(surface).toContain("stcAdapterId");
    expect(surface).toContain("stcRatingStandard");
    expect(surface).toContain("Gate AH ASTM E413 STC adapter");

    for (const requiredPhrase of [
      "Gate AH lab STC 39 dB",
      "getTargetOutputCorridor",
      "ratingAdapterBasisSet",
      "composeWorkbenchReport",
      "../../app/api/estimate/route"
    ] as const) {
      expect(parityTest, requiredPhrase).toContain(requiredPhrase);
    }

    expect(inputSurfaceTest).toContain("Gate AH ASTM E413 spectrum adapter");
    expect(inputSurfaceTest).toContain("STC: 39 dB through Gate AH ASTM E413 adapter");
  });

  it("keeps docs and the current-gate runner aligned with Gate AI closeout and Gate AJ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_PLAN);
      expect(content, path).toContain(GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain("ASTM E413");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/opening-leak-composite-surface-parity.test.ts");
  });
});
