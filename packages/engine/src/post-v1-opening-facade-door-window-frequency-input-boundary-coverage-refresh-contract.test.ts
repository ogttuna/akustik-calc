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
  POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-indoor-field-building-adapter-owner";
import {
  maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION = POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS = POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_STATUS;
const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_frequency_input_boundary_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after opening/facade door/window frequency-input boundary coverage refresh";

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

const LEGACY_COMPLETE_OPENING_CONTEXT = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "legacy-door-refresh-01",
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
      id: "rated-door-refresh-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies AirborneContext;

const MISSING_FREQUENCY_BASIS_CONTEXT = {
  contextMode: "element_lab",
  facadeOutdoorContext: "indoor_partition",
  hostWallAreaM2: 12,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      elementType: "window",
      id: "window-no-frequency-refresh-01",
      origin: "catalogued",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies AirborneContext;

const MISSING_DOOR_WINDOW_CONTEXT = {
  contextMode: "element_lab",
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [
    {
      id: "partial-window-refresh-01"
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
    id: "facade-window-refresh-01"
  }))
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
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
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateOpening(
  airborneContext: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(HOST_WALL, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
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

describe("post-V1 opening/facade door/window frequency-input boundary coverage refresh", () => {
  it("lands the no-runtime refresh and selects the runtime-first route-family rerank", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
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

  it("re-probes legacy and explicit complete lab opening/leak Rw/STC without moving values", () => {
    const legacy = calculateOpening(LEGACY_COMPLETE_OPENING_CONTEXT, LAB_OUTPUTS);
    const explicitContext = AirborneContextSchema.parse(COMPLETE_DOOR_WINDOW_CONTEXT);
    const explicit = calculateOpening(explicitContext, LAB_OUTPUTS);
    const boundary = maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary({
      airborneContext: explicitContext,
      targetOutputs: LAB_OUTPUTS
    });

    for (const result of [legacy, explicit]) {
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
    }

    expect(boundary).toMatchObject({
      blockedOutputs: [],
      missingPhysicalInputs: [],
      requiredPhysicalInputs: [...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS],
      shouldSuppressOpeningLeakRuntime: false,
      status: "complete_element_lab_route_preserved",
      unsupportedBoundaries: [...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES]
    });
  });

  it("re-probes frequency/rating-basis capture as a precise needs_input boundary", () => {
    const result = calculateOpening(MISSING_FREQUENCY_BASIS_CONTEXT, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.airborneBasis).toMatchObject({
      kind: "airborne_needs_input",
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      missingPhysicalInputs: ["openingFrequencyBandsOrRatingBasis"],
      origin: "needs_input"
    });
    expect(result.warnings).toContain(POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING);
  });

  it("keeps broad missing door/window/facade claims parked behind all required physical inputs", () => {
    const result = calculateOpening(MISSING_DOOR_WINDOW_CONTEXT, LAB_OUTPUTS);

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
  });

  it("keeps outdoor-indoor facade and impact aliases outside the refresh while later indoor ownership can promote field/building", () => {
    const building = calculateOpening(FIELD_BUILDING_DOOR_WINDOW_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const outdoorFacade = calculateOpening(OUTDOOR_FACADE_CONTEXT, ["Rw"]);
    const impact = calculateOpening(COMPLETE_DOOR_WINDOW_CONTEXT, IMPACT_OUTPUTS);

    expect(building.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(building.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(building.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
    );

    expect(outdoorFacade.supportedTargetOutputs).toEqual([]);
    expect(outdoorFacade.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(outdoorFacade.airborneBasis).toMatchObject({
      kind: "airborne_unsupported",
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis?.method).not.toBe(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD
    );
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("openingFrequencyBandsOrRatingBasis");
      expect(content, path).toContain("field/building facade");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
