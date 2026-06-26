import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_STATUS;
const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_building_lab_companion_target_output_independence_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after opening/facade door/window building lab-companion target-output independence coverage refresh";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  elementType: "door",
  frequencyBandSet: "third_octave_100_3150",
  id: "rated-door-refresh-02",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const BASE_CONTEXT = {
  facadeOutdoorContext: "indoor_partition",
  frequencyBandSet: "third_octave_100_3150",
  hostWallAreaM2: 12,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [OPENING],
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
  ...FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const MISSING_FREQUENCY_CONTEXT = {
  ...BUILDING_CONTEXT,
  openingLeakElements: [
    {
      ...OPENING,
      frequencyBandSet: undefined,
      ratingBasis: undefined
    }
  ]
} as const satisfies AirborneContext;

const OUTDOOR_FACADE_CONTEXT = {
  ...BUILDING_CONTEXT,
  facadeOutdoorContext: "outdoor_indoor_facade",
  openingLeakElements: [
    {
      ...OPENING,
      elementType: "window",
      id: "facade-window-refresh-02"
    }
  ]
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
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
  COVERAGE_REFRESH_PLAN_DOC,
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

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousOwner: {
      action: OWNER_ACTION,
      file: OWNER_FILE,
      status: OWNER_STATUS
    },
    reProbedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 opening/facade door/window building lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime refresh and selects the runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      reProbedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes Rw/STC lab companions in complete indoor field and building contexts", () => {
    for (const context of [FIELD_CONTEXT, BUILDING_CONTEXT]) {
      const result = calculate(context, LAB_OUTPUTS);

      expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics.estimatedRwDb).toBe(38.2);
      expect(result.metrics.estimatedStc).toBe(39);
      expect(result.airborneBasis).toMatchObject({
        method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.warnings).toEqual(
        expect.arrayContaining([
          GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING,
          POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
        ])
      );
    }
  });

  it("keeps missing frequency, outdoor-indoor facade, and impact aliases blocked", () => {
    const missingFrequency = calculate(MISSING_FREQUENCY_CONTEXT, LAB_OUTPUTS);
    const outdoorFacade = calculate(OUTDOOR_FACADE_CONTEXT, LAB_OUTPUTS);
    const impact = calculate(BUILDING_CONTEXT, IMPACT_OUTPUTS);

    expect(missingFrequency.supportedTargetOutputs).toEqual([]);
    expect(missingFrequency.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFrequency.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingFrequencyBandsOrRatingBasis"],
      origin: "needs_input"
    });
    expect(missingFrequency.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
    );

    expect(outdoorFacade.supportedTargetOutputs).toEqual([]);
    expect(outdoorFacade.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(outdoorFacade.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current gate synchronized with the refresh handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
