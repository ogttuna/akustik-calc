import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_LANDED_GATE,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTION_STATUS,
  POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_BLOCKED_OUTPUTS,
  POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN,
  POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS,
  POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS
} from "./post-v1-floor-bound-explicit-ci-local-guide-gate-ap";
import {
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTION_STATUS
} from "./post-v1-floor-explicit-ci50-standardized-field-gate-ao";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BOUND_EXPLICIT_CI_LOCAL_GUIDE_CONTEXT = {
  ciDb: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.ciDb,
  guideHdDb: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
  guideMassRatio: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio
} as const satisfies ImpactFieldContext;

const BOUND_EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS = [
  ...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS,
  ...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_BLOCKED_OUTPUTS
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
    impactFieldContext: input.impactFieldContext ?? BOUND_EXPLICIT_CI_LOCAL_GUIDE_CONTEXT,
    targetOutputs: input.targetOutputs ?? BOUND_EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor bound explicit CI local-guide Gate AP", () => {
  it("calculates bound CI, Ln,w+CI, and L'nT,50 from explicit CI across selected bound floor lanes", () => {
    for (const pin of POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS) {
      const result = calculateGeneratedCase({ id: pin.caseId });

      expect(result.impact, pin.caseId).toBeNull();
      expect(result.lowerBoundImpact, pin.caseId).toMatchObject({
        CI: pin.ci,
        LPrimeNT50UpperBound: pin.lPrimeNT50UpperBound,
        LPrimeNWUpperBound: pin.lPrimeNWUpperBound,
        LnWPlusCIUpperBound: pin.lnWPlusCIUpperBound,
        LnWUpperBound: pin.lnWUpperBound,
        basis: "mixed_bound_plus_estimated_local_guide",
        guideEstimateHdCorrectionDb: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
        guideEstimateHdSource: "explicit_input",
        guideEstimateKCorrectionDb: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitKDb,
        guideEstimateKSource: "lookup_from_mass_ratio",
        guideEstimateMassRatio: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio,
        guideEstimateMassRatioBracket: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatioBracket,
        guideEstimateProfile: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd"
      });
      expect(result.lowerBoundImpact?.notes.join("\n"), pin.caseId).toContain(
        "Ln,w+CI upper bound was derived as Ln,w upper bound + CI from the current bound-only lane."
      );
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS
      ]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([
        ...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_BLOCKED_OUTPUTS
      ]);
      expect(result.acousticAnswerBoundary, pin.caseId).toBeUndefined();
    }
  });

  it("asks for explicit CI when a bound Ln,w plus K/Hd local-guide branch is otherwise ready", () => {
    const result = calculateGeneratedCase({
      id: "floor-open-web-bound",
      impactFieldContext: {
        guideHdDb: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.explicitHdDb,
        guideMassRatio: POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN.guideMassRatio
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(result.lowerBoundImpact?.LPrimeNT50UpperBound).toBeUndefined();
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

  it("keeps resolver pins on the bound local-guide path and does not open ASTM aliases", () => {
    const supportedOnly = calculateGeneratedCase({
      id: "floor-open-web-bound",
      targetOutputs: [...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS]
    });

    expect(supportedOnly.lowerBoundImpact).toMatchObject({
      CI: -1,
      LPrimeNT50UpperBound: 53,
      LnWPlusCIUpperBound: 50
    });
    expect(supportedOnly.dynamicImpactTrace?.availableMetricLabels).toEqual([
      "Ln,w upper bound",
      "CI",
      "Ln,w+CI upper bound",
      "L'n,w upper bound",
      "L'nT,50 upper bound"
    ]);

    const withBlockedAliases = calculateGeneratedCase({
      id: "floor-open-web-bound",
      targetOutputs: [
        ...BOUND_EXPLICIT_CI_LOCAL_GUIDE_OUTPUTS,
        "CI,50-2500"
      ]
    });

    expect(withBlockedAliases.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS
    ]);
    expect(withBlockedAliases.unsupportedTargetOutputs).toEqual([
      "L'nT,w",
      "IIC",
      "AIIC",
      "CI,50-2500"
    ]);
  });

  it("consumes Gate AO and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci50_standardized_field_gate_ao_landed_selected_next_numeric_coverage_gap_gate_ap"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ap_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ap-contract.test.ts"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_LANDED_GATE).toBe(
      "post_v1_floor_bound_explicit_ci_local_guide_gate_ap_plan"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTION_STATUS).toBe(
      "post_v1_floor_bound_explicit_ci_local_guide_gate_ap_landed_selected_next_numeric_coverage_gap_gate_aq"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_aq_plan"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aq-contract.test.ts"
    );
    expect(POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AQ"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-bound-explicit-ci-local-guide-gate-ap-contract.test.ts"
    );
  });
});
