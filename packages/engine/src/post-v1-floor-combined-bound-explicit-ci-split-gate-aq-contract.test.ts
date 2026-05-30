import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTION_STATUS
} from "./post-v1-floor-bound-explicit-ci-local-guide-gate-ap";
import {
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_LANDED_GATE,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTION_STATUS,
  POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_BLOCKED_OUTPUTS,
  POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN,
  POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN
} from "./post-v1-floor-combined-bound-explicit-ci-split-gate-aq";
import {
  POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID
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

const COMBINED_BOUND_EXPLICIT_CI_CONTEXT = {
  ciDb: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN.ciDb,
  fieldKDb: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN.fieldKDb,
  receivingRoomVolumeM3: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const COMBINED_BOUND_EXPLICIT_CI_OUTPUTS = [
  ...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_BLOCKED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function calculateGateAq(input?: {
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(UBIQ_CARPET_BOUND_STACK, {
    impactFieldContext: input?.impactFieldContext ?? COMBINED_BOUND_EXPLICIT_CI_CONTEXT,
    targetOutputs: input?.targetOutputs ?? COMBINED_BOUND_EXPLICIT_CI_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor combined-bound explicit CI split Gate AQ", () => {
  it("derives split Ln,w, CI, field, and low-frequency upper-bound outputs from a combined Ln,w+CI bound", () => {
    const result = calculateGateAq();

    expect(result.boundFloorSystemMatch?.system.id).toBe(POST_V1_GATE_AL_COMBINED_BOUND_LOCAL_GUIDE_SYSTEM_ID);
    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact).toMatchObject({
      CI: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.ci,
      LPrimeNT50UpperBound: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.lPrimeNT50UpperBound,
      LPrimeNTwUpperBound: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.lPrimeNTwUpperBound,
      LPrimeNWUpperBound: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.lPrimeNWUpperBound,
      LnWPlusCIUpperBound: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.lnWPlusCIUpperBound,
      LnWUpperBound: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN.lnWUpperBound,
      basis: "mixed_bound_plus_estimated_local_guide"
    });
    expect(result.lowerBoundImpact?.notes.join("\n")).toContain(
      "Ln,w upper bound was derived as Ln,w+CI upper bound - explicit CI from the current bound-only lane."
    );
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_BLOCKED_OUTPUTS]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
  });

  it("keeps the split path closed without explicit CI and does not fabricate the requested split values", () => {
    const result = calculateGateAq({
      impactFieldContext: {
        fieldKDb: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN.fieldKDb,
        receivingRoomVolumeM3: POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN.receivingRoomVolumeM3
      },
      targetOutputs: [...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS]
    });

    expect(result.lowerBoundImpact).toMatchObject({
      LPrimeNT50UpperBound: 48,
      LnWPlusCIUpperBound: 45,
      LnWUpperBound: undefined
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w+CI", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "L'n,w", "L'nT,w"]);
  });

  it("does not open CI,50-2500 or ASTM aliases from the explicit CI split derivation", () => {
    const result = calculateGateAq();

    expect(result.lowerBoundImpact?.CI50_2500).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["CI,50-2500", "IIC", "AIIC"]);
  });

  it("consumes Gate AP and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTION_STATUS).toBe(
      "post_v1_floor_bound_explicit_ci_local_guide_gate_ap_landed_selected_next_numeric_coverage_gap_gate_aq"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aq_plan"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aq-contract.test.ts"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_LANDED_GATE).toBe(
      "post_v1_floor_combined_bound_explicit_ci_split_gate_aq_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTION_STATUS).toBe(
      "post_v1_floor_combined_bound_explicit_ci_split_gate_aq_landed_selected_next_numeric_coverage_gap_gate_ar"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ar_plan"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ar-contract.test.ts"
    );
    expect(POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AR"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-combined-bound-explicit-ci-split-gate-aq-contract.test.ts"
    );
  });
});
