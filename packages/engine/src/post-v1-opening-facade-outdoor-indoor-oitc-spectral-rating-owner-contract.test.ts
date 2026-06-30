import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { computeAstmE1332OitcFromCurve } from "./oitc-rating";
import {
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_STATUS,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_WARNING,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner";
import {
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING
} from "./post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION = POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md";
const OWNER_STATUS = POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_STATUS;
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 1,
  requiredPhysicalInputsCaptured: 4,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 1,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 7
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

const OITC_WINDOW = {
  areaM2: 1.8,
  count: 1,
  elementTransmissionLossCurve: {
    frequenciesHz: [...FREQUENCIES_HZ],
    transmissionLossDb: [...OPENING_TRANSMISSION_LOSS_DB]
  },
  elementType: "window",
  frequencyBandSet: "one_third_octave_80_4000",
  id: "oitc-spectral-window-01",
  origin: "catalogued",
  ratingBasis: "iso_717_1_curve",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const COMPLETE_OITC_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  facadeOutdoorContext: "outdoor_indoor_facade",
  flankingJunctionClass: "rigid_t_junction",
  frequencyBandSet: "one_third_octave_80_4000",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [OITC_WINDOW],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const MISSING_OITC_BAND_CONTEXT = {
  ...COMPLETE_OITC_CONTEXT,
  frequencyBandSet: undefined
} as const satisfies AirborneContext;

const LEGACY_ISO_BAND_CONTEXT = {
  ...COMPLETE_OITC_CONTEXT,
  frequencyBandSet: "third_octave_100_3150",
  openingLeakElements: [
    {
      ...OITC_WINDOW,
      frequencyBandSet: "third_octave_100_3150"
    }
  ]
} as const satisfies AirborneContext;

const INDOOR_PARTITION_CONTEXT = {
  ...COMPLETE_OITC_CONTEXT,
  facadeOutdoorContext: "indoor_partition",
  openingLeakElements: [
    {
      ...OITC_WINDOW,
      elementType: "door",
      id: "oitc-spectral-door-01"
    }
  ]
} as const satisfies AirborneContext;

const OITC_OUTPUT = ["OITC"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = ["Rw", "STC", "OITC", "NISR", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
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

describe("post-V1 opening/facade outdoor-indoor OITC spectral rating owner", () => {
  it("lands the runtime owner and selects its coverage refresh", () => {
    expect({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      selectedCandidateId: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    }).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [PREVIOUS_RERANK_FILE, OWNER_FILE, OWNER_PLAN_DOC, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the ASTM E1332 OITC rating math to the required outdoor-indoor band set", () => {
    const directOpeningRating = computeAstmE1332OitcFromCurve(OITC_WINDOW.elementTransmissionLossCurve);
    const legacyIsoBandRating = computeAstmE1332OitcFromCurve({
      frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      transmissionLossDb: OPENING_TRANSMISSION_LOSS_DB.slice(2, 18)
    });

    expect(directOpeningRating).toMatchObject({
      OITC: 32,
      bandSet: "one_third_octave_80_4000",
      outdoorAWeightedLevelDb: 100.13
    });
    expect(legacyIsoBandRating).toBeNull();
  });

  it("calculates OITC from the owned outdoor-indoor spectral facade route without aliasing Rw or STC", () => {
    expect(() =>
      EstimateRequestSchema.parse({
        airborneContext: COMPLETE_OITC_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: OITC_OUTPUT
      })
    ).not.toThrow();

    const result = calculate(COMPLETE_OITC_CONTEXT, OITC_OUTPUT);

    expect(result.targetOutputs).toEqual(["OITC"]);
    expect(result.supportedTargetOutputs).toEqual(["OITC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedOitcDb).toBe(result.ratings.astmE1332?.OITC);
    expect(result.ratings.astmE1332).toMatchObject({
      bandSet: "one_third_octave_80_4000",
      estimated: true
    });
    expect(result.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ASTM E1332"
    });
    expect(result.ratingAdapterBasisSet).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          adapterId: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
          inputBasis: "outdoor_indoor_transmission_loss_curve",
          metricId: "OITC",
          ratingStandard: "ASTM E1332"
        })
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      route: "wall",
      selectedCandidateId: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["OITC"]
    });
    expect(result.layerCombinationResolverTrace?.valuePins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "OITC",
          value: result.metrics.estimatedOitcDb
        })
      ])
    );
    expect(result.warnings).toContain(POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_WARNING);
    expect(result.warnings).not.toContain(
      POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING
    );
  });

  it("returns needs_input for missing OITC bands and leaves legacy ISO-band, indoor, and alias requests blocked", () => {
    const missingBands = calculate(MISSING_OITC_BAND_CONTEXT, OITC_OUTPUT);
    const legacyIsoBand = calculate(LEGACY_ISO_BAND_CONTEXT, OITC_OUTPUT);
    const indoor = calculate(INDOOR_PARTITION_CONTEXT, OITC_OUTPUT);
    const mixed = calculate(COMPLETE_OITC_CONTEXT, MIXED_OUTPUTS);

    expect(missingBands.supportedTargetOutputs).toEqual([]);
    expect(missingBands.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(missingBands.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD,
      missingPhysicalInputs: ["frequencyBandSet=one_third_octave_80_4000"],
      origin: "needs_input"
    });

    expect(legacyIsoBand.supportedTargetOutputs).toEqual([]);
    expect(legacyIsoBand.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(legacyIsoBand.airborneBasis?.method).not.toBe(
      POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD
    );

    expect(indoor.supportedTargetOutputs).toEqual([]);
    expect(indoor.unsupportedTargetOutputs).toEqual(["OITC"]);

    expect(mixed.supportedTargetOutputs).toEqual(["OITC"]);
    expect(mixed.unsupportedTargetOutputs).toEqual(["Rw", "STC", "NISR", "DnT,w"]);
    expect(mixed.ratingAdapterBasisSet?.find((basis) => basis.metricId === "OITC")?.aliasBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fromMetricId: "Rw", toMetricId: "OITC" }),
        expect.objectContaining({ fromMetricId: "STC", toMetricId: "OITC" }),
        expect.objectContaining({ fromMetricId: "NISR", toMetricId: "OITC" }),
        expect.objectContaining({ fromMetricId: "DnT,w", toMetricId: "OITC" })
      ])
    );
  });

  it("keeps active docs and current gate synchronized with the OITC spectral owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 1");
      expect(content, path).toContain("OITC");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
