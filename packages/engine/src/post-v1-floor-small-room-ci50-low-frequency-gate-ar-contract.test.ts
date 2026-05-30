import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTION_STATUS
} from "./post-v1-floor-combined-bound-explicit-ci-split-gate-aq";
import {
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_LANDED_GATE,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTION_STATUS,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_BLOCKED_OUTPUTS,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_BLOCKED_OUTPUTS,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN
} from "./post-v1-floor-small-room-ci50-low-frequency-gate-ar";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const UBIQ_CARPET_BOUND_STACK = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const SMALL_ROOM_CI50_CONTEXT = {
  ciDb: POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN.ciDb,
  ci50_2500Db: POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN.ci50_2500Db,
  enableSmallRoomEstimate: POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN.enableSmallRoomEstimate
} as const satisfies ImpactFieldContext;

const SMALL_ROOM_CI50_BOUND_OUTPUTS = [
  ...POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_BLOCKED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const SMALL_ROOM_CI50_LIVE_OUTPUTS = [
  ...POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_BLOCKED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function calculateHeavyConcreteSmallRoomCi50() {
  const testCase = generatedCase("floor-heavy-concrete");

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    impactFieldContext: {
      ci50_2500Db: POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN.ci50_2500Db,
      enableSmallRoomEstimate: POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN.enableSmallRoomEstimate
    },
    targetOutputs: SMALL_ROOM_CI50_LIVE_OUTPUTS
  });
}

function calculateBoundSmallRoomCi50(input?: {
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(UBIQ_CARPET_BOUND_STACK, {
    impactFieldContext: input?.impactFieldContext ?? SMALL_ROOM_CI50_CONTEXT,
    targetOutputs: input?.targetOutputs ?? SMALL_ROOM_CI50_BOUND_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor small-room CI,50-2500 low-frequency Gate AR", () => {
  it("calculates L'nT,50 from the small-room L'nT,w path and explicit CI,50-2500 on live floor lanes", () => {
    const result = calculateHeavyConcreteSmallRoomCi50();

    expect(result.impact).toMatchObject({
      CI50_2500: POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN.ci50_2500,
      LPrimeNT50: POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN.lPrimeNT50,
      LPrimeNTw: POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN.lPrimeNTw,
      LnW: POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN.lnW,
      basis: "mixed_predicted_plus_estimated_tr_small_room_normalization"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_local_guide_tr_small_rooms_lnw_plus_3"
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_BLOCKED_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("calculates bound L'nT,50 from small-room L'nT,w upper bound and explicit CI,50-2500", () => {
    const result = calculateBoundSmallRoomCi50();

    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact).toMatchObject({
      CI: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.ci,
      CI50_2500: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.ci50_2500,
      LPrimeNT50UpperBound: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.lPrimeNT50UpperBound,
      LPrimeNTwUpperBound: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.lPrimeNTwUpperBound,
      LnWPlusCIUpperBound: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.lnWPlusCIUpperBound,
      LnWUpperBound: POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN.lnWUpperBound,
      basis: "mixed_bound_plus_estimated_tr_small_room_normalization"
    });
    expect(result.lowerBoundImpact?.notes.join("\n")).toContain(
      "L'nT,50 upper bound was derived as L'nT,w upper bound + CI,50-2500 using CI,50-2500 = 4 dB."
    );
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_BLOCKED_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("does not open field K output or ASTM aliases from the small-room CI,50-2500 continuation", () => {
    const result = calculateBoundSmallRoomCi50();

    expect(result.lowerBoundImpact?.LPrimeNWUpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC", "AIIC"]);
  });

  it("consumes Gate AQ and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTION_STATUS).toBe(
      "post_v1_floor_combined_bound_explicit_ci_split_gate_aq_landed_selected_next_numeric_coverage_gap_gate_ar"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ar_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ar-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_LANDED_GATE).toBe(
      "post_v1_floor_small_room_ci50_low_frequency_gate_ar_plan"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTION_STATUS).toBe(
      "post_v1_floor_small_room_ci50_low_frequency_gate_ar_landed_selected_next_numeric_coverage_gap_gate_as"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_as_plan"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-as-contract.test.ts"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AS"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-small-room-ci50-low-frequency-gate-ar-contract.test.ts");
  });
});
