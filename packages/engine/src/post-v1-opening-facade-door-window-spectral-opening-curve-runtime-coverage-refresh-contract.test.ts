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
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_STATUS;
const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_spectral_opening_curve_runtime_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after opening/facade door/window spectral opening-curve runtime coverage refresh";

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

const FREQUENCIES_HZ = [
  63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000,
  1250, 1600, 2000, 2500, 3150, 4000
] as const;

const OPENING_TRANSMISSION_LOSS_DB = [
  18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48
] as const;

const BASE_SPECTRAL_OPENING = {
  areaM2: 1.8,
  count: 1,
  elementTransmissionLossCurve: {
    frequenciesHz: [...FREQUENCIES_HZ],
    transmissionLossDb: [...OPENING_TRANSMISSION_LOSS_DB]
  },
  frequencyBandSet: "third_octave_100_3150",
  origin: "catalogued",
  ratingBasis: "iso_717_1_curve",
  sealLeakageClass: "average"
} as const;

const SPECTRAL_OPENING_VARIANTS = [
  {
    ...BASE_SPECTRAL_OPENING,
    elementType: "door",
    id: "spectral-door-runtime-refresh-01"
  },
  {
    ...BASE_SPECTRAL_OPENING,
    elementType: "window",
    id: "spectral-window-runtime-refresh-01"
  },
  {
    ...BASE_SPECTRAL_OPENING,
    elementType: "facade_element",
    id: "spectral-facade-runtime-refresh-01"
  }
] as const satisfies readonly NonNullable<AirborneContext["openingLeakElements"]>[number][];

const SPECTRAL_OPENING = SPECTRAL_OPENING_VARIANTS[0];

const SCALAR_OPENING = {
  ...SPECTRAL_OPENING,
  elementRwDb: 32,
  elementTransmissionLossCurve: undefined,
  id: "scalar-door-runtime-refresh-01",
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

const SPECTRAL_FIELD_CONTEXT = {
  ...BASE_CONTEXT,
  contextMode: "field_between_rooms"
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
      id: "missing-door-rating-runtime-refresh-01"
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

function spectralLabContextFor(
  opening: NonNullable<AirborneContext["openingLeakElements"]>[number]
): AirborneContext {
  return {
    ...SPECTRAL_LAB_CONTEXT,
    openingLeakElements: [opening]
  };
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

describe("post-V1 opening/facade door/window spectral opening-curve runtime coverage refresh", () => {
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

  it("re-probes door, window, and facade spectral lab values without moving runtime", () => {
    for (const opening of SPECTRAL_OPENING_VARIANTS) {
      const result = calculate(spectralLabContextFor(opening), LAB_OUTPUTS);

      expect(result.supportedTargetOutputs, opening.elementType).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, opening.elementType).toEqual([]);
      expect(result.metrics, opening.elementType).toMatchObject({
        estimatedCDb: -1.3,
        estimatedCtrDb: -5.9,
        estimatedRwDb: 46,
        estimatedStc: 46
      });
      expect(result.airborneBasis, opening.elementType).toMatchObject({
        curveBasis: "calculated_frequency_curve",
        method: POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD,
        origin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.requiredInputs, opening.elementType).toContain(
        "openingElementTransmissionLossCurve"
      );
      expect(result.warnings, opening.elementType).toContain(
        POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING
      );
    }
  });

  it("keeps spectral lab support request-scoped across opened partial target output sets", () => {
    const cases = [
      {
        expectedMetric: { estimatedRwDb: 46 },
        outputs: ["Rw"]
      },
      {
        expectedMetric: { estimatedStc: 46 },
        outputs: ["STC"]
      },
      {
        expectedMetric: { estimatedCDb: -1.3, estimatedCtrDb: -5.9, estimatedRwDb: 46 },
        outputs: ["Rw", "C", "Ctr"]
      }
    ] as const satisfies readonly {
      readonly expectedMetric: Record<string, number>;
      readonly outputs: readonly RequestedOutputId[];
    }[];

    for (const testCase of cases) {
      const result = calculate(SPECTRAL_LAB_CONTEXT, testCase.outputs);

      expect(result.supportedTargetOutputs, testCase.outputs.join(",")).toEqual([
        ...testCase.outputs
      ]);
      expect(result.unsupportedTargetOutputs, testCase.outputs.join(",")).toEqual([]);
      expect(result.metrics, testCase.outputs.join(",")).toMatchObject(testCase.expectedMetric);
      expect(result.airborneBasis?.method, testCase.outputs.join(",")).toBe(
        POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD
      );
    }
  });

  it("keeps spectral C/Ctr-only lab requests outside this no-runtime refresh", () => {
    const result = calculate(SPECTRAL_LAB_CONTEXT, ["C", "Ctr"]);

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["C", "Ctr"]);
  });

  it("hands curve-only field/building outputs to the landed spectral adapter", () => {
    for (const context of [SPECTRAL_FIELD_CONTEXT, SPECTRAL_BUILDING_CONTEXT]) {
      const result = calculate(context, FIELD_BUILDING_OUTPUTS);

      expect(result.supportedTargetOutputs, context.contextMode).toEqual(
        context.contextMode === "building_prediction"
          ? [...FIELD_BUILDING_OUTPUTS]
          : ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
      );
      expect(result.unsupportedTargetOutputs, context.contextMode).toEqual(
        context.contextMode === "building_prediction" ? [] : ["DnT,A,k"]
      );
      expect(result.airborneBasis, context.contextMode).toMatchObject({
        curveBasis: "calculated_frequency_curve",
        method: COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_METHOD,
        origin: "family_physics_prediction"
      });
      expect(result.warnings, context.contextMode).toContain(
        COMPANY_INTERNAL_OPENING_LEAK_SPECTRAL_FIELD_BUILDING_RUNTIME_WARNING
      );
      expect(result.warnings, context.contextMode).not.toContain(
        POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
      );
    }
  });

  it("preserves scalar opening values and the missing-rating needs_input boundary", () => {
    const scalar = calculate(SCALAR_BUILDING_CONTEXT, LAB_OUTPUTS);
    expect(scalar.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.3,
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(scalar.airborneBasis?.method).not.toBe(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD
    );

    const missing = calculate(MISSING_RATING_CONTEXT, LAB_OUTPUTS);
    expect(missing.supportedTargetOutputs).toEqual([]);
    expect(missing.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missing.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
      missingPhysicalInputs: ["openingElementRwDb"],
      origin: "needs_input"
    });
    expect(missing.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["openingElementRwDb", `blockedOutputs:${LAB_OUTPUTS.join(",")}`])
    );
    expect(missing.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
    );
  });

  it("keeps docs and current-gate runner aligned with the refresh handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

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
      expect(content, path).toContain("openingElementTransmissionLossCurve");
      expect(content, path).toContain("spectral field/building adapter");
      expect(content, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
