import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_V_DOUBLE_LEAF_RW_FIELD_VALUE_PINS,
  POST_V1_GATE_V_MULTILEAF_RW_FIELD_VALUE_PINS,
  POST_V1_GATE_V_WALL_RW_FIELD_CORE_OUTPUTS,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_LANDED_GATE,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_ACTION,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_FILE,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_LABEL,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTION_STATUS
} from "./post-v1-wall-rw-field-output-gate-v";
import {
  POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_FILE,
  POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTION_STATUS
} from "./post-v1-wall-multileaf-mixed-lab-field-output-gate-u";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const RW_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_ONLY_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const ABSORBED_DOUBLE_LEAF_FLAT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FULL_FILL_FLAT_MULTICAVITY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DOUBLE_LEAF_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const MULTILEAF_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall Rw plus field output Gate V", () => {
  it("keeps requested Rw live for complete double-leaf field requests even without STC or spectrum companions", () => {
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: DOUBLE_LEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: RW_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 42,
      estimatedRwDb: 39,
      estimatedRwPrimeDb: 39
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_V_WALL_RW_FIELD_CORE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD}`
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: [...POST_V1_GATE_V_DOUBLE_LEAF_RW_FIELD_VALUE_PINS]
    });
  });

  it("keeps requested Rw live for complete multileaf field requests even without STC or spectrum companions", () => {
    const result = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: MULTILEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: RW_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwDb: 50,
      estimatedRwPrimeDb: 50
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_V_WALL_RW_FIELD_CORE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining(["base lab-family method remains triple_leaf_two_cavity_frequency_solver"])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: [...POST_V1_GATE_V_MULTILEAF_RW_FIELD_VALUE_PINS]
    });
  });

  it("does not widen field-only requests into Rw publication", () => {
    const doubleLeaf = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: DOUBLE_LEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ONLY_OUTPUTS
    });
    const multileaf = calculateAssembly(FULL_FILL_FLAT_MULTICAVITY_STACK, {
      airborneContext: MULTILEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ONLY_OUTPUTS
    });

    expect(doubleLeaf.supportedTargetOutputs).toEqual([...FIELD_ONLY_OUTPUTS]);
    expect(doubleLeaf.unsupportedTargetOutputs).toEqual([]);
    expect(multileaf.supportedTargetOutputs).toEqual([...FIELD_ONLY_OUTPUTS]);
    expect(multileaf.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTION_STATUS).toBe(
      "post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v"
    );
    expect(POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_v_plan"
    );
    expect(POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-v-contract.test.ts"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_LANDED_GATE).toBe(
      "post_v1_wall_rw_field_output_gate_v_plan"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTION_STATUS).toBe(
      "post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_w_plan"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate W"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-rw-field-output-gate-v-contract.test.ts");
  });
});
