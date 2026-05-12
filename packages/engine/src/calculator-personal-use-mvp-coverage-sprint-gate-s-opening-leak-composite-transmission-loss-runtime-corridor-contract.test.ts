import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AirborneContextSchema,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateSOpeningLeakCompositeRuntimeCorridorContract,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING,
  GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  maybeBuildGateSOpeningLeakCompositeRuntimeCorridor
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS
} from "./dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_S = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
  numericRuntimeBehaviorChange: true,
  previousLandedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
  selectionStatus: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_S_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
  "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
  "packages/engine/src/calculate-assembly.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_S_HANDOFF.md",
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

const COMPLETE_BUILDING_CONTEXT_WITH_OPENING: AirborneContext = {
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

describe("Personal-Use MVP Coverage Sprint Gate S opening/leak composite runtime corridor", () => {
  it("lands Gate S as a runtime corridor and selects surface parity next", () => {
    const contract = buildGateSOpeningLeakCompositeRuntimeCorridorContract();

    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_S).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan",
      numericRuntimeBehaviorChange: true,
      previousLandedGate:
        "gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan",
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract).toMatchObject({
      landedGate: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
      numericRuntimeBehaviorChange: true,
      previousLandedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
      previousSelectionStatus: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
      runtimeMethod: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedNextAction: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
      selectedNextFile: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
      selectionStatus: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      toleranceDb: 6
    });
    expect(contract.blockedOutputBasis).toEqual({
      buildingPredictionMetrics: true,
      fieldRuntimeMetrics: true,
      stcOpeningBasisWithoutRwAdapter: true
    });
    expect(contract.activeRuntimeAssessment).toMatchObject({
      blockedOutputs: ["STC"],
      runtimeRwDb: 38.2,
      status: "runtime_corridor_promoted"
    });
    expect(contract.activeRuntimeAssessment.assessment).toMatchObject({
      basisId: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
      designCorridorEstimateDb: 38.2,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingAreaRatio: 0.15
    });
    expect(contract.activeRuntimeAssessment.basis).toMatchObject({
      curveBasis: "calculated_single_number_estimate",
      errorBudgetDb: 6,
      kind: "airborne_physics_prediction",
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });

    for (const path of REQUIRED_GATE_S_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete element-lab opening/leak Rw and later Gate AH STC while keeping field/building outputs blocked", () => {
    const baseline = calculateAssembly(HOST_WALL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const withOpening = calculateAssembly(HOST_WALL, {
      airborneContext: AirborneContextSchema.parse(COMPLETE_OPENING_CONTEXT),
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });

    expect(baseline.metrics.estimatedRwDb).toBeGreaterThan(withOpening.metrics.estimatedRwDb);
    expect(withOpening.metrics.estimatedRwDb).toBe(38.2);
    expect(withOpening.metrics.estimatedStc).toBe(39);
    expect(withOpening.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(withOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(withOpening.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(withOpening.airborneBasis?.assumptions.join("\n")).toMatch(/Gate AH separately owns element-lab STC/i);
    expect(withOpening.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
    expect(withOpening.warnings).not.toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING);
  });

  it("blocks source-absent, STC-only, missing, and hostile opening inputs instead of returning host-wall Rw as supported", () => {
    const sourceAbsent = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "source-absent-door",
          origin: "source_absent"
        }))
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const stcOnly = calculateAssembly(HOST_WALL, {
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
    const missing = calculateAssembly(HOST_WALL, {
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
      targetOutputs: ["Rw"]
    });
    const duplicate = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: [
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] },
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] }
        ]
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(sourceAbsent.supportedTargetOutputs).toEqual([]);
    expect(sourceAbsent.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(sourceAbsent.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "unsupported"
    });
    expect(sourceAbsent.warnings.join("\n")).toMatch(/sourceAbsentOpeningValueBudgetOwner/);

    expect(stcOnly.supportedTargetOutputs).toEqual([]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(stcOnly.warnings.join("\n")).toMatch(/STC-only opening ratings cannot be aliased/i);

    expect(missing.supportedTargetOutputs).toEqual([]);
    expect(missing.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(missing.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingElementRwDb"],
      origin: "needs_input"
    });
    expect(missing.warnings.join("\n")).toMatch(/openingElementRwDb/);

    expect(duplicate.supportedTargetOutputs).toEqual([]);
    expect(duplicate.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(duplicate.warnings.join("\n")).toMatch(/duplicateOpeningId/);
  });

  it("keeps building and field contexts parked on their own adapters when opening inputs are present", () => {
    const buildingWithOpening = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT_WITH_OPENING,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const helper = maybeBuildGateSOpeningLeakCompositeRuntimeCorridor({
      airborneContext: COMPLETE_BUILDING_CONTEXT_WITH_OPENING,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(helper).toMatchObject({
      blockedOutputs: ["R'w", "DnT,w"],
      runtimeRwDb: null,
      status: "blocked_context_alias"
    });
    expect(buildingWithOpening.supportedTargetOutputs).toEqual([]);
    expect(buildingWithOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildingWithOpening.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(buildingWithOpening.metrics.estimatedDnTwDb).toBeUndefined();
    expect(buildingWithOpening.airborneBasis?.method).not.toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(buildingWithOpening.warnings).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
    expect(buildingWithOpening.warnings.join("\n")).toMatch(/does not alias it to R'w or DnT,w/);
  });

  it("keeps docs and the current-gate runner aligned with Gate S closeout and Gate T selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN);
      expect(content).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS);
      expect(content).toContain(GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak composite");
      expect(content).toContain("runtime corridor");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts"
    );
  });
});
