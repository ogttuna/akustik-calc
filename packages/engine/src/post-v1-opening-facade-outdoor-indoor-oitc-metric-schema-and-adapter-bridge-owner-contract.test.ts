import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  REQUESTED_OUTPUT_IDS,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_PLAN,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_STATUS,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner";

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_PLAN_2026-06-26.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_STATUS;
const OWNER_CANDIDATE_ID =
  "opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade outdoor-indoor OITC metric schema and adapter bridge coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  newRequestedTargetOutputs: 1,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
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

const SPECTRAL_WINDOW = {
  areaM2: 1.8,
  count: 1,
  elementTransmissionLossCurve: {
    frequenciesHz: [...FREQUENCIES_HZ],
    transmissionLossDb: [...OPENING_TRANSMISSION_LOSS_DB]
  },
  elementType: "window",
  frequencyBandSet: "third_octave_100_3150",
  id: "oitc-schema-bridge-window-01",
  origin: "catalogued",
  ratingBasis: "iso_717_1_curve",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const OUTDOOR_FACADE_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  facadeOutdoorContext: "outdoor_indoor_facade",
  flankingJunctionClass: "rigid_t_junction",
  frequencyBandSet: "third_octave_100_3150",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [SPECTRAL_WINDOW],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const MISSING_FACADE_CONTEXT = {
  contextMode: "building_prediction",
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary"
} as const satisfies AirborneContext;

const INDOOR_PARTITION_CONTEXT = {
  ...OUTDOOR_FACADE_CONTEXT,
  facadeOutdoorContext: "indoor_partition",
  openingLeakElements: [
    {
      ...SPECTRAL_WINDOW,
      elementType: "door",
      id: "oitc-schema-bridge-door-01"
    }
  ]
} as const satisfies AirborneContext;

const OITC_OUTPUT = ["OITC"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = ["Rw", "STC", "OITC"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 opening/facade outdoor-indoor OITC metric schema and adapter bridge owner", () => {
  it("lands the input-surface owner and selects its coverage refresh", () => {
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

  it("makes OITC a valid requested output without calculating or aliasing it", () => {
    expect(REQUESTED_OUTPUT_IDS).toContain("OITC");
    expect(() =>
      EstimateRequestSchema.parse({
        airborneContext: OUTDOOR_FACADE_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: OITC_OUTPUT
      })
    ).not.toThrow();

    const result = calculate(OUTDOOR_FACADE_CONTEXT, OITC_OUTPUT);

    expect(result.targetOutputs).toEqual(["OITC"]);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(result.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["unsupportedOutputs:OITC"])
    );
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING,
        POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING
      ])
    );
  });

  it("keeps missing facade/OITC context as needs_input and indoor partitions as unsupported", () => {
    const missing = calculate(MISSING_FACADE_CONTEXT, OITC_OUTPUT);
    const indoor = calculate(INDOOR_PARTITION_CONTEXT, OITC_OUTPUT);

    expect(missing.supportedTargetOutputs).toEqual([]);
    expect(missing.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(missing.airborneBasis).toMatchObject({
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

    expect(indoor.supportedTargetOutputs).toEqual([]);
    expect(indoor.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(indoor.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
  });

  it("keeps lab companions independent in mixed requests while OITC remains unsupported", () => {
    const mixed = calculate(OUTDOOR_FACADE_CONTEXT, MIXED_OUTPUTS);

    expect(mixed.targetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.supportedTargetOutputs).not.toContain("OITC");
    expect(mixed.unsupportedTargetOutputs).toContain("OITC");
    expect(mixed.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
  });

  it("keeps active docs and current gate synchronized with the owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("newRequestedTargetOutputs: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("OITC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
