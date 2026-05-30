import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import { COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-company-internal-heavy-composite-wall";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_W_HEAVY_COMPOSITE_RW_FIELD_VALUE_PINS,
  POST_V1_GATE_W_LOCAL_SUBSTITUTION_RW_FIELD_VALUE_PINS,
  POST_V1_GATE_W_WALL_RW_FIELD_CORE_OUTPUTS,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_LANDED_GATE,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_ACTION,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_FILE,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_LABEL,
  POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTION_STATUS
} from "./post-v1-wall-field-rw-companion-gate-w";
import {
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_ACTION,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_FILE,
  POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTION_STATUS
} from "./post-v1-wall-rw-field-output-gate-v";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const RW_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_ONLY_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const LOCAL_ROCKWOOL_MLV_PLASTER_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LOCAL_FIELD_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
} as const satisfies AirborneContext;

function heavyCompositeCase() {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find(
    (entry) => entry.id === "wall-heavy-composite-hint-suppression"
  );

  if (!testCase) {
    throw new Error("wall-heavy-composite-hint-suppression generated case is missing");
  }

  return testCase;
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall field Rw companion Gate W", () => {
  it("keeps requested Rw live for complete heavy-composite wall field requests", () => {
    const testCase = heavyCompositeCase();
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: RW_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 61,
      estimatedRwDb: 60,
      estimatedRwPrimeDb: 60
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_W_WALL_RW_FIELD_CORE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD}`
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: [...POST_V1_GATE_W_HEAVY_COMPOSITE_RW_FIELD_VALUE_PINS]
    });
  });

  it("keeps requested Rw live for complete local-substitution triple-leaf field requests", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: RW_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwDb: 51,
      estimatedRwPrimeDb: 51
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_W_WALL_RW_FIELD_CORE_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
    expect(result.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD}`
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId:
        "candidate_broad_accuracy_wall_triple_leaf_local_substitution_field_context_family_physics_prediction",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: [...POST_V1_GATE_W_LOCAL_SUBSTITUTION_RW_FIELD_VALUE_PINS]
    });
  });

  it("does not widen heavy-composite or local-substitution field-only requests into Rw publication", () => {
    const testCase = heavyCompositeCase();
    const heavy = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: FIELD_ONLY_OUTPUTS
    });
    const local = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_ONLY_OUTPUTS
    });

    expect(heavy.supportedTargetOutputs).toEqual([...FIELD_ONLY_OUTPUTS]);
    expect(heavy.unsupportedTargetOutputs).toEqual([]);
    expect(local.supportedTargetOutputs).toEqual([...FIELD_ONLY_OUTPUTS]);
    expect(local.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the active path on numeric calculator coverage", () => {
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTION_STATUS).toBe(
      "post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_w_plan"
    );
    expect(POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_LANDED_GATE).toBe(
      "post_v1_wall_field_rw_companion_gate_w_plan"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTION_STATUS).toBe(
      "post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_x_plan"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-x-contract.test.ts"
    );
    expect(POST_V1_WALL_FIELD_RW_COMPANION_GATE_W_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate X"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-field-rw-companion-gate-w-contract.test.ts");
  });
});
