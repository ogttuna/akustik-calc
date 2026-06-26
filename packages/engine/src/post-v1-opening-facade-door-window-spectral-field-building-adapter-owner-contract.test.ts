import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
  COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_WARNING
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-door-window-spectral-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_field_building_adapter_owner";

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_STATUS;
const OWNER_CANDIDATE_ID =
  "opening.facade_door_window_spectral_field_building_adapter_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window spectral field/building adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 6,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 11,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 5
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
  id: "spectral-door-field-building-owner-01",
  origin: "catalogued",
  ratingBasis: "iso_717_1_curve",
  sealLeakageClass: "average"
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

const FIELD_CONTEXT = {
  ...BASE_CONTEXT,
  contextMode: "field_between_rooms"
} as const satisfies AirborneContext;

const BUILDING_CONTEXT = {
  ...BASE_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const MISSING_BUILDING_CONTEXT = {
  ...BUILDING_CONTEXT,
  sourceRoomVolumeM3: undefined
} as const satisfies AirborneContext;

const OUTDOOR_FACADE_CONTEXT = {
  ...BUILDING_CONTEXT,
  facadeOutdoorContext: "outdoor_indoor_facade",
  openingLeakElements: [
    {
      ...SPECTRAL_OPENING,
      elementType: "window",
      id: "spectral-window-outdoor-facade-owner-01"
    }
  ]
} as const satisfies AirborneContext;

const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

function metricSubset(result: ReturnType<typeof calculate>) {
  return {
    DnA: result.metrics.estimatedDnADb,
    DnTA: result.metrics.estimatedDnTADb,
    DnTAk: result.metrics.estimatedDnTAkDb,
    DnTw: result.metrics.estimatedDnTwDb,
    DnW: result.metrics.estimatedDnWDb,
    Rw: result.metrics.estimatedRwDb,
    RwPrime: result.metrics.estimatedRwPrimeDb
  };
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

describe("post-V1 opening/facade door/window spectral field/building adapter owner", () => {
  it("lands the runtime owner and selects its coverage refresh", () => {
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

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes curve-only indoor partition field and building outputs through the spectral adapter", () => {
    const field = calculate(FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const building = calculate(BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expect(field.supportedTargetOutputs).toEqual([
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A"
    ]);
    expect(field.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(metricSubset(field)).toMatchObject({
      DnA: 43.7,
      DnTA: 43.9,
      DnTAk: undefined,
      DnTw: 44.7,
      DnW: 44.5,
      Rw: 46,
      RwPrime: 44.2
    });
    expect(field.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["hostWallTransmissionLossCurve", "openingElementTransmissionLossCurve"])
    );
    expect(field.airborneCandidateResolution?.selectedCandidateId).toBe(
      "candidate_post_v1_opening_facade_door_window_spectral_field_building_adapter"
    );
    expect(field.warnings).toEqual(
      expect.arrayContaining([
        COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_WARNING,
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
        POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_WARNING
      ])
    );

    expect(building.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(metricSubset(building)).toMatchObject({
      DnA: 38.9,
      DnTA: 39.1,
      DnTAk: 38.2,
      DnTw: 39.9,
      DnW: 39.7,
      Rw: 46,
      RwPrime: 39.4
    });
    expect(building.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.airborneCandidateResolution?.selectedOrigin).toBe("family_physics_prediction");
  });

  it("returns needs_input for missing building context instead of treating the owned route as unsupported", () => {
    const result = calculate(MISSING_BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["sourceRoomVolumeM3"],
      origin: "needs_input"
    });
    expect(result.warnings).toContain(
      "Opening/leak field/building runtime is waiting for sourceRoomVolumeM3 before promoting R'w / DnT,w."
    );
  });

  it("keeps outdoor-indoor facade/OITC and impact aliases outside this owner", () => {
    const outdoorFacade = calculate(OUTDOOR_FACADE_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const impact = calculate(BUILDING_CONTEXT, IMPACT_OUTPUTS);

    expect(outdoorFacade.supportedTargetOutputs).toEqual([]);
    expect(outdoorFacade.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(outdoorFacade.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
    expect(outdoorFacade.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps active docs and current gate synchronized with the owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("newCalculableTargetOutputs: 6");
      expect(content, path).toContain("runtimeValuesMoved 11");
      expect(content, path).toContain("outdoor-indoor/OITC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
