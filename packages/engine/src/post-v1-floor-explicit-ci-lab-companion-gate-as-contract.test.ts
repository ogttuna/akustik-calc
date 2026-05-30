import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_LANDED_GATE,
  POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTION_STATUS,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BLOCKED_OUTPUTS,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BOUND_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BOUND_VALUE_PINS,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_INPUT_PIN,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_LIVE_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_LIVE_VALUE_PINS
} from "./post-v1-floor-explicit-ci-lab-companion-gate-as";
import {
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTION_STATUS
} from "./post-v1-floor-small-room-ci50-low-frequency-gate-ar";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXPLICIT_CI_LAB_COMPANION_CONTEXT = {
  ciDb: POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_INPUT_PIN.ciDb
} as const satisfies ImpactFieldContext;

const EXPLICIT_CI_LAB_COMPANION_OUTPUTS = [
  ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_LIVE_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BLOCKED_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function calculateGeneratedCase(input: {
  id: string;
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  const testCase = generatedCase(input.id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    impactFieldContext: input.impactFieldContext ?? EXPLICIT_CI_LAB_COMPANION_CONTEXT,
    targetOutputs: input.targetOutputs ?? EXPLICIT_CI_LAB_COMPANION_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor explicit CI lab companion Gate AS", () => {
  it("calculates CI and Ln,w+CI from explicit CI without requiring field-guide inputs on live floor lanes", () => {
    for (const pin of POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_LIVE_VALUE_PINS) {
      const result = calculateGeneratedCase({ id: pin.caseId });

      expect(result.impact, pin.caseId).toMatchObject({
        CI: pin.ci,
        LnW: pin.lnW,
        LnWPlusCI: pin.lnWPlusCI,
        basis: pin.basis
      });
      expect(result.impact?.metricBasis, pin.caseId).toMatchObject({
        CI: "explicit_user_impact_ci_input",
        LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
      });
      expect(result.impact?.LPrimeNW, pin.caseId).toBeUndefined();
      expect(result.impact?.LPrimeNTw, pin.caseId).toBeUndefined();
      expect(result.impact?.LPrimeNT50, pin.caseId).toBeUndefined();
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_LIVE_SUPPORTED_OUTPUTS
      ]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BLOCKED_OUTPUTS
      ]);
      expect(result.acousticAnswerBoundary, pin.caseId).toBeUndefined();
    }
  });

  it("calculates CI and Ln,w+CI upper bound from explicit CI on bound-only floor lanes", () => {
    for (const pin of POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BOUND_VALUE_PINS) {
      const result = calculateGeneratedCase({ id: pin.caseId });

      expect(result.impact, pin.caseId).toBeNull();
      expect(result.lowerBoundImpact, pin.caseId).toMatchObject({
        CI: pin.ci,
        LnWPlusCIUpperBound: pin.lnWPlusCIUpperBound,
        LnWUpperBound: pin.lnWUpperBound,
        basis: pin.basis
      });
      expect(result.lowerBoundImpact?.LPrimeNWUpperBound, pin.caseId).toBeUndefined();
      expect(result.lowerBoundImpact?.LPrimeNTwUpperBound, pin.caseId).toBeUndefined();
      expect(result.lowerBoundImpact?.LPrimeNT50UpperBound, pin.caseId).toBeUndefined();
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BOUND_SUPPORTED_OUTPUTS
      ]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AS_EXPLICIT_CI_LAB_COMPANION_BLOCKED_OUTPUTS
      ]);
      expect(result.acousticAnswerBoundary, pin.caseId).toBeUndefined();
    }
  });

  it("keeps CI and Ln,w+CI closed without explicit CI and does not open field or ASTM outputs", () => {
    const result = calculateGeneratedCase({
      id: "floor-heavy-concrete",
      impactFieldContext: {},
      targetOutputs: ["CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]
    });

    expect(result.impact?.CI).toBeUndefined();
    expect(result.impact?.LnWPlusCI).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([
      "CI",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      "IIC",
      "AIIC"
    ]);
  });

  it("consumes Gate AR and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTION_STATUS).toBe(
      "post_v1_floor_small_room_ci50_low_frequency_gate_ar_landed_selected_next_numeric_coverage_gap_gate_as"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_as_plan"
    );
    expect(POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-as-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_LANDED_GATE).toBe(
      "post_v1_floor_explicit_ci_lab_companion_gate_as_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci_lab_companion_gate_as_landed_selected_next_numeric_coverage_gap_gate_at"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_at_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-at-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LAB_COMPANION_GATE_AS_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AT"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-explicit-ci-lab-companion-gate-as-contract.test.ts");
  });
});
