import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_FILE,
  POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTION_STATUS
} from "./post-v1-wall-lined-massive-rw-companion-gate-aa";
import {
  POST_V1_GATE_AB_WALL_SCREENING_RW_OUTPUTS,
  POST_V1_GATE_AB_WALL_SCREENING_RW_VALUE_PINS,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_LANDED_GATE,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_ACTION,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_FILE,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_LABEL,
  POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTION_STATUS
} from "./post-v1-wall-screening-rw-field-companion-gate-ab";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FIELD_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall screening Rw field companion Gate AB", () => {
  it("keeps screening wall Rw live on complete masonry field requests", () => {
    const testCase = generatedCase("wall-masonry-brick");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.2,
      estimatedCtrDb: -4.7,
      estimatedDnADb: 39.8,
      estimatedDnTADb: 41.3,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwDb: 40,
      estimatedRwPrimeDb: 40,
      estimatedStc: 40
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      method: "screening_mass_law_curve_seed_v3",
      origin: "screening_fallback"
    });
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
  });

  it("keeps screening wall Rw live on complete laminated CLT field requests", () => {
    const testCase = generatedCase("wall-clt-local");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.8,
      estimatedCtrDb: -7.6,
      estimatedDnADb: 39.2,
      estimatedDnTADb: 40.7,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 41,
      estimatedRwDb: 41,
      estimatedRwPrimeDb: 41,
      estimatedStc: 41
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    for (const pin of POST_V1_GATE_AB_WALL_SCREENING_RW_VALUE_PINS) {
      if (pin.caseId === testCase.id) {
        expect(result.supportedTargetOutputs).toContain(pin.metric);
      }
    }
  });

  it("does not reopen wall routes that still need grouped topology physical inputs", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(result.airborneBasis?.origin).toBe("needs_input");
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["sideALeafGroup", "internalLeafGroup", "supportTopology"])
    );
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTION_STATUS).toBe(
      "post_v1_wall_lined_massive_rw_companion_gate_aa_landed_selected_next_numeric_coverage_gap_gate_ab"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ab_plan"
    );
    expect(POST_V1_WALL_LINED_MASSIVE_RW_COMPANION_GATE_AA_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ab-contract.test.ts"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_LANDED_GATE).toBe(
      "post_v1_wall_screening_rw_field_companion_gate_ab_plan"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTION_STATUS).toBe(
      "post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ac_plan"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ac-contract.test.ts"
    );
    expect(POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AC"
    );
    expect(POST_V1_GATE_AB_WALL_SCREENING_RW_OUTPUTS).toEqual(["Rw"]);

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-screening-rw-field-companion-gate-ab-contract.test.ts");
  });
});
