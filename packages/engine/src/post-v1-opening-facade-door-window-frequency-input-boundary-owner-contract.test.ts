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
import { GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING } from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_FILE,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-indoor-field-building-adapter-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_landed_no_runtime_selected_opening_facade_door_window_frequency_input_boundary_owner";

const OWNER_ACTION = POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS = POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_STATUS;
const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_frequency_input_boundary_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window frequency-input boundary coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 6,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 8
} as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const LEGACY_COMPLETE_OPENING_CONTEXT = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "legacy-door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies AirborneContext;

const COMPLETE_DOOR_WINDOW_CONTEXT = {
  contextMode: "element_lab",
  facadeOutdoorContext: "indoor_partition",
  hostWallAreaM2: 12,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      elementType: "door",
      frequencyBandSet: "third_octave_100_3150",
      id: "rated-door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies AirborneContext;

const MISSING_DOOR_WINDOW_CONTEXT = {
  contextMode: "element_lab",
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [
    {
      id: "partial-window-01"
    }
  ]
} as const satisfies AirborneContext;

const FIELD_BUILDING_DOOR_WINDOW_CONTEXT = {
  ...COMPLETE_DOOR_WINDOW_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const OUTDOOR_FACADE_CONTEXT = {
  ...COMPLETE_DOOR_WINDOW_CONTEXT,
  facadeOutdoorContext: "outdoor_indoor_facade",
  openingLeakElements: COMPLETE_DOOR_WINDOW_CONTEXT.openingLeakElements.map((opening) => ({
    ...opening,
    elementType: "window" as const,
    id: "facade-window-01"
  }))
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 opening/facade door/window frequency-input boundary owner", () => {
  it("lands the selected input-boundary owner and selects coverage refresh next", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_RERANK_ACTION).toBe(
      "post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan"
    );
    expect(PREVIOUS_RERANK_STATUS).toContain("selected_opening_facade_door_window_frequency_input_boundary_owner");
    expect(OWNER_ACTION).toBe("post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan");
    expect(OWNER_STATUS).toBe(
      "post_v1_opening_facade_door_window_frequency_input_boundary_owner_landed_input_boundary_selected_coverage_refresh"
    );
    expect(SELECTED_NEXT_ACTION).toBe(
      "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan"
    );
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      requiredPhysicalInputsCaptured: 6,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 8
    });
  });

  it("keeps legacy Gate S/Gate AH element-lab opening/leak Rw and STC live", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: LEGACY_COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.metrics.estimatedStc).toBe(39);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("accepts explicit door/window/facade boundary fields without stealing the complete lab route", () => {
    const parsedContext = AirborneContextSchema.parse(COMPLETE_DOOR_WINDOW_CONTEXT);
    const boundary = maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary({
      airborneContext: parsedContext,
      targetOutputs: LAB_OUTPUTS
    });
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: parsedContext,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(boundary).toMatchObject({
      adjacentUnsupportedMetrics: ["OITC"],
      blockedOutputs: [],
      missingPhysicalInputs: [],
      requiredPhysicalInputs: [...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS],
      shouldSuppressOpeningLeakRuntime: false,
      status: "complete_element_lab_route_preserved",
      unsupportedBoundaries: [...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES]
    });
    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.metrics.estimatedStc).toBe(39);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("moves incomplete door/window/facade claims to precise needs_input instead of using generic opening labels", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: MISSING_DOOR_WINDOW_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const boundary = maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary({
      airborneContext: MISSING_DOOR_WINDOW_CONTEXT,
      targetOutputs: LAB_OUTPUTS
    });

    expect(boundary).toMatchObject({
      blockedOutputs: ["Rw", "STC"],
      missingPhysicalInputs: [
        "hostWallAreaM2",
        "openingAreaM2",
        "openingElementType",
        "openingFrequencyBandsOrRatingBasis",
        "openingSealLeakageClass",
        "facadeOutdoorOrRoomNormalizationContext"
      ],
      shouldSuppressFieldBuildingRuntime: true,
      shouldSuppressOpeningLeakRuntime: true,
      status: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.airborneBasis).toMatchObject({
      kind: "airborne_needs_input",
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      missingPhysicalInputs: [
        "hostWallAreaM2",
        "openingAreaM2",
        "openingElementType",
        "openingFrequencyBandsOrRatingBasis",
        "openingSealLeakageClass",
        "facadeOutdoorOrRoomNormalizationContext"
      ],
      origin: "needs_input"
    });
    expect(result.warnings).toContain(POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING);
  });

  it("keeps outdoor-indoor facade unsupported while later indoor ownership can promote field/building", () => {
    const buildingResult = calculateAssembly(HOST_WALL, {
      airborneContext: FIELD_BUILDING_DOOR_WINDOW_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const outdoorFacadeResult = calculateAssembly(HOST_WALL, {
      airborneContext: OUTDOOR_FACADE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(buildingResult.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(buildingResult.unsupportedTargetOutputs).toEqual(["DnT,A"]);
    expect(buildingResult.airborneBasis).toMatchObject({
      method: "company_internal_opening_leak_building_area_energy_runtime_corridor",
      origin: "family_physics_prediction"
    });
    expect(buildingResult.warnings).toContain(POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING);
    expect(buildingResult.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
    );

    expect(outdoorFacadeResult.supportedTargetOutputs).toEqual([]);
    expect(outdoorFacadeResult.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(outdoorFacadeResult.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
  });

  it("keeps docs and the current-gate runner synchronized with the landed owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain(String(OWNER_COUNTERS.requiredPhysicalInputsCaptured));
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts"
    );
  });
});
