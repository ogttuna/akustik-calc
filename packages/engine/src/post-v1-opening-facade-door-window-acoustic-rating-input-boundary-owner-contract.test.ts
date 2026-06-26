import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
} from "./company-internal-opening-leak-building-runtime-corridor";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_STATUS,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_FILE
} from "./post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_acoustic_rating_input_boundary_owner";

const OWNER_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN;
const OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md";
const OWNER_STATUS =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_STATUS;
const OWNER_CANDIDATE_ID =
  "opening.facade_door_window_acoustic_rating_input_boundary_owner";

const SELECTED_NEXT_ACTION =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_ACTION;
const SELECTED_NEXT_FILE =
  POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_FILE;
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window acoustic-rating input boundary coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  newNeedsInputRequestShapes: 3,
  requiredPhysicalInputsCaptured: 1,
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

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  elementType: "door",
  frequencyBandSet: "third_octave_100_3150",
  id: "rated-door-acoustic-rating-boundary-01",
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

const BUILDING_CONTEXT = {
  ...BASE_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const MISSING_OPENING_RW_CONTEXT = {
  ...BUILDING_CONTEXT,
  openingLeakElements: [
    {
      ...OPENING,
      elementRwDb: undefined,
      id: "door-missing-rw-boundary-01"
    }
  ]
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

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const C_CTR_OUTPUTS = ["C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS] as const satisfies readonly RequestedOutputId[];
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

describe("post-V1 opening/facade door/window acoustic-rating input boundary owner", () => {
  it("lands the input-boundary owner and selects the coverage refresh", () => {
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

  it("keeps complete opening lab companions and field/building values unchanged", () => {
    const lab = calculate(BUILDING_CONTEXT, LAB_OUTPUTS);
    const fieldBuilding = calculate(BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const cCtr = calculate(BUILDING_CONTEXT, C_CTR_OUTPUTS);

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.3,
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(lab.airborneBasis).toMatchObject({
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(fieldBuilding.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.metrics).toMatchObject({
      estimatedDnADb: 31.1,
      estimatedDnTADb: 31.3,
      estimatedDnTAkDb: 30.4,
      estimatedDnTwDb: 32.1,
      estimatedDnWDb: 31.9,
      estimatedRwPrimeDb: 31.6
    });
    expect(fieldBuilding.airborneBasis).toMatchObject({
      method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(cCtr.supportedTargetOutputs).toEqual([...C_CTR_OUTPUTS]);
    expect(cCtr.unsupportedTargetOutputs).toEqual([]);
    expect(cCtr.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
    );
  });

  it("captures missing openingElementRwDb as needs_input instead of parking behind host-wall or adapter outputs", () => {
    for (const outputs of [LAB_OUTPUTS, C_CTR_OUTPUTS, FIELD_BUILDING_OUTPUTS, MIXED_OUTPUTS]) {
      const result = calculate(MISSING_OPENING_RW_CONTEXT, outputs);

      expect(result.supportedTargetOutputs, outputs.join(",")).toEqual([]);
      expect(result.unsupportedTargetOutputs, outputs.join(",")).toEqual([...outputs]);
      expect(result.airborneBasis).toMatchObject({
        kind: "airborne_needs_input",
        method: POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
        missingPhysicalInputs: ["openingElementRwDb"],
        origin: "needs_input"
      });
      expect(result.airborneBasis?.requiredInputs).toEqual(
        expect.arrayContaining(["openingElementRwDb", `blockedOutputs:${outputs.join(",")}`])
      );
      expect(result.warnings).toContain(
        POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
      );
    }
  });

  it("does not steal older missing-frequency or impact boundaries", () => {
    const missingFrequency = calculate(MISSING_FREQUENCY_CONTEXT, LAB_OUTPUTS);
    const impact = calculate(BUILDING_CONTEXT, IMPACT_OUTPUTS);

    expect(missingFrequency.supportedTargetOutputs).toEqual([]);
    expect(missingFrequency.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFrequency.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      missingPhysicalInputs: ["openingFrequencyBandsOrRatingBasis"],
      origin: "needs_input"
    });
    expect(missingFrequency.warnings).toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
    );
    expect(missingFrequency.warnings).not.toContain(
      POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps active docs and current gate synchronized with the owner handoff", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("openingElementRwDb");
      expect(content, path).toContain("requiredPhysicalInputsCaptured: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
