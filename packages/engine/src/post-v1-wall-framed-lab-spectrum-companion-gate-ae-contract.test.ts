import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTION_STATUS
} from "./post-v1-wall-framed-metadata-auto-topology-gate-ad";
import {
  POST_V1_GATE_AE_WALL_FRAMED_BLOCKED_FIELD_BUILDING_OUTPUTS,
  POST_V1_GATE_AE_WALL_FRAMED_BUILDING_OUTPUTS,
  POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_OUTPUTS,
  POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_VALUE_PINS,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_LANDED_GATE,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTION_STATUS
} from "./post-v1-wall-framed-lab-spectrum-companion-gate-ae";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FRAMED_BUILDING_OUTPUTS = [
  ...POST_V1_GATE_AE_WALL_FRAMED_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function buildingContext(context: AirborneContext | undefined): AirborneContext {
  return {
    ...context,
    contextMode: "building_prediction"
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall framed lab-spectrum companion Gate AE", () => {
  it("opens calculated LSF framed lab spectrum while keeping building outputs parked", () => {
    const testCase = generatedCase("wall-lsf-knauf");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_FRAMED_BUILDING_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.4,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 51,
      estimatedStc: 51
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AE_WALL_FRAMED_BLOCKED_FIELD_BUILDING_OUTPUTS
    ]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: STC");
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: C");
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Ctr");
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "stud_wall_system",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });
  });

  it("opens calculated timber-stud lab spectrum while keeping building outputs parked", () => {
    const testCase = generatedCase("wall-timber-stud");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_FRAMED_BUILDING_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 0.4,
      estimatedCtrDb: -4.3,
      estimatedRwDb: 42,
      estimatedStc: 42
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AE_WALL_FRAMED_BLOCKED_FIELD_BUILDING_OUTPUTS
    ]);

    for (const pin of POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_VALUE_PINS) {
      if (pin.caseId === testCase.id) {
        expect(result.supportedTargetOutputs).toContain(pin.metric);
      }
    }
  });

  it("does not open lab-spectrum companions without explicit framed metadata or grouped topology", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const noFramedMetadata = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      airborneContext: {
        ...buildingContext(lsf.fieldOptions.airborneContext),
        connectionType: undefined,
        studType: undefined
      },
      targetOutputs: WALL_FRAMED_BUILDING_OUTPUTS
    });
    const heldAac = generatedCase("wall-held-aac");
    const heldAacResult = calculateAssembly(heldAac.rows, {
      ...heldAac.fieldOptions,
      airborneContext: buildingContext(heldAac.fieldOptions.airborneContext),
      targetOutputs: WALL_FRAMED_BUILDING_OUTPUTS
    });

    expect(noFramedMetadata.airborneBasis?.origin).toBe("needs_input");
    expect(noFramedMetadata.supportedTargetOutputs).toEqual([]);
    expect(noFramedMetadata.unsupportedTargetOutputs).toEqual([...WALL_FRAMED_BUILDING_OUTPUTS]);
    expect(heldAacResult.airborneBasis?.origin).toBe("needs_input");
    expect(heldAacResult.supportedTargetOutputs).toEqual([]);
    expect(heldAacResult.unsupportedTargetOutputs).toEqual([...WALL_FRAMED_BUILDING_OUTPUTS]);
  });

  it("keeps the handoff on numeric coverage Gate AF", () => {
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ae_plan"
    );
    expect(POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ae-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_LANDED_GATE).toBe(
      "post_v1_wall_framed_lab_spectrum_companion_gate_ae_plan"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_af_plan"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-af-contract.test.ts"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AF"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-framed-lab-spectrum-companion-gate-ae-contract.test.ts");
  });
});
