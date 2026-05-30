import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_LANDED_GATE,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTION_STATUS,
  POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN,
  POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS
} from "./post-v1-floor-explicit-ci-local-guide-gate-an";
import {
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTION_STATUS
} from "./post-v1-floor-local-guide-input-surface-gate-am";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXPLICIT_CI_LOCAL_GUIDE_CONTEXT = {
  ciDb: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.ciDb,
  guideHdDb: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
  guideMassRatio: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio,
  receivingRoomVolumeM3: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS = [
  "CI",
  "Ln,w+CI",
  "L'nT,50",
  "L'n,w",
  "L'nT,w"
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
    impactFieldContext: input.impactFieldContext ?? EXPLICIT_CI_LOCAL_GUIDE_CONTEXT,
    targetOutputs: input.targetOutputs ?? EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor explicit CI local-guide Gate AN", () => {
  it("calculates Ln,w+CI and L'nT,50 from explicit CI across exact, family, and fallback floor lanes", () => {
    for (const pin of POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS) {
      const result = calculateGeneratedCase({ id: pin.caseId });

      expect(result.impact, pin.caseId).toMatchObject({
        CI: pin.ci,
        LPrimeNT50: pin.lPrimeNT50,
        LPrimeNTw: pin.lPrimeNTw,
        LPrimeNW: pin.lPrimeNW,
        LnW: pin.lnW,
        LnWPlusCI: pin.lnWPlusCI,
        basis: pin.basis,
        guideEstimateHdCorrectionDb: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
        guideEstimateHdSource: "explicit_input",
        guideEstimateKCorrectionDb: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
        guideEstimateKSource: "lookup_from_mass_ratio",
        guideEstimateMassRatio: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio,
        guideEstimateMassRatioBracket: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatioBracket,
        guideEstimateProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd",
        guideEstimateReceivingRoomVolumeM3: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.receivingRoomVolumeM3
      });
      expect(result.impact?.metricBasis).toMatchObject({
        CI: "explicit_user_impact_ci_input",
        LPrimeNT50: "estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd",
        LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
      });
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([...EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([]);
      expect(result.acousticAnswerBoundary, pin.caseId).toBeUndefined();
    }
  });

  it("asks for explicit CI when the Ln,w plus K/Hd local-guide branch is otherwise ready", () => {
    const result = calculateGeneratedCase({
      id: "floor-heavy-concrete",
      impactFieldContext: {
        guideHdDb: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
        guideMassRatio: POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["impactFieldContext.ciDb"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'nT,50"]
    });
  });

  it("keeps ASTM IIC and AIIC aliases blocked while opening the ISO local-guide outputs", () => {
    const result = calculateGeneratedCase({
      id: "floor-heavy-concrete",
      targetOutputs: [...EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS, "IIC", "AIIC"]
    });

    expect(result.impact?.LPrimeNT50).toBe(52);
    expect(result.supportedTargetOutputs).toEqual([...EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("consumes Gate AM and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTION_STATUS).toBe(
      "post_v1_floor_local_guide_input_surface_gate_am_landed_selected_next_numeric_coverage_gap_gate_an"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_an_plan"
    );
    expect(POST_V1_FLOOR_LOCAL_GUIDE_INPUT_SURFACE_GATE_AM_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-an-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_LANDED_GATE).toBe(
      "post_v1_floor_explicit_ci_local_guide_gate_an_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci_local_guide_gate_an_landed_selected_next_numeric_coverage_gap_gate_ao"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ao_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ao-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AO"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-explicit-ci-local-guide-gate-an-contract.test.ts"
    );
  });
});
