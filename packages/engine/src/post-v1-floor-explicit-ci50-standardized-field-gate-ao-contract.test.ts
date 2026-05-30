import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD } from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTION_STATUS
} from "./post-v1-floor-explicit-ci-local-guide-gate-an";
import {
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_LANDED_GATE,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTION_STATUS,
  POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN,
  POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_VALUE_PINS
} from "./post-v1-floor-explicit-ci50-standardized-field-gate-ao";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const EXPLICIT_CI50_STANDARDIZED_FIELD_CONTEXT = {
  ci50_2500Db: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.ci50_2500Db,
  fieldKDb: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.explicitKDb,
  receivingRoomVolumeM3: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const EXPLICIT_CI50_STANDARDIZED_FIELD_OUTPUTS = [
  "CI,50-2500",
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
    impactFieldContext: input.impactFieldContext ?? EXPLICIT_CI50_STANDARDIZED_FIELD_CONTEXT,
    targetOutputs: input.targetOutputs ?? EXPLICIT_CI50_STANDARDIZED_FIELD_OUTPUTS
  });
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor explicit CI,50-2500 standardized-field Gate AO", () => {
  it("publishes explicit CI,50-2500 and calculates L'nT,50 across exact, family, and fallback floor lanes", () => {
    for (const pin of POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_VALUE_PINS) {
      const result = calculateGeneratedCase({ id: pin.caseId });

      expect(result.impact, pin.caseId).toMatchObject({
        CI50_2500: pin.ci50_2500,
        LPrimeNT50: pin.lPrimeNT50,
        LPrimeNTw: pin.lPrimeNTw,
        LPrimeNW: pin.lPrimeNW,
        LnW: pin.lnW,
        basis: pin.basis,
        fieldEstimateKCorrectionDb: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.explicitKDb,
        guideEstimateProfile: undefined
      });
      expect(result.impact?.metricBasis).toMatchObject({
        CI50_2500: "explicit_user_impact_ci50_2500_input",
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume"
      });
      expect(result.supportedTargetOutputs, pin.caseId).toEqual([...EXPLICIT_CI50_STANDARDIZED_FIELD_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, pin.caseId).toEqual([]);
      expect(result.acousticAnswerBoundary, pin.caseId).toBeUndefined();
    }
  });

  it("asks for explicit CI,50-2500 when K and receiving-room volume are ready but low-frequency input is absent", () => {
    const result = calculateGeneratedCase({
      id: "floor-heavy-concrete",
      impactFieldContext: {
        fieldKDb: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.explicitKDb,
        receivingRoomVolumeM3: POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN.receivingRoomVolumeM3
      },
      targetOutputs: ["L'nT,50"]
    });

    expect(result.impact?.LPrimeNT50).toBeUndefined();
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

  it("keeps ASTM aliases unsupported while the standardized ISO field values stay live", () => {
    const result = calculateGeneratedCase({
      id: "floor-heavy-concrete",
      targetOutputs: [...EXPLICIT_CI50_STANDARDIZED_FIELD_OUTPUTS, "IIC", "AIIC"]
    });

    expect(result.impact?.LPrimeNT50).toBe(52.2);
    expect(result.supportedTargetOutputs).toEqual([...EXPLICIT_CI50_STANDARDIZED_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("consumes Gate AN and hands off to the next numeric coverage gap", () => {
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci_local_guide_gate_an_landed_selected_next_numeric_coverage_gap_gate_ao"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ao_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ao-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_LANDED_GATE).toBe(
      "post_v1_floor_explicit_ci50_standardized_field_gate_ao_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTION_STATUS).toBe(
      "post_v1_floor_explicit_ci50_standardized_field_gate_ao_landed_selected_next_numeric_coverage_gap_gate_ap"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ap_plan"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ap-contract.test.ts"
    );
    expect(POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AP"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-explicit-ci50-standardized-field-gate-ao-contract.test.ts"
    );
  });
});
