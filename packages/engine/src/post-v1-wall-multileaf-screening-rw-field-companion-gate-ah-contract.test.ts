import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ENGINE_MIXED_GENERATED_CASES } from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTION_STATUS
} from "./post-v1-wall-heavy-composite-building-lab-spectrum-companion-gate-ag";
import {
  POST_V1_GATE_AH_WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_LANDED_GATE,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_FILE,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_LABEL,
  POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTION_STATUS
} from "./post-v1-wall-multileaf-screening-rw-field-companion-gate-ah";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS = [
  ...POST_V1_GATE_AH_WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

function generatedCase(id: string) {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);

  if (!testCase) {
    throw new Error(`${id} generated case is missing`);
  }

  return testCase;
}

function supportBackedFieldContext(context: AirborneContext | null | undefined): AirborneContext {
  return {
    ...(context ?? {}),
    contextMode: "field_between_rooms",
    wallTopology: {
      ...context?.wallTopology,
      supportTopology: "independent_frames"
    }
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall multileaf screening Rw field companion Gate AH", () => {
  it("keeps support-backed multileaf Rw live beside the already supported field and spectrum outputs", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      airborneContext: supportBackedFieldContext(testCase.fieldOptions.airborneContext),
      targetOutputs: WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.9,
      estimatedCtrDb: -8,
      estimatedDnADb: 58.1,
      estimatedDnTADb: 59.6,
      estimatedDnTwDb: 61,
      estimatedDnWDb: 60,
      estimatedRwDb: 60,
      estimatedRwPrimeDb: 60,
      estimatedStc: 60
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 9,
      method: "gate_i_airborne_field_apparent_context_adapter_runtime",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toContain(
      "base lab-family method remains gate_ae_flat_multicavity_two_cavity_frequency_solver"
    );
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: "gate_ae_flat_multicavity_two_cavity_solver_broadening_family_physics_prediction",
      visibleLeafCount: 3
    });
    expect(result.supportedTargetOutputs).toEqual([...WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Rw");
  });

  it("does not guess multileaf support topology when the physical support owner is missing", () => {
    const testCase = generatedCase("wall-held-aac");
    const result = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      origin: "needs_input",
      missingPhysicalInputs: expect.arrayContaining([
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "supportTopology"
      ])
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...WALL_MULTILEAF_SCREENING_FIELD_OUTPUTS]);
  });

  it("does not reopen floor bound C or exact floor STC/Ctr aliases while adding the wall companion", () => {
    const bound = generatedCase("floor-open-web-bound");
    const exact = generatedCase("floor-clt-dry");
    const boundResult = calculateAssembly(bound.rows, {
      ...bound.fieldOptions,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });
    const exactResult = calculateAssembly(exact.rows, {
      ...exact.fieldOptions,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });

    expect(boundResult.floorSystemRatings?.basis).toBe("official_floor_system_bound_support");
    expect(boundResult.unsupportedTargetOutputs).toEqual(["C", "DeltaLw"]);

    expect(exactResult.floorSystemRatings?.basis).toBe("official_floor_system_exact_match");
    expect(exactResult.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr", "DeltaLw"]);
  });

  it("keeps the handoff on numeric coverage Gate AI", () => {
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ah_plan"
    );
    expect(POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ah-contract.test.ts"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_LANDED_GATE).toBe(
      "post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_plan"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTION_STATUS).toBe(
      "post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_landed_selected_next_numeric_coverage_gap_gate_ai"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_ACTION).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ai_plan"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ai-contract.test.ts"
    );
    expect(POST_V1_WALL_MULTILEAF_SCREENING_RW_FIELD_COMPANION_GATE_AH_SELECTED_NEXT_LABEL).toBe(
      "post-V1 next numeric coverage gap Gate AI"
    );

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-multileaf-screening-rw-field-companion-gate-ah-contract.test.ts"
    );
  });
});
