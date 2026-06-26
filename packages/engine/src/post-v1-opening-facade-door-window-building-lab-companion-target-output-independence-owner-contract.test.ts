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
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-indoor-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_building_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_STATUS;
const OWNER_CANDIDATE_ID =
  "opening.facade_door_window_building_lab_companion_target_output_independence_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window building lab-companion target-output independence coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 2,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 8,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
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
  id: "rated-door-01",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const BASE_DOOR_WINDOW_CONTEXT = {
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
  ...BASE_DOOR_WINDOW_CONTEXT,
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
      id: "facade-window-01"
    }
  ]
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [
  ...LAB_OUTPUTS,
  ...FIELD_BUILDING_OUTPUTS
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

function metricSnapshot(result: ReturnType<typeof calculate>) {
  return {
    DnA: result.metrics.estimatedDnADb,
    DnTA: result.metrics.estimatedDnTADb,
    DnTAk: result.metrics.estimatedDnTAkDb,
    DnTw: result.metrics.estimatedDnTwDb,
    DnW: result.metrics.estimatedDnWDb,
    Rw: result.metrics.estimatedRwDb,
    RwPrime: result.metrics.estimatedRwPrimeDb,
    STC: result.metrics.estimatedStc
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

describe("post-V1 opening/facade door/window building lab-companion target-output independence owner", () => {
  it("lands the runtime/basis owner and selects the coverage refresh", () => {
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

  it("keeps Rw/STC lab companions calculable in complete indoor field and building contexts", () => {
    for (const context of [FIELD_CONTEXT, BUILDING_CONTEXT]) {
      const mixed = calculate(context, MIXED_OUTPUTS);
      const rwOnly = calculate(context, ["Rw"]);
      const stcOnly = calculate(context, ["STC"]);

      expect(mixed.supportedTargetOutputs).toEqual(
        context.contextMode === "building_prediction"
          ? [...MIXED_OUTPUTS]
          : [...LAB_OUTPUTS, "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
      );
      expect(mixed.unsupportedTargetOutputs).toEqual(
        context.contextMode === "building_prediction" ? [] : ["DnT,A,k"]
      );
      expect(metricSnapshot(mixed)).toMatchObject({
        Rw: 38.2,
        STC: 39
      });
      expect(mixed.airborneBasis).toMatchObject({
        method: "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor",
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(mixed.warnings).toEqual(
        expect.arrayContaining([
          GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING,
          POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING,
          POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
        ])
      );

      expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
      expect(rwOnly.unsupportedTargetOutputs).toEqual([]);
      expect(metricSnapshot(rwOnly)).toMatchObject({ Rw: 38.2 });
      expect(rwOnly.airborneBasis).toMatchObject({
        method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
        origin: "family_physics_prediction"
      });

      expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
      expect(stcOnly.unsupportedTargetOutputs).toEqual([]);
      expect(metricSnapshot(stcOnly)).toMatchObject({ Rw: 38.2, STC: 39 });
    }
  });

  it("keeps outdoor-indoor facade, missing frequency input, and impact aliases outside the lab companion owner", () => {
    const fieldBuildingOnly = calculate(BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const missingFrequency = calculate(MISSING_FREQUENCY_CONTEXT, LAB_OUTPUTS);
    const outdoorFacade = calculate(OUTDOOR_FACADE_CONTEXT, LAB_OUTPUTS);
    const impact = calculate(BUILDING_CONTEXT, IMPACT_OUTPUTS);

    expect(fieldBuildingOnly.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldBuildingOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldBuildingOnly.airborneBasis).toMatchObject({
      method: "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor",
      origin: "family_physics_prediction"
    });

    expect(missingFrequency.supportedTargetOutputs).toEqual([]);
    expect(missingFrequency.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFrequency.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingFrequencyBandsOrRatingBasis"],
      origin: "needs_input"
    });

    expect(outdoorFacade.supportedTargetOutputs).toEqual([]);
    expect(outdoorFacade.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(outdoorFacade.airborneBasis).toMatchObject({
      method: "post_v1_opening_facade_door_window_frequency_input_boundary_owner",
      origin: "unsupported"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.warnings.join("\n")).toMatch(/unsupported|impact/i);
  });

  it("keeps active docs and current gate synchronized with the owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts");
  });
});
