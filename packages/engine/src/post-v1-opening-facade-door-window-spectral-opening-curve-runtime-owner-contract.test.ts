import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_WARNING
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_opening_curve_runtime_owner";

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_STATUS;
const OWNER_CANDIDATE_ID =
  "opening.facade_door_window_spectral_opening_curve_runtime_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window spectral opening-curve runtime coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 3,
  newCalculableTargetOutputs: 4,
  requiredPhysicalInputsCaptured: 1,
  runtimeBasisPromotions: 3,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
} as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const FREQUENCIES_HZ = [
  63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000,
  1250, 1600, 2000, 2500, 3150, 4000
] as const;

const OPENING_TRANSMISSION_LOSS_DB = [
  18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48
] as const;

const SPECTRAL_OPENING = {
  areaM2: 1.8,
  count: 1,
  elementTransmissionLossCurve: {
    frequenciesHz: [...FREQUENCIES_HZ],
    transmissionLossDb: [...OPENING_TRANSMISSION_LOSS_DB]
  },
  elementType: "door",
  frequencyBandSet: "third_octave_100_3150",
  id: "spectral-door-runtime-owner-01",
  origin: "catalogued",
  ratingBasis: "iso_717_1_curve",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const SCALAR_OPENING = {
  ...SPECTRAL_OPENING,
  elementRwDb: 32,
  elementTransmissionLossCurve: undefined,
  id: "scalar-door-runtime-owner-01",
  ratingBasis: "rw_single_number"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const BASE_CONTEXT = {
  facadeOutdoorContext: "indoor_partition",
  frequencyBandSet: "third_octave_100_3150",
  hostWallAreaM2: 12,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [SPECTRAL_OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
} as const satisfies AirborneContext;

const SPECTRAL_LAB_CONTEXT = {
  ...BASE_CONTEXT,
  contextMode: "element_lab"
} as const satisfies AirborneContext;

const SPECTRAL_BUILDING_CONTEXT = {
  ...BASE_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const SCALAR_BUILDING_CONTEXT = {
  ...SPECTRAL_BUILDING_CONTEXT,
  openingLeakElements: [SCALAR_OPENING]
} as const satisfies AirborneContext;

const MISSING_RATING_CONTEXT = {
  ...SPECTRAL_BUILDING_CONTEXT,
  openingLeakElements: [
    {
      ...SPECTRAL_OPENING,
      elementTransmissionLossCurve: undefined,
      id: "missing-door-rating-runtime-owner-01"
    }
  ]
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculate(
  airborneContext: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(HOST_WALL, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 opening/facade door/window spectral opening-curve runtime owner", () => {
  it("lands the runtime owner and selects coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates lab Rw/STC/C/Ctr from the explicit opening transmission-loss curve", () => {
    const result = calculate(SPECTRAL_LAB_CONTEXT, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toContain("openingElementTransmissionLossCurve");
    expect(result.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING
    );
    expect(result.warnings).not.toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
    );
  });

  it("hands curve-only opening field/building outputs to the landed spectral adapter", () => {
    const result = calculate(SPECTRAL_BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 38.9,
      estimatedDnTADb: 39.1,
      estimatedDnTAkDb: 38.2,
      estimatedDnTwDb: 39.9,
      estimatedDnWDb: 39.7,
      estimatedRwPrimeDb: 39.4
    });
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(
      COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_WARNING
    );
    expect(result.warnings).not.toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
    );
  });

  it("preserves the scalar opening route and the missing-rating needs_input boundary", () => {
    const scalar = calculate(SCALAR_BUILDING_CONTEXT, LAB_OUTPUTS);
    expect(scalar.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.3,
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });

    const missing = calculate(MISSING_RATING_CONTEXT, LAB_OUTPUTS);
    expect(missing.supportedTargetOutputs).toEqual([]);
    expect(missing.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missing.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "needs_input"
    });
    expect(missing.airborneBasis?.missingPhysicalInputs).toContain("openingElementRwDb");
    expect(missing.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
    );
  });

  it("keeps docs and current-gate runner aligned with the landed runtime owner", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));

    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("openingElementTransmissionLossCurve");
      expect(content, path).toContain("runtimeValuesMoved 12");
      expect(content, path).toContain("field/building");
    }
  });
});
