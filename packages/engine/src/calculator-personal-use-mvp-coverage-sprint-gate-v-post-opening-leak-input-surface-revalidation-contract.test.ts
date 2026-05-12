import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_U_OPENING_LEAK_INPUT_SURFACE_STATUS =
  "gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v";

const GATE_V_POST_OPENING_LEAK_REVALIDATION_PLAN =
  "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan";

const GATE_V_POST_OPENING_LEAK_REVALIDATION_STATUS =
  "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w";

const GATE_V_SELECTED_NEXT_ACTION =
  "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan";

const GATE_V_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts";

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_V = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_V_POST_OPENING_LEAK_REVALIDATION_PLAN,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: GATE_U_OPENING_LEAK_INPUT_SURFACE_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_V_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_V_SELECTED_NEXT_FILE,
  selectionStatus: GATE_V_POST_OPENING_LEAK_REVALIDATION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_V_REVALIDATION_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_V_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_U_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_CONTINUITY_TESTS = [
  "calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts"
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

const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
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
const FIELD_TARGETS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const POST_GATE_V_NEXT_LANE_CANDIDATES = [
  {
    blockedBy: "all original Gate A high-ROI runtime/input lanes have now landed or deliberately parked",
    id: "coverage_matrix_refresh_after_opening_leak",
    reason: "refresh the executable MVP matrix before choosing another solver or source target",
    selected: true
  },
  {
    blockedBy: "Gate P kept building prediction parked until flanking/path owners become executable",
    id: "airborne_building_prediction_runtime_promotion",
    reason: "would risk lab/field/building aliasing without owned flanking terms",
    selected: false
  },
  {
    blockedBy: "Gate BI/AQ-BH require source-owned same-stack ISO DeltaLw packets first",
    id: "steel_floor_delta_lw_tolerance_tightening",
    reason: "narrower than calculator-wide post-surface coverage refresh",
    selected: false
  },
  {
    blockedBy: "active plan blocks broad crawling unless a matrix row names a specific unblocker",
    id: "broad_source_catalog_crawl",
    reason: "would drift back toward source-library work",
    selected: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate V post opening/leak input-surface revalidation", () => {
  it("lands Gate V as no-runtime revalidation and selects the post-opening matrix refresh next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_V).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts",
      selectionStatus:
        "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_V_REVALIDATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the UI-derived opening/leak fixture pinned to the Gate S lab Rw corridor", () => {
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
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps field and building contexts separated from the opening/leak lab corridor", () => {
    const field = calculateAssembly(HOST_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_TARGETS
    });
    const buildingWithOpening = calculateAssembly(HOST_WALL, {
      airborneContext: BUILDING_CONTEXT_WITH_OPENING,
      calculator: "dynamic",
      targetOutputs: FIELD_TARGETS
    });

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

    expect(buildingWithOpening.supportedTargetOutputs).toEqual([]);
    expect(buildingWithOpening.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildingWithOpening.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(buildingWithOpening.metrics.estimatedDnTwDb).toBeUndefined();
    expect(buildingWithOpening.airborneBasis?.method).not.toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(buildingWithOpening.warnings).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  });

  it("records the next-lane decision without falling back to source crawling", () => {
    expect(POST_GATE_V_NEXT_LANE_CANDIDATES.filter((candidate) => candidate.selected)).toEqual([
      {
        blockedBy: "all original Gate A high-ROI runtime/input lanes have now landed or deliberately parked",
        id: "coverage_matrix_refresh_after_opening_leak",
        reason: "refresh the executable MVP matrix before choosing another solver or source target",
        selected: true
      }
    ]);
    expect(POST_GATE_V_NEXT_LANE_CANDIDATES.find((candidate) => candidate.id === "broad_source_catalog_crawl"))
      .toMatchObject({
        selected: false
      });
  });

  it("keeps docs and the current-gate runner aligned with Gate V closeout and Gate W selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain(GATE_V_POST_OPENING_LEAK_REVALIDATION_PLAN);
      expect(content).toContain(GATE_V_POST_OPENING_LEAK_REVALIDATION_STATUS);
      expect(content).toContain(GATE_V_SELECTED_NEXT_ACTION);
      expect(content).toContain("opening/leak");
      expect(content).toContain("coverage matrix refresh");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts"
    );
    for (const testFile of REQUIRED_CONTINUITY_TESTS) {
      expect(runner).toContain(testFile);
    }
  });
});
