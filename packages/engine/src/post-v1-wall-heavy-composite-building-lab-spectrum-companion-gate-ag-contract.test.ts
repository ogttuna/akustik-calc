import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_ACTION,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_FILE,
  POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTION_STATUS
} from "./post-v1-wall-source-absent-building-lab-spectrum-companion-gate-af";
import {
  POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BLOCKED_FIELD_BUILDING_OUTPUTS,
  POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_OUTPUTS,
  POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_VALUE_PINS,
  POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_MISSING_INPUTS,
  POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_LANDED_GATE,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_LABEL,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTION_STATUS
} from "./post-v1-wall-heavy-composite-building-lab-spectrum-companion-gate-ag";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS = [
  ...POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function buildingContext(
  context: AirborneContext | null | undefined,
  patch: Partial<AirborneContext> = {}
): AirborneContext {
  return {
    ...(context ?? {}),
    contextMode: "building_prediction",
    ...patch
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall heavy-composite building lab-spectrum companion Gate AG", () => {
  it("opens calculated heavy-composite building lab spectrum while keeping field and building outputs parked", () => {
    const testCase = generatedCase("wall-heavy-composite-hint-suppression");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: buildingContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.4,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 60,
      estimatedStc: 60
    });
    expect(result.supportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_OUTPUTS
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([
      ...POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BLOCKED_FIELD_BUILDING_OUTPUTS
    ]);
    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: [...POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_MISSING_INPUTS],
      origin: "needs_input"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      cavityCount: 1,
      detectedFamily: "double_leaf",
      selectedMethod: "mass_law",
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap",
      visibleLeafCount: 2
    });
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: STC");
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: C");
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Ctr");

    for (const pin of POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
      if (pin.metric === "Rw") {
        expect(result.metrics.estimatedRwDb).toBe(pin.value);
      }
      if (pin.metric === "STC") {
        expect(result.metrics.estimatedStc).toBe(pin.value);
      }
      if (pin.metric === "C") {
        expect(result.metrics.estimatedCDb).toBe(pin.value);
      }
      if (pin.metric === "Ctr") {
        expect(result.metrics.estimatedCtrDb).toBe(pin.value);
      }
    }
  });

  it("does not reopen grouped multileaf or opening/leak building routes from parked diagnostic values", () => {
    const groupedAac = generatedCase("wall-held-aac");
    const groupedAacResult = calculateAssembly(groupedAac.rows, {
      ...groupedAac.fieldOptions,
      airborneContext: buildingContext(groupedAac.fieldOptions.airborneContext),
      targetOutputs: WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS
    });

    expect(groupedAacResult.airborneBasis?.origin).toBe("needs_input");
    expect(groupedAacResult.supportedTargetOutputs).toEqual([]);
    expect(groupedAacResult.unsupportedTargetOutputs).toEqual([...WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS]);

    const heavyComposite = generatedCase("wall-heavy-composite-hint-suppression");
    const openingLeakResult = calculateAssembly(heavyComposite.rows, {
      ...heavyComposite.fieldOptions,
      airborneContext: buildingContext(heavyComposite.fieldOptions.airborneContext, {
        openingLeakFieldBuildingAdapterBoundary: true
      }),
      targetOutputs: WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS
    });

    expect(openingLeakResult.airborneBasis?.origin).toBe("needs_input");
    expect(openingLeakResult.supportedTargetOutputs).toEqual([]);
    expect(openingLeakResult.unsupportedTargetOutputs).toEqual([...WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS]);
  });

  it("keeps the handoff on numeric coverage Gate AH", () => {
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTION_STATUS).toBe(
      "post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ag_plan"
    );
    expect(POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ag-contract.test.ts"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_LANDED_GATE).toBe(
      "post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_plan"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ah_plan"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ah-contract.test.ts"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AH"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-heavy-composite-building-lab-spectrum-companion-gate-ag-contract.test.ts"
    );
  });
});
