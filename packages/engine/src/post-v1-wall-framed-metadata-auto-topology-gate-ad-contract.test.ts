import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTION_STATUS
} from "./post-v1-floor-field-a-weighted-surface-gate-ac";
import {
  POST_V1_GATE_AD_WALL_FRAMED_FIELD_OUTPUTS,
  POST_V1_GATE_AD_WALL_FRAMED_VALUE_PINS,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_LANDED_GATE,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTION_STATUS
} from "./post-v1-wall-framed-metadata-auto-topology-gate-ad";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FRAMED_FIELD_OUTPUTS = [
  ...POST_V1_GATE_AD_WALL_FRAMED_FIELD_OUTPUTS
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

describe("post-V1 wall framed metadata Rw companion Gate AD", () => {
  it("keeps explicit LSF framed metadata Rw live without moving defended field values", () => {
    const testCase = generatedCase("wall-lsf-knauf");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FRAMED_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.4,
      estimatedCtrDb: -6.4,
      estimatedDnADb: 49.6,
      estimatedDnTADb: 51.1,
      estimatedDnTwDb: 52,
      estimatedDnWDb: 51,
      estimatedRwDb: 51,
      estimatedRwPrimeDb: 51,
      estimatedStc: 51
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_FRAMED_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "stud_wall_system",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      "generic.required_input_owner.needs_input_boundary"
    );
  });

  it("keeps explicit timber-stud framed metadata Rw live without moving defended field values", () => {
    const testCase = generatedCase("wall-timber-stud");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_FRAMED_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 0.4,
      estimatedCtrDb: -4.3,
      estimatedDnADb: 42.4,
      estimatedDnTADb: 43.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 42,
      estimatedRwDb: 42,
      estimatedRwPrimeDb: 42,
      estimatedStc: 42
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_FRAMED_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    for (const pin of POST_V1_GATE_AD_WALL_FRAMED_VALUE_PINS) {
      if (pin.caseId === testCase.id) {
        expect(result.supportedTargetOutputs).toContain(pin.metric);
      }
    }
  });

  it("does not guess framed support metadata or grouped triple-leaf topology", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const noFramedMetadata = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      airborneContext: {
        ...lsf.fieldOptions.airborneContext,
        connectionType: undefined,
        studType: undefined
      },
      targetOutputs: WALL_FRAMED_FIELD_OUTPUTS
    });
    const heldAac = generatedCase("wall-held-aac");
    const heldAacResult = calculateAssembly(heldAac.rows, {
      ...heldAac.fieldOptions,
      targetOutputs: WALL_FRAMED_FIELD_OUTPUTS
    });

    expect(noFramedMetadata.airborneBasis?.origin).toBe("needs_input");
    expect(noFramedMetadata.unsupportedTargetOutputs).toContain("Rw");
    expect(noFramedMetadata.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });
    expect(heldAacResult.airborneBasis?.origin).toBe("needs_input");
    expect(heldAacResult.unsupportedTargetOutputs).toEqual([...WALL_FRAMED_FIELD_OUTPUTS]);
    expect(heldAacResult.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["sideALeafGroup", "internalLeafGroup", "supportTopology"])
    );
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTION_STATUS).toBe(
      "post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ad_plan"
    );
    expect(POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ad-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_LANDED_GATE).toBe(
      "post_v1_wall_framed_metadata_auto_topology_gate_ad_plan"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ae_plan"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ae-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AE"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-framed-metadata-auto-topology-gate-ad-contract.test.ts");
  });
});
