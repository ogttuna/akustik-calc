import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_FILE,
  POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTION_STATUS
} from "./post-v1-wall-framed-lab-spectrum-companion-gate-ae";
import {
  POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_BLOCKED_FIELD_BUILDING_OUTPUTS,
  POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_OUTPUTS,
  POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_VALUE_PINS,
  POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_OUTPUTS,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_LANDED_GATE,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_ACTION,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_FILE,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_LABEL,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTION_STATUS
} from "./post-v1-wall-source-absent-building-lab-spectrum-companion-gate-af";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_SOURCE_ABSENT_BUILDING_OUTPUTS = [
  ...POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const SOURCE_ABSENT_BUILDING_CASES = [
  {
    caseId: "wall-screening-concrete",
    detectedFamily: "lined_massive_wall",
    metrics: { estimatedCDb: -1.6, estimatedCtrDb: -6.3, estimatedRwDb: 55, estimatedStc: 55 },
    strategy: "lined_massive_blend"
  },
  {
    caseId: "wall-masonry-brick",
    detectedFamily: "masonry_nonhomogeneous",
    metrics: { estimatedCDb: -0.2, estimatedCtrDb: -4.7, estimatedRwDb: 40, estimatedStc: 40 },
    strategy: "masonry_nonhomogeneous_blend+porotherm_plastered_calibration"
  },
  {
    caseId: "wall-clt-local",
    detectedFamily: "laminated_single_leaf",
    metrics: { estimatedCDb: -1.8, estimatedCtrDb: -7.6, estimatedRwDb: 41, estimatedStc: 41 },
    strategy: "laminated_leaf_sharp_delegate"
  }
] as const;

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function buildingContext(
  context: AirborneContext | undefined,
  patch: Partial<AirborneContext> = {}
): AirborneContext {
  return {
    ...context,
    contextMode: "building_prediction",
    ...patch
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall source-absent building lab-spectrum companion Gate AF", () => {
  it("opens calculated source-absent building lab spectrum while keeping field and building outputs parked", () => {
    for (const expected of SOURCE_ABSENT_BUILDING_CASES) {
      const testCase = generatedCase(expected.caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
        targetOutputs: WALL_SOURCE_ABSENT_BUILDING_OUTPUTS
      });

      expect(result.metrics).toMatchObject(expected.metrics);
      expect(result.supportedTargetOutputs).toEqual([
        ...POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_OUTPUTS
      ]);
      expect(result.unsupportedTargetOutputs).toEqual([
        ...POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_BLOCKED_FIELD_BUILDING_OUTPUTS
      ]);
      expect(result.airborneBasis?.origin).toBe("needs_input");
      expect(result.dynamicAirborneTrace).toMatchObject({
        detectedFamily: expected.detectedFamily,
        strategy: expected.strategy
      });
      expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: STC");
      expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: C");
      expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Ctr");
    }

    for (const pin of POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_VALUE_PINS) {
      const testCase = generatedCase(pin.caseId);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
        targetOutputs: WALL_SOURCE_ABSENT_BUILDING_OUTPUTS
      });

      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("does not reopen grouped multileaf building routes from parked diagnostic values", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_SOURCE_ABSENT_BUILDING_OUTPUTS
    });

    expect(result.airborneBasis?.origin).toBe("needs_input");
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_SOURCE_ABSENT_BUILDING_OUTPUTS]);
  });

  it("does not reopen opening or leak building requests without their dedicated owner inputs", () => {
    const testCase = generatedCase("wall-masonry-brick");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: buildingContext(testCase.fieldOptions.airborneContext, {
        openingLeakFieldBuildingAdapterBoundary: true
      }),
      targetOutputs: WALL_SOURCE_ABSENT_BUILDING_OUTPUTS
    });

    expect(result.airborneBasis?.origin).toBe("needs_input");
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_SOURCE_ABSENT_BUILDING_OUTPUTS]);
  });

  it("keeps the handoff on numeric coverage Gate AG", () => {
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTION_STATUS).toBe(
      "post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_af_plan"
    );
    expect(POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-af-contract.test.ts"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_LANDED_GATE).toBe(
      "post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_plan"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTION_STATUS).toBe(
      "post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ag_plan"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ag-contract.test.ts"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AG"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-source-absent-building-lab-spectrum-companion-gate-af-contract.test.ts"
    );
  });
});
