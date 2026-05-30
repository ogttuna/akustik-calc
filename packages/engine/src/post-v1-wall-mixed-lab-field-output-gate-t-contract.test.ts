import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_FIELD_VALUE_PINS,
  POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_SUPPORTED_OUTPUTS,
  POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_LANDED_GATE,
  POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_FILE,
  POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_LABEL,
  POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTION_STATUS
} from "./post-v1-wall-mixed-lab-field-output-gate-t";
import {
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_FILE,
  POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTION_STATUS
} from "./post-v1-wall-double-leaf-field-auto-topology-gate-s";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MIXED_LAB_FIELD_OUTPUTS = [
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

const FIELD_ONLY_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const ABSORBED_DOUBLE_LEAF_FLAT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FIELD_CONTEXT = {
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall mixed lab/field output Gate T", () => {
  it("keeps calculable Rw live when a complete double-leaf field request also asks for lab spectrum outputs", () => {
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_LAB_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -5.7,
      estimatedDnADb: 38.5,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwDb: 39,
      estimatedRwPrimeDb: 39,
      estimatedStc: 39
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
  });

  it("keeps the selected resolver trace honest on the field adapter while publishing the separate lab companion", () => {
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_LAB_FIELD_OUTPUTS
    });

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
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      valuePins: [...POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_FIELD_VALUE_PINS]
    });
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toEqual(
      expect.arrayContaining(["Rw", "STC", "C", "Ctr"])
    );
    expect(result.layerCombinationResolverTrace?.valuePins).not.toEqual(
      expect.arrayContaining([{ metric: "Rw", value: 39 }])
    );
  });

  it("does not widen field-only requests into lab companion output publication", () => {
    const result = calculateAssembly(ABSORBED_DOUBLE_LEAF_FLAT_STACK, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ONLY_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...FIELD_ONLY_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: [...FIELD_ONLY_OUTPUTS],
      valuePins: [...POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_FIELD_VALUE_PINS]
    });
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTION_STATUS).toBe(
      "post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_t_plan"
    );
    expect(POST_V1_WALL_DOUBLE_LEAF_FIELD_AUTO_TOPOLOGY_GATE_S_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-t-contract.test.ts"
    );
    expect(POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_LANDED_GATE).toBe(
      "post_v1_wall_mixed_lab_field_output_gate_t_plan"
    );
    expect(POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTION_STATUS).toBe(
      "post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u"
    );
    expect(POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_u_plan"
    );
    expect(POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-u-contract.test.ts"
    );
    expect(POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate U"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-mixed-lab-field-output-gate-t-contract.test.ts"
    );
  });
});
