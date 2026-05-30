import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_FILE,
  POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTION_STATUS
} from "./post-v1-wall-flat-multicavity-building-physics-gate-aj";
import {
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_LANDED_GATE,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTION_STATUS,
  POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_AST_DISABLE_OUTPUTS,
  POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_VALUE_PINS
} from "./post-v1-floor-bound-low-frequency-field-companion-gate-ak";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const EXPLICIT_LOW_FREQUENCY_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS = [
  ...POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_SUPPORTED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function calculateGeneratedCase(
  id: string,
  targetOutputs: readonly RequestedOutputId[],
  impactFieldContext: ImpactFieldContext = EXPLICIT_LOW_FREQUENCY_FIELD_CONTEXT
) {
  const testCase = generatedCase(id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    impactFieldContext,
    targetOutputs
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor bound low-frequency field companion Gate AK", () => {
  it("calculates L'nT,50 upper-bound companions for complete bound floor field requests", () => {
    const result = calculateGeneratedCase("floor-open-web-bound", FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS);

    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact).toMatchObject({
      LPrimeNT50UpperBound: 55.2,
      LPrimeNTwUpperBound: 51.2,
      LPrimeNWUpperBound: 54,
      LnWUpperBound: 51,
      basis: "mixed_bound_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.lowerBoundImpact?.notes).toContain(
      "Live field-side upper bound carried L'nT,50 <= 55.2 dB from explicit CI,50-2500."
    );
    expect(result.supportedTargetOutputs).toEqual([...FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.warnings.join("\n")).not.toContain("L'nT,50. DynEcho kept");
  });

  it("extends the same low-frequency bound formula across selected official and interpolated bound steel floor families", () => {
    for (const pin of POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_VALUE_PINS) {
      const result = calculateGeneratedCase(pin.caseId, FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS);

      expect(result.lowerBoundImpact?.LPrimeNTwUpperBound, `${pin.caseId} L'nT,w`).toBe(
        pin.lPrimeNTwUpperBound
      );
      expect(result.lowerBoundImpact?.LPrimeNT50UpperBound, `${pin.caseId} L'nT,50`).toBe(
        pin.lPrimeNT50UpperBound
      );
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([...FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([]);
    }
  });

  it("asks for the low-frequency owner instead of guessing L'nT,50 when CI,50-2500 is missing", () => {
    const result = calculateGeneratedCase("floor-open-web-bound", ["L'nT,50"], {
      fieldKDb: 3,
      receivingRoomVolumeM3: 60
    });

    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBe(51.2);
    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
  });

  it("keeps partial bound field support live while leaving only missing L'nT,50 explicit", () => {
    const result = calculateGeneratedCase("floor-open-web-bound", FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS, {
      fieldKDb: 3,
      receivingRoomVolumeM3: 60
    });

    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBe(51.2);
    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("does not open ASTM IIC or AIIC aliases while adding the ISO low-frequency bound companion", () => {
    const result = calculateGeneratedCase("floor-open-web-bound", [
      ...FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS,
      ...POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_AST_DISABLE_OUTPUTS
    ]);

    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(55.2);
    expect(result.supportedTargetOutputs).toEqual([...FLOOR_BOUND_LOW_FREQUENCY_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_AST_DISABLE_OUTPUTS
    ]);
    expect(result.warnings.join("\n")).toContain(
      "Some requested impact sound outputs are still unavailable for the current input/path: IIC, AIIC"
    );
  });

  it("consumes Gate AJ and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTION_STATUS).toBe(
      "post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ak_plan"
    );
    expect(POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ak-contract.test.ts"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_LANDED_GATE).toBe(
      "post_v1_floor_bound_low_frequency_field_companion_gate_ak_plan"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTION_STATUS).toBe(
      "post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_al_plan"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-al-contract.test.ts"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AL"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-bound-low-frequency-field-companion-gate-ak-contract.test.ts"
    );
  });
});
