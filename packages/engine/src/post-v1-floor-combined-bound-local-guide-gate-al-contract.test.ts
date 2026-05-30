import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTION_STATUS
} from "./post-v1-floor-bound-low-frequency-field-companion-gate-ak";
import {
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_LANDED_GATE,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTION_STATUS,
  POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_BLOCKED_SPLIT_OUTPUTS,
  POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID,
  POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN
} from "./post-v1-floor-combined-bound-local-guide-gate-al";

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

const LOCAL_GUIDE_FIELD_CONTEXT = {
  fieldKDb: POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN.fieldKDb,
  receivingRoomVolumeM3: POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const GATE_AL_TARGET_OUTPUTS = [
  ...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_BLOCKED_SPLIT_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function calculateGateAl(input?: {
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(UBIQ_CARPET_BOUND_STACK, {
    impactFieldContext: input?.impactFieldContext ?? LOCAL_GUIDE_FIELD_CONTEXT,
    targetOutputs: input?.targetOutputs ?? GATE_AL_TARGET_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor combined bound local-guide Gate AL", () => {
  it("calculates L'nT,50 upper bounds from source-owned Ln,w+CI bound plus K and Hd", () => {
    const result = calculateGateAl();

    expect(result.boundFloorSystemMatch?.system.id).toBe(POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID);
    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact).toMatchObject({
      LPrimeNT50UpperBound: POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN.lPrimeNT50UpperBound,
      LnWPlusCIUpperBound: POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN.lnWPlusCIUpperBound,
      basis: "mixed_bound_plus_estimated_local_guide"
    });
    expect(result.lowerBoundImpact?.LPrimeNWUpperBound).toBeUndefined();
    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBeUndefined();
    expect(result.lowerBoundImpact?.notes.join("\n")).toContain(
      "Live field-side upper bound carried L'nT,50 <= 48.0 dB from source Ln,w+CI bound, K, and Hd."
    );
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_BLOCKED_SPLIT_OUTPUTS
    ]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("keeps split impact outputs blocked instead of fabricating Ln,w, CI, L'n,w, or L'nT,w", () => {
    const result = calculateGateAl({
      targetOutputs: [
        "Ln,w",
        "CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]
    });

    expect(result.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(48);
    expect(result.supportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "L'n,w", "L'nT,w"]);
    expect(result.warnings.join("\n")).toContain(
      "Curated combined Ln,w+CI bound support is being carried through K and Hd without fabricating split Ln,w or CI."
    );
  });

  it("asks for the missing field-side K owner when the local-guide path is incomplete", () => {
    const result = calculateGateAl({
      impactFieldContext: {
        receivingRoomVolumeM3: POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_VALUE_PIN.receivingRoomVolumeM3
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["impactFieldContext"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
  });

  it("does not open ASTM IIC or AIIC aliases from the combined bound local-guide result", () => {
    const result = calculateGateAl({
      targetOutputs: [
        ...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SUPPORTED_OUTPUTS,
        "IIC",
        "AIIC"
      ]
    });

    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBe(48);
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("consumes Gate AK and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTION_STATUS).toBe(
      "post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_al_plan"
    );
    expect(POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-al-contract.test.ts"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_LANDED_GATE).toBe(
      "post_v1_floor_combined_bound_local_guide_gate_al_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTION_STATUS).toBe(
      "post_v1_floor_combined_bound_local_guide_gate_al_landed_selected_next_numeric_coverage_gap_gate_am"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_am_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-am-contract.test.ts"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_LOCAL_GUIDE_GATE_AL_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AM"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-combined-bound-local-guide-gate-al-contract.test.ts"
    );
  });
});
