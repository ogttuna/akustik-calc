import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_LANDED_GATE,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTION_STATUS,
  POST_V1_GATE_X_FLOOR_FAMILY_SPECTRUM_OUTPUTS,
  POST_V1_GATE_X_HEAVY_CONCRETE_SPECTRUM_VALUE_PINS,
  POST_V1_GATE_X_STEEL_FAMILY_SPECTRUM_VALUE_PINS
} from "./post-v1-floor-airborne-spectrum-companion-gate-x";
import {
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_FILE,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTION_STATUS
} from "./post-v1-wall-field-rw-companion-gate-w";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor airborne spectrum companion Gate X", () => {
  it("keeps calculated STC, C, and Ctr live on complete heavy-concrete floor family field requests", () => {
    const testCase = generatedCase("floor-heavy-concrete");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.9,
      estimatedCtrDb: -5.6,
      estimatedStc: 58
    });
    expect(result.supportedTargetOutputs).toEqual([...FLOOR_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      Rw: 58
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    expect(result.warnings.join("\n")).not.toContain(
      "Acoustic Calculator Answer Engine V1 owner audit parked ownerless supported outputs"
    );
    for (const pin of POST_V1_GATE_X_HEAVY_CONCRETE_SPECTRUM_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("keeps calculated STC, C, and Ctr live on complete lightweight-steel family field requests", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.9,
      estimatedCtrDb: -5.6,
      estimatedStc: 70
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      ...POST_V1_GATE_X_FLOOR_FAMILY_SPECTRUM_OUTPUTS,
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.floorSystemRatings).toMatchObject({
      basis: "predictor_floor_system_family_archetype_estimate",
      Rw: 60
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    expect(result.warnings.join("\n")).not.toContain(
      "Acoustic Calculator Answer Engine V1 owner audit parked ownerless supported outputs"
    );
    for (const pin of POST_V1_GATE_X_STEEL_FAMILY_SPECTRUM_VALUE_PINS) {
      expect(result.supportedTargetOutputs).toContain(pin.metric);
    }
  });

  it("does not promote STC, C, or Ctr from exact measured floor rows unless the source owns them", () => {
    const openBox = generatedCase("floor-open-box-exact");
    const clt = generatedCase("floor-clt-dry");
    const openBoxResult = calculateAssembly(openBox.rows, {
      ...openBox.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });
    const cltResult = calculateAssembly(clt.rows, {
      ...clt.fieldOptions,
      targetOutputs: FLOOR_MIXED_OUTPUTS
    });

    expect(openBoxResult.floorSystemRatings?.basis).toBe("open_measured_floor_system_exact_match");
    expect(openBoxResult.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(openBoxResult.unsupportedTargetOutputs).toEqual(["STC", "Ctr", "DeltaLw"]);

    expect(cltResult.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(cltResult.supportedTargetOutputs).toEqual([
      "Rw",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(cltResult.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr", "DeltaLw"]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTION_STATUS).toBe(
      "post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_x_plan"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-x-contract.test.ts"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_LANDED_GATE).toBe(
      "post_v1_floor_airborne_spectrum_companion_gate_x_plan"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTION_STATUS).toBe(
      "post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_y_plan"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-y-contract.test.ts"
    );
    expect(POST_V1_FLOOR_AIRBORNE_SPECTRUM_COMPANION_GATE_X_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate Y"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-airborne-spectrum-companion-gate-x-contract.test.ts");
  });
});
